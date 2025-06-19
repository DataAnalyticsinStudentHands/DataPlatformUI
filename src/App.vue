/**
 * src/App.vue
 * 
 * Root component of the application that provides the main layout structure including
 * a responsive navigation drawer, app bar, and router view container. Handles user
 * authentication state, role-based navigation menu rendering, and logout functionality.
 * The navigation drawer adapts between rail and full modes on desktop, and temporary
 * drawer on mobile devices.
 */

<template>
  <v-app>
    <v-layout class="rounded">
      <!-- Navigation drawer with role-based menu items -->
      <v-navigation-drawer
        v-if="isFullyAuthenticated"
        v-model="drawer"
        color="#c8102e"
        :rail="rail"
        @click="rail = false"
        class="sidebar"
        :permanent="isMdAndUp"
        :temporary="!isMdAndUp"
      >
        <!-- Collapsed rail state shows only menu icon -->
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
        <!-- Expanded state shows full navigation menu -->
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
          <!-- Student role navigation items -->
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
            >{{$t('Exit Form')}}</v-list-item>
            <v-list-item 
              :active="activeLink === 'projects' || activeLink === 'studentProjects'"
              to="projects"
              prepend-icon="mdi-account-group"
              class="tracking-wider"
            >
              {{$t('Projects')}}
              <span 
                v-if="user.hasPendingInvitations" 
                class="projects-notification-dot"
              ></span>
            </v-list-item>
          </div>
          <!-- Instructor and admin role navigation items -->
          <div v-if="user.isLoggedIn && (user.getRole === 'Instructor' || user.getRole === 'Group Instructor' || user.getRole === 'Group Admin' || user.getRole === 'Org Admin')">
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
            <v-list-item 
              :active="activeLink === 'projects' || activeLink === 'instructorProjects'"
              to="projects"
              prepend-icon="mdi-account-group"
              class="tracking-wider"
            >
              {{$t('Projects')}}
            </v-list-item>
          </div>
          <!-- Basic role navigation items -->
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

          <!-- Common navigation items for all authenticated users -->
          <div v-if="isFullyAuthenticated">
            <v-list-item>
              <hr>
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

      <!-- App bar with gradient background and organization name -->
      <v-app-bar 
        scroll-target="#main"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <v-btn 
          v-if="isFullyAuthenticated && !drawer"
          icon 
          @click="drawer = true; rail = false"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <h1 class="text-2xl text-white mr-10">{{ user.orgName }}</h1>
      </v-app-bar>

      <!-- Main content area containing router view -->
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
import { useSSENotifications } from '@/composables/useSSENotifications';

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
      invitationCheckInterval: null,
      sseNotifications: null,
    };
  },
  watch: {
    // Update active navigation link when route changes
    $route(to, from) {
      this.activeLink = to.name;
      // Check for invitations when navigating to projects page
      if (to.name === 'projects' && this.user.getRole === 'Student') {
        this.user.fetchProjectInvitationCount();
      }
    },

    isFullyAuthenticated(newVal) {
      if (newVal && this.user.getRole === 'Student') {
        // Establish SSE connection when user logs in
        this.sseNotifications.connect();
      } else if (!newVal && this.sseNotifications) {
        // Disconnect when user logs out
        this.sseNotifications.disconnect();
      }
    }
    
  },
  computed: {
    // Check if viewport is medium size or larger
    isMdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
    // Concatenate user's first and last name
    fullName() {
      const store = useLoggedInUserStore();
      return (store.firstName.trim() + ' ' + store.lastName.trim());
    },
    // Check if user is logged in
    loggedIn() {
      const store = useLoggedInUserStore();
      return store.isLoggedIn;
    },
    // Check if user is logged in and not in temporary role
    isFullyAuthenticated() {
      const store = useLoggedInUserStore();
      return store.isLoggedIn && store.getRole && store.getRole !== 'Temporary';
    }
  },
  methods: {
    // Handle user logout and display random success message
    async handleLogout() {
      const store = useLoggedInUserStore();

      // Clean up SSE connection
      if (this.sseNotifications) {
        this.sseNotifications.disconnect();
      }
      
      // Clear invitation check interval
      if (this.invitationCheckInterval) {
        clearInterval(this.invitationCheckInterval);
        this.invitationCheckInterval = null;
      }
      
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

      // Store toast notification data in Pinia state
      store.navigationData = {
        toastType: 'success',
        toastMessage: logoutMessage,
        toastPosition: 'top-right',
        toastCSS: 'Toastify__toast--create'
      };

      this.$router.push({
        name: 'login'
      });
    },
    // Toggle navigation drawer between rail and full modes
    sidebarToggle() {
      if (this.isMdAndUp) {
        this.rail = !this.rail;
      } else {
        this.drawer = !this.drawer;
      }
    },
    // Set up periodic invitation checking for students
    setupInvitationChecking() {
      if (this.user.getRole === 'Student') {
        // Check invitations every 5 minutes
        this.invitationCheckInterval = setInterval(() => {
          this.user.fetchProjectInvitationCount();
        }, 5 * 60 * 1000); // 5 minutes
      }
    },
  },
  
  mounted() {
    // Attach scroll listener to main content area
    const mainContentEl = this.$refs.mainContent.$el;
    mainContentEl.addEventListener('scroll', this.handleScroll);
    
    // Set up invitation checking if user is a student
    if (this.isFullyAuthenticated) {
      this.setupInvitationChecking();
    }

    // Set up SSE connection for real-time notifications
    if (this.isFullyAuthenticated && this.user.getRole === 'Student') {
      this.sseNotifications.connect();
    }
  },

  beforeUnmount() {
    // Clean up scroll listener
    const mainContentEl = this.$refs.mainContent.$el;
    mainContentEl.removeEventListener('scroll', this.handleScroll);
    
    // Clear invitation check interval
    if (this.invitationCheckInterval) {
      clearInterval(this.invitationCheckInterval);
    }

    // Clean up SSE connection
    if (this.sseNotifications) {
      this.sseNotifications.disconnect();
    }
  },

  setup() {
    const user = useLoggedInUserStore();
    const sseNotifications = useSSENotifications();
    return { user, sseNotifications };
  },

  created() {
    // Fetch organization name from API
    const user = useLoggedInUserStore();
    let apiURL = import.meta.env.VITE_ROOT_API + `/orgdata/`;
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
/* Legacy container styling */
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}

/* Fixed sidebar positioning */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
}

/* Main content scrollable area */
.main-content {
  overflow-y: auto;
  height: 100vh;
  padding-bottom: 5vh;
}

/* Projects notification dot - only affects this specific element */
.projects-notification-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #64B5F6; /* light-blue-lighten-2 */
  border-radius: 50%;
  margin-left: 8px;
  vertical-align: middle;
}

/* Position dot in rail mode */
:deep(.v-navigation-drawer--rail) .projects-notification-dot {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}
</style>