import { WeekdayStr } from 'rrule';
import { Interval } from './interfaces';

export interface AddPatientFields {
  name: string;
}

export interface AddDoctorFields {
  name: string;
  schedule: Partial<Record<WeekdayStr, Interval>>;
}
