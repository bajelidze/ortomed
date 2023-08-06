import { contextBridge, ipcRenderer } from 'electron';
import { AddPatientFields } from '../../src/common/interfaces';

export const API = {
  patients: {
    list(limit: number, offset: number): Promise<Record<string, string>[]> {
      return ipcRenderer.invoke('patientsList', limit, offset);
    },
    listAll(): Promise<Record<string, string>[]> {
      return ipcRenderer.invoke('patientsListAll');
    },
    add(patient: AddPatientFields): Promise<void> {
      return ipcRenderer.invoke('patientsAdd', patient);
    },
  },
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
