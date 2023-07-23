import { createApp } from 'vue';
import './style.css';

// @ts-ignore
import App from './App.vue';
// @ts-ignore
import vuetify from './plugins/vuetify';

// const patient = new window.api.Patient({name: 'Irakli'});

// window.api.log.info('Patient:', patient.name);
console.log(window.api.hello);

// const information = document.getElementById('info');
// if (information == null) {
//   throw Error('information is null');
// }
// information.innerText = `Activity name: ${patient.name}`;
// throw new Error('xddd');

createApp(App).use(vuetify).mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));

