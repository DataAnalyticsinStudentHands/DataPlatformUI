<template>
  <main>
    <v-container style="width: 90%; margin: 0 auto;">
      <p class="font-weight-black text-h5 text--primary">{{$t('User Password Update Form')}}</p>
      <p class="text-subtitle-1">
        {{$t("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again.")}}
      </p>
    </v-container>

    <v-form @submit.prevent="passReset">
      <v-container style="width: 90%; margin: 0 auto;">

        <v-col cols="12" md="6">
          <v-text-field 
            v-model="code" 
            :label="$t('Current Password')" 
            type="password"
            name="currentPassword"
            id="currentPassword"
            placeholder="••••••••"
            outlined
            dense
            :error="!!currentPasswordError"
            :error-messages="currentPasswordError ? [currentPasswordError] : []"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="newPassword" 
            :label="$t('New Password')"
            type="password"
            name="newPassword"
            id="newPassword"
            placeholder="••••••••"
            outlined
            dense
            :error="v$.newPassword.$error"
            :error-messages="v$.newPassword.$errors.map(e => e.$message)"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="confirmNewPassword" 
            :label="$t('Confirm New Password')"
            type="password"
            name="confirmNewPassword"
            id="confirmNewPassword"
            placeholder="••••••••"
            outlined
            dense
            :error="!!confirmPasswordError"
            :error-messages="confirmPasswordError ? [confirmPasswordError] : []"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <!-- Any other unexpected errors can still be displayed here -->
          <v-alert
            v-if="error"
            type="warning"
            colored-border
            elevation="2"
            dense
          >
            {{ error }}
          </v-alert>
        </v-col>

        <v-col cols="12" md="6">
          <v-alert
            v-if="success"
            type="success"
            colored-border
            elevation="2"
            dense
          >
            {{ success }}
          </v-alert>
        </v-col>

        <v-btn
          @click="passReset"
          :disabled="(!isConfirmPasswordValid && v$.newPassword.$error)"
          class="bg-custom-red text-white rounded"
        >
          {{$t('Reset Password')}}
        </v-btn>
      </v-container>
    </v-form>
  </main>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "VerifyAccount",
  created() {
    // Redirect if no token
    if (localStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
  },
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  mounted() {
    // Scroll to the top
    window.scrollTo(0, 0);
  },
  data() {
    return {
      isConfirmPasswordValid: false,
      code: "",
      newPassword: "",
      confirmNewPassword: "",
      error: "",
      success: "",
      loginLink: "",
      toggle: "hide",
      confirmPasswordError: "",
      currentPasswordError: "" // Initially empty
    };
  },
  methods: {
    // Checks if new password and confirmNewPassword match
    checkConfirmPassword() {
      this.confirmPasswordError = "";
      this.isConfirmPasswordValid = true;
      if (this.newPassword !== this.confirmNewPassword) {
        this.confirmPasswordError = "Passwords do not match.";
        this.isConfirmPasswordValid = false;
      }
    },

    // Attempts password reset
    async passReset() {
      const isFormCorrect = await this.v$.$validate();
      this.checkConfirmPassword();
      if (isFormCorrect && this.isConfirmPasswordValid) {
        const store = useLoggedInUserStore();
        let user = {
          code: this.code,
          newPassword: this.newPassword,
          error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + "/userdata/password-reset/logged-in";

        axios
          .put(apiURL, user, {
            headers: { token: store.token },
          })
          .then(
            (res) => {
              if (res.status == 200) {
                this.success = res.data.message;
                this.loginLink = " Login";
                this.error = "";
                this.currentPasswordError = ""; // Clear any previous error

                // Navigate based on role, showing toast via store.navigationData
                if (store.role === 'Student') {
                  store.navigationData = {
                    toastType: 'success',
                    toastMessage: 'Password successfully reset!',
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--create'
                  };
                  this.$router.push({ name: 'studentDashboard' });
                } else {
                  store.navigationData = {
                    toastType: 'success',
                    toastMessage: 'Password successfully reset!',
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--create'
                  };
                  this.$router.push({ name: 'instructorDash' });
                }
              }
            },
            (err) => {
              this.error = err.response.data.error || "An error occurred.";
              this.success = "";

              // Check if the error matches the "current password" issue
              if (this.error === "The current password does not match our records.") {
                this.currentPasswordError = this.error;
                // Clear the global error alert since we are now showing this as a field error
                this.error = "";
              }

              // If using toast:
              if (typeof toast !== "undefined") {
                toast.error('An error occurred. Please try again later.', {
                  position: 'top-right',
                  toastClassName: 'Toastify__toast--delete'
                });
              }
            }
          );
      }
    },
  },
  validations() {
    return {
      newPassword: {
        required,
        minLengthValue: minLength(8),
      },
    };
  },
};
</script>
