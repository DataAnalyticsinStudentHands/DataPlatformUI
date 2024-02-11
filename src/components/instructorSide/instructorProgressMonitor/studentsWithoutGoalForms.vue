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
                  <v-row>
                    <v-col>
                      Select an Experience
                    </v-col>
                  </v-row>
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
                        active
                    ></v-autocomplete>
                    </v-col>
                </v-row>

                <v-row class="mt-0 mb-2">
                  <v-col>
                      <v-btn 
                        class="mr-3"
                        @click="completed = true"
                        :active="completed"
                      >Completed</v-btn>
                      <v-btn
                        @click="completed = false"
                        :active="completed === false"
                      >Uncompleted</v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-btn
                      @click="fetchStudents"
                      :disabled="completed === null || !selectedExperience"
                    >Fetch Students</v-btn>
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
                <v-table v-if="paginatedStudentsWithoutGoalForm.length" style="width: 95%;">
                    <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Email</th>
                        <th class="text-left">Registration Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="student in paginatedStudentsWithoutGoalForm"
                        :key="student._id"
                        :class="{ 'hoverRow': hoverId === student._id }"
                        @mouseenter="hoverId = student._id"
                        @mouseleave="hoverId = null"
                        @click="navigateToProfile(student._id)"
                    >
                        <td class="text-left">{{ formatFullName(student.firstName, student.lastName) }}</td>
                        <td class="text-left">{{ student.email }}</td>
                        <td class="text-left">{{ formatDate(student.registrationDate) }}</td>
                    </tr>
                    </tbody>
                </v-table>
                <v-table v-if="paginatedStudentsWithGoalForm.length" style="width: 95%;">
                    <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Email</th>
                        <th class="text-left">Registration Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="student in paginatedStudentsWithGoalForm"
                        :key="student._id"
                        :class="{ 'hoverRow': hoverId === student._id }"
                        @mouseenter="hoverId = student._id"
                        @mouseleave="hoverId = null"
                        @click="navigateToProfile(student._id)"
                    >
                        <td class="text-left">{{ formatFullName(student.firstName, student.lastName) }}</td>
                        <td class="text-left">{{ student.email }}</td>
                        <td class="text-left">{{ formatDate(student.registrationDate) }}</td>
                    </tr>
                    </tbody>
                </v-table>
                </div>
        
            </v-card>
            </v-col>
        </v-row>
    </v-container>
    {{ this.selectedExperience }}
  </template>
  
  <script>
  import axios from 'axios';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import ProgressMonitorCSVDownloader from './progressMonitorCSVDownloader.vue';
  import { DateTime } from "luxon";
  
  export default {
    name: "StudentsWithoutGoalForms",
    data() {
      return {
        selectedExperience: null,
        expInstances: [],
        studentsWithoutGoalForm: [],
        hoverId: null,
        csvFileName: 'no_goal_form.csv',
        currentPage: 1,
        itemsPerPage: 10,
        completed: null,
        studentsWithGoalForm: [],
      };
    },
    components: {
      'progress-monitor-csv-downloader': ProgressMonitorCSVDownloader
    },
    watch: {
      selectedExperience(newVal) {
        if (newVal) {
          // Find the selected experience object by its ID
          const selectedObj = this.expInstances.find(instance => instance.expInstanceID === newVal);
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
        return this.expInstances.map(instance => ({
          text: `(${instance.sessionName}) ${instance.experienceCategory}: ${instance.experienceName}`,
          value: instance.expInstanceID
        }));
      },
      paginatedStudentsWithoutGoalForm() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.studentsWithoutGoalForm.slice(start, end);
      },
      paginatedStudentsWithGoalForm() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.studentsWithGoalForm.slice(start, end);
      },
      totalPaginationLength() {
        return Math.ceil(this.studentsWithoutGoalForm.length / this.itemsPerPage);
      },
      totalStudentsCount() {
        return this.studentsWithoutGoalForm.length;
      },
    },
    methods: {
      async fetchExperiences() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/instructorSideData/experience-instances/active/';
  
        try {
          const response = await axios.get(apiURL, { headers: { token } });
          this.expInstances = response.data.map(instance => ({
            expInstanceID: instance._id,
            sessionName: instance.session.name,
            experienceCategory: instance.experience.category,
            experienceName: instance.experience.name,
            registrationDate: instance.registrationDate
          }));
        } catch (error) {
          this.handleError(error);
        }
      },
      async fetchStudents() {
        console.log('fetchStudents called');
        this.studentsWithGoalForm = [];
        this.studentsWithoutGoalForm = [];
        if (this.completed === true) {
          console.log('this.completed is true')
          await this.fetchStudentsWithGoalForm();
        } else if (this.completed === false) {
          console.log('this.completed is false')
          await this.fetchStudentsWithoutGoalForm();
        }
      },
      async fetchStudentsWithoutGoalForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-without-goal-form/${this.selectedExperience}`;
        
        try {
          const response = await axios.get(url, { headers: { token } });
          this.studentsWithoutGoalForm = response.data;
        } catch (error) {
          this.handleError(error);
        }
      },
      async fetchStudentsWithGoalForm() {
        console.log('fetchStudentsWithGoalForm called');
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-with-goal-form/${this.selectedExperience}`;
        
        try {
          const response = await axios.get(url, { headers: { token } });
          this.studentsWithGoalForm = response.data;
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
      formatDate(date) {
        return DateTime.fromISO(date).toFormat("MM/dd/yyyy");
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
  