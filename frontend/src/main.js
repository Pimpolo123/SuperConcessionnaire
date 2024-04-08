import App from './App.vue';
import { createApp } from 'vue';
import { router } from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import materialKit from "./material-kit";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PrimeVue from 'primevue/config';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faEye
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt, faEye);

const app = createApp(App);
app.use(router);
app.use(materialKit);
app.use(PrimeVue);
app.use(store);
// app.use(VeeValidate);
app.mount('#app');