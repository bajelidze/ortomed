import { Knex } from 'knex';
import { DateTime, Duration, Interval } from 'luxon';
import log from '@/common/logger';
import { Doctor, DoctorDao } from '@/modules/actors/doctor';
import { CourseDao } from '@/modules/course/course';
import time from '@/common/time';

type WeekdayMap = {
  [key: number]: time.IntervalD[]
}

export class Scheduler {
  db?: Knex;

  doctorDao: DoctorDao;
  courseDao: CourseDao;

  constructor(db: Knex) {
    this.db = db;
    this.doctorDao = new DoctorDao(db);
    this.courseDao = new CourseDao(db);

    log.info('Constructed new Scheduler');
  }

  async getDoctorBlockset(doctor: Doctor, startTime: DateTime, lookAhead?: Duration) {
    // Prepare weekday map.
    const avails = await doctor.listAvailabilities();

    const weekdayMap: WeekdayMap = {};

    for (const av of avails) {
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

    // Find recurring schedule.
    if (doctor.schedule == undefined) {
      throw Error(`doctor with id ${doctor.id} is missing schedule`);
    }

    const scheduleIntervals = Doctor.scheduleToIntervals(doctor.schedule, startTime, lookAhead);

    const sblockset = Scheduler.getAvailabilityBlockset(scheduleIntervals, weekdayMap);

    // console.log(weekdayMap);
    for (const si of sblockset) {
      console.log(si.toString());
    }
    // Compute recurring schedule intervals.
    // const blockset: Interval[] = [];

    // Get holidays.
    // const holidays = Holiday.holidaysToIntervals(...await doctor.listHolidays());
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
