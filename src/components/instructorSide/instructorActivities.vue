<!--'/instructorActivities' this page will only show experiences-->
<template>
  <main class="">
    <center>
      <h2 style="text-align: center; margin-top: 2rem; margin-bottom: 2rem">
        <router-link class="" to="/instructorSemesters">Semesters</router-link> |
        <router-link class="" to="/instructorExperiences">Experiences</router-link> |
        <router-link class="" to="/instructorActivities">Activities</router-link>
      </h2>
      <p class="font-weight-black text-h6">Activities</p>
      <br>
      <v-btn style="text-align:center" @click="toggleShowInactive">
        {{ showInactive ? 'Show Active Activities' : 'Show Inactive Activities' }}
      </v-btn>
      <br>
      <br>
      <v-btn style="text-align:center">
        <router-link class="" to="/instructorAddActivity">Add New Activity</router-link>
      </v-btn>
    </center>
    <div style="display: flex; justify-content: center;">
      <v-table style="width: 80%">
        <thead>
          <tr>
            <th class="text-left">Activity Name</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr @click="editActivity(activity._id)" v-for="activity in filteredActivityData" :key="activity._id">
            <td class="text-left">{{ activity.activityName }}</td>
            <td class="text-left">{{ activity.activityStatus ? 'Active' : 'Inactive' }}</td>
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
      activityData: [],
      showInactive: false
    };
  },
  mounted() {
    this.fetchActivityData();
    window.scrollTo(0, 0);
  },
  methods: {
    fetchActivityData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/activities/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          this.activityData = resp.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).toFormat('MM-dd-yyyy');
    },
    editActivity(activityID) {
      this.$router.push({ name: "instructorSpecificActivity", params: { id: activityID } });
    },
    toggleShowInactive() {
      this.showInactive = !this.showInactive;
    }
  },
  computed: {
    filteredActivityData() {
      if (this.showInactive) {
        return this.activityData.filter((activity) => !activity.activityStatus);
      } else {
        return this.activityData.filter((activity) => activity.activityStatus);
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
