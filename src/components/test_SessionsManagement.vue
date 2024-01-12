<template>
<v-container>
    <!-- Sessions Title -->
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6">
                Sessions
            </p>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card flat>
                <!-- Top Management Row -->
                <v-card-title>
                    <v-row class="d-flex justify-start">
                        <v-col cols="6">
                            <!-- Search Fields -->
                            <v-text-field
                                v-model="sessionSearch"
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
                        <!-- View Archived Sessions Button -->
                        <v-col class="d-flex justify-end align-self-center">
                            <v-btn 
                                v-if="!selectedSessions.length"
                                @click="console.log('View Archived Sessions')"
                                elevation="1"
                                append-icon="mdi-archive"
                            >
                                View Archive
                            </v-btn>
                            <v-btn 
                                v-else
                                @click="console.log('Archive Sessions')"
                                elevation="1"
                                append-icon="mdi-archive"
                            >
                                Archive {{ selectedSessions.length === 1 ? "Session" : "Sessions" }}
                            </v-btn>
                        </v-col>
                        <!-- Add New Session Button -->
                        <v-col class="d-flex justify-end align-self-center">
                            <v-btn 
                                @click="console.log('Add New Session')"
                                elevation="1"
                                prepend-icon="mdi-plus"
                                color="#c8102e"
                            >
                                Add New Session
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!-- Search Chips Row -->
                    <v-row v-if="showChipsRow">
                        <v-col>
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
                                    <!-- Differentiate between 'Session Name' and 'Start Date' -->
                                    <template v-if="criteria.category === 'Session Name'">
                                        {{ criteria.category + `="` + criteria.term + `"` }}
                                    </template>
                                    <template v-else>
                                        {{ criteria.category + ' ' + criteria.term }}
                                    </template>
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
                    :headers="sessionHeaders"
                    :items="filteredSessionData"
                    item-key="_id"
                    v-model="selectedSessions"
                    hover
                    return-object
                    items-per-page="5"
                    :items-per-page-options="dataTableItemsPerPageOptions"
                    :loading="loading"
                >
                    <template v-slot:body="{ items }">
                        <tr 
                            v-for="item in items" 
                            :key="item._id" 
                            @click="editSession(item)" 
                            class="pointer-cursor"
                        >
                            <td @click.stop>
                                <v-checkbox density="compact" class="d-flex" @update:modelValue="toggleSelection(item)"></v-checkbox>
                            </td>
                            <td>{{ item.sessionName }}</td>
                            <td>{{ formatDate(item.sessionPeriod.startDate) }}</td>
                            <td>{{ formatDate(item.sessionPeriod.endDate) }}</td>
                        </tr>
                    </template>
                </v-data-table>

                <v-skeleton-loader v-if="loading" type="table-row@5"></v-skeleton-loader>



            </v-card>
        </v-col>
    </v-row>
</v-container>

<!-- Date Picker for Start Date -->
<v-dialog
    v-model="dialogStartDate"
    width="auto"
    persistent
>
    <v-card>
        <v-card-title>
            <v-row>
                <v-col>
                    <v-select
                        v-model="startDateFilterType"
                        :items="['On', 'Before', 'After', 'Between']"
                        label="Filter Type"
                        outlined
                        density="comfortable"
                        hide-details
                    ></v-select>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-item>
            <v-row>
                <v-col cols="6">
                    <v-date-picker
                        v-model="selectedStartDate"
                        elevation="24"
                        :title="sessionStartDateTitle"
                        show-adjacent-months
                        color="red-darken-2"
                        text="Hello"
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
                </v-col>
            </v-row>
        </v-card-item>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelSelectStartDate">Cancel</v-btn>
            <v-btn 
                color="primary"
                :disabled="!canApplyStartDates"
                @click="submitStartDate"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Date Picker for End Date -->
<v-dialog
    v-model="dialogEndDate"
    width="auto"
    persistent
