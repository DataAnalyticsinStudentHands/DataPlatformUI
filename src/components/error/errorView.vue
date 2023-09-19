<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" class="text-center mt-10">
        <h1 :class="fontSizeClass" class="font-bold text-red-700 tracking-widest">
          Oops! Error 404 Page Not Found
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
    fontSizeClass() {
      if (this.$vuetify.display.xs) return 'text-sm';
      if (this.$vuetify.display.sm) return 'text-xl';
      if (this.$vuetify.display.md) return 'text-2xl';
      if (this.$vuetify.display.lg) return 'text-3xl';
      if (this.$vuetify.display.xl) return 'text-6xl';
      if (this.$vuetify.display.xxl) return 'text-9xl';
      return 'text-md';
    },
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
    navigateToLogin() {
      this.$router.push({ name: 'Login' });
    }
  }
}
</script>

<style scoped>
.btn-xl {
  width: 18.75rem; /* 220px/16 */
  height: 4.73rem; /* 60px/16 */
  font-size: 1.75rem; /* 20px/16 */
}
.btn-xxl {
  width: 35.5rem; /* 280px/16 */
  height: 8.75rem; /* 70px/16 */
  font-size: 3rem; /* 24px/16 */
}
</style>
