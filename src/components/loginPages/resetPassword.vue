<!-- /resetPassword -->
<template>
  <section class="">
    <div class="px-10 py-20">
      <div v-if="!guest">
        <label class="block mb-2">Are you sure you want to update your password?</label>
        <div class="flex space-x-4">
          <button 
            @click="proceedToForm"
            class="bg-green-700 text-white rounded px-4 py-2">
            Yes
          </button>
          <button 
            @click="$router.back()"
            class="bg-red-700 text-white rounded px-4 py-2">
            No
          </button>
        </div>
        <div class="mt-2">
          <v-progress-linear 
            v-if="yesLoading"
            indeterminate 
            color="red"
          ></v-progress-linear>
        </div>
      </div>
      <div
        v-else
        class="p-6 space-y-4 md:space-y-6 sm:p-8">
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
          <v-progress-linear 
              v-if="submitLoading"
              indeterminate 
              color="red"
          ></v-progress-linear>
          <p v-if="emailError" class="text-red-600 mt-2">{{ emailError }}</p>
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
            class="bg-red-700 text-white rounded mr-4"
          >
            Submit
          </button>
          <button
            @click="$router.push('/login')"
            class="bg-gray-600 text-white rounded border border-black"
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
  name: "VerifyAccount",
  data() {
    return {
      email: "",
      error: "",
      success: "",
      loginLink: "",
      toggle: "hide",
      submitLoading: false,
      emailError: '',
      guest: useLoggedInUserStore().isLoggedIn === false,
      yesLoading: false,
    };
  },
  methods: {
    activateAccount() {
      this.submitLoading = true;
      let user = {
        email: this.email,
        error: this.error,
      };
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/resetPassword`;
      axios.put(apiURL, user).then(
        (res) => {
          if (res.status == 200) {
            this.submitLoading = false;
            this.$router.push('/updatePasswordForm');
          }
        },
        (err) => {
          this.error = err.response.data.error;
          this.success = "";
          this.emailError = "Sorry! We couldn't find this email address. Please try again or register for a new account."
        }
      );
      this.submitLoading = false;
    },
    async proceedToForm() {
      this.yesLoading = true;
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
          this.activateAccount();
        } else {
          console.error('Error:', error);
        }
      } catch (error) {
        // Handle error
        console.error('Error:', error);
      } finally {
        this.yesLoading = false;
      }
    }
  },
};
</script>
