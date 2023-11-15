<template>
    <v-container>
        <v-row>
            <v-col cols="12">  
            <p class="font-weight-black text-h5 text--primary text-center">
            Student Progress Monitor
            </p>
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
          </v-tabs>

          <v-row>
                <v-col cols="12">            
                    <v-btn @click=$router.back() class="mt-4">
                    <v-icon left>mdi-arrow-left</v-icon>
                    Go Back
                    </v-btn>
                </v-col>
            </v-row>

          <!-- Content for Entry Form Monitor -->
          <div v-if="tab === 'entryForms'">
            <StudentsWithoutEntryForms />
          </div>
  
          <!-- Content for Goal Form Monitor -->
          <div v-if="tab === 'goalForms'">
            <StudentsWithoutGoalForms />
          </div>

        </v-col>
      </v-row>
    </v-container>
  </template>

  <script>
  import StudentsWithoutGoalForms from './studentsWithoutGoalForms.vue';
  import StudentsWithoutEntryForms from './studentsWithoutEntryForms.vue';
  
  export default {
    components: {
      StudentsWithoutGoalForms,
      StudentsWithoutEntryForms,
    },
    data() {
      return {
        tab: 'entryForms',
      };
    },
  };
  </script>
  