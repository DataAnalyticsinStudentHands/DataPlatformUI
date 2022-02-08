<template>
  <main class="flex">
    <section id="_container">
      <header>
        <section>
          <img />
          <!-- TODO: Get This Name From Database -->
          <p>Dan</p>
          <p>Main Persona</p>
        </section>
        <nav class="mt-10">
          <router-link to="/intakeform"
            ><span style="position: relative; top: 6px" class="material-icons">
              people
            </span>
            Client Intake Form</router-link
          >
        </nav>
      </header>
    </section>
    <section><router-view> </router-view></section>
  </main>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#_container {
  background-color: #7d0d15;
  color: white;
  padding: 66px;
}
</style>
