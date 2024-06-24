<!-- instructorExperiences - this view presents a list of all Experiences -->
<template>
<v-container>
    <!-- Title -->
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6">
                {{ viewsStore.isViewingArchived('experiences') ? "Archived" : "" }} Experiences
            </p>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card flat>
                <!-- Top Management Row -->
                <v-card-title>
                    <v-row class="d-flex justify-start">
                        <v-col lg="6" md="6" sm="6" class="d-none d-sm-flex justify-start">
                            <!-- Search Field -->
                            <v-text-field
                                v-model="experienceSearch"
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
                        <v-spacer class="d-none d-sm-flex"></v-spacer>
                        <!-- View Archived Experiences Button -->
                        <v-col lg="auto" md="4" sm="auto" class="d-none d-sm-flex justify-end align-self-center">
                            <v-btn
                                v-if="!selectedExperiences.length"
                                @click="toggleArchivedExperiences"
                                elevation="1"
                                :append-icon="viewsStore.isViewingArchived('experiences') ? '' : 'mdi-archive'"
                            >
                                {{ viewsStore.isViewingArchived('experiences') ? 'View Experiences' : 'View Archive' }}
                            </v-btn>
                            <v-btn
                                v-else
                                @click="handleArchiveExperiences"
                                elevation="1"
                                :append-icon="viewsStore.isViewingArchived('experiences') ? 'mdi-restore' : 'mdi-archive-plus'"
                            >
                                <span class="d-none d-md-flex">
                                    {{ viewsStore.isViewingArchived('experiences') ? "Restore" : "Archive" }} {{ selectedExperiences.length === 1 ? "Experience" : "Experiences" }}
                                </span>
                                <span class="d-none d-sm-flex d-md-none">
                                    {{ viewsStore.isViewingArchived('experiences') ? "Restore" : "Archive" }}
                                </span>
                            </v-btn>
                        </v-col>
                        <!-- Add New Experience Button -->
                        <v-col lg="auto" md="2" class="d-none d-sm-flex justify-end align-self-center">
                            <v-btn
                                @click="handleAddNewExperience"
                                elevation="1"
                                prepend-icon="mdi-plus"
                                color="#c8102e"
                            >
                                <span class="d-none d-lg-flex">Add New Experience</span>
                                <span class="d-none d-sm-flex d-lg-none">New</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!-- Chips Row -->
                    <v-row v-if="showChipsRow" dense>
                        <v-col>
                            <!-- Search Chips -->
                            <v-chip-group
                                v-if="viewsStore.experiences.searchChips.length"
                                v-model="viewsStore.experiences.selectedSearchChips"
                                column
                                multiple
                            >
                                <v-chip
                                    v-for="(criteria, index) in viewsStore.experiences.searchChips"
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
                    :headers="experienceHeaders"
                    :items="filteredExperienceData"
                    item-key="_id"
                    item-value="_id"
                    v-model="selectedExperiences"
                    hover
                    return-object
                    multi-sort
                    :sort-by.sync="viewsStore.experiences.sortBy"
                    @update:sort-by="handleSortByUpdate"
                >
                    <!-- Part of the above data table -->
                    <!-- v-model:expanded="expandedExperiences"
                    show-expand -->
                    <template v-slot:body="{ items }">
                        <template 
                            v-for="item in items"
                            :key="item._id"
                        >
                            <tr
                                @click="editExperience(item)"
                                class="pointer-cursor"
                            >
                                <td @click.stop>
                                    <v-checkbox density="compact" class="d-flex" @update:modelValue="toggleSelection(item)"></v-checkbox>
                                </td>
                                <td>{{ item.experienceCategory }}</td>
                                <td>{{ item.experienceName }}</td>
                                <td 
                                    v-if="activitySearchApplied" 
                                    @click.stop
                                >
                                    <v-btn icon variant="text"
                                        @click="toggleRowExpansion(item)"
                                    >
                                        <v-icon>
                                            {{ expandedExperiences.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                        </v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                            <!-- Expanded row for displaying activities and sessions -->
                            <tr v-if="expandedExperiences.includes(item)">
                                <td :colspan="experienceHeaders.length" class="pa-0">
                                    <v-container>
                                        <!-- Iterate over activities object -->
                                        <v-row v-for="(activity, activityID) in prepareExpandedData[item._id]?.activities || {}" :key="activityID">
                                            <v-col cols="12">
                                                <strong>{{ activity.name }}</strong>
                                                <ul>
                                                    <li v-for="session in activity.sessions" :key="session.sessionID">
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


<v-dialog
    v-model="dialogActivitySearch"
    width="1200"
    persistent
>
<v-card>
    <v-card-item>
        <v-card
                flat
                title="Add Activities"
            >
                <template v-slot:text>
                <v-text-field
                    v-model="activitySearch"
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    single-line
                    variant="outlined"
                    hide-details
                ></v-text-field>
                <v-card-item v-if="selectedActivities && selectedActivities.length">
                    <v-chip-group
                        column
                        multiple
                    >
                        <v-chip
                            v-for="(activity, index) in selectedActivities"
                            :key="activity._id"
                            @click="removeActivity(index)"
                            class="ma-2"
                        >
                            {{ activity.activityName }}
                            <v-icon
                                end
                                @click.stop="removeActivity(index)"
                            >mdi-close</v-icon>
                        </v-chip>
                    </v-chip-group>
                </v-card-item>
                </template>
                <v-data-table
                :headers="activityHeaders"
                :items="activityData"
                item-value="_id"
                items-per-page="-1"
                class="scrollable-table"
                hover
                :search="activitySearch"
                >
                <template v-slot:body="{ items }">
                    <template v-for="item in items" :key="item._id">
                        <tr
                            @click="selectActivity(item)"
                            @mouseover="hoveredItem = item._id"
                            @mouseleave="hoveredItem = null"
                            class="pointer-cursor activity-row"
                        >
                            <td>
                                <div class="activity-content">
                                    {{ item.activityName }}
                                    <v-icon v-if="hoveredItem === item._id">mdi-plus</v-icon>
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
        <v-btn text @click="cancelActivitySearch">Cancel</v-btn>
        <v-btn 
            color="#c8102e"
            @click="submitActivitySearch"
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
name: "ExperiencesManagement",
setup() {
    const viewsStore = useInstructorViewsStore();

    return {
        viewsStore
    };
},
data() {
    return {
        experienceData: [],
        filteredExperienceData: [],
        selectedExperiences: [],
        searchLabel: "Search All Fields",
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
    }
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
},
watch: {
    // Watch the searchCriteria and selectedSearchChips for changes
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
    experienceHeaders() {
        let headers = [
            {
                title: "",
                sortable: false,
                align: "center",
                width: "30px",
            },
            {
                title: "Experience Category",
                value: "experienceCategory",
                align: "start",
                sortable: true,
                key: "experienceCategory"
            },
            {
                title: "Experience Name",
                value: "experienceName",
                align: "start",
                sortable: true,
                key: "experienceName"
            },
        ];

        // Conditionally add the expand column
        if (this.activitySearchApplied) {
            headers.push({
                title: "", // Adjust the title as needed
                key: "data-table-expand"
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
    // Fetches experience data from the backend API and updates the local experienceData array. Also creates a copy of the fetched data in filteredExperienceData and triggers a filtering process.
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

    // Navigates to the route for editing a specific experience based on the provided experience ID.
    editExperience(experience) {
        this.$router.push({ name: "instructorSpecificExperience", params: {id: experience._id } });
    },

    // Toggles the selection state of an experience. If the experience is already selected, it removes it from the list of selected experiences; otherwise, it adds it.
    toggleSelection(experience) {
        const index = this.selectedExperiences.findIndex((selectedExperience) => selectedExperience._id === experience._id);
        if (index >= 0) {
            // Already selected, remove it
            this.selectedExperiences.splice(index, 1);
        } else {
            // Not selected, add it
            this.selectedExperiences.push(experience);
        }
    },

    // Updates the search criteria based on the selected item. If the item is "Activity", it fetches activity data and opens the activity search dialog. Otherwise, it updates the search label with the selected item.
    async updateSearchCriteria(item) {
        if (item === "Activity") {
            await this.fetchActivityData();
            this.dialogActivitySearch = true;
        } else {
            this.searchLabel = "Search " + item;
        }
    },

    // Adds a search chip based on the entered experience search term. If there is a valid search term, it adds the chip to the search criteria and selects it by default. Then, it clears the input field and performs filtering based on the updated search criteria.
    addSearchChip() {
        if (this.experienceSearch) {
            this.viewsStore.addSearchChip('experiences', {
                category: this.searchLabel.replace("Search ", ""),
                term: this.experienceSearch
            });
            // Select the new chip by default
            this.viewsStore.experiences.selectedSearchChips.push(this.viewsStore.experiences.searchChips.length - 1);
            // Clear the input field after adding the chip
            this.experienceSearch = "";
            // Call search
            this.performFilter();
        }
    },

    // Selects or deselects a search chip based on the provided index. If the chip is already selected, it deselects it by removing it from the array of selected search chips. If it's not selected, it adds the chip to the array. Then, it calls the performFilter function to update the filtering based on the selected chips.
    selectSearchChip(index) {
        const selectedIndex = this.viewsStore.experiences.selectedSearchChips.indexOf(index);
        if (selectedIndex >= 0) {
            // If the chip is already selected, creae a new array without this chip
            this.viewsStore.experiences.selectedSearchChips = this.viewsStore.experiences.selectedSearchChips.filter(i => i !== index);
        } else {
            // If the chip is not selected, create a new array with this chip added
            this.viewsStore.experiences.selectedSearchChips = [...this.viewsStore.experiences.selectedSearchChips, index]
        }
        // Call search
        this.performFilter();
    },

    // Removes a search chip at the specified index from the search criteria array. It then updates the array of selected search chips to reflect the removal and adjusts the indexes of the remaining selected chips if needed. Finally, it calls the performFilter function to update the filtering based on the modified search criteria.
    removeSearchChip(index) {
        this.viewsStore.removeSearchChip('experiences', index);
        // Update selectedSearchChips to reflect the removal
        this.viewsStore.experiences.selectedSearchChips = this.viewsStore.experiences.selectedSearchChips.filter(i => i !== index);
        // Adjust the indexes of the remaining selected chips
        this.viewsStore.experiences.selectedSearchChips = this.viewsStore.experiences.selectedSearchChips.map(i => i > index ? i - 1 : i);
        // Call search
        this.performFilter();
    },

    // Performs filtering based on the selected search criteria. It constructs search groups from the selected search chips and criteria. Then, it updates the activity search applied flag and filters experiences accordingly. If activity search is applied and activity-based experiences exist, it filters experiences based on matching activity names. Otherwise, it applies default filtering logic considering archived experiences and matches against experience categories and names. Finally, it updates the filtered experience data.
    performFilter() {
        let searchGroups = {};
        this.viewsStore.experiences.selectedSearchChips.forEach(index => {
            let criteria = this.viewsStore.experiences.searchChips[index];
            if (!searchGroups[criteria.category]) {
                searchGroups[criteria.category] = [];
            }
            searchGroups[criteria.category].push(criteria.term.toLowerCase());
        });

        // Manually update activitySearchApplied based on current selectedSearchChips
        this.updateActivitySearchApplied();

        if (this.activitySearchApplied && this.activityBasedExperiences.length) {
            // Extract "Activity" terms from searchCriteria based on selectedSearchChips
            const activityTerms = this.viewsStore.experiences.selectedSearchChips
                .filter(index => this.viewsStore.experiences.searchChips[index]?.category === "Activity")
                .map(index => this.viewsStore.experiences.searchChips[index].term.trim().toLowerCase());

            // Filter experiences based on matching activity names
            const filteredActivityBasedExperiences = this.activityBasedExperiences.filter(ae =>
                activityTerms.includes(ae.activityName.trim().toLowerCase())
            );

            // Use the filtered activities to determine which experiences to show
            const activityExperienceIDs = filteredActivityBasedExperiences.map(ae => ae.experienceID);

            this.filteredExperienceData = this.experienceData.filter(experience =>
                activityExperienceIDs.includes(experience._id)
            );
        } else {
            // Default filtering logic if activity search is not applied
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

    // Toggles the view of archived experiences. After toggling, it triggers the filtering process to update the displayed experiences based on the new view setting.
    toggleArchivedExperiences() {       
        const newType = this.viewsStore.isViewingArchived('experiences') ? 'active' : 'archived'
        this.viewsStore.switchViewType('experiences', newType);
        this.performFilter();
    },

    // Handles the archiving or restoration of selected experiences. It updates the status of each experience accordingly via a PUT request. Upon completion, it displays a toast message indicating the success of the operation.
    async handleArchiveExperiences() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const updateStatus = { experienceStatus: this.viewsStore.isViewingArchived('experiences') };

            for (const experience of this.selectedExperiences) {
                const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experience._id}`;
                await axios.put(apiURL, updateStatus, { headers: { token } })
                    .then(() => {
                        toast.success(
                            (this.selectedExperiences.length === 1 ? "Experience " : "Experiences ") +
                            (this.viewsStore.isViewingArchived('experiences') ? "Restored!" : "Archived!"), {
                                position: "top-right",
                                toastClassName: "Toastify__toast--create",
                                multiple: false
                        });
                    });
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            this.selectedExperiences = [];
            await this.fetchExperienceData();
        }
    },

    // Toggles the expansion state of a row/item in the UI. If the item is already expanded, it removes it from the list of expanded items. Otherwise, it adds the item to the list.
    toggleRowExpansion(item) {
        const index = this.expandedExperiences.indexOf(item);
        if (index > -1) {
            this.expandedExperiences.splice(index, 1); // Remove the item
        } else {
            this.expandedExperiences.push(item); // Add the item
        }
    },

    // Fetches activity data from the server asynchronously. It sends a GET request to the appropriate API endpoint to retrieve the activities. Upon receiving the response, it sorts the activities alphabetically by their names. Any errors encountered during this process are handled appropriately.
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

    // Handles the navigation to the page for adding a new experience. It redirects the user to the route associated with adding a new experience in the instructor interface.
    handleAddNewExperience() {
        this.$router.push({ name: "instructorAddExperience" });
    },

    // Cancels the activity search operation by clearing the selected activities, resetting the activity search input field, and closing the activity search dialog.
    cancelActivitySearch() {
        this.selectedActivities = [];
        this.activitySearch = "";
        this.dialogActivitySearch = false;
    },

    // Submits the activity search operation by transforming the selected activities into search criteria. It fetches experiences associated with the selected activities, clears the selected activities and search input, and closes the activity search dialog. Finally, it triggers the filtering process based on the updated search criteria.
    async submitActivitySearch() {
        // Transform selectedActivities into the desired format for searchCriteria
        const newSearchCriteria = this.selectedActivities.map(activity => ({
            category: "Activity",
            term: activity.activityName
        }));

        // Calculate the starting index for new chips
        const startIndexForNewChips = this.viewsStore.experiences.searchChips.length;

        // Append the new search criteria to the existing searchCriteria array
        this.viewsStore.experiences.searchChips = [...this.viewsStore.experiences.searchChips, ...newSearchCriteria];

        // Update selectedSearchChips to include the indices of the newly added chips
        this.viewsStore.setSelectedSearchChips('activities, ', [
            ...this.viewsStore.experiences.selectedSearchChips,
            ...newSearchCriteria.map((_, index) => startIndexForNewChips + index)
        ]);

        
        await this.fetchExperiencesByActivity();

        // Optionally, if you want to clear selectedActivities after adding them as chips
        this.selectedActivities = [];

        this.activitySearch = "";

        // Close the dialog
        this.dialogActivitySearch = false;

        this.performFilter();
    },

    // Selects an activity from the search results and adds it to the list of selected activities. Additionally, it removes the selected activity from the activity data list to prevent duplication in the selection.
    selectActivity(selectedActivity) {
        this.selectedActivities.push(selectedActivity);
        // Remove the selected activity from the activityData list
        this.activityData = this.activityData.filter(activity => activity._id !== selectedActivity._id);
    },

    // Removes the selected activity at the specified index from the list of selected activities. Additionally, it adds the removed activity back into the activity data list to make it available for selection again.
    removeActivity(index) {
        const [removedActivity] = this.selectedActivities.splice(index, 1);
        
        // Add the removed activity back into activityData
        this.activityData.push(removedActivity);
        this.activityData.sort((a, b) => a.activityName.localeCompare(b.activityName));
    },

    // Fetches experiences associated with the selected activities by sending a POST request to the backend API. The selected activity IDs are extracted and sent in the request body. Upon receiving the response, the fetched experiences are stored in the `activityBasedExperiences` array.
    async fetchExperiencesByActivity() {

        // Extract activity IDs from selectedActivities
        const activityIDs = this.selectedActivities.map(activity => activity._id);

        try {
            const user = useLoggedInUserStore();
            let token = user.token;
            let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/by-activity`;

            // Use axios.post and pass activityIDs in the body
            const response = await axios.post(apiURL, {
                activityIDs: activityIDs
            }, {
                headers: { token }
            });

            this.activityBasedExperiences = response.data;
        } catch (error) {
            this.handleError(error);
        }
    },

    // Updates the `activitySearchApplied` flag based on whether there is at least one selected "Activity" chip in the `selectedSearchChips`. If such a chip exists, the flag is set to `true`; otherwise, it is set to `false`.
    updateActivitySearchApplied() {
        // Check if there's at least one selected "Activity" chip
        const hasSelectedActivityChip = this.viewsStore.experiences.selectedSearchChips.some(chipIndex => {
            const criteria = this.viewsStore.experiences.searchChips[chipIndex];
            return criteria && criteria.category === "Activity";
        });

        // Update activitySearchApplied based on the condition
        this.activitySearchApplied = hasSelectedActivityChip;
    },

    handleSortByUpdate(newSortBy) {
        this.viewsStore.updateSorting('experiences', newSortBy);
    },
}


}
</script>


<style scoped>


.pointer-cursor {
    cursor: pointer;
}

.full-width-height {
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.highlight-red {
    color: #c8102e;
}

.scrollable-table {
height: 300px; /* Adjust the height as needed */
overflow-y: auto;
}

/* Optional: Style to improve the appearance when scrolling */
.scrollable-table::-webkit-scrollbar {
width: 10px;
}

.scrollable-table::-webkit-scrollbar-track {
background: #f1f1f1;
}

.scrollable-table::-webkit-scrollbar-thumb {
background: #888;
}

.scrollable-table::-webkit-scrollbar-thumb:hover {
background: #555;
}

.activity-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}


</style>
