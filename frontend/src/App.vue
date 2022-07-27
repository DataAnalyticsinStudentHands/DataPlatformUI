<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen w-1/5 p-8">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
          <p>{{name}}</p>
          <p>Main Persona</p>
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link to="/"
                ><span
                  style="position: relative; top: 6px"
                  class="material-icons"
                >
                  dashboard
                </span>
                Dashboard</router-link
              >
            </li>
            <li>
              <router-link to="/intakeform"
                ><span
                  style="position: relative; top: 6px"
                  class="material-icons"
                >
                  people
                </span>
                Client Intake Form</router-link
              >
            </li>      
            <li>
              <router-link to="/findclient"
                ><span
                  style="position: relative; top: 6px"
                  class="material-icons"
                >
                  search
                </span>
                Find Client</router-link
              >
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-1/6 flex"
        style="
          background: linear-gradient(257.57deg, #910812 50.6%, #efecec 50.6%);
        "
      >
        <h1 class="mr-20 text-3xl text-white">Non Profit Name</h1>
      </section>
      <section><router-view></router-view></section>
    </div>
  </main>
</template>

<script>
//import index from "./views/index.vue";
import axios from "axios";
export default {
  name: "App",
  components: {
    //index,
  },
  data() {
    return {
      name: ''
    }
  },
  async created() {
    if(localStorage.getItem("username")) {
      let apiURL = `http://localhost:3000/userData/basic`;
      this.queryData=[];
      const {data} = await axios.get(apiURL, {
        params: {
          _id:localStorage.getItem("username")
        }
      })
        
        let fname = data[0].firstName;
        let lname = data[0].lastName;

        this.name = fname + ` ` + lname;
    }
    else {
      this.name = "Unlogged"
    }
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
  }
}

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
