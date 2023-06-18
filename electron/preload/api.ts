import { contextBridge } from 'electron';

export const API = {};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