>
    <v-card>
        <v-card-title>
            <v-row>
                <v-col>
                    <v-select
                        v-model="endDateFilterType"
                        :items="['On', 'Before', 'After', 'Between']"
                        label="Filter Type"
                        outlined
                        density="comfortable"
                        hide-details
                    ></v-select>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-item>
            <v-row>
                <v-col cols="6">
                    <v-date-picker
                        v-model="selectedEndDate"
                        elevation="24"
                        :title="sessionEndDateTitle"
                        show-adjacent-months
                        color="red-darken-2"
                        text="Hello"
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
                </v-col>
            </v-row>
        </v-card-item>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelSelectEndDate">Cancel</v-btn>
            <v-btn 
                color="primary"
                :disabled="!canApplyEndDates"
                @click="submitEndDate"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- <br>
dialogEndDate: {{ dialogEndDate }}
<br>

selectedStartDate: {{ selectedStartDate }}
<br><br><br>
sessionData:
<br>
{{ sessionData }}
<br><br><br>
selectedSessions:
<br>
{{ selectedSessions }}
<br><br><br>
filteredSessionData:
<br>
{{ filteredSessionData }}
<br><br><br>
searchCriteria:
<br>
{{ searchCriteria }} -->
</template>
  
<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { DateTime } from "luxon";

