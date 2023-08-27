import { app } from 'electron';
import { Mutex } from 'async-mutex';
import { DefinedError } from 'ajv';
import path from 'path';
import { LocaleFile } from '../../common/enums';
import { SettingsValue } from '../../common/interfaces';
import fs from 'fs/promises';
import { validate } from './schema';
import { fileExists } from '../../common/utils/fs';

const configName = 'config.json';
const configIndentation = 2;
const userDataPath = app.getPath('userData');

const fullPath = path.join(userDataPath, configName);

export class SettingsManager {
  // mutex to ensure exclusive access.
  mutex = new Mutex();

  private value: SettingsValue = {
    locale: LocaleFile.enUS,
  };

  constructor() {
    return;
  }

  async init() {
    return await this.mutex.runExclusive(async () => {
      // If the config file doesn't exist, write a new one
      // with the defaults.
      if (!await fileExists(fullPath)) {
        return await this.writeConfig();
      }

      const settingsBytes = await fs.readFile(fullPath);
      const settings = JSON.parse(settingsBytes.toString());

      if (!validate(settings)) {
        let msg = 'invalid config file';

        for (const err of validate.errors as DefinedError[]) {
          msg += ': ' + err.message;

          if (err.params) {
            msg += ': ' + JSON.stringify(err.params);
          }
        }

        throw Error(msg);
      }

      this.value = settings;
    });
  }

  get(): SettingsValue {
    return this.value;
  }

  async set(settingsValue: SettingsValue) {
    return await this.mutex.runExclusive(() => {
      this.value = settingsValue;
    });
  }

  async commit() {
    return await this.mutex.runExclusive(async () => {
      return await this.writeConfig();
    });
  }

  private async writeConfig() {
    await fs.writeFile(
      fullPath,
      JSON.stringify(this.value, null, configIndentation) + '\n',
    );
  }
}

// Settings is a global singleton managing the app-wide settings.
export const Settings = new SettingsManager();
