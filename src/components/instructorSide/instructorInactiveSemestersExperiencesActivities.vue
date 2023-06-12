<!--'/instructorInactiveSemestersExperiencesActivities'-->
<template>
  <main>
      <center>
        <br>
        <p class="font-weight-black text-h6">Inactive Semesters, Experiences, and Actvities</p>
        <br>
            <v-btn style="text-align:center"><router-link to="/instructorAddExperience">
            Reactivate Semesters/Experiences/Activities</router-link>
            </v-btn>
        <div>
        <p>{{selectedSemesters}}{{ selectedExperiences }}{{ selectedActivities }} test</p>
        <br>
        <table style="width: 80%">
        <thead>
        <tr>
        <th class="text-left">Semesters</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="semester in semesterData" :key="semester._id">
        <td class="text-left">
        <input type="checkbox" style="outline: 2px solid gray; margin-right: 10px;" v-model="selectedSemesters" :value="semester.semesterName" id="checkbox-{{ semester._id }}">
        <label :for="'checkbox-' + semester._id">{{ semester.semesterName }}</label>
        </td>
        </tr>
        </tbody>
        </table><br>
        <table style="width: 80%">
        <thead>
        <tr>
        <th class="text-left">Experiences</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="experience in experienceData" :key="experience._id">
        <td class="text-left">
        <input type="checkbox" style="outline: 2px solid gray; margin-right: 10px;" v-model="selectedExperiences" :value="experience.experienceName" id="checkbox-{{ experience._id }}">
        <label :for="'checkbox-' + experience._id">{{ experience.experienceName }}</label>
        </td>
        </tr>
        </tbody>
        </table><br>
        <table style="width: 80%">
        <thead>
        <tr>
        <th class="text-left">Activities</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="activity in activityData" :key="activity._id">
        <td class="text-left">
        <input type="checkbox" style="outline: 2px solid gray; margin-right: 10px;" v-model="selectedActivities" :value="activity.activityName" id="checkbox-{{ activity._id }}">
        <label :for="'checkbox-' + activity._id">{{ activity.activityName }}</label>
        </td>
        </tr>
        </tbody>
        </table>
        </div>
    </center>
  </main>
</template>


<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
export default {
  data() {
    return {
      selectedSemesters:[],
      semesterData: [],
      selectedExperiences:[],
      experienceData:[],
      selectedActivities:[],
      activityData:[]
    };
  },
  mounted() {
    const user = useLoggedInUserStore()
    let token = user.token
    let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/inactiveSemesters/`;
    axios.get(apiURL, { headers: { token },})
      .then(
        (resp) => {
          this.semesterData = resp.data;
        })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
    let secondApiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/inactiveExperiences/`;
    axios.get(secondApiURL, { headers: { token },})
      .then(
        (resp) => {
          this.experienceData = resp.data;
        })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
    let thirdApiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/inactiveActivities/`;
    axios.get(thirdApiURL, { headers: { token },})
      .then(
        (resp) => {
          this.activityData = resp.data;
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
      
        #contentNavbar .nav-item {
            border: 3px solid black;
            border-right: none;
        }
        #contentNavbar .nav-item:last-child {
            border: 1px solid black;
        }
    }
</style>
