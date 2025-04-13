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
              <div v-if="projectData.status !== 'Proposed'" class="status-badge d-inline-flex align-center px-3 py-1">
                <v-icon size="small" :color="getStatusColor(projectData.status)" class="mr-1">mdi-circle</v-icon>
                <span :class="`text-${getStatusColor(projectData.status)}`">{{ projectData.status }}</span>
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
            <v-col cols="12" md="8">
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
              
              <!-- Project Members card - Using Design 1 version -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-account-group" class="mr-2"></v-icon>
                  {{ $t('Project Members') }}
                  <v-spacer></v-spacer>
                  <v-btn
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
            <v-col cols="12" md="4">
              <!-- Experience & Instructor info card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-school" class="mr-2"></v-icon>
                  {{ $t('Course Information') }}
                </v-card-title>
                
                <v-card-text class="pa-4">
                  <!-- Experience - Made more visible with tooltip on entire component -->
                  <p class="font-weight-black text-h8 mb-2">
                    {{ $t('Associated Experience') }}
                  </p>
                  <v-tooltip
                    location="bottom"
                    text="The associated experience cannot be changed after project creation"
                    :offset="2"
                    open-delay="200"
                    class="tooltip-close"
                  >
                    <template v-slot:activator="{ props }">
                      <div v-bind="props">
                        <v-select
                          v-model="projectData.experienceInstanceId"
                          :items="experienceInstances"
                          item-title="experienceInstanceName"
                          item-value="experienceInstanceId"
                          :label="$t('Experience')"
                          :error="isExperienceInvalid"
                          :error-messages="experienceErrorMessages"
                          :loading="isLoadingExperiences"
                          required
                          outlined
                          readonly
                          class="mb-4"
                        ></v-select>
                      </div>
                    </template>
                  </v-tooltip>
                  
                  <!-- Instructor - Redesigned without avatar as requested -->
                  <p class="font-weight-black text-h8 mb-2">
                    {{ $t('Associated Instructor') }}
                  </p>
                  <v-card variant="outlined" class="pa-3 mb-3 bg-grey-lighten-5">
                    <div>
                      <div class="text-body-1 font-weight-medium">{{ projectData.instructorName || $t('Not Assigned') }}</div>
                      <div class="text-caption d-flex align-center">
                        <v-icon size="small" class="mr-1">mdi-email-outline</v-icon>
                        {{ projectData.instructorEmail || $t('No email available') }}
                      </div>
                    </div>
                  </v-card>
                </v-card-text>
              </v-card>
              
              <!-- Project activity timeline card -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon start icon="mdi-clock-outline" class="mr-2"></v-icon>
                  {{ $t('Project Timeline') }}
                </v-card-title>
                
                <v-card-text class="pa-4">
                  <v-timeline density="compact" class="mb-0">
                    <v-timeline-item
                      dot-color="#c8102e"
                      size="small"
                    >
                      <div class="text-caption text-grey mb-1">{{ new Date().toLocaleDateString() }}</div>
                      <div class="text-body-2">{{ $t('Project updated') }}</div>
                    </v-timeline-item>
                    <v-timeline-item
                      dot-color="grey"
                      size="small"
                    >
                      <div class="text-caption text-grey mb-1">{{ new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString() }}</div>
                      <div class="text-body-2">{{ $t('Project created') }}</div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- Original buttons positioning -->
          <v-row class="mt-6">
            <v-col class="d-flex align-center">
              <!-- Back button -->
              <v-btn 
                @click="$router.back()"
                class="mr-4"
              >
                {{ $t('Back') }}
              </v-btn>

              <!-- Update project button -->
              <v-btn 
                type="submit"
                class="update-btn"
                :loading="updateLoading"
              >
                {{ $t('Update Project') }}
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

    <!-- Invite Members Dialog -->
    <v-dialog v-model="inviteDialog" max-width="800px">
      <v-card>
        <v-toolbar color="#c8102e" dark>
          <v-toolbar-title>{{ $t('Invite Members to Project') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="inviteDialog = false">
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
                <strong class="ml-1">{{ projectData.experienceInstanceName }}</strong>
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
          
          <div class="text-subtitle-1 font-weight-medium mb-3">{{ $t('Or invite members directly') }}</div>
          
          <!-- Search Bar with Counter -->
          <v-row class="mb-2">
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
          </v-row>
          
          <!-- Users Table with Custom Styling -->
          <v-card variant="outlined" class="mt-2">
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
          </v-card>
        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions class="pa-4">
          <v-btn
            variant="text"
            color="grey-darken-1"
            @click="inviteDialog = false"
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
        </v-card-actions>
      </v-card>

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
            @click="inviteSuccessDialog = false"
          >
            {{ $t('Close') }}
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

export default {
  name: "EditProject",
  data() {
    return {
      loading: true,
      formSubmitted: false,
      submitDialog: false,
      inviteDialog: false,
      inviteSuccessDialog: false,
      updateLoading: false,
      invitingUsers: false,
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
        status: 'Proposed'
      },
      experienceInstances: [],
      experienceInstancesLoaded: false,
      // Current project members
      projectMembers: [],
      // For inviting users
      searchQuery: '',
      roleFilter: 'All Roles',
      userHeaders: [
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Invitation', key: 'invitation' }
      ],
      availableUsers: [], // Will be populated with mock data
      filteredUsers: [],
      selectedUsers: [],
      // Rules for validation
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
        "community",
        "coding",
        "outreach",
        "education",
        "innovation",
        "campus",
        "technology",
        "empowerment",
        "collaboration",
        "digital",
        "learning",
        "network",
        "nonprofit",
        "humanity",
        "social impact"
      ],
      selectedTags: [],
      inviteCode: this.generateInviteCode(), // Generate a code when the component loads
      showRegenerateConfirmation: false,
    };
  },
  computed: {
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
    isExperienceInvalid() {
      if (!this.formSubmitted) return false;
      return !this.projectData.experienceInstanceId;
    },
    experienceErrorMessages() {
      return this.isExperienceInvalid ? [this.$t('Please select an experience')] : [];
    },
    hasValidationErrors() {
      if (!this.formSubmitted) return false;
      return this.isNameInvalid || this.isDescriptionInvalid || this.isExperienceInvalid;
    }
  },
  async mounted() {
    console.log('EditProject mounted');
    // In case navigation data is lost, retrieve from query param if available
    const user = useLoggedInUserStore();
    
    if (!user.navigationData || !user.navigationData.projectID) {
      console.error('Project ID not found in navigation data');
      toast.error(this.$t("Cannot find project information. Returning to projects list."), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--delete',
        multiple: false
      });
      this.$router.push({ name: 'studentProjects' });
      return;
    }
    
    console.log('Found project ID in navigation data:', user.navigationData.projectID);
    
    // Continue with normal flow
    await this.fetchProjectData(user.navigationData.projectID);
    await this.fetchStudentExperienceInstances();
    
    // Initialize mock data for testing
    this.initializeMockData();
  },
  methods: {
    async fetchProjectData(projectId) {
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
          this.$router.push({ name: 'studentProjects' });
          return;
        }
        
        console.log('Fetching project data for ID:', projectId);
        
        // Use the new GET project endpoint for a single project
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${projectId}`;
        
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data) {
          const project = response.data;
          
          console.log('Received project data:', project);
          
          // Set project data
          this.projectData = {
            _id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            status: project.status,
            experienceInstanceId: project.experiences && project.experiences.length > 0 
              ? project.experiences[0].id 
              : null,
            experienceInstanceName: project.experiences && project.experiences.length > 0 
              ? project.experiences[0].experienceName 
              : 'Unknown Experience',
            instructorId: project.instructor ? project.instructor.id : null,
            instructorName: project.instructor ? project.instructor.name : 'Not Assigned',
            instructorEmail: project.instructor ? project.instructor.email : ''
          };
          
          // Set selected tags
          this.selectedTags = project.tags || [];
          
          // Set project members
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
    
    async fetchStudentExperienceInstances() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/registered-experiences`;
      
      this.isLoadingExperiences = true;
      
      try {
        const resp = await axios.get(apiURL, { headers: { token } });
        
        // Map the returned data to the format we need for the dropdown
        this.experienceInstances = resp.data.map(registration => ({
          experienceInstanceId: registration.experienceInstance.id,
          experienceInstanceName: `${registration.experienceInstance.name} (${registration.session.name})`
        }));
        
        this.experienceInstancesLoaded = true;
      } catch (error) {
        console.error("Error fetching registered experiences:", error);
        toast.error(this.$t("Error loading your experiences. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.isLoadingExperiences = false;
      }
    },
    
    async openSubmitDialog() {
      this.formSubmitted = true;
      
      // Check for validation errors with the enhanced validation
      const nameValid = this.projectData.name && 
                       this.projectData.name.trim() !== '' && 
                       this.projectData.name.length >= 3 && 
                       this.projectData.name.length <= 100;
                       
      const descriptionValid = this.projectData.description && 
                              this.projectData.description.trim() !== '' && 
                              this.projectData.description.length >= 10 && 
                              this.projectData.description.length <= 5000;
                              
      // Only proceed if all validations pass
      if (nameValid && descriptionValid) {
        // If validation passes, show the confirmation dialog
        this.submitDialog = true;
      } else {
        // If validation fails, show error toast
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      }
    },
    
    confirmUpdate() {
      // Close the dialog
      this.submitDialog = false;
      
      // Update the project
      this.updateProject();
    },
    
    async updateProject() {
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
          notes: 'Updated via web interface'
        };
        
        console.log('Updating project with payload:', projectPayload);
        
        await axios.put(apiURL, projectPayload, { headers: { token } });

        user.navigationData = {
          toastType: 'info',
          toastMessage: 'Project updated successfully!',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--update'
        };
        
        // Redirect to projects list
        this.$router.push({ name: 'studentProjects' });
      } catch (error) {
        console.error("Error updating project:", error);
        
        // Check for validation errors from the backend
        if (error.response && error.response.data && error.response.data.errors) {
          // Show first validation error from the server
          const serverErrors = error.response.data.errors;
          if (serverErrors.length > 0) {
            toast.error(serverErrors[0], {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
            return;
          }
        }
        
        // Generic error message if no specific error was provided
        toast.error(this.$t("Error updating your project. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.updateLoading = false;
      }
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'Active':
          return 'green';
        case 'In Progress':
          return 'blue';
        case 'Proposed':
        case 'Pending':
        case 'Under Review':
          return 'orange';
        default:
          return 'grey';
      }
    },
    
    getStatusTextColor(status) {
      // For better contrast
      switch (status) {
        case 'Active':
        case 'In Progress':
        case 'Proposed':
        case 'Pending':
        case 'Under Review':
          return 'white';
        default:
          return 'black';
      }
    },
    
    // Methods for invitation functionality
    initializeMockData() {
      // Mock data for current project members
      this.projectMembers = [
        {
          id: 'usr001',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Owner',
          isOwner: true,
          joinDate: new Date('2023-01-15')
        },
        {
          id: 'usr002',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'Member',
          isOwner: false,
          joinDate: new Date('2023-02-20')
        }
      ];
      
      // Mock data for available users to invite
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
        },
        {
          id: 'usr007',
          firstName: 'Ethan',
          lastName: 'Garcia',
          email: 'ethan.garcia@example.com',
          role: 'Student',
          userStatus: 'Pending',
          invitationStatus: 'Invited',
          organizationID: ['org123']
        },
        {
          id: 'usr008',
          firstName: 'Fiona',
          lastName: 'Rodriguez',
          email: 'fiona.rodriguez@example.com',
          role: 'Student',
          userStatus: 'Active',
          invitationStatus: '',
          organizationID: ['org123']
        },
        {
          id: 'usr009',
          firstName: 'George',
          lastName: 'Wilson',
          email: 'george.wilson@example.com',
          role: 'Student',
          userStatus: 'Active',
          invitationStatus: '',
          organizationID: ['org123']
        },
        {
          id: 'usr010',
          firstName: 'Hannah',
          lastName: 'Thomas',
          email: 'hannah.thomas@example.com',
          role: 'Student',
          userStatus: 'Active',
          invitationStatus: '',
          organizationID: ['org123']
        }
      ];
      
      // Initialize filtered users
      this.filteredUsers = [...this.availableUsers];
    },
    
    openInviteDialog() {
      this.searchQuery = '';
      this.roleFilter = 'All Roles';
      this.selectedUsers = [];
      this.filterUsers();
      this.inviteDialog = true;
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
      
      // Exclude users who are already members
      const existingMemberIds = this.projectMembers.map(member => member.id);
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
    },
    
    async sendInvitations() {
      if (this.selectedUsers.length === 0) {
        return;
      }
      
      this.invitingUsers = true;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the selected user details
      const selectedUserDetails = this.availableUsers.filter(user => 
        this.selectedUsers.includes(user.id)
      );
      
      console.log('Inviting users:', selectedUserDetails);
      
      // Add the invited users to the project members (for demo purposes)
      const newMembers = selectedUserDetails.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: 'Member',
        isOwner: false,
        joinDate: new Date()
      }));
      
      this.projectMembers = [...this.projectMembers, ...newMembers];
      
      // Close the invite dialog and show success dialog
      this.invitingUsers = false;
      this.inviteDialog = false;
      this.inviteSuccessDialog = true;
    },
    generateInviteCode() {
      // This is a simple example - you might want to get this code from your backend instead
      return 'PRJ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    },

    copyInviteCode() {
      navigator.clipboard.writeText(this.inviteCode)
        .then(() => {
          // Show a toast notification
          toast.info(this.$t("Copied to clipboard!"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--update',
            multiple: false
          });
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
          toast.error(this.$t("Failed to copy code"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--error',
            multiple: false
          });
        });
    },

    regenerateInviteCode() {
      // Generate a new invite code
      this.inviteCode = this.generateInviteCode();
      
      // Close the confirmation dialog
      this.showRegenerateConfirmation = false;
      
      // Show a success notification
      this.$emit('show-notification', this.$t('New invite code generated'));
    },
  }
};
</script>

<style scoped>
.error-text {
  color: #B00020;
}

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

/* Make tooltip closer to the select field */
:deep(.tooltip-close .v-overlay__content) {
  margin-top: 0 !important;
}

.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}
</style>