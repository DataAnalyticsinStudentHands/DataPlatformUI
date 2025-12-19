<!-- 
pendingStudents.vue
Instructor-side view showing students who have registered for an account 
but have not yet activated it.
Redesigned UI matching the project pages aesthetic.
-->

<template>
  <div class="monitor-content">
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
            @click="fetchPendingStudents"
            :loading="loading"
            class="refresh-btn mr-3"
          >
            <v-icon start size="18">mdi-refresh</v-icon>
            <span class="d-none d-sm-inline">{{ $t('Refresh') }}</span>
          </v-btn>

          <!-- CSV Download Button -->
          <progress-monitor-csv-downloader 
            v-if="pendingStudents.length" 
            :data="pendingStudents" 
            file-name="pending_students.csv" 
          />
        </v-col>
      </v-row>

      <!-- Stats Row -->
      <div class="stats-row mt-4">
        <v-chip
          color="warning"
          variant="tonal"
          size="large"
          class="stats-chip"
        >
          <v-icon start size="18">mdi-account-clock</v-icon>
          {{ $t('Pending Activations:') }} <strong class="ml-1">{{ totalStudentsCount }}</strong>
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
              @click="navigateToProfile(student._id)"
              class="table-row"
            >
              <td class="table-cell">
                <div class="d-flex align-center">
                  <v-avatar color="warning" variant="tonal" size="36" class="mr-3">
                    <v-icon size="20" color="warning">mdi-account-clock</v-icon>
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
              <td class="table-cell text-right">
                <v-chip
                  size="small"
                  color="warning"
                  variant="flat"
                >
                  <v-icon start size="14">mdi-clock-outline</v-icon>
                  {{ $t('Pending') }}
                </v-chip>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="tableHeaders.length" class="empty-state-cell">
                <div class="empty-state py-12">
                  <v-icon size="56" color="#ccc" class="mb-3">
                    {{ searchQuery ? 'mdi-account-search-outline' : 'mdi-account-check-outline' }}
                  </v-icon>
                  <p class="text-h6 text-medium-emphasis mb-1">
                    {{ searchQuery ? $t('No matching students') : $t('No pending students!') }}
                  </p>
                  <p class="text-body-2 text-disabled mb-0">
                    {{ searchQuery 
                      ? $t('Try adjusting your search query') 
                      : $t('All registered students have activated their accounts') 
                    }}
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import ProgressMonitorCSVDownloader from './progressMonitorCSVDownloader.vue';

export default {
  name: "PendingStudents",
  data() {
    return {
      pendingStudents: [],
      loading: false,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
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
    this.fetchPendingStudents();
  },

  computed: {
    tableHeaders() {
      return [
        { title: this.$t('Student'), align: "start", key: "name", sortable: true },
        { title: this.$t('Email'), key: "email", sortable: true },
        { title: this.$t('Status'), key: "status", sortable: false, align: "end" },
      ];
    },

    filteredStudents() {
      if (!this.searchQuery) {
        return this.pendingStudents;
      }
      const query = this.searchQuery.toLowerCase();
      return this.pendingStudents.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const email = student.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    },

    totalStudentsCount() {
      return this.pendingStudents.length;
    },
  },

  methods: {
    async fetchPendingStudents() {
      this.loading = true;
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/user/check-status';

      try {
        const response = await axios.get(url, { headers: { token } });
        this.pendingStudents = response.data;
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    navigateToProfile(userID) {
      useLoggedInUserStore().navigationData = { userID: userID };
      this.$router.push({ name: "instructorSpecificStudent" });
    },
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
}

@media (max-width: 600px) {
  .toolbar-section {
    padding: 14px 16px;
  }
  
  .table-cell {
    padding: 14px 12px !important;
  }
}
</style>