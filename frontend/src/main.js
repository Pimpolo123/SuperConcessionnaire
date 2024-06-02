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
import './assets/themes/themes/mytheme/theme.scss';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faEye,
  faUserTie,
  faHeart,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt, faEye, faUserTie, faHeart, faEnvelope);

document.app = createApp(App);
document.app.use(router);
document.app.use(PrimeVue);
document.app.use(ToastService);
document.app.use(ConfirmationService);
document.app.use(store);
document.app.directive('tooltip', Tooltip);
document.app.use(materialKit);
document.app.mount('#app');