export default {
components: {
},
data() {
    return {
        sessionSearch: "",
        searchLabel: "Search Session Name",
        searchMenuItems: [
            "Start Date",
            "End Date"
        ],
        sessionHeaders: [
            {
                title: "",
                sortable: false,
                align: "center",
                width: "30px"
            },
            {
                title: "Session Name",
                value: "sessionName",
                align: "start",
                sortable: true
            },
            {
                title: "Start Date",
                value: "sessionPeriod.startDate",
                align: "start",
                sortable: true
            },
            {
                title: "End Date",
                value: "sessionPeriod.endDate",
                align: "start",
                sortable: true
            }
        ],
        selectedSessions: [],
        dataTableItemsPerPageOptions: [
            {value: 5, title: "5"},
            {value: 10, title: "10"},
            {value: 15, title: "15"},
            {value: 20, title: "20"},
            {value: -1, title: "$vuetify.dataFooter.itemsPerPageAll"},
        ],
        searchCriteria: [],
        selectedSearchChips: [],
        filteredSessionData: [],
        dialogStartDate: false,
        selectedStartDate: new Date(),
        startDateFilterType: "On",
        beginningDateRange: null,
        endDateRange: null,
        dialogEndDate: false,
        selectedEndDate: new Date(),
        endDateFilterType: "On",



    sessionData: [],
    searchTerm: "",
    hoverId: null,
    };
},
mounted() {
    useLoggedInUserStore().startLoading();
    this.fetchSessionData()
    .then(() => {
        useLoggedInUserStore().stopLoading();
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
        return this.searchCriteria.length > 0;
    },
    loading() {
        return useLoggedInUserStore().loading;
        // return true;
    },
    sessionStartDateTitle() {
        switch (this.startDateFilterType) {
            case "On":
                return "Start Date On";
            case "After":
                return "Start Date After";
            case "Before":
                return "Start Date Before";
            case "Between":
                return "Start Date Between";
            default:
                return "Start Date On";
        }
    },
    sessionEndDateTitle() {
        switch (this.endDateFilterType) {
            case "On":
                return "End Date On";
            case "After":
                return "End Date After";
            case "Before":
                return "End Date Before";
            case "Between":
                return "End Date Between";
            default:
                return "End Date On";
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
            // Allow submission only if both beginning and end date ranes are selected
            return this.beginningDateRange && this.endDateRange;
        }
        // In other cases, allow submission
        return true;
    },
    canApplyEndDates() {
        if (this.endDateFilterType === "Between") {
            // Allow submission only if both beginning and end date ranes are selected
            return this.beginningDateRange && this.endDateRange;
        }
        // In other cases, allow submission
        return true;
    },

},
methods: {
    async fetchSessionData() {
        try {
            const user = useLoggedInUserStore();
            // let token = user.token;

            const token = `
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNTAyNzg4NiwiZXhwIjoxNzA1MDM5ODg2fQ.AxV6M0imjxbY9qdQh-UASQXeiy71bw0ESDjAG3zex2M
            `
            let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/`;
            const resp = await axios.get(apiURL, { headers: { token } });
            this.sessionData = resp.data;
            this.filteredSessionData = [...this.sessionData];
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    editSession(session) {
        console.log("Edit Session: ", session);
    },

    formatDate(datetimeDB) {
        const formattedDate = DateTime.fromISO(datetimeDB).toFormat('MM-dd-yyyy');
        return formattedDate;
    },

    isSelected(item) {
        return this.selectedSessions.some((selectedItem) => selectedItem._id === item._id);
    },

    toggleSelection(item) {
        const index = this.selectedSessions.findIndex((selectedItem) => selectedItem._id === item._id);
        if (index >= 0) {
            // Already selected, remove it
            this.selectedSessions.splice(index, 1);
        } else {
            // Not selected, add it
            this.selectedSessions.push(item);
        }
    },

    updateSearchCriteria(item) {
        if (item === "Start Date") {
            this.dialogStartDate = true;
        } else if (item === "End Date") {
            this.dialogEndDate = true;
        }
    },

    addSearchChip() {
        if (this.sessionSearch) {
            this.searchCriteria.push({
                category: this.searchLabel.replace("Search ", ""),
                term: this.sessionSearch
            });
            // Select the new chip by default
            this.selectedSearchChips.push(this.searchCriteria.length - 1);
            // Clear the input field after adding the chip
            this.experienceSearch = "";
            // Call search
            this.performSearch();
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
            searchGroups[criteria.category].push(criteria.term);
        });

        this.filteredSessionData = this.sessionData.filter(item => {
            return Object.keys(searchGroups).every(category => {
                console.log('category: ', category);
                if (category === "Session Name") {
                    return searchGroups[category].every(term =>
                        item.sessionName.toLowerCase().includes(term.toLowerCase())
                    );
                } else if (category === "Start Date") {
                    return searchGroups[category].every(term => {
                        let sessionDate = new Date(item.sessionPeriod.startDate);
                        if (term.startsWith('<')) {
                            const comparisonDate = new Date(term.slice(2).trim());
                            return sessionDate < comparisonDate;
                        } else if (term.startsWith('>')) {
                            const comparisonDate = new Date(term.slice(2).trim());
                            return sessionDate > comparisonDate;
                        } else if (term.startsWith('=')) {
                            let sessionDate = this.formatDateMethod(new Date(item.sessionPeriod.startDate));
                            const comparisonDate = this.formatDateMethod(new Date(term.slice(2).trim()));
                            return sessionDate === comparisonDate;
                        } else if (term.startsWith('between')) {
                            let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                            let startDate = DateTime.fromFormat(startDateStr, 'MM-dd-yyyy');
                            let endDate = DateTime.fromFormat(endDateStr, 'MM-dd-yyyy');
                            return sessionDate >= startDate && sessionDate <= endDate;
                        }
                        return true;
                    });
                } else if (category === "End Date") {
                    console.log('category is End Date');
                    return searchGroups[category].every(term => {
                        let sessionDate = new Date(item.sessionPeriod.endDate);
                        console.log('sessionDate: ', sessionDate);
                        if (term.startsWith('<')) {
                            const comparisonDate = new Date(term.slice(2).trim());
                            return sessionDate < comparisonDate;
                        } else if (term.startsWith('>')) {
                            const comparisonDate = new Date(term.slice(2).trim());
                            return sessionDate > comparisonDate;
                        } else if (term.startsWith('=')) {
                            console.log('term.startsWith(=)')
                            let sessionDate = this.formatDateMethod(new Date(item.sessionPeriod.endDate));
                            console.log('sessionDate: ', sessionDate);
                            const comparisonDate = this.formatDateMethod(new Date(term.slice(2).trim()));
                            console.log('comparisonDate: ', comparisonDate);
                            return sessionDate === comparisonDate;
                        } else if (term.startsWith('between')) {
                            let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                            let startDate = DateTime.fromFormat(startDateStr, 'MM-dd-yyyy');
                            let endDate = DateTime.fromFormat(endDateStr, 'MM-dd-yyyy');
                            return sessionDate >= startDate && sessionDate <= endDate;
                        }
                        return true;
                    });
                }
                return true;
            })
        });
    },

    handleStartDateSelection(date) {
        if (this.startDateFilterType === 'Between') {
            if (!this.beginningDateRange || this.endDateRange) {
                // If beginningDateRange is not set or endDateRange is already set,
                // set the new date as the beginningDateRange and reset endDateRange
                this.beginningDateRange = date;
                this.endDateRange = null;
            } else {
                // Set the new date as the endDateRange
                this.endDateRange = date;
            }
        } else {
            this.selectedStartDate = date;
        }
    },

    handleEndDateSelection(date) {
        if (this.endDateFilterType === 'Between') {
            if (!this.beginningDateRange || this.endDateRange) {
                // If beginningDateRange is not set or endDateRange is already set,
                // set the new date as the beginningDateRange and reset endDateRange
                this.beginningDateRange = date;
                this.endDateRange = null;
            } else {
                // Set the new date as the endDateRange
                this.endDateRange = date;
            }
        } else {
            this.selectedEndDate = date;
        }
    },

    submitStartDate() {
        console.log("submitStartDate");

        // Handle different date filter types
        if (this.startDateFilterType === 'On' && this.selectedStartDate) {
            this.createStartDateChip('=', this.selectedStartDate);
        } else if (this.startDateFilterType === 'Before' && this.selectedStartDate) {
            this.createStartDateChip('<', this.selectedStartDate);
        } else if (this.startDateFilterType === 'After' && this.selectedStartDate) {
            this.createStartDateChip('>', this.selectedStartDate);
        } else if (this.startDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
            // Format the dates
            const formattedBeginningDate = this.formatDateMethod(this.beginningDateRange);
            const formattedEndDate = this.formatDateMethod(this.endDateRange);
            // Create a chip for the date range
            this.createStartDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
        }

        this.dialogStartDate = false;
        this.selectedStartDate = new Date();
        this.startDateFilterType = "On";
    },

    submitEndDate() {
        console.log("submitEndDate");

        // Handle different date filter types
        if (this.endDateFilterType === 'On' && this.selectedEndDate) {
            this.createEndDateChip('=', this.selectedEndDate);
        } else if (this.endDateFilterType === 'Before' && this.selectedEndDate) {
            this.createEndDateChip('<', this.selectedEndDate);
        } else if (this.endDateFilterType === 'After' && this.selectedEndDate) {
            this.createEndDateChip('>', this.selectedEndDate);
        } else if (this.endDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
            // Format the dates
            const formattedBeginningDate = this.formatDateMethod(this.beginningDateRange);
            const formattedEndDate = this.formatDateMethod(this.endDateRange);
            // Create a chip for the date range
            this.createEndDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
        }

        this.dialogEndDate = false;
        this.selectedEndDate = new Date();
        this.endDateFilterType = "On";
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

    createStartDateChip(operator, date) {
        let term = '';
        if (operator === '=') {
            term = `= ${this.formatDateMethod(date)}`;  // Equals operator
        } else if (operator === '<') {
            term = `< ${this.formatDateMethod(date)}`;  // Less than operator
        } else if (operator === '>') {
            term = `> ${this.formatDateMethod(date)}`;  // More than operator
        } else if (operator === 'between') {
            term = `between ${date}`;  // Between operator
        }

        // Create the chip
        const startDateChip = {
            category: 'Start Date',
            term: term
        };

        // Add the chip to the search criteria
        this.searchCriteria.push(startDateChip);
        // Select the new chip by default
        this.selectedSearchChips.push(this.searchCriteria.length - 1);
        
        // Call search
        this.performSearch();
    },

    createEndDateChip(operator, date) {
        let term = '';
        if (operator === '=') {
            term = `= ${this.formatDateMethod(date)}`;  // Equals operator
        } else if (operator === '<') {
            term = `< ${this.formatDateMethod(date)}`;  // Less than operator
        } else if (operator === '>') {
            term = `> ${this.formatDateMethod(date)}`;  // More than operator
        } else if (operator === 'between') {
            term = `between ${date}`;  // Between operator
        }

        // Create the chip
        const endDateChip = {
            category: 'End Date',
            term: term
        };

        // Add the chip to the search criteria
        this.searchCriteria.push(endDateChip);
        // Select the new chip by default
        this.selectedSearchChips.push(this.searchCriteria.length - 1);
        
        // Call search
        this.performSearch();
    },

    formatDateMethod(date) {
        return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
    },
},
};
</script>


<style>

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

</style>
