<!--'/instructorStudentsList' - this view presents a list of all students -->
<template>
<v-container>
    <!-- Title -->
<v-row>
    <v-col>
    <p class="d-flex justify-center font-weight-black text-h6">
        {{ viewArchivedStudents ? "Archived" : "" }} Students
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
                v-model="studentSearch"
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
            <!-- View Archived Students Button -->
             <!-- KEEP - FOR FUTURE USE -->
            <!-- <v-col lg="auto" md="4" sm="auto" class="d-none d-sm-flex justify-end align-self-center">
            <v-btn
                v-if="!selectedStudents.length"
                @click="toggleArchivedStudents"
                elevation="1"
                :append-icon="viewArchivedStudents ? '' : 'mdi-archive'"
            >
                {{ viewArchivedStudents ? 'View Students' : 'View Archive' }}
            </v-btn>
            <v-btn
                v-else
                elevation="1"
                :append-icon="viewArchivedStudents ? 'mdi-restore' : 'mdi-archive-plus'"
            >
                <span class="d-none d-md-flex">
                {{ viewArchivedStudents ? "Restore" : "Archive" }} {{ selectedStudents.length === 1 ? "Student" : "Students" }}
                </span>
                <span class="d-none d-sm-flex d-md-none">
                {{ viewArchivedStudents ? "Restore" : "Archive" }}
                </span>
            </v-btn>
            </v-col> -->
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
        :headers="studentHeaders"
        :items="filteredStudentData"
        item-key="_id"
        item-value="_id"
        v-model="selectedStudents"
        hover
        return-object
        multi-sort
        height="600"
        items-per-page="25"
        :items-per-page-options="dataTableItemsPerPageOptions"
        >
        <template v-slot:item="{ item }">
            <tr 
            class="pointer-cursor"
            @click="viewStudent(item)"
            >
            <!-- KEEP - FOR FUTURE USE -->
            <!-- <td @click.stop>
                <v-checkbox @update:modelValue="toggleSelection(item)" density="compact" class="d-flex"></v-checkbox>
            </td> -->
            <td>{{ formatName(item.firstName, item.lastName) }}</td>
            <td>{{ item.email }}</td>
            <td>{{ formatPronouns(item.studentInformation?.pronouns) }}</td>
            <td>{{ formatMajors(item.studentInformation?.enrolledUHInfo?.majors) }}</td>
            <td>{{ formatGraduationDate(item.studentInformation?.enrolledUHInfo?.expectedGraduationData) }}</td>
            </tr>
        </template>
        </v-data-table>

        <!-- Skeleton loader -->
        <v-skeleton-loader v-if="loading" type="table-row@5"></v-skeleton-loader>
    </v-card>
    </v-col>
</v-row>
</v-container>

<!-- Date Picker for Graduation Date -->
<v-dialog
    v-model="dialogGraduationDate"
    width="auto"
    persistent
>
    <v-card>
        <v-card-title>
            <v-row>
                <v-col>
                    <v-select
                        v-model="graduationDateFilterType"
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
                        v-model="selectedGraduationDate"
                        elevation="24"
                        :title="graduationDateTitle"
                        show-adjacent-months
                        color="red-darken-2"
                        @update:modelValue="handleGraduationDateSelection"
                    >
                        <template v-slot:header>
                            <div class="v-date-picker-header">
                                <v-fade-transition>
                                    <div :key="formattedSelectedGraduationDate" class="v-date-picker-header__content">
                                        {{ formattedSelectedGraduationDate }}
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
            <v-btn text @click="cancelSelectGraduationDate">Cancel</v-btn>
            <v-btn 
                color="#c8102e"
                :disabled="!canApplyGraduationDates"
                @click="submitGraduationDate"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>
    

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { DateTime } from "luxon";

