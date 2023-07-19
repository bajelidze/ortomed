import { Knex } from 'knex';
import { DateTime, Duration, Interval } from 'luxon';
import log from '@/common/logger';
import time from '@/common/time';
import { Doctor, DoctorDao } from '@/modules/actors/doctor';
import { Patient } from '@/modules/actors/patient';
import { Availability } from '@/modules/actors/availability';
import { Holiday } from '@/modules/actors/holiday';
import { Course, CourseDao } from '@/modules/course/course';
import { CourseActivity, CourseActivityDao } from '@/modules/course/courseActivity';
import { Session, SessionDao } from '@/modules/scheduler/session';
import { Activity, ActivityDao } from '../course/activity';
import errs from '@/common/errors';

type WeekdayMap = {
  [key: number]: time.IntervalD[]
}

type Cache<T> = {
  [id: number]: T
}

type CapacityMap = {
  [capacity: number]: Interval[]
}

const oneDay = Duration.fromObject({day: 1});

export class Scheduler {
  db?: Knex;

  doctorDao: DoctorDao;
  courseDao: CourseDao;
  sessionDao: SessionDao;
  courseActivityDao: CourseActivityDao;
  activityDao: ActivityDao;

  // Caches to optimize DB access.
  // This assumes that no concurrent
  // schedulings are possible.
  activityCache: Cache<Activity> = {};
  courseActivityCache: Cache<CourseActivity> = {};
  availabilityCache: Cache<Availability[]> = {};

  constructor(db: Knex) {
    this.db = db;
    this.doctorDao = new DoctorDao(db);
    this.courseDao = new CourseDao(db);
    this.sessionDao = new SessionDao(db);
    this.courseActivityDao = new CourseActivityDao(db);
    this.activityDao = new ActivityDao(db);

    log.info('Constructed new Scheduler');
  }

  async scheduleCourse(
    doctor: Doctor,
    patient: Patient,
    course: Course,
    startTime: DateTime,
  ): Promise<Session[]> {
    this.resetCache();

    const newSessions: Session[] = [];

    const courseActivities = await course.listActivities();

    for (const courseActivity of courseActivities) {
      const session = await this.scheduleCourseActivity(
        doctor, patient, courseActivity, startTime,
      );

      if (session.interval?.end == null) {
        throw Error('the scheduled session interval end is null');
      }

      // The next course activity needs to be after the previous one plus
      // the pause defined by the course activity itself.
      startTime = session.interval?.end.plus(courseActivity.pause);

      newSessions.push(session);
    }

    return newSessions;
  }

  async commitSessions(...sessions: Session[]): Promise<void> {
    for (const session of sessions) {
      await session.commit();
    }
  }

  private resetCache() {
    this.activityCache = {};
    this.courseActivityCache = {};
    this.availabilityCache = {};
  }

  private async scheduleCourseActivity(
    doctor: Doctor,
    patient: Patient,
    courseActivity: CourseActivity,
    startTime: DateTime,
    lookAhead?: Duration,
  ): Promise<Session> {
    if (courseActivity.activityId == undefined) {
      throw Error(`activityId in courseActivity ${courseActivity.id} is undefined`);
    }

    const activity = await this.activityDao.getById(courseActivity.activityId);

    const blockset = await this.getBlockset(doctor, activity, startTime, lookAhead);

    if (blockset.length < 2) {
      let start = startTime;

      if (blockset.length == 1) {
        if (blockset[0].end == null) {
          throw Error('blockset interval is null');
        }

        start = blockset[0].end;
      }

      const interval = Interval.fromDateTimes(
        start,
        start.plus(activity.duration),
      );
      return Session.new(doctor, patient, courseActivity, interval);
    }

    for (let i = 1; i < blockset.length; i++) {
      const curr = blockset[i];
      const next = blockset[i + 1];

      if (next.start == null) {
        throw Error(`blockset start is null, at idx: ${i}`);
      } else if (curr.end == null) {
        throw Error(`blockset end is null, at idx: ${i}`);
      }

      if (curr.end?.diff(next.start).toMillis() > activity.duration.toMillis()) {
        const interval = Interval.fromDateTimes(
          curr.end,
          curr.end.plus(activity.duration),
        );

        return Session.new(doctor, patient, courseActivity, interval);
      }
    }

    throw new errs.ErrNotFound('could not find a free interval for the new session in the given blockset');
  }

  private async getBlockset(
    doctor: Doctor,
    activity: Activity,
    startTime: DateTime,
    lookAhead?: Duration,
  ): Promise<Interval[]> {
    let blockset = await this.getDoctorBlockset(doctor, startTime, lookAhead);
    const sessionBlockset = await this.getSessionBlockset(doctor, activity, startTime);

    blockset.push(...sessionBlockset);

    blockset = Interval.merge(blockset).sort((a, b) => {
      if (a.start == undefined || b.start == undefined) {
        throw Error('start is undefined');
      }

      return a.start?.toUnixInteger() - b.start?.toUnixInteger();
    });

    return blockset;
  }

