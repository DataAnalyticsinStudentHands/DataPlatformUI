<!--
mainAuthWrap.vue - Authentication Wrapper Component

This component serves as the main authentication container that provides tab navigation
between login and registration forms. It includes language switching functionality
between English and Spanish, and manages routing between different authentication views.
The component uses a card-based layout with expandable transitions for smooth view changes.
-->

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto pt-5">
        
        <!-- Main Card with Login/Register tabs -->
        <v-card class="pa-5 mb-12" :class="{'fill-height': $vuetify.display.xs}" :elevation="$vuetify.display.xs ? 0 : 8">
          
          <!-- Tabs for Login and Register, switching between routes -->
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
          <!-- Language Toggle Switch -->
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

          <!-- Router View to load either Login or Register components dynamically -->
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
  components: {
    LoginForm,
    VerifyNew,
    RegisterForm,
  },
  data() {
    // Component state for tab navigation and language preference
    return {
      tab: 'login',
      forgotPassword: null,
      forgotPasswordColor: null,
      language: false // false for English, true for Spanish
    };
  },
  mounted() {
    // Set initial language state based on current locale
    this.language = this.$i18n.locale === 'es';
  },
  setup() {
    // Initialize the user store for authentication state management
    const store = useLoggedInUserStore()
    return {
      store,
    }
  },
  watch: {
    // Synchronize tab selection with route changes
    '$route.path': {
      immediate: true,
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
    // Attempts to log in the user with provided credentials and checks form completion status
    async login() {
      try {
        await this.store.login(this.email, this.password);
        await this.store.checkFormCompletion();
      } catch (error) {
        this.handleError(error);
      }
    },

    // Navigates to different routes, supporting both string routes and object payloads with userID
    changeRoute(payload) {
      if (typeof payload === 'string') {
        this.$router.push(payload);
      } else if (payload && payload.routeName && payload.userID) {
        useLoggedInUserStore().navigationData = {
          userID: payload.userID
        };

        this.$router.push({
          name: payload.routeName
        });
      }
    },

    // Toggles the application's language between English and Spanish
    changeLanguage() {
      if (this.language) {
        this.$i18n.locale = 'es';
      } else {
        this.$i18n.locale = 'en';
      }
    },

  },
};
</script>

<style scoped>
/* Scale down the language switch for compact appearance */
.switch-container {
  transform: scale(0.7);
}

/* Position adjustment for translation icon */
.v-input__prepend .mdi-translate {
    top: 0; 
    left: 0; 
    position: relative;
}

/* Bottom spacing for card layout */
.card-spacing {
  margin-bottom: 50px;
}

</style>