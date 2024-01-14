<template>
<v-container>
    <!-- Title -->
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6">
                {{ viewArchivedExperiences ? "Archived" : "" }} Experiences
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
                                :append-icon="viewArchivedExperiences ? '' : 'mdi-archive'"
                            >
                                {{ viewArchivedExperiences ? 'View Experiences' : 'View Archive' }}
                            </v-btn>
                            <v-btn
                                v-else
                                @click="handleArchiveExperiences"
                                elevation="1"
                                :append-icon="viewArchivedExperiences ? 'mdi-restore' : 'mdi-archive-plus'"
                            >
                                <span class="d-none d-md-flex">
                                    {{ viewArchivedExperiences ? "Restore" : "Archive" }} {{ selectedExperiences.length === 1 ? "Experience" : "Experiences" }}
                                </span>
                                <span class="d-none d-sm-flex d-md-none">
                                    {{ viewArchivedExperiences ? "Restore" : "Archive" }}
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
                    :headers="experienceHeaders"
                    :items="filteredExperienceData"
                    item-key="_id"
                    item-value="_id"
                    v-model="selectedExperiences"
                    hover
                    return-object
                    multi-sort
                    v-model:expanded="expandedExperiences"
                    show-expand
                >
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
                                <td @click.stop>
                                    <v-btn icon variant="text"
                                        @click="toggleRowExpansion(item)"
                                    >
                                        <v-icon>
                                            {{ expandedExperiences.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                        </v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                            <tr v-if="expandedExperiences.includes(item)">
                                <td></td>
                                <td :colspan="experienceHeaders.length">
                                    <div class="activity-label">
                                        <strong>Activities:</strong>
                                    </div>
                                    <div v-if="item.activities && item.activities.length" class="activities-grid">
                                        <div v-for="(half, index) in [firstHalfActivities(item.activities), secondHalfActivities(item.activities)]" :key="index">
                                            <v-list density="compact">
                                                <v-list-item v-for="activity in half" :key="activity._id">
                                                    <span :class="{ 'highlight-red': isActivityNameMatched(activity.activityName) }">
                                                        {{ activity.activityName }}
                                                    </span>
                                                </v-list-item>
                                            </v-list>
                                        </div>
                                    </div>
                                    <div v-else class="font-italic pt-2 pl-2">
                                        None
                                    </div>
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
</template>

<script>
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
name: "ExperiencesManagement",
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
            "Activity Name"
        ],
        viewArchivedExperiences: false,
        experienceHeaders: [
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
            {
                title: "",
                key: "data-table-expand"
            },
        ],
        experienceSearch: "",
        searchCriteria: [],
        selectedSearchChips: [],
        expandedExperiences: [],
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
computed: {
    loading() {
        return useLoggedInUserStore().loading;
    },

    showChipsRow() {
        return this.searchCriteria.length > 0;
    },
},
methods: {
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
        console.log("Edit Experience: ", experience);
        this.$router.push({ name: "instructorSpecificExperience", params: {id: experience._id } });
    },

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

    updateSearchCriteria(item) {
        this.searchLabel = "Search " + item;
    },

    addSearchChip() {
        if (this.experienceSearch) {
            this.searchCriteria.push({
                category: this.searchLabel.replace("Search ", ""),
                term: this.experienceSearch
            });
            // Select the new chip by default
            this.selectedSearchChips.push(this.searchCriteria.length - 1);
            // Clear the input field after adding the chip
            this.experienceSearch = "";
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

        this.filteredExperienceData = this.experienceData.filter(item => {
            // Check if the experience should be included based on experienceStatus
            if (this.viewArchivedExperiences && item.experienceStatus === false) {
                // Continue with other criteria checks for archived items
            } else if (!this.viewArchivedExperiences && item.experienceStatus === true) {
                // Continue with other criteria checks for active items
            } else {
                // Exclude the item if experienceStatus doesn't match
                return false;
            }
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
                } else if (category === "Activity Name") {
                    return searchGroups[category].every(term => {
                        return item.activities.some(activity => {
                            return activity.activityName.toLowerCase().includes(term);
                        });
                    });
                }
                return true;
            });
        });
    },

    toggleArchivedExperiences() {
        console.log('toggleArchivedExperiences')        
        this.viewArchivedExperiences = !this.viewArchivedExperiences;
        this.performFilter();
    },

    async handleArchiveExperiences() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const updateStatus = { experienceStatus: this.viewArchivedExperiences };

            for (const experience of this.selectedExperiences) {
                const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${experience._id}`;
                await axios.put(apiURL, updateStatus, { headers: { token } })
                    .then(() => {
                        toast.success(
                            (this.selectedExperiences.length === 1 ? "Experience " : "Experiences ") +
                            (this.viewArchivedExperiences ? "Restored!" : "Archived!"), {
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

    toggleRowExpansion(item) {
        const index = this.expandedExperiences.indexOf(item);
        if (index > -1) {
            this.expandedExperiences.splice(index, 1); // Remove the item
        } else {
            this.expandedExperiences.push(item); // Add the item
        }
    },

    firstHalfActivities(activities) {
        const midpoint = Math.ceil(activities.length / 2);
        return activities.slice(0, midpoint);
    },

    secondHalfActivities(activities) {
        const midpoint = Math.ceil(activities.length / 2);
        return activities.slice(midpoint);
    },

    isActivityNameMatched(activityName) {
        // Check if any 'Activity Name' criteria are selected
        const selectedActivityNameCriteria = this.searchCriteria
            .filter((criteria, index) => this.selectedSearchChips.includes(index) && criteria.category === "Activity Name")
            .map(criteria => criteria.term.toLowerCase());

        return selectedActivityNameCriteria.some(term => activityName.toLowerCase().includes(term));
    },


    handleAddNewExperience() {
        this.$router.push({ name: "instructorAddExperience" });
    },
}


}
</script>


<style scoped>

.hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
}


.pointer-cursor {
    cursor: pointer;
}

.full-width-height {
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.activities-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Creates two equal columns */
    gap: 10px; /* Adjust the gap between columns as needed */
}

.highlight-red {
    color: #c8102e;
}

.activity-label {
    margin-top: 10px; /* Adjust as per your design */
    /* Additional styling if needed */
}

</style>
