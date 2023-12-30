import { ipcMain } from 'electron';
import { RRule, WeekdayStr } from 'rrule';
import { DateTime } from 'luxon';
import db from '@/common/db';
import { DoctorDao, Doctor } from '@/modules/actors/doctor';
import { AvailabilityDao } from '@/modules/actors/availability';
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

    const doctorId = doctorCls.id;
    if (doctorId == undefined) {
      throw Error('doctorId is undefined');
    }

    await addAvailabilities(doctorId, ...doctor.schedule);
  });

  ipcMain.handle(Doctors.DELETE, async (_, id: number) => {
    await new DoctorDao(db).deleteById(id);

    const availabilities = await new AvailabilityDao(db).listAvailabilitysForDoctor(id);

    const availabilitiesDel: Promise<void>[] = [];

    for (const availability of availabilities) {
      availabilitiesDel.push(availability.del());
    }

    await Promise.all(availabilitiesDel);
  });
}

function formatDoctors(doctors: Doctor[]): FormattedDoctor[] {
  return doctors.map(doctor => ({
    id: doctor.id?.toString(),
    name: doctor.name,
    dateAdded: doctor.dateAdded.toLocaleString(DateTime.DATETIME_MED),
  }));
}
