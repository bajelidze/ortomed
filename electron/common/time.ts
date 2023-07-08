import { Duration } from 'luxon';
import { RRule } from 'rrule';

export namespace time {
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

  export const weekdayMap = new Map<string, number>([
    [RRule.MO.toString(), 1],
    [RRule.TU.toString(), 2],
    [RRule.WE.toString(), 3],
    [RRule.TH.toString(), 4],
    [RRule.FR.toString(), 5],
    [RRule.SA.toString(), 6],
    [RRule.SU.toString(), 7],
  ]);
}

export default time;
