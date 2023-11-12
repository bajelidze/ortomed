import { Knex } from 'knex';
import { RRule } from 'rrule';
import { DateTime, Duration, Interval } from 'luxon';
import { BasicDao } from '@/common/dao';
import { Holiday, HolidayDao } from '@/modules/actors/holiday';
import { Availability, AvailabilityDao } from '@/modules/actors/availability';
import db from '@/common/db';

export const _doctorsTable = 'doctors';

export class Doctor {
  id?: number;
  name = '';
  schedule?: RRule;
  dateAdded = DateTime.now();

  private initialized = false;
  private db?: Knex;
  private dao?: DoctorDao;
  private holidayDao?: HolidayDao;
  private availabilityDao?: AvailabilityDao;

  constructor(init?: Partial<Doctor>) {
    Object.assign(this, init);
    this.db = db;
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new DoctorDao(this.db);
    this.holidayDao = new HolidayDao(this.db);
    this.availabilityDao = new AvailabilityDao(this.db);
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

  async addHolidays(...holidays: Holiday[]): Promise<void> {
    this.init();

    if (this.holidayDao == undefined) {
      throw new Error('holidayDao is undefined');
    }

    for (const holiday of holidays) {
      holiday.doctorId = this.id;
      await holiday.commit();
    }
  }

  async listHolidays(): Promise<Holiday[]> {
    this.init();

    if (this.holidayDao == undefined) {
      throw new Error('holidayDao is undefined');
    } else if (this.id == undefined) {
      throw new Error('id is undefined');
    }

    return await this.holidayDao.listHolidaysForDoctor(this.id);
  }

  async listAvailabilities(): Promise<Availability[]> {
    this.init();

    if (this.availabilityDao == undefined) {
      throw new Error('availabilityDao is undefined');
    } else if (this.id == undefined) {
      throw new Error('id is undefined');
    }

    return await this.availabilityDao?.listAvailabilitysForDoctor(this.id);
  }

  async addAvailability(...availabilities: Availability[]): Promise<void> {
    this.init();

    if (this.availabilityDao == undefined) {
      throw new Error('availabilityDao is undefined');
    }

    for (const availability of availabilities) {
      availability.doctorId = this.id;
    }

    await this.availabilityDao.add(...availabilities);
  }

  // scheduleToIntervals converts the given schedule to the set
  // of intervals.
  static scheduleToIntervals(
    schedule?: RRule,
    startTime?: DateTime,
    lookAhead?: Duration,
  ) {
    if (schedule == undefined) {
      throw Error('schedule undefined');
    }

    if (startTime == undefined) {
      startTime = DateTime.now();
    }

    if (lookAhead == undefined) {
      lookAhead = Duration.fromObject({ year: 1 });
    }

    startTime = startTime.startOf('day');

    const scheduleDates = schedule.between(
      startTime.toJSDate(),
      startTime.plus(lookAhead).toJSDate(),
    );

    return scheduleDates.map(sc => {
      const st = DateTime.fromJSDate(sc).startOf('day');
      return Interval.fromDateTimes(
        st, st.plus(Duration.fromObject({ day: 1 })),
      );
    });
  }
}

export interface DoctorEntity {
  id?: number;
  name?: string;
  dateAdded: number;
}

export class DoctorDao extends BasicDao<Doctor, DoctorEntity> {
  constructor(db: Knex) {
    super(db, _doctorsTable);
  }

  protected async createTable(): Promise<void> {
    return await this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.string('name').notNullable();
      table.integer('dateAdded').unsigned();
    });
  }

  protected toEntities(...doctors: Doctor[]): DoctorEntity[] {
    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      // schedule: doctor.schedule?.toString(),
      dateAdded: doctor.dateAdded?.toUnixInteger(),
    }));
  }

  protected toClasses(...doctors: DoctorEntity[]): Doctor[] {
    return doctors.map(doctor => (new Doctor({
      id: doctor.id,
      name: doctor.name,
      dateAdded: DateTime.fromSeconds(doctor.dateAdded),
      // schedule: RRule.fromString(doctor.schedule == undefined ? '' : doctor.schedule),
    })));
  }
}
