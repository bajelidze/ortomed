import { LocaleFile } from './enums';

export interface FormattedPatient {
  id?: string;
  name: string;
  dateAdded: string;
}

export interface SettingsValue {
  locale: LocaleFile;
}
