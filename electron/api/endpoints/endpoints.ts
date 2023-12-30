const patientsPrefix = 'patients';

export enum Patients {
  LIST = patientsPrefix + 'List',
  LIST_ALL = patientsPrefix + 'ListAll',
  ADD = patientsPrefix + 'Add',
  DELETE = patientsPrefix + 'Delete',
}

const doctorsPrefix = 'doctors';

export enum Doctors {
  LIST = doctorsPrefix + 'List',
  LIST_ALL = doctorsPrefix + 'ListAll',
  ADD = doctorsPrefix + 'Add',
  DELETE = doctorsPrefix + 'Delete',
}

const availabilityPrefix = 'availability';

export enum Availability {
  LIST_ALL = availabilityPrefix + 'ListAll',
  ADD = availabilityPrefix + 'Add',
  DELETE = availabilityPrefix + 'Delete',
}

const coursePrefix = 'course';

export enum Courses {
  LIST = coursePrefix + 'List',
  LIST_ALL = coursePrefix + 'ListAll',
  ADD = coursePrefix + 'Add',
  DELETE = coursePrefix + 'Delete',
}

const activityPrefix = 'activity';

export enum Activity {
  LIST_ALL = activityPrefix + 'ListAll',
  ADD = activityPrefix + 'Add',
  DELETE = activityPrefix + 'Delete',
}

const courseActivityPrefix = 'courseActivity';

export enum CourseActivity {
  LIST_ALL = courseActivityPrefix + 'ListAll',
  ADD = courseActivityPrefix + 'Add',
  DELETE = courseActivityPrefix + 'Delete',
}

const localePrefix = 'locale';

export enum Locale {
  READ_FILE = localePrefix + 'ReadFile',
}

const settingsPrefix = 'settings';

export enum Settings {
  GET = settingsPrefix + 'GET',
  SET = settingsPrefix + 'SET',
}
