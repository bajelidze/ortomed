import { contextBridge } from 'electron';
// import { Patient } from '@/modules/actors/patient';
import log from '../common/logger';

export const API = {
  hello: 'world',
  log,
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  console.log('exposeAPI~~~~');
  contextBridge.exposeInMainWorld('api', API);
}
