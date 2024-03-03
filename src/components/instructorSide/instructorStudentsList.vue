<!--'/instructorStudentsList'-->
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
            <v-col lg="auto" md="4" sm="auto" class="d-none d-sm-flex justify-end align-self-center">
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
            <td>
                <v-checkbox density="compact" class="d-flex"></v-checkbox>
            </td>
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
import { toast } from 'vue3-toastify';
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
        studentHeaders: [
            {
            title: "",
            sortable: false,
            align: "center",
            width: "30px"
            },
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
    this.fetchStudentData();
},

watch: {
    graduationDateFilterType(newVal) {
        if (newVal === "Between") {
            this.beginningDateRange = null;
            this.endDateRange = null;
        }
    },
},

computed: {
    loading() {
        return useLoggedInUserStore().loading;
    },

    showChipsRow() {
        return this.searchCriteria.length > 0;
    },
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


    formatMajors(majors) {
    if (!majors || majors.length === 0) {
        return '';
    }
    return majors.join(', ');
    },

    formatGraduationDate(date) {
    if (!date) {
        return '';
    } else {
        const formattedDate = DateTime.fromISO(date).toFormat('MM-dd-yyyy');
        return formattedDate;
    }
    },

    viewStudent(student) {
        this.$router.push({
            name: "instructorSpecificStudent",
            params: { userID: student._id },
        });
    },

    updateSearchCriteria(item) {
    if (item === "Graduation Date") {
        this.dialogGraduationDate = true;
    } else {
        this.searchLabel = "Search " + item;
        console.log('this.searchLabel: ', this.searchLabel);
    }
    },

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

    performFilter() {
        console.log('performFilter called');
        let searchGroups = {};
        this.selectedSearchChips.forEach(index => {
            let criteria = this.searchCriteria[index];
            if (!searchGroups[criteria.category]) {
                searchGroups[criteria.category] = [];
            }
            searchGroups[criteria.category].push(criteria.term.toLowerCase());
        })

        console.log('this.searchCriteria: ', this.searchCriteria);
        console.log('this.selectedSearchChips: ', this.selectedSearchChips);
        console.log('searchGroups: ', searchGroups);

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
                    const formattedGraduationDate = this.formatGraduationDate(student.studentInformation?.enrolledUHInfo?.expectedGraduationData);
                    if (!formattedGraduationDate) {
                        return false; // Skip if formatted graduation date is not valid or not present
                    }

                    if (term.startsWith('<')) {
                        const comparisonDate = term.slice(2).trim(); // Expected format: 'MM-dd-yyyy'
                        return formattedGraduationDate < comparisonDate;
                    } else if (term.startsWith('>')) {
                        const comparisonDate = term.slice(2).trim(); // Expected format: 'MM-dd-yyyy'
                        return formattedGraduationDate > comparisonDate;
                    } else if (term.startsWith('=')) {
                        const comparisonDate = term.slice(2).trim(); // Expected format: 'MM-dd-yyyy'
                        return formattedGraduationDate === comparisonDate;
                    } else if (term.startsWith('between')) {
                        let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                        return formattedGraduationDate >= startDateStr && formattedGraduationDate <= endDateStr;
                    }
                    return true; // If the term format is not recognized, do not exclude the student
                });
            }



            });
        });
    },

    selectSearchChip(index) {
        console.log('selectSearchChip: ', index);
        const selectedIndex = this.selectedSearchChips.indexOf(index);
        console.log('selectedIndex: ', selectedIndex);
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

    removeSearchChip(index) {
        this.searchCriteria.splice(index, 1);
        // Update selectedSearchChips to reflect the removal
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
        // Adjust the indexes of the remaining selected chips
        this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
        // Call search
        this.performFilter();
    },

    toggleArchivedStudents() {
        this.viewArchivedStudents = !this.viewArchivedStudents;
        this.performFilter();
    },

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
        console.log('searchCriteria: ', this.searchCriteria)
        // Select the new chip by default
        this.selectedSearchChips.push(this.searchCriteria.length - 1);
        
        // Call search
        this.performFilter();
    },

    formatDateMethod(date) {
        return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
    },

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