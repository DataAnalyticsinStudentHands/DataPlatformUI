<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="pa-4 d-flex justify-space-between align-center">
              Students Without Entry Form
              <progress-monitor-csv-downloader v-if="studentsWithoutEntryForm" :data="studentsWithoutEntryForm" file-name="students_without_entry_form.csv" />
            </v-card-title>

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
                        @click="navigateToProfile(student._id)"
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
      };
    },
    components: {
      'progress-monitor-csv-downloader': ProgressMonitorCSVDownloader
    },
    mounted() {
      this.fetchStudentsWithoutEntryForm();
    },
    computed: {
      paginatedStudentsWithoutEntryForm() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.studentsWithoutEntryForm.slice(start, end);
      },
      totalPaginationLength() {
        return Math.ceil(this.studentsWithoutEntryForm.length / this.itemsPerPage);
      },
      totalPaginationLength() {
        return Math.ceil(this.studentsWithoutEntryForm.length / this.itemsPerPage);
      },
      totalStudentsCount() {
        return this.studentsWithoutEntryForm.length;
      },
    },
    methods: {
      async fetchStudentsWithoutEntryForm() {
        this.loading = true;
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/students-without-entry-form';
  
        try {
          const response = await axios.get(url, { headers: { token } });
          this.studentsWithoutEntryForm = response.data;
          console.log('studentsWithoutEntryForm: ', this.studentsWithoutEntryForm);
        } catch (error) {
          this.handleError(error);
        } finally {
            this.loading = false;
        }
      },
      navigateToProfile(userID) {
        this.$router.push({
          name: "instructorSpecificStudent",
          params: { userID: userID },
        });
      },
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
  