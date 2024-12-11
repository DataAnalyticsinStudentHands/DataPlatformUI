<template>
  <main>
    <v-form>
      <v-container>
        <!-- Display the original session name as the title -->
        <p class="font-weight-black text-h6">Session: {{ session.originalSessionName }}</p><br>
        
        <!-- Session name input field -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="session.sessionName" label="Session Name" :readonly="!isAllowedToUpdate"></v-text-field>
          </v-col>
        </v-row>
  
        <!-- Session start and end date input fields -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="session.sessionPeriod.startDate" label="Session Start Date" :readonly="!isAllowedToUpdate"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="session.sessionPeriod.endDate" label="Session End Date" :readonly="!isAllowedToUpdate"></v-text-field>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col class="d-flex align-center justify-start">
            <!-- Error message display -->
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
            <!-- Cancel button to navigate back -->
            <v-btn @click="$router.back()">Cancel</v-btn>

            <!-- Update button -->
            <div v-if="!isAllowedToUpdate" 
                v-tooltip.bottom="'You do not have the necessary privileges to update this Session.'" 
                style="display: inline-block;"
                class="ml-2">
              <v-btn
                style="text-align:center; margin-left: 10px;"
                :loading="updateLoading"
                :disabled="true"
              >
                Update
              </v-btn>
            </div>

            <div v-else class="ml-2">
              <v-btn
                style="text-align:center; margin-left: 10px;"
                @click="checkAssociatedInstances('update')"
                :loading="updateLoading"
              >
                Update
              </v-btn>
            </div>

          </v-col>
  
          <v-spacer></v-spacer>
  
          <!-- Delete button with loading state, shown if the session can be deleted -->
          <v-col cols="auto" v-if="canSessionBeDeleted">
            <v-btn @click="checkAssociatedInstances('delete')" :loading="deleteLoading">Delete</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </main>
  
  <!-- Confirmation Dialog for Delete (No Instances) - This shows only if no instances are found for deletion -->
  <v-dialog v-model="showDeleteDialog" persistent width="auto">
    <v-card>
      <v-card-title class="headline">Confirm Delete</v-card-title>
      <v-card-text>Are you sure you want to delete this session?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" text @click="showDeleteDialog = false">No</v-btn>
        <v-btn color="green-darken-1" text @click="confirmDelete">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
  <!-- Delete Dialog with Instances (Displayed if there are experience instances) -->
  <v-dialog v-model="deleteDialogWithInstances" persistent width="auto">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-delete-alert</v-icon>
        Confirm Delete
      </v-card-title>
      <v-card-text>
        The following Experience Instances will be deleted:
        <v-list density="compact">
          <v-list-item v-for="instance in associatedInstances" :key="instance._id">
            <v-list-item-title class="font-weight-bold">{{ session.originalSessionName }} - {{ instance.experience.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <div class="mt-3">
          Are you sure you want to delete this Session?
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" text @click="deleteDialogWithInstances = false">No</v-btn>
        <v-btn color="green-darken-1" text @click="deleteSession">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
  <!-- Update Dialog (Displayed if there are experience instances and user tries to update) -->
  <v-dialog v-model="updateDialog" persistent width="auto">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-update</v-icon>
        Confirm Update
      </v-card-title>
      <v-card-text>
        The following Experience Instances will be updated:
        <v-list density="compact">
            <v-list-item v-for="instance in associatedInstances" :key="instance._id">
                <v-list-item-title class="font-weight-bold">{{ session.originalSessionName }} - {{ instance.experience.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <div class="mt-3">
          Are you sure you want to update this Session?
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="updateDialog = false">No</v-btn>
        <v-btn color="green darken-1" text @click="proceedWithUpdate">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Update Dialog with No Instances (Displayed if no instances are found and user tries to update) -->
  <v-dialog v-model="showUpdateDialogNoInstances" persistent width="auto">
    <v-card>
      <v-card-title class="headline">Confirm Update</v-card-title>
      <v-card-text>Are you sure you want to update this session?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" text @click="showUpdateDialogNoInstances = false">No</v-btn>
        <v-btn color="green-darken-1" text @click="confirmUpdateNoInstances">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
import axios from "axios";
import { DateTime } from "luxon";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: 'instructorSpecificSession',
  data() {
    return {
      session: {
        originalSessionName: "",
        sessionName: "",
        sessionPeriod: {
          startDate: "",
          endDate: ""
        }
      },
      errorMessage: "",
      canSessionBeDeleted: false, // Tracks if the session can be deleted
      showDeleteDialog: false, // Controls the display of the simple confirmation dialog when no instances are found for delete
      updateDialog: false, // Controls display of the update confirmation dialog if instances exist
      updateLoading: false, // Tracks loading state for update action
      deleteLoading: false, // Tracks loading state for delete action
      associatedInstances: [], // Holds instances related to the session
      deleteDialogWithInstances: false, // Controls display of the delete confirmation dialog when instances are present
      showUpdateDialogNoInstances: false, // Controls display of the simple confirmation dialog when no instances for update
    };
  },

  created() {
    // Fetch the session data when the component is created
    this.fetchSessionData();

    // Check if the session can be deleted
    this.checkIfSessionCanBeDeleted();
  },

  computed: {
    isAllowedToUpdate() {
      const allowedRoles = ['Org Admin', 'Group Admin'];
      const user = useLoggedInUserStore();
      return allowedRoles.includes(user.role);
    }
  },

  methods: {
    // Fetches session data from the backend API using the session ID provided in the route parameters.
    // Updates the session properties accordingly.
    fetchSessionData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions`;
      axios
        .get(`${url}/${user.navigationData.id}`, {
          headers: { token },
        })
        .then((resp) => {
          let data = resp.data;
          this.session.originalSessionName = data.sessionName;
          this.session.sessionName = data.sessionName;
          // Format the dates to 'yyyy-MM-dd'
          this.session.sessionPeriod.startDate = DateTime.fromISO(data.sessionPeriod.startDate).toFormat('yyyy-MM-dd');
          this.session.sessionPeriod.endDate = DateTime.fromISO(data.sessionPeriod.endDate).toFormat('yyyy-MM-dd');
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    // Checks whether the session can be deleted by making a request to the backend API.
    // Sets the `canSessionBeDeleted` flag based on the response data.
    async checkIfSessionCanBeDeleted() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/session/can-be-deleted/${user.navigationData.id}`;

        const response = await axios.get(url, { headers: { token } });
        this.canSessionBeDeleted = response.data.canBeDeleted;
      } catch (error) {
        this.handleError(error);
      }
    },

    // Checks for associated instances related to the session based on the provided action.
    // If updating and instances are found, show update dialog; if none, show a simple confirmation dialog.
    // If deleting and instances are found, show delete dialog with instances; if none, show a simple confirmation dialog.
    async checkAssociatedInstances(action) {
      if (action === "update") {
        this.updateLoading = true;
      } else if (action === "delete") {
        this.deleteLoading = true;
      }

      try {
        const store = useLoggedInUserStore();
        const token = store.token;
        const checkURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/session/${store.navigationData.id}`;
        const checkResponse = await axios.get(checkURL, { headers: { token } });

        if (action === "update") {
          if (checkResponse.data.expInstancesFound) {
            // If instances are found, show update dialog
            this.associatedInstances = checkResponse.data.instancesForSession;
            this.updateDialog = true;
          } else {
            // If no instances found, now show a simple confirmation dialog before updating
            this.showUpdateDialogNoInstances = true;
          }
        } else if (action === "delete") {
          if (checkResponse.data.expInstancesFound) {
            // If instances are found, show delete dialog with instances
            this.associatedInstances = checkResponse.data.instancesForSession;
            this.deleteDialogWithInstances = true;
          } else {
            // If no instances found, show a simple confirmation dialog before deleting
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

    // Executes the deletion process for the session after confirmation.
    confirmDelete() {
      this.deleteSession();
      this.showDeleteDialog = false;
    },

    // Confirms the update when no instances are found.
    confirmUpdateNoInstances() {
      this.showUpdateDialogNoInstances = false;
      this.proceedWithUpdate();
    },

    // Deletes the session from the backend. Upon successful deletion, redirects to the data management page with a success message displayed as a toast notification.
    async deleteSession() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/session/delete/${user.navigationData.id}`;

        await axios.delete(deleteURL, { headers: { token } });

        user.navigationData = {
          activeTab: 0,
          toastType: 'success',
          toastMessage: 'Session Deleted!',
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

    // Updates the session details with the provided information.
    // After successfully updating the session, redirects to the data management page
    // while displaying a toast notification confirming the update.
    proceedWithUpdate() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updatedSession = {
        sessionName: this.session.sessionName,
        sessionPeriod: {
          startDate: DateTime.fromFormat(this.session.sessionPeriod.startDate, 'yyyy-MM-dd').toISO(),
          endDate: DateTime.fromFormat(this.session.sessionPeriod.endDate, 'yyyy-MM-dd').toISO()
        },
      };
      let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions`;
      axios.put(`${url}/${user.navigationData.id}`, updatedSession, {
        headers: { token },
      }).then(() => {
        user.navigationData = {
          activeTab: 0,
          toastType: 'info',
          toastMessage: 'Session updated!',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ 
          name: 'instructorDataManagement'
        });
      }).catch((error) => {
        this.errorMessage = "Error updating session: " + error.message;
      });
    },

    // Handles and displays error messages returned by API calls.
    handleError(error) {
      this.errorMessage = (error.response && error.response.data && error.response.data.error) ? error.response.data.error : error.message;
    }
  }
};
</script>
  
<style>
#contentNavbar .nav-link.router-link-exact-active {
  background-color: #eee;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
