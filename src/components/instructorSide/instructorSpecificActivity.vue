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
        <v-btn style="text-align:center;" @click="handleUpdateForm" class="ml-4 mr-4">Update</v-btn>
        <v-btn @click=$router.back()>
          Cancel
        </v-btn>

        
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
          let activityId = store.currentActivityId;
          let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${activityId}`;
          const response = await axios.get(apiURL, { headers: { token }});
          this.activity = {
            ...this.activity,
            activityName: response.data.activityName,
            activityStatus: response.data.activityStatus,
          };
          this.originalActivityName = response.data.activityName;
          // Update the store with the currentActivityId
          store.currentActivityId = activityId;
        } catch (error) {
          this.handleError(error);
        }
      },

      async fetchAssociatedExperiences() {
        try {
          const store = useLoggedInUserStore();
          let token = store.token;
          let activityId = store.currentActivityId;
          let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/active/${activityId}`;
          const response = await axios.get(apiURL, { headers: { token }});
          this.experiences = response.data;
        } catch (error) {
          this.handleError(error);
        }
      },
      handleUpdateForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities`;
  
        // Update the form data
        axios
          .put(`${url}/${user.currentActivityId}`, this.activity, {
            headers: { token },
          })
          .then(() => {
            this.$router.push({ 
              name: 'instructorDataManagement',
              params: {
                activeTab: 3,
                toastType: 'info',
                toastMessage: 'Activity updated!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--update'
            }
          });
          });
      },
      editExperience(experienceID) {
        this.$router.push({ name: "instructorSpecificExperience", params: { id: experienceID } });
      },
    },
  };
  </script>

<style>
.hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
  }
</style>