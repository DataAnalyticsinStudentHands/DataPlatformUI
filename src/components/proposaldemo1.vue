<template>
  <main>
    <v-card class="mx-auto my-4 pa-4" max-width="900" elevation="2">
      <!-- Card Title -->
      <v-card-title class="text-h6">
        Propose New Project
      </v-card-title>

      <v-divider></v-divider>

      <!-- Card Content -->
      <v-card-text>
        <v-form @submit.prevent="handleSubmitForm" ref="form">

          <!-- 1) BASIC PROJECT INFO -->
          <h3 class="text-subtitle-1 mt-4 mb-2">1. Basic Project Info</h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.projectName"
                label="Project Name"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.affiliation"
                label="Project Lead Affiliation (Dept/Org)"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 2) PROJECT DESCRIPTION -->
          <h3 class="text-subtitle-1 mt-4 mb-2">2. Project Description</h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.projectDescription"
                label="Project Description / Summary"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 3) BACKGROUND AND RATIONALE -->
          <h3 class="text-subtitle-1 mt-4 mb-2">3. Background / Rationale</h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.background"
                label="Why is this project needed?"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 4) PROJECT OBJECTIVES -->
          <h3 class="text-subtitle-1 mt-4 mb-2">4. Project Objectives</h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.objectives"
                label="What do you plan to achieve?"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 5) STAKEHOLDERS / BENEFICIARIES -->
          <h3 class="text-subtitle-1 mt-4 mb-2">
            5. Stakeholders & Beneficiaries
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="project.stakeholders"
                label="Stakeholders (Who is involved/supporting?)"
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="project.beneficiaries"
                label="Beneficiaries (Who will benefit?)"
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 6) EXPECTED IMPACT AND OUTCOMES -->
          <h3 class="text-subtitle-1 mt-4 mb-2">
            6. Expected Outcomes
          </h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.expectedImpact"
                label="Short & Long-term impact"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 7) RISKS & CHALLENGES -->
          <h3 class="text-subtitle-1 mt-4 mb-2">
            7. Potential Risks & Challenges
          </h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.risks"
                label="What could go wrong?"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 8) FUNDING & RESOURCES -->
          <h3 class="text-subtitle-1 mt-4 mb-2">
            8. Resources Needed
          </h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.fundingAndResources"
                label="Resources Needed"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 9) COLLABORATION OPPORTUNITIES -->
          <h3 class="text-subtitle-1 mt-4 mb-2">
            9. Collaboration / Partnership Opportunities
          </h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.collaboration"
                label="Potential partnership opportunities"
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 10) EVALUATION CRITERIA -->
          <h3 class="text-subtitle-1 mt-4 mb-2">
            10. Evaluation Criteria
          </h3>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="project.evaluation"
                label="How will success be measured?"
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 11) EXPERIENCE (AUTOCOMPLETE) -->
          <h3 class="text-subtitle-1 mt-4 mb-2">
            11. Experience
          </h3>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="selectedExperience"
                :items="formattedExperiences"
                item-title="text"
                item-value="value"
                clearable
                :rules="experienceIDRules"
                required
                variant="outlined"
                density="comfortable"
                label="Select an Experience"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- 12) TAGS CHECKBOXES -->
          <h3 class="text-subtitle-1 mt-4 mb-2">12. Select Tags</h3>
          <v-row>
            <v-col
              v-for="(column, colIndex) in tagColumns"
              :key="colIndex"
              cols="auto"
              class="d-flex flex-column"
            >
              <v-checkbox
                v-for="tag in column"
                :key="tag"
                v-model="project.selectedTags"
                :value="tag"
                density="compact"
                hide-details
                color="primary"
                class="my-1"
              >
                <template #label>
                  <span class="font-weight-medium text-body-1">{{ tag }}</span>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>

          <!-- ACTION BUTTONS -->
          <v-row class="mt-4">
            <v-col cols="12" class="d-flex justify-end">
              <v-btn variant="text" @click="$router.back()" class="me-2">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="handleSubmitForm">
                Submit
              </v-btn>
            </v-col>
          </v-row>

        </v-form>
      </v-card-text>
    </v-card>
  </main>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "NewProject",
  data() {
    return {
      project: {
        // Basic
        projectName: "Community Coding Workshop",
        affiliation: "CS Department, University of Example",
        contactEmail: "codingworkshop@university.edu",
        contactPhone: "555-1234",

        // Description
        projectDescription:
          "A workshop series introducing coding fundamentals to community members.",

        // Background & Rationale
        background:
          "Local community lacks access to basic programming education, so we aim to fill that gap.",

        // Objectives
        objectives:
          "1) Teach coding basics 2) Foster collaboration 3) Improve digital literacy.",

        // Stakeholders / Beneficiaries
        stakeholders: "University faculty, local community center, volunteer mentors",
        beneficiaries: "High school students, adult learners, underrepresented groups",

        // Expected Impact / Outcomes
        expectedImpact:
          "Immediate: participants gain coding skills. Long-term: increased tech awareness and job readiness.",

        // Activities / Methodology (not shown in template but kept in data)
        activities:
          "Weekly coding sessions, project-based learning, mentor-led hackathons",

        // Timeline / Milestones (not shown in template but kept in data)
        timeline:
          "Spring semester start, weekly sessions, final showcase after 12 weeks.",

        // Risks / Challenges
        risks: "Low participant turnout, scheduling conflicts, limited funding",

        // Funding / Resources
        fundingAndResources:
          "Budget for laptops, software licenses, marketing materials, and venue costs.",

        // Collaboration
        collaboration:
          "Partnerships with local businesses and nonprofits to provide mentors and sponsorship.",

        // Evaluation Criteria
        evaluation:
          "Pre- and post-surveys, number of attendees, participant feedback, project completion rate.",

        // Sustainability / Long-Term Plans (not used in template but included)
        sustainability:
          "Plan to run the program annually with ongoing sponsorship and volunteer support.",

        // Tags
        selectedTags: ["education", "community"], // preselect a couple of tags for demo
      },

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

      // Existing fields for experience
      selectedExperience: 2, // Default to "Experience 2"
      formattedExperiences: [
        { text: "HICH", value: 1 },
        { text: "HON 3350", value: 2 },
        { text: "Pharis Fellowship", value: 3 },
      ],
      experienceIDRules: [
        (v) => !!v || "Experience selection is required",
      ],
    };
  },
  mounted() {
    // Example toast upon component mount
    toast.success(`Project Proposal Form Loaded`, {
      position: "top-right",
      toastClassName: "Toastify__toast--create",
      multiple: true,
    });
  },
  computed: {
    // Splits the availableTags array into columns of 7 items each
    tagColumns() {
      const cols = [];
      for (let i = 0; i < this.availableTags.length; i += 7) {
        cols.push(this.availableTags.slice(i, i + 7));
      }
      return cols;
    },
  },
  methods: {handleSubmitForm() {
    try {
      // Navigate to /proposaldemo2 using Vue Router
      this.$router.push('/proposaldemo2');
    } catch (error) {
      console.error("Error navigating:", error);
      toast.error("There was an error navigating to the proposal demo.", {
        position: "top-right",
      });
    }
  },

  },
};
</script>

<style scoped>
.me-2 {
  margin-right: 8px;
}
</style>
