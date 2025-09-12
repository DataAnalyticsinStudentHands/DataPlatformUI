<!-- 
projectsMain.vue (Instructor Side)
Main instructor dashboard for managing projects and proposals. Features tabbed interface 
for active/archived projects and proposals, advanced search and filtering capabilities, 
and archive view toggle. Includes project review workflow and template creation.
With state persistence via Pinia store. Updated to display document count.
-->

<template>
  <v-container fluid fill-height>
    <!-- Loading state while fetching projects -->
    <v-row v-if="loading" class="fill-height" align="center" justify="center">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="#c8102e" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <template v-else>
      <v-container>
        <!-- Page header -->
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold">{{ $t('Projects') }}</h1>
          </v-col>
        </v-row>

        <!-- Main tabs interface -->
        <v-row>
          <v-col cols="12">
            <v-card flat class="mb-4">
              <v-tabs
                v-model="activeTab"
                color="#c8102e"
                align-tabs="start"
              >
                <!-- Dynamic tab title based on archive view state -->
                <v-tab value="active-projects">
                  {{ activeTab === 'active-projects' && viewingArchivedProjects ? $t('Archived Projects') : $t('Active Projects') }}
                </v-tab>
                <!-- Proposals tab with notification badge -->
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

            <!-- Search and filter controls -->
            <v-row class="mb-2">
              <v-col cols="12" md="8" lg="7" class="d-flex align-center flex-wrap gap-3">
                <!-- Advanced search field with category dropdown -->
                <v-text-field
                  v-model="searchQuery"
                  :label="$t(searchLabel)"
                  density="compact"
                  variant="solo-filled"
                  flat
                  hide-details
                  clearable
                  class="flex-grow-1 max-width-400"
                  @keyup.enter="addSearchChipAndSelect"
                  @click:clear="clearSearchField"
                >
                  <template v-slot:prepend-inner>
                    <v-menu location="bottom">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props" class="pointer-cursor d-flex align-center">
                          <v-icon size="small">mdi-magnify</v-icon>
                          <v-icon size="x-small">mdi-chevron-down</v-icon>
                        </div>
                      </template>
                      <v-list density="compact">
                        <v-list-item
                          v-for="item in searchMenuItems"
                          :key="item.value"
                          @click="updateSearchCriteria(item)"
                        >
                          <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <template v-slot:append-inner>
                    <div class="pointer-cursor" @click="addSearchChipAndSelect">
                      <v-icon size="small">mdi-chevron-right</v-icon>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4" lg="5" class="d-flex justify-start justify-md-end align-center">
                <!-- Archive view toggle button -->
                <v-btn
                    v-if="activeTab === 'active-projects'"
                    @click="toggleArchivedProjectsView"
                    elevation="1"
                    :append-icon="viewingArchivedProjects ? '' : 'mdi-archive-arrow-down-outline'"
                    :prepend-icon="viewingArchivedProjects ? 'mdi-folder-open-outline' : ''"
                    class="ml-2"
                >
                    {{ viewingArchivedProjects ? $t('View Active') : $t('View Archive') }}
                </v-btn>
              </v-col>
            </v-row>

            <!-- Active filter chips display -->
            <v-row v-if="searchChips.length > 0" class="mt-0 mb-2" dense>
              <v-col cols="12">
                <v-chip-group 
                    v-model="selectedChipIndices" 
                    column 
                    multiple
                    @update:model-value="applyFiltersDebounced" 
                >
                  <v-chip
                    v-for="(chip, index) in searchChips"
                    :key="chip.category + chip.term + chip.categoryDisplayName + index"
                    filter              
                    variant="outlined"
                    class="ma-2"
                    :value="index"
                  >
                    {{ $t(chip.categoryDisplayName) + '="' + chip.term + '"' }}
                    <v-icon
                      end
                      @click.stop="removeSearchChip(chip, index)"
                    >mdi-close</v-icon>
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>

            <!-- Tab content windows -->
            <v-window v-model="activeTab">
              <!-- Active/Archived projects tab -->
              <v-window-item value="active-projects">
                <v-card flat>
                  <v-data-table
                    :headers="projectHeaders"
                    :items="filteredActiveProjects"
                    hover
                    class="cursor-pointer"
                    :loading="tableLoading"
                    :no-data-text="viewingArchivedProjects ? $t('No archived projects found') : $t('No active projects found')"
                    v-model:items-per-page="activeProjectsItemsPerPage"
                    v-model:page="activeProjectsCurrentPage"
                    v-model:sort-by="activeProjectsSortBy"
                    :items-per-page-options="itemsPerPageOptions"
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
                        <td>{{ item.documentCount }}</td>
                        <td>
                          <v-chip
                            size="small"
                            :color="getStatusColor(item.projectStatus)"
                            :text-color="getStatusTextColor(item.projectStatus)"
                          >
                            {{ $t(item.projectStatus) }}
                          </v-chip>
                        </td>
                        <td>{{ formatDate(item.updatedAt) }}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-window-item>
              
              <!-- Project proposals tab -->
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
                    v-model:items-per-page="proposalsItemsPerPage"
                    v-model:page="proposalsCurrentPage"
                    v-model:sort-by="proposalsSortBy"
                    :items-per-page-options="itemsPerPageOptions"
                  >
                    <template v-slot:loading>
                      <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
                    </template>
                    <template v-slot:body="{ items }">
                      <tr v-for="item in items" :key="item._id" @click="viewProposal(item)" class="cursor-pointer">
                        <td>{{ item.projectName }}</td>
                        <td>{{ item.studentName }}</td>
                        <td>{{ item.experienceInfo }}</td>
                        <td>
                          <v-chip
                            size="small"
                            :color="getStatusColor(item.projectStatus)"
                            :text-color="getStatusTextColor(item.projectStatus)"
                          >
                            {{ $t(item.projectStatus) }}
                          </v-chip>
                        </td>
                        <td>{{ formatDate(item.submittedDate) }}</td>
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

    <!-- Project template creation dialog -->
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
            :items="templateExperienceOptions" 
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
            disabled 
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
import { useInstructorViewsStore } from "@/stored/instructorViews";

