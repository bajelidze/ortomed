import { ipcMain } from 'electron';
import { Settings as SettingsActions } from '../api/endpoints/endpoints';
import { Settings } from '../settings/settings';
import { SettingsValue } from '../../common/interfaces';

export function setSettingsHandlers() {
  ipcMain.handle(SettingsActions.GET, (): SettingsValue => {
    return Settings.get();
  });

  ipcMain.handle(SettingsActions.SET, async (_, settings: SettingsValue) => {
    await Settings.set(settings);
    await Settings.commit();
  });
}
