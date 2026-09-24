<!-- 
viewProjectProposal.vue (Instructor Side)
Instructor interface for reviewing student project proposals in detail. Provides 
read-only view of proposal information with approve/reject workflow functionality. 
Includes confirmation dialogs and navigation back to main projects dashboard.
-->

<template>
  <main class="proposal-page">
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
          <v-icon color="brand-fg" size="32" class="mr-3">mdi-clipboard-text-outline</v-icon>
          <div>
            <div class="d-flex align-center">
              <h1 class="text-h5 font-weight-bold">{{ $t('Review Project Proposal') }}</h1>
              <v-btn
                icon
                variant="text"
                size="small"
                class="ml-2 d-lg-none"
                @click="mobileInfoDialog = true"
              >
                <v-icon color="brand-fg" size="22">mdi-help-circle</v-icon>
              </v-btn>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Review and take action on this student proposal') }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <v-row v-if="loading" justify="center" class="py-16">
        <v-col cols="12" class="text-center">
          <v-progress-circular 
            indeterminate 
            color="brand-fg" 
            size="48"
            width="4"
          ></v-progress-circular>
          <p class="text-body-2 text-medium-emphasis mt-4">{{ $t('Loading proposal data...') }}</p>
        </v-col>
      </v-row>

      <v-row v-else>
        <!-- Main Content Column -->
        <v-col cols="12" lg="8">
          <v-card class="form-card" elevation="2">
            <!-- Section 1: Project Information -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-number">1</div>
                <div>
                  <h2 class="section-title">{{ $t('Project Information') }}</h2>
                  <p class="section-subtitle">{{ $t('Basic details about the proposed project') }}</p>
                </div>
              </div>

              <div class="section-content">
                <div class="detail-field mb-4">
                  <p class="detail-label">{{ $t('Project Name') }}</p>
                  <p class="detail-value">{{ projectData.name }}</p>
                </div>

                <div class="detail-field">
                  <p class="detail-label">{{ $t('Project Description') }}</p>
                  <p class="detail-value description-text">{{ projectData.description }}</p>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- Section 2: Experience Association -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-number">2</div>
                <div>
                  <h2 class="section-title">{{ $t('Experience Association') }}</h2>
                  <p class="section-subtitle">{{ $t('The experience this project is linked to') }}</p>
                </div>
              </div>

              <div class="section-content">
                <div class="experience-badge">
                  <v-icon color="brand-fg" size="20" class="mr-2">mdi-school-outline</v-icon>
                  <span>{{ experienceInstanceName }}</span>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- Section 3: Submission Details -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-number">3</div>
                <div>
                  <h2 class="section-title">{{ $t('Submission Details') }}</h2>
                  <p class="section-subtitle">{{ $t('Information about who submitted and when') }}</p>
                </div>
              </div>

              <div class="section-content">
                <div class="d-flex flex-wrap gap-6">
                  <div class="detail-field">
                    <p class="detail-label">{{ $t('Submitted By') }}</p>
                    <div class="d-flex align-center">
                      <v-icon size="18" class="mr-2 text-medium-emphasis">mdi-account</v-icon>
                      <span class="detail-value">{{ projectData.studentName || 'Unknown' }}</span>
                    </div>
                  </div>

                  <div class="detail-field">
                    <p class="detail-label">{{ $t('Submission Date') }}</p>
                    <div class="d-flex align-center">
                      <v-icon size="18" class="mr-2 text-medium-emphasis">mdi-calendar</v-icon>
                      <span class="detail-value">{{ formatDate(projectData.submittedDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

              <template v-if="projectData.projectStatus === 'Proposed'">
                <v-btn 
                  variant="outlined"
                  size="large"
                  color="error"
                  @click="openRejectDialog"
                  class="action-btn mr-3"
                  :loading="rejectLoading"
                  :disabled="approveLoading"
                >
                  <v-icon start size="18">mdi-close-circle-outline</v-icon>
                  {{ $t('Reject') }}
                </v-btn>

                <v-btn 
                  size="large"
                  class="action-btn approve-btn"
                  @click="openApproveDialog"
                  :loading="approveLoading"
                  :disabled="rejectLoading"
                >
                  <v-icon start size="18">mdi-check-circle-outline</v-icon>
                  {{ $t('Approve') }}
                </v-btn>
              </template>
            </div>
          </v-card>
        </v-col>

        <!-- Sidebar Column (Hidden on mobile) -->
        <v-col cols="12" lg="4" class="d-none d-lg-block">
          <div class="sidebar-sticky">
            <!-- Status Card -->
            <v-card class="status-card mb-4" variant="outlined">
              <v-card-title class="tips-header">
                <v-icon color="brand-fg" class="mr-2">mdi-information-outline</v-icon>
                {{ $t('Proposal Status') }}
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

            <!-- Action Info Card -->
            <v-card class="warning-card" variant="outlined">
              <v-card-title class="warning-header">
                <v-icon color="warning" class="mr-2">mdi-alert-outline</v-icon>
                {{ $t('Important Note') }}
              </v-card-title>
              <v-card-text class="pt-0">
                <p class="text-body-2 mb-0">
                  {{ $t('Approving will make this project active. Rejecting will delete the proposal. Both actions will notify the student.') }}
                </p>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>

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
                <v-icon color="brand-fg" size="20" class="mr-2">mdi-information-outline</v-icon>
                {{ $t('Proposal Status') }}
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

            <!-- Warning Section -->
            <div class="mobile-info-section">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon color="warning" size="20" class="mr-2">mdi-alert-outline</v-icon>
                {{ $t('Important Note') }}
              </h3>
              <p class="text-body-2 mb-0">
                {{ $t('Approving will make this project active. Rejecting will archive the proposal. Both actions will notify the student.') }}
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

      <!-- Approve Confirmation Dialog -->
      <v-dialog v-model="approveDialog" persistent max-width="450px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 approve-dialog-header">
            <v-icon color="success" size="28" class="mr-3">mdi-check-circle-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Approve Project Proposal?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <p class="text-body-1 mb-0">
              {{ $t('Are you sure you want to approve this project proposal? This will make the project active and notify the student.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="approveDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn class="approve-btn" @click="approveProject">
              <v-icon start size="18">mdi-check</v-icon>
              {{ $t('Approve') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Reject Confirmation Dialog -->
      <v-dialog v-model="rejectDialog" persistent max-width="500px">
        <v-card class="confirm-dialog">
          <v-card-title class="d-flex align-center pa-5 reject-dialog-header">
            <v-icon color="error" size="28" class="mr-3">mdi-alert-circle-outline</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Reject Project Proposal?') }}</span>
          </v-card-title>
          <v-card-text class="px-5 pb-4">
            <v-alert type="warning" variant="tonal" class="mb-4">
              <strong>{{ $t('The student will be notified of this decision.') }}</strong>
            </v-alert>
            <p class="text-body-1 mb-0">
              {{ $t('Are you sure you want to reject this project proposal? The proposal will be archived and the student will need to submit a new proposal if they wish to try again.') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="rejectDialog = false" class="mr-2">{{ $t('Cancel') }}</v-btn>
            <v-btn color="error" variant="flat" @click="rejectProject">
              <v-icon start size="18">mdi-close-circle</v-icon>
              {{ $t('Reject') }}
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

export default {
  name: "ViewProjectProposal",
  data() {
    return {
      // Loading and dialog states
      loading: true,
      approveDialog: false,
      rejectDialog: false,
      mobileInfoDialog: false,
      
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
    // Fetch project proposal data from API
    async fetchProjectData(projectId) {
      try {
        const user = useLoggedInUserStore();

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
        const response = await axios.get(apiURL);
        
        if (response.data) {
          const project = response.data;
          
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
        case 'Active': return 'success';
        case 'In Progress': return 'brand-fg';
        case 'Proposed': return 'warning';
        case 'Rejected': return 'error';
        case 'Archived': return 'muted';
        default: return 'muted';
      }
    },

    // Get icon for project status
    getStatusIcon(status) {
      switch (status) {
        case 'Active': return 'mdi-check-circle';
        case 'In Progress': return 'mdi-progress-clock';
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
          return this.$t('This project has been approved and is currently active.');
        case 'In Progress': 
          return this.$t('This project is currently being worked on.');
        case 'Proposed': 
          return this.$t('This proposal is awaiting your review. You can approve or reject it.');
        case 'Rejected': 
          return this.$t('This proposal has been rejected.');
        case 'Archived': 
          return this.$t('This project has been archived.');
        default: 
          return this.$t('Status unknown.');
      }
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

        let apiURL = `${import.meta.env.VITE_ROOT_API}/clowder/projects/update-status`;
        await axios.post(apiURL, {
          projectId: this.projectData._id,
          status: 'Active'
        });
        
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
    
    // Reject project proposal and mark it "Rejected"
    async rejectProject() {
      this.rejectDialog = false;
      this.rejectLoading = true;

      try {
        const user = useLoggedInUserStore();

        const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/update-status`;

        await axios.post(
          apiURL,
          {
            projectId: this.projectData._id,
            status: "Rejected"
          }
        );

        user.navigationData = {
          toastType: "info",
          toastMessage: "Project rejected.",
          toastPosition: "top-right",
          toastCSS: "Toastify__toast--update"
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
    }
  }
};
</script>

<style scoped>
/* Page Background */
.proposal-page {
  background-color: rgb(var(--v-theme-page-bg));
  min-height: 100vh;
}

/* Page Header */
.page-header {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* Main Form Card */
.form-card {
  border-radius: 12px;
  overflow: hidden;
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
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
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
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.section-subtitle {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  margin-bottom: 0;
}

.section-content {
  padding-left: 48px;
}

/* Detail Fields */
.detail-field {
  margin-bottom: 0;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  margin-bottom: 6px;
}

.detail-value {
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  line-height: 1.5;
}

.description-text {
  white-space: pre-line;
  background-color: rgb(var(--v-theme-panel));
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* Experience Badge */
.experience-badge {
  display: inline-flex;
  align-items: center;
  background-color: rgba(var(--v-theme-primary), 0.08);
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

/* Form Actions */
.form-actions {
  display: flex;
  align-items: center;
  padding: 20px 32px;
  background-color: rgb(var(--v-theme-panel));
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.action-btn {
  min-width: 120px;
}

.approve-btn {
  background-color: rgb(var(--v-theme-approve-fill)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}

.approve-btn:hover {
  background-color: rgb(var(--v-theme-approve-fill-hover)) !important;
}

/* Sidebar */
.sidebar-sticky {
  position: sticky;
  top: 24px;
}

.status-card,
.warning-card {
  border-radius: 12px;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

.tips-header,
.warning-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.warning-card {
  border-color: rgb(var(--v-theme-warning-card-border));
  background-color: rgb(var(--v-theme-tint-warning));
}

.warning-header {
  border-bottom-color: rgb(var(--v-theme-warning-header-border));
}

/* Dialogs */
.confirm-dialog {
  border-radius: 12px;
}

.approve-dialog-header {
  background-color: rgb(var(--v-theme-tint-success));
}

.reject-dialog-header {
  background-color: rgb(var(--v-theme-tint-error));
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

.got-it-btn {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.25px;
}

.got-it-btn:hover {
  background-color: rgb(var(--v-theme-primary-darken-1)) !important;
}

/* Utilities */
.gap-6 {
  gap: 24px;
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
  }
}
</style>