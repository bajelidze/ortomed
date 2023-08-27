import { ipcMain } from 'electron';
import { RRule, WeekdayStr, Weekday } from 'rrule';
import { Duration } from 'luxon';
import db from '@/common/db';
import { DoctorDao, Doctor } from '@/modules/actors/doctor';
import { Availability } from '@/modules/actors/availability';
import { DateTime } from 'luxon';
import { AddDoctorFields } from '../../common/fields';
import { Doctors } from '../api/endpoints/endpoints';
import { FormattedDoctor } from '../../common/interfaces';

export function setDoctorHandlers() {
  ipcMain.handle(Doctors.LIST, async (_, limit: number, offset: number) => {
    const doctors = await new DoctorDao(db).listPages(limit, offset);
    return formatDoctors(doctors);
  });

  ipcMain.handle(Doctors.LIST_ALL, async () => {
    const doctors = await new DoctorDao(db).listAll();
    return formatDoctors(doctors);
  });

  ipcMain.handle(Doctors.ADD, async (_, doctor: AddDoctorFields) => {
    const weekdays = Object.keys(doctor.schedule);

    const schedule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: weekdays.map(weekday => Weekday.fromStr(
        weekday as WeekdayStr,
      )),
    });

    const availabilities: Availability[] = [];

    for (const weekday in doctor.schedule) {
      console.log('WEEKDAY:', weekday);
      const interval = doctor.schedule[weekday as WeekdayStr];

      const av = new Availability({
        weekday: Weekday.fromStr(weekday as WeekdayStr),
        interval: {
          st: Duration.fromObject({ seconds: interval?.start }),
          et: Duration.fromObject({ seconds: interval?.end }),
        },
      }).setDb(db);

      availabilities.push(av);
    }

    const doctorCls = new Doctor({
      name: doctor.name,
      schedule: schedule,
    }).setDb(db);

    await doctorCls.commit();
    await doctorCls.addAvailability(...availabilities);
  });

  ipcMain.handle(Doctors.DELETE, async (_, id: number) => {
    await new DoctorDao(db).deleteById(id);
  });
}

function formatDoctors(doctors: Doctor[]): FormattedDoctor[] {
  return doctors.map(doctor => ({
    id: doctor.id?.toString(),
    name: doctor.name,
    dateAdded: doctor.dateAdded.toLocaleString(DateTime.DATETIME_MED),
  }));
}
