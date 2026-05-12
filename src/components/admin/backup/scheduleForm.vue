<!--
/**
 * src/components/admin/backup/scheduleForm.vue
 * 
 * A form component for configuring the recurrence schedule for automatic database backups.
 * It fetches the current schedule, allows the user to select a new recurrence pattern 
 * (e.g., daily, weekly), and saves the updated configuration. On a successful update, it 
 * emits an event to notify the parent component.
 */
-->
<template>
  <div>
    <div v-if="loading" class="text-center py-3">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading schedule…</p>
    </div>

    <!-- Schedule form -->
    <form v-else @submit.prevent="save">
      <v-select
        label="Recurrence"
        v-model="recurrence"
        :items="recurrenceOptions"
        item-title="text"
        item-value="value"
        variant="outlined"
        density="compact"
        class="mb-3"
      ></v-select>

      <v-text-field
        v-model="backupTime"
        type="time"
        label="Backup time"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="mb-3"
        :disabled="recurrence === 'none'"
        :hint="backupTimeHint"
        persistent-hint
      ></v-text-field>

      <v-btn
        type="submit"
        variant="outlined"
        color="primary"
        :loading="saving"
        :disabled="saving"
      >
        {{ saving ? "Saving…" : "Save Schedule" }}
      </v-btn>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from '@/stored/loggedInUser';

export default {
  name: "ScheduleForm",
  emits: ["schedule-updated"],
  data() {
    return {
      recurrence: "biweekly",
      backupTime: "00:00",
      serverTimezone: "",
      recurrenceOptions: [
        { text: "Every day", value: "daily" },
        { text: "Every week", value: "weekly" },
        { text: "Every 2 weeks", value: "biweekly" },
        { text: "Every month", value: "monthly" },
        { text: "No automatic schedule", value: "none" },
      ],
      loading: false,
      saving: false,
    };
  },
  async mounted() {
    this.loading = true;
    const API = import.meta.env.VITE_ROOT_API;
    try {
      const url = `${API}/backup/config`;
      const { data } = await axios.get(url, {
        headers: { token: useLoggedInUserStore().token },
      });
      this.recurrence =
        data.recurrence || data.schedule?.type || 'biweekly';
      this.backupTime =
        data.backupTime ||
        this.cronExprToHHMM(data.schedule?.value) ||
        '00:00';
      this.serverTimezone =
        data.serverTimezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (err) {
      console.error("Failed to load config:", err);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    backupTimeHint() {
      if (this.recurrence === 'none') {
        return 'Not used when no automatic schedule is selected.';
      }
      const tz =
        this.serverTimezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;
      return `Runs at this clock time on the server (${tz}).`;
    },
  },
  methods: {
    /** First two fields of cron: minute hour ... → HH:mm for <input type="time"> */
    cronExprToHHMM(cronExpr) {
      if (!cronExpr || typeof cronExpr !== 'string') return '00:00';
      const parts = cronExpr.trim().split(/\s+/);
      if (parts.length < 2) return '00:00';
      const minute = Number(parts[0]);
      const hour = Number(parts[1]);
      if (!Number.isFinite(minute) || !Number.isFinite(hour)) return '00:00';
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    },
    async save() {
      this.saving = true;
      const API        = import.meta.env.VITE_ROOT_API;
      const url        = `${API}/backup/config`;
      const payload    = {
        recurrence: this.recurrence,
        backupTime: this.recurrence === 'none' ? undefined : this.backupTime,
      };

      try {
        await axios.put(url, payload, {
          headers: { token: useLoggedInUserStore().token },
        });
        toast.success('Schedule updated!');
        this.$emit('schedule-updated');
      } catch (err) {
        console.error(err);
        toast.error("Could not update schedule");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
