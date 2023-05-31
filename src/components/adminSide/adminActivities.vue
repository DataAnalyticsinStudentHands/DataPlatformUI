<!--'/adminsActivities' this page will only show experiences-->
<template>
    <main class="">
        <center>
          <h2 style="text-align: center; margin-top: 2rem; margin-bottom: 2rem"><router-link class="" to="/adminSemesters">Semesters</router-link> | <router-link class="" to="/adminExperiences">Experiences</router-link> | <router-link class="" to="/adminActivities">Activities</router-link>         </h2>
            <p class="font-weight-black text-h6">Activities</p>
            <br>
            <v-btn style="text-align:center"><router-link class="" to="/adminAddActivity">
            Add New Activity</router-link>
            </v-btn>
            <table>     
            <tr>
            <th style="padding: 30px; text-align: left;">
               Experience Code
            </th>
            <th style="padding: 30px; text-align: left;">
              Experience Name
            </th>
          </tr>
          <tr><router-link class="nav-link text-primary" to="/adminSpecificActivity">
            <td style="padding: 30px;">
              Apprenticeship - Research Assistant
            </td></router-link><router-link class="nav-link text-primary" to="/adminSpecificActivity">
            <td style="padding: 30px;">
                Project 1
            </td></router-link>
          </tr>
          <tr>
            <td style="padding: 30px;">
              Apprenticeship - Research Assistant
            </td>
            <td style="padding: 30px;">
                Homeworks 1-6
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
                Apprenticeship - Research Assistant
            </td>
            <td style="padding: 30px;">
                Module 1: Before there was Criminology
            </td>
          </tr>
        </table>
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
      }
  </script>