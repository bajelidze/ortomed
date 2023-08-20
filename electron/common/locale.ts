import { readFile as fsReadFile } from 'fs/promises';
import { join } from 'path';
import { parse as yamlParse } from 'yaml';
import { app } from 'electron';
import { LocaleFile } from '../../common/enums';

// readFile reads the selected locale file and returns
// its contents in JSON format.
export async function readFile(fileName: LocaleFile): Promise<string> {
  const fullFileName = fileName + '.yaml';

  const resourcePath = app.getAppPath().replace('app.asar', '');

  const enLocalePath = join(resourcePath, 'share', 'locale', fullFileName);

  const enLocaleBuff = await fsReadFile(enLocalePath);

  const enLocale = yamlParse(enLocaleBuff.toString());

  return JSON.stringify(enLocale);
}
