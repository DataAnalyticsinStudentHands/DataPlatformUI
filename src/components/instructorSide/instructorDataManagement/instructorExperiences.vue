<!-- 
instructorExperiences.vue
Instructor-side view presenting a list of all Experiences with search, filtering,
and archive functionality. Redesigned UI matching the project pages aesthetic.
-->
<template>
  <div class="experiences-content">
    <!-- Toolbar Section -->
    <div class="toolbar-section">
      <v-row align="center" no-gutters>
        <!-- Search Field - Desktop/Tablet -->
        <v-col lg="5" md="4" sm="4" class="d-none d-sm-flex pr-3">
          <v-text-field
            v-model="experienceSearch"
            density="comfortable"
            :placeholder="searchPlaceholder"
            flat
            hide-details
            clearable
            variant="outlined"
            class="search-field"
            @keyup.enter="addSearchChip"
            @click:clear="experienceSearch = ''"
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
                :disabled="!experienceSearch"
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
            v-if="!selectedExperiences.length"
            @click="toggleArchivedExperiences"
            variant="tonal"
            :color="viewsStore.isViewingArchived('experiences') ? '#c8102e' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewsStore.isViewingArchived('experiences') ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
            <span class="d-none d-md-inline">{{ viewsStore.isViewingArchived('experiences') ? $t('View Active') : $t('View Archived') }}</span>
            <span class="d-inline d-md-none">{{ viewsStore.isViewingArchived('experiences') ? $t('Active') : $t('Archive') }}</span>
          </v-btn>

          <!-- Archive/Restore Selected Button -->
          <v-btn
            v-if="selectedExperiences.length"
            @click="handleArchiveExperiences"
            variant="tonal"
            :color="viewsStore.isViewingArchived('experiences') ? 'success' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewsStore.isViewingArchived('experiences') ? 'mdi-restore' : 'mdi-archive-plus' }}</v-icon>
            <span class="d-none d-md-inline">
              {{ viewsStore.isViewingArchived('experiences') ? $t('Restore') : $t('Archive') }} 
              {{ selectedExperiences.length === 1 ? $t('Experience') : $t('Experiences') }}
            </span>
            <span class="d-inline d-md-none">
              {{ viewsStore.isViewingArchived('experiences') ? $t('Restore') : $t('Archive') }}
            </span>
          </v-btn>

          <!-- Add New Experience Button -->
          <v-btn
            v-if="canAddNewExperience"
            @click="handleAddNewExperience"
            color="#c8102e"
            size="default"
            class="add-btn"
          >
            <v-icon start size="20">mdi-plus</v-icon>
            <span class="d-none d-lg-inline">{{ $t('Add New Experience') }}</span>
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
            v-if="!selectedExperiences.length"
            icon
            variant="text"
            size="default"
            @click="toggleArchivedExperiences"
            class="mobile-action-btn"
            :color="viewsStore.isViewingArchived('experiences') ? '#c8102e' : undefined"
          >
            <v-icon size="24">{{ viewsStore.isViewingArchived('experiences') ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            v-if="canAddNewExperience"
            @click="handleAddNewExperience"
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
            v-for="(criteria, index) in viewsStore.experiences.searchChips"
            :key="index"
            :color="viewsStore.experiences.selectedSearchChips.includes(index) ? '#c8102e' : 'grey-darken-4'"
            :variant="viewsStore.experiences.selectedSearchChips.includes(index) ? 'flat' : 'outlined'"
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
            v-if="viewsStore.experiences.searchChips.length > 1"
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
        <p class="text-body-2 text-medium-emphasis mt-4">{{ $t('Loading experiences...') }}</p>
      </div>

      <!-- Data Table -->
      <v-data-table
        v-else
        :headers="experienceHeaders"
        :items="filteredExperienceData"
        item-key="_id"
        item-value="_id"
        v-model="selectedExperiences"
        hover
        return-object
        multi-sort
        class="experiences-table"
        :mobile-breakpoint="600"
        :sort-by.sync="viewsStore.experiences.sortBy"
        @update:sort-by="handleSortByUpdate"
      >
        <template v-slot:body="{ items }">
          <template v-if="items.length > 0">
            <template v-for="item in items" :key="item._id">
              <tr @click="editExperience(item)" class="table-row">
                <td class="table-cell checkbox-cell" @click.stop>
                  <v-checkbox
                    v-if="showCheckboxColumn"
                    density="compact"
                    hide-details
                    :model-value="isSelected(item)"
                    @update:modelValue="toggleSelection(item)"
                  ></v-checkbox>
                </td>
                <td class="table-cell">
                  <span class="text-medium-emphasis">{{ item.experienceCategory }}</span>
                </td>
                <td class="table-cell">
                  <span class="font-weight-medium experience-name">{{ item.experienceName }}</span>
                </td>
                <td v-if="activitySearchApplied" class="table-cell expand-cell" @click.stop>
                  <v-btn 
                    icon 
                    variant="text"
                    size="small"
                    @click="toggleRowExpansion(item)"
                  >
                    <v-icon>{{ expandedExperiences.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </td>
              </tr>
              <!-- Expanded row for displaying activities and sessions -->
              <tr v-if="expandedExperiences.includes(item)" class="expanded-row">
                <td :colspan="experienceHeaders.length" class="pa-0">
                  <div class="expanded-content">
                    <div 
                      v-for="(activity, activityID) in prepareExpandedData[item._id]?.activities || {}" 
                      :key="activityID"
                      class="activity-item"
                    >
                      <div class="activity-header">
                        <v-icon color="#c8102e" size="18" class="mr-2">mdi-clipboard-text-outline</v-icon>
                        <strong>{{ activity.name }}</strong>
                      </div>
                      <div class="sessions-list">
                        <v-chip
                          v-for="session in activity.sessions"
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
              <td :colspan="experienceHeaders.length" class="empty-state-cell">
                <div class="empty-state py-12">
                  <v-icon size="56" color="#ccc" class="mb-3">
                    {{ viewsStore.isViewingArchived('experiences') ? 'mdi-archive-off-outline' : 'mdi-school-off-outline' }}
                  </v-icon>
                  <p class="text-h6 text-medium-emphasis mb-1">
                    {{ viewsStore.isViewingArchived('experiences') ? $t('No archived experiences') : $t('No active experiences') }}
                  </p>
                  <p class="text-body-2 text-disabled mb-0">
                    {{ viewsStore.isViewingArchived('experiences') 
                      ? $t('Archived experiences will appear here') 
                      : $t('Create a new experience to get started') 
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
          <span class="text-h6 font-weight-bold">{{ $t('Search Experiences') }}</span>
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

    <!-- Dialog for Filtering by Activity -->
    <v-dialog v-model="dialogActivitySearch" max-width="900px" persistent>
      <v-card class="activity-search-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-clipboard-text-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Search by Activity') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="cancelActivitySearch">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <!-- Search Field -->
          <v-text-field
            v-model="activitySearch"
            :label="$t('Search activities...')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="mb-4"
          ></v-text-field>

          <!-- Selected Activities Chips -->
          <div v-if="selectedActivities && selectedActivities.length" class="selected-activities mb-4">
            <span class="text-body-2 text-medium-emphasis mr-2">{{ $t('Selected:') }}</span>
            <v-chip
              v-for="(activity, index) in selectedActivities"
              :key="activity._id"
              color="#c8102e"
              variant="flat"
              size="default"
              class="activity-chip mr-2 mb-1"
              closable
              @click:close="removeActivity(index)"
            >
              {{ activity.activityName }}
            </v-chip>
          </div>

          <!-- Activities Table -->
          <v-data-table
            :headers="activityHeaders"
            :items="activityData"
            item-value="_id"
            items-per-page="-1"
            class="activities-table"
            hover
            :search="activitySearch"
            height="400"
          >
            <template v-slot:body="{ items }">
              <template v-for="item in items" :key="item._id">
                <tr
                  @click="selectActivity(item)"
                  class="table-row"
                >
                  <td class="table-cell">
                    <div class="d-flex align-center justify-space-between">
                      <span class="font-weight-medium">{{ item.activityName }}</span>
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
          <v-btn variant="text" size="large" @click="cancelActivitySearch" class="mr-2">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn 
            color="#c8102e"
            size="large"
            @click="submitActivitySearch"
            :disabled="!selectedActivities.length"
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
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { useInstructorViewsStore } from "@/stored/instructorViews";
import axios from "axios";

export default {
  name: "ExperiencesManagement",
  setup() {
    const viewsStore = useInstructorViewsStore();
    const userStore = useLoggedInUserStore();

    const showCheckboxColumn = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    const canAddNewExperience = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    return {
      viewsStore,
      userStore,
      showCheckboxColumn: showCheckboxColumn.value,
      canAddNewExperience: canAddNewExperience.value
    };
  },

  data() {
    return {
      experienceData: [],
      filteredExperienceData: [],
      selectedExperiences: [],
      searchLabel: "All Fields",
      searchMenuItems: [
        "All Fields",
        "Experience Category",
        "Experience Name",
        "Activity"
      ],
      experienceSearch: "",
      expandedExperiences: [],
      dialogActivitySearch: false,
      activitySearch: "",
      activityData: null,
      activitySearchDateRangeBtns: null,
      activityHeaders: [
        {
          title: "Activity Name",
          value: "activityName",
          key: "activityName",
          align: "start",
          sortable: true
        }
      ],
      hoveredItem: null,
      selectedActivities: [],
      activitySearchApplied: false,
      activityBasedExperiences: [],
      mobileSearchDialog: false,
      mobileSearchCategory: "All Fields",
      mobileSearchQuery: ""
    };
  },

  mounted() {
    useLoggedInUserStore().startLoading();
    this.fetchExperienceData()
      .then(() => {
        useLoggedInUserStore().stopLoading();
      })
      .catch((error) => {
        this.handleError(error);
        useLoggedInUserStore().stopLoading();
      });
  },

  watch: {
    'viewsStore.experiences.searchChips': {
      handler() {
        this.updateActivitySearchApplied();
      },
      deep: true,
      immediate: true
    },
    'viewsStore.experiences.selectedSearchChips': {
      handler() {
        this.updateActivitySearchApplied();
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    loading() {
      return useLoggedInUserStore().loading;
    },

    showChipsRow() {
      return this.viewsStore.experiences.searchChips.length > 0;
    },

    searchPlaceholder() {
      return this.$t('Search') + ' ' + this.$t(this.searchLabel) + '...';
    },

    experienceHeaders() {
      let headers = [
        {
          title: "",
          sortable: false,
          align: "center",
          width: "50px",
          key: "checkbox"
        },
        {
          title: this.$t("Experience Category"),
          value: "experienceCategory",
          align: "start",
          sortable: true,
          key: "experienceCategory"
        },
        {
          title: this.$t("Experience Name"),
          value: "experienceName",
          align: "start",
          sortable: true,
          key: "experienceName"
        }
      ];

      if (this.activitySearchApplied) {
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

      this.activityBasedExperiences.forEach(({ experienceID, sessionID, sessionName, activityID, activityName }) => {
        if (!expandedData[experienceID]) {
          expandedData[experienceID] = { activities: {} };
        }

        if (!expandedData[experienceID].activities[activityID]) {
          expandedData[experienceID].activities[activityID] = {
            name: activityName,
            sessions: []
          };
        }

        expandedData[experienceID].activities[activityID].sessions.push({
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
        case 'All Fields': return 'mdi-text-search';
        case 'Experience Category': return 'mdi-shape-outline';
        case 'Experience Name': return 'mdi-school-outline';
        case 'Activity': return 'mdi-clipboard-text-outline';
        default: return 'mdi-magnify';
      }
    },

    isSelected(item) {
      return this.selectedExperiences.some(e => e._id === item._id);
    },

    async fetchExperienceData() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experiences/";
        const response = await axios.get(apiURL, { headers: { token } });
        this.experienceData = response.data;
        this.filteredExperienceData = [...this.experienceData];
        this.performFilter();
      } catch (error) {
        this.handleError(error);
      }
    },

    editExperience(experience) {
      const store = useLoggedInUserStore();
      store.navigationData = {
        experienceID: experience._id,
      };
      this.$router.push({ name: "instructorSpecificExperience" });
    },

    toggleSelection(experience) {
      const index = this.selectedExperiences.findIndex((selectedExperience) => selectedExperience._id === experience._id);
      if (index >= 0) {
        this.selectedExperiences.splice(index, 1);
      } else {
        this.selectedExperiences.push(experience);
      }
    },

    async updateSearchCriteria(item) {
      if (item === "Activity") {
        await this.fetchActivityData();
        this.dialogActivitySearch = true;
      } else {
        this.searchLabel = item;
      }
    },

    addSearchChip() {
      if (this.experienceSearch) {
        this.viewsStore.addSearchChip('experiences', {
          category: this.searchLabel,
          term: this.experienceSearch
        });
        this.viewsStore.experiences.selectedSearchChips.push(this.viewsStore.experiences.searchChips.length - 1);
        this.experienceSearch = "";
        this.performFilter();
      }
    },

    selectSearchChip(index) {
      const selectedIndex = this.viewsStore.experiences.selectedSearchChips.indexOf(index);
      if (selectedIndex >= 0) {
        this.viewsStore.experiences.selectedSearchChips = this.viewsStore.experiences.selectedSearchChips.filter(i => i !== index);
      } else {
        this.viewsStore.experiences.selectedSearchChips = [...this.viewsStore.experiences.selectedSearchChips, index];
      }
      this.performFilter();
    },

    removeSearchChip(index) {
      this.viewsStore.removeSearchChip('experiences', index);
      this.viewsStore.experiences.selectedSearchChips = this.viewsStore.experiences.selectedSearchChips.filter(i => i !== index);
      this.viewsStore.experiences.selectedSearchChips = this.viewsStore.experiences.selectedSearchChips.map(i => i > index ? i - 1 : i);
      this.performFilter();
    },

    clearAllFilters() {
      this.viewsStore.experiences.searchChips = [];
      this.viewsStore.experiences.selectedSearchChips = [];
      this.performFilter();
    },

    performFilter() {
      let searchGroups = {};
      this.viewsStore.experiences.selectedSearchChips.forEach(index => {
        let criteria = this.viewsStore.experiences.searchChips[index];
        if (!searchGroups[criteria.category]) {
          searchGroups[criteria.category] = [];
        }
        searchGroups[criteria.category].push(criteria.term.toLowerCase());
      });

      this.updateActivitySearchApplied();

      if (this.activitySearchApplied) {
        if (this.activityBasedExperiences.length) {
          const activityTerms = this.viewsStore.experiences.selectedSearchChips
            .filter(index => this.viewsStore.experiences.searchChips[index]?.category === "Activity")
            .map(index => this.viewsStore.experiences.searchChips[index].term.trim().toLowerCase());

          const filteredActivityBasedExperiences = this.activityBasedExperiences.filter(ae =>
            activityTerms.includes(ae.activityName.trim().toLowerCase())
          );

          const activityExperienceIDs = filteredActivityBasedExperiences.map(ae => ae.experienceID);

          this.filteredExperienceData = this.experienceData.filter(experience =>
            activityExperienceIDs.includes(experience._id)
          );
        } else {
          this.filteredExperienceData = [];
        }
      } else {
        this.filteredExperienceData = this.experienceData.filter(item => {
          if (this.viewsStore.isViewingArchived('experiences') && item.experienceStatus === false) {
            return true;
          } else if (!this.viewsStore.isViewingArchived('experiences') && item.experienceStatus === true) {
            return true;
          } else {
            return false;
          }
        }).filter(item => {
          return Object.keys(searchGroups).every(category => {
            if (category === "All Fields") {
              return searchGroups[category].every(term =>
                item.experienceCategory.toLowerCase().includes(term) || item.experienceName.toLowerCase().includes(term)
              );
            } else if (category === "Experience Category") {
              return searchGroups[category].every(term =>
                item.experienceCategory.toLowerCase().includes(term)
              );
            } else if (category === "Experience Name") {
              return searchGroups[category].every(term =>
                item.experienceName.toLowerCase().includes(term)
              );
            }
            return true;
          });
        });
      }
    },

    toggleArchivedExperiences() {
      const newType = this.viewsStore.isViewingArchived('experiences') ? 'active' : 'archived';
      this.viewsStore.switchViewType('experiences', newType);
      this.performFilter();
    },

    async handleArchiveExperiences() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const updateStatus = { experienceStatus: this.viewsStore.isViewingArchived('experiences') };

        for (const experience of this.selectedExperiences) {
          const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experience._id}`;
          await axios.put(apiURL, updateStatus, { headers: { token } });
        }

        toast.success(
          (this.selectedExperiences.length === 1 ? this.$t("Experience") : this.$t("Experiences")) + " " +
          (this.viewsStore.isViewingArchived('experiences') ? this.$t("Restored!") : this.$t("Archived!")), {
            position: "top-right",
            toastClassName: "Toastify__toast--create",
            multiple: false
          }
        );
      } catch (error) {
        this.handleError(error);
      } finally {
        this.selectedExperiences = [];
        await this.fetchExperienceData();
      }
    },

    toggleRowExpansion(item) {
      const index = this.expandedExperiences.indexOf(item);
      if (index > -1) {
        this.expandedExperiences.splice(index, 1);
      } else {
        this.expandedExperiences.push(item);
      }
    },

    async fetchActivityData() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;

        const response = await axios.get(apiURL, { headers: { token } });
        this.activityData = response.data.sort((a, b) => {
          return a.activityName.localeCompare(b.activityName);
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    handleAddNewExperience() {
      this.$router.push({ name: "instructorAddExperience" });
    },

    cancelActivitySearch() {
      this.selectedActivities = [];
      this.activitySearch = "";
      this.dialogActivitySearch = false;
    },

    async submitActivitySearch() {
      const newSearchCriteria = this.selectedActivities.map(activity => ({
        category: "Activity",
        term: activity.activityName,
        activityID: activity._id
      }));

      const startIndexForNewChips = this.viewsStore.experiences.searchChips.length;

      this.viewsStore.experiences.searchChips = [
        ...this.viewsStore.experiences.searchChips,
        ...newSearchCriteria
      ];

      this.viewsStore.experiences.selectedSearchChips = [
        ...this.viewsStore.experiences.selectedSearchChips,
        ...newSearchCriteria.map((_, index) => startIndexForNewChips + index)
      ];

      await this.fetchExperiencesByActivity();

      this.selectedActivities = [];
      this.activitySearch = "";
      this.dialogActivitySearch = false;

      this.performFilter();
    },

    selectActivity(selectedActivity) {
      this.selectedActivities.push(selectedActivity);
      this.activityData = this.activityData.filter(activity => activity._id !== selectedActivity._id);
    },

    removeActivity(index) {
      const [removedActivity] = this.selectedActivities.splice(index, 1);
      this.activityData.push(removedActivity);
      this.activityData.sort((a, b) => a.activityName.localeCompare(b.activityName));
    },

    async fetchExperiencesByActivity() {
      const activityChipIndexes = this.viewsStore.experiences.selectedSearchChips.filter(index => {
        const criteria = this.viewsStore.experiences.searchChips[index];
        return criteria && criteria.category === "Activity" && criteria.activityID;
      });

      const activityIDs = activityChipIndexes
        .map(index => this.viewsStore.experiences.searchChips[index].activityID);

      if (!activityIDs.length) {
        this.activityBasedExperiences = [];
        return;
      }

      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/by-activity`;

        const response = await axios.post(
          apiURL,
          { activityIDs },
          { headers: { token } }
        );

        this.activityBasedExperiences = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        this.handleError(error);
      }
    },

    updateActivitySearchApplied() {
      const hasSelectedActivityChip = this.viewsStore.experiences.selectedSearchChips.some(chipIndex => {
        const criteria = this.viewsStore.experiences.searchChips[chipIndex];
        return criteria && criteria.category === "Activity";
      });

      this.activitySearchApplied = hasSelectedActivityChip;
    },

    handleSortByUpdate(newSortBy) {
      this.viewsStore.updateSorting('experiences', newSortBy);
    },

    applyMobileSearch() {
      if (!this.mobileSearchQuery?.trim()) return;

      if (this.mobileSearchCategory === "Activity") {
        this.fetchActivityData();
        this.dialogActivitySearch = true;
      } else {
        this.searchLabel = this.mobileSearchCategory;
        this.viewsStore.addSearchChip('experiences', {
          category: this.mobileSearchCategory,
          term: this.mobileSearchQuery.trim()
        });
        this.viewsStore.experiences.selectedSearchChips.push(this.viewsStore.experiences.searchChips.length - 1);
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
.experiences-content {
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

.experiences-table {
  border-radius: 0;
  font-size: 0.95rem;
}

.experiences-table :deep(.v-data-table-header) {
  font-size: 0.9rem;
}

.experiences-table :deep(th) {
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

.experience-name {
  font-size: 0.95rem;
}

/* Expanded Row */
.expanded-row {
  background-color: #fafafa;
}

.expanded-content {
  padding: 16px 24px 16px 80px;
}

.activity-item {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.activity-item:last-child {
  margin-bottom: 0;
}

.activity-header {
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
.activity-search-dialog {
  border-radius: 12px;
}

.selected-activities {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
}

.activity-chip :deep(.v-chip__content) {
  gap: 4px;
}

.activity-chip :deep(.v-chip__close) {
  margin: 0;
}

.activities-table {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.activities-table :deep(th) {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  padding: 10px 16px !important;
  background-color: #fafafa;
}

.activities-table .table-row {
  cursor: pointer;
}

.activities-table .table-cell {
  padding: 10px 16px !important;
}

.apply-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

/* Data table pagination styling */
.experiences-table :deep(.v-data-table-footer) {
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