import { ipcMain } from 'electron';
import { RRule, WeekdayStr } from 'rrule';
import db from '@/common/db';
import { DoctorDao, Doctor } from '@/modules/actors/doctor';
import { DateTime } from 'luxon';
import { AddDoctorFields } from '../../common/fields';
import { Doctors } from '../api/endpoints/endpoints';
import { FormattedDoctor } from '../../common/interfaces';
import { addAvailabilities } from './availability';

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
    const weekdays: WeekdayStr[] = doctor.schedule.map(item => item.weekday);

    const schedule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: weekdays,
    });

    const doctorCls = new Doctor({
      name: doctor.name,
      schedule: schedule,
    }).setDb(db);

    await doctorCls.commit();
    await addAvailabilities(doctor.schedule);
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
