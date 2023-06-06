<!--This is going to be the testing page for goalSettingForm.-->
<template>
    <v-container>
      <p class="font-weight-black text-h5 text--primary">Testing</p>
      <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again later.</p>
    </v-container>
    <v-form @submit.prevent="handleSubmitForm">
      <v-container>
        <v-row>
            <v-col cols="11" md="10">
                <p class="font-weight-black text-h8">Please indicate which one of the experience(s) you are participating in this semester:</p>
                <v-radio-group v-model="experienceID">
                <v-radio v-model="experienceID" label="Office of Undergraduate Research (OUR) Programs (HERE,SURF, PURS, Mellon, REACH)" value="Office of Undergraduate Research (OUR) Programs (HERE,SURF, PURS, Mellon, REACH)"></v-radio>
                <v-radio v-model="experienceID" label="Honors in Community Health" value="Honors in Community Health"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-btn type="submit" methods="handleSubmitForm">Submit Form</v-btn>
            </v-col>
          </v-row>
      </v-container>
    </v-form>
  </template>
  
  <style>
  .v-field__input input {
     display: none;
  }
  </style>
  
  <script>
  import axios from "axios";
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  export default {
    data() {
      return {
        semester: '',
      }
    },
    mounted() {
    },
    computed: {
    },
    methods: {
      async handleSubmitForm() {
        const user = useLoggedInUserStore()
        let token = user.token
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goalForms/';
        axios.post(apiURL, {semester: this.semester}, { headers: { token } }).then(() => {
          alert("Goal Form has been successfully added.");
          this.semester = {semester: ''}
        })
        .catch((error) => {
          console.log(error);
        });
      }
    },
  }
  </script>