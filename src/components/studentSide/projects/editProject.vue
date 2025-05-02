<template>
  <main>
    <v-form ref="form" @submit.prevent="openSubmitDialog">
      <v-container>
        <!-- Updated Page title with Project Name and Status Badge -->
        <v-row>
          <v-col>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <p class="font-weight-black text-h6 mb-0 mr-3">{{ $t('Edit Project') }}</p>
                <p class="text-h6 text-grey-darken-1 mb-0">{{ projectData.name || $t('Untitled Project') }}</p>
              </div>
              <div v-if="projectData.projectStatus !== 'Proposed'" class="status-badge d-inline-flex align-center px-3 py-1">
                <v-icon size="small" :color="getStatusColor(projectData.projectStatus)" class="mr-1">mdi-circle</v-icon>
                <span :class="`text-${getStatusColor(projectData.projectStatus)}`">{{ projectData.projectStatus }}</span>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Loading Indicator -->
        <v-row v-if="loading">
          <v-col class="text-center">
            <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
          </v-col>
        </v-row>

        <template v-else>
          <v-row>
            <!-- Main project information column - reduced width from md="8" to md="7" -->
            <v-col cols="12" md="7">
              <!-- Project details card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-information-outline" class="mr-2"></v-icon>
                  {{ $t('Project Details') }}
                </v-card-title>
                
                <v-card-text class="px-4 pt-4">
                  <!-- Project Name -->
                  <v-text-field 
                    v-model="projectData.name" 
                    :label="$t('Project Name')"
                    :error="isNameInvalid"
                    :error-messages="nameErrorMessages"
                    :rules="nameRules"
                    :counter="100"
                    :readonly="!isProjectOwner"
                    required
                    outlined
                    class="mb-4"
                  ></v-text-field>
                  
                  <!-- Project Description -->
                  <p class="font-weight-black text-h8 mb-2">{{ $t('Project Description') }}</p>
                  <v-textarea 
                    v-model="projectData.description" 
                    :label="$t('Describe your project idea')"
                    :error="isDescriptionInvalid"
                    :error-messages="descriptionErrorMessages"
                    :rules="descriptionRules"
                    :counter="5000"
                    :readonly="!isProjectOwner"
                    auto-grow
                    rows="5"
                    outlined
                  ></v-textarea>
                </v-card-text>
              </v-card>
              
              <!-- Project tags card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-tag-multiple" class="mr-2"></v-icon>
                  {{ $t('Project Tags') }}
                </v-card-title>
                
                <v-card-text class="pa-4">
                  <p class="font-weight-black text-h8 mb-3">
                    {{ $t('Project Tags (Select all that apply)') }}
                  </p>
                  
                  <v-chip-group
                    v-model="selectedTags"
                    column
                    multiple
                    selected-class="red-chip"
                    :disabled="!isProjectOwner"
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
                </v-card-text>
              </v-card>
              
              <!-- Project Members card - Using Design 1 version -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-account-group" class="mr-2"></v-icon>
                  {{ $t('Project Members') }}
                  <v-spacer></v-spacer>
                  <v-btn
                    size="small"
                    color="#c8102e"
                    variant="flat"
                    @click="openInviteDialog"
                    prepend-icon="mdi-account-plus"
                  >
                    {{ $t('Invite') }}
                  </v-btn>
                </v-card-title>
                
                <div v-if="projectMembers.length === 0" class="text-center my-6 pa-6">
                  <v-icon icon="mdi-account-group-outline" size="x-large" color="grey" class="mb-2"></v-icon>
                  <p class="text-grey">{{ $t('No members have been added to this project yet.') }}</p>
                  <v-btn
                    variant="tonal"
                    color="#c8102e"
                    class="mt-3"
                    @click="openInviteDialog"
                    prepend-icon="mdi-account-plus"
                  >
                    {{ $t('Start inviting people') }}
                  </v-btn>
                </div>
                
                <v-list v-else lines="two">
                  <v-list-item
                    v-for="member in projectMembers"
                    :key="member.id"
                    :title="member.name"
                    :subtitle="member.email"
                    rounded
                    class="mb-1"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="grey-lighten-2">
                        {{ member.name.charAt(0).toUpperCase() + (member.name.indexOf(' ') > -1 ? member.name.charAt(member.name.indexOf(' ') + 1).toUpperCase() : '') }}
                      </v-avatar>
                    </template>
                    
                    <template v-slot:append>
                      <div class="d-flex flex-column align-end">
                        <v-chip
                          size="small"
                          :color="member.isOwner ? '#c8102e' : 'success'"
                          class="mb-1"
                        >
                          {{ member.isOwner ? 'Owner' : 'Member' }}
                        </v-chip>
                        <span class="text-caption text-grey">
                          {{ $t('Joined') }} {{ new Date(member.joinDate).toLocaleDateString() }}
                        </span>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            
            <!-- Side panel with additional info - increased width from md="4" to md="5" -->
            <v-col cols="12" md="5">
              <!-- Experience & Instructor info card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-school" class="mr-2"></v-icon>
                  {{ $t('Course Information') }}
                </v-card-title>
                
                <v-card-text class="pa-4">
                  <!-- Experience - Made more visible with tooltip on entire component -->
                  <p class="font-weight-black text-h8 mb-2">
                    {{ $t('Associated Experience') }}
                  </p>
                  <v-tooltip
                    location="bottom"
                    text="The associated experience cannot be changed after project creation"
                    :offset="2"
                    open-delay="200"
                    class="tooltip-close"
                  >
                    <template v-slot:activator="{ props }">
                      <div v-bind="props">
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
                          readonly
                          class="mb-4"
                        ></v-select>
                      </div>
                    </template>
                  </v-tooltip>
                  
                  <!-- Instructor - Only show if instructorId exists -->
                  <template v-if="projectData.instructorId">
                    <p class="font-weight-black text-h8 mb-2">
                      {{ $t('Associated Instructor') }}
                    </p>
                    <v-card variant="outlined" class="pa-3 mb-3 bg-grey-lighten-5">
                      <div>
                        <div class="text-body-1 font-weight-medium">{{ projectData.instructorName || $t('Not Assigned') }}</div>
                        <div class="text-caption d-flex align-center">
                          <v-icon size="small" class="mr-1">mdi-email-outline</v-icon>
                          {{ projectData.instructorEmail || $t('No email available') }}
                        </div>
                      </div>
                    </v-card>
                  </template>
                </v-card-text>
              </v-card>
              
              <!-- Project Documents card - Moved from left column to right column -->
              <ProjectDocuments 
                :project-id="projectData._id"
                :is-project-owner="isProjectOwner"
              />
            </v-col>
          </v-row>
          
          <!-- Buttons positioning -->
          <v-row class="mt-6">
            <v-col class="d-flex align-center justify-space-between">
              <div>
                <!-- Back button -->
                <v-btn 
                  @click="$router.back()"
                  class="mr-4"
                >
                  {{ $t('Back') }}
                </v-btn>

                <!-- Update project button - only for owners -->
                <v-btn 
                  v-if="isProjectOwner"
                  type="submit"
                  color="primary"
                  class="update-btn"
                  :loading="updateLoading"
                >
                  {{ $t('Update Project') }}
                </v-btn>
              </div>
              
              <!-- Leave Project button - only for non-owners -->
              <v-btn 
                v-if="!isProjectOwner"
                color="error"
                variant="outlined"
                prepend-icon="mdi-exit-to-app"
                @click="openLeaveProjectDialog"
              >
                {{ $t('Leave Project') }}
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
          {{ $t('Update Project?') }}
        </v-card-title>
        <v-card-text>
          {{ $t('Are you sure you want to update this project?') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="submitDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-btn color="primary" text @click="confirmUpdate">{{ $t('Update') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Invite Members Dialog -->
    <invite-members-dialog
      v-if="inviteDialog && projectData._id"
      v-model="inviteDialog"
      :project-id="projectData._id"
      :project-name="projectData.name"
      :experience-instance-name="projectData.experienceInstanceName"
      @members-invited="handleMembersInvited"
    />

    <!-- Invitation Success Dialog -->
    <v-dialog v-model="inviteSuccessDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-success-lighten-5 py-4">
          <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
          {{ $t('Invitations Sent') }}
        </v-card-title>
        <v-card-text class="pt-4">
          <p>{{ $t('The selected users have been invited to join your project.') }}</p>
          <p>{{ $t('They will receive a notification and can accept or decline the invitation.') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="inviteSuccessDialog = false"
          >
            {{ $t('Close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Leave Project Confirmation Dialog -->
    <v-dialog v-model="leaveProjectDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-error-lighten-5 py-4">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          {{ $t('Leave Project?') }}
        </v-card-title>
        <v-card-text class="pt-4">
          <p>{{ $t('Are you sure you want to leave this project?') }}</p>
          <p>{{ $t('You will lose access to project resources and will need to be invited again to rejoin.') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="leaveProjectDialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="leaveProject"
            :loading="leavingProject"
          >
            {{ $t('Leave') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import InviteMembersDialog from '@/components/reusable/inviteMembersDialog.vue';
import ProjectDocuments from '@/components/reusable/projectDocuments.vue';

export default {
  name: "EditProject",
  components: {
    InviteMembersDialog,
    ProjectDocuments 
  },
  data() {
    return {
      loading: true,
      formSubmitted: false,
      submitDialog: false,
      inviteDialog: false,
      inviteSuccessDialog: false,
      leaveProjectDialog: false,
      updateLoading: false,
      invitingUsers: false,
      leavingProject: false,
      isLoadingExperiences: false,
      loadingUsers: false,
      projectData: {
        _id: null,
        name: '',
        description: '',
        experienceInstanceId: null,
        experienceInstanceName: '',
        instructorId: null,
        instructorName: '',
        instructorEmail: '',
        projectStatus: 'Proposed'  // Updated from status to projectStatus
      },
      experienceInstances: [],
      experienceInstancesLoaded: false,
      // Current project members
      projectMembers: [],
      // For inviting users
      searchQuery: '',
      roleFilter: 'All Roles',
      userHeaders: [
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Invitation', key: 'invitation' }
      ],
      availableUsers: [], // Will be populated with mock data
      filteredUsers: [],
      selectedUsers: [],
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
    // Determine if current user is the project owner
    isProjectOwner() {
      const user = useLoggedInUserStore();
      return this.projectData && 
             this.projectMembers && 
             this.projectMembers.some(member => 
               member.isOwner && member.id === user.userId
             );
    },
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
    console.log('EditProject mounted');
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
    await this.fetchProjectData(user.navigationData.projectID);
    await this.fetchStudentExperienceInstances();
  },
  methods: {
    async fetchProjectData(projectId) {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        
        if (!projectId) {
          console.error('No project ID provided');
          toast.error(this.$t("Project ID not found, returning to projects list"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
          this.$router.push({ name: 'studentProjects' });
          return;
        }
        
        console.log('Fetching project data for ID:', projectId);
        
        // Use the new endpoint that fetches a single project
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${projectId}`;
        
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data) {
          const project = response.data;
          
          console.log('Received project data:', project);
          
          // Set project data using the new structure
          this.projectData = {
            _id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            projectStatus: project.projectStatus,
            // Handle the experience object (not an array anymore)
            experienceInstanceId: project.experience ? project.experience.id : null,
            experienceInstanceName: project.experience ? project.experience.experienceName : this.$t('Not assigned'),
            // Handle instructor data
            instructorId: project.instructor ? project.instructor.id : null,
            instructorName: project.instructor ? project.instructor.name : this.$t('Not assigned'),
            instructorEmail: project.instructor ? project.instructor.email : ''
          };
          
          // Set selected tags
          this.selectedTags = project.tags || [];
          
          // Set project members
          this.projectMembers = project.members || [];
          
          // Check if the current user is the project owner
          console.log("Current user ID:", user.userId);
          console.log("Project members:", this.projectMembers);
          console.log("Is current user the owner:", this.isProjectOwner);
        } else {
          console.error('No project found in response');
          toast.error(this.$t("Error loading project data"), {
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
      // Only project owners should be able to update
      if (!this.isProjectOwner) {
        toast.error(this.$t("You don't have permission to update this project."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }
      
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
    
    confirmUpdate() {
      // Close the dialog
      this.submitDialog = false;
      
      // Update the project
      this.updateProject();
    },
    
    async updateProject() {
      // Double-check that the user is the project owner
      if (!this.isProjectOwner) {
        toast.error(this.$t("You don't have permission to update this project."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }
      
      this.updateLoading = true;
      
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        // Use the same endpoint path as specified
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
          toastMessage: 'Project updated successfully!',
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
        toast.error(this.$t("Error updating your project. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.updateLoading = false;
      }
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'In Progress': return 'blue';
        case 'Proposed': return 'orange';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },
    
    getStatusTextColor(status) {
      // All statuses use white text for better contrast
      return 'white';
    },
    
    openInviteDialog() {
      this.searchQuery = '';
      this.roleFilter = 'All Roles';
      this.selectedUsers = [];
      this.inviteDialog = true;
    },
    
    handleMembersInvited(invitedUsers) {
      // Handle the newly invited users
      console.log('Users invited:', invitedUsers);
      
      // Add the new members to the current list
      if (invitedUsers && invitedUsers.length > 0) {
        this.projectMembers = [...this.projectMembers, ...invitedUsers];
      }
      
      // Show success message
      toast.success(this.$t("Members successfully invited to the project!"), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--update',
        multiple: false
      });
    },

    openLeaveProjectDialog() {
      // Only non-owners can leave
      if (this.isProjectOwner) {
        toast.error(this.$t("Project owners cannot leave their projects. Transfer ownership first or archive the project."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }
      
      this.leaveProjectDialog = true;
    },

    async leaveProject() {
      this.leavingProject = true;
      
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        
        // Call the API endpoint to leave the project
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/leave`;
        
        const response = await axios.post(apiURL, {
          projectId: this.projectData._id
        }, { headers: { token } });
        
        // Close the dialog
        this.leaveProjectDialog = false;
        
        // Set navigation data for toast message on redirect
        user.navigationData = {
          toastType: 'info',
          toastMessage: 'You have successfully left the project.',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        
        // Navigate back to projects list
        this.$router.push({ name: 'studentProjects' });
        
      } catch (error) {
        console.error("Error leaving project:", error);
        
        // Check for specific error messages from the API
        if (error.response && error.response.data) {
          const errorMsg = error.response.data.error || error.response.data.title || "Error leaving the project. Please try again later.";
          toast.error(this.$t(errorMsg), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        } else {
          // Generic error message
          toast.error(this.$t("Error leaving the project. Please try again later."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          });
        }
      } finally {
        this.leavingProject = false;
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

/* Status badge styling */
.status-badge {
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.04);
  font-weight: 500;
  font-size: 0.875rem;
}

/* Make tooltip closer to the select field */
:deep(.tooltip-close .v-overlay__content) {
  margin-top: 0 !important;
}

.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}
</style>