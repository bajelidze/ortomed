import { ipcMain } from 'electron';
import db from '@/common/db';
import { PatientDao } from '@/modules/actors/patient';
import { DateTime } from 'luxon';

export function setPatientHandlers() {
  ipcMain.handle('listPatients', async () => {
    const patientDao = new PatientDao(db);
    const patients = await patientDao.listAll();

    return patients.map(patient => ({
      id: patient.id,
      name: patient.name,
      dateAdded: patient.dateAdded.toLocaleString(DateTime.DATETIME_MED),
    }));
  });
}
