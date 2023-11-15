<template>
    <v-container>

      <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-title>
                Goal Form Completion Tracker
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
                <table style="width: 95%;">
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
                        v-for="student in studentsWithoutGoalForm"
                        :key="student.userID"
                        :class="{ 'hoverRow': hoverId === student.userID }"
                        @mouseenter="hoverId = student.userID"
                        @mouseleave="hoverId = null"
                        @click="navigateToProfile(student.userID)"
                    >
                        <td class="text-left">{{ student.fullName }}</td>
                        <td class="text-left">{{ student.email }}</td>
                        <td class="text-left">{{ student.pronouns.map(p => p.label).join(', ') }}</td>
                        <td class="text-left">{{ student.majors.join(', ') }}</td>
                        <td class="text-left">{{ student.honorsMinors.join(', ') }}</td>
                        <td class="text-left">{{ student.expectedGraduationDate }}</td>
                    </tr>
                    </tbody>
                </table>
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
  
  export default {
    name: "StudentsWithoutGoalForms",
    data() {
      return {
        selectedExperience: null,
        experiences: [],
        studentsWithoutGoalForm: [],
        hoverId: null,
      };
    },
    mounted() {
      this.fetchExperiences();
    },
    watch: {
        selectedExperience(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.fetchStudentsWithoutGoalForm(newVal);
        }
        }
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
    },
  };
  </script>
  
  <style scoped>

.v-field__input > input[size="1"] {
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

.v-field__input > input[size="1"]::before,
.v-field__input > input[size="1"]::after {
  display: none;
}

.hoverRow {
  background-color: #f0f0f0; /* light grey background */
  cursor: pointer;
}


  </style>
  