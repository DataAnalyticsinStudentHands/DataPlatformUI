<template>
  <main>
    <!-- Form for creating a new project -->
    <v-form @submit.prevent="handleSubmitForm">
      <v-container>
        <!-- Page title -->
        <p class="font-weight-black text-h6">New Project</p>

        <!-- Input for the project name -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="project.projectName"
              label="Project Name"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Input for the project description -->
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="project.projectDescription"
              label="Project Description"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- Checkboxes for selecting tags (split into columns of 7) -->
        <p class="font-weight-bold text-subtitle-1">Select Tags</p>
        <v-row justify="start">
          <v-col
            v-for="(column, colIndex) in tagColumns"
            :key="colIndex"
            cols="auto"
          >
            <div v-for="tag in column" :key="tag">
              <v-checkbox
                density="compact"
                class="ma-0 pa-0"
                hide-details="true"
                v-model="project.selectedTags"
                :label="tag"
                :value="tag"
              ></v-checkbox>
            </div>
          </v-col>
        </v-row>

        <!-- Action buttons -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-btn @click="$router.back()" style="margin-right: 10px;">
              Cancel
            </v-btn>
            <v-btn style="text-align: center;" @click="handleSubmitForm">Submit</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </main>
</template>

<script>
import axios from "axios";
export default {
  name: "NewProject",
  data() {
    return {
      project: {
        projectName: "",
        projectDescription: "",
        selectedTags: []
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
        "social impact"
      ]
    };
  },
  computed: {
    // Splits the availableTags array into columns of 7 items each.
    tagColumns() {
      const cols = [];
      for (let i = 0; i < this.availableTags.length; i += 7) {
        cols.push(this.availableTags.slice(i, i + 7));
      }
      return cols;
    }
  },
  methods: {
    async handleSubmitForm() {
      try {
        const apiURL = import.meta.env.VITE_ROOT_API + `/projects/`;
        const response = await axios.post(apiURL, this.project);
        if (response.status === 201) {
          this.$router.push({ name: "projectManagement" });
        }
      } catch (error) {
        console.error("Error submitting project:", error);
        // Handle the error appropriately.
      }
    }
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
