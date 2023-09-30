import { WeekdayInterval } from './interfaces';

export interface AddPatientFields {
  name: string;
}

export interface AddDoctorFields {
  name: string;
  schedule: WeekdayInterval[];
}
