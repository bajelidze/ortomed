import { setSettingsHandlers } from '@/api/settings';
import { setPatientHandlers } from '@/api/patient';
import { setDoctorHandlers } from '@/api/doctor';
import { setAvailabilityHandlers } from '@/api/availability';
import { setCourseHandlers } from '@/api/course';
import { setActivityHandlers } from '@/api/activity';
import { setCourseActivityHandlers } from '@/api/courseActivity';
import { setSessionHandlers } from '@/api/session';
import { setLocaleHandlers } from '@/api/locale';

export function setHandlers() {
  setSettingsHandlers();
  setPatientHandlers();
  setDoctorHandlers();
  setAvailabilityHandlers();
  setCourseHandlers();
  setActivityHandlers();
  setCourseActivityHandlers();
  setLocaleHandlers();
  setSessionHandlers();
}
