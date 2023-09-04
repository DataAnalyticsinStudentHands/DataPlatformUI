<!-- /resetPasswordForm -->
<template>
  <section class="">
    <div class="px-10 py-20">
      <div 
        class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form
          @submit.prevent
          class="space-y-4 md:space-y-6"
          action="/login"
          method="POST"
        >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div class="col-span-4 md:col-span-4">
            <v-col cols="12">
                <div class="d-flex align-center">
                  <v-icon color="green darken-1">mdi-email</v-icon>
                  <span class="ml-2 font-weight-bold">Email Sent!</span>
                </div>
              </v-col>
            <label for="email" class="block">Please check your email and input the security code to reset your password.</label>
            <input
              v-model="code"
              type="text"
              name="secretToken"
              id="secretToken"
              class="w-1/4 md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Code"
            />
          </div>
        </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">New Password</label>
              <input
                v-model="newPassword"
                type="password"
                name="secretToken"
                id="secretToken"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="••••••••"
              />
              <span class="text-black" v-if="v$.newPassword.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.newPassword.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">Confirm New Password</label>
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

          <div
          id="errorDIV"
          class="hide max-w-screen-md mx-auto"
        >
          <div
            class="errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
            style="max-width: 80%; margin: 0 auto;"
          >
            {{ error }}
            <p class="mt-2">
              <a
                class="font-medium text-primary-600 hover:underline dark:text-blue-500"
              >
                Please confirm the code in your email, or click "Get New Code" below.
              </a>
            </p>
          </div>
        </div>

          <div
            id="successDIV"
            class="hide grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div
              class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
              role="alert"
            >
              {{ success
              }}
            </div>
          </div>
          <div 
            key="submitAndBackButtons">
            <button
              @click="activateAccount"
              type="submit"
              class="bg-red-700 text-white rounded mr-4"
            >
              Reset Password
            </button>
            <button
              @click="$router.back()"
              type="button"
              class="bg-gray-600 text-white rounded border border-black"
            >
              Go Back
            </button>
        </div>
        <div class="mt-2">
          <v-progress-linear 
            v-if="resetLoading"
            indeterminate 
            color="red"
          ></v-progress-linear>
        </div>
        <div class="inline-block mr-4" key="getCodeButton">
            <div class="block text-sm text-gray-500 mb-2">Didn't receive a code/Expired code?</div>
            <button
                @click="getNewCodeButtonPressed"  
                type="button"
                class="bg-red-700 text-white rounded"
            >
                Get New Code
            </button>
        </div>
        <div class="mt-2">
          <v-progress-linear 
            v-if="newCodeLoading"
            indeterminate 
            color="red"
          ></v-progress-linear>
        </div>
        <v-col 
          v-if="newCodeSent"
          cols="12">
          <div class="d-flex align-center">
            <v-icon color="green darken-1">mdi-email</v-icon>
            <span class="ml-2 font-weight-bold">New Code Sent!</span>
          </div>
        </v-col>
        <p v-if="newCodeError" class="text-red-600 mt-2">{{ newCodeError }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
export default {
  name: "VerifyAccount",
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
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
      sendNewCodeLink: "",
      toggle: "hide",
      resetLoading: false,
      newCodeLoading: false,
      newCodeSent: false,
      showEmailInput: false,
      newCodeError: '',
    };
  },
  methods: {
    chechConfirmPassword() {
      this.isConfirmPasswordValid = true;
      if (this.newPassword !== this.confirmNewPassword) {
        this.error = "Passwords do not match.";
        this.isConfirmPasswordValid = false;
      }
    },
    async activateAccount() {
      this.resetLoading = true;
      const isFormCorrect = await this.v$.$validate();
      this.chechConfirmPassword();
      if (isFormCorrect && this.isConfirmPasswordValid) {
        let user = {
          code: this.code,
          newPassword: this.newPassword,
          error: this.error,
        };
        let apiURL =
          import.meta.env.VITE_ROOT_API + `/userdata/resetPasswordForm`;
        axios.put(apiURL, user).then(
          (res) => {
            if (res.status == 200) {
              // this.$router.push("/login");
              //removing the hide class from the success message div
              // var element = document.getElementById("successDIV");
              // element.classList.remove("hide");
              // var selement = document.getElementById("errorDIV");
              // selement.classList.add("hide");
              //populating the success variables
              // this.success = res.data.error;
              // this.loginLink = " Login";
              // this.error = "";
              // this.sendNewCodeLink = "";
              if (useLoggedInUserStore().isLoggedIn === true) {
                useLoggedInUserStore().logout(true);
              } else {
                this.$router.push({
                  name: 'Login',
                  params: {
                    toastType: 'success',
                    toastMessage: 'Password Reset! Please login.',
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--create'
                  }
                })
              }
            }
          },
          (err) => {
            var element = document.getElementById("errorDIV");
            element.classList.remove("hide");
            this.error = err.response.data.error;
            this.success = "";
            this.sendNewCodeLink = " Send new Code?";
          }
        );
        this.resetLoading = false;
      }
    },
    getNewCodeButtonPressed() {
      if (useLoggedInUserStore().isLoggedIn === true) {
        this.getEmail();
      } else {
        this.$router.push('/resetPassword')
      }
    },
    async getEmail() {
      this.newCodeLoading = true;
      const userID = useLoggedInUserStore().userId;
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/getUserEmail`;
      try {
        const response = await axios.get(apiURL, {
          params: {
            userID: userID
          }
        });

        if (response.status === 200) {
          this.email = response.data.email;
          this.sendNewCode();
        } else {
          console.error('Error:', error);
          this.newCodeLoading = false;
        }
      } catch (error) {
        console.error('Error:', error);
        this.newCodeLoading = false;
      }
    },
    async sendNewCode() {
      let user = {
        email: this.email,
        error: this.error,
      };
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/resetPassword`;
      axios.put(apiURL, user).then(
        (res) => {
          if (res.status == 200) {
            //removing the hide class from the success message div
            // var element = document.getElementById("myDIV");
            // element.classList.remove("hide");
            //populating the success variables
            // this.success = res.data.error;
            // this.loginLink = " Login";
            // this.error = "";
            this.newCodeLoading = false;
            this.newCodeSent = true;
          }
        },
        (err) => {
          this.success = "";
          this.newCodeError = err.response.data.error;
        }
      );
      this.newCodeLoading = false;
    }
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

<style scoped>


.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

/* Starting state for enter */
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10%); /* Starts slightly to the left for the slide effect */
}

/* Ending state for enter */
.slide-fade-enter-to, .slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}


</style>