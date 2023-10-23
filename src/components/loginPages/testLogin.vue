<template>
  <div>
    <v-card-text>
      <h2 class="font-bold text-2xl text-red-700 tracking-widest text-center mt-3 mb-5">
          Welcome to Data & Society
      </h2>

      <!-- Added form here -->
      <v-form ref="loginForm">
        <v-text-field
          label="Email:"
          v-model="email"
          :rules="emailRules"
          required
          prepend-icon="mdi-email"
        ></v-text-field>

        <v-text-field
          label="Password:"
          type="password"
          v-model="password"
          :rules="requiredRule"
          required
          prepend-icon="mdi-lock"
        ></v-text-field>
      </v-form>

      <v-row>
        <v-col cols="12" class="pl-0 pt-6">
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
            :loading="loading"
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
import axios from 'axios'
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "LoginForm",
  props: ["tab"],
  data() {
      return {
        email: "",
        password: "",
        error: "",
        loading: false,
        emailRules: [
            v => {
                if (!v) {
                    return 'E-mail is required';
                } else if (!/.+@.+/.test(v)) {
                    return 'E-mail must be valid';
                }
                return true;
            }
        ],
        requiredRule: [v => !!v || 'This field is required']
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
      // Check if there are any errors in the form
      await this.$refs.loginForm.validate();
      const hasErrors = this.$refs.loginForm.errors.length > 0;

      // If no errors, proceed with login
      if (!hasErrors) {
        console.log('form is valid');
        this.loading = true;
        try {
          // Attempt to login
          await this.store.login(this.email, this.password);
          // If invalid login, error message will appear from Pinia store
          // If unverified account, send to verification view
          console.log(this.store.unverified)
          if (this.store.unverified === true) {
            this.sendNewCode();
          }
        } catch (error) {
          console.log(error);
        } finally {
          this.loading = false;
        }
      } else {
        console.log('form has errors');
      }
    },
    async sendNewCode() {
    let user = {
      email: this.email,
      error: this.error,
    };
    let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/sendNewCode`;

    axios.put(apiURL, user)
      .then((res) => {
        if (res.status == 200) {
          let userID = res.data.userID; // Extract the userID from the response
          this.$router.push({ 
            name: 'testVerifyExisting', 
            params: { id: userID } 
          });
        } else {
          console.log('Unexpected response status:', res.status);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  }
};
</script>
