import { Knex } from 'knex';
import { Weekday, WeekdayStr } from 'rrule';
import { DateTime, Duration } from 'luxon';
import { BasicDao } from '@/common/dao';
import { _doctorsTable } from '@/modules/actors/doctor';

export const _availabilitiesTable = 'availabilities';

export class Availability {
  id?: number;
  doctorId?: number;
  weekday?: Weekday;
  startTime?: DateTime;
  endTime?: DateTime;

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

    for (const time of [this.startTime, this.endTime]) {
      if (time == undefined) {
        throw Error('time is undefined');
      }

      if (time.minus(Duration.fromObject({day: 1})).toUnixInteger() > 0) {
        throw Error('startTime/endTime cannot be longer than 1 day');
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
      startTime: availability.startTime?.toUnixInteger(),
      endTime: availability.endTime?.toUnixInteger(),
    }));
  }

  protected toClasses(...availabilities: AvailabilityEntity[]): Availability[] {
    return availabilities.map(availability => (new Availability({
      id: availability.id,
      doctorId: availability.doctorId,
      weekday: Weekday.fromStr(availability.weekday as WeekdayStr),
      startTime: DateTime.fromSeconds(availability.startTime ? availability.startTime : 0),
      endTime: DateTime.fromSeconds(availability.endTime ? availability.endTime : 0),
    })));
  }

  async listAvailabilitysForDoctor(doctorId: number): Promise<Availability[]> {
    return this.list(query => query.where('doctorId', doctorId));
  }
}
