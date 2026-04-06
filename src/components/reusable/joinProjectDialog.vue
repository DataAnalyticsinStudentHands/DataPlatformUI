<!-- 
joinProjectDialog.vue
Enhanced dialog component for joining projects via invitation codes OR viewing pending invitations. 
Supports two modes: invitations-only (for initial page load) and full mode (with tabs).
-->

<template>
  <v-dialog 
    v-model="localDialog" 
    :max-width="currentView === 'invitations' ? '700px' : '420px'" 
    persistent
    @update:model-value="handleDialogUpdate"
  >
    <v-card>
      <!-- Dialog header with dynamic title -->
      <v-toolbar flat color="#c8102e" dark>
        <v-toolbar-title>
          {{ dialogTitle }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Tab navigation when in full mode with pending invitations -->
      <v-tabs
        v-if="shouldShowTabs"
        v-model="activeTab"
        color="#c8102e"
        align-tabs="center"
      >
        <v-tab value="invitations">
          {{ $t('Pending Invitations') }}
          <v-badge
            :content="pendingInvitations.length"
            color="blue"
            inline
            class="ml-2"
          />
        </v-tab>
        <v-tab value="code">{{ $t('Enter Code') }}</v-tab>
      </v-tabs>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
        <p class="mt-4 text-grey-darken-1">{{ loadingText }}</p>
      </div>

      <!-- Main content area -->
      <template v-else-if="!showProjectDetails">
        <!-- INVITATIONS-ONLY MODE (no tabs) -->
        <div v-if="invitationsOnly && hasPendingInvitations">
          <!-- Single invitation -->
          <div v-if="pendingInvitations.length === 1" class="py-4 px-6">
            <!-- Welcome message -->
            <div class="text-center mb-4">
              <v-icon size="48" color="#c8102e" class="mb-2">mdi-party-popper</v-icon>
              <p class="text-h6 font-weight-medium">{{ $t('You have been invited to join a project!') }}</p>
            </div>
            
            <!-- Project name -->
            <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Name') }}</p>
            <p class="text-body-1 mb-3">{{ pendingInvitations[0].projectName }}</p>
            
            <!-- Invited by section -->
            <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Invited by') }}</p>
            <v-card variant="flat" class="bg-grey-lighten-5 pa-3 mb-3">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-account</v-icon>
                <span class="text-body-1">{{ pendingInvitations[0].invitedBy.name }}</span>
              </div>
            </v-card>
            
            <!-- Experience section -->
            <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Experience') }}</p>
            <v-card variant="flat" class="bg-grey-lighten-5 pa-3 mb-3">
              <div class="text-body-1">{{ pendingInvitations[0].experienceInstance.name }}</div>
            </v-card>
            
            <!-- Invitation date -->
            <div class="text-caption text-grey-darken-1">
              <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
              {{ $t('Invited') }} {{ formatRelativeTime(pendingInvitations[0].invitedAt) }}
            </div>
            
            <!-- Action buttons for single invitation -->
            <div class="d-flex justify-end mt-4 gap-2">
              <v-btn
                color="error"
                variant="text"
                @click="handleDeclineInvitation(pendingInvitations[0]._id)"
                :loading="processingInvitations[pendingInvitations[0]._id]"
              >
                {{ $t('Decline') }}
              </v-btn>
              <v-btn
                color="#c8102e"
                variant="elevated"
                @click="handleAcceptInvitation(pendingInvitations[0]._id)"
                :loading="processingInvitations[pendingInvitations[0]._id]"
              >
                {{ $t('Accept') }}
              </v-btn>
            </div>
          </div>
          
          <!-- Multiple invitations -->
          <div v-else>
            <!-- Welcome message -->
            <div class="text-center py-4 px-6">
              <v-icon size="48" color="#c8102e" class="mb-2">mdi-email-multiple</v-icon>
              <p class="text-h6 font-weight-medium">{{ $t('You have') }} {{ pendingInvitations.length }} {{ $t('project invitations!') }}</p>
              <p class="text-body-2 text-grey-darken-1">{{ $t('Review and respond to each invitation below') }}</p>
            </div>
            
            <v-divider></v-divider>
            
            <!-- Invitations list with individual actions -->
            <div class="invitations-list">
              <template v-for="(invitation, index) in pendingInvitations" :key="invitation._id">
                <div class="invitation-item pa-4" :class="{ 'processed': processedInvitations[invitation._id] }">
                  <v-row align="center">
                    <!-- Left side: Avatar and invitation details -->
                    <v-col cols="12" sm="8">
                      <div class="d-flex align-start">
                        <v-avatar color="#c8102e" size="40" class="mr-3">
                          <v-icon color="white">mdi-folder-account</v-icon>
                        </v-avatar>
                        
                        <div class="flex-grow-1">
                          <div class="font-weight-medium text-body-1">
                            {{ invitation.projectName }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ $t('Invited by') }} {{ invitation.invitedBy.name }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            <v-icon size="x-small" class="mr-1">mdi-school</v-icon>
                            {{ invitation.experienceInstance.name }}
                          </div>
                          <div class="text-caption text-grey-darken-2">
                            <v-icon size="x-small" class="mr-1">mdi-clock-outline</v-icon>
                            {{ formatRelativeTime(invitation.invitedAt) }}
                          </div>
                        </div>
                      </div>
                    </v-col>
                    
                    <!-- Right side: Action buttons -->
                    <v-col cols="12" sm="4">
                      <div class="d-flex justify-end gap-2">
                        <v-btn
                          size="small"
                          color="error"
                          variant="text"
                          @click="handleDeclineInvitation(invitation._id)"
                          :loading="processingInvitations[invitation._id]"
                          :disabled="processedInvitations[invitation._id]"
                        >
                          {{ $t('Decline') }}
                        </v-btn>
                        <v-btn
                          size="small"
                          color="#c8102e"
                          variant="elevated"
                          @click="handleAcceptInvitation(invitation._id)"
                          :loading="processingInvitations[invitation._id]"
                          :disabled="processedInvitations[invitation._id]"
                        >
                          {{ $t('Accept') }}
                        </v-btn>
                      </div>
                      
                      <!-- Success message after processing -->
                      <div v-if="processedInvitations[invitation._id]" class="text-center mt-2">
                        <span v-if="processedInvitations[invitation._id] === 'accepted'" class="text-caption text-success">
                          <v-icon size="small" color="success">mdi-check-circle</v-icon>
                          {{ $t('Accepted') }}
                        </span>
                        <span v-else-if="processedInvitations[invitation._id] === 'declined'" class="text-caption text-error">
                          <v-icon size="small" color="error">mdi-close-circle</v-icon>
                          {{ $t('Declined') }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <v-divider v-if="index < pendingInvitations.length - 1" />
              </template>
            </div>
            
            <!-- Footer for multiple invitations -->
            <v-divider></v-divider>
            <v-card-actions class="justify-end pa-4">
              <v-btn
                variant="text"
                color="grey-darken-1"
                @click="close"
              >
                {{ allInvitationsProcessed ? $t('Close') : $t('Cancel') }}
              </v-btn>
            </v-card-actions>
          </div>
        </div>

        <!-- REGULAR MODE WITH TABS -->
        <v-window v-else-if="!invitationsOnly && hasPendingInvitations" v-model="activeTab">
          <!-- Invitations tab -->
          <v-window-item value="invitations">
            <div v-if="pendingInvitations.length > 0">
              <!-- Single invitation -->
              <div v-if="pendingInvitations.length === 1" class="py-4 px-6">
                <!-- Welcome message -->
                <div class="text-center mb-4">
                  <v-icon size="48" color="#c8102e" class="mb-2">mdi-party-popper</v-icon>
                  <p class="text-h6 font-weight-medium">{{ $t('You have been invited to join a project!') }}</p>
                </div>
                
                <!-- Project name -->
                <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Name') }}</p>
                <p class="text-body-1 mb-3">{{ pendingInvitations[0].projectName }}</p>
                
                <!-- Invited by section -->
                <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Invited by') }}</p>
                <v-card variant="flat" class="bg-grey-lighten-5 pa-3 mb-3">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-account</v-icon>
                    <span class="text-body-1">{{ pendingInvitations[0].invitedBy.name }}</span>
                  </div>
                </v-card>
                
                <!-- Experience section -->
                <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Experience') }}</p>
                <v-card variant="flat" class="bg-grey-lighten-5 pa-3 mb-3">
                  <div class="text-body-1">{{ pendingInvitations[0].experienceInstance.name }}</div>
                </v-card>
                
                <!-- Invitation date -->
                <div class="text-caption text-grey-darken-1">
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  {{ $t('Invited') }} {{ formatRelativeTime(pendingInvitations[0].invitedAt) }}
                </div>
                
                <!-- Action buttons for single invitation -->
                <div class="d-flex justify-end mt-4 gap-2">
                  <v-btn
                    color="error"
                    variant="text"
                    @click="handleDeclineInvitation(pendingInvitations[0]._id)"
                    :loading="processingInvitations[pendingInvitations[0]._id]"
                  >
                    {{ $t('Decline') }}
                  </v-btn>
                  <v-btn
                    color="#c8102e"
                    variant="elevated"
                    @click="handleAcceptInvitation(pendingInvitations[0]._id)"
                    :loading="processingInvitations[pendingInvitations[0]._id]"
                  >
                    {{ $t('Accept') }}
                  </v-btn>
                </div>
              </div>
              
              <!-- Multiple invitations -->
              <div v-else>
                <!-- Welcome message -->
                <div class="text-center py-4 px-6">
                  <v-icon size="48" color="#c8102e" class="mb-2">mdi-email-multiple</v-icon>
                  <p class="text-h6 font-weight-medium">{{ $t('You have') }} {{ pendingInvitations.length }} {{ $t('project invitations!') }}</p>
                  <p class="text-body-2 text-grey-darken-1">{{ $t('Review and respond to each invitation below') }}</p>
                </div>
                
                <v-divider></v-divider>
                
                <!-- Invitations list with individual actions -->
                <div class="invitations-list">
                  <template v-for="(invitation, index) in pendingInvitations" :key="invitation._id">
                    <div class="invitation-item pa-4" :class="{ 'processed': processedInvitations[invitation._id] }">
                      <v-row align="center">
                        <!-- Left side: Avatar and invitation details -->
                        <v-col cols="12" sm="8">
                          <div class="d-flex align-start">
                            <v-avatar color="#c8102e" size="40" class="mr-3">
                              <v-icon color="white">mdi-folder-account</v-icon>
                            </v-avatar>
                            
                            <div class="flex-grow-1">
                              <div class="font-weight-medium text-body-1">
                                {{ invitation.projectName }}
                              </div>
                              <div class="text-caption text-grey-darken-1">
                                {{ $t('Invited by') }} {{ invitation.invitedBy.name }}
                              </div>
                              <div class="text-caption text-grey-darken-1">
                                <v-icon size="x-small" class="mr-1">mdi-school</v-icon>
                                {{ invitation.experienceInstance.name }}
                              </div>
                              <div class="text-caption text-grey-darken-2">
                                <v-icon size="x-small" class="mr-1">mdi-clock-outline</v-icon>
                                {{ formatRelativeTime(invitation.invitedAt) }}
                              </div>
                            </div>
                          </div>
                        </v-col>
                        
                        <!-- Right side: Action buttons -->
                        <v-col cols="12" sm="4">
                          <div class="d-flex justify-end gap-2">
                            <v-btn
                              size="small"
                              color="error"
                              variant="text"
                              @click="handleDeclineInvitation(invitation._id)"
                              :loading="processingInvitations[invitation._id]"
                              :disabled="processedInvitations[invitation._id]"
                            >
                              {{ $t('Decline') }}
                            </v-btn>
                            <v-btn
                              size="small"
                              color="#c8102e"
                              variant="elevated"
                              @click="handleAcceptInvitation(invitation._id)"
                              :loading="processingInvitations[invitation._id]"
                              :disabled="processedInvitations[invitation._id]"
                            >
                              {{ $t('Accept') }}
                            </v-btn>
                          </div>
                          
                          <!-- Success message after processing -->
                          <div v-if="processedInvitations[invitation._id]" class="text-center mt-2">
                            <span v-if="processedInvitations[invitation._id] === 'accepted'" class="text-caption text-success">
                              <v-icon size="small" color="success">mdi-check-circle</v-icon>
                              {{ $t('Accepted') }}
                            </span>
                            <span v-else-if="processedInvitations[invitation._id] === 'declined'" class="text-caption text-error">
                              <v-icon size="small" color="error">mdi-close-circle</v-icon>
                              {{ $t('Declined') }}
                            </span>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider v-if="index < pendingInvitations.length - 1" />
                  </template>
                </div>
              </div>
            </div>
          </v-window-item>

          <!-- Enter code tab -->
          <v-window-item value="code">
            <v-card-text class="py-4 px-6">
              <p class="text-subtitle-1 mb-4">
                {{ $t('Enter your invitation code to join a project') }}
              </p>
              <v-text-field
                v-model="invitationCode"
                :label="$t('Invitation Code')"
                placeholder="PRJ-XXXXXX"
                variant="outlined"
                clearable
                prepend-inner-icon="mdi-email-outline"
                density="comfortable"
                :rules="[code => !!code || $t('Code is required')]"
                @keyup.enter="submit"
              />
            </v-card-text>

            <v-divider />

            <!-- Code input action buttons -->
            <v-card-actions class="justify-end pa-4">
              <v-btn variant="text" color="grey-darken-1" @click="close">
                {{ $t('Cancel') }}
              </v-btn>
              <v-btn
                color="#c8102e"
                variant="elevated"
                @click="submit"
                :disabled="!invitationCode"
              >
                {{ $t('Join') }}
              </v-btn>
            </v-card-actions>
          </v-window-item>
        </v-window>

        <!-- CODE ENTRY ONLY (no invitations, not in invitations-only mode) -->
        <div v-else-if="!invitationsOnly && !hasPendingInvitations">
          <v-card-text class="py-4 px-6">
            <p class="text-subtitle-1 mb-4">
              {{ $t('Enter your invitation code to join a project') }}
            </p>
            <v-text-field
              v-model="invitationCode"
              :label="$t('Invitation Code')"
              placeholder="PRJ-XXXXXX"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-email-outline"
              density="comfortable"
              :rules="[code => !!code || $t('Code is required')]"
              @keyup.enter="submit"
            />
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-end pa-4">
            <v-btn variant="text" color="grey-darken-1" @click="close">
              {{ $t('Cancel') }}
            </v-btn>
            <v-btn
              color="#c8102e"
              variant="elevated"
              @click="submit"
              :disabled="!invitationCode"
            >
              {{ $t('Join') }}
            </v-btn>
          </v-card-actions>
        </div>
      </template>

      <!-- Project details view (after code validation) -->
      <div v-else-if="showProjectDetails">
        <v-card-text class="py-4 px-6">
          <!-- Project basic information -->
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Name') }}</p>
          <p class="text-body-1 mb-3">{{ projectData.name }}</p>
          
          <!-- Associated experience details -->
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Experience') }}</p>
          <v-card variant="flat" class="bg-grey-lighten-5 pa-3 mb-3">
            <div class="text-body-1">{{ projectData.experience }}</div>
            <div class="text-caption text-grey-darken-1">{{ projectData.session }}</div>
          </v-card>
          
          <!-- Project description -->
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Description') }}</p>
          <p class="text-body-1 mb-4">{{ projectData.description }}</p>
          
          <!-- Registration requirement alert -->
          <v-alert
            v-if="!projectData.isRegistered"
            type="info"
            variant="outlined"
            class="mb-4 registration-alert"
            border="start"
            border-color="#5C6BC0"
            icon="mdi-information"
            density="comfortable"
          >
            <div class="d-flex flex-column">
              <span class="text-subtitle-2 font-weight-medium text-primary-darken-1 mb-1">
                {{ $t('Registration Required') }}
              </span>
              <p class="mb-2 text-body-2 text-blue-darken-3">
                {{ $t('You need to be registered for this experience to join this project.') }}
              </p>
              <div>
                <p class="text-body-2 font-weight-medium mb-1 text-blue-darken-3">{{ $t('Required Experience:') }}</p>
                <div class="bg-grey-lighten-5 rounded pa-2 mb-3">
                  <div class="d-flex align-center py-1">
                    <v-icon size="small" color="primary" class="me-2">mdi-school-outline</v-icon>
                    <span class="text-body-2">{{ projectData.experience }} <span class="text-caption text-grey-darken-1">({{ projectData.session }})</span></span>
                  </div>
                </div>
                <div class="d-flex justify-center">
                  <v-btn 
                    color="primary" 
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-account-school"
                    @click="registerForExperience"
                    :loading="isRegistering"
                    :disabled="isRegistering"
                  >
                    {{ $t('Register') }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-alert>
          
          <!-- Project members list -->
          <p class="text-subtitle-2 font-weight-bold mb-2">{{ $t('Project Members') }}</p>
          <v-list density="compact" class="bg-grey-lighten-5 mb-4 rounded">
            <v-list-item
              v-for="member in projectData.members"
              :key="member.id"
              :title="member.name"
              :subtitle="member.email"
              lines="two"
              class="mb-1"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-2" size="36">
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
                    {{ $t('Joined') }} {{ formatDate(member.joinDate) }}
                  </span>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider />

        <!-- Project details action buttons -->
        <v-card-actions class="justify-end pa-4">
          <v-btn variant="text" color="grey-darken-1" @click="backToCode">
            {{ $t('Back') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            variant="elevated"
            @click="confirmJoin"
            :loading="isJoining"
            :disabled="isJoining || !projectData.isRegistered"
            >
             {{ $t('Join Project') }}
            </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: 'JoinProjectDialog',

  props: {
    modelValue: { 
      type: Boolean, 
      default: false 
    },
    // New props for handling invitations
    invitations: {
      type: Array,
      default: () => []
    },
    loadingInvitations: {
      type: Boolean,
      default: false
    },
    // NEW PROP: Control whether to show only invitations or full dialog with tabs
    invitationsOnly: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'join', 'accept-invitation', 'decline-invitation', 'invitations-processed'],

  data() {
    return {
      // Form data
      invitationCode: '',
      
      // Loading states
      isLoading: false,
      isJoining: false,
      isRegistering: false,
      
      // View state
      showProjectDetails: false,
      activeTab: 'invitations',
      
      // Project information
      projectData: {
        id: '',
        name: '',
        description: '',
        experience: '',
        session: '',
        experienceInstanceId: '',
        members: [],
        isRegistered: false
      },
      
      // Invitation processing state
      processingInvitations: {},
      processedInvitations: {},
      
      // Store reference
      loggedInUserStore: useLoggedInUserStore()
    };
  },

  computed: {
    // Two-way binding for dialog visibility
    localDialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    },
    
    // Check if user has pending invitations
    hasPendingInvitations() {
      return this.invitations.length > 0;
    },
    
    // Get pending invitations from props
    pendingInvitations() {
      return this.invitations;
    },
    
    // Check if we should show tabs
    shouldShowTabs() {
      return this.hasPendingInvitations && !this.showProjectDetails && !this.invitationsOnly;
    },
    
    // Current view mode
    currentView() {
      if (this.showProjectDetails) return 'details';
      if (this.invitationsOnly && this.hasPendingInvitations) return 'invitations';
      if (this.activeTab === 'invitations' && this.hasPendingInvitations) return 'invitations';
      return 'code';
    },
    
    // Dynamic dialog title
    dialogTitle() {
      if (this.showProjectDetails) return this.$t('You are Joining...');
      if (this.currentView === 'invitations') {
        return this.pendingInvitations.length > 1 ? this.$t('Project Invitations') : this.$t('Project Invitation');
      }
      return this.$t('Join a Project');
    },
    
    // Dynamic loading text
    loadingText() {
      if (this.loadingInvitations) return this.$t('Loading invitations...');
      return this.$t('Loading project details...');
    },
    
    // Check if all invitations have been processed
    allInvitationsProcessed() {
      return this.pendingInvitations.length > 0 && 
        Object.keys(this.processedInvitations).length === this.pendingInvitations.length;
    }
  },

  watch: {
    // Set active tab based on whether user has invitations
    modelValue(newVal) {
      if (newVal) {
        if (this.invitationsOnly && this.hasPendingInvitations) {
          this.activeTab = 'invitations';
        } else if (this.hasPendingInvitations && !this.invitationsOnly) {
          this.activeTab = 'invitations';
        } else {
          this.activeTab = 'code';
        }
        
        // Reset state when dialog opens
        this.processingInvitations = {};
        this.processedInvitations = {};
      }
    },
    
    // Show loading state when invitations are being loaded
    loadingInvitations(newVal) {
      this.isLoading = newVal;
    }
  },

  methods: {
    // Format date for member join date display
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    
    // Format relative time for invitation date
    formatRelativeTime(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return this.$t('just now');
      if (diffMins < 60) return `${diffMins} ${this.$t('minutes ago')}`;
      if (diffHours < 24) return `${diffHours} ${this.$t('hours ago')}`;
      if (diffDays < 7) return `${diffDays} ${this.$t('days ago')}`;
      
      // For anything over a week, show the actual date
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    },
    
    // Handle accepting a specific invitation
    async handleAcceptInvitation(invitationId) {
      // Vue 3: Direct assignment works with reactive objects
      this.processingInvitations[invitationId] = true;
      
      try {
        await this.$emit('accept-invitation', invitationId);
        this.processedInvitations[invitationId] = 'accepted';
        
        // If single invitation, close dialog after short delay
        if (this.pendingInvitations.length === 1) {
          setTimeout(() => {
            this.localDialog = false;
            this.$emit('invitations-processed');
          }, 1000);
        }
      } catch (error) {
        console.error('Error accepting invitation:', error);
      } finally {
        this.processingInvitations[invitationId] = false;
      }
    },
    
    // Handle declining a specific invitation
    async handleDeclineInvitation(invitationId) {
      // Vue 3: Direct assignment works with reactive objects
      this.processingInvitations[invitationId] = true;
      
      try {
        await this.$emit('decline-invitation', invitationId);
        this.processedInvitations[invitationId] = 'declined';
        
        // If single invitation, close dialog after short delay
        if (this.pendingInvitations.length === 1) {
          setTimeout(() => {
            this.localDialog = false;
            this.$emit('invitations-processed');
          }, 1000);
        }
      } catch (error) {
        console.error('Error declining invitation:', error);
      } finally {
        this.processingInvitations[invitationId] = false;
      }
    },
    
    // Close dialog and emit update
    close() {
      this.localDialog = false;
      
      // If there were processed invitations, emit processed event
      if (Object.keys(this.processedInvitations).length > 0) {
        this.$emit('invitations-processed');
      }
    },
    
    // Reset dialog state when closing
    handleDialogUpdate(val) {
      if (!val) {
        setTimeout(() => {
          this.invitationCode = '';
          this.showProjectDetails = false;
          this.isLoading = false;
          this.activeTab = this.hasPendingInvitations ? 'invitations' : 'code';
        }, 300);
      }
    },
    
    // Submit invitation code and fetch project details
    async submit() {
      if (!this.invitationCode.trim()) return;
      
      this.isLoading = true;
      
      try {
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-info`;
        const inviteCodeParam = this.invitationCode.trim();

        const response = await axios.get(apiURL, {
          params: { inviteCode: inviteCodeParam }
        });
        
        // Process successful response
        if (response.data && response.data.project) {
          const project = response.data.project;
          const registrationStatus = response.data.registrationStatus || { isRegistered: false };
          
          // Extract experience and session information
          const experienceName = project.instanceId?.experience?.name || 
                                project.instanceID?.experience?.name || 
                                'Unknown Experience';
          const sessionName = project.instanceId?.sessionID?.sessionName || 
                             project.instanceID?.sessionID?.sessionName || 
                             'Unknown Session';
          
          // Map API response to component data structure
          this.projectData = {
            id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            experience: experienceName,
            session: sessionName,
            experienceInstanceId: project.instanceId?._id || project.instanceID?._id,
            members: this.mapProjectMembers(project),
            isRegistered: registrationStatus.isRegistered
          };
          
          this.showProjectDetails = true;
        } else {
          throw new Error(this.$t('Invalid response format'));
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        
        // Handle specific error responses
        if (error.response && error.response.status === 404) {
          toast.error(this.$t('Project not found. The invitation code may be invalid or expired.'), {
            position: "top-right",
            toastClassName: "Toastify__toast--delete",
            multiple: true,
          });
        } else {
          toast.error(this.$t('Invalid Project Code. Please try again.'), {
            position: "top-right",
            toastClassName: "Toastify__toast--delete",
            multiple: true,
          });
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    // Transform API project members data to component format
    mapProjectMembers(project) {
      const members = [];
      
      // Add project owner to members list
      if (project.projectOwner) {
        members.push({
          id: project.projectOwner._id,
          name: `${project.projectOwner.firstName} ${project.projectOwner.lastName}`.trim(),
          email: project.projectOwner.email || '',
          isOwner: true,
          joinDate: project.createdAt
        });
      }
      
      // Add additional project members
      if (project.projectMembers && project.projectMembers.length > 0) {
        project.projectMembers.forEach(member => {
          if (member.userID && member.userID._id !== project.projectOwner?._id) {
            members.push({
              id: member.userID._id,
              name: `${member.userID.firstName} ${member.userID.lastName}`.trim(),
              email: member.userID.email || '',
              isOwner: member.isOwner || false,
              joinDate: member.joinDate
            });
          }
        });
      }
      
      return members;
    },
    
    // Return to invitation code input view
    backToCode() {
      this.showProjectDetails = false;
      this.activeTab = 'code';
    },
    
    // Register user for the required experience
    async registerForExperience() {
      if (!this.projectData.experienceInstanceId) {
        toast.error(this.$t('Experience ID not found. Please try again.'), {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
        return;
      }
      
      this.isRegistering = true;
      
      try {
        const user = useLoggedInUserStore();
        
        // Use the store's registerSingleExperience method
        const success = await user.registerSingleExperience(this.projectData.experienceInstanceId);
        
        if (success) {
          toast.success(this.$t('Successfully registered for the experience!'), {
            position: "top-right",
            toastClassName: "Toastify__toast--create",
            multiple: true,
          });
          
          this.projectData.isRegistered = true;
        }
      } catch (error) {
        console.error('Error registering for experience:', error);
        toast.error(this.$t('Failed to register for experience. Please try again.'), {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
      } finally {
        this.isRegistering = false;
      }
    },
    
    // Confirm project join action
    async confirmJoin() {
      // Verify registration requirement is met
      if (!this.projectData.isRegistered) {
        toast.error(this.$t('You must register for the required experience before joining this project.'), {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
        return;
      }
      
      this.isJoining = true;
      
      try {
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/join`;

        // Submit join request with invitation code
        const response = await axios.post(
          apiURL,
          { inviteCode: this.invitationCode.trim() }
        );
        
        // Handle successful join
        if (response.status === 200) {
          this.close();
          
          toast.success(`${this.$t('Successfully joined')} ${this.projectData.name}!`, {
            position: "top-right",
            toastClassName: "Toastify__toast--create",
            multiple: true,
          });
          
          // Emit join event with project information
          this.$emit('join', {
            inviteCode: this.invitationCode.trim(),
            projectId: response.data.project._id,
            projectName: response.data.project.projectName
          });
        }
      } catch (error) {
        console.error('Error joining project:', error);
        
        // Handle specific join errors
        let errorMessage = this.$t('Failed to join project. Please try again later.');
        
        if (error.response) {
          switch (error.response.status) {
            case 403:
              errorMessage = this.$t('You must register for the required experience before joining this project.');
              break;
            case 404:
              errorMessage = this.$t('Project not found. The invitation code may be invalid or expired.');
              break;
            case 409:
              errorMessage = this.$t('You are already a member of this project.');
              break;
          }
        }
        
        toast.error(errorMessage, {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
      } finally {
        this.isJoining = false;
      }
    }
  }
};
</script>

<style scoped>
.registration-alert .v-alert__content {
  color: rgba(0, 0, 0, 0.87) !important;
}

.registration-alert :deep(.v-alert__title),
.registration-alert :deep(.v-alert__prepend) {
  color: #5C6BC0 !important;
}

.invitations-list {
  max-height: 400px;
  overflow-y: auto;
}

.invitation-item {
  transition: all 0.3s ease;
}

.invitation-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.invitation-item.processed {
  opacity: 0.7;
  background-color: rgba(0, 0, 0, 0.03);
}

.gap-2 {
  gap: 8px;
}

/* Custom scrollbar for invitations list */
.invitations-list::-webkit-scrollbar {
  width: 8px;
}

.invitations-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.invitations-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.invitations-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Ensure dialog doesn't jump when switching between views */
.v-dialog > .v-overlay__content > .v-card {
  transition: max-width 0.3s ease;
}
</style>