export default {
data() {
    return {
        viewArchivedStudents: false,
        searchLabel: "Search All Fields",
        searchMenuItems: [
            "All Fields",
            "Student Name",
            "Email",
            "Majors",
            "Minors",
            "Graduation Date"
        ],
        selectedStudents: [],
        studentData: [],
        filteredStudentData: [],
        // When adding archives: add this to studentHeaders: { title: "", sortable: false, align: "center", width: "30px" },
        studentHeaders: [
            {
            title: "Student Name",
            value: "formattedName",
            align: "start",
            sortable: true,
            },
            {
            title: "Email",
            value: "email",
            align: "start",
            sortable: true,
            },
            {
            title: "Pronouns",
            value: "pronouns",
            align: "start",
            sortable: false, // Assuming you don't need to sort by pronouns
            },
            {
            title: "Majors",
            value: "majors",
            align: "start",
            sortable: true,
            },
            {
            title: "Expected Graduation Date",
            value: "expectedGraduationDate",
            align: "start",
            sortable: true,
            },
        ],
        dataTableItemsPerPageOptions: [
            {value: 25, title: "25"},
            {value: 50, title: "50"},
            {value: 75, title: "75"},
            {value: 100, title: "100"},
            {value: -1, title: "$vuetify.dataFooter.itemsPerPageAll"},
        ],
        studentSearch: "",
        selectedSearchChips: [],
        searchCriteria: [],
        dialogGraduationDate: false,
        selectedGraduationDate: new Date(),
        graduationDateFilterType: "On",
        beginningDateRange: null,
        endDateRange: null,
    };
},

mounted() {
    // Fetch the student data when the component is mounted
    this.fetchStudentData();
},

watch: {
    // Reset the date range if the graduation date filter is set to "Between"
    graduationDateFilterType(newVal) {
        if (newVal === "Between") {
            this.beginningDateRange = null;
            this.endDateRange = null;
        }
    },
},

computed: {
    // Return the loading state from the user store
    loading() {
        return useLoggedInUserStore().loading;
    },

    // Show the chips row if search criteria are present
    showChipsRow() {
        return this.searchCriteria.length > 0;
    },

    // Format the selected graduation date range if "Between" is chosen
    formattedSelectedGraduationDate() {
        if (this.graduationDateFilterType === "Between") {
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

        return this.selectedGraduationDate
            ? DateTime.fromJSDate(this.selectedGraduationDate).toFormat('MM-dd-yyyy')
            : "";
    },

    // Return the appropriate title for the graduation date filter
    graduationDateTitle() {
        switch (this.graduationDateFilterType) {
            case "On":
                return "Graduation Date On";
            case "After":
                return "Graduation Date After";
            case "Before":
                return "Graduation Date Before";
            case "Between":
                return "Graduation Date Between";
            default:
                return "Graduation Date On";
        }
    },

    // Allow date submission only if both beginning and end dates are selected for "Between"
    canApplyGraduationDates() {
        if (this.graduationDateFilterType === "Between") {
            // Allow submission only if both beginning and end date ranes are selected
            return this.beginningDateRange && this.endDateRange;
        }
        // In other cases, allow submission
        return true;
    },
},

methods: {
    
    // Fetches student data from the server and updates the component's state.
    async fetchStudentData() {
        try {
            useLoggedInUserStore().startLoading();
            const user = useLoggedInUserStore();
            let token = user.token;
            let apiURL =
            import.meta.env.VITE_ROOT_API + `/instructorSideData/studentInformation/`;
            const resp = await axios.get(apiURL, { headers: { token } });
            this.studentData = resp.data.data;

            // Sort the data: documents with 'studentInformation' first
            this.studentData.sort((a, b) => {
            if (a.studentInformation && !b.studentInformation) {
                return -1; // 'a' comes first
            }
            if (!a.studentInformation && b.studentInformation) {
                return 1; // 'b' comes first
            }
            return 0; // No change in order
            });

            this.filteredStudentData = [...this.studentData];
        } catch (error) {
            this.handleError(error);
        } finally {
          useLoggedInUserStore().stopLoading();
        }
    },

    // Formats the first and last names by capitalizing the first letter of each word and combining them. Formats the pronouns by filtering checked ones and joining their labels.
    formatName(firstName, lastName) {
        // Function to capitalize the first letter of each word
        const capitalize = (word) => {
            if (!word) return "";
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        };

        // Trim and capitalize the names
        const formattedFirstName = capitalize(firstName.trim());
        const formattedLastName = capitalize(lastName.trim());

        // Combine the names
        return `${formattedFirstName} ${formattedLastName}`;
        },
        
        formatPronouns(pronouns) {
        if (!pronouns || pronouns.length === 0) {
            return '';
        }
        return pronouns
            .filter(p => p.checked)
            .map(p => p.label)
            .join(', ');
    },

    // Formats the majors by joining them with commas.
    formatMajors(majors) {
        if (!majors || majors.length === 0) {
            return '';
        }
        return majors.join(', ');
    },

    // Formats the graduation date into 'MM-dd-yyyy' format.
    formatGraduationDate(date) {
        if (!date) {
            return '';
        } else {
            const formattedDate = DateTime.fromISO(date).toFormat('MM-dd-yyyy');
            return formattedDate;
        }
    },

    // Navigates to the specific student view page with the student's ID as a parameter.
    viewStudent(student) {
        useLoggedInUserStore().navigationData = {
            userID: student._id,
        };
        this.$router.push({
            name: "instructorSpecificStudent"
        });
    },

    // Updates the search criteria based on the selected item.
    updateSearchCriteria(item) {
        if (item === "Graduation Date") {
            this.dialogGraduationDate = true;
        } else {
            this.searchLabel = "Search " + item;
        }
    },

    // Adds a search chip based on the entered student search criteria. If the search criteria is not empty, it adds the chip to the search criteria array, selects it by default, clears the input field, and triggers the search process.
    addSearchChip() {
        if (this.studentSearch) {
            this.searchCriteria.push({
                category: this.searchLabel.replace("Search ", ""),
                term: this.studentSearch
            });
            // Select the new chip by default
            this.selectedSearchChips.push(this.searchCriteria.length - 1);
            // Clear input field after adding chip
            this.studentSearch = "";
            // Call search
            this.performFilter();
        }
    },

    // Filters student data based on selected search criteria.
    performFilter() {
        let searchGroups = {};
        this.selectedSearchChips.forEach(index => {
            let criteria = this.searchCriteria[index];
            if (!searchGroups[criteria.category]) {
                searchGroups[criteria.category] = [];
            }
            searchGroups[criteria.category].push(criteria.term.toLowerCase());
        })

        this.filteredStudentData = this.studentData.filter(student => {
            // Archive Filter
            if (this.viewArchivedStudents && student.userStatus === "Inactive") {
                return true;
            } else if (!this.viewArchivedStudents && (student.userStatus === "Active" || student.userStatus === "Pending")) {
                return true;
            } else {
                return false;
            }
        }).filter(student => {
            return Object.keys(searchGroups).every(category => {
            if (category === "All Fields") {
                return searchGroups[category].every(term => {
                    const lowerTerm = term.toLowerCase();
                    const majorsMatch = student.studentInformation?.enrolledUHInfo?.majors?.some(major => major.toLowerCase().includes(lowerTerm)) ?? false;
                    return student.firstName.toLowerCase().includes(lowerTerm) ||
                        student.lastName.toLowerCase().includes(lowerTerm) ||
                        student.email.toLowerCase().includes(lowerTerm) ||
                        majorsMatch;
                });
            } else if (category === "Student Name") {
                return searchGroups[category].every(term => {
                    const lowerTerm = term.toLowerCase();
                    return student.firstName.toLowerCase().includes(lowerTerm) ||
                        student.lastName.toLowerCase().includes(lowerTerm);
                });
            } else if (category === "Email") {
                return searchGroups[category].every(term => {
                    const lowerTerm = term.toLowerCase();
                    return student.email.toLowerCase().includes(lowerTerm);
                });
            } else if (category === "Majors") {
                return searchGroups[category].every(term => {
                    const lowerTerm = term.toLowerCase();
                    const majors = student.studentInformation?.enrolledUHInfo?.majors ?? [];
                    return majors.some(major => major.toLowerCase().includes(lowerTerm));
                });
            } else if (category === "Minors") {
                return searchGroups[category].every(term => {
                    const lowerTerm = term.toLowerCase();
                    const combinedMinors = [
                        ...(student.studentInformation?.enrolledUHInfo?.honorsMinors ?? []),
                        ...(student.studentInformation?.enrolledUHInfo?.otherMinors ?? [])
                    ];
                    // Check if any combined minor includes the search term
                    return combinedMinors.some(minor => minor.toLowerCase().includes(lowerTerm));
                });
            } else if (category === "Graduation Date") {
                return searchGroups[category].every(term => {
                    const graduationDateISO = student.studentInformation?.enrolledUHInfo?.expectedGraduationData;
                    if (!graduationDateISO) {
                        return false;
                    }

                    // Parse the student's graduation date from ISO
                    const studentDateObj = DateTime.fromISO(graduationDateISO);
                    if (!studentDateObj.isValid) {
                        return false;
                    }

                    if (term.startsWith('<')) {
                        const comparisonDateStr = term.slice(2).trim();
                        const comparisonDateObj = DateTime.fromFormat(comparisonDateStr, 'MM-dd-yyyy');
                        return comparisonDateObj.isValid && studentDateObj < comparisonDateObj;

                    } else if (term.startsWith('>')) {
                        const comparisonDateStr = term.slice(2).trim();
                        const comparisonDateObj = DateTime.fromFormat(comparisonDateStr, 'MM-dd-yyyy');
                        return comparisonDateObj.isValid && studentDateObj > comparisonDateObj;

                    } else if (term.startsWith('=')) {
                        const comparisonDateStr = term.slice(2).trim();
                        const comparisonDateObj = DateTime.fromFormat(comparisonDateStr, 'MM-dd-yyyy');
                        // Check if they're on the same day
                        return comparisonDateObj.isValid && studentDateObj.hasSame(comparisonDateObj, 'day');

                    } else if (term.startsWith('between')) {
                        let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                        const startDateObj = DateTime.fromFormat(startDateStr.trim(), 'MM-dd-yyyy');
                        const endDateObj = DateTime.fromFormat(endDateStr.trim(), 'MM-dd-yyyy');
                        return startDateObj.isValid && endDateObj.isValid && (studentDateObj >= startDateObj && studentDateObj <= endDateObj);
                    }

                    return true; // If not recognized, don't exclude
                });
            }
            });
        });
    },

    // Toggles an student's selection state: if the student is already selected, it is removed from the selection; if it is not selected, it is added to the selection.
    toggleSelection(student) {
        const index = this.selectedStudents.findIndex((selectedStudent) => selectedStudent._id === student._id);
        if (index >= 0) {
            // Already selected, remove it
            this.selectedStudents.splice(index, 1);
        } else {
            // Not selected, add it
            this.selectedStudents.push(student);
        }
    },

    // Toggles the selection state of a search chip and updates the filtered student data accordingly.
    selectSearchChip(index) {
        const selectedIndex = this.selectedSearchChips.indexOf(index);
        if (selectedIndex >= 0) {
            // If the chip is already selected, create a new array without the chip
            this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        } else {
            // If the chip is not selected, create a new array with the chip selected
            this.selectedSearchChips = [...this.selectedSearchChips, index];
        }
        // Call search
        this.performFilter();
    },

    // Removes a search chip from the list, updates the selected chips, and triggers the filtering process.
    removeSearchChip(index) {
        this.searchCriteria.splice(index, 1);
        // Update selectedSearchChips to reflect the removal
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        // Adjust the indexes of the remaining selected chips
        this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
        // Call search
        this.performFilter();
    },

    // Toggles the visibility of archived students and triggers the filtering process.
    toggleArchivedStudents() {
        this.viewArchivedStudents = !this.viewArchivedStudents;
        this.performFilter();
    },

    // Handles the selection of graduation dates based on the chosen filter type. If the filter type is set to 'Between', it sets the beginning date range if it's not set yet, otherwise sets the end date range. Otherwise, it sets the selected graduation date directly.
    handleGraduationDateSelection(date) {
        if (this.graduationDateFilterType === 'Between') {
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
            this.selectedGraduationDate = date;
        }
    },

    // Submits the selected graduation date filter. Depending on the chosen filter type and the presence of selected dates, it creates corresponding search chips. Then, it resets the dialog state and selected graduation date for future use.
    submitGraduationDate() {
        // Handle different date filter types
        if (this.graduationDateFilterType === 'On' && this.selectedGraduationDate) {
            this.createGraduationDateChip('=', this.selectedGraduationDate);
        } else if (this.graduationDateFilterType === 'Before' && this.selectedGraduationDate) {
            this.createGraduationDateChip('<', this.selectedGraduationDate);
        } else if (this.graduationDateFilterType === 'After' && this.selectedGraduationDate) {
            this.createGraduationDateChip('>', this.selectedGraduationDate);
        } else if (this.graduationDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
            // Format the dates
            const formattedBeginningDate = this.formatDateMethod(this.beginningDateRange);
            const formattedEndDate = this.formatDateMethod(this.endDateRange);
            // Create a chip for the date range
            this.createGraduationDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
        }

        this.dialogGraduationDate = false;
        this.selectedGraduationDate = new Date();
        this.graduationDateFilterType = "On";
    },

    // Creates a search chip based on the specified operator and date for the graduation date filter. Then, adds the chip to the search criteria and selects it by default. Finally, triggers the search operation to apply the filter.
    createGraduationDateChip(operator, date) {
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
        const graduationDateChip = {
            category: 'Graduation Date',
            term: term
        };

        // Add the chip to the search criteria
        this.searchCriteria.push(graduationDateChip);
        // Select the new chip by default
        this.selectedSearchChips.push(this.searchCriteria.length - 1);
        
        // Call search
        this.performFilter();
    },

    // Formats the provided date object into a string with the format 'MM-dd-yyyy'.
    formatDateMethod(date) {
        return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
    },

    // Cancels the selection of graduation date by closing the dialog, resetting the filter type to "On", and setting the selected graduation date to the current date.
    cancelSelectGraduationDate() {
        this.dialogGraduationDate = false;
        this.graduationDateFilterType = "On";
        this.selectedGraduationDate = new Date();
    },

},
};
</script>

<style scoped>
.pointer-cursor {
    cursor: pointer;
}


</style>