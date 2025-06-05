<!-- 
editProjectProposal.vue
Student-side interface for editing project proposals in the "Proposed" status. 
Allows students to update project details, modify tags, and cancel proposals 
before they are approved by instructors.
-->

<template>
  <main>
    <v-form ref="form" @submit.prevent="openSubmitDialog">
      <v-container>
        <!-- Page title -->
        <v-row>
          <v-col>
            <p class="font-weight-black text-h6">{{ $t('Edit Project Proposal') }}</p>
          </v-col>
        </v-row>

        <!-- Loading state -->
        <v-row v-if="loading">
          <v-col class="text-center">
            <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
          </v-col>
        </v-row>

        <template v-else>
          <!-- Project name input -->
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
  
          <!-- Project description input -->
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
  
          <!-- Experience instance selection (disabled for proposals) -->
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
  
          <!-- Project tags selection -->
          <!-- <v-row>
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
          </v-row> -->
  
          <!-- Project status display (if not Proposed) -->
          <v-row v-if="projectData.projectStatus !== 'Proposed'">
            <v-col cols="12" md="6">
              <p class="font-weight-black text-h8">{{ $t('Project Status') }}</p>
              <v-chip
                :color="getStatusColor(projectData.projectStatus)"
                :text-color="getStatusTextColor(projectData.projectStatus)"
                class="mr-2 px-4 py-2"
                size="large"
              >
                {{ projectData.projectStatus }}
              </v-chip>
            </v-col>
          </v-row>
  
          <!-- Action buttons -->
          <v-row class="mt-6">
            <v-col class="d-flex align-center">
              <!-- Navigation button -->
              <v-btn 
                @click="$router.back()"
                class="mr-4"
              >
                {{ $t('Back') }}
              </v-btn>

              <!-- Update proposal button -->
              <v-btn 
                type="submit"
                class="update-btn"
                :loading="updateLoading"
                :disabled="cancelLoading"
              >
                {{ $t('Update Proposal') }}
              </v-btn>

              <v-spacer></v-spacer>

              <!-- Cancel proposal button -->
              <v-btn 
                @click="openCancelDialog"
                class="cancel-btn"
                :disabled="updateLoading || cancelLoading"
              >
                {{ $t('Cancel Proposal') }}
              </v-btn>
            </v-col>
          </v-row>

        </template>
      </v-container>
    </v-form>

    <!-- Update proposal confirmation dialog -->
    <v-dialog v-model="submitDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ $t('Update Proposal?') }}
        </v-card-title>
        <v-card-text>
          {{ $t('Are you sure you want to update this project proposal?') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="submitDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-btn color="primary" text @click="confirmUpdate">{{ $t('Update') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cancel proposal confirmation dialog -->
    <v-dialog v-model="cancelDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline text-error">
          {{ $t('Cancel Project Proposal?') }}
        </v-card-title>
        <v-card-text>
          {{ $t('Are you sure you want to cancel this project proposal? This action cannot be undone.') }}
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
      // Loading and form states
      loading: true,
      formSubmitted: false,
      
      // Dialog visibility states
      submitDialog: false,
      cancelDialog: false,
      
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
        projectStatus: 'Proposed'
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
    console.log('EditProjectProposal mounted');
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
        console.log('Fetching project data for ID:', projectId);
        
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
          
          console.log('Found project:', project);
          
          // Set project data with field mapping
          this.projectData = {
            _id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            projectStatus: project.projectStatus,
            experienceInstanceId: project.experience ? project.experience.id : null
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
        
        console.log('Cancelling project with payload:', projectPayload);
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
        case 'Active': return 'green';
        case 'In Progress': return 'blue';
        case 'Proposed': return 'orange';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },
    
    // Get text color for project status badge
    getStatusTextColor(status) {
      return 'white';
    }
  }
};
</script>

<style scoped>
.error-text {
  color: #B00020;
}

:deep(.red-chip) {
  background-color: rgba(200, 16, 46, 0.80) !important;
  color: white !important;
  border-color: #c8102e !important;
}

.cancel-proposal-btn {
  color: #B00020 !important;
}
</style>