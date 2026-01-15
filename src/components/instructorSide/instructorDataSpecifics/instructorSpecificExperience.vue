<!--
  instructorSpecificExperience.vue
  
  View and edit a single Experience's data. Provides functionality to update experience details,
  delete experience (if eligible), with confirmation dialogs showing affected experience instances.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="edit-experience-page">
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-school-outline</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('Edit Experience') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ originalExperienceName }}</p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="8">
          <v-card class="form-card" elevation="2">
            <v-form ref="form" @submit.prevent="checkAssociatedInstances('update')">
              <!-- Section 1: Experience Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Experience Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Update the experience details') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="experience.experienceCategory"
                    :label="$t('Experience Category')"
                    :placeholder="$t('Enter the category for this experience')"
                    :rules="categoryRules"
                    :readonly="isReadOnly"
                    variant="outlined"
                    required
                    counter="100"
                    class="mb-4"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-shape-outline</v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="experience.experienceName"
                    :label="$t('Experience Name')"
                    :placeholder="$t('Enter a descriptive name for your experience')"
                    :rules="nameRules"
                    :readonly="isReadOnly"
                    variant="outlined"
                    required
                    counter="100"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-school-outline</v-icon>
                    </template>
                  </v-text-field>
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
                  v-if="canExperienceBeDeleted && (userStore.role === 'Org Admin' || userStore.role === 'Group Admin')"
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

                <!-- Update Button -->
                <v-btn
                  v-if="canUpdateExperience"
                  type="submit"
                  size="large"
                  color="#c8102e"
                  class="action-btn submit-btn"
                  :loading="updateLoading"
                  :disabled="!experience.experienceCategory || !experience.experienceName"
                >
                  <v-icon start size="18">mdi-content-save</v-icon>
                  {{ $t('Update Experience') }}
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
            {{ $t('Are you sure you want to delete this experience?') }}
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
    <v-dialog v-model="showUpdateDialog" persistent max-width="450px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 info-dialog-header">
          <v-icon color="#c8102e" size="28" class="mr-3">mdi-content-save-check-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Update') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to update this experience?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showUpdateDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="#c8102e" variant="flat" @click="proceedWithUpdate" class="confirm-btn">
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
              <v-icon color="#c8102e" size="18" class="mr-2">mdi-calendar-outline</v-icon>
              <span class="font-weight-medium">{{ instance.sessionName }}</span>
              <span class="text-medium-emphasis mx-1">-</span>
              <span>{{ instance.experienceName }}</span>
            </div>
          </div>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to update this Experience?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="updateDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="#c8102e" variant="flat" @click="proceedWithUpdate" class="confirm-btn">
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
              <v-icon color="#c8102e" size="18" class="mr-2">mdi-calendar-outline</v-icon>
              <span class="font-weight-medium">{{ instance.sessionName }}</span>
              <span class="text-medium-emphasis mx-1">-</span>
              <span>{{ instance.experienceName }}</span>
            </div>
          </div>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to delete this Experience?') }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialogWithInstances = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
          <v-btn color="error" variant="flat" @click="deleteExperience">
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
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "InstructorSpecificExperience",
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
      showUpdateDialog: false,
      updateDialog: false,
      updateLoading: false,
      deleteLoading: false,
      associatedInstances: [],
      deleteDialogWithInstances: false,
      categoryRules: [
        v => !!v || this.$t('Experience category is required'),
        v => (v && v.length >= 2) || this.$t('Category must be at least 2 characters'),
        v => (v && v.length <= 100) || this.$t('Category cannot exceed 100 characters')
      ],
      nameRules: [
        v => !!v || this.$t('Experience name is required'),
        v => (v && v.length >= 2) || this.$t('Name must be at least 2 characters'),
        v => (v && v.length <= 100) || this.$t('Name cannot exceed 100 characters')
      ]
    };
  },

  async mounted() {
    const experienceID = useLoggedInUserStore().navigationData.experienceID;
    
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
      try {
        const resp = await axios.get(apiURL, { headers: { token } });
        const experienceData = resp.data;
        this.experience = {
          experienceCategory: experienceData.experienceCategory,
          experienceName: experienceData.experienceName,
        };
        this.originalExperienceName = experienceData.experienceName;

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
        const checkURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/experience/${store.navigationData.experienceID}`;
        const checkResponse = await axios.get(checkURL, { headers: { token } });

        if (action === "update") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instanceData;
            this.updateDialog = true;
          } else {
            this.showUpdateDialog = true;
          }
        } else if (action === "delete") {
          if (checkResponse.data.expInstancesFound) {
            this.associatedInstances = checkResponse.data.instanceData;
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
      this.deleteExperience();
      this.showDeleteDialog = false;
    },

    async deleteExperience() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience/delete/${user.navigationData.experienceID}`;

        await axios.delete(deleteURL, { headers: { token } });

        user.navigationData = {
          activeTab: 1,
          toastType: 'success',
          toastMessage: 'Experience Deleted!',
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
      let token = user.token;

      const experienceID = user.navigationData.experienceID;
      let experienceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experienceID}`;
      let experienceInstanceUpdateURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/experience-update/${experienceID}`;

      axios
        .put(experienceUpdateURL, {
          experienceCategory: this.experience.experienceCategory,
          experienceName: this.experience.experienceName,
        }, { headers: { token } })
        .then(() => {
          const updateData = {
            experience: {
              category: this.experience.experienceCategory,
              name: this.experience.experienceName,
            },
          };

          return axios.put(experienceInstanceUpdateURL, updateData, { headers: { token } });
        })
        .then((response) => {
          let toastMessage = 'Experience updated!';
          if (response.data && response.data.updatedInstances && response.data.updatedInstances.length > 0) {
            toastMessage = 'Experience and related instances updated!';
          }

          user.navigationData = {
            activeTab: 1,
            toastType: 'info',
            toastMessage: toastMessage,
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--update'
          };
          this.$router.push({ 
            name: 'instructorDataManagement'
          });
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    goBack() {
      if (useLoggedInUserStore().navigationData?.activityID) {
        this.$router.push({
          name: "instructorSpecificActivity"
        });
      } else {
        useLoggedInUserStore().navigationData = {
          activeTab: 1
        };
        this.$router.push({
          name: "instructorDataManagement"
        });
      }
    }
  },
};
</script>

<style scoped>
/* Page Background */
.edit-experience-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

/* Main Form Card */
.form-card {
  border-radius: 12px;
  overflow: hidden;
}

/* Form Sections */
.form-section {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0;
}

.section-content {
  padding-left: 48px;
}

/* Form Actions */
.form-actions {
  display: flex;
  align-items: center;
  padding: 20px 32px;
  background-color: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.action-btn {
  min-width: 120px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.submit-btn {
  color: white !important;
}

.confirm-btn {
  color: white !important;
}

/* Dialogs */
.confirm-dialog {
  border-radius: 12px;
}

.error-dialog-header {
  background-color: #ffebee;
}

.warning-dialog-header {
  background-color: #fff8e1;
}

.info-dialog-header {
  background-color: rgba(200, 16, 46, 0.08);
}

/* Instances List in Dialogs */
.instances-list {
  max-height: 200px;
  overflow-y: auto;
  background-color: #fafafa;
  border-radius: 8px;
  padding: 8px 0;
}

.instance-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.instance-item:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 960px) {
  .form-section {
    padding: 24px 20px;
  }
  
  .section-content {
    padding-left: 0;
    margin-top: 16px;
  }
  
  .form-actions {
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .form-actions .v-spacer {
    display: none;
  }
  
  .action-btn {
    flex: 1 1 auto;
  }
}
</style>