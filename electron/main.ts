import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { setHandlers } from '@/api/api';
// import { Patient } from '@/modules/actors/patient';

(async () => {
// const course = new Course({
//   name: 'LFK',
//   description: 'massage...',
//   repetitions: 2,
// });

  // await course.commit();

  // const act = new Activity({
  //   name: 'LFK',
  //   description: 'massage',
  //   capacity: 1,
  // });

  // await act.commit();

  // const ca1 = new CourseActivity({
  //   pause: Duration.fromObject({hour: 2}),
  // }).setActivity(act);

  // const ca2 = new CourseActivity({
  //   pause: Duration.fromObject({hour: 2}),
  // }).setActivity(act);

  // await course.addActivities(ca1, ca2);

  // // const result = await dao.listAll();

  // const doctor = await new Doctor({
  //   name: 'Strong',
  //   schedule: new RRule({
  //     freq: RRule.WEEKLY,
  //     dtstart: DateTime.now().toJSDate(),
  //     byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
  //   }),
  // }).commit();

  // await doctor.addHolidays(new Holiday({
  //   date: DateTime.fromObject({
  //     day: 30,
  //     month: 11,
  //     year: 2023,
  //   }),
  // }));

  // const patient = await new Patient({name: 'John'}).commit();

  // for (const weekday of [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]) {
  //   const av = await new Availability({
  //     weekday: weekday,
  //     interval: {
  //       st: Duration.fromObject({hour: 9}),
  //       et: Duration.fromObject({hour: 18}),
  //     },
  //   }).commit();

  //   await doctor.addAvailability(av);
  // }

  // const now = DateTime.now();

  // for (const ca of [ca1, ca2]) {
  //   await Session.new(
  //     doctor, patient, ca,
  //     Interval.fromDateTimes(
  //       now.plus(Duration.fromObject({hour: 2})),
  //       now.plus(Duration.fromObject({hour: 3})),
  //     ),
  //   ).commit();
  // }

  // // const sessDao = new SessionDao(db);

  // // const result = await sessDao.listFrom(DateTime.fromObject({year: 2020, month: 1, day: 1}), true);

  // // console.log(result);

  // const scheduler = new Scheduler(db);

  // const sessions = await scheduler.scheduleCourse(doctor, patient, course, now);

  // for (const session of sessions) {
  //   console.log(session.interval?.toString());
  // }

  // const sessions2 = await scheduler.scheduleCourse(doctor, patient2, course, now);

  // for (const session of sessions2) {
  //   console.log(session.interval?.toString());
  // }

// scheduler.commitSessions(...sessions);
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
      // nodeIntegration: true,
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

  if (process.env.ORTOMED_DEBUG == '1') {
    win.webContents.openDevTools();
  }
}

app.on('window-all-closed', () => {
  win = null;
});

setHandlers();

app.whenReady().then(createWindow);
