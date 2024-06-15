import {
  Session, WithID, CourseActivity,
  Activity, FormattedCourse, FormattedDoctor,
  FormattedPatient,
} from '../../../../../../common/interfaces';
import { Event } from '../../../../../common/interfaces';
import { DateTime } from 'luxon';

type ItemMap<T> = Record<number, T>

export async function sessionsToEvents(sessions: Session[]): Promise<Event[]> {
  const events: Event[] = [];

  if (sessions.length == 0) {
    return events;
  }

  const courseActivitiesArr = await window.api.courseActivity.get(...sessions.map(sess => sess.courseActivityId as number));

  const coursesArr = await window.api.courses.get(...courseActivitiesArr.map(ca => ca.courseId as number));
  const activitiesArr = await window.api.activity.get(...courseActivitiesArr.map(ca => ca.activityId as number));
  const patientsArr = await window.api.patients.get(...sessions.map(sess => sess.patientId as number));
  const doctorsArr = await window.api.doctors.get(...sessions.map(sess => sess.doctorId as number));

  let courseActivities, courses, activities, patients, doctors;

  try {
    courseActivities = itemsToMap(courseActivitiesArr);
  } catch (e) {
    throw Error(`couldn't create courses map: ${e}`);
  }

  try {
    courses = itemsToMap(coursesArr);
  } catch (e) {
    throw Error(`couldn't create courses map: ${e}`);
  }

  try {
    activities = itemsToMap(activitiesArr);
  } catch (e) {
    throw Error(`couldn't create activities map: ${e}`);
  }

  try {
    patients = itemsToMap(patientsArr);
  } catch (e) {
    throw Error(`couldn't create patients map: ${e}`);
  }

  try {
    doctors = itemsToMap(doctorsArr);
  } catch (e) {
    throw Error(`couldn't create doctors map: ${e}`);
  }

  for (const sess of sessions) {
    const event = sessionToEvent(courseActivities, courses, activities, patients, doctors, events, sess);
    if (event == null) {
      continue;
    }

    events.push(event);
  }

  return events;
}

// sessionToEvent converts a session to an event.
// Returns null if the session fails validation.
function sessionToEvent(
  courseActivities: ItemMap<CourseActivity>,
  courses: ItemMap<FormattedCourse>,
  activities: ItemMap<Activity>,
  patients: ItemMap<FormattedPatient>,
  doctors: ItemMap<FormattedDoctor>,
  events: Event[],
  sess: Session,
): Event|null {
  const courseActivity = courseActivities[sess.courseActivityId as number];
  const course = courses[courseActivity.courseId as number];
  const activity = activities[courseActivity.activityId as number];
  const patient = patients[sess.patientId as number];
  const doctor = doctors[sess.doctorId as number];

  if (courseActivity == undefined || course == undefined ||
     activity == undefined || patient == undefined ||
     doctor == undefined) {
    console.log(`Skipping session with id ${sess.id} with non-existent field with id ${sess.patientId}`);
    return null;
  }

  for (const event of events) {
    if (event.start == sess.interval.start.toString()
        && event.end == sess.interval.end.toString()) {
      event.people?.push(patient.name);
      return null;
    }
  }

  const start = DateTime.fromSeconds(sess.interval.start);
  const end = DateTime.fromSeconds(sess.interval.end);

  return {
    id: sess.id as number,
    start: start.toFormat('yyyy-MM-dd HH:mm'),
    end: end.toFormat('yyyy-MM-dd HH:mm'),
    title: formatTitle(activity.name, course.name),
    people: [patient.name],
    calendarId: doctor.id?.toString(),
  } as Event;
}

function itemsToMap<T extends WithID>(items: T[]): Record<number, T> {
  const map: Record<number, T> = {};

  for (const item of items) {
    if (item.id == undefined) {
      throw Error('itemsToMap: item id is undefined');
    } else if (item.id in map) {
      throw Error('itemsToMap: duplicate item ids');
    }

    map[item.id] = item;
  }

  return map;
}

function formatTitle(activityName: string, courseName: string): string {
  return `${activityName} (${courseName})`;
}
