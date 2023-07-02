// import { Knex } from 'knex';
// // import { Session } from '@/modules/scheduler/session';
// // import { Patient } from '@/modules/actors/patient';
// import { Doctor, DoctorDao } from '@/modules/actors/doctor';
// // import { Course, CourseDao } from '@/modules/course/course';

// export class Scheduler {
//   db?: Knex;

//   doctorDao: DoctorDao;
//   courseDao: CourseDao;

//   constructor(db: Knex) {
//     this.db = db;
//     this.doctorDao = new DoctorDao(db);
//     this.courseDao = new CourseDao(db);
//   }

//   async new(doctor: Doctor) {
//     const holidays = await doctor.listHolidays();

//     console.log(holidays);
//   }
// }
