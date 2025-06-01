import { createApp } from 'vue';
import app from './App.vue';
import route from './route.js';
import store from './store/mainStore.js';
import i18n from './plugins/i18n.js';
import primeVue from './plugins/tablePrime.js';
import toastPrime from './plugins/toastPrime.js';
import { setToastInstance } from './plugins/toast.js';



const vuejs = createApp(app);

vuejs.use(primeVue);
vuejs.use(toastPrime)
vuejs.use(i18n);
vuejs.use(store);
vuejs.use(route);
setToastInstance(vuejs.config.globalProperties.$toast);
vuejs.mount('#app');

