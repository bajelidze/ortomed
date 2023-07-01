import { Knex } from 'knex';
import { RRule, rrulestr } from 'rrule';
import { BasicDao } from '@/common/dao';
import { Holiday, HolidayDao } from '@/modules/actors/holiday';

export const _doctorsTable = 'doctor';

export class Doctor {
  id?: number;
  name = '';

  holidays?: Holiday[];
  recurringHolidays?: RRule;

  private initialized = false;
  private db?: Knex;
  private dao?: DoctorDao;
  private holidayDao?: HolidayDao;

  constructor(init?: Partial<Doctor>) {
    Object.assign(this, init);
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new DoctorDao(this.db);
    this.holidayDao = new HolidayDao(this.db);
    this.initialized = true;
  }

  // setDb sets the database backend.
  setDb(db: Knex) {
    this.db = db;
    return this;
  }

  // commit adds the Doctor to the store.
  async commit() {
    this.init();

    const ids = await this.dao?.add(this);

    if (ids == undefined) {
      throw Error('ids is undefined');
    }

    this.id = ids[0];
    return this;
  }

  async setRecurringHolidays(recurringHolidays: RRule) {
    this.recurringHolidays = recurringHolidays;
  }

  async addHolidays(holidays: Holiday[]): Promise<void> {
    this.init();

    if (this.holidayDao == undefined) {
      throw new Error('holidayDao is undefined');
    }

    await this.holidayDao.add(...holidays);
  }
}

export interface DoctorEntity {
  id?: number;
  name?: string;
  recurringHolidays?: string
}

export class DoctorDao extends BasicDao<Doctor, DoctorEntity> {
  constructor(db: Knex) {
    super(db, _doctorsTable);
  }

  protected async createTable(): Promise<void> {
    return this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('recurringHolidays');
    });
  }

  protected toEntities(...doctors: Doctor[]): DoctorEntity[] {
    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      recurringHolidays: doctor.recurringHolidays?.toString(),
    }));
  }

  protected toClasses(...doctors: DoctorEntity[]): Doctor[] {
    return doctors.map(doctor => (new Doctor({
      id: doctor.id,
      name: doctor.name,
      recurringHolidays: rrulestr(doctor.recurringHolidays ? doctor.recurringHolidays : ''),
    })));
  }
}
