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
              <label class="self-start font-bold" for="genericAccess">Organization Read Access Level</label>
                  <span v-html="orlContent"></span>
              <label class="self-start font-bold" for="genericAccess">Organization Write Access Level</label>
                  <span v-html="owlContent"></span>
              <label class="self-start font-bold" for="genericAccess">Other Organization Read Access Level</label>
                  <span v-html="arlContent"></span>
              <label class="self-start font-bold" for="genericAccess">Other Organization Write Access Level</label>
                  <span v-html="awlContent"></span>

            </div>
          </section>
          <section>
            <label class="self-start font-bold" for="userCreation">Can Create Users</label>
            <input v-model="user.perms.canCreateUser" name="canCreateUser" type="checkbox">
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
        perms: {
            orgReadAccess: "",
            orgWriteAccess: "",
            allReadAccess: "",
            allWriteAccess: "",
            canCreateUser: ""
          },
      },
      owrContent:null,
      owlContent:null,
      awrContent:null,
      awlContent:null
    };
  },
  created() {
    let apiURL = `http://localhost:3000/userData/`;
    //Resets the list of queried data
    this.queryData = [];
    axios.get(apiURL, {
      params: {
        _id: localStorage.getItem("username")
      }
    }).then((resp) => {
      let data = resp.data;
      for (let i = 0; i < data.length; i++) {
        this.queryData.push(data[i]);
      }
      // let orl = this.queryData[0].perms.orgReadAccess;
      // let owl = this.queryData[0].perms.orgWriteAccess;
      // let arl = this.queryData[0].perms.allReadAccess;
      // let awl = this.queryData[0].perms.allWriteAccess;
      let orl = 3
      let owl = 3
      let arl = 3
      let awl = 3

    let orgReadAccess = `<select v-model="user.perms.orgReadAccess" name="orgReadAccess", id="orgReadAccess">\n`;
    let orgWriteAccess = `<select v-model="user.perms.orgWriteAccess" name="orgWriteAccess", id="orgWriteAccess">\n`;
    let allReadAccess = `<select v-model="user.perms.allReadAccess" name="allReadAccess", id="allReadAccess">\n`;
    let allWriteAccess = `<select v-model="user.perms.allWriteAccess" name="allWriteAccess", id="allWriteAccess">\n`;

    //Organization Read Access
    if(orl >= 1) {
      orgReadAccess += `<option value="1">Nonsensitive</option>\n`
      orgWriteAccess+= `<option value="0">No Access</option>\n`
    }
    if(orl >= 2) {
      orgReadAccess += `<option value="1">Privileged</options>\n`
    }
    if(orl ==3) {
      orgReadAccess += `<option value="2">Sensitive</options>\n`
    }

    //Organization Write Access
    if(owl >= 1) {
      orgWriteAccess+= `<option value="1">Nonsensitive</option>`
    }
    if(owl >= 2) {
      orgWriteAccess += `<option value="1">Privileged</options>\n`
    }
    if(owl ==3) {
      orgWriteAccess += `<option value="2">Sensitive</options>\n`
    }

    //All Read Access
    if(arl >= 1) {
      allReadAccess+= `<option value="0">No Access</option>\n`
      allReadAccess += `<option value="1">Nonsensitive</option>\n`
      allWriteAccess+= `<option value="0">No Access</option>\n`
    }
    if(arl >= 2) {
      allReadAccess += `<option value="1">Privileged</options>\n`
    }
    if(arl ==3) {
      allReadAccess += `<option value="2">Sensitive</options>\n`
    }

    //All Write Access
    if(awl >= 1) {
      allWriteAccess+= `<option value="1">Nonsensitive</option>`
    }
    if(awl >= 2) {
      allWriteAccess += `<option value="1">Privileged</options>\n`
    }
    if(awl ==3) {
      allWriteAccess += `<option value="2">Sensitive</options>\n`
    }


    allReadAccess +=  `</select>\n`
    allWriteAccess += `</select>\n`
    orgReadAccess +=  `</select>\n`
    orgWriteAccess += `</select>\n`
    this.orlContent = orgReadAccess
    this.owlContent = orgWriteAccess
    this.arlContent = allReadAccess
    this.awlContent = allWriteAccess
    });
    
  },
  methods: {
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      this.user.perms.orgReadAccess = document.getElementById('orgReadAccess').value;
      this.user.perms.orgWriteAccess = document.getElementById('orgWriteAccess').value;
      this.user.perms.allReadAccess = document.getElementById('allReadAccess').value;
      this.user.perms.allWriteAccess = document.getElementById('allWriteAccess').value;
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
              genericAccessLevel: "",
              editOverride: "",
              viewOverride: "",
              canCreateUser:""
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