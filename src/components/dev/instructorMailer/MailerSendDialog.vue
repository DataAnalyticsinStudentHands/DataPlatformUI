<!--
MailerSendDialog.vue
Shared send dialog for the Manual Mailer forms.
Three phases driven by the parent:
  confirm — recipient count + duration note + unknown-placeholder warning
  sending — live progress bar (SSE snapshots) or indeterminate fallback
  report  — delivery report (success / partial / allFailed / error / unknownOutcome)
Purely presentational: the parent owns all send state.
-->
<template>
  <v-dialog :model-value="modelValue" persistent max-width="600px" @update:model-value="onDialogInput">
    <v-card class="dialog-card">
      <!-- Confirm phase -->
      <template v-if="phase === 'confirm'">
        <v-card-title class="text-h5 pa-6 pb-2">
          Confirm Email
        </v-card-title>
        <v-card-text class="pa-6 pt-2">
          <p>Are you sure you want to send emails to <strong>{{ recipientCount }}</strong> students?</p>
          <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
            Emails are sent one at a time (about a second each), so large batches can take
            several minutes. Keep this page open until sending finishes.
          </p>
          <v-alert
            v-if="unknownTokens.length"
            type="warning"
            density="compact"
            variant="tonal"
            class="mt-4"
          >
            {{ unknownTokens.join(', ') }}
            {{ unknownTokens.length === 1 ? 'is not a supported placeholder' : 'are not supported placeholders' }}
            and will appear as literal text in the email.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" class="action-btn" @click="close">
            Cancel
          </v-btn>
          <v-btn color="#c8102e" variant="flat" class="action-btn submit-btn" @click="$emit('confirm')">
            Yes, Send
          </v-btn>
        </v-card-actions>
      </template>

      <!-- Sending phase -->
      <template v-else-if="phase === 'sending'">
        <v-card-title class="text-h5 pa-6 pb-2">
          Sending Emails&hellip;
        </v-card-title>
        <v-card-text class="pa-6 pt-2">
          <template v-if="progress">
            <v-progress-linear
              :model-value="progress.total ? (progress.attempted / progress.total) * 100 : 0"
              color="#c8102e"
              height="10"
              rounded
            ></v-progress-linear>
            <p class="text-body-2 mt-3 mb-0">
              {{ progress.attempted }} of {{ progress.total }} processed &mdash;
              {{ progress.sent }} sent,
              <span :class="progress.failedCount > 0 ? 'text-error' : ''">{{ progress.failedCount }} failed</span>
            </p>
          </template>
          <template v-else>
            <v-progress-linear indeterminate color="#c8102e" height="10" rounded></v-progress-linear>
            <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
              Sending&hellip; live progress is unavailable. This can take several minutes &mdash;
              keep this page open.
            </p>
          </template>
        </v-card-text>
      </template>

      <!-- Report phase -->
      <template v-else-if="phase === 'report'">
        <v-card-title class="text-h5 pa-6 pb-2 d-flex align-center">
          <v-icon :color="reportIcon.color" size="28" class="mr-2">{{ reportIcon.icon }}</v-icon>
          {{ reportTitle }}
        </v-card-title>
        <v-card-text class="pa-6 pt-2">
          <p v-if="reportBody" class="mb-0">{{ reportBody }}</p>

          <template v-if="result && result.failed && result.failed.length">
            <p class="text-body-2 font-weight-medium mt-4 mb-2">The following could not be sent:</p>
            <div class="failed-list">
              <div v-for="(f, i) in result.failed" :key="i" class="failed-item">
                <strong>{{ f.email }}</strong> &mdash; {{ f.error }}
              </div>
            </div>
          </template>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="#c8102e" variant="flat" class="action-btn submit-btn" @click="$emit('done')">
            Close
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MailerSendDialog',
  props: {
    modelValue: { type: Boolean, required: true },
    phase: { type: String, default: 'confirm' }, // 'confirm' | 'sending' | 'report'
    recipientCount: { type: Number, default: 0 },
    progress: { type: Object, default: null }, // { attempted, sent, failedCount, total } | null = indeterminate
    result: { type: Object, default: null }, // normalized SendResult from manualMailerService
    unknownTokens: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue', 'confirm', 'done'],
  computed: {
    reportIcon() {
      switch (this.result?.status) {
        case 'success':
          return { icon: 'mdi-check-circle', color: 'success' };
        case 'partial':
          return { icon: 'mdi-alert', color: 'warning' };
        case 'unknownOutcome':
          return { icon: 'mdi-help-circle', color: 'grey-darken-1' };
        default: // 'allFailed' | 'error'
          return { icon: 'mdi-close-circle', color: 'error' };
      }
    },
    reportTitle() {
      switch (this.result?.status) {
        case 'success':
          return 'Emails Sent';
        case 'partial':
          return 'Partially Sent';
        case 'allFailed':
          return 'Sending Failed';
        case 'unknownOutcome':
          return 'Outcome Unknown';
        default:
          return 'Sending Failed';
      }
    },
    reportBody() {
      if (!this.result) return '';
      switch (this.result.status) {
        case 'success':
          return `All ${this.result.total} emails were sent successfully.`;
        case 'partial':
          return this.result.message || `Sent ${this.result.sent} of ${this.result.total} emails.`;
        case 'allFailed':
          return `All ${this.result.total} emails failed to send. The mail account's daily sending limit may have been reached — wait and try again later, or send to fewer recipients.`;
        case 'unknownOutcome':
          return 'The connection to the server was lost before it reported a result. Some or all emails may still have been sent. Refresh the student list and re-send to anyone still listed — note this can produce duplicate emails for students who already received one.';
        default: // 'error'
          return this.result.message || 'Failed to send emails.';
      }
    },
  },
  methods: {
    // v-dialog is persistent, so this only fires programmatically — but never
    // allow closing while a batch is running.
    onDialogInput(value) {
      if (!value && this.phase === 'sending') return;
      this.$emit('update:modelValue', value);
    },
    close() {
      this.$emit('update:modelValue', false);
    },
  },
};
</script>

<style scoped>
.dialog-card {
  border-radius: 12px;
}

.action-btn {
  min-width: 120px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.submit-btn {
  color: white !important;
}

/* Failed-recipient list: raw SMTP diagnostics rendered as plain text */
.failed-list {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  background-color: #fafafa;
}

.failed-item {
  font-size: 0.875rem;
  padding: 4px 0;
  word-break: break-word;
}

.failed-item + .failed-item {
  border-top: 1px solid #eee;
}
</style>
