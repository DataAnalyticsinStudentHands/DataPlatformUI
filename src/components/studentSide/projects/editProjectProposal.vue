<!-- 
editProjectProposal.vue
Student-side interface for editing project proposals in the "Proposed" status. 
Allows students to update project details, modify tags, and cancel proposals 
before they are approved by instructors.
-->

<template>
  <main class="proposal-page">
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-pencil-outline</v-icon>
          <div>
            <div class="d-flex align-center">
              <h1 class="text-h5 font-weight-bold">{{ $t('Edit Project Proposal') }}</h1>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="mobileInfoDialog = true"
                class="ml-2 d-lg-none"
              >
                <v-icon color="#c8102e" size="22">mdi-help-circle</v-icon>
              </v-btn>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Update your proposal before it is reviewed') }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <v-row v-if="loading" justify="center" class="py-16">
        <v-col cols="12" class="text-center">
          <v-progress-circular 
            indeterminate 
            color="#c8102e" 
            size="48"
            width="4"
          ></v-progress-circular>
          <p class="text-body-2 text-medium-emphasis mt-4">{{ $t('Loading project data...') }}</p>
        </v-col>
      </v-row>

      <v-form v-else ref="form" @submit.prevent="openSubmitDialog">
        <v-row>
          <!-- Main Form Column -->
          <v-col cols="12" lg="8">
            <v-card class="form-card" elevation="2">
              <!-- Status Banner for Non-Proposed Projects -->
              <div v-if="projectData.projectStatus !== 'Proposed'" class="status-banner">
                <v-icon class="mr-2">mdi-information</v-icon>
                <span>{{ $t('This project is currently') }} <strong>{{ projectData.projectStatus }}</strong>. {{ $t('Some fields may not be editable.') }}</span>
              </div>

              <!-- Section 1: Basic Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Basic Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Update your project name and description') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field 
                    v-model="projectData.name" 
                    :label="$t('Project Name')"
                    :placeholder="$t('Enter a descriptive name for your project')"
                    :error="isNameInvalid"
                    :error-messages="nameErrorMessages"
                    :rules="nameRules"
                    :counter="100"
                    variant="outlined"
                    required
                    class="mb-4"
                  ></v-text-field>

                  <v-textarea 
                    v-model="projectData.description" 
                    :label="$t('Project Description')"
                    :placeholder="$t('Describe your project goals, methodology, and expected outcomes...')"
                    :error="isDescriptionInvalid"
                    :error-messages="descriptionErrorMessages"
                    :rules="descriptionRules"
                    :counter="5000"
                    variant="outlined"
                    auto-grow
                    rows="5"
                  ></v-textarea>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 2: Experience Association -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div>
                    <h2 class="section-title">{{ $t('Experience Association') }}</h2>
                    <p class="section-subtitle">{{ $t('The experience this project is linked to') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-select
                    v-model="projectData.experienceInstanceId"
                    :items="experienceInstances"
                    item-title="experienceInstanceName"
                    item-value="experienceInstanceId"
                    :label="$t('Associated Experience')"
                    :error="isExperienceInvalid"
                    :error-messages="experienceErrorMessages"
                    :loading="isLoadingExperiences"
                    variant="outlined"
                    required
                    disabled
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="#c8102e" size="20">mdi-school-outline</v-icon>
                    </template>
                  </v-select>

                  <div class="experience-notice mt-2">
                    <v-icon size="16" class="mr-2">mdi-lock-outline</v-icon>
                    <span class="text-body-2 text-medium-emphasis">{{ $t('The associated experience cannot be changed after proposal submission.') }}</span>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 3: Visibility & Consent -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">3</div>
                  <div>
                    <h2 class="section-title">{{ $t('Visibility Settings') }}</h2>
                    <p class="section-subtitle">{{ $t('Choose how your project may be shared') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div class="consent-option">
                    <div class="d-flex align-start">
                      <v-checkbox
                        v-model="projectData.consentToFeature"
                        color="#c8102e"
                        hide-details
                        class="mt-0 pt-0 mr-2"
                      ></v-checkbox>
                      
                      <div class="consent-text flex-grow-1">
                        <div class="d-flex align-center">
                          <span class="consent-label">
                            {{ $t('I consent to having my project considered for the public showcase') }}
                          </span>
                          <v-btn
                            icon
                            variant="text"
                            size="x-small"
                            @click="featureInfoDialog = true"
                            class="ml-1"
                          >
                            <v-icon size="18" color="#c8102e">mdi-help-circle-outline</v-icon>
                          </v-btn>
                        </div>
                        <p class="text-caption text-medium-emphasis mt-1 mb-0">
                          {{ $t('Optional. Your project may be featured on our public projects page to celebrate student work.') }}
                        </p>
                      </div>
                    </div>
                  </div>
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
                  {{ $t('Back') }}
                </v-btn>

                <v-spacer></v-spacer>
                
                <v-btn 
                  variant="outlined"
                  size="large"
                  color="error"
                  @click="openCancelDialog"
                  class="action-btn mr-3"
                  :disabled="updateLoading || cancelLoading"
                >
                  <v-icon start size="18">mdi-close-circle-outline</v-icon>
                  {{ $t('Cancel Proposal') }}
                </v-btn>

                <v-btn 
                  type="submit"
                  size="large"
                  class="action-btn submit-btn"
                  :loading="updateLoading"
                  :disabled="cancelLoading"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  {{ $t('Update Proposal') }}
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- Sidebar Column (Hidden on mobile) -->
          <v-col cols="12" lg="4" class="d-none d-lg-block">
            <div class="sidebar-sticky">
              <!-- Status Card -->
              <v-card class="status-card mb-4" variant="outlined">
                <v-card-title class="tips-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-information-outline</v-icon>
                  {{ $t('Proposal Status') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <div class="d-flex align-center mb-3">
                    <v-chip
                      :color="getStatusColor(projectData.projectStatus)"
                      size="large"
                      class="font-weight-medium"
                    >
                      <v-icon start size="18">{{ getStatusIcon(projectData.projectStatus) }}</v-icon>
                      {{ projectData.projectStatus }}
                    </v-chip>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ getStatusDescription(projectData.projectStatus) }}
                  </p>
                </v-card-text>
              </v-card>

              <!-- Warning Card -->
              <v-card class="warning-card" variant="outlined">
                <v-card-title class="warning-header">
                  <v-icon color="warning" class="mr-2">mdi-alert-outline</v-icon>
                  {{ $t('Important Note') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <p class="text-body-2 mb-0">
                    {{ $t('Cancelling your proposal is permanent and cannot be undone. Only cancel if you no longer wish to pursue this project.') }}
                  </p>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-form>

      <!-- Mobile Info Dialog (Status & Warning) -->
      <v-dialog v-model="mobileInfoDialog" max-width="500px">
        <v-card class="mobile-info-dialog">
          <v-btn 
            icon 
            variant="text" 
            size="small" 
            @click="mobileInfoDialog = false"
            class="mobile-info-close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          
          <v-card-text class="pa-5 pt-6">
            <!-- Status Section -->
            <div class="mobile-info-section mb-5">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="#c8102e" size="20" class="mr-2">mdi-clipboard-outline</v-icon>
                {{ $t('Proposal Status') }}
              </h3>
              <div class="d-flex align-center mb-3">
                <v-chip
                  :color="getStatusColor(projectData.projectStatus)"
                  size="large"
                  class="font-weight-medium"
                >
                  <v-icon start size="18">{{ getStatusIcon(projectData.projectStatus) }}</v-icon>
                  {{ projectData.projectStatus }}
                </v-chip>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ getStatusDescription(projectData.projectStatus) }}
              </p>
            </div>

            <v-divider class="mb-5"></v-divider>

            <!-- Warning Section -->
            <div class="mobile-info-section">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="warning" size="20" class="mr-2">mdi-alert-outline</v-icon>
                {{ $t('Important Note') }}
              </h3>
              <p class="text-body-2 mb-0">
                {{ $t('Cancelling your proposal is permanent and cannot be undone. Only cancel if you no longer wish to pursue this project.') }}
              </p>
            </div>
          </v-card-text>
          
          <v-card-actions class="pa-4 pt-0">
            <v-spacer></v-spacer>
            <v-btn 
              class="got-it-btn px-6"
              variant="flat"
              @click="mobileInfoDialog = false"
            >
              {{ $t('Got it') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Update Confirmation Dialog -->
      <v-dialog v-model="submitDialog" persistent max-width="450px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5">
            <v-icon color="#c8102e" size="28" class="mr-3">mdi-file-document-edit-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Update Proposal?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <p class="text-body-1 mb-0">
              {{ $t('Your changes will be saved and the proposal will remain under review.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="submitDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn class="submit-btn" @click="confirmUpdate">
              <v-icon start size="18">mdi-check</v-icon>
              {{ $t('Update') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancel Proposal Confirmation Dialog -->
      <v-dialog v-model="cancelDialog" persistent max-width="500px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 cancel-dialog-header">
            <v-icon color="error" size="28" class="mr-3">mdi-alert-circle-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Cancel Project Proposal?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <v-alert type="error" variant="tonal" class="mb-4">
              <strong>{{ $t('This action cannot be undone.') }}</strong>
            </v-alert>
            <p class="text-body-1 mb-0">
              {{ $t('Are you sure you want to cancel this project proposal? Your proposal will be permanently removed and you will need to submit a new proposal if you change your mind.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="cancelDialog = false" class="mr-2">{{ $t('No, Keep Proposal') }}</v-btn>
            <v-btn color="error" variant="flat" @click="confirmCancel" :loading="cancelLoading">
              <v-icon start size="18">mdi-close-circle</v-icon>
              {{ $t('Yes, Cancel Proposal') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Featured Project Info Dialog -->
      <v-dialog v-model="featureInfoDialog" max-width="600px">
        <v-card class="info-dialog-card">
          <v-card-title class="d-flex align-center dialog-title-bar pa-4">
            <v-icon color="#c8102e" class="mr-3" size="28">mdi-star-circle</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('About the Public Project Showcase') }}</span>
          </v-card-title>
          
          <v-card-text class="pa-5">
            <p class="text-body-1 mb-5">
              {{ $t('The Engaged Data platform features student projects on our public showcase page to celebrate student achievements and inspire others.') }}
            </p>

            <div class="consent-notice mb-5 pa-4">
              <div class="d-flex align-start">
                <v-icon color="#c8102e" class="mr-3 mt-1" size="22">mdi-information</v-icon>
                <div>
                  <p class="font-weight-bold mb-1" style="color: #c8102e;">{{ $t('Consent does not guarantee featuring.') }}</p>
                  <p class="text-body-2 mb-0">{{ $t('Program administrators curate which projects appear on the public page.') }}</p>
                </div>
              </div>
            </div>

            <p class="font-weight-bold mb-3">{{ $t('If your project is selected, the following may be displayed:') }}</p>
            
            <div class="info-list mb-5">
              <div class="info-list-item">
                <v-icon color="#c8102e" size="20" class="mr-3">mdi-checkbox-marked-circle-outline</v-icon>
                <span>{{ $t('Project name and description') }}</span>
              </div>
              <div class="info-list-item">
                <v-icon color="#c8102e" size="20" class="mr-3">mdi-checkbox-marked-circle-outline</v-icon>
                <span>{{ $t('Your name (as project author)') }}</span>
              </div>
              <div class="info-list-item">
                <v-icon color="#c8102e" size="20" class="mr-3">mdi-checkbox-marked-circle-outline</v-icon>
                <span>{{ $t('Experience/program name and session') }}</span>
              </div>
              <div class="info-list-item">
                <v-icon color="#c8102e" size="20" class="mr-3">mdi-checkbox-marked-circle-outline</v-icon>
                <span>{{ $t('Project tags and categories') }}</span>
              </div>
              <div class="info-list-item">
                <v-icon color="#c8102e" size="20" class="mr-3">mdi-checkbox-marked-circle-outline</v-icon>
                <span>{{ $t('Any uploaded poster or presentation materials') }}</span>
              </div>
            </div>

            <v-divider class="mb-5"></v-divider>

            <p class="font-weight-bold mb-3">{{ $t('Your rights:') }}</p>
            
            <div class="info-list">
              <div class="info-list-item">
                <v-icon color="#a00d24" size="20" class="mr-3">mdi-shield-check</v-icon>
                <span>{{ $t('You can withdraw consent at any time through your project settings') }}</span>
              </div>
              <div class="info-list-item">
                <v-icon color="#a00d24" size="20" class="mr-3">mdi-shield-check</v-icon>
                <span>{{ $t('Your project will be removed from the public page upon withdrawal') }}</span>
              </div>
              <div class="info-list-item">
                <v-icon color="#a00d24" size="20" class="mr-3">mdi-shield-check</v-icon>
                <span>{{ $t('You retain full ownership of your work') }}</span>
              </div>
            </div>
          </v-card-text>
          
          <v-card-actions class="pa-4 pt-0">
            <v-spacer></v-spacer>
            <v-btn 
              class="got-it-btn px-6"
              variant="flat"
              @click="featureInfoDialog = false"
            >
              {{ $t('Got it') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </main>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "EditProjectProposal",
  data() {
    return {
      // Loading and form states
      loading: true,
      formSubmitted: false,
      
      // Dialog visibility states
      submitDialog: false,
      cancelDialog: false,
      featureInfoDialog: false,
      mobileInfoDialog: false,
      
      // Operation loading states
      updateLoading: false,
      cancelLoading: false,
      isLoadingExperiences: false,
      
      // Project data object
      projectData: {
        _id: null,
        name: '',
        description: '',
        experienceInstanceId: null,
        projectStatus: 'Proposed',
        consentToFeature: false
      },
      
      // Experience data
      experienceInstances: [],
      experienceInstancesLoaded: false,
      
      // Form validation rules
      nameRules: [
        v => !!v || this.$t('Project name is required'),
        v => (v && v.length >= 3) || this.$t('Project name must be at least 3 characters long'),
        v => (v && v.length <= 100) || this.$t('Project name cannot exceed 100 characters')
      ],
      descriptionRules: [
        v => !!v || this.$t('Project description is required'),
        v => (v && v.length >= 10) || this.$t('Project description must be at least 10 characters long'),
        v => (v && v.length <= 5000) || this.$t('Project description cannot exceed 5000 characters')
      ],
      
      // Available project tags
      availableTags: [
        "community", "coding", "outreach", "education", "innovation", "campus", 
        "technology", "empowerment", "collaboration", "digital", "learning", 
        "network", "nonprofit", "humanity", "social impact"
      ],
      selectedTags: []
    };
  },
  computed: {
    // Project name validation state
    isNameInvalid() {
      if (!this.formSubmitted) return false;
      return !this.projectData.name || 
             this.projectData.name.trim() === '' ||
             this.projectData.name.length < 3 ||
             this.projectData.name.length > 100;
    },
    
    // Project name error messages
    nameErrorMessages() {
      if (!this.formSubmitted) return [];
      const errors = [];
      if (!this.projectData.name || this.projectData.name.trim() === '') {
        errors.push(this.$t('Project name is required'));
      } else if (this.projectData.name.length < 3) {
        errors.push(this.$t('Project name must be at least 3 characters long'));
      } else if (this.projectData.name.length > 100) {
        errors.push(this.$t('Project name cannot exceed 100 characters'));
      }
      return errors;
    },
    
    // Project description validation state
    isDescriptionInvalid() {
      if (!this.formSubmitted) return false;
      return !this.projectData.description || 
             this.projectData.description.trim() === '' || 
             this.projectData.description.length < 10 ||
             this.projectData.description.length > 5000;
    },
    
    // Project description error messages
    descriptionErrorMessages() {
      if (!this.formSubmitted) return [];
      const errors = [];
      if (!this.projectData.description || this.projectData.description.trim() === '') {
        errors.push(this.$t('Project description is required'));
      } else if (this.projectData.description.length < 10) {
        errors.push(this.$t('Project description must be at least 10 characters long'));
      } else if (this.projectData.description.length > 5000) {
        errors.push(this.$t('Project description cannot exceed 5000 characters'));
      }
      return errors;
    },
    
    // Experience selection validation state
    isExperienceInvalid() {
      if (!this.formSubmitted) return false;
      return !this.projectData.experienceInstanceId;
    },
    
    // Experience selection error messages
    experienceErrorMessages() {
      return this.isExperienceInvalid ? [this.$t('Please select an experience')] : [];
    },
    
    // Overall form validation state
    hasValidationErrors() {
      if (!this.formSubmitted) return false;
      return this.isNameInvalid || this.isDescriptionInvalid || this.isExperienceInvalid;
    }
  },
  
  // Component initialization
  async mounted() {
    const user = useLoggedInUserStore();
    
    if (!user.navigationData || !user.navigationData.projectID) {
      console.error('Project ID not found in navigation data');
      toast.error(this.$t("Cannot find project information. Returning to projects list."), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--delete',
        multiple: false
      });
      this.$router.push({ name: 'studentProjects' });
      return;
    }
    
    await this.fetchProjectData();
    await this.fetchStudentExperienceInstances();
  },
  
  methods: {
    // Fetch project data from API
    async fetchProjectData() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        
        if (!user.navigationData || !user.navigationData.projectID) {
          console.error('No project ID found in navigation data');
          toast.error(this.$t("Project ID not found, returning to projects list"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
          this.$router.push({ name: 'studentProjects' });
          return;
        }
        
        const projectId = user.navigationData.projectID;
        
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/student/projects`;
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data && response.data.projects) {
          // Find the specific project by ID
          const project = response.data.projects.find(p => p._id === projectId);
          
          if (!project) {
            console.error('Project not found in response data');
            toast.error(this.$t("Project not found, returning to projects list"), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
            this.$router.push({ name: 'studentProjects' });
            return;
          }
          
          
          // Set project data with field mapping
          this.projectData = {
            _id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            projectStatus: project.projectStatus,
            experienceInstanceId: project.experience ? project.experience.id : null,
            consentToFeature: project.consentToFeature || false
          };
          
          this.selectedTags = project.tags || [];
        } else {
          console.error('No projects found in response');
          toast.error(this.$t("Error loading projects data"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error(this.$t("Error loading project data. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.loading = false;
      }
    },
    
    // Fetch available experience instances for the student
    async fetchStudentExperienceInstances() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/registered-experiences`;
      
      this.isLoadingExperiences = true;
      
      try {
        const resp = await axios.get(apiURL, { headers: { token } });
        
        // Map the response data to dropdown format
        this.experienceInstances = resp.data.map(registration => ({
          experienceInstanceId: registration.experienceInstance.id,
          experienceInstanceName: `${registration.experienceInstance.name} (${registration.session.name})`
        }));
        
        this.experienceInstancesLoaded = true;
      } catch (error) {
        console.error("Error fetching registered experiences:", error);
        toast.error(this.$t("Error loading your experiences. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.isLoadingExperiences = false;
      }
    },
    
    // Open update confirmation dialog with validation
    async openSubmitDialog() {
      this.formSubmitted = true;
      
      // Validate form fields
      const nameValid = this.projectData.name && 
                       this.projectData.name.trim() !== '' && 
                       this.projectData.name.length >= 3 && 
                       this.projectData.name.length <= 100;
                       
      const descriptionValid = this.projectData.description && 
                              this.projectData.description.trim() !== '' && 
                              this.projectData.description.length >= 10 && 
                              this.projectData.description.length <= 5000;
      
      if (nameValid && descriptionValid) {
        this.submitDialog = true;
      } else {
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      }
    },

    // Open cancel proposal confirmation dialog
    openCancelDialog() {
      this.cancelDialog = true;
    },
    
    // Confirm and proceed with update
    confirmUpdate() {
      this.submitDialog = false;
      this.updateProject();
    },

    // Confirm and proceed with cancellation
    confirmCancel() {
      this.cancelDialog = false;
      this.cancelProject();
    },
    
    // Update project proposal via API
    async updateProject() {
      this.updateLoading = true;
      
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/update`;
        
        const projectPayload = {
          projectId: this.projectData._id,
          name: this.projectData.name,
          description: this.projectData.description,
          tags: this.selectedTags,
          consentToFeature: this.projectData.consentToFeature,
          notes: 'Updated via web interface'
        };
        
        await axios.put(apiURL, projectPayload, { headers: { token } });

        user.navigationData = {
          toastType: 'info',
          toastMessage: 'Project proposal updated successfully!',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        
        this.$router.push({ name: 'studentProjects' });
      } catch (error) {
        console.error("Error updating project:", error);
        
        // Handle server validation errors
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          if (serverErrors.length > 0) {
            toast.error(serverErrors[0], {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
            return;
          }
        }
        
        toast.error(this.$t("Error updating your project proposal. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.updateLoading = false;
      }
    },

    // Cancel project proposal via API
    async cancelProject() {
      this.cancelLoading = true;
      
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/cancel`;
        
        const projectPayload = {
          projectId: this.projectData._id
        };
        
        await axios.post(apiURL, projectPayload, { headers: { token } });

        user.navigationData = {
          toastType: 'success',
          toastMessage: 'Project proposal cancelled successfully',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--create'
        };
        
        this.$router.push({ name: 'studentProjects' });
      } catch (error) {
        console.error("Error cancelling project:", error);
        
        // Handle server error messages
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error, {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
          return;
        }
        
        toast.error(this.$t("Error cancelling your project proposal. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.cancelLoading = false;
      }
    },
    
    // Get color for project status badge
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'success';
        case 'In Progress': return '#c8102e';
        case 'Proposed': return 'warning';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },

    // Get icon for project status
    getStatusIcon(status) {
      switch (status) {
        case 'Active': return 'mdi-check-circle';
        case 'In Progress': return 'mdi-progress-clock';
        case 'Proposed': return 'mdi-clock-outline';
        case 'Archived': return 'mdi-archive';
        default: return 'mdi-help-circle';
      }
    },

    // Get description for project status
    getStatusDescription(status) {
      switch (status) {
        case 'Active': 
          return this.$t('Your project has been approved and is currently active.');
        case 'In Progress': 
          return this.$t('Your project is currently being worked on.');
        case 'Proposed': 
          return this.$t('Your proposal is awaiting review by an instructor. You can make edits until it is approved.');
        case 'Archived': 
          return this.$t('This project has been archived.');
        default: 
          return this.$t('Status unknown.');
      }
    }
  }
};
</script>

<style scoped>
/* Page Background */
.proposal-page {
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

/* Status Banner */
.status-banner {
  background-color: #fff3cd;
  border-bottom: 1px solid #ffc107;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #856404;
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

/* Consent Option */
.consent-option {
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.consent-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
}

/* Experience Notice */
.experience-notice {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background-color: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
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
  min-width: 140px;
}

.submit-btn {
  background-color: #c8102e !important;
  color: white !important;
}

.submit-btn:hover {
  background-color: #a00d24 !important;
}

/* Sidebar */
.sidebar-sticky {
  position: sticky;
  top: 24px;
}

.status-card,
.warning-card {
  border-radius: 12px;
  border-color: #e0e0e0;
}

.tips-header,
.warning-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.warning-card {
  border-color: #ffcc80;
  background-color: #fff8e1;
}

.warning-header {
  border-bottom-color: #ffe0b2;
}

/* Dialogs */
.confirm-dialog {
  border-radius: 12px;
}

.cancel-dialog-header {
  background-color: #ffebee;
}

.mobile-info-dialog {
  border-radius: 12px;
  position: relative;
}

.mobile-info-close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.mobile-info-section {
  padding: 0;
}

.info-dialog-card {
  border-radius: 12px;
  overflow: hidden;
}

.dialog-title-bar {
  background-color: rgba(200, 16, 46, 0.04);
  border-bottom: 1px solid rgba(200, 16, 46, 0.12);
}

.consent-notice {
  background-color: rgba(200, 16, 46, 0.06);
  border-left: 4px solid #c8102e;
  border-radius: 0 8px 8px 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-list-item {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}

.info-list-item span {
  flex: 1;
  word-wrap: break-word;
}

.got-it-btn {
  background-color: #c8102e !important;
  color: white !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.25px;
}

.got-it-btn:hover {
  background-color: #a00d24 !important;
}

/* Responsive */
@media (max-width: 1280px) {
  .sidebar-sticky {
    position: static;
  }
}

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