<!-- 
viewProjectProposal.vue (Instructor Side)
Instructor interface for reviewing student project proposals in detail. Provides 
read-only view of proposal information with approve/reject workflow functionality. 
Includes confirmation dialogs and navigation back to main projects dashboard.
-->

<template>
  <main>
    <v-container>
      <!-- Page header with proposal title and status -->
      <v-row>
        <v-col>
          <div class="d-flex align-center justify-space-between">
            <p class="font-weight-black text-h6">{{ $t('Review Project Proposal') }}</p>
            <v-chip
              size="medium"
              :color="getStatusColor(projectData.projectStatus)"
              :text-color="getStatusTextColor(projectData.projectStatus)"
              class="px-3"
            >
              {{ projectData.projectStatus }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <!-- Loading state -->
      <v-row v-if="loading">
        <v-col class="text-center">
          <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
        </v-col>
      </v-row>

      <template v-else>
        <!-- Project proposal details card -->
        <v-card class="mb-6">
          <v-card-title class="bg-grey-lighten-4 py-3 px-4">
            <v-icon start icon="mdi-information-outline" class="mr-2"></v-icon>
            {{ $t('Project Details') }}
          </v-card-title>
          
          <v-card-text class="pa-4">
            <!-- Project name display -->
            <p class="font-weight-bold mb-1">{{ $t('Project Name') }}</p>
            <p class="text-body-1 mb-4">{{ projectData.name }}</p>
            
            <!-- Project description display -->
            <p class="font-weight-bold mb-1">{{ $t('Project Description') }}</p>
            <p class="text-body-1 mb-4" style="white-space: pre-line">{{ projectData.description }}</p>
            
            <!-- Associated experience display -->
            <p class="font-weight-bold mb-1">{{ $t('Associated Experience') }}</p>
            <p class="text-body-1 mb-4">{{ experienceInstanceName }}</p>
            
            <!-- Project tags display -->
            <!-- <p class="font-weight-bold mb-1">{{ $t('Project Tags') }}</p>
            <div class="d-flex flex-wrap mb-4">
              <v-chip
                v-for="tag in selectedTags"
                :key="tag"
                color="red"
                text-color="white"
                size="small"
                class="ma-1"
              >
                {{ tag }}
              </v-chip>
              <p v-if="selectedTags.length === 0" class="text-body-2 text-grey">{{ $t('No tags selected') }}</p>
            </div> -->
            
            <!-- Submission information display -->
            <p class="font-weight-bold mb-1">{{ $t('Submitted By') }}</p>
            <p class="text-body-1 mb-1">{{ projectData.studentName || 'Unknown' }}</p>
            
            <p class="font-weight-bold mb-1">{{ $t('Submission Date') }}</p>
            <p class="text-body-1">{{ formatDate(projectData.submittedDate) }}</p>
          </v-card-text>
        </v-card>
        
        <!-- Action buttons section -->
        <v-row class="mt-6">
          <v-col class="d-flex align-center justify-space-between">
            <!-- Navigation button -->
            <v-btn 
              @click="$router.back()"
              variant="outlined"
            >
              {{ $t('Back to Projects') }}
            </v-btn>
            
            <!-- Proposal review buttons (only for Proposed status) -->
            <div v-if="projectData.projectStatus === 'Proposed'" class="d-flex gap-3">
              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-close"
                @click="openRejectDialog"
                :loading="rejectLoading"
                :disabled="approveLoading"
              >
                {{ $t('Reject Project') }}
              </v-btn>
              
              <v-btn
                color="success"
                variant="flat"
                prepend-icon="mdi-check"
                @click="openApproveDialog"
                :loading="approveLoading"
                :disabled="rejectLoading"
              >
                {{ $t('Approve Project') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>
    </v-container>

    <!-- Approve confirmation dialog -->
    <v-dialog v-model="approveDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline bg-success-lighten-4">
          {{ $t('Approve Project Proposal?') }}
        </v-card-title>
        <v-card-text class="pt-4">
          {{ $t('Are you sure you want to approve this project proposal? This will make the project active.') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="approveDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-btn color="success" text @click="approveProject">{{ $t('Approve') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reject confirmation dialog -->
    <v-dialog v-model="rejectDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline bg-error-lighten-4">
          {{ $t('Reject Project Proposal?') }}
        </v-card-title>
        <v-card-text class="pt-4">
          {{ $t('Are you sure you want to reject this project proposal? This action will archive the project.') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="rejectDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-btn color="error" text @click="rejectProject">{{ $t('Reject') }}</v-btn>
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
  name: "ViewProjectProposal",
  data() {
    return {
      // Loading and dialog states
      loading: true,
      approveDialog: false,
      rejectDialog: false,
      
      // Operation loading states
      approveLoading: false,
      rejectLoading: false,
      
      // Project proposal data
      projectData: {
        _id: null,
        name: '',
        description: '',
        experienceInstanceId: null,
        experienceInstanceName: '',
        projectStatus: 'Proposed',
        studentName: '',
        submittedDate: null
      },
      
      // Additional proposal details
      experienceInstanceName: '',
      selectedTags: []
    };
  },
  
  // Component initialization
  async mounted() {
    console.log('ViewProjectProposal mounted');
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
    
    console.log('Found project ID in navigation data:', user.navigationData.projectID);
    await this.fetchProjectData(user.navigationData.projectID);
  },
  
  methods: {
    // Fetch project proposal data from API
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
          this.$router.push({ name: 'instructorProjects' });
          return;
        }
        
        console.log('Fetching project data for ID:', projectId);
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${projectId}`;
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data) {
          const project = response.data;
          console.log('Received project data:', project);
          
          // Map project data for display
          this.projectData = {
            _id: project._id,
            name: project.projectName,
            description: project.projectDescription,
            projectStatus: project.projectStatus,
            experienceInstanceId: project.experience ? project.experience.id : null,
            studentName: project.members?.find(m => m.isOwner)?.name || 
                         (project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : 'Unknown'),
            submittedDate: project.createdAt
          };
          
          this.experienceInstanceName = project.experience ? project.experience.experienceName : this.$t('Not assigned');
          this.selectedTags = project.tags || [];
          
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
    
    // Format date for display with time
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    
    // Get color for project status badge
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'In Progress': return 'blue';
        case 'Proposed': return 'amber-darken-1';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },
    
    // Get text color for project status badge
    getStatusTextColor(status) {
      return 'white';
    },
    
    // Open approve confirmation dialog
    openApproveDialog() {
      this.approveDialog = true;
    },
    
    // Open reject confirmation dialog
    openRejectDialog() {
      this.rejectDialog = true;
    },
    
    // Approve project proposal and make it active
    async approveProject() {
      this.approveDialog = false;
      this.approveLoading = true;
      
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        
        let apiURL = `${import.meta.env.VITE_ROOT_API}/clowder/projects/update-status`;
        await axios.post(apiURL, {
          projectId: this.projectData._id,
          status: 'Active'
        }, { headers: { token } });
        
        user.navigationData = {
          toastType: 'success',
          toastMessage: 'Project approved successfully!',
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--create'
        };
        
        this.$router.push({ name: 'instructorProjects' });
      } catch (error) {
        console.error("Error approving project:", error);
        const errorMessage = error.response?.data?.message || 
                            this.$t("Error approving project. Please try again later.");
        
        toast.error(errorMessage, {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.approveLoading = false;
      }
    },
    
    // Reject project proposal and mark it “Rejected”
    async rejectProject() {
      this.rejectDialog = false;
      this.rejectLoading = true;

      try {
        const user  = useLoggedInUserStore();
        const token = user.token;

        // NEW: update-status endpoint (POST) — no projectId in the URL
        const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/update-status`;

        await axios.post(
          apiURL,
          {
            projectId: this.projectData._id,   // payload field the backend expects
            status: "Rejected"                 // must be “Active” or “Rejected”
          },
          { headers: { token } }               // unchanged auth header
        );

        user.navigationData = {
          toastType   : "info",
          toastMessage: "Project rejected.",
          toastPosition: "top-right",
          toastCSS    : "Toastify__toast--update"
        };

        this.$router.push({ name: "instructorProjects" });
      } catch (error) {
        console.error("Error rejecting project:", error);
        const errorMessage =
          error.response?.data?.message ||
          this.$t("Error rejecting project. Please try again later.");

        toast.error(errorMessage, {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: false
        });
      } finally {
        this.rejectLoading = false;
      }
    },
  }
};
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>