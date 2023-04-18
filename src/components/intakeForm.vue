<template>
  <main>
    <h1
      class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
    >
      Client Intake Form
    </h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-10"
    >
      <div
        class="errorMessage bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
        role="alert"
      >
        {{ error }}
      </div>
    </div>
    <div id="app" class="px-10 py-20">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Personal Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">First Name</span>
              <span style="color: #ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.firstName"
              />
              <span class="text-black" v-if="v$.client.firstName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.firstName.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Middle Name</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.middleName"
              />
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Last Name</span>
              <span style="color: #ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.lastName"
              />
              <span class="text-black" v-if="v$.client.lastName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.lastName.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </label>
          </div>

          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Email</span>
              <input
                type="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                v-model="client.email"
              />
              <span class="text-black" v-if="v$.client.email.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.email.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Phone Number</span>
              <span style="color: #ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers[0].primaryPhone"
              />
              <span
                class="text-black"
                v-if="v$.client.phoneNumbers[0].primaryPhone.$error"
              >
                <p
                  class="text-red-700"
                  v-for="error of v$.client.phoneNumbers[0].primaryPhone
                    .$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Alternative Phone Number</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers[0].secondaryPhone"
              />
            </label>
          </div>
        </div>
        <div
          class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Date of Birth</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label for="selectedMonth">Select a month:</label>
            <select
              id="selectedMonth"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="client.selectedMonth"
            >
              <option value="">--Select Month--</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <span class="text-black" v-if="v$.client.firstName.$error">
              <p
                class="text-red-700"
                v-for="error of v$.client.firstName.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}!
              </p>
            </span>
            <!-- </label> -->
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label for="selectedDay">Select a day:</label>
            <select
              id="selectedDay"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="client.selectedDay"
              :disabled="!client.selectedMonth"
            >
              <option value="">--Select Day--</option>
              <option v-for="day in client.daysInMonth" :key="day" :value="day">
                {{ day }}
              </option>
            </select>

            <span class="text-black" v-if="v$.client.firstName.$error">
              <p
                class="text-red-700"
                v-for="error of v$.client.firstName.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}!
              </p>
            </span>
            <!-- </label> -->
          </div>
          <div></div>
          <!-- submit button -->
          <div class="flex justify-between mt-10 mr-20">
            <button class="bg-red-700 text-white rounded" type="submit">
              Add Client
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, numeric } from "@vuelidate/validators";
import axios from "axios";
export default {
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
      el: "#app",
      client: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumbers: [
          {
            primaryPhone: "",
            secondaryPhone: "",
          },
        ],
        selectedMonth: "",
        selectedDay: "",
        daysInMonth: [],
        selectedYear: "2004",
      },
      error: "",
    };
  },
  watch: {
    "client.selectedMonth"(newMonth) {
      // Get the number of days in the selected month
      const daysInMonth = new Date(
        this.client.selectedYear,
        newMonth,
        0
      ).getDate();

      // Update the daysInMonth array
      this.client.daysInMonth = Array.from(
        { length: daysInMonth },
        (value, index) => index + 1
      );

      // Reset the selected day if it exceeds the number of days in the selected month
      if (this.client.selectedDay > daysInMonth) {
        this.client.selectedDay = "";
      }
    },
  },
  methods: {
    getDaysInMonth: function (month) {
      var daysInMonth = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
      };
      return Array.from({ length: daysInMonth[month] }, (_, i) => i + 1);
    },
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = true;
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata`;
        axios
          .post(apiURL, this.client, {
            headers: { token: localStorage.getItem("token") },
          })
          .then((response) => {
            // alert("Client has been succesfully added.");
            // Handle response and redirect to desired component or route
            if (response.data.redirectTo) {
              this.$router.push(response.data.redirectTo);
            }
          })
          .catch((error) => {
            this.error = error.response.data.error;
            console.log(error);
          });
      }
    },
  },

  // sets validations for the various data properties
  validations() {
    return {
      client: {
        firstName: { required, alpha },
        lastName: { required, alpha },
        email: { email },
        birthday: {
          month: { required },
          day: { required },
        },
        phoneNumbers: [
          {
            primaryPhone: { required, numeric },
          },
        ],
      },
    };
  },
};
</script>
