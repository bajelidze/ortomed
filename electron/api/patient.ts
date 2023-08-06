import { ipcMain } from 'electron';
import db from '@/common/db';
import { PatientDao, Patient } from '@/modules/actors/patient';
import { DateTime } from 'luxon';
import { AddPatientFields } from '../../src/common/interfaces';

export function setPatientHandlers() {
  ipcMain.handle('patientsList', async (_, limit: number, offset: number) => {
    const patients = await new PatientDao(db).listPages(limit, offset);
    return formatPatients(patients);
  });

  ipcMain.handle('patientsListAll', async () => {
    const patients = await new PatientDao(db).listAll();
    return formatPatients(patients);
  });

  ipcMain.handle('patientsAdd', async (_, patient: AddPatientFields) => {
    console.log(patient);
    const patientCls = new Patient({
      name: patient.name,
    }).setDb(db)

    await patientCls.commit()
  });
}

function formatPatients(patients: Patient[]): any[] {
  return patients.map(patient => ({
    id: patient.id?.toString(),
    name: patient.name,
    dateAdded: patient.dateAdded.toLocaleString(DateTime.DATETIME_MED),
  }));
}
