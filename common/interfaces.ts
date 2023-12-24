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

export interface Activity extends WithID {
  name: string;
  description?: string;
  duration: number;
  capacity: number;
  flexible: boolean;
}

export interface CourseActivity {
  activityName?: string;
  activityID?: number;
  index?: number; // The order of this activity among other activities.
  pause: number; // Seconds. Pause is the minimal pause before next activity.
}
