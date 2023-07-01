import { Knex } from 'knex';
import { BasicDao } from '@/common/dao';
import { CourseActivityDao, CourseActivity } from '@/modules/course/courseActivity';

export const _coursesTable = 'courses';

export class Course {
  id?: number;
  name = '';
  description?: string = '';
  repetitions?: number = 1;

  private initialized = false;
  private db?: Knex;
  private dao?: CourseDao;
  private courseActivityDao?: CourseActivityDao;

  constructor(init?: Partial<Course>) {
    Object.assign(this, init);
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new CourseDao(this.db);
    this.courseActivityDao = new CourseActivityDao(this.db);
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

    // Set ids of the course activities to the current course.
    for (const ca of courseActivities) {
      ca.courseId = this.id;
    }

    // Find the index for the new activities.
    const activities = await this.listActivities();
    let highest = 0;

    if (activities.length > 0) {
      highest = Math.max(...activities.map(act => act.index));
    }

    courseActivities.forEach((ca, idx) => {
      ca.index = highest + idx + 1;
    });

    await this.courseActivityDao.add(...courseActivities);
  }
}

interface CourseEntity {
  id?: number;
  name: string;
  description?: string;
  repetitions?: number;
}

export class CourseDao extends BasicDao<Course, CourseEntity> {
  constructor(db: Knex) {
    super(db, _coursesTable);
  }

  protected async createTable(): Promise<void> {
    return this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('description').defaultTo('');
      table.integer('repetitions').unsigned().defaultTo(1);
    });
  }

  protected toEntities(...courses: Course[]): CourseEntity[] {
    return courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      repetitions: course.repetitions,
    }));
  }

  protected toClasses(...courses: CourseEntity[]): Course[] {
    return courses.map(course => (new Course({
      id: course.id,
      name: course.name,
      description: course.description,
      repetitions: course.repetitions,
    })));
  }
}
