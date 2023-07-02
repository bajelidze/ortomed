// import { Knex } from 'knex';
// import { DateTime, Duration } from 'luxon';
// import { RRule } from 'rrule';
// import log from '@/common/logger';
// import { Session } from '@/modules/scheduler/session';
// import { Patient } from '@/modules/actors/patient';
// import { Doctor, DoctorDao } from '@/modules/actors/doctor';
// import { Holiday } from '@/modules/actors/holiday';
// import { Course, CourseDao } from '@/modules/course/course';
// import { Interval } from '@/common/structs';

// export class Scheduler {
//   db?: Knex;

//   doctorDao: DoctorDao;
//   courseDao: CourseDao;

//   constructor(db: Knex) {
//     this.db = db;
//     this.doctorDao = new DoctorDao(db);
//     this.courseDao = new CourseDao(db);

//     log.info('Constructed new Scheduler');
//   }

//   // async new(patient: Patient, doctor: Doctor, course: Course) {

//   // }

//   async newBlockset(patient: Patient, doctor: Doctor, course: Course) {
//     const blockset: Interval[] = [];

//     // const rhIntervals = Doctor.recurringHolidaysToIntervals(doctor.recurringHolidays, );

//   }

// }
