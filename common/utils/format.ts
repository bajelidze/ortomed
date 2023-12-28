import { Interval } from '../interfaces';
import { Duration } from 'luxon';

function formatTimeUnit(unit: number): string {
  return `${unit < 10 ? '0' : ''}${unit}`;
}

export function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = (seconds % 3600) / 60;

  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}`;
}

export function formatInterval(interval: Interval): string {
  return `${formatSeconds(interval.start)}–${formatSeconds(interval.end)}`;
}

export function formatDurationSeconds(seconds: number): string {
  return Duration.fromObject({ second: seconds }).rescale().toHuman({
    unitDisplay: 'short',
  });
}
