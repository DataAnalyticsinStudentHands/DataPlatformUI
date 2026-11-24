<template>
  <main class="reports-page">
    <v-container class="py-8 px-6 px-md-10">
      <div class="page-header mb-6">
        <div class="d-flex align-center mb-2">
          <v-btn icon variant="text" size="small" class="mr-2" aria-label="Go back" @click="$router.back()"><v-icon>mdi-arrow-left</v-icon></v-btn>
          <v-icon color="#c8102e" size="36" class="mr-3">mdi-file-chart-outline</v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold">Generate Reports</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">Explore student profiles and growth</p>
          </div>
        </div>
      </div>

      <v-card class="main-card" elevation="2">
        <div class="section-heading"><v-icon size="22" color="#c8102e">mdi-tune-variant</v-icon><h2 class="text-subtitle-1 font-weight-medium">Report details</h2></div>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-select v-model="selectedSessionId" :items="sessionOptions" item-title="name" item-value="id" label="Session" prepend-inner-icon="mdi-calendar-range" variant="outlined" density="comfortable" hide-details="auto" color="#c8102e" :loading="loadingSessions" :disabled="loadingSessions || isBusy" @update:model-value="onSessionChange" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="selectedExperienceInstanceId" :items="instanceOptions" item-title="label" item-value="id" label="Experience instance" prepend-inner-icon="mdi-school-outline" variant="outlined" density="comfortable" hide-details="auto" color="#c8102e" no-data-text="No active experience instances found." :loading="loadingExperiences" :disabled="!selectedSessionId || loadingExperiences || isBusy" @update:model-value="onInstanceChange" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="instructorNamesText" label="Instructor name(s)" placeholder="Separate names with commas" prepend-inner-icon="mdi-account-outline" variant="outlined" density="comfortable" hide-details="auto" color="#c8102e" :disabled="isBusy" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select v-model="selectedReportType" :items="reportTypeOptions" item-title="label" item-value="value" label="Report type" variant="outlined" density="comfortable" hide-details="auto" color="#c8102e" :disabled="isBusy" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model.number="totalRegisteredStudents" label="Registered students" type="number" min="1" step="1" variant="outlined" density="comfortable" hide-details="auto" color="#c8102e" :disabled="isBusy" />
            </v-col>
          </v-row>
          <div class="d-flex justify-end mt-6">
            <v-btn color="#c8102e" class="action-btn" :loading="isBusy" :disabled="isBusy" @click="generateReport"><v-icon start size="20">mdi-file-chart-outline</v-icon>{{ growthDashboard ? 'Regenerate report' : 'Generate report' }}</v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-alert v-if="reportError" type="error" variant="tonal" class="mt-4" role="alert">{{ reportError }}</v-alert>
      <GrowthDashboard v-if="growthDashboard" :dashboard="growthDashboard" :pdf-url="pdfUrl" :pdf-loading="isDownloading" @download="loadPdf(true)" @preview="loadPdf(false)" />
    </v-container>
  </main>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import GrowthDashboard from "./GrowthDashboard.vue";

