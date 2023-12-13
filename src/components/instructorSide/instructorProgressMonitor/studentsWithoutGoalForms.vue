<template>
    <v-container>

      <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-title class="pa-4 d-flex justify-space-between align-center">
                  Goal Form Completion Tracker
                  <progress-monitor-csv-downloader v-if="selectedExperience && studentsWithoutGoalForm.length" :data="studentsWithoutGoalForm" :file-name="csvFileName" />
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
                        active
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
                        <th class="text-left">Pronouns</th>
                        <th class="text-left">Major(s)</th>
                        <th class="text-left">Minor</th>
                        <th class="text-left">Expected Graduation Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="student in paginatedStudentsWithoutGoalForm"
                        :key="student.userID"
                        :class="{ 'hoverRow': hoverId === student.userID }"
                        @mouseenter="hoverId = student.userID"
                        @mouseleave="hoverId = null"
                        @click="navigateToProfile(student.userID)"
                    >
                        <td class="text-left">{{ formatFullName(student.firstName, student.lastName) }}</td>
                        <td class="text-left">{{ student.email }}</td>
                        <td class="text-left">{{ student.pronouns.map(p => p.label).join(', ') }}</td>
                        <td class="text-left">{{ student.majors.join(', ') }}</td>
                        <td class="text-left">{{ student.honorsMinors.join(', ') }}</td>
                        <td class="text-left">{{ student.expectedGraduationDate }}</td>
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
  import 'vue3-toastify/dist/index.css';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import ProgressMonitorCSVDownloader from './progressMonitorCSVDownloader.vue';
  
  export default {
    name: "StudentsWithoutGoalForms",
    data() {
      return {
        selectedExperience: null,
        experiences: [],
        studentsWithoutGoalForm: [],
        hoverId: null,
        csvFileName: 'no_goal_form.csv',
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
          this.csvFileName = `no_goal_form_${selectedObj.experienceName}.csv`;
        } else {
          this.csvFileName = 'no_goal_form.csv';
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
      paginatedStudentsWithoutGoalForm() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.studentsWithoutGoalForm.slice(start, end);
      },
      totalPaginationLength() {
        return Math.ceil(this.studentsWithoutGoalForm.length / this.itemsPerPage);
      },
      totalStudentsCount() {
        return this.studentsWithoutGoalForm.length;
      },
    },
    methods: {
      updateExperienceID(selected) {
        // If the selected value is empty, set selectedExperience to null and exit the method
        if (!selected) {
          this.selectedExperience = null;
          return;
        }
  
        // If a value is selected, set selectedExperience to the value of the selected experience
        this.selectedExperience = selected;
        this.fetchStudentsWithoutGoalForm(selected);
      },
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
      async fetchStudentsWithoutGoalForm(experienceID) {
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/studentsWithoutGoalForm?experienceID=${experienceID}`;
        
        try {
          const response = await axios.get(url, { headers: { token } });
          this.studentsWithoutGoalForm = response.data;
        } catch (error) {
          this.handleError(error);
        }
      },
      navigateToProfile(userID) {
        this.$router.push({
          name: "instructorSpecificStudent",
          params: { userID: userID },
        });
      },
      formatFullName(firstName, lastName) {
          return `${firstName} ${lastName}`;
      },
    },
  };
  </script>
  
  <style scoped>

.hoverRow {
  background-color: #f0f0f0; /* light grey background */
  cursor: pointer;
}

:deep(.v-autocomplete input[type="text"]:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: 1px solid transparent !important; /* Update this line if you have a different border style */
  background-color: transparent !important;
}


  </style>
  