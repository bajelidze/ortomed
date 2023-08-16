import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import ActorsView from '../views/ActorsView.vue';
// @ts-ignore
import DoctorsView from '../views/DoctorsView.vue';

const routes = [
  {
    path: '/actors',
    name: 'Actors',
    component: ActorsView,
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
