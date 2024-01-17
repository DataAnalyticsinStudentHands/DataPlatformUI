<!--'/instructorSpecificActivity' this page will only show experiences-->

<template>
    <main class="">
        <v-container>
          <p class="text-center font-weight-black text-h6">Activity: {{ originalActivityName }}</p>
          <br>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="activity.activityName" label="Activity Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="font-weight-black text-h8">Associated Experiences</p>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">Experience Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="experience in experiences" 
                    :key="experience._id"
                    :class="{ 'hoverRow': hoverId === experience._id}"
                    @mouseenter="hoverId = experience._id"
                    @mouseleave="hoverId = null"
                  >
                    <td @click="editExperience(experience._id)">{{ experience.experienceName }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-container>
      <div style="text-align:left;">
        <v-btn @click=goBack() class="ml-4 mr-4">
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
        originalActivityName: "", // Store the original activity name
        experiences: [],
        hoverId: null,
      };
    },

    mounted() {
      this.fetchActivityData();
      this.fetchAssociatedExperiences();
    },

    methods: {
      async fetchActivityData() {
        try {
          const store = useLoggedInUserStore();
          let token = store.token;
          let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${this.$route.params.id}`;
          const response = await axios.get(apiURL, { headers: { token }});
          this.activity = {
            ...this.activity,
            activityName: response.data.activityName,
            activityStatus: response.data.activityStatus,
          };
          this.originalActivityName = response.data.activityName;
        } catch (error) {
          this.handleError(error);
        }
      },

      async fetchAssociatedExperiences() {
        try {
          const store = useLoggedInUserStore();
          let token = store.token;
          let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/active/${this.$route.params.id}`;
          const response = await axios.get(apiURL, { headers: { token }});
          this.experiences = response.data;
        } catch (error) {
          this.handleError(error);
        }
      },

      async handleUpdateForm() {
        const user = useLoggedInUserStore();
        const token = user.token;

        // Object for normal Activity update
        const updatedActivity = {
          activityName: this.activity.activityName,
          activityStatus: this.activity.activityStatus,
        };

        let activityUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${this.$route.params.id}`;
        let experienceInstanceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/activity-update/${this.$route.params.id}`;

        try {
          // Update the Activity
          await axios.put(activityUpdateURL, updatedActivity, { headers: { token } });

          // Update Experience Instances and capture response
          const instanceUpdateResponse = await axios.put(experienceInstanceUpdateURL, { activityName: this.activity.activityName }, { headers: { token } });

          // Determine the toast message
          let toastMessage = 'Activity updated!';
          if (instanceUpdateResponse.data && instanceUpdateResponse.data.updatedInstances && instanceUpdateResponse.data.updatedInstances.length > 0) {
            toastMessage = 'Activity and related instances updated!';
          }

          // Handle successful update with appropriate toast message
          this.handleUpdateSuccess(toastMessage);
        } catch (error) {
          this.handleError(error);
        }
      },

      handleUpdateSuccess(toastMessage) {
        this.$router.push({
          name: 'instructorDataManagement',
          params: {
            activeTab: 3,
            toastType: 'info',
            toastMessage: toastMessage,
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--update'
          }
        });
      },

      editExperience(experienceID) {
        this.$router.push({ 
          name: "instructorSpecificExperience", 
          params: { 
            id: experienceID,
            activityID: this.$route.params.id
          } 
        });
      },

      goBack() {
        this.$router.push({
          name: "instructorDataManagement",
          params: {
            activeTab: 3
          }
        });
      }

    },
  };
  </script>

<style>
.hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
  }
</style>