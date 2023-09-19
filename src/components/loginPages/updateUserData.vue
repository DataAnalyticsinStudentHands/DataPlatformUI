<!--'/updateUserData' this page will allow user data changes-->
<template>
  <main>
    <v-container style="width: 90%; margin: 0 auto;">
      <p class="font-weight-black text-h5 text--primary">User Information Update Form</p>
      <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again.</p>
    </v-container>
    <v-form @submit.prevent="handleSubmitForm">
      <v-container style="width: 90%; margin: 0 auto;">
        <v-col cols="12" md="6">
          <v-text-field v-model="firstName" label="New First Name"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="lastName" label="New Last Name"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="email" label="New Email"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-radio-group v-model="languagePreference" label="New Language Preference" row>
            <v-radio label="English" value="English" color="black"></v-radio>
            <v-radio label="Spanish" value="Spanish" color="black"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" md="6">
          <p>Please enter your password to confirm your changes:</p>
          <v-text-field v-model="confirmPassword" label="Password" type="password"></v-text-field>
        </v-col>
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
        languagePreference: '',
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
            this.languagePreference = this.userData.languagePreference;
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
        const destination = user.role === 'Student' ? 'studentDashboard' : user.role === 'Instructor' ? 'instructorDash' : '';

        
        axios.put(apiURL, {firstName: this.firstName, lastName: this.lastName, email: this.email, languagePreference: this.languagePreference, password: this.confirmPassword}, {headers: { token }})
        .then(() => {
          this.$router.push({ 
              name: destination,
              params: {
                toastType: 'info',
                toastMessage: 'User Information updated!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--update'
            }
          });
        })
        .catch((error) => {
            alert(error.response.data.error);
        });
      }
    }
  }
  </script>