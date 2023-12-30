import { ipcMain } from 'electron';
import { Duration } from 'luxon';
import db from '@/common/db';
import { CourseActivityDao, CourseActivity as CourseActivityCls } from '@/modules/course/courseActivity';
import { CourseActivity } from '../../common/interfaces';
import { CourseActivity as CourseActivityE } from '../api/endpoints/endpoints';

export function setCourseActivityHandlers() {
  ipcMain.handle(CourseActivityE.DELETE, async (_, id: number) => {
    await new CourseActivityDao(db).deleteById(id);
  });
}

export async function addCourseActivities(courseId: number, ...courseActivities: CourseActivity[]) {
  const courseActivitiesCls: Promise<CourseActivityCls>[] = [];

  for (const [idx, ca] of courseActivities.entries()) {
    const courseActivity = new CourseActivityCls({
      courseId: courseId,
      activityId: ca.activityId,
      pause: Duration.fromObject({ seconds: ca.pause }),
      index: idx,
    }).setDb(db);

    courseActivitiesCls.push(courseActivity.commit());
  }

  await Promise.all(courseActivitiesCls);
}
