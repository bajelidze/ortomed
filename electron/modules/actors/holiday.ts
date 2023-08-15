import { Knex } from 'knex';
import { DateTime, Duration, Interval } from 'luxon';
import { BasicDao } from '@/common/dao';
import { _doctorsTable } from '@/modules/actors/doctor';
import db from '@/common/db';

export const _holidaysTable = 'holidays';

const oneDay = Duration.fromObject({day: 1});

export class Holiday {
  id?: number;
  doctorId?: number;
  date?: DateTime;

  private initialized = false;
  private db?: Knex;
  private dao?: HolidayDao;

  constructor(init?: Partial<Holiday>) {
    Object.assign(this, init);
    this.db = db;
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new HolidayDao(this.db);
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
    }

    this.id = ids[0];
    return this;
  }

  static holidaysToIntervals(...holidays: Holiday[]): Interval[] {
    return holidays.map(holiday => {
      if (holiday.date == undefined) {
        throw Error(`holiday date undfined for id ${holiday.id}`);
      }

      const date = holiday.date?.startOf('day');

      return Interval.fromDateTimes(date, date.plus(oneDay));
    });
  }
}

export interface HolidayEntity {
  id?: number;
  doctorId?: number;
  date?: number;
}

export class HolidayDao extends BasicDao<Holiday, HolidayEntity> {
  constructor(db: Knex) {
    super(db, _holidaysTable);
  }

  protected async createTable(): Promise<void> {
    return await this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.integer('doctorId')
        .unsigned()
        .index()
        .references('id')
        .inTable(_doctorsTable);
      table.integer('date').unsigned().notNullable();
    });
  }

  protected toEntities(...holidays: Holiday[]): HolidayEntity[] {
    return holidays.map(holiday => ({
      id: holiday.id,
      doctorId: holiday.doctorId,
      date: holiday.date?.toUnixInteger(),
    }));
  }

  protected toClasses(...holidays: HolidayEntity[]): Holiday[] {
    return holidays.map(holiday => (new Holiday({
      id: holiday.id,
      doctorId: holiday.doctorId,
      date: DateTime.fromSeconds(holiday.date == undefined ? 0 : holiday.date),
    })));
  }

  async listHolidaysForDoctor(doctorId: number): Promise<Holiday[]> {
    return await this.list(query => query.where('doctorId', doctorId));
  }
}
