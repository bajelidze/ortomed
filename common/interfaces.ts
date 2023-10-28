import { WeekdayStr } from 'rrule';
import { LocaleFile } from './enums';

export interface WithID {
  id: number;
}

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

export interface WeekdayInterval {
  weekday: WeekdayStr;
  interval: Interval;
}

export interface Schedule extends WithID, WeekdayInterval {}
