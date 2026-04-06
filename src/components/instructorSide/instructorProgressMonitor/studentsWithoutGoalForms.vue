<!-- 
studentsWithoutGoalForms.vue
Instructor-side view for tracking Goal Form completion by experience instance.
Shows students who have/haven't completed their Goal Setting Forms.
Redesigned UI matching the project pages aesthetic.
-->

<template>
  <div class="monitor-content">
    <!-- Toolbar Section -->
    <div class="toolbar-section">
      <!-- Row 1: Dropdowns -->
      <v-row align="center" no-gutters class="mb-4">
        <!-- Session Selector -->
        <v-col cols="12" sm="6" class="pr-sm-2 mb-3 mb-sm-0">
          <v-select
            v-model="selectedSession"
            :items="availableSessions"
            :label="$t('Session')"
            :placeholder="$t('Select session...')"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="session-select"
          >
            <template v-slot:prepend-inner>
              <v-icon color="#c8102e" size="20">mdi-calendar-outline</v-icon>
            </template>
          </v-select>
        </v-col>

        <!-- Experience Selector -->
        <v-col cols="12" sm="6" class="pl-sm-2">
          <v-select
            v-model="selectedExperience"
            :items="filteredExperiences"
            item-title="text"
            item-value="value"
            :label="$t('Experience')"
            :placeholder="selectedSession ? $t('Select experience...') : $t('Select session first')"
            :disabled="!selectedSession"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="experience-select"
          >
            <template v-slot:prepend-inner>
              <v-icon color="#c8102e" size="20">mdi-school-outline</v-icon>
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:subtitle>
                  <span class="text-caption">{{ item.raw.category }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <!-- Row 2: Action Buttons -->
      <v-row align="center" no-gutters>
        <v-col cols="auto" class="d-flex align-center action-buttons-group">
          <!-- Refresh Button -->
          <v-btn
            variant="outlined"
            size="default"
            @click="fetchStudents"
            :loading="loading"
            :disabled="!selectedExperience"
            class="refresh-btn mr-3"
          >
            <v-icon start size="18">mdi-refresh</v-icon>
            {{ $t('Refresh') }}
          </v-btn>

          <!-- Completion Toggle Buttons -->
          <v-btn-toggle
            v-model="completedToggle"
            mandatory
            divided
            density="comfortable"
            class="completion-toggle"
          >
            <v-btn 
              :value="false"
              :color="completed === false ? '#c8102e' : undefined"
              :variant="completed === false ? 'flat' : 'outlined'"
              size="default"
            >
              <v-icon start size="18">mdi-close-circle-outline</v-icon>
              {{ $t('Uncompleted') }}
            </v-btn>
            <v-btn 
              :value="true"
              :color="completed === true ? 'success' : undefined"
              :variant="completed === true ? 'flat' : 'outlined'"
              size="default"
            >
              <v-icon start size="18">mdi-check-circle-outline</v-icon>
              {{ $t('Completed') }}
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <v-spacer></v-spacer>

        <!-- CSV Download Button -->
        <v-col cols="auto">
          <progress-monitor-csv-downloader
            v-if="selectedExperience && displayedStudents.length"
            :data="displayedStudents"
            :file-name="csvFileName"
          />
        </v-col>
      </v-row>

      <!-- Stats Row -->
      <div v-if="selectedExperience" class="stats-row mt-4">
        <v-chip
          color="#c8102e"
          variant="tonal"
          size="large"
          class="stats-chip"
        >
          <v-icon start size="18">mdi-account-group</v-icon>
          {{ $t('Total Students:') }} <strong class="ml-1">{{ totalStudentsCount }}</strong>
        </v-chip>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Table Container -->
    <div class="table-container">
      <!-- Empty State - No Experience Selected -->
      <div v-if="!selectedExperience" class="empty-state py-16">
        <v-icon size="72" color="#ccc" class="mb-4">mdi-school-outline</v-icon>
        <p class="text-h6 text-medium-emphasis mb-2">{{ $t('Select an Experience') }}</p>
        <p class="text-body-2 text-disabled mb-0">{{ $t('Choose a session and experience from the dropdowns above to view student progress') }}</p>
      </div>

      <!-- Data Table -->
      <v-data-table
        v-else
        :headers="tableHeaders"
        :items="displayedStudents"
        :loading="loading"
        item-key="_id"
        hover
        class="students-table"
        :mobile-breakpoint="600"
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items-per-page-options="itemsPerPageOptions"
      >
        <!-- Loading State -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <!-- Table Body -->
        <template v-slot:body="{ items }">
          <template v-if="items.length > 0">
            <tr 
              v-for="student in items" 
              :key="student._id" 
              @click="navigateIfEnabled(student._id)"
              @mouseenter="hoverId = student._id"
              @mouseleave="hoverId = null"
              class="table-row"
              :class="{ 
                'navigation-disabled': isNavigationDisabled,
                'hoverRow': hoverId === student._id && !isNavigationDisabled
              }"
            >
              <td class="table-cell">
                <div class="d-flex align-center">
                  <v-avatar color="grey-lighten-2" size="36" class="mr-3">
                    <span class="text-body-2 font-weight-medium">
                      {{ getInitials(student.firstName, student.lastName) }}
                    </span>
                  </v-avatar>
                  <span class="font-weight-medium">{{ formatFullName(student.firstName, student.lastName) }}</span>
                </div>
              </td>
              <td class="table-cell d-none d-sm-table-cell">
                <span class="text-medium-emphasis">{{ student.email }}</span>
              </td>
              <td class="table-cell d-none d-md-table-cell">
                <span class="text-body-2 text-medium-emphasis">{{ formatDate(student.registrationDate) }}</span>
              </td>
              <td v-if="completed === true" class="table-cell text-right">
                <v-btn
                  size="small"
                  variant="tonal"
                  color="#c8102e"
                  @click.stop="viewStudentGoalForm(student._id)"
                  class="action-btn"
                >
                  <v-icon start size="16">mdi-eye-outline</v-icon>
                  <span class="d-none d-sm-inline">{{ $t('View Form') }}</span>
                  <span class="d-inline d-sm-none">{{ $t('View') }}</span>
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="tableHeaders.length" class="empty-state-cell">
                <div class="empty-state py-12">
                  <v-icon size="56" color="#ccc" class="mb-3">
                    {{ completed ? 'mdi-file-document-check-outline' : 'mdi-file-document-remove-outline' }}
                  </v-icon>
                  <p class="text-h6 text-medium-emphasis mb-1">
                    {{ completed ? $t('No completed forms') : $t('All students have completed their forms!') }}
                  </p>
                  <p class="text-body-2 text-disabled mb-0">
                    {{ completed 
                      ? $t('No students have completed their Goal Form for this experience yet') 
                      : $t('Great job! All registered students have submitted their Goal Forms') 
                    }}
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </div>

    <!-- Footer Toolbar -->
    <div class="footer-toolbar">
      <v-btn
        size="small"
        :variant="isNavigationDisabled ? 'flat' : 'outlined'"
        :color="isNavigationDisabled ? 'grey' : undefined"
        @click="toggleNavigation"
        class="nav-toggle-btn"
      >
        <v-icon start size="18">{{ isNavigationDisabled ? 'mdi-cursor-default-click-outline' : 'mdi-cursor-default-click' }}</v-icon>
        {{ isNavigationDisabled ? $t('Enable Click Navigation') : $t('Disable Click Navigation') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { useInstructorViewsStore } from "@/stored/instructorViews";
import ProgressMonitorCSVDownloader from './progressMonitorCSVDownloader.vue';
import { DateTime } from "luxon";

export default {
  name: "StudentsWithoutGoalForms",
  setup() {
    const viewsStore = useInstructorViewsStore();
    return { viewsStore };
  },
  data() {
    return {
      expInstances: [],
      studentsWithoutGoalForm: [],
      studentsWithGoalForm: [],
      loading: false,
      selectedSession: null,
      hoverId: null,
      itemsPerPageOptions: [
        { value: 10, title: "10" },
        { value: 25, title: "25" },
        { value: 50, title: "50" },
        { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
      ],
    };
  },
  components: {
    'progress-monitor-csv-downloader': ProgressMonitorCSVDownloader
  },
  watch: {
    selectedExperience(newVal) {
      if (newVal !== null && this.completed !== null) {
        this.fetchStudents();
      }
    },
    completed(newVal, oldVal) {
      if (newVal !== null && this.selectedExperience !== null) {
        this.fetchStudents();
      }
    },
    // Clear experience selection when session changes
    selectedSession(newVal) {
      if (newVal === null) {
        this.selectedExperience = null;
      } else {
        // Check if current experience is still valid for new session
        const validExperiences = this.filteredExperiences.map(e => e.value);
        if (!validExperiences.includes(this.selectedExperience)) {
          this.selectedExperience = null;
        }
      }
    }
  },
  mounted() {
    // Set default to "Uncompleted" if not already set
    if (this.completed === null) {
      this.completed = false;
    }
    
    this.fetchExperiences().then(() => {
      if (this.selectedExperience !== null && this.completed !== null) {
        this.fetchStudents();
      }
    });
  },

  computed: {
    // Sync with store
    selectedExperience: {
      get() { return this.viewsStore.getGoalFormMonitorSettings.selectedExperience; },
      set(value) { this.viewsStore.updateGoalFormMonitorSettings({ selectedExperience: value }); }
    },
    completed: {
      get() { return this.viewsStore.getGoalFormMonitorSettings.completed; },
      set(value) { this.viewsStore.updateGoalFormMonitorSettings({ completed: value }); }
    },
    completedToggle: {
      get() { return this.completed; },
      set(value) { this.completed = value; }
    },
    itemsPerPage: {
      get() { return this.viewsStore.getGoalFormMonitorSettings.itemsPerPage; },
      set(value) { this.viewsStore.updateGoalFormMonitorSettings({ itemsPerPage: parseInt(value) || 10 }); }
    },
    isNavigationDisabled: {
      get() { return this.viewsStore.getGoalFormMonitorSettings.isNavigationDisabled; },
      set(value) { this.viewsStore.updateGoalFormMonitorSettings({ isNavigationDisabled: value }); }
    },
    currentPage: {
      get() { return this.viewsStore.getGoalFormMonitorSettings.currentPage; },
      set(value) { this.viewsStore.updateGoalFormMonitorSettings({ currentPage: value }); }
    },

    // Get unique session names for the session dropdown
    availableSessions() {
      const sessions = [...new Set(this.expInstances.map(i => i.sessionName))];
      return sessions.sort();
    },

    // Format all experiences (preserved from original for backward compatibility)
    formattedExperiences() {
      return this.expInstances.map(instance => ({
        text: `(${instance.sessionName}) ${instance.experienceCategory}: ${instance.experienceName}`,
        value: instance.expInstanceID
      }));
    },

    // Filter experiences based on selected session
    filteredExperiences() {
      if (!this.selectedSession) return [];
      
      return this.expInstances
        .filter(instance => instance.sessionName === this.selectedSession)
        .map(instance => ({
          text: instance.experienceName,
          value: instance.expInstanceID,
          category: instance.experienceCategory
        }))
        .sort((a, b) => a.text.localeCompare(b.text));
    },

    displayedStudents() {
      if (this.completed === true) {
        return this.studentsWithGoalForm;
      } else if (this.completed === false) {
        return this.studentsWithoutGoalForm;
      }
      return [];
    },

    totalStudentsCount() {
      return this.displayedStudents.length;
    },

    // Pagination length for manual pagination (preserved from original)
    totalPaginationLength() {
      return Math.ceil(this.displayedStudents.length / this.itemsPerPage);
    },

    // Paginated students for manual pagination (preserved from original)
    paginatedDisplayedStudents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.displayedStudents.slice(start, end);
    },

    tableHeaders() {
      const headers = [
        { title: this.$t('Student'), align: "start", key: "name", sortable: true },
        { title: this.$t('Email'), key: "email", sortable: true },
        { title: this.$t('Registration Date'), key: "registrationDate", sortable: true },
      ];
      if (this.completed === true) {
        headers.push({ title: this.$t('Actions'), key: "actions", sortable: false, align: "end" });
      }
      return headers;
    },

    csvFileName() {
      if (this.selectedExperience) {
        const selectedObj = this.expInstances.find(
          (instance) => instance.expInstanceID === this.selectedExperience
        );
        const prefix = this.completed === true ? 'completed_goal_forms' : 'no_goal_form';
        return `${prefix}_${selectedObj?.experienceName || 'export'}.csv`;
      }
      return this.completed === true ? 'completed_goal_forms.csv' : 'no_goal_form.csv';
    },
  },

  methods: {
    // Fetches active experience instances for the instructor from the backend API.
    // Upon receiving the response, it maps the instance data to a structured format 
    // and stores it in the component's state.
    async fetchExperiences() {
      let apiURL = import.meta.env.VITE_ROOT_API + '/instructorSideData/experience-instances/active/';

      try {
        const response = await axios.get(apiURL);
        this.expInstances = response.data.map(instance => ({
          expInstanceID: instance._id,
          sessionName: instance.session.name,
          experienceCategory: instance.experience.category,
          experienceName: instance.experience.name,
          registrationDate: instance.registrationDate
        }));
        
        // If there's a selected experience, set the session accordingly
        if (this.selectedExperience) {
          const exp = this.expInstances.find(e => e.expInstanceID === this.selectedExperience);
          if (exp) {
            this.selectedSession = exp.sessionName;
          }
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    // Initiates the process of fetching students based on whether they have completed 
    // goal forms or not. It calls different methods to fetch students with goal forms 
    // or without goal forms based on the value of the `completed` property.
    async fetchStudents() {
      if (this.selectedExperience === null || this.completed === null) return;
      this.loading = true;
      this.studentsWithGoalForm = [];
      this.studentsWithoutGoalForm = [];
      
      try {
        if (this.completed === true) {
          await this.fetchStudentsWithGoalForm();
        } else {
          await this.fetchStudentsWithoutGoalForm();
        }
      } finally {
        this.loading = false;
      }
    },

    // Fetches students who have not completed a goal form for a specific experience.
    // It sends a GET request to the backend API with the selected experience ID.
    // Upon receiving the response, it stores the data of students without a goal form 
    // for the specified experience in the component's state.
    async fetchStudentsWithoutGoalForm() {
      let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-without-goal-form/${this.selectedExperience}`;

      try {
        const response = await axios.get(url);
        this.studentsWithoutGoalForm = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    // Fetches students who have completed a goal form for a specific experience.
    // It sends a GET request to the backend API with the selected experience ID.
    // Upon receiving the response, it stores the data of students with a goal form 
    // for the specified experience in the component's state.
    async fetchStudentsWithGoalForm() {
      let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-with-goal-form/${this.selectedExperience}`;

      try {
        const response = await axios.get(url);
        this.studentsWithGoalForm = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    // Toggles the navigation state
    toggleNavigation() {
      this.isNavigationDisabled = !this.isNavigationDisabled;
    },

    // Handles changes to items per page and resets to page 1
    handleItemsPerPageChange() {
      this.currentPage = 1;
    },

    // Navigates to the student's profile if navigation is enabled
    navigateIfEnabled(userID) {
      if (!this.isNavigationDisabled) {
        this.navigateToProfile(userID);
      }
    },

    // Navigates to the profile page of a specific student identified by their userID.
    navigateToProfile(userID) {
      useLoggedInUserStore().navigationData = { userID: userID };
      this.$router.push({ name: "instructorSpecificStudent" });
    },

    // Gets initials from first and last name for avatar display
    getInitials(firstName, lastName) {
      return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
    },

    // Concatenates the first name and last name to form a full name string.
    formatFullName(firstName, lastName) {
      return `${firstName} ${lastName}`;
    },

    // Formats a date to a readable format.
    formatDate(date) {
      return DateTime.fromISO(date).toFormat("MMM dd, yyyy");
    },

    // Navigates to the page to view the goal form of a specific student identified 
    // by their studentID.
    viewStudentGoalForm(studentID) {
      useLoggedInUserStore().navigationData = {
        studentID: studentID,
        expInstanceID: this.selectedExperience
      };
      this.$router.push({ name: "StudentGoalFormViewer" });
    }
  },
};
</script>

<style scoped>
/* Monitor Content */
.monitor-content {
  background-color: white;
}

/* Toolbar Section */
.toolbar-section {
  padding: 20px 24px;
  background-color: white;
}

.session-select,
.experience-select {
  max-width: 100%;
}

.action-buttons-group {
  gap: 12px;
  flex-wrap: wrap;
}

.refresh-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.completion-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.completion-toggle .v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.stats-row {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.stats-chip {
  font-size: 0.95rem;
}

/* Table Container */
.table-container {
  min-height: 400px;
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

.table-row.navigation-disabled {
  cursor: default;
}

.table-row.navigation-disabled:hover {
  background-color: transparent !important;
}

/* Hover row style from original version */
.hoverRow {
  background-color: #f0f0f0;
  cursor: pointer;
}

.table-cell {
  padding: 10px 16px !important;
  font-size: 0.95rem;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
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

/* Footer Toolbar */
.footer-toolbar {
  padding: 16px 24px;
  background-color: #fafafa;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
}

.nav-toggle-btn {
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

/* Autocomplete focus style from original */
:deep(.v-autocomplete input[type="text"]:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid transparent !important;
  background-color: transparent !important;
}

/* Responsive */
@media (max-width: 960px) {
  .toolbar-section {
    padding: 16px 18px;
  }
  
  .action-buttons-group {
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .toolbar-section {
    padding: 14px 16px;
  }
  
  .table-cell {
    padding: 8px 12px !important;
  }
  
  .footer-toolbar {
    padding: 12px 16px;
  }
}
</style>