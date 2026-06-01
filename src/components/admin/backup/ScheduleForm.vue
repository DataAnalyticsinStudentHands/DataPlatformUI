<!--
 scheduleForm.vue
 
 Form component for configuring the recurrence schedule for automatic database backups.
-->
<template>
  <div>
    <div v-if="loading" class="text-center py-3">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading schedule…</p>
    </div>

    <!-- Schedule form -->
    <form v-else @submit.prevent="save">
      <!-- Recurrence select -->
      <v-select
        label="Recurrence"
        v-model="recurrence"
        :items="recurrenceOptions"
        item-title="text"
        item-value="value"
        variant="outlined"
        density="compact"
      ></v-select>

      <!-- Backup time -->
      <!--
        A custom clock icon is appended so the picker affordance looks and
        behaves the same across browsers. Firefox's native time input does not
        render a clock indicator (unlike Chrome/Edge), so we supply our own and
        open the picker via the standard showPicker() API.
      -->
      <v-text-field
        ref="timeField"
        class="backup-time-field"
        label="Backup time"
        v-model="backupTime"
        type="time"
        variant="outlined"
        density="compact"
        :disabled="recurrence === 'none'"
        append-inner-icon="mdi-clock-outline"
        @click:append-inner="openTimePicker"
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
import axios from "axios";
import { toast } from "vue3-toastify";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "ScheduleForm",
  emits: ["schedule-updated"],
  data() {
    return {
      recurrence: "biweekly",
      backupTime: "00:00",
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
  computed: {
    apiBase() {
      return import.meta.env.VITE_ROOT_API;
    },
  },
  async mounted() {
    this.loading = true;
    try {
      const { data } = await axios.get(`${this.apiBase}/backup/config`, {
        headers: this.getHeaders(),
      });
      this.recurrence = data?.schedule?.type || "biweekly";
      this.backupTime = this.extractTimeFromSchedule(data?.schedule?.value);
    } catch (err) {
      console.error("[Backup] load schedule form failed:", err.message);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    getHeaders() {
      return { token: useLoggedInUserStore().token };
    },
    openTimePicker() {
      if (this.recurrence === "none") return;
      const input = this.$refs.timeField?.$el?.querySelector('input[type="time"]');
      if (!input) return;
      if (typeof input.showPicker === "function") {
        try {
          input.showPicker();
          return;
        } catch (e) {
          // showPicker can throw if the input is not user-activated; fall back.
        }
      }
      input.focus();
    },
    extractTimeFromSchedule(cronExpr) {
      if (!cronExpr || typeof cronExpr !== "string") return "00:00";
      const parts = cronExpr.trim().split(/\s+/);
      if (parts.length < 2) return "00:00";

      const minute = Number(parts[0]);
      const hour = Number(parts[1]);
      const isValid =
        Number.isInteger(minute) &&
        Number.isInteger(hour) &&
        minute >= 0 &&
        minute <= 59 &&
        hour >= 0 &&
        hour <= 23;

      if (!isValid) return "00:00";

      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    },
    toCron(recurrence, time) {
      const [hourStr = "00", minuteStr = "00"] = (time || "00:00").split(":");
      const hour = Number(hourStr);
      const minute = Number(minuteStr);
      const safeHour = Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : 0;
      const safeMinute =
        Number.isInteger(minute) && minute >= 0 && minute <= 59 ? minute : 0;

      const map = {
        daily: `${safeMinute} ${safeHour} * * *`,
        weekly: `${safeMinute} ${safeHour} * * 0`,
        biweekly: `${safeMinute} ${safeHour} */14 * *`,
        monthly: `${safeMinute} ${safeHour} 1 * *`,
      };

      return map[recurrence];
    },
    async save() {
      this.saving = true;

      let payload;
      if (this.recurrence === "none") {
        payload = { enabled: false };
      } else {
        payload = {
          enabled: true,
          schedule: {
            type: this.recurrence,
            value: this.toCron(this.recurrence, this.backupTime),
          },
          // Send the user's local timezone so the backend interprets the
          // chosen backup time as their local wall-clock time.
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }

      try {
        await axios.put(`${this.apiBase}/backup/config`, payload, {
          headers: this.getHeaders(),
        });
        toast.success("Schedule updated!", {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
          multiple: false,
        });
        this.$emit("schedule-updated");
      } catch (err) {
        console.error("[Backup] save schedule failed:", err.message);
        toast.error("Could not update schedule", {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: false,
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
/* Hide the browser's built-in time picker indicator (Chrome/Edge) so we only
   ever show our own appended clock icon, keeping the field identical in every
   browser. */
.backup-time-field :deep(input[type="time"])::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
