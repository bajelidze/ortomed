import { Duration } from 'luxon';
import { Knex } from 'knex';
import log from '@/common/logger';

export interface Activity {
  name: string;
  description?: string;
  duration: Duration;
}

// ActivityEntity is the type that is actually
// inserted into the database.
interface ActivityEntity {
  name: string;
  description?: string;
  duration: number;
}

export class ActivityDao {
  #db: Knex;
  #initialized = false;

  readonly #activitiesTable = 'activities';

  constructor(db: Knex) {
    this.#db = db;
  }

  async #init(): Promise<void> {
    if (this.#initialized) {
      return;
    }

    if (!await this.#db.schema.hasTable(this.#activitiesTable)) {
      await this.#db.schema.createTable(this.#activitiesTable, table => {
        table.increments();
        table.string('name').notNullable();
        table.string('description').defaultTo('');
        table.integer('duration').notNullable();
      });

      log.info(`Created table "${this.#activitiesTable}"`);
    }

    this.#initialized = true;
  }

  #toActivityEntities(...activities: Activity[]): ActivityEntity[] {
    return activities.map(activity => ({
      name: activity.name,
      description: activity.description,
      duration: activity.duration.toMillis(),
    }));
  }

  // list lists all the activities in the store.
  async list(): Promise<Activity[]> {
    await this.#init();

    const result = await this.#db.select('*')
      .from<Activity>(this.#activitiesTable);

    log.info(`Listed ${result.length} activities`);

    return result;
  }

  // add adds new activities to the store.
  async add(...activities: Activity[]): Promise<void> {
    if (activities.length == 0) {
      throw Error('no activities specified');
    }

    await this.#init();

    await this.#db.insert(this.#toActivityEntities(...activities))
      .into(this.#activitiesTable);

    log.info(`Added ${activities.length} activities`);
  }
}
