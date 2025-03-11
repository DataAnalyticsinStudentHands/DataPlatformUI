<template>
  <v-container class="py-6">
    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text>
          Are you sure you want to <strong>{{ dialogAction }}</strong> the project
          <strong>{{ confirmDialogProject.projectName }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">No</v-btn>
          <v-btn color="green darken-2" text @click="confirmProjectAction">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card elevation="2">
      <!-- Header -->
      <v-card-title>
        <span class="text-h6 font-weight-bold">Project Information</span>
      </v-card-title>
      <v-card-subtitle>
        Sample Project Details (Read-Only)
      </v-card-subtitle>
      
      <!-- Body -->
      <v-card-text>
        <!-- Project Name -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <p><strong>Project Name:</strong></p>
            <p class="ml-4">{{ project.projectName }}</p>
          </v-col>
        </v-row>

        <!-- Project Description -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Project Description:</strong></p>
            <p class="ml-4">{{ project.projectDescription }}</p>
          </v-col>
        </v-row>

        <!-- Selected Experience -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Selected Experience:</strong></p>
            <p class="ml-4">
              {{ selectedExperience.text }}
            </p>
          </v-col>
        </v-row>

        <!-- Selected Tags -->
        <v-row class="mb-4">
          <v-col cols="12">
            <p><strong>Selected Tags:</strong></p>
            <!-- Display tags as chips -->
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

        <!-- Right: Approve / Reject -->
        <v-btn color="success" @click="approveProject">
          Approve
        </v-btn>
        <v-btn color="error" @click="rejectProject">
          Reject
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
      // Sample data for demonstration
      project: {
        projectName: "Campus Innovation Lab",
        projectDescription:
          "A collaborative initiative to develop new technology solutions on campus. Students and faculty work together to create impactful projects that enhance the campus experience.",
        selectedTags: ["technology", "innovation", "campus"],
      },
      selectedExperience: {
        text: "Experience 2",
        value: 2,
      },

      // Dialog / Confirmation states
      confirmDialog: false,
      confirmDialogProject: {},
      dialogAction: null,
    };
  },
  computed: {
    dialogTitle() {
      if (this.dialogAction === "approve") {
        return "Approve Project?";
      } else if (this.dialogAction === "reject") {
        return "Reject Project?";
      }
      return "Confirm Project";
    },
  },
  methods: {
    handleBack() {
      // If you use Vue Router, this can navigate back:
      // this.$router.back();
      // Otherwise, any custom logic:
      console.log("Back clicked");
    },

    approveProject() {
      this.dialogAction = "approve";
      this.confirmDialogProject = this.project;
      this.confirmDialog = true;
    },

    rejectProject() {
      this.dialogAction = "reject";
      this.confirmDialogProject = this.project;
      this.confirmDialog = true;
    },

    confirmProjectAction() {
      if (this.dialogAction === "approve") {
        toast.success(`Approved: ${this.confirmDialogProject.projectName}`, {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
          multiple: true,
        });
      } else if (this.dialogAction === "reject") {
        toast.error(`Rejected: ${this.confirmDialogProject.projectName}`, {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
      }
      this.confirmDialog = false;
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
