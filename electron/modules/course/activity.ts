import { Duration } from 'luxon';
import { Knex } from 'knex';
import log from '@/common/logger';
import errs from '@/common/errors';

export const _activitiesTable = 'activities';

export class Activity {
  id: number = 0;
  name: string = '';
  description: string = '';
  duration: Duration = Duration.fromObject({hour: 1});

  // flexible is true when the `Activity`
  // can be scheduled with other flexible
  // activities on the same calender date.
  flexible: boolean = false;

  constructor(init?: Partial<Activity>) {
    Object.assign(this, init);
  }
}

export interface ActivityEntity {
  id: number;
  name: string;
  description?: string;
  duration: number;
  flexible: number;
}

export class ActivityDao {
  private db: Knex;
  private initialized = false;

  readonly table = _activitiesTable;

  constructor(db: Knex) {
    this.db = db;
  }

  private async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!await this.db.schema.hasTable(this.table)) {
      await this.db.schema.createTable(this.table, table => {
        table.increments('id');
        table.string('name').notNullable();
        table.string('description').defaultTo('');
        table.integer('duration').unsigned().notNullable();
        table.boolean('flexible').notNullable();
      });

      log.info(`Created table "${this.table}"`);
    }

    this.initialized = true;
  }

  private toActivityEntities(...activities: Activity[]): ActivityEntity[] {
    return activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      duration: activity.duration.toMillis(),
      flexible: activity.flexible ? 1 : 0,
    }));
  }

  private toActivities(...activities: ActivityEntity[]): Activity[] {
    return activities.map(activity => (new Activity({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      duration: Duration.fromMillis(activity.duration),
      flexible: activity.flexible ? true : false,
    })));
  }

  private async list(builder?: (query: Knex.QueryBuilder) => Knex.QueryBuilder): Promise<Activity[]> {
    await this.init();

    let query = this.db
      .select('*')
      .from(this.table);

    if (builder) {
      query = builder(query);
    }

    const activities: ActivityEntity[] = await query;

    log.info(`Listed ${activities.length} activities`);

    return this.toActivities(...activities);
  }

  async listAll(): Promise<Activity[]> {
    return this.list();
  }

  async listPages(limit: number,  offset: number): Promise<Activity[]> {
    return this.list(query => query.limit(limit).offset(offset))
  }

  async getById(activityId: number): Promise<Activity> {
    const activities = await this.list(query => query.where('id', activityId));

    if (activities.length > 1) {
      throw new Error('got multiple activities instead of one');
    } else if (activities.length != 1) {
      throw new errs.ErrNotFound(`activity with id ${activityId} was not found`);
    }

    return activities[0];
  }

  // add adds new activities to the store.
  async add(...activities: Activity[]): Promise<void> {
    if (activities.length == 0) {
      throw Error('no activities specified');
    }

    await this.init();

    await this.db
      .insert(this.toActivityEntities(...activities))
      .into(this.table);

    log.info(`Added ${activities.length} activities`);
  }
}
