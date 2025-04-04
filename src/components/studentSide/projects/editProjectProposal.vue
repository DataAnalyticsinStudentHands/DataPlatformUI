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
              <p class="font-weight-black text-h6">{{ $t('Edit Project Proposal') }}</p>
            </v-col>
          </v-row>
  
          <!-- Loading Indicator -->
          <v-row v-if="loading">
            <v-col class="text-center">
              <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
            </v-col>
          </v-row>
  
          <template v-else>
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
                >{{ $t('Associated Experience') }}</p>
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
                  :disabled="true"
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
    
            <!-- Project Status (if not Proposed) -->
            <v-row v-if="projectData.status !== 'Proposed'">
              <v-col cols="12" md="6">
                <p class="font-weight-black text-h8">{{ $t('Project Status') }}</p>
                <v-chip
                  :color="getStatusColor(projectData.status)"
                  :text-color="getStatusTextColor(projectData.status)"
                  class="mr-2 px-4 py-2"
                  size="large"
                >
                  {{ projectData.status }}
                </v-chip>
              </v-col>
            </v-row>
    
            <!-- Buttons -->
            <v-row class="mt-6">
              <v-col>
                <!-- Cancel navigation button -->
                <v-btn 
                  @click="$router.back()"
                  class="mr-4"
                >
                  {{ $t('Back') }}
                </v-btn>
  
                <!-- Cancel Proposal button -->
                <v-btn 
                  @click="openCancelDialog"
                  color="error"
                  class="mr-4 cancel-btn"
                  :disabled="updateLoading || cancelLoading"
                >
                  {{ $t('Cancel Proposal') }}
                </v-btn>
                
                <!-- Update proposal button -->
                <v-btn 
                  type="submit"
                  color="primary"
                  class="update-btn"
                  :loading="updateLoading"
                  :disabled="cancelLoading"
                >
                  {{ $t('Update Proposal') }}
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-container>
      </v-form>
  
      <!-- Submit Confirmation Dialog -->
      <v-dialog v-model="submitDialog" persistent max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('Update Proposal?') }}
          </v-card-title>
          <v-card-text>
            {{ $t('Are you sure you want to update this project proposal?') }}
            <br><br>
            <strong>{{ $t('Project Name') }}:</strong> {{ projectData.name }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="submitDialog = false">{{ $t('Cancel') }}</v-btn>
            <v-btn color="primary" text @click="confirmUpdate">{{ $t('Update') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Cancel Proposal Confirmation Dialog -->
      <v-dialog v-model="cancelDialog" persistent max-width="500px">
        <v-card>
          <v-card-title class="headline text-error">
            {{ $t('Cancel Project Proposal?') }}
          </v-card-title>
          <v-card-text>
            {{ $t('Are you sure you want to cancel this project proposal? This action cannot be undone.') }}
            <br><br>
            <strong>{{ $t('Project Name') }}:</strong> {{ projectData.name }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelDialog = false">{{ $t('No, Keep Proposal') }}</v-btn>
            <v-btn color="error" text @click="confirmCancel">{{ $t('Yes, Cancel Proposal') }}</v-btn>
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
    name: "EditProjectProposal",
    data() {
      return {
        loading: true,
        formSubmitted: false,
        submitDialog: false,
        cancelDialog: false,
        updateLoading: false,
        cancelLoading: false,
        isLoadingExperiences: false,
        projectData: {
          _id: null,
          name: '',
          description: '',
          experienceInstanceId: null,
          status: 'Proposed'
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
    async mounted() {
      console.log('EditProjectProposal mounted');
      // In case navigation data is lost, retrieve from query param if available
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
      
      console.log('Found project ID in navigation data:', user.navigationData.projectID);
      
      // Continue with normal flow
      await this.fetchProjectData();
      await this.fetchStudentExperienceInstances();
    },
    methods: {
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
          console.log('Fetching project data for ID:', projectId);
          
          let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/student/projects`;
          
          // First get all projects to find the specific one
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
            
            console.log('Found project:', project);
            
            // Set project data
            this.projectData = {
              _id: project._id,
              name: project.projectName,
              description: project.projectDescription,
              status: project.status,
              experienceInstanceId: project.experiences && project.experiences.length > 0 
                ? project.experiences[0].id 
                : null
            };
            
            // Set selected tags
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
      
      async fetchStudentExperienceInstances() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/registered-experiences`;
        
        this.isLoadingExperiences = true;
        
        try {
          const resp = await axios.get(apiURL, { headers: { token } });
          
          // Map the returned data to the format we need for the dropdown
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
                                
        // Only proceed if all validations pass
        if (nameValid && descriptionValid) {
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
  
      openCancelDialog() {
        this.cancelDialog = true;
      },
      
      confirmUpdate() {
        // Close the dialog
        this.submitDialog = false;
        
        // Update the project
        this.updateProject();
      },
  
      confirmCancel() {
        // Close the dialog
        this.cancelDialog = false;
        
        // Cancel the project
        this.cancelProject();
      },
      
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
            notes: 'Updated via web interface'
          };
          
          console.log('Updating project with payload:', projectPayload);
          
          await axios.put(apiURL, projectPayload, { headers: { token } });
  
          user.navigationData = {
            toastType: 'info',
            toastMessage: 'Project proposal updated successfully!',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--update'
          };
          
          // Redirect to projects list
          this.$router.push({ name: 'studentProjects' });
        } catch (error) {
          console.error("Error updating project:", error);
          
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
          toast.error(this.$t("Error updating your project proposal. Please try again later."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        } finally {
          this.updateLoading = false;
        }
      },
  
      async cancelProject() {
        this.cancelLoading = true;
        
        try {
          const user = useLoggedInUserStore();
          let token = user.token;
          // Real endpoint connected to backend
          let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/cancel`;
          
          const projectPayload = {
            projectId: this.projectData._id
          };
          
          console.log('Cancelling project with payload:', projectPayload);
          
          // Real API call
          await axios.post(apiURL, projectPayload, { headers: { token } });
  
          user.navigationData = {
            toastType: 'success',
            toastMessage: 'Project proposal cancelled successfully',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
          };
          
          // Redirect to projects list
          this.$router.push({ name: 'studentProjects' });
        } catch (error) {
          console.error("Error cancelling project:", error);
          
          // Check for validation errors from the backend
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
      
      getStatusColor(status) {
        switch (status) {
          case 'Active':
            return 'green';
          case 'In Progress':
            return 'blue';
          case 'Proposed':
          case 'Pending':
          case 'Under Review':
            return 'orange';
          default:
            return 'grey';
        }
      },
      
      getStatusTextColor(status) {
        // For better contrast
        switch (status) {
          case 'Active':
          case 'In Progress':
          case 'Proposed':
          case 'Pending':
          case 'Under Review':
            return 'white';
          default:
            return 'black';
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
  
  /* Position the cancel proposal button */
  .cancel-proposal-btn {
    color: #B00020 !important;
  }
  </style>