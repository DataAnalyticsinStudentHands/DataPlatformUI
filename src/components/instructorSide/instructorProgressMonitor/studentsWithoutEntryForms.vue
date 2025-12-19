<!-- 
studentsWithoutEntryForms.vue
Instructor-side view showing students who have registered and activated their account 
but have not yet completed a Student Entry Form.
Redesigned UI matching the project pages aesthetic.
-->

<template>
  <div class="monitor-content">
    <!-- Context Banner -->
    <div class="context-banner">
      <div class="banner-content">
        <div class="banner-icon">
          <v-icon color="#c8102e" size="22">mdi-file-document-alert-outline</v-icon>
        </div>
        <div class="banner-text">
          <h3 class="banner-title">{{ $t('Missing Entry Forms') }}</h3>
          <p class="banner-description">
            {{ $t('Students listed below have registered and activated their accounts, but have not yet submitted their Student Entry Form.') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Toolbar Section -->
    <div class="toolbar-section">
      <v-row align="center" no-gutters>
        <!-- Search Field -->
        <v-col cols="12" md="5" class="pr-md-3 mb-3 mb-md-0">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('Search by name or email...')"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="search-field"
          >
            <template v-slot:prepend-inner>
              <v-icon color="#666" size="20">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-col>

        <v-spacer class="d-none d-md-flex"></v-spacer>

        <!-- Action Buttons -->
        <v-col cols="12" md="auto" class="d-flex align-center action-buttons-group">
          <!-- Refresh Button -->
          <v-btn
            variant="outlined"
            size="default"
            @click="fetchStudentsWithoutEntryForm"
            :loading="loading"
            class="refresh-btn mr-3"
          >
            <v-icon start size="18">mdi-refresh</v-icon>
            <span class="d-none d-sm-inline">{{ $t('Refresh') }}</span>
          </v-btn>
          
          <!-- CSV Download Button -->
          <progress-monitor-csv-downloader 
            v-if="studentsWithoutEntryForm.length" 
            :data="studentsWithoutEntryForm" 
            file-name="students_without_entry_form.csv" 
          />
        </v-col>
      </v-row>

      <!-- Stats Row -->
      <div class="stats-row mt-4">
        <v-chip
          color="#c8102e"
          variant="tonal"
          size="large"
          class="stats-chip"
        >
          <v-icon start size="18">mdi-alert-circle-outline</v-icon>
          {{ $t('Pending Entry Forms:') }} <strong class="ml-1">{{ totalStudentsCount }}</strong>
        </v-chip>
        <v-chip
          v-if="searchQuery"
          color="grey"
          variant="tonal"
          size="large"
          class="stats-chip ml-2"
        >
          <v-icon start size="18">mdi-filter-outline</v-icon>
          {{ $t('Showing:') }} <strong class="ml-1">{{ filteredStudents.length }}</strong>
        </v-chip>
      </div>
    </div>

    <v-divider></v-divider>

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

    <!-- Table Container -->
    <div v-else class="table-container">
      <v-data-table
        :headers="tableHeaders"
        :items="filteredStudents"
        item-key="_id"
        hover
        class="students-table"
        :mobile-breakpoint="600"
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items-per-page-options="itemsPerPageOptions"
      >
        <!-- Table Body -->
        <template v-slot:body="{ items }">
          <template v-if="items.length > 0">
            <tr 
              v-for="student in items" 
              :key="student._id" 
              @click="navigateIfEnabled(student._id)"
              class="table-row"
              :class="{ 'navigation-disabled': isNavigationDisabled }"
            >
              <td class="table-cell">
                <div class="d-flex align-center">
                  <v-avatar color="#c8102e" variant="tonal" size="36" class="mr-3">
                    <span class="text-body-2 font-weight-medium" style="color: #c8102e;">
                      {{ getInitials(student.firstName, student.lastName) }}
                    </span>
                  </v-avatar>
                  <div>
                    <span class="font-weight-medium d-block">{{ student.firstName }} {{ student.lastName }}</span>
                    <span class="text-caption text-medium-emphasis d-sm-none">{{ student.email }}</span>
                  </div>
                </div>
              </td>
              <td class="table-cell d-none d-sm-table-cell">
                <span class="text-medium-emphasis">{{ student.email }}</span>
              </td>
              <td class="table-cell d-none d-md-table-cell">
                <span class="text-body-2 text-medium-emphasis">{{ formatDate(student.createdAt) }}</span>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="tableHeaders.length" class="empty-state-cell">
                <div class="empty-state py-12">
                  <v-icon size="56" color="success" class="mb-3">
                    {{ searchQuery ? 'mdi-account-search-outline' : 'mdi-file-document-check-outline' }}
                  </v-icon>
                  <p class="text-h6 text-medium-emphasis mb-1">
                    {{ searchQuery ? $t('No matching students') : $t('All students have submitted entry forms!') }}
                  </p>
                  <p class="text-body-2 text-disabled mb-0">
                    {{ searchQuery 
                      ? $t('Try adjusting your search query') 
                      : $t('Great job! All registered students have completed their Entry Forms') 
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
  name: "StudentsWithoutEntryForms",
  setup() {
    const viewsStore = useInstructorViewsStore();
    return { viewsStore };
  },
  data() {
    return {
      studentsWithoutEntryForm: [],
      loading: false,
      searchQuery: '',
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
  mounted() {
    this.fetchStudentsWithoutEntryForm();
  },

  computed: {
    // Sync with store
    itemsPerPage: {
      get() { return this.viewsStore.getEntryFormMonitorSettings.itemsPerPage; },
      set(value) { this.viewsStore.updateEntryFormMonitorSettings({ itemsPerPage: parseInt(value) || 10 }); }
    },
    isNavigationDisabled: {
      get() { return this.viewsStore.getEntryFormMonitorSettings.isNavigationDisabled; },
      set(value) { this.viewsStore.updateEntryFormMonitorSettings({ isNavigationDisabled: value }); }
    },
    currentPage: {
      get() { return this.viewsStore.getEntryFormMonitorSettings.currentPage; },
      set(value) { this.viewsStore.updateEntryFormMonitorSettings({ currentPage: value }); }
    },

    tableHeaders() {
      return [
        { title: this.$t('Student'), align: "start", key: "name", sortable: true },
        { title: this.$t('Email'), key: "email", sortable: true },
        { title: this.$t('Account Created'), key: "createdAt", sortable: true },
      ];
    },

    filteredStudents() {
      if (!this.searchQuery) {
        return this.studentsWithoutEntryForm;
      }
      const query = this.searchQuery.toLowerCase();
      return this.studentsWithoutEntryForm.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const email = student.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    },

    totalStudentsCount() {
      return this.studentsWithoutEntryForm.length;
    },
  },

  methods: {
    async fetchStudentsWithoutEntryForm() {
      this.loading = true;
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/students-without-entry-form';

      try {
        const response = await axios.get(url, { headers: { token } });
        this.studentsWithoutEntryForm = response.data;
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    toggleNavigation() {
      this.isNavigationDisabled = !this.isNavigationDisabled;
    },

    navigateIfEnabled(userID) {
      if (!this.isNavigationDisabled) {
        this.navigateToProfile(userID);
      }
    },

    navigateToProfile(userID) {
      useLoggedInUserStore().navigationData = { userID: userID };
      this.$router.push({ name: "instructorSpecificStudent" });
    },

    getInitials(firstName, lastName) {
      return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
    },

    formatDate(date) {
      return DateTime.fromISO(date).toFormat("MMM dd, yyyy");
    },
  },
};
</script>

<style scoped>
/* Monitor Content */
.monitor-content {
  background-color: white;
}

/* Context Banner */
.context-banner {
  background-color: rgba(200, 16, 46, 0.06);
  border-bottom: 1px solid rgba(200, 16, 46, 0.12);
  padding: 16px 24px;
}

.banner-content {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.banner-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(200, 16, 46, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 1rem;
  font-weight: 600;
  color: #c8102e;
  margin: 0 0 2px 0;
}

.banner-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* Toolbar Section */
.toolbar-section {
  padding: 20px 24px;
  background-color: white;
}

.search-field {
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

.stats-row {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stats-chip {
  font-size: 0.95rem;
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
  padding: 14px 18px !important;
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

.table-cell {
  padding: 16px 18px !important;
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

/* Responsive */
@media (max-width: 960px) {
  .toolbar-section {
    padding: 16px 18px;
  }
  
  .context-banner {
    padding: 14px 18px;
  }
}

@media (max-width: 600px) {
  .toolbar-section {
    padding: 14px 16px;
  }
  
  .context-banner {
    padding: 12px 16px;
  }
  
  .banner-content {
    gap: 12px;
  }
  
  .banner-icon {
    width: 36px;
    height: 36px;
  }
  
  .table-cell {
    padding: 14px 12px !important;
  }
  
  .footer-toolbar {
    padding: 12px 16px;
  }
}
</style>