<!--
DevMailerMain.vue
Parent container for the Instructor Mailer (Manual Mailer: Entry/Goal/Exit
form reminder emails). Send progress and delivery reports live in the send
dialog of each form tab, so there is no separate Overview screen.
Redesigned UI matching the instructor pages aesthetic.
-->
<template>
  <main class="mailer-page">
    <v-container fluid class="py-8 mailer-container">
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
        <dev-manual-mailer-main />
      </v-card>
    </v-container>
  </main>
</template>

<script>
import DevManualMailerMain from './DevManualMailerMain.vue';

export default {
    name: "DevMailerMain",
    components: {
      DevManualMailerMain
    },
}
</script>

<style scoped>
/* Page Background */
.mailer-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Wide but bounded content area — the dual recipient tables need the room */
.mailer-container {
  max-width: 1700px;
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

/* Responsive */
@media (max-width: 600px) {
  .page-header {
    padding-bottom: 12px;
  }
}
</style>
