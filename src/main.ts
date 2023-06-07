import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// @ts-ignore
import vuetify from './plugins/vuetify';

createApp(App).use(vuetify).mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));
