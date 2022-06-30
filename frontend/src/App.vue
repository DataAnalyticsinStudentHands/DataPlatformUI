<template>
  <main>
    <index />
  </main>
</template>

<script>
import index from "./views/index.vue";
export default {
  name: "App",
  components: {
    index,
  },
  mounted() {
    window.addEventListener("resize", this.checkScreenSize);
    this.checkScreenSize();
  },
  unmounted() {
    window.removeEventListener("resize", this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      let windowWidth = window.innerWidth;
      this.$store.commit("updateWindowWidth", windowWidth);
    },
  },
};
</script>

<style>
html,
body {
  overflow-x: hidden;
}
#_container {
  background-color: #C8102E;
  color: white;
  padding: 18px;
}
</style>
