import { setSettingsHandlers } from '@/api/settings';
import { setPatientHandlers } from '@/api/patient';
import { setDoctorHandlers } from '@/api/doctor';
import { setAvailabilityHandlers } from '@/api/availability';
import { setCourseHandlers } from '@/api/course';
import { setLocaleHandlers } from '@/api/locale';

export function setHandlers() {
  setSettingsHandlers();
  setPatientHandlers();
  setDoctorHandlers();
  setAvailabilityHandlers();
  setCourseHandlers();
  setLocaleHandlers();
}
