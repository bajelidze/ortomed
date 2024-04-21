import { ipcMain } from 'electron';
import { DateTime } from 'luxon';
import db from '@/common/db';
import { CourseDao, Course } from '@/modules/course/course';
import { AddCourseFields } from '../../common/fields';
import { Courses } from '../api/endpoints/endpoints';
import { FormattedCourse } from '../../common/interfaces';
import { addCourseActivities } from './courseActivity';

export function setCourseHandlers() {
  ipcMain.handle(Courses.LIST, async (_, limit: number, offset: number) => {
    const courses = await new CourseDao(db).listPages(limit, offset);
    return formatCourses(courses);
  });

  ipcMain.handle(Courses.LIST_ALL, async () => {
    const courses = await new CourseDao(db).listAll();
    return formatCourses(courses);
  });

  ipcMain.handle(Courses.GET, async (_, ids: number[]) => {
    const courses = await new CourseDao(db).getByIds(...ids);
    return formatCourses(courses);
  });

  ipcMain.handle(Courses.ADD, async (_, course: AddCourseFields) => {
    const courseCls = new Course({
      name: course.name,
      description: course.description,
      repetitions: course.repetitions,
    }).setDb(db);

    await courseCls.commit();

    const courseId = courseCls.id;
    if (courseId == undefined) {
      throw Error('courseId is undefined');
    }

    await addCourseActivities(courseId, ...course.courseActivities);
  });

  ipcMain.handle(Courses.DELETE, async (_, id: number) => {
    await new CourseDao(db).deleteById(id);
  });
}

function formatCourses(courses: Course[]): FormattedCourse[] {
  return courses.map(course => ({
    id: course.id,
    name: course.name,
    dateAdded: course.dateAdded.toLocaleString(DateTime.DATETIME_MED),
  }));
}
