<!-- /verify -->
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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            <div class="md:col-span-3">
                <label for="email" class="block">Please check your email and input the code to verify your account.</label>
                <input
                    v-model="code"
                    type="text"
                    name="secretToken"
                    id="secretToken"
                    class="w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Code"
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
          <transition name="slide-fade" mode="out-in">
          <div 
            v-if="!accountActivated"
            key="verifyButton"
          >
            <button
              @click="activateAccount"
              type="submit"
              class="bg-red-700 text-white rounded mr-4"
            >
              Verify
            </button>
          </div>
          <div 
            v-else
            key="loginButton"
          >
          <button
            key="loginButton"
            @click="$router.push('/login')"
            type="submit"
            class="bg-green-700 text-white rounded mr-4"
          >
            Login
          </button>
          </div>
          </transition>
          <div class="flex items-start"> 
            <transition name="slide-fade" mode="out-in">
              <!-- Display "Get New Code" button and label if displayGetNewCodeButton is true -->
              <div v-if="displayGetNewCodeButton" class="inline-block mr-4" key="getCodeButton">
                  <div class="block text-sm text-gray-500 mb-2">Didn't receive a code/Expired code?</div>
                  <button
                      @click="toggleEmailField"  
                      type="button"
                      class="bg-red-700 text-white rounded"
                  >
                      Get New Code
                  </button>
              </div>
            <!-- Conditionally rendered email input, submit button, and cancel button -->
              <div v-else-if="!displayGetNewCodeButton && !accountActivated" key="emailInput">
                  <label for="emailField" class="block text-sm text-gray-700 mb-2">Enter your email to receive a new code:</label>
                  <input
                      v-model="email"
                      type="email"
                      id="emailField"
                      placeholder="Your email"
                      class="rounded-md border-gray-300 mb-2 max-w-md"
                  />
                  <v-progress-linear 
                      v-if="newCodeLoading"
                      indeterminate 
                      color="red"
                  ></v-progress-linear>
                  <p v-if="emailError" class="text-red-600 mt-2">{{ emailError }}</p>
                  <p v-if="emailSuccess" class="text-green-600 mt-2">{{ emailSuccess }}</p>
                  <div class="flex space-x-4"> <!-- Use flex to display buttons side by side -->
                      <button 
                          @click="getNewCode"
                          type="button"
                          class="bg-red-700 text-white rounded mt-4"
                      >
                          Submit
                      </button>
                      <button 
                        v-if="showRegisterButton"
                        @click="registerUser"
                        type="button"
                        class="bg-blue-700 text-white rounded mt-4"
                    >
                        Register
                    </button>
                      <button 
                          @click="cancelEmailInput"
                          type="button"
                          class="bg-white text-red-700 border border-red-700 rounded mt-4"
                      >
                          Cancel
                      </button>
                  </div>
              </div>
          </transition>
        </div>
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
      displayGetNewCodeButton: true,
      email: '',
      emailError: '',
      emailSuccess: '',
      showRegisterButton: false,
      newCodeLoading: false,
      accountActivated: false,
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
            //removing the hide class from the success message div
            var element = document.getElementById("successDIV");
            element.classList.remove("hide");
            //populating the success variables
            this.success = res.data.error;
            this.loginLink = " Login";
            this.error = "";
            this.accountActivated = true;
            this.displayGetNewCodeButton = false;
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
    toggleEmailField() {
        this.displayGetNewCodeButton = false;  // Hide the "Get New Code" button
    },
    cancelEmailInput() {
        this.displayGetNewCodeButton = true;  // Show the "Get New Code" button
        this.emailError = '';
        this.emailSuccess = '';
    },
    async getNewCode() {
        this.newCodeLoading = true;
        try {
            let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/sendNewCode`;
            const response = await axios.put(apiURL, { email: this.email }); // Use axios.put() to send a PUT request with the email in the request body
            
            // Handle successful response
            if (response.data.title === 'Success') {
              this.emailError = '';
              this.emailSuccess = 'Success! Please check your email.';
            }

        } catch (error) {
            if (error.response.status === 404 && error.response.data.error === "Invalid email.") {
                this.emailSuccess = '';
                this.emailError = "Sorry! We couldn't find this email address. Please try again or register for a new account.";
                this.showRegisterButton = true;
            } else {
                // Handle any other errors
                this.emailSuccess = '';
                this.emailError = "An unexpected error occurred. Please contact an administrator.";
            }
        } finally {
            this.newCodeLoading = false;
        }
    },
    registerUser() {
        this.$router.push('/registerForm'); // Redirect to the register form
    }
  },
};
</script>

<style scoped>

/* Define the transition for both enter and leave */
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