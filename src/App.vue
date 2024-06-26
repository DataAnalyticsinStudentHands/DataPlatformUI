<template>
  <v-app>
    <v-layout class="rounded">
      <v-navigation-drawer
        v-if="user.isLoggedIn"
        v-model="drawer"
        color="#c8102e"
        :rail="rail"
        @click="rail = false"
        class="sidebar"
        :permanent="isMdAndUp"
        :temporary="!isMdAndUp"
      >
        <div v-if="rail">
          <v-list-item
            lines="two"
          >
            <v-btn
              size="large"
              variant="text"
              icon="mdi-menu"
              @click="rail = !rail"
              class="text-white"
            ></v-btn>
          </v-list-item>
        </div>
        <div v-else>
          <v-list-item
            v-if="loggedIn"
            lines="two"
            prepend-avatar="@/assets/DanPersona.svg"
            :title="fullName"
            subtitle="Logged in"
            class="text-white"
          >
            <template v-slot:append>
              <v-btn
                variant="text"
                size="small"
                icon="mdi-arrow-expand-left"
                @click.stop="sidebarToggle"
              ></v-btn>
            </template>
          </v-list-item>

        <v-list density="compact" nav class="text-white">
          <div v-if="user.isLoggedIn && user.getRole === 'Student'">
            <v-list-item 
              :active="activeLink === 'studentDashboard'"
              to="studentDashboard"
              prepend-icon="mdi-view-dashboard"
              value="studentDashboard"
              class=" tracking-wider "
            >{{$t('Student Dashboard')}}</v-list-item>
            <v-list-item 
              :active="activeLink === 'studentEntryForm'"
              v-if="!user.hasCompletedEntryForm"
              to="studentEntryForm"
              prepend-icon="mdi-file-document"
              value="studentEntryForm"
              class=" tracking-wider "
            >Student Entry Form</v-list-item>
            <v-list-item 
              :active="activeLink === 'goalSettingForm'"
              v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences && user.hasGoalFormsToComplete"
              to="goalSettingForm"
              prepend-icon="mdi-file-document"
              value="goalSettingForm"
              class=" tracking-wider "
            >{{$t('Goal Setting Form')}}</v-list-item>
            <v-list-item 
              :active="activeLink === 'exitForm'"
              v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences && user.hasExitFormsToComplete"
              to="exitForm"
              prepend-icon="mdi-file-document"
              value="exitForm"
              class=" tracking-wider "
            >Exit Form</v-list-item>
          </div>
          <div v-if="user.isLoggedIn && user.getRole === 'Instructor'">
            <v-list-item 
              :active="activeLink === 'instructorDash'"
              to="instructorDash"
              prepend-icon="mdi-view-dashboard"
              value="instructorDash"
              class=" tracking-wider "
            >Dashboard</v-list-item>
            <v-list-item 
              :active="activeLink === 'instructorDataProducts'"
              to="instructorDataProducts"
              prepend-icon="mdi-view-dashboard"
              value="instructorDataProducts"
              class=" tracking-wider"
            >Data Products</v-list-item>
            <v-list-item 
              :active="activeLink === 'instructorStudentsList'"
              to="instructorStudentsList"
              prepend-icon="mdi-account"
              value="instructorStudentsList"
              class=" tracking-wider"
            >Students</v-list-item>
            <v-list-item 
              :active="activeLink === 'instructorDataManagement'"
              to="instructorDataManagement"
              prepend-icon="mdi-school"
              value="instructorDataManagement"
              class=" tracking-wider"
            >Data Management Console</v-list-item>
          </div>
          <div v-if="user.isLoggedIn && user.getRole === 'Basic'">
            <v-list-item 
              :active="activeLink === 'dashboard'"
              to="/dashboard"
              prepend-icon="mdi-view-dashboard"
              class="tracking-wider"
            >Dashboard</v-list-item>

            <v-list-item 
              :active="activeLink === 'intakeform'"
              to="/intakeform"
              prepend-icon="mdi-account-plus-outline"
              class="tracking-wider"
            >Client Intake Form</v-list-item>

            <v-list-item 
              :active="activeLink === 'eventform'"
              to="/eventform"
              prepend-icon="mdi-calendar-plus"
              class="tracking-wider"
            >Create Event</v-list-item>

            <v-list-item 
              :active="activeLink === 'findclient'"
              to="/findclient"
              prepend-icon="mdi-account-search-outline"
              class="tracking-wider"
            >Find Client</v-list-item>

            <v-list-item 
              :active="activeLink === 'findEvents'"
              to="/findEvents"
              prepend-icon="mdi-calendar-search"
              class="tracking-wider"
            >Find Event</v-list-item>
          </div>

          <div v-if="user.isLoggedIn">
            <v-list-item>
              <hr> <!-- Horizontal line -->
            </v-list-item>
            <v-list-item 
              :active="activeLink === 'profile'"
              v-if="user.getRole === 'Student'"
              to="profile"
              prepend-icon="mdi-account"
              value="profile"
              class=" tracking-wider "
            >{{$t('Profile')}}</v-list-item>
            <v-list-item
              :active="activeLink === 'User Data Update Form'"
              to="updateUserInformation"
              prepend-icon="mdi-cog"
              value="User Data Update Form"
              class=" tracking-wider "
            >{{$t('Update User Information')}}</v-list-item>
            <v-list-item
              :active="activeLink === 'Password Reset'"
              to="updatePassword"
              prepend-icon="mdi-cog"
              value="Password Reset"
              class=" tracking-wider "
            >{{$t('Update Password')}}</v-list-item>
            <v-list-item
              :active="activeLink === 'Login'"
              to="login"
              prepend-icon="mdi-logout"
              value="Login"
              class=" tracking-wider "
              @click="handleLogout"
            >{{$t('Logout')}}</v-list-item>
          </div>
        </v-list>

      </div>
      </v-navigation-drawer>

      <v-app-bar 
  scroll-target="#main"
  style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
