import { contextBridge, ipcRenderer } from 'electron';
import { Patient } from '@/modules/actors/patient';
import { NFP } from '@/common/typing';

export const API = {
  listPatients: (): Promise<NFP<Patient>[]> => ipcRenderer.invoke('listPatients'),
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
