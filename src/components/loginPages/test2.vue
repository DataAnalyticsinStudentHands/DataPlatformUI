<template>
    <v-row justify="center" class="mt-5" :class="{'fill-height': $vuetify.display.xs}">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="pa-5 pt-10 fill-height" color="">
          <v-tabs v-model="activeTab" centered grow>
            <v-tab key="login">Login</v-tab>
            <v-tab key="register">Register</v-tab>
          </v-tabs>
      
          <v-tabs-items v-model="activeTab">
            <v-tab-item key="login">
              <v-card-text>
                <h2>Welcome to Data & Society</h2>
      
                <v-text-field
                  label="Email:"
                  v-model="email"
                  prepend-icon="mdi-email"
                  outlined
                ></v-text-field>
      
                <v-text-field
                  label="Password:"
                  type="password"
                  v-model="password"
                  prepend-icon="mdi-lock"
                  outlined
                ></v-text-field>
      
                <v-btn
                  text
                  :color="forgotPasswordColor"
                  @click="forgotPassword"
                >Forgot Your Password?</v-btn>
      
                <v-btn
                  color="primary"
                  class="mt-3"
                  @click="login"
                >Login</v-btn>
              </v-card-text>
            </v-tab-item>
      
            <v-tab-item key="register">
              <!-- Register content goes here -->
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </template>
  




<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
  name: "Login",
  emits: ["showDashboard"],
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  mounted() {
    console.log(this.$route.params);
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
      // you can return the whole store instance to use it in the template
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
    }
  },
};
</script>
