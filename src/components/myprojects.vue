<template>
  <v-app>
    <!-- Top App Bar with Horizontal Navigation -->
    <v-app-bar app color="white" dark>
      <v-app-bar-title>Project Portal</v-app-bar-title>

      <!-- Horizontal Tabs for navigation -->
      <v-tabs
        v-model="selectedView"
        background-color="transparent"
        grow
        align-with-title
      >
        <v-tab value="portal">Project Portal</v-tab>
        <v-tab value="myProjects">My Projects</v-tab>
      </v-tabs>

      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="pa-4">
        <!-- 1) PUBLIC PROJECT PORTAL VIEW -->
        <div v-if="selectedView === 'portal'">
          <h2 class="text-h5 mb-4">Public Project Portal</h2>
          <!-- Search and Tag Filter -->
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search Projects"
                single-line
                hide-details
              />
            </v-col>
            <v-col>
              <v-select
                v-model="selectedTags"
                :items="availableTags"
                label="Filter by Tags"
                multiple
                chips
                hide-details
              />
            </v-col>
          </v-row>

          <!-- Data Table for Portal Projects -->
          <v-row class="mt-4">
            <v-col cols="12">
              <v-data-table
                hide-default-header
                height="400px"
                :headers="headers"
                :items="filteredProjects"
                :items-per-page="10"
                class="elevation-1"
              >
                <template #item="{ item }">
                  <tr>
                    <td :colspan="headers.length">
                      <v-expansion-panels flat>
                        <v-expansion-panel>
                          <v-expansion-panel-title>
                            {{ item.name }}
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <div>
                              <strong>Description:</strong> {{ item.description }}
                            </div>
                            <div>
                              <strong>Member Count:</strong> {{ item.memberCount }}
                            </div>
                            <div>
                              <strong>Active Experience(s):</strong>
                              <span v-if="item.activeExperiences?.length">
                                {{ item.activeExperiences.join(', ') }}
                              </span>
                              <span v-else>
                                N/A
                              </span>
                            </div>
                            <div>
                              <strong>(Hidden) Registration Code:</strong>
                              {{ item.registrationCode }}
                            </div>
                            <div class="d-flex justify-end mt-2">
                              <v-btn
                                color="green darken-2"
                                depressed
                                @click="openDialog(item)"
                              >
                                Register
                              </v-btn>
                            </div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </div>

        <!-- 2) SINGLE TAB: MY PROJECTS (ACTIVE + PROPOSED + REJECTED) -->
        <div v-else-if="selectedView === 'myProjects'">
          <h2 class="text-h5 mb-4">My Projects</h2>
          <v-data-table
            :headers="myProjectsHeaders"
            :items="mergedMyProjects"
            class="elevation-1 mt-3"
            :items-per-page="5"
          >
            <!-- Optional: Custom header slot using Vuetify's API -->
            <template #header="{ headers }">
              <tr>
                <th v-for="header in headers" :key="header.key" class="text-start">
                  {{ header.title }}
                </th>
              </tr>
            </template>
            <!-- Name column -->
            <template #item.name="{ item }">
              <strong>{{ item.name }}</strong>
            </template>
            <!-- Description column -->
            <template #item.description="{ item }">
              {{ item.description }}
            </template>
            <!-- Status column -->
            <template #item.status="{ item }">
              <span v-if="item.status === 'Rejected'">Rejected</span>
              <span v-else-if="item.isProposed">Proposed</span>
              <span v-else>Active</span>
            </template>
            <!-- Actions column -->
            <template #item.actions="{ item }">
              <v-btn
                v-if="item.status !== 'Rejected'"
                color="blue-darken-2"
                depressed
                @click="editMyProject(item)"
              >
                Edit
              </v-btn>
              <v-btn
                v-else
                color="blue-darken-1"
                depressed
                @click="viewMyProject(item)"
              >
                View
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app padless>
      <v-col class="text-center" cols="12">
        © {{ new Date().getFullYear() }} Project Portal
      </v-col>
    </v-footer>

    <!-- Dialog for Registration Code (unchanged) -->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Enter Registration Code
        </v-card-title>
        <v-card-subtitle>
          {{ dialogProject ? dialogProject.name : '' }}
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="registrationInput"
            label="Registration Code"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="green darken-2" text @click="submitRegistration">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Confirming "No Code" Registration (unchanged) -->
    <v-dialog v-model="confirmDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Confirm Project Registration
        </v-card-title>
        <v-card-text>
          Are you sure you want to register for
          <strong>{{ confirmDialogProject?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">No</v-btn>
          <v-btn
            color="green darken-2"
            text
            @click="confirmNoCodeRegistration"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Rejected Projects (only reason) -->
    <v-dialog v-model="rejectionDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Rejected Project
        </v-card-title>
        <v-card-subtitle>
          {{ rejectionDialogItem?.name }}
        </v-card-subtitle>
        <v-card-text>
          <p>
            <strong>Reason for Rejection: </strong>
            {{ rejectionDialogItem?.rejectionReason }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="rejectionDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ProjectPortal",
  data: () => ({
    selectedView: "portal", // 'portal' or 'myProjects'
    search: "",
    selectedTags: [],
    availableTags: [
      "community",
      "coding",
      "outreach",
      "education",
      "innovation",
      "campus",
      "technology",
      "empowerment",
      "collaboration",
      "digital",
      "learning",
      "network",
      "nonprofit",
      "humanity",
      "social impact",
    ],
    // HEADERS for the Public Portal table
    headers: [
      { title: "Project Name", key: "name", sortable: false },
    ],
    // HEADERS for the combined My Projects table
    myProjectsHeaders: [
      { title: "Project Name", key: "name", sortable: false },
      { title: "Description", key: "description", sortable: false },
      { title: "Status", key: "status", sortable: false },
      { title: "Actions", key: "actions", sortable: false },
    ],
    // Public "Portal" Projects
    projects: [
      {
        name: "Community Code Initiative",
        metadata: { tags: ["community", "coding", "outreach"] },
        description: "Brings coders together for community-driven outreach.",
        memberCount: 7,
        activeExperiences: ["HICH - Project Head"],
        registrationCode: null,
      },
      {
        name: "Academic App Accelerator",
        metadata: { tags: ["education", "innovation", "campus"] },
        description: "Accelerates academic app creation and innovation.",
        memberCount: 3,
        activeExperiences: ["HON 3397 - HJD"],
        registrationCode: "AB12",
      },
    ],
    // MY ACTIVE PROJECTS
    myProjects: [
      {
        name: "Community Tech Empowerment",
        description: "An ongoing project bridging technology and local communities.",
        isProposed: false,
      },
      {
        name: "Digital Outreach Initiative",
        description: "A personal initiative to connect schools with digital resources.",
        isProposed: false,
      },

      // Some Rejected items with reasons
      {
        name: "Unapproved Tech Pilot",
        description: "A pilot project that got turned down.",
        status: "Rejected",
        rejectionReason: "Project already exists in a similar form.",
      },
      {
        name: "Rejected Data Analysis",
        description: "Proposed, but later rejected for lack of funding.",
        status: "Rejected",
        rejectionReason: "Project goals not clearly defined.",
      },
    ],
    // PROPOSED PROJECTS
    proposedProjects: [
      {
        name: "Future Coding Lab",
        description: "Proposed lab for next-gen coding research.",
      },
      {
        name: "Community Tech Drive",
        description: "Collects & repurposes old tech for nonprofits.",
      },
      {
        name: "Campus Innovation Think Tank",
        description: "Proposes new ways to improve campus life via tech.",
      },
    ],

    // Dialog states
    dialog: false,              // for the registration code flow
    dialogProject: null,        // ...
    registrationInput: "",

    confirmDialog: false,       // for "No Code" registration flow
    confirmDialogProject: null, // ...

    // Dialog for viewing Rejection Reason
    rejectionDialog: false,
    rejectionDialogItem: null,
  }),
  computed: {
    // FILTER for the Public Portal
    filteredProjects() {
      return this.projects.filter((project) => {
        const matchesSearch =
          !this.search ||
          project.name.toLowerCase().includes(this.search.toLowerCase());
        const matchesTags =
          this.selectedTags.length === 0 ||
          this.selectedTags.every((tag) =>
            project.metadata.tags.includes(tag)
          );
        return matchesSearch && matchesTags;
      });
    },
    // Merge My Projects and Proposed Projects (marking proposed with isProposed = true)
    mergedMyProjects() {
      const labeledProposed = this.proposedProjects.map((p) => ({
        ...p,
        isProposed: true,
      }));
      // Combine myProjects + labeledProposed
      return [...this.myProjects, ...labeledProposed];
    },
  },
  methods: {
    // Registration Flow
    openDialog(project) {
      if (project.registrationCode && project.registrationCode.trim() !== "") {
        this.dialogProject = project;
        this.registrationInput = "";
        this.dialog = true;
      } else {
        this.confirmDialogProject = project;
        this.confirmDialog = true;
      }
    },
    closeDialog() {
      this.dialog = false;
      this.dialogProject = null;
      this.registrationInput = "";
    },
    submitRegistration() {
      if (!this.registrationInput.trim()) {
        toast.error("Please enter a registration code.", {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
        });
        return;
      }
      if (this.registrationInput === this.dialogProject.registrationCode) {
        toast.success(`Registration successful for ${this.dialogProject.name}!`, {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
        });
      } else {
        toast.error("Incorrect registration code. Please try again.", {
          position: "top-right",
          toastClassName: "Toastify__toast--delete",
        });
      }
      this.closeDialog();
    },
    confirmNoCodeRegistration() {
      toast.success(`Registration successful for ${this.confirmDialogProject.name}!`, {
        position: "top-right",
        toastClassName: "Toastify__toast--create",
      });
      this.confirmDialog = false;
      this.confirmDialogProject = null;
    },

    // Existing "Edit" action
    editMyProject(item) {
      toast.info(`Edit action clicked for "${item.name}"`, {
        position: "top-right",
        toastClassName: "Toastify__toast--update",
      });
    },
    
    // "View" action for Rejected projects
    viewMyProject(item) {
      // Open the rejectionReason dialog
      this.rejectionDialogItem = item;
      this.rejectionDialog = true;
    },
  },
  mounted() {
    console.log("Project Portal visited!");
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
