import { contextBridge, ipcRenderer } from 'electron';
import { AddPatientFields } from '../../common/fields';
import { FormattedPatient } from '../../common/interfaces';
import { LocaleFile } from '../../common/enums';
import { Patients, Locale } from '../api/endpoints/endpoints';

export const API = {
  patients: {
    list(limit: number, offset: number): Promise<FormattedPatient[]> {
      return ipcRenderer.invoke(Patients.LIST, limit, offset);
    },
    listAll(): Promise<FormattedPatient[]> {
      return ipcRenderer.invoke(Patients.LIST_ALL);
    },
    add(patient: AddPatientFields): Promise<void> {
      return ipcRenderer.invoke(Patients.ADD, patient);
    },
    delete(id: number): Promise<void> {
      return ipcRenderer.invoke(Patients.DELETE, id);
    },
  },
  locale: {
    readFile(fileName: LocaleFile): Promise<string> {
      return ipcRenderer.invoke(Locale.READ_FILE, fileName);
    },
  },
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
