import { Knex } from 'knex';
import { BasicDao } from '@/common/dao';

export const _doctorsTable = 'doctor';

export class Doctor {
  id?: number;
  name = '';

  private initialized = false;
  private db?: Knex;
  private dao?: DoctorDao;

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
}

export interface DoctorEntity {
  id?: number;
  name: string;
}

export class DoctorDao extends BasicDao<Doctor, DoctorEntity> {
  constructor(db: Knex) {
    super(db, _doctorsTable);
  }

  protected async createTable(): Promise<void> {
    return this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.string('name').notNullable();
    });
  }

  protected toEntities(...patients: Doctor[]): DoctorEntity[] {
    return patients.map(patient => ({
      id: patient.id,
      name: patient.name,
    }));
  }

  protected toClasses(...patientEntities: DoctorEntity[]): Doctor[] {
    return patientEntities.map(ent => (new Doctor({
      id: ent.id,
      name: ent.name,
    })));
  }
}
