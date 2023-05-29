import { createApp, markRaw } from 'vue'
import router from './router'
import App from './App.vue'
import './index.css'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

//state management library
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

export default createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      }
    },
  })

//create a pinia root store
const pinia = createPinia();
//pinia should be able to use router - has to be setup as plugin
pinia.use(piniaPluginPersistedState)
pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

createApp(App).use(pinia).use(vuetify).use(router).mount('#app')
