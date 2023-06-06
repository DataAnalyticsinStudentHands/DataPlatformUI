<!--'/instructorAddExperience' this page will only show experiences-->
<template>
    <main class="">
        <center>
            <v-container>
                <p class="font-weight-black text-h6">New Experience</p>
                <br>
                 <v-row>
                     <v-col cols="12" md="6">
                     <v-text-field v-model="experienceCode" label="Experience's Code"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                    <v-text-field v-model="experienceName" label="Experiece's Name"></v-text-field>
                     </v-col>
                    </v-row>
            </v-container>
        </center>
        <div style="text-align:right;">
            <v-btn style="text-align:center;">
            Submit
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
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
  data: () => ({
      items: [
        {
          title: 'Activity #1',
          value: 1,
        },
        {
          title: 'Activity #2',
          value: 2,
        },
        {
          title: 'Activity #3',
          value: 3,
        },
      ],
    }),
  }
  </script>