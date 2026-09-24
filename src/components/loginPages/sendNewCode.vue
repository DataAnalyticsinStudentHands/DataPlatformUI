<!--
sendNewCode.vue - Verification Code Request Component

This component provides a form interface for users to request a new verification code
for account activation. Users enter their registered email address and receive a new
code via email. The component displays success or error messages based on the API
response and uses conditional styling to show/hide feedback messages.
-->

<template>
    <section class="">
      <div class="px-10 py-20">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <!-- Form for requesting a new verification code -->
          <form
            @submit.prevent
            class="space-y-4 md:space-y-6"
            action="/login"
            method="POST"
          >
            <!-- Email Input Field -->
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
                  class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                  placeholder="example@email.com"
                />
              </div>
            </div>
            <!-- Error Message Section -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
            >
              <div
                class="errorMessage bg-tint-caution border-l-4 border-orange-500 text-banner-caution-fg p-4"
                role="alert"
              >
                {{ error }}
              </div>
            </div>
            <!-- Success Message Section -->
            <div
              id="myDIV"
              class="hide grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
            >
              <div
                class="bg-tint-success-strong border-l-4 border-green-500 text-banner-success-fg p-4"
                role="alert"
              >
                {{ success }}
              </div>
            </div>
            <!-- Submit Button -->
            <button
              @click="activateAccount"
              type="submit"
              class="bg-primary text-white rounded"
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
      // Component state for form inputs and message display
      return {
        email: "",
        error: "",
        success: "",
        loginLink: "",
        toggle: "hide",
      };
    },
    methods: {
      // Requests a new verification code for account activation and displays a success message upon successful request
      activateAccount() {
        let user = {
          email: this.email,
          error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/send-new-code`;
        
        // Send request to API endpoint for new verification code
        axios.put(apiURL, user).then(
          (res) => {
            if (res.status == 200) {
              // Display success message by removing hide class
              var element = document.getElementById("myDIV");
              element.classList.remove("hide");
              // Update success message and clear error
              this.success = res.data.error;
              this.loginLink = " Login";
              this.error = "";
            }
          },
          (err) => {
            // Display error message and clear success message
            this.error = err.response.data.error;
            this.success = "";
          }
        );
      },
    },
  };
  </script>