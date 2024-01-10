<template>
  <main>
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
    <div style="text-align: left;">
      <v-btn style="text-align: center;" @click="updateExperience" class="ml-4 mr-4">Update</v-btn>
      <v-btn @click="cancelAction">
        Cancel
      </v-btn>


    </div>

  </main>

</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  name: 'SpecificExperience',
  props: {
    experience: Object,
    isInDialog: {
      type: Boolean,
      default: false
    }
  },
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

  mounted() {
    console.log('instructorSpecificExperience mounted');
    window.scrollTo(0, 0);

    this.loadData();
  },

  methods: {

    async loadData() {
      await this.fetchActivityData();

      if (this.experience) {
        // If experience is passed as a prop, initialize data with it
        this.initializeData(this.experience);
      } else {
        console.log('fetch data based on router parameters')
        // Otherwise fetch data based on router parameters
        await this.fetchExperienceData();
      }
    },

    initializeData(experience) {
      console.log('experience: ', experience);
      this.originalExperienceCategory = experience.experienceCategory;
      this.originalExperienceName = experience.experienceName;
      this.experienceCategory = experience.experienceCategory;
      this.experienceName = experience.experienceName;

      // Filter and map activities related to the current experience
      this.selectedActivities = this.activities
        .filter(activity => 
          activity.experiences.some(exp => exp._id === experience._id))
        .map(activity => activity._id);

      console.log('Selected Activities after initialization: ', this.selectedActivities);
    },


    fetchExperienceData() {
      const user = useLoggedInUserStore();
      const token = user.token;

      // const token = `
      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDg3NTcxOCwiZXhwIjoxNzA0ODg3NzE4fQ.1GbBbYs6cRiwpHjkAm97mWJ2Gk-Ksl8VXyEySueiTOk
      // `

      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${this.$route.params.id}`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          this.initializeData(resp.data);
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    async fetchActivityData() {
      const user = useLoggedInUserStore();
      const token = user.token;

      // const token = `
      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDg3NTcxOCwiZXhwIjoxNzA0ODg3NzE4fQ.1GbBbYs6cRiwpHjkAm97mWJ2Gk-Ksl8VXyEySueiTOk
      // `


      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      try {
        const resp = await axios.get(apiURL, { headers: { token } });
        const activities = resp.data;
        console.log('activities: ', activities);
        this.activities = activities.filter((activity) => activity.activityStatus === true);
      } catch (error) {
        this.handleError(error);
      }
    },

    async updateExperience() {
      console.log('updateExperience');
      const user = useLoggedInUserStore();
      // const token = user.token;

      
      const token = `
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDg3NTcxOCwiZXhwIjoxNzA0ODg3NzE4fQ.1GbBbYs6cRiwpHjkAm97mWJ2Gk-Ksl8VXyEySueiTOk
      `

      const experienceId = this.experience?._id || this.$route.params.id;

      // Object for normal Experience update
      const updatedExperience = {
        experienceCategory: this.experienceCategory,
        experienceName: this.experienceName,
        activities: this.selectedActivities, // IDs only for updating the experience
      };

      // Prepare activities data with id and name for Experience Instance update
      const activitiesData = this.activities
        .filter(activity => this.selectedActivities.includes(activity._id))
        .map(activity => ({ id: activity._id, name: activity.activityName }));

      const experienceInstanceUpdate = {
        experience: {
          category: this.experienceCategory,
          name: this.experienceName,
        },
        activities: activitiesData,
      };

      let experienceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experienceId}`;
      let experienceInstanceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/experience-update/${experienceId}`;

      try {
        // Update the Experience
        await axios.put(experienceUpdateURL, updatedExperience, { headers: { token } });

        // Update Experience Instances and capture response
        const instanceUpdateResponse = await axios.put(experienceInstanceUpdateURL, experienceInstanceUpdate, { headers: { token } });

        // Handle successful update
        this.handleUpdateSuccess(instanceUpdateResponse.data);

      } catch (error) {
        console.log('error: ', error);
        this.handleError(error);
      }
    },


    
    handleUpdateSuccess(instanceUpdateData) {
      let successMessage = 'Experience updated!';

      // Check if any instances were updated
      if (instanceUpdateData.updatedInstances && instanceUpdateData.updatedInstances.length > 0) {
        successMessage = 'Experience and related instances updated!';
      }

      if (this.isInDialog) {
        this.$emit('update-success');
      } else {
        this.$router.push({
          name: 'instructorDataManagement',
          params: {
            activeTab: 2,
            toastType: 'info',
            toastMessage: successMessage,
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--update'
          }
        });
      }
    },

    cancelAction() {
      if (this.isInDialog) {
        // Emit an event to close the dialog
        this.$emit('close-dialog');
      } else {
        // Use router back for standalone use
        this.$router.back();
      }
    }
    
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
