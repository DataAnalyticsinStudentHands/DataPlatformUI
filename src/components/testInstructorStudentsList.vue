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
</template>
    

<script>
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

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
    };
},

mounted() {
    this.fetchStudentData();
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
    
    async fetchStudentData() {
        try {
            const user = useLoggedInUserStore();
            // let token = user.token;
            const token = import.meta.env.VITE_TOKEN;
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
    }
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    return formattedDate;
    },

    viewStudent(student) {
        this.$router.push({
            name: "instructorSpecificStudent",
            params: { userID: student._id },
        });
    },

    updateSearchCriteria(item) {
        this.searchLabel = "Search " + item;
        console.log('this.searchLabel: ', this.searchLabel);
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
            }
                
                return true;
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




},
};
</script>

<style scoped>
.pointer-cursor {
    cursor: pointer;
}


</style>