<template>
  <v-container>
    <v-row class="mb-2">
      <v-col cols="12">
        <h1 class="text-h5 font-weight-bold">Generate Reports</h1>
        <p class="text-body-2">
          Generate a profile or growth PDF report from session and experience data.
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
          v-model="selectedExperienceId"
          :items="experienceOptions"
          item-title="label"
          item-value="id"
          label="Select Experience"
          variant="outlined"
          density="comfortable"
          :loading="loadingExperiences"
          :disabled="!selectedSessionId || loadingExperiences || isGenerating"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedInstructorName"
          :items="instructorOptions"
          label="Select Instructor"
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
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "GenerateReports",
  data() {
    return {
      sessionOptions: [],
      experienceOptions: [],
      selectedSessionId: "",
      selectedExperienceId: "",
      selectedInstructorName: "",
      selectedReportType: "",
      totalRegisteredStudents: null,
      loadingSessions: false,
      loadingExperiences: false,
      isGenerating: false,
      reportTypeOptions: [
        { label: "Profile Report", value: "profile" },
        { label: "Growth Report", value: "growth" },
      ],
      instructorOptions: [
        "Dr. Ioannis Konstantinidis",
        "Dr. Jane Doe",
        "Dr. John Smith",
      ],
    };
  },
  async mounted() {
    await this.loadSessions();
  },
  methods: {
    async loadSessions() {
      this.loadingSessions = true;
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/active`,
          { headers: { token } },
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
      this.selectedExperienceId = "";
      this.experienceOptions = [];
      if (!this.selectedSessionId) return;

      this.loadingExperiences = true;
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const response = await axios.get(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/available-experiences-for-instance`,
          {
            params: { sessionID: this.selectedSessionId },
            headers: { token },
          },
        );
        this.experienceOptions = (response?.data || []).map((experience) => ({
          id: experience._id,
          label: `${experience.experienceCategory}: ${experience.experienceName}`,
        }));
      } catch (error) {
        this.experienceOptions = [];
        toast.error("Failed to load experiences.");
      } finally {
        this.loadingExperiences = false;
      }
    },

    validateInputs() {
      if (!this.selectedSessionId) return "Please select a session first.";
      if (!this.selectedExperienceId) return "Please select an experience first.";
      if (!this.selectedInstructorName) return "Please select an instructor.";
      if (!this.selectedReportType) return "Please select a report type.";

      if (this.selectedReportType === "profile") {
        const total = Number(this.totalRegisteredStudents);
        if (!Number.isInteger(total) || total <= 0) {
          return "Please enter a valid total number of registered students (positive whole number).";
        }
      }

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
      const selectedExperience = this.experienceOptions.find(
        (experience) => experience.id === this.selectedExperienceId,
      );

      this.isGenerating = true;
      try {
        const user = useLoggedInUserStore();
        const token = user.token;
        const response = await axios.post(
          `${import.meta.env.VITE_ROOT_API}/instructorSideData/reports/generate`,
          {
            reportType: this.selectedReportType,
            sessionId: this.selectedSessionId,
            sessionLabel: selectedSession?.name || "",
            experienceId: this.selectedExperienceId,
            experienceLabel: selectedExperience?.label || "",
            instructorName: this.selectedInstructorName,
            totalRegisteredStudents:
              this.selectedReportType === "profile"
                ? Number(this.totalRegisteredStudents)
                : undefined,
          },
          {
            headers: { token },
            responseType: "blob",
          },
        );

        const contentType = response?.headers?.["content-type"] || "";
        if (!contentType.includes("application/pdf")) {
          toast.error("Report generation returned a non-PDF response.");
          return;
        }

        const sessionLabel = selectedSession?.name || this.selectedSessionId;
        const experienceLabel = selectedExperience?.label || this.selectedExperienceId;
        const safeSession = String(sessionLabel || "session")
          .replace(/[^\w\-]+/g, "-")
          .toLowerCase();
        const safeExperience = String(experienceLabel || "experience")
          .replace(/[^\w\-]+/g, "-")
          .toLowerCase();
        const fileName = `${this.selectedReportType}_${safeSession}_${safeExperience}.pdf`;

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

        toast.success("Report generated successfully. Download started.");
      } catch (error) {
        toast.error("Error generating report.");
      } finally {
        this.isGenerating = false;
      }
    },
  },
};
</script>
