import { JSONSchemaType } from 'ajv';
import { LocaleFile } from '../../common/enums';
import { SettingsValue } from './settings';

export const settingsSchema: JSONSchemaType<SettingsValue> = {
  type: 'object',
  properties: {
    locale: {
      type: 'string',
      default: LocaleFile.enUS,
    },
  },
  required: ['locale'],
  additionalProperties: false,
};
