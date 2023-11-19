import { ipcMain } from 'electron';
import db from '@/common/db';
import { CourseDao, Course } from '@/modules/course/course';
import { DateTime } from 'luxon';
import { AddCourseFields } from '../../common/fields';
import { Courses } from '../api/endpoints/endpoints';
import { FormattedCourse } from '../../common/interfaces';

export function setCourseHandlers() {
  ipcMain.handle(Courses.LIST, async (_, limit: number, offset: number) => {
    const courses = await new CourseDao(db).listPages(limit, offset);
    return formatCourses(courses);
  });

  ipcMain.handle(Courses.LIST_ALL, async () => {
    const courses = await new CourseDao(db).listAll();
    return formatCourses(courses);
  });

  ipcMain.handle(Courses.ADD, (_, course: AddCourseFields) => {
    throw Error('not implemented');
  });

  ipcMain.handle(Courses.DELETE, async (_, id: number) => {
    await new CourseDao(db).deleteById(id);
  });
}

function formatCourses(courses: Course[]): FormattedCourse[] {
  return courses.map(course => ({
    id: course.id?.toString(),
    name: course.name,
    dateAdded: course.dateAdded.toLocaleString(DateTime.DATETIME_MED),
  }));
}
