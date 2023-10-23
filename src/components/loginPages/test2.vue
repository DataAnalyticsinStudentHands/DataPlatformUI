<template>
    <v-row justify="center" class="mt-5" :class="{'fill-height': $vuetify.display.xs}">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="pa-5 fill-height" :elevation="$vuetify.display.xs ? 0 : 8">
          <v-tabs 
            v-model="tab" 
            centered 
            grow
            density="comfortable"
            slider-color="red-800"
          >
            <v-tab value="login">
              <span class="font-semibold text-red-800">Login</span>
            </v-tab>
            <v-tab value="register">
              <span class="font-semibold text-red-800">Register</span>
            </v-tab>
          </v-tabs>

          <v-window
            v-model="tab"
          >
            <v-window-item
                value="login"
            >
              <LoginForm :tab="tab" @change-tab="handleChangeTab"/>
            </v-window-item>
            <v-window-item
                value="register"
            >
                Hello
            </v-window-item>
            <v-window-item
                value="verify"
            >
                Verify Account
            </v-window-item>
            <v-window-item
                value="resetPass"
            >
                Reset Password Form
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </template>
  




<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import LoginForm from "@/components/loginPages/testLogin.vue";

export default {
  name: "Login",
  emits: ["showDashboard"],
  components: {
    LoginForm
  },
  data() {
    return {
      tab: 'login',
      forgotPassword: null,
      forgotPasswordColor: null,
    };
  },
  mounted() {
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
  },
  setup() {
    const store = useLoggedInUserStore()
    return {
      store,
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
    handleChangeTab(value) {
      this.tab = value;
    }
  },
};
</script>