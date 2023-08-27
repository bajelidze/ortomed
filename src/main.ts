// @ts-ignore
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { createApp } from 'vue';
import './style.css';
import router from './router/router';
import { DateTime } from 'luxon';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')
  .$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));

app.config.globalProperties.$luxonDateTime = DateTime;
