import { Duration } from 'luxon';
import { Database } from '@/modules/database/database';
import log from '@/common/logger';

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
      log.warn(`Couldn't create "activities" table: ${err}`);
    }
  }

  async list(): Promise<Activity[]> {
    await this.#init();
    return [];
  }
}
