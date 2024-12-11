<!-- studentsWithoutEntryForms - this view presents a list of students that have registered for and activated their account, but have not yet completed a Student Entry Form -->
<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <!-- Title with CSV download button for students without entry forms -->
            <v-card-title class="pa-4 d-flex justify-space-between align-center">
              Students Without Entry Form
              <progress-monitor-csv-downloader v-if="studentsWithoutEntryForm" :data="studentsWithoutEntryForm" file-name="students_without_entry_form.csv" />
            </v-card-title>

            <!-- Display total number of students without entry forms -->
            <v-row>
              <v-col cols="12">
                <div class="text-h6 pa-4">
                  Total Students: {{ totalStudentsCount }}
                </div>
              </v-col>
            </v-row>

            <!-- Pagination Controls -->
            <v-row justify="space-between">
              <v-col cols="auto" class="ml-4">
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





            <!-- Loading Wheel -->
            <div v-if="loading" class="d-flex justify-center align-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            
            <div v-else style="display: flex; justify-content: center;" class="table-container">



              <v-row>
                <v-col cols="12">

                  <!-- Table -->
                  <v-table style="width: 95%;">
                    <thead>
                      <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Email</th>
                        <th class="text-left">Account Creation Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="student in paginatedStudentsWithoutEntryForm"
                        :key="student._id"
                        :class="{ 'hoverRow': hoverId === student._id }"
                        @mouseenter="hoverId = student._id"
                        @mouseleave="hoverId = null"
                        @click="navigateIfEnabled(student._id)"
                      >
                        <td class="text-left">{{ student.firstName }} {{ student.lastName }}</td>
                        <td class="text-left">{{ student.email }}</td>
                        <td class="text-left">{{ formatDate(student.createdAt) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
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
    name: "StudentsWithoutEntryForms",
    data() {
      return {
        studentsWithoutEntryForm: [],
        hoverId: null,
        loading: false,
        currentPage: 1,
        itemsPerPage: 10,
        isNavigationDisabled: false,
      };
    },
    components: {
      'progress-monitor-csv-downloader': ProgressMonitorCSVDownloader
    },
    mounted() {
      // Fetch the list of students who haven't completed the entry form when the component is mounted
      this.fetchStudentsWithoutEntryForm();
    },

    computed: {
      // Returns the students for the current page based on pagination
      paginatedStudentsWithoutEntryForm() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.studentsWithoutEntryForm.slice(start, end);
      },

      // Returns the total number of pages for pagination
      totalPaginationLength() {
        return Math.ceil(this.studentsWithoutEntryForm.length / this.itemsPerPage);
      },

      // Returns the total count of students without entry form
      totalStudentsCount() {
        return this.studentsWithoutEntryForm.length;
      },
    },

    methods: {

      // Fetches the students who do not have an entry form. It sends a GET request to the backend API. Upon receiving the response, it stores the data of students without an entry form in the component's state. 
      async fetchStudentsWithoutEntryForm() {
        this.loading = true;
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/students-without-entry-form';
  
        try {
          const response = await axios.get(url, { headers: { token } });
          this.studentsWithoutEntryForm = response.data;
        } catch (error) {
          this.handleError(error);
        } finally {
            this.loading = false;
        }
      },

      // Toggles the navigation state and updates the button text accordingly
      toggleNavigation() {
        this.isNavigationDisabled = !this.isNavigationDisabled;
        this.navigationButtonText = this.isNavigationDisabled ? "Enable Student Navigation" : "Disable Student Navigation";
      },

      // Navigates to the student's profile if navigation is not disabled
      navigateIfEnabled(userID) {
        if (!this.isNavigationDisabled) {
          this.navigateToProfile(userID);
        }
      },

      // Navigates to the profile page of a specific student identified by their userID.
      navigateToProfile(userID) {
        useLoggedInUserStore().navigationData = {
          userID: userID
        };

        this.$router.push({
          name: "instructorSpecificStudent"
        });
      },

      // Formats the given date into "MM/dd/yyyy" format.
      formatDate(date) {
        return DateTime.fromISO(date).toFormat("MM/dd/yyyy")
      },
    },
  };
  </script>
  
  <style scoped>
  .hoverRow {
    background-color: #f0f0f0; /* light grey background */
    cursor: pointer;
  }

  .table-container {
  display: flex;
  justify-content: center;
  padding-top: 20px; 
}
  </style>
  