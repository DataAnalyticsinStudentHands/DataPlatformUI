<!-- 
instructorActivities.vue
Instructor-side view presenting a list of all Activities with search, filtering,
and archive functionality. Redesigned UI matching the project pages aesthetic.
-->
<template>
  <div class="activities-content">
    <!-- Toolbar Section -->
    <div class="toolbar-section">
      <v-row align="center" no-gutters>
        <!-- Search Field - Desktop/Tablet -->
        <v-col lg="5" md="4" sm="4" class="d-none d-sm-flex pr-3">
          <v-text-field
            v-model="activitySearch"
            density="comfortable"
            :placeholder="searchPlaceholder"
            flat
            hide-details
            clearable
            variant="outlined"
            class="search-field"
            @keyup.enter="addSearchChip"
            @click:clear="activitySearch = ''"
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
                  >
                    <template v-slot:prepend>
                      <v-icon size="20">{{ getSearchIcon(item) }}</v-icon>
                    </template>
                    <v-list-item-title>{{ $t(item) }}</v-list-item-title>
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
                :disabled="!activitySearch"
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
            v-if="!selectedActivities.length"
            @click="toggleArchivedActivities"
            variant="tonal"
            :color="viewsStore.isViewingArchived('activities') ? '#c8102e' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewsStore.isViewingArchived('activities') ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
            <span class="d-none d-md-inline">{{ viewsStore.isViewingArchived('activities') ? $t('View Active') : $t('View Archived') }}</span>
            <span class="d-inline d-md-none">{{ viewsStore.isViewingArchived('activities') ? $t('Active') : $t('Archive') }}</span>
          </v-btn>

          <!-- Archive/Restore Selected Button -->
          <v-btn
            v-if="selectedActivities.length && userStore.role !== 'Group Instructor'"
            @click="handleArchiveActivities"
            variant="tonal"
            :color="viewsStore.isViewingArchived('activities') ? 'success' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewsStore.isViewingArchived('activities') ? 'mdi-restore' : 'mdi-archive-plus' }}</v-icon>
            <span class="d-none d-md-inline">
              {{ viewsStore.isViewingArchived('activities') ? $t('Restore') : $t('Archive') }} 
              {{ selectedActivities.length === 1 ? $t('Activity') : $t('Activities') }}
            </span>
            <span class="d-inline d-md-none">
              {{ viewsStore.isViewingArchived('activities') ? $t('Restore') : $t('Archive') }}
            </span>
          </v-btn>

          <!-- Add New Activity Button -->
          <v-btn
            @click="handleAddNewActivity"
            color="#c8102e"
            size="default"
            class="add-btn"
          >
            <v-icon start size="20">mdi-plus</v-icon>
            <span class="d-none d-lg-inline">{{ $t('Add New Activity') }}</span>
            <span class="d-inline d-lg-none">{{ $t('New') }}</span>
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
            v-if="!selectedActivities.length"
            icon
            variant="text"
            size="default"
            @click="toggleArchivedActivities"
            class="mobile-action-btn"
            :color="viewsStore.isViewingArchived('activities') ? '#c8102e' : undefined"
          >
            <v-icon size="24">{{ viewsStore.isViewingArchived('activities') ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            @click="handleAddNewActivity"
            color="#c8102e"
            size="small"
            class="add-btn-mobile"
          >
            <v-icon start size="18">mdi-plus</v-icon>
            {{ $t('New') }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Active Search Chips -->
      <div v-if="showChipsRow" class="search-chips-container mt-3">
        <div class="d-flex align-center flex-wrap">
          <span class="text-body-2 text-medium-emphasis mr-2">{{ $t('Filters:') }}</span>
          <v-chip
            v-for="(criteria, index) in viewsStore.activities.searchChips"
            :key="index"
            :color="viewsStore.activities.selectedSearchChips.includes(index) ? '#c8102e' : 'grey-darken-4'"
            :variant="viewsStore.activities.selectedSearchChips.includes(index) ? 'flat' : 'outlined'"
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
            v-if="viewsStore.activities.searchChips.length > 1"
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

    <v-divider></v-divider>

    <!-- Table Container -->
    <div class="table-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container py-16">
        <v-progress-circular 
          indeterminate 
          color="#c8102e" 
          size="48"
          width="4"
        ></v-progress-circular>
        <p class="text-body-2 text-medium-emphasis mt-4">{{ $t('Loading activities...') }}</p>
      </div>

      <!-- Data Table -->
      <v-data-table
        v-else
        :headers="activityHeaders"
        :items="filteredActivityData"
        item-key="_id"
        item-value="_id"
        v-model="selectedActivities"
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items-per-page-options="dataTableItemsPerPageOptions"
        hover
        return-object
        class="activities-table"
        :mobile-breakpoint="600"
        :sort-by.sync="viewsStore.activities.sortBy"
        @update:sort-by="handleSortByUpdate"
        @update:items-per-page="handleItemsPerPageUpdate"
        @update:page="handlePageUpdate"
      >
        <template v-slot:body="{ items }">
          <template v-if="items.length > 0">
            <template v-for="item in items" :key="item._id">
              <tr @click="editActivity(item)" class="table-row">
                <td class="table-cell checkbox-cell" @click.stop>
                  <v-checkbox
                    v-if="userStore.role !== 'Group Instructor'"
                    density="compact"
                    hide-details
                    :model-value="isSelected(item)"
                    @update:modelValue="toggleSelection(item)"
                  ></v-checkbox>
                </td>
                <td class="table-cell">
                  <span class="font-weight-medium activity-name">{{ item.activityName }}</span>
                </td>
                <td v-if="experienceNameSearchApplied" class="table-cell expand-cell" @click.stop>
                  <v-btn 
                    icon 
                    variant="text"
                    size="small"
                    @click="toggleRowExpansion(item)"
                  >
                    <v-icon>{{ expandedActivities.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </td>
              </tr>
              <!-- Expanded row for displaying experiences and sessions -->
              <tr v-if="expandedActivities.includes(item)" class="expanded-row">
                <td :colspan="activityHeaders.length" class="pa-0">
                  <div class="expanded-content">
                    <div 
                      v-for="(experience, experienceID) in prepareExpandedData[item._id]?.experiences || {}" 
                      :key="experienceID"
                      class="experience-item"
                    >
                      <div class="experience-header">
                        <v-icon color="#c8102e" size="18" class="mr-2">mdi-school-outline</v-icon>
                        <strong>{{ experience.name }}</strong>
                      </div>
                      <div class="sessions-list">
                        <v-chip
                          v-for="session in experience.sessions"
                          :key="session.sessionID"
                          size="small"
                          variant="tonal"
                          color="grey"
                          class="mr-2 mb-1"
                        >
                          <v-icon start size="14">mdi-calendar-outline</v-icon>
                          {{ session.sessionName }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td :colspan="activityHeaders.length" class="empty-state-cell">
                <div class="empty-state py-12">
                  <v-icon size="56" color="#ccc" class="mb-3">
                    {{ viewsStore.isViewingArchived('activities') ? 'mdi-archive-off-outline' : 'mdi-clipboard-text-off-outline' }}
                  </v-icon>
                  <p class="text-h6 text-medium-emphasis mb-1">
                    {{ viewsStore.isViewingArchived('activities') ? $t('No archived activities') : $t('No active activities') }}
                  </p>
                  <p class="text-body-2 text-disabled mb-0">
                    {{ viewsStore.isViewingArchived('activities') 
                      ? $t('Archived activities will appear here') 
                      : $t('Create a new activity to get started') 
                    }}
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </div>

    <!-- Mobile Search Dialog -->
    <v-dialog v-model="mobileSearchDialog" max-width="420px">
      <v-card class="mobile-search-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-magnify</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Search Activities') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="mobileSearchDialog = false">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-5">
          <v-select
            v-model="mobileSearchCategory"
            :items="searchMenuItems"
            :label="$t('Search by')"
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
            v-model="mobileSearchQuery"
            :label="$t('Search term')"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          ></v-text-field>
        </v-card-text>
        
        <v-card-actions class="pa-5 pt-0">
          <v-btn variant="text" size="default" @click="mobileSearchDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="#c8102e" 
            size="default" 
            @click="applyMobileSearch" 
            :disabled="!mobileSearchQuery"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply Filter') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Filtering by Experience Name -->
    <v-dialog v-model="dialogExperienceName" max-width="900px" persistent>
      <v-card class="experience-search-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-school-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Search by Experience') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="cancelExperienceNameSearch">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <!-- Search Field -->
          <v-text-field
            v-model="experienceNameSearch"
            :label="$t('Search experiences...')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="mb-4"
          ></v-text-field>

          <!-- Selected Experiences Chips -->
          <div v-if="selectedExperienceNames && selectedExperienceNames.length" class="selected-experiences mb-4">
            <span class="text-body-2 text-medium-emphasis mr-2">{{ $t('Selected:') }}</span>
            <v-chip
              v-for="(experience, index) in selectedExperienceNames"
              :key="experience._id"
              color="#c8102e"
              variant="flat"
              size="default"
              class="experience-chip mr-2 mb-1"
              closable
              @click:close="removeExperienceName(index)"
            >
              {{ experience.experienceName }}
            </v-chip>
          </div>

          <!-- Experiences Table -->
          <v-data-table
            :headers="experienceHeaders"
            :items="experienceData"
            item-value="_id"
            items-per-page="-1"
            class="experiences-table"
            hover
            :search="experienceNameSearch"
            height="400"
          >
            <template v-slot:body="{ items }">
              <template v-for="item in items" :key="item._id">
                <tr
                  @click="selectExperienceName(item)"
                  class="table-row"
                >
                  <td class="table-cell">
                    <span class="text-medium-emphasis">{{ item.experienceCategory }}</span>
                  </td>
                  <td class="table-cell">
                    <div class="d-flex align-center justify-space-between">
                      <span class="font-weight-medium">{{ item.experienceName }}</span>
                      <v-icon color="#c8102e" size="20">mdi-plus-circle-outline</v-icon>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
            <template v-slot:bottom></template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn variant="text" size="large" @click="cancelExperienceNameSearch" class="mr-2">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn 
            color="#c8102e"
            size="large"
            @click="submitExperienceNameSearch"
            :disabled="!selectedExperienceNames.length"
            class="apply-btn"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { useInstructorViewsStore } from "@/stored/instructorViews";
import axios from "axios";

export default {
  name: "InstructorActivities",
  setup() {
    const viewsStore = useInstructorViewsStore();
    const userStore = useLoggedInUserStore();

    return {
      viewsStore,
      userStore
    };
  },
  data() {
    return {
      activityData: [],
      filteredActivityData: [],
      selectedActivities: [],
      experienceData: [],
      activitySearch: "",
      searchLabel: "Activity Name",
      searchMenuItems: ["Experience Name"],
      dialogExperienceName: false,
      selectedExperienceNames: [],
      expandedActivities: [],
      experienceNameSearch: "",
      experienceHeaders: [
        {
          title: "Experience Category",
          value: "experienceCategory",
          key: "experienceCategory",
          align: "start",
          sortable: true
        },
        {
          title: "Experience Name",
          value: "experienceName",
          key: "experienceName",
          align: "start",
          sortable: true
        }
      ],
      experienceBasedActivities: [],
      experienceNameSearchApplied: false,
      mobileSearchDialog: false,
      mobileSearchCategory: "Activity Name",
      mobileSearchQuery: "",
      dataTableItemsPerPageOptions: [
        {value: 5, title: "5"},
        {value: 10, title: "10"},
        {value: 15, title: "15"},
        {value: 20, title: "20"},
        {value: -1, title: "$vuetify.dataFooter.itemsPerPageAll"},
      ],
      // Local pagination state initialized from store
      itemsPerPage: 10,
      currentPage: 1,
    };
  },

  mounted() {
    // Initialize pagination from store
    this.itemsPerPage = this.viewsStore.activities.itemsPerPage;
    this.currentPage = this.viewsStore.activities.currentPage;

    useLoggedInUserStore().startLoading();
    this.fetchActivityData()
      .then(() => {
        useLoggedInUserStore().stopLoading();
        // Restore selected activities after data is loaded
        this.restoreSelectedActivities();
      })
      .catch((error) => {
        this.handleError(error);
        useLoggedInUserStore().stopLoading();
      });
  },

  watch: {
    'viewsStore.activities.searchChips': {
      handler() {
        this.updateExperienceNameSearchApplied();
      },
      deep: true,
      immediate: true
    },
    'viewsStore.activities.selectedSearchChips': {
      handler() {
        this.updateExperienceNameSearchApplied();
      },
      deep: true,
      immediate: true
    },
    // Watch selectedActivities to persist changes
    selectedActivities: {
      handler(newVal) {
        const selectedIds = newVal.map(activity => activity._id);
        this.viewsStore.setSelectedActivityIds(selectedIds);
      },
      deep: true
    }
  },

  computed: {
    loading() {
      return useLoggedInUserStore().loading;
    },

    showChipsRow() {
      return this.viewsStore.activities.searchChips.length > 0;
    },

    searchPlaceholder() {
      return this.$t('Search') + ' ' + this.$t(this.searchLabel) + '...';
    },

    activityHeaders() {
      let headers = [
        {
          title: "",
          sortable: false,
          align: "center",
          width: "50px",
          key: "checkbox"
        },
        {
          title: this.$t("Activity Name"),
          value: "activityName",
          align: "start",
          sortable: true,
          key: "activityName"
        }
      ];

      if (this.experienceNameSearchApplied) {
        headers.push({
          title: "",
          key: "data-table-expand",
          width: "50px"
        });
      }

      return headers;
    },

    prepareExpandedData() {
      const expandedData = {};

      this.experienceBasedActivities.forEach(({ activityID, sessionID, sessionName, experienceID, experienceName }) => {
        if (!expandedData[activityID]) {
          expandedData[activityID] = { experiences: {} };
        }

        if (!expandedData[activityID].experiences[experienceID]) {
          expandedData[activityID].experiences[experienceID] = {
            name: experienceName,
            sessions: []
          };
        }

        expandedData[activityID].experiences[experienceID].sessions.push({
          sessionID,
          sessionName
        });
      });

      return expandedData;
    }
  },

  methods: {
    getSearchIcon(category) {
      switch (category) {
        case 'Activity Name': return 'mdi-clipboard-text-outline';
        case 'Experience Name': return 'mdi-school-outline';
        case 'Experience Category': return 'mdi-shape-outline';
        default: return 'mdi-magnify';
      }
    },

    isSelected(item) {
      return this.selectedActivities.some(a => a._id === item._id);
    },

    async fetchActivityData() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const userId = user.userId;
        let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/activities/";
        const response = await axios.get(apiURL, { 
          headers: { token },
          params: { userId }
        });
        this.activityData = response.data;
        this.filteredActivityData = [...this.activityData];
        this.performFilter();
      } catch (error) {
        this.handleError(error);
      }
    },

    editActivity(activity) {
      useLoggedInUserStore().navigationData = {
        activityID: activity._id
      };
      this.$router.push({ name: "instructorSpecificActivity" });
    },

    toggleSelection(activity) {
      const index = this.selectedActivities.findIndex((selectedActivity) => selectedActivity._id === activity._id);
      if (index >= 0) {
        this.selectedActivities.splice(index, 1);
      } else {
        this.selectedActivities.push(activity);
      }
    },

    async updateSearchCriteria(item) {
      if (item === "Experience Name") {
        this.fetchExperienceData();
        this.dialogExperienceName = true;
      } else {
        this.searchLabel = item;
      }
    },

    addSearchChip() {
      if (this.activitySearch) {
        this.viewsStore.addSearchChip('activities', {
          category: this.searchLabel,
          term: this.activitySearch
        });
        this.viewsStore.activities.selectedSearchChips.push(this.viewsStore.activities.searchChips.length - 1);
        this.activitySearch = "";
        this.performFilter();
      }
    },

    selectSearchChip(index) {
      const selectedIndex = this.viewsStore.activities.selectedSearchChips.indexOf(index);
      if (selectedIndex >= 0) {
        this.viewsStore.activities.selectedSearchChips = this.viewsStore.activities.selectedSearchChips.filter(i => i !== index);
      } else {
        this.viewsStore.activities.selectedSearchChips = [...this.viewsStore.activities.selectedSearchChips, index];
      }
      this.performFilter();
    },

    removeSearchChip(index) {
      this.viewsStore.removeSearchChip('activities', index);
      this.viewsStore.activities.selectedSearchChips = this.viewsStore.activities.selectedSearchChips.filter(i => i !== index);
      this.viewsStore.activities.selectedSearchChips = this.viewsStore.activities.selectedSearchChips.map(i => i > index ? i - 1 : i);
      this.performFilter();
    },

    clearAllFilters() {
      this.viewsStore.activities.searchChips = [];
      this.viewsStore.activities.selectedSearchChips = [];
      this.performFilter();
    },

    performFilter() {
      let searchGroups = {};
      this.viewsStore.activities.selectedSearchChips.forEach(index => {
        let criteria = this.viewsStore.activities.searchChips[index];
        if (!searchGroups[criteria.category]) {
          searchGroups[criteria.category] = [];
        }
        searchGroups[criteria.category].push(criteria.term.toLowerCase());
      });

      this.updateExperienceNameSearchApplied();

      if (this.experienceNameSearchApplied && this.experienceBasedActivities.length) {
        const experienceNameTerms = this.viewsStore.activities.selectedSearchChips
          .filter(index => this.viewsStore.activities.searchChips[index]?.category === "Experience Name")
          .map(index => this.viewsStore.activities.searchChips[index].term.trim().toLowerCase());
        
        const filteredExperienceBasedActivities = this.experienceBasedActivities.filter(ea =>
          experienceNameTerms.includes(ea.experienceName.trim().toLowerCase())
        );

        const experienceActivityIDs = filteredExperienceBasedActivities.map(ea => ea.activityID);

        this.filteredActivityData = this.activityData.filter(activity =>
          experienceActivityIDs.includes(activity._id)
        );
      } else {
        this.filteredActivityData = this.activityData.filter(activity => {
          if ((this.viewsStore.isViewingArchived('activities') && !activity.activityStatus) || 
              (!this.viewsStore.isViewingArchived('activities') && activity.activityStatus)) {
            return Object.keys(searchGroups).every(category => {
              if (category === "Activity Name") {
                return searchGroups[category].some(term =>
                  activity.activityName.toLowerCase().includes(term)
                );
              }
              return true;
            });
          }
          return false;
        });
      }
    },

    toggleArchivedActivities() {
      const newType = this.viewsStore.isViewingArchived('activities') ? 'active' : 'archived';
      this.viewsStore.switchViewType('activities', newType);
      this.performFilter();
    },

    async handleArchiveActivities() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const updateStatus = { activityStatus: this.viewsStore.isViewingArchived('activities') };

        for (const activity of this.selectedActivities) {
          const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${activity._id}`;
          await axios.put(apiURL, updateStatus, { headers: { token } });
        }

        toast.success(
          (this.selectedActivities.length === 1 ? this.$t("Activity") : this.$t("Activities")) + " " +
          (this.viewsStore.isViewingArchived('activities') ? this.$t("Restored!") : this.$t("Archived!")), {
            position: "top-right",
            toastClassName: "Toastify__toast--create",
            multiple: false
          }
        );
      } catch (error) {
        this.handleError(error);
      } finally {
        this.selectedActivities = [];
        await this.fetchActivityData();
      }
    },

    toggleRowExpansion(item) {
      const index = this.expandedActivities.indexOf(item);
      if (index > -1) {
        this.expandedActivities.splice(index, 1);
      } else {
        this.expandedActivities.push(item);
      }
    },

    handleAddNewActivity() {
      this.$router.push({ name: "instructorAddActivity" });
    },

    async fetchExperienceData() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;

        const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
        const response = await axios.get(apiURL, { headers: { token } });
        this.experienceData = response.data.sort((a, b) => {
          return a.experienceCategory.localeCompare(b.experienceCategory);
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    removeExperienceName(index) {
      const [removedExperience] = this.selectedExperienceNames.splice(index, 1);
      this.experienceData.push(removedExperience);
      this.experienceData.sort((a, b) => a.experienceCategory.localeCompare(b.experienceCategory));
    },

    selectExperienceName(selectedExperienceName) {
      this.selectedExperienceNames.push(selectedExperienceName);
      this.experienceData = this.experienceData.filter(experience => experience._id !== selectedExperienceName._id);
    },

    cancelExperienceNameSearch() {
      this.selectedExperienceNames = [];
      this.experienceNameSearch = "";
      this.dialogExperienceName = false;
    },

    async submitExperienceNameSearch() {
      const newSearchCriteria = this.selectedExperienceNames.map(experience => ({
        category: "Experience Name",
        term: experience.experienceName
      }));

      newSearchCriteria.forEach(criteria => {
        this.viewsStore.addSearchChip('activities', criteria);
      });

      const startIndexForNewChips = this.viewsStore.activities.searchChips.length - newSearchCriteria.length;
      const newSelectedSearchChips = newSearchCriteria.map((_, index) => startIndexForNewChips + index);
      this.viewsStore.setSelectedSearchChips('activities', [
        ...this.viewsStore.activities.selectedSearchChips,
        ...newSelectedSearchChips
      ]);

      await this.fetchActivitiesByExperience();

      this.selectedExperienceNames = [];
      this.experienceNameSearch = "";
      this.dialogExperienceName = false;

      this.performFilter();
    },

    async fetchActivitiesByExperience() {
      const experienceIDs = this.selectedExperienceNames.map(experience => experience._id);

      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/by-experience`;

        const response = await axios.post(apiURL, {
          experienceIDs: experienceIDs
        }, {
          headers: { token }
        });

        this.experienceBasedActivities = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    updateExperienceNameSearchApplied() {
      const hasSelectedExperienceNameChip = this.viewsStore.activities.selectedSearchChips.some(chipIndex => {
        const criteria = this.viewsStore.activities.searchChips[chipIndex];
        return criteria && criteria.category === "Experience Name";
      });

      this.experienceNameSearchApplied = hasSelectedExperienceNameChip;
    },

    handleSortByUpdate(newSortBy) {
      this.viewsStore.updateSorting('activities', newSortBy);
    },

    handleItemsPerPageUpdate(newItemsPerPage) {
      this.viewsStore.updateActivitiesPagination({ itemsPerPage: newItemsPerPage });
    },

    handlePageUpdate(newPage) {
      this.viewsStore.updateActivitiesPagination({ currentPage: newPage });
    },

    restoreSelectedActivities() {
      const selectedIds = this.viewsStore.activities.selectedActivityIds;
      if (selectedIds && selectedIds.length > 0) {
        this.selectedActivities = this.filteredActivityData.filter(activity => 
          selectedIds.includes(activity._id)
        );
      }
    },

    applyMobileSearch() {
      if (!this.mobileSearchQuery?.trim()) return;

      if (this.mobileSearchCategory === "Experience Name") {
        this.fetchExperienceData();
        this.dialogExperienceName = true;
      } else {
        this.viewsStore.addSearchChip('activities', {
          category: this.mobileSearchCategory,
          term: this.mobileSearchQuery.trim()
        });
        this.viewsStore.activities.selectedSearchChips.push(this.viewsStore.activities.searchChips.length - 1);
        this.performFilter();
      }

      this.mobileSearchQuery = "";
      this.mobileSearchDialog = false;
    }
  }
};
</script>

<style scoped>
/* Content Container */
.activities-content {
  background-color: white;
}

/* Toolbar Section */
.toolbar-section {
  padding: 20px 24px;
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

.add-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.add-btn-mobile {
  text-transform: none;
  font-weight: 500;
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

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

/* Table Container */
.table-container {
  min-height: 400px;
}

.activities-table {
  border-radius: 0;
  font-size: 0.95rem;
}

.activities-table :deep(.v-data-table-header) {
  font-size: 0.9rem;
}

.activities-table :deep(th) {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  padding: 10px 16px !important;
  background-color: #fafafa;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: rgba(200, 16, 46, 0.04) !important;
}

.table-cell {
  padding: 10px 16px !important;
  font-size: 0.95rem;
}

.checkbox-cell {
  width: 50px !important;
  padding: 10px 12px !important;
}

.expand-cell {
  width: 50px !important;
  padding: 10px 12px !important;
}

.activity-name {
  font-size: 0.95rem;
}

/* Expanded Row */
.expanded-row {
  background-color: #fafafa;
}

.expanded-content {
  padding: 16px 24px 16px 80px;
}

.experience-item {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.experience-item:last-child {
  margin-bottom: 0;
}

.experience-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.sessions-list {
  padding-left: 26px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
}

.empty-state-cell {
  padding: 0 !important;
}

/* Dialogs */
.mobile-search-dialog,
.experience-search-dialog {
  border-radius: 12px;
}

.selected-experiences {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
}

.experience-chip :deep(.v-chip__content) {
  gap: 4px;
}

.experience-chip :deep(.v-chip__close) {
  margin: 0;
}

.experiences-table {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.experiences-table :deep(th) {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  padding: 10px 16px !important;
  background-color: #fafafa;
}

.experiences-table .table-row {
  cursor: pointer;
}

.experiences-table .table-cell {
  padding: 10px 16px !important;
}

.apply-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

/* Data table pagination styling */
.activities-table :deep(.v-data-table-footer) {
  font-size: 0.9rem;
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
}

/* Responsive */
@media (max-width: 960px) {
  .toolbar-section {
    padding: 16px 18px;
  }
  
  .expanded-content {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .toolbar-section {
    padding: 14px 16px;
  }
  
  .table-cell {
    padding: 8px 12px !important;
  }
  
  .expanded-content {
    padding: 12px;
  }
}
</style>