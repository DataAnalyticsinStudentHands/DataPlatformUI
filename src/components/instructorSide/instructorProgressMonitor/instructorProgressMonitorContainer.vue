<!-- 
instructorProgressMonitorContainer.vue
Instructor-side progress monitoring dashboard. Provides tabbed interface for tracking 
student form completion across Entry Forms, Goal Forms, Exit Forms, and Pending registrations.
Redesigned UI matching the project pages aesthetic.
-->

<template>
  <main class="progress-monitor-page">
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
          <v-icon color="#c8102e" size="36" class="mr-3">mdi-chart-timeline-variant</v-icon>
          <div class="flex-grow-1">
            <div class="d-flex align-center flex-wrap">
              <h1 class="text-h4 font-weight-bold mr-3">{{ $t('Student Progress Monitor') }}</h1>
            </div>
            <p class="text-body-1 text-medium-emphasis mb-0">{{ $t('Track form completion and student registration status') }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <v-card class="main-card" elevation="2">
        <!-- Tabs Section -->
        <div class="tabs-section">
          <v-tabs
            v-model="activeTab"
            color="#c8102e"
            class="custom-tabs"
          >
            <v-tab v-if="showStudentsWithoutEntryForms" value="entryForms" class="custom-tab">
              <v-icon start size="22">mdi-file-document-outline</v-icon>
              <span class="d-none d-sm-inline">{{ $t('Entry Forms') }}</span>
              <span class="d-inline d-sm-none">{{ $t('Entry') }}</span>
            </v-tab>
            <v-tab value="goalForms" class="custom-tab">
              <v-icon start size="22">mdi-target</v-icon>
              <span class="d-none d-sm-inline">{{ $t('Goal Forms') }}</span>
              <span class="d-inline d-sm-none">{{ $t('Goals') }}</span>
            </v-tab>
            <v-tab value="exitForms" class="custom-tab">
              <v-icon start size="22">mdi-exit-to-app</v-icon>
              <span class="d-none d-sm-inline">{{ $t('Exit Forms') }}</span>
              <span class="d-inline d-sm-none">{{ $t('Exit') }}</span>
            </v-tab>
            <v-tab value="pending" class="custom-tab">
              <v-icon start size="22">mdi-account-clock-outline</v-icon>
              <span class="d-none d-sm-inline">{{ $t('Pending Students') }}</span>
              <span class="d-inline d-sm-none">{{ $t('Pending') }}</span>
            </v-tab>
          </v-tabs>
        </div>

        <v-divider></v-divider>

        <!-- Tab Content -->
        <v-window v-model="activeTab">
          <!-- Entry Form Monitor Tab -->
          <v-window-item v-if="showStudentsWithoutEntryForms" value="entryForms">
            <StudentsWithoutEntryForms />
          </v-window-item>

          <!-- Goal Form Monitor Tab -->
          <v-window-item value="goalForms">
            <StudentsWithoutGoalForms />
          </v-window-item>

          <!-- Exit Form Monitor Tab -->
          <v-window-item value="exitForms">
            <StudentsWithoutExitForms />
          </v-window-item>

          <!-- Pending Students Tab -->
          <v-window-item value="pending">
            <PendingStudents />
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  </main>
</template>

<script>
import { computed } from 'vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { useInstructorViewsStore } from "@/stored/instructorViews";
import StudentsWithoutGoalForms from './studentsWithoutGoalForms.vue';
import StudentsWithoutEntryForms from './studentsWithoutEntryForms.vue';
import PendingStudents from './pendingStudents.vue';
import StudentsWithoutExitForms from './studentsWithoutExitForms.vue';

export default {
  name: "InstructorProgressMonitorContainer",
  setup() {
    const userStore = useLoggedInUserStore();
    const viewsStore = useInstructorViewsStore();

    const showStudentsWithoutEntryForms = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
      return allowedRoles.includes(userStore.role);
    });

    return {
      userStore,
      viewsStore,
      showStudentsWithoutEntryForms: showStudentsWithoutEntryForms.value
    };
  },
  components: {
    StudentsWithoutGoalForms,
    StudentsWithoutEntryForms,
    PendingStudents,
    StudentsWithoutExitForms
  },
  computed: {
    activeTab: {
      get() {
        return this.viewsStore.getProgressMonitorTab;
      },
      set(value) {
        this.viewsStore.setProgressMonitorTab(value);
      }
    }
  }
};
</script>

<style scoped>
/* Page Background */
.progress-monitor-page {
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