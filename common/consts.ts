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

export const WEEKDAY_MAP_REV: Record<WeekdayStr, string> = {
  'MO': 'MONDAY',
  'TU': 'TUESDAY',
  'WE': 'WEDNESDAY',
  'TH': 'THURSDAY',
  'FR': 'FRIDAY',
  'SA': 'SATURDAY',
  'SU': 'SUNDAY',
};

export const HOURS: string[] = (() => {
  const hours: string[] = [];

  for (let i = 0; i < 24; i++) {
    let iStr = i.toString();
    if (i < 10) {
      iStr = '0' + iStr;
    }

    hours.push(iStr);
  }

  return hours;
})();

export const MINUTES: string[] = (() => {
  const minutes: string[] = [];

  for (let i = 0; i < 60; i++) {
    let iStr = i.toString();
    if (i < 10) {
      iStr = '0' + iStr;
    }

    minutes.push(iStr);
  }

  return minutes;
})();
