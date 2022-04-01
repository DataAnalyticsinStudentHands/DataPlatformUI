<template>
  <main class="flex">
    <div
      class="text-white"
      :class="{
        sidebar: !$store.state.isResponsive,
        sidebarRes: $store.state.isResponsive,
        active: showNavBar,
      }"
      @click="closeNav()"
    >
      <article class="navbar">
        <section
          class="text-center"
          :class="{ 'mt-0 pt-10': showNavBar, 'mt-10': !showNavBar }"
        >
          <img class="m-auto" src="@\assets\DanPersona.svg" />
          <p>Dan</p>
          <p>Main Persona</p>
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4 ml-4">
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
            <li>
              <router-link to="/findEvents"
                ><span
                  style="position: relative; top: 6px"
                  class="material-icons"
                >
                  event_seat
                </span>
                Events</router-link
              >
            </li>
          </ul>
        </nav>
      </article>
    </div>
    <div class="flex-col w-screen" id="content">
      <header></header>
      <button id="navBtn">
        <i v-on:click="showNav()" class="material-icons" style="color: #7d0d15"
          >menu</i
        >
      </button>
      <section>
        <router-view></router-view>
      </section>
    </div>
  </main>
</template>
<script>
export default {
  setup() {
    return {};
  },

  data() {
    return {
      showNavBar: false,
    };
  },
  methods: {
    showNav() {
      this.showNavBar = true;
    },
    closeNav() {
      this.showNavBar = false;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
:root {
  --sidebar-width: 15em;
}
.sidebar {
  position: fixed;
  height: 100%;
  width: var(--sidebar-width);
  background-color: #7d0d15;
  opacity: 1;
  visibility: visible;
}
header {
  width: 100%;
  min-height: 7em;
  background: linear-gradient(257.57deg, #910812 50.6%, #efecec 50.6%);
}
#content {
  margin-left: var(--sidebar-width);
}
#navBtn {
  display: none;
}
@media only screen and (max-width: 900px) {
  .sidebarRes {
    text-justify: inter-word;
    width: 100vw;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    opacity: 0;
    visibility: hidden;
  }
  .active {
    visibility: visible;
    opacity: 1;
  }
  .navbar {
    background-color: #7d0d15;
    height: 100%;
    width: 50%;
  }
  #content {
    margin-left: 0px;
  }
  #navBtn {
    text-align: right;
    margin: 50px;
    position: fixed;
    top: 70px;
    right: 0;
    z-index: 2;
    display: block;
  }
  #navBtn i {
    font-size: 2.3em;
  }
}
</style>
