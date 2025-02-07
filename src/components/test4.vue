<template>
  <v-app>
    <v-container fluid class="pa-4">
      <!-- Define the tabs with explicit numeric values -->
      <v-tabs v-model="activeTab" background-color="primary" dark>
        <v-tab :value="0">Pending Projects</v-tab>
        <v-tab :value="1">Approved Projects</v-tab>
        <v-tab :value="2">Rejected Projects</v-tab>
      </v-tabs>
      <!-- Use v-tabs-items with v-model so that only the active tab's content is shown -->
      <v-tabs-items v-model="activeTab">
        <!-- Pending Projects Tab -->
        <v-tab-item :value="0">
          <template v-if="activeTab === 0">
            <v-card flat class="mt-4">
              <v-card-title class="headline">Pending Projects</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="pendingHeaders"
                  :items="pendingProjects"
                  class="elevation-1"
                >
                  <!-- Custom cell for the Actions column -->
                  <template #item.actions="{ item }">
                    <v-btn color="green-darken-2" class="me-2" @click="handleApproval(item)">
                      Approve
                    </v-btn>
                    <v-btn color="red-darken-2" @click="handleRejection(item)">
                      Reject
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </template>
        </v-tab-item>
        <!-- Approved Projects Tab -->
        <v-tab-item :value="1">
          <template v-if="activeTab === 1">
            <v-card flat class="mt-4">
              <v-card-title class="headline">Approved Projects</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="baseHeaders"
                  :items="approvedProjects"
                  class="elevation-1"
                />
              </v-card-text>
            </v-card>
          </template>
        </v-tab-item>
        <!-- Rejected Projects Tab -->
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
    </v-container>
  </v-app>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ProjectsDashboard",
  data: () => ({
    // Active tab index: 0 = Pending, 1 = Approved, 2 = Rejected
    activeTab: 0,
    // Headers for the pending projects table (includes actions)
    pendingHeaders: [
      { title: "Project Name", key: "name" },
      { title: "Project Description", key: "description" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    // Base headers for approved and rejected projects
    baseHeaders: [
      { title: "Project Name", key: "name" },
      { title: "Project Description", key: "description" },
    ],
    // Sample pending projects list
    pendingProjects: [
      {
        name: "Community Code Initiative",
        description: "Brings coders together for community-driven outreach.",
      },
      {
        name: "Academic App Accelerator",
        description: "Accelerates academic app creation and innovation.",
      },
      {
        name: "Tech for Tomorrow",
        description: "Drives forward-thinking tech solutions for a better future.",
      },
      {
        name: "EduEngage Network",
        description: "Networks educational communities for digital engagement.",
      },
      {
        name: "Hack for Humanity",
        description: "Hosts coding events addressing humanitarian challenges.",
      },
    ],
    // Initially empty lists for approved and rejected projects
    approvedProjects: [],
    rejectedProjects: [],
  }),
  methods: {
    handleApproval(project) {
      // Remove the project from pending and add it to approved list
      this.pendingProjects = this.pendingProjects.filter(
        (p) => p !== project
      );
      this.approvedProjects.push(project);
      toast.success(`Approved: ${project.name}`, {
        position: "top-right",
        toastClassName: "Toastify__toast--create",
        multiple: true,
      });
      console.log("Approved project:", project);
    },
    handleRejection(project) {
      // Remove the project from pending and add it to rejected list
      this.pendingProjects = this.pendingProjects.filter(
        (p) => p !== project
      );
      this.rejectedProjects.push(project);
      toast.error(`Rejected: ${project.name}`, {
        position: "top-right",
        toastClassName: "Toastify__toast--delete",
        multiple: true,
      });
      console.log("Rejected project:", project);
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
