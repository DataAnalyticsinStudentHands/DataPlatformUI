<!-- instructorProgressMonitorContainer - this parent container is responsible for holding and rendering its child components:
  studentsWithoutEntryForms - presents a list of students who have registered for and activated their account, but have not yet completed a Student Entry Form.
  studentsWithoutGoalForms - presents a list of students who have registered for an Experience Instance, but have not yet completed the Goal Setting Form for that Experience Instance.
  pendingStudents - presents a list of students who have registered for an account, but have not yet activated their account.
  studentsWithoutExitForms - presents a list of students who have registered for an Experience Instance, but have not yet completed the Exit Form for that Experience Instance.
-->
<template>
    <v-container>
        <!-- Header with title and "Go Back" button -->
        <v-row>
            <v-col cols="12">  
            <p class="font-weight-black text-h5 text--primary text-center">
            Student Progress Monitor
            </p>
            <!-- Go back to the previous page -->
            <v-btn @click=$router.back() class="mt-4">
              <v-icon left>mdi-arrow-left</v-icon>
              Go Back
            </v-btn>
        </v-col>
        </v-row>



      <!-- Tabs for navigating between monitors (Entry Form, Goal Form, Exit Form, Pending) -->
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="tab" grow>
            <v-tab value="entryForms" v-if="showStudentsWithoutEntryForms">
              Entry Form Monitor
            </v-tab>
            <v-tab value="goalForms">
              Goal Form Monitor
            </v-tab>
            <v-tab value="exitForms">
              Exit Form Monitor
            </v-tab>
            <!-- <v-tab value="pending">
              Pending Monitor
            </v-tab> -->
          </v-tabs>

          <!-- Content for Entry Form Monitor -->
          <div v-if="tab === 'entryForms'">
            <StudentsWithoutEntryForms />
          </div>
  
          <!-- Content for Goal Form Monitor -->
          <div v-if="tab === 'goalForms'">
            <StudentsWithoutGoalForms />
          </div>

          <!-- Content for Exit Form Monitor -->
          <div v-if="tab === 'exitForms'">
            <StudentsWithoutExitForms />
          </div>

          <!-- Content for Pending Status -->
          <div v-if="tab === 'pending'">
            <PendingStudents />
          </div>

        </v-col>
      </v-row>
    </v-container>
  </template>

  <script>
  import { computed } from 'vue';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import StudentsWithoutGoalForms from './studentsWithoutGoalForms.vue';
  import StudentsWithoutEntryForms from './studentsWithoutEntryForms.vue';
  import PendingStudents from './pendingStudents.vue';
  import StudentsWithoutExitForms from './studentsWithoutExitForms.vue';
  
  export default {
setup() {
  // Access the logged-in user store
  const userStore = useLoggedInUserStore();

  // Computed property to determine if the "Students Without Entry Forms" tab should be shown based on user roles
  const showStudentsWithoutEntryForms = computed(() => {
    const allowedRoles = ['Global Admin', 'Org Admin', 'Group Admin', 'Instructor'];
    return allowedRoles.includes(userStore.role);
  });

  return {
    userStore,
    showStudentsWithoutEntryForms: showStudentsWithoutEntryForms.value // Determines if the Entry Form tab is shown
  };
},

    components: {
      StudentsWithoutGoalForms,
      StudentsWithoutEntryForms,
      PendingStudents,
      StudentsWithoutExitForms
    },
    data() {
      return {
        tab: 'entryForms',
      };
    },
  };
  </script>
  