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
        
        <!-- <div class="text-subtitle-1 font-weight-medium mb-3">{{ $t('Or invite members directly') }}</div> -->
        
        <!-- Search Bar with Counter -->
        <!-- <v-row class="mb-2">
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="searchQuery"
              :label="$t('Search by name or email')"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              @update:model-value="filterUsers"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-self-center">
            <v-badge
              :content="selectedUsers.length.toString()"
              :color="selectedUsers.length > 0 ? '#c8102e' : 'grey'"
              location="top start"
              offset-x="15"
              offset-y="15"
            >
              <v-btn
                :color="selectedUsers.length > 0 ? '#c8102e' : 'grey'"
                :disabled="selectedUsers.length === 0"
                variant="tonal"
                block
                @click="clearSelection"
                prepend-icon="mdi-account-multiple"
              >
                {{ selectedUsers.length === 0 ? $t('No users selected') : $t('users selected') }}
              </v-btn>
            </v-badge>
          </v-col>
        </v-row> -->
        
        <!-- Users Table with Custom Styling -->
        <!-- <v-card variant="outlined" class="mt-2">
          <v-data-table
            v-model="selectedUsers"
            :headers="userHeaders"
            :items="filteredUsers"
            :loading="loadingUsers"
            item-value="id"
            density="comfortable"
            hover
            show-select
          >
            <template v-slot:item.name="{ item }">
              <div class="py-1">
                {{ item.firstName }} {{ item.lastName }}
              </div>
            </template>
            <template v-slot:item.invitation="{ item }">
              <v-chip
                v-if="item.invitationStatus"
                size="small"
                :color="item.invitationStatus === 'Invited' ? 'blue' : 'grey-lighten-1'"
              >
                {{ item.invitationStatus }}
              </v-chip>
              <span v-else></span>
            </template>
          </v-data-table>
        </v-card> -->
      </v-card-text>
      
      <!-- <v-divider></v-divider>
      
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
          :disabled="selectedUsers.length === 0"
          :loading="invitingUsers"
          color="#c8102e"
          variant="elevated"
          @click="sendInvitations"
        >
          <v-icon class="mr-1">mdi-send</v-icon>
          {{ $t('Send Invitations') }} ({{ selectedUsers.length }})
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
          @click="closeSuccessDialog"
        >
          {{ $t('Close') }}
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
    associatedInstructorId: { type: String, default: null },
    isProjectOwner: {
      type: Boolean,
      default: false
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
      loadingUsers: false,
      loadingMembers: false,
      searchQuery: '',
      userHeaders: [
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Invitation', key: 'invitation' }
      ],
      availableUsers: [],
      filteredUsers: [],
      selectedUsers: [],
      projectMembers: [], // Managed internally now
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

   // parent tells us directly if user is owner; no need to recompute
   if (this.isProjectOwner) return true;

   // user may still be the course instructor
   return (
     this.associatedInstructorId &&
     this.associatedInstructorId === currentUserId
   );
  },
},
  watch: {
    modelValue(newVal) {
      if (newVal === true) {
        this.initializeDialog();
      }
    }
  },
  // Add mounted hook to initialize if dialog is already open when component mounts
  mounted() {
    if (this.modelValue) {
      this.initializeDialog();
    }
  },
  methods: {
    async initializeDialog() {
      
      // Reset search and selection
      this.searchQuery = '';
      this.selectedUsers = [];

      // Always fetch the current code from the backend
      await this.fetchInviteCode();

      // Load project members first, then available users
      await this.fetchProjectMembers();
      await this.loadAvailableUsers();
    },

    async fetchInviteCode() {
      try {
        // 1) Grab the JWT token
        const token = this.loggedInUserStore.token;
        if (!token) throw new Error('missing auth token');

        // 2) API endpoint for getting invite code
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-code`;

        // 3) Make the API call with projectId as query parameter
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

    
    async fetchProjectMembers() {
      this.loadingMembers = true;
      try {
        // In real implementation, make API call
        // const user = /* get user from store */
        // const token = user.token;
        // const response = await axios.get(
        //   `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${this.projectId}/members`,
        //   { headers: { token } }
        // );
        // this.projectMembers = response.data;
        
        // For now, mock data - FIXED: Use userID to match schema
        await new Promise(resolve => setTimeout(resolve, 300));
        
        this.projectMembers = [
          {
            userID: this.loggedInUserStore.userId, // FIXED: Use userID instead of id
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Owner',
            isOwner: true,
            joinDate: new Date('2023-01-15')
          },
          {
            userID: 'usr002', // FIXED: Use userID instead of id
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'Member',
            isOwner: false,
            joinDate: new Date('2023-02-20')
          }
        ];
        
      } catch (error) {
        console.error("Error fetching project members:", error);
        toast.error(this.$t("Error loading project members"), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
        this.projectMembers = [];
      } finally {
        this.loadingMembers = false;
      }
    },
    
    closeDialog() {
      this.localDialog = false;
    },
    
    closeSuccessDialog() {
      this.inviteSuccessDialog = false;
      this.localDialog = false; // Also close the main dialog
      this.$emit('members-invited', this.selectedUsers);
    },
    
    async loadAvailableUsers() {
      this.loadingUsers = true;
      
      try {
        // In real implementation, make API call
        // const response = await axios.get(
        //   `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${this.projectId}/eligible-members`
        // );
        // this.availableUsers = response.data;
        
        // For now, mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.availableUsers = [
          {
            id: 'usr003',
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice.johnson@example.com',
            role: 'Student',
            userStatus: 'Active',
            invitationStatus: '',
            organizationID: ['org123']
          },
          {
            id: 'usr004',
            firstName: 'Bob',
            lastName: 'Williams',
            email: 'bob.williams@example.com',
            role: 'Student',
            userStatus: 'Active',
            invitationStatus: 'Invited',
            organizationID: ['org123']
          },
          {
            id: 'usr005',
            firstName: 'Carol',
            lastName: 'Martinez',
            email: 'carol.martinez@example.com',
            role: 'Student',
            userStatus: 'Active',
            invitationStatus: '',
            organizationID: ['org123']
          },
          {
            id: 'usr006',
            firstName: 'Dave',
            lastName: 'Brown',
            email: 'dave.brown@example.com',
            role: 'Student',
            userStatus: 'Active',
            invitationStatus: '',
            organizationID: ['org123']
          }
        ];
        
        this.filterUsers();
      } catch (error) {
        console.error("Error loading available users:", error);
        toast.error(this.$t("Error loading available users."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
        this.availableUsers = [];
        this.filteredUsers = [];
      } finally {
        this.loadingUsers = false;
      }
    },
    
    filterUsers() {
      this.loadingUsers = true;
      
      // Filter by search query
      let result = this.availableUsers.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        const query = this.searchQuery.toLowerCase();
        
        return fullName.includes(query) || email.includes(query);
      });
      
      // Exclude users who are already members - FIXED: Use userID for comparison
      const existingMemberIds = this.projectMembers.map(member => member.userID);
      result = result.filter(user => !existingMemberIds.includes(user.id));
      
      this.filteredUsers = result;
      
      // Simulate loading
      setTimeout(() => {
        this.loadingUsers = false;
      }, 300);
    },
    
    clearSelection() {
      this.selectedUsers = [];
    },
    
    async sendInvitations() {
      if (this.selectedUsers.length === 0) {
        return;
      }
      
      this.invitingUsers = true;
      
      try {
        // In a real implementation, you would make an API call here
        // Example:
        const token = this.loggedInUserStore.token;
        const payload = {
          projectId: this.projectId,
          userIds: this.selectedUsers
        };
        
        
        // Uncomment to enable real API call
        // await axios.post(
        //   `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-members`, 
        //   payload,
        //   { headers: { token } }
        // );
        
        // Simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get the selected user details for emitting back to parent
        const selectedUserDetails = this.selectedUsers.map(userId => {
          const user = this.availableUsers.find(u => u.id === userId);
          if (user) {
            return {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: 'Member',
              isOwner: false,
              joinDate: new Date()
            };
          }
          return null;
        }).filter(Boolean);
        
        // Show success dialog
        this.inviteSuccessDialog = true;
        
        // Emit the invited members so the parent component can update its list
        this.$emit('members-invited', selectedUserDetails);
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
          // Show a toast notification
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
      // disable the confirmation dialog immediately
      this.showRegenerateConfirmation = false;

      try {
        const token = this.loggedInUserStore.token;
        if (!token) throw new Error('missing auth token');

        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-code`;

        
        // PATCH { projectId }  →  { inviteCode: 'PRJ-XXXXXX' }
        const { data } = await axios.patch(
          apiURL,
          { projectId: this.projectId },
          { headers: { token } }
        );

        
        // Update the UI with the freshly generated code returned by the backend
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
    },
    
    // Utility methods
    getRoleColor(role) {
      switch (role) {
        case 'Student':
          return 'green';
        case 'Instructor':
          return 'blue';
        default:
          return 'grey';
      }
    },
    
    getStatusChipColor(status) {
      switch (status) {
        case 'Active':
          return 'success';
        case 'Pending':
          return 'warning';
        case 'Inactive':
          return 'error';
        default:
          return 'grey';
      }
    }
  }
};
</script>

<style scoped>
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
</style>