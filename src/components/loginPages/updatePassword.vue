<!-- /updatePasswordForm -->
<template>
  <section class="">
    <div class="px-10 py-20">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form
          @submit.prevent
          class="space-y-4 md:space-y-6"
          action="/login"
          method="POST"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">Current Password</label>
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
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div
              class="errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              {{ error }}
            </div>
          </div>
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
          <button
            @click="activateAccount"
            type="submit"
            class="bg-red-700 text-white rounded"
          >
            Reset Password
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
export default {
  name: "VerifyAccount",
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
  },
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
    this.queryData = [];
    axios
      .get(apiURL, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(
        (resp) => {
          this.queryData = resp.data;
        },
        (err) => {
          if (err) {
            this.$router.push("/login");
          }
        }
      );
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
      const isFormCorrect = await this.v$.$validate();
      this.chechConfirmPassword();
      if (isFormCorrect && this.isConfirmPasswordValid) {
        let user = {
          code: this.code,
          newPassword: this.newPassword,
          error: this.error,
        };
        let apiURL =
          import.meta.env.VITE_ROOT_API + `/userdata/updatePasswordForm`;
        axios
          .put(apiURL, user, {
            headers: { token: localStorage.getItem("token") },
          })
          .then(
            (res) => {
              if (res.status == 200) {
                // this.$router.push("/login");
                //removing the hide class from the success message div
                var element = document.getElementById("myDIV");
                element.classList.remove("hide");
                //populating the success variables
                this.success = res.data.error;
                this.loginLink = " Login";
                this.error = "";
              }
            },
            (err) => {
              this.error = err.response.data.error;
              this.success = "";
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
