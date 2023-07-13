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
                <router-link to="/studentDashboard">
                  <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                  Student Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/studentEntryForm">
                  <span style="position: relative; top: 6px" class="material-icons">description</span>
                  Student Entry Form
                </router-link>
              </li>
              <li>
                <router-link to="/testing">
                  <span style="position: relative; top: 6px" class="material-icons">description</span>
                  Testing
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
                <router-link to="/instructorDash">
                  <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/instructorReports">
                  <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                  Reports
                </router-link>
              </li>
              <li>
                <router-link to="/instructorStudentsList">
                  <span style="position: relative; top: 6px" class="material-icons">person</span>
                  Students
                </router-link>
              </li>
              <li>
                <router-link to="/instructorSemesters">
                  <span style="position: relative; top: 6px" class="material-icons">school</span>
                  Semesters, Experiences, <br> Activities
                </router-link>
              </li>
          </div>
          <div v-if="user.isLoggedIn">
            <li>
              <hr> <!-- Horizontal line -->
            </li>
            <li v-if="user.getRole === 'Student'">
              <router-link to="/profile">
                <span style="position: relative; top: 6px" class="material-icons">person</span>
                Profile
              </router-link>
            </li>
            <li>
              <router-link to="/updateUserInformation">
                <span style="position: relative; top: 6px" class="material-icons">settings</span>
                Update User Information
              </router-link>
            </li>
            <li>
              <router-link to="/resetPassword">
                <span style="position: relative; top: 6px" class="material-icons">settings</span>
                Update Password
              </router-link>
            </li>
            <li>
              <router-link to="/login">
              <span style="position: relative; top: 6px" class="material-icons">logout</span>
              <button @click="store.logout()">Logout</button>
            </router-link>
            </li>
          </div>
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
      displayEntry: [],
      firstTimeLoginTF: null
    };
  },
  methods: {
    showDashboard() {
      this.showElement = true;
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
    // trying to use the endpoint to switch display of Student Entry Form based on whether the submitted is true or false
    let token = user.token;
    let userGivenID = user.userId;
    let url = import.meta.env.VITE_ROOT_API + `/studentSideData/forms/submitted`;
    axios.get(url + `/${userGivenID}`, { headers: { token },})
      .then((resp) => {
        console.log(resp.data);
        this.displayEntry = resp.data.submitted;
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

