<template>
  <v-container class="py-6">

    <!-- Approval Dialog (unchanged for Approve action) -->
    <v-dialog v-model="confirmDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Approve Project?
        </v-card-title>
        <v-card-text>
          Are you sure you want to <strong>approve</strong> the project
          <strong>{{ confirmDialogProject.projectName }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">No</v-btn>
          <v-btn color="green darken-2" text @click="confirmProjectAction">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Rejection Dialog (new) -->
    <v-dialog v-model="rejectionDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Reject Project
        </v-card-title>
        <v-card-text>
          <p>Please provide a reason for rejecting
            <strong>{{ confirmDialogProject.projectName }}</strong>:
          </p>
          <v-textarea
            v-model="rejectionReason"
            label="Reason for rejection"
            rows="3"
            auto-grow
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeRejectionDialog">Cancel</v-btn>
          <v-btn color="red-darken-2" @click="confirmRejection">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card elevation="2">
      <!-- Header -->
      <v-card-title>
        <span class="text-h6 font-weight-bold">Project Information</span>
      </v-card-title>
      <v-card-subtitle>
        Project Proposal
      </v-card-subtitle>

      <!-- Body -->
      <v-card-text>
        <!-- 1) BASIC PROJECT INFO -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <p><strong>Project Name:</strong></p>
            <p class="ml-4">{{ project.projectName }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p><strong>Project Lead Affiliation (Dept/Org):</strong></p>
            <p class="ml-4">{{ project.affiliation }}</p>
          </v-col>
        </v-row>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <p><strong>Contact Email:</strong></p>
            <p class="ml-4">{{ project.contactEmail }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p><strong>Contact Phone:</strong></p>
            <p class="ml-4">{{ project.contactPhone }}</p>
          </v-col>
        </v-row>

        <!-- 2) PROJECT DESCRIPTION -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Project Description:</strong></p>
            <p class="ml-4">{{ project.projectDescription }}</p>
          </v-col>
        </v-row>

        <!-- 3) BACKGROUND & RATIONALE -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Background / Rationale:</strong></p>
            <p class="ml-4">{{ project.background }}</p>
          </v-col>
        </v-row>

        <!-- 4) PROJECT OBJECTIVES -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Project Objectives:</strong></p>
            <p class="ml-4">{{ project.objectives }}</p>
          </v-col>
        </v-row>

        <!-- 5) STAKEHOLDERS / BENEFICIARIES -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <p><strong>Stakeholders (Who is involved/supporting?):</strong></p>
            <p class="ml-4">{{ project.stakeholders }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p><strong>Beneficiaries (Who will benefit?):</strong></p>
            <p class="ml-4">{{ project.beneficiaries }}</p>
          </v-col>
        </v-row>

        <!-- 6) EXPECTED IMPACT & OUTCOMES -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Expected Outcomes:</strong></p>
            <p class="ml-4">{{ project.expectedImpact }}</p>
          </v-col>
        </v-row>

        <!-- 9) RISKS / CHALLENGES -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Potential Risks / Challenges:</strong></p>
            <p class="ml-4">{{ project.risks }}</p>
          </v-col>
        </v-row>

        <!-- 10) FUNDING & RESOURCES -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Resources Needed:</strong></p>
            <p class="ml-4">{{ project.fundingAndResources }}</p>
          </v-col>
        </v-row>

        <!-- 11) COLLABORATION / PARTNERSHIPS -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Collaboration / Partnership Opportunities:</strong></p>
            <p class="ml-4">{{ project.collaboration }}</p>
          </v-col>
        </v-row>

        <!-- 12) EVALUATION CRITERIA -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Evaluation Metrics:</strong></p>
            <p class="ml-4">{{ project.evaluation }}</p>
          </v-col>
        </v-row>

        <!-- 13) SELECTED EXPERIENCE -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Selected Experience:</strong></p>
            <p class="ml-4">{{ selectedExperience.text }}</p>
          </v-col>
        </v-row>

        <!-- 14) SELECTED TAGS -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Selected Tags:</strong></p>
            <div class="ml-4">
              <v-chip
                v-for="tag in project.selectedTags"
                :key="tag"
                class="ma-1"
                color="primary"
                label
                small
              >
                {{ tag }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions>
        <!-- Left: Back Button -->
        <v-btn color="primary" outlined @click="handleBack">
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>

        <v-spacer></v-spacer>

        <!-- Right: Reject / Approve -->
        <v-btn color="error" @click="openRejectionDialog">
          Reject
        </v-btn>
        <v-btn color="success" @click="approveProject">
          Approve
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ProjectInfoView",
  data() {
    return {
      // Example data — replace with real fetched/bound data
      project: {
        projectName: "Campus Innovation Lab",
        affiliation: "Engineering Department",
        contactEmail: "john.doe@university.edu",
        contactPhone: "555-123-4567",
        projectDescription:
          "A collaborative initiative to develop tech solutions on campus.",
        background:
          "There is a need for more interdisciplinary innovation involving students and faculty.",
        objectives:
          "Build prototypes, encourage cross-department research, and foster collaboration.",
        stakeholders: "Faculty, Engineering Club, IT Department",
        beneficiaries: "Students, Faculty, University Community",
        expectedImpact:
          "Advance campus technology, provide hands-on project experience.",
        activities: "Hackathons, Workshops, Mentorship",
        timeline: "Semester-based iterations, final showcase at year-end.",
        risks: "Budget constraints, limited time, competing priorities.",
        fundingAndResources:
          "Lab equipment, software licenses, small project grants.",
        collaboration:
          "Potential partnerships with local tech companies, other universities.",
        evaluation: "Number of participants, prototypes, feedback surveys.",
        sustainability:
          "Ongoing lab support, integration into coursework, expansions.",
        selectedTags: ["technology", "innovation", "campus"],
      },
      selectedExperience: {
        text: "HON 3350",
        value: 2,
      },

      // Approval dialog states
      confirmDialog: false,
      confirmDialogProject: {},
      dialogAction: null,

      // Rejection dialog states
      rejectionDialog: false,
      rejectionReason: "",
    };
  },
  computed: {
    dialogTitle() {
      if (this.dialogAction === "approve") {
        return "Approve Project?";
      }
      return "Confirm Project";
    },
  },
  methods: {
    handleBack() {
      // If using Vue Router, you could navigate:
      // this.$router.back();
      console.log("Back clicked");
    },

    // ---- APPROVAL FLOW ----
    approveProject() {
      this.dialogAction = "approve";
      this.confirmDialogProject = this.project;
      this.confirmDialog = true;
    },
    confirmProjectAction() {
      // Only approval logic remains here
      toast.success(`Approved: ${this.confirmDialogProject.projectName}`, {
        position: "top-right",
        toastClassName: "Toastify__toast--create",
        multiple: true,
      });
      this.confirmDialog = false;
    },

    // ---- REJECTION FLOW ----
    openRejectionDialog() {
      this.confirmDialogProject = this.project;
      this.rejectionDialog = true;
    },
    closeRejectionDialog() {
      this.rejectionDialog = false;
      this.rejectionReason = "";
      this.confirmDialogProject = {};
    },
    confirmRejection() {
      if (!this.rejectionReason.trim()) {
        toast.error("Please provide a reason for rejection.", {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
        return;
      }

      // You can expand this to push to "rejected projects," call an API, etc.
      toast.error(
        `Rejected: ${this.confirmDialogProject.projectName} (${this.rejectionReason})`,
        {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        }
      );

      // Reset and close
      this.closeRejectionDialog();
    },
  },
};
</script>

<style scoped>
.ml-4 {
  margin-left: 1rem;
}
</style>
