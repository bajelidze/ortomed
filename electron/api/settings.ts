import { ipcMain } from 'electron';
import { Settings } from '../api/endpoints/endpoints';
import { readFile } from '../common/locale';
import { LocaleFile } from '../../common/enums';

export function setSettingsHandlers() {
  ipcMain.handle(Settings.GET, async () => {
    return await readFile(fileName);
  });
}
