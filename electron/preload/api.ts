import { contextBridge, ipcRenderer } from 'electron';
import { Patient } from '@/modules/actors/patient';
import { NFP } from '@/common/typing';

export const API = {
  listPatients: (limit: number, offset: number): Promise<NFP<Patient>[]> => {
    return ipcRenderer.invoke('listPatients', limit, offset);
  },
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
