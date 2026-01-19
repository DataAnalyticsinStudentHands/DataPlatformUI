<!-- 
instructorDataManagementMain.vue
Parent container for Instructor Data Management. Renders child components:
  instructorActivities
  instructorExperiences
  instructorSessions
Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="data-management-page">
    <v-container class="py-8">
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
          <v-icon color="#c8102e" size="36" class="mr-3">mdi-database-cog-outline</v-icon>
          <div class="flex-grow-1">
            <h1 class="text-h4 font-weight-bold">{{ $t('Data Management') }}</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">{{ $t('Manage sessions, experiences, and activities') }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <v-card class="main-card" elevation="2">
        <!-- Tabs Section -->
        <div class="tabs-section">
          <v-tabs
            v-model="tab"
            color="#c8102e"
            class="custom-tabs"
          >
            <v-tab :value="0" class="custom-tab" @click="selectTab(0)">
              <v-icon start size="22">mdi-calendar-range</v-icon>
              <span class="d-none d-sm-inline">{{ $t('Sessions') }}</span>
              <span class="d-inline d-sm-none">{{ $t('Sessions') }}</span>
            </v-tab>
            <v-tab :value="1" class="custom-tab" @click="selectTab(1)">
              <v-icon start size="22">mdi-school-outline</v-icon>
              <span class="d-none d-sm-inline">{{ $t('Experiences') }}</span>
              <span class="d-inline d-sm-none">{{ $t('Exp') }}</span>
            </v-tab>
            <v-tab :value="2" class="custom-tab" @click="selectTab(2)">
              <v-icon start size="22">mdi-clipboard-list-outline</v-icon>
              <span class="d-none d-sm-inline">{{ $t('Activities') }}</span>
              <span class="d-inline d-sm-none">{{ $t('Act') }}</span>
            </v-tab>
          </v-tabs>
        </div>

        <v-divider></v-divider>

        <!-- Tab Content -->
        <v-window v-model="tab">
          <!-- Sessions Tab -->
          <v-window-item :value="0">
            <instructor-sessions />
          </v-window-item>

          <!-- Experiences Tab -->
          <v-window-item :value="1">
            <instructor-experiences />
          </v-window-item>

          <!-- Activities Tab -->
          <v-window-item :value="2">
            <instructor-activities />
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  </main>
</template>

<script>
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

import instructorActivities from './instructorActivities.vue';
import instructorExperiences from './instructorExperiences.vue';
import instructorSessions from './instructorSessions.vue';

export default {
  name: "InstructorDataManagementMain",
  components: {
    instructorActivities,
    instructorExperiences,
    instructorSessions,
  },

  data() {
    return {
      tab: 0,
    };
  },

  watch: {
    // Watches for changes in the route and re-initializes the component
    '$route': function() {
      this.initializeComponent();
    }
  },

  mounted() {
    // Initializes the component and loads the active tab when the component is mounted
    this.initializeComponent();
    this.loadActiveTab();
  },

  methods: {
    // Initializes the component by checking if there's an activeTab in Pinia's navigationData
    initializeComponent() {
      const store = useLoggedInUserStore();

      // Check if there's an activeTab in Pinia's navigationData
      if (store.navigationData?.activeTab !== undefined) {
        // If there is, use it and update the store
        this.tab = parseInt(store.navigationData.activeTab);
        store.instructorDataManagementActiveTab = this.tab;
      } else {
        // If not, load the tab from the store
        this.tab = store.instructorDataManagementActiveTab;
      }

      // Handle toast messages from Pinia's navigationData
      if (store.navigationData?.toastType) {
        toast[store.navigationData.toastType](store.navigationData.toastMessage, { 
          position: store.navigationData.toastPosition,
          toastClassName: store.navigationData.toastCSS,
          limit: 1,
        });

        // Clear navigationData after showing the toast
        store.navigationData = null;
      }
    },

    // Updates the selected tab to the specified index
    selectTab(index) {
      this.tab = index;
      const store = useLoggedInUserStore();
      store.instructorDataManagementActiveTab = index;
    },

    // Loads the active tab from the store
    loadActiveTab() {
      const store = useLoggedInUserStore();
      this.tab = store.instructorDataManagementActiveTab !== undefined ? store.instructorDataManagementActiveTab : 0;
    },
  }
};
</script>

<style scoped>
/* Page Background */
.data-management-page {
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

/* Tabs Section */
.tabs-section {
  background-color: #fafafa;
}

.custom-tabs {
  border-bottom: 1px solid #e8e8e8;
}

.custom-tab {
  text-transform: none;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.25px;
  min-width: 120px;
  height: 52px;
}

/* Responsive */
@media (max-width: 600px) {
  .page-header {
    padding-bottom: 12px;
  }
  
  .custom-tab {
    min-width: 80px;
    padding: 0 12px;
  }
}
</style>