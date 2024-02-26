<!--'/instructorAddExperience' this page will only show experiences-->
<template>
  <main>
    <v-form>
      <v-container>
        <p class="font-weight-black text-h6">Experience: {{ originalExperienceName }}</p>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="experience.experienceCategory" label="Experience Category"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="experience.experienceName" label="Experience Name"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="pt-5">
          <v-col>
            <v-btn @click="goBack()">
              Cancel
            </v-btn>
            <v-btn style="text-align: center; margin-left: 10px;" @click="checkAssociatedInstances('update')" :loading="updateLoading">Update</v-btn>
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
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
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
    const experienceID = this.$route.params.id;
    if (experienceID) {
      await this.fetchExperienceData(experienceID);
      await this.checkIfExperienceCanBeDeleted(experienceID);
    }
  },

  methods: {

    async fetchExperienceData(experienceID) {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experienceID}`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const experienceData = resp.data;
          this.originalExperienceName = experienceData.experienceName;
          this.experience = {
            experienceCategory: experienceData.experienceCategory,
            experienceName: experienceData.experienceName,
          };
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

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

    confirmDelete() {
      // Call the delete method here
      this.deleteExperience();
      this.showDeleteDialog = false;
    },


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
