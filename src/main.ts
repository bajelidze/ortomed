// @ts-ignore
import App from './App.vue';
// @ts-ignore
import vuetify from './plugins/vuetify';
import { createApp } from 'vue';
import './style.css';
import router from './router/router';

// await window.api.patient.commit();

const patients = await window.api.listPatients();

for (const patient of patients) {
  console.log(patient.name);
}

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
  .$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));

