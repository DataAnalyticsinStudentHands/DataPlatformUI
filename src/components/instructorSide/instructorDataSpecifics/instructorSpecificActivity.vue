<!--'/instructorSpecificActivity' - this view presents a single Activity's data -->

<template>
  <main class="">
      <v-container>
        <!-- Display the original activity name as the title -->
        <p class="text-center font-weight-black text-h6">Activity: {{ originalActivityName }}</p>
        <br>
        <v-row>
          <v-col cols="12" md="8">
            <!-- Input field for updating the activity name -->
            <v-text-field v-model="activity.activityName" label="Activity Name"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- Cancel button to go back to the previous page -->
            <v-btn @click=goBack() class="mr-4">
              Cancel
            </v-btn>
            <!-- Update button to check associated instances and update activity -->
            <div
              v-if="!showUpdateButton"
              v-tooltip.bottom="'Only the owner or eligible roles can update this activity.'"
              style="display: inline-block;"
            >
              <v-btn
                style="text-align:center;"
                @click="checkAssociatedInstances('update')"
                :loading="updateLoading"
                :disabled="true"
              >
                Update
              </v-btn>
            </div>
            <div v-else style="display: inline-block;">
              <v-btn
                style="text-align:center;"
                @click="checkAssociatedInstances('update')"
                :loading="updateLoading"
              >
                Update
              </v-btn>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <!-- Conditional delete button, shown if the activity can be deleted -->
          <v-col cols="auto" v-if="canActivityBeDeleted && canDeleteActivity">
            <v-btn class="justify-end" @click="checkAssociatedInstances('delete')" :loading="deleteLoading">Delete</v-btn>
          </v-col>
        </v-row>
      </v-container>
  </main>

<!-- Delete Dialog -->
<v-dialog v-model="showDeleteDialog" persistent width="auto">
  <v-card>
    <v-card-title>Confirm Delete</v-card-title>
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
<v-dialog v-model="showUpdateDialog" persistent width="auto">
  <v-card>
    <v-card-title>Confirm Update</v-card-title>
    <v-card-text>
      Are you sure you want to update this activity?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red-darken-1" text @click="showUpdateDialog = false">No</v-btn>
      <v-btn color="green-darken-1" text @click="proceedWithUpdate">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Update Dialog w Instances -->
<v-dialog v-model="updateDialogWithInstances" persistent width="auto">
  <v-card>
    <v-card-title>
      <v-icon left>mdi-update</v-icon>
      Confirm Update
    </v-card-title>
    <v-card-text>
      The following Experience Instances will be updated:
      <v-list density="compact">
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
      <v-btn color="red darken-1" text @click="updateDialogWithInstances = false">No</v-btn>
      <v-btn color="green darken-1" text @click="proceedWithUpdate">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Delete Dialog with Instances -->
<v-dialog v-model="deleteDialogWithInstances" persistent width="auto">
  <v-card>
    <v-card-title>
      <v-icon left>mdi-delete-alert</v-icon>
      Confirm Delete
    </v-card-title>
    <v-card-text>
      The following Experience Instances will have this activity removed:
      <v-list density="compact">
          <v-list-item v-for="instance in associatedInstances" :key="instance._id">
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
import { ref, computed } from 'vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  // We continue using setup for computed properties
  setup() {
    // Access the logged-in user store
    const userStore = useLoggedInUserStore();

    // Create a ref to hold the 'createdBy' once activity data is fetched
    const createdBy = ref("");

    // Computed property to check if the current user can delete an activity based on their role
    const canDeleteActivity = computed(() => {
        const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
        return allowedRoles.includes(userStore.role);
    });

    // Computed property to determine if the "Update" button should be visible
    // Note: We now rely on 'createdBy' which will be set after fetchActivityData() is done.
    const showUpdateButton = computed(() => {
        const role = userStore.role;
        const userId = userStore.userId;
        // Use createdBy.value, which will be updated after activity data is fetched
        const cb = createdBy.value;

        if (role === "Org Admin" || role === "Group Admin") {
            return true;
        }

        // If the user is a "Group Instructor", they can only update if they created the activity themselves.
        if (role === "Group Instructor") {
            return cb === userId;
        }

        return false;
    });


    return {
        userStore,
        canDeleteActivity,
        showUpdateButton,
        createdBy // return this so we can update it in fetchActivityData()
    };
},

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
      showUpdateDialog: false,
      showDeleteDialog: false,
      updateLoading: false,
      updateDialogWithInstances: false,
      associatedInstances: [],
      deleteDialogWithInstances: false,
      deleteLoading: false
    };
  },

