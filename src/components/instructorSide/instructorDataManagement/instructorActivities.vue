<!--'/instructorActivities' this page will only show experiences-->
<template>
  <main class="">
    <center>
      <h2 style="text-align: center; margin-top: 2rem; margin-bottom: 2rem">
        <router-link class="" to="/instructorSemesters">Semesters</router-link> |
        <router-link class="" to="/instructorExperiences">Experiences</router-link> |
        <router-link class="" to="/instructorActivities">Activities</router-link>
      </h2>
      <p class="font-weight-black text-h6">
        {{ showInactive ? 'Inactive' : 'Active' }} Activities
      </p>
      <br>

      <v-btn style="text-align:center; margin-right:2rem;">
        <router-link class="" to="/instructorAddActivity">Add New Activity</router-link>
      </v-btn>
      
      <v-btn style="text-align:center" @click="toggleShowInactive">
        {{ showInactive ? 'Show Active Activities' : 'Show Inactive Activities' }}
      </v-btn>
      
      <br><br>

      <v-btn style="text-align:center; margin-right:2rem;" @click="deactivateActivities" v-if="selectedActivities.length > 0 && !showInactive">
        Deactivate
      </v-btn>

      <v-btn style="text-align:center" @click="activateActivities" v-if="selectedActivities.length > 0 && showInactive">
        Activate
      </v-btn>
      
      <br><br>

      <!-- Search input field -->
      <v-text-field
        v-model="searchQuery"
        label="Search by activity name"
        solo-inverted
        hide-details
        outlined
        dense
      ></v-text-field><br>

      <!-- Search by Experiences-->
      <v-autocomplete
        v-model="selectedExperiences"
        :items="experiences"
        item-title="experienceName"
        item-value="_id"
        label="Filter by Experience"
        multiple
        chips
        single-line
        clearable
        return-object
      ></v-autocomplete><br>

    </center>
    <div v-if="loading" justify="center" align="center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else style="display: flex; justify-content: center;">
      <div style="max-height: 400px; overflow-y: auto;">

        <v-table style="width: 100;">
          <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">Activity Name</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="activity in filteredActivityData" 
              :key="activity._id"
              :style="{ cursor: 'pointer' }"
              :class="{ 'hoverRow': hoverId === activity._id}"
              @mouseenter="hoverId = activity._id"
              @mouseleave="hoverId = null">

              <td class="text-left">
                <input
                  type="checkbox"
                  v-model="selectedActivities"
                  :value="activity._id"
                  style="outline: 2px solid #808080; margin-right: 10px;"
                >
              </td>

              <td class="text-left" @click="editActivity(activity._id)">{{ activity.activityName }}</td>

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
  name: 'instructorActivities',
  data() {
    return {
      activityData: [],
      showInactive: false,
      selectedActivities: [],
      searchQuery: '',
      hoverId: null,
      experiences: [],
      selectedExperiences: [],
    };
  },

  mounted() {
    useLoggedInUserStore().startLoading();
    this.fetchActivityData();
    this.fetchExperienceData()
    .then(() => {
      useLoggedInUserStore().stopLoading();
    })
    .catch((error) => {
      this.handleError(error)
      useLoggedInUserStore().stopLoading();
    });

    window.scrollTo(0, 0);
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
  },

  methods: {
    async fetchActivityData() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/activities/";
        const resp = await axios.get(apiURL, { headers: { token } });
        this.activityData = resp.data;
      } catch (error) {
        this.handleError(error);
        throw error;
      }
    },

    async fetchExperienceData() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experiences/active/";
        const resp = await axios.get(apiURL, {headers: { token }});
        this.experiences = resp.data.map(exp => ({
          _id: exp._id,
          experienceName: exp.experienceName
        }));
      } catch (error) {
        this.handleError(error);
        throw error;
      }
    },

    formatDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).toFormat('MM-dd-yyyy');
    },

    editActivity(activityID) {
      const store = useLoggedInUserStore();
      store.currentActivityId = activityID;
      this.$router.push({ name: "instructorSpecificActivity" });
    },

    toggleShowInactive() {
      this.showInactive = !this.showInactive;
      this.selectedActivities = [];
    },

    deactivateActivities() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { activityStatus: false };

      const promises = this.selectedActivities.map((activityID) => {
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/activities/${activityID}`;
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          const message = (this.selectedActivities.length === 1 ? 'Activity' : 'Activities') + ' deactivated!'
          this.selectedActivities = [];
          this.fetchActivityData();
          toast.success(message, {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create'
          });
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    activateActivities() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { activityStatus: true };

      const promises = this.selectedActivities.map((activityID) => {
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/activities/${activityID}`;
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          const message = (this.selectedActivities.length === 1 ? 'Activity' : 'Activities') + ' activated!'
          this.selectedActivities = [];
          this.fetchActivityData();
          toast.success(message, {
              position: 'top-right',
              toastClassName: 'Toastify__toast--create'
          });
        })
        .catch((error) => {
          this.handleError(error);
        });
    }
    
  },

  computed: {
    filteredActivityData() {
      const query = this.searchQuery.toLowerCase().trim();

      // Show only active/inactie activities based on toggle
      let filteredData = this.activityData.filter((activity) => 
        this.showInactive ? !activity.activityStatus : activity.activityStatus
      );

      // If there is a search query, further filter the data
      if (query) {
        filteredData = filteredData.filter((activity) => 
          activity.activityName.toLowerCase().includes(query)
        );
      }

      // If an Experience is selected, filter the data
      if (this.selectedExperiences && this.selectedExperiences.length) {
        filteredData = filteredData.filter((activity) => 
          activity.experiences && activity.experiences.some((exp) =>
            this.selectedExperiences.map(e => e._id).includes(exp._id)
          )
        );
      }

      return filteredData;
    },
    loading() {
      const store = useLoggedInUserStore()
      return store.loading;
    }
  }
};

</script>

<style>
.v-field__input > input[size="1"] {
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

.v-field__input > input[size="1"]::before,
.v-field__input > input[size="1"]::after {
  display: none;
}

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


.hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
  }

</style>
