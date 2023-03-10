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
              <label for="email" class="block">Varify your account</label>
              <input
                v-model="code"
                type="text"
                name="secretToken"
                id="secretToken"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Code"
              />
            </div>
          </div>
          <div
            id="errorDIV"
            class="hide grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div
              class="errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              {{ error
              }}<a
                class="font-medium text-primary-600 hover:underline dark:text-blue-500"
                href="./sendNewCode"
                >{{ sendNewCodeLink }}</a
              >
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
              }}<a
                class="font-medium text-primary-600 hover:underline dark:text-blue-500"
                href="./login"
                >{{ loginLink }}</a
              >
            </div>
          </div>
          <button
            @click="activateAccount"
            type="submit"
            class="bg-red-700 text-white rounded"
          >
            Verify
          </button>

          <!-- <p class="text-sm font-medium text-black-500 dark:text-black-400">
            <a
              href="./login"
              class="font-medium text-primary-600 hover:underline dark:text-blue-500"
              >Login</a
            >
          </p> -->
        </form>
      </div>
    </div>
    <!-- </div> -->
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "VerifyAccount",
  data() {
    return {
      code: "",
      error: "",
      success: "",
      loginLink: "",
      sendNewCodeLink: "",
      toggle: "hide",
    };
  },
  methods: {
    activateAccount() {
      let user = {
        code: this.code,
        error: this.error,
      };
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/verify`;
      axios.put(apiURL, user).then(
        (res) => {
          if (res.status == 200) {
            // this.$router.push("/login");
            //removing the hide class from the success message div
            var element = document.getElementById("successDIV");
            element.classList.remove("hide");
            //populating the success variables
            this.success = res.data.error;
            this.loginLink = " Login";
            this.error = "";
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
    },
  },
};
</script>
