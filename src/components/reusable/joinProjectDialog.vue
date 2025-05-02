<template>
  <v-dialog 
    v-model="localDialog" 
    max-width="420" 
    persistent
    @update:model-value="handleDialogUpdate"
  >
    <v-card>
      <!-- header -->
      <v-toolbar flat color="#c8102e" dark>
        <v-toolbar-title>{{ showProjectDetails ? $t('You are Joining...') : $t('Join a Project') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
        <p class="mt-4 text-grey-darken-1">{{ $t('Loading project details...') }}</p>
      </div>

      <!-- Project details view -->
      <div v-else-if="showProjectDetails">
        <v-card-text class="py-4 px-6">
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Name') }}</p>
          <p class="text-body-1 mb-3">{{ projectData.name }}</p>
          
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Experience') }}</p>
          <v-card variant="flat" class="bg-grey-lighten-5 pa-3 mb-3">
            <div class="text-body-1">{{ projectData.experience }}</div>
            <div class="text-caption text-grey-darken-1">{{ projectData.session }}</div>
          </v-card>
          
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Description') }}</p>
          <p class="text-body-1 mb-4">{{ projectData.description }}</p>
          
          <!-- Registration Status Alert -->
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
                    @click="redirectToExperiences"
                  >
                    {{ $t('Go to Experiences') }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-alert>
          
          <!-- Project Members -->
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

      <!-- Invitation code input view -->
      <div v-else>
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
    </v-card>
  </v-dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: 'JoinProjectDialog',

  /* --- two‑way binding for v-model --- */
  props: {
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'join'],

  data() {
    return {
      invitationCode: '',
      isLoading: false,
      isJoining: false,
      showProjectDetails: false,
      projectData: {
        id: '',
        name: '',
        description: '',
        experience: '',
        session: '',
        members: [],
        isRegistered: false
      }
    };
  },

  computed: {
    localDialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    
    close() {
      this.localDialog = false;
    },
    
    handleDialogUpdate(val) {
      // If dialog is closing, reset state after animation completes
      if (!val) {
        setTimeout(() => {
          this.invitationCode = '';
          this.showProjectDetails = false;
          this.isLoading = false;
        }, 300); // Wait for dialog close animation to finish
      }
    },
    
    async submit() {
      if (!this.invitationCode.trim()) return;
      
      // Show loading state
      this.isLoading = true;
      
      try {
        // Get auth token from user store
        const user = useLoggedInUserStore();
        const token = user.token;
        
        if (!token) {
          throw new Error(this.$t('Authentication required'));
        }
        
        // Construct API URL using env variable and the studentSideData path
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-info`;
        
        // Using GET with query parameters for the invite code
        const inviteCodeParam = this.invitationCode.trim();
        console.log('Fetching project with invite code:', inviteCodeParam);
        
        const response = await axios.get(apiURL, { 
          params: { inviteCode: inviteCodeParam },
          headers: { token }
        });
        
        // Process the response
        if (response.data && response.data.project) {
          const project = response.data.project;
          const registrationStatus = response.data.registrationStatus || { isRegistered: false };
          
          console.log('Project data received:', project);
          console.log('Registration status:', registrationStatus);
          
          // Extract experience and session info from the instanceId field
          const experienceName = project.instanceId?.experience?.name || 'Unknown Experience';
          const sessionName = project.instanceId?.sessionID?.sessionName || 'Unknown Session';
          
          // Map API data to component's data structure
          this.projectData = {
            id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            experience: experienceName,
            session: sessionName,
            members: this.mapProjectMembers(project),
            isRegistered: registrationStatus.isRegistered
          };
          
          // Show the project details
          this.showProjectDetails = true;
        } else {
          throw new Error(this.$t('Invalid response format'));
        }
      } catch (error) {
        // Log the actual error for debugging
        console.error('Error fetching project:', error);
        
        // Handle specific error cases
        if (error.response && error.response.status === 404) {
          toast.error(this.$t('Project not found. The invitation code may be invalid or expired.'), {
            position: "top-right",
            toastClassName: "Toastify__toast--delete",
            multiple: true,
          });
        } else {
          // Show generic error message for other errors
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
    
    // Map project members from API format to component format
    mapProjectMembers(project) {
      const members = [];
      
      // Add the project owner
      if (project.projectOwner) {
        members.push({
          id: project.projectOwner._id,
          name: `${project.projectOwner.firstName} ${project.projectOwner.lastName}`.trim(),
          email: project.projectOwner.email || '',
          isOwner: true,
          joinDate: project.createdAt
        });
      }
      
      // Add other members if they exist
      if (project.projectMembers && project.projectMembers.length > 0) {
        project.projectMembers.forEach(member => {
          // Skip if the member is already added as the owner
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
    
    backToCode() {
      this.showProjectDetails = false;
    },
    
    redirectToExperiences() {
      // Close the dialog first
      this.close();
      
      // Navigate to the experiences page
      this.$router.push({ name: 'experiences' });
      
      // Show a helpful toast message
      toast.info(this.$t('Please register for the required experience to join this project.'), {
        position: "top-right",
        multiple: true,
      });
    },
    
    async confirmJoin() {
      // Double-check registration status
      if (!this.projectData.isRegistered) {
        toast.warning(this.$t('You must register for the required experience before joining this project.'), {
          position: "top-right",
          toastClassName: "Toastify__toast--warning",
          multiple: true,
        });
        return;
      }
      
      // Show joining state
      this.isJoining = true;
      
      try {
        // Get auth token from user store
        const user = useLoggedInUserStore();
        const token = user.token;
        
        if (!token) {
          throw new Error(this.$t('Authentication required'));
        }
        
        // Construct API URL with the studentSideData path
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/join`;
        
        // Call the join project endpoint with the invite code in the body
        const response = await axios.post(
          apiURL, 
          { inviteCode: this.invitationCode.trim() }, 
          { headers: { token } }
        );
        
        // Check if join was successful
        if (response.status === 200) {
          // Close the dialog
          this.close();
          
          // Show success toast notification
          toast.success(`${this.$t('Successfully joined')} ${this.projectData.name}!`, {
            position: "top-right",
            toastClassName: "Toastify__toast--create",
            multiple: true,
          });
          
          // Emit the join event with the project info
          this.$emit('join', {
            inviteCode: this.invitationCode.trim(),
            projectId: response.data.project._id,
            projectName: response.data.project.projectName
          });
        }
      } catch (error) {
        console.error('Error joining project:', error);
        
        // Handle specific error scenarios
        let errorMessage = this.$t('Failed to join project. Please try again later.');
        
        if (error.response) {
          // Handle specific status codes
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
        
        // Show error toast notification
        toast.error(errorMessage, {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
      } finally {
        // Reset loading state
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
</style>