<template>
  <v-app>
    <v-layout class="rounded">
      <v-navigation-drawer
      color="#c8102e"
      >
        <template v-slot:prepend>
          <v-list-item
            lines="two"
            prepend-avatar="@/assets/DanPersona.svg"
            title="Jane Smith"
            subtitle="Logged in"
            class="text-white"
          ></v-list-item>
        </template>

<v-list density="compact" nav class="text-white">
  <div v-if="!user.isLoggedIn">
    <v-list-item 
      to="login"
      prepend-icon="mdi-login"
      value="login"
      class="text-base tracking-wider py-2"
    >Login</v-list-item>
  </div>
  <div v-if="user.isLoggedIn && user.getRole === 'Student'">
    <v-list-item 
      to="studentDashboard"
      prepend-icon="mdi-view-dashboard"
      value="dashboard"
      class="text-base tracking-wider py-2"
    >Student Dashboard</v-list-item>
    <v-list-item 
      v-if="!user.hasCompletedEntryForm"
      to="studentEntryForm"
      prepend-icon="mdi-file-document"
      value="entryForm"
      class="text-base tracking-wider py-2"
    >Student Entry Form</v-list-item>
    <v-list-item 
      v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences"
      to="goalSettingForm"
      prepend-icon="mdi-file-document"
      value="goalForm"
      class="text-base tracking-wider py-2"
    >Goal Setting Form</v-list-item>
    <v-list-item 
      v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences"
      to="exitFormsAvailable"
      prepend-icon="mdi-file-document"
      value="exitForm"
      class="text-base tracking-wider py-2"
    >Exit Forms</v-list-item>
  </div>
  <div v-if="user.isLoggedIn">
    <v-list-item>
      <hr> <!-- Horizontal line -->
      <v-divider></v-divider>
    </v-list-item>
    <v-list-item 
      v-if="user.getRole === 'Student'"
      to="profile"
      prepend-icon="mdi-account"
      value="profile"
      class="text-base tracking-wider py-2"
    >Profile</v-list-item>
    <v-list-item
      to="updateUserInformation"
      prepend-icon="mdi-cog"
      value="updateInfo"
      class="text-base tracking-wider py-2"
    >Update User Information</v-list-item>
    <v-list-item
      to="resetPassword"
      prepend-icon="mdi-cog"
      value="updatePass"
      class="text-base tracking-wider py-2"
    >Update Password</v-list-item>
    <v-list-item
      to="login"
      prepend-icon="mdi-logout"
      value="updatePass"
      class="text-base tracking-wider py-2"
      @click="handleLogout"
    >Logout</v-list-item>
  </div>
</v-list>

      </v-navigation-drawer>

    <v-app-bar 
      style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
    >
      <template v-slot:append>
        <h1 class="mr-10 text-2xl text-white">{{ organizationName }}</h1>
      </template>
    </v-app-bar>

    <v-main style="min-height: 300px;">
      <router-view @showDashboard="showDashboard"></router-view>
    </v-main>
  </v-layout>
  </v-app>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      showElement: useLoggedInUserStore().isLoggedIn === false,
      organizationName: "",
      displayEntry: [],
      firstTimeLoginTF: null
    };
  },
  methods: {
    showDashboard() {
      this.showElement = true;
    },
    handleLogout() {
      const store = useLoggedInUserStore();
      store.logout();
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
<style>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>

