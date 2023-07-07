import { Knex } from 'knex';
import { DateTime, Duration } from 'luxon';
import { RRule } from 'rrule';
import log from '@/common/logger';
import { Session } from '@/modules/scheduler/session';
import { Patient } from '@/modules/actors/patient';
import { Doctor, DoctorDao } from '@/modules/actors/doctor';
import { Holiday } from '@/modules/actors/holiday';
import { Course, CourseDao } from '@/modules/course/course';
import { Interval, IntervalDT, isIntersect } from '@/common/structs';

type WeekdayMap = {
  [key: string]: Interval[]
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

  // async new(patient: Patient, doctor: Doctor, course: Course) {

  // }

  // async newBlockset(patient: Patient, doctor: Doctor, course: Course) {
  //   const blockset: Interval[] = [];

  // }

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

      const weekday = av.weekday.toString();

      if (weekdayMap[weekday] == undefined) {
        weekdayMap[weekday] = [];
      }
      console.log({st: av.interval?.st, et: av.interval?.et});

      weekdayMap[weekday].push({
        st: av.interval?.st,
        et: av.interval?.et,
      });
    }

    if (weekdayMapIntersectExists(weekdayMap)) {
      throw Error('weekday map has an intersecting interval');
    }

    // Find recurring schedule.
    if (doctor.schedule == undefined) {
      throw Error(`doctor with id ${doctor.id} is missing schedule`);
    }

    // const scheduleIntervals = Doctor.scheduleToIntervals(doctor.schedule, startTime, lookAhead);

    console.log(weekdayMap);
    // console.log(scheduleIntervals);
    // Compute recurring schedule intervals.
    // const blockset: Interval[] = [];

    // Get holidays.
    // const holidays = Holiday.holidaysToIntervals(...await doctor.listHolidays());
  }
}

function weekdayMapIntersectExists(weekdayMap: WeekdayMap): boolean {
  for (const key in weekdayMap) {
    if (isIntersect(weekdayMap[key])) {
      return true;
    }
  }

  return false;
}
