<!--
/**
 * src/components/admin/BackupDashboard.vue
 * 
 * Main dashboard component for managing database backups. It integrates ScheduleForm, 
 * CollectionsForm, and HistoryTable to provide a comprehensive UI for scheduling, 
 * configuring, and viewing backup history.
 */
-->
<template>
  <v-container class="py-4">
    <h1 class="text-h4 font-weight-bold">{{ $t("Database Backup") }}</h1>

    <!-- Display next scheduled run time -->
    <p class="mb-3">
      <strong>Next scheduled run:</strong>
      {{ nextRunDisplay }}
    </p>

    <v-row>
      <v-col cols="12" md="6">
        <!-- Recurrence configuration -->
        <v-card class="pa-3">
          <v-card-title>Backup Schedule</v-card-title>
          <v-card-text>
            <ScheduleForm @schedule-updated="fetchNextRun" />
          </v-card-text>
        </v-card>

        <!-- Collections selection -->
        <v-card class="pa-3 mt-4">
          <v-card-title>Collections</v-card-title>
          <v-card-text>
            <CollectionsForm @collections-changed="onCollectionsChanged" />
          </v-card-text>
        </v-card>

        <!-- Manual trigger button -->
        <v-card class="pa-3 mt-4 text-center">
          <v-btn
            color="primary"
            block
            :loading="running"
            :disabled="running"
            @click="runNow"
          >
            {{ running ? "Running…" : "Run Backup Now" }}
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <!-- Backup history table -->
        <v-card class="pa-3">
          <v-card-title>Backup History</v-card-title>
          <v-card-text>
            <HistoryTable ref="historyTable" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

import ScheduleForm from "./backup/ScheduleForm.vue";
import CollectionsForm from "./backup/CollectionsForm.vue";
import HistoryTable from "./backup/HistoryTable.vue";

export default {
  name: "BackupDashboard",
  components: { ScheduleForm, CollectionsForm, HistoryTable },

  data() {
    return {
      nextRun: null, // ISO string for the next scheduled backup
      running: false,
      selectedCollections: [],
      isLoadingNextRun: true, // Track loading state
    };
  },
  computed: {
    nextRunDisplay() {
      if (this.isLoadingNextRun) {
        return "Loading…";
      }

      if (!this.nextRun) {
        return "Not scheduled";
      }

      try {
        return new Date(this.nextRun).toLocaleString();
      } catch (err) {
        console.error("Error formatting date:", err);
        return "Invalid date";
      }
    },
  },
  async mounted() {
    await this.fetchNextRun();
  },
  methods: {
    onCollectionsChanged(list) {
      // Receives updated collection list from CollectionsForm.
      this.selectedCollections = list;
    },
    async fetchNextRun() {
      // Retrieves the nextRun timestamp from /backup/config
      this.isLoadingNextRun = true;

      const API = import.meta.env.VITE_ROOT_API;
      const userStore = useLoggedInUserStore();
      const headers = { token: userStore.token };
      const url = `${API}/backup/config`;

      try {
        const { data } = await axios.get(url, { headers });

        // Backend now returns nextRun in the config response
        this.nextRun = data.nextRun || null;

        console.log("[BackupDashboard] Next run loaded:", this.nextRun);
      } catch (err) {
        console.error("[BackupDashboard] Could not load schedule:", err);
        toast.error("Failed to load backup schedule.");
        this.nextRun = null;
      } finally {
        this.isLoadingNextRun = false;
      }
    },
    async runNow() {
      // Triggers an ad-hoc backup
      this.running = true;
      const API = import.meta.env.VITE_ROOT_API;
      const userStore = useLoggedInUserStore();
      const headers = { token: userStore.token };
      const url = `${API}/backup/run`;

      try {
        await axios.post(url, null, { headers });
        toast.success("Backup completed!");

        // Refresh next run time and history
        await this.fetchNextRun();
        if (this.$refs.historyTable) {
          await this.$refs.historyTable.loadHistory();
        }
      } catch (err) {
        console.error("[BackupDashboard] Backup failed:", err);
        toast.error("Backup failed. Check console for details.");
      } finally {
        this.running = false;
      }
    },
    onScheduleUpdated(newNextRun) {
      // Handler for ScheduleForm's update event
      console.log("[BackupDashboard] Schedule updated, refreshing...");
      this.fetchNextRun();
    },
  },
};
</script>

<style scoped>
.v-card-title {
  padding-left: 0;
  padding-top: 0;
}
</style>
