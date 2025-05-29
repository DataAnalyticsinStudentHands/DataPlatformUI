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
            <!-- Main project information column -->
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
                    :readonly="!isProjectOwner || projectData.projectStatus === 'Archived'"
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
                    :readonly="!isProjectOwner || projectData.projectStatus === 'Archived'"
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
                    :disabled="!isProjectOwner || projectData.projectStatus === 'Archived'"
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
              
              <!-- Project Members card -->
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
            
            <!-- Side panel with additional info -->
            <v-col cols="12" md="5">
              <!-- Experience & Instructor info card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-school" class="mr-2"></v-icon>
                  {{ $t('Course Information') }}
                </v-card-title>
                
                <v-card-text class="pa-4">
                  <!-- Experience section -->
                  <p class="font-weight-black text-h8 mb-2">
                    {{ $t('Associated Experience') }}
                  </p>
                  <v-card
                    variant="outlined"
                    class="pa-3 mb-4 bg-grey-lighten-5"
                  >
                    <div class="text-body-1 font-weight-medium">
                      {{ projectData.experienceInstanceName || $t('Not assigned') }}
                    </div>
                    <div
                      v-if="projectData.sessionData"
                      class="text-caption d-flex align-center mt-1"
                    >
                      <v-icon size="small" class="mr-1">mdi-calendar-outline</v-icon>
                      {{ projectData.sessionData.name || $t('No session available') }}
                    </div>
                  </v-card>

                  <!-- Instructor section -->
                  <p class="font-weight-black text-h8 mb-2">
                    {{ $t('Associated Instructor') }}
                  </p>
                  <v-card
                    variant="outlined"
                    class="pa-3 mb-3 bg-grey-lighten-5"
                  >
                    <div class="text-body-1 font-weight-medium">
                      {{ projectData.instructorName || $t('Not Assigned') }}
                    </div>
                    <div class="text-caption d-flex align-center mt-1">
                      <v-icon size="small" class="mr-1">mdi-email-outline</v-icon>
                      {{ projectData.instructorEmail || $t('No email available') }}
                    </div>
                  </v-card>
                </v-card-text>
              </v-card>
              
              <!-- Project Documents card -->
              <!-- <ProjectDocuments 
                :project-id="projectData._id"
                :is-project-owner="isProjectOwner"
              /> -->
            </v-col>
          </v-row>
          
          <!-- Buttons positioning -->
          <v-row class="mt-6">
            <v-col class="d-flex align-center justify-space-between">
              <div class="d-flex align-items-center"> <!-- Removed gap-3 for manual margin -->
                <!-- Back button -->
                <v-btn 
                  @click="$router.back()"
                  variant="outlined"
                  class="mr-3"
                >
                  {{ $t('Back') }}
                </v-btn>

                <!-- Update project button - only for owners and not archived -->
                <v-btn 
                  v-if="isProjectOwner && projectData.projectStatus !== 'Archived'"
                  type="submit"
                  color="primary"
                  class="update-btn mr-3"
                  :loading="updateLoading"
                >
                  {{ $t('Update Project') }}
                </v-btn>

                <!-- Archive button (if Active and Owner) -->
                <v-btn
                  v-if="isProjectOwner && projectData.projectStatus === 'Active'"
                  color="grey"
                  variant="outlined"
                  prepend-icon="mdi-archive"
                  @click="openArchiveConfirmDialog"
                  :loading="archivingProject"
                  class="mr-3"
                >
                  {{ $t('Archive Project') }}
                </v-btn>

                <!-- Restore button (if Archived and Owner) -->
                <v-btn
                  v-if="isProjectOwner && projectData.projectStatus === 'Archived'"
                  color="orange"
                  variant="outlined"
                  prepend-icon="mdi-restore"
                  @click="openRestoreConfirmDialog"
                  :loading="restoringProject"
                >
                  {{ $t('Restore Project') }}
                </v-btn>
              </div>
              
              <!-- Leave Project button - only for non-owners -->
              <v-btn 
                v-if="!isProjectOwner && projectData.projectStatus !== 'Archived'"
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

    <!-- Archive Confirmation Dialog -->
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

    <!-- Restore Confirmation Dialog -->
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

    <!-- Invite Members Dialog -->
    <invite-members-dialog
      v-if="inviteDialog && projectData._id"
      v-model="inviteDialog"
      :project-id="projectData._id"
      :project-name="projectData.name"
      :experience-instance-name="projectData.experienceInstanceName"
      :associated-instructor-id="projectData.instructorId"
      :is-project-owner="isProjectOwner"
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
import ProjectDocuments from '@/components/reusable/projectDocuments.vue'; // Assuming this is still used or might be in future

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
      archiveConfirmDialog: false, // For archive confirmation
      restoreConfirmDialog: false, // For restore confirmation
      inviteDialog: false,
      inviteSuccessDialog: false,
      leaveProjectDialog: false,
      updateLoading: false,
      archivingProject: false,     // Loading state for archive
      restoringProject: false,     // Loading state for restore
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
        projectStatus: 'Proposed'
      },
      experienceInstances: [],
      experienceInstancesLoaded: false,
      projectMembers: [],
      searchQuery: '',
      roleFilter: 'All Roles',
      userHeaders: [
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Invitation', key: 'invitation' }
      ],
      availableUsers: [], 
      filteredUsers: [],
      selectedUsers: [],
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
        "community", "coding", "outreach", "education", "innovation", "campus", 
        "technology", "empowerment", "collaboration", "digital", "learning", 
        "network", "nonprofit", "humanity", "social impact"
      ],
      selectedTags: []
    };
  },
  computed: {
    isProjectOwner() {
      const user = useLoggedInUserStore();
      return this.projectData && 
             this.projectMembers && 
             this.projectMembers.some(member => 
               member.isOwner && member.id === user.userId // Make sure to use user.userId from Pinia store
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
    // isExperienceInvalid and experienceErrorMessages seem to be from an older version, 
    // as the experience selection UI isn't present for editing in this student view.
    // I will keep them commented out or remove if not needed.
    // isExperienceInvalid() { /* ... */ },
    // experienceErrorMessages() { /* ... */ },
    hasValidationErrors() {
      if (!this.formSubmitted) return false;
      // return this.isNameInvalid || this.isDescriptionInvalid || this.isExperienceInvalid;
      return this.isNameInvalid || this.isDescriptionInvalid; // Adjusted as experience selection is not here
    }
  },
  async mounted() {
    console.log('EditProject mounted');
    const user = useLoggedInUserStore();
    if (!user.navigationData || !user.navigationData.projectID) {
      console.error('Project ID not found in navigation data');
      toast.error(this.$t("Cannot find project information. Returning to projects list."), {
        position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
      });
      this.$router.push({ name: 'studentProjects' });
      return;
    }
    console.log('Found project ID in navigation data:', user.navigationData.projectID);
    await this.fetchProjectData(user.navigationData.projectID);
    // No need to fetch experiences here as it's not editable by students post-creation in this view
  },
  methods: {
    async fetchProjectData(projectId) {
      this.loading = true;
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        if (!projectId) {
          console.error('No project ID provided');
          this.$router.push({ name: 'studentProjects' });
          return;
        }
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${projectId}`;
        const response = await axios.get(apiURL, { headers: { token } });
        if (response.data) {
          const project = response.data;
          this.projectData = {
            _id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            projectStatus: project.projectStatus,
            experienceInstanceId: project.experience ? project.experience.id : null,
            experienceInstanceName: project.experience ? project.experience.experienceName : this.$t('Not assigned'),
            sessionData: project.experience ? project.experience.session : null, // Added to match instructor side if available
            instructorId: project.instructor ? project.instructor.id : null,
            instructorName: project.instructor ? project.instructor.name : this.$t('Not assigned'),
            instructorEmail: project.instructor ? project.instructor.email : ''
          };
          this.selectedTags = project.tags || [];
          this.projectMembers = project.members || [];
        } else {
          toast.error(this.$t("Error loading project data"), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error(this.$t("Error loading project data. Please try again later."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
      } finally {
        this.loading = false;
      }
    },
    // fetchStudentExperienceInstances is likely not needed here if students cannot change experience post-creation.
    // async fetchStudentExperienceInstances() { /* ... */ },
    
    async openSubmitDialog() {
      if (!this.isProjectOwner) {
        toast.error(this.$t("You don't have permission to update this project."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        return;
      }
      // Check if project is archived
      if (this.projectData.projectStatus === 'Archived') {
        toast.error(this.$t("Cannot update an archived project. Please restore it first."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        return;
      }
      this.formSubmitted = true;
      if (!this.hasValidationErrors) {
        this.submitDialog = true;
      } else {
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
      }
    },
    confirmUpdate() {
      this.submitDialog = false;
      this.updateProject();
    },
    async updateProject() {
      if (!this.isProjectOwner || this.projectData.projectStatus === 'Archived') return;
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
          notes: 'Updated via web interface by student'
        };
        await axios.put(apiURL, projectPayload, { headers: { token } });
        user.navigationData = {
          toastType: 'info', toastMessage: this.$t('Project updated successfully!'),
          toastPosition: 'top-right', toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ name: 'studentProjects' });
      } catch (error) {
        console.error("Error updating project:", error);
        const errorMsg = error.response?.data?.errors?.[0] || error.response?.data?.error || this.$t("Error updating your project. Please try again later.");
        toast.error(errorMsg, { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
      } finally {
        this.updateLoading = false;
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        // case 'In Progress': return 'blue'; // Not in schema
        case 'Proposed': return 'orange';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },
    // getStatusTextColor not used, can be removed if not planned.
    openInviteDialog() {
      // Check if project is archived
      if (this.projectData.projectStatus === 'Archived') {
        toast.error(this.$t("Cannot invite members to an archived project."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        return;
      }
      this.inviteDialog = true;
    },
    handleMembersInvited(invitedUsers) {
      if (invitedUsers && invitedUsers.length > 0) {
        // Assuming invitedUsers is an array of member objects
        // A more robust way would be to refetch project data or merge carefully
        this.fetchProjectData(this.projectData._id); 
      }
      this.inviteSuccessDialog = true; // Show generic success from provided template
    },
    openLeaveProjectDialog() {
      if (this.isProjectOwner) {
        toast.error(this.$t("Project owners cannot leave their projects. Transfer ownership or archive the project."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        return;
      }
      this.leaveProjectDialog = true;
    },
    async leaveProject() {
      this.leavingProject = true;
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/leave`;
        await axios.post(apiURL, { projectId: this.projectData._id }, { headers: { token } });
        this.leaveProjectDialog = false;
        user.navigationData = {
          toastType: 'info', toastMessage: this.$t('You have successfully left the project.'),
          toastPosition: 'top-right', toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ name: 'studentProjects' });
      } catch (error) {
        console.error("Error leaving project:", error);
        const errorMsg = error.response?.data?.error || error.response?.data?.title || this.$t("Error leaving the project. Please try again later.");
        toast.error(errorMsg, { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
      } finally {
        this.leavingProject = false;
      }
    },

    // --- Archive/Restore Methods ---
    openArchiveConfirmDialog() {
      if (!this.isProjectOwner) return;
      this.archiveConfirmDialog = true;
    },
    async confirmArchiveProject() {
      if (!this.isProjectOwner) return;
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
        // Update local status and re-route or just re-route
        this.projectData.projectStatus = 'Archived'; // Optimistic update
        this.$router.push({ name: 'studentProjects' }); 
      } catch (error) {
        console.error("Error archiving project:", error);
        const errorMsg = error.response?.data?.error || this.$t("Error archiving project. Please try again later.");
        toast.error(errorMsg, { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
      } finally {
        this.archivingProject = false;
      }
    },
    openRestoreConfirmDialog() {
      if (!this.isProjectOwner) return;
      this.restoreConfirmDialog = true;
    },
    async confirmRestoreProject() {
      if (!this.isProjectOwner) return;
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
        this.projectData.projectStatus = 'Active'; // Optimistic update
        this.$router.push({ name: 'studentProjects' });
      } catch (error) {
        console.error("Error restoring project:", error);
        const errorMsg = error.response?.data?.error || this.$t("Error restoring project. Please try again later.");
        toast.error(errorMsg, { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
      } finally {
        this.restoringProject = false;
      }
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

/* .gap-3 was removed from template, so this style might not be needed if using mr-3/ml-3 instead */
/* .gap-3 {
  gap: 12px; 
} */

.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}

/* Ensure buttons in the same group are aligned well */
/* .d-flex.align-items-center > .v-btn {
  margin-right: 0; 
} */
</style>