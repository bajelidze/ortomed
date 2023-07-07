import { Knex } from 'knex';
import { Weekday, WeekdayStr } from 'rrule';
import { BasicDao } from '@/common/dao';
import { _doctorsTable } from '@/modules/actors/doctor';
import { Interval } from '@/common/structs';

export const _availabilitiesTable = 'availabilities';

const secondsInDay = 86400;

export class Availability {
  id?: number;
  doctorId?: number;
  weekday?: Weekday;
  interval?: Interval;

  private initialized = false;
  private db?: Knex;
  private dao?: AvailabilityDao;

  constructor(init?: Partial<Availability>) {
    Object.assign(this, init);
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new AvailabilityDao(this.db);
    this.initialized = true;
  }

  // setDb sets the database backend.
  setDb(db: Knex) {
    this.db = db;
    return this;
  }

  // commit adds the Availability to the store.
  async commit() {
    this.init();

    for (const time of [this.interval?.st, this.interval?.et]) {
      if (time == undefined) {
        throw Error('time is undefined');
      }

      if (time - secondsInDay > 0) {
        throw Error('st/et cannot be longer than 1 day');
      }
    }

    const ids = await this.dao?.add(this);

    if (ids == undefined) {
      throw Error('ids is undefined');
    }

    this.id = ids[0];
    return this;
  }
}

export interface AvailabilityEntity {
  id?: number;
  doctorId?: number;
  weekday?: string;
  startTime?: number;
  endTime?: number;
}

export class AvailabilityDao extends BasicDao<Availability, AvailabilityEntity> {
  constructor(db: Knex) {
    super(db, _availabilitiesTable);
  }

  protected async createTable(): Promise<void> {
    return this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.integer('doctorId')
        .unsigned()
        .index()
        .references('id')
        .inTable(_doctorsTable);
      table.string('weekday').notNullable();
      table.integer('startTime').notNullable().unsigned();
      table.integer('endTime').notNullable().unsigned();
    });
  }

  protected toEntities(...availabilities: Availability[]): AvailabilityEntity[] {
    return availabilities.map(availability => ({
      id: availability.id,
      doctorId: availability.doctorId,
      weekday: availability.weekday?.toString(),
      startTime: availability.interval?.st,
      endTime: availability.interval?.et,
    }));
  }

  protected toClasses(...availabilities: AvailabilityEntity[]): Availability[] {
    return availabilities.map(availability => (new Availability({
      id: availability.id,
      doctorId: availability.doctorId,
      weekday: Weekday.fromStr(availability.weekday as WeekdayStr),
      interval: {
        st: availability.startTime == undefined ? 0 : availability.startTime,
        et: availability.endTime == undefined ? 0 : availability.endTime,
      },
    })));
  }

  async listAvailabilitysForDoctor(doctorId: number): Promise<Availability[]> {
    return this.list(query => query.where('doctorId', doctorId));
  }
}
