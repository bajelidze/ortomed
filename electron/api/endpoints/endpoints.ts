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

const localePrefix = 'locale';

export enum Locale {
  READ_FILE = localePrefix + 'ReadFile',
}

const settingsPrefix = 'settings';

export enum Settings {
  GET = settingsPrefix + 'GET',
  SET = settingsPrefix + 'SET',
}
