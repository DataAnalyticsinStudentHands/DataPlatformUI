<!--'/instructorStudentsList'-->
<template>
  <main class="">
    <br>
    <p class="font-weight-black text-h5" style="text-align: center;">Students</p>
    <center>
      <br>
    <v-btn style="text-align:center" @click="toggleShowInactive">
      {{ showInactive ? 'Show Active Students' : 'Show Inactive Students' }}
    </v-btn>
    <br><br>
    <v-btn style="text-align:center; margin-right:2rem;" @click="deactivateStudents" v-if="selectedStudents.length > 0">
      Deactivate
    </v-btn>
    <v-btn style="text-align:center" @click="activateStudents" v-if="selectedStudents.length > 0">
      Activate
    </v-btn>
    <br><br>
  </center>
    <v-text-field v-model="searchStudent" placeholder="Search by student name, email, major, minor, or graduation"></v-text-field>
    <div style="display: flex; justify-content: center;">
      <v-table style="width: 950%">
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Pronouns</th>
            <th class="text-left">Major(s)</th>
            <th class="text-left">Minor</th>
            <th class="text-left">Expected Graduation Date</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudentData" :key="student.userData._id">
            <td class="text-left">
              <input type="checkbox" v-model="selectedStudents" :value="student.userData._id" style="outline: 2px solid #808080; margin-right: 10px;">
            </td>
            <td @click="editStudent(student.userID)" class="text-left">{{ student.userData.firstName + ' ' + student.userData.lastName }}</td>
            <td @click="editStudent(student.userID)" class="text-left">{{ student.userData.email }}</td>
            <td @click="editStudent(student.userID)" class="text-left">{{ listCheckedOptions(student.studentInformation.pronouns) }}</td>
            <td @click="editStudent(student.userID)" class="text-left">{{ majors(student.studentInformation.enrolledUHInfo.majors) }}</td>
            <td @click="editStudent(student.userID)" class="text-left">{{ minors(student.studentInformation.enrolledUHInfo.otherMinors, student.studentInformation.enrolledUHInfo.honorsMinors) }}</td>
            <td @click="editStudent(student.userID)" class="text-left">{{ student.studentInformation.enrolledUHInfo.expectedGraduationYear }}</td>
            <td @click="editStudent(student.userID)" class="text-left">
              <span v-if="student.userData.userStatus === 'Active'">Active</span>
              <span v-else>Inactive</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </main>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  data() {
    return {
      studentListRaw: [],
      selectedStudents: [], 
      showInactive: false, 
      searchStudent: "",
    };
  },
  mounted() {
    this.fetchStudentData();
    window.scrollTo(0, 0);
  },
  methods: {
    toggleShowInactive() {
      this.showInactive = !this.showInactive;
    },
    deactivateStudents() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { userStatus: 'Inactive' };

      const promises = this.selectedStudents.map((student) => { 
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/userStatusUpdate/${student}`; 
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          const message = (this.selectedStudents.length === 1 ? 'Student' : 'Students') + ' deactivated!'
          this.selectedStudents = [];
          this.fetchStudentData();
          toast.error(message, {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete'
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    activateStudents() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { userStatus: 'Active' };

      const promises = this.selectedStudents.map((student) => { 
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/userStatusUpdate/${student}`; 
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          const message = (this.selectedStudents.length === 1 ? 'Student' : 'Students') + ' activated!'
          this.selectedStudents = [];
          this.fetchStudentData();
          toast.success(message, {
              position: 'top-right',
              toastClassName: 'Toastify__toast--create'
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    majors(majorsList) {
      return majorsList.length > 0 ? majorsList.join(", ") : "None";
    },
    minors(otherMinorsList, honorsMinorsList) {
      let combinedMinorsList = otherMinorsList.concat(honorsMinorsList);
      return combinedMinorsList.length > 0
        ? combinedMinorsList.join(", ")
        : "None";
    },
    listCheckedOptions(pronounsList) {
      return pronounsList
        .filter((item) => item.checked === true)
        .map((item) => item.label)
        .join(", ");
    },
    editStudent(userID) {
      this.$router.push({
        name: "instructorSpecificStudent",
        params: { userID: userID },
      });
    },
    fetchStudentData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL =
        import.meta.env.VITE_ROOT_API + `/studentSideData/studentInformation/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          this.studentListRaw = resp.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateSelectedStatus(student) {
      if (student.checked && student.userData.userStatus === "Active") {
        student.checked = false;
      }
    },
  },
  computed: {
  filteredStudentData() {
    const searchStudent = this.searchStudent.toLowerCase();
    let filteredData = this.studentListRaw.filter((student) => {
      const fullName = `${student.userData.firstName} ${student.userData.lastName}`.toLowerCase();
      const email = student.userData.email.toLowerCase();
      const majors = this.majors(student.studentInformation.enrolledUHInfo.majors).toLowerCase();
      const minors = this.minors(student.studentInformation.enrolledUHInfo.otherMinors, student.studentInformation.enrolledUHInfo.honorsMinors).toLowerCase();
      const graduationDate = student.studentInformation.enrolledUHInfo.expectedGraduationYear.toLowerCase();

      return fullName.includes(searchStudent) || email.includes(searchStudent) || majors.includes(searchStudent) || minors.includes(searchStudent) || graduationDate.includes(searchStudent);
    });

    if (this.showInactive) {
      filteredData = filteredData.filter((student) => student.userData.userStatus === 'Inactive');
    } else {
      filteredData = filteredData.filter((student) => student.userData.userStatus === 'Active');
    }

    return filteredData;
  },
},


};
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