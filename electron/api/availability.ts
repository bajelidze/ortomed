import { ipcMain } from 'electron';
import { Weekday } from 'rrule';
import { Duration } from 'luxon';
import db from '@/common/db';
import { AvailabilityDao, Availability } from '@/modules/actors/availability';
import { Schedule } from '../../common/interfaces';
import { Availability as AvailabilityE } from '../api/endpoints/endpoints';

export function setAvailabilityHandlers() {
  ipcMain.handle(AvailabilityE.LIST_ALL, async (_, doctorID: number): Promise<Availability[]> => {
    return await new AvailabilityDao(db).listAvailabilitysForDoctor(doctorID);
  });

  ipcMain.handle(AvailabilityE.ADD, async (_, doctorID: number, availabilities: Schedule[]) =>
    await addAvailabilities(doctorID, ...availabilities),
  );

  ipcMain.handle(AvailabilityE.DELETE, async (_, id: number) => {
    await new AvailabilityDao(db).deleteById(id);
  });
}

export async function addAvailabilities(doctorID: number, ...availabilities: Schedule[]) {
  const availabilitiesCls: Promise<Availability>[] = [];

  for (const availability of availabilities) {
    const av = new Availability({
      id: availability.id,
      doctorId: doctorID,
      weekday: Weekday.fromStr(availability.weekday),
      interval: {
        st: Duration.fromObject({ seconds: availability.interval.start }),
        et: Duration.fromObject({ seconds: availability.interval.end }),
      },
    }).setDb(db);

    availabilitiesCls.push(av.commit());
  }

  await Promise.all(availabilitiesCls);
}
