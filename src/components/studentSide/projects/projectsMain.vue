<!-- 
projectsMain.vue
Student-side main projects dashboard. Displays project listings in tabbed interface 
with options to view active/archived projects, proposed projects, create new proposals, 
and join existing projects. Includes welcome screen for first-time users.
Mobile-optimized version with xs breakpoint support.
With state persistence via Pinia store.
-->

<template>
  <v-container :class="{ 'pa-0': isWelcomeActive }" fluid fill-height> 
    <!-- Loading state while fetching projects -->
    <v-row v-if="loading" class="fill-height" align="center" justify="center">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="#c8102e" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <template v-else>
      <!-- Welcome screen for new users with no projects -->
      <v-row v-if="isWelcomeActive" class="text-center fill-height" align="center" justify="center"
        :style="{ background: 'white' }" 
      >
        <v-col cols="12" sm="12" md="8" lg="6" class="px-4"> 
          <div class="welcome-content-container">
            <div class="text-center mb-4">
              <v-icon size="x-large" color="#c8102e" class="mb-3">mdi-trophy</v-icon>
              <h1 class="text-h4 text-sm-h4 text-h5 font-weight-bold">
                {{ $t('Welcome to Projects!') }}
              </h1>
            </div>
            <div class="d-flex flex-column align-center">
              <v-btn
                @click="proposeNewProject" 
                color="#c8102e"
                :size="$vuetify.display.xs ? 'large' : 'x-large'"
                class="text-white mb-4"
                prepend-icon="mdi-plus"
                elevation="2"
                block
              >
                {{ $t('Propose My First Project') }}
              </v-btn>
              <v-btn
                color="#c8102e"
                :size="$vuetify.display.xs ? 'large' : 'x-large'"
                class="text-white"
                prepend-icon="mdi-account-group"
                elevation="2"
                block
                @click="joinProject"
              >
                {{ $t('Join a Project') }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Main projects interface -->
      <div v-if="!isWelcomeActive">
        <v-container>
          <!-- Page header -->
          <v-row>
            <v-col>
              <h1 class="text-h4 text-sm-h4 text-h5 font-weight-bold">{{ $t('Projects') }}</h1>
            </v-col>
          </v-row>
          
          <!-- Tabs and action buttons -->
          <v-row>
            <v-col cols="12">
              <!-- Tabs -->
              <v-card flat class="mb-3">
                <v-tabs
                  v-model="activeTab"
                  color="#c8102e"
                  align-tabs="start"
                >
                  <!-- Dynamic tab title based on archive view state -->
                  <v-tab value="my-projects">
                    {{ activeTab === 'my-projects' && viewingArchivedProjects ? $t('My Archived Projects') : $t('My Projects') }}
                  </v-tab>
                  <v-tab value="proposed-projects">{{ $t('Proposed Projects') }}</v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>

          <!-- Action buttons row -->
          <v-row>
            <v-col cols="12">
              <v-card flat>
                <v-card-title>
                  <v-row align="center" no-gutters>
                    <!-- Search Fields for sm Screens and Up -->
                    <v-col lg="5" md="4" sm="3" class="d-none d-sm-flex pr-2">
                      <!-- Search Fields -->
                      <v-text-field
                        v-model="projectSearch"
                        density="compact"
                        :label="searchLabel"
                        flat
                        hide-details
                        clearable
                        variant="solo-filled"
                        @keyup.enter="addSearchChip"
                      >
                        <!-- Search Menu Icons for sm Screens and Up -->
                        <template v-slot:prepend-inner>
                          <v-menu
                            location="bottom"
                          >
                            <template v-slot:activator="{ props }">
                              <div
                                v-bind="props"
                                class="pointer-cursor"
                                @click.stop
                              >
                                <v-icon size="small">mdi-magnify</v-icon>
                                <v-icon size="x-small">mdi-chevron-down</v-icon>
                              </div>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="item in searchMenuItems"
                                :key="item"
                                @click="updateSearchCriteria(item)"
                              >
                                <v-list-item-title>{{ item }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
                        <template v-slot:append-inner>
                          <div class="pointer-cursor" @click="addSearchChip">
                            <v-icon size="small">mdi-chevron-right</v-icon>
                          </div>
                        </template>
                      </v-text-field>
                    </v-col>
                    
                    <!-- Spacer for larger screens -->
                    <v-spacer class="d-none d-lg-flex"></v-spacer>
                    
                    <!-- View Archived Button for sm Screens and Up-->
                    <v-col lg="auto" md="auto" sm="auto" class="d-none d-sm-flex px-1">
                      <v-btn 
                        v-if="activeTab === 'my-projects'"
                        @click="toggleArchivedProjectsView"
                        elevation="1"
                        :size="$vuetify.display.smAndDown ? 'small' : 'default'"
                        :append-icon="viewingArchivedProjects ? '' : 'mdi-archive-arrow-down-outline'"
                        :prepend-icon="viewingArchivedProjects ? 'mdi-folder-open-outline' : ''"
                      >
                        <span class="d-none d-md-inline">{{ viewingArchivedProjects ? $t('View Active') : $t('View Archive') }}</span>
                        <span class="d-inline d-md-none">{{ viewingArchivedProjects ? $t('Active') : $t('Archive') }}</span>
                      </v-btn>
                    </v-col>
                    
                    <!-- Add New Project Button for sm Screens and Up -->
                    <v-col lg="auto" md="auto" sm="auto" class="d-none d-sm-flex px-1">
                      <v-btn
                        @click="proposeNewProject"
                        elevation="1"
                        prepend-icon="mdi-plus"
                        color="#c8102e"
                        :size="$vuetify.display.smAndDown ? 'small' : 'default'"
                      >
                        <span class="d-none d-lg-inline">{{ $t('Propose New Project') }}</span>
                        <span class="d-inline d-lg-none">{{ $t('New') }}</span>
                      </v-btn>
                    </v-col>
                    
                    <!-- Join Project Button for sm Screens and Up -->
                    <v-col lg="auto" md="auto" sm="auto" class="d-none d-sm-flex pl-1">
                      <v-btn
                        @click="joinProject"
                        elevation="1"
                        prepend-icon="mdi-account-group"
                        color="#c8102e"
                        :size="$vuetify.display.smAndDown ? 'small' : 'default'"
                      >
                        <span class="d-none d-lg-inline">{{ $t('Join a Project') }}</span>
                        <span class="d-inline d-lg-none">{{ $t('Join') }}</span>
                      </v-btn>
                    </v-col>
                    
                    <!-- XS Screen Layout - All buttons in one row -->
                    <v-col cols="12" class="d-flex d-sm-none justify-space-between align-center">
                      <!-- Search button -->
                      <v-btn 
                        icon 
                        size="small"
                        variant="text"
                        @click="xsdialogSearch = true"
                      >
                        <v-icon size="small">mdi-magnify</v-icon>
                      </v-btn>
                      
                      <!-- View Archived button -->
                      <v-btn
                        v-if="activeTab === 'my-projects'"
                        icon
                        size="small"
                        variant="text"
                        @click="toggleArchivedProjectsView"
                      >
                        <v-icon size="small">{{ viewingArchivedProjects ? 'mdi-folder-open-outline' : 'mdi-archive' }}</v-icon>
                      </v-btn>
                      
                      <!-- Spacer when archive button is hidden -->
                      <div v-else style="width: 40px;"></div>
                      
                      <!-- Add New Project button -->
                      <v-btn 
                        icon
                        size="small" 
                        color="#c8102e" 
                        @click="proposeNewProject"
                      >
                        <v-icon size="small">mdi-plus</v-icon>
                      </v-btn>
                      
                      <!-- Join Project button -->
                      <v-btn 
                        icon
                        size="small"
                        variant="text"
                        @click="joinProject"
                      >
                        <v-icon size="small">mdi-account-group</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  
                  <!-- Search Chips Row -->
                  <v-row v-if="showChipsRow">
                    <v-col>
                      <v-chip-group
                        v-if="searchChips.length"
                        v-model="selectedSearchChips"
                        column
                        multiple
                      >
                        <v-chip
                          v-for="(criteria, index) in searchChips"
                          :key="index"
                          @click="selectSearchChip(index)"
                          filter
                          variant="outlined"
                          class="ma-2"
                        >
                          {{ criteria.category + `="` + criteria.term + `"` }}
                          <v-icon
                            end
                            @click.stop="removeSearchChip(index)"
                          >mdi-close</v-icon>
                        </v-chip>
                      </v-chip-group>
                    </v-col>
                  </v-row>
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- Tab content windows -->
          <v-window v-model="activeTab">
            <!-- My Projects tab content -->
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
                      :mobile-breakpoint="600"
                      v-model:items-per-page="myProjectsItemsPerPage"
                      v-model:page="myProjectsCurrentPage"
                      v-model:sort-by="myProjectsSortBy"
                      :items-per-page-options="itemsPerPageOptions"
                    >
                      <template v-slot:body="{ items }">
                        <template v-if="items.length > 0">
                          <tr v-for="item in items" :key="item._id" @click="viewProject(item)" class="cursor-pointer">
                            <td>{{ item.projectName }}</td>
                            <td class="d-none d-sm-table-cell">{{ item.experienceInfo }}</td>
                            <td>
                              <v-chip
                                size="small"
                                :color="getStatusColor(item.projectStatus)"
                                :text-color="getStatusTextColor(item.projectStatus)"
                              >
                                {{ item.projectStatus }}
                              </v-chip>
                            </td>
                            <td class="d-none d-sm-table-cell">{{ formatDate(item.updatedAt) }}</td>
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
            
            <!-- Proposed Projects tab content -->
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
                      :items="filteredProposedProjects"
                      item-key="_id"
                      hover
                      class="cursor-pointer"
                      :mobile-breakpoint="600"
                      v-model:items-per-page="proposedProjectsItemsPerPage"
                      v-model:page="proposedProjectsCurrentPage"
                      v-model:sort-by="proposedProjectsSortBy"
                      :items-per-page-options="itemsPerPageOptions"
                    >
                      <template v-slot:body="{ items }">
                        <template v-if="items.length > 0">
                          <tr v-for="item in items" :key="item._id" @click="viewProjectProposal(item)" class="cursor-pointer">
                            <td>{{ item.projectName }}</td>
                            <td class="d-none d-sm-table-cell">{{ item.experienceInfo }}</td>
                            <td>
                              <v-chip
                                size="small"
                                :color="getStatusColor(item.projectStatus)"
                                :text-color="getStatusTextColor(item.projectStatus)"
                              >
                                {{ item.projectStatus }}
                              </v-chip>
                            </td>
                            <td class="d-none d-sm-table-cell">{{ formatDate(item.updatedAt) }}</td>
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

    <!-- Member invitation dialog -->
    <invite-members-dialog
      v-if="inviteDialog && projectData._id"
      v-model="inviteDialog"
      :project-id="projectData._id"
      :project-name="projectData.name"
      :experience-instance-id="projectData.instanceId"
      :experience-instance-name="projectData.experienceInstanceName"
      @members-invited="handleMembersInvited"
    />

    <!-- Join project dialog -->
    <join-project-dialog
      v-model="joinDialog"
      :invitations="pendingInvitations"
      :loading-invitations="loadingInvitations"
      :invitations-only="dialogInvitationsOnlyMode"
      @join="handleJoinWithCode"
      @accept-invitation="handleAcceptInvitation"
      @decline-invitation="handleDeclineInvitation"
      @invitations-processed="handleInvitationsProcessed"
    />

    <!-- Dialog for Search Fields for xs Screens -->
    <v-dialog
      v-model="xsdialogSearch"
      width="100%"
      persistent
    >
      <v-card>
        <v-card-title>
          <v-row>
            <v-col>
              Select a Filter:
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="xsSearchFilterSelection"
                :items="['Project Name', 'Experience', 'Status']"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-item v-if="xsSearchFilterSelection === 'Project Name'">
          <v-row>
            <v-col>
              <v-text-field
                v-model="projectSearch"
                density="comfortable"
                :label="searchLabel"
                flat
                hide-details
                clearable
                variant="solo-filled"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-item v-if="xsSearchFilterSelection === 'Experience'">
          <v-row>
            <v-col>
              <v-text-field
                v-model="experienceSearch"
                density="comfortable"
                label="Search Experience"
                flat
                hide-details
                clearable
                variant="solo-filled"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-item v-if="xsSearchFilterSelection === 'Status'">
          <v-row>
            <v-col>
              <v-select
                v-model="statusSearch"
                :items="['Active', 'Proposed', 'Archived']"
                label="Select Status"
                density="comfortable"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="xsCancelSearchDialog">Cancel</v-btn>
          <v-btn 
            color="#c8102e"
            @click="xsApplySearchFilters"
          >Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { useStudentViewsStore } from "@/stored/studentViews";
import InviteMembersDialog from '@/components/reusable/inviteMembersDialog.vue';
import JoinProjectDialog from '@/components/reusable/joinProjectDialog.vue';

export default {
  name: "ProjectsMain",
  components: {
    InviteMembersDialog,
    JoinProjectDialog
  },
  setup() {
    const loggedInUserStore = useLoggedInUserStore();
    const viewsStore = useStudentViewsStore();
    return { loggedInUserStore, viewsStore };
  },
  data() {
    return {
      // Loading state
      loading: false,
      
      // Project data arrays
      allMyProjects: [],
      proposedProjects: [],
      
      // Search and filter data
      projectSearch: "",
      experienceSearch: "",
      statusSearch: "",
      searchLabel: "Search Project Name",
      searchMenuItems: [
        "Project Name",
        "Experience"
        // "Status"
      ],
      xsdialogSearch: false,
      xsSearchFilterSelection: null,
      
      // Table configuration
      itemsPerPageOptions: [
        {value: 5, title: "5"},
        {value: 10, title: "10"},
        {value: 15, title: "15"},
        {value: 20, title: "20"},
        {value: -1, title: "$vuetify.dataFooter.itemsPerPageAll"},
      ],
      projectHeaders: [
        { title: this.$t('Project Name'), align: "start", key: "projectName", sortable: true },
        { title: this.$t('Experience'), key: "experienceInfo", sortable: false },
        { title: this.$t('Status'), key: "projectStatus", sortable: true },
        { title: this.$t('Last Updated'), key: "updatedAt", sortable: true }
      ],
      
      // Dialog states and data
      inviteDialog: false,
      joinDialog: false,
      projectData: {
        _id: '',
        name: '',
        experienceInstanceName: ''
      },
      projectMembers: [],

      // Project invitations dialog
      pendingInvitations: [],
      loadingInvitations: false,

      dialogInvitationsOnlyMode: false,
    };
  },
  computed: {
    // Sync with store - active tab
    activeTab: {
      get() {
        return this.viewsStore.getProjectsActiveTab;
      },
      set(value) {
        this.viewsStore.updateProjectsSettings({ activeTab: value });
      }
    },
    
    // Sync with store - viewing archived projects
    viewingArchivedProjects: {
      get() {
        return this.viewsStore.isViewingArchivedProjects;
      },
      set(value) {
        this.viewsStore.updateProjectsSettings({ viewingArchivedProjects: value });
      }
    },
    
    // Sync with store - search chips
    searchChips: {
      get() {
        return this.viewsStore.getProjectsSearchChips;
      },
      set(value) {
        this.viewsStore.setProjectsSearchChips(value);
      }
    },
    
    // Sync with store - selected search chips
    selectedSearchChips: {
      get() {
        return this.viewsStore.getProjectsSelectedSearchChips;
      },
      set(value) {
        this.viewsStore.setProjectsSelectedSearchChips(value);
      }
    },
    
    // Pagination and sorting for my projects
    myProjectsItemsPerPage: {
      get() {
        return this.viewsStore.getProjectsItemsPerPage('myProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('myProjects', { itemsPerPage: value });
      }
    },
    
    myProjectsCurrentPage: {
      get() {
        return this.viewsStore.getProjectsCurrentPage('myProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('myProjects', { currentPage: value });
      }
    },
    
    myProjectsSortBy: {
      get() {
        return this.viewsStore.getProjectsSortBy('myProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsSorting('myProjects', value);
      }
    },
    
    // Pagination and sorting for proposed projects
    proposedProjectsItemsPerPage: {
      get() {
        return this.viewsStore.getProjectsItemsPerPage('proposedProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('proposedProjects', { itemsPerPage: value });
      }
    },
    
    proposedProjectsCurrentPage: {
      get() {
        return this.viewsStore.getProjectsCurrentPage('proposedProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('proposedProjects', { currentPage: value });
      }
    },
    
    proposedProjectsSortBy: {
      get() {
        return this.viewsStore.getProjectsSortBy('proposedProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsSorting('proposedProjects', value);
      }
    },
    
    // Show welcome screen when user has no projects
    isWelcomeActive() {
      return !this.loading && this.allMyProjects.length === 0 && this.proposedProjects.length === 0;
    },
    
    // Show chips row when there are search chips
    showChipsRow() {
      return this.searchChips.length > 0;
    },
    
    // Filter projects based on archive view state
    myProjects() {
      if (this.viewingArchivedProjects) {
        return this.allMyProjects.filter(p => p.projectStatus === 'Archived');
      } else {
        return this.allMyProjects.filter(p => p.projectStatus === 'Active');
      }
    },
    
    // Apply search filters to my projects
    filteredMyProjects() {
      return this.applyFilters(this.myProjects);
    },
    
    // Apply search filters to proposed projects
    filteredProposedProjects() {
      return this.applyFilters(this.proposedProjects);
    }
  },
  watch: {
    // Reset archive view when switching tabs
    activeTab(newTab) {
      if (newTab !== 'my-projects' && this.viewingArchivedProjects) {
        this.viewingArchivedProjects = false;
      }
    },

    joinDialog(newVal) {
      if (newVal && this.loggedInUserStore.getRole === 'Student') {
        // Refresh invitations when dialog opens
        this.fetchPendingInvitations();
      } else if (!newVal) {
        // Reset mode when dialog closes
        setTimeout(() => {
          this.dialogInvitationsOnlyMode = false;
        }, 300);
      }
    },
  },
  
  // Component initialization
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
    
    // Check for pending invitations after loading projects
    await this.checkAndShowInvitations();
  },
    
  methods: {
    // Fetch all projects from API
    async fetchProjects() {
      this.loading = true;
      this.allMyProjects = [];
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
            // Extract experience information from project data
            let experienceInfo = this.$t('Not assigned');
            if (project.experience) {
              experienceInfo = project.experience.experienceName;
            }
            
            return { 
              ...project, 
              experienceInfo
            };
          });
          
          // Separate projects by status
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
    
    // Apply search filters to projects
    applyFilters(projects) {
      if (this.selectedSearchChips.length === 0) {
        return projects;
      }
      
      let searchGroups = {};
      this.selectedSearchChips.forEach(index => {
        let criteria = this.searchChips[index];
        if (!searchGroups[criteria.category]) {
          searchGroups[criteria.category] = [];
        }
        searchGroups[criteria.category].push(criteria.term);
      });
      
      return projects.filter(project => {
        return Object.keys(searchGroups).every(category => {
          if (category === "Project Name") {
            return searchGroups[category].every(term =>
              project.projectName.toLowerCase().includes(term.toLowerCase())
            );
          } else if (category === "Experience") {
            return searchGroups[category].every(term =>
              project.experienceInfo.toLowerCase().includes(term.toLowerCase())
            );
          } else if (category === "Status") {
            return searchGroups[category].some(term =>
              project.projectStatus === term
            );
          }
          return true;
        });
      });
    },
    
    // Update search criteria based on menu selection
    updateSearchCriteria(item) {
      this.searchLabel = "Search " + item;
    },
    
    // Add a new search chip
    addSearchChip() {
      if (this.projectSearch) {
        // Create new array with the new chip
        const newChips = [...this.searchChips, {
          category: this.searchLabel.replace("Search ", ""),
          term: this.projectSearch
        }];
        this.searchChips = newChips;
        // Select the new chip by default
        this.selectedSearchChips = [...this.selectedSearchChips, newChips.length - 1];
        // Clear the input field after adding the chip
        this.projectSearch = "";
      }
    },
    
    // Toggle selection of a search chip
    selectSearchChip(index) {
      const selectedIndex = this.selectedSearchChips.indexOf(index);
      if (selectedIndex >= 0) {
        // If the chip is already selected, remove it
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
      } else {
        // If the chip is not selected, add it
        this.selectedSearchChips = [...this.selectedSearchChips, index];
      }
    },
    
    // Remove a search chip
    removeSearchChip(index) {
      // Create new chips array without the removed chip
      const newChips = this.searchChips.filter((_, i) => i !== index);
      this.searchChips = newChips;
      // Update selectedSearchChips to reflect the removal
      let newSelectedChips = this.selectedSearchChips.filter(i => i !== index);
      // Adjust the indexes of the remaining selected chips
      newSelectedChips = newSelectedChips.map(i => i > index ? i - 1 : i);
      this.selectedSearchChips = newSelectedChips;
    },
    
    // Cancel search dialog for mobile
    xsCancelSearchDialog() {
      this.xsdialogSearch = false;
      this.xsSearchFilterSelection = null;
      this.projectSearch = "";
      this.experienceSearch = "";
      this.statusSearch = "";
    },
    
    // Apply search filters from mobile dialog
    xsApplySearchFilters() {
      if (this.xsSearchFilterSelection === "Project Name" && this.projectSearch) {
        const newChips = [...this.searchChips, {
          category: "Project Name",
          term: this.projectSearch
        }];
        this.searchChips = newChips;
        this.selectedSearchChips = [...this.selectedSearchChips, newChips.length - 1];
      } else if (this.xsSearchFilterSelection === "Experience" && this.experienceSearch) {
        const newChips = [...this.searchChips, {
          category: "Experience",
          term: this.experienceSearch
        }];
        this.searchChips = newChips;
        this.selectedSearchChips = [...this.selectedSearchChips, newChips.length - 1];
      } else if (this.xsSearchFilterSelection === "Status" && this.statusSearch) {
        const newChips = [...this.searchChips, {
          category: "Status",
          term: this.statusSearch
        }];
        this.searchChips = newChips;
        this.selectedSearchChips = [...this.selectedSearchChips, newChips.length - 1];
      }
      
      this.xsCancelSearchDialog();
    },
    
    // Toggle between active and archived project views
    toggleArchivedProjectsView() {
      this.viewingArchivedProjects = !this.viewingArchivedProjects;
    },
    
    // Navigate to project proposal creation
    proposeNewProject() {
      this.$router.push({ name: 'proposeProject' });
    },
    
    // Navigate to proposal editing
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
    
    // Open member invitation dialog
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

      // Set minimal required data for the invite dialog
      this.projectData = {
        _id: project._id,
        name: project.projectName,
        experienceInstanceName: project.experienceInfo || this.$t('Not assigned')
      };
      
      console.log('Opening invite dialog for project:', this.projectData);
      this.inviteDialog = true;
    },

    // Fetch project members for invitation dialog
    async fetchProjectMembers(projectId) {
      try {
        // Mock data for demonstration - replace with actual API call
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
    
    // Navigate to project editing
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
    
    // Format date for table display
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    
    // Get color for project status badges
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'Proposed': return 'orange';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
    },
    
    // Get text color for project status badges
    getStatusTextColor(status) {
      return 'white';
    },
    
    // Handle successful member invitations
    handleMembersInvited(invitedUsers) {
      console.log('Users invited to project:', this.projectData.name);
      console.log('Invited users:', invitedUsers);
      
      toast.success(this.$t("Members successfully invited to the project!"), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--create',
        multiple: false
      });
    },
    
    // Open join project dialog
    async joinProject() {
      console.log('Join a Project button clicked');
      
      // Fetch latest invitations before opening dialog
      if (this.loggedInUserStore.getRole === 'Student') {
        await this.fetchPendingInvitations();
      }
      
      this.dialogInvitationsOnlyMode = false; // Set to full mode (with tabs)
      this.joinDialog = true;
    },

    // Handle successful project join
    async handleJoinWithCode(joinData) {
      console.log('Project join successful:', joinData);
      
      // Refresh projects list to include newly joined project
      await this.fetchProjects();
      
      // Highlight newly joined project with visual feedback
      if (joinData && joinData.projectId) {
        setTimeout(() => {
          const projectElement = document.getElementById(`project-${joinData.projectId}`);
          if (projectElement) {
            projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            projectElement.classList.add('newly-joined');
            setTimeout(() => {
              projectElement.classList.remove('newly-joined');
            }, 3000);
          }
        }, 300);
      }
    },

    // Fetch pending project invitations
    async fetchPendingInvitations() {
      this.loadingInvitations = true;
      try {
        const token = this.loggedInUserStore.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/user/project-invitations`;
        
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data && response.data.invitations) {
          this.pendingInvitations = response.data.invitations;
          console.log(`Found ${this.pendingInvitations.length} pending invitations`);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
        toast.error(this.$t("Error loading project invitations"), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      } finally {
        this.loadingInvitations = false;
      }
    },

    // Check and show invitations dialog if needed
    async checkAndShowInvitations() {
      console.log('=== Checking for pending invitations ===');
      console.log('User store hasPendingInvitations:', this.loggedInUserStore.hasPendingInvitations);
      
      await this.fetchPendingInvitations();
      
      console.log('Fetched invitations:', this.pendingInvitations);
      console.log('Number of invitations:', this.pendingInvitations.length);
      
      if (this.pendingInvitations.length > 0) {
        console.log('Opening join dialog in invitations-only mode');
        this.dialogInvitationsOnlyMode = true; // Set to invitations-only mode
        this.joinDialog = true;
      } else {
        console.log('No pending invitations found');
        this.loggedInUserStore.projectInvitationCount = 0;
      }
    },

    // Accepting invitations
    async handleAcceptInvitation(invitationId) {
      try {
        const token = this.loggedInUserStore.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/user/project-invitations/${invitationId}/respond`;
        
        const response = await axios.post(apiURL, 
          { accept: true }, 
          { headers: { token } }
        );
        
        if (response.data) {
          // Decrement the invitation count
          this.loggedInUserStore.decrementInvitationCount();
          
          toast.success(response.data.message || this.$t("Successfully joined the project!"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create',
            multiple: false
          });
        }
      } catch (error) {
        console.error('Error accepting invitation:', error);
        toast.error(
          error.response?.data?.error || this.$t("Failed to accept invitation"),
          {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          }
        );
        throw error; // Re-throw so dialog knows it failed
      }
    },

    // Declining invitations
    async handleDeclineInvitation(invitationId) {
      try {
        const token = this.loggedInUserStore.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/user/project-invitations/${invitationId}/respond`;
        
        const response = await axios.post(apiURL, 
          { accept: false }, 
          { headers: { token } }
        );
        
        if (response.data) {
          // Decrement the invitation count
          this.loggedInUserStore.decrementInvitationCount();
          
          toast.info(response.data.message || this.$t("Invitation declined"), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--update',
            multiple: false
          });
        }
      } catch (error) {
        console.error('Error declining invitation:', error);
        toast.error(
          error.response?.data?.error || this.$t("Failed to decline invitation"),
          {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
          }
        );
        throw error; // Re-throw so dialog knows it failed
      }
    },

    async handleInvitationsProcessed() {
      console.log('All invitations processed, refreshing data...');
      
      // Refresh the invitation count from the server
      await this.loggedInUserStore.fetchProjectInvitationCount();
      
      // Refresh the projects list to show newly joined projects
      await this.fetchProjects();
      
      // If in invitations-only mode and no more invitations, close the dialog
      if (this.dialogInvitationsOnlyMode && this.pendingInvitations.length === 0) {
        this.joinDialog = false;
      }
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.pointer-cursor {
  cursor: pointer;
}

.v-container.fill-height {
  min-height: 80vh;
}

.welcome-content-container {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

/* Mobile specific styles */
@media (max-width: 600px) {
  .v-tabs {
    min-height: 40px;
  }
  
  .v-tab {
    min-width: auto;
    padding: 0 12px;
  }
  
  .welcome-content-container h1 {
    font-size: 1.5rem !important;
  }
  
  .v-btn.v-size--large {
    font-size: 0.875rem;
  }
}
</style>