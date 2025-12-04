<!-- 
editProject.vue
Student-side project editing interface that allows project owners to update project details, 
manage members, archive/restore projects, and handle invitations. Non-owners can view 
project information and leave the project.
-->

<template>
  <main class="edit-project-page">
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-folder-edit-outline</v-icon>
          <div class="flex-grow-1">
            <div class="d-flex align-center">
              <h1 class="text-h5 font-weight-bold">{{ $t('Edit Project') }}</h1>
              <v-chip
                v-if="!loading && projectData.projectStatus"
                :color="getStatusColor(projectData.projectStatus)"
                size="small"
                class="ml-3"
              >
                <v-icon start size="14">{{ getStatusIcon(projectData.projectStatus) }}</v-icon>
                {{ projectData.projectStatus }}
              </v-chip>
              <v-btn
                icon
                variant="text"
                size="small"
                class="ml-2 d-lg-none"
                @click="mobileInfoDialog = true"
              >
                <v-icon color="#c8102e" size="22">mdi-help-circle</v-icon>
              </v-btn>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ projectData.name || $t('Loading...') }}</p>
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
              <!-- Status Banner for Archived Projects -->
              <div v-if="projectData.projectStatus === 'Archived'" class="status-banner archived">
                <v-icon class="mr-2">mdi-archive</v-icon>
                <span>{{ $t('This project is archived. Restore it to make changes.') }}</span>
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
                    :readonly="!isProjectOwner || projectData.projectStatus === 'Archived'"
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
                    :readonly="!isProjectOwner || projectData.projectStatus === 'Archived'"
                    variant="outlined"
                    auto-grow
                    rows="5"
                  ></v-textarea>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 2: Project Members -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <h2 class="section-title">{{ $t('Project Members') }}</h2>
                        <p class="section-subtitle">{{ $t('Manage your project team') }}</p>
                      </div>
                      <v-btn
                        v-if="projectData.projectStatus !== 'Archived'"
                        size="small"
                        class="invite-btn"
                        @click="openInviteDialog"
                        prepend-icon="mdi-account-plus"
                      >
                        {{ $t('Invite') }}
                      </v-btn>
                    </div>
                  </div>
                </div>

                <div class="section-content">
                  <!-- Empty state for no members -->
                  <div v-if="projectMembers.length === 0" class="empty-members-state">
                    <v-icon icon="mdi-account-group-outline" size="48" color="grey-lighten-1" class="mb-3"></v-icon>
                    <p class="text-body-1 text-medium-emphasis mb-3">{{ $t('No members have been added to this project yet.') }}</p>
                    <v-btn
                      v-if="projectData.projectStatus !== 'Archived'"
                      variant="tonal"
                      color="#c8102e"
                      @click="openInviteDialog"
                      prepend-icon="mdi-account-plus"
                    >
                      {{ $t('Start inviting people') }}
                    </v-btn>
                  </div>
                  
                  <!-- Members list -->
                  <div v-else class="members-list">
                    <div
                      v-for="member in projectMembers"
                      :key="member.id"
                      class="member-item"
                    >
                      <div class="d-flex align-center">
                        <v-avatar color="grey-lighten-2" size="40" class="mr-3">
                          <span class="text-body-2 font-weight-medium">
                            {{ member.name.charAt(0).toUpperCase() + (member.name.indexOf(' ') > -1 ? member.name.charAt(member.name.indexOf(' ') + 1).toUpperCase() : '') }}
                          </span>
                        </v-avatar>
                        <div class="flex-grow-1">
                          <div class="text-body-1 font-weight-medium">{{ member.name }}</div>
                          <div class="text-caption text-medium-emphasis">{{ member.email }}</div>
                        </div>
                        <div class="d-flex flex-column align-end">
                          <v-chip
                            size="small"
                            :color="member.isOwner ? '#c8102e' : 'success'"
                            class="mb-1"
                          >
                            {{ member.isOwner ? $t('Owner') : $t('Member') }}
                          </v-chip>
                          <span class="text-caption text-medium-emphasis">
                            {{ $t('Joined') }} {{ new Date(member.joinDate).toLocaleDateString() }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

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

                <!-- Leave Project Button (Non-owners only) -->
                <v-btn 
                  v-if="!isProjectOwner && projectData.projectStatus !== 'Archived'"
                  variant="outlined"
                  size="large"
                  color="error"
                  @click="openLeaveProjectDialog"
                  class="action-btn mr-3"
                >
                  <v-icon start size="18">mdi-exit-to-app</v-icon>
                  {{ $t('Leave Project') }}
                </v-btn>

                <!-- Archive/Restore Buttons (Owners only) -->
                <v-btn
                  v-if="isProjectOwner && projectData.projectStatus === 'Active'"
                  variant="outlined"
                  size="large"
                  color="grey"
                  @click="openArchiveConfirmDialog"
                  :loading="archivingProject"
                  class="action-btn mr-3"
                >
                  <v-icon start size="18">mdi-archive</v-icon>
                  {{ $t('Archive') }}
                </v-btn>

                <v-btn
                  v-if="isProjectOwner && projectData.projectStatus === 'Archived'"
                  variant="outlined"
                  size="large"
                  color="orange"
                  @click="openRestoreConfirmDialog"
                  :loading="restoringProject"
                  class="action-btn mr-3"
                >
                  <v-icon start size="18">mdi-restore</v-icon>
                  {{ $t('Restore') }}
                </v-btn>

                <!-- Update Button (Owners only, non-archived) -->
                <v-btn 
                  v-if="isProjectOwner && projectData.projectStatus !== 'Archived'"
                  type="submit"
                  size="large"
                  class="action-btn submit-btn"
                  :loading="updateLoading"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  {{ $t('Update Project') }}
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- Sidebar Column (Hidden on mobile) -->
          <v-col cols="12" lg="4" class="d-none d-lg-block">
            <div class="sidebar-sticky">
              <!-- Status Card -->
              <v-card class="sidebar-card mb-4" variant="outlined">
                <v-card-title class="sidebar-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-information-outline</v-icon>
                  {{ $t('Project Status') }}
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

              <!-- Course Information Card -->
              <v-card class="sidebar-card mb-4" variant="outlined">
                <v-card-title class="sidebar-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-school</v-icon>
                  {{ $t('Course Information') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <!-- Associated Experience -->
                  <div class="sidebar-info-item mb-4">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="#c8102e" size="18" class="mr-2">mdi-book-open-variant</v-icon>
                      <span class="text-caption font-weight-medium text-medium-emphasis">{{ $t('Associated Experience') }}</span>
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ projectData.experienceInstanceName || $t('Not assigned') }}
                    </div>
                    <div v-if="projectData.sessionData" class="text-caption text-medium-emphasis d-flex align-center mt-1">
                      <v-icon size="12" class="mr-1">mdi-calendar-outline</v-icon>
                      {{ projectData.sessionData.name || $t('No session available') }}
                    </div>
                  </div>

                  <!-- Associated Instructor -->
                  <div class="sidebar-info-item">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="#c8102e" size="18" class="mr-2">mdi-account-tie-outline</v-icon>
                      <span class="text-caption font-weight-medium text-medium-emphasis">{{ $t('Associated Instructor') }}</span>
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ projectData.instructorName || $t('Not Assigned') }}
                    </div>
                    <div v-if="projectData.instructorEmail" class="text-caption text-medium-emphasis d-flex align-center mt-1">
                      <v-icon size="12" class="mr-1">mdi-email-outline</v-icon>
                      {{ projectData.instructorEmail }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Your Role Card -->
              <v-card class="sidebar-card" variant="outlined">
                <v-card-title class="sidebar-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-account-star</v-icon>
                  {{ $t('Your Role') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <v-chip
                    :color="isProjectOwner ? '#c8102e' : 'success'"
                    size="large"
                    class="font-weight-medium mb-3"
                  >
                    <v-icon start size="18">{{ isProjectOwner ? 'mdi-crown' : 'mdi-account' }}</v-icon>
                    {{ isProjectOwner ? $t('Project Owner') : $t('Team Member') }}
                  </v-chip>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ isProjectOwner 
                      ? $t('You have full control over this project including editing, inviting members, and archiving.') 
                      : $t('You can view project details and leave the project if needed.') 
                    }}
                  </p>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-form>

      <!-- Mobile Info Dialog -->
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
                <v-icon color="#c8102e" size="20" class="mr-2">mdi-information-outline</v-icon>
                {{ $t('Project Status') }}
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

            <!-- Course Information Section -->
            <div class="mobile-info-section mb-5">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="#c8102e" size="20" class="mr-2">mdi-school</v-icon>
                {{ $t('Course Information') }}
              </h3>
              <div class="mobile-info-item mb-3">
                <div class="text-caption font-weight-medium text-medium-emphasis mb-1">{{ $t('Experience') }}</div>
                <div class="text-body-2 font-weight-medium">{{ projectData.experienceInstanceName || $t('Not assigned') }}</div>
                <div v-if="projectData.sessionData" class="text-caption text-medium-emphasis">{{ projectData.sessionData.name }}</div>
              </div>
              <div class="mobile-info-item">
                <div class="text-caption font-weight-medium text-medium-emphasis mb-1">{{ $t('Instructor') }}</div>
                <div class="text-body-2 font-weight-medium">{{ projectData.instructorName || $t('Not assigned') }}</div>
                <div v-if="projectData.instructorEmail" class="text-caption text-medium-emphasis">{{ projectData.instructorEmail }}</div>
              </div>
            </div>

            <v-divider class="mb-5"></v-divider>

            <!-- Role Section -->
            <div class="mobile-info-section">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="#c8102e" size="20" class="mr-2">mdi-account-star</v-icon>
                {{ $t('Your Role') }}
              </h3>
              <v-chip
                :color="isProjectOwner ? '#c8102e' : 'success'"
                size="large"
                class="font-weight-medium mb-3"
              >
                <v-icon start size="18">{{ isProjectOwner ? 'mdi-crown' : 'mdi-account' }}</v-icon>
                {{ isProjectOwner ? $t('Project Owner') : $t('Team Member') }}
              </v-chip>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ isProjectOwner 
                  ? $t('You have full control over this project including editing, inviting members, and archiving.') 
                  : $t('You can view project details and leave the project if needed.') 
                }}
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
            <v-icon color="#c8102e" size="28" class="mr-3">mdi-content-save-check-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Update Project?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <p class="text-body-1 mb-0">
              {{ $t('Your changes will be saved. Team members will see the updated information.') }}
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

      <!-- Archive Confirmation Dialog -->
      <v-dialog v-model="archiveConfirmDialog" persistent max-width="500px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 warning-dialog-header">
            <v-icon color="grey-darken-1" size="28" class="mr-3">mdi-archive-alert-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Archive Project?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <v-alert type="warning" variant="tonal" class="mb-4">
              {{ $t('Archived projects are read-only.') }}
            </v-alert>
            <p class="text-body-1 mb-0">
              {{ $t('Are you sure you want to archive this project? You can restore it later if needed.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="archiveConfirmDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn color="grey-darken-1" variant="flat" @click="confirmArchiveProject" :loading="archivingProject">
              <v-icon start size="18">mdi-archive</v-icon>
              {{ $t('Archive') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Restore Confirmation Dialog -->
      <v-dialog v-model="restoreConfirmDialog" persistent max-width="450px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5">
            <v-icon color="orange" size="28" class="mr-3">mdi-restore</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Restore Project?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <p class="text-body-1 mb-0">
              {{ $t('This project will be restored to Active status. You and your team can resume working on it.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="restoreConfirmDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn color="orange" variant="flat" @click="confirmRestoreProject" :loading="restoringProject">
              <v-icon start size="18">mdi-restore</v-icon>
              {{ $t('Restore') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Leave Project Dialog -->
      <v-dialog v-model="leaveProjectDialog" persistent max-width="500px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 error-dialog-header">
            <v-icon color="error" size="28" class="mr-3">mdi-exit-to-app</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Leave Project?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <v-alert type="error" variant="tonal" class="mb-4">
              <strong>{{ $t('You will lose access to this project.') }}</strong>
            </v-alert>
            <p class="text-body-1 mb-0">
              {{ $t('Are you sure you want to leave this project? You will need to be invited again to rejoin.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="leaveProjectDialog = false" class="mr-2">{{ $t('Stay') }}</v-btn>
            <v-btn color="error" variant="flat" @click="leaveProject" :loading="leavingProject">
              <v-icon start size="18">mdi-exit-to-app</v-icon>
              {{ $t('Leave') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Member Invitation Dialog -->
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

      <!-- Invitation Success Dialog -->
      <v-dialog v-model="inviteSuccessDialog" max-width="450px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 success-dialog-header">
            <v-icon color="success" size="28" class="mr-3">mdi-check-circle</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Invitations Sent') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <p class="text-body-1 mb-2">{{ $t('The selected users have been invited to join your project.') }}</p>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('They will receive a notification and can accept or decline the invitation.') }}</p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn class="got-it-btn px-6" variant="flat" @click="inviteSuccessDialog = false">
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
import InviteMembersDialog from '@/components/reusable/inviteMembersDialog.vue';

export default {
  name: "EditProject",
  components: {
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
      inviteDialog: false,
      inviteSuccessDialog: false,
      leaveProjectDialog: false,
      mobileInfoDialog: false,
      
      // Loading states for different operations
      updateLoading: false,
      archivingProject: false,
      restoringProject: false,
      leavingProject: false,
      
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
        projectStatus: 'Active'
      },
      
      // Project members
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
      
      // Tags
      selectedTags: []
    };
  },
  computed: {
    // Check if current user is the project owner
    isProjectOwner() {
      const user = useLoggedInUserStore();
      return this.projectData && 
             this.projectMembers && 
             this.projectMembers.some(member => 
               member.isOwner && member.id === user.userId
             );
    },
    
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
    const user = useLoggedInUserStore();
    if (!user.navigationData || !user.navigationData.projectID) {
      toast.error(this.$t("Cannot find project information. Returning to projects list."), {
        position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
      });
      this.$router.push({ name: 'studentProjects' });
      return;
    }
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
            sessionData: project.experience ? project.experience.session : null,
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
    
    // Open project update confirmation dialog
    async openSubmitDialog() {
      if (!this.isProjectOwner) {
        toast.error(this.$t("You don't have permission to update this project."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        return;
      }
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
    
    // Confirm and proceed with project update
    confirmUpdate() {
      this.submitDialog = false;
      this.updateProject();
    },
    
    // Update project data via API
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
    
    // Get color for project status
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'success';
        case 'Proposed': return 'warning';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },

    // Get icon for project status
    getStatusIcon(status) {
      switch (status) {
        case 'Active': return 'mdi-check-circle';
        case 'Proposed': return 'mdi-clock-outline';
        case 'Archived': return 'mdi-archive';
        default: return 'mdi-help-circle';
      }
    },

    // Get description for project status
    getStatusDescription(status) {
      switch (status) {
        case 'Active': 
          return this.$t('Your project is active. You can update details and invite members.');
        case 'Proposed': 
          return this.$t('Your proposal is awaiting review by an instructor.');
        case 'Archived': 
          return this.$t('This project has been archived. Restore it to make changes.');
        default: 
          return this.$t('Status unknown.');
      }
    },
    
    // Open member invitation dialog
    openInviteDialog() {
      if (this.projectData.projectStatus === 'Archived') {
        toast.error(this.$t("Cannot invite members to an archived project."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        return;
      }
      this.inviteDialog = true;
    },
    
    // Handle successful member invitations
    handleMembersInvited(invitedUsers) {
      if (invitedUsers && invitedUsers.length > 0) {
        this.fetchProjectData(this.projectData._id); 
      }
      this.inviteSuccessDialog = true;
    },
    
    // Open leave project confirmation dialog
    openLeaveProjectDialog() {
      if (this.isProjectOwner) {
        toast.error(this.$t("Project owners cannot leave their projects. Transfer ownership or archive the project."), { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
        return;
      }
      this.leaveProjectDialog = true;
    },
    
    // Process leaving the project
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

    // Open archive project confirmation dialog
    openArchiveConfirmDialog() {
      if (!this.isProjectOwner) return;
      this.archiveConfirmDialog = true;
    },
    
    // Archive the project
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
        this.projectData.projectStatus = 'Archived';
        this.$router.push({ name: 'studentProjects' }); 
      } catch (error) {
        console.error("Error archiving project:", error);
        const errorMsg = error.response?.data?.error || this.$t("Error archiving project. Please try again later.");
        toast.error(errorMsg, { position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false });
      } finally {
        this.archivingProject = false;
      }
    },
    
    // Open restore project confirmation dialog
    openRestoreConfirmDialog() {
      if (!this.isProjectOwner) return;
      this.restoreConfirmDialog = true;
    },
    
    // Restore the archived project
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
        this.projectData.projectStatus = 'Active';
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
/* Page Background */
.edit-project-page {
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
  padding: 12px 24px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.status-banner.archived {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  color: #666;
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

/* Members Section */
.empty-members-state {
  text-align: center;
  padding: 32px 16px;
  background-color: #fafafa;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.member-item:hover {
  background-color: #f5f5f5;
}

/* Invite Button */
.invite-btn {
  background-color: #c8102e !important;
  color: white !important;
}

.invite-btn:hover {
  background-color: #a00d24 !important;
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

.sidebar-card {
  border-radius: 12px;
  border-color: #e0e0e0;
}

.sidebar-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-info-item {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
}

/* Dialogs */
.confirm-dialog {
  border-radius: 12px;
}

.warning-dialog-header {
  background-color: #fff8e1;
}

.error-dialog-header {
  background-color: #ffebee;
}

.success-dialog-header {
  background-color: #e8f5e9;
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

.mobile-info-item {
  padding: 10px 12px;
  background-color: #fafafa;
  border-radius: 6px;
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
    min-width: auto;
  }
}
</style>