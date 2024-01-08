<!--'/instructorExperiences' this page will only show experiences-->
<template>
    <v-container>
        <!-- Tabs for Navigation -->
        <v-row>
            <v-col>
                <v-tabs
                    fixed-tabs
                >
                    <v-tab>
                        <!-- <router-link to="/instructorSemesters">Semesters</router-link> -->
                        Sessions
                    </v-tab>
                    <v-tab>
                        <!-- <router-link to="/instructorExperiences">Experiences</router-link> -->
                        Experiences
                    </v-tab>
                    <v-tab>
                        <!-- <router-link to="/instructorActivities">Activities</router-link> -->
                        Activities
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <div class="d-flex justify-center font-weight-black text-h6">
                    Experiences
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-row class="d-flex justify-start">
                            <!-- Search -->
                            <v-col md="6">
                                <v-text-field
                                    v-model="experienceSearch"
                                    density="comfortable"
                                    :label=searchLabel
                                    flat
                                    hide-details
                                    variant="solo-filled"
                                    @keyup.enter="addSearchChip"
                                >
                                    <!-- Prepend Icon with Menu -->
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
                                            <v-icon>mdi-magnify</v-icon>
                                            <v-icon>mdi-chevron-down</v-icon>
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
                                        <div class="pointer-cursor mr-3" @click="addSearchChip">
                                            <v-icon>mdi-chevron-right</v-icon>
                                        </div>
                                    </template>

                                </v-text-field>
                            </v-col>

                            
                            <v-col md="4" class="d-flex align-center">

                                <!-- Data View Menu -->
                                <v-menu>
                                    <template v-slot:activator="{ props }">
                                        <v-btn 
                                            text="Data View" 
                                            v-bind="props"
                                            elevation="1"
                                            class="mr-lg-4 mr-md-2"
                                        ></v-btn>
                                    </template>

                                    <v-list
                                        density="compact"
                                    >
                                        <v-list-item
                                            v-for="item in dataViewMenuItems"
                                            :key="item.title"
                                            @click="handleDataViewMenuAction(item)"
                                        >
                                            <v-list-item-title>
                                                <v-icon size="small">{{ item.icon }}</v-icon>
                                                {{ item.title }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <!-- Sort Dialog Menu from Data View -->
                                <v-dialog v-model="isSortDialogVisible" max-width="600">
                                    <v-card>
                                        <v-card-title>Sort Options</v-card-title>
                                        <v-card-subtitle>
                                            Please select the columns in the order you would like them sorted.
                                        </v-card-subtitle>

                                        <v-card-text>
                                            <v-table
                                                density="compact"
                                            >
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">Select</th>
                                                            <th class="text-left">Column</th>
                                                            <th class="text-left">Sort Order</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(column, index) in sortableColumns" :key="index">
                                                            <td><v-checkbox v-model="column.selected" class="d-flex align-center"></v-checkbox></td>
                                                            <td :class="{ 'text-grayed-out' : !column.selected }">
                                                                {{ column.name }}
                                                            </td>
                                                            <td>
                                                            <v-select
                                                                :items="sortOrderOptions.map(option => option.label)"
                                                                v-model="column.selectedSortOrder"
                                                                :disabled="!column.selected"
                                                                density="compact"
                                                                hide-details
                                                                >
                                                                    <template v-slot:prepend-inner>
                                                                        <v-icon>
                                                                        {{ sortOrderOptions.find(option => option.label === column.selectedSortOrder)?.icon }}
                                                                        </v-icon>
                                                                    </template>
                                                            </v-select>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-table>
                                            <!-- Sort Chips Preview for selected sort criteria -->
                                                <v-chip 
                                                    v-for="(criteria, index) in sortCriteria" 
                                                    :key="index" 
                                                    class="ma-2"
                                                    color="blue-darken-1"
                                                >
                                                    {{ criteria.name }}
                                                    <v-icon small class="ml-2">{{ criteria.icon }}</v-icon>
                                                    {{ criteria.order }}
                                                </v-chip>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="isSortDialogVisible = false">Close</v-btn>
                                            <v-btn color="green" text @click="applySortChips">Sort</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <!-- Filter Dialog Menu -->
                                <v-dialog v-model="isFilterDialogVisible" :width=filterDialogWidth persistent>
                                    <v-card>
                                        <v-card-item>
                                        <v-row>
                                            <!-- Column Names List -->
                                            <v-col>
                                                <v-card-title>Filter Options</v-card-title>
                                                <v-list
                                                    density="compact"
                                                >
                                                    <v-list-item
                                                        v-for="(header, index) in filterableExperienceHeaders"
                                                        :key="index"
                                                        @click="toggleColumnFilter(header)"
                                                        :active="selectedFilterColumn?.value === header.value"
                                                        active-class="active-filter-item"
                                                    >
                                                        <v-list-item-title>{{ header.title }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>

                                        <!-- Filter Options for the selected column -->
                                        <v-col>
                                            <transition name="fade" mode="out-in" tag="div">
                                            <!-- Experience Category Filter -->
                                            <div v-if="selectedFilterColumn?.value === 'experienceCategory'">
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field
                                                            v-model="experienceCategoryFilterSearchQuery"
                                                            label="Search Categories"
                                                            class="mr-5 mt-2"
                                                            hide-details
                                                            variant="underlined"
                                                        ></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <div class="scrollable-list">
                                                            <v-list density="compact">
                                                                <v-list-item
                                                                    v-for="(category, index) in filteredCategories"
                                                                    :key="index"
                                                                    class="pa-0"
                                                                >
                                                                    <v-checkbox
                                                                        density="compact"
                                                                        v-model="selectedExperienceCategoriesFilter"
                                                                        :value="category"
                                                                        :label="category"
                                                                        @click.stop
                                                                        hide-details
                                                                    ></v-checkbox>
                                                                </v-list-item>
                                                            </v-list>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </div>

                                            <!-- Experience Name Filter -->
                                            <div v-else-if="selectedFilterColumn?.value === 'experienceName'">
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field
                                                            v-model="experienceNameFilterSearchQuery"
                                                            label="Search Experience Names"
                                                            class="mr-5 mt-2"
                                                            hide-details
                                                            variant="underlined"
                                                        ></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <div class="scrollable-list">
                                                            <v-list density="compact">
                                                                <v-list-item
                                                                    v-for="(name, index) in filteredExperienceNames"
                                                                    :key="index"
                                                                    class="pa-0"
                                                                >
                                                                    <v-checkbox
                                                                        density="compact"
                                                                        v-model="selectedExperienceNamesFilter"
                                                                        :value="name"
                                                                        :label="name"
                                                                        @click.stop
                                                                        hide-details
                                                                    ></v-checkbox>
                                                                </v-list-item>
                                                            </v-list>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </div>

                                            <!-- Activities Filter -->
                                            <div v-else-if="selectedFilterColumn?.value === 'activitiesCount'">
                                                <v-row>
                                                    <v-col>
                                                        <v-checkbox
                                                            v-model="isActivitiesNumberFilterEnabled"
                                                            density="compact"
                                                            label="Filter by # of Activities"
                                                            hide-details
                                                        ></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                                <v-expand-transition>
                                                <v-row class="mt-0" v-if="isActivitiesNumberFilterEnabled">
                                                    <v-col class="pt-0">
                                                        <v-text-field
                                                            v-model="positiveActivitiesNumberFilter"
                                                            label="Enter a Number"
                                                            type="number"
                                                            variant="solo-filled"
                                                            class="mr-5 mt-2"
                                                            hide-details
                                                        ></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                </v-expand-transition>
                                                <v-row>
                                                    <v-col>
                                                        <!-- Add v-autocomplete for another filter here -->
                                                        <v-autocomplete
                                                            v-model="activitiesNameFilter"
                                                            :items="activeActivityData"
                                                            item-title="activityName"
                                                            item-value="_id"
                                                            label="Filter by Activity Name"
                                                            class="mr-5 mt-2 custom-autocomplete"
                                                            hide-details
                                                            density="compact"
                                                            clearable
                                                            chips
                                                            multiple
                                                            :menu-props="{ maxHeight: '200px', maxWidth: '250px' }"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                </v-row>
                                            </div>


                                            <!-- Status Filter -->
                                            <div v-else-if="selectedFilterColumn?.value === 'experienceStatus'">
                                                <v-row>
                                                    <v-col>
                                                        <v-select
                                                            v-model="selectedStatusFilter"
                                                            :items="experienceStatusOptions"
                                                            label="Filter by Status"
                                                            class="mr-5 mt-2"
                                                            hide-details
                                                        ></v-select>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                            
                                        </transition>

                                        </v-col>

                                        </v-row>

                                        <!-- Filter Chips Preview -->
                                        <v-row>
                                            <v-col>
                                                <v-chip
                                                    v-for="(criteria, index) in filterCriteria"
                                                    :key="index"
                                                    class="ma-2"
                                                    color="light-green-darken-3"
                                                >
                                                    {{ criteria.filter.title }}
                                                    <v-icon small class="ml-1">mdi-filter</v-icon>
                                                    <span v-for="(item, itemIndex) in criteria.filterBy" :key="itemIndex" class="d-inline-block text-truncate" style="max-width: 150px;">
                                                        {{ item }}<span v-if="itemIndex < criteria.filterBy.length - 1">&nbsp;,</span>
                                                    </span>
                                                </v-chip>
                                            </v-col>
                                        </v-row>

                                        <!-- Add your filter options here based on the selected column -->
                                        
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        
                                        <v-btn 
                                            color="blue darken-1" 
                                             
                                            @click="closeFilterDialog"
                                        >Close</v-btn>
                                        <v-btn 
                                            color="green" 
                                             
                                            @click="applyFilters"
                                        >Apply</v-btn>
                                        </v-card-actions>
                                    </v-card-item>
                                    </v-card>
                                </v-dialog>

                                <!-- Row Actions Menu -->
                                <v-menu>
                                    <template v-slot:activator="{ props }">
                                        <v-btn 
                                            text="Row Actions" 
                                            v-bind="props"
                                            elevation="1"
                                        ></v-btn>
                                    </template>

                                    <v-list>
                                        <v-list-item
                                            v-for="item in rowActionsMenuItems"
                                            :key="item.title"
                                            @click="console.log('action menu')"
                                        >
                                            <v-list-item-title>
                                                <v-icon size="small">{{ item.icon }}</v-icon>
                                                {{ item.title }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                            </v-col>

                            <!-- Add New Experience Button -->
                            <v-col md="2" class="text-end align-self-center">
                                <v-btn 
                                    @click="console.log('Add New Experience')"
                                    elevation="1"
                                    prepend-icon="mdi-plus"
                                    color="#c8102e"
                                >
                                    Add New
                                </v-btn>
                            </v-col>
                        </v-row>

                        <!-- Chips Row -->
                        <v-row v-if="showChipsRow" dense>
                            <v-col>
                                <!-- Search Chips -->
                                <v-chip-group v-if="searchCriteria.length" v-model="selectedSearchChips" column multiple>
                                    <v-chip
                                        v-for="(criteria, index) in searchCriteria"
                                        :key="index"
                                        @click="selectSearchChip(index)"
                                        filter
                                        variant="outlined"
                                        class="ma-2"
                                    >
                                        {{ criteria.category + '="' + criteria.term + '"' }}
                                        <v-icon end @click.stop="removeSearchChip(index)">mdi-close</v-icon>
                                    </v-chip>
                                </v-chip-group>

                                <!-- Sort Chips -->
                                <v-chip-group v-if="sortChips.length" v-model="selectedSortChips" column multiple selected-class="text-primary">
                                    <v-chip
                                        v-for="(chip, index) in sortChips"
                                        :key="index"
                                        class="ma-2"
                                        @click="selectSortChip(index)"
                                    >
                                        {{ chip.label }} <v-icon small class="ml-2">{{ chip.icon }}</v-icon> {{ chip.order }}
                                        <v-icon end @click.stop="removeSortChip(index)">mdi-close</v-icon>
                                    </v-chip>
                                </v-chip-group>

                                <!-- Filter Chips -->
                                <v-chip-group v-if="filterChips.length" v-model="selectedFilterChips" column multiple>
                                    <v-chip
                                        v-for="(criteria, index) in filterChips"
                                        :key="index"
                                        class="ma-2"
                                        color="light-green-darken-3"
                                        outlined
                                    >
                                        {{ criteria.filter.title }}: 
                                        <v-icon small class="ml-1">mdi-filter</v-icon>
                                        <span v-for="(item, itemIndex) in criteria.filterBy" :key="itemIndex" class="d-inline-block text-truncate" style="max-width: 150px;">
                                            {{ item }}<span v-if="itemIndex < criteria.filterBy.length - 1">, </span>
                                        </span>
                                        <!-- You can add logic to handle chip removal if necessary -->
                                    </v-chip>
                                </v-chip-group>


                            </v-col>
                        </v-row>


                    </v-card-title>


                    <v-data-table
                        :headers="experienceHeaders"
                        :items="filteredExperienceData"
                        v-model:sort-by="sortBy"
                        item-key="_id"
                        item-value="_id"
                        show-select
                        v-model="selectedExperiences"
                        @update:sortBy="onTableHeaderSort"
                    >
                        <!-- Slot for Edit Column -->
                        <template v-slot:item.edit="{ item }">
                            <v-btn
                                @click="console.log('edit experience')"
                                icon="mdi-pencil"
                                variant="text" 
                                size="small"
                            ></v-btn>
                        </template>

                        <!-- Slot for Experience Status Column -->
                        <template v-slot:item.experienceStatus="{ item }">
                            <v-chip :color="getStatusColor(item.experienceStatus)">
                                {{ getStatusText(item.experienceStatus) }}
                            </v-chip>
                        </template>

                        <!-- Slot for Activities Column -->
                        <template v-slot:item.activities="{ item }">
                            <div>{{ item.activitiesCount }}</div>
                        </template>
                    </v-data-table>


                    <!-- Skeleton Loader - Add Afterwards -->
                    <!-- <v-data-table :loading="!loading" :items="experienceData">
                        <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                    </v-data-table> -->


                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    filterChips: {{ filterChips }}
    <br>
    selectedFilterChips: {{ selectedFilterChips }}
    <br>
    filteredExperienceData: {{ filteredExperienceData }}


    <br><br><br><br><br><br><br>

    filterableExperienceHeaders: {{ filterableExperienceHeaders }}
    <br>

    selectedFilterColumn: {{ selectedFilterColumn }}
    <br>

    isSortDialogVisible: {{isSortDialogVisible  }}
    <br>
    sortableColumns: {{sortableColumns  }}
    <br>
    selectedSortColumn: {{selectedSortColumn  }}
    <br>
    sortOrder: {{sortOrder  }}
    <br>
    sortCriteria: {{ sortCriteria }}
    <br>
    sortOrderOptions: {{ sortOrderOptions }}
    <br>
    sortChips: {{ sortChips }}
    <br>
    selectedSortChips: {{ selectedSortChips }}
    


    <br><br><br><br><br><br><br><br><br>


Experience Data:
<br>
    {{ experienceData }}
<br>
Filtered Experience Data:
<br>
    {{ filteredExperienceData }}

</template>
  






<script>
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import axios from "axios";
  
  export default {
    data() {
      return {
        experienceData: [],
        activeActivityData: [],
        showInactive: false,
        selectedExperiences: [],
        searchQuery: '',
        hoverId: null,
        experienceHeaders: [
            {
                title: 'Experience Category',
                value: 'experienceCategory',
                align: 'start',
                sortable: true
            },
            {
                title: 'Experience Name',
                value: 'experienceName',
                align: 'start',
                sortable: true
            },
            {
                title: 'Activities',
                value: 'activitiesCount',
                align: 'center',
                sortable: true
            },
            {
                title: 'Status',
                value: 'experienceStatus',
                align: 'start',
                sortable: true
            },
            { 
                title: '', 
                value: 'edit',
                align: 'end',
                sortable: false 
            },
        ],
        experienceSearch: "",
        searchMenuItems: ['All Text Fields', 'Experience Category', 'Experience Name'],
        searchLabel: 'Search All Text Fields',
        searchCriteria: [],
        selectedSearchChips: [],
        filteredExperienceData: [],
        rowActionsMenuItems: [
            { title: 'Activate', icon: 'mdi-toggle-switch' },
            { title: 'Deactivate', icon: 'mdi-toggle-switch-off' },
            { title: 'Delete', icon: 'mdi-delete' },
        ],
        dataViewMenuItems: [
            { title: 'Sort', icon: 'mdi-sort' } ,
            { title: 'Filter', icon: 'mdi-filter' } ,
            { title: 'Aggregate', icon: 'mdi-chart-box' } ,
        ],
        isSortDialogVisible: false,
        sortableColumns: [
            { name: 'Experience Category', value: 'experienceCategory', selected: false, selectedSortOrder: 'Ascending' },
            { name: 'Experience Name', value: 'experienceName', selected: false, selectedSortOrder: 'Ascending' },
            { name: 'Activities', value: 'activitiesCount', selected: false, selectedSortOrder: 'Ascending' },
            { name: 'Status', value: 'experienceStatus', selected: false, selectedSortOrder: 'Ascending' },
        ],
        selectedSortColumn: null,
        sortOrder: 'asc',
        sortCriteria: [],
        sortOrderOptions: [
            { label: 'Ascending', icon: 'mdi-sort-ascending' },
            { label: 'Descending', icon: 'mdi-sort-descending' },
        ],
        sortChips: [], 
        selectedSortChips: [],
        defaultSortCriteria: [
            { value: 'experienceStatus', order: 'Descending' },
            { value: 'experienceCategory', order: 'Ascending' },
        ],
        selectionOrder: [],
        tableSortingOptions: {
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: [],
        },
        sortBy: [],
        isFilterDialogVisible: false,
        selectedFilterColumn: null,
        selectedExperienceCategoriesFilter: [],
        experienceCategoryFilterSearchQuery: '',
        selectedExperienceNamesFilter: [],
        experienceNameFilterSearchQuery: '',
        activitiesNumberFilter: null,
        experienceStatusOptions: ['Active', 'Inactive'],
        selectedStatusFilter: [],
        isActivitiesNumberFilterEnabled: false,
        activitiesNumberFilter: null,
        activitiesNameFilter: null,
        activitiesAll: [],
        filterCriteria: [],
        filterChips: [],
        selectedFilterChips: [],
      };
    },




  


    mounted() {
      useLoggedInUserStore().startLoading();
      this.fetchExperienceData()
      this.fetchActiveActivityData()
      .then(() => {
        useLoggedInUserStore().stopLoading();
        // Apply default sorting after fetching data
        this.applyDefaultSorting();
      })
      .catch(() => {
        this.handleError(error);
        useLoggedInUserStore().stopLoading();
      });
  
      window.scrollTo(0, 0);
      if (this.$route.params.toastType) {
        toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
          position: this.$route.params.toastPosition,
          toastClassName: this.$route.params.toastCSS
        });
      }
    },

    watch: {
        // Automatically add Sort Chips as Preview
        sortableColumns: {
            deep: true,
            handler(newColumns) {
            // Update the selection order based on the changes
            newColumns.forEach(column => {
                if (column.selected && !this.selectionOrder.includes(column.value)) {
                // Add to the selection order if selected and not already in the array
                this.selectionOrder.push(column.value);
                } else if (!column.selected && this.selectionOrder.includes(column.value)) {
                // Remove from the selection order if deselected
                this.selectionOrder = this.selectionOrder.filter(value => value !== column.value);
                }
            });

            this.updateSortCriteriaChips();
            },
        },

        // Automatically add Experience Category Filter Chips as Preview
        selectedExperienceCategoriesFilter: {
            deep: true,
            handler(newVal) {
                // Check if selectedFilterColumn is set to 'experienceCategory'
                if (this.selectedFilterColumn?.value === 'experienceCategory') {
                    // Find the existing filter object and its index for the selected filter column
                    const existingFilterIndex = this.filterCriteria.findIndex(chip => chip.filter.value === this.selectedFilterColumn.value);

                    if (existingFilterIndex !== -1) {
                        // Check if there are no selected filters
                        if (newVal.length === 0) {
                            // Remove the filter chip since no filters are selected
                            this.filterCriteria.splice(existingFilterIndex, 1);
                        } else {
                            // Update the existing filter object
                            this.filterCriteria[existingFilterIndex].filterBy = newVal;
                        }
                    } else if (newVal.length > 0) {
                        // Add a new filter object if there are selected filters
                        this.filterCriteria.push({
                            filter: this.selectedFilterColumn,
                            filterBy: newVal
                        });
                    }
                }
                console.log('Updated filterCriteria: ', this.filterCriteria);
            }
        },

        // Automatically Add Experience Name Filter Chips as preview
        selectedExperienceNamesFilter: {
            deep: true,
            handler(newVal) {
                // Check if selectedFilterColumn is set to 'experienceName'
                if (this.selectedFilterColumn?.value === 'experienceName') {
                    // Find the existing filter object and its index for the selected filter column
                    const existingFilterIndex = this.filterCriteria.findIndex(chip => chip.filter.value === this.selectedFilterColumn.value);

                    if (existingFilterIndex !== -1) {
                        // Check if there are no selected filters
                        if (newVal.length === 0) {
                            // Remove the filter chip since no filters are selected
                            this.filterCriteria.splice(existingFilterIndex, 1);
                        } else {
                            // Update the existing filter object
                            this.filterCriteria[existingFilterIndex].filterBy = newVal;
                        }
                    } else if (newVal.length > 0) {
                        // Add a new filter object if there are selected filters
                        this.filterCriteria.push({
                            filter: this.selectedFilterColumn,
                            filterBy: newVal
                        });
                    }
                }

                console.log('Updated filterCriteria: ', this.filterCriteria);
            }
        },

        // Automatically add Activity Number Filter Chips for Preview
        positiveActivitiesNumberFilter(newVal) {
            if (this.isActivitiesNumberFilterEnabled) {
                if (newVal !== null && newVal !== '') {
                    // If checkbox is checked and there's a valid number, add or update the filter chip
                    const filterObject = {
                        filter: { 
                            title: "Number of Activities", 
                            value: "activitiesCount"
                        },
                        filterBy: [newVal]
                    };

                    const existingFilterIndex = this.filterCriteria.findIndex(chip => chip.filter.value === 'activitiesCount');
                    if (existingFilterIndex !== -1) {
                        this.filterCriteria[existingFilterIndex] = filterObject;
                    } else {
                        this.filterCriteria.push(filterObject);
                    }
                } else {
                    // If the number is cleared, remove the filter chip if it exists
                    const index = this.filterCriteria.findIndex(chip => chip.filter.value === 'activitiesCount');
                    if (index !== -1) {
                        this.filterCriteria.splice(index, 1);
                    }
                }
            } else {
                // If checkbox is unchecked, remove the filter chip if it exists
                const index = this.filterCriteria.findIndex(chip => chip.filter.value === 'activitiesCount');
                if (index !== -1) {
                    this.filterCriteria.splice(index, 1);
                }
            }
        },

        // Watch the "Filter by # of Activities Checkbox" to remove preview chip if needed
        isActivitiesNumberFilterEnabled(newVal) {
            if (!newVal) {
                // Checkbox is unchecked, remove the filter chip if it exists
                const index = this.filterCriteria.findIndex(chip => chip.filter.value === 'activitiesCount');
                if (index !== -1) {
                    this.filterCriteria.splice(index, 1);
                }
            }
        },

        // Watch the "Filter by Activity Name" to add or remove preview chips as needed
        activitiesNameFilter(newVal, oldVal) {
            // Convert newVal IDs to corresponding activity names
            const newActivityNames = newVal.map(id => 
                this.activeActivityData.find(activity => activity._id === id)?.activityName
            ).filter(name => name); // Filter out undefined values

            // Convert oldVal IDs to corresponding activity names (if oldVal is not null)
            const oldActivityNames = oldVal ? oldVal.map(id => 
                this.activeActivityData.find(activity => activity._id === id)?.activityName
            ).filter(name => name) : [];

            // Find existing filter chip index for activities
            const existingFilterIndex = this.filterCriteria.findIndex(chip => chip.filter.value === 'activities');

            // Add or update filter chip for activities if newActivityNames is not empty
            if (newActivityNames.length > 0) {
                const filterObject = {
                    filter: { 
                        title: "Activities", 
                        value: "activities"
                    },
                    filterBy: newActivityNames
                };

                if (existingFilterIndex !== -1) {
                    this.filterCriteria[existingFilterIndex] = filterObject;
                } else {
                    this.filterCriteria.push(filterObject);
                }
            } else if (existingFilterIndex !== -1) {
                // Remove the activities filter chip if newActivityNames is empty
                this.filterCriteria.splice(existingFilterIndex, 1);
            }
        },

        // Watch the "Filter by Status" to add or remove preview chips as needed
        selectedStatusFilter(newVal) {
            // Find existing filter chip index for status
            const existingFilterIndex = this.filterCriteria.findIndex(chip => chip.filter.value === 'experienceStatus');

            // Add or update filter chip for status if newVal is not empty
            if (newVal) {
                const filterObject = {
                    filter: { 
                        title: "Status", 
                        value: "experienceStatus"
                    },
                    filterBy: [newVal]
                };

                if (existingFilterIndex !== -1) {
                    this.filterCriteria[existingFilterIndex] = filterObject;
                } else {
                    this.filterCriteria.push(filterObject);
                }
            } else if (existingFilterIndex !== -1) {
                // Remove the status filter chip if newVal is empty
                this.filterCriteria.splice(existingFilterIndex, 1);
            }
        },



    },

    computed: {
      loading() {
        const store = useLoggedInUserStore()
        return store.loading;
      },

    showChipsRow() {
        return this.searchCriteria.length > 0 || this.sortChips.length > 0 || this.filterChips.length > 0;
    },

    filteredCategories() {
        if (!this.experienceCategoryFilterSearchQuery) {
            return this.uniqueExperienceCategories;
        }
        const searchLower = this.experienceCategoryFilterSearchQuery.toLowerCase();
        return this.uniqueExperienceCategories.filter(category => 
            category.toLowerCase().includes(searchLower)
        );
    },

    uniqueExperienceCategories() {
        const categories = new Set(this.experienceData.map(item => item.experienceCategory));
        return Array.from(categories);
    },

    filterableExperienceHeaders() {
        return this.experienceHeaders.filter(header => header.title !== '');
    },

    filteredExperienceNames() {
        const searchLower = this.experienceNameFilterSearchQuery.toLowerCase();
        return this.getUniqueExerienceNames().filter(name => 
            name.toLowerCase().includes(searchLower)
        );
    },

    filterDialogWidth() {
        if (this.selectedFilterColumn?.value === 'experienceName') {
            return '1000';
        } else if (this.selectedFilterColumn?.value === 'activitiesCount') {
            return '800';
        } else {
            return '600';
        }
    },

    positiveActivitiesNumberFilter: {
        get() {
            return Math.abs(this.activitiesNumberFilter);
        },
        set(value) {
            this.activitiesNumberFilter = Math.abs(value);
        }
    },

    },
    methods: {
      async fetchExperienceData() {
        try {
            const user = useLoggedInUserStore();
            //   const token = user.token;

            let token = `

            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDMxMTA3NSwiZXhwIjoxNzA0MzIzMDc1fQ.MCLldjZBIbDtqLh9wVisWlVuJulA3ssM7OTpkdZpO6c

            `

            let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experiences/";
            const resp = await axios.get(apiURL, { headers: { token } });
            this.experienceData = resp.data.map(item => ({
                ...item,
                activitiesCount: item.activities.length
            }));
            this.filteredExperienceData = [...this.experienceData];
        } catch (error) {
          this.handleError(error);
        }
    },

    async fetchActiveActivityData() {
        try {
            const user = useLoggedInUserStore();
            // const token = user.token;

            let token = `
            
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDMxMTEwOSwiZXhwIjoxNzA0MzIzMTA5fQ.QrixBa4jtDCTGMUAxXK_8iEIoVjvbn7m_VrqIFL3Ekw

            `
            let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/activities/active/"
            const resp = await axios.get(apiURL, { headers: { token } });
            this.activeActivityData = resp.data;
        } catch (error) {
            console.log('error: ', error);
            this.handleError(error);
        }
    },



      getStatusColor(status) {
        return status ? 'green' : 'red'
      },

      getStatusText(status) {
        return status ? 'Active' : 'Inactive'
      },

      updateSearchCriteria(selectedItem) {
        this.searchLabel = 'Search ' + selectedItem;
      },

      selectSearchChip(index) {
        const selectedIndex = this.selectedSearchChips.indexOf(index);
        if (selectedIndex >= 0) {
            // If the chip is already selected, create a new array without this chip
            this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        } else {
            // If the chip is not selected, create a new array with this chip added
            this.selectedSearchChips = [...this.selectedSearchChips, index];
        }
        // Call search
        this.performSearch();
      },

      addSearchChip() {
        if (this.experienceSearch) {
            this.searchCriteria.push({
                category: this.searchLabel.replace('Search ', ''),
                term: this.experienceSearch
            });
            // Select the new chip by default
            this.selectedSearchChips.push(this.searchCriteria.length - 1);
            // Clear the input field after adding the chip
            this.experienceSearch = ''; 
            // Call search
            this.performSearch();
        }
    },

    removeSearchChip(index) {
        this.searchCriteria.splice(index, 1);
        // Update selectedSearchChips to reflect the removal
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        // Adjust the indexes of the remaining selected chips
        this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
        // Call search
        this.performSearch();
    },

    performSearch() {
        let searchGroups = {};
        this.selectedSearchChips.forEach(index => {
            let criteria = this.searchCriteria[index];
            if (!searchGroups[criteria.category]) {
                searchGroups[criteria.category] = [];
            }
            searchGroups[criteria.category].push(criteria.term.toLowerCase());
        });

        this.filteredExperienceData = this.experienceData.filter(item => {
            return Object.keys(searchGroups).every(category => {
                if (category === 'All Text Fields') {
                    return searchGroups[category].every(term => 
                        item.experienceCategory.toLowerCase().includes(term) || 
                        item.experienceName.toLowerCase().includes(term)
                    );
                } else if (category === 'Experience Category') {
                    return searchGroups[category].every(term => 
                        item.experienceCategory.toLowerCase().includes(term)
                    );
                } else if (category === 'Experience Name') {
                    return searchGroups[category].every(term => 
                        item.experienceName.toLowerCase().includes(term)
                    );
                }
                return true;
            });
        });
    },

    handleDataViewMenuAction(item) {
      if (item.title === 'Sort') {
        this.isSortDialogVisible = true;
      } else if (item.title === 'Filter') {
        this.isFilterDialogVisible = true;
      } else {
        console.log('action menu: ', item.title);
      }
    },

    selectSearchChip(index) {
        const selectedIndex = this.selectedSearchChips.indexOf(index);
        if (selectedIndex >= 0) {
            // If the chip is already selected, create a new array without this chip
            this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        } else {
            // If the chip is not selected, create a new array with this chip added
            this.selectedSearchChips = [...this.selectedSearchChips, index];
        }
        // Call search
        this.performSearch();
      },

      applyDefaultSorting() {
        this.filteredExperienceData.sort((a, b) => {
            for (let criteria of this.defaultSortCriteria) {
                let order = criteria.order === 'Ascending' ? 1 : -1;
                let valueA = a[criteria.value];
                let valueB = b[criteria.value];
                if (valueA < valueB) return -1 * order;
                if (valueA > valueB) return 1 * order;
            }
            return 0;
        });
    },

    updateSortCriteriaChips() {
        this.sortCriteria = this.selectionOrder.map(value => {
            const column = this.sortableColumns.find(c => c.value === value);
            return {
                name: column.name,
                order: column.selectedSortOrder,
                icon: this.sortOrderOptions.find(option => option.label === column.selectedSortOrder)?.icon
            };
        }).filter(c => c); // Filter out any undefined entries (in case a column is not found)
    },


    applySortChips() {
        this.sortChips = this.selectionOrder
        .map(columnValue => {
            let column = this.sortableColumns.find(c => c.value === columnValue);
            if (column && column.selected) {
            return {
                label: column.name,
                value: column.value,
                order: column.selectedSortOrder,
                icon: this.sortOrderOptions.find(option => option.label === column.selectedSortOrder)?.icon
            };
            }
            return null;
        })
        .filter(chip => chip !== null);

        this.selectedSortChips = this.sortChips.map((_, index) => index);
        this.isSortDialogVisible = false;
        this.applySorting(); // Re-apply sorting
    },


    selectSortChip(index) {
        // Clear existing column header sorting
        this.clearColumnSorting();
        if (this.selectedSortChips.includes(index)) {
            // Remove the index if it's already selected
            this.selectedSortChips = this.selectedSortChips.filter(i => i !== index);
        } else {
            // Add the index if it's not selected
            this.selectedSortChips = [...this.selectedSortChips, index];
            // Reset the table's sorting state
            this.resetTableSorting();
        }
        this.applySorting(); // Re-apply sorting
    },

        
        applySorting() {
            if (this.selectedSortChips.length > 0) {
                this.filteredExperienceData.sort((a, b) => {
                    for (let index of this.selectedSortChips) {
                        let chip = this.sortChips[index];
                        console.log('chip: ', chip);
                        let order = chip.order === 'Ascending' ? 1 : -1;
                        let valueA = a[chip.value];
                        let valueB = b[chip.value];
                        if (valueA < valueB) return -1 * order;
                        if (valueA > valueB) return 1 * order;
                    }
                    return 0; // If equal or no criteria
                });
            } else {
                // Apply default sorting
                this.filteredExperienceData.sort((a, b) => {
                    for (let criteria of this.defaultSortCriteria) {
                        let order = criteria.order === 'Ascending' ? 1 : -1;
                        let valueA = a[criteria.value];
                        let valueB = b[criteria.value];
                        if (valueA < valueB) return -1 * order;
                        if (valueA > valueB) return 1 * order;
                    }
                    return 0;
                })
            }
        },


        resetTableSorting() {
            this.tableSortingOptions = {
                ...this.tableSortingOptions,
                sortBy: [],
                sortDesc: [],
            };
        },

        removeSortChip(index) {
            // Get the value of the column to be removed
            const columnValueToRemove = this.sortChips[index].value;

            // Update the selected property of the corresponding column in sortableColumns
            this.sortableColumns = this.sortableColumns.map(column => {
                if (column.value === columnValueToRemove) {
                    return { ...column, selected: false };
                }
                return column;
            });

            // Create a new array for sortChips without the removed chip
            this.sortChips = this.sortChips.filter((_, chipIndex) => chipIndex !== index);

            // Rebuild selectedSortChips based on the updated sortChips
            this.selectedSortChips = this.sortChips.map((_, newIndex) => newIndex);

            // Re-apply sorting
            this.applySorting();
        },


        onTableHeaderSort() {
            this.selectedSortChips = []; // Reset selected sort chips
        },

        clearColumnSorting() {
            this.sortBy = []; // Reset the sorting state
        },

        toggleColumnFilter(column) {
            console.log('column: ', column);
            if (column.value === 'experienceCategory') {
                this.selectedFilterColumn = column;
                this.experienceCategoryFilterSearchQuery = ''; // Reset the search query
            } else if (column.value === 'experienceName') {
                this.selectedFilterColumn = column;
                this.experienceNameFilterSearchQuery = ''; // Reset the search query
            } else if (column.value === 'activitiesCount') {
                console.log('column is activitiesCount')
                this.selectedFilterColumn = column;
                this.activitiesNumberFilter = null; // Reset the activities filter
            } else if (column.value === 'experienceStatus') {
                this.selectedFilterColumn = column;
                this.selectedStatusFilter = null; // Reset the status filter
            } else {
                this.selectedFilterColumn = null;
            }
        },

        applyFilters() {
            console.log('selectedFilterColumn:', this.selectedFilterColumn);
            console.log('selectedExperienceCategoriesFilter: ', this.selectedExperienceCategoriesFilter);

            console.log('this.filterCriteria: ', this.filterCriteria);

            this.filterChips = [...this.filterCriteria];
            this.selectedFilterChips = this.filterChips.map((_, index) => index);

            // Apply the filters to the data
            this.applyFiltersToData();

            // Close the filter dialog when filters are applied
            this.isFilterDialogVisible = false;
        },

        closeFilterDialog() {
            this.selectedFilterColumn = null;
            this.isFilterDialogVisible = false;
        },

        applyFiltersAndClose() {
            // Implement your filter logic here...

            this.selectedFilterColumn = null;
            this.isFilterDialogVisible = false; // Close the dialog
        },

        toggleCategorySelection(category) {
            // Implement what happens when a category is clicked.
            console.log('filter category:', category);
        },

        getUniqueExerienceNames() {
            const names = new Set(this.experienceData.map(item => item.experienceName));
            return Array.from(names);
        },

        applyFiltersToData() {
            let filteredData = this.filteredExperienceData;

            // Apply each filter chip
            this.filterChips.forEach(filterChip => {
                const filterValue = filterChip.filter.value;
                const filterBy = filterChip.filterBy;

                switch(filterValue) {
                    case 'experienceStatus':
                        filteredData = filteredData.filter(item =>
                            filterBy.includes(item.experienceStatus ? 'Active' : 'Inactive')
                        );
                        break;
                    case 'experienceName':
                        filteredData = filteredData.filter(item => 
                            filterBy.includes(item.experienceName)
                        );
                        break;
                    case 'experienceCategory':
                        filteredData = filteredData.filter(item => 
                            filterBy.includes(item.experienceCategory)
                        );
                        break;
                    case 'activitiesCount':
                        filteredData = filteredData.filter(item => 
                            filterBy.includes(item.activities.length)
                        );
                        break;
                    case 'activities':
                        filteredData = filteredData.filter(item => 
                            item.activities.some(activity => filterBy.includes(activity))
                        );
                        break;
                }
            });

            // Update the filteredExperienceData
            this.filteredExperienceData = filteredData;
        },



        





},

    filters: {
        capitalize(value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
  
  };
  </script>
  
<style scoped>
.pointer-cursor {
    cursor: pointer;
}


:deep(.v-text-field input[type="text"]:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid transparent !important; /* Update this line if you have a different border style */
  background-color: transparent !important;
}

:deep(.v-select input[type="text"]:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid transparent !important;
  background-color: transparent !important;
}


.text-grayed-out {
    color: #aaa; /* Gray color */
}

.active-filter-item {
    background-color: #E0E0E0;
}

.scrollable-list {
    max-height: 300px; /* Adjust the height as needed */
    overflow-y: auto;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* White box in "Filter by Activity Name v-autocomplete" */
.custom-autocomplete :deep(input[type='text']) {
    background-color: transparent !important;
}


</style>