>
  <v-btn 
    v-if="user.isLoggedIn && !drawer"
    icon 
    @click="drawer = true; rail = false"
  >
    <v-icon>mdi-menu</v-icon>
  </v-btn>

  <!-- Placeholder for left side content -->
  <v-spacer></v-spacer>

  <!-- Advertisement text -->
  <span v-if="!$vuetify.display.xs" class="text-xs text-white mr-4">
    Developed by Data Analytics in Student Hands for Engaged Data
  </span>

  <!-- Spacer to push content to the sides -->
  <!-- <v-spacer></v-spacer> -->

  <!-- Organization Name on the right -->
  <h1 class="text-2xl text-white mr-10">{{ user.orgName }}</h1>
</v-app-bar>





    <v-main id="main" ref="mainContent" style="min-height: 300px;" class="main-content">
      <router-view></router-view>
    </v-main>
  </v-layout>
  </v-app>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import 'vue3-toastify/dist/index.css';

export default {
  name: "App",
  data() {
    return {
      showElement: useLoggedInUserStore().isLoggedIn === false,
      displayEntry: [],
      firstTimeLoginTF: null,
      activeLink: this.$route.name,
      rail: this.isMdAndUp,
      drawer: null,
      // scrollPosition: 0,
    };
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
    fullName() {
      const store = useLoggedInUserStore();
      return (store.firstName.trim() + ' ' + store.lastName.trim());
    },
    loggedIn() {
      const store = useLoggedInUserStore();
      return store.isLoggedIn;
    }
  },
  methods: {
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
    },
  //   handleScroll(event) {
  //   // scroll handling logic
  //   this.scrollPosition = event.target.scrollTop;
  // },
  },
  mounted() {
    // Access the root DOM element of the v-main Vue component
    const mainContentEl = this.$refs.mainContent.$el;
    mainContentEl.addEventListener('scroll', this.handleScroll);
  },

  beforeUnmount() {
    const mainContentEl = this.$refs.mainContent.$el;
    mainContentEl.removeEventListener('scroll', this.handleScroll);
  },

  // provide() {
  //   return {
  //     scrollPosition: this.scrollPosition
  //   };
  // },

  setup() {
    // function that checks if a user is logged in
    const user = useLoggedInUserStore();
    return { user };
  },
  created() {
    const user = useLoggedInUserStore();
    let apiURL = import.meta.env.VITE_ROOT_API + `/orgdata/`;
    // const user = useLoggedInUserStore();
    axios
      .get(apiURL, {
        headers: { token: user.token },
      })
      .then((resp) => {
        user.setOrgName(resp.data);
      });
  },
};
</script>
<style scoped>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}

.sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        overflow-y: auto;
    }

    .main-content {
        overflow-y: auto;
        height: 100vh;
        padding-bottom: 5vh;
    }

</style>
