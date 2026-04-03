<!-- 
editProject.vue (Instructor Side)
Instructor interface for reviewing and managing student projects. Provides functionality 
to approve/reject project proposals, update project details, manage members, and 
archive/restore projects. Includes comprehensive project review capabilities.
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-clipboard-edit-outline</v-icon>
          <div class="flex-grow-1">
            <div class="d-flex align-center">
              <h1 class="text-h5 font-weight-bold">{{ $t('Review Project') }}</h1>
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

              <!-- Status Banner for Proposed Projects -->
              <div v-if="projectData.projectStatus === 'Proposed'" class="status-banner proposed">
                <v-icon class="mr-2">mdi-clock-outline</v-icon>
                <span>{{ $t('This project is awaiting your review. You can approve or reject it below.') }}</span>
              </div>

              <!-- Section 1: Basic Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Project Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Review and update project details') }}</p>
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
                    :readonly="projectData.projectStatus === 'Archived'"
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
                    :readonly="projectData.projectStatus === 'Archived'"
                    variant="outlined"
                    auto-grow
                    rows="5"
                  ></v-textarea>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 2: Project Tags -->
              <!-- <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div>
                    <h2 class="section-title">{{ $t('Project Tags') }}</h2>
                    <p class="section-subtitle">{{ $t('Select all that apply') }}</p>
                  </div>
                </div>

                <div class="section-content">
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
                </div>
              </div>

              <v-divider></v-divider> -->

              <!-- Section 2: Project Members -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <h2 class="section-title">{{ $t('Project Members') }}</h2>
                        <p class="section-subtitle">{{ $t('View and manage project team') }}</p>
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

              <!-- Section 3: Project Documents -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">3</div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <h2 class="section-title">{{ $t('Project Documents') }}</h2>
                        <p class="section-subtitle">{{ $t('View and manage project files') }}</p>
                      </div>
                      <v-btn
                        v-if="projectData.projectStatus !== 'Archived'"
                        size="small"
                        class="upload-btn"
                        @click="openDocumentUpload"
                        prepend-icon="mdi-upload"
                      >
                        {{ $t('Upload') }}
                      </v-btn>
                    </div>
                  </div>
                </div>

                <div class="section-content">
                  <project-documents
                    v-if="projectData._id"
                    ref="projectDocuments"
                    :project-id="projectData._id"
                    :is-project-owner="isProjectOwner"
                    :embedded="true"
                  />
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 4: Visibility & Consent -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">4</div>
                  <div>
                    <h2 class="section-title">{{ $t('Visibility Settings') }}</h2>
                    <p class="section-subtitle">{{ $t('Choose how this project may be shared') }}</p>
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
                        :disabled="projectData.projectStatus === 'Archived'"
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

                <!-- Archive/Restore Buttons -->
                <v-btn
                  v-if="projectData.projectStatus === 'Active'"
                  variant="outlined"
                  size="large"
                  color="grey-darken-4"
                  @click="openArchiveConfirmDialog"
                  :loading="archivingProject"
                  class="action-btn mr-3"
                >
                  <v-icon start size="18">mdi-archive</v-icon>
                  {{ $t('Archive') }}
                </v-btn>

                <v-btn
                  v-if="projectData.projectStatus === 'Archived'"
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

                <!-- Reject Button (Proposed status) -->
                <v-btn
                  v-if="projectData.projectStatus === 'Proposed'"
                  variant="outlined"
                  size="large"
                  color="error"
                  @click="rejectProject"
                  :loading="rejectingProject"
                  :disabled="approvingProject"
                  class="action-btn mr-3"
                >
                  <v-icon start size="18">mdi-close-circle-outline</v-icon>
                  {{ $t('Reject') }}
                </v-btn>

                <!-- Approve Button (Proposed status) -->
                <v-btn
                  v-if="projectData.projectStatus === 'Proposed'"
                  size="large"
                  class="action-btn approve-btn"
                  @click="approveProject"
                  :loading="approvingProject"
                  :disabled="rejectingProject"
                >
                  <v-icon start size="18">mdi-check-circle-outline</v-icon>
                  {{ $t('Approve') }}
                </v-btn>

                <!-- Update Button (Active status) -->
                <v-btn 
                  v-if="projectData.projectStatus === 'Active'"
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

            <!-- Important Note Section -->
            <div class="mobile-info-section">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="warning" size="20" class="mr-2">mdi-alert-outline</v-icon>
                {{ $t('Important Note') }}
              </h3>
              <p class="text-body-2 mb-0">
                {{ projectData.projectStatus === 'Proposed' 
                  ? $t('Approving will make this project active. Rejecting will archive the proposal. Both actions will notify the student.')
                  : $t('Changes made to this project will be visible to all team members.')
                }}
              </p>
            </div>
          </v-card-text>
          
          <v-card-actions class="pa-4 pt-0">
            <v-spacer></v-spacer>
            <v-btn 
              class="submit-btn px-6"
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
              {{ $t('This project will be restored to Active status. The team can resume working on it.') }}
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

      <!-- Approve Confirmation Dialog -->
      <v-dialog v-model="approveDialog" persistent max-width="450px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 success-dialog-header">
            <v-icon color="success" size="28" class="mr-3">mdi-check-circle-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Approve Project?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <p class="text-body-1 mb-4">
              {{ $t('Are you sure you want to approve this project? This will make the project active and notify the student.') }}
            </p>
            <v-textarea
              v-model="approvalFeedback"
              :label="$t('Feedback to student (optional)')"
              :placeholder="$t('Add any comments or suggestions...')"
              variant="outlined"
              auto-grow
              rows="3"
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="approveDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn class="approve-btn" @click="confirmApprove" :loading="approvingProject">
              <v-icon start size="18">mdi-check</v-icon>
              {{ $t('Approve') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Reject Confirmation Dialog -->
      <v-dialog v-model="rejectDialog" persistent max-width="500px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 error-dialog-header">
            <v-icon color="error" size="28" class="mr-3">mdi-alert-circle-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Reject Project?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <v-alert type="warning" variant="tonal" class="mb-4">
              <strong>{{ $t('The student will be notified of this decision.') }}</strong>
            </v-alert>
            <p class="text-body-1 mb-4">
              {{ $t('Are you sure you want to reject this project proposal? The proposal will be archived.') }}
            </p>
            <v-textarea
              v-model="rejectionFeedback"
              :label="$t('Feedback to student')"
              :placeholder="$t('Please provide a reason for rejection...')"
              variant="outlined"
              auto-grow
              rows="3"
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="rejectDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn color="error" variant="flat" @click="confirmReject" :loading="rejectingProject">
              <v-icon start size="18">mdi-close-circle</v-icon>
              {{ $t('Reject') }}
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
            <p class="text-body-1 mb-2">{{ $t('The selected users have been invited to join this project.') }}</p>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('They will receive a notification and can accept or decline the invitation.') }}</p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn class="submit-btn px-6" variant="flat" @click="inviteSuccessDialog = false">
              {{ $t('Got it') }}
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
              class="submit-btn px-6"
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
      approveDialog: false,
      rejectDialog: false,
      inviteDialog: false,
      inviteSuccessDialog: false,
      mobileInfoDialog: false,
      featureInfoDialog: false,
      
      // Feedback for approve/reject
      approvalFeedback: '',
      rejectionFeedback: '',
      instructorFeedback: '',
      
      // Loading states for different operations
      updateLoading: false,
      sendingFeedback: false,
      approvingProject: false,
      requestingRevision: false,
      rejectingProject: false,
      archivingProject: false,
      restoringProject: false,
      
      // Project owner flag (instructor is always owner in this context)
      isProjectOwner: true,
      
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
        projectStatus: 'Proposed',
        consentToFeature: false
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
            instructorEmail: project.instructor ? project.instructor.email : '',
            consentToFeature: project.consentToFeature || false
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
    
    // Get color for project status
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'success';
        case 'Proposed': return 'warning';
        case 'Rejected': return 'error';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },

    // Get icon for project status
    getStatusIcon(status) {
      switch (status) {
        case 'Active': return 'mdi-check-circle';
        case 'Proposed': return 'mdi-clock-outline';
        case 'Rejected': return 'mdi-close-circle';
        case 'Archived': return 'mdi-archive';
        default: return 'mdi-help-circle';
      }
    },

    // Get description for project status
    getStatusDescription(status) {
      switch (status) {
        case 'Active': 
          return this.$t('This project is active. You can update details and manage members.');
        case 'Proposed': 
          return this.$t('This proposal is awaiting your review. You can approve or reject it.');
        case 'Rejected': 
          return this.$t('This proposal has been rejected.');
        case 'Archived': 
          return this.$t('This project has been archived. Restore it to make changes.');
        default: 
          return this.$t('Status unknown.');
      }
    },
    
    // Open document upload dialog
    openDocumentUpload() {
      if (this.projectData.projectStatus === 'Archived') {
        toast.error(this.$t("Cannot upload documents to an archived project."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }
      if (this.$refs.projectDocuments) {
        this.$refs.projectDocuments.openUploadDialog();
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
          tags: this.selectedTags,
          consentToFeature: this.projectData.consentToFeature
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
        const errorMsg = error.response?.data?.error || this.$t("Error updating the project. Please try again later.");
        toast.error(errorMsg, {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.updateLoading = false;
      }
    },
    
    // Open approve project dialog
    approveProject() {
      this.approvalFeedback = '';
      this.approveDialog = true;
    },

    // Confirm and approve the project
    async confirmApprove() {
      this.approvingProject = true;
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        
        // Try the update-status endpoint first, fall back to approve-project
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/update-status`;
        try {
          await axios.post(apiURL, {
            projectId: this.projectData._id,
            status: 'Active',
            feedback: this.approvalFeedback || undefined
          }, { headers: { token } });
        } catch (statusError) {
          // Fallback to legacy approve-project endpoint
          apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/approve-project`;
          await axios.post(apiURL, { 
            projectId: this.projectData._id,
            feedback: this.approvalFeedback || undefined
          }, { headers: { token } });
        }
        
        this.approveDialog = false;
        user.navigationData = {
          toastType: 'success',
          toastMessage: this.$t('Project approved successfully!'),
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--create'
        };
        this.$router.push({ name: 'instructorProjects' });
      } catch (error) {
        console.error("Error approving project:", error);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || this.$t("Error approving project. Please try again later.");
        toast.error(errorMsg, {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.approvingProject = false;
      }
    },

    // Open reject project dialog
    rejectProject() {
      this.rejectionFeedback = '';
      this.rejectDialog = true;
    },

    // Confirm and reject the project
    async confirmReject() {
      this.rejectingProject = true;
      try {
        const user = useLoggedInUserStore();
        const token = user.token;

        // Try the update-status endpoint first, fall back to archive
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/update-status`;
        try {
          await axios.post(apiURL, {
            projectId: this.projectData._id,
            status: 'Rejected',
            feedback: this.rejectionFeedback || undefined
          }, { headers: { token } });
        } catch (statusError) {
          // Fallback to archive endpoint
          apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/archive/${this.projectData._id}`;
          await axios.patch(apiURL, {
            feedback: this.rejectionFeedback || undefined
          }, { headers: { token } });
        }

        this.rejectDialog = false;
        user.navigationData = {
          toastType: 'info',
          toastMessage: this.$t('Project rejected.'),
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        this.$router.push({ name: 'instructorProjects' });
      } catch (error) {
        console.error("Error rejecting project:", error);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || this.$t("Error rejecting project. Please try again later.");
        toast.error(errorMsg, {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.rejectingProject = false;
      }
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
    handleMembersInvited(invitedUsers) {
      if (invitedUsers && invitedUsers.length > 0) {
        this.fetchProjectData(this.projectData._id);
      }
      this.inviteSuccessDialog = true;
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

.status-banner.proposed {
  background-color: #fff8e1;
  border-bottom: 1px solid #ffcc80;
  color: #f57c00;
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

/* Upload Button */
.upload-btn {
  background-color: #c8102e !important;
  color: white !important;
}

.upload-btn:hover {
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

.approve-btn {
  background-color: #2e7d32 !important;
  color: white !important;
}

.approve-btn:hover {
  background-color: #1b5e20 !important;
}

/* Red Chip for Tags */
:deep(.red-chip) {
  background-color: rgba(200, 16, 46, 0.80) !important; 
  color: white !important;
  border-color: #c8102e !important;
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

.warning-card {
  border-radius: 12px;
  border-color: #ffcc80;
  background-color: #fff8e1;
}

.warning-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #ffe0b2;
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

/* Info Dialog */
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