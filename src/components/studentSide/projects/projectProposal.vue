<!-- 
projectProposal.vue
Student-side interface for creating new project proposals. Allows students to submit 
project ideas by providing basic information, selecting an associated experience, 
and categorizing the project with tags.
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-lightbulb-outline</v-icon>
          <div>
            <div class="d-flex align-center">
              <h1 class="text-h5 font-weight-bold">{{ $t('Project Proposal') }}</h1>
              <v-btn
                icon
                variant="text"
                size="small"
                class="ml-2 d-lg-none"
                @click.stop="openMobileInfoDialog"
              >
                <v-icon color="#c8102e" size="22">mdi-help-circle</v-icon>
              </v-btn>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Submit your project idea for review') }}</p>
          </div>
        </div>
      </div>

      <v-form ref="form" @submit.prevent="openSubmitDialog">
        <v-row>
          <!-- Main Form Column -->
          <v-col cols="12" lg="8">
            <v-card class="form-card" elevation="2">
              <!-- Section 1: Basic Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Basic Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Give your project a name and describe your idea') }}</p>
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
                    <p class="section-subtitle">{{ $t('Link this project to one of your enrolled experiences') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-select
                    v-model="projectData.experienceInstanceId"
                    :items="experienceInstances"
                    item-title="experienceInstanceName"
                    item-value="experienceInstanceId"
                    :label="$t('Select Experience')"
                    :placeholder="$t('Choose an experience...')"
                    :error="isExperienceInvalid"
                    :error-messages="experienceErrorMessages"
                    :loading="isLoadingExperiences"
                    variant="outlined"
                    required
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="#c8102e" size="20">mdi-school-outline</v-icon>
                    </template>
                  </v-select>

                  <v-alert 
                    v-if="experienceInstancesLoaded && experienceInstances.length === 0"
                    type="warning" 
                    variant="tonal" 
                    class="mt-3"
                  >
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
                      <span>{{ $t('You are not currently enrolled in any experiences. Please register for an experience first.') }}</span>
                    </div>
                  </v-alert>
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
                  {{ $t('Cancel') }}
                </v-btn>
                
                <v-btn 
                  type="submit"
                  size="large"
                  class="action-btn submit-btn"
                  :disabled="isLoadingExperiences"
                >
                  <v-icon start>mdi-send</v-icon>
                  {{ $t('Submit Proposal') }}
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- Sidebar Tips Column (Hidden on mobile) -->
          <v-col cols="12" lg="4" class="d-none d-lg-block">
            <div class="sidebar-sticky">
              <!-- Tips Card -->
              <v-card class="tips-card mb-4" variant="outlined">
                <v-card-title class="tips-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-lightbulb-on-outline</v-icon>
                  {{ $t('Tips for a Strong Proposal') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <div class="tip-item">
                    <v-icon size="18" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                    <span>{{ $t('Be specific about your goals and what you hope to achieve') }}</span>
                  </div>
                  <div class="tip-item">
                    <v-icon size="18" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                    <span>{{ $t('Explain the problem you are trying to solve') }}</span>
                  </div>
                  <div class="tip-item">
                    <v-icon size="18" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                    <span>{{ $t('Describe your approach or methodology') }}</span>
                  </div>
                  <div class="tip-item">
                    <v-icon size="18" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                    <span>{{ $t('Mention any data sources or tools you plan to use') }}</span>
                  </div>
                  <div class="tip-item">
                    <v-icon size="18" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                    <span>{{ $t('Outline expected outcomes or deliverables') }}</span>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Process Card -->
              <v-card class="process-card" variant="outlined">
                <v-card-title class="tips-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-clipboard-flow-outline</v-icon>
                  {{ $t('What Happens Next?') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <div class="process-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <div class="step-title">{{ $t('Submit') }}</div>
                      <div class="step-desc">{{ $t('Your proposal is sent for review') }}</div>
                    </div>
                  </div>
                  <div class="process-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <div class="step-title">{{ $t('Review') }}</div>
                      <div class="step-desc">{{ $t('Instructors evaluate your idea') }}</div>
                    </div>
                  </div>
                  <div class="process-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <div class="step-title">{{ $t('Approval') }}</div>
                      <div class="step-desc">{{ $t('Receive approval or suggestions') }}</div>
                    </div>
                  </div>
                  <div class="process-step last">
                    <div class="step-number">4</div>
                    <div class="step-content">
                      <div class="step-title">{{ $t('Begin') }}</div>
                      <div class="step-desc">{{ $t('Start working on your project!') }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-form>

      <!-- Mobile Info Dialog (Tips & Process) -->
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
            <!-- Tips Section -->
            <div class="mobile-info-section mb-5">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="#c8102e" size="20" class="mr-2">mdi-lightbulb-on-outline</v-icon>
                {{ $t('Tips for a Strong Proposal') }}
              </h3>
              <div class="mobile-tip-item">
                <v-icon size="16" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                <span>{{ $t('Be specific about your goals and what you hope to achieve') }}</span>
              </div>
              <div class="mobile-tip-item">
                <v-icon size="16" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                <span>{{ $t('Explain the problem you are trying to solve') }}</span>
              </div>
              <div class="mobile-tip-item">
                <v-icon size="16" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                <span>{{ $t('Describe your approach or methodology') }}</span>
              </div>
              <div class="mobile-tip-item">
                <v-icon size="16" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                <span>{{ $t('Mention any data sources or tools you plan to use') }}</span>
              </div>
              <div class="mobile-tip-item">
                <v-icon size="16" color="#c8102e" class="mr-2">mdi-check-circle</v-icon>
                <span>{{ $t('Outline expected outcomes or deliverables') }}</span>
              </div>
            </div>

            <v-divider class="mb-5"></v-divider>

            <!-- Process Section -->
            <div class="mobile-info-section">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="#c8102e" size="20" class="mr-2">mdi-clipboard-flow-outline</v-icon>
                {{ $t('What Happens Next?') }}
              </h3>
              <div class="mobile-process-step">
                <div class="mobile-step-number">1</div>
                <div class="mobile-step-content">
                  <div class="mobile-step-title">{{ $t('Submit') }}</div>
                  <div class="mobile-step-desc">{{ $t('Your proposal is sent for review') }}</div>
                </div>
              </div>
              <div class="mobile-process-step">
                <div class="mobile-step-number">2</div>
                <div class="mobile-step-content">
                  <div class="mobile-step-title">{{ $t('Review') }}</div>
                  <div class="mobile-step-desc">{{ $t('Instructors evaluate your idea') }}</div>
                </div>
              </div>
              <div class="mobile-process-step">
                <div class="mobile-step-number">3</div>
                <div class="mobile-step-content">
                  <div class="mobile-step-title">{{ $t('Approval') }}</div>
                  <div class="mobile-step-desc">{{ $t('Receive approval or suggestions') }}</div>
                </div>
              </div>
              <div class="mobile-process-step last">
                <div class="mobile-step-number">4</div>
                <div class="mobile-step-content">
                  <div class="mobile-step-title">{{ $t('Begin') }}</div>
                  <div class="mobile-step-desc">{{ $t('Start working on your project!') }}</div>
                </div>
              </div>
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

      <!-- Submit confirmation dialog -->
      <v-dialog v-model="submitDialog" persistent max-width="450px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5">
            <v-icon color="#c8102e" size="28" class="mr-3">mdi-file-document-check-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Submit Project Proposal?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <p class="text-body-1 mb-0">
              {{ $t('Your proposal will be submitted for review. You will be notified once a decision has been made.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="submitDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn class="submit-btn" @click="confirmSubmit">
              <v-icon start size="18">mdi-check</v-icon>
              {{ $t('Submit') }}
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
  name: "ProjectProposal",
  data() {
    return {
      // Form and dialog states
      formSubmitted: false,
      submitDialog: false,
      featureInfoDialog: false,
      mobileInfoDialog: false,  // Added missing data property
      isLoadingExperiences: false,
      
      // Project proposal data
      projectData: {
        name: '',
        description: '',
        experienceInstanceId: null,
        tags: [],
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
  mounted() {
    this.fetchStudentExperienceInstances();
  },
  
  methods: {
    // Open mobile info dialog
    openMobileInfoDialog() {
      this.mobileInfoDialog = true;
    },

    // Fetch available experience instances for the student
    fetchStudentExperienceInstances() {
      let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/registered-experiences`;

      this.isLoadingExperiences = true;

      axios.get(apiURL)
        .then((resp) => {
          // Map response data to dropdown format
          this.experienceInstances = resp.data.map(registration => ({
            experienceInstanceId: registration.experienceInstance.id,
            experienceInstanceName: `${registration.experienceInstance.name} (${registration.session.name})`
          }));
          
          this.experienceInstancesLoaded = true;
          
          // Auto-select if only one experience available
          if (this.experienceInstances.length === 1) {
            this.projectData.experienceInstanceId = this.experienceInstances[0].experienceInstanceId;
          }
        })
        .catch((error) => {
          console.error("Error fetching registered experiences:", error);
          toast.error(this.$t("Error loading your experiences. Please try again later."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
          this.experienceInstancesLoaded = true;
        })
        .finally(() => {
          this.isLoadingExperiences = false;
        });
    },
    
    // Open submit confirmation dialog with validation
    async openSubmitDialog() {
      this.formSubmitted = true;
      
      // Validate all required fields
      const nameValid = this.projectData.name && 
                       this.projectData.name.trim() !== '' && 
                       this.projectData.name.length >= 3 && 
                       this.projectData.name.length <= 100;
                       
      const descriptionValid = this.projectData.description && 
                              this.projectData.description.trim() !== '' && 
                              this.projectData.description.length >= 10 && 
                              this.projectData.description.length <= 5000;
                              
      const experienceValid = !!this.projectData.experienceInstanceId;
      
      if (nameValid && descriptionValid && experienceValid) {
        this.submitDialog = true;
      } else {
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      }
    },
    
    // Confirm and proceed with submission
    confirmSubmit() {
      this.submitDialog = false;
      this.submitProjectProposal();
    },
    
    // Submit project proposal to API
    async submitProjectProposal() {
      const user = useLoggedInUserStore();
      let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/proposal`;

      const projectPayload = {
        name: this.projectData.name,
        description: this.projectData.description,
        experienceInstanceId: this.projectData.experienceInstanceId,
        tags: this.selectedTags,
        consentToFeature: this.projectData.consentToFeature
      };

      try {
        await axios.post(apiURL, projectPayload);

        user.navigationData = {
          toastType: 'success',
          toastMessage: 'Project proposal submitted successfully!',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--create'
        };
        
        this.$router.push({ name: 'studentProjects' });
      } catch (error) {
        console.error("Error submitting project proposal:", error);

        // Handle duplicate project error
        if (error.response?.status === 409) {
          toast.error(this.$t('A project for this experience already exists.'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
          return;
        }
        
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
        
        toast.error(this.$t("Error submitting your project proposal. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
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

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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

.tips-card,
.process-card {
  border-radius: 12px;
  border-color: #e0e0e0;
}

.tips-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  font-size: 0.875rem;
  color: #444;
  line-height: 1.5;
}

.tip-item:not(:last-child) {
  border-bottom: 1px solid #f5f5f5;
}

/* Process Steps */
.process-step {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  position: relative;
}

.process-step:not(.last)::after {
  content: '';
  position: absolute;
  left: 14px;
  top: 40px;
  bottom: -12px;
  width: 2px;
  background-color: #e0e0e0;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(200, 16, 46, 0.1);
  color: #c8102e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  margin-right: 12px;
  flex-shrink: 0;
}

.step-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1a1a1a;
}

.step-desc {
  font-size: 0.8rem;
  color: #666;
}

/* Dialogs */
.confirm-dialog {
  border-radius: 12px;
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

.mobile-tip-item {
  display: flex;
  align-items: flex-start;
  padding: 8px 0;
  font-size: 0.875rem;
  color: #444;
  line-height: 1.5;
}

.mobile-tip-item:not(:last-child) {
  border-bottom: 1px solid #f5f5f5;
}

.mobile-process-step {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  position: relative;
}

.mobile-process-step:not(.last)::after {
  content: '';
  position: absolute;
  left: 11px;
  top: 36px;
  bottom: -10px;
  width: 2px;
  background-color: #e0e0e0;
}

.mobile-step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(200, 16, 46, 0.1);
  color: #c8102e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 11px;
  margin-right: 12px;
  flex-shrink: 0;
}

.mobile-step-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1a1a1a;
}

.mobile-step-desc {
  font-size: 0.8rem;
  color: #666;
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
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>