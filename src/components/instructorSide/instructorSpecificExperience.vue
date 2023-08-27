<!--'/instructorSpecificExperience' this page will only show experiences-->
<template>
  <main>
    <center>
      <v-container>
        <p class="font-weight-black text-h6"> Experience: {{originalExperienceCategory}}, {{ originalExperienceName }}</p>
        <br />
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="experienceCategory" label="Experience Category"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="experienceName" label="Experience Name"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </center>
    <div style="text-align: left;">
      <v-table style="width: 80%">
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Activity Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="activity in activities" :key="activity._id">
            <td class="text-left">
              <input
                type="checkbox"
                v-model="selectedActivities"
                :value="activity._id"
                style="outline: 2px solid #808080; margin-right: 10px;"
              />
            </td>
            <td class="text-left">{{ activity.activityName }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div style="text-align: right;">
      <v-btn @click=$router.back() style="margin-right: 10px;">
          Cancel
        </v-btn>
      <v-btn style="text-align: center;" @click="updateExperience">Update</v-btn>
    </div>
  </main>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  props:["id"],
  data() {
    return {
      originalExperienceCategory: "",
      originalExperienceName: "",
      experienceCategory: "",
      experienceName: "",
      activities: [],
      selectedActivities: [],
    };
  },
  beforeMount() {
    window.scrollTo(0, 0);
    this.fetchExperienceData(); // Fetch experience data before component is mounted
    this.fetchActivityData(); // Fetch activities after experience data
  },
  methods: {
    fetchExperienceData() {
      // Fetch experience data from the backend
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${this.$route.params.id}`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const experience = resp.data[0];
          console.log(resp.data);
          console.log(resp.data[0]);
          this.originalExperienceCategory = experience.experienceCategory;
          this.originalExperienceName = experience.experienceName;
          this.experienceCategory = experience.experienceCategory;
          this.experienceName = experience.experienceName;
          this.selectedActivities = experience.activities;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchActivityData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const activities = resp.data;
          this.activities = activities.filter((activity) => activity.activityStatus === true);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateExperience() {
      // Handle update logic
      const user = useLoggedInUserStore();
      let token = user.token;
      const updatedExperience = {
        experienceCategory: this.experienceCategory,
        experienceName: this.experienceName,
        activities: this.selectedActivities,
      };
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${this.$route.params.id}`;
      axios
        .put(apiURL, updatedExperience, { headers: { token } })
        .then(() => {
          this.$router.push({ 
              name: 'instructorExperiences',
              params: {
                toastType: 'info',
                toastMessage: 'Experience updated!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--update'
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>


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
