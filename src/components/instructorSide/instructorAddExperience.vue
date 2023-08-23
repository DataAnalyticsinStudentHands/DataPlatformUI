<!--'/instructorAddExperience' this page will only show experiences-->
<template>
  <main>
    <v-form @submit.prevent="handleSubmitForm">
      <v-container>
        <p class="font-weight-black text-h6">New Experience</p>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="experience.experienceCategory" label="Experience's Category"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="experience.experienceName" label="Experience's Name"></v-text-field>
          </v-col>
        </v-row>
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
        <v-btn type="submit">Submit</v-btn>
        <v-btn @click=$router.back() style="margin-left: 10px;">
          Cancel
        </v-btn>
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
      experience: {
        experienceCategory: '',
        experienceName: '',
      },
      activities: [],
      selectedActivities: [],
    };
  },
  beforeMount() {
    window.scrollTo(0, 0);
    this.fetchActivityData();
  },
  methods: {
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
    handleSubmitForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;

      axios
        .post(apiURL, {
          experienceCategory: this.experience.experienceCategory,
          experienceName: this.experience.experienceName,
          activities: this.selectedActivities,
        }, {
          headers: { token },
        })
        .then(() => {
          this.$router.push({ 
              name: 'instructorExperiences',
              params: {
                toastType: 'success',
                toastMessage: 'Experience added!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
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
