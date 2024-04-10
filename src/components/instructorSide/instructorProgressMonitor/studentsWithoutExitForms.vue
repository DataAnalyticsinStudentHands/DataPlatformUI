<!-- studentsWithoutExitForms - this view presents a list of students who have registered for a given selected Experience Instance, but have not yet completed an Exit Form for that Instance -->
<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="pa-4 d-flex justify-space-between align-center">
              Exit Form Completion Tracker
              <progress-monitor-csv-downloader
                v-if="selectedExperience && studentsWithoutExitForm.length"
                :data="studentsWithoutExitForm"
                :file-name="csvFileName"
              />
            </v-card-title>
            <v-card-subtitle class="text-h6">
              Select an Experience
            </v-card-subtitle>
  
            <v-container>
              <v-row>
                <v-col cols="12" sm="8" md="8">
                  <v-autocomplete
                    v-model="selectedExperience"
                    :items="formattedExperiences"
                    label="Experience"
                    item-title="text"
                    item-value="value"
                    clearable
                    @update:modelValue="updateExperienceID"
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-row v-if="selectedExperience">
                <v-col cols="12">
                  <div class="text-h6 pa-4">
                    Total Students: {{ totalStudentsCount }}
                  </div>
                </v-col>
              </v-row>

                <!-- Pagination Controls -->
                <v-row justify="space-between">
                  <v-col cols="auto">
                    <v-text-field
                      v-model="itemsPerPage"
                      type="number"
                      min="1"
                      label="Students per page:"
                      dense
                      outlined
                      @change="currentPage = 1"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="auto">
                    <v-pagination
                      v-model="currentPage"
                      :length="totalPaginationLength"
                      :total-visible="10"
                    ></v-pagination>
                  </v-col>
                </v-row>
            </v-container>
  
            <!-- Table -->
            <div style="display: flex; justify-content: center;">
              <v-table style="width: 95%;">
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="student in paginatedStudentsWithoutExitForm"
                    :key="student._id"
                    :class="{ 'hoverRow': hoverId === student._id }"
                    @mouseenter="hoverId = student._id"
                    @mouseleave="hoverId = null"
                    @click="navigateToProfile(student._id)"
                  >
                    <td class="text-left">{{ student.firstName }} {{ student.lastName }}</td>
                    <td class="text-left">{{ student.email }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import ProgressMonitorCSVDownloader from './progressMonitorCSVDownloader.vue';
  
  export default {
    name: "StudentsWithoutEntryForms",
    data() {
      return {
        selectedExperience: null,
        experiences: [],
        studentsWithoutExitForm: [],
        hoverId: null,
        csvFileName: 'no_exit_form.csv',
        currentPage: 1,
        itemsPerPage: 10,
      };
    },
    components: {
      'progress-monitor-csv-downloader': ProgressMonitorCSVDownloader
    },
    watch: {
      selectedExperience(newVal) {
        if (newVal) {
          // Find the selected experience object by its ID
          const selectedObj = this.experiences.find(experience => experience.experienceID === newVal);
          // Update the file name using the experience name from the selected object
          this.csvFileName = `no_exit_form_${selectedObj.experienceName}.csv`;
        } else {
          this.csvFileName = 'no_exit_form.csv';
        }
      },
    },
    mounted() {
      this.fetchExperiences();
    },
    computed: {
      formattedExperiences() {
        return this.experiences.map(experience => ({
          text: `${experience.experienceCategory}: ${experience.experienceName}`,
          value: experience.experienceID
        }));
      },
      paginatedStudentsWithoutExitForm() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.studentsWithoutExitForm.slice(start, end);
      },
      totalPaginationLength() {
        return Math.ceil(this.studentsWithoutExitForm.length / this.itemsPerPage);
      },
      totalStudentsCount() {
        return this.studentsWithoutExitForm.length;
      },
    },
    methods: {

      // Updates the selected experience ID and triggers fetching of students without an exit form based on the selected experience. If no experience is selected, sets the selected experience ID to null.
      updateExperienceID(selected) {
        if (!selected) {
          this.selectedExperience = null;
          return;
        }
        this.selectedExperience = selected;
        this.fetchstudentsWithoutExitForm(selected);
      },

      // Fetches the active semester experiences available for students. It sends a GET request to the backend API. Upon receiving the response, it maps the experience data to a more structured format and stores it in the component's state.
      async fetchExperiences() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/activeSemesterExperiences/';
  
        try {
          const response = await axios.get(apiURL, { headers: { token } });
          this.experiences = response.data.map(experience => ({
            experienceID: experience._id,
            experienceCategory: experience.experienceCategory,
            experienceName: experience.experienceName
          }));
        } catch (error) {
          this.handleError(error);
        }
      },

      // Fetches the students who have not submitted an exit form for a specific experience. It sends a GET request to the backend API. Upon receiving the response, it stores the data of students without an exit form for the specified experience in the component's state.
      async fetchstudentsWithoutExitForm(experienceID) {
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/studentsPendingExitForm?experienceID=${experienceID}`;
  
        try {
          const response = await axios.get(url, { headers: { token } });
          this.studentsWithoutExitForm = response.data;
        } catch (error) {
          this.handleError(error);
        }
      },

      // Navigates to the profile page of a specific student identified by their user ID.
      navigateToProfile(userID) {
        this.$router.push({
          name: "instructorSpecificStudent",
          params: { userID: userID },
        });
      },

    },
  };
  </script>
  
  <style scoped>
  .hoverRow {
    background-color: #f0f0f0;
    cursor: pointer;
  }

  :deep(.v-autocomplete input[type="text"]:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid transparent !important; /* Update this line if you have a different border style */
  background-color: transparent !important;
}
  </style>
  