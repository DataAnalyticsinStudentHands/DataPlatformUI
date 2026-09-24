<template>
  <main>
    <h1
      class="font-bold text-4xl text-brand-fg tracking-widest text-center mt-10"
    >
      Client Intake Form
    </h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-10"
    >
      <div
        class="errorMessage bg-tint-caution border-l-4 banner-accent--caution text-banner-caution-fg p-4"
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
          class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Date of Birth</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label for="selectedMonth">Select a month:</label>
            <select
              id="selectedMonth"
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
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
            <span class="text-high-emphasis" v-if="v$.client.firstName.$error">
              <p
                class="text-brand-fg"
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
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
              v-model="client.selectedDay"
              :disabled="!client.selectedMonth"
            >
              <option value="">--Select Day--</option>
              <option v-for="day in client.daysInMonth" :key="day" :value="day">
                {{ day }}
              </option>
            </select>

            <span class="text-high-emphasis" v-if="v$.client.firstName.$error">
              <p
                class="text-brand-fg"
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
            <button class="bg-primary text-white rounded" type="submit">
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
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
    this.queryData = [];
    axios
      .get(apiURL)
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
        birthMonth: "",
        birthDay: "",
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
          .post(apiURL, this.client)
          .then((response) => {
            // alert("Client has been succesfully added.");
            // Handle response and redirect to desired component or route
            if (response.data.redirectTo && response.data.redirectTo.startsWith('/')) {
              this.$router.push(response.data.redirectTo);
            }
          })
          .catch((error) => {
            this.error = error.response.data.error;
            this.handleError(error);
          });
      }
    },
  },

  // sets validations for the various data properties, currently this part does not work because the validation requires models we don't have
  validations() {
    return {
      client: {
        firstName: { required, alpha },
        lastName: { required, alpha },
        email: { email },
        birthMonth: {required},
        birthDay:{required},
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

<style scoped>
/* Banner accent (was border-orange-500): the border-l-4 edge takes its color from border-left-color,
   and Vuetify's .border-KEY only sets --v-border-color, so the key is read here. Light: #F97316 as before. */
.banner-accent--caution {
  border-left-color: rgb(var(--v-theme-banner-caution-border));
}

/* Native selects. They draw no border in either theme: Vuetify's reset sets border-style: none and the
   forms plugin never sets it back, and index.css forces the fill transparent, so in dark only the chevron
   and the "--Select--" text showed where a field was. native-field-fill is #FFFFFF in light (the white
   page behind these fields, so light is unchanged) and #262626 in dark (§6.3 missing-key rule, neutral
   near-white background). The form prefix plus the scoped attribute, (0,1,2), outranks index.css's
   transparent rules, including select:focus at (0,1,1), so the fill also holds while a select has focus,
   in any load order. Only background-color is set: the forms plugin's chevron (background-image) stays. */
form select {
  background-color: rgb(var(--v-theme-native-field-fill)) !important;
}
</style>
