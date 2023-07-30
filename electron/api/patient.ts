import { ipcMain } from 'electron';
import db from '@/common/db';
import { PatientDao } from '@/modules/actors/patient';
import { DateTime } from 'luxon';

export function setPatientHandlers() {
  ipcMain.handle('listPatients', async (_, limit: number, offset: number) => {
    const patientDao = new PatientDao(db);
    const patients = await patientDao.listPages(limit, offset);

    return patients.map(patient => ({
      id: patient.id?.toString(),
      name: patient.name,
      dateAdded: patient.dateAdded.toLocaleString(DateTime.DATETIME_MED),
    }));
  });

  ipcMain.handle('addPatients', async () => {
    const patientDao = new PatientDao(db);
    const patients = await patientDao.listAll();

    return patients.map(patient => ({
      id: patient.id,
      name: patient.name,
      dateAdded: patient.dateAdded.toLocaleString(DateTime.DATETIME_MED),
    }));
  });
}
