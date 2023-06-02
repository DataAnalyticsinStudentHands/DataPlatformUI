<!--'/instructorSpecificSemester' this page will only show experiences-->
<template>
    <main class="">
        <center>
            <v-container>
                <p class="font-weight-black text-h6">HON 3350 MW - Priciple of Data and Society</p>
                <br>
                 <v-row>
                     <v-col cols="12" md="6">
                     <v-text-field v-model="experienceCode" label="HON 3350 MW"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                    <v-text-field v-model="experienceName" label="Priciple of Data and Society"></v-text-field>
                     </v-col>
                    </v-row>
            </v-container>
        </center>
        <div style="text-align: left;">
        <v-list lines="one">
            <v-list-item
                v-for="item in items"
                :key="item.title"
                :title="item.title"
                subtitle="..."
            ></v-list-item>
            </v-list>
        </div>
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