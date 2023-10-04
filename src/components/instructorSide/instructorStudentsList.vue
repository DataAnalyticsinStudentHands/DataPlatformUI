<!--'/instructorStudentsList'-->
<template>
  <main class="">
    <br>
    <p class="font-weight-black text-h5" style="text-align: center;">{{ showInactive ? 'Inactive Students' : 'Active Students' }}</p>
    <v-row justify="center" class="pt-5">
    <v-col cols="12" class="text-center">
      <v-btn @click="toggleShowInactive">
        {{ showInactive ? 'Show Active Students' : 'Show Inactive Students' }}
      </v-btn>
    </v-col>
  </v-row>
  <v-row justify="center">
    <v-col cols="12" class="text-center">
      <v-btn style="margin-right:2rem;" @click="deactivateStudents" v-if="selectedStudents.length > 0">
        Deactivate
      </v-btn>
      <v-btn @click="activateStudents" v-if="selectedStudents.length > 0">
        Activate
      </v-btn>
    </v-col>
  </v-row>
 

    <!-- First Row: Search Field -->
    <v-row class="my-2">
      <v-col cols="12">
        <v-text-field 
          v-model="searchStudent" 
          placeholder="Search by student name, email, major, minor, or graduation date"
          outlined
          style="width: 100%;"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Second Row: Items Per Page Field and Pagination -->
    <v-row class="my-2">
      
      <!-- Items Per Page Field -->
      <v-col cols="12" md="4">
        <v-text-field
          v-model="itemsPerPage"
          :min="1"
          type="number"
          label="Number of Students Shown Per Page"
          outlined
          style="width: 70%;"
        ></v-text-field>
      </v-col>

      <!-- Pagination -->
      <v-col cols="12" md="8" class="text-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPaginationLength"
          :total-visible="10"
        ></v-pagination>
      </v-col>
      
    </v-row>


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
          </tr>
        </thead>

        <tbody>
          <tr
              v-for="item in paginatedMergedData"
              :key="item.type === 'student' ? item.data.userData._id : item.data._id"
              :style="{ cursor: 'pointer' }"
              :class="{ 'hoverRow': hoverId === (item.type === 'student' ? item.data.userData._id : item.data._id) }"
              @mouseenter="hoverId = item.type === 'student' ? item.data.userData._id : item.data._id"
              @mouseleave="hoverId = null"
          >
            <td class="text-left">
              <input
                type="checkbox"
                v-model="selectedStudents"
                :value="item.type === 'student' ? item.data.userData._id : item.data._id"
                style="outline: 2px solid #808080; margin-right: 10px;"
              >
            </td>
            <td v-if="item.type === 'student'" @click="editStudent(item.data.userID)" class="text-left">
              {{ item.data.userData.firstName + ' ' + item.data.userData.lastName }}
            </td>
            <td v-else class="text-left">
              {{ item.data.userData.firstName }} {{ item.data.userData.lastName }}
            </td>
            <td v-if="item.type === 'student'" @click="editStudent(item.data.userID)" class="text-left">
              {{ item.data.userData.email }}
            </td>
            <td v-else class="text-left">
              {{ item.data.userData.email }}
            </td>
            <td v-if="item.type === 'student'" @click="editStudent(item.data.userID)" class="text-left">
              {{ listCheckedOptions(item.data.studentInformation.pronouns) }}
            </td>
            <td v-else></td>
            <td v-if="item.type === 'student'" @click="editStudent(item.data.userID)" class="text-left">
              {{ majors(item.data.studentInformation.enrolledUHInfo.majors) }}
            </td>
            <td v-else></td>
            <td v-if="item.type === 'student'" @click="editStudent(item.data.userID)" class="text-left">
              {{ minors(item.data.studentInformation.enrolledUHInfo.otherMinors, item.data.studentInformation.enrolledUHInfo.honorsMinors) }}
            </td>
            <td v-else></td>
            <td v-if="item.type === 'student'" @click="editStudent(item.data.userID)" class="text-left">
              {{ item.data.studentInformation.enrolledUHInfo.expectedGraduationYear }}
            </td>
            <td v-else></td>
          </tr>
        </tbody>

      </v-table>
      </div>
