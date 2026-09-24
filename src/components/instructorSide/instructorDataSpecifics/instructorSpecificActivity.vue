<!--
  instructorSpecificActivity.vue
  
  View and edit a single Activity's data. Provides functionality to update activity name,
  delete activity (if eligible), with confirmation dialogs showing affected experience instances.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="edit-activity-page">
    <v-container class="py-8">
      <!-- Page Header -->
      <div class="page-header mb-6">
        <div class="d-flex align-center mb-2">
          <v-btn 
            icon 
            variant="text" 
            size="small" 
            @click="goBack"
            class="mr-2"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-icon color="brand-fg" size="32" class="mr-3">mdi-clipboard-edit-outline</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('Edit Activity') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ originalActivityName }}</p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="8">
          <v-card class="form-card" elevation="2">
            <v-form ref="form" @submit.prevent="checkAssociatedInstances('update')">
              <!-- Section 1: Activity Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Activity Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Update the activity details') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="activity.activityName"
                    :label="$t('Activity Name')"
                    :placeholder="$t('Enter a descriptive name for your activity')"
                    :rules="nameRules"
                    variant="outlined"
                    required
                    counter="100"
                  ></v-text-field>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <v-btn 
                  variant="outlined"
                  size="large"
                  @click="goBack"
                  class="action-btn"
                >
                  {{ $t('Cancel') }}
                </v-btn>

                <!-- Delete Button -->
                <v-btn
                  v-if="canActivityBeDeleted && canDeleteActivity"
                  variant="outlined"
                  size="large"
                  color="error-fg"
                  @click="checkAssociatedInstances('delete')"
                  :loading="deleteLoading"
                  class="action-btn ml-3"
                >
                  <v-icon start size="18">mdi-delete-outline</v-icon>
                  {{ $t('Delete') }}
                </v-btn>

                <v-spacer></v-spacer>

                <!-- Update Button -->
                <div
                  v-if="!showUpdateButton"
                  v-tooltip.bottom="$t('Only the owner or eligible roles can update this activity.')"
                  style="display: inline-block;"
                >
                  <v-btn 
                    type="submit"
                    size="large"
                    color="primary"
                    class="action-btn submit-btn"
                    :loading="updateLoading"
                    :disabled="true"
                  >
                    <v-icon start size="18">mdi-content-save</v-icon>
                    {{ $t('Update Activity') }}
                  </v-btn>
                </div>
                <v-btn
                  v-else
                  type="submit"
                  size="large"
                  color="primary"
                  class="action-btn submit-btn"
                  :loading="updateLoading"
                  :disabled="!activity.activityName"
                >
                  <v-icon start size="18">mdi-content-save</v-icon>
                  {{ $t('Update Activity') }}
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Simple Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" persistent max-width="450px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 error-dialog-header">
          <v-icon color="error" size="28" class="mr-3">mdi-delete-alert-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Delete') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to delete this activity?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDeleteDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="error-fill" variant="flat" @click="confirmDelete">
            <v-icon start size="18">mdi-delete</v-icon>
            {{ $t('Delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Simple Update Confirmation Dialog -->
    <v-dialog v-model="showUpdateDialog" persistent max-width="450px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 info-dialog-header">
          <v-icon color="brand-fg" size="28" class="mr-3">mdi-content-save-check-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Update') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to update this activity?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showUpdateDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" @click="proceedWithUpdate" class="confirm-btn">
            <v-icon start size="18">mdi-check</v-icon>
            {{ $t('Update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Dialog with Instances -->
    <v-dialog v-model="updateDialogWithInstances" persistent max-width="550px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 warning-dialog-header">
          <v-icon color="warning" size="28" class="mr-3">mdi-alert-circle-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Update') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <v-alert type="info" color="info-fg" variant="tonal" class="mb-4">
            {{ $t('The following Experience Instances will be updated:') }}
          </v-alert>
          <div class="instances-list">
            <div
              v-for="instance in associatedInstances"
              :key="instance._id"
              class="instance-item"
            >
              <v-icon color="brand-fg" size="18" class="mr-2">mdi-school-outline</v-icon>
              <span class="font-weight-medium">{{ instance.sessionName }}</span>
              <span class="text-medium-emphasis mx-1">-</span>
              <span>{{ instance.experienceName }}</span>
            </div>
          </div>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to update this Activity?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="updateDialogWithInstances = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" @click="proceedWithUpdate" class="confirm-btn">
            <v-icon start size="18">mdi-check</v-icon>
            {{ $t('Update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog with Instances -->
    <v-dialog v-model="deleteDialogWithInstances" persistent max-width="550px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 error-dialog-header">
          <v-icon color="error" size="28" class="mr-3">mdi-delete-alert-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Delete') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <v-alert type="warning" variant="tonal" class="mb-4">
            {{ $t('The following Experience Instances will have this activity removed:') }}
          </v-alert>
          <div class="instances-list">
            <div
              v-for="instance in associatedInstances"
              :key="instance._id"
              class="instance-item"
            >
              <v-icon color="brand-fg" size="18" class="mr-2">mdi-school-outline</v-icon>
              <span class="font-weight-medium">{{ instance.sessionName }}</span>
              <span class="text-medium-emphasis mx-1">-</span>
              <span>{{ instance.experienceName }}</span>
            </div>
          </div>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to delete this Activity?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialogWithInstances = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="error-fill" variant="flat" @click="deleteActivity">
            <v-icon start size="18">mdi-delete</v-icon>
            {{ $t('Delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>
import { ref, computed } from 'vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  name: "InstructorSpecificActivity",
  setup() {
    const userStore = useLoggedInUserStore();
    const createdBy = ref("");

    const canDeleteActivity = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    const showUpdateButton = computed(() => {
      const role = userStore.role;
      const userId = userStore.userId;
      const cb = createdBy.value;

      if (role === "Org Admin" || role === "Group Admin") {
        return true;
      }

      if (role === "Group Instructor") {
        return cb === userId;
      }

      return false;
    });

    return {
      userStore,
      canDeleteActivity,
      showUpdateButton,
      createdBy
    };
  },

  props: ["id"],
  
  data() {
    return {
      activity: {
        activityName: "",
        activityStatus: false
      },
      originalActivityName: "",
      experiences: [],
      canActivityBeDeleted: false,
      showUpdateDialog: false,
      showDeleteDialog: false,
      updateLoading: false,
      updateDialogWithInstances: false,
      associatedInstances: [],
      deleteDialogWithInstances: false,
      deleteLoading: false,
      nameRules: [
        v => !!v || this.$t('Activity name is required'),
        v => (v && v.length >= 2) || this.$t('Activity name must be at least 2 characters'),
        v => (v && v.length <= 100) || this.$t('Activity name cannot exceed 100 characters')
      ]
    };
  },

  async mounted() {
    await this.fetchActivityData();
    await this.checkIfActivityCanBeDeleted();
  },

  methods: {
    async fetchActivityData() {
      try {
        const store = useLoggedInUserStore();
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${store.navigationData.activityID}`;
        const response = await axios.get(apiURL);
        
        this.activity = {
          ...this.activity,
          activityName: response.data.activityName,
          activityStatus: response.data.activityStatus,
          createdBy: response.data.createdBy
        };
        this.originalActivityName = response.data.activityName;
        this.createdBy = response.data.createdBy;
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
        let checkURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/activity/${store.navigationData.activityID}`;
        const checkResponse = await axios.get(checkURL);

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

    async proceedWithUpdate() {
      const user = useLoggedInUserStore();

      const updatedActivity = {
        activityName: this.activity.activityName,
        activityStatus: this.activity.activityStatus,
      };

      let activityUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${user.navigationData.activityID}`;
      let experienceInstanceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/activity-update/${user.navigationData.activityID}`;

      try {
        await axios.put(activityUpdateURL, updatedActivity);
        const instanceUpdateResponse = await axios.put(experienceInstanceUpdateURL, { activityName: this.activity.activityName });

        let toastMessage = 'Activity updated!';
        if (instanceUpdateResponse.data && instanceUpdateResponse.data.updatedInstances && instanceUpdateResponse.data.updatedInstances.length > 0) {
          toastMessage = 'Activity and related instances updated!';
        }

        this.handleUpdateSuccess(toastMessage);
      } catch (error) {
        this.handleError(error);
      }
    },

    async checkIfActivityCanBeDeleted() {
      try {
        const store = useLoggedInUserStore();
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activity/can-be-deleted/${store.navigationData.activityID}`;
        const response = await axios.get(apiURL);
        this.canActivityBeDeleted = response.data.canBeDeleted;
      } catch (error) {
        this.handleError(error);
      }
    },

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

    confirmDelete() {
      this.deleteActivity();
      this.showDeleteDialog = false;
    },

    async deleteActivity() {
      try {
        const user = useLoggedInUserStore();
        let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activity/delete/${user.navigationData.activityID}`;

        await axios.delete(deleteURL);

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

    goBack() {
      useLoggedInUserStore().navigationData = {
        activeTab: 2
      };
      this.$router.push({
        name: "instructorDataManagement"
      });
    }
  }
};
</script>

<!-- Shared add/edit form layout (.page-header, .form-card, .form-section, .section-*, .form-actions,
     .action-btn, .submit-btn and their 960px overrides); keep this block before the local one -->
<style scoped src="@/styles/instructor-add-edit-form.css"></style>

<style scoped>
/* Page Background */
.edit-activity-page {
  background-color: rgb(var(--v-theme-page-bg));
  min-height: 100vh;
}

/* Dialog confirm button (white label on the primary fill) */
.confirm-btn {
  color: rgb(var(--v-theme-on-primary)) !important;
}

/* Dialogs */
.confirm-dialog {
  border-radius: 12px;
}

.error-dialog-header {
  background-color: rgb(var(--v-theme-tint-error));
}

.warning-dialog-header {
  background-color: rgb(var(--v-theme-tint-warning));
}

.info-dialog-header {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

/* Instances List in Dialogs */
.instances-list {
  max-height: 200px;
  overflow-y: auto;
  background-color: rgb(var(--v-theme-panel));
  border-radius: 8px;
  padding: 8px 0;
}

.instance-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.instance-item:last-child {
  border-bottom: none;
}
</style>