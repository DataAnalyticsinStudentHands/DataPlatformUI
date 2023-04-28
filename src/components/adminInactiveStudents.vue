<!--'/adminInactiveStudents'-->
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
                  <router-link class="nav-link text-primary" to="/adminExperiencesActivities">Semesters, Experiences, and Activities</router-link>
                </th>
                <th class="nav-item" style="padding: 30px;">
                  <router-link class="nav-link text-primary" to="/adminInactiveStudents">Inactive Students</router-link>
                </th>
                <th class="nav-item" style="padding: 30px;">
                  <router-link class="nav-link text-primary" to="/adminInactiveExperiencesActivities">Inactive Semesters, Experiences, and Activities</router-link>
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
      <center>
        <p class="font-weight-black text-h6">Inactive Students</p>
            <v-btn style="text-align:center"><router-link class="" to="/adminAddExperience">
            Reactivate Students</router-link>
            </v-btn>
            <v-container fluid>
              <p>{{ selected }}</p>
              <v-checkbox
                v-model="selected"
                label="Abrigal Garcia - abbygarcia@gmail.com"
                value="Abrigal Garcia - abbygarcia@gmail.com"
              ></v-checkbox>
              <v-checkbox
                v-model="selected"
                label="Lori Vo - lorivo@gmail.com"
                value="Lori Vo - lorivo@gmail.com"
              ></v-checkbox>
            </v-container>
    </center>
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
    data () {
      return {
        selected: [],
      }
    },
  }
</script>