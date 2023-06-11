import { Duration } from 'luxon';
import { Database } from '../database/database';
import log from '../../common/logger/logger';

export interface Activity {
  name: string;
  duration: Duration;
}

export class ActivityDao {
  #db: Database;

  constructor(db: Database) {
    this.#db = db;
  }

  async #init(): Promise<void> {
    try {
      await this.#db.run('CREATE TABLE activities (name TEXT, duration INTEGER)');
    } catch(err) {
      log.warn(`Error when creating "activities" table: ${err}`);
    }
  }

  async list(): Promise<Activity[]> {
    await this.#init();
    return [];
  }
}
