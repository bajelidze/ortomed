import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import PatientsView from '../views/PatientsView.vue';
// @ts-ignore
import DoctorsView from '../views/DoctorsView.vue';
// @ts-ignore
import CoursesView from '../views/CoursesView.vue';

const routes = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
