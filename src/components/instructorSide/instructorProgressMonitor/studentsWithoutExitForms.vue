<!-- studentsWithoutExitForms - this view presents a list of students who have completed/have not completed a Exit Setting Form for a given Experience Instance. Checks whether the student registered for the Experience Instance in order to know if that student is returned (if they registered for an Experience Instance, they should complete a Exit Setting Form for that Instance)-->
<template>
  <v-container>

    <v-row>
      <v-col cols="12">
          <v-card>
              <v-card-title class="pa-4 d-flex justify-space-between align-center">
                Exit Form Completion Tracker
                <progress-monitor-csv-downloader v-if="selectedExperience && studentsWithoutExitForm.length" :data="studentsWithoutExitForm" :file-name="csvFileName" />
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

              <v-row justify="space-between">
                <v-col cols="auto" class="ml-4">
                  <v-btn size="small"
                    :active="isNavigationDisabled"
                    @click="toggleNavigation"
                  >Disable Navigation</v-btn>
                </v-col>
              </v-row>
              </v-container>
      
              <!-- Table -->
              <div style="display: flex; justify-content: center;">
              <v-table v-if="paginatedStudentsWithoutExitForm.length" style="width: 95%;">
                  <thead>
                  <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Email</th>
                      <th class="text-left">Registration Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="student in paginatedStudentsWithoutExitForm"
                      :key="student._id"
                      :class="{ 'hoverRow': hoverId === student._id }"
                      @mouseenter="hoverId = student._id"
                      @mouseleave="hoverId = null"
                      @click="navigateIfEnabled(student._id)"
                  >
                      <td class="text-left">{{ formatFullName(student.firstName, student.lastName) }}</td>
                      <td class="text-left">{{ student.email }}</td>
                      <td class="text-left">{{ formatDate(student.registrationDate) }}</td>
                  </tr>
                  </tbody>
              </v-table>
              <v-table v-if="paginatedStudentsWithExitForm.length" style="width: 95%;">
                  <thead>
                  <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Email</th>
                      <th class="text-left">Registration Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="student in paginatedStudentsWithExitForm"
                      :key="student._id"
                      @mouseenter="hoverId = student._id"
                      @mouseleave="hoverId = null"
                      @click="navigateIfEnabled(student._id)"
                  >
                      <td class="text-left" :class="{ 'hoverRow': hoverId === student._id }">{{ formatFullName(student.firstName, student.lastName) }}</td>
                      <td class="text-left" :class="{ 'hoverRow': hoverId === student._id }">{{ student.email }}</td>
                      <td class="text-left" :class="{ 'hoverRow': hoverId === student._id }">{{ formatDate(student.registrationDate) }}</td>
                      <!-- <td>
                        <v-btn @click.stop="viewStudentExitForm(student._id)">View Exit Form</v-btn>
                      </td> -->
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
import { DateTime } from "luxon";

export default {
  name: "StudentsWithoutExitForms",
  data() {
    return {
      selectedExperience: null,
      expInstances: [],
      studentsWithoutExitForm: [],
      hoverId: null,
      csvFileName: 'no_exit_form.csv',
      currentPage: 1,
      itemsPerPage: 10,
      completed: null,
      studentsWithExitForm: [],
      isNavigationDisabled: false,
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
        this.csvFileName = `no_exit_form_${selectedObj.experienceName}.csv`;
      } else {
        this.csvFileName = 'no_exit_form.csv';
      }
      if (newVal !== null && this.completed !== null) {
        this.fetchStudents();
      }
    },
    completed(newVal, oldVal) {
      if (newVal !== null && this.selectedExperience !== null) {
        this.fetchStudents();
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
    paginatedStudentsWithoutExitForm() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.studentsWithoutExitForm.slice(start, end);
    },
    paginatedStudentsWithExitForm() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.studentsWithExitForm.slice(start, end);
    },
    totalPaginationLength() {
      return Math.ceil(this.studentsWithoutExitForm.length / this.itemsPerPage);
    },
    totalStudentsCount() {
      if (this.studentsWithoutExitForm.length === 0) {
        return this.studentsWithExitForm.length;
      } else if (this.studentsWithExitForm.length === 0) {
        return this.studentsWithoutExitForm.length;
      } else {
        return null;
      }
    },
  },
  methods: {

    // Fetches active experience instances for the instructor from the backend API. Upon receiving the response, it maps the instance data to a structured format and stores it in the component's state.
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

    // Initiates the process of fetching students based on whether they have completed Exit forms or not. It calls different methods to fetch students with Exit forms or without Exit forms based on the value of the `completed` property.
    async fetchStudents() {
      if (this.selectedExperience === null || this.completed === null) return;
      this.studentsWithExitForm = [];
      this.studentsWithoutExitForm = [];
      if (this.completed === true) {
        await this.fetchStudentsWithExitForm();
      } else if (this.completed === false) {
        await this.fetchStudentsWithoutExitForm();
      }
    },

    // Fetches students who have not completed a Exit form for a specific experience. It sends a GET request to the backend API with the selected experience ID. Upon receiving the response, it stores the data of students without a Exit form for the specified experience in the component's state.
    async fetchStudentsWithoutExitForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-without-exit-form/${this.selectedExperience}`;
      
      try {
        const response = await axios.get(url, { headers: { token } });
        this.studentsWithoutExitForm = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    // Fetches students who have completed a Exit form for a specific experience. It sends a GET request to the backend API with the selected experience ID. Upon receiving the response, it stores the data of students with a Exit form for the specified experience in the component's state.
    async fetchStudentsWithExitForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-with-exit-form/${this.selectedExperience}`;
      
      try {
        const response = await axios.get(url, { headers: { token } });
        this.studentsWithExitForm = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    toggleNavigation() {
        this.isNavigationDisabled = !this.isNavigationDisabled; // Toggle the navigation state
        // Optionally change the button text based on state
        this.navigationButtonText = this.isNavigationDisabled ? "Enable Student Navigation" : "Disable Student Navigation";
      },

      navigateIfEnabled(userID) {
        if (!this.isNavigationDisabled) {
          this.navigateToProfile(userID);
        }
      },

    // Navigates to the profile page of a specific student identified by their userID.
    navigateToProfile(userID) {
      this.$router.push({
        name: "instructorSpecificStudent",
        params: { userID: userID },
      });
    },

    // Concatenates the first name and last name to form a full name string.
    formatFullName(firstName, lastName) {
        return `${firstName} ${lastName}`;
    },

    // Formats a date to the "MM/dd/yyyy" format.
    formatDate(date) {
      return DateTime.fromISO(date).toFormat("MM/dd/yyyy");
    },

    // Navigates to the page to view the Exit form of a specific student identified by their studentID.
    // viewStudentExitForm(studentID) {
    //   this.$router.push({
    //     name: "StudentExitFormViewer",
    //     params: { 
    //       studentID: studentID,
    //       expInstanceID: this.selectedExperience
    //     },
    //   });
    // }
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
