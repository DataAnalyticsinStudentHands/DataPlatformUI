<!-- TODO: make font sizes appropriate -->
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        User Creation
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <section>
          <section>
            <p class="text-left font-bold">Personal Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="firstName">First Name</label>
              <input v-model="user.firstName" name="firstName" type="text" />
              <span class="text-black" v-if="v$.user.firstName.$error">
                <p
                  style="color: red"
                  v-for="error of v$.user.firstName.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="lastName"
                >Last Name</label
              >
              <input v-model="user.lastName" name="lastName" type="text" />
              <span class="text-black" v-if="v$.user.lastName.$error">
                <p
                  style="color: red"
                  v-for="error of v$.user.lastName.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}!
                </p>
              </span>
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="email">Email</label>
                <input
                  v-model="user.email"
                  name="email"
                  type="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                <span class="text-black" v-if="v$.user.email.$error">
                  <p
                    style="color: red"
                    v-for="error of v$.user.email.$errors"
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
                  v-model="user.phoneNumbers[0].primaryPhone"
                  name="phoneNumber"
                  type="text"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                />
                <span
                  class="text-black"
                  v-if="v$.user.phoneNumbers[0].primaryPhone.$error"
                >
                  <p
                    style="color: red"
                    v-for="error of v$.user.phoneNumbers[0].primaryPhone
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
                  v-model="user.phoneNumbers[0].secondaryPhone"
                  name="secPhone"
                  type="text"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                />
              </div>
            </section>
          </section>
        </section>

        <section class="mt-5">
          <div class="flex flex-col">
            <label class="self-start font-bold" for="username">Username</label>
            <input v-model="user.username" name="username" type="text"/>
          </div>
          <div class="flex flex-col">
            <label class="self-start font-bold" for="password">Password</label>
            <input v-model="user.password" name="password" type="password"/>
          </div>
        </section>

        <section class="mt-5">
          <section>
            <p class="text-left font-bold">Access Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="genericAccess">Generic Access Level</label>
              <select v-model="user.genericAccessLevel" name="genericAccess">
                <option value="1">Nonsensitive View</option>
                <option value="2">Nonsensitive Write</option>
                <option value="3">Organization Access</option>
                <option value="4">Complete Access</option>
              </select>

              <label class="self-start font-bold" for="genericAccess">Write Override Access Level</label>
              <select v-model="user.editOverride" name="writeAccess">
                <option value="-1">No Override</option>
                <option value="1">No Write</option>
                <option value="2">Nonsensitive Write</option>
                <option value="3">Organization Write</option>
                <option value="4">Complete Access</option>
              </select>

              <label class="self-start font-bold" for="genericAccess">Write Override Access Level</label>
              <select v-model="user.viewOverride" name="readAccess">
                <option value="-1">No Override</option>
                <option value="1">Nonsensitive Read</option>
                <option value="3">Organization Read</option>
                <option value="4">Complete Access</option>
              </select>

            </div>
          </section>

        </section>

        <div class="flex justify-between mt-10 mr-20">
          <button type="submit">Add user</button>
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
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumbers: [
          {
            primaryPhone: "",
            secondaryPhone: "",
          },
        ],
        username: "",
        password: "",
        association: "Kentucky Fried Chicken",
        genericAccessLevel: 4
      },
    };
  },
  methods: {
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        let apiURL = "http://localhost:3000/userData";
        axios
          .post(apiURL, this.user)
          .then(() => {
            this.$router.push("/");
            this.user = {
              firstName: "",
              lastName: "",
              email: "",
              phoneNumbers: [
                {
                  primaryPhone: "",
                  secondaryPhone: "",
                },
              ],
              username: "",
              password: "",
              association: "Kentucky Fried Chicken",
              genericAccessLevel: 4
             };
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  // sets validations for the various data properties
  validations() {
    return {
      user: {
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
  /* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
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
</style>