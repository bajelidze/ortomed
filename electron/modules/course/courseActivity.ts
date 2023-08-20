import { Duration } from 'luxon';
import { Knex } from 'knex';
import { _activitiesTable, Activity } from '@/modules/course/activity';
import { _coursesTable } from '@/modules/course/course';
import { BasicDao } from '@/common/dao';
import db from '@/common/db';

export const _courseActivitiesTable = 'courseActivities';

const defaultPause = Duration.fromObject({ hours: 12 });

export class CourseActivity {
  id?: number;
  courseId?: number;
  activityId?: number;

  // pause is the minimal pause before next activity.
  pause: Duration = defaultPause;

  // index is the order in the set of activities.
  index = 0;

  private initialized = false;
  private db?: Knex;
  private dao?: CourseActivityDao;

  constructor(init?: Partial<CourseActivity>) {
    Object.assign(this, init);
    this.db = db;
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new CourseActivityDao(this.db);
    this.initialized = true;
  }

  // setDb sets the database backend.
  setDb(db: Knex) {
    this.db = db;
    return this;
  }

  // commit adds the Course to the store.
  async commit(): Promise<this> {
    this.init();

    const ids = await this.dao?.add(this);

    if (ids == undefined) {
      throw Error('ids is undefined');
    }

    this.id = ids[0];
    return this;
  }

  setActivity(activity: Activity): this {
    this.activityId = activity.id;
    return this;
  }
}

export interface CourseActivityEntity {
  id?: number;
  courseId?: number;
  activityId?: number;
  pause?: number; // The minimal pause before next activity.
  index?: number; // The order the set of activities.
}

export class CourseActivityDao extends BasicDao<CourseActivity, CourseActivityEntity> {
  constructor(db: Knex) {
    super(db, _courseActivitiesTable);
  }

  protected async createTable(): Promise<void> {
    return await this.db.schema.createTable(this.table, table => {
      table.increments();
      table.integer('courseId')
        .unsigned()
        .index()
        .references('id')
        .inTable(_coursesTable);
      table.integer('activityId')
        .unsigned()
        .index()
        .references('id')
        .inTable(_activitiesTable);
      table.integer('pause').unsigned();
      table.integer('index').unsigned();
    });
  }

  protected toEntities(...courseActivities: CourseActivity[]): CourseActivityEntity[] {
    return courseActivities.map(ca => ({
      id: ca.id,
      courseId: ca.courseId,
      activityId: ca.activityId,
      pause: ca.pause?.seconds,
      index: ca.index,
    }));
  }

  protected toClasses(...courseActivities: CourseActivityEntity[]): CourseActivity[] {
    return courseActivities.map(ca => (new CourseActivity({
      id: ca.id,
      courseId: ca.courseId,
      activityId: ca.activityId,
      pause: Duration.fromObject({ seconds: ca.pause }),
      index: ca.index,
    })));
  }

  async listByCourse(courseId: number): Promise<CourseActivity[]> {
    return await this.list(query => query.where('courseId', courseId));
  }
}
