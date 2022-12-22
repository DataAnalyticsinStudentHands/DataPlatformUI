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
              <label for="email" class="block">Email/Username</label>
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="name@company.com"
              />
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="password" class="block">Password</label>
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
          <button
            @click="login"
            type="submit"
            class="bg-red-700 text-white rounded"
          >
            Login
          </button>

          <p class="text-sm font-medium text-black-500 dark:text-black-400">
            Don't have an account?
            <a
              href="./registerForm"
              class="font-medium text-primary-600 hover:underline dark:text-blue-500"
              >Register here</a
            >
          </p>
        </form>
      </div>
    </div>
    <!-- </div> -->
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  emits: ["showDashboard"],
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    login() {
      let user = {
        email: this.email,
        password: this.password,
      };
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/login`;
      axios.post(apiURL, user).then(
        (res) => {
          if (res.status == 200) {
            localStorage.setItem("token", res.data.token);
            // this.$root.$emit("isuserLoggedInEvent");
            this.$router.push("/");
            this.$emit("showDashboard");
          }
        },
        (err) => {
          this.error = err.response.data.error;
        }
      );
    },
  },
};
</script>
