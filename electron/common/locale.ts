import { readFile as fsReadFile } from 'fs/promises';
import { join } from 'path';
import { parse as yamlParse } from 'yaml';
import { app } from 'electron';

export type LocaleFile = 'en_US' | 'ru_RU';

// readFile reads the selected locale file and returns
// its contents in JSON format.
export async function readFile(fileName: LocaleFile): Promise<string> {
  fileName += '.yaml';

  const resourcePath = app.getAppPath().replace('app.asar', '');

  const enLocalePath = join(resourcePath, 'share', 'locale', fileName);

  const enLocaleBuff = await fsReadFile(enLocalePath);

  const enLocale = yamlParse(enLocaleBuff.toString());

  return JSON.stringify(enLocale);
}
