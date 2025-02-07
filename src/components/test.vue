<template>
  <v-app>
    <!-- Top App Bar -->
    <v-app-bar app color="white" dark>
      <v-app-bar-title>Project Portal</v-app-bar-title>
      <v-spacer />
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Side Navigation Drawer -->
    <v-navigation-drawer app v-model="drawer" clipped>
      <v-list>
        <v-list-item link prepend-icon="mdi-view-dashboard" title="Dashboard" />
        <v-list-item link prepend-icon="mdi-account-group" title="Projects" />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="pa-4">
        <!-- Row for Search Field and Tag Filter -->
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
          <v-col cols="">
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

        <!-- Row for the Data Table -->
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
                            <span
                              v-if="item.activeExperiences && item.activeExperiences.length"
                            >
                              {{ item.activeExperiences.join(', ') }}
                            </span>
                            <span v-else>
                              N/A
                            </span>
                          </div>
                          <div>
                            <strong>(Hidden) Registration Code:</strong> {{ item.registrationCode }}
                          </div>
                          <!-- Button aligned to bottom right -->
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

            <!-- Registration Code Dialog (for projects WITH a code) -->
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

            <!-- Confirmation Dialog (for projects WITHOUT a code) -->
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
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app padless>
      <v-col class="text-center" cols="12">
        © {{ new Date().getFullYear() }} Project Portal
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "ProjectPortal",
  data: () => ({
    drawer: true,
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
      "social impact"
    ],
    headers: [{ text: "Project Name", value: "name" }],
    dialog: false,
    dialogProject: null,
    registrationInput: "",
    confirmDialog: false,
    confirmDialogProject: null,

    // Hardcoded list of projects ...
    projects: [
  {
    name: "Community Code Initiative",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Brings coders together for community-driven outreach.",
    memberCount: 7,
    activeExperiences: ["HICH - Project Head"],
    registrationCode: null
  },
  {
    name: "Academic App Accelerator",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Accelerates academic app creation and innovation.",
    memberCount: 3,
    activeExperiences: ["HON 3397 - HJD"],
    registrationCode: "AB12"
  },
  {
    name: "Tech for Tomorrow",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Drives forward-thinking tech solutions for a better future.",
    memberCount: 9,
    activeExperiences: ["HON 4350"],
    registrationCode: ""
  },
  {
    name: "EduEngage Network",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Networks educational communities for digital engagement.",
    memberCount: 1,
    activeExperiences: ["HICH - R&D / Leadership Team"],
    registrationCode: "PX64"
  },
  {
    name: "Digital Campus Connect",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Connects campuses digitally for broader social impact.",
    memberCount: 5,
    activeExperiences: ["HON 3350"],
    registrationCode: null
  },
  {
    name: "Hack for Humanity",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Hosts coding events addressing humanitarian challenges.",
    memberCount: 8,
    activeExperiences: ["CHW Certification"],
    registrationCode: "ZT91"
  },
  {
    name: "Community Coding Collective",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Unites local coders for community-based projects.",
    memberCount: 2,
    activeExperiences: ["HICH - Project Volunteer"],
    registrationCode: ""
  },
  {
    name: "Scholars’ Code Collaboration",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Fosters scholar-led coding for academic empowerment.",
    memberCount: 10,
    activeExperiences: ["HON 4355"],
    registrationCode: "CD77"
  },
  {
    name: "Innovative Learning Lab",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Cultivates hands-on, tech-driven learning experiences.",
    memberCount: 4,
    activeExperiences: ["The Pharis Fellowship"],
    registrationCode: null
  },
  {
    name: "Community Code Exchange",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Encourages collaborative code sharing for social good.",
    memberCount: 6,
    activeExperiences: [
      "Summer Internship in Public History and Digital Humanities (SIPHDH)"
    ],
    registrationCode: "HL09"
  },
  {
    name: "Campus Code Catalyst",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Sparks campus-wide coding initiatives and outreach.",
    memberCount: 7,
    activeExperiences: ["Bonner Leaders Program"],
    registrationCode: null
  },
  {
    name: "Digital Outreach Hub",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Bridges communities with digital resources and solutions.",
    memberCount: 10,
    activeExperiences: ["HON 3397 - AI"],
    registrationCode: "MN52"
  },
  {
    name: "Scholars’ Sprint",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Engages students in quick, collaborative coding challenges.",
    memberCount: 2,
    activeExperiences: ["ASF Fellowship"],
    registrationCode: ""
  },
  {
    name: "Code & Community Crew",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Integrates code learning with local community efforts.",
    memberCount: 9,
    activeExperiences: ["PURS"],
    registrationCode: "G7H3"
  },
  {
    name: "Smart Campus Solutions",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Implements intelligent tech to enhance campus life.",
    memberCount: 4,
    activeExperiences: ["HICH - Project Volunteer", "PURS"],
    registrationCode: null
  },
  {
    name: "Bridging Code & Community",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Connects communities through code-based outreach.",
    memberCount: 1,
    activeExperiences: ["HICH - Project Head"],
    registrationCode: "K3L9"
  },
  {
    name: "Code for Change Initiative",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Leverages coding to drive social change in academics.",
    memberCount: 8,
    activeExperiences: ["ASF Fellowship"],
    registrationCode: ""
  },
  {
    name: "EduCode Innovators",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Empowers educators and students in tech innovation.",
    memberCount: 7,
    activeExperiences: ["HON 3397 - HJD"],
    registrationCode: "T2X7"
  },
  {
    name: "Community Tech Connect",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Links community members via technology programs.",
    memberCount: 5,
    activeExperiences: ["The Pharis Fellowship"],
    registrationCode: null
  },
  {
    name: "Digital Learning Dynamics",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Enhances education with dynamic, tech-focused methods.",
    memberCount: 6,
    activeExperiences: ["CHW Certification"],
    registrationCode: "Y7Q6"
  },
  {
    name: "Coding Champions for Community",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Celebrates coders contributing to local impact.",
    memberCount: 3,
    activeExperiences: ["Bonner Leaders Program"],
    registrationCode: ""
  },
  {
    name: "Academic Digital Lab",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Merges academic research with digital innovation.",
    memberCount: 8,
    activeExperiences: [
      "Summer Internship in Public History and Digital Humanities (SIPHDH)"
    ],
    registrationCode: "DX99"
  },
  {
    name: "NextGen Code",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Equips the next generation of developers for social impact.",
    memberCount: 10,
    activeExperiences: ["HON 4350", "HON 4355"],
    registrationCode: null
  },
  {
    name: "Impact Code Collective",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Focuses on high-impact coding projects for good.",
    memberCount: 2,
    activeExperiences: ["HON 3397 - AI"],
    registrationCode: "QF23"
  },
  {
    name: "Academic Code Revolution",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Transforms academic environments through coding solutions.",
    memberCount: 9,
    activeExperiences: ["HICH - R&D / Leadership Team"],
    registrationCode: ""
  },
  {
    name: "Integrate: Code & Community",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Integrates coding into community engagement efforts.",
    memberCount: 5,
    activeExperiences: ["HON 3397 - HJD", "CHW Certification"],
    registrationCode: "A8P2"
  },
  {
    name: "Coding Academy for All",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Makes coding accessible to diverse learners.",
    memberCount: 4,
    activeExperiences: ["HICH - Project Volunteer"],
    registrationCode: ""
  },
  {
    name: "Tech Connect Campus",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Links technology with campus-wide empowerment.",
    memberCount: 1,
    activeExperiences: ["HON 4350"],
    registrationCode: "RT66"
  },
  {
    name: "Community Code Builders",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Enables communities to develop impactful coding projects.",
    memberCount: 8,
    activeExperiences: ["PURS"],
    registrationCode: null
  },
  {
    name: "Digital Engagement Project",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Promotes digital solutions for social engagement.",
    memberCount: 7,
    activeExperiences: ["HICH - Project Head"],
    registrationCode: "YU77"
  },
  {
    name: "Learning Through Code",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Encourages knowledge-building by doing with code.",
    memberCount: 3,
    activeExperiences: ["ASF Fellowship"],
    registrationCode: ""
  },
  {
    name: "Innovators’ Hub",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Fosters innovation via collaborative tech labs.",
    memberCount: 6,
    activeExperiences: ["The Pharis Fellowship"],
    registrationCode: "WE19"
  },
  {
    name: "The Tech Bridge Initiative",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Bridges communities and technology for greater outreach.",
    memberCount: 9,
    activeExperiences: ["HICH - R&D / Leadership Team"],
    registrationCode: null
  },
  {
    name: "Coding Crusaders",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Champions coding to solve real-world issues.",
    memberCount: 2,
    activeExperiences: ["Bonner Leaders Program", "HON 3350"],
    registrationCode: "VB33"
  },
  {
    name: "Campus Consortium Code",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Unites multiple campuses for shared coding initiatives.",
    memberCount: 10,
    activeExperiences: ["HON 3397 - AI"],
    registrationCode: ""
  },
  {
    name: "Engage & Code",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Drives community involvement through coding programs.",
    memberCount: 6,
    activeExperiences: ["HON 4355"],
    registrationCode: "KO59"
  },
  {
    name: "Community Code Lab",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Provides a communal space for code experimentation.",
    memberCount: 1,
    activeExperiences: [
      "Summer Internship in Public History and Digital Humanities (SIPHDH)"
    ],
    registrationCode: null
  },
  {
    name: "Academic Code Forum",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Hosts discussions on academic coding collaborations.",
    memberCount: 5,
    activeExperiences: ["CHW Certification"],
    registrationCode: "QZ88"
  },
  {
    name: "Empower through Code",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Strengthens communities by teaching coding skills.",
    memberCount: 8,
    activeExperiences: ["HON 3397 - HJD"],
    registrationCode: ""
  },
  {
    name: "Tech Outreach Network",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Forms a network for nonprofit tech outreach.",
    memberCount: 4,
    activeExperiences: ["HICH - Project Volunteer"],
    registrationCode: "MG17"
  },
  {
    name: "Collaborative Code Initiative",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Promotes cooperative coding for societal benefit.",
    memberCount: 3,
    activeExperiences: ["HON 3350"],
    registrationCode: null
  },
  {
    name: "Academic Empowerment Lab",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Enables academic innovation through technology resources.",
    memberCount: 9,
    activeExperiences: ["PURS", "HICH - Project Head"],
    registrationCode: "BRT2"
  },
  {
    name: "Digital Innovators in Community",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Cultivates local digital transformation through tech leadership.",
    memberCount: 6,
    activeExperiences: ["Bonner Leaders Program"],
    registrationCode: ""
  },
  {
    name: "Code & Learn Collective",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Blends code education with collaborative learning.",
    memberCount: 10,
    activeExperiences: ["HON 4350"],
    registrationCode: "R5XQ"
  },
  {
    name: "Project Tech Empowerment",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Advances social good via tech and partnerships.",
    memberCount: 1,
    activeExperiences: ["ASF Fellowship"],
    registrationCode: ""
  },
  {
    name: "Synergy: Code & Community",
    metadata: {
      tags: ["community", "coding", "outreach"]
    },
    description: "Combines coding efforts with community synergy.",
    memberCount: 7,
    activeExperiences: ["HON 4355"],
    registrationCode: "C9K1"
  },
  {
    name: "Academic Outreach Through Tech",
    metadata: {
      tags: ["education", "innovation", "campus"]
    },
    description: "Extends academic reach with technology-driven programs.",
    memberCount: 2,
    activeExperiences: ["CHW Certification"],
    registrationCode: ""
  },
  {
    name: "Community Code Connectors",
    metadata: {
      tags: ["technology", "empowerment", "collaboration"]
    },
    description: "Links volunteers and coders to address community needs.",
    memberCount: 8,
    activeExperiences: ["HON 3397 - AI", "The Pharis Fellowship"],
    registrationCode: "G3Z5"
  },
  {
    name: "Innovative Code for Impact",
    metadata: {
      tags: ["digital", "learning", "network"]
    },
    description: "Creates creative code solutions with lasting social impact.",
    memberCount: 5,
    activeExperiences: ["HICH - R&D / Leadership Team"],
    registrationCode: ""
  },
  {
    name: "Campus Community Coders",
    metadata: {
      tags: ["nonprofit", "humanity", "social impact"]
    },
    description: "Empowers campus-based coders to tackle humanitarian challenges.",
    memberCount: 8,
    activeExperiences: ["HON 3397 - HJD"],
    registrationCode: "DL00"
  }
]
  }),
  computed: {
    filteredProjects() {
      return this.projects.filter(project => {
        const matchesSearch =
          this.search.trim() === "" ||
          project.name.toLowerCase().includes(this.search.toLowerCase());
        const matchesTags =
          this.selectedTags.length === 0 ||
          this.selectedTags.every(tag => project.metadata.tags.includes(tag));
        return matchesSearch && matchesTags;
      });
    }
  },
  methods: {
    openDialog(project) {
      // If a valid registration code exists, show the code input dialog
      if (project.registrationCode && project.registrationCode.trim() !== "") {
        this.dialogProject = project;
        this.registrationInput = "";
        this.dialog = true;
      } else {
        // Otherwise, prompt the new confirmation dialog
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
        toast.error('Please enter a registration code.', {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
        return;
      }

      if (this.registrationInput === this.dialogProject.registrationCode) {
        toast.success(`Registration successful for ${this.dialogProject.name}!`, {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
          multiple: false
        });
      } else {
        toast.error('Incorrect registration code. Please try again.', {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: false
        });
      }
      this.closeDialog();
    },

    confirmNoCodeRegistration() {
      // Because there's no code, we can assume direct success after user clicks "Yes"
      toast.success(`Registration successful for ${this.confirmDialogProject.name}!`, {
        position: "top-right",
        toastClassName: "Toastify__toast--create",
        multiple: false
      });

      // Close the confirmation dialog
      this.confirmDialog = false;
      this.confirmDialogProject = null;
    }
  },
  mounted() {
    console.log("Project Portal visited!");
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
