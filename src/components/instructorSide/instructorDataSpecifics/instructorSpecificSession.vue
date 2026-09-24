<!--
  instructorSpecificSession.vue
  
  View and edit a single Session's data. Provides functionality to update session details,
  delete session (if eligible), with confirmation dialogs showing affected experience instances.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="edit-session-page">
    <v-container class="py-8">
      <!-- Page Header -->
      <div class="page-header mb-6">
        <div class="d-flex align-center mb-2">
          <v-btn 
            icon 
            variant="text" 
            size="small" 
            @click="$router.back()"
            class="mr-2"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-icon color="brand-fg" size="32" class="mr-3">mdi-calendar-edit</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('Edit Session') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ session.originalSessionName }}</p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="8">
          <v-card class="form-card" elevation="2">
            <v-form ref="form">
              <!-- Section 1: Session Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Session Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Update the session details') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="session.sessionName"
                    :label="$t('Session Name')"
                    :placeholder="$t('Enter a descriptive name for your session')"
                    :readonly="!isAllowedToUpdate"
                    variant="outlined"
                    counter="100"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" class="text-medium-emphasis">mdi-calendar-text</v-icon>
                    </template>
                  </v-text-field>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 2: Session Period -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div>
                    <h2 class="section-title">{{ $t('Session Period') }}</h2>
                    <p class="section-subtitle">{{ $t('Define the start and end dates for this session') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        type="date"
                        v-model="session.sessionPeriod.startDate"
                        :label="$t('Start Date')"
                        :readonly="!isAllowedToUpdate"
                        variant="outlined"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon size="20" class="text-medium-emphasis">mdi-calendar-start</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        type="date"
                        v-model="session.sessionPeriod.endDate"
                        :label="$t('End Date')"
                        :readonly="!isAllowedToUpdate"
                        variant="outlined"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon size="20" class="text-medium-emphasis">mdi-calendar-end</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <!-- Error Message Alert -->
                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    class="mt-2"
                    closable
                    @click:close="errorMessage = ''"
                  >
                    {{ errorMessage }}
                  </v-alert>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <v-btn 
                  variant="outlined"
                  size="large"
                  @click="$router.back()"
                  class="action-btn"
                >
                  {{ $t('Cancel') }}
                </v-btn>

                <!-- Delete Button -->
                <v-btn
                  v-if="canSessionBeDeleted"
                  variant="outlined"
                  size="large"
                  color="error"
                  @click="checkAssociatedInstances('delete')"
                  :loading="deleteLoading"
                  class="action-btn ml-3"
                >
                  <v-icon start size="18">mdi-delete-outline</v-icon>
                  {{ $t('Delete') }}
                </v-btn>

                <v-spacer></v-spacer>

                <!-- Update Button (disabled state with tooltip) -->
                <div
                  v-if="!isAllowedToUpdate"
                  v-tooltip.bottom="$t('You do not have the necessary privileges to update this Session.')"
                  style="display: inline-block;"
                >
                  <v-btn 
                    size="large"
                    color="primary"
                    class="action-btn submit-btn"
                    :disabled="true"
                  >
                    <v-icon start size="18">mdi-content-save</v-icon>
                    {{ $t('Update Session') }}
                  </v-btn>
                </div>

                <!-- Update Button (enabled state) -->
                <v-btn
                  v-else
                  size="large"
                  color="primary"
                  class="action-btn submit-btn"
                  :loading="updateLoading"
                  :disabled="!session.sessionName"
                  @click="checkAssociatedInstances('update')"
                >
                  <v-icon start size="18">mdi-content-save</v-icon>
                  {{ $t('Update Session') }}
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
            {{ $t('Are you sure you want to delete this session?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDeleteDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">
            <v-icon start size="18">mdi-delete</v-icon>
            {{ $t('Delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Simple Update Confirmation Dialog -->
    <v-dialog v-model="showUpdateDialogNoInstances" persistent max-width="450px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 info-dialog-header">
          <v-icon color="brand-fg" size="28" class="mr-3">mdi-content-save-check-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Update') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to update this session?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showUpdateDialogNoInstances = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmUpdateNoInstances" class="confirm-btn">
            <v-icon start size="18">mdi-check</v-icon>
            {{ $t('Update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Dialog with Instances -->
    <v-dialog v-model="updateDialog" persistent max-width="550px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 warning-dialog-header">
          <v-icon color="warning" size="28" class="mr-3">mdi-alert-circle-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Update') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <v-alert type="info" variant="tonal" class="mb-4">
            {{ $t('The following Experience Instances will be updated:') }}
          </v-alert>
          <div class="instances-list">
            <div
              v-for="instance in associatedInstances"
              :key="instance._id"
              class="instance-item"
            >
              <v-icon color="brand-fg" size="18" class="mr-2">mdi-school-outline</v-icon>
              <span class="font-weight-medium">{{ session.originalSessionName }}</span>
              <span class="text-medium-emphasis mx-1">-</span>
              <span>{{ instance.experience.name }}</span>
            </div>
          </div>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to update this Session?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="updateDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
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
            {{ $t('The following Experience Instances will be deleted:') }}
          </v-alert>
          <div class="instances-list">
            <div
              v-for="instance in associatedInstances"
              :key="instance._id"
              class="instance-item"
            >
              <v-icon color="brand-fg" size="18" class="mr-2">mdi-school-outline</v-icon>
              <span class="font-weight-medium">{{ session.originalSessionName }}</span>
              <span class="text-medium-emphasis mx-1">-</span>
              <span>{{ instance.experience.name }}</span>
            </div>
          </div>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to delete this Session?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialogWithInstances = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="error" variant="flat" @click="deleteSession">
            <v-icon start size="18">mdi-delete</v-icon>
            {{ $t('Delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
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
      canSessionBeDeleted: false,
      showDeleteDialog: false,
      updateDialog: false,
      updateLoading: false,
      deleteLoading: false,
      associatedInstances: [],
      deleteDialogWithInstances: false,
      showUpdateDialogNoInstances: false,
    };
  },

  created() {
    this.fetchSessionData();
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
    fetchSessionData() {
      const user = useLoggedInUserStore();
      let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions`;
      axios
        .get(`${url}/${user.navigationData.id}`)
        .then((resp) => {
          let data = resp.data;
          this.session.originalSessionName = data.sessionName;
          this.session.sessionName = data.sessionName;
          this.session.sessionPeriod.startDate = DateTime.fromISO(data.sessionPeriod.startDate).toFormat('yyyy-MM-dd');
          this.session.sessionPeriod.endDate = DateTime.fromISO(data.sessionPeriod.endDate).toFormat('yyyy-MM-dd');
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    async checkIfSessionCanBeDeleted() {
      try {
        const user = useLoggedInUserStore();
        const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/session/can-be-deleted/${user.navigationData.id}`;

        const response = await axios.get(url);
        this.canSessionBeDeleted = response.data.canBeDeleted;
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
        const checkURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/session/${store.navigationData.id}`;
        const checkResponse = await axios.get(checkURL);

        if (action === "update") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instancesForSession;
            this.updateDialog = true;
          } else {
            this.showUpdateDialogNoInstances = true;
          }
        } else if (action === "delete") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instancesForSession;
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

    confirmDelete() {
      this.deleteSession();
      this.showDeleteDialog = false;
    },

    confirmUpdateNoInstances() {
      this.showUpdateDialogNoInstances = false;
      this.proceedWithUpdate();
    },

    async deleteSession() {
      try {
        const user = useLoggedInUserStore();
        let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/session/delete/${user.navigationData.id}`;

        await axios.delete(deleteURL);

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

    proceedWithUpdate() {
      const user = useLoggedInUserStore();
      const updatedSession = {
        sessionName: this.session.sessionName,
        sessionPeriod: {
          startDate: DateTime.fromFormat(this.session.sessionPeriod.startDate, 'yyyy-MM-dd').toISO(),
          endDate: DateTime.fromFormat(this.session.sessionPeriod.endDate, 'yyyy-MM-dd').toISO()
        },
      };
      let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions`;
      axios.put(`${url}/${user.navigationData.id}`, updatedSession).then(() => {
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

    handleError(error) {
      this.errorMessage = (error.response && error.response.data && error.response.data.error) ? error.response.data.error : error.message;
    }
  }
};
</script>

<!-- Shared add/edit form layout (.page-header, .form-card, .form-section, .section-*, .form-actions,
     .action-btn, .submit-btn and their 960px overrides); keep this block before the local one -->
<style scoped src="@/styles/instructor-add-edit-form.css"></style>

<style scoped>
/* Page Background */
.edit-session-page {
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