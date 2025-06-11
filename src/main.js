/**
 * src/main.js
 * 
 * Main entry point for the Vue application. This file initializes the Vue app with all necessary
 * plugins and configurations including Vuetify for UI components, Pinia for state management,
 * Vue Router for navigation, i18n for internationalization, and axios for HTTP requests.
 * The app initialization is deferred until the user store is properly initialized.
 */

// Core Vue and utility imports
import { createApp, markRaw } from 'vue';
import axios from 'axios';
import handleErrorMixin from './mixins/handleErrorMixin';
import { i18n } from './plugins/i18n';
import { useLoggedInUserStore } from './stored/loggedInUser';

// Configure axios default headers with authentication token if available
if (localStorage.getItem('token')) {
  axios.defaults.headers['token'] = localStorage.getItem('token');
}

import router from './router';
import App from './App.vue';
import './index.css';

// Pinia state management imports
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Vuetify UI framework imports
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Initialize Vuetify with Material Design Icons
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

// Initialize Pinia store with persistence plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Enable router access within Pinia stores
pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

// Toast notification imports
import Vue3Toastify from 'vue3-toastify';

// Create and configure Vue application instance
const app = createApp(App);
app.mixin(handleErrorMixin);

// Configure toast notifications with default settings
app.use(Vue3Toastify, {
  autoClose: 5000,
  multiple: true,
  style: {
    opacity: '1',
    userSelect: 'initial',
  },
});

// Register Vue plugins
app.use(pinia);
app.use(vuetify);
app.use(router);
app.use(i18n);

// Initialize user store before mounting the application
async function initApp() {
  const userStore = useLoggedInUserStore();
  await userStore.initializeStore();
  app.mount('#app');
}

initApp();