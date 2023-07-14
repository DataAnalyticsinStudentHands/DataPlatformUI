<!-- /exitFormsAvailable -->
<template>
  <main class="">
    <center>
      <br>
      <p class="font-weight-black text-h6">Exit Forms</p>
      <br>
    </center>
    <div style="display: flex; justify-content: center;">
      <div style="max-height: 400px; overflow-y: auto;">
        <v-table style="width: 100%">
          <thead>
            <tr>
              <th class="text-left column-margin"></th>
              <th class="text-left column-margin">Experience Name</th>
              <th class="text-left column-margin">Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(experience, index) in completedExperiences" :key="experience._id">
  <td></td>
  <td class="text-left" @click="createExitForm(goalSettingFormIDs[experience._id][0], index)">{{ experience.experienceName }}</td>
  <td class="text-left" @click="createExitForm(goalSettingFormIDs[experience._id][0], index)">{{ experience.exitFormCreated ? 'Complete' : 'Incomplete' }}</td>
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
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  data() {
    return {
      completedExperiences: [],
      goalSettingFormIDs: {},
      selectedExperiences: [],
      searchTerm: "",
    };
  },
  mounted() {
    this.fetchCompletedExperiences();
    window.scrollTo(0, 0);
  },
  methods: {
    fetchCompletedExperiences() {
      const user = useLoggedInUserStore();
      const token = user.token;
      const apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/completedExperiences";

      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          this.completedExperiences = resp.data.data;
          this.goalSettingFormIDs = resp.data.goalSettingFormIDs;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    createExitForm(goalSettingFormID, index) {
      console.log(goalSettingFormID); // Log the value of goalSettingFormID
      this.$router.push({ name: "exitForm", params: { id: goalSettingFormID } });
    },
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
</style>
