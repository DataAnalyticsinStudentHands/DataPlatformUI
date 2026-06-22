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
        v-if="showNavDrawer"
        v-model="drawer"
        color="#c8102e"
        :rail="rail"
        @click="rail = false"
        class="sidebar"
        :permanent="isMdAndUp"
        :temporary="!isMdAndUp"
      >
        <!-- Collapsed rail state shows only menu icon -->
        <div v-if="rail" class="rail-menu-container">
          <v-btn
            size="large"
            variant="text"
            icon="mdi-menu"
            @click="rail = !rail"
            class="text-white"
          ></v-btn> 
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
              :to="{ name: 'studentDashboard' }"
              prepend-icon="mdi-view-dashboard"
              value="studentDashboard"
              class=" tracking-wider "
            >{{$t('Student Dashboard')}}</v-list-item>
            <v-list-item 
              :active="activeLink === 'studentEntryForm'"
              v-if="!user.hasCompletedEntryForm"
              :to="{ name: 'studentEntryForm' }"
              prepend-icon="mdi-file-document"
              value="studentEntryForm"
              class=" tracking-wider "
            >Student Entry Form</v-list-item>
            <v-list-item 
              :active="activeLink === 'goalSettingForm'"
              v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences && user.hasGoalFormsToComplete"
              :to="{ name: 'goalSettingForm' }"
              prepend-icon="mdi-file-document"
              value="goalSettingForm"
              class=" tracking-wider "
            >{{$t('Goal Setting Form')}}</v-list-item>
            <v-list-item 
              :active="activeLink === 'exitForm'"
              v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences && user.hasExitFormsToComplete"
              :to="{ name: 'exitForm' }"
              prepend-icon="mdi-file-document"
              value="exitForm"
              class=" tracking-wider "
            >{{$t('Exit Form')}}</v-list-item>
            <!-- Projects with tooltip for disabled state and notification dot -->
            <v-tooltip 
              location="right"
              :disabled="user.hasRegisteredExperiences"
            >
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-list-item 
                    :active="activeLink === 'projects' || activeLink === 'studentProjects'"
                    :to="user.hasRegisteredExperiences ? { name: 'projects' } : undefined"
                    :disabled="!user.hasRegisteredExperiences"
                    prepend-icon="mdi-account-group"
                    class="tracking-wider"
                  >
                    {{$t('Projects')}}
                    <span 
                      v-if="user.hasRegisteredExperiences && user.hasPendingInvitations" 
                      class="projects-notification-dot"
                    ></span>
                  </v-list-item>
                </div>
              </template>
              <span>You must be registered for at least one Experience to access Projects.</span>
            </v-tooltip>
          </div>
          <!-- Instructor and admin role navigation items -->
          <div v-if="user.isLoggedIn && (user.getRole === 'Instructor' || user.getRole === 'Group Instructor' || user.getRole === 'Group Admin' || user.getRole === 'Org Admin')">
            <v-list-item 
              :active="activeLink === 'instructorDash'"
              :to="{ name: 'instructorDash' }"
              prepend-icon="mdi-view-dashboard"
              value="instructorDash"
              class=" tracking-wider "
            >Dashboard</v-list-item>
            <v-list-item 
              :active="activeLink === 'instructorDataProducts'"
              :to="{ name: 'instructorDataProducts' }"
              prepend-icon="mdi-view-dashboard"
              value="instructorDataProducts"
              class=" tracking-wider"
            >Data Products</v-list-item>
            <v-list-item 
              :active="activeLink === 'instructorStudentsList'"
              :to="{ name: 'instructorStudentsList' }"
              prepend-icon="mdi-account"
              value="instructorStudentsList"
              class=" tracking-wider"
            >Students</v-list-item>
            <v-list-item 
              :active="activeLink === 'instructorDataManagement'"
              :to="{ name: 'instructorDataManagement' }"
              prepend-icon="mdi-school"
              value="instructorDataManagement"
              class=" tracking-wider"
            >Data Management Console</v-list-item>
            <v-list-item 
              :active="activeLink === 'projects' || activeLink === 'instructorProjects'"
              :to="{ name: 'projects' }"
              prepend-icon="mdi-account-group"
              class="tracking-wider"
            >
              {{$t('Projects')}}
            </v-list-item>
            <v-list-item
              v-if="user.getRole === 'Org Admin'"
              :active="activeLink === 'AdminBackupManager'"
              to='/admin/backup'
              prepend-icon="mdi-database"
              value="AdminBackupManager"
              class="tracking-wider"
            >Database Backup</v-list-item>
            <v-list-item
              :active="activeLink === 'generateReports'"
              to='/generateReports'
              prepend-icon="mdi-file-chart-outline"
              value="generateReports"
              class="tracking-wider"
            >Generate Reports</v-list-item>

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
              :to="{ name: 'profile' }"
              prepend-icon="mdi-account"
              value="profile"
              class=" tracking-wider "
            >{{$t('Profile')}}</v-list-item>
            <v-list-item
              :active="activeLink === 'User Data Update Form'"
              to="/updateUserInformation"
              prepend-icon="mdi-cog"
              value="User Data Update Form"
              class=" tracking-wider "
            >{{$t('Update User Information')}}</v-list-item>
            <v-list-item
              :active="activeLink === 'Password Reset'"
              to="/updatePassword"
              prepend-icon="mdi-cog"
              value="Password Reset"
              class=" tracking-wider "
            >{{$t('Update Password')}}</v-list-item>
            <v-list-item
              :active="activeLink === 'Login'"
              to="/login"
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
          v-if="showNavDrawer && !drawer"
          icon 
          @click="drawer = true; rail = false"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <h1 class="text-2xl text-white mr-10">Engaged Data Science</h1>
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
import { useNotificationPolling } from '@/composables/useNotificationPolling';

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
      notificationPolling: null,
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
        this.notificationPolling.startPolling();
      } else if (!newVal) {
        this.notificationPolling.stopPolling();
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
    },
    // Check if current route is a public showcase page (no chrome needed)
    isPublicShowcasePage() {
      return this.$route.path === '/featured' || this.$route.name === 'publicProjectView';
    },
    // Show navigation drawer only for authenticated users not on public showcase pages
    showNavDrawer() {
      return this.isFullyAuthenticated && !this.isPublicShowcasePage;
    }
  },
  methods: {
    // Handle user logout and display random success message
    async handleLogout() {
      const store = useLoggedInUserStore();

      // Stop notification polling
      this.notificationPolling.stopPolling();
      
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
  },
  
  mounted() {
    // Attach scroll listener to main content area
    const mainContentEl = this.$refs.mainContent.$el;
    mainContentEl.addEventListener('scroll', this.handleScroll);
    
    // Start notification polling if user is an authenticated student
    if (this.isFullyAuthenticated && this.user.getRole === 'Student') {
      this.notificationPolling.startPolling();
    }
  },

  beforeUnmount() {
    // Clean up scroll listener
    const mainContentEl = this.$refs.mainContent.$el;
    mainContentEl.removeEventListener('scroll', this.handleScroll);
    
    // Stop notification polling
    this.notificationPolling.stopPolling();
  },

  setup() {
    const user = useLoggedInUserStore();
    const notificationPolling = useNotificationPolling();
    return { user, notificationPolling };
  },

  created() {
    // Fetch organization name from API
    const user = useLoggedInUserStore();
    let apiURL = import.meta.env.VITE_ROOT_API + `/orgdata/`;
    axios
      .get(apiURL)
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

.rail-menu-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
</style>