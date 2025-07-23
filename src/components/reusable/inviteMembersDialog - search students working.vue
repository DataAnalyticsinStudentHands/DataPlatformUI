<template>
  <!-- Invite Members Dialog -->
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
        
        <!-- Invite Code Section -->
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
                  <v-text-field
                    v-model="inviteCode"
                    readonly
                    variant="outlined"
                    density="compact"
                    bg-color="grey-lighten-4"
                    hide-details
                    class="flex-grow-1 mr-2"
                  ></v-text-field>
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
        <!-- <div class="text-subtitle-1 font-weight-medium mb-3">{{ $t('Or invite classmates directly') }}</div> -->
        
        <!-- Search and Selection Counter -->
        <!-- <v-row class="mb-3">
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
        </v-row> -->
        
        <!-- Students List - Simplified without avatars -->
        <!-- <v-card variant="outlined" :loading="loadingRegisteredUsers">
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
                      <v-checkbox
                        :model-value="isUserSelected(item.userID)"
                        @update:model-value="toggleUserSelection(item)"
                        color="#c8102e"
                        hide-details
                        class="mr-2"
                      ></v-checkbox>
                    </template>
                    
                    <v-list-item-title class="font-weight-medium">
                      {{ item.firstName }} {{ item.lastName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.email }}
                    </v-list-item-subtitle>
                    
                    <template v-slot:append>
                      <v-chip
                        v-if="isAlreadyMember(item.userID)"
                        size="small"
                        color="success"
                        variant="tonal"
                      >
                        <v-icon start size="x-small">mdi-check</v-icon>
                        {{ $t('Already member') }}
                      </v-chip>
                      <v-chip
                        v-else-if="item.invitationStatus === 'pending'"
                        size="small"
                        color="orange"
                        variant="tonal"
                      >
                        <v-icon start size="x-small">mdi-clock-outline</v-icon>
                        {{ $t('Invitation pending') }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-hover>
              </template>
            </v-virtual-scroll>
            
            <div v-if="filteredRegisteredUsers.length === 0 && !loadingRegisteredUsers" class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1">mdi-account-search-outline</v-icon>
              <p class="text-grey mt-2">{{ searchQuery ? $t('No students found matching your search') : $t('No students found in this experience') }}</p>
            </div>
          </v-card-text>
        </v-card> -->
        
        <!-- Loading State -->
        <!-- <div v-if="loadingRegisteredUsers" class="text-center py-4">
          <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
        </div> -->
      </v-card-text>
      
      <!-- <v-divider></v-divider> -->
      
      <!-- <v-card-actions class="pa-4">
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
          @click="sendInvitations"
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
      </v-card-actions> -->
    </v-card>
  </v-dialog>

  <!-- Regenerate Confirmation Dialog -->
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

  <!-- Invitation Success Dialog -->
  <v-dialog v-model="inviteSuccessDialog" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="success" size="28" class="mr-2">mdi-check-circle</v-icon>
        <span>{{ $t('Invitations Sent Successfully') }}</span>
      </v-card-title>
      <v-card-text class="px-4 pb-2">
        <p class="mb-2">
          <strong>{{ selectedUsers.length }}</strong> 
          {{ selectedUsers.length === 1 ? $t('student has') : $t('students have') }} 
          {{ $t('been invited to join your project.') }}
        </p>
        <p class="text-grey-darken-1">{{ $t('They will receive an in-app notification and can accept or decline the invitation.') }}</p>
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
    associatedInstructorId: { type: String, default: null },
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
      inviteSuccessDialog: false,
      invitingUsers: false,
      loadingRegisteredUsers: false,
      searchQuery: '',
      registeredUsers: [],
      selectedUsers: [],
      inviteCode: '',
      showRegenerateConfirmation: false,
    };
  },
  computed: {
    localDialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    canRegenerateCode() {
      const currentUserId = this.loggedInUserStore.userId;
      if (this.isProjectOwner) return true;
      return (
        this.associatedInstructorId &&
        this.associatedInstructorId === currentUserId
      );
    },
    filteredRegisteredUsers() {
      if (!this.searchQuery) {
        return this.registeredUsers.filter(user => !this.isAlreadyMember(user.userID));
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.registeredUsers.filter(user => {
        if (this.isAlreadyMember(user.userID)) return false;
        
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal === true) {
        console.log('Dialog opened, calling initializeDialog');
        this.initializeDialog();
      }
    },
    experienceInstanceId: {
      immediate: true,
      handler(newVal) {
        console.log('Experience Instance ID changed:', newVal);
      }
    }
  },
  mounted() {
    if (this.modelValue) {
      console.log('Dialog mounted with open state, initializing');
      this.initializeDialog();
    }
  },
  methods: {
    async initializeDialog() {
      console.log('Initializing dialog for project ID:', this.projectId);
      console.log('Experience Instance ID:', this.experienceInstanceId);
      
      // Reset search and selection
      this.searchQuery = '';
      this.selectedUsers = [];

      // Fetch necessary data
      await Promise.all([
        this.fetchInviteCode(),
        this.fetchRegisteredUsers()
      ]);
    },

    async fetchInviteCode() {
      console.log('Fetching invite code for project ID:', this.projectId);
      try {
        const token = this.loggedInUserStore.token;
        if (!token) throw new Error('missing auth token');

        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-code`;
        const { data } = await axios.get(apiURL, {
          params: { projectId: this.projectId },
          headers: { token }
        });

        console.log('Invite code response:', data);
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
        console.log(`Fetching registered users from: /studentSideData/experience-instances/${this.experienceInstanceId}/registered-users`);
        
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_API}/studentSideData/experience-instances/${this.experienceInstanceId}/registered-users`,
          { headers: { token } }
        );
        
        this.registeredUsers = response.data.users || [];
        console.log('Registered users loaded:', this.registeredUsers.length);
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
    
    isUserSelected(userID) {
      return this.selectedUsers.some(user => user.userID === userID);
    },
    
    toggleUserSelection(user) {
      const index = this.selectedUsers.findIndex(u => u.userID === user.userID);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      } else {
        this.selectedUsers.push(user);
      }
    },
    
    isAlreadyMember(userID) {
      return this.projectMembers.some(member => member.userID === userID);
    },
    
    clearSelection() {
      this.selectedUsers = [];
    },
    
    closeDialog() {
      this.localDialog = false;
    },
    
    closeSuccessDialog() {
      this.inviteSuccessDialog = false;
      this.localDialog = false;
      this.$emit('members-invited', this.selectedUsers);
    },
    
    async sendInvitations() {
      if (this.selectedUsers.length === 0) {
        return;
      }
      
      this.invitingUsers = true;
      
      try {
        const token = this.loggedInUserStore.token;
        const payload = {
          projectId: this.projectId,
          userIds: this.selectedUsers.map(user => user.userID),
          notificationType: 'in-app' // Specify in-app notification
        };
        
        console.log('Sending invitation payload:', payload);
        
        await axios.post(
          `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-members`, 
          payload,
          { headers: { token } }
        );
        
        // Show success dialog
        this.inviteSuccessDialog = true;
        
        // Format the invited members for emitting to parent
        const invitedMembers = this.selectedUsers.map(user => ({
          userID: user.userID,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: 'Member',
          isOwner: false,
          joinDate: new Date()
        }));
        
        this.$emit('members-invited', invitedMembers);
      } catch (error) {
        console.error("Error sending invitations:", error);
        toast.error(this.$t("Error sending invitations. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
      } finally {
        this.invitingUsers = false;
      }
    },
    
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

        console.log('New invite code received:', data);
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