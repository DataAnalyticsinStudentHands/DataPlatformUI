/**
 * src/components/error/errorView.vue
 * 
 * Error page component displaying a "Page Not Found" message with responsive typography.
 * Provides a button to redirect users back to the login page. Text and button sizes
 * automatically adjust based on viewport breakpoints for optimal display across devices.
 */

<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" class="text-center mt-10">
        <h1 :class="fontSizeClass" class="font-bold text-red-700 tracking-widest">
          Oops! Page Not Found
        </h1>
        <v-btn @click="navigateToLogin" :class="buttonClass" class="mt-5">
          Go to Login
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    // Determine responsive font size based on viewport
    fontSizeClass() {
      if (this.$vuetify.display.xs) return 'text-sm';
      if (this.$vuetify.display.sm) return 'text-xl';
      if (this.$vuetify.display.md) return 'text-2xl';
      if (this.$vuetify.display.lg) return 'text-3xl';
      if (this.$vuetify.display.xl) return 'text-6xl';
      if (this.$vuetify.display.xxl) return 'text-9xl';
      return 'text-md';
    },
    // Determine responsive button size based on viewport
    buttonClass() {
      if (this.$vuetify.display.xs) return 'btn-small';
      if (this.$vuetify.display.sm) return 'btn-default';
      if (this.$vuetify.display.md) return 'btn-large';
      if (this.$vuetify.display.lg) return 'btn-x-large';
      if (this.$vuetify.display.xl) return 'btn-xl';
      if (this.$vuetify.display.xxl) return 'btn-xxl';
      return 'btn-default';
    }
  },
  methods: {
    // Redirect to login page
    navigateToLogin() {
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<style scoped>
/* Extra large button dimensions */
.btn-xl {
  width: 18.75rem;
  height: 4.73rem;
  font-size: 1.75rem;
}

/* Extra extra large button dimensions */
.btn-xxl {
  width: 35.5rem;
  height: 8.75rem;
  font-size: 3rem;
}
</style>