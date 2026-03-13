<!--
DevMailerOverview.vue
Overview tab showing email sending progress with a progress bar.
Redesigned UI matching the instructor pages aesthetic.
-->
<template>
  <div class="overview-content">
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">
          <v-icon size="16" color="white">mdi-email-fast-outline</v-icon>
        </div>
        <div>
          <h2 class="section-title">Current Jobs</h2>
          <p class="section-subtitle">Track email sending progress</p>
        </div>
      </div>

      <div class="section-content">
        <div class="text-body-1 mb-3">
          {{ emailProgress.sent }}/{{ emailProgress.total }} Emails Sent
        </div>
        <v-progress-linear
          v-model="progress"
          color="#c8102e"
          height="20"
          striped
          rounded
        ></v-progress-linear>
      </div>
    </div>
  </div>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from "vue3-toastify";
export default {
  name: "DevMailerOverview",
  inject: ['emailProgress'],
  data() {
    return {
      evtSource: null,
    };
  },
  mounted() {
    this.listenToEmailProgress();
  },
  computed: {
    progress() {
      if (this.emailProgress.total === 0) return 0;
      return (this.emailProgress.sent / this.emailProgress.total) * 100;
    },
  },
  methods: {
    listenToEmailProgress() {
      const user = useLoggedInUserStore();
      const token = user.token;

      this.evtSource = new EventSource(`${import.meta.env.VITE_ROOT_API}/instructorSideData/email-progress?token=${encodeURIComponent(token)}`);

      this.evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.emailProgress.sent = data.sent;
        this.emailProgress.total = data.total;

        if (data.sent === data.total && data.total > 0) {
          toast.success('All emails sent successfully!', {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create',
          });
          this.evtSource.close();
          setTimeout(() => {
            this.emailProgress.sent = 0;
            this.emailProgress.total = 0;
          }, 3000);
        }
      };

      this.evtSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        this.evtSource.close();
      };
    }
  },
  beforeUnmount() {
    if (this.evtSource) {
      this.evtSource.close();
    }
  }
};
</script>

<style scoped>
.overview-content {
  background-color: #fff;
}

.form-section {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0;
}

.section-content {
  padding-left: 48px;
}

@media (max-width: 960px) {
  .form-section {
    padding: 24px 20px;
  }

  .section-content {
    padding-left: 0;
    margin-top: 16px;
  }
}
</style>
