import { setSettingsHandlers } from '@/api/settings';
import { setPatientHandlers } from '@/api/patient';
import { setDoctorHandlers } from '@/api/doctor';
import { setLocaleHandlers } from '@/api/locale';

export function setHandlers() {
  setSettingsHandlers();
  setPatientHandlers();
  setDoctorHandlers();
  setLocaleHandlers();
}
