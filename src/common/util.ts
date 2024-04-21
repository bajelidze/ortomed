export function toSeconds(hours: string, minutes: string): number {
  return +hours * 60 * 60 + +minutes * 60;
}
