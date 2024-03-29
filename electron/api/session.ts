import { ipcMain } from 'electron';
import db from '@/common/db';
import { Scheduler } from '@/modules/scheduler/scheduler';
import { PatientDao } from '@/modules/actors/patient';
import { DoctorDao } from '@/modules/actors/doctor';
import { CourseDao } from '@/modules/course/course';
import { Session } from '@/modules/scheduler/session';
import { DateTime } from 'luxon';
import { AddScheduleFields } from '../../common/fields';
import { Session as SessionE } from '../api/endpoints/endpoints';
import { Session as SessionI } from '../../common/interfaces';

export function setSessionHandlers() {
  ipcMain.handle(SessionE.SCHEDULE, async (_, req: AddScheduleFields): Promise<SessionI[]> => {
    const scheduler = new Scheduler(db);

    const doctor = await new DoctorDao(db).getById(req.doctorId);
    const patient = await new PatientDao(db).getById(req.patientId);
    const course = await new CourseDao(db).getById(req.courseId);
    const startTime = DateTime.fromISO(req.startTime);

    const sessions = await scheduler.scheduleCourse(doctor, patient, course, startTime);

    const formattedSessions = formatSessions(sessions);

    for (const session of formattedSessions) {
      console.log(session);
    }

    return formattedSessions;
  });
}

function formatSessions(sessions: Session[]): SessionI[] {
  return sessions.map(session => {
    const start = session.interval?.start?.toUnixInteger();
    const end = session.interval?.end?.toUnixInteger();

    if (start == undefined) {
      throw Error('start is undefined');
    } else if (end == undefined) {
      throw Error('end is undefined');
    }

    return {
      id: session.id,
      doctorId: session.doctorId,
      patientId: session.patientId,
      courseActivityId: session.courseActivityId,
      interval: {
        start: start,
        end: end,
      },
    };
  });
}
