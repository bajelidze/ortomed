const patientsPrefix = 'patients';

export enum Patients {
  LIST = patientsPrefix + 'List',
  LIST_ALL = patientsPrefix + 'ListAll',
  ADD = patientsPrefix + 'Add',
  DELETE = patientsPrefix + 'Delete',
}

const localePrefix = 'locale';

export enum Locale {
  READ_FILE = localePrefix + 'ReadFile'
}