export default {
  name: "GenerateReports",
  components: { GrowthDashboard },
  data() {
    return {
      sessionOptions: [],
      instanceOptions: [],
      selectedSessionId: "",
      selectedExperienceInstanceId: "",
      instructorNamesText: "",
      selectedReportType: "",
      totalRegisteredStudents: null,
      loadingSessions: false,
      loadingExperiences: false,
      experienceRequestId: 0,
      isGenerating: false,
      isDownloading: false,
      growthDashboard: null,
      reportError: "",
      pdfUrl: "",
      pdfFileName: "",
      reportTypeOptions: [
        { label: "Profile Report", value: "profile" },
        { label: "Growth Report", value: "growth" },
      ],
    };
  },
  computed: {
    isBusy() { return this.isGenerating || this.isDownloading; },
    reportInputs() {
      return JSON.stringify({
        reportType: this.selectedReportType,
        sessionId: this.selectedSessionId,
        experienceInstanceId: this.selectedExperienceInstanceId,
        instructorNames: this.parsedInstructorNames,
        totalRegisteredStudents: Number(this.totalRegisteredStudents),
      });
    },
    parsedInstructorNames() {
      return String(this.instructorNamesText || "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
    },
  },
  watch: {
    reportInputs() { this.clearResults(); },
  },
  beforeUnmount() {
    if (this.pdfUrl) window.URL.revokeObjectURL(this.pdfUrl);
  },
  async mounted() {
    await this.loadSessions();
  },
  methods: {
    async loadSessions() {
      this.loadingSessions = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/active`,
        );
        this.sessionOptions = (response?.data || []).map((session) => ({
          id: session._id,
          name: session.sessionName,
        }));
      } catch (error) {
        this.sessionOptions = [];
        toast.error("Failed to load sessions.");
      } finally {
        this.loadingSessions = false;
      }
    },

    async onSessionChange() {
      const requestId = ++this.experienceRequestId;
      const sessionId = this.selectedSessionId;
      this.selectedExperienceInstanceId = "";
      this.instanceOptions = [];
      this.instructorNamesText = "";
      this.totalRegisteredStudents = null;
      this.loadingExperiences = false;
      if (!sessionId) return;

      this.loadingExperiences = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/session/${encodeURIComponent(sessionId)}`,
        );
        if (requestId !== this.experienceRequestId) return;

        this.instanceOptions = (response?.data?.instancesForSession || [])
          .map((instance) => {
            const instructor = (instance.instructor || "").trim();
            const name = [instance.experience.category, instance.experience.name]
              .map((value) => (value || "").trim())
              .filter(Boolean)
              .join(": ");
            return {
              id: instance._id,
              label: instructor ? `${name} - ${instructor}` : name,
              instructor,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
      } catch (error) {
        if (requestId !== this.experienceRequestId) return;
        this.instanceOptions = [];
        toast.error("Failed to load experiences.");
      } finally {
        if (requestId === this.experienceRequestId) {
          this.loadingExperiences = false;
        }
      }
    },

    onInstanceChange() {
      const selectedInstance = this.instanceOptions.find(
        (experience) => experience.id === this.selectedExperienceInstanceId,
      );
      this.instructorNamesText = selectedInstance?.instructor || "";
      this.totalRegisteredStudents = null;
    },

    validateInputs() {
      if (!this.selectedSessionId) return "Please select a session first.";
      if (!this.selectedExperienceInstanceId) return "Please select an experience instance first.";
      if (!this.parsedInstructorNames.length) return "Please enter at least one instructor name.";
      if (!this.selectedReportType) return "Please select a report type.";

      const total = Number(this.totalRegisteredStudents);
      if (!Number.isInteger(total) || total <= 0) return "Please enter a valid total number of registered students (positive whole number).";

      return null;
    },

    clearResults() {
      this.growthDashboard = null;
      this.reportError = "";
      if (this.pdfUrl) window.URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = "";
      this.pdfFileName = "";
    },

    async generateReport() {
      if (this.isBusy) return;
      const validationError = this.validateInputs();
      if (validationError) {
        toast.error(validationError);
        return;
      }
      this.clearResults();
      if (this.selectedReportType !== "growth") {
        await this.loadPdf(true);
        return;
      }
      const inputs = this.reportInputs;
      this.isGenerating = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/reports/growth/dashboard`,
          JSON.parse(inputs),
        );
        if (inputs === this.reportInputs) this.growthDashboard = response.data;
      } catch (error) {
        this.reportError = error.response?.data?.error || "Unable to generate the dashboard. Please try again.";
      } finally {
        this.isGenerating = false;
      }
    },

    async loadPdf(download) {
      if (this.isBusy) return;
      if (this.pdfUrl) {
        if (download) this.downloadPdf();
        return;
      }
      const inputs = this.reportInputs;
      this.isDownloading = true;
      this.reportError = "";
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/reports/generate`,
          JSON.parse(inputs),
          { responseType: "blob" },
        );
        if (inputs !== this.reportInputs) return;
        if (!(response.headers?.["content-type"] || "").includes("application/pdf")) {
          throw new Error("Report generation returned a non-PDF response.");
        }
        const disposition = response.headers?.["content-disposition"] || "";
        this.pdfFileName = disposition.match(/filename="([^"]+)"/)?.[1]
          || `${this.selectedReportType}_${this.selectedExperienceInstanceId}.pdf`;
        this.pdfUrl = window.URL.createObjectURL(response.data);
        if (download) this.downloadPdf();
      } catch (error) {
        this.reportError = "Unable to generate the PDF. Please try again.";
      } finally {
        this.isDownloading = false;
      }
    },

    downloadPdf() {
      const link = document.createElement("a");
      link.href = this.pdfUrl;
      link.download = this.pdfFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  },
};
</script>

<style scoped>
.reports-page { background-color: #f8f9fa; min-height: 100vh; }
.page-header { padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; }
.main-card { border-radius: 12px; overflow: hidden; }
.section-heading { display: flex; align-items: center; gap: 10px; padding: 16px 24px; background: #fafafa; }
.action-btn { text-transform: none; font-weight: 500; font-size: 0.9rem; letter-spacing: 0.25px; }
</style>
