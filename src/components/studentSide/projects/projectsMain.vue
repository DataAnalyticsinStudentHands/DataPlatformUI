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
                    >
                      {{ $t('Join an Existing Project') }}
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
                                :color="getStatusColor(item.status)"
                                :text-color="getStatusTextColor(item.status)"
                              >
                                {{ item.status }}
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
  </v-container>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "ProjectsMain",
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
        { title: this.$t('Status'), key: "status", sortable: true },
        { title: this.$t('Last Updated'), key: "updatedAt", sortable: true },
        { title: this.$t(''), key: "actions", sortable: false, align: "center" }
      ],
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
        let apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/student/projects`; 
        console.log('Fetching projects for user:', user.userId);
        const response = await axios.get(apiURL, { headers: { token } });
        console.log('API Response:', response.data);
        if (response.data && response.data.projects) {
          const projects = response.data.projects.map(project => {
            const experienceInfo = project.experiences?.length > 0 
              ? project.experiences[0].experienceName
              : this.$t('Not assigned');
            return { ...project, experienceInfo };
          });
          this.myProjects = projects.filter(p => ['Active', 'In Progress'].includes(p.status));
          this.proposedProjects = projects.filter(p => ['Proposed', 'Pending', 'Under Review'].includes(p.status));
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
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        return;
      }
      this.loggedInUserStore.navigationData = { projectID: project._id };
      this.$router.push({ name: 'inviteProjectMembers', params: { id: project._id } });
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
        case 'In Progress': return 'blue';
        case 'Proposed': 
        case 'Pending': 
        case 'Under Review': return 'orange';
        default: return 'grey';
      }
    },
    getStatusTextColor(status) {
      switch (status) {
        case 'Active': 
        case 'In Progress': 
        case 'Proposed': 
        case 'Pending': 
        case 'Under Review': return 'white';
        default: return 'black';
      }
    }
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
</style>