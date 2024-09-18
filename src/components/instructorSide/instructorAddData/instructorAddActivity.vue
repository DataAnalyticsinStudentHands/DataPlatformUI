<!--'/instructorAddActivity' this page presents a form to create a new Activity-->
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

            <v-btn @click="$router.back()" style="margin-right: 10px;">
              Cancel
            </v-btn>
            <v-btn style="text-align: center;" @click="handleSubmitForm">Submit</v-btn>
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

      // Submits an activity to the backend and redirects to the data management view with a success toast message indicating the activity has been added.
      async handleSubmitForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/activities/`;
        
        axios.post(apiURL, this.activity, { headers: { token } })
          .then((response) => {
            user.navigationData = {
              activeTab: 2,
              toastType: 'success',
              toastMessage: 'Activity added!',
              toastPosition: 'top-right',
              toastCSS: 'Toastify__toast--create'
            };
            
            this.$router.push({ 
              name: 'instructorDataManagement'
            });
          })
          .catch((error) => {
            this.handleError(error);
          });
      },
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