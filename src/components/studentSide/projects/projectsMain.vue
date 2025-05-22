<template>
  <v-container :class="{ 'pa-0': isWelcomeActive }" fluid fill-height> 
    <!-- Loader while fetching projects -->
    <v-row v-if="loading" class="fill-height" align="center" justify="center">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="#c8102e" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Content displayed only when loading is finished -->
    <template v-else>
      <!-- Welcome Section -->
      <v-row v-if="isWelcomeActive" class="text-center fill-height" align="center" justify="center"
        :style="{ background: 'white' }" 
      >
        <v-col cols="12" md="8" lg="6"> 
          <div class="welcome-content-container">
            <div class="text-center mb-4">
              <v-icon size="x-large" color="#c8102e" class="mb-3">mdi-trophy</v-icon>
              <h1 class="text-h4 font-weight-bold">
                {{ $t('Welcome to Projects!') }}
              </h1>
            </div>
            <div class="d-flex flex-column align-center">
              <v-btn
                @click="proposeNewProject" 
                color="#c8102e"
                size="x-large" 
                class="text-white mb-4"
                prepend-icon="mdi-plus"
                elevation="2"
              >
                {{ $t('Propose My First Project') }}
              </v-btn>
              <v-btn
                color="#c8102e"
                size="x-large"
                class="text-white"
                prepend-icon="mdi-account-group"
                elevation="2"
                @click="joinProject"
              >
                {{ $t('Join a Project') }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Data Tables for non-welcome view -->
      <div v-if="!isWelcomeActive">
        <v-container>
          <!-- Header Row -->
          <v-row>
            <v-col>
              <h1 class="text-h4 font-weight-bold">{{ $t('Projects') }}</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-between align-center">
              <v-card flat class="flex-grow-1">
                <v-tabs
                  v-model="activeTab"
                  color="#c8102e"
                  align-tabs="start"
                >
                  <!-- MODIFIED: Dynamic tab title for My Projects -->
                  <v-tab value="my-projects">
                    {{ activeTab === 'my-projects' && viewingArchivedProjects ? $t('My Archived Projects') : $t('My Projects') }}
                  </v-tab>
                  <v-tab value="proposed-projects">{{ $t('Proposed Projects') }}</v-tab>
                </v-tabs>
              </v-card>
              
              <!-- ADDED: View Archive Button -->
              <v-btn
                v-if="activeTab === 'my-projects'"
                @click="toggleArchivedProjectsView"
                elevation="1"
                :append-icon="viewingArchivedProjects ? '' : 'mdi-archive-arrow-down-outline'"
                :prepend-icon="viewingArchivedProjects ? 'mdi-folder-open-outline' : ''"
                class="ml-2"
              >
                {{ viewingArchivedProjects ? $t('View Active') : $t('View Archive') }}
              </v-btn>
              
              <v-btn
                @click="proposeNewProject"
                elevation="1"
                prepend-icon="mdi-plus"
                color="#c8102e"
                class="ml-4"
              >
                {{ $t('Propose New Project') }}
              </v-btn>

              <v-btn
                @click="joinProject"
                elevation="1"
                prepend-icon="mdi-account-group"
                color="#c8102e"
                class="ml-4"
              >
                {{ $t('Join a Project') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-window v-model="activeTab">
            <v-window-item value="my-projects">
              <v-row v-if="loading">
                <v-col>
                  <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <v-card flat>
                    <v-data-table
                      :headers="projectHeaders"
                      :items="filteredMyProjects"
                      item-key="_id"
                      hover
                      class="cursor-pointer"
                    >
                      <template v-slot:body="{ items }">
                        <template v-if="items.length > 0">
                          <tr v-for="item in items" :key="item._id" @click="viewProject(item)" class="cursor-pointer">
                            <td>{{ item.projectName }}</td>
                            <td>{{ item.experienceInfo }}</td>
                            <td>
                              <v-chip
                                size="small"
                                :color="getStatusColor(item.projectStatus)"
                                :text-color="getStatusTextColor(item.projectStatus)"
                              >
                                {{ item.projectStatus }}
                              </v-chip>
                            </td>
                            <td>{{ formatDate(item.updatedAt) }}</td>
                          </tr>
                        </template>
                        <template v-else>
                          <tr>
                            <td :colspan="projectHeaders.length" class="text-center py-6">
                              {{ viewingArchivedProjects ? $t('You have no archived projects.') : $t('You are not associated with any active projects yet.') }}
                            </td>
                          </tr>
                        </template>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item value="proposed-projects">
              <v-row v-if="loading">
                <v-col>
                  <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <v-card flat>
                    <v-data-table
                      :headers="projectHeaders"
                      :items="proposedProjects"
                      item-key="_id"
                      hover
                      class="cursor-pointer"
                    >
                      <template v-slot:body="{ items }">
                        <template v-if="items.length > 0">
                          <tr v-for="item in items" :key="item._id" @click="viewProjectProposal(item)" class="cursor-pointer">
                            <td>{{ item.projectName }}</td>
                            <td>{{ item.experienceInfo }}</td>
                            <td>
                              <v-chip
                                size="small"
                                :color="getStatusColor(item.projectStatus)"
                                :text-color="getStatusTextColor(item.projectStatus)"
                              >
                                {{ item.projectStatus }}
                              </v-chip>
                            </td>
                            <td>{{ formatDate(item.updatedAt) }}</td>
                          </tr>
                        </template>
                        <template v-else>
                          <tr>
                            <td :colspan="projectHeaders.length" class="text-center py-6">
                              {{ $t('You have not proposed any projects yet.') }}
                            </td>
                          </tr>
                        </template>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-container>
      </div>

    </template>

    <!-- Invite Members Dialog -->
    <invite-members-dialog
      v-if="inviteDialog && projectData._id"
      v-model="inviteDialog"
      :project-id="projectData._id"
      :project-name="projectData.name"
      :experience-instance-name="projectData.experienceInstanceName"
      @members-invited="handleMembersInvited"
    />


    <!-- Join-Project Dialog -->
    <join-project-dialog
      v-model="joinDialog"
      @join="handleJoinWithCode"
    />




  </v-container>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import InviteMembersDialog from '@/components/reusable/inviteMembersDialog.vue';
import JoinProjectDialog from '@/components/reusable/joinProjectDialog.vue';

export default {
  name: "ProjectsMain",
  components: {
    InviteMembersDialog,
    JoinProjectDialog
  },
  data() {
    return {
      activeTab: "my-projects",
      loading: false,
      allMyProjects: [], // ADDED: Store all non-proposed projects (Active and Archived)
      proposedProjects: [],
      viewingArchivedProjects: false, // ADDED: Toggle state for archive view
      projectHeaders: [
        { title: this.$t('Project Name'), align: "start", key: "projectName", sortable: true },
        { title: this.$t('Experience'), key: "experienceInfo", sortable: false },
        { title: this.$t('Status'), key: "projectStatus", sortable: true },
        { title: this.$t('Last Updated'), key: "updatedAt", sortable: true }
      ],
      inviteDialog: false,
      projectData: {
        _id: '',
        name: '',
        experienceInstanceName: ''
      },
      projectMembers: [],
      joinDialog: false,
    };
  },
  setup() {
    const loggedInUserStore = useLoggedInUserStore();
    return { loggedInUserStore };
  },
  computed: {
    isWelcomeActive() {
      // MODIFIED: Check allMyProjects instead of myProjects
      return !this.loading && this.allMyProjects.length === 0 && this.proposedProjects.length === 0;
    },
    // ADDED: Computed property to filter projects based on archive state
    myProjects() {
      if (this.viewingArchivedProjects) {
        return this.allMyProjects.filter(p => p.projectStatus === 'Archived');
      } else {
        return this.allMyProjects.filter(p => p.projectStatus === 'Active');
      }
    },
    // ADDED: Alias for consistency with the template
    filteredMyProjects() {
      return this.myProjects;
    }
  },
  watch: {
    // ADDED: Reset archive view when switching tabs
    activeTab(newTab) {
      if (newTab !== 'my-projects' && this.viewingArchivedProjects) {
        this.viewingArchivedProjects = false;
      }
    }
  },
  async mounted() {
    const loggedInUserStore = useLoggedInUserStore();
    if (loggedInUserStore.navigationData?.toastType) {
      toast[loggedInUserStore.navigationData.toastType](this.$t(loggedInUserStore.navigationData.toastMessage), {
        position: loggedInUserStore.navigationData.toastPosition,
        toastClassName: loggedInUserStore.navigationData.toastCSS
      });
      loggedInUserStore.navigationData = null;
    }
    await this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      this.allMyProjects = []; // MODIFIED
      this.proposedProjects = [];
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        // Keep the original API URL with 'studentSideData' prefix as you indicated
        // NOTE: Backend endpoint should return ALL projects (Active, Archived, and Proposed)
        // to properly support the archive view functionality
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/student/projects`; 
        console.log('Fetching projects for user:', user.userId);
        const response = await axios.get(apiURL, { headers: { token } });
        console.log('API Response:', response.data);
        if (response.data && response.data.projects) {
          const projects = response.data.projects.map(project => {
            // Extract experience info from the new data structure
            let experienceInfo = this.$t('Not assigned');
            if (project.experience) {
              experienceInfo = project.experience.experienceName;
            }
            
            return { 
              ...project, 
              experienceInfo
            };
          });
          
          // MODIFIED: Store Active and Archived in allMyProjects
          this.allMyProjects = projects.filter(p => p.projectStatus === 'Active' || p.projectStatus === 'Archived');
          this.proposedProjects = projects.filter(p => p.projectStatus === 'Proposed');
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error(this.$t("Error loading projects. Please try again later."), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
      } finally {
        this.loading = false;
      }
    },
    // ADDED: Method to toggle archive view
    toggleArchivedProjectsView() {
      this.viewingArchivedProjects = !this.viewingArchivedProjects;
    },
    proposeNewProject() {
      this.$router.push({ name: 'proposeProject' });
    },
    viewProjectProposal(project) {
      if (!project?._id) {
        console.error('Invalid project data:', project);
        toast.error(this.$t("Error processing project data"), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        return;
      }
      this.loggedInUserStore.navigationData = { projectID: project._id };
      this.$router.push({ name: 'editProjectProposal' });
    },
    inviteMembers(project) {
      if (!project?._id) {
        console.error('Invalid project data:', project);
        toast.error(this.$t("Error processing project data"), {
          position: 'top-right', 
          toastClassName: 'Toastify__toast--delete', 
          multiple: false
        });
        return;
      }

      // Set only the minimal required data for the invite dialog
      this.projectData = {
        _id: project._id,
        name: project.projectName,
        experienceInstanceName: project.experienceInfo || this.$t('Not assigned')
      };
      
      console.log('Opening invite dialog for project:', this.projectData);
      
      // Open the invite dialog - the dialog will fetch its own data
      this.inviteDialog = true;
    },


    // method to fetch project members
    async fetchProjectMembers(projectId) {
      try {
        // In a real implementation, you would make an API call here
        // Example:
        // const user = this.loggedInUserStore;
        // let token = user.token;
        // const response = await axios.get(`${import.meta.env.VITE_ROOT_API}/studentSideData/projects/${projectId}/members`, 
        //   { headers: { token } }
        // );
        // this.projectMembers = response.data.map(member => ({
        //   id: member.id,
        //   name: member.name,
        //   email: member.email,
        //   role: member.role,
        //   isOwner: member.isOwner,
        //   joinDate: new Date(member.joinDate)
        // }));
        
        // For now, use mock data in the correct format expected by InviteMembersDialog
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
      } catch (error) {
        console.error("Error fetching project members:", error);
        toast.error(this.$t("Error loading project members. Using existing data."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } 
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
      this.$router.push({ name: 'editProjectStudent' });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'Proposed': return 'orange';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },
    getStatusTextColor(status) {
      return 'white'; // All our status chips have white text
    },
    handleMembersInvited(invitedUsers) {
      // Just handle the result - no need to manage the members list in the parent
      console.log('Users invited to project:', this.projectData.name);
      console.log('Invited users:', invitedUsers);
      
      // Show a success message
      toast.success(this.$t("Members successfully invited to the project!"), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--update',
        multiple: false
      });
      
      // Optionally refresh project data if needed
      // this.fetchProjects();
    },
    joinProject() {
      // console.log can stay if you like:
      console.log('Join a Project button clicked');
      // open our dialog
      this.joinDialog = true;
    },

    // Add this method to your projectsMain.vue component
    async handleJoinWithCode(joinData) {
      // Log the join data for debugging (optional)
      console.log('Project join successful:', joinData);
      
      // The dialog already shows a success toast, so we don't need to show another one
      
      // Refresh the projects list to include the newly joined project
      await this.fetchProjects();
      
      // You might want to highlight the newly joined project or scroll to it
      // This example uses setTimeout to wait for the DOM to update after fetchProjects
      if (joinData && joinData.projectId) {
        setTimeout(() => {
          const projectElement = document.getElementById(`project-${joinData.projectId}`);
          if (projectElement) {
            projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optionally highlight the element
            projectElement.classList.add('newly-joined');
            // Remove highlight after a few seconds
            setTimeout(() => {
              projectElement.classList.remove('newly-joined');
            }, 3000);
          }
        }, 300);
      }
    },

  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.v-container.fill-height {
  min-height: 80vh;
}
.welcome-content-container {
  min-height: 250px;
  display: flex;
  flex-direction: column;   /* Stack children vertically */
  align-items: center;      /* Center horizontally */
  justify-content: center;  /* Center vertically */
  overflow: hidden;
}
.v-data-table .v-data-table__tbody tr td[colspan] {
  text-align: center;
}

.dialog-card {
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #c8102e, #ff5252);
}

/* Add this to your projectsMain.vue <style> section */
.newly-joined {
  animation: highlight-pulse 3s ease-in-out;
}

@keyframes highlight-pulse {
  0% { 
    box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.4);
    transform: scale(1);
  }
  
  25% { 
    box-shadow: 0 0 0 10px rgba(200, 16, 46, 0.0);
    transform: scale(1.02);
    background-color: rgba(200, 16, 46, 0.1);
  }
  
  50% { 
    box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.0);
    transform: scale(1);
  }
  
  75% { 
    box-shadow: 0 0 0 5px rgba(200, 16, 46, 0.0);
    transform: scale(1.01);
    background-color: rgba(200, 16, 46, 0.05);
  }
  
  100% { 
    box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.0);
    transform: scale(1);
    background-color: transparent;
  }
}

</style>