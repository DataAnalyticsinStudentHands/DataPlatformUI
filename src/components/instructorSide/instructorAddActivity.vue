<!--'/instructorAddActivity' this page will only show experiences-->
<template>
    <main class="">
        <center>
            <v-container>
                <p class="font-weight-black text-h6">New Activity</p>
                <br>
                 <v-row>
                     <v-col cols="12" md="6">
                     <v-text-field v-model="activityName" label="Activity's Name"></v-text-field>
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
            <v-btn style="text-align:center">
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
      export default {
      }
  </script>