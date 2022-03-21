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
      console.log(this.$store.state.windowWidth);
    },
  },
};
</script>

<style>
#_container {
  background-color: #7d0d15;
  color: white;
  padding: 18px;
}
</style>
