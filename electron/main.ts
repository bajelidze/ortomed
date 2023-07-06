import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { app, BrowserWindow } from 'electron';
import path from 'node:path';

import { knex, Knex } from 'knex';
import { RRule } from 'rrule';
import { Course } from '@/modules/course/course';
import { Doctor } from '@/modules/actors/doctor';
import { Holiday } from '@/modules/actors/holiday';
import { Availability } from '@/modules/actors/availability';
import { CourseActivity } from '@/modules/course/courseActivity';
import { Scheduler } from '@/modules/scheduler/scheduler';

const knexCfg: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: 'test.db',
  },
  useNullAsDefault: true,
};

const db = knex(knexCfg);

import { Activity } from './modules/course/activity';
import { DateTime, Duration } from 'luxon';

(async () => {
  const course = new Course({
    name: 'LFK',
    description: 'massage...',
    repetitions: 2,
  });

  await course.setDb(db).commit();

  const act = new Activity({
    name: 'LFK',
    description: 'massage',
  });

  await act.setDb(db).commit();

  const ca1 = new CourseActivity({
    activity: act,
    pause: Duration.fromObject({hour: 2}),
  });

  const ca2 = new CourseActivity({
    activity: act,
    pause: Duration.fromObject({hour: 1, minute: 30}),
  });

  await course.addActivities(ca1, ca2);

  // const result = await dao.listAll();

  const doctor = await new Doctor({
    name: 'Strong',
    schedule: new RRule({
      freq: RRule.WEEKLY,
      dtstart: DateTime.now().toJSDate(),
      byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
    }),
  }).setDb(db).commit();

  await doctor.addHolidays(new Holiday({
    date: DateTime.fromObject({
      day: 30,
      month: 11,
      year: 2023,
    }),
  }));

  for (const weekday of [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]) {
    await doctor.addAvailability(new Availability({
      weekday: weekday,
      startTime: DateTime.fromObject({hour: 9}),
      endTime: DateTime.fromObject({hour: 18}),
    }));
  }

  // console.log(intervals);

  // const av = await doctor.listAvailabilities();

  // const result = await course.listActivities();

  const scheduler = new Scheduler(db);

  await scheduler.getDoctorBlockset(doctor, DateTime.now());
})();

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

process.traceProcessWarnings = true;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  win.setMenu(null);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  win = null;
});

app.whenReady().then(createWindow);
