<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">
        <v-row class="mb-n4">
          <!-- Spacer to push switch to the end -->
          <v-col class="flex-grow-1"></v-col>
          <!-- Language toggle -->
          <v-col cols="auto">
            <v-switch
              v-model="language"
              inset
              hide-details
              color="red-800"
              @change="changeLanguage"
              prepend-icon="mdi-translate"
              :label="language ? 'ES' : 'EN'"
              class="switch-container"
            ></v-switch>
          </v-col>
        </v-row>
        
        <v-card class="pa-5 mb-12" :class="{'fill-height': $vuetify.display.xs}" :elevation="$vuetify.display.xs ? 0 : 8">
          <v-tabs 
            v-model="tab" 
            centered 
            grow
            density="comfortable"
            slider-color="red-800"
          >
            <v-tab @click="changeRoute('/testLogin')" value="testLogin">
              <span class="font-semibold text-red-800">{{ $t('Login') }}</span>
            </v-tab>
            <v-tab @click="changeRoute('/testRegister')" value="testRegister">
              <span class="font-semibold text-red-800">{{$t('Register')}}</span>
            </v-tab>
          </v-tabs>
  
          <router-view 
            v-slot="{ Component }" 
            @navigateTo="changeRoute"
          >
            <v-expand-transition>
                <component :is="Component" />
            </v-expand-transition>
          </router-view>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

  

  




<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import LoginForm from "@/components/loginPages/testLogin.vue";
import VerifyNew from "@/components/loginPages/testVerifyNew.vue";
import RegisterForm from "@/components/loginPages/testRegister.vue";

export default {
  name: "Login",
  emits: ["showDashboard"],
  components: {
    LoginForm,
    VerifyNew,
    RegisterForm,
  },
  data() {
    return {
      tab: 'testLogin',
      forgotPassword: null,
      forgotPasswordColor: null,
      language: false // false for English, true for Spanish
    };
  },
  mounted() {
      this.language = this.$i18n.locale === 'es';
  },
  setup() {
    const store = useLoggedInUserStore()
    return {
      store,
    }
  },
  watch: {
    // Watch the route and update the tab accordingly
    '$route.path': {
      immediate: true, // Execute the handler function immediately upon registration
      handler(newValue) {
        if (newValue === '/testLogin') {
          this.tab = 'testLogin';
        } else if (newValue === '/testRegister') {
          this.tab = 'testRegister';
        }
      }
    }
  },
  methods: {
    async login() {
      try {
        // Attempt to login
        await this.store.login(this.email, this.password);
        // After successful login, check if the user has completed forms
        await this.store.checkFormCompletion();
      } catch (error) {
        console.log(error);
      }
    },
    changeRoute(payload) {
      if (typeof payload === 'string') {
        // For simple string routes (backward compatibility)
        this.$router.push(payload);
      } else if (payload && payload.routeName && payload.userID) {
        // Payload is an object containing the routeName and userID
        this.$router.push({
          name: payload.routeName, // use the route's name
          params: { userID: payload.userID } // passing userID as a route parameter
        });
      }
    },
    changeLanguage() {
      if (this.language) {
        // set the app to Spanish
        this.$i18n.locale = 'es';
      } else {
        // set the app to English
        this.$i18n.locale = 'en';
      }
    },

  },
};
</script>

<style scoped>
.switch-container {
  transform: scale(0.7);
}

.v-input__prepend .mdi-translate {
    /* Adjust the top value to move the icon up or down */
    top: 0; 
    /* Adjust the left value to move the icon left or right */
    left: 0; 
    position: relative;
}

.card-spacing {
  margin-bottom: 50px; /* Adjust this value based on your requirements */
}

</style>
