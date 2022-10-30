<template>
  <section class="bg-red-50 dark:bg-red-000">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 primaryBg dark:border-gray-00"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Create account
          </h1>
          <form
            @submit.prevent="userSubmitForm"
            class="space-y-4 md:space-y-6"
            action="#"
          >
            <div>
              <label
                for="firstName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >First Name</label
              >
              <input
                v-model="user.firstName"
                type="text"
                name="firstName"
                id="firstName"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="First name"
                required=""
              />
            </div>
            <div>
              <label
                for="lastName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Last Name</label
              >
              <input
                v-model="user.lastName"
                type="text"
                name="lastName"
                id="lastName"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Last name"
                required=""
              />
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                v-model="user.email"
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="phoneNumber"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Phone Number</label
              >
              <input
                v-model="user.phoneNumber"
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="832-132-1234"
                required=""
              />
            </div>
            <div>
              <label
                for="association"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Association</label
              >
              <input
                v-model="user.association"
                type="text"
                name="association"
                id="association"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Association"
                required=""
              />
            </div>
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Username</label
              >
              <input
                v-model="user.username"
                type="text"
                name="username"
                id="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="username"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                v-model="user.password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <div>
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Confirm password</label
              >
              <input
                v-model="user.confirm_pasword"
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-100 dark:border-red-800 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <!-- <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                      </div>
                  </div> -->
            <button
              type="submit"
              class="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border primaryBg dark:hover:bg-red-100 dark:hover:text-black dark:focus:ring-primary-800 dark:text-white"
            >
              Create an account
            </button>
            <p class="text-sm font-medium text-black-500 dark:text-black-400">
              Already have an account?
              <a
                href="#"
                class="font-medium text-primary-600 hover:underline dark:text-blue-500"
                >Login here</a
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import axios from "axios";
// import bcrypt from "bcrypt";
// var passwordToHash = document.getElementById("password")

export default {
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },

  data() {
    return {
      isConfirmPasswordValid: false,
      //   checkedServices: [],
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        association: "",
        username: "",
        password: "",
        role: "Basic",
        confirm_pasword: "",
      },
    };
  },
  methods: {
    chechConfirmPassword() {
      console.log(this.password === this.confirm_pasword);
      console.log(this.confirm_pasword);
      this.isConfirmPasswordValid = true;
      if (this.user.password !== this.user.confirm_pasword) {
        alert("Incorrect confirm password!");
        this.isConfirmPasswordValid = false;
      }
    },
    async userSubmitForm() {
      // Checks to see if there are any errors in validation
      let isFormCorrect = await this.v$.$validate();
      this.chechConfirmPassword();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect && this.isConfirmPasswordValid) {
        // const password = await bcrypt.hashSync(this.user.password, 10);
        // console.log(password);

        // this.services = this.checkedServices;
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata`;
        axios
          // const doesExist = await
          .post(apiURL, this.user)
          .then(() => {
            alert("You have registered successfully.");
            // this.$router.push("/findEvents"+);
            this.client = {
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              association: "",
              username: "",
              password: "",
              role: "",
            };
            // this.checkedServices = [];
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  validations() {
    return {
      user: {
        firstName: { required },
        lastName: { required },
        password: { required },
      },
    };
  },
};
</script>
