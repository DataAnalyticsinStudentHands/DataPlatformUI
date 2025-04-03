<template>
    <main>
      <v-container>
        <!-- Page title -->
        <v-row>
          <v-col>
            <p class="font-weight-black text-h6">{{ $t('Projects Management') }}</p>
          </v-col>
        </v-row>
  
        <!-- Tabs for different project views -->
        <v-tabs v-model="activeTab" background-color="transparent" show-arrows>
          <v-tab value="pending">{{ $t('Pending Proposals') }}</v-tab>
          <v-tab value="approved">{{ $t('Approved Projects') }}</v-tab>
          <v-tab value="completed">{{ $t('Completed Projects') }}</v-tab>
        </v-tabs>
  
        <v-card flat class="mt-5">
          <v-window v-model="activeTab">
            <!-- Pending Project Proposals Tab -->
            <v-window-item value="pending">
              <v-row v-if="pendingProjects.length === 0">
                <v-col>
                  <v-alert type="info">
                    {{ $t('No pending project proposals at this time.') }}
                  </v-alert>
                </v-col>
              </v-row>
              
              <v-row v-else>
                <v-col cols="12">
                  <v-data-table
                    :headers="pendingProjectHeaders"
                    :items="pendingProjects"
                    :items-per-page="10"
                    class="elevation-1"
                  >
                    <!-- Student Name column -->
                    <template v-slot:item.studentName="{ item }">
                      {{ item.studentFirstName }} {{ item.studentLastName }}
                    </template>
  
                    <!-- Date Submitted column formatted -->
                    <template v-slot:item.submittedDate="{ item }">
                      {{ formatDate(item.submittedDate) }}
                    </template>
                    
                    <!-- Actions column with view/approve/reject buttons -->
                    <template v-slot:item.actions="{ item }">
                      <div class="d-flex">
                        <v-btn
                          icon
                          size="small"
                          color="primary"
                          class="mr-2"
                          @click="viewProjectDetails(item)"
                        >
                          <v-icon>mdi-eye</v-icon>
                          <v-tooltip activator="parent">{{ $t('View Details') }}</v-tooltip>
                        </v-btn>
                        
                        <v-btn
                          icon
                          size="small"
                          color="success"
                          class="mr-2"
                          @click="approveProject(item)"
                        >
                          <v-icon>mdi-check</v-icon>
                          <v-tooltip activator="parent">{{ $t('Approve') }}</v-tooltip>
                        </v-btn>
                        
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          @click="rejectProject(item)"
                        >
                          <v-icon>mdi-close</v-icon>
                          <v-tooltip activator="parent">{{ $t('Reject') }}</v-tooltip>
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-window-item>
  
            <!-- Approved Projects Tab -->
            <v-window-item value="approved">
              <v-row v-if="approvedProjects.length === 0">
                <v-col>
                  <v-alert type="info">
                    {{ $t('No approved projects at this time.') }}
                  </v-alert>
                </v-col>
              </v-row>
              
              <v-row v-else>
                <v-col cols="12">
                  <v-data-table
                    :headers="approvedProjectHeaders"
                    :items="approvedProjects"
                    :items-per-page="10"
                    class="elevation-1"
                  >
                    <!-- Student Name column -->
                    <template v-slot:item.studentName="{ item }">
                      {{ item.studentFirstName }} {{ item.studentLastName }}
                    </template>
  
                    <!-- Date Approved column formatted -->
                    <template v-slot:item.approvedDate="{ item }">
                      {{ formatDate(item.approvedDate) }}
                    </template>
                    
                    <!-- Actions column with view/complete buttons -->
                    <template v-slot:item.actions="{ item }">
                      <div class="d-flex">
                        <v-btn
                          icon
                          size="small"
                          color="primary"
                          class="mr-2"
                          @click="viewProjectDetails(item)"
                        >
                          <v-icon>mdi-eye</v-icon>
                          <v-tooltip activator="parent">{{ $t('View Details') }}</v-tooltip>
                        </v-btn>
                        
                        <v-btn
                          icon
                          size="small"
                          color="success"
                          @click="markProjectComplete(item)"
                        >
                          <v-icon>mdi-check-all</v-icon>
                          <v-tooltip activator="parent">{{ $t('Mark Complete') }}</v-tooltip>
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-window-item>
  
            <!-- Completed Projects Tab -->
            <v-window-item value="completed">
              <v-row v-if="completedProjects.length === 0">
                <v-col>
                  <v-alert type="info">
                    {{ $t('No completed projects at this time.') }}
                  </v-alert>
                </v-col>
              </v-row>
              
              <v-row v-else>
                <v-col cols="12">
                  <v-data-table
                    :headers="completedProjectHeaders"
                    :items="completedProjects"
                    :items-per-page="10"
                    class="elevation-1"
                  >
                    <!-- Student Name column -->
                    <template v-slot:item.studentName="{ item }">
                      {{ item.studentFirstName }} {{ item.studentLastName }}
                    </template>
  
                    <!-- Date Completed column formatted -->
                    <template v-slot:item.completedDate="{ item }">
                      {{ formatDate(item.completedDate) }}
                    </template>
                    
                    <!-- Actions column with view button -->
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        @click="viewProjectDetails(item)"
                      >
                        <v-icon>mdi-eye</v-icon>
                        <v-tooltip activator="parent">{{ $t('View Details') }}</v-tooltip>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
  
        <!-- Project Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="800px">
          <v-card v-if="selectedProject">
            <v-card-title class="text-h6 bg-primary text-white">
              {{ selectedProject.name }}
            </v-card-title>
            
            <v-card-text class="pt-4">
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-subtitle-1 font-weight-bold">{{ $t('Student') }}:</p>
                  <p>{{ selectedProject.studentFirstName }} {{ selectedProject.studentLastName }}</p>
                </v-col>
                
                <v-col cols="12" md="6">
                  <p class="text-subtitle-1 font-weight-bold">{{ $t('Experience') }}:</p>
                  <p>{{ selectedProject.experienceName }}</p>
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12">
                  <p class="text-subtitle-1 font-weight-bold">{{ $t('Description') }}:</p>
                  <p>{{ selectedProject.description }}</p>
                </v-col>
              </v-row>
              
              <v-row v-if="selectedProject.tags && selectedProject.tags.length">
                <v-col cols="12">
                  <p class="text-subtitle-1 font-weight-bold">{{ $t('Tags') }}:</p>
                  <div>
                    <v-chip
                      v-for="(tag, index) in selectedProject.tags"
                      :key="index"
                      class="mr-2 mb-2"
                      color="primary"
                      variant="outlined"
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-subtitle-1 font-weight-bold">{{ $t('Status') }}:</p>
                  <v-chip
                    :color="getStatusColor(selectedProject.status)"
                    class="mt-1"
                  >
                    {{ selectedProject.status }}
                  </v-chip>
                </v-col>
                
                <v-col cols="12" md="6">
                  <p class="text-subtitle-1 font-weight-bold">{{ $t('Submission Date') }}:</p>
                  <p>{{ formatDate(selectedProject.submittedDate) }}</p>
                </v-col>
              </v-row>
              
              <!-- Show feedback section if project is approved or completed -->
              <v-row v-if="['Approved', 'Completed'].includes(selectedProject.status)">
                <v-col cols="12">
                  <p class="text-subtitle-1 font-weight-bold">{{ $t('Feedback') }}:</p>
                  <p v-if="selectedProject.feedback">{{ selectedProject.feedback }}</p>
                  <p v-else class="text-caption font-italic">{{ $t('No feedback provided') }}</p>
                </v-col>
              </v-row>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="primary" 
                variant="text" 
                @click="detailsDialog = false"
              >
                {{ $t('Close') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Approval Dialog -->
        <v-dialog v-model="approvalDialog" max-width="600px">
          <v-card v-if="selectedProject">
            <v-card-title class="text-h6 bg-success text-white">
              {{ $t('Approve Project') }}
            </v-card-title>
            
            <v-card-text class="pt-4">
              <p class="mb-4">{{ $t('You are approving the following project:') }} <strong>{{ selectedProject.name }}</strong></p>
              
              <v-textarea
                v-model="feedbackText"
                :label="$t('Feedback (optional)')"
                outlined
                auto-grow
              ></v-textarea>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="grey" 
                variant="text" 
                @click="cancelApproval"
              >
                {{ $t('Cancel') }}
              </v-btn>
              <v-btn 
                color="success" 
                @click="confirmApproval"
              >
                {{ $t('Approve') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Rejection Dialog -->
        <v-dialog v-model="rejectionDialog" max-width="600px">
          <v-card v-if="selectedProject">
            <v-card-title class="text-h6 bg-error text-white">
              {{ $t('Reject Project') }}
            </v-card-title>
            
            <v-card-text class="pt-4">
              <p class="mb-4">{{ $t('You are rejecting the following project:') }} <strong>{{ selectedProject.name }}</strong></p>
              
              <v-textarea
                v-model="feedbackText"
                :label="$t('Feedback (required)')"
                :rules="[v => !!v || 'Feedback is required when rejecting a project']"
                outlined
                auto-grow
                required
              ></v-textarea>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="grey" 
                variant="text" 
                @click="cancelRejection"
              >
                {{ $t('Cancel') }}
              </v-btn>
              <v-btn 
                color="error" 
                @click="confirmRejection"
                :disabled="!feedbackText"
              >
                {{ $t('Reject') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Completion Dialog -->
        <v-dialog v-model="completionDialog" max-width="600px">
          <v-card v-if="selectedProject">
            <v-card-title class="text-h6 bg-primary text-white">
              {{ $t('Mark Project as Complete') }}
            </v-card-title>
            
            <v-card-text class="pt-4">
              <p class="mb-4">{{ $t('You are marking the following project as complete:') }} <strong>{{ selectedProject.name }}</strong></p>
              
              <v-textarea
                v-model="feedbackText"
                :label="$t('Final Feedback (optional)')"
                outlined
                auto-grow
              ></v-textarea>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="grey" 
                variant="text" 
                @click="cancelCompletion"
              >
                {{ $t('Cancel') }}
              </v-btn>
              <v-btn 
                color="primary" 
                @click="confirmCompletion"
              >
                {{ $t('Mark Complete') }}
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
    name: "ProjectsMain",
    data() {
      return {
        activeTab: 'pending',
        pendingProjects: [],
        approvedProjects: [],
        completedProjects: [],
        pendingProjectHeaders: [
          { title: this.$t('Project Name'), key: 'name', sortable: true },
          { title: this.$t('Student'), key: 'studentName', sortable: true },
          { title: this.$t('Experience'), key: 'experienceName', sortable: true },
          { title: this.$t('Date Submitted'), key: 'submittedDate', sortable: true },
          { title: this.$t('Actions'), key: 'actions', sortable: false }
        ],
        approvedProjectHeaders: [
          { title: this.$t('Project Name'), key: 'name', sortable: true },
          { title: this.$t('Student'), key: 'studentName', sortable: true },
          { title: this.$t('Experience'), key: 'experienceName', sortable: true },
          { title: this.$t('Date Approved'), key: 'approvedDate', sortable: true },
          { title: this.$t('Actions'), key: 'actions', sortable: false }
        ],
        completedProjectHeaders: [
          { title: this.$t('Project Name'), key: 'name', sortable: true },
          { title: this.$t('Student'), key: 'studentName', sortable: true },
          { title: this.$t('Experience'), key: 'experienceName', sortable: true },
          { title: this.$t('Date Completed'), key: 'completedDate', sortable: true },
          { title: this.$t('Actions'), key: 'actions', sortable: false }
        ],
        selectedProject: null,
        detailsDialog: false,
        approvalDialog: false,
        rejectionDialog: false,
        completionDialog: false,
        feedbackText: ''
      };
    },
    mounted() {
      // Fetch projects when component is mounted
      this.fetchProjects();
    },
    methods: {
      fetchProjects() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/`;
        
        axios.get(apiURL, { headers: { token } })
          .then((resp) => {
            // Process and categorize projects by status
            const projects = resp.data;
            
            this.pendingProjects = projects.filter(project => project.status === 'Pending');
            this.approvedProjects = projects.filter(project => project.status === 'Approved');
            this.completedProjects = projects.filter(project => project.status === 'Completed');
          })
          .catch((error) => {
            console.error("Error fetching projects:", error);
            toast.error(this.$t("Error loading projects. Please try again later."), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
          });
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      },
      getStatusColor(status) {
        const statusColors = {
          'Pending': 'warning',
          'Approved': 'success',
          'Rejected': 'error',
          'Completed': 'info'
        };
        return statusColors[status] || 'primary';
      },
      viewProjectDetails(project) {
        this.selectedProject = project;
        this.detailsDialog = true;
      },
      approveProject(project) {
        this.selectedProject = project;
        this.feedbackText = '';
        this.approvalDialog = true;
      },
      rejectProject(project) {
        this.selectedProject = project;
        this.feedbackText = '';
        this.rejectionDialog = true;
      },
      markProjectComplete(project) {
        this.selectedProject = project;
        this.feedbackText = '';
        this.completionDialog = true;
      },
      cancelApproval() {
        this.approvalDialog = false;
        this.selectedProject = null;
        this.feedbackText = '';
      },
      cancelRejection() {
        this.rejectionDialog = false;
        this.selectedProject = null;
        this.feedbackText = '';
      },
      cancelCompletion() {
        this.completionDialog = false;
        this.selectedProject = null;
        this.feedbackText = '';
      },
      confirmApproval() {
        if (!this.selectedProject) return;
        
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/${this.selectedProject._id}/approve`;
        
        const payload = {
          feedback: this.feedbackText
        };
        
        axios.post(apiURL, payload, { headers: { token } })
          .then(() => {
            toast.success(this.$t("Project approved successfully"), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--create',
              multiple: false
            });
            
            // Close dialog and refresh projects
            this.approvalDialog = false;
            this.selectedProject = null;
            this.feedbackText = '';
            this.fetchProjects();
          })
          .catch((error) => {
            console.error("Error approving project:", error);
            toast.error(this.$t("Error approving project. Please try again."), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
          });
      },
      confirmRejection() {
        if (!this.selectedProject || !this.feedbackText) return;
        
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/${this.selectedProject._id}/reject`;
        
        const payload = {
          feedback: this.feedbackText
        };
        
        axios.post(apiURL, payload, { headers: { token } })
          .then(() => {
            toast.success(this.$t("Project rejected with feedback"), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--create',
              multiple: false
            });
            
            // Close dialog and refresh projects
            this.rejectionDialog = false;
            this.selectedProject = null;
            this.feedbackText = '';
            this.fetchProjects();
          })
          .catch((error) => {
            console.error("Error rejecting project:", error);
            toast.error(this.$t("Error rejecting project. Please try again."), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
          });
      },
      confirmCompletion() {
        if (!this.selectedProject) return;
        
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/${this.selectedProject._id}/complete`;
        
        const payload = {
          feedback: this.feedbackText
        };
        
        axios.post(apiURL, payload, { headers: { token } })
          .then(() => {
            toast.success(this.$t("Project marked as complete"), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--create',
              multiple: false
            });
            
            // Close dialog and refresh projects
            this.completionDialog = false;
            this.selectedProject = null;
            this.feedbackText = '';
            this.fetchProjects();
          })
          .catch((error) => {
            console.error("Error completing project:", error);
            toast.error(this.$t("Error marking project as complete. Please try again."), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
            });
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .v-data-table {
    width: 100%;
  }
  </style>