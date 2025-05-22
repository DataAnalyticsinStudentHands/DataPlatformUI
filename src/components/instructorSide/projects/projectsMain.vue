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
            <!-- MODIFIED: Dynamic tab title -->
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
                <!-- MODIFIED: Dynamic tab title for the first tab -->
                <v-tab value="active-projects">
                  {{ activeTab === 'active-projects' && viewingArchivedProjects ? $t('Archived Projects') : $t('Active Projects') }}
                </v-tab>
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
            <v-row class="mb-2">
              <v-col cols="12" md="8" lg="7" class="d-flex align-center flex-wrap gap-3">
                <!-- Unified Search Field with Dropdown -->
                <v-text-field
                  v-model="searchQuery"
                  :label="$t(searchLabel)"
                  density="compact"
                  variant="outlined"
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
                          <v-icon>mdi-magnify</v-icon>
                          <v-icon size="small">mdi-chevron-down</v-icon>
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
                      <v-icon>mdi-arrow-right-thin-circle-outline</v-icon> 
                    </div>
                  </template>
                </v-text-field>

                <!-- Status Filter v-select block has been completely removed -->

              </v-col>
              <v-col cols="12" md="4" lg="5" class="d-flex justify-start justify-md-end align-center">
                <!-- ADDED: View Archived Projects Button -->
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


            <!-- Chips Row -->
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

            <v-window v-model="activeTab">
              <!-- Tabs Content -->
              <v-window-item value="active-projects">
                <v-card flat>
                  <v-data-table
                    :headers="projectHeaders"
                    :items="filteredActiveProjects"
                    hover
                    class="cursor-pointer"
                    :loading="tableLoading"
                    :no-data-text="viewingArchivedProjects ? $t('No archived projects found') : $t('No active projects found')"
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
                            :color="getStatusColor(item.projectStatus)"
                            :text-color="getStatusTextColor(item.projectStatus)"
                          >
                            <!-- MODIFIED: Translate status text -->
                            {{ $t(item.projectStatus) }}
                          </v-chip>
                        </td>
                        <td>{{ formatDate(item.updatedAt) }}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-window-item>
              
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
                            <!-- MODIFIED: Translate status text -->
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

    <!-- Project Template Dialog (No changes here) -->
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

