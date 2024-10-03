<!-- updatePassword.vue - This component is responsible for allowing logged-in users to update their password by providing their current password and setting a new password. -->

<template>
  <section class="">
    <div class="px-10 py-20">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <!-- Password reset form -->
        <form
          @submit.prevent
          class="space-y-4 md:space-y-6"
          action="/login"
          method="POST"
        >
          <!-- Input field for the current password -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">{{$t('Current Password')}}</label>
              <input
                v-model="code"
                type="password"
                name="secretToken"
                id="secretToken"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Input field for the new password -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">{{$t('New Password')}}</label>
              <input
                v-model="newPassword"
                type="password"
                name="secretToken"
                id="secretToken"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="••••••••"
              />

              <!-- Display validation errors for the new password -->
              <span class="text-black" v-if="v$.newPassword.$error">
                <p
                  class="text-custom-red"
                  v-for="error of v$.newPassword.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </div>
          </div>

          <!-- Input field to confirm the new password -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">{{$t('Confirm New Password')}}</label>
              <input
                v-model="confirmNewPassword"
                type="Password"
                name="secretToken"
                id="secretToken"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Error message container -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div
              class="errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              {{ error }}
            </div>
          </div>

          <!-- Success message container, hidden by default -->
          <div
            id="myDIV"
            class="hide grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div
              class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
              role="alert"
            >
              {{ success }}
            </div>
          </div>

          <!-- Submit button to trigger the password reset process -->
          <button
            @click="activateAccount"
            type="submit"
            class="bg-custom-red text-white rounded"
          >
            {{$t('Reset Password')}}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "VerifyAccount",
  // Redirects to the login page if the token is missing
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
  },
  // Setup for validation with Vuelidate
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  mounted() {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  },
  data() {
    return {
      isConfirmPasswordValid: false, // Tracks if the password confirmation is valid
      code: "", // Holds the current password
      newPassword: "", // Holds the new password
      confirmNewPassword: "", // Holds the confirmation of the new password
      error: "", // Stores error messages
      success: "", // Stores success messages
      loginLink: "", // Link to login page
      toggle: "hide", // Toggles visibility of elements
    };
  },
  methods: {
    
    // Validates that the new password and its confirmation match. Updates the validation state and sets an error message if they do not align.
    checkConfirmPassword() {
      this.isConfirmPasswordValid = true;
      if (this.newPassword !== this.confirmNewPassword) {
        this.error = "Passwords do not match.";
        this.isConfirmPasswordValid = false;
      }
    },

    // Validates form and password confirmation before requesting a password reset for logged-in users using a verification code. On success, navigates to the appropriate dashboard with a success message.
    async activateAccount() {
      const isFormCorrect = await this.v$.$validate();
      this.checkConfirmPassword();
      if (isFormCorrect && this.isConfirmPasswordValid) {
        const store = useLoggedInUserStore();
        let user = {
          code: this.code,
          newPassword: this.newPassword,
          error: this.error,
        };
        let apiURL =
          import.meta.env.VITE_ROOT_API + `/userdata/password-reset/logged-in`;
        axios
          .put(apiURL, user, {
            headers: { token: store.token },
          })
          .then(
            (res) => {
              if (res.status == 200) {
                //populating the success variables
                this.success = res.data.error;
                this.loginLink = " Login";
                this.error = "";
                // Show the success message and navigate to the dashboard
                if (store.role === 'Student') {
                  store.navigationData = {
                      toastType: 'success',
                      toastMessage: 'Password successfully reset!',
                      toastPosition: 'top-right',
                      toastCSS: 'Toastify__toast--create'
                  };
                  this.$router.push({ 
                    name: 'studentDashboard'
                  });
                } else if (store.role === 'Instructor') {
                  store.navigationData = {
                    toastType: 'success',
                    toastMessage: 'Password successfully reset!',
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--create'
                  };
                  this.$router.push({ 
                    name: 'instructorDash'
                  });
                }

              }
            },
            (err) => {
              this.error = err.response.data.error;
              this.success = "";
              toast.error('An error occurred. Please try again later.', {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete'
              });
            }
          );
      }
    },
  },
  // Vuelidate validation rules for the new password
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
