import { app } from 'electron';
import { Mutex } from 'async-mutex';
import Ajv from 'ajv';
import path from 'path';
import { LocaleFile } from '../../common/enums';
import fs from 'fs/promises';
import { settingsSchema } from './schema';
import { fileExists } from '../../common/utils/fs';

const ajv = new Ajv();

const configName = 'config.json';
const configIndentation = 2;
const userDataPath = app.getPath('userData');

export interface SettingsValue {
  locale: LocaleFile;
}

export class SettingsManager {
  // mutex to ensure exclusive access.
  mutex = new Mutex();

  private value: SettingsValue = {
    locale: LocaleFile.enUS,
  };

  private fullPath = path.join(userDataPath, configName);

  constructor() {
    return this;
  }

  async init() {
    const validate = ajv.compile(settingsSchema);

    return await this.mutex.runExclusive(async () => {
      // If the config file doesn't exist, write a new one
      // with the defaults.
      if (!await fileExists(this.fullPath)) {
        return await this.writeConfig();
      }

      const result = await fs.readFile(this.fullPath);

      if (!validate(result)) {
        throw Error('invalid config file: ' + validate.errors?.toString());
      }

      this.value = JSON.parse(result.toString());
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
    return await this.mutex.runExclusive(this.writeConfig);
  }

  private async writeConfig() {
    await fs.writeFile(
      this.fullPath,
      JSON.stringify(this.value, null, configIndentation) + '\n',
    );
  }
}

// Settings is a global singleton managing the app-wide settings.
export const Settings = new SettingsManager();
