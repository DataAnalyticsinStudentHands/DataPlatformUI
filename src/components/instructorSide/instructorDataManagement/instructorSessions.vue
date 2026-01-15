<!-- 
instructorSessions.vue
Instructor-side view presenting a list of all Sessions with search, filtering,
expandable experience instances, and archive functionality. 
Redesigned UI matching the project pages aesthetic.
-->
<template>
  <div class="sessions-content">
    <!-- Toolbar Section -->
    <div class="toolbar-section">
      <v-row align="center" no-gutters>
        <!-- Search Field - Desktop/Tablet -->
        <v-col lg="5" md="4" sm="4" class="d-none d-sm-flex pr-3">
          <v-text-field
            v-model="sessionSearch"
            density="comfortable"
            :placeholder="searchPlaceholder"
            flat
            hide-details
            clearable
            variant="outlined"
            class="search-field"
            @keyup.enter="addSearchChip"
            @click:clear="sessionSearch = ''"
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
                :disabled="!sessionSearch"
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
            v-if="!selectedSessions.length"
            @click="toggleArchivedSessions"
            variant="tonal"
            :color="viewsStore.isViewingArchived('sessions') ? '#c8102e' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewsStore.isViewingArchived('sessions') ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
            <span class="d-none d-md-inline">{{ viewsStore.isViewingArchived('sessions') ? $t('View Active') : $t('View Archived') }}</span>
            <span class="d-inline d-md-none">{{ viewsStore.isViewingArchived('sessions') ? $t('Active') : $t('Archive') }}</span>
          </v-btn>

          <!-- Archive/Restore Selected Button -->
          <v-btn
            v-if="selectedSessions.length"
            @click="handleArchiveSessions"
            variant="tonal"
            :color="viewsStore.isViewingArchived('sessions') ? 'success' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewsStore.isViewingArchived('sessions') ? 'mdi-restore' : 'mdi-archive-plus' }}</v-icon>
            <span class="d-none d-md-inline">
              {{ viewsStore.isViewingArchived('sessions') ? $t('Restore') : $t('Archive') }} 
              {{ selectedSessions.length === 1 ? $t('Session') : $t('Sessions') }}
            </span>
            <span class="d-inline d-md-none">
              {{ viewsStore.isViewingArchived('sessions') ? $t('Restore') : $t('Archive') }}
            </span>
          </v-btn>

          <!-- Add New Session Button -->
          <v-btn
            v-if="canAddNewSession"
            @click="handleAddNewSession"
            color="#c8102e"
            size="default"
            class="add-btn"
          >
            <v-icon start size="20">mdi-plus</v-icon>
            <span class="d-none d-lg-inline">{{ $t('Add New Session') }}</span>
            <span class="d-inline d-lg-none">{{ $t('New') }}</span>
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
            v-if="!selectedSessions.length"
            icon
            variant="text"
            size="default"
            @click="toggleArchivedSessions"
            class="mobile-action-btn"
            :color="viewsStore.isViewingArchived('sessions') ? '#c8102e' : undefined"
          >
            <v-icon size="24">{{ viewsStore.isViewingArchived('sessions') ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
          </v-btn>

          <v-btn
            v-if="selectedSessions.length"
            icon
            variant="text"
            size="default"
            @click="handleArchiveSessions"
            class="mobile-action-btn"
          >
            <v-icon size="24">{{ viewsStore.isViewingArchived('sessions') ? 'mdi-restore' : 'mdi-archive-plus' }}</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            v-if="canAddNewSession"
            @click="handleAddNewSession"
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
            v-for="(criteria, index) in viewsStore.sessions.searchChips"
            :key="index"
            :color="viewsStore.sessions.selectedSearchChips.includes(index) ? '#c8102e' : 'grey-darken-4'"
            :variant="viewsStore.sessions.selectedSearchChips.includes(index) ? 'flat' : 'outlined'"
            size="default"
            class="search-chip mr-2 mb-1"
            @click="selectSearchChip(index)"
            closable
            @click:close="removeSearchChip(index)"
          >
            <v-icon start size="16">{{ getSearchIcon(criteria.category) }}</v-icon>
            <template v-if="criteria.category === 'Session Name' || criteria.category === 'Experience Name' || criteria.category === 'Experience Category'">
              {{ criteria.category }}: {{ criteria.term }}
            </template>
            <template v-else>
              {{ criteria.category }} {{ criteria.term }}
            </template>
          </v-chip>
          <v-btn 
            v-if="viewsStore.sessions.searchChips.length > 1"
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
        <p class="text-body-2 text-medium-emphasis mt-4">{{ $t('Loading sessions...') }}</p>
      </div>

      <!-- Data Table -->
      <v-data-table
        v-else
        :headers="sessionHeaders"
        :items="filteredSessionData"
        item-key="_id"
        v-model="selectedSessions"
        return-object
        items-per-page="5"
        :items-per-page-options="dataTableItemsPerPageOptions"
        v-model:expanded="expandedSessions"
        show-expand
        multi-sort
        class="sessions-table"
        :mobile-breakpoint="600"
        :sort-by.sync="viewsStore.sessions.sortBy"
        @update:sort-by="handleSortByUpdate"
      >
        <template v-slot:body="{ items }">
          <template v-if="items.length > 0">
            <template v-for="(sessionItem, sessionIndex) in items" :key="sessionItem._id">
              <tr @click="editSession(sessionItem)" class="table-row">
                <td class="table-cell checkbox-cell" @click.stop>
                  <v-checkbox
                    v-if="showCheckboxColumn"
                    density="compact"
                    hide-details
                    :model-value="isSelected(sessionItem)"
                    @update:modelValue="toggleSelection(sessionItem)"
                  ></v-checkbox>
                </td>
                <td class="table-cell">
                  <span class="font-weight-medium session-name">{{ sessionItem.sessionName }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-medium-emphasis">{{ formatDate(sessionItem.sessionPeriod.startDate) }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-medium-emphasis">{{ formatDate(sessionItem.sessionPeriod.endDate) }}</span>
                </td>
                <td class="table-cell expand-cell" @click.stop>
                  <v-btn 
                    icon 
                    variant="text"
                    size="small"
                    @click="toggleRowExpansion(sessionItem)"
                  >
                    <v-icon>{{ expandedSessions.includes(sessionItem) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </td>
              </tr>
              <!-- Expanded row for displaying experience instances -->
              <tr v-if="expandedSessions.includes(sessionItem)" class="expanded-row">
                <td class="pa-0"></td>
                <td :colspan="sessionHeaders.length - 1" class="pa-0">
                  <div class="expanded-content">
                    <div class="instances-table-container">
                      <v-data-table
                        :headers="instanceHeaders"
                        :items="filteredInstances[sessionItem._id] || sessionItem.instances"
                        item-value="experience.id"
                        hover
                        return-object
                        multi-sort
                        items-per-page="-1"
                        class="instances-table"
                        density="comfortable"
                      >
                        <template v-slot:item="{ item }">
                          <tr class="instance-row" @click="editInstance(item)">
                            <td class="instance-cell">
                              <span class="text-medium-emphasis">{{ item.experience.category }}</span>
                            </td>
                            <td class="instance-cell">
                              <span class="font-weight-medium">{{ item.experience.name }}</span>
                            </td>
                            <td class="instance-cell">
                              <span class="text-medium-emphasis">{{ formatDate(item.exitFormReleaseDate) }}</span>
                            </td>
                            <td class="instance-cell">
                              <v-chip size="small" variant="tonal" color="grey">
                                {{ getActivityCount(item.activities) }}
                              </v-chip>
                            </td>
                          </tr>
                        </template>
                        <template v-slot:bottom>
                          <div class="instances-table-footer">
                            <v-btn
                              v-if="canAddExpInstance"
                              @click="handleAddExperience(sessionItem._id)"
                              variant="tonal"
                              color="#c8102e"
                              size="small"
                              class="add-experience-btn"
                            >
                              <v-icon start size="18">mdi-plus</v-icon>
                              {{ $t('Add Experience') }}
                            </v-btn>
                          </div>
                        </template>
                      </v-data-table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td :colspan="sessionHeaders.length" class="empty-state-cell">
                <div class="empty-state py-12">
                  <v-icon size="56" color="#ccc" class="mb-3">
                    {{ viewsStore.isViewingArchived('sessions') ? 'mdi-archive-off-outline' : 'mdi-calendar-blank-outline' }}
                  </v-icon>
                  <p class="text-h6 text-medium-emphasis mb-1">
                    {{ viewsStore.isViewingArchived('sessions') ? $t('No archived sessions') : $t('No active sessions') }}
                  </p>
                  <p class="text-body-2 text-disabled mb-0">
                    {{ viewsStore.isViewingArchived('sessions') 
                      ? $t('Archived sessions will appear here') 
                      : $t('Create a new session to get started') 
                    }}
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </div>

    <!-- Date Picker for Start Date -->
    <v-dialog v-model="dialogStartDate" max-width="400px" persistent>
      <v-card class="date-picker-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-calendar-start</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Filter by Start Date') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="cancelSelectStartDate">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <v-select
            v-model="startDateFilterType"
            :items="['On', 'Before', 'After', 'Between']"
            :label="$t('Filter Type')"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-4"
          >
            <template v-slot:prepend-inner>
              <v-icon size="20">mdi-filter-variant</v-icon>
            </template>
          </v-select>

          <v-date-picker
            v-model="selectedStartDate"
            elevation="0"
            :title="sessionStartDateTitle"
            show-adjacent-months
            color="#c8102e"
            class="date-picker-full-width"
            @update:modelValue="handleStartDateSelection"
          >
            <template v-slot:header>
              <div class="v-date-picker-header">
                <v-fade-transition>
                  <div :key="formattedSelectedStartDate" class="v-date-picker-header__content">
                    {{ formattedSelectedStartDate }}
                  </div>
                </v-fade-transition>
              </div>
            </template>
          </v-date-picker>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn variant="text" size="large" @click="cancelSelectStartDate" class="mr-2">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn 
            color="#c8102e"
            size="large"
            :disabled="!canApplyStartDates"
            @click="submitStartDate"
            class="apply-btn"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Date Picker for End Date -->
    <v-dialog v-model="dialogEndDate" max-width="400px" persistent>
      <v-card class="date-picker-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-calendar-end</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Filter by End Date') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="cancelSelectEndDate">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <v-select
            v-model="endDateFilterType"
            :items="['On', 'Before', 'After', 'Between']"
            :label="$t('Filter Type')"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-4"
          >
            <template v-slot:prepend-inner>
              <v-icon size="20">mdi-filter-variant</v-icon>
            </template>
          </v-select>

          <v-date-picker
            v-model="selectedEndDate"
            elevation="0"
            :title="sessionEndDateTitle"
            show-adjacent-months
            color="#c8102e"
            class="date-picker-full-width"
            @update:modelValue="handleEndDateSelection"
          >
            <template v-slot:header>
              <div class="v-date-picker-header">
                <v-fade-transition>
                  <div :key="formattedSelectedEndDate" class="v-date-picker-header__content">
                    {{ formattedSelectedEndDate }}
                  </div>
                </v-fade-transition>
              </div>
            </template>
          </v-date-picker>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn variant="text" size="large" @click="cancelSelectEndDate" class="mr-2">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn 
            color="#c8102e"
            size="large"
            :disabled="!canApplyEndDates"
            @click="submitEndDate"
            class="apply-btn"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Date Picker for Exit Form Release Date -->
    <v-dialog v-model="dialogExitFormReleaseDate" max-width="400px" persistent>
      <v-card class="date-picker-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-calendar-check</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Filter by Release Date') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="cancelSelectExitFormReleaseDate">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <v-select
            v-model="exitFormReleaseDateFilterType"
            :items="['On', 'Before', 'After', 'Between']"
            :label="$t('Filter Type')"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-4"
          >
            <template v-slot:prepend-inner>
              <v-icon size="20">mdi-filter-variant</v-icon>
            </template>
          </v-select>

          <v-date-picker
            v-model="selectedExitFormReleaseDate"
            elevation="0"
            :title="instanceExitFormReleaseDateTitle"
            show-adjacent-months
            color="#c8102e"
            class="date-picker-full-width"
            @update:modelValue="handleExitFormReleaseDateSelection"
          >
            <template v-slot:header>
              <div class="v-date-picker-header">
                <v-fade-transition>
                  <div :key="formattedSelectedExitFormReleaseDate" class="v-date-picker-header__content">
                    {{ formattedSelectedExitFormReleaseDate }}
                  </div>
                </v-fade-transition>
              </div>
            </template>
          </v-date-picker>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn variant="text" size="large" @click="cancelSelectExitFormReleaseDate" class="mr-2">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn 
            color="#c8102e"
            size="large"
            :disabled="!canApplyExitFormReleaseDates"
            @click="submitExitFormReleaseDate"
            class="apply-btn"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Mobile Search Dialog -->
    <v-dialog v-model="xsdialogSearch" max-width="420px" persistent>
      <v-card class="mobile-search-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-magnify</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Search Sessions') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="xsCancelSearchDialog">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-5">
          <v-select
            v-model="xsSearchFilterSelection"
            :items="['Session Name', 'Start Date', 'End Date']"
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

          <!-- Session Name Search -->
          <div v-if="xsSearchFilterSelection === 'Session Name'">
            <v-text-field
              v-model="sessionSearch"
              :label="$t('Search term')"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-text-field>
          </div>

          <!-- Start Date Filter -->
          <div v-if="xsSearchFilterSelection === 'Start Date'">
            <v-select
              v-model="startDateFilterType"
              :items="['On', 'Before', 'After', 'Between']"
              :label="$t('Date filter type')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            ></v-select>
            <v-text-field
              v-if="startDateFilterType !== 'Between'"
              type="date"
              v-model="selectedStartDate"
              :label="$t('Select date')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-text-field>
            <v-text-field
              v-if="startDateFilterType === 'Between'"
              type="date"
              v-model="beginningDateRange"
              :label="$t('From date')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-if="startDateFilterType === 'Between'"
              type="date"
              v-model="endDateRange"
              :label="$t('To date')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-text-field>
          </div>

          <!-- End Date Filter -->
          <div v-if="xsSearchFilterSelection === 'End Date'">
            <v-select
              v-model="endDateFilterType"
              :items="['On', 'Before', 'After', 'Between']"
              :label="$t('Date filter type')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            ></v-select>
            <v-text-field
              v-if="endDateFilterType !== 'Between'"
              type="date"
              v-model="selectedEndDate"
              :label="$t('Select date')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-text-field>
            <v-text-field
              v-if="endDateFilterType === 'Between'"
              type="date"
              v-model="beginningDateRange"
              :label="$t('From date')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-if="endDateFilterType === 'Between'"
              type="date"
              v-model="endDateRange"
              :label="$t('To date')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-text-field>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-5 pt-0">
          <v-btn variant="text" size="default" @click="xsCancelSearchDialog">{{ $t('Cancel') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="#c8102e" 
            size="default" 
            @click="xsApplySearchFilters"
            :disabled="xsSearchFilterSelection === 'Start Date' ? !canApplyStartDates : (xsSearchFilterSelection === 'End Date' ? !canApplyEndDates : !sessionSearch)"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply Filter') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { useInstructorViewsStore } from "@/stored/instructorViews";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  name: "instructorSessions",
  setup() {
    const viewsStore = useInstructorViewsStore();
    const userStore = useLoggedInUserStore();

    const showCheckboxColumn = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    const canAddNewSession = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    const canAddExpInstance = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Group Instructor', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    return {
      viewsStore,
      userStore,
      showCheckboxColumn: showCheckboxColumn.value,
      canAddNewSession: canAddNewSession.value,
      canAddExpInstance: canAddExpInstance.value
    };
  },

  data() {
    return {
      sessionSearch: "",
      searchLabel: "Session Name",
      searchMenuItems: [
        "Session Name",
        "Session Start Date",
        "Session End Date",
        "Experience Category",
        "Experience Name",
        "Exit Form Release Date"
      ],
      sessionHeaders: [
        {
          title: "",
          sortable: false,
          align: "center",
          width: "50px",
          key: "checkbox"
        },
        {
          title: "Session Name",
          value: "sessionName",
          align: "start",
          sortable: true,
          key: "sessionName"
        },
        {
          title: "Start Date",
          value: "sessionPeriod.startDate",
          align: "start",
          sortable: true,
          key: "sessionPeriod.startDate"
        },
        {
          title: "End Date",
          value: "sessionPeriod.endDate",
          align: "start",
          sortable: true,
          key: "sessionPeriod.endDate"
        },
        {
          title: "",
          key: "data-table-expand",
          width: "50px"
        },
      ],
      selectedSessions: [],
      dataTableItemsPerPageOptions: [
        {value: 5, title: "5"},
        {value: 10, title: "10"},
        {value: 15, title: "15"},
        {value: 20, title: "20"},
        {value: -1, title: "$vuetify.dataFooter.itemsPerPageAll"},
      ],
      filteredSessionData: [],
      dialogStartDate: false,
      selectedStartDate: new Date(),
      startDateFilterType: "On",
      beginningDateRange: null,
      endDateRange: null,
      dialogEndDate: false,
      selectedEndDate: new Date(),
      endDateFilterType: "On",
      xsdialogSearch: false,
      xsSearchFilterSelection: null,
      sessionData: [],
      searchTerm: "",
      hoverId: null,
      instancesData: [],
      expandedSessions: [],
      instanceHeaders: [
        {
          title: "Experience Category",
          value: "experience.category",
          align: "start",
          sortable: true,
          key: "experience.category"
        },
        {
          title: "Experience Name",
          value: "experience.name",
          align: "start",
          sortable: true,
          key: 'experience.name',
        },
        {
          title: "Exit Form Release Date",
          value: "exitFormReleaseDate",
          align: "start",
          sortable: true,
          key: "exitFormReleaseDate"
        },
        {
          title: 'Activities',
          value: 'activityCount',
          align: 'start',
          sortable: true,
        },
      ],
      filteredInstances: {},
      dialogExitFormReleaseDate: false,
      exitFormReleaseDateFilterType: "On",
      selectedExitFormReleaseDate: new Date(),
    };
  },

  async mounted() {
    useLoggedInUserStore().startLoading();
    await this.fetchInstances();
    
    await this.fetchSessionData()
      .then(() => {
        useLoggedInUserStore().stopLoading();
        this.performFilter();
      })
      .catch((error) => {
        this.handleError(error);
        useLoggedInUserStore().stopLoading();
      });
  },

  watch: {
    startDateFilterType(newVal) {
      if (newVal === "Between") {
        this.beginningDateRange = null;
        this.endDateRange = null;
      }
    },
  },

  computed: {
    showChipsRow() {
      return this.viewsStore.sessions.searchChips.length > 0;
    },

    loading() {
      return useLoggedInUserStore().loading;
    },

    searchPlaceholder() {
      return this.$t('Search') + ' ' + this.$t(this.searchLabel) + '...';
    },

    sessionStartDateTitle() {
      switch (this.startDateFilterType) {
        case "On": return "Start Date On";
        case "After": return "Start Date After";
        case "Before": return "Start Date Before";
        case "Between": return "Start Date Between";
        default: return "Start Date On";
      }
    },

    sessionEndDateTitle() {
      switch (this.endDateFilterType) {
        case "On": return "End Date On";
        case "After": return "End Date After";
        case "Before": return "End Date Before";
        case "Between": return "End Date Between";
        default: return "End Date On";
      }
    },

    formattedSelectedStartDate() {
      if (this.startDateFilterType === "Between") {
        let text = "";
        if (this.beginningDateRange) {
          text += DateTime.fromJSDate(this.beginningDateRange).toFormat('MM-dd-yyyy');
        }
        if (this.beginningDateRange && this.endDateRange) {
          text += " to ";
          text += DateTime.fromJSDate(this.endDateRange).toFormat('MM-dd-yyyy');
        }
        return text;
      }
      return this.selectedStartDate
        ? DateTime.fromJSDate(this.selectedStartDate).toFormat('MM-dd-yyyy')
        : "";
    },

    formattedSelectedEndDate() {
      if (this.endDateFilterType === "Between") {
        let text = "";
        if (this.beginningDateRange) {
          text += DateTime.fromJSDate(this.beginningDateRange).toFormat('MM-dd-yyyy');
        }
        if (this.beginningDateRange && this.endDateRange) {
          text += " to ";
          text += DateTime.fromJSDate(this.endDateRange).toFormat('MM-dd-yyyy');
        }
        return text;
      }
      return this.selectedEndDate
        ? DateTime.fromJSDate(this.selectedEndDate).toFormat('MM-dd-yyyy')
        : "";
    },

    canApplyStartDates() {
      if (this.startDateFilterType === "Between") {
        return this.beginningDateRange && this.endDateRange;
      }
      return true;
    },

    canApplyEndDates() {
      if (this.endDateFilterType === "Between") {
        return this.beginningDateRange && this.endDateRange;
      }
      return true;
    },

    instanceExitFormReleaseDateTitle() {
      switch (this.exitFormReleaseDateFilterType) {
        case "On": return "Release Date On";
        case "After": return "Release Date After";
        case "Before": return "Release Date Before";
        case "Between": return "Release Date Between";
        default: return "Release Date On";
      }
    },

    formattedSelectedExitFormReleaseDate() {
      if (this.exitFormReleaseDateFilterType === "Between") {
        let text = "";
        if (this.beginningDateRange) {
          text += DateTime.fromJSDate(this.beginningDateRange).toFormat('MM-dd-yyyy');
        }
        if (this.beginningDateRange && this.endDateRange) {
          text += " to ";
          text += DateTime.fromJSDate(this.endDateRange).toFormat('MM-dd-yyyy');
        }
        return text;
      }
      return this.selectedExitFormReleaseDate
        ? DateTime.fromJSDate(this.selectedExitFormReleaseDate).toFormat('MM-dd-yyyy')
        : "";
    },

    canApplyExitFormReleaseDates() {
      if (this.exitFormReleaseDateFilterType === "Between") {
        return this.beginningDateRange && this.endDateRange;
      }
      return true;
    },
  },

  methods: {
    getSearchIcon(category) {
      switch (category) {
        case 'Session Name': return 'mdi-calendar-text';
        case 'Session Start Date': return 'mdi-calendar-start';
        case 'Session End Date': return 'mdi-calendar-end';
        case 'Experience Category': return 'mdi-shape-outline';
        case 'Experience Name': return 'mdi-school-outline';
        case 'Exit Form Release Date': return 'mdi-calendar-check';
        default: return 'mdi-magnify';
      }
    },

    isSelected(item) {
      return this.selectedSessions.some((selectedItem) => selectedItem._id === item._id);
    },

    async fetchSessionData() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/`;
        const resp = await axios.get(apiURL, { headers: { token } });
        this.sessionData = resp.data;
        this.sessionData.forEach(session => {
          session.instances = this.instancesData.filter(instance => instance.session.id === session._id);
        });
        this.filteredSessionData = [...this.sessionData];
      } catch (error) {
        this.handleError(error);
        throw error;
      }
    },

    async fetchInstances() {
      useLoggedInUserStore().startLoading();
      const user = useLoggedInUserStore();
      const token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experience-instances";
      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.instancesData = response.data;
      } catch (error) {
        this.handleError(error);
      } finally {
        useLoggedInUserStore().stopLoading();
      }
    },

    editSession(session) {
      useLoggedInUserStore().navigationData = {
        id: session._id
      };
      this.$router.push({ name: "instructorSpecificSession" });
    },

    formatDate(datetimeDB) {
      const formattedDate = DateTime.fromISO(datetimeDB, { zone: 'utc' }).toFormat('MM-dd-yyyy');
      return formattedDate;
    },

    toggleSelection(item) {
      const index = this.selectedSessions.findIndex((selectedItem) => selectedItem._id === item._id);
      if (index >= 0) {
        this.selectedSessions.splice(index, 1);
      } else {
        this.selectedSessions.push(item);
      }
    },

    updateSearchCriteria(item) {
      if (item === "Session Start Date") {
        this.dialogStartDate = true;
      } else if (item === "Session End Date") {
        this.dialogEndDate = true;
      } else if (item === "Exit Form Release Date") {
        this.dialogExitFormReleaseDate = true;
      } else {
        this.searchLabel = item;
      }
    },

    addSearchChip() {
      if (this.sessionSearch) {
        this.viewsStore.addSearchChip('sessions', {
          category: this.searchLabel,
          term: this.sessionSearch
        });
        this.viewsStore.sessions.selectedSearchChips.push(this.viewsStore.sessions.searchChips.length - 1);
        this.sessionSearch = "";
        this.performFilter();
      }
    },

    selectSearchChip(index) {
      const selectedIndex = this.viewsStore.sessions.selectedSearchChips.indexOf(index);
      if (selectedIndex >= 0) {
        this.viewsStore.sessions.selectedSearchChips = this.viewsStore.sessions.selectedSearchChips.filter(i => i !== index);
      } else {
        this.viewsStore.sessions.selectedSearchChips = [...this.viewsStore.sessions.selectedSearchChips, index];
      }
      this.performFilter();
    },

    removeSearchChip(index) {
      this.viewsStore.removeSearchChip('sessions', index);
      this.viewsStore.sessions.selectedSearchChips = this.viewsStore.sessions.selectedSearchChips.filter(i => i !== index);
      this.viewsStore.sessions.selectedSearchChips = this.viewsStore.sessions.selectedSearchChips.map(i => i > index ? i - 1 : i);
      this.performFilter();
    },

    clearAllFilters() {
      this.viewsStore.sessions.searchChips = [];
      this.viewsStore.sessions.selectedSearchChips = [];
      this.performFilter();
    },

    performFilter() {
      let searchGroups = {};
      this.viewsStore.sessions.selectedSearchChips.forEach(index => {
        let criteria = this.viewsStore.sessions.searchChips[index];
        if (!searchGroups[criteria.category]) {
          searchGroups[criteria.category] = [];
        }
        searchGroups[criteria.category].push(criteria.term);
      });

      this.filteredInstances = {};

      this.filteredSessionData = this.sessionData.filter(item => {
        let sessionItem = JSON.parse(JSON.stringify(item));
        if (this.viewsStore.isViewingArchived('sessions') && item.sessionStatus === false) {
        } else if (!this.viewsStore.isViewingArchived('sessions') && item.sessionStatus === true) {
        } else {
          return false;
        }
        let matchesFilter = Object.keys(searchGroups).every(category => {
          if (category === "Session Name") {
            return searchGroups[category].every(term =>
              sessionItem.sessionName.toLowerCase().includes(term.toLowerCase())
            );
          } else if (category === "Session Start Date") {
            return searchGroups[category].every(term => {
              let sessionDate = new Date(sessionItem.sessionPeriod.startDate);
              if (term.startsWith('<')) {
                const comparisonDate = new Date(term.slice(2).trim());
                return sessionDate < comparisonDate;
              } else if (term.startsWith('>')) {
                const comparisonDate = new Date(term.slice(2).trim());
                return sessionDate > comparisonDate;
              } else if (term.startsWith('=')) {
                let sessionDateFormatted = this.formatDateMethod(new Date(sessionItem.sessionPeriod.startDate));
                const comparisonDate = this.formatDateMethod(new Date(term.slice(2).trim()));
                return sessionDateFormatted === comparisonDate;
              } else if (term.startsWith('between')) {
                let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                let startDate = DateTime.fromFormat(startDateStr, 'MM-dd-yyyy');
                let endDate = DateTime.fromFormat(endDateStr, 'MM-dd-yyyy');
                return sessionDate >= startDate && sessionDate <= endDate;
              }
              return true;
            });
          } else if (category === "Session End Date") {
            return searchGroups[category].every(term => {
              let sessionDate = new Date(sessionItem.sessionPeriod.endDate);
              if (term.startsWith('<')) {
                const comparisonDate = new Date(term.slice(2).trim());
                return sessionDate < comparisonDate;
              } else if (term.startsWith('>')) {
                const comparisonDate = new Date(term.slice(2).trim());
                return sessionDate > comparisonDate;
              } else if (term.startsWith('=')) {
                let sessionDateFormatted = this.formatDateMethod(new Date(sessionItem.sessionPeriod.endDate));
                const comparisonDate = this.formatDateMethod(new Date(term.slice(2).trim()));
                return sessionDateFormatted === comparisonDate;
              } else if (term.startsWith('between')) {
                let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                let startDate = DateTime.fromFormat(startDateStr, 'MM-dd-yyyy');
                let endDate = DateTime.fromFormat(endDateStr, 'MM-dd-yyyy');
                return sessionDate >= startDate && sessionDate <= endDate;
              }
              return true;
            });
          } else if (category === "Experience Name") {
            let experiencesMatch = searchGroups[category].every(term => {
              return sessionItem.instances.some(instance => {
                return instance.experience.name.toLowerCase().includes(term.toLowerCase());
              });
            });
            if (experiencesMatch) {
              let filteredInstancesForSession = sessionItem.instances.filter(instance => {
                return searchGroups[category].some(term => {
                  return instance.experience.name.toLowerCase().includes(term.toLowerCase());
                });
              });
              this.filteredInstances[sessionItem._id] = filteredInstancesForSession;
            }
            return experiencesMatch;
          } else if (category === "Experience Category") {
            let experiencesMatch = searchGroups[category].every(term => {
              return sessionItem.instances.some(instance => {
                return instance.experience.category.toLowerCase().includes(term.toLowerCase());
              });
            });
            if (experiencesMatch) {
              let filteredInstancesForSession = sessionItem.instances.filter(instance => {
                return searchGroups[category].some(term => {
                  return instance.experience.category.toLowerCase().includes(term.toLowerCase());
                });
              });
              this.filteredInstances[sessionItem._id] = filteredInstancesForSession;
            }
            return experiencesMatch;
          } else if (category === "Exit Form Release Date") {
            let experiencesMatch = searchGroups[category].every(term => {
              return sessionItem.instances.some(instance => {
                let exitDate = new Date(instance.exitFormReleaseDate);
                if (term.startsWith('<')) {
                  const comparisonDate = new Date(term.slice(2).trim());
                  return exitDate < comparisonDate;
                } else if (term.startsWith('>')) {
                  const comparisonDate = new Date(term.slice(2).trim());
                  return exitDate > comparisonDate;
                } else if (term.startsWith('=')) {
                  let exitDateFormatted = this.formatDateMethod(new Date(instance.exitFormReleaseDate));
                  const comparisonDate = this.formatDateMethod(new Date(term.slice(2).trim()));
                  return exitDateFormatted === comparisonDate;
                } else if (term.startsWith('between')) {
                  let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                  let startDate = DateTime.fromFormat(startDateStr, 'MM-dd-yyyy');
                  let endDate = DateTime.fromFormat(endDateStr, 'MM-dd-yyyy');
                  return exitDate >= startDate && exitDate <= endDate;
                }
                return true;
              });
            });
            if (experiencesMatch) {
              let filteredInstancesForSession = sessionItem.instances.filter(instance => {
                return searchGroups[category].some(term => {
                  let exitDate = new Date(instance.exitFormReleaseDate);
                  if (term.startsWith('<')) {
                    const comparisonDate = new Date(term.slice(2).trim());
                    return exitDate < comparisonDate;
                  } else if (term.startsWith('>')) {
                    const comparisonDate = new Date(term.slice(2).trim());
                    return exitDate > comparisonDate;
                  } else if (term.startsWith('=')) {
                    const comparisonDateStr = term.slice(2).trim();
                    const instanceExitDate = DateTime.fromISO(instance.exitFormReleaseDate, { zone: 'utc' });
                    const instanceExitDateFormatted = instanceExitDate.toFormat('MM-dd-yyyy');
                    const comparisonDateObj = DateTime.fromFormat(comparisonDateStr, 'MM-dd-yyyy', { zone: 'utc' });
                    const comparisonDateFormatted = comparisonDateObj.toFormat('MM-dd-yyyy');
                    return instanceExitDateFormatted === comparisonDateFormatted;
                  } else if (term.startsWith('between')) {
                    let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                    let startDate = DateTime.fromFormat(startDateStr, 'MM-dd-yyyy');
                    let endDate = DateTime.fromFormat(endDateStr, 'MM-dd-yyyy');
                    return exitDate >= startDate && exitDate <= endDate;
                  }
                  return true;
                });
              });
              this.filteredInstances[sessionItem._id] = filteredInstancesForSession;
            }
            return experiencesMatch;
          }
          return true;
        });
        return matchesFilter ? sessionItem : null;
      }).filter(item => item !== null);
    },

    handleStartDateSelection(date) {
      if (this.startDateFilterType === 'Between') {
        if (!this.beginningDateRange || this.endDateRange) {
          this.beginningDateRange = date;
          this.endDateRange = null;
        } else {
          this.endDateRange = date;
        }
      } else {
        this.selectedStartDate = date;
      }
    },

    handleEndDateSelection(date) {
      if (this.endDateFilterType === 'Between') {
        if (!this.beginningDateRange || this.endDateRange) {
          this.beginningDateRange = date;
          this.endDateRange = null;
        } else {
          this.endDateRange = date;
        }
      } else {
        this.selectedEndDate = date;
      }
    },

    handleExitFormReleaseDateSelection(date) {
      if (this.exitFormReleaseDateFilterType === 'Between') {
        if (!this.beginningDateRange || this.endDateRange) {
          this.beginningDateRange = date;
          this.endDateRange = null;
        } else {
          this.endDateRange = date;
        }
      } else {
        this.selectedExitFormReleaseDate = date;
      }
    },

    submitStartDate() {
      if (this.startDateFilterType === 'On' && this.selectedStartDate) {
        this.createStartDateChip('=', this.selectedStartDate);
      } else if (this.startDateFilterType === 'Before' && this.selectedStartDate) {
        this.createStartDateChip('<', this.selectedStartDate);
      } else if (this.startDateFilterType === 'After' && this.selectedStartDate) {
        this.createStartDateChip('>', this.selectedStartDate);
      } else if (this.startDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
        const formattedBeginningDate = this.formatDateMethod(this.beginningDateRange);
        const formattedEndDate = this.formatDateMethod(this.endDateRange);
        this.createStartDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
      }
      this.dialogStartDate = false;
      this.selectedStartDate = new Date();
      this.startDateFilterType = "On";
    },

    submitEndDate() {
      if (this.endDateFilterType === 'On' && this.selectedEndDate) {
        this.createEndDateChip('=', this.selectedEndDate);
      } else if (this.endDateFilterType === 'Before' && this.selectedEndDate) {
        this.createEndDateChip('<', this.selectedEndDate);
      } else if (this.endDateFilterType === 'After' && this.selectedEndDate) {
        this.createEndDateChip('>', this.selectedEndDate);
      } else if (this.endDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
        const formattedBeginningDate = this.formatDateMethod(this.beginningDateRange);
        const formattedEndDate = this.formatDateMethod(this.endDateRange);
        this.createEndDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
      }
      this.dialogEndDate = false;
      this.selectedEndDate = new Date();
      this.endDateFilterType = "On";
    },

    submitExitFormReleaseDate() {
      if (this.exitFormReleaseDateFilterType === 'On' && this.selectedExitFormReleaseDate) {
        this.createExitFormReleaseDateChip('=', this.selectedExitFormReleaseDate);
      } else if (this.exitFormReleaseDateFilterType === 'Before' && this.selectedExitFormReleaseDate) {
        this.createExitFormReleaseDateChip('<', this.selectedExitFormReleaseDate);
      } else if (this.exitFormReleaseDateFilterType === 'After' && this.selectedExitFormReleaseDate) {
        this.createExitFormReleaseDateChip('>', this.selectedExitFormReleaseDate);
      } else if (this.exitFormReleaseDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
        const formattedBeginningDate = this.formatDateForDatePicker(this.beginningDateRange);
        const formattedEndDate = this.formatDateForDatePicker(this.endDateRange);
        this.createExitFormReleaseDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
      }
      this.dialogExitFormReleaseDate = false;
      this.selectedExitFormReleaseDate = new Date();
      this.exitFormReleaseDateFilterType = "On";
    },

    cancelSelectStartDate() {
      this.dialogStartDate = false;
      this.startDateFilterType = "On";
      this.selectedStartDate = new Date();
    },

    cancelSelectEndDate() {
      this.dialogEndDate = false;
      this.endDateFilterType = "On";
      this.selectedEndDate = new Date();
    },

    cancelSelectExitFormReleaseDate() {
      this.dialogExitFormReleaseDate = false;
      this.exitFormReleaseDateFilterType = "On";
      this.selectedExitFormReleaseDate = new Date();
    },

    createStartDateChip(operator, date) {
      let term = '';
      if (operator === '=') {
        term = `= ${this.formatDateMethod(date)}`;
      } else if (operator === '<') {
        term = `< ${this.formatDateMethod(date)}`;
      } else if (operator === '>') {
        term = `> ${this.formatDateMethod(date)}`;
      } else if (operator === 'between') {
        term = `between ${date}`;
      }
      const startDateChip = {
        category: 'Session Start Date',
        term: term
      };
      this.viewsStore.addSearchChip('sessions', startDateChip);
      this.viewsStore.sessions.selectedSearchChips.push(this.viewsStore.sessions.searchChips.length - 1);
      this.performFilter();
    },

    createEndDateChip(operator, date) {
      let term = '';
      if (operator === '=') {
        term = `= ${this.formatDateMethod(date)}`;
      } else if (operator === '<') {
        term = `< ${this.formatDateMethod(date)}`;
      } else if (operator === '>') {
        term = `> ${this.formatDateMethod(date)}`;
      } else if (operator === 'between') {
        term = `between ${date}`;
      }
      const endDateChip = {
        category: 'Session End Date',
        term: term
      };
      this.viewsStore.addSearchChip('sessions', endDateChip);
      this.viewsStore.sessions.selectedSearchChips.push(this.viewsStore.sessions.searchChips.length - 1);
      this.performFilter();
    },

    createExitFormReleaseDateChip(operator, date) {
      let term = '';
      if (operator === '=') {
        term = `= ${this.formatDateForDatePicker(date)}`;
      } else if (operator === '<') {
        term = `< ${this.formatDateForDatePicker(date)}`;
      } else if (operator === '>') {
        term = `> ${this.formatDateForDatePicker(date)}`;
      } else if (operator === 'between') {
        term = `between ${date}`;
      }
      const exitFormReleaseDateChip = {
        category: 'Exit Form Release Date',
        term: term
      };
      this.viewsStore.addSearchChip('sessions', exitFormReleaseDateChip);
      this.viewsStore.sessions.selectedSearchChips.push(this.viewsStore.sessions.searchChips.length - 1);
      this.performFilter();
    },

    formatDateMethod(date) {
      return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
    },

    toggleArchivedSessions() {
      const newType = this.viewsStore.isViewingArchived('sessions') ? 'active' : 'archived';
      this.viewsStore.switchViewType('sessions', newType);
      this.performFilter();
    },

    async handleArchiveSessions() {
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const updateStatus = { sessionStatus: this.viewsStore.isViewingArchived('sessions') };

        for (const session of this.selectedSessions) {
          const sessionApiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/${session._id}`;
          const expInstanceApiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/update-status-by-session`;

          await axios.put(sessionApiURL, updateStatus, { headers: { token }});

          const expInstanceUpdateStatus = { sessionID: session._id, status: this.viewsStore.isViewingArchived('sessions') };
          const expInstanceResponse = await axios.put(expInstanceApiURL, expInstanceUpdateStatus, { headers: { token }});

          const message = (this.selectedSessions.length === 1 ? this.$t("Session") + " " : this.$t("Sessions") + " ") +
                          (this.viewsStore.isViewingArchived('sessions') ? this.$t("Restored") : this.$t("Archived")) +
                          (expInstanceResponse.data.instancesUpdated ? " " + this.$t("and Associated Experience Instances") + " " : "") +
                          (this.viewsStore.isViewingArchived('sessions') ? this.$t("Restored!") : this.$t("Archived!"));

          toast.success(message, {
            position: "top-right",
            toastClassName: "Toastify__toast--create",
            multiple: false
          });
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.selectedSessions = [];
        await this.fetchInstances();
        await this.fetchSessionData()
          .then(() => {
            useLoggedInUserStore().stopLoading();
            this.performFilter();
          })
          .catch((error) => {
            this.handleError(error);
            useLoggedInUserStore().stopLoading();
          });
      }
    },

    handleAddNewSession() {
      this.$router.push({ name: "instructorAddSession" });
    },

    xsCancelSearchDialog() {
      this.xsdialogSearch = false;
      this.xsSearchFilterSelection = null;
    },

    xsApplySearchFilters() {
      if (this.xsSearchFilterSelection === "Session Name") {
        this.addSearchChip();
      } else if (this.xsSearchFilterSelection === "Start Date" || this.xsSearchFilterSelection === "End Date") {
        const isStartDate = this.xsSearchFilterSelection === "Start Date";
        let dateFilterType = isStartDate ? this.startDateFilterType : this.endDateFilterType;
        let selectedDate = isStartDate ? this.selectedStartDate : this.selectedEndDate;
        let handleDateSelection = isStartDate ? this.handleStartDateSelection : this.handleEndDateSelection;
        let submitDate = isStartDate ? this.submitStartDate : this.submitEndDate;
        let createChipMethod = isStartDate ? this.createStartDateChip : this.createEndDateChip;

        if (dateFilterType !== 'Between') {
          let parsedDate = DateTime.fromISO(selectedDate).toJSDate();
          handleDateSelection(parsedDate);
          submitDate(parsedDate);
        } else {
          if (this.beginningDateRange && this.endDateRange) {
            let parsedStartDate = DateTime.fromISO(this.beginningDateRange).toJSDate();
            let parsedEndDate = DateTime.fromISO(this.endDateRange).toJSDate();
            createChipMethod('>', parsedStartDate);
            createChipMethod('<', parsedEndDate);
          }
        }
      }
      this.xsdialogSearch = false;
      this.sessionSearch = "";
      this.xsSearchFilterSelection = null;
    },

    toggleRowExpansion(item) {
      const index = this.expandedSessions.indexOf(item);
      if (index > -1) {
        this.expandedSessions.splice(index, 1);
      } else {
        this.expandedSessions.push(item);
      }
    },

    formatDateForDatePicker(date) {
      return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
    },

    getActivityCount(activities) {
      return activities.length;
    },

    editInstance(instance) {
      useLoggedInUserStore().navigationData = {
        id: instance._id
      };
      this.$router.push({ name: "instructorSpecificExperienceInstance" });
    },

    handleAddExperience(sessionID) {
      useLoggedInUserStore().navigationData = {
        id: sessionID
      };
      this.$router.push({ name: "instructorAddExperienceInstance" });
    },

    handleSortByUpdate(newSortBy) {
      this.viewsStore.updateSorting('sessions', newSortBy);
    },
  },
};
</script>

<style scoped>
/* Content Container */
.sessions-content {
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

.sessions-table {
  border-radius: 0;
  font-size: 0.95rem;
}

.sessions-table :deep(.v-data-table-header) {
  font-size: 0.9rem;
}

.sessions-table :deep(th) {
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

.session-name {
  font-size: 0.95rem;
}

/* Expanded Row */
.expanded-row {
  background-color: #fafafa;
}

.expanded-content {
  padding: 16px 24px 16px 16px;
}

.instances-table-container {
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.instances-table {
  font-size: 0.9rem;
}

.instances-table :deep(th) {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  padding: 8px 12px !important;
  background-color: #f5f5f5;
}

.instance-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.instance-row:hover {
  background-color: rgba(200, 16, 46, 0.04) !important;
}

.instance-cell {
  padding: 8px 12px !important;
  font-size: 0.9rem;
}

.instances-table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  background-color: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.add-experience-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
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
.date-picker-dialog,
.mobile-search-dialog {
  border-radius: 12px;
}

.date-picker-full-width {
  width: 100%;
}

.date-picker-full-width :deep(.v-date-picker) {
  width: 100%;
}

.apply-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

/* Data table pagination styling */
.sessions-table :deep(.v-data-table-footer) {
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
    padding: 12px;
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
    padding: 8px;
  }
}
</style>