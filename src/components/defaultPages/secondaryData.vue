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
    <div class="px-10 py-20">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div
          class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Client Address</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line1"
              />
              <!-- <span class="text-black" v-if="v$.client.line1.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.line1.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span> -->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address line 2</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line2"
              />
              <!-- <span class="text-black" v-if="v$.client.line2.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.line2.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span> -->
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.city"
              />
              <!-- <span class="text-black" v-if="v$.client.city.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.city.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span> -->
            </label>
          </div>

          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.county"
              />
              <!-- <span class="text-black" v-if="v$.client.county.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.county.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span> -->
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.zip"
              />
              <!-- <span class="text-black" v-if="v$.client.zip.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.zip.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span> -->
            </label>
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
// import { required, email, alpha, numeric } from "@vuelidate/validators";
import axios from "axios";
export default {
  setup() {
    // return { v$: useVuelidate({ $autoDirty: true }) };
  },
  mounted() {
    // Get the current URL path
    const path = window.location.pathname;

    // Extract the primaryDataID from the URL path
    const primaryDataID = path.split("/")[2]; // Assuming "/secondaryData/{primaryDataID}" format

    // Assign the extracted primaryDataID to the client object
    this.client.primaryDataID = primaryDataID;

    let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/`;
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
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
    // // Retrieve the ID from the URL
    // const urlParams = new URLSearchParams(window.location.search);
    // const primaryDataID = urlParams.get("primaryDataID"); // assuming the URL parameter is named primaryDataID

    // // Set the retrieved ID to the client object's primaryDataID property
    // this.client.primaryDataID = primaryDataID;
  },
  data() {
    return {
      //   urlParams: new URLSearchParams(window.location.search),
      client: {
        primaryDataID: null,
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "",
          zip: "",
        },
      },
      error: "",
    };
  },

  methods: {
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      //   const isFormCorrect = await this.v$.$validate();
      const isFormCorrect = true;
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        let apiURL = import.meta.env.VITE_ROOT_API + `/secondarydata/address`;
        axios
          .post(apiURL, this.client, {
            headers: { token: localStorage.getItem("token") },
          })
          .then(() => {
            alert("Client has been succesfully added.");
            this.$router.push("/findclient");
            this.client = {
              address: {
                line1: "",
                line2: "",
                city: "",
                county: "",
                zip: "",
              },
            };
          })
          .catch((error) => {
            this.error = error;
            console.log(this.client.primaryDataID);
          });
      }
    },
  },
  // sets validations for the various data properties
  //   validations() {
  //     return {
  //       client: {
  //         address: {
  //           line1: { required },
  //           line2: { required },
  //           city: { required },
  //           county: { required },
  //           zip: { required },
  //         },
  //       },
  //     };
  //   },
};
</script>
