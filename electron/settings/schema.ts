import Ajv, { JSONSchemaType } from 'ajv';
import { LocaleFile } from '../../common/enums';
import { SettingsValue } from '../../common/interfaces';

const ajv = new Ajv();

const settingsSchema: JSONSchemaType<SettingsValue> = {
  type: 'object',
  properties: {
    locale: {
      type: 'string',
      default: LocaleFile.enUS,
      enum: Object.values(LocaleFile),
    },
  },
  required: ['locale'],
  additionalProperties: false,
};

export const validate = ajv.compile(settingsSchema);
