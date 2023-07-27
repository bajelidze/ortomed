import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import PatientsView from '../views/PatientsView.vue';
// @ts-ignore
import DoctorsView from '../views/DoctorsView.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
