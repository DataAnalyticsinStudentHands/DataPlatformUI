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

                                <!-- Sort Menu from Data View -->
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
                                            <!-- Chips for selected sort criteria -->
                                                <v-chip 
                                                    v-for="(criteria, index) in sortCriteria" 
                                                    :key="index" 
                                                    class="ma-2"
                                                    color="blue lighten-4"
                                                >
                                                    {{ criteria.name }}
                                                    <v-icon small class="ml-2">{{ criteria.icon }}</v-icon>
                                                    {{ criteria.order }}
                                                </v-chip>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="isSortDialogVisible = false">Close</v-btn>
                                            <v-btn color="green" text @click="applySort">Sort</v-btn>
                                        </v-card-actions>
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
                                        Sort {{ chip.name }} <v-icon small class="ml-2">{{ chip.icon }}</v-icon> {{ chip.order }}
                                        <v-icon end @click.stop="removeSortChip(index)">mdi-close</v-icon>
                                    </v-chip>
                                </v-chip-group>





                            </v-col>
                        </v-row>


                    </v-card-title>


                    <v-data-table
                        :headers="experienceHeaders"
                        :items="filteredExperienceData"
                        item-key="_id"
                        item-value="_id"
                        show-select
                        v-model="selectedExperiences"
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

    <br><br><br>

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
      };
    },
  
    mounted() {
      useLoggedInUserStore().startLoading();
      this.fetchExperienceData()
      .then(() => {
        useLoggedInUserStore().stopLoading();
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
        sortableColumns: {
            deep: true,
            handler() {
                this.updateSortCriteriaChips();
            }
        }
    },

    computed: {
      loading() {
        const store = useLoggedInUserStore()
        return store.loading;
      },

    showChipsRow() {
        return this.searchCriteria.length > 0 || this.sortChips.length > 0;
    },









    },
    methods: {
      async fetchExperienceData() {
        try {
            const user = useLoggedInUserStore();
            //   let token = user.token;

            let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwMzkwNzExMCwiZXhwIjoxNzAzOTE5MTEwfQ.QYj_OL2RsHsEkUrp5HlmPPpGg2_-T7B5MTWpqbKQSJc'

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
        } else {
            console.log('action menu: ', item.title);
        }
    },

    updateSortCriteriaChips() {
        this.sortCriteria = this.sortableColumns
            .filter(column => column.selected)
            .map(column => ({
                name: column.name,
                order: column.selectedSortOrder,
                icon: this.sortOrderOptions.find(option => option.label === column.selectedSortOrder)?.icon
            }));
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

      applySort() {
            this.sortChips = this.sortableColumns
                .filter(column => column.selected)
                .map(column => ({
                    name: column.name,
                    order: column.selectedSortOrder,
                    icon: this.sortOrderOptions.find(option => option.label === column.selectedSortOrder)?.icon
                }));

            // Initialize selectedSortChips to have all indices (i.e., all chips are active)
            this.selectedSortChips = this.sortChips.map((_, index) => index);

            this.isSortDialogVisible = false;
        },


        selectSortChip(index) {
            if (this.selectedSortChips.includes(index)) {
                // Remove the index if it's already selected
                this.selectedSortChips = this.selectedSortChips.filter(i => i !== index);
            } else {
                // Add the index if it's not selected
                this.selectedSortChips = [...this.selectedSortChips, index];
            }
        },



    removeSortChip(index) {
        this.sortChips.splice(index, 1);
        // Perform any additional actions required after removing a sort chip
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

.text-grayed-out {
    color: #aaa; /* Gray color */
}

  </style>
  