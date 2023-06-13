import { Knex } from 'knex';
import { Activity, ActivityEntity, _activitiesTable } from '@/modules/course/activity';
import log from '@/common/logger';

export class Course {
  id: number = 0;
  name: string = '';
  description?: string = '';
  schedule: Activity[] = [];
  repetitions?: number = 1;

  constructor(init?: Partial<Course>) {
    Object.assign(this, init);
  }
}

interface CourseEntity {
  id: number;
  name: string;
  description?: string;
  repetitions?: number;
}

// CourseActivityEntity is the result of JOIN
// between the courses and activities tables.
interface CourseActivityEntity {
  course: CourseEntity;
  activity: ActivityEntity;
  courseId: number;
  actionId: number;
}

export class CourseDao {
  private db: Knex;
  private initialized = false;

  readonly #coursesTable = 'courses';
  readonly #courseActivitiesTable = 'courseActivities';

  constructor(db: Knex) {
    this.db = db;
  }

  async #init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!await this.db.schema.hasTable(this.#coursesTable)) {
      await this.db.schema.createTable(this.#coursesTable, table => {
        table.increments('id');
        table.string('name').notNullable();
        table.string('description').defaultTo('');
        table.integer('repetitions').unsigned().defaultTo(1);
      });

      log.info(`Created table "${this.#coursesTable}"`);
    }

    if (!await this.db.schema.hasTable(this.#courseActivitiesTable)) {
      await this.db.schema.createTable(this.#courseActivitiesTable, table => {
        table.string('courseId')
          .unsigned()
          .index()
          .references('id')
          .inTable(this.#coursesTable);

        table.string('activityId')
          .unsigned()
          .index()
          .references('id')
          .inTable(_activitiesTable);
      });

      log.info(`Created table "${this.#courseActivitiesTable}"`);
    }

    this.initialized = true;
  }

  private toActivityEntities(...courses: Course[]): CourseEntity[] {
    return courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      repetitions: course.repetitions,
    }));
  }

  private toCourses(...courseActivities: CourseActivityEntity[]): Course[] {
    const courses: Course[] = [];
    const seenCourses = new Set<number>();

    for (const courseActivity of courseActivities) {
      if (seenCourses.has(courseActivity.courseId)) {
        continue;
      }

      seenCourses.add(courseActivity.courseId);

      const course = new Course({
        id: courseActivity.courseId,
        name: courseActivity.course.name,
        description: courseActivity.course.description,
        repetitions: courseActivity.course.repetitions,
      });

      // course.schedule = courseActivities.filter(ca => 
      //   ca.course.
      // );

      courses.push();
    }
  }

  async listAll(): Promise<Course[]> {
    return this.#list();
  }

  async listPages(limit: number,  offset: number): Promise<Course[]> {
    return this.#list(query => query.limit(limit).offset(offset))
  }

  async #list(builder?: (query: Knex.QueryBuilder) => Knex.QueryBuilder): Promise<Course[]> {
    await this.#init();

    let query = this.db
      .select('*')
      .from(this.#coursesTable)
      .join(
        this.#courseActivitiesTable,
        `${this.#coursesTable}.id`,
        '=',
        `${this.#courseActivitiesTable}.courseId`,
      )
      .join(
        _activitiesTable,
        `${this.#courseActivitiesTable}.activityId`,
        '=',
        `${_activitiesTable}.id`,
      );

    if (builder) {
      query = builder(query);
    }

    const courseActivities: CourseActivityEntity[] = await query;

    log.info(`Listed ${courseActivities.length} courses`);

    // return result;
  }

  // add adds new activities to the store.
  async add(...activities: Activity[]): Promise<void> {
    if (activities.length == 0) {
      throw Error('no activities specified');
    }

    await this.#init();

    await this.db.insert(this.toActivityEntities(...activities))
      .into(this.table);

    log.info(`Added ${activities.length} activities`);
  }
}
