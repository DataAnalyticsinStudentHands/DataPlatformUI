<!--'/instructorSpecificActivity' this page will only show experiences-->

<template>
    <main class="">
      <center>
        <v-container>
          <p class="font-weight-black text-h6">Activity: {{ originalActivityName }}</p>
          <br>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="activity.activityName" label="Activity Name"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </center>
      <div style="text-align:right;">
        <v-btn @click=$router.back() style="margin-right: 10px;">
          Cancel
        </v-btn>
        <v-btn style="text-align:center;" @click="handleUpdateForm">Update</v-btn>
      </div>
    </main>
  </template>
  
  <style>
    #contentNavbar .nav-link.router-link-exact-active {
      background-color: #eee;
    }
  
    /* Medium Devices, Desktops */
    @media only screen and (min-width: 992px) {
      #contentNavbar .nav-item {
        border: 3px solid black;
        border-right: none;
      }
      #contentNavbar .nav-item:last-child {
        border: 1px solid black;
      }
    }
  </style>
  
  <script>
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import axios from "axios";
  
  export default {
    props: ["id"],
    data() {
      return {
        activity: {
          activityName: "",
          activityStatus: false
        },
        originalActivityName: "" // Store the original activity name
      };
    },
    beforeMount() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities`;
      axios
        .get(`${url}/${this.$route.params.id}`, {
          headers: { token },
        })
        .then((resp) => {
          let data = resp.data[0];
          console.log(resp.data[0]);
          this.activity.activityName = data.activityName;
          this.activity.activityStatus = data.activityStatus;
          this.originalActivityName = data.activityName; // Set the original activity name
        });
    },
    methods: {
      handleUpdateForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities`;
  
        // Update the form data
        axios
          .put(`${url}/${this.$route.params.id}`, this.activity, {
            headers: { token },
          })
          .then(() => {
            this.$router.push({ 
              name: 'instructorActivities',
              params: {
                toastType: 'info',
                toastMessage: 'Activity updated!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--update'
            }
          });
          });
      },
    },
  };
  </script>
  