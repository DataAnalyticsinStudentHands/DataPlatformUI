<!--
 backupDashboard.vue

Main dashboard component for managing database backups. 
-->
<template>
  <v-container class="py-4">
    <h1 class="text-h4 font-weight-bold">{{ $t("Database Backup") }}</h1>

    <!-- Display next scheduled run time -->
    <p class="mb-1">
      <strong>Next scheduled run:</strong>
      {{ nextRunDisplay }}
    </p>
    <p class="text-caption text-medium-emphasis mb-3">
      All times shown in your local timezone ({{ timezoneDisplay }})
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
            <CollectionsForm />
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

import ScheduleForm from "./backup/scheduleForm.vue";
import CollectionsForm from "./backup/collectionsForm.vue";
import HistoryTable from "./backup/historyTable.vue";

function formatLocalDateTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default {
  name: "BackupDashboard",
  components: { ScheduleForm, CollectionsForm, HistoryTable },

  data() {
    return {
      nextRun: null, // ISO string for the next scheduled backup
      lastBackup: null,
      lastBackupStatus: null,
      running: false,
      isLoadingNextRun: true,
      refreshTimer: null,
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

      const formatted = formatLocalDateTime(this.nextRun);
      return formatted === "—" ? "Invalid date" : formatted;
    },
    lastBackupDisplay() {
      if (!this.lastBackup) {
        return "Never";
      }
      return formatLocalDateTime(this.lastBackup);
    },
    lastBackupStatusDisplay() {
      if (!this.lastBackupStatus) {
        return "Not available";
      }
      const normalized = String(this.lastBackupStatus).toLowerCase();
      return normalized === "success" ? "Success" : "Failed";
    },
    lastBackupStatusClass() {
      if (!this.lastBackupStatus) {
        return "status-muted";
      }
      const normalized = String(this.lastBackupStatus).toLowerCase();
      return normalized === "success" ? "status-success" : "status-failed";
    },
    timezoneDisplay() {
      // Always the viewer's own timezone; server time is never shown.
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    apiBase(){
      return import.meta.env.VITE_ROOT_API;
    }
  },
  async mounted() {
    await this.fetchNextRun();
    this.refreshTimer = setInterval(() => {
      this.fetchNextRun({ quiet: true });
    }, 60000);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
  },
  methods: {
    async fetchNextRun({ quiet = false } = {}) {
      // Retrieves the nextRun timestamp from the API
      if (!quiet) {
        this.isLoadingNextRun = true;
      }

      try {
        const { data } = await axios.get(`${this.apiBase}/backup/config`, {
          headers: this.getHeaders(),
        });

        this.nextRun = data.nextRun || null;
        this.lastBackup = data.lastBackup || null;
        this.lastBackupStatus = data.lastBackupStatus || null;
      } catch (err) {
        console.error("[Backup] load next run failed:", err.message);
        if (!quiet) {
          toast.error("Failed to load backup schedule.", {
            position: "top-right",
            toastClassName: "Toastify__toast--delete",
            multiple: false,
          });
        }
        this.nextRun = null;
      } finally {
        if (!quiet) {
          this.isLoadingNextRun = false;
        }
      }
    },
    async handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        await this.fetchNextRun({ quiet: true });
      }
    },
    async runNow() {
      // Runs ad-hoc backup
      this.running = true;

      try {
        await axios.post(`${this.apiBase}/backup/run`, null, {
          headers: this.getHeaders(),
        });
        toast.success("Backup completed!", {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
          multiple: false,
        });

        // Fetches next run time and history
        await this.fetchNextRun();
        if (this.$refs.historyTable) {
          await this.$refs.historyTable.loadHistory();
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "request failed";
        console.error("[Backup] POST /run failed:", msg);
        toast.error("Backup failed", {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: false,
        });
      } finally {
        this.running = false;
      }
    },
    getHeaders(){
      return { token: useLoggedInUserStore().token };
    },
  },
};
</script>

<style scoped>
.v-card-title {
  padding-left: 0;
  padding-top: 0;
}
.status-success {
  color: #2e7d32;
  font-weight: 600;
}
.status-failed {
  color: #c62828;
  font-weight: 600;
}
.status-muted {
  color: #666;
}
</style>
