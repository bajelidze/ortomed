import { Knex } from 'knex';
import log from '@/common/logger';
import { _activitiesTable } from '@/modules/course/activity';
import { _courseActivitiesTable, CourseActivityDao, CourseActivity } from '@/modules/course/courseActivity';

const _coursesTable = 'courses';

export class Course {
  id?: number;
  name: string = '';
  description?: string = '';
  repetitions?: number = 1;

  private initialized: boolean = false;
  private db?: Knex;
  private dao?: CourseDao;
  private courseActivityDao?: CourseActivityDao;

  constructor(init?: Partial<Course>) {
    Object.assign(this, init);
  }

  private init() {
    if (this.initialized) {
      return
    } else if(!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new CourseDao(this.db);
    this.initialized = true;
  }

  // setDb sets the database backend.
  setDb(db: Knex): this {
    this.db = db;
    return this;
  }

  // commit adds the Course to the store.
  async commit() {
    this.init();

    await this.dao?.add(this);
    return this;
  }

  // listActivities lists all the activities for the course.
  async listActivities(): Promise<CourseActivity[]> {
    this.init();

    if (this.id == undefined) {
      throw new Error('the course is missing an id');
    } else if (this.courseActivityDao == undefined) {
      throw new Error('courseActivityDao is undefined');
    }

    return await this.courseActivityDao.listCourseActivitiesForCourse(this.id);
  }

  // addActivities adds the activities to the course.
  async addActivities(...courseActivities: CourseActivity[]): Promise<void> {
    this.init();

    if (this.courseActivityDao == undefined) {
      throw new Error('courseActivityDao is undefined');
    }

    for (let ca of courseActivities) {
      ca.courseId = this.id;
    }

    return await this.courseActivityDao.add(...courseActivities);
  }
}

interface CourseEntity {
  id?: number;
  name: string;
  description?: string;
  repetitions?: number;
}

export class CourseDao {
  private db: Knex;
  private initialized = false;

  readonly table = _coursesTable;

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
        table.integer('repetitions').unsigned().defaultTo(1);
      });

      log.info(`Created table "${this.table}"`);
    }

    this.initialized = true;
  }

  private toCourses(...courses: CourseEntity[]): Course[] {
    return courses.map(course => (new Course({
      id: course.id,
      name: course.name,
      description: course.description,
      repetitions: course.repetitions,
    })));
  }

  private toCoursesEntities(...courses: Course[]): CourseEntity[] {
    return courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      repetitions: course.repetitions,
    }));
  }

  private async list(builder?: (query: Knex.QueryBuilder) => Knex.QueryBuilder): Promise<Course[]> {
    await this.init();

    let query = this.db
      .select('*')
      .from(this.table);

    if (builder) {
      query = builder(query);
    }

    const courses: CourseEntity[] = await query;

    log.info(`Listed ${courses.length} courses`);

    return this.toCourses(...courses);
  }

  async listAll(): Promise<Course[]> {
    return this.list();
  }

  async listPages(limit: number,  offset: number): Promise<Course[]> {
    return this.list(query => query.limit(limit).offset(offset))
  }

  // add adds new activities to the store.
  async add(...courses: Course[]): Promise<void> {
    if (courses.length == 0) {
      throw Error('no courses specified');
    }

    await this.init();

    await this.db
      .insert(this.toCoursesEntities(...courses))
      .into(this.table);

    log.info(`Added ${courses.length} courses`);
  }

}
