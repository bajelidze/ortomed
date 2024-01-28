import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import PatientsView from '../views/PatientsView.vue';
// @ts-ignore
import DoctorsView from '../views/DoctorsView.vue';
// @ts-ignore
import CoursesView from '../views/CoursesView.vue';
// @ts-ignore
import SchedulerView from '../views/SchedulerView.vue';

const routes = [
  {
    path: '/',
    name: 'Main',
    component: PatientsView,
  },
  {
    path: '/patients',
    name: 'Patients',
    component: PatientsView,
  },
  {
    path: '/doctors',
    name: 'Doctors',
    component: DoctorsView,
  },
  {
    path: '/courses',
    name: 'Courses',
    component: CoursesView,
  },
  {
    path: '/scheduler',
    name: 'Scheduler',
    component: SchedulerView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
