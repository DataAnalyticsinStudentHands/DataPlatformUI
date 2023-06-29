<!--'/updateUserData' this page will allow user data changes-->
<template>
    <main>
      <v-form @submit.prevent="handleSubmitForm">
        <v-container>
            <p class="font-weight-black text-h6">New First Name</p>
            <v-row>
            <v-col cols="12" md="6">
            <input v-model="firstName" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"  />
            </v-col>
            </v-row><br>
            <p class="font-weight-black text-h6">New Last Name</p>
            <v-row>
              <v-col cols="12" md="6">
                <input v-model="lastName" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
              </v-col>
            </v-row><br>
            <p class="font-weight-black text-h6">New Email</p>
            <v-row>
              <v-col cols="12" md="6">
                <input v-model="email" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
              </v-col>
            </v-row><br>
            <p class="font-weight-black text-h6">Confirm Password</p>
            <v-row>
              <v-col cols="12" md="6">
                <input v-model="confirmPassword" type="Password" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="••••••••" required/>
              </v-col>
            </v-row><br>
          <v-btn @click="handleSubmitForm">Submit</v-btn>
        </v-container>
      </v-form>
    </main>
  </template>

  <script>
  import axios from "axios";
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  export default {
    data() {
      return {
        userData: [],
        firstName: '',
        lastName: '',
        email: '',
        confirmPassword: ''
      };
    },
    mounted() {
        const user = useLoggedInUserStore()
        let token = user.token
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/user/`;
        axios.get(apiURL, { headers: { token },})
        .then(
            (resp) => {
            this.userData = resp.data.user;
            this.firstName = this.userData.firstName;
            this.lastName = this.userData.lastName;
            this.email = this.userData.email;
        })
        .catch((error) => {
            console.log(error);
        });
        window.scrollTo(0, 0);
    },
    methods: {
      async handleSubmitForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/updateUserData`;
        
        axios.put(apiURL, {firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.confirmPassword}, {headers: { token }})
        .then((response) => {
          alert("User data has been successfully updated.");
          this.$router.push("/");
        })
        .catch((error) => {
            alert(error.response.data.error);
        });
      }
    }
  }
  </script>