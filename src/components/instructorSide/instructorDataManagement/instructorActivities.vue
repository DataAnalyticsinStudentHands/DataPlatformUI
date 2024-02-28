<template>
<v-container>
    <!-- Title -->
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6">
                {{ viewArchivedActivities ? "Archived" : "" }} Activities
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
                                :append-icon="viewArchivedActivities ? '' : 'mdi-archive'"
                            >
                                {{ viewArchivedActivities ? 'View Activities' : 'View Archive' }}
                            </v-btn>
                            <v-btn
                                v-else
                                @click="handleArchiveActivities"
                                elevation="1"
                                :append-icon="viewArchivedActivities ? 'mdi-restore' : 'mdi-archive-plus'"
                            >
                            <span class="d-none d-md-flex">
                                {{ viewArchivedActivities ? "Restore" : "Archive" }} {{ selectedActivities.length === 1 ? "Activity" : "Activities" }}
                            </span>
                            <span class="d-none d-sm-flex d-md-none">
                                {{ viewArchivedActivities ? "Restore" : "Archive" }} 
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
                                v-if="searchCriteria.length"
                                v-model="selectedSearchChips"
                                column
                                multiple
                            >
                                <v-chip
                                    v-for="(criteria, index) in searchCriteria"
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
import axios from "axios";

