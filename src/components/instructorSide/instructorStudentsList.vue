<!--'/adminStudentsList'-->
<template>
  <main class="">
    <br><p class="font-weight-black text-h5" style="text-align: center;">Students</p>
    <div style="display: flex; justify-content: center;">  
      <v-table style="width: 950%">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Pronouns</th>
            <th class="text-left">Major(s)</th>
            <th class="text-left">Minor</th>
            <th class="text-left">Expected Graduation Date</th>
          </tr>
        </thead>
        <tbody>
          <tr @click="editStudent(student.userID)" v-for="student in studentListRaw" :key="student.userID">
            <td class="text-left">{{ student.userData.firstName + ' ' + student.userData.lastName}}</td>
            <td class="text-left">{{ student.userData.email }}</td>
            <td class="text-left">{{ listCheckedOptions(student.studentInformation.pronouns) }}</td>
            <td class="text-left">{{ majors(student.studentInformation.enrolledUHInfo.majors) }}</td>
            <td class="text-left">{{ minors(student.studentInformation.enrolledUHInfo.otherMinors, student.studentInformation.enrolledUHInfo.honorsMinors) }}</td>
            <td class="text-left">{{ student.studentInformation.enrolledUHInfo.expectedGraduationYear }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </main>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
export default {
data() {
  return {
    studentListRaw: []
  };
},
mounted() {
  const user = useLoggedInUserStore()
  let token = user.token
  let apiURL = import.meta.env.VITE_ROOT_API + `/studentSideData/studentInformation/`;
  axios.get(apiURL, { headers: { token },})
    .then(
      (resp) => {
        this.studentListRaw = resp.data.data;
      })
    .catch((error) => {
      console.log(error);
    });
  window.scrollTo(0, 0);
},
methods: {
  majors(majorsList) {
    return majorsList.length > 0 ? majorsList.join(", ") : "None";
  },
  minors(otherMinorsList, honorsMinorsList) {
    let combinedMinorsList = otherMinorsList.concat(honorsMinorsList);
    return combinedMinorsList.length > 0 ? combinedMinorsList.join(", ") : "None";
  },
  listCheckedOptions(pronounsList) {
    return pronounsList.filter(item => item.checked === true).map(item => item.label).join(", ");
  },
  editStudent(userID) {
    this.$router.push({ name: "instructorSpecificStudent", params: {userID: userID} });
  }
}
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