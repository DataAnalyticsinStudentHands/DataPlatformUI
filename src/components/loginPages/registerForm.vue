<!-- /registerForm -->
<template>
  <section class="">
    <div class="px-10 py-20">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="font-bold text-4xl text-red-700 tracking-widest mt-10">
          Create account
        </h1>
        <form
          @submit.prevent="userSubmitForm"
          class="space-y-4 md:space-y-6"
          action="#"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="firstName" class="block">First Name</label>
              <input
                v-model="user.firstName"
                type="text"
                name="firstName"
                id="firstName"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="First name"
                required=""
              />
            </div>
            <div>
              <label for="lastName" class="block">Last Name</label>
              <input
                v-model="user.lastName"
                type="text"
                name="lastName"
                id="lastName"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Last name"
                required=""
              />
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">Your email</label>
              <input
                v-model="user.email"
                type="email"
                name="email"
                id="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="name@company.com"
                required=""
              />
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="confirn_email" class="block">Confirm Email</label>
              <input
                v-model="user.confirm_email"
                type="email"
                name="confirn_email"
                id="confirn_email"
                placeholder="name@company.com"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required=""
              />
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="password" class="block">Password</label>
              <input
                v-model="user.password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required=""
              />
              <span class="text-black" v-if="v$.user.password.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.user.password.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </div>
            <div>
              <label for="confirm-password" class="block"
                >Confirm password</label
              >
              <input
                v-model="user.confirm_pasword"
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required=""
              />
            </div>
          </div>
          <div
            class="grid grid-cols- sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div
              class="errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              {{ errorr }}
            </div>
          </div>
          <button type="submit" class="bg-red-700 text-white rounded">
            Create an account
          </button>
          <p class="text-sm font-medium text-black-500 dark:text-black-400">
            Already have an account?
            <a
              href="./login"
              class="font-medium text-primary-600 hover:underline dark:text-blue-500"
              >Login here</a
            >
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import axios from "axios";
import swal from "sweetalert";

export default {
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      isConfirmPasswordValid: false,
      isConfirmEmailValid: false,
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "Basic",
      },
      errorr: "",
    };
  },
  methods: {
    chechConfirmPassword() {
      this.isConfirmPasswordValid = true;
      this.isConfirmEmailValid = true;
      if (this.user.password !== this.user.confirm_pasword) {
        this.errorr = "Passwords do not match.";
        this.isConfirmPasswordValid = false;
      } else if (this.user.email !== this.user.confirm_email) {
        this.errorr = "Emails do not match.";
        this.isConfirmEmailValid = false;
      }
    },
    async userSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      this.chechConfirmPassword();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (
        isFormCorrect &&
        this.isConfirmPasswordValid &&
        this.isConfirmEmailValid
      ) {
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/register`;
        axios.post(apiURL, this.user).then(
          () => {
            //using swal from sweetalert.js for customizeble alerts
            swal(
              "You have registered successfully!",
              "Please check your email and follow the steps to verify your account.",
              "success"
            );
            // alert("You have registered successfully.");
            this.$router.push("./verify");
            this.user = {
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              role: "",
              error: "",
            };
          },
          (err) => {
            this.errorr = err.response.data.error;
          }
        );
      }
    },
  },
  validations() {
    return {
      user: {
        firstName: { required },
        lastName: { required },
        password: {
          required,
          minLengthValue: minLength(8),
        },
        email: { required },
      },
    };
  },
};
</script>
