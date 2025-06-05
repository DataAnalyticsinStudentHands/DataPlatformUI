<!-- 
editProject.vue (Instructor Side)
Instructor interface for reviewing and managing student projects. Provides functionality 
to approve/reject project proposals, update project details, manage members, and 
archive/restore projects. Includes comprehensive project review capabilities.
-->

<template>
  <main>
    <v-form ref="form" @submit.prevent="openSubmitDialog">
      <v-container>
        <!-- Page header with project name and status -->
        <v-row>
          <v-col>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <p class="font-weight-black text-h6 mb-0 mr-3">{{ $t('Review Project') }}</p>
                <p class="text-h6 text-grey-darken-1 mb-0">{{ projectData.name || $t('Untitled Project') }}</p>
              </div>
              <div class="status-badge d-inline-flex align-center px-3 py-1">
                <v-icon size="small" :color="getStatusColor(projectData.projectStatus)" class="mr-1">mdi-circle</v-icon>
                <span :class="`text-${getStatusColor(projectData.projectStatus)}`">{{ projectData.projectStatus }}</span>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Loading state -->
        <v-row v-if="loading">
          <v-col class="text-center">
            <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
          </v-col>
        </v-row>

        <template v-else>
          <v-row>
            <!-- Main project information column -->
            <v-col cols="12" md="7">
              <!-- Project details card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-information-outline" class="mr-2"></v-icon>
                  {{ $t('Project Details') }}
                </v-card-title>
                
                <v-card-text class="px-4 pt-4">
                  <!-- Project name input -->
                  <v-text-field 
                    v-model="projectData.name" 
                    :label="$t('Project Name')"
                    :error="isNameInvalid"
                    :error-messages="nameErrorMessages"
                    :rules="nameRules"
                    :counter="100"
                    :readonly="projectData.projectStatus === 'Archived'"
                    required
                    outlined
                    class="mb-4"
                  ></v-text-field>
                  
                  <!-- Project description input -->
                  <p class="font-weight-black text-h8 mb-2">{{ $t('Project Description') }}</p>
                  <v-textarea 
                    v-model="projectData.description" 
                    :label="$t('Project description')"
                    :error="isDescriptionInvalid"
                    :error-messages="descriptionErrorMessages"
                    :rules="descriptionRules"
                    :counter="5000"
                    :readonly="projectData.projectStatus === 'Archived'"
                    auto-grow
                    rows="5"
                    outlined
                  ></v-textarea>
                </v-card-text>
              </v-card>
              
              <!-- Project tags selection -->
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
                    :disabled="projectData.projectStatus === 'Archived'"
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
              
              <!-- Project members management -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-account-group" class="mr-2"></v-icon>
                  {{ $t('Project Members') }}
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="projectData.projectStatus !== 'Archived'"
                    size="small"
                    color="#c8102e"
                    variant="flat"
                    @click="openInviteDialog"
                    prepend-icon="mdi-account-plus"
                  >
                    {{ $t('Invite') }}
                  </v-btn>
                </v-card-title>
                
                <!-- Empty state for no members -->
                <div v-if="projectMembers.length === 0" class="text-center my-6 pa-6">
                  <v-icon icon="mdi-account-group-outline" size="x-large" color="grey" class="mb-2"></v-icon>
                  <p class="text-grey">{{ $t('No members have been added to this project yet.') }}</p>
                  <v-btn
                    v-if="projectData.projectStatus !== 'Archived'"
                    variant="tonal"
                    color="#c8102e"
                    class="mt-3"
                    @click="openInviteDialog"
                    prepend-icon="mdi-account-plus"
                  >
                    {{ $t('Start inviting people') }}
                  </v-btn>
                </div>
                
                <!-- Members list -->
                <v-list v-else lines="two">
                  <v-list-item
                    v-for="member in projectMembers"
                    :key="member.id"
                    :title="member.name"
                    :subtitle="member.email || ''"
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
            
            <!-- Sidebar with course and instructor information -->
            <v-col cols="12" md="5">
              <!-- Course information card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-school" class="mr-2"></v-icon>
                  {{ $t('Course Information') }}
                </v-card-title>
                
                <v-card-text class="pa-4">
                  <!-- Associated experience section -->
                  <p class="font-weight-black text-h8 mb-2">
                    {{ $t('Associated Experience') }}
                  </p>
                  <v-card variant="outlined" class="pa-3 mb-4 bg-grey-lighten-5">
                    <div class="text-body-1 font-weight-medium">
                      {{ projectData.experienceInstanceName || $t('Not assigned') }}
                    </div>
                    <div v-if="projectData.sessionData" class="text-caption d-flex align-center mt-1">
                      <v-icon size="small" class="mr-1">mdi-calendar-outline</v-icon>
                      {{ projectData.sessionData.name || $t('No session available') }}
                    </div>
                  </v-card>
                  
                  <!-- Associated instructor section -->
                  <p class="font-weight-black text-h8 mb-2">
                    {{ $t('Associated Instructor') }}
                  </p>
                  <v-card variant="outlined" class="pa-3 mb-3 bg-grey-lighten-5">
                    <div class="text-body-1 font-weight-medium">{{ projectData.instructorName || $t('Not Assigned') }}</div>
                    <div class="text-caption d-flex align-center mt-1">
                      <v-icon size="small" class="mr-1">mdi-email-outline</v-icon>
                      {{ projectData.instructorEmail || $t('No email available') }}
                    </div>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- Action buttons section -->
          <v-row class="mt-6">
            <v-col class="d-flex align-center justify-space-between">
              <div class="d-flex align-items-center gap-3">
                <!-- Navigation and project management buttons -->
                <v-btn 
                  @click="$router.back()"
                  variant="outlined"
                >
                  {{ $t('Back') }}
                </v-btn>

                <v-btn 
                  v-if="projectData.projectStatus !== 'Archived'"
                  type="submit"
                  color="primary"
                  class="update-btn"
                  :loading="updateLoading"
                >
                  {{ $t('Update Project') }}
                </v-btn>

                <v-btn
                  v-if="projectData.projectStatus === 'Active'"
                  color="grey"
                  variant="outlined"
                  prepend-icon="mdi-archive"
                  @click="openArchiveConfirmDialog" 
                  :loading="archivingProject"
                >
                  {{ $t('Archive Project') }}
                </v-btn>

                <v-btn
                  v-if="projectData.projectStatus === 'Archived'"
                  color="orange" 
                  variant="outlined"
                  prepend-icon="mdi-restore"
                  @click="openRestoreConfirmDialog"
                  :loading="restoringProject"
                >
                  {{ $t('Restore Project') }}
                </v-btn>
              </div>
              
              <!-- Proposal review buttons (for Proposed status) -->
              <div>
                <div v-if="projectData.projectStatus === 'Proposed'" class="d-flex gap-3">
                  <v-btn
                    color="success"
                    variant="flat"
                    prepend-icon="mdi-check"
                    @click="approveProject"
                    :loading="approvingProject"
                  >
                    {{ $t('Approve Project') }}
                  </v-btn>
                  
                  <v-btn
                    color="error"
                    variant="outlined"
                    prepend-icon="mdi-close"
                    @click="rejectProject"
                    :loading="rejectingProject"
                  >
                    {{ $t('Reject Project') }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-form>

    <!-- Project update confirmation dialog -->
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

    <!-- Archive project confirmation dialog -->
    <v-dialog v-model="archiveConfirmDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ $t('Archive Project?') }}
        </v-card-title>
        <v-card-text>
          {{ $t('Are you sure you want to archive this project? You can restore it later if needed.') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="archiveConfirmDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-btn color="error" text @click="confirmArchiveProject" :loading="archivingProject">{{ $t('Archive') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Restore project confirmation dialog -->
    <v-dialog v-model="restoreConfirmDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ $t('Restore Project?') }}
        </v-card-title>
        <v-card-text>
          {{ $t('Are you sure you want to restore this project?') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="restoreConfirmDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-btn color="orange" text @click="confirmRestoreProject" :loading="restoringProject">{{ $t('Restore') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Feedback dialog for approve/reject actions -->
    <v-dialog v-model="feedbackDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline bg-grey-lighten-4">
          {{ feedbackTitle }}
        </v-card-title>
        <v-card-text class="pt-4">
          <v-textarea
            v-model="dialogFeedback"
            :label="$t('Feedback to student')"
            auto-grow
            rows="5"
            variant="outlined"
            class="mt-2"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="feedbackDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-btn 
            :color="feedbackAction === 'approve' ? 'success' : feedbackAction === 'revision' ? 'warning' : 'error'" 
            text 
            @click="submitActionWithFeedback"
            :loading="processingAction"
          >
            {{ feedbackActionLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Member invitation dialog -->
    <invite-members-dialog
      v-if="inviteDialog && projectData._id"
      v-model="inviteDialog"
      :project-id="projectData._id"
      :project-name="projectData.name"
      :experience-instance-id="projectData.experienceInstanceId"
      :experience-instance-name="projectData.experienceInstanceName"
      :associated-instructor-id="projectData.instructorId"
      :is-project-owner="isProjectOwner"
      :project-members="projectMembers"
      @members-invited="handleMembersInvited"
    />
  </main>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import ProjectDocuments from '@/components/reusable/projectDocuments.vue';
import InviteMembersDialog from '@/components/reusable/inviteMembersDialog.vue';

export default {
  name: "InstructorEditProject",
  components: {
    ProjectDocuments,
    InviteMembersDialog
  },
  data() {
    return {
      // Loading and form states
      loading: true,
      formSubmitted: false,
      
      // Dialog visibility states
      submitDialog: false,
      archiveConfirmDialog: false,
      restoreConfirmDialog: false,
      feedbackDialog: false,
      inviteDialog: false,
      
      // Feedback dialog data
      dialogFeedback: '',
      feedbackTitle: '',
      feedbackAction: null,
      feedbackActionLabel: '',
      instructorFeedback: '',
      
      // Loading states for different operations
      updateLoading: false,
      sendingFeedback: false,
      approvingProject: false,
      requestingRevision: false,
      rejectingProject: false,
      archivingProject: false,
      restoringProject: false,
      processingAction: false,
      
      // Main project data object
      projectData: {
        _id: null,
        name: '',
        description: '',
        experienceInstanceId: null,
        experienceInstanceName: '',
        sessionData: null,
        instructorId: null,
        instructorName: '',
        instructorEmail: '',
        projectStatus: 'Proposed'
      },
      
      // Project members array
      projectMembers: [],
      
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
    
    // Overall form validation state
    hasValidationErrors() {
      if (!this.formSubmitted) return false;
      return this.isNameInvalid || this.isDescriptionInvalid;
    }
  },
  
  // Component initialization
  async mounted() {
    console.log('InstructorEditProject mounted');
    const user = useLoggedInUserStore();
    
    if (!user.navigationData || !user.navigationData.projectID) {
      console.error('Project ID not found in navigation data');
      toast.error(this.$t("Cannot find project information. Returning to projects list."), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--delete',
        multiple: false
      });
      this.$router.push({ name: 'instructorProjects' });
      return;
    }
    
    console.log('Found project ID in navigation data:', user.navigationData.projectID);
    await this.fetchProjectData(user.navigationData.projectID);
  },
  
  methods: {
    // Fetch project data from API
    async fetchProjectData(projectId) {
      this.loading = true;
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
          this.$router.push({ name: 'instructorProjects' });
          return;
        }
        
        console.log('Fetching project data for ID:', projectId);
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${projectId}`;
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data) {
          const project = response.data;
          console.log('Received project data:', project);
          this.projectData = {
            _id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            projectStatus: project.projectStatus,
            experienceInstanceId: project.experience ? project.experience.id : null,
            experienceInstanceName: project.experience ? project.experience.experienceName : this.$t('Not assigned'),
            sessionData: project.experience ? project.experience.session : null,
            instructorId: project.instructor ? project.instructor.id : null,
            instructorName: project.instructor ? project.instructor.name : this.$t('Not assigned'),
            instructorEmail: project.instructor ? project.instructor.email : ''
          };
          this.selectedTags = project.tags || [];
          this.projectMembers = project.members || [];
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
    
    // Get color for project status badge
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'Proposed': return 'orange';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },
    
    // Open project update confirmation dialog
    async openSubmitDialog() {
      if (this.projectData.projectStatus === 'Archived') {
        toast.error(this.$t("Cannot update an archived project. Please restore it first."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }
      
      this.formSubmitted = true;
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
    
    // Confirm and proceed with project update
    confirmUpdate() {
      this.submitDialog = false;
      this.updateProject();
    },
    
    // Update project data via API
    async updateProject() {
      if (this.projectData.projectStatus === 'Archived') return;
      
      this.updateLoading = true;
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/update`;
        const projectPayload = {
          projectId: this.projectData._id,
          name: this.projectData.name,
          description: this.projectData.description,
          tags: this.selectedTags
        };
        await axios.put(apiURL, projectPayload, { headers: { token } });
        user.navigationData = {
          toastType: 'info',
          toastMessage: this.$t('Project updated successfully!'),
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ name: 'instructorProjects' });
      } catch (error) {
        console.error("Error updating project:", error);
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          if (serverErrors.length > 0) {
            toast.error(this.$t(serverErrors[0]), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
            return;
          }
        }
        toast.error(this.$t("Error updating the project. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.updateLoading = false;
      }
    },
    
    // Open approve project feedback dialog
    approveProject() {
      this.feedbackTitle = this.$t('Approve Project');
      this.feedbackAction = 'approve';
      this.feedbackActionLabel = this.$t('Approve');
      this.dialogFeedback = '';
      this.feedbackDialog = true;
    },

    // Open reject project feedback dialog
    rejectProject() { 
      this.feedbackTitle = this.$t('Reject Project');
      this.feedbackAction = 'reject';
      this.feedbackActionLabel = this.$t('Reject');
      this.dialogFeedback = '';
      this.feedbackDialog = true;
    },

    // Open archive project confirmation dialog
    openArchiveConfirmDialog() {
      this.archiveConfirmDialog = true;
    },
    
    // Archive the project
    async confirmArchiveProject() {
      this.archivingProject = true;
      this.archiveConfirmDialog = false;
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/archive/${this.projectData._id}`;
        await axios.patch(apiURL, {}, { headers: { token } });
        user.navigationData = {
          toastType: 'info',
          toastMessage: this.$t('Project archived!'),
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ name: 'instructorProjects' });
      } catch (error) {
        console.error("Error archiving project:", error);
        const errorMsg = error.response?.data?.error || this.$t("Error archiving project. Please try again later.");
        toast.error(errorMsg, {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.archivingProject = false;
      }
    },

    // Open restore project confirmation dialog
    openRestoreConfirmDialog() {
      this.restoreConfirmDialog = true;
    },

    // Restore the archived project
    async confirmRestoreProject() {
      this.restoringProject = true;
      this.restoreConfirmDialog = false;
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/restore/${this.projectData._id}`; 
        await axios.patch(apiURL, {}, { headers: { token } });
        user.navigationData = {
          toastType: 'info', 
          toastMessage: this.$t('Project restored!'),
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ name: 'instructorProjects' });
      } catch (error) {
        console.error("Error restoring project:", error);
        const errorMsg = error.response?.data?.error || this.$t("Error restoring project. Please try again later.");
        toast.error(errorMsg, {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.restoringProject = false;
      }
    },
    
    // Submit approve/reject action with optional feedback
    async submitActionWithFeedback() {
      if (this.feedbackAction === 'approve' && !this.dialogFeedback.trim()) {
        // Allow empty feedback for approvals
      } else if (!this.dialogFeedback.trim()) {
        toast.error(this.$t("Please provide feedback before submitting."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }
      
      this.processingAction = true;
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let navData = {};

        switch (this.feedbackAction) {
          case 'approve':
            const approveURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/approve-project`;
            await axios.post(approveURL, { projectId: this.projectData._id }, { headers: { token } });
            navData = {
              toastType: 'success',
              toastMessage: this.$t('Project approved successfully!'),
            };
            break;
            
          case 'reject':
            const rejectURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/archive/${this.projectData._id}`;
            await axios.patch(rejectURL, {}, { headers: { token } });
            navData = {
              toastType: 'info',
              toastMessage: this.$t('Project rejected and archived successfully!'),
            };
            break;
            
          default:
            throw new Error('Invalid action');
        }
        
        user.navigationData = {
          ...navData,
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        this.feedbackDialog = false;
        this.$router.push({ name: 'instructorProjects' });
      } catch (error) {
        console.error(`Error processing ${this.feedbackAction} action:`, error);
        toast.error(this.$t(`Error processing request. Please try again later.`), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.processingAction = false;
      }
    },
    
    // Open member invitation dialog
    openInviteDialog() {
      if (this.projectData.projectStatus === 'Archived') {
        toast.error(this.$t("Cannot invite members to an archived project."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }
      this.inviteDialog = true;
    },
    
    // Handle successful member invitations
    handleMembersInvited() { 
      toast.success(this.$t('Members invited successfully. List will update on next refresh.'), {
        position: 'top-right'
      });
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

.status-badge {
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.04);
  font-weight: 500;
  font-size: 0.875rem;
}

.gap-3 {
  gap: 12px; 
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.d-flex.align-items-center.gap-3 > .v-btn {
  margin-right: 0; 
}
</style>