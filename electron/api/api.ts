import { setPatientHandlers } from '@/api/patient';
import { setLocaleHandlers } from '@/api/locale';

export function setHandlers() {
  setPatientHandlers();
  setLocaleHandlers();
}
