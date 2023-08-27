import { Duration } from 'luxon';
import { LocaleFile } from './enums';

export interface FormattedPatient {
  id?: string;
  name: string;
  dateAdded: string;
}

export interface FormattedDoctor {
  id?: string;
  name: string;
  dateAdded: string;
}

export interface SettingsValue {
  locale: LocaleFile;
}

export interface Interval {
  start: number;
  end: number;
}
