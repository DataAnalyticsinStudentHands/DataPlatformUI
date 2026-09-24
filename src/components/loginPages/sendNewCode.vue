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
                class="errorMessage bg-tint-caution border-l-4 banner-accent--caution text-banner-caution-fg p-4"
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
                class="bg-tint-success-strong border-l-4 banner-accent--success text-banner-success-fg p-4"
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

  <style scoped>
  /* Banner left accents (border-l-4): Vuetify's .border-KEY only sets --v-border-color, so read the keys here */
  .banner-accent--caution {
    border-left-color: rgb(var(--v-theme-banner-caution-border));
  }

  .banner-accent--success {
    border-left-color: rgb(var(--v-theme-banner-success-border));
  }

  /* Native email input: no border (Vuetify's reset sets border-style: none on input) and a transparent
     background (index.css), so shadow-sm's faint shadow is its only edge, which is invisible on the dark page.
     A 1px native-input-edge ring, listed after the shadow so it paints below it: white on the white page in
     light (pixels unchanged), a neutral edge in dark. */
  input.shadow-sm {
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow), 0 0 0 1px rgb(var(--v-theme-native-input-edge));
  }

  /* index.css drops every input box-shadow on focus (!important); keep the edge so a focused field keeps its outline */
  input.shadow-sm:focus {
    box-shadow: 0 0 0 1px rgb(var(--v-theme-native-input-edge)) !important;
  }
  </style>