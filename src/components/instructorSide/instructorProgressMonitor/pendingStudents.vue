<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="pa-4 d-flex justify-space-between align-center">
              Pending Students Monitor
              <progress-monitor-csv-downloader v-if="pendingStudents" :data="pendingStudents" file-name="pending_students.csv" />
            </v-card-title>
            <v-card-subtitle class="pa-4 text-h6">
              Students with Pending Status
            </v-card-subtitle>

            <v-row>
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
  
            <!-- Loading Wheel -->
            <div v-if="loading" class="d-flex justify-center align-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
  
            <!-- Table -->
            <div v-else style="display: flex; justify-content: center;" class="table-container">
              <v-table style="width: 95%;">
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="student in paginatedPendingStudents" 
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
    name: "PendingStudents",
    data() {
      return {
        pendingStudents: [],
        loading: false,
        hoverId: null,
        currentPage: 1,
        itemsPerPage: 10,
      };
    },
    components: {
      'progress-monitor-csv-downloader': ProgressMonitorCSVDownloader
    },
    mounted() {
      this.fetchPendingStudents();
    },
    computed: {
      paginatedPendingStudents() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.pendingStudents.slice(start, end);
      },
      totalPaginationLength() {
        return Math.ceil(this.pendingStudents.length / this.itemsPerPage);
      },
      totalStudentsCount() {
        return this.pendingStudents.length;
      },
    },
    methods: {
      async fetchPendingStudents() {
        this.loading = true;
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/user/check-status';
  
        try {
          const response = await axios.get(url, { headers: { token } });
          this.pendingStudents = response.data;
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
    },
  };
  </script>
  
  <style scoped>
  .table-container {
    display: flex;
    justify-content: center;
    padding-top: 20px; 
  }

  
.hoverRow {
  background-color: #f0f0f0; /* light grey background */
  cursor: pointer;
}

  </style>
  