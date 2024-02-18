import { Duration, Interval } from 'luxon';
import { RRule } from 'rrule';

export namespace time {
  export const weekdayMap = new Map<string, number>([
    [RRule.MO.toString(), 1],
    [RRule.TU.toString(), 2],
    [RRule.WE.toString(), 3],
    [RRule.TH.toString(), 4],
    [RRule.FR.toString(), 5],
    [RRule.SA.toString(), 6],
    [RRule.SU.toString(), 7],
  ]);

  export interface IntervalD {
    st: Duration;
    et: Duration;
  }

  export function durationToSeconds(dur?: Duration): number {
    if (dur == undefined) {
      throw Error('dur is undefined');
    }

    return Math.floor(dur.toMillis() / 1000);
  }

  // isIntersect returns true if any two pairs of the set of intervals instersect.
  export function isIntersect(intervals: IntervalD[]): boolean {
    intervals.sort((a, b) => a.st.seconds - b.st.seconds);

    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i - 1].et > intervals[i].st) {
        return true;
      }
    }

    return false;
  }

  // reduceIntervals returns the intersections between intervals that
  // intersect at least `overlaps` times. Mutates the input array.
  export function reduceIntervals(intervals: Interval[], overlaps: number): Interval[] {
    for (let i = 0; i < overlaps; i++) {
      const newIntervals: Interval[] = [];

      for (let j = 1; j < intervals.length; j++) {
        const intersect = intervals[j - 1].intersection(intervals[j]);
        if (intersect == null) {
          continue;
        }

        newIntervals.push(intersect);
      }

      intervals = newIntervals;
    }

    return Interval.merge(intervals);
  }

  // getOverlaps returns a set of intervals that are overlaps between the passed intervals.
  export function getOverlaps(...intervals: Interval[]): Interval[] {
    const result: Interval[] = [];

    if (intervals.length < 1) {
      return result;
    }

    for (let i = 1; i < intervals.length; i++) {
      const intersection = intervals[i - 1].intersection(intervals[i]);
      if (intersection == null) {
        console.log(null);
        continue;
      }

      result.push(intersection);
    }

    return result;
  }
}

export default time;
