import { Duration } from 'luxon';
import { Knex } from 'knex';
import { BasicDao } from '@/common/dao';
import db from '@/common/db';

export const _activitiesTable = 'activities';

export class Activity {
  id?: number;
  name = '';
  description = '';
  duration: Duration = Duration.fromObject({hour: 1});

  // capacity is the maximum number of patients that
  // can participate in the activity at the same time.
  capacity = 1;

  // flexible is true when the `Activity`
  // can be scheduled with other flexible
  // activities on the same calendar date.
  flexible = false;

  private initialized = false;
  private db?: Knex;
  private dao?: ActivityDao;

  constructor(init?: Partial<Activity>) {
    Object.assign(this, init);
    this.db = db;
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new ActivityDao(this.db);
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

export interface ActivityEntity {
  id?: number;
  name: string;
  description?: string;
  duration: number;
  flexible: number;
  capacity: number;
}

export class ActivityDao extends BasicDao<Activity, ActivityEntity> {
  constructor(db: Knex) {
    super(db, _activitiesTable);
  }

  protected async createTable(): Promise<void> {
    return this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.string('name').notNullable().unique();
      table.string('description').defaultTo('');
      table.integer('duration').unsigned().notNullable();
      table.integer('capacity').unsigned().notNullable();
      table.boolean('flexible').notNullable();
    });
  }

  protected toEntities(...activities: Activity[]): ActivityEntity[] {
    return activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      duration: activity.duration.toMillis(),
      flexible: activity.flexible ? 1 : 0,
      capacity: activity.capacity,
    }));
  }

  protected toClasses(...activities: ActivityEntity[]): Activity[] {
    return activities.map(activity => (new Activity({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      duration: Duration.fromMillis(activity.duration),
      flexible: activity.flexible ? true : false,
      capacity: activity.capacity,
    })));
  }
}
