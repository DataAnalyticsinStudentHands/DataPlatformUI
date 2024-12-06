<!-- instructorActivities - this view presents a list of all Activities -->
<template>
<v-container>
    <!-- Title -->
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6">
                {{ viewsStore.isViewingArchived('activities') ? "Archived" : "" }} Activities
            </p>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card flat>
                <!-- Top Management Row -->
                <v-card-title>
                    <v-row class="d-flex justify-start">
                        <!-- Search Field for sm Screens and Up -->
                        <v-col lg="6" md="6" sm="6" class="d-none d-sm-flex justify-start">
                            <!-- Search Field -->
                            <v-text-field
                                v-model="activitySearch"
                                density="comfortable"
                                :label="searchLabel"
                                flat
                                hide-details
                                clearable
                                variant="solo-filled"
                                @keyup.enter="addSearchChip"
                            >
                                <!-- Search Menu Icons -->
                                <template v-slot:prepend-inner>
                                    <v-menu location="bottom">
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
                        <!-- Search Field for xs Screens -->




                        <v-spacer class="d-none d-sm-flex"></v-spacer>
                        <!-- View Archived Activites Button -->
                        <v-col lg="auto" md="4" sm="auto" class="d-none d-sm-flex justify-end align-self-center">
                            <v-btn
                                v-if="!selectedActivities.length"
                                @click="toggleArchivedActivities"
                                elevation="1"
                                :append-icon="viewsStore.isViewingArchived('activities') ? '' : 'mdi-archive'"
                            >
                                {{ viewsStore.isViewingArchived('activities') ? 'View Activities' : 'View Archive' }}
                            </v-btn>
                            <v-btn
                                v-else
                                @click="handleArchiveActivities"
                                elevation="1"
                                :append-icon="viewsStore.isViewingArchived('activities') ? 'mdi-restore' : 'mdi-archive-plus'"
                            >
                            <span class="d-none d-md-flex">
                                {{ viewsStore.isViewingArchived('activities') ? "Restore" : "Archive" }} {{ selectedActivities.length === 1 ? "Activity" : "Activities" }}
                            </span>
                            <span class="d-none d-sm-flex d-md-none">
                                {{ viewsStore.isViewingArchived('activities') ? "Restore" : "Archive" }} 
                            </span>
                            </v-btn>
                        </v-col>
                        <!-- Add New Activity Button -->
                        <v-col lg="auto" md="2" sm="2" class="d-none d-sm-flex justify-end align-self-center">
                            <v-btn
                                @click="handleAddNewActivity"
                                elevation="1"
                                prepend-icon="mdi-plus"
                                color="#c8102e"
                            >
                            <span class="d-none d-lg-flex">Add New Activity</span>
                            <span class="d-none d-sm-flex d-lg-none">New</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!-- Chips Row -->
                    <v-row v-if="showChipsRow" dense>
                        <v-col>
                            <!-- Search Chips -->
                            <v-chip-group
                                v-if="viewsStore.activities.searchChips.length"
                                v-model="viewsStore.activities.selectedSearchChips"
                                column
                                multiple
                            >
                                <v-chip
                                    v-for="(criteria, index) in viewsStore.activities.searchChips"
                                    :key="index"
                                    @click="selectSearchChip(index)"
                                    filter
                                    variant="outlined"
                                    class="ma-2"
                                >
                                    {{ criteria.category + '="' + criteria.term + '"' }}
                                    <v-icon
                                        end
                                        @click.stop="removeSearchChip(index)"
                                    >mdi-close</v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-col>
                    </v-row>
                </v-card-title>
                <!-- Data Table -->
                <v-data-table
                    v-if="!loading"
                    :headers="activityHeaders"
                    :items="filteredActivityData"
                    item-key="_id"
                    item-value="_id"
                    v-model="selectedActivities"
                    hover
                    return-object
                    :sort-by.sync="viewsStore.activities.sortBy"
                    @update:sort-by="handleSortByUpdate"
                >
                    <template v-slot:body="{ items }">
                        <template
                            v-for="item in items"
                            :key="item._id"
                        >
                            <tr
                                @click="editActivity(item)"
                                class="pointer-cursor"
                            >
                                <td @click.stop>
                                    <v-checkbox density="compact" class="d-flex" @update:modelValue="toggleSelection(item)"></v-checkbox>
                                </td>
                                <td>{{ item.activityName }}</td>
                                <td
                                    v-if="experienceNameSearchApplied"
                                    @click.stop
                                >
                                    <v-btn 
                                        icon 
                                        variant="text"
                                        @click="toggleRowExpansion(item)"
                                    >
                                        <v-icon>
                                            {{ expandedActivities.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                        </v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                            <!-- Expanded row for displaying experiences and sessions -->
                            <tr v-if="expandedActivities.includes(item)">
                                <td :colspan="activityHeaders.length" class="pa-0">
                                    <v-container>
                                        <!-- Iterate over activities object -->
                                        <v-row v-for="(experience, experienceID) in prepareExpandedData[item._id]?.experiences || {}" :key="experienceID">
                                            <v-col cols="12">
                                                <strong>{{ experience.name }}</strong>
                                                <ul>
                                                    <li v-for="session in experience.sessions" :key="session.sessionID">
                                                        {{ session.sessionName }}
                                                    </li>
                                                </ul>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </td>
                            </tr>
                        </template>
                    </template>
                </v-data-table>

                <!-- Skeleton Loader -->
                <v-skeleton-loader v-if="loading" type="table-row@5"></v-skeleton-loader>
            </v-card>
        </v-col>
    </v-row>
</v-container>

<!-- Dialog for Filtering by Experience Category -->
<v-dialog
    v-model="dialogExperienceCategory"
    width="500"
    persistent
>
    <v-card>
        <v-card-title>
            Filter By Experience Category
        </v-card-title>
        <v-card-item>
            <v-row>
                <v-col>
                    <v-autocomplete
                        :items="uniqueExperienceCategories"
                        v-model="selectedExperienceCategories"
                        label="Experience Category"
                        clearable
                        chips
                        multiple
                        return-object
                    ></v-autocomplete>
                </v-col>
            </v-row>
        </v-card-item>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelDialogExperienceCategory">Cancel</v-btn>
            <v-btn 
                color="#c8102e"
                :disabled="!selectedExperienceCategories.length"
                @click="submitExperienceCategory"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Dialog for Filtering by Experience Name -->
<v-dialog
    v-model="dialogExperienceName"
    width="1200"
    persistent
>
<v-card>
    <v-card-item>
        <v-card
                flat
                title="Search Activities by Experiences"
            >
                <template v-slot:text>
                <v-text-field
                    v-model="experienceNameSearch"
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    single-line
                    variant="outlined"
                    hide-details
                ></v-text-field>
                <v-card-item v-if="selectedExperienceNames && selectedExperienceNames.length">
                    <v-chip-group
                        column
                        multiple
                    >
                        <v-chip
                            v-for="(experience, index) in selectedExperienceNames"
                            :key="experience._id"
                            @click="removeExperienceName(index)"
                            class="ma-2"
                        >
                            {{ experience.experienceName }}
                            <v-icon
                                end
                                @click.stop="removeExperienceName(index)"
                            >mdi-close</v-icon>
                        </v-chip>
                    </v-chip-group>
                </v-card-item>
                </template>
                <v-data-table
                    :headers="experienceHeaders"
                    :items="experienceData"
                    item-value="_id"
                    items-per-page="-1"
                    class="scrollable-table"
                    hover
                    :search="experienceNameSearch"
                    >
                    <template v-slot:body="{ items }">
                        <template v-for="item in items" :key="item._id">
                            <tr
                                @click="selectExperienceName(item)"
                                @mouseover="hoveredItem = item._id"
                                @mouseleave="hoveredItem = null"
                                class="pointer-cursor"
                            >
                                <td>
                                    <div class="experience-content">
                                        {{ item.experienceCategory }}
                                    </div>
                                </td>
                                <td>
                                    <div class="experience-content">
                                        {{ item.experienceName }}
                                        <v-icon v-if="hoveredItem === item._id">mdi-plus</v-icon>
                                        <v-icon v-else class="invisible-icon">mdi-plus</v-icon>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                    <template v-slot:bottom></template>
                </v-data-table>
        </v-card>
    </v-card-item>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancelExperienceNameSearch">Cancel</v-btn>
        <v-btn 
            color="#c8102e"
            @click="submitExperienceNameSearch"
        >Apply</v-btn>
    </v-card-actions>
</v-card>
</v-dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { useInstructorViewsStore } from "@/stored/instructorViews";
import axios from "axios";

export default {
name: "instructorActivities",
setup() {
    const viewsStore = useInstructorViewsStore();

    return {
        viewsStore
    };
},
data() {
    return {
        activityData: [],
        filteredActivityData: [],
        selectedActivities: [],
        experienceData: [],
        activitySearch: "",
        searchLabel: "Search Activity Name",
        searchMenuItems: [
            "Experience Name"
        ],
        dialogExperienceCategory: false,
        dialogExperienceName: false,
        selectedExperienceCategories: [],
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
        hoveredItem: null,
        experienceBasedActivities: [],
        experienceNameSearchApplied: false,
        uniqueExperienceCategories: []
    }
},
mounted() {
  // Start the loading state when the component is mounted
  useLoggedInUserStore().startLoading();

  // Fetch activity data
  this.fetchActivityData()
    .then(() => {
      // Stop the loading state after data is fetched successfully
      useLoggedInUserStore().stopLoading();
    })
    .catch((error) => {
      // Handle any errors and stop the loading state
      this.handleError(error);
      useLoggedInUserStore().stopLoading();
    });
},

watch: {
  // Watch for changes in the searchChips in the activities view
  'viewsStore.activities.searchChips': {
    handler() {
      // Update the experience name search state
      this.updateExperienceNameSearchApplied();
    },
    deep: true,
    immediate: true
  },
  
  // Watch for changes in the selectedSearchChips in the activities view
  'viewsStore.activities.selectedSearchChips': {
    handler() {
      // Update the experience name search state
      this.updateExperienceNameSearchApplied();
    },
    deep: true,
    immediate: true
  }
},


computed: {

    // Returns the loading state from the logged-in user store
    loading() {
        return useLoggedInUserStore().loading;
    },

    // Determines whether to show the chips row based on if there are any search chips
    showChipsRow() {
        return this.viewsStore.activities.searchChips.length > 0;
    },

    // Returns the headers for the activity table
    activityHeaders() {
        let headers = [
            {
                title: "",
                sortable: false,
                align: "center",
                width: "30px"
            },
            {
                title: "Activity Name",
                value: "activityName",
                align: "start",
                sortable: true,
                key: "activityName"
            }
        ];

        // Conditionally add the expand column if experience name search is applied
        if (this.experienceNameSearchApplied) {
            headers.push({
                title: "", // Empty title for the expand column
                key: "data-table-expand"
            });
        }

        return headers;
    },
    
    // Prepares a structured dataset for expanded rows in the activity table
    prepareExpandedData() {
        const expandedData = {};

        // Loop through each experience-based activity
        this.experienceBasedActivities.forEach(({ activityID, sessionID, sessionName, experienceID, experienceName }) => {

            // If the activity does not already exist in expandedData, initialize it
            if (!expandedData[activityID]) {
                expandedData[activityID] = { experiences: {} };
            }

            // If the experience does not already exist under the activity, initialize it
            if (!expandedData[activityID].experiences[experienceID]) {
                expandedData[activityID].experiences[experienceID] = {
                    name: experienceName,
                    sessions: []
                };
            }

            // Add the session data to the appropriate experience
            expandedData[activityID].experiences[experienceID].sessions.push({
                sessionID,
                sessionName
            });
        });

        // Return the structured data
        return expandedData;
    },

},
methods: {
    
    // Fetches activity data from the backend, updates local state with the fetched data, and then performs any necessary filtering on this data.
    async fetchActivityData() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const userId = user.userId; // Get the user ID from the store
            let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/activities/";
            const response = await axios.get(apiURL, { 
                headers: { token },
                params: { userId } // Send the user ID as a query parameter
            });
            this.activityData = response.data;
            this.filteredActivityData = [...this.activityData];
            this.performFilter();
        } catch (error) {
            this.handleError(error);
        }
    },

    // Navigates to the edit page for a specific activity, storing the activity's ID in Pinia store.
    editActivity(activity) {
        useLoggedInUserStore().navigationData = {
            activityID: activity._id
        };
        this.$router.push({ 
            name: "instructorSpecificActivity"
        });
    },

    // Toggles an activity's selection state: if the activity is already selected, it is removed from the selection; if it is not selected, it is added to the selection.
    toggleSelection(activity) {
        const index = this.selectedActivities.findIndex((selectedActivity) => selectedActivity._id === activity._id);
        if (index >= 0) {
            // Already selected, remove it
            this.selectedActivities.splice(index, 1);
        } else {
            // Not selected, add it
            this.selectedActivities.push(activity);
        }
    },

    // Triggers actions based on the selected search criteria item
    async updateSearchCriteria(item) {
        if (item === "Experience Category") {
            // this.dialogExperienceCategory = true;
        } else if (item === "Experience Name") {
            this.fetchExperienceData();
            this.dialogExperienceName = true;
        }
    },

    // Adds a search chip based on the current search input and category, selects the newly added chip by default, clears the search input field, and then performs a filter operation based on the updated search criteria.
    addSearchChip() {
        if (this.activitySearch) {
            this.viewsStore.addSearchChip('activities', {
                category: this.searchLabel.replace("Search ", ""),
                term: this.activitySearch
            });
            // Select the new chip by default
            this.viewsStore.activities.selectedSearchChips.push(this.viewsStore.activities.searchChips.length - 1);
            // Clear the input field after adding the chip
            this.activitySearch = "";
            // Call search
            this.performFilter();
        }
    },

    // Toggles the selection state of a search chip: if the chip is already selected, it is removed from the selection; if not, it is added. After updating the selection, a filter operation is performed based on the new selection state.
    selectSearchChip(index) {
        const selectedIndex = this.viewsStore.activities.selectedSearchChips.indexOf(index);
        if (selectedIndex >= 0) {
            // If the chip is already selected, creae a new array without this chip
            this.viewsStore.activities.selectedSearchChips = this.viewsStore.activities.selectedSearchChips.filter(i => i !== index);
        } else {
            // If the chip is not selected, create a new array with this chip added
            this.viewsStore.activities.selectedSearchChips = [...this.viewsStore.activities.selectedSearchChips, index];
        }
        // Call search
        this.performFilter();
    },
    
    // Removes a search chip based on its index, updates the list of selected search chips to reflect this removal, adjusts the indexes of the remaining selected chips accordingly, and then performs a filter operation based on the updated search criteria.
    removeSearchChip(index) {
        this.viewsStore.removeSearchChip('activities', index);
        // Update selectedSearchChips to reflect the removal
        this.viewsStore.activities.selectedSearchChips = this.viewsStore.activities.selectedSearchChips.filter(i => i !== index);
        // Adjust the indexes of the remaining selected chips
        this.viewsStore.activities.selectedSearchChips = this.viewsStore.activities.selectedSearchChips.map(i => i > index ? i - 1 : i);
        // Call search
        this.performFilter();
    },

    
    // Groups search terms by their criteria categories, then filters activity data based on these grouped search criteria. If the "Experience Name" search is applied, it filters based on matching experience names. Otherwise, it filters activities based on their status and other criteria like "Activity Name", considering if archived activities should be viewed. It also dynamically updates the search results based on user-selected search chips.
    performFilter() {
        let searchGroups = {};
        this.viewsStore.activities.selectedSearchChips.forEach(index => {
            let criteria = this.viewsStore.activities.searchChips[index];
            if (!searchGroups[criteria.category]) {
                searchGroups[criteria.category] = [];
            }
            searchGroups[criteria.category].push(criteria.term.toLowerCase());
        });

        // Manually update activitySearchApplied based on current selectedSearchChips
        this.updateExperienceNameSearchApplied();

        if (this.experienceNameSearchApplied && this.experienceBasedActivities.length) {
            const experienceNameTerms = this.viewsStore.activities.selectedSearchChips
                .filter(index => this.viewsStore.activities.searchChips[index]?.category === "Experience Name")
                .map(index => this.viewsStore.activities.searchChips[index].term.trim().toLowerCase());
            
            // Filter experiences based on matching activity names
            const filteredExperienceBasedActivities = this.experienceBasedActivities.filter(ea =>
                experienceNameTerms.includes(ea.experienceName.trim().toLowerCase())
            );

            // Use the filtered activities to determine which experiences to show
            const experienceActivityIDs = filteredExperienceBasedActivities.map(ea => ea.activityID);

            this.filteredActivityData = this.activityData.filter(activity =>
            experienceActivityIDs.includes(activity._id)
            );
        } else {
            this.filteredActivityData = this.activityData.filter(activity => {
                // Check if the activity should be included based on activityStatus
                if ((this.viewsStore.isViewingArchived('activities') && !activity.activityStatus) || 
                    (!this.viewsStore.isViewingArchived('activities') && activity.activityStatus)) {
                    // Filtering based on search criteria
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

    // Toggles the visibility of archived activities in the view and re-applies the current search and filter criteria.
    toggleArchivedActivities() {
        const newType = this.viewsStore.isViewingArchived('activities') ? 'active' : 'archived'
        this.viewsStore.switchViewType('activities', newType);
        this.performFilter();
    },

    
    // Archives or restores selected activities based on the current view setting, using the user's token for authorization. Displays a success toast message indicating the completion of the action for either a single activity or multiple activities. Clears the selection and refreshes the activity list afterwards.
    async handleArchiveActivities() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const updateStatus = { activityStatus: this.viewsStore.isViewingArchived('activities') };

            for (const activity of this.selectedActivities) {
                const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${activity._id}`;
                await axios.put(apiURL, updateStatus, { headers: { token } })
                    .then(() => {
                        toast.success(
                            (this.selectedActivities.length === 1 ? "Activity " : "Activities ") +
                            (this.viewsStore.isViewingArchived('activities') ? "Restored!" : "Archived!"), {
                                position: "top-right",
                                toastClassName: "Toastify__toast--create",
                                multiple: false
                        });
                    });
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            this.selectedActivities = [];
            await this.fetchActivityData();
        }
    },

    // Closes the experience category selection dialog and clears any selected experience categories.
    cancelDialogExperienceCategory() {
        this.dialogExperienceCategory = false;
        this.selectedExperienceCategories = [];
    },

    // Adds selected experience categories as search criteria chips, automatically selects these new chips, closes the experience category selection dialog, resets the selected categories, and then performs a search based on the updated criteria.
    submitExperienceCategory() {
        this.selectedExperienceCategories.forEach(category => {
            const chip = {
                category: "Experience Category",
                term: category
            };
            this.viewsStore.addSearchChip('activities', chip);
            // Select the new chip by default
            this.viewsStore.activities.selectedSearchChips.push(this.viewsStore.activities.searchChips.length - 1);
        });

        // Close the dialog and reset selectedExperienceCategories
        this.dialogExperienceCategory = false;
        this.selectedExperienceCategories = [];

        // Call search
        this.performFilter();
    },

    // Toggles the expansion state of an item in the list: if the item is already expanded, it is collapsed by removing it from the list of expanded activities; if it is not expanded, it is added to the list, thus expanding it.
    toggleRowExpansion(item) {
        const index = this.expandedActivities.indexOf(item);
        if (index > -1) {
            // Remove the item
            this.expandedActivities.splice(index, 1);
        } else {
            // Add the item
            this.expandedActivities.push(item);
        }
    },

    // Splits a list of experiences in half and returns the first half. If the list has an odd number of experiences, the midpoint is rounded up, including the middle experience in the first half.
    firstHalfExperiences(experiences) {
        const midpoint = Math.ceil(experiences.length / 2);
        return experiences.slice(0, midpoint);
    },

    // Splits a list of experiences in half and returns the second half, starting from the midpoint. If the list has an odd number of experiences, the midpoint is rounded up, and the second half starts immediately after the middle experience.
    secondHalfExperiences(experiences) {
        const midpoint = Math.ceil(experiences.length / 2);
        return experiences.slice(midpoint);
    },

    // Determines if a given experience name matches any of the selected 'Experience Name' search criteria by comparing the experience name against lowercased search terms. Returns true if there's at least one match, otherwise false.
    isExperienceNameMatched(experienceName) {
        // Check if any 'Experience Name' criteria are selected
        const selectedExperienceNameCriteria = this.viewsStore.activities.searchChips
            .filter((criteria, index) => this.viewsStore.activities.selectedSearchChips.includes(index) && criteria.category === "Experience Name")
            .map(criteria => criteria.term.toLowerCase());

        return selectedExperienceNameCriteria.some(term => experienceName.toLowerCase().includes(term));
    },

    // Checks if a given experience category matches any of the selected 'Experience Category' search criteria by comparing the experience category against lowercased search terms. Returns true if at least one match is found, indicating the experience category meets the selected criteria.
    isExperienceCategoryMatched(experienceCategory) {
        // Check if any 'Experience Category' criteria are selected
        const selectedExperienceCategoryCriteria = this.viewsStore.activities.searchChips
            .filter((criteria, index) => this.viewsStore.activities.selectedSearchChips.includes(index) && criteria.category === "Experience Category")
            .map(criteria => criteria.term.toLowerCase());

        return selectedExperienceCategoryCriteria.some(term => experienceCategory.toLowerCase().includes(term));
    },

    // Navigates to the view for adding a new activity by routing to the specified route name "instructorAddActivity".
    handleAddNewActivity() {
        this.$router.push({ name: "instructorAddActivity" });
    },

    // Fetches experience data from the backend, sorts it by the experienceCategory in ascending order, and updates the local state with the sorted data.
    async fetchExperienceData() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;

            const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
            const response = await axios.get(apiURL, { headers: { token }});
            this.experienceData = response.data.sort((a, b) => {
                return a.experienceCategory.localeCompare(b.experienceCategory);
            })
        } catch (error) {
            this.handleError(error);
        }
    },

    // Removes a selected experience by its index from the list of selected experience names, adds the removed experience back into the pool of available experiences, and then sorts the updated experience data by experienceCategory.
    removeExperienceName(index) {
        const [removedExperience] = this.selectedExperienceNames.splice(index, 1);
        
        // Add the removed activity back into activityData
        this.experienceData.push(removedExperience);
        this.experienceData.sort((a, b) => a.experienceCategory.localeCompare(b.experienceCategory));
    },

    // Adds a selected experience to the list of selected experience names and removes it from the available experience data to prevent duplication.
    selectExperienceName(selectedExperienceName) {
        this.selectedExperienceNames.push(selectedExperienceName);
        // Remove the selected activity from the activityData list
        this.experienceData = this.experienceData.filter(experience => experience._id !== selectedExperienceName._id);
    },

    // Resets the selected experience names and search input, then closes the experience name search dialog.
    cancelExperienceNameSearch() {
        this.selectedExperienceNames = [];
        this.experienceNameSearch = "";
        this.dialogExperienceName = false;
    },

    // Adds selected experience names as search criteria, fetches activities associated with the selected experiences, clears the selected experience names and search input, and closes the dialog. Performs filtering based on the updated search criteria.
    async submitExperienceNameSearch() {
        // Transform selectedActivities into the desired format for searchCriteria
        const newSearchCriteria = this.selectedExperienceNames.map(experience => ({
            category: "Experience Name",
            term: experience.experienceName
        }));

        // Append the new search criteria to the existing searchChips array in Pinia
        newSearchCriteria.forEach(criteria => {
            this.viewsStore.addSearchChip('activities', criteria);
        });

        // Update selectedSearchChips to include the indices of the newly added chips
        const startIndexForNewChips = this.viewsStore.activities.searchChips.length - newSearchCriteria.length;
        const newSelectedSearchChips = newSearchCriteria.map((_, index) => startIndexForNewChips + index);
        this.viewsStore.setSelectedSearchChips('activities', [
            ...this.viewsStore.activities.selectedSearchChips,
            ...newSelectedSearchChips
        ]);

        await this.fetchActivitiesByExperience();

        // Optionally, if you want to clear selectedActivities after adding them as chips
        this.selectedExperienceNames = [];
        this.experienceNameSearch = "";
        this.dialogExperienceName = false;

        this.performFilter();
    },

    // Fetches activities associated with the selected experiences by sending a request to the server with the experience IDs. Upon receiving the response, updates the list of experience-based activities accordingly.
    async fetchActivitiesByExperience() {
        // Extract experience IDs from selectedExperiences
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

    // Updates the experienceNameSearchApplied flag based on whether there is at least one selected "Experience Name" chip in the search criteria.
    updateExperienceNameSearchApplied() {
        // Check if there's at least one selected "Experience Name" chip
        const hasSelectedExperienceNameChip = this.viewsStore.activities.selectedSearchChips.some(chipIndex => {
            const criteria = this.viewsStore.activities.searchChips[chipIndex];
            return criteria && criteria.category === "Experience Name";
        });

        // Update activitySearchApplied based on the condition
        this.experienceNameSearchApplied = hasSelectedExperienceNameChip;
    },

    // Updates the sorting method for activities when the sort order changes
    handleSortByUpdate(newSortBy) {
        this.viewsStore.updateSorting('activities', newSortBy);
    },

}

}
</script>

<style scoped>
.pointer-cursor {
    cursor: pointer;
}

.experiences-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Creates two equal columns */
}

.experience-label {
    margin-top: 10px; 
}

.highlight-red {
    color: #c8102e;
}

.experience-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.invisible-icon {
    color: transparent;
}
</style>