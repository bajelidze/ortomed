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
  WEEKLY_SCHEDULE: string;
  HOLIDAYS: string;
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

interface Courses {
  COURSES: string;
  ADD_COURSE: string;
}

interface Strings {
  common: Common;
  patients: Patient;
  doctors: Doctors;
  courses: Courses;
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
