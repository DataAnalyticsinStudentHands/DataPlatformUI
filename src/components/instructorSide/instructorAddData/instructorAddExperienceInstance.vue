<!--
  instructorAddExperienceInstance.vue
  
  Complex form component for creating experience instances with session assignment, multiple experience selection,
  activity management per experience, registration code configuration, and exit form release date scheduling.
  Features tabbed interface for managing activities across different experiences, date picker integration,
  and comprehensive validation before submission to backend API.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="add-experience-instance-page">
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-book-plus-outline</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('New Experience Instances') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Create new experience instances for a session') }}</p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="10">
          <v-card class="form-card" elevation="2">
            <v-form ref="form" @submit.prevent="handleSubmitForm">
              
              <!-- Section 1: Session Selection -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Session') }}</h2>
                    <p class="section-subtitle">{{ $t('Select the session for these experience instances') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-autocomplete
                    :items="sessionData"
                    item-title="sessionName"
                    item-value="_id"
                    :label="$t('Please Select a Session')"
                    v-model="selectedSession"
                    :rules="sessionRules"
                    return-object
                    variant="outlined"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-calendar-range</v-icon>
                    </template>
                  </v-autocomplete>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 2: Experience Selection -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div>
                    <h2 class="section-title">{{ $t('Experiences') }}</h2>
                    <p class="section-subtitle">{{ $t('Select one or more experiences to add to this session') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-autocomplete
                    :items="experienceData"
                    item-title="experienceName"
                    item-value="_id"
                    :label="$t('Please Select an Experience')"
                    v-model="selectedExperiences"
                    :rules="experienceRules"
                    multiple
                    chips
                    return-object
                    clearable
                    variant="outlined"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-school-outline</v-icon>
                    </template>
                  </v-autocomplete>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 3: Activities -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">3</div>
                  <div>
                    <h2 class="section-title">{{ $t('Activities') }}</h2>
                    <p class="section-subtitle">{{ $t('Manage activities for each selected experience') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div v-if="selectedExperiences && selectedExperiences.length">
                    <v-card variant="outlined" class="activities-card">
                      <!-- Experience Tabs -->
                      <v-tabs v-model="activitiesTab" color="#c8102e" class="activities-tabs">
                        <v-tab v-for="experience in selectedExperiences" :key="experience._id" :value="experience._id">
                          <v-icon start size="18">mdi-school-outline</v-icon>
                          {{ experience.experienceName }}
                        </v-tab>
                      </v-tabs>

                      <v-divider></v-divider>

                      <v-card-text class="pa-0">
                        <v-window v-model="activitiesTab">
                          <v-window-item v-for="experience in selectedExperiences" :key="experience._id" :value="experience._id">
                            <div class="activities-content pa-4">
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
                                <v-col cols="12" md="6">
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

                              <!-- Registration Code -->
                              <v-divider class="my-4"></v-divider>
                              <div class="registration-code-section">
                                <v-checkbox
                                  v-model="registrationCodes[experience._id].include"
                                  :label="$t('Include Registration Code for') + ' ' + experience.experienceName"
                                  hide-details
                                  color="#c8102e"
                                ></v-checkbox>

                                <v-expand-transition>
                                  <div v-if="registrationCodes[experience._id].include" class="mt-3">
                                    <v-text-field
                                      v-model="registrationCodes[experience._id].code"
                                      :label="$t('Enter Registration Code')"
                                      variant="outlined"
                                      density="compact"
                                      style="max-width: 400px;"
                                    >
                                      <template v-slot:prepend-inner>
                                        <v-icon size="20" color="#666">mdi-key-outline</v-icon>
                                      </template>
                                    </v-text-field>
                                  </div>
                                </v-expand-transition>
                              </div>
                            </div>
                          </v-window-item>
                        </v-window>
                      </v-card-text>
                    </v-card>
                  </div>

                  <div v-else class="empty-state-inline">
                    <v-icon color="#ccc" size="24" class="mr-2">mdi-information-outline</v-icon>
                    <span class="text-medium-emphasis font-italic">{{ $t('Please Select an Experience') }}</span>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 4: Exit Form Release Date -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">4</div>
                  <div>
                    <h2 class="section-title">{{ $t('Exit Form Release Date') }}</h2>
                    <p class="section-subtitle">{{ $t('Set the release date for each experience\'s exit form') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div v-if="selectedExperiences && selectedExperiences.length">
                    <div class="exit-form-dates-list">
                      <div 
                        v-for="experience in selectedExperiences" 
                        :key="experience._id"
                        class="exit-form-date-item"
                      >
                        <div class="experience-info">
                          <v-icon color="#c8102e" size="20" class="mr-2">mdi-school-outline</v-icon>
                          <span class="font-weight-medium">{{ experience.experienceName }}</span>
                        </div>
                        <div class="date-input-wrapper">
                          <v-text-field
                            type="date"
                            v-model="experience.exitFormReleaseDateInput"
                            :label="$t('Release Date')"
                            variant="outlined"
                            density="compact"
                            hide-details
                            :error="showExitFormError && !experience.exitFormReleaseDate"
                            @update:modelValue="updateExitFormReleaseDate(experience)"
                          >
                            <template v-slot:prepend-inner>
                              <v-icon size="18" color="#666">mdi-calendar-clock</v-icon>
                            </template>
                          </v-text-field>
                        </div>
                      </div>
                    </div>

                    <!-- Set All to Same Date -->
                    <div class="set-all-dates mt-4">
                      <v-btn
                        variant="text"
                        color="#c8102e"
                        size="small"
                        @click="openBulkDatePicker"
                        class="set-all-btn"
                      >
                        <v-icon start size="18">mdi-calendar-sync</v-icon>
                        {{ $t('Set all to same date') }}
                      </v-btn>
                    </div>
                  </div>

                  <div v-else class="empty-state-inline">
                    <v-icon color="#ccc" size="24" class="mr-2">mdi-information-outline</v-icon>
                    <span class="text-medium-emphasis font-italic">{{ $t('Please Select an Experience') }}</span>
                  </div>
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

                <v-spacer></v-spacer>

                <v-btn 
                  type="submit"
                  size="large"
                  color="#c8102e"
                  class="action-btn submit-btn"
                  :disabled="!selectedSession || !selectedExperiences || !selectedExperiences.length"
                >
                  <v-icon start size="18">mdi-check</v-icon>
                  {{ selectedExperiences && selectedExperiences.length === 1 ? $t('Create Experience Instance') : $t('Create Experience Instances') }}
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog for Bulk Date Picker -->
    <v-dialog v-model="showDatePicker" max-width="400px" persistent>
      <v-card class="date-picker-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-calendar-sync</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Set Date for All Experiences') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="showDatePicker = false">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <v-date-picker 
            v-model="selectedDate" 
            show-adjacent-months
            color="#c8102e"
            class="date-picker-full-width"
          ></v-date-picker>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn variant="text" size="large" @click="showDatePicker = false" class="mr-2">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn 
            color="#c8102e" 
            variant="flat"
            size="large" 
            @click="setAllExitFormReleaseDates"
            class="confirm-btn"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply to All') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>
    
<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { toast } from 'vue3-toastify';

export default {
  name: 'instructorAddExperenceInstance',

  data() {
    return {
      // Session data and selection state
      sessionData: [],
      selectedSession: null,
      // Experience data and selection state
      experienceData: [],
      originalExperienceData: [],
      selectedExperiences: null,
      // Date fields for registration and exit form timing
      registrationStartDate: null,
      registrationEndDate: null,
      exitFormReleaseDate: null,
      // Form validation rules
      sessionRules: [v => !!v || this.$t('Session is required')],
      experienceRules: [
        v => {
          if (!this.formSubmitted) return true;
          !!v && v.length > 0 || this.$t('Experience is required')
        }
      ],
      dateRules: [v => !!v || this.$t('Date is required')],
      // Exit form date management
      showDatePicker: false,
      selectedDate: new Date(),
      showExitFormError: false,
      // Activity management state
      activitiesTab: null,
      activityData: [],
      originalActivityData: [],
      activityHeaders: [
        {
          title: "Activity Name",
          value: "activityName",
          key: "activityName",
          align: "start",
          sortable: true
        }
      ],
      activitySearch: "",
      hoveredItem: null,
      selectedExperience: null,
      // Registration code configuration per experience
      registrationCodes: {}
    }
  },

  // Component initialization and data fetching
  created() {
    // Fetch activity data
    this.fetchActivityData();

    // Fetch active sessions and handle the result
    this.fetchActiveSessions().then(() => {
      // Check if there is navigation data with an ID
      if (useLoggedInUserStore().navigationData?.id) {
        // Find a session in the sessionData array that matches the stored ID
        const matchingSession = this.sessionData.find(session => session._id === useLoggedInUserStore().navigationData?.id);
        
        // If a matching session is found, set it as the selected session
        if (matchingSession) {
          this.selectedSession = matchingSession;
        }
      }
    });
  },

  // Reactive data watchers for form state management
  watch: {
    // Watch for changes to the selectedSession
    selectedSession(newVal) {
      // If the new value of selectedSession has a valid _id
      if (newVal && newVal._id) {
        this.selectedExperiences = [];
        
        // Fetch active experiences based on the new session's _id
        this.fetchActiveExperiences(newVal._id);
      } else {
        this.experienceData = [];
      }
    },

    // Watch for changes to the selectedExperiences array
    selectedExperiences(newVal) {
      // If there are new experiences selected
      if (newVal && newVal.length > 0) {
        // Set the first experience as the active tab
        this.activitiesTab = newVal[0]._id;

        // Initialize registration codes for each new experience
        newVal.forEach(exp => {
          if (!this.registrationCodes.hasOwnProperty(exp._id)) {
            this.registrationCodes = { 
              ...this.registrationCodes, 
              [exp._id]: { include: false, code: '' } 
            };
          }
        });
      } else if (newVal.length === 0) {
        // Clear selected experience and activity tab if no experiences are selected
        this.selectedExperience = {};
        this.activitiesTab = null;
      }
    },

    // Watch for changes to the activitiesTab (_id of the selected experience)
    activitiesTab(newVal) {
      // Find the experience that matches the new activitiesTab value
      let matchingExperience = this.selectedExperiences.find(experience => experience._id === newVal);
      
      // If a matching experience is found, set it as the selectedExperience
      if (matchingExperience) {
        this.selectedExperience = matchingExperience;
      } else {
        // Log if no matching experience is found
        console.log('no matching experience');
      }
    },
  },    

  computed: {
    // Filters activities based on the currently selected experience
    selectedActivities() {
      // Returns the activities associated with the selected experience
      return this.activityData.filter(activity => 
        this.selectedExperience?.activities?.includes(activity._id)
      );
    },

    // Filters out activities that are already selected, leaving only unselected activities
    filteredActivityData() {
      // Get IDs of selected activities
      const selectedActivityIDs = this.selectedActivities.map(activity => activity._id);

      // Return activity data excluding the selected activities
      return this.activityData.filter(activity => !selectedActivityIDs.includes(activity._id));
    },
  },

  methods: {
    // Fetches active session data for the instructor from the backend using the stored token, and updates session data state upon successful retrieval.
    async fetchActiveSessions() {
      useLoggedInUserStore().startLoading();
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/active`;
        const resp = await axios.get(apiURL, { headers: { token } });
        this.sessionData = resp.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    // Retrieves activity data marked as active from the backend using the instructor's stored token and updates the component's activity data state with the results, also keeping an original copy for reference.
    fetchActivityData() {
      const user = useLoggedInUserStore();
      let token = user.token;

      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const activities = resp.data;
          this.activityData = activities.filter((activity) => activity.activityStatus === true);
          this.originalActivityData = [...this.activityData];
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    // Fetches available experiences for a given session ID from the backend using the instructor's stored token, updates experience data state with the response, and keeps an original copy for reference.
    async fetchActiveExperiences(sessionID) {
      useLoggedInUserStore().startLoading();
      try {
        const user = useLoggedInUserStore();
        let token = user.token;

        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/available-experiences-for-instance?sessionID=${sessionID}`;
        const resp = await axios.get(apiURL, { headers: { token } });
        this.experienceData = resp.data;
        this.originalExperienceData = [...this.experienceData];
      } catch (error) {
        this.handleError(error);
      } finally {
        useLoggedInUserStore().stopLoading();
      }
    },

    // Opens the bulk date picker dialog
    openBulkDatePicker() {
      this.selectedDate = new Date();
      this.showDatePicker = true;
    },

    // Updates the exit form release date for a single experience when the date input changes
    updateExitFormReleaseDate(experience) {
      if (experience.exitFormReleaseDateInput) {
        experience.exitFormReleaseDate = new Date(experience.exitFormReleaseDateInput).toISOString();
      } else {
        experience.exitFormReleaseDate = null;
      }
    },

    // Sets the exit form release date for all selected experiences to the same date
    setAllExitFormReleaseDates() {
      if (this.selectedDate && this.selectedExperiences) {
        const isoDate = new Date(this.selectedDate).toISOString();
        const inputDate = new Date(this.selectedDate).toISOString().split('T')[0];
        
        this.selectedExperiences.forEach(exp => {
          exp.exitFormReleaseDate = isoDate;
          exp.exitFormReleaseDateInput = inputDate;
        });

        this.showDatePicker = false;
        this.selectedDate = null;
      }
    },

    // Ensures all selected experiences have an exit form release date before validating and submitting the form. If validation passes, it constructs the experience data payload and performs an API call to create experience instances. On successful creation, navigates to the instructor data management view with a success toast message.
    async handleSubmitForm() {
      // Check if all selected experiences have an exit form release date
      if (this.selectedExperiences && this.selectedExperiences.length) {
        const allExperiencesHaveDates = this.selectedExperiences.every(exp => exp.exitFormReleaseDate);
        if (!allExperiencesHaveDates) {
          this.showExitFormError = true;
          toast.error(this.$t('Please set an exit form release date for all experiences.'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
          return; // Stop the form submission if not all experiences have dates
        }
      }

      // Validate the form before submission
      const isValid = await this.$refs.form.validate();
      if (!isValid.valid) {
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }

      // Prepare the experience data for the API call
      const experienceData = this.selectedExperiences.map(exp => ({
        id: exp._id,
        exitFormReleaseDate: exp.exitFormReleaseDate,
        activities: exp.activities.map(actId => {
          const activity = this.activityData.find(activity => activity._id === actId);
          return {
            id: actId,
            name: activity ? activity.activityName : undefined
          };
        }),
        registrationCode: this.registrationCodes[exp._id].include ? this.registrationCodes[exp._id].code : undefined
      }));

      // API call
      try {
        const user = useLoggedInUserStore();
        const token = user.token;

        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experience-instances/multiple`;

        await axios.post(apiURL, {
          sessionID: this.selectedSession._id,
          experienceData
        }, { headers: { token } });

        // Handle response here, e.g., redirecting or displaying a success message
        user.navigationData = {
          activeTab: 0,
          toastType: 'success',
          toastMessage: 'Experience Instance added!',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--create'
        };

        this.$router.push({
          name: 'instructorDataManagement'
        });
      } catch (error) {
        // Handle error
        this.handleError(error);
        toast.error(this.$t('Failed to create experience instances. Please try again.'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      }
    },

    // Adds the selected activity's ID to the list of activities within a selected experience.
    selectActivity(activity) {
      this.selectedExperience.activities.push(activity._id)
    },

    // Identifies and removes a specified activity's ID from the list of activities within a selected experience, based on the activity's ID.
    removeActivity(activity) {
      // Find the index of the activity's _id in the selectedExperience.activities array
      const index = this.selectedExperience.activities.indexOf(activity._id);

      // If the activity's _id is found in the array, remove it
      if (index !== -1) {
        this.selectedExperience.activities.splice(index, 1);
      }
    },

    // Navigate backwards
    goBack() {
      useLoggedInUserStore().navigationData = {
        activeTab: 0,
      };
      this.$router.push({
        name: 'instructorDataManagement'
      });
    },
  }
}
</script>

<style scoped>
/* Page Background */
.add-experience-instance-page {
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

/* Activities Card */
.activities-card {
  border-radius: 8px;
}

.activities-tabs {
  background-color: #fafafa;
}

.activities-content {
  background-color: white;
}

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

/* Registration Code Section */
.registration-code-section {
  padding: 8px 0;
}

/* Exit Form Dates List */
.exit-form-dates-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exit-form-date-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.experience-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.experience-info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-input-wrapper {
  width: 220px;
  flex-shrink: 0;
  margin-left: 16px;
}

.set-all-dates {
  padding-top: 8px;
  border-top: 1px solid #e8e8e8;
}

.set-all-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

/* Empty State Inline */
.empty-state-inline {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 8px;
}

/* Error Text */
.error-text {
  color: #c8102e !important;
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

/* Date Picker Dialog */
.date-picker-dialog {
  border-radius: 12px;
}

.date-picker-full-width {
  width: 100%;
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

  .exit-form-date-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .date-input-wrapper {
    width: 100%;
    margin-left: 0;
  }
}
</style>