import { createApp } from 'vue'
import { createStore } from 'vuex'
import router from './router'
import App from './App.vue'
import './index.css'

//Vuex store
const store = createStore({
    state() {
        return {
            windowWidth: 9999,
            isResponsive: false
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
