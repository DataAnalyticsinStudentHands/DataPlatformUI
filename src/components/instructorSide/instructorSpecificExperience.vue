<!--'/instructorSpecificExperience' this page will only show experiences-->
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
    window.scrollTo(0, 0);
    if (this.experience) {
      // If experience is passed as a prop, initialize data with it
      this.initializeData(this.experience);
    } else {
      // Otherwise fetch data based on router parameters
      this.fetchExperienceData();
    }
    // Fetch Activity Data
    this.fetchActivityData();
  },

  methods: {

    initializeData(experience) {
      this.originalExperienceCategory = experience.experienceCategory;
      this.originalExperienceName = experience.experienceName;
      this.experienceCategory = experience.experienceCategory;
      this.experienceName = experience.experienceName;
      this.selectedActivites = experience.activities.map(a => a._id);
    },

    fetchExperienceData() {
      const user = useLoggedInUserStore();
      // const token = user.token;

      const token = `
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDExNTQyNiwiZXhwIjoxNzA0MTI3NDI2fQ.Bssn6Sj3Jo7fzkZS870qsKaGHPfv3YIvZ8cCWKQaXRQ
      `

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

    fetchActivityData() {
      const user = useLoggedInUserStore();
      // const token = user.token;

      const token = `
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDExNTQyNiwiZXhwIjoxNzA0MTI3NDI2fQ.Bssn6Sj3Jo7fzkZS870qsKaGHPfv3YIvZ8cCWKQaXRQ
      `

      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const activities = resp.data;
          this.activities = activities.filter((activity) => activity.activityStatus === true);
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    updateExperience() {
      console.log('updateExperience');
      // Handle update logic
      const user = useLoggedInUserStore();
      // const token = user.token;

      const experienceId = this.experience?._id || this.$route.params.id;

      const token = `
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDExNTQyNiwiZXhwIjoxNzA0MTI3NDI2fQ.Bssn6Sj3Jo7fzkZS870qsKaGHPfv3YIvZ8cCWKQaXRQ
      `
      const updatedExperience = {
        experienceCategory: this.experienceCategory,
        experienceName: this.experienceName,
        activities: this.selectedActivities,
      };
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experienceId}`;
      axios
        .put(apiURL, updatedExperience, { headers: { token } })
        .then(() => {

          if (this.isInDialog) {
            // Close the dialog and optionall emit an event to parent
            this.$emit('update-success');
          } else {
            this.$router.push({ 
                name: 'instructorExperiences',
                params: {
                  toastType: 'info',
                  toastMessage: 'Experience updated!',
                  toastPosition: 'top-right',
                  toastCSS: 'Toastify__toast--update'
              }
            });
          }
        })
        .catch((error) => {
          this.handleError(error);
        });
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
