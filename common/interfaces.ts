import { WeekdayStr } from 'rrule';
import { LocaleFile } from './enums';

export interface WithID {
  id?: number;
}

interface FormattedItem {
  id?: string;
  name: string;
  dateAdded: string;
}

export type FormattedPatient = FormattedItem
export type FormattedDoctor = FormattedItem
export type FormattedCourse = FormattedItem

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
