import { ipcMain } from 'electron';
import { Duration } from 'luxon';
import db from '@/common/db';
import { CourseActivityDao, CourseActivity as CourseActivityC } from '@/modules/course/courseActivity';
import { CourseActivity } from '../../common/interfaces';
import { CourseActivity as CourseActivityE } from '../api/endpoints/endpoints';

export function setCourseActivityHandlers() {
  ipcMain.handle(CourseActivityE.DELETE, async (_, id: number) => {
    await new CourseActivityDao(db).deleteById(id);
  });

  ipcMain.handle(CourseActivityE.GET, async (_, ids: number[]) => {
    const courseActivities = await new CourseActivityDao(db).getByIds(...ids);
    return formatCourseActivities(courseActivities);
  });
}

export async function addCourseActivities(courseId: number, ...courseActivities: CourseActivity[]) {
  const courseActivitiesCls: Promise<CourseActivityC>[] = [];

  for (const [idx, ca] of courseActivities.entries()) {
    const courseActivity = new CourseActivityC({
      courseId: courseId,
      activityId: ca.activityId,
      pause: Duration.fromObject({ seconds: ca.pause }),
      index: idx,
    }).setDb(db);

    courseActivitiesCls.push(courseActivity.commit());
  }

  await Promise.all(courseActivitiesCls);
}

function formatCourseActivities(courseActivitiesC: CourseActivityC[]): CourseActivity[] {
  return courseActivitiesC.map(ca => formatCourseActivity(ca));
}

function formatCourseActivity(courseActivityC: CourseActivityC): CourseActivity {
  const activity: CourseActivity = {
    id: courseActivityC.id,
    activityId: courseActivityC.activityId,
    courseId: courseActivityC.courseId,
    pause: courseActivityC.pause.toMillis(),
    index: courseActivityC.index,
  };

  return activity;
}
