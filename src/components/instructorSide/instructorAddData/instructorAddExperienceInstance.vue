<!--
  instructorAddExperienceInstance.vue
  
  Complex form component for creating experience instances with session assignment, 
  instructor assignment (optional discriminator field), activity management per experience,
  registration code configuration, and exit form release date scheduling.
  
  Supports creating the same experience multiple times with different instructors.
  Features card-based interface for managing multiple experience instance configurations.
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

              <!-- Section 2: Experience Instances Configuration -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div>
                    <h2 class="section-title">{{ $t('Experience Instances') }}</h2>
                    <p class="section-subtitle">{{ $t('Configure experience instances to create. The same experience can be added multiple times with different instructors.') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <!-- List of configured experience instances -->
                  <div v-if="experienceInstances.length > 0" class="experience-instances-list">
                    <v-card 
                      v-for="(instance, index) in experienceInstances" 
                      :key="instance.uid"
                      class="experience-instance-card mb-4"
                      :class="{ 'has-error': instance.hasError }"
                      variant="outlined"
                    >
                      <v-card-text class="pa-4">
                        <div class="instance-header">
                          <div class="instance-number">{{ index + 1 }}</div>
                          <v-spacer></v-spacer>
                          <v-btn
                            icon
                            variant="text"
                            size="small"
                            color="error"
                            @click="removeExperienceInstance(index)"
                            :disabled="experienceInstances.length === 1"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>

                        <v-row>
                          <!-- Experience Selection -->
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              :items="experienceData"
                              item-title="experienceName"
                              item-value="_id"
                              :label="$t('Experience *')"
                              v-model="instance.experience"
                              return-object
                              variant="outlined"
                              density="comfortable"
                              :error-messages="instance.experienceError"
                              @update:modelValue="onExperienceChange(instance)"
                            >
                              <template v-slot:prepend-inner>
                                <v-icon size="20" color="#666">mdi-school-outline</v-icon>
                              </template>
                              <template v-slot:item="{ item, props }">
                                <v-list-item v-bind="props">
                                  <template v-slot:append>
                                    <v-chip 
                                      v-if="getExistingInstructorsForExperience(item.raw._id).length > 0"
                                      size="x-small" 
                                      color="grey"
                                      variant="tonal"
                                    >
                                      {{ getExistingInstructorsForExperience(item.raw._id).length }} in session
                                    </v-chip>
                                  </template>
                                </v-list-item>
                              </template>
                            </v-autocomplete>
                          </v-col>

                          <!-- Instructor Field (Optional) -->
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="instance.instructor"
                              :label="$t('Instructor (Optional)')"
                              variant="outlined"
                              density="comfortable"
                              :error-messages="instance.instructorError"
                              @update:modelValue="validateDuplicates"
                            >
                              <template v-slot:prepend-inner>
                                <v-icon size="20" color="#666">mdi-account-tie-outline</v-icon>
                              </template>
                            </v-text-field>
                            
                            <!-- Show existing instructors hint -->
                            <div 
                              v-if="instance.experience && getExistingInstructorsForExperience(instance.experience._id).length > 0"
                              class="existing-instructors-hint"
                            >
                              <v-icon size="14" color="#666" class="mr-1">mdi-information-outline</v-icon>
                              <span class="text-caption text-medium-emphasis">
                                {{ $t('Already in session:') }} 
                                <span v-for="(existing, idx) in getExistingInstructorsForExperience(instance.experience._id)" :key="idx">
                                  {{ existing.instructor || $t('(No instructor)') }}{{ idx < getExistingInstructorsForExperience(instance.experience._id).length - 1 ? ', ' : '' }}
                                </span>
                              </span>
                            </div>
                          </v-col>
                        </v-row>

                        <!-- Duplicate Warning -->
                        <v-alert
                          v-if="instance.duplicateWarning"
                          type="error"
                          variant="tonal"
                          density="compact"
                          class="mt-2"
                        >
                          <template v-slot:prepend>
                            <v-icon size="20">mdi-alert-circle</v-icon>
                          </template>
                          {{ instance.duplicateWarning }}
                        </v-alert>
                      </v-card-text>
                    </v-card>
                  </div>

                  <!-- Add Experience Instance Button -->
                  <v-btn
                    variant="outlined"
                    color="#c8102e"
                    @click="addExperienceInstance"
                    :disabled="!selectedSession"
                    class="add-instance-btn"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    {{ $t('Add Experience Instance') }}
                  </v-btn>

                  <div v-if="!selectedSession" class="empty-state-inline mt-4">
                    <v-icon color="#ccc" size="24" class="mr-2">mdi-information-outline</v-icon>
                    <span class="text-medium-emphasis font-italic">{{ $t('Please select a session first') }}</span>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 3: Activities -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">3</div>
                  <div>
                    <h2 class="section-title">{{ $t('Activities') }}</h2>
                    <p class="section-subtitle">{{ $t('Manage activities for each experience instance') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div v-if="validExperienceInstances.length > 0">
                    <v-card variant="outlined" class="activities-card">
                      <!-- Experience Instance Tabs -->
                      <v-tabs v-model="activitiesTab" color="#c8102e" class="activities-tabs">
                        <v-tab 
                          v-for="instance in validExperienceInstances" 
                          :key="instance.uid" 
                          :value="instance.uid"
                        >
                          <v-icon start size="18">mdi-school-outline</v-icon>
                          <span class="tab-label">
                            {{ instance.experience.experienceName }}
                            <span v-if="instance.instructor" class="instructor-badge">
                              ({{ instance.instructor }})
                            </span>
                          </span>
                        </v-tab>
                      </v-tabs>

                      <v-divider></v-divider>

                      <v-card-text class="pa-0">
                        <v-window v-model="activitiesTab">
                          <v-window-item 
                            v-for="instance in validExperienceInstances" 
                            :key="instance.uid" 
                            :value="instance.uid"
                          >
                            <div class="activities-content pa-4">
                              <v-row>
                                <!-- Selected Activities -->
                                <v-col cols="12" md="6">
                                  <div class="activities-panel">
                                    <div class="panel-header">
                                      <v-icon color="#c8102e" size="20" class="mr-2">mdi-clipboard-check-outline</v-icon>
                                      <span class="font-weight-medium">{{ $t('Selected Activities') }}</span>
                                      <v-chip size="small" class="ml-2" color="grey">
                                        {{ getSelectedActivitiesForInstance(instance).length }}
                                      </v-chip>
                                    </div>
                                    <div class="scrollable-list">
                                      <div v-if="getSelectedActivitiesForInstance(instance).length === 0" class="empty-activities">
                                        <v-icon color="#ccc" size="32">mdi-clipboard-text-off-outline</v-icon>
                                        <p class="text-body-2 text-medium-emphasis mt-2 mb-0">{{ $t('No activities selected') }}</p>
                                      </div>
                                      <v-list v-else density="compact">
                                        <v-list-item 
                                          v-for="activity in getSelectedActivitiesForInstance(instance)" 
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
                                              @click.stop="removeActivityFromInstance(instance, activity)"
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
                                        :items="getAvailableActivitiesForInstance(instance)"
                                        item-value="_id"
                                        items-per-page="-1"
                                        hover
                                        :search="activitySearch"
                                        density="compact"
                                      >
                                        <template v-slot:body="{ items }">
                                          <template v-for="item in items" :key="item._id">
                                            <tr
                                              @click="addActivityToInstance(instance, item)"
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
                                  v-model="instance.includeRegistrationCode"
                                  :label="$t('Include Registration Code')"
                                  hide-details
                                  color="#c8102e"
                                ></v-checkbox>

                                <v-expand-transition>
                                  <div v-if="instance.includeRegistrationCode" class="mt-3">
                                    <v-text-field
                                      v-model="instance.registrationCode"
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
                    <span class="text-medium-emphasis font-italic">{{ $t('Please add and configure experience instances above') }}</span>
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
                    <p class="section-subtitle">{{ $t('Set the release date for each experience instance\'s exit form') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div v-if="validExperienceInstances.length > 0">
                    <div class="exit-form-dates-list">
                      <div 
                        v-for="instance in validExperienceInstances" 
                        :key="instance.uid"
                        class="exit-form-date-item"
                      >
                        <div class="experience-info">
                          <v-icon color="#c8102e" size="20" class="mr-2">mdi-school-outline</v-icon>
                          <div class="experience-label">
                            <span class="font-weight-medium">{{ instance.experience.experienceName }}</span>
                            <span v-if="instance.instructor" class="instructor-sublabel text-medium-emphasis">
                              {{ instance.instructor }}
                            </span>
                          </div>
                        </div>
                        <div class="date-input-wrapper">
                          <v-text-field
                            type="date"
                            v-model="instance.exitFormReleaseDateInput"
                            :label="$t('Release Date')"
                            variant="outlined"
                            density="compact"
                            hide-details
                            :error="showExitFormError && !instance.exitFormReleaseDate"
                            @update:modelValue="updateExitFormReleaseDate(instance)"
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
                    <span class="text-medium-emphasis font-italic">{{ $t('Please add and configure experience instances above') }}</span>
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
                  :disabled="!canSubmit"
                >
                  <v-icon start size="18">mdi-check</v-icon>
                  {{ validExperienceInstances.length === 1 ? $t('Create Experience Instance') : $t('Create Experience Instances') }}
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
          <span class="text-h6 font-weight-bold">{{ $t('Set Date for All Instances') }}</span>
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
  name: 'instructorAddExperienceInstance',

  data() {
    return {
      // Session data and selection state
      sessionData: [],
      selectedSession: null,
      
      // Experience data from API (includes existingInstructors info)
      experienceData: [],
      
      // Experience instances being configured (array of instance configs)
      experienceInstances: [],
      uidCounter: 0, // For generating unique IDs
      
      // Form validation rules
      sessionRules: [v => !!v || this.$t('Session is required')],
      
      // Exit form date management
      showDatePicker: false,
      selectedDate: new Date(),
      showExitFormError: false,
      
      // Activity management state
      activitiesTab: null,
      activityData: [],
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
    }
  },

  created() {
    this.fetchActivityData();
    this.fetchActiveSessions().then(() => {
      if (useLoggedInUserStore().navigationData?.id) {
        const matchingSession = this.sessionData.find(
          session => session._id === useLoggedInUserStore().navigationData?.id
        );
        if (matchingSession) {
          this.selectedSession = matchingSession;
        }
      }
    });
  },

  watch: {
    selectedSession(newVal) {
      if (newVal && newVal._id) {
        // Clear existing instances when session changes
        this.experienceInstances = [];
        this.fetchActiveExperiences(newVal._id);
      } else {
        this.experienceData = [];
        this.experienceInstances = [];
      }
    },

    // Set first tab when valid instances change
    validExperienceInstances: {
      handler(newVal) {
        if (newVal.length > 0 && !this.activitiesTab) {
          this.activitiesTab = newVal[0].uid;
        } else if (newVal.length === 0) {
          this.activitiesTab = null;
        }
      },
      immediate: true
    }
  },

  computed: {
    // Filter to only instances that have a valid experience selected
    validExperienceInstances() {
      return this.experienceInstances.filter(inst => inst.experience && !inst.duplicateWarning);
    },

    // Check if form can be submitted
    canSubmit() {
      return (
        this.selectedSession &&
        this.validExperienceInstances.length > 0 &&
        !this.experienceInstances.some(inst => inst.duplicateWarning)
      );
    }
  },

  methods: {
    // Generate unique ID for each instance
    generateUid() {
      return `instance_${++this.uidCounter}_${Date.now()}`;
    },

    // Add a new empty experience instance configuration
    addExperienceInstance() {
      const newInstance = {
        uid: this.generateUid(),
        experience: null,
        instructor: '',
        activities: [],
        exitFormReleaseDate: null,
        exitFormReleaseDateInput: '',
        includeRegistrationCode: false,
        registrationCode: '',
        experienceError: '',
        instructorError: '',
        duplicateWarning: '',
        hasError: false
      };
      this.experienceInstances.push(newInstance);
    },

    // Remove an experience instance configuration
    removeExperienceInstance(index) {
      this.experienceInstances.splice(index, 1);
      this.validateDuplicates();
    },

    // When experience selection changes, prefill activities from previous instances
    onExperienceChange(instance) {
      if (instance.experience) {
        // Prefill activities from the experience's last known activities
        instance.activities = instance.experience.activities ? [...instance.experience.activities] : [];
        instance.experienceError = '';
      }
      this.validateDuplicates();
    },

    // Get existing instructors for an experience from API data
    getExistingInstructorsForExperience(experienceId) {
      const exp = this.experienceData.find(e => e._id === experienceId);
      return exp?.existingInstructors || [];
    },

    // Validate for duplicate experience+instructor combinations
    validateDuplicates() {
      // Clear all previous warnings
      this.experienceInstances.forEach(inst => {
        inst.duplicateWarning = '';
        inst.hasError = false;
      });

      // Check against existing instances in the session (from API)
      this.experienceInstances.forEach(inst => {
        if (!inst.experience) return;

        const existingInstructors = this.getExistingInstructorsForExperience(inst.experience._id);
        const normalizedInstructor = inst.instructor?.trim() || null;

        // Check if this combination already exists in the session
        const existsInSession = existingInstructors.some(
          existing => (existing.instructor || null) === normalizedInstructor
        );

        if (existsInSession) {
          if (normalizedInstructor) {
            inst.duplicateWarning = `${this.$t('This experience with')} "${normalizedInstructor}" ${this.$t('already exists in this session.')}`;
          } else {
            inst.duplicateWarning = this.$t('This experience without an instructor already exists in this session.');
          }
          inst.hasError = true;
        }
      });

      // Check for duplicates within the current form
      const seen = new Map();
      this.experienceInstances.forEach((inst, index) => {
        if (!inst.experience || inst.duplicateWarning) return;

        const key = `${inst.experience._id}|${inst.instructor?.trim() || ''}`;
        
        if (seen.has(key)) {
          const instructorName = inst.instructor?.trim();
          if (instructorName) {
            inst.duplicateWarning = `${this.$t('Duplicate: same experience with')} "${instructorName}" ${this.$t('is already configured above.')}`;
          } else {
            inst.duplicateWarning = this.$t('Duplicate: same experience without an instructor is already configured above.');
          }
          inst.hasError = true;
        } else {
          seen.set(key, index);
        }
      });
    },

    // Activity management methods
    getSelectedActivitiesForInstance(instance) {
      return this.activityData.filter(activity => 
        instance.activities?.includes(activity._id)
      );
    },

    getAvailableActivitiesForInstance(instance) {
      const selectedIds = instance.activities || [];
      return this.activityData.filter(activity => !selectedIds.includes(activity._id));
    },

    addActivityToInstance(instance, activity) {
      if (!instance.activities) {
        instance.activities = [];
      }
      instance.activities.push(activity._id);
    },

    removeActivityFromInstance(instance, activity) {
      const index = instance.activities.indexOf(activity._id);
      if (index !== -1) {
        instance.activities.splice(index, 1);
      }
    },

    // Date management methods
    updateExitFormReleaseDate(instance) {
      if (instance.exitFormReleaseDateInput) {
        instance.exitFormReleaseDate = new Date(instance.exitFormReleaseDateInput).toISOString();
      } else {
        instance.exitFormReleaseDate = null;
      }
    },

    openBulkDatePicker() {
      this.selectedDate = new Date();
      this.showDatePicker = true;
    },

    setAllExitFormReleaseDates() {
      if (this.selectedDate) {
        const isoDate = new Date(this.selectedDate).toISOString();
        const inputDate = new Date(this.selectedDate).toISOString().split('T')[0];
        
        this.experienceInstances.forEach(inst => {
          inst.exitFormReleaseDate = isoDate;
          inst.exitFormReleaseDateInput = inputDate;
        });

        this.showDatePicker = false;
        this.selectedDate = null;
      }
    },

    // API methods
    async fetchActiveSessions() {
      useLoggedInUserStore().startLoading();
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        
        const apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/active`;
        const resp = await axios.get(apiURL, { headers: { token } });
        this.sessionData = resp.data;
      } catch (error) {
        this.handleError(error);
      } finally {
        useLoggedInUserStore().stopLoading();
      }
    },

    async fetchActivityData() {
      const user = useLoggedInUserStore();
      const token = user.token;

      const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      try {
        const resp = await axios.get(apiURL, { headers: { token } });
        this.activityData = resp.data.filter(activity => activity.activityStatus === true);
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchActiveExperiences(sessionID) {
      useLoggedInUserStore().startLoading();
      try {
        const user = useLoggedInUserStore();
        const token = user.token;

        const apiURL = import.meta.env.VITE_ROOT_API + 
          `/instructorSideData/experiences/available-experiences-for-instance?sessionID=${sessionID}`;
        const resp = await axios.get(apiURL, { headers: { token } });
        this.experienceData = resp.data;
        
        // Add first instance automatically after loading experiences
        if (this.experienceInstances.length === 0) {
          this.addExperienceInstance();
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        useLoggedInUserStore().stopLoading();
      }
    },

    // Form submission
    async handleSubmitForm() {
      // Validate duplicates one more time
      this.validateDuplicates();

      // Check for any errors
      if (this.experienceInstances.some(inst => inst.duplicateWarning)) {
        toast.error(this.$t('Please resolve duplicate experience instances before submitting.'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }

      // Check all valid instances have exit form dates
      const instancesWithoutDates = this.validExperienceInstances.filter(inst => !inst.exitFormReleaseDate);
      if (instancesWithoutDates.length > 0) {
        this.showExitFormError = true;
        toast.error(this.$t('Please set an exit form release date for all experience instances.'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }

      // Check we have at least one valid instance
      if (this.validExperienceInstances.length === 0) {
        toast.error(this.$t('Please add at least one experience instance.'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }

      // Validate the form
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
      const experienceData = this.validExperienceInstances.map(inst => ({
        id: inst.experience._id,
        exitFormReleaseDate: inst.exitFormReleaseDate,
        activities: inst.activities.map(actId => {
          const activity = this.activityData.find(a => a._id === actId);
          return {
            id: actId,
            name: activity ? activity.activityName : undefined
          };
        }),
        registrationCode: inst.includeRegistrationCode ? inst.registrationCode : undefined,
        instructor: inst.instructor?.trim() || null
      }));

      // API call
      try {
        const user = useLoggedInUserStore();
        const token = user.token;

        const apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experience-instances/multiple`;

        await axios.post(apiURL, {
          sessionID: this.selectedSession._id,
          experienceData
        }, { headers: { token } });

        // Handle success
        user.navigationData = {
          activeTab: 0,
          toastType: 'success',
          toastMessage: this.validExperienceInstances.length === 1 
            ? 'Experience Instance created!' 
            : `${this.validExperienceInstances.length} Experience Instances created!`,
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--create'
        };

        this.$router.push({
          name: 'instructorDataManagement'
        });
      } catch (error) {
        this.handleError(error);
        
        // Check for duplicate error from backend
        if (error.response?.status === 409) {
          toast.error(error.response.data.error || this.$t('Duplicate experience instance detected.'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        } else {
          toast.error(this.$t('Failed to create experience instances. Please try again.'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        }
      }
    },

    goBack() {
      useLoggedInUserStore().navigationData = {
        activeTab: 0,
      };
      this.$router.push({
        name: 'instructorDataManagement'
      });
    },

    handleError(error) {
      console.error('Error:', error);
    }
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

/* Experience Instance Cards */
.experience-instances-list {
  margin-bottom: 16px;
}

.experience-instance-card {
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.experience-instance-card.has-error {
  border-color: #c8102e !important;
  background-color: rgba(200, 16, 46, 0.02);
}

.instance-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.instance-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e8e8e8;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
}

.existing-instructors-hint {
  display: flex;
  align-items: flex-start;
  margin-top: 4px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.add-instance-btn {
  text-transform: none;
  font-weight: 500;
}

/* Activities Card */
.activities-card {
  border-radius: 8px;
}

.activities-tabs {
  background-color: #fafafa;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.instructor-badge {
  font-size: 0.75rem;
  color: #666;
  font-weight: normal;
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

.scrollable-table::-webkit-scrollbar,
.scrollable-list::-webkit-scrollbar {
  width: 8px;
}

.scrollable-table::-webkit-scrollbar-track,
.scrollable-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-table::-webkit-scrollbar-thumb,
.scrollable-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.scrollable-table::-webkit-scrollbar-thumb:hover,
.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.scrollable-list {
  max-height: 280px;
  overflow-y: auto;
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

.experience-label {
  display: flex;
  flex-direction: column;
}

.instructor-sublabel {
  font-size: 0.75rem;
  margin-top: 2px;
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