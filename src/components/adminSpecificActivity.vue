<!--'/adminExperiencesActivities' this page will only show experiences-->
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
            <v-container>
                <p class="font-weight-black text-h6">Project 1</p>
                <br>
                 <v-row>
                     <v-col cols="12" md="6">
                     <v-text-field v-model="activityName" label="Project 1"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select
                        title="Apprenticeship - Research Assistant"
                        value = "Apprenticeship - Research Assistant"
                        label="Related Experience"
                        :items="['Apprenticeship - Research Assistant', 'HON 3350 MW', 'HON 3397']"
                        variant="solo"
                        ></v-select>
                     </v-col>
                    </v-row>
            </v-container>
        </center>
        <div style="text-align:right;">
            <v-btn style="text-align:center;">
            Update
            </v-btn>
            <v-btn style="text-align:center">
            Inactivate
            </v-btn>
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