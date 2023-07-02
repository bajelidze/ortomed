import { DateTime } from 'luxon';

// Interval is a time interval with start and end times.
export interface Interval {
  st: number; // st is the start time.
  et: number; // et is the end time.
}

export interface IntervalDT {
  st: DateTime;
  et: DateTime;
}
