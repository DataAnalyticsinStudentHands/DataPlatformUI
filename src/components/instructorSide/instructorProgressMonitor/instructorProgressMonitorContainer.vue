<template>
    <v-container>
        <v-row>
            <v-col cols="12">  
            <p class="font-weight-black text-h5 text--primary text-center">
            Student Progress Monitor
            </p>
            <v-btn @click=$router.back() class="mt-4">
              <v-icon left>mdi-arrow-left</v-icon>
              Go Back
            </v-btn>
        </v-col>
        </v-row>
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="tab" grow>
            <v-tab value="entryForms">
              Entry Form Monitor
            </v-tab>
            <v-tab value="goalForms">
              Goal Form Monitor
            </v-tab>
            <!-- <v-tab value="exitForms">
              Exit Form Monitor
            </v-tab>
            <v-tab value="pending">
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
  import StudentsWithoutGoalForms from './studentsWithoutGoalForms.vue';
  import StudentsWithoutEntryForms from './studentsWithoutEntryForms.vue';
  import PendingStudents from './pendingStudents.vue';
  import StudentsWithoutExitForms from './studentsWithoutExitForms.vue';
  
  export default {
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
  