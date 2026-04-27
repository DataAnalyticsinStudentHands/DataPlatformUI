<!--
DevManualMailerMain.vue
Manual Mailer sub-container with tabbed interface for Entry Forms and Goal Forms.
Redesigned UI matching the instructor pages aesthetic.
-->
<template>
  <div>
    <!-- Tabs Section -->
    <div class="tabs-section">
      <v-tabs
        v-model="selection"
        color="#c8102e"
        class="custom-tabs"
      >
        <v-tab :value="1" class="custom-tab">
          <v-icon start size="22">mdi-file-document-outline</v-icon>
          <span>Entry Forms</span>
        </v-tab>
        <v-tab :value="2" class="custom-tab">
          <v-icon start size="22">mdi-target</v-icon>
          <span>Goal Forms</span>
        </v-tab>
        <v-tab :value="3" class="custom-tab">
          <v-icon start size="22">mdi-exit-run</v-icon>
          <span>Exit Forms</span>
        </v-tab>
      </v-tabs>
    </div>

    <v-divider></v-divider>

    <!-- Tab Content -->
    <v-window v-model="selection">
      <v-window-item :value="1">
        <dev-manual-mailer-entry-forms />
      </v-window-item>
      <v-window-item :value="2">
        <dev-manual-mailer-goal-forms />
      </v-window-item>
      <v-window-item :value="3">
        <dev-manual-mailer-exit-forms />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import DevManualMailerEntryForms from './DevManualMailerEntryForms.vue';
import DevManualMailerGoalForms from './DevManualMailerGoalForms.vue';
import DevManualMailerExitForms from './DevManualMailerExitForms.vue';
export default {
    name: 'DevManualMailerMain',
    components: {
        DevManualMailerEntryForms,
        DevManualMailerGoalForms,
        DevManualMailerExitForms
    },
    data() {
      return {
        selection: 1,
      };
    },
}
</script>

<style scoped>
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
</style>
