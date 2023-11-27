<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto pt-5">
        
        <v-card class="pa-5 mb-12" :class="{'fill-height': $vuetify.display.xs}" :elevation="$vuetify.display.xs ? 0 : 8">
          
          <v-tabs 
            v-model="tab" 
            centered 
            grow
            density="comfortable"
            slider-color="custom-red"
          >
            <v-tab @click="changeRoute('/login')" value="login">
              <span class="font-semibold text-custom-red">{{ $t('Login') }}</span>
            </v-tab>
            <v-tab @click="changeRoute('/register')" value="register">
              <span class="font-semibold text-custom-red">{{$t('Register')}}</span>
            </v-tab>
          </v-tabs>
          <v-row class="mb-n4 align-center justify-end">
            <!-- Language toggle -->
            <v-col cols="auto" class="pt-3 pb-0 pr-1">
              <v-switch
                density="compact"
                v-model="language"
                inset
                hide-details
                color="custom-red"
                @change="changeLanguage"
                label="ES"
                class="switch-container"
              ></v-switch>
            </v-col>
          </v-row>

          
  
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
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import LoginForm from "@/components/loginPages/login.vue";
import VerifyNew from "@/components/loginPages/accountRegistration/verifyAccWithCode.vue";
import RegisterForm from "@/components/loginPages/accountRegistration/register.vue";

export default {
  name: "mainAuthWrap",
  emits: ["showDashboard"],
  components: {
    LoginForm,
    VerifyNew,
    RegisterForm,
  },
  data() {
    return {
      tab: 'login',
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
        if (newValue === '/login') {
          this.tab = 'login';
        } else if (newValue === '/register') {
          this.tab = 'register';
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
        this.handleError(error);
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
