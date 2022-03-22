import { createApp } from 'vue'
import { createStore } from 'vuex'
import router from './router'
import App from './App.vue'
import './assets/tailwind.css'

//Vuex store
const store = createStore({
    state() {
        return {
            windowWidth: 9999,
            isResponsive: false,
            ipAddress: '192.168.4.100'
        }
    },
    mutations: {
        updateWindowWidth(state, width) {
            state.windowWidth = width;
            if (width < 900) {
                state.isResponsive = true;
            } else {
                state.isResponsive = false;
            }
        }

    }
})

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
