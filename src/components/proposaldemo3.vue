<template>
  <v-app>
    <v-container fluid class="pa-4">
      <!-- Tabs -->
      <v-tabs v-model="activeTab" background-color="primary" dark>
        <v-tab :value="0">Pending Projects</v-tab>
        <v-tab :value="1">Approved Projects</v-tab>
        <v-tab :value="2">Rejected Projects</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <!-- Pending Projects -->
        <v-tab-item :value="0">
          <template v-if="activeTab === 0">
            <v-card flat class="mt-4">
              <v-card-title class="headline">Pending Projects</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="pendingHeaders"
                  :items="pendingProjects"
                  class="elevation-1"
                  @click:row="goToProposalDemo4"
                />
              </v-card-text>
            </v-card>
          </template>
        </v-tab-item>

        <!-- Approved Projects -->
        <v-tab-item :value="1">
          <template v-if="activeTab === 1">
            <v-card flat class="mt-4">
              <v-card-title
                class="headline d-flex justify-space-between align-center"
              >
                <span>Approved Projects</span>
                <v-btn
                  v-if="!selectedApprovedProjects.length"
                  @click="toggleArchivedProjects"
                  elevation="1"
                  :append-icon="viewingArchivedProjects ? '' : 'mdi-archive'"
                >
                  Archive Projects
                </v-btn>
                <v-btn
                  v-else
                  @click="handleArchiveApproved"
                  elevation="1"
                  :append-icon="viewingArchivedProjects ? 'mdi-restore' : 'mdi-archive-plus'"
                >
                  <span class="d-none d-md-flex">
                    {{ viewingArchivedProjects ? "Restore" : "Archive" }}
                    {{
                      selectedApprovedProjects.length === 1
                        ? " Project"
                        : " Projects"
                    }}
                  </span>
                  <span class="d-none d-sm-flex d-md-none">
                    {{ viewingArchivedProjects ? "Restore" : "Archive" }}
                  </span>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="baseHeaders"
                  :items="projectsToDisplay"
                  class="elevation-1"
                  item-key="name"
                  show-select
                  v-model:selected="selectedApprovedProjects"
                  :single-select="false"
                />
              </v-card-text>
            </v-card>
          </template>
        </v-tab-item>

        <!-- Rejected Projects -->
        <v-tab-item :value="2">
          <template v-if="activeTab === 2">
            <v-card flat class="mt-4">
              <v-card-title class="headline">Rejected Projects</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="baseHeaders"
                  :items="rejectedProjects"
                  class="elevation-1"
                />
              </v-card-text>
            </v-card>
          </template>
        </v-tab-item>
      </v-tabs-items>

      <!-- Optional: Rejection Dialog 
           (If you no longer need rejection logic at all, you can remove this as well) -->
      <v-dialog v-model="rejectionDialog" max-width="500px" persistent>
        <v-card>
          <v-card-title class="text-h6 font-weight-bold">
            Reject Project
          </v-card-title>
          <v-card-text>
            <p>Please provide a reason for rejecting <strong>{{ projectToReject?.name }}</strong>:</p>
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
    </v-container>
  </v-app>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ProjectsDashboard",
  data: () => ({
    activeTab: 0,
    // Removed the "Actions" column
    pendingHeaders: [
      { title: "Project Name", key: "name" },
      { title: "Project Description", key: "description" },
    ],
    baseHeaders: [
      { title: "Project Name", key: "name" },
      { title: "Project Description", key: "description" },
    ],
    pendingProjects: [
      {
        name: "Community Code Initiative",
        description: "Brings coders together for outreach.",
      },
      {
        name: "Academic App Accelerator",
        description: "Accelerates academic app creation.",
      },
      {
        name: "Tech for Tomorrow",
        description: "Forward-thinking tech solutions.",
      },
      {
        name: "EduEngage Network",
        description: "Networks educational communities digitally.",
      },
      {
        name: "Hack for Humanity",
        description: "Coding events for humanitarian challenges.",
      },
    ],
    approvedProjects: [],
    rejectedProjects: [],
    viewingArchivedProjects: false,
    archivedProjects: [],
    selectedApprovedProjects: [],
    // If you remove rejection logic entirely, remove these too:
    rejectionDialog: false,
    rejectionReason: "",
    projectToReject: null,
  }),
  computed: {
    projectsToDisplay() {
      return this.viewingArchivedProjects
        ? this.archivedProjects
        : this.approvedProjects;
    },
  },
  methods: {
    /* 
      New: On clicking a row in the Pending Projects table,
      navigate to the `proposaldemo4` route.
      Adjust the route name or path as needed.
    */
    goToProposalDemo4(item) {
      this.$router.push({ name: "proposaldemo4" });
      // or if you have a path:
      // this.$router.push("/proposaldemo4");
      // or pass project info via params/query if needed:
      // this.$router.push({ name: "proposaldemo4", params: { id: item.id } });
    },

    /* 
      -- The rest of the methods below are only relevant if you 
         still need the Rejection Dialog or the archiving logic. --
    */
    openRejectionDialog(project) {
      this.projectToReject = project;
      this.rejectionDialog = true;
    },
    closeRejectionDialog() {
      this.rejectionDialog = false;
      this.rejectionReason = "";
      this.projectToReject = null;
    },
    confirmRejection() {
      if (!this.rejectionReason.trim()) {
        toast.error("Please provide a reason for rejection.", {
          position: "top-right",
          toastClassName: "Toastify__toast--error",
          multiple: true,
        });
        return;
      }
      // Remove project from pending and add to rejected
      this.pendingProjects = this.pendingProjects.filter(
        (p) => p !== this.projectToReject
      );
      this.rejectedProjects.push({
        ...this.projectToReject,
        rejectionReason: this.rejectionReason,
      });
      toast.error(`Rejected: ${this.projectToReject.name} (${this.rejectionReason})`, {
        position: "top-right",
        toastClassName: "Toastify__toast--delete",
        multiple: true,
      });
      this.closeRejectionDialog();
    },
    toggleArchivedProjects() {
      this.viewingArchivedProjects = !this.viewingArchivedProjects;
      this.selectedApprovedProjects = [];
    },
    handleArchiveApproved() {
      if (!this.selectedApprovedProjects.length) return;
      if (this.viewingArchivedProjects) {
        this.archivedProjects = this.archivedProjects.filter(
          (p) => !this.selectedApprovedProjects.includes(p)
        );
        this.approvedProjects.push(...this.selectedApprovedProjects);
        toast.success("Projects restored to Approved list!", {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
          multiple: true,
        });
      } else {
        this.approvedProjects = this.approvedProjects.filter(
          (p) => !this.selectedApprovedProjects.includes(p)
        );
        this.archivedProjects.push(...this.selectedApprovedProjects);
        toast.info("Projects archived!", {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
          multiple: true,
        });
      }
      this.selectedApprovedProjects = [];
    },
  },
};
</script>

<style scoped>
.me-2 {
  margin-right: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
