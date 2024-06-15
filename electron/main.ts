import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { setHandlers } from '@/api/api';
import { Settings } from './settings/settings';

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
    icon: path.join(process.env.PUBLIC, 'ortomed.svg'),
    height: 800,
    width: 1400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
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
  app.quit();
});

setHandlers();

app.on('ready', async () => {
  await Settings.init();
  createWindow();
});
