<!--'/instructorSemesters' this page will only show experiences-->
<template>
    <main class="">
        <center>
          <h2 style="text-align: center; margin-top: 2rem; margin-bottom: 2rem"> <router-link class="" to="/instructorSemesters">Semesters</router-link> | <router-link class="" to="/instructorExperiences">Experiences</router-link> | <router-link class="" to="/instructorActivities">Activities</router-link>         </h2>
              <p class="font-weight-black text-h6">Semesters</p>
              <br>
              <v-btn style="text-align:center"><router-link class="" to="/instructorAddSemester">
              Add New Semester</router-link>
              </v-btn>
              <table>
            <tr>
              <th style="padding: 30px; text-align: left;">
                 Semester
              </th>
              <th style="padding: 30px; text-align: left;">
                Date Range
              </th>
          </tr>
          <tr><router-link class="nav-link text-primary" to="/instructorSpecificExperience">
            <td style="padding: 30px;">
              Spring 2023
            </td></router-link>
            <td style="padding: 30px;"> <router-link class="nav-link text-primary" to="/instructorSpecificExperience">
              January 17, 2023 - May 11, 2023 </router-link>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              Fall 2022
            </td>
            <td style="padding: 30px;">
              August 22, 2022 - December 14, 2022
            </td>
          </tr>
        </table>
        </center>

        <!-- <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Semester</th>
              <th class="p-4 text-left">Date Ranges</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr
              v-for="semester in semesterData"
              :key="semester.semesterName"
            >
              <td class="p-2 text-left">
                {{ semester.semesterName}}
              </td>
              <td class="p-2 text-left">
                {{ semester.semesterStartDate + " - " + semester.semesterEndDate }}
              </td>
              <td class="p-2 text-left">{{ client.address.city }}</td>
            </tr>
          </tbody>
        </table>
        </div> -->
        {{ semesterData }}
    </main>
  </template>
 
<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
export default {
  data() {
    return {
      semesterData: []
    };
  },
  mounted() {
    const user = useLoggedInUserStore()
    let token = user.token
    let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters/`;
    axios.get(apiURL, { headers: { token },})
      .then(
        (resp) => {
          this.semesterData = resp.data;
        })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
  },
}
</script>

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