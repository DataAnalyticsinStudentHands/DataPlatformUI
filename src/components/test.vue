<template>
  <v-container>
    <!-- Filters section -->
    <v-row class="mb-5" style="background-color: #f5f5f5;">
      <v-col cols="12">
        <!-- Filters go here -->
        Filters
      </v-col>
    </v-row>

    <!-- Bar charts sections -->
    <v-row>
      <v-col cols="6" style="background-color: #d9d9d9;">
        <!-- Left side content -->
        Left Bar Chart
      </v-col>
      <v-col cols="6" style="background-color: #b0b0b0;">
        <!-- Right side content -->
        Right Bar Chart
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ReportsPage'
}
</script>

<style scoped>
</style>
