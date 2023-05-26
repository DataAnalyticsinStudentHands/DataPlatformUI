<!--'/adminDash'-->
<template>
  <main class=""><center>
      <table class="d-inline-block text-start ms-3 w-100">
        <nav id="contentNav" class="navbar navbar-expand-lg navbar-light navbar-brand" style="margin-top:2rem; margin-bottom:2rem">
            <tr class="navbar-nav ms-auto mb-2 mb-lg-0 flex-wrap">
              <th class="nav-item" style="padding: 30px;">
                <router-link class="nav-link text-primary" to="/adminDash">Dashboard</router-link>
              </th>
              <th class="nav-item" style="padding: 30px;">
                <router-link class="nav-link text-primary" to="/adminReports">Reports</router-link>
              </th>
              <th class="nav-item" style="padding: 30px;">
                <router-link class="nav-link text-primary" to="/adminStudentsList">Students</router-link>
              </th>
              <th class="nav-item" style="padding: 30px;">
                  <router-link class="nav-link text-primary" to="/adminSemesters">Semesters, Experiences, and Activities</router-link>
                </th>
                <th class="nav-item" style="padding: 30px;">
                  <router-link class="nav-link text-primary" to="/adminInactiveStudents">Inactive Students</router-link>
                </th>
                <th class="nav-item" style="padding: 30px;">
                  <router-link class="nav-link text-primary" to="/adminInactiveSemestersExperiencesActivities">Inactive Semesters, Experiences, and Activities</router-link>
                </th>
              <th class="nav-item" style="padding: 30px;">
                <router-link class="nav-link" to="" @click="handleLogout">Logout</router-link>
              </th>
            </tr>
      </nav>
    </table>
  </center>
      <div>
          <router-view></router-view>
      </div>
  </main>
</template>
<style>
    #contentNavbar .nav-link.router-link-exact-active{
        background-color: #eee;
    }
    /* Medium Devices, Desktops */
    @media only screen and (min-width : 992px) {
        main {
            text-align: center;
        }
        #contentNavbar .nav-item {
            border: 3px solid black;
            border-right: none;
        }
        #contentNavbar .nav-item:last-child {
            border: 1px solid black;
        }
    }
</style>

<script>
    export default {
    }
</script>