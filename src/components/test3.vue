<template>
  <main>
    <!-- Form for updating a project -->
    <v-form @submit.prevent="handleUpdateForm">
      <v-container>
        <!-- Page title -->
        <p class="font-weight-black text-h6">Update Project</p>

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
            <v-btn style="text-align: center;" @click="handleUpdateForm">Update</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "UpdateProject",
  data() {
    return {
      // Pre-fill with some example data
      project: {
        _id: "12345", // for demo, assume we have an ID
        projectName: "Demo Project",
        projectDescription: "This is a pre-populated description.",
        selectedTags: ["coding", "innovation"] // pre-selected
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
    async handleUpdateForm() {
      try {
        // For a real update, you might do something like:
        const apiURL = import.meta.env.VITE_ROOT_API + `/projects/${this.project._id}`;
        // Using PUT for an update, but it depends on your API
        const response = await axios.put(apiURL, this.project);
        if (response.status === 200) {
          // Navigate away after success
          this.$router.push({ name: "projectManagement" });
        }
      } catch (error) {
        console.error("Error updating project:", error);
        // Handle error appropriately
      }
    }
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
