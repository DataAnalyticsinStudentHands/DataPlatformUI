<template>
  <v-container>
    <v-row class="mb-2">
      <v-col cols="12">
        <h1 class="text-h5 font-weight-bold">Generate Reports</h1>
        <p class="text-body-2">
          Generate a Profile or Growth report for a selected experience instance.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedSessionId"
          :items="sessionOptions"
          item-title="name"
          item-value="id"
          label="Select Session"
          variant="outlined"
          density="comfortable"
          :loading="loadingSessions"
          :disabled="loadingSessions || isGenerating"
          @update:model-value="onSessionChange"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="selectedExperienceInstanceId"
          :items="instanceOptions"
          item-title="label"
          item-value="id"
          label="Select Experience Instance"
          variant="outlined"
          density="comfortable"
          no-data-text="No active experience instances found for this session."
          :loading="loadingExperiences"
          :disabled="!selectedSessionId || loadingExperiences || isGenerating"
          @update:model-value="onInstanceChange"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="instructorNamesText"
          label="Instructor name(s)"
          placeholder="e.g. Dr. Jane Doe"
          hint="Separate multiple instructors with commas"
          persistent-hint
          variant="outlined"
          density="comfortable"
          :disabled="isGenerating"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="selectedReportType"
          :items="reportTypeOptions"
          item-title="label"
          item-value="value"
          label="Select Report Type"
          variant="outlined"
          density="comfortable"
          :disabled="isGenerating"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="totalRegisteredStudents"
          label="Total number of registered students"
          type="number"
          min="1"
          step="1"
          variant="outlined"
          density="comfortable"
          :disabled="isGenerating"
        />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-btn
          color="primary"
          :loading="isGenerating"
          :disabled="isGenerating"
          @click="generateReport"
        >
          Generate Report
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  name: "GenerateReports",
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
      reportTypeOptions: [
        { label: "Profile Report", value: "profile" },
        { label: "Growth Report", value: "growth" },
      ],
    };
  },
  computed: {
    parsedInstructorNames() {
      return String(this.instructorNamesText || "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
    },
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

    async generateReport() {
      const validationError = this.validateInputs();
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const selectedSession = this.sessionOptions.find(
        (session) => session.id === this.selectedSessionId,
      );
      const selectedInstance = this.instanceOptions.find(
        (experience) => experience.id === this.selectedExperienceInstanceId,
      );

      this.isGenerating = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/reports/generate`,
          {
            reportType: this.selectedReportType,
            sessionId: this.selectedSessionId,
            experienceInstanceId: this.selectedExperienceInstanceId,
            instructorNames: this.parsedInstructorNames,
            totalRegisteredStudents: Number(this.totalRegisteredStudents),
          },
          {
            responseType: "blob",
          },
        );

        const contentType = response?.headers?.["content-type"] || "";
        if (!contentType.includes("application/pdf")) {
          toast.error("Report generation returned a non-PDF response.");
          return;
        }

        const sessionLabel = selectedSession?.name || this.selectedSessionId;
        const experienceLabel = selectedInstance?.label || this.selectedExperienceInstanceId;
        const safeSession = String(sessionLabel || "session")
          .replace(/[^\w\-]+/g, "-")
          .toLowerCase();
        const safeExperience = String(experienceLabel || "experience")
          .replace(/[^\w\-]+/g, "-")
          .toLowerCase();
        const fileName = `${this.selectedReportType}_${safeSession}_${safeExperience}_${this.selectedExperienceInstanceId}.pdf`;

        // responseType: "blob" already returns a Blob. Reuse it directly.
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Avoid revoking immediately; some browsers may fail to read large blobs in time.
        window.setTimeout(() => window.URL.revokeObjectURL(url), 30000);

        toast.success("Report generated successfully. Download started.", {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
          multiple: false,
        });
      } catch (error) {
        toast.error("Error generating report.");
      } finally {
        this.isGenerating = false;
      }
    },
  },
};
</script>