export default {
  name: "InstructorProjectsMain",
  setup() {
    const loggedInUserStore = useLoggedInUserStore();
    const viewsStore = useInstructorViewsStore();
    return { loggedInUserStore, viewsStore };
  },
  data() {
    return {
      // Loading states
      loading: false,
      tableLoading: false,
      
      // Project data arrays
      proposals: [],
      allNonProposalProjects: [],
      
      // Search state
      searchQuery: '', 
      searchLabel: 'Search All Fields', 
      currentSearchCategory: 'All Fields', 
      searchMenuItems: [ 
        { title: 'Search All Fields', value: 'All Fields' },
        { title: 'Search by Experience', value: 'Experience' },
        { title: 'Search by Project Member', value: 'Member' },
      ],
      filterDebounceTimer: null,
      
      // Template dialog data
      templateDialog: false,
      templateName: '',
      templateDescription: '',
      templateExperience: '',
      templateExperienceOptions: [],

      // Table configuration
      itemsPerPageOptions: [
        {value: 5, title: "5"},
        {value: 10, title: "10"},
        {value: 15, title: "15"},
        {value: 20, title: "20"},
        {value: -1, title: "$vuetify.dataFooter.itemsPerPageAll"},
      ],
      proposalHeaders: [
        { title: this.$t('Project Name'), align: 'start', key: 'projectName', sortable: true },
        { title: this.$t('Student'), key: 'studentName', sortable: true },
        { title: this.$t('Experience'), key: 'experienceInfo', sortable: true },
        { title: this.$t('Status'), key: 'projectStatus', sortable: true },
        { title: this.$t('Submitted Date'), key: 'submittedDate', sortable: true }
      ],
      projectHeaders: [
        { title: this.$t('Project Name'), align: 'start', key: 'projectName', sortable: true },
        { title: this.$t('Team Lead'), key: 'teamLeadName', sortable: true },
        { title: this.$t('Experience'), key: 'experienceInfo', sortable: true },
        { title: this.$t('Team Size'), key: 'teamSize', sortable: true },
        { title: this.$t('Documents'), key: 'documentCount', sortable: true },
        { title: this.$t('Status'), key: 'projectStatus', sortable: true },
        { title: this.$t('Last Updated'), key: 'updatedAt', sortable: true }
      ]
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
    
    // Sync with store - selected chip indices
    selectedChipIndices: {
      get() {
        return this.viewsStore.getProjectsSelectedChipIndices;
      },
      set(value) {
        this.viewsStore.setProjectsSelectedChipIndices(value);
      }
    },
    
    // Pagination and sorting for active projects
    activeProjectsItemsPerPage: {
      get() {
        return this.viewsStore.getProjectsItemsPerPage('activeProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('activeProjects', { itemsPerPage: value });
      }
    },
    
    activeProjectsCurrentPage: {
      get() {
        return this.viewsStore.getProjectsCurrentPage('activeProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('activeProjects', { currentPage: value });
      }
    },
    
    activeProjectsSortBy: {
      get() {
        return this.viewsStore.getProjectsSortBy('activeProjects');
      },
      set(value) {
        this.viewsStore.updateProjectsSorting('activeProjects', value);
      }
    },
    
    // Pagination and sorting for proposals
    proposalsItemsPerPage: {
      get() {
        return this.viewsStore.getProjectsItemsPerPage('proposals');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('proposals', { itemsPerPage: value });
      }
    },
    
    proposalsCurrentPage: {
      get() {
        return this.viewsStore.getProjectsCurrentPage('proposals');
      },
      set(value) {
        this.viewsStore.updateProjectsPagination('proposals', { currentPage: value });
      }
    },
    
    proposalsSortBy: {
      get() {
        return this.viewsStore.getProjectsSortBy('proposals');
      },
      set(value) {
        this.viewsStore.updateProjectsSorting('proposals', value);
      }
    },
    
    // Count of pending proposals for badge display
    pendingProposalsCount() {
      return this.proposals.length;
    },
    
    // Current list for active/archived projects tab
    currentActiveOrArchivedList() {
        if (this.viewingArchivedProjects) {
            return this.allNonProposalProjects.filter(p => p.projectStatus === 'Archived');
        } else {
            return this.allNonProposalProjects.filter(p => p.projectStatus === 'Active');
        }
    },
    
    // Filtered active/archived projects based on search criteria
    filteredActiveProjects() {
      return this.filterProjects(this.currentActiveOrArchivedList);
    },
    
    // Filtered proposals based on search criteria
    filteredProposals() {
      return this.filterProjects(this.proposals);
    },
    
    // Check if any filters are currently active
    hasActiveFilters() { 
      return this.selectedChipIndices.length > 0;
    }
  },
  watch: {
    // Reset archive view when switching tabs
    activeTab(newTab) {
        if (newTab !== 'active-projects' && this.viewingArchivedProjects) {
            this.viewingArchivedProjects = false;
        }
    }
  },
  
  // Component initialization
  async mounted() {
    this.loading = true; 
    await this.fetchProjects(); 
    await this.fetchExperiencesForTemplateDialog(); 
    
    // Handle navigation toast messages
    const loggedInUserStore = useLoggedInUserStore();
    if (loggedInUserStore.navigationData?.toastType) {
      toast[loggedInUserStore.navigationData.toastType](this.$t(loggedInUserStore.navigationData.toastMessage), {
        position: loggedInUserStore.navigationData.toastPosition,
        toastClassName: loggedInUserStore.navigationData.toastCSS
      });
      loggedInUserStore.navigationData = null;
    }
    this.loading = false; 
  },
  
  methods: {
    // Fetch all projects from API and categorize by status
    async fetchProjects() {
      this.tableLoading = true;
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects`; 
        
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data && response.data.projects) {
          const allFetchedProjects = response.data.projects.map(project => {
            // Extract project information for table display
            const experienceInfo = project.experiences?.length
              ? project.experiences[0].experienceName
              : this.$t('Not assigned');
            const teamSize = project.members?.length || 1; 
            const teamLeadName = project.members?.find(m => m.isOwner)?.name || 
                               project.createdBy?.name || 
                               this.$t('Unknown');
            const studentName = project.createdBy?.name || this.$t('Unknown'); 
            const submittedDate = project.createdAt;
            const documentCount = project.documentCount || 0; // Get document count from API response
            
            return { 
              ...project, 
              experienceInfo, 
              teamSize, 
              teamLeadName, 
              studentName, 
              submittedDate,
              documentCount 
            };
          });
          
          // Separate projects by status
          this.proposals = allFetchedProjects.filter(p => p.projectStatus === 'Proposed');
          this.allNonProposalProjects = allFetchedProjects.filter(p => p.projectStatus !== 'Proposed');
        } else {
          this.proposals = [];
          this.allNonProposalProjects = [];
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error(this.$t("Error loading projects. Please try again later."), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        this.proposals = [];
        this.allNonProposalProjects = [];
      } finally {
        this.tableLoading = false;
      }
    },
    
    // Fetch available experiences for template dialog
    async fetchExperiencesForTemplateDialog() {
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences`;
        const response = await axios.get(apiURL, { headers: { token } });
        if (response.data && response.data.experiences) {
          this.templateExperienceOptions = [
            ...response.data.experiences.map(exp => ({
              title: exp.experienceName,
              value: exp._id 
            }))
          ];
        } else {
          this.templateExperienceOptions = [];
        }
      } catch (error) {
        console.error("Error fetching experiences for template dialog:", error);
        this.templateExperienceOptions = [];
      }
    },
    
    // Update search category from dropdown selection
    updateSearchCriteria(item) {
      this.currentSearchCategory = item.value;
      this.searchLabel = item.title; 
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        this.addSearchChipAndSelect();
      }
    },

    // Add search term as chip and apply filter
    addSearchChipAndSelect() {
      const term = this.searchQuery.trim();
      if (!term) return;

      const category = this.currentSearchCategory;
      const categoryDisplayName = this.searchLabel;

      // Check for existing exact match
      const existingExactChipIndex = this.searchChips.findIndex(
        (chip) =>
          chip.category === category &&
          chip.term.toLowerCase() === term.toLowerCase()
      );

      if (existingExactChipIndex !== -1) {
        if (!this.selectedChipIndices.includes(existingExactChipIndex)) {
          this.selectedChipIndices = [...this.selectedChipIndices, existingExactChipIndex].sort((a, b) => a - b);
        }
        this.searchQuery = ""; 
        this.applyFiltersDebounced(); 
        return;
      }

      // Create new search chip
      const newChips = [...this.searchChips, { category, term, categoryDisplayName }];
      this.searchChips = newChips;
      const newChipGeneratedIndex = newChips.length - 1;

      if (!this.selectedChipIndices.includes(newChipGeneratedIndex)) {
        this.selectedChipIndices = [...this.selectedChipIndices, newChipGeneratedIndex].sort((a, b) => a - b);
      }

      this.searchQuery = ""; 
      this.applyFiltersDebounced();
    },

    // Clear search input field
    clearSearchField() {
        this.searchQuery = '';
    },

    // Remove search chip and update indices
    removeSearchChip(chipToRemove, indexOfChipRemoved) {
      const newChips = this.searchChips.filter((_, index) => index !== indexOfChipRemoved);
      this.searchChips = newChips;

      let newSelectedIndices = this.selectedChipIndices.filter(i => i !== indexOfChipRemoved);
      newSelectedIndices = newSelectedIndices.map(i => (i > indexOfChipRemoved ? i - 1 : i));
      this.selectedChipIndices = newSelectedIndices;
      
      this.applyFiltersDebounced();
    },
    
    // Apply filters with debounce to prevent excessive updates
    applyFiltersDebounced() {
      if (this.filterDebounceTimer) {
        clearTimeout(this.filterDebounceTimer);
      }
      this.filterDebounceTimer = setTimeout(() => {
        this.applyFilters();
      }, 300); 
    },

    // Apply current filters to table display
    applyFilters() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableLoading = false;
      }, 100);
    },
    
    // Clear all active filters and search criteria
    clearAllFilters() {
      this.searchQuery = '';
      this.searchChips = [];
      this.selectedChipIndices = [];
      this.searchLabel = 'Search All Fields'; 
      this.currentSearchCategory = 'All Fields'; 
      this.applyFiltersDebounced();
    },

    // Filter projects based on active search chips
    filterProjects(projectsToFilter) {
      if (this.selectedChipIndices.length === 0) {
        return projectsToFilter; 
      }
      const activeFilterChips = this.selectedChipIndices
        .map(index => this.searchChips[index])
        .filter(chip => chip); 

      if (activeFilterChips.length === 0) return projectsToFilter;

      return projectsToFilter.filter(project => {
        const groupedFilters = activeFilterChips.reduce((acc, chip) => {
            acc[chip.category] = acc[chip.category] || [];
            acc[chip.category].push(chip.term.toLowerCase());
            return acc;
        }, {});

        return Object.entries(groupedFilters).every(([category, terms]) => {
            return terms.some(termLower => {
                switch (category) {
                    case 'All Fields':
                    return (project.projectName?.toLowerCase().includes(termLower)) ||
                            (project.studentName?.toLowerCase().includes(termLower)) || 
                            (project.teamLeadName?.toLowerCase().includes(termLower)) ||
                            (project.experienceInfo?.toLowerCase().includes(termLower)); 
                    case 'Experience':
                    return project.experienceInfo?.toLowerCase().includes(termLower);
                    case 'Member':
                    const createdByMatch = project.createdBy?.name?.toLowerCase().includes(termLower);
                    const memberMatch = project.members?.some(member => member.name?.toLowerCase().includes(termLower));
                    return createdByMatch || memberMatch;
                    default:
                    return true;
                }
            });
        });
      });
    },
    
    // Toggle between active and archived project views
    toggleArchivedProjectsView() {
        this.viewingArchivedProjects = !this.viewingArchivedProjects;
    },
        
    // Navigate to proposal review page
    viewProposal(project) {
      if (!project?._id) {
        console.error('Invalid project data:', project);
        toast.error(this.$t("Error processing project data"), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        return;
      }
      this.loggedInUserStore.navigationData = { projectID: project._id };
      this.$router.push({ name: 'viewProjectProposal' });
    },
    
    // Navigate to project editing page
    viewProject(project) {
      if (!project?._id) {
        console.error('Invalid project data:', project);
        toast.error(this.$t("Error processing project data"), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        return;
      }
      this.loggedInUserStore.navigationData = { projectID: project._id };
      this.$router.push({ name: 'editProjectInstructor' });
    },

    // Save project template (placeholder implementation)
    saveTemplate() {
      toast.info(this.$t("Template saving not yet implemented."), { position: 'top-right' });
      this.templateDialog = false;
    },
    
    // Format date for table display
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(this.$i18n.locale || 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    
    // Get color for project status badges
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'Proposed': return 'amber-darken-1';
        case 'Archived': return 'grey';
        default: return 'blue';
      }
    },
    
    // Get text color for project status badges
    getStatusTextColor() { 
      return 'white'; 
    }
  },
  
  // Cleanup on component unmount
  beforeUnmount() {
    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
    }
  }
};
</script>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}

.max-width-400 { 
  max-width: 400px;
  min-width: 250px;
}

.flex-grow-1 {
  flex-grow: 1;
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

.v-data-table .v-data-table__tbody tr:hover td {
  background-color: rgba(200, 16, 46, 0.05);
}

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
  margin-right: 32px; 
}

.v-text-field .v-input__prepend-inner .v-icon,
.v-text-field .v-input__append-inner .v-icon {
  align-self: center;
}
</style>