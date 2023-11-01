<template>
  <div>
    <v-card-text>
      <h2 class="font-bold text-2xl text-red-800 tracking-widest text-center mt-3 mb-5">
          {{$t('Welcome to Engaged Data')}}
      </h2>

      <!-- Login form -->
      <v-form ref="loginForm">
        <v-text-field
          :label="$t('Email:')"
          v-model="email"
          :rules="emailRules"
          required
          prepend-icon="mdi-email"
        ></v-text-field>

        <v-text-field
          :label="$t('Password:')"
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
            class="font-semibold text-base text-red-800 cursor-pointer no-select"
            @click="$emit('navigateTo', '/passResetRequest')"
          >
            {{$t('Forgot Your Password?')}}
          </span>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" class="pl-0">
          <span
            class="font-bold text-base text-red-800 cursor-pointer no-select"
            @click="$emit('navigateTo', '/verifyAccWithEmailCode')"
          >
            {{$t('Have a Confirmation Code?')}}
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
          >{{$t('Login')}}</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
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
                    return this.$t('Email is required');
                } else if (!/.+@.+/.test(v)) {
                    return this.$t('Email must be valid');
                }
                return true;
            }
        ],
        requiredRule: [v => !!v || this.$t('This field is required')]
      };
  },
  setup() {
    const store = useLoggedInUserStore()
    return {
      store,
    }
  },
  mounted() {
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
    },
  methods: {
    async login() {
      // Check if there are any errors in the form
      await this.$refs.loginForm.validate();
      const hasErrors = this.$refs.loginForm.errors.length > 0;

      // If no errors, proceed with login
      if (!hasErrors) {
        this.loading = true;
        try {
          // Attempt to login
          const loginStore = await this.store.login(this.email, this.password);

          if (loginStore && loginStore.toast) {
            toast[loginStore.type](this.$t(loginStore.message), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              limit: 2,
              multiple: false
            });
          }
          // Navigate to the appropriate dashboard based on the user's role
          if (this.store.role === 'Instructor') {
            this.$router.push("/instructorDash");
          } else if (this.store.role === 'Student') {
            // After successful verification, check if the student has completed forms
            await this.store.checkFormCompletion();
            if (this.store.hasCompletedEntryForm) {
              this.$router.push("/studentDashboard");
            } else {
              this.$router.push("/studentEntryForm");
            }
          } else {
            this.$router.push("/");
          }
          // If invalid login, error message will appear from Pinia store
          // If unverified account, send to verification view
          if (this.store.unverified === true) {
            this.sendNewCode();
          }
        } catch (error) {
          this.handleError(error);
        } finally {
          this.loading = false;
        }
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
            name: 'verifyAccWithCode', 
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


<style>
.no-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Safari */
    -khtml-user-select: none;    /* Konqueror HTML */
    -moz-user-select: none;      /* Old versions of Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;           /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
}

</style>