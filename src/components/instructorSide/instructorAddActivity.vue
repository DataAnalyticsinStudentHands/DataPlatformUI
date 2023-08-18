<!--'/instructorAddActivity' this page will only show experiences-->
<template>
    <main>
      <v-form @submit.prevent="handleSubmitForm">
        <v-container>
          <p class="font-weight-black text-h6">New Activity</p>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="activity.activityName" label="Activity's Name"></v-text-field>
              </v-col>
            </v-row>
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
        activity: {
          activityName:''
        }
      };
    },
    methods: {
      async handleSubmitForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/activities/`;
        
        axios.post(apiURL, this.activity, {headers: { token }})
        .then((response) => {
          alert("Activity has been successfully added.");
          this.$router.push("/instructorActivities");
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }
  }
  </script>
  
  <style>
  #contentNavbar .nav-link.router-link-exact-active{
      background-color: #eee;
  }
  /* Medium Devices, Desktops */
  @media only screen and (min-width : 992px) {

      #contentNavbar .nav-item {
          border: 3px solid black;
          border-right: none;
      }
      #contentNavbar .nav-item:last-child {
          border: 1px solid black;
      }
  }
  </style>