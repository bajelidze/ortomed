import { Knex } from 'knex';
import { BasicDao } from '@/common/dao';
import db from '@/common/db';

export const _patientsTable = 'patients';

export class Patient {
  id?: number;
  name = '';

  private initialized = false;
  private db?: Knex;
  private dao?: PatientDao;

  constructor(init?: Partial<Patient>) {
    Object.assign(this, init);
    this.db = db;
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new PatientDao(this.db);
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

export interface PatientEntity {
  id?: number;
  name: string;
}

export class PatientDao extends BasicDao<Patient, PatientEntity> {
  constructor(db: Knex) {
    super(db, _patientsTable);
  }

  protected async createTable(): Promise<void> {
    return this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.string('name').notNullable();
    });
  }

  protected toEntities(...patients: Patient[]): PatientEntity[] {
    return patients.map(patient => ({
      id: patient.id,
      name: patient.name,
    }));
  }

  protected toClasses(...patientEntities: PatientEntity[]): Patient[] {
    return patientEntities.map(ent => (new Patient({
      id: ent.id,
      name: ent.name,
    })));
  }
}
