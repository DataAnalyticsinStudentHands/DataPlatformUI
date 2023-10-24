<template>
  <v-app>
    <v-layout class="rounded">
      <v-navigation-drawer
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
          <div v-if="!user.isLoggedIn">
            <v-list-item 
              :active="activeLink === 'Login'"
              to="login"
              prepend-icon="mdi-login"
              value="Login"
              class=" tracking-wider "
            >Login
            <template v-slot:append>
              <v-btn
                variant="text"
                size="small"
                icon="mdi-arrow-expand-left"
                @click.stop.prevent="sidebarToggle"
              ></v-btn>
            </template>
          </v-list-item>
          </div>
          <div v-if="user.isLoggedIn && user.getRole === 'Student'">
            <v-list-item 
              :active="activeLink === 'studentDashboard'"
              to="studentDashboard"
              prepend-icon="mdi-view-dashboard"
              value="studentDashboard"
              class=" tracking-wider "
            >Student Dashboard</v-list-item>
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
              v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences"
              to="goalSettingForm"
              prepend-icon="mdi-file-document"
              value="goalSettingForm"
              class=" tracking-wider "
            >Goal Setting Form</v-list-item>
            <v-list-item 
              :active="activeLink === 'exitFormsAvailable'"
              v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences"
              to="exitFormsAvailable"
              prepend-icon="mdi-file-document"
              value="exitFormsAvailable"
              class=" tracking-wider "
            >Exit Forms</v-list-item>
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
              :active="activeLink === 'instructorSemesters'"
              to="instructorSemesters"
              prepend-icon="mdi-school"
              value="instructorSemesters"
              class=" tracking-wider"
            >Semesters, Experiences, Activities</v-list-item>
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
            >Profile</v-list-item>
            <v-list-item
              :active="activeLink === 'User Data Update Form'"
              to="updateUserInformation"
              prepend-icon="mdi-cog"
              value="User Data Update Form"
              class=" tracking-wider "
            >Update User Information</v-list-item>
            <v-list-item
              :active="activeLink === 'Password Reset'"
              to="resetPassword"
              prepend-icon="mdi-cog"
              value="Password Reset"
              class=" tracking-wider "
            >Update Password</v-list-item>
            <v-list-item
              :active="activeLink === 'Login'"
              to="login"
              prepend-icon="mdi-logout"
              value="Login"
              class=" tracking-wider "
              @click="handleLogout"
            >Logout</v-list-item>
          </div>
        </v-list>

      </div>
      </v-navigation-drawer>

      <v-app-bar 
        scroll-target="#main"
        scroll-behavior="hide"
        scroll-threshold="10"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <v-btn 
          v-if="!drawer"
          icon 
          @click="drawer = true; rail = false"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <template v-slot:append>
          <h1 class="mr-10 text-2xl text-white">{{ organizationName }}</h1>
        </template>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "App",
  data() {
    return {
      showElement: useLoggedInUserStore().isLoggedIn === false,
      organizationName: "",
      displayEntry: [],
      firstTimeLoginTF: null,
      activeLink: this.$route.name,
      rail: false,
      drawer: null,
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
    showDashboard() {
      this.showElement = true;
    },
    async handleLogout() {
      console.log('handleLogout called');
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
      console.log('logoutMessage: ', logoutMessage)
    
      this.$router.push({
          name: 'testLogin',
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
        console.log('sidebarToggle drawer')
        this.drawer = !this.drawer;
      }
    }
  },
  beforeMount() {
  },
  setup() {
    // function that checks if a user is logged in
    const user = useLoggedInUserStore();
    return { user };
  },
  created() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/orgdata/`;
    const user = useLoggedInUserStore();
    axios
      .get(apiURL, {
        headers: { token: user.token },
      })
      .then((resp) => {
        this.organizationName = resp.data;
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
    }

</style>

