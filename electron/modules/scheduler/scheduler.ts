import { Knex } from 'knex';
import { DateTime, Duration, Interval } from 'luxon';
import log from '@/common/logger';
import time from '@/common/time';
import { Doctor, DoctorDao } from '@/modules/actors/doctor';
import { Availability } from '@/modules/actors/availability';
import { Holiday } from '@/modules/actors/holiday';
import { CourseDao } from '@/modules/course/course';
import { CourseActivity, CourseActivityDao } from '@/modules/course/courseActivity';
import { Session, SessionDao } from '@/modules/scheduler/session';
import { Activity, ActivityDao } from '../course/activity';

type WeekdayMap = {
  [key: number]: time.IntervalD[]
}

type CourseActivityMap = {
  [sessionId: number]: CourseActivity
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
  activityCache: Cache<Activity>;
  courseActivityCache: Cache<CourseActivity>;
  sessionCache: Cache<Session>;
  availabilityCache: Cache<Availability[]>;

  constructor(db: Knex) {
    this.db = db;
    this.doctorDao = new DoctorDao(db);
    this.courseDao = new CourseDao(db);
    this.sessionDao = new SessionDao(db);
    this.courseActivityDao = new CourseActivityDao(db);
    this.activityDao = new ActivityDao(db);
    this.activityCache = {};
    this.courseActivityCache = {};
    this.sessionCache = {};
    this.availabilityCache = {};

    log.info('Constructed new Scheduler');
  }

  async getSessionBlockset(doctor: Doctor, inputActivity: Activity, startTime: DateTime): Promise<Interval[]> {
    if (doctor.id == undefined) {
      throw Error('doctor.id undefined');
    }

    const sessions: Session[] = await this.sessionDao.listByDoctorId(doctor.id, startTime);

    // Get all the course activities for the corresponding sessions.
    const courseActivityMap: CourseActivityMap = {};
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

      if (this.sessionCache[sess.id] == undefined) {
        this.sessionCache[sess.id] = sess;
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
  static reduceCapMap(capMap: CapacityMap): Interval[] {
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

  async getDoctorBlockset(doctor: Doctor, startTime: DateTime, lookAhead?: Duration): Promise<Interval[]> {
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

  static getAvailabilityBlockset(scheduleIntervals: Interval[], weekdayMap: WeekdayMap): Interval[] {
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

  static weekdayMapIntersectExists(weekdayMap: WeekdayMap): boolean {
    for (const key in weekdayMap) {
      if (time.isIntersect(weekdayMap[key])) {
        return true;
      }
    }

    return false;
  }
}

