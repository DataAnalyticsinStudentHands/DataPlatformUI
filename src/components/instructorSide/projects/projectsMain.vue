<!-- 
projectsMain.vue (Instructor Side)
Main instructor dashboard for managing projects and proposals. Features tabbed interface 
for active/archived projects and proposals, advanced search and filtering capabilities, 
and archive view toggle. Includes project review workflow and template creation.
With state persistence via Pinia store. Updated to display document count and consent status.
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
        <!-- Page Header -->
        <div class="page-header mb-6">
          <div class="d-flex align-center mb-2">
            <v-icon color="#c8102e" size="36" class="mr-3">mdi-clipboard-text-multiple-outline</v-icon>
            <div class="flex-grow-1">
              <div class="d-flex align-center flex-wrap">
                <h1 class="text-h4 font-weight-bold mr-3">{{ $t('Projects') }}</h1>
                <v-chip 
                  v-if="pendingProposalsCount > 0"
                  color="deep-orange"
                  size="small"
                  class="font-weight-medium"
                >
                  {{ pendingProposalsCount }} {{ $t('pending') }}
                </v-chip>
              </div>
              <p class="text-body-1 text-medium-emphasis mb-0">{{ $t('Review and manage student projects') }}</p>
            </div>
            <v-btn
              variant="outlined"
              color="#c8102e"
              prepend-icon="mdi-star-shooting"
              @click="$router.push({ name: 'instructorFeaturedProjects' })"
            >
              Featured Projects
            </v-btn>
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
              <v-tab value="active-projects" class="custom-tab">
                <v-icon start size="22">mdi-folder-open-outline</v-icon>
                <span class="d-none d-sm-inline">
                  {{ viewingArchivedProjects ? $t('Archived Projects') : $t('Active Projects') }}
                </span>
                <span class="d-inline d-sm-none">
                  {{ viewingArchivedProjects ? $t('Archived') : $t('Active') }}
                </span>
                <v-chip 
                  v-if="currentActiveOrArchivedList.length > 0" 
                  size="small" 
                  class="ml-2"
                  :color="viewingArchivedProjects ? 'grey' : '#c8102e'"
                  variant="tonal"
                >
                  {{ currentActiveOrArchivedList.length }}
                </v-chip>
              </v-tab>
              <v-tab value="proposals" class="custom-tab">
                <v-icon start size="22">mdi-file-document-edit-outline</v-icon>
                <span class="d-none d-sm-inline">{{ $t('Project Proposals') }}</span>
                <span class="d-inline d-sm-none">{{ $t('Proposals') }}</span>
                <v-chip 
                  v-if="proposals.length > 0" 
                  size="small" 
                  class="ml-2"
                  color="deep-orange"
                  variant="tonal"
                >
                  {{ proposals.length }}
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
                  v-model="searchQuery"
                  density="comfortable"
                  :placeholder="searchPlaceholder"
                  flat
                  hide-details
                  clearable
                  variant="outlined"
                  class="search-field"
                  @keyup.enter="addSearchChipAndSelect"
                  @click:clear="clearSearchField"
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
                          :key="item.value"
                          @click="updateSearchCriteria(item)"
                          :active="currentSearchCategory === item.value"
                        >
                          <template v-slot:prepend>
                            <v-icon size="20">{{ getSearchIcon(item.value) }}</v-icon>
                          </template>
                          <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="addConsentFilter(true)"
                          :active="hasConsentFilter(true)"
                        >
                          <template v-slot:prepend>
                            <v-icon size="20">mdi-star</v-icon>
                          </template>
                          <v-list-item-title>{{ $t('Consent to Feature') }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <template v-slot:append-inner>
                    <v-btn 
                      icon 
                      size="small" 
                      variant="text"
                      @click="addSearchChipAndSelect"
                      :disabled="!searchQuery"
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
                  v-if="activeTab === 'active-projects'"
                  @click="toggleArchivedProjectsView"
                  variant="tonal"
                  :color="viewingArchivedProjects ? '#c8102e' : 'grey-darken-4'"
                  size="default"
                  class="action-btn"
                >
                  <v-icon start size="20">{{ viewingArchivedProjects ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
                  <span class="d-none d-md-inline">{{ viewingArchivedProjects ? $t('View Active') : $t('View Archived') }}</span>
                  <span class="d-inline d-md-none">{{ viewingArchivedProjects ? $t('Active') : $t('Archive') }}</span>
                </v-btn>
              </v-col>
              
              <!-- Mobile Action Bar -->
              <v-col cols="12" class="d-flex d-sm-none mobile-action-bar">
                <v-btn 
                  icon 
                  variant="text"
                  size="default"
                  @click="mobileSearchDialog = true"
                  class="mobile-action-btn"
                >
                  <v-icon size="24">mdi-magnify</v-icon>
                </v-btn>
                
                <v-btn
                  v-if="activeTab === 'active-projects'"
                  icon
                  variant="text"
                  size="default"
                  @click="toggleArchivedProjectsView"
                  class="mobile-action-btn"
                  :color="viewingArchivedProjects ? '#c8102e' : undefined"
                >
                  <v-icon size="24">{{ viewingArchivedProjects ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
                </v-btn>
                
                <v-spacer></v-spacer>
              </v-col>
            </v-row>
            
            <!-- Active Search Chips -->
            <div v-if="searchChips.length > 0" class="search-chips-container mt-3">
              <div class="d-flex align-center flex-wrap">
                <span class="text-body-2 text-medium-emphasis mr-2">{{ $t('Filters:') }}</span>
                <v-chip
                  v-for="(chip, index) in searchChips"
                  :key="chip.category + chip.term + index"
                  :color="getChipColor(chip, index)"
                  :variant="selectedChipIndices.includes(index) ? 'flat' : 'outlined'"
                  size="default"
                  class="search-chip mr-2 mb-1"
                  @click="toggleChipSelection(index)"
                  closable
                  @click:close="removeSearchChip(chip, index)"
                >
                  <v-icon start size="16">{{ getSearchIcon(chip.category) }}</v-icon>
                  {{ $t(chip.categoryDisplayName) }}: {{ chip.term }}
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
            <!-- Active/Archived Projects Tab -->
            <v-window-item value="active-projects">
              <div class="table-container">
                <v-data-table
                  :headers="projectHeaders"
                  :items="filteredActiveProjects"
                  item-key="_id"
                  hover
                  class="projects-table"
                  :mobile-breakpoint="600"
                  :loading="tableLoading"
                  v-model:items-per-page="activeProjectsItemsPerPage"
                  v-model:page="activeProjectsCurrentPage"
                  v-model:sort-by="activeProjectsSortBy"
                  :items-per-page-options="itemsPerPageOptions"
                >
                  <template v-slot:loading>
                    <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
                  </template>
                  <template v-slot:body="{ items }">
                    <template v-if="items.length > 0">
                      <tr 
                        v-for="item in items" 
                        :key="item._id" 
                        @click="viewProject(item)" 
                        class="table-row"
                      >
                        <td class="table-cell">
                          <div class="d-flex align-center">
                            <span class="font-weight-medium project-name">{{ item.projectName }}</span>
                            <v-tooltip v-if="item.consentToFeature" location="top">
                              <template v-slot:activator="{ props }">
                                <v-icon 
                                  v-bind="props"
                                  size="18" 
                                  color="amber-darken-2" 
                                  class="ml-2 consent-icon"
                                >
                                  mdi-star
                                </v-icon>
                              </template>
                              <span>{{ $t('Student consented to feature this project') }}</span>
                            </v-tooltip>
                          </div>
                        </td>
                        <td class="table-cell d-none d-md-table-cell">
                          <span class="text-medium-emphasis">{{ item.teamLeadName }}</span>
                        </td>
                        <td class="table-cell d-none d-sm-table-cell">
                          <span class="text-medium-emphasis experience-text">{{ item.experienceInfo }}</span>
                        </td>
                        <td class="table-cell d-none d-lg-table-cell">
                          <span class="text-medium-emphasis">{{ item.teamSize }}</span>
                        </td>
                        <td class="table-cell d-none d-lg-table-cell">
                          <span class="text-medium-emphasis">{{ item.documentCount }}</span>
                        </td>
                        <td class="table-cell">
                          <v-chip
                            size="default"
                            :color="getStatusColor(item.projectStatus)"
                            variant="tonal"
                            class="status-chip"
                          >
                            <v-icon start size="14">{{ getStatusIcon(item.projectStatus) }}</v-icon>
                            {{ $t(item.projectStatus) }}
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
                              {{ viewingArchivedProjects ? $t('No archived projects') : $t('No active projects') }}
                            </p>
                            <p class="text-body-2 text-disabled mb-0">
                              {{ viewingArchivedProjects 
                                ? $t('Archived projects will appear here') 
                                : $t('Active student projects will appear here') 
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
            
            <!-- Project Proposals Tab -->
            <v-window-item value="proposals">
              <div class="table-container">
                <v-data-table
                  :headers="proposalHeaders"
                  :items="filteredProposals"
                  item-key="_id"
                  hover
                  class="projects-table"
                  :mobile-breakpoint="600"
                  :loading="tableLoading"
                  v-model:items-per-page="proposalsItemsPerPage"
                  v-model:page="proposalsCurrentPage"
                  v-model:sort-by="proposalsSortBy"
                  :items-per-page-options="itemsPerPageOptions"
                >
                  <template v-slot:loading>
                    <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
                  </template>
                  <template v-slot:body="{ items }">
                    <template v-if="items.length > 0">
                      <tr 
                        v-for="item in items" 
                        :key="item._id" 
                        @click="viewProposal(item)" 
                        class="table-row"
                      >
                        <td class="table-cell">
                          <div class="d-flex align-center">
                            <span class="font-weight-medium project-name">{{ item.projectName }}</span>
                            <v-tooltip v-if="item.consentToFeature" location="top">
                              <template v-slot:activator="{ props }">
                                <v-icon 
                                  v-bind="props"
                                  size="18" 
                                  color="amber-darken-2" 
                                  class="ml-2 consent-icon"
                                >
                                  mdi-star
                                </v-icon>
                              </template>
                              <span>{{ $t('Student consented to feature this project') }}</span>
                            </v-tooltip>
                          </div>
                        </td>
                        <td class="table-cell d-none d-md-table-cell">
                          <span class="text-medium-emphasis">{{ item.studentName }}</span>
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
                            {{ $t(item.projectStatus) }}
                          </v-chip>
                        </td>
                        <td class="table-cell d-none d-sm-table-cell">
                          <span class="text-body-2 text-medium-emphasis">{{ formatDate(item.submittedDate) }}</span>
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td :colspan="proposalHeaders.length" class="empty-state-cell">
                          <div class="empty-state">
                            <v-icon size="56" color="#ccc" class="mb-3">mdi-file-document-check-outline</v-icon>
                            <p class="text-h6 text-medium-emphasis mb-1">{{ $t('No pending proposals') }}</p>
                            <p class="text-body-2 text-disabled mb-0">{{ $t('Student project proposals will appear here for review') }}</p>
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
      </template>

      <!-- Mobile Search Dialog -->
      <v-dialog v-model="mobileSearchDialog" max-width="420px">
        <v-card class="mobile-search-dialog">
          <v-card-title class="d-flex align-center pa-5">
            <v-icon color="#c8102e" size="26" class="mr-2">mdi-magnify</v-icon>
            <span class="text-h5 font-weight-bold">{{ $t('Search Projects') }}</span>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" size="default" @click="cancelMobileSearch">
              <v-icon size="24">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-5">
            <v-select
              v-model="mobileSearchCategory"
              :items="mobileSearchMenuItems"
              item-title="title"
              item-value="value"
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
            
            <!-- Show text field for text-based searches -->
            <v-text-field
              v-if="!isConsentFilter(mobileSearchCategory)"
              v-model="mobileSearchQuery"
              :label="$t('Search term')"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-text-field>
            
            <!-- Show info for consent filter -->
            <v-alert
              v-else
              type="info"
              variant="tonal"
              density="compact"
            >
              {{ $t('Filter projects where students consented to feature') }}
            </v-alert>
          </v-card-text>
          
          <v-card-actions class="pa-5 pt-0">
            <v-btn variant="text" size="default" @click="cancelMobileSearch">{{ $t('Cancel') }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="#c8102e" 
              size="default" 
              @click="applyMobileSearch" 
              :disabled="!isConsentFilter(mobileSearchCategory) && !mobileSearchQuery"
            >
              <v-icon start size="20">mdi-check</v-icon>
              {{ $t('Apply Filter') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
  </main>
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
      currentSearchCategory: 'All Fields',
      searchMenuItems: [
        { title: 'All Fields', value: 'All Fields' },
        { title: 'Experience', value: 'Experience' },
        { title: 'Project Member', value: 'Member' },
      ],
      filterDebounceTimer: null,
      
      // Mobile search dialog
      mobileSearchDialog: false,
      mobileSearchCategory: 'All Fields',
      mobileSearchQuery: '',
      
      // Template dialog data
      templateDialog: false,
      templateName: '',
      templateDescription: '',
      templateExperience: '',
      templateExperienceOptions: [],

      // Table configuration
      itemsPerPageOptions: [
        { value: 5, title: "5" },
        { value: 10, title: "10" },
        { value: 15, title: "15" },
        { value: 20, title: "20" },
        { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
      ],
      proposalHeaders: [
        { title: this.$t('Project Name'), align: 'start', key: 'projectName', sortable: true },
        { title: this.$t('Student'), key: 'studentName', sortable: true },
        { title: this.$t('Experience'), key: 'experienceInfo', sortable: true },
        { title: this.$t('Status'), key: 'projectStatus', sortable: true },
        { title: this.$t('Submitted'), key: 'submittedDate', sortable: true }
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
    // Extended mobile search menu items including consent filter
    mobileSearchMenuItems() {
      return [
        ...this.searchMenuItems,
        { title: this.$t('Consent to Feature'), value: 'Consent: Yes' },
      ];
    },
    
    // Search placeholder based on current category
    searchPlaceholder() {
      if (this.currentSearchCategory === 'All Fields') {
        return this.$t('Search all fields...');
      }
      return this.$t('Search by') + ' ' + this.$t(this.currentSearchCategory) + '...';
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
    // Check if a category is a consent filter
    isConsentFilter(category) {
      return category === 'Consent: Yes';
    },
    
    // Get chip color based on type and selection state
    getChipColor(chip, index) {
      if (!this.selectedChipIndices.includes(index)) {
        return 'grey';
      }
      if (chip.category === 'Consent') {
        return 'amber-darken-2';
      }
      return '#c8102e';
    },
    
    // Get icon for search category
    getSearchIcon(category) {
      switch (category) {
        case 'All Fields': return 'mdi-text-search';
        case 'Experience': return 'mdi-school-outline';
        case 'Member': return 'mdi-account-outline';
        case 'Consent': return 'mdi-star';
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
    
    // Check if consent filter already exists
    hasConsentFilter(consentValue) {
      const term = consentValue ? 'Yes' : 'No';
      return this.searchChips.some(chip => 
        chip.category === 'Consent' && chip.term === term
      );
    },
    
    // Add consent filter chip
    addConsentFilter(consentValue) {
      const term = 'Yes';
      const categoryDisplayName = 'Consent to Feature';
      
      // Check if this filter already exists
      const existingIndex = this.searchChips.findIndex(
        chip => chip.category === 'Consent' && chip.term === term
      );
      
      if (existingIndex !== -1) {
        // Toggle selection if exists
        if (!this.selectedChipIndices.includes(existingIndex)) {
          this.selectedChipIndices = [...this.selectedChipIndices, existingIndex].sort((a, b) => a - b);
        }
        return;
      }
      
      // Add new consent filter
      const newChips = [...this.searchChips, { category: 'Consent', term, categoryDisplayName }];
      this.searchChips = newChips;
      const newIndex = newChips.length - 1;
      this.selectedChipIndices = [...this.selectedChipIndices, newIndex].sort((a, b) => a - b);
    },
    
    // Fetch all projects from API and categorize by status
    async fetchProjects() {
      this.tableLoading = true;
      try {
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/projects`;

        const response = await axios.get(apiURL);
        
        if (response.data && response.data.projects) {
          const allFetchedProjects = response.data.projects.map(project => {
            const experienceInfo = project.experiences?.length
              ? project.experiences[0].experienceName
              : this.$t('Not assigned');
            const teamSize = project.members?.length || 1;
            const teamLeadName = project.members?.find(m => m.isOwner)?.name ||
                               project.createdBy?.name ||
                               this.$t('Unknown');
            const studentName = project.createdBy?.name || this.$t('Unknown');
            const submittedDate = project.createdAt;
            const documentCount = project.documentCount || 0;
            
            return {
              ...project,
              experienceInfo,
              teamSize,
              teamLeadName,
              studentName,
              submittedDate,
              documentCount,
              consentToFeature: project.consentToFeature || false
            };
          });
          
          this.proposals = allFetchedProjects.filter(p => p.projectStatus === 'Proposed');
          this.allNonProposalProjects = allFetchedProjects.filter(p => p.projectStatus !== 'Proposed');
        } else {
          this.proposals = [];
          this.allNonProposalProjects = [];
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error(this.$t("Error loading projects. Please try again later."), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
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
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences`;
        const response = await axios.get(apiURL);
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
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        this.addSearchChipAndSelect();
      }
    },

    // Add search term as chip and apply filter
    addSearchChipAndSelect() {
      const term = this.searchQuery?.trim();
      if (!term) return;

      const category = this.currentSearchCategory;
      const categoryDisplayName = category;

      // Check for existing exact match
      const existingIndex = this.searchChips.findIndex(
        chip => chip.category === category && chip.term.toLowerCase() === term.toLowerCase()
      );

      if (existingIndex !== -1) {
        if (!this.selectedChipIndices.includes(existingIndex)) {
          this.selectedChipIndices = [...this.selectedChipIndices, existingIndex].sort((a, b) => a - b);
        }
        this.searchQuery = "";
        return;
      }

      // Create new search chip
      const newChips = [...this.searchChips, { category, term, categoryDisplayName }];
      this.searchChips = newChips;
      const newIndex = newChips.length - 1;

      if (!this.selectedChipIndices.includes(newIndex)) {
        this.selectedChipIndices = [...this.selectedChipIndices, newIndex].sort((a, b) => a - b);
      }

      this.searchQuery = "";
    },

    // Clear search input field
    clearSearchField() {
      this.searchQuery = '';
    },

    // Toggle chip selection
    toggleChipSelection(index) {
      const idx = this.selectedChipIndices.indexOf(index);
      if (idx >= 0) {
        this.selectedChipIndices = this.selectedChipIndices.filter(i => i !== index);
      } else {
        this.selectedChipIndices = [...this.selectedChipIndices, index].sort((a, b) => a - b);
      }
    },

    // Remove search chip and update indices
    removeSearchChip(chipToRemove, indexOfChipRemoved) {
      const newChips = this.searchChips.filter((_, index) => index !== indexOfChipRemoved);
      this.searchChips = newChips;

      let newSelectedIndices = this.selectedChipIndices.filter(i => i !== indexOfChipRemoved);
      newSelectedIndices = newSelectedIndices.map(i => (i > indexOfChipRemoved ? i - 1 : i));
      this.selectedChipIndices = newSelectedIndices;
    },
    
    // Clear all active filters and search criteria
    clearAllFilters() {
      this.searchQuery = '';
      this.searchChips = [];
      this.selectedChipIndices = [];
      this.currentSearchCategory = 'All Fields';
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
              case 'Consent':
                // Handle consent filter - only "Yes" is supported
                return project.consentToFeature === true;
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
    
    // Cancel mobile search dialog
    cancelMobileSearch() {
      this.mobileSearchDialog = false;
      this.mobileSearchQuery = '';
      this.mobileSearchCategory = 'All Fields';
    },
    
    // Apply mobile search filters
    applyMobileSearch() {
      const category = this.mobileSearchCategory;
      
      // Handle consent filter
      if (this.isConsentFilter(category)) {
        this.addConsentFilter(true);
        this.cancelMobileSearch();
        return;
      }
      
      // Handle text-based filters
      if (!this.mobileSearchQuery?.trim()) return;
      
      const term = this.mobileSearchQuery.trim();
      const categoryDisplayName = category;
      
      const newChips = [...this.searchChips, { category, term, categoryDisplayName }];
      this.searchChips = newChips;
      const newIndex = newChips.length - 1;
      this.selectedChipIndices = [...this.selectedChipIndices, newIndex].sort((a, b) => a - b);
      
      this.cancelMobileSearch();
    },
        
    // Navigate to proposal review page
    viewProposal(project) {
      if (!project?._id) {
        console.error('Invalid project data:', project);
        toast.error(this.$t("Error processing project data"), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
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
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
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
      return new Intl.DateTimeFormat(this.$i18n?.locale || 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    },
    
    // Get color for project status badges
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'green';
        case 'Proposed': return 'deep-orange';
        case 'Archived': return 'grey';
        default: return 'grey';
      }
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
  min-width: 220px;
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

/* Consent Icon */
.consent-icon {
  flex-shrink: 0;
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

/* Template Dialog */
.dialog-card {
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #c8102e, #ff5252);
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