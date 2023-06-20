<!--'/instructorSemesters' this page will only show semesters-->
<template>
  <main class="">
    <center>
      <h2 style="text-align: center; margin-top: 2rem; margin-bottom: 2rem">
        <router-link class="" to="/instructorSemesters">Semesters</router-link> |
        <router-link class="" to="/instructorExperiences">Experiences</router-link> |
        <router-link class="" to="/instructorActivities">Activities</router-link>
      </h2>
      <p class="font-weight-black text-h6">Semesters</p>
      <br>
      <v-btn style="text-align:center" @click="toggleShowInactive">
        {{ showInactive ? 'Show Active Semesters' : 'Show Inactive Semesters' }}
      </v-btn>
      <br><br>
      <v-btn style="text-align:center">
        <router-link class="" to="/instructorAddSemester">Add New Semester</router-link>
      </v-btn>
      <br><br>
      <v-btn style="text-align:center" @click="deactivateSemesters" v-if="selectedSemesters.length > 0">
        Deactivate
      </v-btn>
      <v-btn style="text-align:center" @click="activateSemesters" v-if="selectedSemesters.length > 0">
        Activate
      </v-btn>
    </center>
    <div style="display: flex; justify-content: center;">
      <v-table style="width: 80%">
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Semester</th>
            <th class="text-left">Date Ranges</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="semester in filteredSemesterData"
            :key="semester._id"
          >
            <td class="text-left">
              <input type="checkbox" v-model="selectedSemesters" :value="semester._id" style="outline: 2px solid #808080; margin-right: 10px;">
            </td>
            <td class="text-left">{{ semester.semesterName }}</td>
            <td class="text-left">{{ formatDate(semester.semesterStartDate) + " to " + formatDate(semester.semesterEndDate) }}</td>
            <td class="text-left">{{ semester.semesterStatus ? 'Active' : 'Inactive' }}</td>
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
      semesterData: [],
      showInactive: false,
      selectedSemesters: []
    };
  },
  mounted() {
    this.fetchSemesterData();
    window.scrollTo(0, 0);
  },
  methods: {
    formatDate(datetimeDB) {
      const formattedDate = DateTime.fromISO(datetimeDB).plus({ days: 1 }).toFormat('MM-dd-yyyy');
      return formattedDate;
    },
    editSemester(semesterID) {
      this.$router.push({ name: "instructorSpecificSemester", params: { id: semesterID } });
    },
    fetchSemesterData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters/`;
      axios.get(apiURL, { headers: { token } })
        .then((resp) => {
          this.semesterData = resp.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toggleShowInactive() {
      this.showInactive = !this.showInactive;
    },
    deactivateSemesters() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { semesterStatus: false };

      const promises = this.selectedSemesters.map((semesterID) => {
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters/${semesterID}`;
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          this.selectedSemesters = [];
          this.fetchSemesterData();
          alert("The semester(s) have been deactivated.");
          this.$router.push("/instructorSemesters"); // Navigate to /instructorSemesters
        })
        .catch((error) => {
          console.log(error);
        });
    },
    activateSemesters() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { semesterStatus: true };

      const promises = this.selectedSemesters.map((semesterID) => {
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters/${semesterID}`;
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          this.selectedSemesters = [];
          this.fetchSemesterData();
          alert("The semester(s) have been activated.");
          this.$router.push("/instructorSemesters"); // Navigate to /instructorSemesters
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  computed: {
    filteredSemesterData() {
      if (this.showInactive) {
        return this.semesterData.filter((semester) => !semester.semesterStatus);
      } else {
        return this.semesterData.filter((semester) => semester.semesterStatus);
      }
    }
  }
}
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
