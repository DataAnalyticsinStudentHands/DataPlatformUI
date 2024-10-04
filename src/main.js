import { createApp, markRaw } from 'vue';
import axios from 'axios';
import handleErrorMixin from './mixins/handleErrorMixin';
import { i18n } from './plugins/i18n';
import { useLoggedInUserStore } from './stored/loggedInUser';


// Setting the token as a default header if it exists in localStorage
if (localStorage.getItem('token')) {
  axios.defaults.headers['token'] = localStorage.getItem('token');
}


import router from './router';
import App from './App.vue';
import './index.css';

// state management library
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; 

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
pinia.use(piniaPluginPersistedstate);

// pinia should be able to use router - has to be set up as a plugin
pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

// Setting up vue3-toastify
import Vue3Toastify from 'vue3-toastify';

const app = createApp(App);

app.mixin(handleErrorMixin);

app.use(Vue3Toastify, {
    autoClose: 5000,
    style: {
      opacity: '1',
      userSelect: 'initial',
    },
});
app.use(pinia);

const userStore = useLoggedInUserStore();

async function initialize() {
  await userStore.initializeStore();
}
initialize();

app.use(vuetify);
app.use(router);
app.use(i18n); 
app.mount('#app');
