import { Duration } from 'luxon';
import { Knex } from 'knex';
import log from '@/common/logger';
import { _activitiesTable, Activity, ActivityDao } from '@/modules/course/activity';

export const _courseActivitiesTable = 'courseActivities';

const defaultPause = Duration.fromObject({hours: 12});

export class CourseActivity {
  id?: number;
  courseId?: number;
  activity?: Activity;

  // pause is the minimal pause before next activity.
  pause: Duration = defaultPause;

  // index is the order in the set of activities.
  index: number = 0;

  constructor(init?: Partial<CourseActivity>) {
    Object.assign(this, init);
  }
}

export interface CourseActivityEntity {
  id?: number;
  courseId?: number;
  activityId?: number;
  pause?: number; // The minimal pause before next activity.
  index?: number; // The order the set of activities.
}

export class CourseActivityDao {
  private db: Knex;
  private activityDao: ActivityDao;
  private initialized = false;

  readonly table = _courseActivitiesTable;

  constructor(db: Knex, activityDao?: ActivityDao) {
    this.db = db;

    if (activityDao == undefined) {
      this.activityDao = new ActivityDao(db);
    } else {
      this.activityDao = activityDao;
    }
  }

  private async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!await this.db.schema.hasTable(this.table)) {
      await this.db.schema.createTable(this.table, table => {
        table.increments();

        table.integer('courseId')
          .unsigned()
          .index()
          .references('id')
          .inTable(this.table);

        table.integer('activityId')
          .unsigned()
          .index()
          .references('id')
          .inTable(this.table);

        table.integer('pause').unsigned()
        table.integer('index').unsigned();
      });

      log.info(`Created table "${this.table}"`);
    }

    this.initialized = true;
  }

  private async list(
    builder?: (query: Knex.QueryBuilder) => Knex.QueryBuilder,
  ): Promise<CourseActivityEntity[]> {
    await this.init();

    let query = this.db
      .select('*')
      .from(this.table);

    if (builder) {
      query = builder(query);
    }

    const courseActivities: CourseActivityEntity[] = await query;

    log.info(`Listed ${courseActivities.length} course activities`);

    return courseActivities;
  }

  private async toCourseActivities(
    ...courseActivityEntities: CourseActivityEntity[]
  ): Promise<CourseActivity[]> {
    let courseActivities: CourseActivity[] = [];

    for (const ca of courseActivityEntities) {
      if (ca.pause == undefined) {
        throw new Error('pause is undefined')
      } else if (ca.activityId == undefined) {
        throw new Error('activityId is undefined')
      }

      const activity = await this.activityDao.getById(ca.activityId);

      courseActivities.push(new CourseActivity({
        id: ca.id,
        courseId: ca.courseId,
        activity: activity,
        pause: Duration.fromMillis(ca.pause),
        index: ca.index,
      }))
    }

    return courseActivities;
  }

  private toCourseActivityEntities(
    ...courseActivityEntities: CourseActivity[]
  ): CourseActivityEntity[] {
    return courseActivityEntities.map(ca => ({
      id: ca.id,
      courseId: ca.courseId,
      activityId: ca.activity?.id,
      pause: ca.pause.toMillis(),
      index: ca.index,
    }));
  }

  async listAll(): Promise<CourseActivityEntity[]> {
    return this.list();
  }

  async listPages(limit: number,  offset: number): Promise<CourseActivityEntity[]> {
    return this.list(query => query.limit(limit).offset(offset))
  }

  // add adds new course activities to the store.
  async add(...courseActivities: CourseActivity[]): Promise<number[]> {
    if (courseActivities.length == 0) {
      throw Error('no course activities specified');
    }

    await this.init();

    const result: number[] = await this.db
      .insert(this.toCourseActivityEntities(...courseActivities))
      .into(this.table);

    log.info(`Added ${courseActivities.length} course activities`);

    return result;
  }

  // listCourseActivitiesForCourse returns all the
  // course activities for the selected course.
  async listCourseActivitiesForCourse(courseId: number): Promise<CourseActivity[]> {
    await this.init();

    const courseActivityEntities: CourseActivityEntity[] = await this.db
      .select('*')
      .from(_courseActivitiesTable)
      .where('courseId', courseId)
      .join(
        _activitiesTable,
        `${_courseActivitiesTable}.courseId`,
        `${_activitiesTable}.id`,
      )

    log.info(`Listed ${courseActivityEntities.length} course activities for course ${courseId}`);

    return this.toCourseActivities(...courseActivityEntities);
  }
}
