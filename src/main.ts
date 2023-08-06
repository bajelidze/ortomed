// @ts-ignore
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { createApp } from 'vue';
import './style.css';
import router from './router/router';
import { DateTime } from 'luxon';

const app = createApp(App);

app.use(vuetify)
  .use(router)
  .mount('#app')
  .$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));

app.config.globalProperties.$luxonDateTime = DateTime;
