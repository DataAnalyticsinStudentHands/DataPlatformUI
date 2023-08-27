<template>
    <main>
      <div class="text-center mt-10">
        <h1 class="font-bold text-4xl text-red-700 tracking-widest">
          Oops! Error 404 Page Not Found
        </h1>
        <v-btn @click="navigateToLogin" class="mt-5">
          Go to Login
        </v-btn>
      </div>
    </main>
</template>

<script>
export default {
  methods: {
    navigateToLogin() {
      this.$router.push({ name: 'Login' });
    }
  }
}
</script>
