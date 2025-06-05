<!-- studentsWithoutGoalForms - this view presents a list of students who have completed/have not completed a Goal Setting Form for a given Experience Instance. Checks whether the student registered for the Experience Instance in order to know if that student is returned (if they registered for an Experience Instance, they should complete a Goal Setting Form for that Instance)-->
<template>
    <v-container>

      <v-row>
        <v-col cols="12">
            <!-- Card for the Goal Form Completion Tracker -->
            <v-card>
                <!-- Title with CSV download button for students without goal forms -->
                <v-card-title class="pa-4 d-flex justify-space-between align-center">
                  Goal Form Completion Tracker
                  <progress-monitor-csv-downloader
                    v-if="selectedExperience && displayedStudents.length"
                    :data="displayedStudents"
                    :file-name="csvFileName"
                  />
                </v-card-title>
                
                <!-- Subtitle for selecting an experience -->
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
                    <!-- Autocomplete for selecting an experience -->
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

                <!-- Buttons to toggle between completed and uncompleted states -->
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

                <!-- Display total number of students if an experience is selected -->
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
                      @change="handleItemsPerPageChange"
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
                  <v-table v-if="paginatedDisplayedStudents.length" style="width: 95%;">
                    <thead>
                      <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Email</th>
                        <th class="text-left">Registration Date</th>
                        <th v-if="completed === true" class="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="student in paginatedDisplayedStudents"
                        :key="student._id"
                        :class="{ 'hoverRow': hoverId === student._id }"
                        @mouseenter="hoverId = student._id"
                        @mouseleave="hoverId = null"
                        @click="navigateIfEnabled(student._id)"
                      >
                        <td class="text-left">{{ formatFullName(student.firstName, student.lastName) }}</td>
                        <td class="text-left">{{ student.email }}</td>
                        <td class="text-left">{{ formatDate(student.registrationDate) }}</td>
                        <td v-if="completed === true">
                          <v-btn @click.stop="viewStudentGoalForm(student._id)">View Goal Form</v-btn>
                        </td>
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
  import { useInstructorViewsStore } from "@/stored/instructorViews";
  import ProgressMonitorCSVDownloader from './progressMonitorCSVDownloader.vue';
  import { DateTime } from "luxon";
  
  export default {
    name: "StudentsWithoutGoalForms",
    setup() {
      const viewsStore = useInstructorViewsStore();
      return { viewsStore };
    },
    data() {
      return {
        expInstances: [],
        studentsWithoutGoalForm: [],
        hoverId: null,
        studentsWithGoalForm: [],
      };
    },
    components: {
      'progress-monitor-csv-downloader': ProgressMonitorCSVDownloader
    },
    watch: {
      // Watch for changes in the selected experience
      selectedExperience(newVal) {
        if (newVal !== null && this.completed !== null) {
          this.fetchStudents();
        }
      },

      // Watch for changes in the completion status
      completed(newVal, oldVal) {
        if (newVal !== null && this.selectedExperience !== null) {
          this.fetchStudents();
        }
      },
    },
    mounted() {
      // Fetch the list of experiences when the component is mounted
      this.fetchExperiences().then(() => {
        // After experiences are loaded, check if we need to fetch students
        // This happens when returning to the view with saved state
        if (this.selectedExperience !== null && this.completed !== null) {
          this.fetchStudents();
        }
      });
    },

    
    computed: {
      // Use computed properties with getters/setters to sync with store
      selectedExperience: {
        get() {
          return this.viewsStore.getGoalFormMonitorSettings.selectedExperience;
        },
        set(value) {
          this.viewsStore.updateGoalFormMonitorSettings({ 
            selectedExperience: value 
          });
        }
      },

      completed: {
        get() {
          return this.viewsStore.getGoalFormMonitorSettings.completed;
        },
        set(value) {
          this.viewsStore.updateGoalFormMonitorSettings({ 
            completed: value 
          });
        }
      },

      itemsPerPage: {
        get() {
          return this.viewsStore.getGoalFormMonitorSettings.itemsPerPage;
        },
        set(value) {
          this.viewsStore.updateGoalFormMonitorSettings({ 
            itemsPerPage: parseInt(value) || 10 
          });
        }
      },

      isNavigationDisabled: {
        get() {
          return this.viewsStore.getGoalFormMonitorSettings.isNavigationDisabled;
        },
        set(value) {
          this.viewsStore.updateGoalFormMonitorSettings({ 
            isNavigationDisabled: value 
          });
        }
      },

      currentPage: {
        get() {
          return this.viewsStore.getGoalFormMonitorSettings.currentPage;
        },
        set(value) {
          this.viewsStore.updateGoalFormMonitorSettings({ 
            currentPage: value 
          });
        }
      },

      // Format experiences for display in the autocomplete dropdown
      formattedExperiences() {
        return this.expInstances.map(instance => ({
          text: `(${instance.sessionName}) ${instance.experienceCategory}: ${instance.experienceName}`,
          value: instance.expInstanceID
        }));
      },

      // Determine which students to display based on completed status
      displayedStudents() {
        if (this.completed === true) {
          return this.studentsWithGoalForm;
        } else if (this.completed === false) {
          return this.studentsWithoutGoalForm;
        }
        return [];
      },

      // Get the paginated version of displayed students
      paginatedDisplayedStudents() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.displayedStudents.slice(start, end);
      },

      // Determine the total number of pages for pagination
      totalPaginationLength() {
        return Math.ceil(this.displayedStudents.length / this.itemsPerPage);
      },

      // Return the total number of students
      totalStudentsCount() {
        return this.displayedStudents.length;
      },

      // Generate CSV filename based on completion status
      csvFileName() {
        if (this.selectedExperience) {
          const selectedObj = this.expInstances.find(
            (instance) => instance.expInstanceID === this.selectedExperience
          );
          const prefix = this.completed === true ? 'completed_goal_forms' : 'no_goal_form';
          return `${prefix}_${selectedObj.experienceName}.csv`;
        } else {
          return this.completed === true ? 'completed_goal_forms.csv' : 'no_goal_form.csv';
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

      // Initiates the process of fetching students based on whether they have completed goal forms or not. It calls different methods to fetch students with goal forms or without goal forms based on the value of the `completed` property.
      async fetchStudents() {
        if (this.selectedExperience === null || this.completed === null) return;
        this.studentsWithGoalForm = [];
        this.studentsWithoutGoalForm = [];
        if (this.completed === true) {
          await this.fetchStudentsWithGoalForm();
        } else if (this.completed === false) {
          await this.fetchStudentsWithoutGoalForm();
        }
      },

      // Fetches students who have not completed a goal form for a specific experience. It sends a GET request to the backend API with the selected experience ID. Upon receiving the response, it stores the data of students without a goal form for the specified experience in the component's state.
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

      // Fetches students who have completed a goal form for a specific experience. It sends a GET request to the backend API with the selected experience ID. Upon receiving the response, it stores the data of students with a goal form for the specified experience in the component's state.
      async fetchStudentsWithGoalForm() {
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


      // Toggles the navigation state
      toggleNavigation() {
        this.isNavigationDisabled = !this.isNavigationDisabled;
      },

      // Handles changes to items per page and resets to page 1
      handleItemsPerPageChange() {
        this.currentPage = 1;
      },

      // Navigates to the student's profile if navigation is enabled
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

      // Concatenates the first name and last name to form a full name string.
      formatFullName(firstName, lastName) {
          return `${firstName} ${lastName}`;
      },

      // Formats a date to the "MM/dd/yyyy" format.
      formatDate(date) {
        return DateTime.fromISO(date).toFormat("MM/dd/yyyy");
      },

      // Navigates to the page to view the goal form of a specific student identified by their studentID.
      viewStudentGoalForm(studentID) {
        useLoggedInUserStore().navigationData = {
            studentID: studentID,
            expInstanceID: this.selectedExperience
        };
        this.$router.push({
          name: "StudentGoalFormViewer"
        });
      }
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