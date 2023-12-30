import { Schedule, CourseActivity } from './interfaces';

export interface AddPatientFields {
  name: string;
}

export interface AddDoctorFields {
  name: string;
  schedule: Schedule[];
}

export interface AddCourseFields {
  name: string;
  description: string;
  repetitions: number;
  courseActivities: CourseActivity[];
}
