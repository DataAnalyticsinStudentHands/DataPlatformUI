<template>
  <div>
    <v-card-text>
      <h2 class="font-bold text-2xl text-custom-red tracking-widest text-center mt-3 mb-5">
          {{$t('Welcome to')}} {{ appName }}
      </h2>

      <!-- Login form -->
      <v-form ref="loginForm">
        <v-text-field
          :label="$t('Email:')"
          v-model="email"
          :rules="emailRules"
          required
          prepend-icon="mdi-email"
          @keydown.enter="login"
        ></v-text-field>

        <v-text-field
          :label="$t('Password:')"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          :rules="requiredRule"
          required
          prepend-icon="mdi-lock"
          @keydown.enter="login"
        >
          <template v-slot:append-inner>
            <v-icon
              @click="showPassword = !showPassword"
            >
              mdi-eye
            </v-icon>
          </template>
        </v-text-field>
      </v-form>

      <v-row>
        <v-col cols="12" class="pl-0 pt-6">
          <span
            class="font-semibold text-base text-custom-red cursor-pointer no-select"
            @click="$emit('navigateTo', '/passResetRequest')"
          >
            {{$t('Forgot Your Password?')}}
          </span>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" class="pl-0">
          <span
            class="font-bold text-base text-custom-red cursor-pointer no-select"
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
            class="mt-3 bg-custom-red text-white rounded"
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
import { computed } from 'vue';


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
        requiredRule: [v => !!v || this.$t('This field is required')],
        appName: "",
        showPassword: false,
      };
  },
  setup() {
    const store = useLoggedInUserStore();

    const appName = computed(() => {
      return store.orgName === 'Data & Society' ? 'Engaged Data' : store.orgName;
    });

    return {
      store,
      appName
    };
  },
  mounted() {
    if (useLoggedInUserStore().navigationData?.toastType) {
      toast[useLoggedInUserStore().navigationData.toastType](useLoggedInUserStore().navigationData.toastMessage, { 
        position: useLoggedInUserStore().navigationData.toastPosition,
        toastClassName: useLoggedInUserStore().navigationData.toastCSS
      });
    }
  },
  methods: {
    // Manages user login by validating the form, authenticating credentials, and redirecting based on the user's role. Displays notifications for login feedback. Handles special cases for unverified accounts and incomplete student entry forms.
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
          if (this.store.role === 'Instructor' || this.store.role === 'Group Instructor' || this.store.role === 'Group Admin' || this.store.role === 'Org Admin') {
            this.$router.push("/instructorDash");
          } else if (this.store.role === 'Student') {
            if (this.store.hasCompletedEntryForm) {
              this.$router.push("/studentDashboard");
            } else {
              this.$router.push("/studentEntryForm");
            }
          } else if (this.store.role === 'Basic') {
            this.$router.push("/dashboard");
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
    // Initiates sending a new verification code to the user's email and navigates to the verification page with the user's ID upon successful request.
    async sendNewCode() {
      let user = {
        email: this.email,
        error: this.error,
      };
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/send-new-code`;

      axios.put(apiURL, user)
        .then((res) => {
          if (res.status == 200) {
            let userID = res.data.userID; // Extract the userID from the response
            useLoggedInUserStore().navigationData = {
              id: userID
            };

            this.$router.push({ 
              name: 'verifyAccWithCode'
            });
          } else {
            console.log('Unexpected response status:', res.status);
          }
        })
        .catch((err) => {
          this.handleError(err);
        });
    },

  }
};
</script>


<style scoped>
.no-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Safari */
    -khtml-user-select: none;    /* Konqueror HTML */
    -moz-user-select: none;      /* Old versions of Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;           /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
}

[type='text']:focus, 
[type='email']:focus, 
[type='url']:focus, 
[type='password']:focus, 
[type='number']:focus, 
[type='date']:focus, 
[type='datetime-local']:focus, 
[type='month']:focus, 
[type='search']:focus, 
[type='tel']:focus, 
[type='time']:focus, 
[type='week']:focus, 
[multiple]:focus, 
textarea:focus, 
select:focus {
    outline: none !important;
    --tw-ring-color: transparent !important;
    --tw-ring-offset-shadow: 0 0 #0000 !important;
    --tw-ring-shadow: 0 0 #0000 !important;
    box-shadow: none !important;
    border-color: currentColor !important;
}



</style>