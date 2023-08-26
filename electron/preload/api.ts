import { contextBridge, ipcRenderer } from 'electron';
import { AddPatientFields } from '../../common/fields';
import { FormattedPatient } from '../../common/interfaces';
import { LocaleFile } from '../../common/enums';
import { Settings, Patients, Locale } from '../api/endpoints/endpoints';
import { SettingsValue } from '../settings/settings';

export const API = {
  settings: {
    async get(): Promise<SettingsValue> {
      return await ipcRenderer.invoke(Settings.GET);
    },
    async set(settings: SettingsValue) {
      return await ipcRenderer.invoke(Settings.SET, settings);
    },
  },
  patients: {
    async list(limit: number, offset: number): Promise<FormattedPatient[]> {
      return await ipcRenderer.invoke(Patients.LIST, limit, offset);
    },
    async listAll(): Promise<FormattedPatient[]> {
      return await ipcRenderer.invoke(Patients.LIST_ALL);
    },
    async add(patient: AddPatientFields) {
      return await ipcRenderer.invoke(Patients.ADD, patient);
    },
    async delete(id: number) {
      return await ipcRenderer.invoke(Patients.DELETE, id);
    },
  },
  locale: {
    async readFile(fileName: LocaleFile): Promise<string> {
      return await ipcRenderer.invoke(Locale.READ_FILE, fileName);
    },
  },
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