  private async getSessionBlockset(doctor: Doctor, inputActivity: Activity, startTime: DateTime): Promise<Interval[]> {
    if (doctor.id == undefined) {
      throw Error('doctor.id undefined');
    }

    const sessions = await this.sessionDao.listByDoctorId(doctor.id, startTime);

    // Get all the course activities for the corresponding sessions.
    const courseActivityMap: Cache<CourseActivity> = {};
    const capMap: CapacityMap = {};

    const blockset: Interval[] = [];

    for (const sess of sessions) {
      if (sess.id == undefined) {
        throw Error('session.id undefined');
      } else if (sess.interval == undefined) {
        throw Error('session.interval undefined');
      } else if (sess.interval.start == null) {
        throw Error('session.interval.start null');
      } else if (sess.courseActivityId == undefined) {
        throw Error(`courseActivityId undefined in session ${sess.id}`);
      }

      if (this.courseActivityCache[sess.courseActivityId] == undefined) {
        this.courseActivityCache[sess.courseActivityId] = await this.courseActivityDao.getById(sess.courseActivityId);
      }

      const courseActivity = this.courseActivityCache[sess.courseActivityId];

      if (courseActivity.activityId == undefined) {
        throw Error(`courseActivity with id ${courseActivity.id} has activityId undefined`);
      }

      courseActivityMap[sess.id] = courseActivity;

      // Get corresponding activity.
      if (this.activityCache[courseActivity.activityId] == undefined) {
        this.activityCache[courseActivity.activityId] = await this.activityDao.getById(courseActivity.activityId);
      }

      const activity = this.activityCache[courseActivity.activityId];

      // If one of the activities is not flexible, then they must be the same.
      // Otherwise, the entire day is getting blocked.
      if ((!activity.flexible || !inputActivity.flexible) && activity.name != inputActivity.name) {
        const day = sess.interval.start.startOf('day');

        blockset.push(Interval.fromDateTimes(
          day, day.plus(oneDay),
        ));

        continue;
      }

      // Join every session into a map according to activity capacity.
      if (capMap[activity.capacity] == undefined) {
        capMap[activity.capacity] = [];
      }

      capMap[activity.capacity].push(sess.interval);
    }

    const reduced = Scheduler.reduceCapMap(capMap);

    blockset.push(...reduced);

    return Interval.merge(blockset);
  }

  // reduceCapMap reduces the CapacityMap returning a set of intervals
  // depending on the allowed overlap count (capacity).
  private static reduceCapMap(capMap: CapacityMap): Interval[] {
    const result: Interval[] = [];

    for (const capacityStr in capMap) {
      const capacity = Number(capacityStr);

      let intervals = capMap[capacity];

      intervals.sort((a, b) => {
        if (a.start == null || b.start == null) {
          throw Error('interval start null');
        }

        return a.start.toUnixInteger() - b.start.toUnixInteger();
      });

      for (let i = 1; i < capacity; i++) {
        intervals = time.getOverlaps(...intervals);
      }

      result.push(...intervals);
    }

    return Interval.merge(result);
  }

  private async getDoctorBlockset(doctor: Doctor, startTime: DateTime, lookAhead?: Duration): Promise<Interval[]> {
    if (doctor.id == undefined) {
      throw Error('doctor.id undefined');
    }

    if (this.availabilityCache[doctor.id] == undefined) {
      this.availabilityCache[doctor.id] = await doctor.listAvailabilities();
    }

    const avails = this.availabilityCache[doctor.id];
    const weekdayMap = Scheduler.getWeekdayMap(...avails);

    const scheduleIntervals = Doctor.scheduleToIntervals(doctor.schedule, startTime, lookAhead);

    // Schedule blockset.
    const blockset = Scheduler.getAvailabilityBlockset(scheduleIntervals, weekdayMap);

    // Holiday blockset.
    const holidays = Holiday.holidaysToIntervals(...await doctor.listHolidays());
    blockset.push(...holidays);

    return blockset;
  }

  static getWeekdayMap(...availabilities: Availability[]): WeekdayMap {
    const weekdayMap: WeekdayMap = {};

    for (const av of availabilities) {
      if (av.weekday == undefined) {
        throw Error(`weekday is undefined for availability with id ${av.id}`);
      } else if (av.interval?.st == undefined) {
        throw Error(`startTime is undefined for availability with id ${av.id}`);
      } else if (av.interval?.et == undefined) {
        throw Error(`startTime is undefined for availability with id ${av.id}`);
      }

      const weekdayStr = av.weekday.toString();
      const weekday = time.weekdayMap.get(weekdayStr);

      if (weekday == undefined) {
        throw Error(`weekday ${weekdayStr} doesn't have a num mapping`);
      }

      if (weekdayMap[weekday] == undefined) {
        weekdayMap[weekday] = [];
      }

      weekdayMap[weekday].push(av.interval);
    }

    if (Scheduler.weekdayMapIntersectExists(weekdayMap)) {
      throw Error('weekday map has an intersecting interval');
    }

    return weekdayMap;
  }

  private static getAvailabilityBlockset(scheduleIntervals: Interval[], weekdayMap: WeekdayMap): Interval[] {
    const newIntervals: Interval[] = [];

    for (const sInterval of scheduleIntervals) {
      if (sInterval.start == undefined) {
        throw Error('start undefined');
      } else if (sInterval.start.weekdayShort == undefined) {
        throw Error('weekdayShort undefined');
      } else if (sInterval.end == null) {
        throw Error('sInterval.end null');
      }

      const wdIntervals = weekdayMap[sInterval.start.weekday];

      if (wdIntervals.length == 0) {
        newIntervals.push(sInterval);
        continue;
      }

      let currTime = sInterval.start;

      for (const wdInterval of wdIntervals) {
        newIntervals.push(Interval.fromDateTimes(
          currTime,
          currTime.plus(wdInterval.st),
        ));

        currTime = currTime.plus(wdInterval.et);
      }

      newIntervals.push(Interval.fromDateTimes(
        currTime,
        sInterval.end,
      ));
    }

    return newIntervals;
  }

  private static weekdayMapIntersectExists(weekdayMap: WeekdayMap): boolean {
    for (const key in weekdayMap) {
      if (time.isIntersect(weekdayMap[key])) {
        return true;
      }
    }

    return false;
  }
}