export default {
  name: "InstructorProjectsMain",
  data() {
    return {
      activeTab: "active-projects",
      loading: false,
      tableLoading: false,
      
      proposals: [], // Stores 'Proposed' projects
      // MODIFIED: activeProjects is removed, allNonProposalProjects holds Active & Archived
      // activeProjects: [], 
      allNonProposalProjects: [], // Stores 'Active' and 'Archived' projects
      viewingArchivedProjects: false, // To toggle between Active and Archived in the first tab
      
      // Filter Models & Chips
      searchQuery: '', 
      // selectedStatus: '', // REMOVED
      searchLabel: 'Search All Fields', 
      currentSearchCategory: 'All Fields', 
      searchMenuItems: [ 
        { title: 'Search All Fields', value: 'All Fields' },
        { title: 'Search by Experience', value: 'Experience' },
        { title: 'Search by Project Member', value: 'Member' },
      ],
      searchChips: [], 
      selectedChipIndices: [], 
      filterDebounceTimer: null,
      
      // Template Dialog Data
      templateDialog: false,
      templateName: '',
      templateDescription: '',
      templateExperience: '',
      templateExperienceOptions: [],

      // Table Headers & Options
      // statusOptions: [], // REMOVED
      proposalHeaders: [
        { title: this.$t('Project Name'), align: 'start', key: 'projectName', sortable: true },
        { title: this.$t('Student'), key: 'studentName', sortable: true },
        { title: this.$t('Experience'), key: 'experienceInfo', sortable: true },
        { title: this.$t('Status'), key: 'projectStatus', sortable: true },
        { title: this.$t('Submitted Date'), key: 'submittedDate', sortable: true }
      ],
      projectHeaders: [ // Headers for the first tab (Active/Archived)
        { title: this.$t('Project Name'), align: 'start', key: 'projectName', sortable: true },
        { title: this.$t('Team Lead'), key: 'teamLeadName', sortable: true },
        { title: this.$t('Experience'), key: 'experienceInfo', sortable: true },
        { title: this.$t('Team Size'), key: 'teamSize', sortable: true },
        { title: this.$t('Status'), key: 'projectStatus', sortable: true }, // Keep Status to see Active/Archived
        { title: this.$t('Last Updated'), key: 'updatedAt', sortable: true }
      ],
    };
  },
  setup() {
    const loggedInUserStore = useLoggedInUserStore();
    return { loggedInUserStore };
  },
  computed: {
    pendingProposalsCount() {
      // MODIFIED: Directly use proposals length
      return this.proposals.length;
    },
    // ADDED: Computed property to get the current list for the first tab (Active or Archived)
    currentActiveOrArchivedList() {
        if (this.viewingArchivedProjects) {
            return this.allNonProposalProjects.filter(p => p.projectStatus === 'Archived');
        } else {
            return this.allNonProposalProjects.filter(p => p.projectStatus === 'Active');
        }
    },
    filteredActiveProjects() {
      // MODIFIED: Filters the new currentActiveOrArchivedList
      return this.filterProjects(this.currentActiveOrArchivedList);
    },
    filteredProposals() {
      return this.filterProjects(this.proposals);
    },
    hasActiveFilters() { 
      return this.selectedChipIndices.length > 0;
    }
  },
  watch: {
    // ADDED: Watcher for activeTab to reset viewingArchivedProjects if desired
    activeTab(newTab) {
        if (newTab !== 'active-projects' && this.viewingArchivedProjects) {
            this.viewingArchivedProjects = false; // Reset to viewing active if tab changes
        }
        // Optionally clear filters when tabs change
        // this.clearAllFilters(); 
    }
  },
  async mounted() {
    this.loading = true; 
    await this.fetchProjects(); 
    await this.fetchExperiencesForTemplateDialog(); 
    
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
    async fetchProjects() {
      this.tableLoading = true;
      try {
        const user = this.loggedInUserStore;
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects`; 
        
        const response = await axios.get(apiURL, { headers: { token } });
        
        if (response.data && response.data.projects) {
          const allFetchedProjects = response.data.projects.map(project => { // Renamed
            const experienceInfo = project.experiences?.length
              ? project.experiences[0].experienceName
              : this.$t('Not assigned');
            const teamSize = project.members?.length || 1; 
            const teamLeadName = project.members?.find(m => m.isOwner)?.name || 
                               project.createdBy?.name || 
                               this.$t('Unknown');
            const studentName = project.createdBy?.name || this.$t('Unknown'); 
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
          
          this.proposals = allFetchedProjects.filter(p => p.projectStatus === 'Proposed');
          // MODIFIED: Populate allNonProposalProjects
          this.allNonProposalProjects = allFetchedProjects.filter(p => p.projectStatus !== 'Proposed');
          // this.activeProjects = projects.filter(p => p.projectStatus === 'Active'); // REMOVED
        } else {
          this.proposals = [];
          this.allNonProposalProjects = []; // MODIFIED
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error(this.$t("Error loading projects. Please try again later."), {
          position: 'top-right', toastClassName: 'Toastify__toast--delete', multiple: false
        });
        this.proposals = [];
        this.allNonProposalProjects = []; // MODIFIED
      } finally {
        this.tableLoading = false;
      }
    },
    
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
    
    updateSearchCriteria(item) {
      this.currentSearchCategory = item.value;
      this.searchLabel = item.title; 
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        this.addSearchChipAndSelect();
      }
    },

    addSearchChipAndSelect() {
      const term = this.searchQuery.trim();
      if (!term) return;

      const category = this.currentSearchCategory;
      const categoryDisplayName = this.searchLabel;

      const existingExactChipIndex = this.searchChips.findIndex(
        (chip) =>
          chip.category === category &&
          chip.term.toLowerCase() === term.toLowerCase()
      );

      if (existingExactChipIndex !== -1) {
        if (!this.selectedChipIndices.includes(existingExactChipIndex)) {
          this.selectedChipIndices.push(existingExactChipIndex);
          this.selectedChipIndices.sort((a, b) => a - b);
        }
        this.searchQuery = ""; 
        this.applyFiltersDebounced(); 
        return;
      }

      this.searchChips.push({ category, term, categoryDisplayName });
      const newChipGeneratedIndex = this.searchChips.length - 1;

      if (!this.selectedChipIndices.includes(newChipGeneratedIndex)) {
        this.selectedChipIndices.push(newChipGeneratedIndex);
        this.selectedChipIndices.sort((a, b) => a - b);
      }

      this.searchQuery = ""; 
      this.applyFiltersDebounced();
    },

    clearSearchField() {
        this.searchQuery = '';
    },
    
    // handleStatusChangeAndSelect(statusValue) { ... } // ENTIRE METHOD REMOVED

    removeSearchChip(chipToRemove, indexOfChipRemoved) {
      this.searchChips.splice(indexOfChipRemoved, 1);

      const selectedIndexPos = this.selectedChipIndices.indexOf(indexOfChipRemoved);
      if (selectedIndexPos > -1) {
        this.selectedChipIndices.splice(selectedIndexPos, 1);
      }
      this.selectedChipIndices = this.selectedChipIndices.map(i => (i > indexOfChipRemoved ? i - 1 : i));
      
      // if (chipToRemove.category === 'Status') { // REMOVED: No longer need to handle selectedStatus
      //   if (this.selectedStatus !== '') this.selectedStatus = ''; 
      // }
      this.applyFiltersDebounced();
    },
    
    applyFiltersDebounced() {
      if (this.filterDebounceTimer) {
        clearTimeout(this.filterDebounceTimer);
      }
      this.filterDebounceTimer = setTimeout(() => {
        this.applyFilters();
      }, 300); 
    },

    applyFilters() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableLoading = false;
      }, 100);
    },
    
    // MODIFIED: clearAllFilters to remove status handling
    clearAllFilters() {
      this.searchQuery = '';
      // No selectedStatus to clear
      this.searchChips = [];
      this.selectedChipIndices = [];
      this.searchLabel = 'Search All Fields'; 
      this.currentSearchCategory = 'All Fields'; 
      this.applyFiltersDebounced();
    },

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
                    // case 'Status': // REMOVED from switch as Status chips are no longer generated by UI
                    // return project.projectStatus?.toLowerCase() === termLower;
                    default:
                    return true;
                }
            });
        });
      });
    },
    
    // ADDED: Method to toggle the view of archived projects
    toggleArchivedProjectsView() {
        this.viewingArchivedProjects = !this.viewingArchivedProjects;
        // The computed property `filteredActiveProjects` will automatically update.
        // If you want to clear search chips when toggling this view, uncomment below:
        // this.searchChips = [];
        // this.selectedChipIndices = [];
        // this.applyFiltersDebounced();
    },
        
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

    saveTemplate() {
      console.log("Save template:", this.templateName, this.templateDescription, this.templateExperience);
      toast.info(this.$t("Template saving not yet implemented."), { position: 'top-right' });
      this.templateDialog = false;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(this.$i18n.locale || 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'Proposed': return 'amber-darken-1';
        case 'Archived': return 'grey';
        default: return 'blue';
      }
    },
    
    getStatusTextColor() { 
      return 'white'; 
    }
  },
  beforeUnmount() {
    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
    }
  }
};
</script>

<style scoped>
/* Styles remain the same as your provided version */
.pointer-cursor {
  cursor: pointer;
}

.max-width-400 { 
  max-width: 400px;
  min-width: 250px;
}

.max-width-200 { /* This class can be removed if no other element uses it now */
  /* max-width: 200px;
  min-width: 150px; */
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

.v-chip .v-chip__content {
}
</style>