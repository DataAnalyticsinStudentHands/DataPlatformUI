<!--'/instructorSemestersInactiveExperiencesActivities'-->
<template>
  <main class="">
      <center>
        <br>
        <p class="font-weight-black text-h6">Inactive Semesters, Experiences, and Actvities</p>
        <br>
            <v-btn style="text-align:center"><router-link class="" to="/instructorAddExperience">
            Reactivate Experiences/Activities</router-link>
            </v-btn>
            <v-container fluid>
              <p>{{ selected }}</p>
              <v-checkbox
                v-model="selected"
                label="Experience HON 3355 MW"
                value="Experience HON 3355 MW"
              ></v-checkbox>
              <v-checkbox
                v-model="selected"
                label="Activity Project 1 for Experience HON 3355 MW"
                value="Activity Project 1 for Experience HON 3355 MW"
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