export default {
name: "ActivitiesManagement",
data() {
    return {
        activityData: [],
        filteredActivityData: [],
        selectedActivities: [],
        experienceData: [],
        viewArchivedActivities: false,
        activitySearch: "",
        searchLabel: "Search Activity Name",
        searchMenuItems: [
            "Experience Category",
            "Experience Name"
        ],
        searchCriteria: [],
        selectedSearchChips: [],
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
    }
},
mounted() {
    useLoggedInUserStore().startLoading();
    this.fetchActivityData()
        .then(() => {
            useLoggedInUserStore().stopLoading();
        })
        .catch((error) => {
            this.handleError(error);
            useLoggedInUserStore.stopLoading();
        });
},
watch: {
    // Watch the searchCriteria and selectedSearchChips for changes
    searchCriteria: {
        handler() {
            this.updateExperienceNameSearchApplied();
        },
        deep: true,
        immediate: true
    },
    selectedSearchChips: {
        handler() {
            this.updateExperienceNameSearchApplied();
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
        return this.searchCriteria.length > 0;
    },

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

        // Conditionally add the expand column
        if (this.experienceNameSearchApplied) {
            headers.push({
                title: "", // Adjust the title as needed
                key: "data-table-expand"
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
        console.log('expandedData: ', expandedData);
        return expandedData;
    },

},
methods: {
    async fetchActivityData() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/activities/";
            const response = await axios.get(apiURL, { headers: { token } });
            this.activityData = response.data;
            this.filteredActivityData = [...this.activityData];
            this.performFilter();
        } catch (error) {
            this.handleError(error);
        }
    },

    editActivity(activity) {
        this.$router.push({ name: "instructorSpecificActivity", params: {id: activity._id } });
    },

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

    async updateSearchCriteria(item) {
        console.log('updateSearchCriteria: ', item);
        if (item === "Experience Category") {
            // this.dialogExperienceCategory = true;
        } else if (item === "Experience Name") {
            this.fetchExperienceData();
            this.dialogExperienceName = true;
        }
    },

    addSearchChip() {
        if (this.activitySearch) {
            this.searchCriteria.push({
                category: this.searchLabel.replace("Search ", ""),
                term: this.activitySearch
            });
            // Select the new chip by default
            this.selectedSearchChips.push(this.searchCriteria.length - 1);
            // Clear the input field after adding the chip
            this.activitySearch = "";
            // Call search
            this.performFilter();
        }
    },

    selectSearchChip(index) {
        const selectedIndex = this.selectedSearchChips.indexOf(index);
        if (selectedIndex >= 0) {
            // If the chip is already selected, creae a new array without this chip
            this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        } else {
            // If the chip is not selected, create a new array with this chip added
            this.selectedSearchChips = [...this.selectedSearchChips, index]
        }
        // Call search
        this.performFilter();
    },

    removeSearchChip(index) {
        this.searchCriteria.splice(index, 1);
        // Update selectedSearchChips to reflect the removal
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        // Adjust the indexes of the remaining selected chips
        this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
        // Call search
        this.performFilter();
    },

    performFilter() {
        let searchGroups = {};
        this.selectedSearchChips.forEach(index => {
            let criteria = this.searchCriteria[index];
            if (!searchGroups[criteria.category]) {
                searchGroups[criteria.category] = [];
            }
            searchGroups[criteria.category].push(criteria.term.toLowerCase());
        });


        console.log('searchCriteria: ', this.searchCriteria);
        console.log('selectedSearchChips: ', this.selectedSearchChips);

        // Manually update activitySearchApplied based on current selectedSearchChips
        this.updateExperienceNameSearchApplied();

        if (this.experienceNameSearchApplied && this.experienceBasedActivities.length) {
            const experienceNameTerms = this.selectedSearchChips
                .filter(index => this.searchCriteria[index]?.category === "Experience Name")
                .map(index => this.searchCriteria[index].term.trim().toLowerCase());
            
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
                if ((this.viewArchivedActivities && !activity.activityStatus) || 
                    (!this.viewArchivedActivities && activity.activityStatus)) {
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


    toggleArchivedActivities() {
        this.viewArchivedActivities = !this.viewArchivedActivities;
        this.performFilter();
    },

    async handleArchiveActivities() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const updateStatus = { activityStatus: this.viewArchivedActivities };

            for (const activity of this.selectedActivities) {
                const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${activity._id}`;
                await axios.put(apiURL, updateStatus, { headers: { token } })
                    .then(() => {
                        toast.success(
                            (this.selectedActivities.length === 1 ? "Activity " : "Activities ") +
                            (this.viewArchivedActivities ? "Restored!" : "Archived!"), {
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

    cancelDialogExperienceCategory() {
        this.dialogExperienceCategory = false;
        this.selectedExperienceCategories = [];
    },

    submitExperienceCategory() {
        this.selectedExperienceCategories.forEach(category => {
            const chip = {
                category: "Experience Category",
                term: category
            };
            this.searchCriteria.push(chip);
            // Select the new chip by default
            this.selectedSearchChips.push(this.searchCriteria.length - 1);
        });

        // Close the dialog and reset selectedExperienceCategories
        this.dialogExperienceCategory = false;
        this.selectedExperienceCategories = [];

        // Call search
        this.performFilter();
    },

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

    firstHalfExperiences(experiences) {
        const midpoint = Math.ceil(experiences.length / 2);
        return experiences.slice(0, midpoint);
    },

    secondHalfExperiences(experiences) {
        const midpoint = Math.ceil(experiences.length / 2);
        return experiences.slice(midpoint);
    },

    isExperienceNameMatched(experienceName) {
        // Check if any 'Experience Name' criteria are selected
        const selectedExperienceNameCriteria = this.searchCriteria
            .filter((criteria, index) => this.selectedSearchChips.includes(index) && criteria.category === "Experience Name")
            .map(criteria => criteria.term.toLowerCase());

        return selectedExperienceNameCriteria.some(term => experienceName.toLowerCase().includes(term));
    },

    isExperienceCategoryMatched(experienceCategory) {
        // Check if any 'Experience Category' criteria are selected
        const selectedExperienceCategoryCriteria = this.searchCriteria
            .filter((criteria, index) => this.selectedSearchChips.includes(index) && criteria.category === "Experience Category")
            .map(criteria => criteria.term.toLowerCase());

        return selectedExperienceCategoryCriteria.some(term => experienceCategory.toLowerCase().includes(term));
    },

    handleAddNewActivity() {
        this.$router.push({ name: "instructorAddActivity" });
    },

    async fetchExperienceData() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;

            const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
            const response = await axios.get(apiURL, { headers: { token }});
            this.experienceData = response.data.sort((a, b) => {
                return a.experienceCategory.localeCompare(b.experienceCategory);
            })
            console.log('this.experienceData: ', this.experienceData);
        } catch (error) {
            this.handleError(error);
        }
    },

    removeExperienceName(index) {
        const [removedExperience] = this.selectedExperienceNames.splice(index, 1);
        
        // Add the removed activity back into activityData
        this.experienceData.push(removedExperience);
        this.experienceData.sort((a, b) => a.experienceCategory.localeCompare(b.experienceCategory));
    },

    selectExperienceName(selectedExperienceName) {
        this.selectedExperienceNames.push(selectedExperienceName);
        // Remove the selected activity from the activityData list
        this.experienceData = this.experienceData.filter(experience => experience._id !== selectedExperienceName._id);
    },


    cancelExperienceNameSearch() {
        this.selectedExperienceNames = [];
        this.experienceNameSearch = "";
        this.dialogExperienceName = false;
    },

    async submitExperienceNameSearch() {
        // Transform selectedActivities into the desired format for searchCriteria
        const newSearchCriteria = this.selectedExperienceNames.map(experience => ({
            category: "Experience Name",
            term: experience.experienceName
        }));

        // Calculate the starting index for new chips
        const startIndexForNewChips = this.searchCriteria.length;

        // Append the new search criteria to the existing searchCriteria array
        this.searchCriteria = [...this.searchCriteria, ...newSearchCriteria];

        // Update selectedSearchChips to include the indices of the newly added chips
        this.selectedSearchChips = [
            ...this.selectedSearchChips,
            ...newSearchCriteria.map((_, index) => startIndexForNewChips + index)
        ];

        
        await this.fetchActivitiesByExperience();

        // Optionally, if you want to clear selectedActivities after adding them as chips
        this.selectedExperienceNames = [];

        this.experienceNameSearch = "";

        // Close the dialog
        this.dialogExperienceName = false;

        this.performFilter();
    },

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

    updateExperienceNameSearchApplied() {
        // Check if there's at least one selected "Experience Name" chip
        const hasSelectedExperienceNameChip = this.selectedSearchChips.some(chipIndex => {
            const criteria = this.searchCriteria[chipIndex];
            return criteria && criteria.category === "Experience Name";
        });

        // Update activitySearchApplied based on the condition
        this.experienceNameSearchApplied = hasSelectedExperienceNameChip;
    }
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