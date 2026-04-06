<!--
DevMailerMain.vue
Parent container for the Instructor Mailer. Provides tabbed interface for
Overview, Manual Mailer, and Automatic Mailer sections.
Redesigned UI matching the instructor pages aesthetic.
-->
<template>
  <main class="mailer-page">
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
          <v-icon color="#c8102e" size="36" class="mr-3">mdi-email-outline</v-icon>
          <div class="flex-grow-1">
            <h1 class="text-h4 font-weight-bold">Mailer</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">Send emails to students based on form completion status</p>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <v-card class="main-card" elevation="2">
        <div class="tabs-section">
          <v-tabs
            v-model="tab"
            color="#c8102e"
            class="custom-tabs"
          >
            <v-tab value="overview" class="custom-tab">
              <v-icon start size="22">mdi-view-dashboard-outline</v-icon>
              <span>Overview</span>
            </v-tab>
            <v-tab value="manualMailer" class="custom-tab">
              <v-icon start size="22">mdi-email-edit-outline</v-icon>
              <span>Manual Mailer</span>
            </v-tab>
          </v-tabs>
        </div>

        <v-divider></v-divider>

        <v-window v-model="tab">
          <v-window-item value="overview">
            <dev-mailer-overview />
          </v-window-item>
          <v-window-item value="manualMailer">
            <dev-manual-mailer-main />
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  </main>
</template>

<script>
import { reactive } from 'vue';
import DevMailerOverview from './DevMailerOverview.vue';
import DevManualMailerMain from './DevManualMailerMain.vue';

export default {
    name: "DevMailerMain",
    components: {
      DevMailerOverview,
      DevManualMailerMain
    },
    data() {
      return {
        tab: 'manualMailer',
        emailProgress: reactive({ sent: 0, total: 0, active: false }),
      };
    },
    provide() {
      return {
        setTab: this.setTab,
        emailProgress: this.emailProgress,
      };
    },
    methods: {
      setTab(tab) {
        this.tab = tab;
      }
    },
}
</script>

<style scoped>
/* Page Background */
.mailer-page {
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
