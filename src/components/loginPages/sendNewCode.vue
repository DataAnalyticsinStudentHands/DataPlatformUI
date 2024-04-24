<!-- /sendNewCode -->
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
                <label for="email" class="block"
                  >Please provide the email used for registration.</label
                >
                <input
                  v-model="email"
                  type="email"
                  name="secretToken"
                  id="secretToken"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="example@email.com"
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
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: "VerifyAccount",
    data() {
      return {
        email: "",
        error: "",
        success: "",
        loginLink: "",
        toggle: "hide",
      };
    },
    methods: {
      
      // Requests a new verification code for account activation and displays a success message upon successful request.
      activateAccount() {
        let user = {
          email: this.email,
          error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/send-new-code`;
        axios.put(apiURL, user).then(
          (res) => {
            if (res.status == 200) {
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
      },
    },
  };
  </script>
  