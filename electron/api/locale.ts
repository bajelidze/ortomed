import { ipcMain } from 'electron';
import { Locale } from '../api/endpoints/endpoints';
import { readFile, LocaleFile } from '../common/locale';

export function setLocaleHandlers() {
  ipcMain.handle(Locale.READ_FILE, async (_, fileName: LocaleFile) => {
    return await readFile(fileName);
  });
}
