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
      <br><v-btn style="text-align:center; margin-right:2rem;">
        <router-link class="" to="/instructorAddSemester">Add New Semester</router-link>
      </v-btn>

      <v-btn style="text-align:center" @click="toggleShowInactive">
        {{ showInactive ? 'Show Active Semesters' : 'Show Inactive Semesters' }}
      </v-btn>     

      <br><br>

      <v-btn style="text-align:center; margin-right:2rem;" @click="deactivateSemesters" v-if="selectedSemesters.length > 0">
        Deactivate
      </v-btn>

      <v-btn style="text-align:center" @click="activateSemesters" v-if="selectedSemesters.length > 0">
        Activate
      </v-btn>
      <br><br>
      <v-text-field v-model="searchTerm" placeholder="Search by semester name or date ranges"></v-text-field>
    </center>

    <div v-if="loading" justify="center" align="center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else style="display: flex; justify-content: center;">
      <div style="max-height: 400px; overflow-y: auto;">
        <v-table style="width: 100%">
          <thead>
            <tr>
              <th class="text-left column-margin"></th>
              <th class="text-left column-margin">Semester</th>
              <th class="text-left column-margin">Date Ranges</th>
              <th class="text-left column-margin">Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="semester in filteredSemesterData" 
              :key="semester._id"
              :style="{ cursor: 'pointer' }"
              :class="{ 'hoverRow': hoverId === semester._id}"
              @mouseenter="hoverId = semester._id"
              @mouseleave="hoverId = null"
              >

              <td class="text-left">
                <input type="checkbox" v-model="selectedSemesters" :value="semester._id" style="outline: 2px solid #808080; margin-right: 10px;">
              </td>

              <td class="text-left" @click="editSemester(semester._id)">{{ semester.semesterName }}</td>

              <td class="text-left" @click="editSemester(semester._id)">{{ formatDate(semester.semesterStartDate) + " to " + formatDate(semester.semesterEndDate) }}</td>
              <td class="text-left" @click="editSemester(semester._id)">{{ semester.semesterStatus ? 'Active' : 'Inactive' }}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </main>

</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  components: {
  },
  data() {
    return {
      semesterData: [],
      showInactive: false,
      selectedSemesters: [],
      searchTerm: "",
      hoverId: null,
    };
  },
  watch: {
    '$route': 'onRouteChange'
  },
  mounted() {
    useLoggedInUserStore().startLoading();
    this.fetchSemesterData()
      .then(() => {
        useLoggedInUserStore().stopLoading();
      })
      .catch((error) => {
        console.error(error);
        useLoggedInUserStore().stopLoading();
      });
    window.scrollTo(0, 0);

    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, {
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS,
      });
    }
  },
  methods: {
    formatDate(datetimeDB) {
      const formattedDate = DateTime.fromISO(datetimeDB).plus({ days: 1 }).toFormat('MM-dd-yyyy');
      return formattedDate;
    },

    editSemester(semesterID) {
      this.$router.push({ name: "instructorSpecificSemester", params: { id: semesterID } });
    },

    async fetchSemesterData() {
      useLoggedInUserStore().startLoading();
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters/`;
        const resp = await axios.get(apiURL, { headers: { token } });
        this.semesterData = resp.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
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
          const message = (this.selectedSemesters.length === 1 ? 'Semester' : 'Semesters') + ' deactivated!'
          this.selectedSemesters = [];
          this.fetchSemesterData();
          toast.error(message, {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete'
          });
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
          const message = (this.selectedSemesters.length === 1 ? 'Semester' : 'Semesters') + ' activated!'
          this.selectedSemesters = [];
          this.fetchSemesterData();
          toast.success(message, {
              position: 'top-right',
              toastClassName: 'Toastify__toast--create'
          });
          
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  computed: {
    filteredSemesterData() {
      const searchTerm = this.searchTerm.toLowerCase();
      const filteredData = this.semesterData.filter((semester) => {
        const semesterName = semester.semesterName.toLowerCase();
        const dateRanges = this.formatDate(semester.semesterStartDate) + " to " + this.formatDate(semester.semesterEndDate);
        return semesterName.includes(searchTerm) || dateRanges.includes(searchTerm);
      });

      if (this.showInactive) {
        return filteredData.filter((semester) => !semester.semesterStatus);
      } else {
        return filteredData.filter((semester) => semester.semesterStatus);
      }
    },
    loading() {
      const store = useLoggedInUserStore();
      return store.loading;
    }
  },
};
</script>


<style>
#contentNavbar .nav-link.router-link-exact-active {
  background-color: #eee;
}
.column-margin {
  margin-right: 10px;
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

.hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
  }


</style>
