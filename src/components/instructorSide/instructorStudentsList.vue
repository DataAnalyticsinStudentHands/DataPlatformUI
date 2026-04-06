<!-- 
instructorStudentsList.vue
Instructor-side view presenting a list of all Students with search, filtering,
and archive functionality. Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="students-page">
          <v-container class="py-8 px-6 px-md-10">
      <!-- Page Header -->
      <div class="page-header mb-6">
        <div class="d-flex align-center mb-2">
          <v-btn 
            icon 
            variant="text" 
            size="small" 
            @click="$router.back()"
            class="mr-2"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-icon color="#c8102e" size="36" class="mr-3">mdi-account-group-outline</v-icon>
          <div class="flex-grow-1">
            <h1 class="text-h4 font-weight-bold">{{ viewArchivedStudents ? $t('Archived Students') : $t('Students') }}</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">{{ $t('View and manage student information') }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <v-card class="main-card" elevation="2">
        <div class="students-content">
    <!-- Toolbar Section -->
    <div class="toolbar-section">
      <v-row align="center" no-gutters>
        <!-- Search Field - Desktop/Tablet -->
        <v-col lg="5" md="4" sm="4" class="d-none d-sm-flex pr-3">
          <v-text-field
            v-model="studentSearch"
            density="comfortable"
            :placeholder="searchPlaceholder"
            flat
            hide-details
            clearable
            variant="outlined"
            class="search-field"
            @keyup.enter="addSearchChip"
            @click:clear="studentSearch = ''"
          >
            <template v-slot:prepend-inner>
              <v-menu location="bottom start">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="search-menu-trigger">
                    <v-icon size="22" color="#666">mdi-magnify</v-icon>
                    <v-icon size="16" color="#999">mdi-chevron-down</v-icon>
                  </div>
                </template>
                <v-list density="comfortable" class="search-menu-list">
                  <v-list-subheader>{{ $t('Search by') }}</v-list-subheader>
                  <v-list-item
                    v-for="item in searchMenuItems"
                    :key="item"
                    @click="updateSearchCriteria(item)"
                  >
                    <template v-slot:prepend>
                      <v-icon size="20">{{ getSearchIcon(item) }}</v-icon>
                    </template>
                    <v-list-item-title>{{ $t(item) }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template v-slot:append-inner>
              <v-btn 
                icon 
                size="small" 
                variant="text"
                @click="addSearchChip"
                :disabled="!studentSearch"
              >
                <v-icon size="20">mdi-arrow-right</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <v-spacer class="d-none d-md-flex"></v-spacer>

        <!-- Action Buttons - Desktop/Tablet -->
        <v-col cols="auto" class="d-none d-sm-flex align-center action-buttons-group">
          <!-- View Archived Button - KEEP FOR FUTURE USE -->
          <!-- <v-btn 
            v-if="!selectedStudents.length"
            @click="toggleArchivedStudents"
            variant="tonal"
            :color="viewArchivedStudents ? '#c8102e' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewArchivedStudents ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
            <span class="d-none d-md-inline">{{ viewArchivedStudents ? $t('View Active') : $t('View Archived') }}</span>
            <span class="d-inline d-md-none">{{ viewArchivedStudents ? $t('Active') : $t('Archive') }}</span>
          </v-btn> -->

          <!-- Archive/Restore Selected Button - KEEP FOR FUTURE USE -->
          <!-- <v-btn
            v-if="selectedStudents.length"
            @click="handleArchiveStudents"
            variant="tonal"
            :color="viewArchivedStudents ? 'success' : 'grey-darken-4'"
            size="default"
            class="action-btn mr-3"
          >
            <v-icon start size="20">{{ viewArchivedStudents ? 'mdi-restore' : 'mdi-archive-plus' }}</v-icon>
            <span class="d-none d-md-inline">
              {{ viewArchivedStudents ? $t('Restore') : $t('Archive') }} 
              {{ selectedStudents.length === 1 ? $t('Student') : $t('Students') }}
            </span>
            <span class="d-inline d-md-none">
              {{ viewArchivedStudents ? $t('Restore') : $t('Archive') }}
            </span>
          </v-btn> -->
        </v-col>

        <!-- Mobile Action Bar -->
        <v-col cols="12" class="d-flex d-sm-none mobile-action-bar">
          <v-btn 
            icon 
            variant="text"
            size="default"
            @click="mobileSearchDialog = true"
            class="mobile-action-btn"
          >
            <v-icon size="24">mdi-magnify</v-icon>
          </v-btn>
          
          <!-- View Archived Button - Mobile - KEEP FOR FUTURE USE -->
          <!-- <v-btn
            v-if="!selectedStudents.length"
            icon
            variant="text"
            size="default"
            @click="toggleArchivedStudents"
            class="mobile-action-btn"
            :color="viewArchivedStudents ? '#c8102e' : undefined"
          >
            <v-icon size="24">{{ viewArchivedStudents ? 'mdi-folder-open-outline' : 'mdi-archive-outline' }}</v-icon>
          </v-btn> -->

          <v-spacer></v-spacer>
        </v-col>
      </v-row>

      <!-- Active Search Chips -->
      <div v-if="showChipsRow" class="search-chips-container mt-3">
        <div class="d-flex align-center flex-wrap">
          <span class="text-body-2 text-medium-emphasis mr-2">{{ $t('Filters:') }}</span>
          <v-chip
            v-for="(criteria, index) in searchCriteria"
            :key="index"
            :color="selectedSearchChips.includes(index) ? '#c8102e' : 'grey-darken-4'"
            :variant="selectedSearchChips.includes(index) ? 'flat' : 'outlined'"
            size="default"
            class="search-chip mr-2 mb-1"
            @click="selectSearchChip(index)"
            closable
            @click:close="removeSearchChip(index)"
          >
            <v-icon start size="16">{{ getSearchIcon(criteria.category) }}</v-icon>
            {{ criteria.category }}: {{ criteria.term }}
          </v-chip>
          <v-btn 
            v-if="searchCriteria.length > 1"
            variant="text" 
            size="small" 
            color="#c8102e"
            @click="clearAllFilters"
            class="mb-1"
          >
            {{ $t('Clear all') }}
          </v-btn>
        </div>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Table Container -->
    <div class="table-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container py-16">
        <v-progress-circular 
          indeterminate 
          color="#c8102e" 
          size="48"
          width="4"
        ></v-progress-circular>
        <p class="text-body-2 text-medium-emphasis mt-4">{{ $t('Loading students...') }}</p>
      </div>

      <!-- Data Table -->
      <v-data-table
        v-else
        :headers="studentHeaders"
        :items="filteredStudentData"
        item-key="_id"
        item-value="_id"
        v-model="selectedStudents"
        hover
        return-object
        multi-sort
        class="students-table"
        :mobile-breakpoint="600"
        items-per-page="25"
        :items-per-page-options="dataTableItemsPerPageOptions"
      >
        <template v-slot:body="{ items }">
          <template v-if="items.length > 0">
            <template v-for="item in items" :key="item._id">
              <tr @click="viewStudent(item)" class="table-row">
                <!-- Checkbox Column - KEEP FOR FUTURE USE -->
                <!-- <td class="table-cell checkbox-cell" @click.stop>
                  <v-checkbox
                    density="compact"
                    hide-details
                    :model-value="isSelected(item)"
                    @update:modelValue="toggleSelection(item)"
                  ></v-checkbox>
                </td> -->
                <td class="table-cell">
                  <span class="font-weight-medium student-name">{{ formatName(item.firstName, item.lastName) }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-medium-emphasis">{{ item.email }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-medium-emphasis">{{ formatPronouns(item.studentInformation?.pronouns) }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-medium-emphasis">{{ formatMajors(item.studentInformation?.enrolledUHInfo?.majors) }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-medium-emphasis">{{ formatGraduationDate(item.studentInformation?.enrolledUHInfo?.expectedGraduationData) }}</span>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td :colspan="studentHeaders.length" class="empty-state-cell">
                <div class="empty-state py-12">
                  <v-icon size="56" color="#ccc" class="mb-3">
                    {{ viewArchivedStudents ? 'mdi-archive-off-outline' : 'mdi-account-off-outline' }}
                  </v-icon>
                  <p class="text-h6 text-medium-emphasis mb-1">
                    {{ viewArchivedStudents ? $t('No archived students') : $t('No students found') }}
                  </p>
                  <p class="text-body-2 text-disabled mb-0">
                    {{ viewArchivedStudents 
                      ? $t('Archived students will appear here') 
                      : $t('Students will appear here once registered') 
                    }}
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </div>

    <!-- Mobile Search Dialog -->
    <v-dialog v-model="mobileSearchDialog" max-width="420px">
      <v-card class="mobile-search-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-magnify</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Search Students') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="mobileSearchDialog = false">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-5">
          <v-select
            v-model="mobileSearchCategory"
            :items="searchMenuItems"
            :label="$t('Search by')"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-4"
          >
            <template v-slot:prepend-inner>
              <v-icon size="22">mdi-filter-variant</v-icon>
            </template>
          </v-select>
          
          <!-- Regular search input -->
          <v-text-field
            v-if="mobileSearchCategory !== 'Graduation Date'"
            v-model="mobileSearchQuery"
            :label="$t('Search term')"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          ></v-text-field>

          <!-- Graduation Date Filter for Mobile -->
          <div v-if="mobileSearchCategory === 'Graduation Date'">
            <v-select
              v-model="graduationDateFilterType"
              :items="['On', 'Before', 'After', 'Between']"
              :label="$t('Date filter type')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            ></v-select>
            <v-text-field
              v-if="graduationDateFilterType !== 'Between'"
              type="date"
              v-model="mobileGraduationDate"
              :label="$t('Select date')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-text-field>
            <v-text-field
              v-if="graduationDateFilterType === 'Between'"
              type="date"
              v-model="beginningDateRange"
              :label="$t('From date')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-if="graduationDateFilterType === 'Between'"
              type="date"
              v-model="endDateRange"
              :label="$t('To date')"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-text-field>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-5 pt-0">
          <v-btn variant="text" size="default" @click="mobileSearchDialog = false">{{ $t('Cancel') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="#c8102e" 
            size="default" 
            @click="applyMobileSearch" 
            :disabled="mobileSearchCategory === 'Graduation Date' ? !canApplyGraduationDates : !mobileSearchQuery"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply Filter') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      </div>
    </v-card>

    <!-- Date Picker Dialog for Graduation Date -->
    <v-dialog v-model="dialogGraduationDate" max-width="400px" persistent>
      <v-card class="date-picker-dialog">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon color="#c8102e" size="26" class="mr-2">mdi-school-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('Filter by Graduation Date') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="default" @click="cancelSelectGraduationDate">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <v-select
            v-model="graduationDateFilterType"
            :items="['On', 'Before', 'After', 'Between']"
            :label="$t('Filter Type')"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-4"
          >
            <template v-slot:prepend-inner>
              <v-icon size="20">mdi-filter-variant</v-icon>
            </template>
          </v-select>

          <v-date-picker
            v-model="selectedGraduationDate"
            elevation="0"
            :title="graduationDateTitle"
            show-adjacent-months
            color="#c8102e"
            class="date-picker-full-width"
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
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn variant="text" size="large" @click="cancelSelectGraduationDate" class="mr-2">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn 
            color="#c8102e"
            size="large"
            :disabled="!canApplyGraduationDates"
            @click="submitGraduationDate"
            class="apply-btn"
          >
            <v-icon start size="20">mdi-check</v-icon>
            {{ $t('Apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  </main>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  name: "InstructorStudentsList",

  data() {
    return {
      viewArchivedStudents: false,
      searchLabel: "All Fields",
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
        // Checkbox column - KEEP FOR FUTURE USE
        // {
        //   title: "",
        //   sortable: false,
        //   align: "center",
        //   width: "50px",
        //   key: "checkbox"
        // },
        {
          title: "Student Name",
          value: "formattedName",
          align: "start",
          sortable: true,
          key: "formattedName"
        },
        {
          title: "Email",
          value: "email",
          align: "start",
          sortable: true,
          key: "email"
        },
        {
          title: "Pronouns",
          value: "pronouns",
          align: "start",
          sortable: false,
          key: "pronouns"
        },
        {
          title: "Majors",
          value: "majors",
          align: "start",
          sortable: true,
          key: "majors"
        },
        {
          title: "Expected Graduation Date",
          value: "expectedGraduationDate",
          align: "start",
          sortable: true,
          key: "expectedGraduationDate"
        },
      ],
      dataTableItemsPerPageOptions: [
        { value: 25, title: "25" },
        { value: 50, title: "50" },
        { value: 75, title: "75" },
        { value: 100, title: "100" },
        { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
      ],
      studentSearch: "",
      selectedSearchChips: [],
      searchCriteria: [],
      dialogGraduationDate: false,
      selectedGraduationDate: new Date(),
      graduationDateFilterType: "On",
      beginningDateRange: null,
      endDateRange: null,
      mobileSearchDialog: false,
      mobileSearchCategory: "All Fields",
      mobileSearchQuery: "",
      mobileGraduationDate: null,
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

    searchPlaceholder() {
      return this.$t('Search') + ' ' + this.$t(this.searchLabel) + '...';
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
        case "On": return "Graduation Date On";
        case "After": return "Graduation Date After";
        case "Before": return "Graduation Date Before";
        case "Between": return "Graduation Date Between";
        default: return "Graduation Date On";
      }
    },

    canApplyGraduationDates() {
      if (this.graduationDateFilterType === "Between") {
        return this.beginningDateRange && this.endDateRange;
      }
      return true;
    },
  },

  methods: {
    getSearchIcon(category) {
      switch (category) {
        case 'All Fields': return 'mdi-text-search';
        case 'Student Name': return 'mdi-account-outline';
        case 'Email': return 'mdi-email-outline';
        case 'Majors': return 'mdi-school-outline';
        case 'Minors': return 'mdi-book-outline';
        case 'Graduation Date': return 'mdi-calendar-check-outline';
        default: return 'mdi-magnify';
      }
    },

    isSelected(item) {
      return this.selectedStudents.some(s => s._id === item._id);
    },

    async fetchStudentData() {
      try {
        useLoggedInUserStore().startLoading();
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/studentInformation/`;
        const resp = await axios.get(apiURL);
        this.studentData = resp.data.data;

        this.studentData.sort((a, b) => {
          if (a.studentInformation && !b.studentInformation) {
            return -1;
          }
          if (!a.studentInformation && b.studentInformation) {
            return 1;
          }
          return 0;
        });

        this.filteredStudentData = [...this.studentData];
        this.performFilter();
      } catch (error) {
        this.handleError(error);
      } finally {
        useLoggedInUserStore().stopLoading();
      }
    },

    formatName(firstName, lastName) {
      const capitalize = (word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      };
      const formattedFirstName = capitalize(firstName?.trim());
      const formattedLastName = capitalize(lastName?.trim());
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
      useLoggedInUserStore().navigationData = {
        userID: student._id,
      };
      this.$router.push({
        name: "instructorSpecificStudent"
      });
    },

    updateSearchCriteria(item) {
      if (item === "Graduation Date") {
        this.dialogGraduationDate = true;
      } else {
        this.searchLabel = item;
      }
    },

    addSearchChip() {
      if (this.studentSearch) {
        this.searchCriteria.push({
          category: this.searchLabel,
          term: this.studentSearch
        });
        this.selectedSearchChips.push(this.searchCriteria.length - 1);
        this.studentSearch = "";
        this.performFilter();
      }
    },

    selectSearchChip(index) {
      const selectedIndex = this.selectedSearchChips.indexOf(index);
      if (selectedIndex >= 0) {
        this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
      } else {
        this.selectedSearchChips = [...this.selectedSearchChips, index];
      }
      this.performFilter();
    },

    removeSearchChip(index) {
      this.searchCriteria.splice(index, 1);
      this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
      this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
      this.performFilter();
    },

    clearAllFilters() {
      this.searchCriteria = [];
      this.selectedSearchChips = [];
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

      this.filteredStudentData = this.studentData.filter(student => {
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
              return combinedMinors.some(minor => minor.toLowerCase().includes(lowerTerm));
            });
          } else if (category === "Graduation Date") {
            return searchGroups[category].every(term => {
              const graduationDateISO = student.studentInformation?.enrolledUHInfo?.expectedGraduationData;
              if (!graduationDateISO) {
                return false;
              }

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
                return comparisonDateObj.isValid && studentDateObj.hasSame(comparisonDateObj, 'day');
              } else if (term.startsWith('between')) {
                let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                const startDateObj = DateTime.fromFormat(startDateStr.trim(), 'MM-dd-yyyy');
                const endDateObj = DateTime.fromFormat(endDateStr.trim(), 'MM-dd-yyyy');
                return startDateObj.isValid && endDateObj.isValid && (studentDateObj >= startDateObj && studentDateObj <= endDateObj);
              }

              return true;
            });
          }
          return true;
        });
      });
    },

    toggleSelection(student) {
      const index = this.selectedStudents.findIndex((selectedStudent) => selectedStudent._id === student._id);
      if (index >= 0) {
        this.selectedStudents.splice(index, 1);
      } else {
        this.selectedStudents.push(student);
      }
    },

    toggleArchivedStudents() {
      this.viewArchivedStudents = !this.viewArchivedStudents;
      this.performFilter();
    },

    handleGraduationDateSelection(date) {
      if (this.graduationDateFilterType === 'Between') {
        if (!this.beginningDateRange || this.endDateRange) {
          this.beginningDateRange = date;
          this.endDateRange = null;
        } else {
          this.endDateRange = date;
        }
      } else {
        this.selectedGraduationDate = date;
      }
    },

    submitGraduationDate() {
      if (this.graduationDateFilterType === 'On' && this.selectedGraduationDate) {
        this.createGraduationDateChip('=', this.selectedGraduationDate);
      } else if (this.graduationDateFilterType === 'Before' && this.selectedGraduationDate) {
        this.createGraduationDateChip('<', this.selectedGraduationDate);
      } else if (this.graduationDateFilterType === 'After' && this.selectedGraduationDate) {
        this.createGraduationDateChip('>', this.selectedGraduationDate);
      } else if (this.graduationDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
        const formattedBeginningDate = this.formatDateMethod(this.beginningDateRange);
        const formattedEndDate = this.formatDateMethod(this.endDateRange);
        this.createGraduationDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
      }

      this.dialogGraduationDate = false;
      this.selectedGraduationDate = new Date();
      this.graduationDateFilterType = "On";
    },

    createGraduationDateChip(operator, date) {
      let term = '';
      if (operator === '=') {
        term = `= ${this.formatDateMethod(date)}`;
      } else if (operator === '<') {
        term = `< ${this.formatDateMethod(date)}`;
      } else if (operator === '>') {
        term = `> ${this.formatDateMethod(date)}`;
      } else if (operator === 'between') {
        term = `between ${date}`;
      }

      const graduationDateChip = {
        category: 'Graduation Date',
        term: term
      };

      this.searchCriteria.push(graduationDateChip);
      this.selectedSearchChips.push(this.searchCriteria.length - 1);
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

    applyMobileSearch() {
      if (this.mobileSearchCategory === "Graduation Date") {
        // Handle graduation date filter
        if (this.graduationDateFilterType !== 'Between') {
          if (this.mobileGraduationDate) {
            const parsedDate = DateTime.fromISO(this.mobileGraduationDate).toJSDate();
            if (this.graduationDateFilterType === 'On') {
              this.createGraduationDateChip('=', parsedDate);
            } else if (this.graduationDateFilterType === 'Before') {
              this.createGraduationDateChip('<', parsedDate);
            } else if (this.graduationDateFilterType === 'After') {
              this.createGraduationDateChip('>', parsedDate);
            }
          }
        } else {
          if (this.beginningDateRange && this.endDateRange) {
            const formattedBeginningDate = DateTime.fromISO(this.beginningDateRange).toFormat('MM-dd-yyyy');
            const formattedEndDate = DateTime.fromISO(this.endDateRange).toFormat('MM-dd-yyyy');
            this.createGraduationDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
          }
        }
      } else {
        // Handle regular search
        if (this.mobileSearchQuery?.trim()) {
          this.searchLabel = this.mobileSearchCategory;
          this.searchCriteria.push({
            category: this.mobileSearchCategory,
            term: this.mobileSearchQuery.trim()
          });
          this.selectedSearchChips.push(this.searchCriteria.length - 1);
          this.performFilter();
        }
      }

      // Reset mobile search state
      this.mobileSearchQuery = "";
      this.mobileGraduationDate = null;
      this.mobileSearchDialog = false;
    }
  }
};
</script>

<style scoped>
/* Page Background */
.students-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

/* Main Card */
.main-card {
  border-radius: 12px;
  overflow: hidden;
}

/* Content Container */
.students-content {
  background-color: white;
}

/* Toolbar Section */
.toolbar-section {
  padding: 20px 24px;
  background-color: white;
}

.search-field {
  max-width: 420px;
}

.search-menu-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  margin-right: 4px;
}

.search-menu-trigger:hover {
  background-color: #f5f5f5;
}

.search-menu-list {
  min-width: 220px;
}

.action-buttons-group {
  gap: 10px;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.25px;
}

/* Mobile Action Bar */
.mobile-action-bar {
  justify-content: space-between;
  padding: 10px 0;
}

.mobile-action-btn {
  margin: 0 6px;
}

/* Search Chips */
.search-chips-container {
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.search-chip {
  font-weight: 500;
  font-size: 0.875rem;
}

.search-chip :deep(.v-chip__content) {
  gap: 4px;
}

.search-chip :deep(.v-chip__close) {
  margin: 0;
}

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

/* Table Container */
.table-container {
  min-height: 400px;
  padding: 0 16px 16px 16px;
}

.students-table {
  border-radius: 0;
  font-size: 0.95rem;
}

.students-table :deep(.v-data-table-header) {
  font-size: 0.9rem;
}

.students-table :deep(th) {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  padding: 10px 16px !important;
  background-color: #fafafa;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: rgba(200, 16, 46, 0.04) !important;
}

.table-cell {
  padding: 10px 16px !important;
  font-size: 0.95rem;
}

.checkbox-cell {
  width: 50px !important;
  padding: 10px 12px !important;
}

.student-name {
  font-size: 0.95rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
}

.empty-state-cell {
  padding: 0 !important;
}

/* Dialogs */
.mobile-search-dialog,
.date-picker-dialog {
  border-radius: 12px;
}

.date-picker-full-width {
  width: 100%;
}

.date-picker-full-width :deep(.v-date-picker) {
  width: 100%;
}

.apply-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

/* Data table pagination styling */
.students-table :deep(.v-data-table-footer) {
  font-size: 0.9rem;
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
}

/* Responsive */
@media (max-width: 960px) {
  .toolbar-section {
    padding: 16px 18px;
  }
  
  .table-container {
    padding: 0 12px 12px 12px;
  }
}

@media (max-width: 600px) {
  .toolbar-section {
    padding: 14px 16px;
  }
  
  .table-cell {
    padding: 8px 12px !important;
  }
  
  .table-container {
    padding: 0 8px 8px 8px;
  }
}
</style>