<!-- instructorSessions - this view presents a list of all Sessions -->
<template>
<v-container>
    <!-- Sessions Title -->
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6">
                {{ viewArchivedSessions ? "Archived" : "" }} Sessions
            </p>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card flat>
                <!-- Top Management Row -->
                <v-card-title>
                    <v-row>
                        <!-- Search Fields for sm Screens and Up -->
                        <v-col lg="6" md="6" sm="6" class="d-none d-sm-flex justify-start">
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
                                <!-- Search Menu Icons for sm Screens and Up -->
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
                        <!-- Search Fields for xs Screens -->
                        <v-col class="d-none d-flex d-sm-none justify-start">
                            <v-btn 
                                icon 
                                variant="text"
                                @click="xsdialogSearch = true"
                            >
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-col>
                        <v-spacer class="d-none d-sm-flex"></v-spacer>
                        <!-- View Archived Sessions Button for sm Screens and Up-->
                        <v-col lg="auto" md="4" sm="auto" class="d-none d-sm-flex justify-end align-self-center">
                            <v-btn 
                                v-if="!selectedSessions.length"
                                @click="toggleArchivedSessions"
                                elevation="1"
                                :append-icon="viewArchivedSessions ? '' : 'mdi-archive'"
                            >
                                {{ viewArchivedSessions ? 'View Sessions' : 'View Archive' }}
                            </v-btn>
                            <v-btn 
                                v-else
                                @click="handleArchiveSessions"
                                elevation="1"
                                :append-icon="viewArchivedSessions ? 'mdi-restore' : 'mdi-archive-plus'"
                            >
                                <span class="d-none d-md-flex">
                                    {{ viewArchivedSessions ? "Restore" : "Archive" }} {{ selectedSessions.length === 1 ? "Session" : "Sessions" }}
                                </span>
                                <span class="d-none d-sm-flex d-md-none">
                                    {{ viewArchivedSessions ? "Restore" : "Archive" }}
                                </span>
                            </v-btn>
                        </v-col>
                        <!-- View Archived Sessions Button for xs Screens -->
                        <v-col class="d-none d-flex d-sm-none justify-end">
                            <v-btn
                                icon
                                variant="text"
                                @click="selectedSessions.length ? handleArchiveSessions() : toggleArchivedSessions()"
                            >
                                <v-icon>
                                    {{ selectedSessions.length ? (viewArchivedSessions ? 'mdi-restore' : 'mdi-archive-plus') : 'mdi-archive' }}
                                </v-icon>
                            </v-btn>
                        </v-col>
                        <!-- Add New Session Button for sm Screens and Up -->
                        <v-col lg="auto" md="2" sm="2" class="d-none d-sm-flex justify-end align-self-center">
                            <v-btn 
                                @click="handleAddNewSession"
                                elevation="1"
                                prepend-icon="mdi-plus"
                                color="#c8102e"
                            >
                                <span class="d-none d-lg-flex">Add New Session</span>
                                <span class="d-none d-sm-flex d-lg-none">New</span>
                            </v-btn>
                        </v-col>
                        <!-- Add New Session Button for xs Screens -->
                        <v-col sm="2" class="d-none d-flex d-sm-none justify-end align-self-center">
                            <v-btn elevation="2" color="#c8102e" @click="handleAddNewSession">
                                <v-icon>mdi-plus</v-icon>
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
                                    <template v-if="criteria.category === 'Session Name' || criteria.category === 'Experience Name' || criteria.category === 'Experience Category'">
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
                    return-object
                    items-per-page="5"
                    :items-per-page-options="dataTableItemsPerPageOptions"
                    :loading="loading"
                    v-model:expanded="expandedSessions"
                    show-expand
                >
                    <template v-slot:body="{ items }">
                        <template
                            v-for="(sessionItem, sessionIndex) in items"
                            :key="sessionItem._id"
                        >
                            <tr
                                @click="editSession(sessionItem)"
                                class="pointer-cursor custom-hover"
                            >
                                <td @click.stop>
                                    <v-checkbox density="compact" class="d-flex" @update:modelValue="toggleSelection(sessionItem)"></v-checkbox>
                                </td>
                                <td>{{ sessionItem.sessionName }}</td>
                                <td>{{ formatDate(sessionItem.sessionPeriod.startDate) }}</td>
                                <td>{{ formatDate(sessionItem.sessionPeriod.endDate) }}</td>
                                <td @click.stop>
                                    <v-btn 
                                        icon 
                                        variant="text"
                                        @click="toggleRowExpansion(sessionItem)"
                                    >
                                        <v-icon>
                                            {{ expandedSessions.includes(sessionItem) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                        </v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                            <tr v-if="expandedSessions.includes(sessionItem)">
                                <td class="pa-0"></td>
                                <td :colspan="sessionHeaders.length" class="pa-0">
                                    <v-data-table
                                        :headers="instanceHeaders"
                                        :items="filteredInstances[sessionItem._id] || sessionItem.instances"
                                        item-value="experience.id"
                                        hover
                                        return-object
                                        multi-sort
                                        items-per-page="-1"
                                    >
                                        <template v-slot:item="{ item }">
                                            <tr class="pointer-cursor font-italic" @click="editInstance(item)">
                                                <td>{{ item.experience.category }}</td>
                                                <td>{{ item.experience.name }}</td>
                                                <td>{{ formatDate(item.exitFormReleaseDate) }}</td>
                                                <td>{{ getActivityCount(item.activities) }}</td>
                                            </tr>
                                        </template>
                                        <template v-slot:bottom>
                                            <v-col class="d-flex justify-end mb-4">
                                                <v-btn
                                                    @click="handleAddExperience(sessionItem._id)"
                                                    elevation="1"
                                                    prepend-icon="mdi-plus"
                                                >Add Experience</v-btn>
                                            </v-col>
                                        </template>
                                    </v-data-table>
                                </td>
                            </tr>
                        </template>
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
                color="#c8102e"
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
                color="#c8102e"
                :disabled="!canApplyEndDates"
                @click="submitEndDate"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Date Picker for Exit Form Release Date -->
<v-dialog
    v-model="dialogExitFormReleaseDate"
    width="auto"
    persistent
>
    <v-card>
        <v-card-title>
            <v-row>
                <v-col>
                    <v-select
                        v-model="exitFormReleaseDateFilterType"
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
                        v-model="selectedExitFormReleaseDate"
                        elevation="24"
                        :title="instanceExitFormReleaseDateTitle"
                        show-adjacent-months
                        color="red-darken-2"
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
                </v-col>
            </v-row>
        </v-card-item>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelSelectExitFormReleaseDate">Cancel</v-btn>
            <v-btn
                color="#c8102e"
                :disabled="!canApplyExitFormReleaseDates"
                @click="submitExitFormReleaseDate"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Dialog for Search Fields for xs Screens -->
<v-dialog
    v-model="xsdialogSearch"
    width="100%"
    persistent
>
    <v-card>
        <v-card-title>
            <v-row>
                <v-col>
                    Select a Filter:
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="xsSearchFilterSelection"
                        :items="['Session Name', 'Start Date', 'End Date']"
                    ></v-select>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-item v-if="xsSearchFilterSelection === 'Session Name'">
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="sessionSearch"
                        density="comfortable"
                        :label="searchLabel"
                        flat
                        hide-details
                        clearable
                        variant="solo-filled"
                    >
                    </v-text-field>
                </v-col>
            </v-row>
        </v-card-item>
        <v-card-item v-if="xsSearchFilterSelection === 'Start Date'">
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
            <v-row>
                <v-col>
                    <v-text-field
                        v-if="startDateFilterType !== 'Between'"
                        type="date"
                        v-model="selectedStartDate"
                    ></v-text-field>
                    <v-text-field
                        v-if="startDateFilterType === 'Between'"
                        type="date"
                        v-model="beginningDateRange"
                    ></v-text-field>
                    <v-text-field
                        v-if="startDateFilterType === 'Between'"
                        type="date"
                        v-model="endDateRange"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-item>
        <v-card-item v-if="xsSearchFilterSelection === 'End Date'">
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
            <v-row>
                <v-col>
                    <v-text-field
                        v-if="endDateFilterType !== 'Between'"
                        type="date"
                        v-model="selectedEndDate"
                    ></v-text-field>
                    <v-text-field
                        v-if="endDateFilterType === 'Between'"
                        type="date"
                        v-model="beginningDateRange"
                    ></v-text-field>
                    <v-text-field
                        v-if="endDateFilterType === 'Between'"
                        type="date"
                        v-model="endDateRange"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-item>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="xsCancelSearchDialog">Cancel</v-btn>
            <v-btn 
                v-if="xsSearchFilterSelection === 'Start Date'"
                color="#c8102e"
                :disabled="!canApplyStartDates"
                @click="xsApplySearchFilters"
            >Apply</v-btn>
            <v-btn 
                v-else
                color="#c8102e"
                :disabled="!canApplyEndDates"
                @click="xsApplySearchFilters"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
<!-- <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
filteredInstances:
<br>
{{ filteredInstances }}
<br><br><br>
filteredSessionData:
<br>
{{ filteredSessionData }}
<br><br><br>
sessionData:
<br>
{{ sessionData }}
<br><br><br>
instancesData:
<br>
{{ instancesData }} -->

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
                width: "30px"
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
                title: "Experiences",
                key: "data-table-expand"
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
        viewArchivedSessions: false,
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
    instanceExitFormReleaseDateTitle() {
        switch (this.exitFormReleaseDateFilterType) {
            case "On":
                return "Release Date On";
            case "After":
                return "Release Date After";
            case "Before":
                return "Release Date Before";
            case "Between":
                return "Release Date Between";
            default:
                return "Release Date On";
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
                // Allow submission only if both beginning and end date ranes are selected
                return this.beginningDateRange && this.endDateRange;
            }
            // In other cases, allow submission
            return true;
    },


},
methods: {

    // Fetches session data from the server and assigns it to the `sessionData` variable. For each session, it filters the instances data to find instances associated with that session and assigns them to a new property called `instances`. Finally, it copies the `sessionData` to `filteredSessionData`.
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
            // this.performFilter();
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    // Fetches instances data from the server. It starts loading state, retrieves the data using an HTTP GET request with the user's token in the header, and stores the response in `instancesData`. After the request completes, regardless of success or failure, it stops the loading state.
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
            useLoggedInUserStore().stopLoading()
        }
    },

    // Navigates to the page for editing a specific session based on the provided session ID.
    editSession(session) {
        this.$router.push({ name: "instructorSpecificSession", params: {id: session._id } });
    },

    // Formats a given ISO datetime from the database into the 'MM-dd-yyyy' format without converting timezones.
    formatDate(datetimeDB) {
        const formattedDate = DateTime.fromISO(datetimeDB, { zone: 'utc' }).toFormat('MM-dd-yyyy');
        return formattedDate;
    },

    // Checks if the provided item is selected among the sessions based on their IDs. If the item is found in the `selectedSessions` array, it returns `true`; otherwise, it returns `false`.
    isSelected(item) {
        return this.selectedSessions.some((selectedItem) => selectedItem._id === item._id);
    },

    // Toggles the selection of the provided session. If the session is already selected, it removes it from the `selectedSessions` array. If it's not selected, it adds it to the array.
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

    // Updates the search criteria based on the selected item, triggering the appropriate dialog visibility or setting the search label accordingly.
    updateSearchCriteria(item) {
        if (item === "Session Start Date") {
            this.dialogStartDate = true;
        } else if (item === "Session End Date") {
            this.dialogEndDate = true;
        } else if (item === "Exit Form Release Date") {
            this.dialogExitFormReleaseDate = true;
        } else {
            this.searchLabel = "Search " + item;
        }
    },

    // Adds a new search chip based on the session search input. If there is input in the session search field, it creates a new chip with the category derived from the search label and the term from the session search input. Then it selects the new chip by default, clears the session search input field, and triggers the search functionality.
    addSearchChip() {
        if (this.sessionSearch) {
            this.searchCriteria.push({
                category: this.searchLabel.replace("Search ", ""),
                term: this.sessionSearch
            });
            // Select the new chip by default
            this.selectedSearchChips.push(this.searchCriteria.length - 1);
            // Clear the input field after adding the chip
            this.sessionSearch = "";
            // Call search
            this.performFilter();
        }
    },

    // Toggles the selection of a search chip. If the chip is already selected, it removes it; otherwise, it adds it. After updating the selected chips, it triggers the search functionality.
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
        this.performFilter();
    },

    // Removes a search chip at the specified index from the search criteria. It also updates the selected search chips array to reflect the removal and adjusts the indexes of the remaining selected chips. Finally, it triggers the search functionality.
    removeSearchChip(index) {
        this.searchCriteria.splice(index, 1);
        // Update selectedSearchChips to reflect the removal
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        // Adjust the indexes of the remaining selected chips
        this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
        // Call search
        this.performFilter();
    },

    // Filters the session data based on the selected search criteria. It constructs search groups for each category of criteria and iterates through the session data to check if each session matches the filter conditions. It also handles filtering by session status, session name, session start and end dates, experience name, experience category, and exit form release date. Finally, it updates the filtered session data.
    performFilter() {
        let searchGroups = {};
        this.selectedSearchChips.forEach(index => {
            let criteria = this.searchCriteria[index];
            if (!searchGroups[criteria.category]) {
                searchGroups[criteria.category] = [];
            }
            searchGroups[criteria.category].push(criteria.term);
        });

        // Reset filtered instances
        this.filteredInstances = {};

        this.filteredSessionData = this.sessionData.filter(item => {
            // Create a deep copy of each session item
            let sessionItem = JSON.parse(JSON.stringify(item));
            // Check if item should be included based on sessionStatus
            if (this.viewArchivedSessions && item.sessionStatus === false) {
                // Continue with other criteria checks for archived items
            } else if (!this.viewArchivedSessions && item.sessionStatus === true) {
                // Continue with other criteria checks for active items
            } else {
                // Exclude the item if sessionStatus doesn't match
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
                            let sessionDate = this.formatDateMethod(new Date(sessionItem.sessionPeriod.startDate));
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
                            let sessionDate = this.formatDateMethod(new Date(sessionItem.sessionPeriod.endDate));
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
                } else if (category === "Experience Name") {
                    let experiencesMatch = searchGroups[category].every(term => {
                        return sessionItem.instances.some(instance => {
                            return instance.experience.name.toLowerCase().includes(term.toLowerCase());
                        });
                    })

                    // If experiences match, filter instances within the session and update filteredInstances
                    if (experiencesMatch) {
                        let filteredInstancesForSession = sessionItem.instances.filter(instance => {
                            return searchGroups[category].some(term => {
                                return instance.experience.name.toLowerCase().includes(term.toLowerCase());
                            });
                        });
                        // Update filteredInstances for the current session
                        this.filteredInstances[sessionItem._id] = filteredInstancesForSession;
                    }

                    return experiencesMatch;
                } else if (category === "Experience Category") {
                    let experiencesMatch = searchGroups[category].every(term => {
                        return sessionItem.instances.some(instance => {
                            return instance.experience.category.toLowerCase().includes(term.toLowerCase());
                        });
                    })

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
                        this.filteredInstances[sessionItem._id] = filteredInstancesForSession;
                    }
                    return experiencesMatch;
                }

                return true;
            })

            return matchesFilter ? sessionItem : null;
        }).filter(item => item !== null); // Filter out null values
    },

    // Handles the selection of the start date filter. If the filter type is 'Between', it sets the beginning date range if it's not already set, or sets the end date range if the beginning date range is already set. If the filter type is not 'Between', it sets the selected start date.
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

    // Handles the selection of the end date filter. If the filter type is 'Between', it sets the beginning date range if it's not already set, or sets the end date range if the beginning date range is already set. If the filter type is not 'Between', it sets the selected end date.
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

    // Handles the selection of the exit form release date filter. If the filter type is 'Between', it sets the beginning date range if it's not already set, or sets the end date range if the beginning date range is already set. If the filter type is not 'Between', it sets the selected exit form release date.
    handleExitFormReleaseDateSelection(date) {
        if (this.exitFormReleaseDateFilterType === 'Between') {
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
            this.selectedExitFormReleaseDate = date;
        }
    },

    // Handles the submission of the start date filter. It creates a chip based on the selected filter type and date(s). If the filter type is 'Between', it creates a chip for the date range. Finally, it resets the dialog state and selected start date, and sets the filter type back to 'On'.
    submitStartDate() {
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

    // Handles the submission of the end date filter. It creates a chip based on the selected filter type and date(s). If the filter type is 'Between', it creates a chip for the date range. Finally, it resets the dialog state and selected end date, and sets the filter type back to 'On'.
    submitEndDate() {
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

    // Handles the submission of the exit form release date filter. It creates a chip based on the selected filter type and date(s). If the filter type is 'Between', it creates a chip for the date range. Finally, it resets the dialog state and selected exit form release date, and sets the filter type back to 'On'.
    submitExitFormReleaseDate() {
        // Handle different date filter types
        if (this.exitFormReleaseDateFilterType === 'On' && this.selectedExitFormReleaseDate) {
            this.createExitFormReleaseDateChip('=', this.selectedExitFormReleaseDate);
        } else if (this.exitFormReleaseDateFilterType === 'Before' && this.selectedExitFormReleaseDate) {
            this.createExitFormReleaseDateChip('<', this.selectedExitFormReleaseDate);
        } else if (this.exitFormReleaseDateFilterType === 'After' && this.selectedExitFormReleaseDate) {
            this.createExitFormReleaseDateChip('>', this.selectedExitFormReleaseDate);
        } else if (this.exitFormReleaseDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
            // Format the dates
            const formattedBeginningDate = this.formatDateForDatePicker(this.beginningDateRange);
            const formattedEndDate = this.formatDateForDatePicker(this.endDateRange);
            // Create a chip for the date range
            this.createExitFormReleaseDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
        }

        this.dialogExitFormReleaseDate = false;
        this.selectedExitFormReleaseDate = new Date();
        this.exitFormReleaseDateFilterType = "On";
    },

    // Cancels the selection of the start date filter. It closes the dialog, resets the filter type to "On", and sets the selected start date to the current date.
    cancelSelectStartDate() {
        this.dialogStartDate = false;
        this.startDateFilterType = "On";
        this.selectedStartDate = new Date();
    },

    // Cancels the selection of the end date filter. It closes the dialog, resets the filter type to "On", and sets the selected end date to the current date.
    cancelSelectEndDate() {
        this.dialogEndDate = false;
        this.endDateFilterType = "On";
        this.selectedEndDate = new Date();
    },

    // Cancels the selection of the exit form release date filter. It closes the dialog, resets the filter type to "On", and sets the selected exit form release date to the current date.
    cancelSelectExitFormReleaseDate() {
        this.dialogExitFormReleaseDate = false;
        this.exitFormReleaseDateFilterType = "On";
        this.selectedExitFormReleaseDate = new Date();
    },

    // Creates a search chip for the start date filter based on the provided operator and date. Then adds the chip to the search criteria and selects it by default. Finally, triggers the filter process.
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
            category: 'Session Start Date',
            term: term
        };

        // Add the chip to the search criteria
        this.searchCriteria.push(startDateChip);
        // Select the new chip by default
        this.selectedSearchChips.push(this.searchCriteria.length - 1);
        
        // Call search
        this.performFilter();
    },

    // Creates a search chip for the end date filter based on the provided operator and date. Then adds the chip to the search criteria and selects it by default. Finally, triggers the filter process.
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
            category: 'Session End Date',
            term: term
        };

        // Add the chip to the search criteria
        this.searchCriteria.push(endDateChip);
        // Select the new chip by default
        this.selectedSearchChips.push(this.searchCriteria.length - 1);
        
        // Call search
        this.performFilter();
    },

    // Creates a search chip for the exit form release date filter based on the provided operator and date. Then adds the chip to the search criteria and selects it by default. Finally, triggers the filter process.
    createExitFormReleaseDateChip(operator, date) {
        let term = '';
        if (operator === '=') {
            term = `= ${this.formatDateForDatePicker(date)}`;  // Equals operator
        } else if (operator === '<') {
            term = `< ${this.formatDateForDatePicker(date)}`;  // Less than operator
        } else if (operator === '>') {
            term = `> ${this.formatDateForDatePicker(date)}`;  // More than operator
        } else if (operator === 'between') {
            term = `between ${date}`;  // Between operator
        }

        // Create the chip
        const exitFormReleaseDateChip = {
            category: 'Exit Form Release Date',
            term: term
        };

        // Add the chip to the search criteria
        this.searchCriteria.push(exitFormReleaseDateChip);
        // Select the new chip by default
        this.selectedSearchChips.push(this.searchCriteria.length - 1);

        // Call search
        this.performFilter();
    },

    // Formats the provided date into the 'MM-dd-yyyy' format using Luxon's DateTime library.
    formatDateMethod(date) {
        return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
    },

    // Toggles the visibility of archived sessions. After toggling, triggers the filtering process to update the displayed sessions accordingly.
    toggleArchivedSessions() {
        this.viewArchivedSessions = !this.viewArchivedSessions;
        this.performFilter();
    },

    // Handles archiving or restoring selected sessions. It updates the status of each session accordingly via a PUT request. Upon completion, it displays a toast message indicating the success of the operation.
    async handleArchiveSessions() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;

            const updateStatus = { sessionStatus: this.viewArchivedSessions };

            for (const session of this.selectedSessions) {
                // Update Session Status
                const sessionApiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/${session._id}`;
                // Update any associated Experience Instances
                const expInstanceApiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/update-status-by-session`;

                // Update session status
                await axios.put(sessionApiURL, updateStatus, { headers: { token }});

                // Update associated experience instances and get the response
                const expInstanceUpdateStatus = { sessionID: session._id, status: this.viewArchivedSessions };
                const expInstanceResponse = await axios.put(expInstanceApiURL, expInstanceUpdateStatus, { headers: { token }});

                // Determine the toast message
                const message = (this.selectedSessions.length === 1 ? "Session " : "Sessions ") +
                                (this.viewArchivedSessions ? "Restored" : "Archived") +
                                (expInstanceResponse.data.instancesUpdated ? " and Associated Experience Instances " : "") +
                                (this.viewArchivedSessions ? "Restored!" : "Archived!");

                // Display the toast message
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

    // Navigates to the page for adding a new session.
    handleAddNewSession() {
        this.$router.push({ name: "instructorAddSession" });
    },

    // Cancels the search dialog and resets the search filter selection for extra small screens.
    xsCancelSearchDialog() {
        this.xsdialogSearch = false;
        this.xsSearchFilterSelection = null;
    },

    // Applies search filters for extra small screens based on the selected filter option. If the selected filter is "Session Name", it adds a search chip. If the selected filter is "Session Start Date" or "Session End Date", it handles the date selection according to the chosen date filter type ('On', 'Before', 'After', or 'Between'). Finally, it resets the search dialog and clears the search input and filter selection.
    xsApplySearchFilters() {
        if (this.xsSearchFilterSelection === "Session Name") {
            this.addSearchChip();
        } else if (this.xsSearchFilterSelection === "Session Start Date" || this.xsSearchFilterSelection === "Session End Date") {
            const isStartDate = this.xsSearchFilterSelection === "Session Start Date";
            let dateFilterType = isStartDate ? this.startDateFilterType : this.endDateFilterType;
            let selectedDate = isStartDate ? this.selectedStartDate : this.selectedEndDate;
            let handleDateSelection = isStartDate ? this.handleStartDateSelection : this.handleEndDateSelection;
            let submitDate = isStartDate ? this.submitStartDate : this.submitEndDate;
            let createChipMethod = isStartDate ? this.createStartDateChip : this.createEndDateChip;

            if (dateFilterType !== 'Between') {
                // For 'On', 'Before', and 'After' filters
                let parsedDate = DateTime.fromISO(selectedDate).toJSDate();
                handleDateSelection(parsedDate);
                submitDate(parsedDate);
            } else {
                // For 'Between' filter - Split into two chips
                if (this.beginningDateRange && this.endDateRange) {
                    let parsedStartDate = DateTime.fromISO(this.beginningDateRange).toJSDate();
                    let parsedEndDate = DateTime.fromISO(this.endDateRange).toJSDate();
                    createChipMethod('>', parsedStartDate); // Date After {date1}
                    createChipMethod('<', parsedEndDate);   // Date Before {date2}
                }
            }
        }
        this.xsdialogSearch = false;
        this.sessionSearch = "";
        this.xsSearchFilterSelection = null;
    },

    // Toggles the expansion state of a session row. If the session is already expanded, it collapses it by removing it from the list of expanded sessions. If the session is not expanded, it expands it by adding it to the list of expanded sessions.
    toggleRowExpansion(item) {
        const index = this.expandedSessions.indexOf(item);
        if (index > -1) {
            // Session is already expanded, collapse it
            this.expandedSessions.splice(index, 1); // Remove the item
        } else {
            // Session is not expanded, expand it and load its instances
            this.expandedSessions.push(item); // Add the item
        }
    },

    // Formats a date object into a string suitable for a date picker input field, using the format 'MM-dd-yyyy'.
    formatDateForDatePicker(date) {
        return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
    },

    // Returns the count of activities in the provided array.
    getActivityCount(activities) {
        return activities.length;
    },

    // Redirects the user to the edit page for a specific experience instance when invoked.
    editInstance(instance) {
        this.$router.push({ name: "instructorSpecificExperienceInstance", params: { id: instance._id } });
    },

    // Redirects the user to the page for adding a new experience instance, passing along the session ID as a parameter for context.
    handleAddExperience(sessionID) {
        this.$router.push({ name: "instructorAddExperienceInstance", params: { id: sessionID } });
    },
},
};
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

.v-data-table .custom-hover:hover {
    background-color: #F5F5F5;
}

</style>
