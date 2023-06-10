import { createApp } from 'vue';
import './style.css';

// @ts-ignore
import App from './App.vue';
// @ts-ignore
import vuetify from './plugins/vuetify';

// const information = document.getElementById('info');
// information.innerText = `Activity name: ${window.api.activity.name}`;

createApp(App).use(vuetify).mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));
