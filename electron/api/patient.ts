import { ipcMain } from 'electron';
import db from '@/common/db';
import { PatientDao, Patient } from '@/modules/actors/patient';
import { DateTime } from 'luxon';
import { AddPatientFields } from '../../common/fields';
import { Patients } from '../api/endpoints/endpoints';
import { FormattedPatient } from '../../common/interfaces';

export function setPatientHandlers() {
  ipcMain.handle(Patients.LIST, async (_, limit: number, offset: number) => {
    const patients = await new PatientDao(db).listPages(limit, offset);
    return formatPatients(patients);
  });

  ipcMain.handle(Patients.LIST_ALL, async () => {
    const patients = await new PatientDao(db).listAll();
    return formatPatients(patients);
  });

  ipcMain.handle(Patients.ADD, async (_, patient: AddPatientFields) => {
    console.log(patient);
    const patientCls = new Patient({
      name: patient.name,
    }).setDb(db);

    await patientCls.commit();
  });

  ipcMain.handle(Patients.DELETE, async (_, id: number) => {
    console.log('here:', id);
    await new PatientDao(db).deleteById(id);
  });
}

function formatPatients(patients: Patient[]): FormattedPatient[] {
  return patients.map(patient => ({
    id: patient.id?.toString(),
    name: patient.name,
    dateAdded: patient.dateAdded.toLocaleString(DateTime.DATETIME_MED),
  }));
}