async mounted() {
  // Fetch the activity data when the component is mounted
  await this.fetchActivityData();

  // Check if the activity can be deleted after fetching the data
  await this.checkIfActivityCanBeDeleted();
},


methods: {
  // Fetches activity data from the server based on the provided route parameter ID. Upon successful retrieval, updates the activity object with the received data including the activity name and status. Also stores the original activity name for reference.
  async fetchActivityData() {
    try {
      const store = useLoggedInUserStore();
      let token = store.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${store.navigationData.activityID}`;
      const response = await axios.get(apiURL, { headers: { token }});
      
      this.activity = {
        ...this.activity,
        activityName: response.data.activityName,
        activityStatus: response.data.activityStatus,
        createdBy: response.data.createdBy
      };
      this.originalActivityName = response.data.activityName;

      // Update createdBy ref with the fetched activity's createdBy
      this.createdBy = response.data.createdBy;

    } catch (error) {
      this.handleError(error);
    }
  },

    // Checks if there are any associated instances with the current activity. If the action is to update, it sets a flag to indicate updating. If the action is to delete, it sets a flag to indicate deletion. Then, it sends a request to the server to check for associated instances using the activity ID. Depending on the action and the response from the server, it displays the appropriate dialog to either proceed with the update, display the update dialog with associated instances, confirm the delete action, or display the delete dialog with associated instances.
    async checkAssociatedInstances(action) {
      if (action === "update") {
        this.updateLoading = true;
      } else if (action === "delete") {
        this.deleteLoading = true;
      }
      
      try {
        const store = useLoggedInUserStore();
        let token = store.token;
        let checkURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/activity/${store.navigationData.activityID}`;
        const checkResponse = await axios.get(checkURL, { headers: { token } });

        if (action === "update") {
          if (checkResponse.data.expInstancesFound === true) {
            this.associatedInstances = checkResponse.data.instancesData;
            this.updateDialogWithInstances = true;
          } else {
            this.showUpdateDialog = true;
          }
        } else if (action === "delete") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instancesData;
            this.deleteDialogWithInstances = true;
          } else {
            this.showDeleteDialog = true;
          }
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.updateLoading = false;
        this.deleteLoading = false;
      }
    },

    // Executes the update process for the activity. It sends requests to update the activity details and associated experience instances. Upon successful updates, it determines the appropriate toast message based on whether any instances were updated and displays it.
    async proceedWithUpdate() {
      const user = useLoggedInUserStore();
      const token = user.token;

      // Object for normal Activity update
      const updatedActivity = {
        activityName: this.activity.activityName,
        activityStatus: this.activity.activityStatus,
      };

      let activityUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${user.navigationData.activityID}`;
      let experienceInstanceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/activity-update/${user.navigationData.activityID}`;

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

    // Checks if the activity can be deleted by sending a request to the backend API. If successful, it updates the `canActivityBeDeleted` variable accordingly.
    async checkIfActivityCanBeDeleted() {
      try {
        const store = useLoggedInUserStore();
        let token = store.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activity/can-be-deleted/${store.navigationData.activityID}`;
        const response = await axios.get(apiURL, { headers: { token }});
        this.canActivityBeDeleted = response.data.canBeDeleted;
      } catch (error) {
        this.handleError(error);
      }
    },

    // Redirects to the instructor data management page with a toast message about the successful update.
    handleUpdateSuccess(toastMessage) {
      useLoggedInUserStore().navigationData = {
          activeTab: 2,
          toastType: 'info',
          toastMessage: toastMessage,
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
      };
      this.$router.push({
        name: 'instructorDataManagement'
      });
    },

    // Redirects to the delete activity function and hides the delete dialog.
    confirmDelete() {
      this.deleteActivity();
      this.showDeleteDialog = false;
    },

    // Deletes the activity from the database and redirects to the instructorDataManagement page with a success message.
    async deleteActivity() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activity/delete/${user.navigationData.activityID}`;

        await axios.delete(deleteURL, { headers: { token } });

        // Navigate to the instructorDataManagement page with success message
        user.navigationData = {
            activeTab: 2,
            toastType: 'success',
            toastMessage: 'Activity Deleted!',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
        };
        this.$router.push({
          name: 'instructorDataManagement'
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    // Redirects to the instructorDataManagement page.
    goBack() {
      useLoggedInUserStore().navigationData = {
        activeTab: 2
      };
      this.$router.push({
        name: "instructorDataManagement"
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