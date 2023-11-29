<template>
  <v-app>
    <v-layout class="rounded">

      <nav-bar
        v-model="drawer"
        :rail="rail"
        :activeLink="activeLink"
        :isMdAndUp="isMdAndUp"
        :userRole="user.role"
        @logout="handleLogout"
        @update:rail="rail = $event"
    ></nav-bar>



      <v-app-bar 
        scroll-target="#main"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <v-btn 
          v-if="!drawer && user.role"
          icon 
          @click="drawer = true; rail = false"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!-- Placeholder for left side content -->
        <v-spacer></v-spacer>

        <!-- Advertisement text -->
        <span v-if="!$vuetify.display.xs" class="text-xs text-white mr-4">
          Developed by Data Analytics in Student Hands
        </span>

        <!-- Spacer to push content to the sides -->
        <!-- <v-spacer></v-spacer> -->

        <!-- Organization Name on the right -->
        <h1 class="text-2xl text-white mr-10">{{ orgName }}</h1>
      </v-app-bar>





    <v-main id="main" style="min-height: 300px;" class="main-content">
      <router-view @showDashboard="showDashboard"></router-view>
    </v-main>
  </v-layout>
  </v-app>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import 'vue3-toastify/dist/index.css';
import { computed, onMounted } from 'vue';
import NavBar from './components/defaultPages/navBar.vue'; // Import the NavBar component

export default {
  name: "App",
  components: {
    NavBar // Register the NavBar component
  },
  data() {
    return {
      showElement: useLoggedInUserStore().isLoggedIn === false,
      displayEntry: [],
      firstTimeLoginTF: null,
      activeLink: this.$route.name,
      rail: false,
      drawer: null,
    };
  },
  setup() {
    const userStore = useLoggedInUserStore();

    console.log('User Role:', userStore.role);
    
    // Computed property for orgName
    const orgName = computed(() => userStore.orgName);

    // Async function to fetch organization data
    const fetchOrgData = async () => {
      let apiURL = import.meta.env.VITE_ROOT_API + `/orgdata/`;
      try {
        const response = await axios.get(apiURL, { headers: { token: userStore.token } });
        userStore.setOrgName(response.data);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    // Call fetchOrgData on component mount
    onMounted(fetchOrgData);

    // Return the reactive properties that the template can access
    return { user: userStore, orgName };
  },
  watch: {
    $route(to, from) {
      this.activeLink = to.name;
    }
  },
  computed: {
    isMdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
    loggedIn() {
      const store = useLoggedInUserStore();
      return store.isLoggedIn;
    }
  },
  methods: {
    showDashboard() {
      this.showElement = true;
    },
    async handleLogout() {
      const store = useLoggedInUserStore();
      
      await store.logout();
      let logoutMessage = "";
      let logoutMessages = [
        'See you soon!',
        'Logged out successfully!',
        'Goodbye for now!',
        'See you next time!',
        "You're safely logged out!",
        'Hope to see you soon!',
        'Session ended. Take care!',
        'Stay safe! See you again!',
        'Successfully signed out!',
        "You've logged out. Goodbye!",
        'Come back soon!'
      ];
      logoutMessage = logoutMessages[Math.floor(Math.random() * logoutMessages.length)];
    
      this.$router.push({
          name: 'login',
          params: {
            toastType: 'success',
            toastMessage: logoutMessage,
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
        },
      });
    },
    sidebarToggle() {
      if (this.isMdAndUp) {
        this.rail = !this.rail;
      } else {
        this.drawer = !this.drawer;
      }
    }
  },
};
</script>
<style scoped>
  #_container {
    background-color: #c8102e;
    color: white;
    padding: 18px;
  }

  .main-content {
      overflow-y: auto;
      height: 100vh;
      padding-bottom: 5vh;
  }

</style>

