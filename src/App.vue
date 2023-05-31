<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen">
      <header v-if="showElement" class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <div v-if="user.isLoggedIn && user.getRole === 'Basic'">
              <li>
                <router-link to="/">
                  <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/intakeform">
                  <span style="position: relative; top: 6px" class="material-icons">people</span>
                  Client Intake Form
                </router-link>
              </li>
              <li>
                <router-link to="/">
                  <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/eventform">
                  <span style="position: relative; top: 6px" class="material-icons">event</span>
                  Create Event
                </router-link>
              </li>
              <li>
                <router-link to="/findclient">
                  <span
                    style="position: relative; top: 6px" class="material-icons">search</span>
                  Find Client
                </router-link>
              </li>
              <li>
                <router-link to="/findEvents">
                  <span style="position: relative; top: 6px" class="material-icons">search</span>
                  Find Event
                </router-link>
              </li>
            </div>
          <div v-if="user.isLoggedIn && user.getRole === 'Student'">
              <li>
                <router-link to="/studentEntryForm">
                  <span style="position: relative; top: 6px" class="material-icons">description</span>
                  Student Entry Form
                </router-link>
              </li>
              <li>
                <router-link to="/goalSettingForm">
                  <span style="position: relative; top: 6px" class="material-icons">description</span>
                  Goal Setting Form
                </router-link>
              </li>
              <li>
                <router-link to="/exitForm">
                  <span style="position: relative; top: 6px" class="material-icons">description</span>
                  Exit Form
                </router-link>
              </li>
          </div>
          <div v-if="user.isLoggedIn && user.getRole === 'Instructor'">
              <li>
                <router-link to="/adminDash">
                  <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/adminReports">
                  <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                  Reports
                </router-link>
              </li>
              <li>
                <router-link to="/adminStudentsList">
                  <span style="position: relative; top: 6px" class="material-icons">person</span>
                  Students
                </router-link>
              </li>
              <li>
                <router-link to="/adminSemesters">
                  <span style="position: relative; top: 6px" class="material-icons">school</span>
                  Semeters, Experiences, <br> Activities
                </router-link>
              </li>
              <li>
                <router-link to="/adminInactiveStudents">
                  <span style="position: relative; top: 6px" class="material-icons">person</span>
                  Inactive Students
                </router-link>
              </li>
              <li>
                <router-link to="/adminInactiveSemestersExperiencesActivities">
                  <span style="position: relative; top: 6px" class="material-icons">school</span>
                  Inactive Semesters, <br>Experiences, and Activities
                </router-link>
              </li>
          </div>
            <li v-if="user.isLoggedIn">
              <router-link to="/resetPassword">
                <span style="position: relative; top: 6px" class="material-icons">settings</span>
                Update Password
              </router-link>
            </li>
            <li v-if="user.isLoggedIn">
              <router-link to="/login">
              <span style="position: relative; top: 6px" class="material-icons">logout</span>
              <button @click="store.logout()">Logout</button>
            </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <h1 class="mr-20 text-3xl text-white">{{ organizationName }}</h1>
      </section>
      <div>
        <router-view @showDashboard="showDashboard"></router-view>
      </div>
    </div>
  </main>
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
    };
  },
  methods: {
    showDashboard() {
      this.showElement = true;
    },
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

