import { LocaleFile as enumsLocaleFile } from '../../common/enums';

interface FileContent {
  lang: LocaleFile;
  strings: Strings;
}

interface Common {
  NAME: string;
  DATE_ADDED: string;
  INDICATES_REQUIRED_FIELD: string;
  SUBMIT: string;
  CANCEL: string;
  ADD: string;
  LOADING: string;
  ACTORS: string;
  ACTIONS: string;
}

interface Patient {
  PATIENTS: string;
  ADD_PATIENT: string;
  NO_PATIENTS: string;
}

interface Doctors {
  DOCTORS: string;
  ADD_DOCTOR: string;
  NO_DOCTORS: string;
}

interface Holidays {
  HOLIDAYS: string;
  ADD_HOLIDAY: string;
}

interface Availability {
  WEEKLY_SCHEDULE: string;
  ADD_AVAILABILITY: string;
}

interface Courses {
  COURSES: string;
  ADD_COURSE: string;
}

interface Strings {
  common: Common;
  patients: Patient;
  doctors: Doctors;
  courses: Courses;
  holidays: Holidays;
  availability: Availability;
}

export import LocaleFile = enumsLocaleFile;

const fileCache: { [key: string]: Strings } = {};

export async function readFile(fileName: LocaleFile): Promise<Strings> {
  if (fileName in fileCache) {
    return fileCache[fileName];
  }

  const fileStr = await window.api.locale.readFile(fileName);
  const file = JSON.parse(fileStr) as FileContent;

  fileCache[fileName] = file.strings;

  return file.strings;
}