<p>selectedStudents: {{ selectedStudents }}</p>
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
      userListRaw:[],
      selectedStudents: [], 
      showInactive: false, 
      searchStudent: "",
      hoverId: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  mounted() {
    this.fetchStudentData();
    this.fetchIncompletedStudentData();
    window.scrollTo(0, 0);
  },
  watch: {
    searchStudent(newVal, oldVal) {
      if (newVal !== oldVal) {
        // reset to the first page on a new search
        this.currentPage = 1;
      }
    },
  },
  methods: {
    toggleShowInactive() {
      this.showInactive = !this.showInactive;
      this.currentPage = 1;
    },

    deactivateStudents() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updateStatus = { userStatus: 'Inactive' };

      console.log('deactivateStudents - this.selectedStudents: ', this.selectedStudents);

      const promises = this.selectedStudents.map((student) => { 
        console.log('deactivateStudents - student: ', student);
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/userStatusUpdate/${student}`; 
        return axios.put(apiURL, updateStatus, { headers: { token } });
      });

      Promise.all(promises)
        .then(() => {
          const message = (this.selectedStudents.length === 1 ? 'Student' : 'Students') + ' deactivated!';
          // Update user status in studentListRaw and userListRaw
          const updateStatusInList = (list, newStatus) => {
            // Use Array.from to create a new array
            const updatedList = Array.from(list);
            updatedList.forEach(student => {
              if (this.selectedStudents.includes(student.userData._id)) {
                student.userData.userStatus = newStatus;
              }
            });
            return updatedList;
          };

          this.studentListRaw = updateStatusInList(this.studentListRaw, 'Inactive');
          this.userListRaw = updateStatusInList(this.userListRaw, 'Inactive');

          this.selectedStudents = [];

          // Fetch data again to ensure synchronization
          this.fetchStudentData();
          this.fetchIncompletedStudentData();

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
      const message = (this.selectedStudents.length === 1 ? 'Student' : 'Students') + ' activated!';

       // Update user status in studentListRaw and userListRaw
       const updateStatusInList = (list, newStatus) => {
        const updatedList = Array.from(list);
        updatedList.forEach(student => {
          if (this.selectedStudents.includes(student.userData._id)) {
            student.userData.userStatus = newStatus;
          }
        });
        return updatedList;
      };

      this.studentListRaw = updateStatusInList(this.studentListRaw, 'Active');
      this.userListRaw = updateStatusInList(this.userListRaw, 'Active');

      this.selectedStudents = [];

      // Fetch data again to ensure synchronization
      this.fetchStudentData();
      this.fetchIncompletedStudentData();

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
    fetchIncompletedStudentData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL =
        import.meta.env.VITE_ROOT_API + `/studentSideData/studentInformation/noEntryForms`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          // Populate userListRaw with complete user data
          this.userListRaw = resp.data.userData;
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
    normalizeData(data, type) {
      if (type === 'student') {
        return {
          _id: data._id,
          userID: data.userData._id,
          studentInformation: {
            enrolledUHInfo: {
              uhEmail: data.studentInformation.enrolledUHInfo.uhEmail,
              majors: data.studentInformation.enrolledUHInfo.majors,
              honorsMinors: data.studentInformation.enrolledUHInfo.honorsMinors,
              otherMinors: data.studentInformation.enrolledUHInfo.otherMinors
            },
            pronouns: data.studentInformation.pronouns
          },
          userData: {
            _id: data.userData._id,
            firstName: data.userData.firstName,
            lastName: data.userData.lastName,
            email: data.userData.email,
            userStatus: data.userData.userStatus
          }
        };
      } else if (type === 'user') {
        return {
          _id: data._id,
          userID: data._id,
          studentInformation: {
            enrolledUHInfo: {
              uhEmail: "",
              majors: null,
              honorsMinors: null,
              otherMinors: null
            },
            pronouns: null
          },
          userData: {
            _id: data.userData._id,
            firstName: data.userData.firstName,
            lastName: data.userData.lastName,
            email: data.userData.email,
            userStatus: data.userData.userStatus
          }
        };
      }
    },
  },
  computed: {
    filteredStudentData() {
      const searchStudent = this.searchStudent.toLowerCase();

      let filteredData = this.studentListRaw;

      // If there is a search query, filter the data based on the search query
      if (searchStudent) {

        filteredData = this.studentListRaw.filter(user => {
          const fullName = `${user.userData.firstName} ${user.userData.lastName}`.toLowerCase();
          const email = user.userData.email?.toLowerCase() || "";
          return fullName.includes(searchStudent) || email.includes(searchStudent);
        });
      }

      // Regardless of whether there is a search query, filter the data based on Active/Inactive status
      if (this.showInactive) {
        filteredData = filteredData.filter(user => user.userData.userStatus === 'Inactive');
      } else {
        filteredData = filteredData.filter(user => user.userData.userStatus === 'Active');
      }
      return filteredData;
    },
    filteredUserListRaw() {
      const searchStudent = this.searchStudent.toLowerCase();

      let filteredData = this.userListRaw;

      // If there is a search query, filter the data based on the search query
      if (searchStudent) {

        filteredData = this.userListRaw.filter(user => {
          const fullName = `${user.userData.firstName} ${user.userData.lastName}`.toLowerCase();
          const email = user.userData.email?.toLowerCase() || "";  // some users might not have emails
          // Assuming users from this list don't have major, minor, and graduation details, we only filter by name and email.
          return fullName.includes(searchStudent) || email.includes(searchStudent);
        });
      }

      // Regardless of whether there is a search query, filter the data based on Active/Inactive status
      if (this.showInactive) {
        filteredData = filteredData.filter(user => user.userData.userStatus === 'Inactive');
      } else {
        filteredData = filteredData.filter(user => user.userData.userStatus === 'Active');
      }
      return filteredData;
    },


    mergedFilteredData() {
      const studentData = this.filteredStudentData.map(student => ({
        type: 'student',
        data: this.normalizeData(student, 'student')
      }));

      const userData = this.filteredUserListRaw.map(user => ({
        type: 'user',
        data: this.normalizeData(user, 'user')
      }));

      return studentData.concat(userData);
    },
    paginatedMergedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.mergedFilteredData.slice(start, end);
    },
    totalPaginationLength() {
      return Math.ceil(this.mergedFilteredData.length / this.itemsPerPage);
    },
}
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


.hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
  }

</style>