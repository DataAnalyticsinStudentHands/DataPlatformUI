<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Exit Form Completion Tracker
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
                    v-for="student in studentsWithExitForm"
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
    name: "StudentsWithoutEntryForms",
    data() {
      return {
        selectedExperience: null,
        experiences: [],
        studentsWithExitForm: [],
        hoverId: null,
      };
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
    },
    methods: {
      updateExperienceID(selected) {
        if (!selected) {
          this.selectedExperience = null;
          return;
        }
        this.selectedExperience = selected;
        this.fetchStudentsWithExitForm(selected);
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
      async fetchStudentsWithExitForm(experienceID) {
        const user = useLoggedInUserStore();
        let token = user.token;
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/studentsPendingExitForm?experienceID=${experienceID}`;
  
        try {
          const response = await axios.get(url, { headers: { token } });
          this.studentsWithExitForm = response.data;
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
    },
  };
  </script>
  
  <style scoped>
  .hoverRow {
    background-color: #f0f0f0;
    cursor: pointer;
  }
  </style>
  