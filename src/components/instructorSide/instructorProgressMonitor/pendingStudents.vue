<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="pa-4">
              Pending Students Monitor
            </v-card-title>
            <v-card-subtitle class="pa-4 text-h6">
              Students with Pending Status
            </v-card-subtitle>
  
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
                    v-for="student in pendingStudents" 
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
  
  export default {
    name: "PendingStudents",
    data() {
      return {
        pendingStudents: [],
        loading: false,
        hoverId: null,
      };
    },
    mounted() {
      this.fetchPendingStudents();
    },
    methods: {
      async fetchPendingStudents() {
        this.loading = true;
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/user/checkStatus';
  
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
  