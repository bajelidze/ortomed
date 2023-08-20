import { ipcMain } from 'electron';
import { Locale } from '../api/endpoints/endpoints';
import { readFile } from '../common/locale';
import { LocaleFile } from '../../common/enums';

export function setLocaleHandlers() {
  ipcMain.handle(Locale.READ_FILE, async (_, fileName: LocaleFile) => {
    return await readFile(fileName);
  });
}
