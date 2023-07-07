import { Duration } from 'luxon';

export function durationToSeconds(dur: Duration): number {
  return Math.floor(dur.toMillis() / 1000);
}
