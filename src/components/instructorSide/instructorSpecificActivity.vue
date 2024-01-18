<!--'/instructorSpecificActivity' this page will only show experiences-->

<template>
  <main class="">
      <v-container>
        <p class="text-center font-weight-black text-h6">Activity: {{ originalActivityName }}</p>
        <br>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="activity.activityName" label="Activity Name"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="font-weight-black text-h8">Associated Experiences</p>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">Experience Name</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="experience in experiences" 
                  :key="experience._id"
                  :class="{ 'hoverRow': hoverId === experience._id}"
                  @mouseenter="hoverId = experience._id"
                  @mouseleave="hoverId = null"
                >
                  <td @click="editExperience(experience._id)">{{ experience.experienceName }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click=goBack() class="mr-4">
              Cancel
            </v-btn>
            <v-btn style="text-align:center;" @click="checkAssociatedInstances('update')" :loading="updateLoading">Update</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" v-if="canActivityBeDeleted">
            <v-btn class="justify-end" @click="checkAssociatedInstances('delete')">Delete</v-btn>
          </v-col>
        </v-row>
      </v-container>
  </main>
<!-- Delete Dialog -->
<v-dialog v-model="showDeleteDialog" persistent width="auto">
  <v-card>
    <v-card-title class="headline">Confirm Delete</v-card-title>
    <v-card-text>
      Are you sure you want to delete this activity?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red-darken-1" text @click="showDeleteDialog = false">No</v-btn>
      <v-btn color="green-darken-1" text @click="confirmDelete">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Update Dialog -->
<v-dialog v-model="updateDialog" persistent width="auto">
  <v-card>
    <v-card-title class="headline">
      <v-icon left>mdi-update</v-icon>
      Confirm Update
    </v-card-title>
    <v-card-text>
      The following Experience Instances will be updated:
      <v-list dense>
          <v-list-item v-for="instance in associatedInstances" :key="instance._id">
              <v-list-item-title class="font-weight-bold">{{ instance.sessionName }} - {{ instance.experienceName }}</v-list-item-title>
          </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <div class="mt-3">
        Are you sure you want to update this Activity?
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="updateDialog = false">No</v-btn>
      <v-btn color="green darken-1" text @click="proceedWithUpdate">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Delete Dialog with Instances -->
<!-- Update Dialog -->
<v-dialog v-model="deleteDialogWithInstances" persistent width="auto">
  <v-card>
    <v-card-title class="headline">
      <v-icon left>mdi-delete-alert</v-icon>
      Confirm Delete
    </v-card-title>
    <v-card-text>
      The following Experience Instances will have this activity removed:
      <v-list dense>
          <v-list-item v-for="instance in associatedInstances" :key="instance._id" color="primary">
              <v-list-item-title class="font-weight-bold">{{ instance.sessionName }} - {{ instance.experienceName }}</v-list-item-title>
          </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <div class="mt-3">
        Are you sure you want to delete this Activity?
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="deleteDialogWithInstances = false">No</v-btn>
      <v-btn color="green darken-1" text @click="deleteActivity">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


</template>


<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      activity: {
        activityName: "",
        activityStatus: false
      },
      originalActivityName: "", // Store the original activity name
      experiences: [],
      hoverId: null,
      canActivityBeDeleted: false,
      showDeleteDialog: false,
      updateLoading: false,
      updateDialog: false,
      associatedInstances: [],
      deleteDialogWithInstances: false,
    };
  },

  async mounted() {
    await this.fetchActivityData();
    await this.fetchAssociatedExperiences();
    await this.checkIfActivityCanBeDeleted();
  },

  methods: {
    async fetchActivityData() {
      try {
        const store = useLoggedInUserStore();
        let token = store.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${this.$route.params.id}`;
        const response = await axios.get(apiURL, { headers: { token }});
        this.activity = {
          ...this.activity,
          activityName: response.data.activityName,
          activityStatus: response.data.activityStatus,
        };
        this.originalActivityName = response.data.activityName;
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchAssociatedExperiences() {
      try {
        const store = useLoggedInUserStore();
        let token = store.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/active/${this.$route.params.id}`;
        const response = await axios.get(apiURL, { headers: { token }});
        this.experiences = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async checkAssociatedInstances(action) {
      this.updateLoading = true;

      try {
        const store = useLoggedInUserStore();
        let token = store.token;
        let checkURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/active/${this.$route.params.id}`;
        const checkResponse = await axios.get(checkURL, { headers: { token } });

        console.log('checkResponse: ', checkResponse.data);

        if (action === "update") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instancesData;
            this.updateDialog = true;
          } else {
            this.proceedWithUpdate();
          }
        } else if (action === "delete") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instancesData;
            this.deleteDialogWithInstances = true;
          } else {
            this.confirmDelete();
          }
        }


      } catch (error) {
        this.handleError(error);
      } finally {
        this.updateLoading = false;
      }
    },

    async proceedWithUpdate() {
      const user = useLoggedInUserStore();
      const token = user.token;

      // Object for normal Activity update
      const updatedActivity = {
        activityName: this.activity.activityName,
        activityStatus: this.activity.activityStatus,
      };

      let activityUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${this.$route.params.id}`;
      let experienceInstanceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/activity-update/${this.$route.params.id}`;

      try {
        // Update the Activity
        await axios.put(activityUpdateURL, updatedActivity, { headers: { token } });

        // Update Experience Instances and capture response
        const instanceUpdateResponse = await axios.put(experienceInstanceUpdateURL, { activityName: this.activity.activityName }, { headers: { token } });

        // Determine the toast message
        let toastMessage = 'Activity updated!';
        if (instanceUpdateResponse.data && instanceUpdateResponse.data.updatedInstances && instanceUpdateResponse.data.updatedInstances.length > 0) {
          toastMessage = 'Activity and related instances updated!';
        }

        // Handle successful update with appropriate toast message
        this.handleUpdateSuccess(toastMessage);
      } catch (error) {
        this.handleError(error);
      }
    },

    async checkIfActivityCanBeDeleted() {
      try {
        const store = useLoggedInUserStore();
        let token = store.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activity/can-be-deleted/${this.$route.params.id}`;
        const response = await axios.get(apiURL, { headers: { token }});
        this.canActivityBeDeleted = response.data.canBeDeleted;
      } catch (error) {
        this.handleError(error);
      }
    },

    handleUpdateSuccess(toastMessage) {
      this.$router.push({
        name: 'instructorDataManagement',
        params: {
          activeTab: 3,
          toastType: 'info',
          toastMessage: toastMessage,
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        }
      });
    },

    editExperience(experienceID) {
      this.$router.push({ 
        name: "instructorSpecificExperience", 
        params: { 
          id: experienceID,
          activityID: this.$route.params.id
        } 
      });
    },

    confirmDelete() {
      console.log('confirmDelete called');
      this.deleteActivity();
      this.showDeleteDialog = false;
    },

    async deleteActivity() {
      console.log('delete activity called')
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activity/delete/${this.$route.params.id}`;

        await axios.delete(deleteURL, { headers: { token } });

        console.log('delete activity ended')

        // Navigate to the instructorDataManagement page with success message
        this.$router.push({
          name: 'instructorDataManagement',
          params: {
            activeTab: 3,
            toastType: 'success',
            toastMessage: 'Activity Deleted!',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
          }
        });
      } catch (error) {
        console.log('error: ', error);
        this.handleError(error);
      }
    },

    goBack() {
      this.$router.push({
        name: "instructorDataManagement",
        params: {
          activeTab: 3
        }
      });
    },

  },
};
</script>

<style>
.hoverRow {
  background-color: rgb(200, 201, 205);
  transition: background-color 0.3s ease-in-out;
}
</style>