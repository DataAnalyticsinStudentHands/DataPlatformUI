<template>
  <v-container :class="{ 'pa-0': isIntroActive }" fluid fill-height> 
    <!-- Loader while fetching projects -->
    <v-row v-if="loading" class="fill-height" align="center" justify="center">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="#c8102e" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Content displayed only when loading is finished -->
    <template v-else>
      <!-- Intro Section -->
      <v-row v-if="isIntroActive" class="text-center fill-height" align="center" justify="center"
        @click="advanceIntro"
        :style="{ cursor: introStep < 5 ? 'pointer' : 'default', background: 'white' }" 
      >
        <v-col cols="12" md="8" lg="6"> 
          <div class="intro-content-container">
            <!-- Consolidated transition wrapper -->
            <v-slide-y-transition mode="out-in">
              <div :key="introStep">
                <!-- Slide 0: Welcome -->
                <template v-if="introStep === 0">
                  <h1 class="text-h3 font-weight-bold mb-4">{{ $t('Welcome to Projects!') }}</h1>
                  <p class="text-body-1 text-grey">{{ $t('(Click to continue)') }}</p>
                </template>
                <!-- Slide 1: Propose -->
                <template v-else-if="introStep === 1">
                  <v-icon size="x-large" color="#c8102e" class="mb-3">mdi-pencil-outline</v-icon>
                  <h2 class="text-h4 font-weight-bold mb-2">{{ $t('Propose') }}</h2>
                  <p class="text-h6 mb-4">{{ $t('Create a project proposal describing your idea and goals.') }}</p>
                  <p class="text-body-1 text-grey">{{ $t('(Click to continue)') }}</p>
                </template>
                <!-- Slide 2: Review -->
                <template v-else-if="introStep === 2">
                  <v-icon size="x-large" color="#c8102e" class="mb-3">mdi-account-check</v-icon>
                  <h2 class="text-h4 font-weight-bold mb-2">{{ $t('Review') }}</h2>
                  <p class="text-h6 mb-4">{{ $t('Your instructor reviews and approves your proposal.') }}</p>
                  <p class="text-body-1 text-grey">{{ $t('(Click to continue)') }}</p>
                </template>
                <!-- Slide 3: Invite -->
                <template v-else-if="introStep === 3">
                  <v-icon size="x-large" color="#c8102e" class="mb-3">mdi-account-plus</v-icon>
                  <h2 class="text-h4 font-weight-bold mb-2">{{ $t('Invite') }}</h2>
                  <p class="text-h6 mb-4">{{ $t('Invite project members to collaborate on your project.') }}</p>
                  <p class="text-body-1 text-grey">{{ $t('(Click to continue)') }}</p>
                </template>
                <!-- Slide 4: Upload Project Documents -->
                <template v-else-if="introStep === 4">
                  <v-icon size="x-large" color="#c8102e" class="mb-3">mdi-upload</v-icon>
                  <h2 class="text-h4 font-weight-bold mb-2">{{ $t('Upload Project Documents') }}</h2>
                  <p class="text-h6 mb-4">{{ $t('Upload supporting documents to showcase your project\'s details.') }}</p>
                  <p class="text-body-1 text-grey">{{ $t('(Click to continue)') }}</p>
                </template>
                <!-- Slide 5: Final Call-to-Action -->
                <template v-else-if="introStep === 5">
                  <div class="d-flex align-center justify-center mb-4">
                    <v-icon size="x-large" color="#c8102e" class="mr-2">mdi-trophy</v-icon>
                    <p class="text-h5 mb-0">
                      {{ $t('Good luck with your progress!') }}
                    </p>
                  </div>
                  <div class="d-flex flex-column align-center">
                    <v-btn
                      @click.stop="proposeNewProject" 
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
                </template>
              </div>
            </v-slide-y-transition>
          </div>
        </v-col>
      </v-row>

      <!-- Data Tables for non-intro view -->
      <div v-if="!isIntroActive">
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
                  <v-tab value="my-projects">{{ $t('My Projects') }}</v-tab>
                  <v-tab value="proposed-projects">{{ $t('Proposed Projects') }}</v-tab>
                </v-tabs>
              </v-card>
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
                      :items="myProjects"
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
                            <td @click.stop>
                              <v-btn
                                color="#c8102e"
                                variant="outlined"
                                size="small"
                                prepend-icon="mdi-account-plus"
                                @click="inviteMembers(item)"
                                class="invite-btn"
                              >
                                {{ $t('Invite Members') }}
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                        <template v-else>
                          <tr>
                            <td :colspan="projectHeaders.length" class="text-center py-6">
                              {{ $t('You are not associated with any active projects yet.') }}
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
                            <td></td>
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
import JoinProjectDialog from '@/components/reusable/JoinProjectDialog.vue';

export default {
  name: "ProjectsMain",
  components: {
    InviteMembersDialog,
    JoinProjectDialog
  },
  data() {
    return {
      introStep: 0, // from 0 to 5
      activeTab: "my-projects",
      loading: false,
      myProjects: [],
      proposedProjects: [],
      projectHeaders: [
        { title: this.$t('Project Name'), align: "start", key: "projectName", sortable: true },
        { title: this.$t('Experience'), key: "experienceInfo", sortable: false },
        { title: this.$t('Status'), key: "projectStatus", sortable: true },
        { title: this.$t('Last Updated'), key: "updatedAt", sortable: true },
        { title: this.$t(''), key: "actions", sortable: false, align: "center" }
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
    isIntroActive() {
      return !this.loading && this.myProjects.length === 0 && this.proposedProjects.length === 0;
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
    advanceIntro() {
      if (this.introStep < 5) {
        this.introStep++;
      }
    },
    async fetchProjects() {
      this.loading = true;
      this.myProjects = [];
      this.proposedProjects = [];
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        // Keep the original API URL with 'studentSideData' prefix as you indicated
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
          
          // Use projectStatus field to filter projects
          this.myProjects = projects.filter(p => p.projectStatus === 'Active');
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
      this.$router.push({ name: 'editProject' });
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
.intro-content-container {
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.v-slide-y-transition > div {
  width: 100%;
}
.v-slide-y-transition-enter-active,
.v-slide-y-transition-leave-active {
  transition: transform 0.6s ease, opacity 0.6s ease;
}
.v-slide-y-transition-enter-from,
.v-slide-y-transition-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
.v-data-table .v-data-table__tbody tr td[colspan] {
  text-align: center;
}
.invite-btn {
  white-space: nowrap;
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