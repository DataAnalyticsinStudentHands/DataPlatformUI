<!-- 
projectsMain.vue
Student-side main projects dashboard. Displays project listings in tabbed interface 
with options to view active/archived projects, proposed projects, create new proposals, 
and join existing projects. Includes welcome screen for first-time users.
Mobile-optimized version with xs breakpoint support.
With state persistence via Pinia store.
-->

<template>
  <main class="projects-page">
    <v-container class="py-8">
      <!-- Loading state while fetching projects -->
      <v-row v-if="loading" class="fill-height" align="center" justify="center" style="min-height: 60vh;">
        <v-col cols="auto">
          <v-progress-circular indeterminate color="#c8102e" size="64"></v-progress-circular>
        </v-col>
      </v-row>

      <template v-else>
        <!-- Welcome screen for new users with no projects -->
        <div v-if="isWelcomeActive" class="welcome-wrapper">
          <v-card class="welcome-card mx-auto" elevation="3" max-width="600">
            <div class="welcome-header">
              <v-icon size="64" color="white" class="mb-4">mdi-trophy-outline</v-icon>
              <h1 class="text-h4 font-weight-bold text-white mb-2">{{ $t('Welcome to Projects!') }}</h1>
              <p class="text-body-1 welcome-subtitle mb-0">{{ $t('Get started by proposing your own project or joining an existing one') }}</p>
            </div>
            
            <v-card-text class="pa-6">
              <div class="welcome-actions">
                <v-btn
                  @click="proposeNewProject" 
                  color="#c8102e"
                  size="x-large"
                  class="welcome-btn mb-4"
                  prepend-icon="mdi-lightbulb-outline"
                  elevation="2"
                  block
                >
                  {{ $t('Propose My First Project') }}
                </v-btn>
                
                <div class="text-center my-4">
                  <span class="text-medium-emphasis text-body-2">{{ $t('or') }}</span>
                </div>
                
                <v-btn
                  variant="outlined"
                  size="x-large"
                  class="welcome-btn-outlined"
                  prepend-icon="mdi-account-group"
                  block
                  @click="joinProject"
                >
                  {{ $t('Join a Project') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Main projects interface -->
        <div v-else>
          <!-- Page Header -->
          <div class="page-header mb-6">
            <div class="d-flex align-center mb-2">
              <v-icon color="#c8102e" size="32" class="mr-3">mdi-folder-multiple-outline</v-icon>
              <div class="flex-grow-1">
                <div class="d-flex align-center flex-wrap">
                  <h1 class="text-h5 font-weight-bold mr-3">{{ $t('My Projects') }}</h1>
                  <v-chip 
                    v-if="projectCount > 0"
                    size="small" 
                    color="#c8102e" 
                    variant="tonal"
                    class="font-weight-medium"
                  >
                    {{ projectCount }} {{ projectCount === 1 ? $t('project') : $t('projects') }}
                  </v-chip>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Manage and track all your project work') }}</p>
              </div>
            </div>
          </div>

          <!-- Main Content Card -->
          <v-card class="main-card" elevation="2">
            <!-- Tabs Section -->
            <div class="tabs-section">
              <v-tabs
                v-model="activeTab"
                color="#c8102e"
                class="custom-tabs"
              >
                <v-tab value="my-projects" class="custom-tab">
                  <v-icon start size="20">mdi-folder-open-outline</v-icon>
                  <span class="d-none d-sm-inline">
                    {{ viewingArchivedProjects ? $t('Archived Projects') : $t('Active Projects') }}
                  </span>
                  <span class="d-inline d-sm-none">
                    {{ viewingArchivedProjects ? $t('Archived') : $t('Active') }}
                  </span>
                  <v-chip 
                    v-if="myProjects.length > 0" 
                    size="x-small" 
                    class="ml-2"
                    :color="viewingArchivedProjects ? 'grey' : '#c8102e'"
                    variant="tonal"
                  >
                    {{ myProjects.length }}
                  </v-chip>
                </v-tab>
                <v-tab value="proposed-projects" class="custom-tab">
                  <v-icon start size="20">mdi-file-document-edit-outline</v-icon>
                  <span class="d-none d-sm-inline">{{ $t('Proposed Projects') }}</span>
                  <span class="d-inline d-sm-none">{{ $t('Proposed') }}</span>
                  <v-chip 
                    v-if="proposedProjects.length > 0" 
                    size="x-small" 
                    class="ml-2"
                    color="deep-orange"
                    variant="tonal"
                  >
                    {{ proposedProjects.length }}
                  </v-chip>
                </v-tab>
              </v-tabs>
            </div>

            <v-divider></v-divider>

            <!-- Toolbar Section -->
            <div class="toolbar-section">
              <v-row align="center" no-gutters>
                <!-- Search Field - Desktop/Tablet -->
                <v-col lg="5" md="4" sm="4" class="d-none d-sm-flex pr-3">
                  <v-text-field
                    v-model="projectSearch"
                    density="compact"
                    :placeholder="searchPlaceholder"
                    flat
                    hide-details
                    clearable
                    variant="outlined"
                    class="search-field"
                    @keyup.enter="addSearchChip"
                  >
                    <template v-slot:prepend-inner>
                      <v-menu location="bottom start">
                        <template v-slot:activator="{ props }">
                          <div v-bind="props" class="search-menu-trigger">
                            <v-icon size="20" color="#666">mdi-magnify</v-icon>
                            <v-icon size="14" color="#999">mdi-chevron-down</v-icon>
                          </div>
                        </template>
                        <v-list density="compact" class="search-menu-list">
                          <v-list-subheader>{{ $t('Search by') }}</v-list-subheader>
                          <v-list-item
                            v-for="item in searchMenuItems"
                            :key="item"
                            @click="updateSearchCriteria(item)"
                            :active="searchLabel === 'Search by ' + item"
                          >
                            <template v-slot:prepend>
                              <v-icon size="18">{{ getSearchIcon(item) }}</v-icon>
                            </template>
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                    <template v-slot:append-inner>
                      <v-btn 
                        icon 
                        size="x-small" 
                        variant="text"
                        @click="addSearchChip"
                        :disabled="!projectSearch"
                      >
                        <v-icon size="18">mdi-arrow-right</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                
                <v-spacer class="d-none d-md-flex"></v-spacer>
                
                <!-- Action Buttons - Desktop/Tablet -->
                <v-col cols="auto" class="d-none d-sm-flex align-center action-buttons-group">
                  <!-- View Archived Button -->
                  <v-btn 
                    v-if="activeTab === 'my-projects'"
                    @click="toggleArchivedProjectsView"
                    variant="tonal"
                    :color="viewingArchivedProjects ? '#c8102e' : 'grey'"
                    size="small"
                    class="action-btn mr-2"
                  >
                    <v-icon start size="18">{{ viewingArchivedProjects ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
                    <span class="d-none d-md-inline">{{ viewingArchivedProjects ? $t('View Active') : $t('View Archived') }}</span>
                    <span class="d-inline d-md-none">{{ viewingArchivedProjects ? $t('Active') : $t('Archive') }}</span>
                  </v-btn>
                  
                  <!-- Propose New Project Button -->
                  <v-btn
                    @click="proposeNewProject"
                    color="#c8102e"
                    size="small"
                    class="action-btn mr-2"
                  >
                    <v-icon start size="18">mdi-plus</v-icon>
                    <span class="d-none d-lg-inline">{{ $t('Propose Project') }}</span>
                    <span class="d-inline d-lg-none">{{ $t('New') }}</span>
                  </v-btn>
                  
                  <!-- Join Project Button -->
                  <v-btn
                    @click="joinProject"
                    variant="outlined"
                    color="#c8102e"
                    size="small"
                    class="action-btn"
                  >
                    <v-icon start size="18">mdi-account-plus-outline</v-icon>
                    <span class="d-none d-lg-inline">{{ $t('Join Project') }}</span>
                    <span class="d-inline d-lg-none">{{ $t('Join') }}</span>
                  </v-btn>
                </v-col>
                
                <!-- Mobile Action Bar -->
                <v-col cols="12" class="d-flex d-sm-none mobile-action-bar">
                  <v-btn 
                    icon 
                    variant="text"
                    size="small"
                    @click="xsdialogSearch = true"
                    class="mobile-action-btn"
                  >
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  
                  <v-btn
                    v-if="activeTab === 'my-projects'"
                    icon
                    variant="text"
                    size="small"
                    @click="toggleArchivedProjectsView"
                    class="mobile-action-btn"
                    :color="viewingArchivedProjects ? '#c8102e' : undefined"
                  >
                    <v-icon>{{ viewingArchivedProjects ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
                  </v-btn>
                  <div v-else style="width: 40px;"></div>
                  
                  <v-spacer></v-spacer>
                  
                  <v-btn 
                    icon
                    color="#c8102e" 
                    size="small"
                    @click="proposeNewProject"
                    class="mobile-action-btn"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  
                  <v-btn 
                    icon
                    variant="text"
                    size="small"
                    @click="joinProject"
                    class="mobile-action-btn"
                  >
                    <v-icon>mdi-account-plus-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              
              <!-- Active Search Chips -->
              <div v-if="searchChips.length > 0" class="search-chips-container mt-3">
                <div class="d-flex align-center flex-wrap">
                  <span class="text-caption text-medium-emphasis mr-2">{{ $t('Filters:') }}</span>
                  <v-chip
                    v-for="(criteria, index) in searchChips"
                    :key="index"
                    :color="selectedSearchChips.includes(index) ? '#c8102e' : 'grey'"
                    :variant="selectedSearchChips.includes(index) ? 'flat' : 'outlined'"
                    size="small"
                    class="search-chip mr-2 mb-1"
                    @click="selectSearchChip(index)"
                    closable
                    @click:close="removeSearchChip(index)"
                  >
                    <v-icon start size="14">{{ getSearchIcon(criteria.category) }}</v-icon>
                    {{ criteria.category }}: {{ criteria.term }}
                  </v-chip>
                  <v-btn 
                    v-if="searchChips.length > 1"
                    variant="text" 
                    size="x-small" 
                    color="#c8102e"
                    @click="clearAllFilters"
                    class="mb-1"
                  >
                    {{ $t('Clear all') }}
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- Tab Content -->
            <v-window v-model="activeTab">
              <!-- My Projects Tab -->
              <v-window-item value="my-projects">
                <div class="table-container">
                  <v-data-table
                    :headers="projectHeaders"
                    :items="filteredMyProjects"
                    item-key="_id"
                    hover
                    class="projects-table"
                    :mobile-breakpoint="600"
                    v-model:items-per-page="myProjectsItemsPerPage"
                    v-model:page="myProjectsCurrentPage"
                    v-model:sort-by="myProjectsSortBy"
                    :items-per-page-options="itemsPerPageOptions"
                  >
                    <template v-slot:body="{ items }">
                      <template v-if="items.length > 0">
                        <tr 
                          v-for="item in items" 
                          :key="item._id" 
                          @click="viewProject(item)" 
                          class="table-row"
                          :id="`project-${item._id}`"
                        >
                          <td class="table-cell">
                            <span class="font-weight-medium">{{ item.projectName }}</span>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-medium-emphasis">{{ item.experienceInfo }}</span>
                          </td>
                          <td class="table-cell">
                            <v-chip
                              size="small"
                              :color="getStatusColor(item.projectStatus)"
                              variant="tonal"
                              class="status-chip"
                            >
                              <v-icon start size="12">{{ getStatusIcon(item.projectStatus) }}</v-icon>
                              {{ item.projectStatus }}
                            </v-chip>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-caption text-medium-emphasis">{{ formatDate(item.updatedAt) }}</span>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td :colspan="projectHeaders.length" class="empty-state-cell">
                            <div class="empty-state">
                              <v-icon size="48" color="#ccc" class="mb-3">
                                {{ viewingArchivedProjects ? 'mdi-archive-off-outline' : 'mdi-folder-open-outline' }}
                              </v-icon>
                              <p class="text-body-1 text-medium-emphasis mb-1">
                                {{ viewingArchivedProjects ? $t('No archived projects') : $t('No active projects yet') }}
                              </p>
                              <p class="text-caption text-disabled mb-0">
                                {{ viewingArchivedProjects 
                                  ? $t('Projects you archive will appear here') 
                                  : $t('Propose a new project or join an existing one to get started') 
                                }}
                              </p>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </v-data-table>
                </div>
              </v-window-item>
              
              <!-- Proposed Projects Tab -->
              <v-window-item value="proposed-projects">
                <div class="table-container">
                  <v-data-table
                    :headers="projectHeaders"
                    :items="filteredProposedProjects"
                    item-key="_id"
                    hover
                    class="projects-table"
                    :mobile-breakpoint="600"
                    v-model:items-per-page="proposedProjectsItemsPerPage"
                    v-model:page="proposedProjectsCurrentPage"
                    v-model:sort-by="proposedProjectsSortBy"
                    :items-per-page-options="itemsPerPageOptions"
                  >
                    <template v-slot:body="{ items }">
                      <template v-if="items.length > 0">
                        <tr 
                          v-for="item in items" 
                          :key="item._id" 
                          @click="viewProjectProposal(item)" 
                          class="table-row"
                        >
                          <td class="table-cell">
                            <span class="font-weight-medium">{{ item.projectName }}</span>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-medium-emphasis">{{ item.experienceInfo }}</span>
                          </td>
                          <td class="table-cell">
                            <v-chip
                              size="small"
                              :color="getStatusColor(item.projectStatus)"
                              variant="tonal"
                              class="status-chip"
                            >
                              <v-icon start size="12">{{ getStatusIcon(item.projectStatus) }}</v-icon>
                              {{ item.projectStatus }}
                            </v-chip>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-caption text-medium-emphasis">{{ formatDate(item.updatedAt) }}</span>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td :colspan="projectHeaders.length" class="empty-state-cell">
                            <div class="empty-state">
                              <v-icon size="48" color="#ccc" class="mb-3">mdi-file-document-plus-outline</v-icon>
                              <p class="text-body-1 text-medium-emphasis mb-1">{{ $t('No proposed projects') }}</p>
                              <p class="text-caption text-disabled mb-3">{{ $t('Submit a project proposal to get started') }}</p>
                              <v-btn 
                                color="#c8102e" 
                                size="small"
                                @click.stop="proposeNewProject"
                              >
                                <v-icon start size="16">mdi-plus</v-icon>
                                {{ $t('Propose Project') }}
                              </v-btn>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </v-data-table>
                </div>
              </v-window-item>
            </v-window>
          </v-card>
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
        @join="handleJoinWithCode"
      />

      <!-- Mobile Search Dialog -->
      <v-dialog v-model="xsdialogSearch" max-width="400px">
        <v-card class="mobile-search-dialog">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon color="#c8102e" class="mr-2">mdi-magnify</v-icon>
            <span class="text-h6 font-weight-bold">{{ $t('Search Projects') }}</span>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" size="small" @click="xsCancelSearchDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-4">
            <v-select
              v-model="xsSearchFilterSelection"
              :items="['Project Name', 'Experience', 'Status']"
              :label="$t('Filter by')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            >
              <template v-slot:prepend-inner>
                <v-icon size="20">mdi-filter-variant</v-icon>
              </template>
            </v-select>
            
            <v-text-field
              v-if="xsSearchFilterSelection === 'Project Name'"
              v-model="projectSearch"
              :label="$t('Project Name')"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-text-field>
            
            <v-text-field
              v-if="xsSearchFilterSelection === 'Experience'"
              v-model="experienceSearch"
              :label="$t('Experience')"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-text-field>
            
            <v-select
              v-if="xsSearchFilterSelection === 'Status'"
              v-model="statusSearch"
              :items="['Active', 'Proposed', 'Archived']"
              :label="$t('Status')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-card-text>
          
          <v-card-actions class="pa-4 pt-0">
            <v-btn variant="text" @click="xsCancelSearchDialog">{{ $t('Cancel') }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#c8102e" @click="xsApplySearchFilters">
              <v-icon start size="18">mdi-check</v-icon>
              {{ $t('Apply Filter') }}
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
      searchLabel: "Search by Project Name",
      searchMenuItems: [
        "Project Name",
        "Experience"
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
      projectMembers: []
    };
  },
  computed: {
    // Search placeholder based on current search type
    searchPlaceholder() {
      return this.searchLabel.replace('Search by ', this.$t('Search by '));
    },
    
    // Total project count for header chip
    projectCount() {
      return this.allMyProjects.length + this.proposedProjects.length;
    },
    
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
    }
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
  },
  
  methods: {
    // Get icon for search category
    getSearchIcon(category) {
      switch (category) {
        case 'Project Name': return 'mdi-folder-outline';
        case 'Experience': return 'mdi-school-outline';
        case 'Status': return 'mdi-tag-outline';
        default: return 'mdi-magnify';
      }
    },
    
    // Get icon for project status
    getStatusIcon(status) {
      switch (status) {
        case 'Active': return 'mdi-check-circle';
        case 'Proposed': return 'mdi-clock-outline';
        case 'Archived': return 'mdi-archive';
        default: return 'mdi-help-circle';
      }
    },
    
    // Clear all search filters
    clearAllFilters() {
      this.searchChips = [];
      this.selectedSearchChips = [];
    },
    
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
            let experienceInfo = this.$t('Not assigned');
            if (project.experience) {
              experienceInfo = project.experience.experienceName;
            }
            
            return { 
              ...project, 
              experienceInfo
            };
          });
          
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
      this.searchLabel = "Search by " + item;
    },
    
    // Add a new search chip
    addSearchChip() {
      if (this.projectSearch) {
        const newChips = [...this.searchChips, {
          category: this.searchLabel.replace("Search by ", ""),
          term: this.projectSearch
        }];
        this.searchChips = newChips;
        this.selectedSearchChips = [...this.selectedSearchChips, newChips.length - 1];
        this.projectSearch = "";
      }
    },
    
    // Toggle selection of a search chip
    selectSearchChip(index) {
      const selectedIndex = this.selectedSearchChips.indexOf(index);
      if (selectedIndex >= 0) {
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
      } else {
        this.selectedSearchChips = [...this.selectedSearchChips, index];
      }
    },
    
    // Remove a search chip
    removeSearchChip(index) {
      const newChips = this.searchChips.filter((_, i) => i !== index);
      this.searchChips = newChips;
      let newSelectedChips = this.selectedSearchChips.filter(i => i !== index);
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
        case 'Proposed': return 'deep-orange';
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
        toastClassName: 'Toastify__toast--update',
        multiple: false
      });
    },
    
    // Open join project dialog
    joinProject() {
      console.log('Join a Project button clicked');
      this.joinDialog = true;
    },

    // Handle successful project join
    async handleJoinWithCode(joinData) {
      console.log('Project join successful:', joinData);
      
      await this.fetchProjects();
      
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
    }
  }
};
</script>

