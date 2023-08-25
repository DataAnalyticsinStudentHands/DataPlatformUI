<template>
  <v-container>
    <!-- Filters section -->
    <v-row class="mb-0 pa-0" style="background-color: #f5f5f5;">
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="auto" class="d-flex align-center">
            <v-checkbox
              v-model="uhStudentsFilterEnabled"
              hide-details
              density="compact"
            ></v-checkbox>
          </v-col>
          <v-col cols="2" class="d-flex align-center pa-2">
            <p :class="{ 'gray-out': !uhStudentsFilterEnabled }">{{ uhStudentsValue ? 'UH Students Only' : 'Non-UH Students Only' }}</p>
          </v-col>
          <v-col cols="auto" class="d-flex align-center">
            <v-switch
              v-model="uhStudentsValue"
              :disabled="!uhStudentsFilterEnabled"
              :true-label="'UH Students Only'"
              :false-label="'Non-UH Students Only'"
              hide-details
              density="compact"
            ></v-switch>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- New filters section -->
    <v-row class="mb-0 pa-0" style="background-color: #f5f5f5;">
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="auto" class="d-flex align-center">
            <!-- New checkbox -->
            <v-checkbox
              v-model="graduateFilterEnabled"
              hide-details
              density="compact"
            ></v-checkbox>
          </v-col>
          <v-col cols="4" class="d-flex align-center pa-2">
            <!-- New filter text -->
            <p :class="{ 'gray-out': !graduateFilterEnabled }">{{ pursuingGraduateValue ? 'Pursuing Graduate/Professional School' : 'Not Pursuing Graduate/Professional School' }}</p>
          </v-col>
          <v-col cols="auto" class="d-flex align-center">
            <!-- New switch -->
            <v-switch
              v-model="pursuingGraduateValue"
              :disabled="!graduateFilterEnabled"
              :true-label="'Pursuing Graduate/Professional School'"
              :false-label="'Not Pursuing Graduate/Professional School'"
              hide-details
              density="compact"
            ></v-switch>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Bar charts sections -->
    <v-row>
      <v-col cols="6" class="pa-0">
        <!-- Left side content -->
        Left Bar Chart
      </v-col>
      <v-col cols="6" class="pa-0">
        <!-- Right side content -->
        Right Bar Chart
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ReportsPage',
  data() {
    return {
      uhStudentsFilterEnabled: false,
      uhStudentsValue: false,
      graduateFilterEnabled: false,
      pursuingGraduateValue: false
    };
  }
}
</script>

<style scoped>
.gray-out {
  color: #aaa; /* Use the desired gray color */
}
</style>
