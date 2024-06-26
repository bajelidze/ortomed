import { ipcMain } from 'electron';
import { Duration } from 'luxon';
import db from '@/common/db';
import { ActivityDao, Activity as ActivityC } from '@/modules/course/activity';
import { Activity } from '../../common/interfaces';
import { Activity as ActivityE } from '../api/endpoints/endpoints';

export function setActivityHandlers() {
  ipcMain.handle(ActivityE.LIST_ALL, async (): Promise<Activity[]> => {
    const activities = await new ActivityDao(db).listAll();
    return activities.map(act => formatActivity(act));
  });

  ipcMain.handle(ActivityE.GET, async (_, ids: number[]) => {
    const activities = await new ActivityDao(db).getByIds(...ids);
    return formatActivities(activities);
  });

  ipcMain.handle(ActivityE.ADD, async (_, activities: Activity[]) =>
    await addActivities(activities),
  );

  ipcMain.handle(ActivityE.DELETE, async (_, id: number) => {
    await new ActivityDao(db).deleteById(id);
  });
}

export async function addActivities(activities: Activity[]): Promise<number[]> {
  const activitiesC: Promise<ActivityC>[] = [];

  for (const activity of activities) {
    const act = new ActivityC({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      duration: Duration.fromObject({ seconds: activity.duration }),
      capacity: activity.capacity,
      flexible: activity.flexible,
    }).setDb(db);

    activitiesC.push(act.commit());
  }

  const acts = await Promise.all(activitiesC);
  return acts.map(act => act.id == undefined ? 0 : act.id);
}

function formatActivities(activitiesC: ActivityC[]): Activity[] {
  return activitiesC.map(act => formatActivity(act));
}

function formatActivity(activityC: ActivityC): Activity {
  const activity: Activity = {
    id: activityC.id,
    name: activityC.name,
    description: activityC.description,
    duration: activityC.duration.toMillis() / 1000,
    capacity: activityC.capacity,
    flexible: activityC.flexible,
  };

  return activity;
}
