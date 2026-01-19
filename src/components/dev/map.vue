<!-- src/components/dev/map.vue -->
<template>
  <v-container>
    <h1>Development Page</h1>
    <!-- Start building your component here -->
    <!-- You have full access to Vuetify components -->
    
    <v-card class="mt-4">
      <v-card-title>Dev Environment</v-card-title>
      <v-card-text>
        Start developing here without authentication!
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'DevPage',
  data() {
    return {
      // Your data here
    }
  },
  mounted() {
    console.log('Dev page loaded - no auth required!');
  }
}
</script>

<style scoped>
/* Your styles here */
</style>