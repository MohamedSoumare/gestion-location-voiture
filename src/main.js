import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPersistedState from 'pinia-plugin-persistedstate';
// import 'vue-toastification/dist/index.css';

import router from "./router";
import { createI18n } from "vue-i18n";
import axios from "axios"

import english from "./translate/english.json";
import french from "./translate/french.json";


import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import '@fortawesome/fontawesome-free/css/all.css';
import FullCalendar from '@fullcalendar/vue3'

// Configurer i18n pour la gestion des langues
const i18n = createI18n({
  locale: "fr", // Langue par défaut
  fallbackLocale: "en", // Langue de repli
  messages: {
    en: english,
    fr: french,
  },
});

// Créer l'application Vue
const app = createApp(App);

// Utiliser Pinia, i18n, et le routeur
const pinia = createPinia();
pinia.use(piniaPersistedState);
app.use(pinia);
app.use(i18n);
app.use(router);
app.use(axios);
app.use(FullCalendar)
// app.use(Toast,{
//   position: 'top-right',
//   timeout: 5000,
//   closeOnClick: true,
// });
// Monter l'application
app.mount("#app");
