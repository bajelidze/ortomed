import { Session } from '../../common/interfaces';
import { Event } from './interfaces';

export function toSeconds(hours: string, minutes: string): number {
  return +hours * 60 * 60 + +minutes * 60;
}

export function sessionsToEvents(sessions: Session[]): Event[] {
  const events: Event[] = [];

  for (const sess of sessions) {
    window.api.patients.listAll;
  }
}
