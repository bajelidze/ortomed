import { Database, DatabaseType, DatabaseOptions, newDatabase } from '../database/database';

export class Patient {
  #database: Database;

  #firstName: string;
  #lastName: string;

  #registrationDate: Date;
  // #courses

  constructor(dbOpts: DatabaseOptions) {
    this.#database = newDatabase(dbOpts);
  }


}
