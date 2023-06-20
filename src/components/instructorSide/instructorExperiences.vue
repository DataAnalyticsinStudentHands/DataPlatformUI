<!--'/instructorExperiences' this page will only show experiences-->
<template>
  <main class="">
    <center>
      <h2 style="text-align: center; margin-top: 2rem; margin-bottom: 2rem">
        <router-link class="" to="/instructorSemesters">Semesters</router-link> |
        <router-link class="" to="/instructorExperiences">Experiences</router-link> |
        <router-link class="" to="/instructorActivities">Activities</router-link>
      </h2>
      <p class="font-weight-black text-h6">Experiences</p>
      <br>
      <v-btn style="text-align:center" @click="toggleShowInactive">
        {{ showInactive ? 'Show Active Experiences' : 'Show Inactive Experiences' }}
      </v-btn>
      <br>
      <br>
      <v-btn style="text-align:center">
        <router-link class="" to="/instructorAddExperience">Add New Experience</router-link>
      </v-btn>
      <br>
    </center>
    <div style="display: flex; justify-content: center;">
      <v-table style="width: 80%">
        <thead>
          <tr>
            <th class="text-left">Experience Code</th>
            <th class="text-left">Experience Name</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr @click="editExperience(experience._id)" v-for="experience in filteredExperienceData" :key="experience._id">
            <td class="text-left">{{ experience.experienceCode }}</td>
            <td class="text-left">{{ experience.experienceName }}</td>
            <td class="text-left">{{ experience.experienceStatus ? 'Active' : 'Inactive' }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </main>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  data() {
    return {
      experienceData: [],
      showInactive: false
    };
  },
  mounted() {
    this.fetchExperienceData();
    window.scrollTo(0, 0);
  },
  methods: {
    fetchExperienceData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          this.experienceData = resp.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).toFormat('MM-dd-yyyy');
    },
    editExperience(experienceID) {
      this.$router.push({ name: "instructorSpecificExperience", params: { id: experienceID } });
    },
    toggleShowInactive() {
      this.showInactive = !this.showInactive;
    }
  },
  computed: {
    filteredExperienceData() {
      if (this.showInactive) {
        return this.experienceData.filter((experience) => !experience.experienceStatus);
      } else {
        return this.experienceData.filter((experience) => experience.experienceStatus);
      }
    }
  }
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
