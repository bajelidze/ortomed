import { contextBridge, ipcRenderer } from 'electron';
import { LocaleFile } from '../../common/enums';
import { SettingsValue } from '../../common/interfaces';
import {
  AddPatientFields, AddDoctorFields, AddCourseFields,
  AddScheduleFields,
} from '../../common/fields';
import {
  FormattedPatient, FormattedDoctor, FormattedCourse,
  Activity, Session, CourseActivity,
} from '../../common/interfaces';
import {
  Settings, Patients, Doctors,
  Availability, Courses, Locale,
  Activity as ActivityE,
  CourseActivity as CourseActivityE,
  Session as SessionE,
} from '../api/endpoints/endpoints';

export const API = {
  settings: {
    async get(): Promise<SettingsValue> {
      return await ipcRenderer.invoke(Settings.GET);
    },
    async set(settings: SettingsValue) {
      return await ipcRenderer.invoke(Settings.SET, settings);
    },
  },
  patients: {
    async list(limit: number, offset: number): Promise<FormattedPatient[]> {
      return await ipcRenderer.invoke(Patients.LIST, limit, offset);
    },
    async listAll(): Promise<FormattedPatient[]> {
      return await ipcRenderer.invoke(Patients.LIST_ALL);
    },
    async get(...id: number[]): Promise<FormattedPatient[]> {
      return await ipcRenderer.invoke(Patients.GET, id);
    },
    async add(patient: AddPatientFields) {
      return await ipcRenderer.invoke(Patients.ADD, patient);
    },
    async delete(id: number) {
      return await ipcRenderer.invoke(Patients.DELETE, id);
    },
  },
  doctors: {
    async list(limit: number, offset: number): Promise<FormattedDoctor[]> {
      return await ipcRenderer.invoke(Doctors.LIST, limit, offset);
    },
    async listAll(): Promise<FormattedDoctor[]> {
      return await ipcRenderer.invoke(Doctors.LIST_ALL);
    },
    async get(...id: number[]): Promise<FormattedDoctor[]> {
      return await ipcRenderer.invoke(Doctors.GET, id);
    },
    async add(doctor: string) {
      return await ipcRenderer.invoke(Doctors.ADD, JSON.parse(doctor) as AddDoctorFields);
    },
    async delete(id: number) {
      return await ipcRenderer.invoke(Doctors.DELETE, id);
    },
  },
  availability: {
    // async listAll(doctorID: number): Promise<WeekdayInterval[]> {
    //   return await ipcRenderer.invoke(Availability.LIST_ALL, doctorID);
    // },
    // async add(availabilities: AddAvailabilityFields[]) {
    //   return await ipcRenderer.invoke(Availability.ADD, availabilities);
    // },
    async delete(id: number) {
      return await ipcRenderer.invoke(Availability.DELETE, id);
    },
  },
  courses: {
    async list(limit: number, offset: number): Promise<FormattedCourse[]> {
      return await ipcRenderer.invoke(Courses.LIST, limit, offset);
    },
    async listAll(): Promise<FormattedCourse[]> {
      return await ipcRenderer.invoke(Courses.LIST_ALL);
    },
    async get(...id: number[]): Promise<FormattedCourse[]> {
      return await ipcRenderer.invoke(Courses.GET, id);
    },
    async add(course: string) {
      return await ipcRenderer.invoke(Courses.ADD, JSON.parse(course) as AddCourseFields);
    },
    async delete(id: number) {
      return await ipcRenderer.invoke(Courses.DELETE, id);
    },
  },
  activity: {
    async listAll(): Promise<Activity[]> {
      return await ipcRenderer.invoke(ActivityE.LIST_ALL);
    },
    async get(...id: number[]): Promise<Activity[]> {
      return await ipcRenderer.invoke(ActivityE.GET, id);
    },
    async add(activities: Activity[]): Promise<number[]> {
      return await ipcRenderer.invoke(ActivityE.ADD, activities);
    },
    async delete(id: number) {
      return await ipcRenderer.invoke(ActivityE.DELETE, id);
    },
  },
  courseActivity: {
    async get(...id: number[]): Promise<CourseActivity[]> {
      return await ipcRenderer.invoke(CourseActivityE.GET, id);
    },
  },
  session: {
    async schedule(schedule: AddScheduleFields): Promise<Session[]> {
      return await ipcRenderer.invoke(SessionE.SCHEDULE, schedule);
    },
    async submit(sessionsJSON: string): Promise<void> {
      return await ipcRenderer.invoke(SessionE.SUBMIT, sessionsJSON);
    },
  },
  locale: {
    async readFile(fileName: LocaleFile): Promise<string> {
      return await ipcRenderer.invoke(Locale.READ_FILE, fileName);
    },
  },
};

declare global {
  interface Window {api: typeof API}
}

export function exposeAPI() {
  contextBridge.exposeInMainWorld('api', API);
}
