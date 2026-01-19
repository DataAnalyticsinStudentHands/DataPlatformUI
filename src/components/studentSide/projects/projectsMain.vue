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
          <v-progress-circular indeterminate color="#c8102e" size="72"></v-progress-circular>
        </v-col>
      </v-row>

      <template v-else>
        <!-- Welcome screen for new users with no projects -->
        <div v-if="isWelcomeActive" class="welcome-wrapper">
          <v-card class="welcome-card mx-auto" elevation="3" max-width="650">
            <div class="welcome-header">
              <v-icon size="72" color="white" class="mb-4">mdi-trophy-outline</v-icon>
              <h1 class="text-h3 font-weight-bold text-white mb-2">{{ $t('Welcome to Projects!') }}</h1>
              <p class="text-body-1 welcome-subtitle mb-0">{{ $t('Get started by proposing your own project or joining an existing one') }}</p>
            </div>
            
            <v-card-text class="pa-8">
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
                  <span class="text-medium-emphasis text-body-1">{{ $t('or') }}</span>
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
              <v-icon color="#c8102e" size="36" class="mr-3">mdi-folder-multiple-outline</v-icon>
              <div class="flex-grow-1">
                <div class="d-flex align-center flex-wrap">
                  <h1 class="text-h4 font-weight-bold mr-3">{{ $t('My Projects') }}</h1>
                </div>
                <p class="text-body-1 text-medium-emphasis mb-0">{{ $t('Manage and track all your project work') }}</p>
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
                  <v-icon start size="22">mdi-folder-open-outline</v-icon>
                  <span class="d-none d-sm-inline">
                    {{ viewingArchivedProjects ? $t('Archived Projects') : $t('Active Projects') }}
                  </span>
                  <span class="d-inline d-sm-none">
                    {{ viewingArchivedProjects ? $t('Archived') : $t('Active') }}
                  </span>
                  <v-chip 
                    v-if="myProjects.length > 0" 
                    size="small" 
                    class="ml-2"
                    :color="viewingArchivedProjects ? 'grey' : '#c8102e'"
                    variant="tonal"
                  >
                    {{ myProjects.length }}
                  </v-chip>
                </v-tab>
                <v-tab value="proposed-projects" class="custom-tab">
                  <v-icon start size="22">mdi-file-document-edit-outline</v-icon>
                  <span class="d-none d-sm-inline">{{ $t('Proposed Projects') }}</span>
                  <span class="d-inline d-sm-none">{{ $t('Proposed') }}</span>
                  <v-chip 
                    v-if="proposedProjects.length > 0" 
                    size="small" 
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
                    density="comfortable"
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
                            <v-icon size="22" color="#666">mdi-magnify</v-icon>
                            <v-icon size="16" color="#999">mdi-chevron-down</v-icon>
                          </div>
                        </template>
                        <v-list density="comfortable" class="search-menu-list">
                          <v-list-subheader>{{ $t('Search by') }}</v-list-subheader>
                          <v-list-item
                            v-for="item in searchMenuItems"
                            :key="item"
                            @click="updateSearchCriteria(item)"
                            :active="searchLabel === 'Search by ' + item"
                          >
                            <template v-slot:prepend>
                              <v-icon size="20">{{ getSearchIcon(item) }}</v-icon>
                            </template>
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                    <template v-slot:append-inner>
                      <v-btn 
                        icon 
                        size="small" 
                        variant="text"
                        @click="addSearchChip"
                        :disabled="!projectSearch"
                      >
                        <v-icon size="20">mdi-arrow-right</v-icon>
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
                    :color="viewingArchivedProjects ? '#c8102e' : 'grey-darken-4'"
                    size="default"
                    class="action-btn mr-2"
                  >
                    <v-icon start size="20">{{ viewingArchivedProjects ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
                    <span class="d-none d-md-inline grey-darken-4">{{ viewingArchivedProjects ? $t('View Active') : $t('View Archived') }}</span>
                    <span class="d-inline d-md-none">{{ viewingArchivedProjects ? $t('Active') : $t('Archive') }}</span>
                  </v-btn>
                  
                  <!-- Propose New Project Button -->
                  <v-btn
                    @click="proposeNewProject"
                    color="#c8102e"
                    size="default"
                    class="action-btn mr-2"
                  >
                    <v-icon start size="20">mdi-plus</v-icon>
                    <span class="d-none d-lg-inline">{{ $t('Propose Project') }}</span>
                    <span class="d-inline d-lg-none">{{ $t('New') }}</span>
                  </v-btn>
                  
                  <!-- Join Project Button -->
                  <v-btn
                    @click="joinProject"
                    variant="outlined"
                    color="#c8102e"
                    size="default"
                    class="action-btn"
                  >
                    <v-icon start size="20">mdi-account-plus-outline</v-icon>
                    <span class="d-none d-lg-inline">{{ $t('Join Project') }}</span>
                    <span class="d-inline d-lg-none">{{ $t('Join') }}</span>
                  </v-btn>
                </v-col>
                
                <!-- Mobile Action Bar -->
                <v-col cols="12" class="d-flex d-sm-none mobile-action-bar">
                  <v-btn 
                    icon 
                    variant="text"
                    size="default"
                    @click="xsdialogSearch = true"
                    class="mobile-action-btn"
                  >
                    <v-icon size="24">mdi-magnify</v-icon>
                  </v-btn>
                  
                  <v-btn
                    v-if="activeTab === 'my-projects'"
                    icon
                    variant="text"
                    size="default"
                    @click="toggleArchivedProjectsView"
                    class="mobile-action-btn"
                    :color="viewingArchivedProjects ? '#c8102e' : undefined"
                  >
                    <v-icon size="24">{{ viewingArchivedProjects ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
                  </v-btn>
                  <div v-else style="width: 48px;"></div>
                  
                  <v-spacer></v-spacer>
                  
                  <v-btn 
                    icon
                    color="#c8102e" 
                    size="default"
                    @click="proposeNewProject"
                    class="mobile-action-btn"
                  >
                    <v-icon size="24">mdi-plus</v-icon>
                  </v-btn>
                  
                  <v-btn 
                    icon
                    variant="text"
                    size="default"
                    @click="joinProject"
                    class="mobile-action-btn"
                  >
                    <v-icon size="24">mdi-account-plus-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              
              <!-- Active Search Chips -->
              <div v-if="searchChips.length > 0" class="search-chips-container mt-3">
                <div class="d-flex align-center flex-wrap">
                  <span class="text-body-2 text-medium-emphasis mr-2">{{ $t('Filters:') }}</span>
                  <v-chip
                    v-for="(criteria, index) in searchChips"
                    :key="index"
                    :color="selectedSearchChips.includes(index) ? '#c8102e' : 'grey'"
                    :variant="selectedSearchChips.includes(index) ? 'flat' : 'outlined'"
                    size="default"
                    class="search-chip mr-2 mb-1"
                    @click="selectSearchChip(index)"
                    closable
                    @click:close="removeSearchChip(index)"
                  >
                    <v-icon start size="16">{{ getSearchIcon(criteria.category) }}</v-icon>
                    {{ criteria.category }}: {{ criteria.term }}
                  </v-chip>
                  <v-btn 
                    v-if="searchChips.length > 1"
                    variant="text" 
                    size="small" 
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
                            <span class="font-weight-medium project-name">{{ item.projectName }}</span>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-medium-emphasis experience-text">{{ item.experienceInfo }}</span>
                          </td>
                          <td class="table-cell">
                            <v-chip
                              size="default"
                              :color="getStatusColor(item.projectStatus)"
                              variant="tonal"
                              class="status-chip"
                            >
                              <v-icon start size="14">{{ getStatusIcon(item.projectStatus) }}</v-icon>
                              {{ item.projectStatus }}
                            </v-chip>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-body-2 text-medium-emphasis">{{ formatDate(item.updatedAt) }}</span>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td :colspan="projectHeaders.length" class="empty-state-cell">
                            <div class="empty-state">
                              <v-icon size="56" color="#ccc" class="mb-3">
                                {{ viewingArchivedProjects ? 'mdi-archive-off-outline' : 'mdi-folder-open-outline' }}
                              </v-icon>
                              <p class="text-h6 text-medium-emphasis mb-1">
                                {{ viewingArchivedProjects ? $t('No archived projects') : $t('No active projects yet') }}
                              </p>
                              <p class="text-body-2 text-disabled mb-0">
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
                            <span class="font-weight-medium project-name">{{ item.projectName }}</span>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-medium-emphasis experience-text">{{ item.experienceInfo }}</span>
                          </td>
                          <td class="table-cell">
                            <v-chip
                              size="default"
                              :color="getStatusColor(item.projectStatus)"
                              variant="tonal"
                              class="status-chip"
                            >
                              <v-icon start size="14">{{ getStatusIcon(item.projectStatus) }}</v-icon>
                              {{ item.projectStatus }}
                            </v-chip>
                          </td>
                          <td class="table-cell d-none d-sm-table-cell">
                            <span class="text-body-2 text-medium-emphasis">{{ formatDate(item.updatedAt) }}</span>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td :colspan="projectHeaders.length" class="empty-state-cell">
                            <div class="empty-state">
                              <v-icon size="56" color="#ccc" class="mb-3">mdi-file-document-plus-outline</v-icon>
                              <p class="text-h6 text-medium-emphasis mb-1">{{ $t('No proposed projects') }}</p>
                              <p class="text-body-2 text-disabled mb-4">{{ $t('Submit a project proposal to get started') }}</p>
                              <v-btn 
                                color="#c8102e" 
                                size="default"
                                @click.stop="proposeNewProject"
                              >
                                <v-icon start size="18">mdi-plus</v-icon>
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
        :invitations="pendingInvitations"
        :loading-invitations="loadingInvitations"
        :invitations-only="dialogInvitationsOnlyMode"
        @join="handleJoinWithCode"
        @accept-invitation="handleAcceptInvitation"
        @decline-invitation="handleDeclineInvitation"
        @invitations-processed="handleInvitationsProcessed"
      />

      <!-- Mobile Search Dialog -->
      <v-dialog v-model="xsdialogSearch" max-width="420px">
        <v-card class="mobile-search-dialog">
          <v-card-title class="d-flex align-center pa-5">
            <v-icon color="#c8102e" size="26" class="mr-2">mdi-magnify</v-icon>
            <span class="text-h5 font-weight-bold">{{ $t('Search Projects') }}</span>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" size="default" @click="xsCancelSearchDialog">
              <v-icon size="24">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-5">
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
                <v-icon size="22">mdi-filter-variant</v-icon>
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
          
          <v-card-actions class="pa-5 pt-0">
            <v-btn variant="text" size="default" @click="xsCancelSearchDialog">{{ $t('Cancel') }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#c8102e" size="default" @click="xsApplySearchFilters">
              <v-icon start size="20">mdi-check</v-icon>
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
      projectMembers: [],

      // Project invitations dialog
      pendingInvitations: [],
      loadingInvitations: false,
      dialogInvitationsOnlyMode: false,
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
        const response = await axios.get(apiURL, { headers: { token } });
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
      toast.success(this.$t("Members successfully invited to the project!"), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--create',
        multiple: false
      });
    },
    
    // Open join project dialog
    async joinProject() {
      // Fetch latest invitations before opening dialog
      if (this.loggedInUserStore.getRole === 'Student') {
        await this.fetchPendingInvitations();
      }
      
      this.dialogInvitationsOnlyMode = false; // Set to full mode (with tabs)
      this.joinDialog = true;
    },

    // Handle successful project join
    async handleJoinWithCode(joinData) {
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
      await this.fetchPendingInvitations();
      
      if (this.pendingInvitations.length > 0) {
        this.dialogInvitationsOnlyMode = true; // Set to invitations-only mode
        this.joinDialog = true;
      } else {
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
  padding: 56px 40px;
  text-align: center;
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.1rem;
}

.welcome-actions {
  padding: 8px 0;
}

.welcome-btn {
  text-transform: none;
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.25px;
  height: 52px;
}

.welcome-btn-outlined {
  border-color: #c8102e;
  color: #c8102e;
  text-transform: none;
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.25px;
  height: 52px;
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
  font-size: 0.95rem;
  letter-spacing: 0.25px;
  min-width: 140px;
  height: 52px;
}

/* Toolbar Section */
.toolbar-section {
  padding: 18px 24px;
  background-color: white;
}

.search-field {
  max-width: 420px;
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
  min-width: 200px;
}

.action-buttons-group {
  gap: 10px;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.25px;
}

/* Mobile Action Bar */
.mobile-action-bar {
  justify-content: space-between;
  padding: 10px 0;
}

.mobile-action-btn {
  margin: 0 6px;
}

/* Search Chips */
.search-chips-container {
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.search-chip {
  font-weight: 500;
  font-size: 0.875rem;
}

.search-chip :deep(.v-chip__content) {
  gap: 4px;
}

.search-chip :deep(.v-chip__close) {
  margin: 0;
}

/* Table Container */
.table-container {
  border-top: 1px solid #e8e8e8;
}

.projects-table {
  border-radius: 0;
  font-size: 0.95rem;
}

.projects-table :deep(.v-data-table-header) {
  font-size: 0.9rem;
}

.projects-table :deep(th) {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  padding: 14px 18px !important;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: rgba(200, 16, 46, 0.04) !important;
}

.table-cell {
  padding: 18px 18px !important;
  font-size: 0.95rem;
}

.project-name {
  font-size: 0.95rem;
}

.experience-text {
  font-size: 0.9rem;
}

.status-chip {
  font-weight: 500;
  font-size: 0.85rem;
}

/* Empty State */
.empty-state-cell {
  padding: 56px 28px !important;
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

/* Data table pagination styling */
.projects-table :deep(.v-data-table-footer) {
  font-size: 0.9rem;
  padding: 12px 16px;
}

.projects-table :deep(.v-data-table-footer .v-select) {
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 960px) {
  .toolbar-section {
    padding: 14px 18px;
  }
}

@media (max-width: 600px) {
  .page-header {
    padding-bottom: 12px;
  }
  
  .welcome-header {
    padding: 40px 28px;
  }
  
  .welcome-header h1 {
    font-size: 1.75rem !important;
  }
  
  .toolbar-section {
    padding: 10px 14px;
  }
  
  .table-cell {
    padding: 14px 12px !important;
  }
  
  .empty-state-cell {
    padding: 40px 18px !important;
  }
}
</style>