import { createApp, markRaw } from 'vue';
import axios from 'axios';
import { createI18n } from 'vue-i18n';


// Setting the token as a default header if it exists in localStorage
if (localStorage.getItem('token')) {
    axios.defaults.headers.common['token'] = localStorage.getItem('token');
}


import router from './router';
import App from './App.vue';
import './index.css';
import screenSizeMixin from './responsiveDesign/responsive.js';
import './responsiveDesign/responsiveStyles.css';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
// Import Spanish translation file
import esTranslation from '@/assets/i18n/es.json';

// state management library
import { createPinia } from 'pinia';

// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';


const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      }
    },
});




// create a pinia root store
const pinia = createPinia();
// pinia should be able to use router - has to be set up as a plugin
pinia.use(piniaPluginPersistedState)
pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

// Setting up vue3-toastify
import Vue3Toastify from 'vue3-toastify';


// Create vue-i18n instance
const i18n = createI18n({
  locale: 'en',  // Set the initial locale to English
  messages: {
    es: esTranslation // Spanish translations
  },
  silentTranslationWarn: true,  // Suppress warnings for missing translations
  fallbackLocale: 'en'
});


const app = createApp(App);

app.mixin(screenSizeMixin);

app.use(Vue3Toastify, {
    autoClose: 5000,
    style: {
      opacity: '1',
      userSelect: 'initial',
    },
});
app.use(pinia);
app.use(vuetify);
app.use(router);
app.use(i18n); 
app.mount('#app');