<style scoped>
/* Page Background */
.projects-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

/* Welcome Screen */
.welcome-wrapper {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-card {
  border-radius: 16px;
  overflow: hidden;
}

.welcome-header {
  background: linear-gradient(135deg, #c8102e 0%, #a00d24 100%);
  padding: 48px 32px;
  text-align: center;
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.85);
}

.welcome-actions {
  padding: 8px 0;
}

.welcome-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.25px;
}

.welcome-btn-outlined {
  border-color: #c8102e;
  color: #c8102e;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.25px;
}

/* Main Card */
.main-card {
  border-radius: 12px;
  overflow: hidden;
}

/* Tabs Section */
.tabs-section {
  background-color: #fafafa;
}

.custom-tabs {
  border-bottom: 1px solid #e8e8e8;
}

.custom-tab {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
  min-width: 120px;
}

/* Toolbar Section */
.toolbar-section {
  padding: 16px 20px;
  background-color: white;
}

.search-field {
  max-width: 400px;
}

.search-menu-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  margin-right: 4px;
}

.search-menu-trigger:hover {
  background-color: #f5f5f5;
}

.search-menu-list {
  min-width: 180px;
}

.action-buttons-group {
  gap: 8px;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

/* Mobile Action Bar */
.mobile-action-bar {
  justify-content: space-between;
  padding: 8px 0;
}

.mobile-action-btn {
  margin: 0 4px;
}

/* Search Chips */
.search-chips-container {
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.search-chip {
  font-weight: 500;
}

/* Table Container */
.table-container {
  border-top: 1px solid #e8e8e8;
}

.projects-table {
  border-radius: 0;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: rgba(200, 16, 46, 0.04) !important;
}

.table-cell {
  padding: 16px !important;
}

.status-chip {
  font-weight: 500;
  font-size: 0.75rem;
}

/* Empty State */
.empty-state-cell {
  padding: 48px 24px !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Mobile Search Dialog */
.mobile-search-dialog {
  border-radius: 12px;
}

/* Newly Joined Animation */
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

/* Responsive */
@media (max-width: 960px) {
  .toolbar-section {
    padding: 12px 16px;
  }
}

@media (max-width: 600px) {
  .page-header {
    padding-bottom: 12px;
  }
  
  .welcome-header {
    padding: 32px 24px;
  }
  
  .welcome-header h1 {
    font-size: 1.5rem !important;
  }
  
  .toolbar-section {
    padding: 8px 12px;
  }
  
  .table-cell {
    padding: 12px !important;
  }
  
  .empty-state-cell {
    padding: 32px 16px !important;
  }
}
</style>