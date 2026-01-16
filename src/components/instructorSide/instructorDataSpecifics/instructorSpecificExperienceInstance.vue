<!--
  instructorSpecificExperienceInstance.vue
  
  View and edit a single Experience Instance's data. Provides functionality to update
  activities, exit form release date, registration code, instructor, and delete the instance.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="edit-experience-instance-page">
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-book-edit-outline</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('Edit Experience Instance') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ experienceData.experienceName }}
              <span v-if="instructor" class="instructor-header-badge">({{ instructor }})</span>
            </p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="10">
          <v-card class="form-card" elevation="2">
            <v-form ref="form">
              
              <!-- Section 1: Session & Experience Info -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Session & Experience') }}</h2>
                    <p class="section-subtitle">{{ $t('View the session and experience details') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="readonly-field">
                        <div class="readonly-label">
                          <v-icon size="16" color="#666" class="mr-1">mdi-calendar-range</v-icon>
                          {{ $t('Session Name') }}
                        </div>
                        <div class="readonly-value">
                          {{ sessionData.sessionName }}
                          <v-icon size="16" color="#999" class="ml-2">mdi-lock-outline</v-icon>
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="readonly-field">
                        <div class="readonly-label">
                          <v-icon size="16" color="#666" class="mr-1">mdi-school-outline</v-icon>
                          {{ $t('Experience Name') }}
                        </div>
                        <div class="readonly-value">
                          {{ experienceData.experienceName }}
                          <v-icon size="16" color="#999" class="ml-2">mdi-lock-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 2: Instructor -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div>
                    <h2 class="section-title">{{ $t('Instructor') }}</h2>
                    <p class="section-subtitle">{{ $t('Optional instructor assignment for this instance') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="instructor"
                    :label="$t('Instructor (Optional)')"
                    :readonly="!canUpdateExpInstance"
                    :placeholder="$t('e.g., Dr. Smith, John Doe')"
                    :error-messages="instructorError"
                    variant="outlined"
                    style="max-width: 400px;"
                    @update:modelValue="clearInstructorError"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-account-tie-outline</v-icon>
                    </template>
                  </v-text-field>
                  
                  <p class="text-caption text-medium-emphasis mt-1">
                    <v-icon size="14" color="#666" class="mr-1">mdi-information-outline</v-icon>
                    {{ $t('The same experience can exist multiple times in a session with different instructors.') }}
                  </p>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 3: Registration Code -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">3</div>
                  <div>
                    <h2 class="section-title">{{ $t('Registration Code') }}</h2>
                    <p class="section-subtitle">{{ $t('Optional code for participant registration') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="registrationCode"
                    :label="$t('Registration Code')"
                    :readonly="!canUpdateExpInstance"
                    variant="outlined"
                    style="max-width: 400px;"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-key-outline</v-icon>
                    </template>
                  </v-text-field>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 4: Activities -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">4</div>
                  <div>
                    <h2 class="section-title">{{ $t('Activities') }}</h2>
                    <p class="section-subtitle">{{ $t('Manage activities for this experience instance') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-row>
                    <!-- Selected Activities -->
                    <v-col cols="12" md="6">
                      <div class="activities-panel">
                        <div class="panel-header">
                          <v-icon color="#c8102e" size="20" class="mr-2">mdi-clipboard-check-outline</v-icon>
                          <span class="font-weight-medium">{{ $t('Selected Activities') }}</span>
                          <v-chip size="small" class="ml-2" color="grey">{{ selectedActivities.length }}</v-chip>
                        </div>
                        <div class="scrollable-list">
                          <div v-if="selectedActivities.length === 0" class="empty-activities">
                            <v-icon color="#ccc" size="32">mdi-clipboard-text-off-outline</v-icon>
                            <p class="text-body-2 text-medium-emphasis mt-2 mb-0">{{ $t('No activities selected') }}</p>
                          </div>
                          <v-list v-else density="compact">
                            <v-list-item 
                              v-for="activity in selectedActivities" 
                              :key="activity._id"
                              class="activity-list-item"
                            >
                              <template v-slot:prepend>
                                <v-icon size="18" color="#666">mdi-clipboard-text-outline</v-icon>
                              </template>
                              <v-list-item-title>{{ activity.activityName }}</v-list-item-title>
                              <template v-slot:append>
                                <v-btn 
                                  v-if="canUpdateExpInstance"
                                  icon 
                                  variant="text" 
                                  size="small"
                                  @click.stop="removeActivity(activity)"
                                >
                                  <v-icon size="18" color="error">mdi-close</v-icon>
                                </v-btn>
                              </template>
                            </v-list-item>
                          </v-list>
                        </div>
                      </div>
                    </v-col>

                    <!-- Add Activities -->
                    <v-col cols="12" md="6" v-if="showAddActivities">
                      <div class="activities-panel">
                        <div class="panel-header">
                          <v-icon color="#c8102e" size="20" class="mr-2">mdi-plus-circle-outline</v-icon>
                          <span class="font-weight-medium">{{ $t('Add Activities') }}</span>
                        </div>
                        <v-text-field
                          v-model="activitySearch"
                          :label="$t('Search')"
                          prepend-inner-icon="mdi-magnify"
                          single-line
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="mb-3"
                        ></v-text-field>
                        <div class="scrollable-table">
                          <v-data-table
                            :headers="activityHeaders"
                            :items="filteredActivityData"
                            item-value="_id"
                            items-per-page="-1"
                            hover
                            :search="activitySearch"
                            density="compact"
                          >
                            <template v-slot:body="{ items }">
                              <template v-for="item in items" :key="item._id">
                                <tr
                                  @click="selectActivity(item)"
                                  @mouseover="hoveredItem = item._id"
                                  @mouseleave="hoveredItem = null"
                                  class="activity-row"
                                >
                                  <td>
                                    <div class="activity-content">
                                      <span>{{ item.activityName }}</span>
                                      <v-icon v-if="hoveredItem === item._id" color="#c8102e" size="18">
                                        mdi-plus-circle
                                      </v-icon>
                                    </div>
                                  </td>
                                </tr>
                              </template>
                            </template>
                            <template v-slot:bottom></template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 5: Exit Form Release Date -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">5</div>
                  <div>
                    <h2 class="section-title">{{ $t('Exit Form Release Date') }}</h2>
                    <p class="section-subtitle">{{ $t('Set when the exit form becomes available') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    type="date"
                    v-model="exitFormReleaseDate"
                    :label="$t('Release Date')"
                    :readonly="!canUpdateExpInstance"
                    variant="outlined"
                    style="max-width: 300px;"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-calendar-clock</v-icon>
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
                  v-if="canExpInstanceBeDeleted"
                  variant="outlined"
                  size="large"
                  color="error"
                  @click="showDeleteDialog = true"
                  class="action-btn ml-3"
                >
                  <v-icon start size="18">mdi-delete-outline</v-icon>
                  {{ $t('Delete') }}
                </v-btn>

                <v-spacer></v-spacer>

                <!-- Update Button -->
                <v-btn
                  v-if="canUpdateExpInstance"
                  size="large"
                  color="#c8102e"
                  class="action-btn submit-btn"
                  @click="handleSubmitForm"
                  :loading="isSubmitting"
                >
                  <v-icon start size="18">mdi-content-save</v-icon>
                  {{ $t('Update Experience Instance') }}
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" persistent max-width="450px">
      <v-card class="confirm-dialog">
        <v-card-title class="d-flex align-center pa-5 error-dialog-header">
          <v-icon color="error" size="28" class="mr-3">mdi-delete-alert-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Confirm Delete') }}</span>
        </v-card-title>
        <v-card-text class="px-5 pb-4">
          <p class="text-body-1 mb-0">
            {{ $t('Are you sure you want to delete this experience instance?') }}
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
  </main>
</template>

<script>
import { computed } from 'vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { toast } from 'vue3-toastify';

export default {
  name: 'instructorSpecificExperienceInstance',
  setup() {
    const userStore = useLoggedInUserStore();

    const showAddActivities = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    const canUpdateExpInstance = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    return {
      userStore,
      showAddActivities: showAddActivities.value,
      canUpdateExpInstance: canUpdateExpInstance.value
    };
  },

  data() {
    return {
      sessionData: {},
      experienceData: {},
      selectedSessionID: null,
      selectedExperienceID: null,
      exitFormReleaseDate: null,
      canExpInstanceBeDeleted: false,
      showDeleteDialog: false,
      activityData: [],
      originalExpInstanceName: "",
      selectedActivities: [],
      originalActivities: [],
      activitySearch: "",
      activityHeaders: [
        {
          title: "Activity Name",
          value: "activityName",
          key: "activityName",
          align: "start",
          sortable: true
        }
      ],
      hoveredItem: null,
      registrationCode: "",
      // Instructor field
      instructor: "",
      originalInstructor: "",
      instructorError: "",
      // Submission state
      isSubmitting: false
    }
  },

  async created() {
    await this.fetchActivityData();
    this.fetchExperienceInstance();
    this.checkIfExpInstanceCanBeDeleted();
  },

  computed: {
    filteredActivityData() {
      if (this.selectedActivities && this.selectedActivities.length > 0) {
        return this.activityData.filter(activity => 
          !this.selectedActivities.some(selectedActivity => 
            selectedActivity._id === activity._id
          )
        );
      } else {
        return this.activityData;
      }
    }
  },

  methods: {
    async fetchExperienceInstance() {
      const instanceID = useLoggedInUserStore().navigationData.id;
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/${instanceID}`;

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        const instanceData = response.data;
        this.selectedSessionID = instanceData.sessionID;
        this.selectedExperienceID = instanceData.experience.id;
        this.exitFormReleaseDate = instanceData.exitFormReleaseDate.slice(0, 10);
        
        this.registrationCode = instanceData.registrationCode || "";
        
        // Set instructor field
        this.instructor = instanceData.instructor || "";
        this.originalInstructor = instanceData.instructor || "";

        this.selectedActivities = this.activityData.filter(activity =>
          instanceData.activities.some(instanceActivity => instanceActivity.id === activity._id)
        );

        this.fetchSessionDetails();
        this.fetchExperienceDetails();
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchSessionDetails() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let sessionAPIURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/${this.selectedSessionID}`;
      
      try {
        const sessionResponse = await axios.get(sessionAPIURL, { headers: { token } });
        this.sessionData = sessionResponse.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchExperienceDetails() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let experienceAPIURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${this.selectedExperienceID}`;

      try {
        const experienceResponse = await axios.get(experienceAPIURL, { headers: { token } });
        this.experienceData = experienceResponse.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchActivityData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        const activities = response.data;
        this.activityData = activities.filter(activity => activity.activityStatus === true);
        this.originalActivityData = [...this.activityData];
      } catch (error) {
        this.handleError(error);
      }
    },

    async checkIfExpInstanceCanBeDeleted() {
      const user = useLoggedInUserStore();
      const token = user.token;
      const instanceID = user.navigationData.id;
      const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instance/can-be-deleted/${instanceID}`;

      try {
        const response = await axios.get(url, { headers: { token } });
        this.canExpInstanceBeDeleted = response.data.canBeDeleted;
      } catch (error) {
        this.handleError(error);
      }
    },

    confirmDelete() {
      this.deleteExpInstance();
      this.showDeleteDialog = false;
    },

    async deleteExpInstance() {
      const user = useLoggedInUserStore();
      const instanceID = user.navigationData.id;
      const token = user.token;
      const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/exp-instance/delete/${instanceID}`;

      try {
        await axios.delete(url, { headers: { token } });

        user.navigationData = {
          activeTab: 0,
          toastType: 'success',
          toastMessage: 'Experience Instance Deleted!',
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
        activeTab: 0
      };
      this.$router.push({
        name: 'instructorDataManagement'
      });
    },

    clearInstructorError() {
      this.instructorError = "";
    },

    async handleSubmitForm() {
      // Clear previous errors
      this.instructorError = "";
      this.isSubmitting = true;

      const user = useLoggedInUserStore();
      let token = user.token;
      const instanceID = user.navigationData.id;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/update-single-instance/${instanceID}`;

      try {
        await axios.put(apiURL, {
          exitFormReleaseDate: this.exitFormReleaseDate,
          activities: this.selectedActivities,
          registrationCode: this.registrationCode,
          instructor: this.instructor.trim() || null
        }, { headers: { token } });

        useLoggedInUserStore().navigationData = {
          activeTab: 0,
          toastType: 'info',
          toastMessage: 'Experience Instance updated!',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ 
          name: 'instructorDataManagement'
        });
      } catch (error) {
        // Handle duplicate instructor error (409 Conflict)
        if (error.response?.status === 409) {
          this.instructorError = error.response.data.error || this.$t('This instructor already exists for this experience in this session.');
          toast.error(this.$t('Duplicate experience instance detected. Please use a different instructor.'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        } else {
          this.handleError(error);
          toast.error(this.$t('Failed to update experience instance. Please try again.'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    selectActivity(activity) {
      this.selectedActivities.push(activity)
    },

    removeActivity(activity) {
      this.selectedActivities = this.selectedActivities.filter(selectedActivity => selectedActivity._id !== activity._id);
    },

    handleError(error) {
      console.error(error);
    },
  }
}
</script>

<style scoped>
/* Page Background */
.edit-experience-instance-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.instructor-header-badge {
  color: #666;
  font-weight: normal;
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

/* Readonly Fields */
.readonly-field {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
}

.readonly-label {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.readonly-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
}

/* Activities Panel */
.activities-panel {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
}

.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.empty-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
}

.activity-list-item {
  background-color: white;
  margin-bottom: 4px;
  border-radius: 4px;
}

.activity-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.activity-row:hover {
  background-color: rgba(200, 16, 46, 0.04) !important;
}

.activity-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
}

/* Scrollable containers */
.scrollable-table {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.scrollable-table::-webkit-scrollbar {
  width: 8px;
}

.scrollable-table::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-table::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.scrollable-table::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.scrollable-list {
  max-height: 280px;
  overflow-y: auto;
}

.scrollable-list::-webkit-scrollbar {
  width: 8px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: #999;
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

/* Dialogs */
.confirm-dialog {
  border-radius: 12px;
}

.error-dialog-header {
  background-color: #ffebee;
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

  .activities-panel {
    margin-bottom: 16px;
  }
}
</style>