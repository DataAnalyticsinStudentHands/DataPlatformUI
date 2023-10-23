<template>
  <div>
    <v-card-text>
      <h2 class="font-bold text-2xl text-red-700 tracking-widest text-center mt-3 mb-5">
          Welcome to Data & Society
      </h2>

      <v-text-field
        label="Email:"
        v-model="email"
        prepend-icon="mdi-email"
      ></v-text-field>

      <v-text-field
        label="Password:"
        type="password"
        v-model="password"
        prepend-icon="mdi-lock"
      ></v-text-field>

      <v-row>
        <v-col cols="12" class="pl-0">
          <span
            class="font-semibold text-base text-red-800 cursor-pointer"
            @click="$emit('change-tab', 'resetPass')"
          >
            Forgot Your Password?
          </span>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" class="pl-0">
          <span
            class="font-bold text-base text-red-800 cursor-pointer"
            @click="$emit('change-tab', 'verify')"
          >
            Have a Confirmation Code?
          </span>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8">
          <v-btn
            block
            class="mt-3 bg-red-700 text-white rounded"
            @click="login"
          >Login</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "LoginForm",
  props: ["tab"],
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
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
  }
};
</script>
