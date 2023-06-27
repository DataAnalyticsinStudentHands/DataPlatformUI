<!--'/instructorExperiences' this page will only show experiences-->
<template>
  <main>
    <div><center>
      <br>
      <h2>
        <router-link to="/instructorSemesters">Semesters</router-link> |
        <router-link to="/instructorExperiences">Experiences</router-link> |
        <router-link to="/instructorActivities">Activities</router-link>
      </h2><br>
      <p class="font-weight-black text-h6">Experiences</p>
      <br><v-btn style="text-align:center; margin-right:2rem;">
        <router-link to="/instructorAddExperience">Add New Experience</router-link>
      </v-btn>
      <v-btn @click="toggleShowInactive">
        {{ showInactive ? 'Show Active Experiences' : 'Show Inactive Experiences' }}
      </v-btn>
      
      <br><br>
      <v-btn @click="deactivateExperiences" v-if="selectedExperiences.length > 0" style="text-align:center; margin-right:2rem;">
        Deactivate
      </v-btn>
      <v-btn @click="activateExperiences" v-if="selectedExperiences.length > 0">
        Activate
      </v-btn><br><br>
      <v-text-field
        v-model="searchQuery"
        label="Search by experience code or name"
        solo-inverted
        hide-details
        outlined
        dense
      ></v-text-field>
      <br></center>
    </div>
    <div style="display: flex; justify-content: center;">
  <div style="max-height: 400px; overflow-y: auto;">
      <v-table style="width: 100%">
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Experience Code</th>
            <th class="text-left">Experience Name</th>
            <th class="text-left">Status</th><th></th>
          <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="experience in filteredExperienceData" :key="experience._id">
            <td class="text-left">
              <input type="checkbox" v-model="selectedExperiences" :value="experience._id" style="outline: 2px solid #808080; margin-right: 10px;">
            </td>
            <td class="text-left" @click="editExperience(experience._id)">{{ experience.experienceCode }}</td>
            <td class="text-left" @click="editExperience(experience._id)">{{ experience.experienceName }}</td>
            <td class="text-left" @click="editExperience(experience._id)">{{ experience.experienceStatus ? 'Active' : 'Inactive' }}</td><td></td><td></td>
          </tr>
        </tbody>
      </v-table></div>
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
      showInactive: false,
      selectedExperiences: [],
      searchQuery: ''
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
      let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experiences/";
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
      return DateTime.fromISO(datetimeDB).toFormat("MM-dd-yyyy");
    },
    editExperience(experienceID) {
      this.$router.push({ name: "instructorSpecificExperience", params: { id: experienceID } });
    },
    toggleShowInactive() {
      this.showInactive = !this.showInactive;
    },
    deactivateExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { experienceStatus: false };

      const promises = this.selectedExperiences.map((experienceID) => {
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/${experienceID}`;
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          this.selectedExperiences = [];
          this.fetchExperienceData();
          alert("The experience(s) have been deactivated.");
          this.$router.push("/instructorExperiences"); // Navigate to /instructorExperiences
        })
        .catch((error) => {
          console.log(error);
        });
    },
    activateExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { experienceStatus: true };

      const promises = this.selectedExperiences.map((experienceID) => {
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/${experienceID}`;
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          this.selectedExperiences = [];
          this.fetchExperienceData();
          alert("The experience(s) have been activated.");
          this.$router.push("/instructorExperiences"); // Navigate to /instructorExperiences
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  computed: {
    filteredExperienceData() {
  const query = this.searchQuery.toLowerCase().trim();
  if (this.showInactive) {
    return this.experienceData.filter(
      (experience) =>
        !experience.experienceStatus &&
        (experience.experienceCode.toLowerCase().includes(query) ||
          experience.experienceName.toLowerCase().includes(query))
    );
  } else {
    return this.experienceData.filter(
      (experience) =>
        experience.experienceStatus &&
        (experience.experienceCode.toLowerCase().includes(query) ||
          experience.experienceName.toLowerCase().includes(query))
    );
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
