<!-- 
inviteMembersDialog.vue
Reusable dialog component for inviting members to projects via invite codes and direct invitations. 
Provides code sharing functionality with copy and regenerate options, plus direct user invitation
with search and selection capabilities. Supports pending invitation tracking and retraction.
-->

<template>
  <!-- Main invite members dialog -->
  <v-dialog v-model="localDialog" max-width="800px">
    <v-card>
      <v-toolbar color="#c8102e" dark>
        <v-toolbar-title>{{ $t('Invite Members to Project') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="py-4">
        <!-- Information banner -->
        <v-banner
          lines="one"
          icon="mdi-information-outline"
          class="mb-4"
        >
          <template v-slot:text>
            <div class="d-flex align-center">
              {{ $t('You can only invite users who are enrolled in') }}
              <strong class="ml-1">{{ experienceInstanceName }}</strong>
            </div>
          </template>
        </v-banner>
        
        <!-- Invite code sharing section -->
        <v-card variant="outlined" class="mb-4">
          <v-card-text>
            <v-row class="d-flex">
              <v-col cols="12" sm="7">
                <span class="text-subtitle-2 font-weight-medium">{{ $t('Share this invite code') }}</span>
                <div class="text-caption text-grey-darken-1 mt-1">
                  {{ $t('Anyone with this code can join your project') }}
                </div>
              </v-col>
              <v-col cols="12" sm="5" class="d-flex align-self-center">
                <div class="d-flex align-center w-100">
                  <!-- Read-only invite code display -->
                  <v-text-field
                    v-model="inviteCode"
                    readonly
                    variant="outlined"
                    density="compact"
                    bg-color="grey-lighten-4"
                    hide-details
                    class="flex-grow-1 mr-2"
                  ></v-text-field>
                  <!-- Copy code button -->
                  <v-btn
                    color="#c8102e"
                    variant="tonal"
                    size="small"
                    @click="copyInviteCode"
                    :title="$t('Copy code')"
                    class="mr-2"
                    height="40"
                  >
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                  <!-- Regenerate code button (conditional) -->
                  <v-btn
                    v-if="canRegenerateCode"
                    color="grey-darken-1"
                    variant="tonal"
                    size="small"
                    @click="showRegenerateConfirmation = true"
                    :title="$t('Generate new code')"
                    height="40"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <v-divider class="mb-4"></v-divider>
        
        <!-- Direct Invite Section -->
        <div class="text-subtitle-1 font-weight-medium mb-3">{{ $t('Or invite classmates directly') }}</div>
        
        <!-- Loading State -->
        <div v-if="loadingRegisteredUsers" class="text-center py-8">
          <v-progress-circular indeterminate color="#c8102e" size="48"></v-progress-circular>
          <p class="text-grey mt-3 mb-0">{{ $t('Loading registered students...') }}</p>
        </div>

        <!-- Empty State - No other students registered -->
        <div v-else-if="availableUsers.length === 0 && !searchQuery" class="text-center py-8">
          <v-icon size="56" color="grey-lighten-1">mdi-account-group-outline</v-icon>
          <p class="text-body-1 text-grey-darken-1 mt-3 mb-1">{{ $t('No other students available') }}</p>
          <p class="text-body-2 text-grey mb-0">
            {{ $t('There are no other students enrolled in this experience yet. Share your invite code instead.') }}
          </p>
        </div>

        <!-- Students List -->
        <template v-else>
          <!-- Search and Selection Counter -->
          <v-row class="mb-3">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="searchQuery"
                :label="$t('Search by name or email')"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-chip
                :color="selectedUsers.length > 0 ? '#c8102e' : 'grey'"
                variant="tonal"
                class="w-100 justify-center"
                size="large"
              >
                <v-icon start>mdi-account-check</v-icon>
                {{ selectedUsers.length }} {{ $t('selected') }}
              </v-chip>
            </v-col>
          </v-row>
          
          <!-- Students List Card -->
          <v-card variant="outlined">
            <v-card-text class="pa-0">
              <v-virtual-scroll
                :items="filteredRegisteredUsers"
                :height="Math.min(400, filteredRegisteredUsers.length * 72 + 16)"
                item-height="60"
              >
                <template v-slot:default="{ item }">
                  <v-hover v-slot:default="{ isHovering, props }">
                    <v-list-item
                      v-bind="props"
                      :class="{ 'bg-grey-lighten-4': isHovering }"
                      class="px-4"
                      density="compact"
                    >
                      <template v-slot:prepend>
                        <!-- Show checkbox for users who can be invited -->
                        <v-checkbox
                          v-if="!isAlreadyMember(item.userID) && !isAlreadyInvited(item.userID)"
                          :model-value="isUserSelected(item.userID)"
                          @update:model-value="toggleUserSelection(item)"
                          color="#c8102e"
                          hide-details
                          class="mr-2"
                        ></v-checkbox>
                        <!-- Show icon for members and invited users -->
                        <div v-else class="mr-2" style="width: 40px; display: flex; justify-content: center;">
                          <v-icon
                            :color="isAlreadyMember(item.userID) ? 'success' : 'orange'"
                            size="small"
                          >
                            {{ isAlreadyMember(item.userID) ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                          </v-icon>
                        </div>
                      </template>
                      
                      <v-list-item-title class="font-weight-medium">
                        {{ item.firstName }} {{ item.lastName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.email }}
                      </v-list-item-subtitle>
                      
                      <template v-slot:append>
                        <!-- Already member chip -->
                        <v-chip
                          v-if="isAlreadyMember(item.userID)"
                          size="small"
                          color="success"
                          variant="tonal"
                        >
                          <v-icon start size="x-small">mdi-check</v-icon>
                          {{ $t('Member') }}
                        </v-chip>
                        
                        <!-- Already invited chip with retract option -->
                        <div v-else-if="isAlreadyInvited(item.userID)" class="d-flex align-center">
                          <v-chip
                            size="small"
                            color="orange"
                            variant="tonal"
                            class="mr-2"
                          >
                            <v-icon start size="x-small">mdi-clock-outline</v-icon>
                            {{ $t('Invited') }}
                          </v-chip>
                          
                          <!-- Retract invitation button -->
                          <v-btn
                            size="small"
                            color="grey-darken-1"
                            variant="tonal"
                            @click="confirmRetractInvitation(item)"
                            :loading="retractingUsers.has(item.userID)"
                            :title="$t('Retract invitation')"
                          >
                            <v-icon size="small">mdi-cancel</v-icon>
                          </v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-hover>
                </template>
              </v-virtual-scroll>
              
              <!-- Empty search results -->
              <div v-if="filteredRegisteredUsers.length === 0" class="text-center py-8">
                <v-icon size="48" color="grey-lighten-1">mdi-account-search-outline</v-icon>
                <p class="text-grey mt-2 mb-0">
                  {{ searchQuery 
                    ? $t('No students found matching your search') 
                    : $t('All registered students are already members of this project') 
                  }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <!-- Card Actions -->
      <v-card-actions class="pa-4">
        <v-btn
          variant="text"
          color="grey-darken-1"
          @click="closeDialog"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="selectedUsers.length > 0"
          variant="text"
          color="#c8102e"
          @click="clearSelection"
          class="mr-2"
        >
          <v-icon start>mdi-close</v-icon>
          {{ $t('Clear selection') }}
        </v-btn>
        <v-btn
          :disabled="selectedUsers.length === 0"
          :loading="invitingUsers"
          color="#c8102e"
          variant="elevated"
          @click="openSendInviteConfirmation"
          prepend-icon="mdi-send"
        >
          {{ $t('Send Invitations') }} 
          <v-badge
            v-if="selectedUsers.length > 0"
            :content="selectedUsers.length"
            color="white"
            text-color="#c8102e"
            inline
            class="ml-2"
          ></v-badge>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Send invitation confirmation dialog -->
  <v-dialog v-model="showSendInviteConfirmation" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="#c8102e" size="28" class="mr-2">mdi-account-multiple-plus</v-icon>
        <span>{{ $t('Confirm Invitations') }}</span>
      </v-card-title>
      <v-card-text class="px-4 pb-2">
        <p class="mb-3">
          {{ $t('You are about to send invitations to') }} 
          <strong>{{ selectedUsers.length }}</strong> 
          {{ selectedUsers.length === 1 ? $t('student') : $t('students') }}.
        </p>
        <p class="text-grey-darken-1">
          {{ $t('They will receive an in-app notification and can accept or decline the invitation to join') }} 
          <strong>{{ projectName || $t('your project') }}</strong>.
        </p>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="grey-darken-1"
          @click="showSendInviteConfirmation = false"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
          color="#c8102e"
          variant="elevated"
          @click="sendInvitations"
          :loading="invitingUsers"
          prepend-icon="mdi-send"
        >
          {{ $t('Send Invitations') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Retract invitation confirmation dialog -->
  <v-dialog v-model="showRetractConfirmation" max-width="450px">
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="orange" size="28" class="mr-2">mdi-cancel</v-icon>
        <span>{{ $t('Retract Invitation') }}</span>
      </v-card-title>
      <v-card-text class="px-4 pb-2">
        <p class="mb-3" v-if="userToRetract">
          {{ $t('Are you sure you want to retract the invitation for') }}
          <strong>{{ userToRetract.firstName }} {{ userToRetract.lastName }}</strong>?
        </p>
        <p class="text-grey-darken-1">
          {{ $t('They will no longer be able to join the project using their current invitation.') }}
        </p>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="grey-darken-1"
          @click="showRetractConfirmation = false"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
          color="orange"
          variant="elevated"
          @click="retractInvitation"
          :loading="retractingUsers.has(userToRetract?.userID)"
          prepend-icon="mdi-cancel"
        >
          {{ $t('Retract Invitation') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Regenerate code confirmation dialog -->
  <v-dialog v-model="showRegenerateConfirmation" max-width="450px">
    <v-card>
      <v-card-title class="text-subtitle-1 px-4 pt-4">
        {{ $t('Generate new invite code?') }}
      </v-card-title>
      <v-card-text class="px-4 pb-2">
        <p>{{ $t('This will invalidate the current code. Anyone who has not used the current code will need the new one.') }}</p>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="grey-darken-1"
          @click="showRegenerateConfirmation = false"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
          color="#c8102e"
          variant="tonal"
          @click="regenerateInviteCode"
        >
          {{ $t('Generate New Code') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Invitation success feedback dialog -->
  <v-dialog v-model="inviteSuccessDialog" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="success" size="28" class="mr-2">mdi-check-circle</v-icon>
        <span>{{ $t('Invitations Sent Successfully') }}</span>
      </v-card-title>
      <v-card-text class="px-4 pb-2">
        <p class="mb-2" v-if="invitedUsersCount > 0">
          <strong>{{ invitedUsersCount }}</strong> 
          {{ invitedUsersCount === 1 ? $t('student has') : $t('students have') }} 
          {{ $t('been invited to join your project.') }}
        </p>
        <p class="mb-2" v-else>
          {{ $t('All selected users have already been invited or are already project members.') }}
        </p>
        <p class="text-grey-darken-1" v-if="invitedUsersCount > 0">
          {{ $t('They will receive an in-app notification and can accept or decline the invitation.') }}
        </p>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          color="#c8102e"
          variant="tonal"
          @click="closeSuccessDialog"
        >
          {{ $t('Done') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "InviteMembersDialog",
  emits: [
    'update:modelValue',
    'members-invited'
  ],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      default: ''
    },
    experienceInstanceName: {
      type: String,
      default: ''
    },
    experienceInstanceId: {
      type: String,
      required: true
    },
    associatedInstructorId: { 
      type: String, 
      default: null 
    },
    isProjectOwner: {
      type: Boolean,
      default: false
    },
    projectMembers: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const loggedInUserStore = useLoggedInUserStore();
    return { loggedInUserStore };
  },
  data() {
    return {
      // Dialog state management
      inviteSuccessDialog: false,
      showRegenerateConfirmation: false,
      showSendInviteConfirmation: false,
      showRetractConfirmation: false,
      
      // Loading states
      invitingUsers: false,
      loadingRegisteredUsers: false,
      retractingUsers: new Set(),
      
      // Search and selection data
      searchQuery: '',
      registeredUsers: [],
      selectedUsers: [],
      pendingInvitations: [],
      
      // Invite code data
      inviteCode: '',
      
      // Track successfully invited users count
      invitedUsersCount: 0,
      
      // User to retract invitation for
      userToRetract: null
    };
  },
  computed: {
    // Two-way binding for dialog visibility
    localDialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    
    // Check if current user can regenerate invite codes
    canRegenerateCode() {
      const currentUserId = this.loggedInUserStore.userId;
      if (this.isProjectOwner) return true;
      return (
        this.associatedInstructorId &&
        this.associatedInstructorId === currentUserId
      );
    },
    
    // Users available for invitation (excludes current user)
    availableUsers() {
      return this.registeredUsers.filter(user => 
        user.userID !== this.loggedInUserStore.userId
      );
    },
    
    // Filter registered users based on search query
    filteredRegisteredUsers() {
      let users = this.availableUsers;
      
      // Apply search filter if present
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        users = users.filter(user => {
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
          const email = user.email.toLowerCase();
          return fullName.includes(query) || email.includes(query);
        });
      }
      
      return users;
    }
  },
  watch: {
    // Initialize dialog when opened
    modelValue(newVal) {
      if (newVal === true) {
        this.initializeDialog();
      }
    },
    
    // Log experience instance changes
    experienceInstanceId: {
      immediate: true,
      handler(newVal) {
        // console.log('Experience Instance ID changed:', newVal);
      }
    }
  },
  
  // Component initialization
  mounted() {
    if (this.modelValue) {
      this.initializeDialog();
    }
  },
  
  methods: {
    // Initialize dialog data when opened
    async initializeDialog() {
      // Reset search and selection state
      this.searchQuery = '';
      this.selectedUsers = [];
      this.invitedUsersCount = 0;
      this.retractingUsers.clear();

      // Fetch required data
      await Promise.all([
        this.fetchInviteCode(),
        this.fetchRegisteredUsers(),
        this.fetchPendingInvitations()
      ]);
    },

    // Fetch users with pending invitations for this project
    async fetchPendingInvitations() {
      try {
        const token = this.loggedInUserStore.token;
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${this.projectId}/pending-invitations`,
          { headers: { token } }
        );
        
        this.pendingInvitations = response.data.pendingInvitations || [];
      } catch (error) {
        console.error("Error fetching pending invitations:", error);
        this.pendingInvitations = [];
      }
    },

    // Fetch current invite code for the project
    async fetchInviteCode() {
      try {
        const token = this.loggedInUserStore.token;
        if (!token) throw new Error('missing auth token');

        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-code`;
        const { data } = await axios.get(apiURL, {
          params: { projectId: this.projectId },
          headers: { token }
        });

        this.inviteCode = data.inviteCode ?? '';
      } catch (err) {
        console.error('Error fetching invite code:', err);
        toast.error(this.$t('Error fetching invite code.'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
        this.inviteCode = '';
      }
    },
    
    // Fetch users registered for the associated experience
    async fetchRegisteredUsers() {
      this.loadingRegisteredUsers = true;
      try {
        if (!this.experienceInstanceId) {
          console.error("Missing experienceInstanceId:", this.experienceInstanceId);
          toast.error(this.$t("Missing experience information"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
          this.registeredUsers = [];
          return;
        }

        const token = this.loggedInUserStore.token;
        
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_API}/studentSideData/experience-instances/${this.experienceInstanceId}/registered-users`,
          { headers: { token } }
        );
        
        this.registeredUsers = response.data.users || [];
      } catch (error) {
        console.error("Error fetching registered users:", error.response || error);
        toast.error(this.$t("Error loading registered students"), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
        this.registeredUsers = [];
      } finally {
        this.loadingRegisteredUsers = false;
      }
    },
    
    // Check if user is currently selected for invitation
    isUserSelected(userID) {
      return this.selectedUsers.some(user => user.userID === userID);
    },
    
    // Toggle user selection for invitation
    toggleUserSelection(user) {
      const index = this.selectedUsers.findIndex(u => u.userID === user.userID);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      } else {
        this.selectedUsers.push(user);
      }
    },
    
    // Check if user is already a project member
    isAlreadyMember(userID) {
      return this.projectMembers.some(member => 
        String(member.id) === String(userID) || String(member.userID) === String(userID)
      );
    },
    
    // Check if user already has a pending invitation
    isAlreadyInvited(userID) {
      return this.pendingInvitations.some(invitation => invitation.userID === userID);
    },
    
    // Clear all selected users
    clearSelection() {
      this.selectedUsers = [];
    },
    
    // Close the main dialog
    closeDialog() {
      this.localDialog = false;
    },
    
    // Close success dialog and emit results
    closeSuccessDialog() {
      this.inviteSuccessDialog = false;
      this.localDialog = false;
      
      // Clear state for next time
      this.searchQuery = '';
      this.selectedUsers = [];
      this.invitedUsersCount = 0;
    },
    
    // Open send invitation confirmation dialog
    openSendInviteConfirmation() {
      if (this.selectedUsers.length === 0) {
        return;
      }
      this.showSendInviteConfirmation = true;
    },
    
    // Send invitations to selected users
    async sendInvitations() {
      if (this.selectedUsers.length === 0) {
        return;
      }
      
      this.showSendInviteConfirmation = false;
      this.invitingUsers = true;
      
      try {
        const token = this.loggedInUserStore.token;
        const payload = {
          projectId: this.projectId,
          userIds: this.selectedUsers.map(user => user.userID),
          notificationType: 'in-app'
        };
        
        const response = await axios.post(
          `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-members`, 
          payload,
          { headers: { token } }
        );
        
        // Handle detailed response from backend
        const { invitedCount, alreadyInvitedCount, alreadyMembersCount, invitedUsers } = response.data;
        
        // Store invited users count for success dialog
        this.invitedUsersCount = invitedCount || 0;
        
        // Show success dialog
        this.inviteSuccessDialog = true;
        
        // Refresh pending invitations to update UI
        await this.fetchPendingInvitations();
        
        // Format invited members for parent component
        const invitedMembers = (invitedUsers || []).map(user => ({
          userID: user.userID,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: 'Member',
          isOwner: false,
          joinDate: new Date()
        }));
        
        this.$emit('members-invited', invitedMembers);
        
        // Show warning if some users couldn't be invited
        if (alreadyInvitedCount > 0 || alreadyMembersCount > 0) {
          const skippedCount = alreadyInvitedCount + alreadyMembersCount;
          toast.warning(
            this.$t(`${skippedCount} user(s) were skipped (already invited or members)`), 
            {
              position: 'top-right',
              toastClassName: 'Toastify__toast--warning',
              multiple: true
            }
          );
        }
      } catch (error) {
        console.error("Error sending invitations:", error.response || error);
        
        // Handle specific error messages from backend
        if (error.response?.data?.error) {
          toast.error(this.$t(error.response.data.error), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        } else {
          toast.error(this.$t("Error sending invitations. Please try again later."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        }
      } finally {
        this.invitingUsers = false;
      }
    },
    
    // Confirm retraction of invitation
    confirmRetractInvitation(user) {
      this.userToRetract = user;
      this.showRetractConfirmation = true;
    },
    
    // Retract invitation for a user
    async retractInvitation() {
      if (!this.userToRetract) return;
      
      const userID = this.userToRetract.userID;
      this.retractingUsers.add(userID);
      this.showRetractConfirmation = false;
      
      try {
        const token = this.loggedInUserStore.token;
        const payload = {
          projectId: this.projectId,
          userIdToRetract: userID
        };
        
        await axios.delete(
          `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/retract-invitation`,
          { 
            headers: { token },
            data: payload
          }
        );
        
        // Refresh pending invitations to update UI
        await this.fetchPendingInvitations();
        
        // Show success message
        toast.success(
          this.$t(`Invitation retracted for ${this.userToRetract.firstName} ${this.userToRetract.lastName}`),
          {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create',
            multiple: true
          }
        );
        
      } catch (error) {
        console.error("Error retracting invitation:", error.response || error);
        
        // Handle specific error messages from backend
        if (error.response?.data?.error) {
          toast.error(this.$t(error.response.data.error), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        } else {
          toast.error(this.$t("Error retracting invitation. Please try again later."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        }
      } finally {
        this.retractingUsers.delete(userID);
        this.userToRetract = null;
      }
    },
    
    // Copy invite code to clipboard
    copyInviteCode() {
      navigator.clipboard.writeText(this.inviteCode)
        .then(() => {
          toast.info(this.$t("Copied to clipboard!"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--update',
            multiple: true
          });
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
          toast.error(this.$t("Failed to copy code"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        });
    },
    
    // Generate new invite code for the project
    async regenerateInviteCode() {
      this.showRegenerateConfirmation = false;

      try {
        const token = this.loggedInUserStore.token;
        if (!token) throw new Error('missing auth token');

        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-code`;
        
        const { data } = await axios.patch(
          apiURL,
          { projectId: this.projectId },
          { headers: { token } }
        );

        this.inviteCode = data.inviteCode ?? '';

        toast.info(this.$t('New invite code generated'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--update',
          multiple: true
        });
      } catch (err) {
        console.error('Error regenerating invite code:', err);
        toast.error(this.$t('Failed to regenerate invite code'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
      }
    }
  }
};
</script>

<style scoped>
/* Smooth transitions for list items */
.v-list-item {
  transition: background-color 0.2s ease;
}

/* Custom scrollbar for virtual scroll */
:deep(.v-virtual-scroll__container) {
  scrollbar-width: thin;
  scrollbar-color: #c8102e20 transparent;
}

:deep(.v-virtual-scroll__container::-webkit-scrollbar) {
  width: 8px;
}

:deep(.v-virtual-scroll__container::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.v-virtual-scroll__container::-webkit-scrollbar-thumb) {
  background-color: #c8102e20;
  border-radius: 4px;
}

:deep(.v-virtual-scroll__container::-webkit-scrollbar-thumb:hover) {
  background-color: #c8102e40;
}

/* Chip animations */
.v-chip {
  transition: all 0.2s ease;
}

/* Loading overlay animation */
:deep(.v-card__loader) {
  opacity: 0.8;
}
</style>