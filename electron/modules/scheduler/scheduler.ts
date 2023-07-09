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
import { Intersect } from 'vuetify/directives';

type WeekdayMap = {
  [key: number]: time.IntervalD[]
}

type CourseActivityMap = {
  [sessionId: number]: CourseActivity
}

type ActivityCache = {
  [activityId: number]: Activity
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

  constructor(db: Knex) {
    this.db = db;
    this.doctorDao = new DoctorDao(db);
    this.courseDao = new CourseDao(db);
    this.sessionDao = new SessionDao(db);
    this.courseActivityDao = new CourseActivityDao(db);
    this.activityDao = new ActivityDao(db);

    log.info('Constructed new Scheduler');
  }

  async getSessionBlockset(doctor: Doctor, activity: Activity, startTime: DateTime) {
    if (doctor.id == undefined) {
      throw Error('doctor.id undefined');
    }

    const sessions: Session[] = await this.sessionDao.listByDoctorId(doctor.id, startTime);

    // Get all the course activities for the corresponding sessions.
    const courseActivityMap: CourseActivityMap = {};
    const activityCache: ActivityCache = {};
    const capMap: CapacityMap = {};

    const blockset: Interval[] = [];

    for (const sess of sessions) {
      if (sess.id == undefined) {
        throw Error('session.id undefined');
      } else if (sess.interval == undefined) {
        throw Error('session.interval undefined');
      } else if (sess.interval.start == null) {
        throw Error('session.interval.start null');
      }

      if (sess.courseActivityId == undefined) {
        throw Error(`courseActivityId undefined in session ${sess.id}`);
      }

      const ca = await this.courseActivityDao.getById(sess.courseActivityId);

      if (ca.activityId == undefined) {
        throw Error(`courseActivity with id ${ca.id} has activityId undefined`);
      }

      courseActivityMap[sess.id] = ca;

      // Get corresponding activity.
      if (activityCache[ca.activityId] == undefined) {
        activityCache[ca.activityId] = await this.activityDao.getById(ca.activityId);
      }

      const cactivity = activityCache[ca.activityId];

      // If one of the activities is not flexible, then they must be the same.
      // Otherwise, the entire day is getting blocked.
      if ((!cactivity.flexible || !activity.flexible) && activity.name != activity.name) {
        const day = sess.interval.start.startOf('day');

        blockset.push(Interval.fromDateTimes(
          day, day.plus(oneDay),
        ));

        continue;
      }

      // Join every session into a map according to activity capacity.
    }
  }

  async getDoctorBlockset(doctor: Doctor, startTime: DateTime, lookAhead?: Duration): Promise<Interval[]> {
    // Prepare weekday map.
    const avails = await doctor.listAvailabilities();
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

    if (weekdayMapIntersectExists(weekdayMap)) {
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
}

function weekdayMapIntersectExists(weekdayMap: WeekdayMap): boolean {
  for (const key in weekdayMap) {
    if (time.isIntersect(weekdayMap[key])) {
      return true;
    }
  }

  return false;
}
