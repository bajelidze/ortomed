// @ts-ignore
import App from './App.vue';
// @ts-ignore
import vuetify from './plugins/vuetify';
import { createApp } from 'vue';
import './style.css';
import router from './router/router';
import { DateTime } from 'luxon';

// await window.api.patient.commit();

// const patients = await window.api.listPatients();

// for (const patient of patients) {
//   console.log(patient.name);
// }

const app = createApp(App);

// for (const patient of patients) {
//   console.log(patient.dateAdded.toUnixInteger());
// }

app.use(vuetify)
  .use(router)
  .mount('#app')
  .$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));

app.config.globalProperties.$luxonDateTime = DateTime;
