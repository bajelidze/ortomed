import { DateTime, Interval } from 'luxon';
import { Knex } from 'knex';
import { BasicDao } from '@/common/dao';
import { _doctorsTable, Doctor } from '@/modules/actors/doctor';
import { _patientsTable, Patient } from '@/modules/actors/patient';
import { _courseActivitiesTable, CourseActivity } from '@/modules/course/courseActivity';
import db from '@/common/db';

const _sessionsTable = 'sessions';

export class Session {
  id?: number;
  doctorId?: number;
  patientId?: number;
  courseActivityId?: number;

  interval?: Interval;

  private initialized = false;
  private db?: Knex;
  private dao?: SessionDao;

  constructor(init?: Partial<Session>) {
    Object.assign(this, init);
    this.db = db;
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new SessionDao(this.db);
    this.initialized = true;
  }

  // setDb sets the database backend.
  setDb(db: Knex) {
    this.db = db;
    return this;
  }

  // commit adds the Course to the store.
  async commit() {
    this.init();

    const ids = await this.dao?.add(this);

    if (ids == undefined) {
      throw Error('ids is undefined');
    } else if (this.doctorId == undefined) {
      throw Error('doctorId is undefined');
    } else if (this.patientId == undefined) {
      throw Error('patientId is undefined');
    } else if (this.courseActivityId == undefined) {
      throw Error('courseActivityId is undefined');
    }

    this.id = ids[0];
    return this;
  }

  setDoctor(doctor: Doctor) {
    this.doctorId = doctor.id;
  }

  setPatient(patient: Patient) {
    this.patientId = patient.id;
  }

  setCourseActivity(courseActivity: CourseActivity) {
    this.courseActivityId = courseActivity.id;
  }

  static new(
    doctor: Doctor,
    patient: Patient,
    courseActivity: CourseActivity,
    interval: Interval,
  ): Session {
    return new Session({
      doctorId: doctor.id,
      patientId: patient.id,
      courseActivityId: courseActivity.id,
      interval: interval,
    });
  }
}

interface SessionEntity {
  id?: number;
  doctorId?: number;
  patientId?: number;
  courseActivityId?: number;
  startTime?: number;
  endTime?: number;
}

export class SessionDao extends BasicDao<Session, SessionEntity> {
  constructor(db: Knex) {
    super(db, _sessionsTable);
  }

  protected async createTable(): Promise<void> {
    return this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.integer('doctorId')
        .unsigned()
        .index()
        .references('id')
        .inTable(_doctorsTable);
      table.integer('patientId')
        .unsigned()
        .index()
        .references('id')
        .inTable(_patientsTable);
      table.integer('courseActivityId')
        .unsigned()
        .index()
        .references('id')
        .inTable(_courseActivitiesTable);
      table.integer('startTime').notNullable().unsigned();
      table.integer('endTime').notNullable().unsigned();
    });
  }

  protected toEntities(...sessions: Session[]): SessionEntity[] {
    return sessions.map(session => ({
      id: session.id,
      doctorId: session.doctorId,
      patientId: session.patientId,
      courseActivityId: session.courseActivityId,
      startTime: session.interval?.start?.toUnixInteger(),
      endTime: session.interval?.end?.toUnixInteger(),
    }));
  }

  protected toClasses(...sessions: SessionEntity[]): Session[] {
    return sessions.map(session => {
      if (session.startTime == undefined) {
        throw Error('startTime undefined');
      } else if (session.endTime == undefined) {
        throw Error('endTime undefined');
      }

      return new Session({
        id: session.id,
        doctorId: session.doctorId,
        patientId: session.patientId,
        courseActivityId: session.courseActivityId,
        interval: Interval.fromDateTimes(
          DateTime.fromSeconds(session.startTime),
          DateTime.fromSeconds(session.endTime),
        ),
      });
    });
  }

  async listFrom(from: DateTime, withCourseActivities?: boolean): Promise<Session[]> {
    return this.list(query => {
      query = query.where('endTime', '>', from.toUnixInteger());

      if (withCourseActivities) {
        query = query.join(
          _courseActivitiesTable,
          `${_sessionsTable}.courseActivityId`,
          `${_courseActivitiesTable}.id`,
        );
      }

      return query;
    });
  }
}
