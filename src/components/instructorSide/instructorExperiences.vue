<!--'/instructorExperiences' this page will only show experiences-->
<template>
  <main class="">
      <center>
        <h2 style="text-align: center; margin-top: 2rem; margin-bottom: 2rem"> <router-link class="" to="/instructorSemesters">Semesters</router-link> | <router-link class="" to="/adminExperiences">Experiences</router-link> | <router-link class="" to="/adminActivities">Activities</router-link>         </h2>
            <p class="font-weight-black text-h6">Experiences</p>
            <br>
            <v-btn style="text-align:center"><router-link class="" to="/instructorAddExperience">
            Add New Experience</router-link>
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
        <tr><router-link class="nav-link text-primary" to="/instructorSpecificExperience">
          <td style="padding: 30px;">
            HON 3350 MW
          </td></router-link><router-link class="nav-link text-primary" to="/instructorSpecificExperience">
          <td style="padding: 30px;">
            Priciple of Data and Society
          </td></router-link>
        </tr>
        <tr>
          <td style="padding: 30px;">
            HON 3397
          </td>
          <td style="padding: 30px;">
            American Crime Story
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
import { useLoggedInUserStore } from "@/stored/loggedInUser";
    export default {
    }
</script>