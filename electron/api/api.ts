import { setPatientHandlers } from '@/api/patient';
import { setLocaleHandlers } from '@/api/locale';
import { setSettingsHandlers } from '@/api/settings';

export function setHandlers() {
  setSettingsHandlers();
  setPatientHandlers();
  setLocaleHandlers();
}
