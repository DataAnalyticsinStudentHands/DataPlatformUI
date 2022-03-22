<!-- TODO: make font sizes appropriate -->
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        Client Intake Form
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <section>
          <section>
            <p class="text-left font-bold">Personal Details</p>
          </section>
          <section
            class="flex mt-10"
            :class="{
              responsive: $store.state.isResponsive,
              'space-x-10': !$store.state.isResponsive,
            }"
          >
            <div class="flex flex-col">
              <label class="self-start font-bold" for="firstName"
                >First Name
              </label>
              <input
                v-model="client.firstName"
                name="firstName"
                :class="{ 'w-2/5': $store.state.isResponsive }"
                type="text"
              />
              <span class="text-black" v-if="v$.client.firstName.$error">
                <p
                  style="color: red"
                  v-for="error of v$.client.firstName.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="middleName"
                >Middle Name</label
              >
              <input
                v-model="client.middleName"
                name="middleName"
                type="text"
                :class="{ 'w-2/5': $store.state.isResponsive }"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="lastName"
                >Last Name</label
              >
              <input
                v-model="client.lastName"
                name="lastName"
                type="text"
                :class="{ 'w-2/5': $store.state.isResponsive }"
              />
              <span class="text-black" v-if="v$.client.lastName.$error">
                <p
                  style="color: red"
                  v-for="error of v$.client.lastName.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </div>
          </section>
          <section>
            <section
              class="flex"
              :class="{
                responsive: $store.state.isResponsive,
                'space-x-10 mt-5': !$store.state.isResponsive,
              }"
            >
              <div class="flex flex-col">
                <label class="self-start font-bold" for="email">Email</label>
                <input
                  v-model="client.email"
                  name="email"
                  type="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
                <span class="text-black" v-if="v$.client.email.$error">
                  <p
                    style="color: red"
                    v-for="error of v$.client.email.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}!
                  </p>
                </span>
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="phoneNumber"
                  >Phone Number</label
                >
                <input
                  v-model="client.phoneNumbers[0].primaryPhone"
                  name="phoneNumber"
                  type="text"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
                <span
                  class="text-black"
                  v-if="v$.client.phoneNumbers[0].primaryPhone.$error"
                >
                  <p
                    style="color: red"
                    v-for="error of v$.client.phoneNumbers[0].primaryPhone
                      .$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}!
                  </p>
                </span>
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for=""
                  >Alternative Phone Number</label
                >
                <input
                  v-model="client.phoneNumbers[0].secondaryPhone"
                  name="secPhone"
                  type="text"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
              </div>
            </section>
          </section>
        </section>
        <section>
          <section>
            <p class="text-left font-bold mt-10">Address Details</p>
          </section>
          <section
            class="flex mt-10"
            :class="{
              responsive: $store.state.isResponsive,
              'space-x-10': !$store.state.isResponsive,
            }"
          >
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Address 1</label>
              <input
                v-model="client.address[0].line1"
                type="text"
                :class="{ 'w-3/5': $store.state.isResponsive }"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Address 2</label>
              <input
                v-model="client.address[0].line2"
                type="text"
                :class="{ 'w-2/5': $store.state.isResponsive }"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">City</label>
              <input
                v-model="client.address[0].city"
                type="text"
                :class="{ 'w-3/5': $store.state.isResponsive }"
              />
            </div>
          </section>
          <section class="mt-5">
            <section
              class="flex"
              :class="{
                responsive: $store.state.isResponsive,
                'space-x-10': !$store.state.isResponsive,
              }"
            >
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">County</label>
                <input
                  v-model="client.address[0].county"
                  type="text"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">Zip Code</label>
                <input
                  v-model="client.address[0].zipcode"
                  type="text"
                  :class="{ 'w-1/5': $store.state.isResponsive }"
                />
              </div>
            </section>
          </section>
        </section>
        <div class="flex justify-between mt-10 mr-20">
          <button type="submit">Add Client</button>
          <button @click.prevent type="reset">Clear Form</button>
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
    window.scrollTo(0, 0);
  },
  data() {
    return {
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
        address: [
          {
            type: "currentAddress",
            line1: "",
            line2: "",
            city: "",
            county: "",
            zipcode: "",
          },
        ],
      },
    };
  },
  methods: {
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        let apiURL = `http://${this.$store.state.ipAddress}:3000/primarydata`;
        axios
          .post(apiURL, this.client)
          .then(() => {
            alert("Client has been succesfully added. Returning to homescreen");
            this.$router.push("/");
            this.client = {
              firstName: "",
              middleName: "",
              lastName: "",
              email: "",
              phoneNumbers: [
                {
                  primaryPhone: "",
                  seondaryPhone: "",
                },
              ],
              address: [
                {
                  type: "currentAddress",
                  line1: "",
                  line2: "",
                  city: "",
                  county: "",
                  zipcode: "",
                },
              ],
              additionalData: [
                {
                  maritalStatus: "",
                  isSingleParent: "",
                  isPregnant: "",
                  isTeenParent: "",
                  deliveryDate: "",
                },
              ],
            };
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    //Is called whenever the screen is resized
  },
  // sets validations for the various data properties
  validations() {
    return {
      client: {
        firstName: { required, alpha },
        lastName: { required, alpha },
        email: { email },
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
<style>
input,
select {
  border: 1px solid #cfd4d9;
  border-radius: 4px;
}

button[type="submit"] {
  background-color: #7d0d15;
  border-radius: 4px;
  padding: 10px 16px;
  color: white;
}

button[type="reset"] {
  border: 1px solid #7d0d15;
  border-radius: 4px;
  padding: 10px 16px;
  color: #7d0d15;
}
.responsive {
  flex-direction: column;
  margin-left: 0;
}
</style>