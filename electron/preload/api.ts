import { contextBridge } from 'electron';

import { Activity } from '../modules/course/activity';
import { Duration } from 'luxon';

const activity: Activity = {
  name: 'Massage',
  duration: Duration.fromMillis(100),
};

export const API = {
  activity: activity,
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
