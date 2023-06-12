import { Duration } from 'luxon';
import { Knex } from 'knex';
import log from '@/common/logger';

export interface Activity {
  name: string;
  duration: Duration;
}

interface _Activity {
  name: string;
  duration: number;
}

export class ActivityDao {
  #db: Knex;
  #initialized = false;

  readonly #activitiesCol = 'activities';

  constructor(db: Knex) {
    this.#db = db;
  }

  async #init(): Promise<void> {
    if (this.#initialized) {
      return;
    }

    if (!await this.#db.schema.hasTable(this.#activitiesCol)) {
      await this.#db.schema.createTable(this.#activitiesCol, table => {
        table.increments();
        table.string('name');
        table.integer('duration');
      });

      log.info(`Created table "${this.#activitiesCol}"`);
    }

    this.#initialized = true;
  }

  // list lists all the activities in the store.
  async list(): Promise<Activity[]> {
    await this.#init();

    const result = await this.#db.select('*')
      .from<Activity>(this.#activitiesCol);

    log.info(`Listed ${result.length} activities`);

    return result;
  }

  // add adds new activities to the store.
  async add(...activities: Activity[]): Promise<void> {
    if (activities.length == 0) {
      throw Error('no activities specified');
    }

    await this.#init();

    const newActivities: _Activity[] = activities.map(activity => {
      return {
        name: activity.name,
        duration: activity.duration.toMillis(),
      };
    });

    await this.#db.insert<_Activity>(newActivities)
      .into(this.#activitiesCol);

    log.info(`Added ${activities.length} activities`);
  }
}
