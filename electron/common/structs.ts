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

// isIntersect returns true if any two pairs of the set of intervals instersect.
export function isIntersect(intervals: Interval[]): boolean {
  intervals.sort((a, b) => a.st - b.st);

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i - 1].et > intervals[i].st) {
      return true;
    }
  }

  return false;
}
