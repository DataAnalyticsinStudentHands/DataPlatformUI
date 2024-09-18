<!--'/instructorSpecificExperience' - this view presents a single Experience's data -->
<template>
  <main>
    <v-form>
      <v-container>
        <p class="font-weight-black text-h6">Experience: {{ originalExperienceName }}</p>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="experience.experienceCategory" 
              label="Experience Category" 
              :readonly="isReadOnly">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="experience.experienceName" 
              label="Experience Name" 
              :readonly="isReadOnly">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="pt-5">
          <v-col>
            <v-btn @click="goBack()">
              Cancel
            </v-btn>
            <v-btn v-if="canUpdateExperience" style="text-align: center; margin-left: 10px;" @click="checkAssociatedInstances('update')" :loading="updateLoading">Update</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" v-if="canExperienceBeDeleted">
            <v-btn @click="checkAssociatedInstances('delete')" :loading="deleteLoading">Delete</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </main>
<!-- Delete Dialog -->
<v-dialog v-model="showDeleteDialog" persistent width="auto">
  <v-card>
    <v-card-title class="headline">Confirm Delete</v-card-title>
    <v-card-text>Are you sure you want to delete this experience?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red-darken-1" text @click="showDeleteDialog = false">No</v-btn>
      <v-btn color="green-darken-1" text @click="confirmDelete">Yes</v-btn>
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
      The following Experience Instances will be deleted:
      <v-list density="compact">
        <v-list-item v-for="instance in associatedInstances" :key="instance._id">
          <v-list-item-title class="font-weight-bold">{{ instance.sessionName }} - {{ instance.experienceName }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <div class="mt-3">
        Are you sure you want to delete this Experience?
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red-darken-1" text @click="deleteDialogWithInstances = false">No</v-btn>
      <v-btn color="green-darken-1" text @click="deleteExperience">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Update Dialog -->
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
              <v-list-item-title class="font-weight-bold">{{ instance.sessionName }} - {{ instance.experienceName }}</v-list-item-title>
          </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <div class="mt-3">
        Are you sure you want to update this Experience?
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="updateDialog = false">No</v-btn>
      <v-btn color="green darken-1" text @click="proceedWithUpdate">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script>
import { ref, computed } from 'vue';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  setup() {
    const userStore = useLoggedInUserStore();

    const canUpdateExperience = ref(false);

    const isReadOnly = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return !allowedRoles.includes(userStore.role);
    });

    return {
      userStore,
      canUpdateExperience,
      isReadOnly
    };
  },
  data() {
    return {
      experience: {
        experienceCategory: '',
        experienceName: '',
      },
      originalExperienceName: "",
      hoveredItem: null,
      canExperienceBeDeleted: false,
      showDeleteDialog: false,
      updateDialog: false,
      updateLoading: false,
      deleteLoading: false,
      associatedInstances: [],
      deleteDialogWithInstances: false,
    };
  },
  async mounted() {
    const experienceID = this.userStore.navigationID;
    if (experienceID) {
      await this.fetchExperienceData(experienceID);
      await this.checkIfExperienceCanBeDeleted(experienceID);

      this.userStore.navigationID = null;
    }
  },

  methods: {

    // Fetches experience data from the backend server using an API call based on the provided experience ID. Upon successful retrieval, updates the local state with the fetched experience details, including the experience category and name.
    async fetchExperienceData(experienceID) {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experienceID}`;
      try {
        const resp = await axios.get(apiURL, { headers: { token } });
        const experienceData = resp.data;
        this.experience = {
          experienceCategory: experienceData.experienceCategory,
          experienceName: experienceData.experienceName,
        };

        // Update canUpdateExperience based on the user's role and experienceCategory
        const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
        if (allowedRoles.includes(user.role)) {
          if (user.role === 'Group Admin') {
            this.canUpdateExperience = this.experience.experienceCategory === user.group;
          } else {
            this.canUpdateExperience = true;
          }
        } else {
          this.canUpdateExperience = false;
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    // Fetches data to check if the specified experience can be deleted by sending a request to the backend server. If successful, updates the local state with the boolean value indicating whether the experience can be deleted or not.
    async checkIfExperienceCanBeDeleted(experienceID) {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience/can-be-deleted/${experienceID}`;
        const response = await axios.get(apiURL, { headers: { token }});
        this.canExperienceBeDeleted = response.data.canBeDeleted;
      } catch (error) {
        this.handleError(error);
      }
    },

    // Checks for associated instances based on the provided action ('update' or 'delete'). If 'update', sets the update loading state to true; if 'delete', sets the delete loading state to true. Then, sends a request to the backend server to check for associated instances related to the experience. If instances are found, updates the associatedInstances array accordingly and sets the update or delete dialog to true. Otherwise, proceeds with the update or confirms the delete action.
    async checkAssociatedInstances(action) {
      if (action === "update") {
        this.updateLoading = true;
      } else if (action === "delete") {
        this.deleteLoading = true;
      }

      try {
        const store = useLoggedInUserStore();
        const token = store.token;
        const checkURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/experience/${this.$route.params.id}`;
        const checkResponse = await axios.get(checkURL, { headers: { token } });

        if (action === "update") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instanceData;
            this.updateDialog = true;
          } else {
            this.proceedWithUpdate();
          }
        } else if (action === "delete") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instanceData;
            this.deleteDialogWithInstances = true;
          } else {
            this.confirmDelete();
          }
        }

      } catch (error) {
        this.handleError(error);
      } finally {
        this.updateLoading = false;
        this.deleteLoading = false;
      }
    },

    // Confirms the delete action by calling the deleteExperience method and then hides the delete dialog.
    confirmDelete() {
      // Call the delete method here
      this.deleteExperience();
      this.showDeleteDialog = false;
    },

    // Deletes the experience by sending a DELETE request to the server and then navigates to the instructorDataManagement page with a success message upon successful deletion.
    async deleteExperience() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience/delete/${this.$route.params.id}`;

        await axios.delete(deleteURL, { headers: { token } });

        // Navigate to the instructorDataManagement page with success message
        this.$router.push({
          name: 'instructorDataManagement',
          params: {
            activeTab: 1,
            toastType: 'success',
            toastMessage: 'Experience Deleted!',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
          }
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    // Updates the experience details and its related instances by sending PUT requests to the server. Upon successful update, it redirects to the instructorDataManagement page with a success message.
    proceedWithUpdate() {
      const user = useLoggedInUserStore();
      let token = user.token;

      // Get the experience ID
      const experienceID = this.$route.params.id;
      let experienceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experienceID}`;
      let experienceInstanceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/experience-update/${experienceID}`;

      axios
        .put(experienceUpdateURL, {
          experienceCategory: this.experience.experienceCategory,
          experienceName: this.experience.experienceName,
        }, { headers: { token } })
        .then(() => {
          // Prepare data for updating Experience Instances
          const updateData = {
            experience: {
              category: this.experience.experienceCategory,
              name: this.experience.experienceName,
            },
          };

          // Update Experience Instances
          return axios.put(experienceInstanceUpdateURL, updateData, { headers: { token } });
        })
        .then((response) => {
          // Determine the toast message based on the response
          let toastMessage = 'Experience updated!';
          if (response.data && response.data.updatedInstances && response.data.updatedInstances.length > 0) {
            toastMessage = 'Experience and related instances updated!';
          }

          // Redirect after successful update
          this.$router.push({ 
            name: 'instructorDataManagement',
            params: {
              activeTab: 1,
              toastType: 'info',
              toastMessage: toastMessage,
              toastPosition: 'top-right',
              toastCSS: 'Toastify__toast--update'
            }
          });
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    // Navigates back to the previous page. If there's an activity ID specified in the route parameters, it redirects to the instructorSpecificActivity page for that activity. Otherwise, it simply goes back to the previous page in the browser history.
    goBack() {
      if (this.$route.params.activityID) {
        this.$router.push({
          name: "instructorSpecificActivity",
          params: {
            id: this.$route.params.activityID
          }
        });
      } else {
        this.$router.back();
      }
    }
  },
};
</script>

<style scoped>
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

.pointer-cursor {
    cursor: pointer;
}
.mdi-close {
  cursor: pointer;
}

.scrollable-table {
    height: 300px; /* Adjust the height as needed */
    overflow-y: auto;
  }

  /* Optional: Style to improve the appearance when scrolling */
  .scrollable-table::-webkit-scrollbar {
    width: 10px;
  }

  .scrollable-table::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .scrollable-table::-webkit-scrollbar-thumb {
    background: #888;
  }

  .scrollable-table::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .scrollable-list {
    height: 370px; /* Adjust the height as needed */
    overflow-y: auto;
  }

  /* Optional: Style to improve the appearance when scrolling */
  .scrollable-list::-webkit-scrollbar {
    width: 10px;
  }

  .scrollable-list::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .scrollable-list::-webkit-scrollbar-thumb {
    background: #888;
  }

  .scrollable-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }


</style>
