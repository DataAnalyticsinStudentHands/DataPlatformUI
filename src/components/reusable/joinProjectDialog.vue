<!-- 
joinProjectDialog.vue
Dialog component for joining projects via invitation codes. Handles code validation, 
displays project details with member lists, checks registration requirements for 
associated experiences, and processes project join requests with appropriate feedback.
-->

<template>
  <v-dialog 
    v-model="localDialog" 
    max-width="420" 
    persistent
    @update:model-value="handleDialogUpdate"
  >
    <v-card>
      <!-- Dialog header with dynamic title -->
      <v-toolbar flat color="#c8102e" dark>
        <v-toolbar-title>{{ showProjectDetails ? $t('You are Joining...') : $t('Join a Project') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Loading state during project fetch -->
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
        <p class="mt-4 text-grey-darken-1">{{ $t('Loading project details...') }}</p>
      </div>

      <!-- Project details view after successful code validation -->
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

      <!-- Initial invitation code input view -->
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
    }
  },
  emits: ['update:modelValue', 'join'],

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
      }
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
    }
  },

  methods: {
    // Format date for member join date display
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    
    // Close dialog and emit update
    close() {
      this.localDialog = false;
    },
    
    // Reset dialog state when closing
    handleDialogUpdate(val) {
      if (!val) {
        setTimeout(() => {
          this.invitationCode = '';
          this.showProjectDetails = false;
          this.isLoading = false;
        }, 300);
      }
    },
    
    // Submit invitation code and fetch project details
    async submit() {
      if (!this.invitationCode.trim()) return;
      
      this.isLoading = true;
      
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        
        if (!token) {
          throw new Error(this.$t('Authentication required'));
        }
        
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/invite-info`;
        const inviteCodeParam = this.invitationCode.trim();
        console.log('Fetching project with invite code:', inviteCodeParam);
        
        const response = await axios.get(apiURL, { 
          params: { inviteCode: inviteCodeParam },
          headers: { token }
        });
        
        // Process successful response
        if (response.data && response.data.project) {
          const project = response.data.project;
          const registrationStatus = response.data.registrationStatus || { isRegistered: false };
          
          console.log('Project data received:', project);
          console.log('Registration status:', registrationStatus);
          
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
        
    // Navigate to experiences page for manual registration
    redirectToExperiences() {
      this.close();
      this.$router.push({ name: 'experiences' });
      
      toast.info(this.$t('Please register for the required experience to join this project.'), {
        position: "top-right",
        multiple: true,
      });
    },
    
    // Confirm project join action
    async confirmJoin() {
      // Verify registration requirement is met
      if (!this.projectData.isRegistered) {
        toast.warning(this.$t('You must register for the required experience before joining this project.'), {
          position: "top-right",
          toastClassName: "Toastify__toast--warning",
          multiple: true,
        });
        return;
      }
      
      this.isJoining = true;
      
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        
        if (!token) {
          throw new Error(this.$t('Authentication required'));
        }
        
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/join`;
        
        // Submit join request with invitation code
        const response = await axios.post(
          apiURL, 
          { inviteCode: this.invitationCode.trim() }, 
          { headers: { token } }
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
</style>