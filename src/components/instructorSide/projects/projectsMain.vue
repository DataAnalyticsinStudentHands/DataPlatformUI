<template>
  <v-container fluid fill-height> 
    <!-- Loader while fetching projects -->
    <v-row v-if="loading" class="fill-height" align="center" justify="center">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="#c8102e" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Content displayed only when loading is finished -->
    <template v-else>
      <v-container>
        <!-- Header Row -->
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold">{{ $t('Projects') }}</h1>
          </v-col>
        </v-row>


        <!-- Tabs and Tables Row -->
        <v-row>
          <v-col cols="12">
            <v-card flat class="mb-4">
              <v-tabs
                v-model="activeTab"
                color="#c8102e"
                align-tabs="start"
              >
                <v-tab value="active-projects">{{ $t('Active Projects') }}</v-tab>
                <v-tab value="proposals" class="position-relative">
                  <span class="mr-8">{{ $t('Project Proposals') }}</span>
                  <v-badge
                    :content="pendingProposalsCount.toString()"
                    :model-value="pendingProposalsCount > 0"
                    color="#c8102e"
                    dot-size="20"
                    offset-x="10"
                    class="proposal-badge"
                  ></v-badge>
                </v-tab>
              </v-tabs>
            </v-card>


            <!-- Filters and Actions Row -->
            <v-row class="mb-4">
              <v-col cols="12" class="d-flex align-center flex-wrap gap-3">
                <!-- Search -->
                <v-text-field
                  v-model="searchQuery"
                  :label="$t('Search projects')"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="max-width-300"
                  @update:model-value="applyFilters"
                ></v-text-field>

                <!-- Experience Filter -->
                <v-select
                  v-model="selectedExperience"
                  :items="experienceOptions"
                  :label="$t('Experience')"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="max-width-200"
                  @update:model-value="applyFilters"
                ></v-select>

                <!-- Project Member Filter -->
                <v-select
                  v-model="selectedMember"
                  :items="memberOptions"
                  :label="$t('Project Member')"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="max-width-200"
                  @update:model-value="applyFilters"
                ></v-select>

                <!-- Status Filter -->
                <v-select
                  v-model="selectedStatus"
                  :items="statusOptions"
                  :label="$t('Status')"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="max-width-200"
                  @update:model-value="applyFilters"
                ></v-select>

                <!-- Clear Filters -->
                <!-- <v-btn
                  variant="text"
                  color="#c8102e"
                  @click="clearFilters"
                  :disabled="!hasActiveFilters"
                  class="ml-2"
                >
                  {{ $t('Clear Filters') }}
                </v-btn> -->
              </v-col>
            </v-row>

            <v-window v-model="activeTab">
              <!-- Active Projects Tab -->
              <v-window-item value="active-projects">
                <v-card flat>
                  <v-data-table
                    :headers="projectHeaders"
                    :items="filteredActiveProjects"
                    item-key="_id"
                    hover
                    class="cursor-pointer"
                    :loading="tableLoading"
                    :no-data-text="$t('No active projects found')"
                  >
                    <template v-slot:loading>
                      <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
                    </template>
                    <template v-slot:body="{ items }">
                      <tr v-for="item in items" :key="item._id" @click="viewProject(item)" class="cursor-pointer">
                        <td>{{ item.projectName }}</td>
                        <td>{{ item.teamLeadName }}</td>
                        <td>{{ item.experienceInfo }}</td>
                        <td>{{ item.teamSize }}</td>
                        <td>
                          <v-chip
                            size="small"
                            :color="getStatusColor(item.status)"
                            :text-color="getStatusTextColor(item.status)"
                          >
                            {{ item.status }}
                          </v-chip>
                        </td>
                        <td>{{ formatDate(item.updatedAt) }}</td>
                        <td @click.stop>
                          <v-btn
                            color="#c8102e"
                            variant="text"
                            size="small"
                            icon="mdi-eye"
                            @click="viewProject(item)"
                            v-tooltip="$t('View Details')"
                          ></v-btn>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-window-item>
              
              <!-- Proposals Tab -->
              <v-window-item value="proposals">
                <v-card flat>
                  <v-data-table
                    :headers="proposalHeaders"
                    :items="filteredProposals"
                    item-key="_id"
                    hover
                    class="cursor-pointer"
                    :loading="tableLoading"
                    :no-data-text="$t('No proposals found')"
                  >
                    <template v-slot:loading>
                      <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
                    </template>
                    <template v-slot:body="{ items }">
                      <tr v-for="item in items" :key="item._id" @click="reviewProposal(item)" class="cursor-pointer">
                        <td>{{ item.projectName }}</td>
                        <td>{{ item.studentName }}</td>
                        <td>{{ item.experienceInfo }}</td>
                        <td>
                          <v-chip
                            size="small"
                            :color="getStatusColor(item.status)"
                            :text-color="getStatusTextColor(item.status)"
                          >
                            {{ item.status }}
                          </v-chip>
                        </td>
                        <td>{{ formatDate(item.submittedDate) }}</td>
                        <td @click.stop>
                          <v-btn-group density="comfortable" variant="outlined">
                            <v-btn
                              color="#c8102e"
                              size="small"
                              icon="mdi-check"
                              @click="approveProposal(item)"
                              :disabled="item.status === 'Approved'"
                              class="ml-auto"
                              variant="text"
                              v-tooltip="$t('Approve')"
                            ></v-btn>
                            <v-btn
                              color="warning"
                              size="small"
                              icon="mdi-comment-question"
                              @click="requestRevision(item)"
                              :disabled="item.status === 'Approved'"
                              variant="text"
                              v-tooltip="$t('Request Revision')"
                            ></v-btn>
                            <v-btn
                              color="error"
                              size="small"
                              icon="mdi-close"
                              @click="declineProposal(item)"
                              :disabled="item.status === 'Approved'"
                              variant="text"
                              v-tooltip="$t('Decline')"
                            ></v-btn>
                          </v-btn-group>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <!-- Feedback Dialog -->
    <v-dialog v-model="feedbackDialog" max-width="600px">
      <v-card class="dialog-card">
        <v-card-title class="dialog-header text-white pa-4">
          {{ feedbackTitle }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-textarea
            v-model="feedbackText"
            :label="$t('Feedback to student')"
            rows="5"
            auto-grow
            variant="outlined"
            class="mt-4"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="feedbackDialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            @click="submitFeedback"
          >
            {{ $t('Submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Project Template Dialog -->
    <v-dialog v-model="templateDialog" max-width="600px">
      <v-card class="dialog-card">
        <v-card-title class="dialog-header text-white pa-4">
          {{ $t('Create Project Template') }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="templateName"
            :label="$t('Template Name')"
            variant="outlined"
            class="mt-4"
          ></v-text-field>
          <v-textarea
            v-model="templateDescription"
            :label="$t('Template Description')"
            rows="4"
            auto-grow
            variant="outlined"
          ></v-textarea>
          <v-select
            v-model="templateExperience"
            :items="experienceOptions"
            :label="$t('Associated Experience')"
            variant="outlined"
          ></v-select>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="templateDialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            @click="saveTemplate"
          >
            {{ $t('Save Template') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "InstructorProjectsMain",
  data() {
    return {
      activeTab: "active-projects",
      loading: false,
      tableLoading: false,
      
      // Project data
      proposals: [],
      activeProjects: [],
      
      // Filters
      searchQuery: '',
      selectedExperience: '',
      selectedStatus: '',
      selectedMember: '',
      
      // Filter options
      experienceOptions: [],
      memberOptions: [
        { title: 'All Members', value: '' }
      ],
      statusOptions: [
        { title: 'All Statuses', value: '' },
        { title: 'Proposed', value: 'Proposed' },
        { title: 'Under Review', value: 'Under Review' },
        { title: 'Approved', value: 'Approved' },
        { title: 'Needs Revision', value: 'Needs Revision' },
        { title: 'Active', value: 'Active' },
        { title: 'In Progress', value: 'In Progress' },
        { title: 'Completed', value: 'Completed' }
      ],
      
      // Table headers
      proposalHeaders: [
        { title: this.$t('Project Name'), align: 'start', key: 'projectName', sortable: true },
        { title: this.$t('Student'), key: 'studentName', sortable: true },
        { title: this.$t('Experience'), key: 'experienceInfo', sortable: true },
        { title: this.$t('Status'), key: 'status', sortable: true },
        { title: this.$t('Submitted Date'), key: 'submittedDate', sortable: true },
        { title: this.$t('Actions'), key: 'actions', sortable: false, align: 'end' }
      ],
      projectHeaders: [
        { title: this.$t('Project Name'), align: 'start', key: 'projectName', sortable: true },
        { title: this.$t('Team Lead'), key: 'teamLeadName', sortable: true },
        { title: this.$t('Experience'), key: 'experienceInfo', sortable: true },
        { title: this.$t('Team Size'), key: 'teamSize', sortable: true },
        { title: this.$t('Status'), key: 'status', sortable: true },
        { title: this.$t('Last Updated'), key: 'updatedAt', sortable: true },
        { title: this.$t('Actions'), key: 'actions', sortable: false, align: 'end' }
      ],
      
      // Feedback dialog
      feedbackDialog: false,
      feedbackTitle: '',
      feedbackText: '',
      selectedProjectId: null,
      feedbackAction: null,
      
      // Template dialog
      templateDialog: false,
      templateName: '',
      templateDescription: '',
      templateExperience: '',
    };
  },
  setup() {
    const loggedInUserStore = useLoggedInUserStore();
    return { loggedInUserStore };
  },
  computed: {
    pendingProposalsCount() {
      return this.proposals.filter(p => p.status === 'Proposed' || p.status === 'Under Review').length;
    },
    filteredProposals() {
      return this.filterProjects(this.proposals);
    },
    filteredActiveProjects() {
      return this.filterProjects(this.activeProjects);
    },
    hasActiveFilters() {
      return this.searchQuery || this.selectedExperience || this.selectedStatus;
    }
  },
  async mounted() {
    await this.fetchProjects();
    await this.fetchExperiences();
    
    const loggedInUserStore = useLoggedInUserStore();
    if (loggedInUserStore.navigationData?.toastType) {
      toast[loggedInUserStore.navigationData.toastType](this.$t(loggedInUserStore.navigationData.toastMessage), {
        position: loggedInUserStore.navigationData.toastPosition,
        toastClassName: loggedInUserStore.navigationData.toastCSS
      });
      loggedInUserStore.navigationData = null;
    }
  },
  methods: {
    // Fetching data
    async fetchProjects() {
      this.loading = true;
      this.tableLoading = true;
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects`; 
        
        console.log('Fetching projects for instructor:', user.userId);
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data && response.data.projects) {
          const projects = response.data.projects.map(project => {
            const experienceInfo = project.experiences?.length > 0 
              ? project.experiences[0].experienceName
              : this.$t('Not assigned');
              
            // Add teamSize property for active projects
            const teamSize = project.members?.length || 1;
            
            // Add team lead name
            const teamLeadName = project.members?.find(m => m.isOwner)?.name || project.createdBy?.name || this.$t('Unknown');
            
            // Add student name for proposals
            const studentName = project.createdBy?.name || this.$t('Unknown');
            
            // Add submitted date for proposals
            const submittedDate = project.createdAt;
            
            return { 
              ...project, 
              experienceInfo, 
              teamSize, 
              teamLeadName, 
              studentName, 
              submittedDate 
            };
          });
          
          this.proposals = projects.filter(p => ['Proposed', 'Under Review', 'Needs Revision'].includes(p.status));
          this.activeProjects = projects.filter(p => ['Active', 'In Progress', 'Completed', 'Approved'].includes(p.status));
          
          // Extract unique project members for the member filter
          const allMembers = new Set();
          projects.forEach(project => {
            if (project.members && project.members.length > 0) {
              project.members.forEach(member => {
                if (member.name) {
                  allMembers.add(member.name);
                }
              });
            }
            // Also add the creator/student name
            if (project.createdBy?.name) {
              allMembers.add(project.createdBy.name);
            }
          });
          
          this.memberOptions = [
            { title: 'All Members', value: '' },
            ...Array.from(allMembers).sort().map(name => ({
              title: name,
              value: name
            }))
          ];
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error(this.$t("Error loading projects. Please try again later."), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
      } finally {
        this.loading = false;
        this.tableLoading = false;
      }
    },
    
    async fetchExperiences() {
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences`;
        
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data && response.data.experiences) {
          this.experienceOptions = [
            { title: 'All Experiences', value: '' },
            ...response.data.experiences.map(exp => ({
              title: exp.experienceName,
              value: exp._id
            }))
          ];
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
        this.experienceOptions = [{ title: 'All Experiences', value: '' }];
      }
    },
    
    // Filtering
    filterProjects(projects) {
      return projects.filter(project => {
        // Search query filter
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearch = !this.searchQuery || 
          project.projectName.toLowerCase().includes(searchLower) ||
          (project.studentName && project.studentName.toLowerCase().includes(searchLower)) ||
          (project.teamLeadName && project.teamLeadName.toLowerCase().includes(searchLower));
        
        // Experience filter
        const matchesExperience = !this.selectedExperience || 
          project.experienceId === this.selectedExperience;
        
        // Status filter
        const matchesStatus = !this.selectedStatus || 
          project.status === this.selectedStatus;
        
        return matchesSearch && matchesExperience && matchesStatus;
      });
    },
    
    applyFilters() {
      this.tableLoading = true;
      // Simulate filtering delay
      setTimeout(() => {
        this.tableLoading = false;
      }, 500);
    },
    
    clearFilters() {
      this.searchQuery = '';
      this.selectedExperience = '';
      this.selectedStatus = '';
      this.applyFilters();
    },
    
    // Project actions
    reviewProposal(project) {
      if (!project?._id) {
        console.error('Invalid project data:', project);
        toast.error(this.$t("Error processing project data"), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        return;
      }
      
      this.loggedInUserStore.navigationData = { projectID: project._id };
      this.$router.push({ name: 'reviewProjectProposal' });
    },
    
    viewProject(project) {
      if (!project?._id) {
        console.error('Invalid project data:', project);
        toast.error(this.$t("Error processing project data"), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        return;
      }
      
      this.loggedInUserStore.navigationData = { projectID: project._id };
      this.$router.push({ name: 'editProject' });
    },
    
    // Proposal actions
    approveProposal(project) {
      this.selectedProjectId = project._id;
      this.feedbackTitle = this.$t('Approve Project Proposal');
      this.feedbackText = '';
      this.feedbackAction = 'approve';
      this.feedbackDialog = true;
    },
    
    requestRevision(project) {
      this.selectedProjectId = project._id;
      this.feedbackTitle = this.$t('Request Revision');
      this.feedbackText = '';
      this.feedbackAction = 'revision';
      this.feedbackDialog = true;
    },
    
    declineProposal(project) {
      this.selectedProjectId = project._id;
      this.feedbackTitle = this.$t('Decline Project Proposal');
      this.feedbackText = '';
      this.feedbackAction = 'decline';
      this.feedbackDialog = true;
    },
    

    async submitFeedback() {
      if (!this.feedbackText.trim()) {
        toast.error(this.$t("Please provide feedback for the student."), {
          position: 'top-right', 
          toastClassName: 'Toastify__toast--delete', 
          multiple: true
        });
        return;
      }
      
      this.feedbackDialog = false;
      this.tableLoading = true;
      
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        
        // If approving, call the approval endpoint to create SharePoint folder
        if (this.feedbackAction === 'approve') {
          const approvalURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects/approve-project`;
          
          // POST request with projectId in the body as required by endpoint
          const response = await axios.post(approvalURL, {
            projectId: this.selectedProjectId
          }, { headers: { token } });
          
          // Use the specific response message from the endpoint
          if (response.data && response.data.message) {
            toast.success(this.$t(response.data.message), {
              position: 'top-right', 
              toastClassName: 'Toastify__toast--create', 
              multiple: true
            });
          }
        } else {
          // For revision or decline actions, show appropriate message
          // (In a real implementation, you would add endpoints for these actions)
          let message = '';
          switch (this.feedbackAction) {
            case 'revision':
              message = this.$t("Revision requested successfully!");
              break;
            case 'decline':
              message = this.$t("Project proposal declined.");
              break;
          }
          
          toast.success(message, {
            position: 'top-right', 
            toastClassName: 'Toastify__toast--create', 
            multiple: true
          });
        }
        
        // Store feedback in the project locally (optional)
        // This would typically be handled by a backend endpoint, but this is a placeholder
        console.log(`Feedback for project ${this.selectedProjectId}: ${this.feedbackText}`);
        
        // Refresh projects list
        await this.fetchProjects();
        
      } catch (error) {
        console.error("Error processing project action:", error);
        
        // Show specific error message if available
        const errorMessage = error.response?.data?.message || 
                            this.$t("Error processing request. Please try again.");
        
        toast.error(errorMessage, {
          position: 'top-right', 
          toastClassName: 'Toastify__toast--delete', 
          multiple: true
        });
      } finally {
        this.tableLoading = false;
      }
    },
    
    // Template actions
    createProjectTemplate() {
      this.templateName = '';
      this.templateDescription = '';
      this.templateExperience = '';
      this.templateDialog = true;
    },
    
    async saveTemplate() {
      if (!this.templateName.trim()) {
        toast.error(this.$t("Please provide a template name."), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        return;
      }
      
      this.templateDialog = false;
      
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/project-templates`;
        
        const response = await axios.post(apiURL, {
          name: this.templateName,
          description: this.templateDescription,
          experienceId: this.templateExperience
        }, { headers: { token } });
        
        if (response.data && response.data.success) {
          toast.success(this.$t("Project template created successfully!"), {
            position: 'top-right', toastClassName: 'Toastify__toast--create', multiple: false
          });
        }
      } catch (error) {
        console.error("Error creating template:", error);
        toast.error(this.$t("Error creating template. Please try again."), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
      }
    },
    
    // Export action
    exportProjectData() {
      toast.info(this.$t("Exporting project data..."), {
        position: 'top-right', toastClassName: 'Toastify__toast--info', multiple: false
      });
      
      // Placeholder for actual export functionality
      setTimeout(() => {
        toast.success(this.$t("Project data exported successfully!"), {
          position: 'top-right', toastClassName: 'Toastify__toast--update', multiple: false
        });
      }, 1500);
    },
    
    // Utility methods
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'In Progress': return 'blue';
        case 'Completed': return 'success';
        case 'Approved': return 'green-darken-1';
        case 'Proposed': return 'amber-darken-1';
        case 'Under Review': return 'blue-darken-1';
        case 'Needs Revision': return 'orange';
        default: return 'grey';
      }
    },
    
    getStatusTextColor(status) {
      return 'white'; // All our status chips have white text
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.max-width-300 {
  max-width: 300px;
}

.max-width-200 {
  max-width: 200px;
}

.dialog-card {
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #c8102e, #ff5252);
}

.v-data-table .v-data-table__tbody tr td[colspan] {
  text-align: center;
}

/* For v-tooltip support */
[v-tooltip] {
  position: relative;
}

/* Fix table row hover effect */
.v-data-table .v-data-table__tbody tr:hover td {
  background-color: rgba(200, 16, 46, 0.05);
}

/* Gap utility class */
.gap-3 {
  gap: 12px;
}

.position-relative {
  position: relative;
}

.proposal-badge {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
}

.mr-8 {
  margin-right: 32px; /* Add more space to the right of the text */
}
</style>