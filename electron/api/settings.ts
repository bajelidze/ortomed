import { ipcMain } from 'electron';
import { Settings as SettingsActions } from '../api/endpoints/endpoints';
import { Settings, SettingsValue } from '../settings/settings';

export function setSettingsHandlers() {
  ipcMain.handle(SettingsActions.GET, (): SettingsValue => {
    return Settings.get();
  });

  ipcMain.handle(SettingsActions.SET, async (_, settings: SettingsValue) => {
    return await Settings.set(settings);
  });
}
