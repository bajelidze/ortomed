import { ipcMain } from 'electron';
import db from '@/common/db';
import { PatientDao } from '@/modules/actors/patient';

export function setPatientHandlers() {
  ipcMain.handle('listPatients', async () => {
    const patientDao = new PatientDao(db);
    const patients = await patientDao.listAll();
    return JSON.parse(JSON.stringify(patients));
  });
}
