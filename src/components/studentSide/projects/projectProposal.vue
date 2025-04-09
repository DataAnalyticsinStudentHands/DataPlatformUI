<template>
    <main>
      <v-form
        ref="form"
        @submit.prevent="openSubmitDialog"
      >
        <v-container>
          <!-- Page title -->
          <v-row>
            <v-col>
              <p class="font-weight-black text-h6">{{ $t('Project Proposal') }}</p>
            </v-col>
          </v-row>
  
          <!-- Project Name -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field 
                v-model="projectData.name" 
                :label="$t('Project Name')"
                :error="isNameInvalid"
                :error-messages="nameErrorMessages"
                :rules="nameRules"
                :counter="100"
                required
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
  
          <!-- Project Description -->
          <v-row>
            <v-col cols="12" md="10">
              <p class="font-weight-black text-h8">{{ $t('Project Description') }}</p>
              <v-textarea 
                v-model="projectData.description" 
                :label="$t('Describe your project idea')"
                :error="isDescriptionInvalid"
                :error-messages="descriptionErrorMessages"
                :rules="descriptionRules"
                :counter="5000"
                auto-grow
                rows="5"
                outlined
              ></v-textarea>
            </v-col>
          </v-row>
  
          <!-- Experience Instance Selection -->
          <v-row>
            <v-col cols="12" md="6">
              <p 
                :class="{'error-text': isExperienceInvalid}"
                class="font-weight-black text-h8"
              >{{ $t('Select the Experience this project is associated with') }}</p>
              <v-select
                v-model="projectData.experienceInstanceId"
                :items="experienceInstances"
                item-title="experienceInstanceName"
                item-value="experienceInstanceId"
                :label="$t('Experience')"
                :error="isExperienceInvalid"
                :error-messages="experienceErrorMessages"
                :loading="isLoadingExperiences"
                required
                outlined
              ></v-select>
            </v-col>
          </v-row>
  
          <!-- Project Tags - Chips with transparent red selection color -->
          <v-row>
            <v-col cols="12">
              <p class="font-weight-black text-h8">{{ $t('Project Tags (Select all that apply)') }}</p>
              
              <v-chip-group
                v-model="selectedTags"
                column
                multiple
                selected-class="red-chip"
              >
                <v-chip
                  v-for="(tag, index) in availableTags"
                  :key="index"
                  :value="tag"
                  filter
                  variant="outlined"
                  class="ma-1"
                  color="red"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
  
          <!-- Buttons -->
          <v-row class="mt-6">
            <v-col>
              <!-- Cancel button -->
              <v-btn 
                @click="$router.back()"
                class="mr-4"
              >
                {{ $t('Cancel') }}
              </v-btn>
              
              <!-- Submit button -->
              <v-btn 
                type="submit"
              >
                {{ $t('Submit Proposal') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
  
      <!-- Submit Confirmation Dialog -->
      <v-dialog v-model="submitDialog" persistent max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('Submit Project Proposal?') }}
          </v-card-title>
          <v-card-text>
            {{ $t('Are you sure you want to submit your project proposal?') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="submitDialog = false">{{ $t('Cancel') }}</v-btn>
            <v-btn text @click="confirmSubmit">{{ $t('Submit') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        formSubmitted: false,
        submitDialog: false,
        isLoadingExperiences: false,
        projectData: {
          name: '',
          description: '',
          experienceInstanceId: null
        },
        experienceInstances: [],
        experienceInstancesLoaded: false,
        // Rules for validation
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
        availableTags: [
          "community",
          "coding",
          "outreach",
          "education",
          "innovation",
          "campus",
          "technology",
          "empowerment",
          "collaboration",
          "digital",
          "learning",
          "network",
          "nonprofit",
          "humanity",
          "social impact"
        ],
        selectedTags: []
      };
    },
    computed: {
      isNameInvalid() {
        if (!this.formSubmitted) return false;
        return !this.projectData.name || 
               this.projectData.name.trim() === '' ||
               this.projectData.name.length < 3 ||
               this.projectData.name.length > 100;
      },
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
      isDescriptionInvalid() {
        if (!this.formSubmitted) return false;
        return !this.projectData.description || 
               this.projectData.description.trim() === '' || 
               this.projectData.description.length < 10 ||
               this.projectData.description.length > 5000;
      },
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
      isExperienceInvalid() {
        if (!this.formSubmitted) return false;
        return !this.projectData.experienceInstanceId;
      },
      experienceErrorMessages() {
        return this.isExperienceInvalid ? [this.$t('Please select an experience')] : [];
      },
      hasValidationErrors() {
        if (!this.formSubmitted) return false;
        return this.isNameInvalid || this.isDescriptionInvalid || this.isExperienceInvalid;
      }
    },
    mounted() {
      // Fetch the student's experience instances when component is mounted
      this.fetchStudentExperienceInstances();
    },
    methods: {
      fetchStudentExperienceInstances() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/registered-experiences`;
        
        this.isLoadingExperiences = true;
        
        axios.get(apiURL, { headers: { token } })
          .then((resp) => {
            // Map the returned data to the format we need for the dropdown
            this.experienceInstances = resp.data.map(registration => ({
              experienceInstanceId: registration.experienceInstance.id,
              experienceInstanceName: `${registration.experienceInstance.name} (${registration.session.name})`
            }));
            
            this.experienceInstancesLoaded = true;
            
            // If there's only one experience instance, preselect it
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
      async openSubmitDialog() {
        this.formSubmitted = true;
        
        // Check for validation errors with the enhanced validation
        const nameValid = this.projectData.name && 
                         this.projectData.name.trim() !== '' && 
                         this.projectData.name.length >= 3 && 
                         this.projectData.name.length <= 100;
                         
        const descriptionValid = this.projectData.description && 
                                this.projectData.description.trim() !== '' && 
                                this.projectData.description.length >= 10 && 
                                this.projectData.description.length <= 5000;
                                
        const experienceValid = !!this.projectData.experienceInstanceId;
        
        // Only proceed if all validations pass
        if (nameValid && descriptionValid && experienceValid) {
          // If validation passes, show the confirmation dialog
          this.submitDialog = true;
        } else {
          // If validation fails, show error toast
          toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        }
      },
      confirmSubmit() {
        // Close the dialog
        this.submitDialog = false;
        
        // Submit the project proposal
        this.submitProjectProposal();
      },
      async submitProjectProposal() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/proposal`;
        
        const projectPayload = {
          name: this.projectData.name,
          description: this.projectData.description,
          experienceInstanceId: this.projectData.experienceInstanceId,
          tags: this.selectedTags
        };
        
        try {
          await axios.post(apiURL, projectPayload, { headers: { token } });

          user.navigationData = {
            toastType: 'success',
            toastMessage: 'Project proposal submitted successfully!',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
          };
          
          // Redirect to projects list after successful submission
          this.$router.push({ name: 'studentProjects' });
        } catch (error) {
          console.error("Error submitting project proposal:", error);
          
          // Check for validation errors from the backend
          if (error.response && error.response.data && error.response.data.errors) {
            // Show first validation error from the server
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
          
          // Generic error message if no specific error was provided
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
  .error-text {
    color: #B00020;
  }
  
  /* Custom styling for selected chips with transparency */
  :deep(.red-chip) {
    background-color: rgba(200, 16, 46, 0.80) !important; /* UH red with 80% opacity */
    color: white !important;
    border-color: #c8102e !important;
  }
  </style>