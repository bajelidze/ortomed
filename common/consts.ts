import { WeekdayStr } from 'rrule';

export const ALL_WEEKDAYS: WeekdayStr[] = [
  'MO', 'TU', 'WE', 'TH',
  'FR', 'SA', 'SU',
];

export const WEEKDAY_MAP: Record<string, WeekdayStr> = {
  'MONDAY': 'MO',
  'TUESDAY': 'TU',
  'WEDNESDAY': 'WE',
  'THURSDAY': 'TH',
  'FRIDAY': 'FR',
  'SATURDAY': 'SA',
  'SUNDAY': 'SU',
};
