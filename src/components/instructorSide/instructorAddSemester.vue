<!--'/instructorAddSemester' this page will only show experiences-->
<template>
  <main>
    <v-form @submit.prevent="handleSubmitForm">
      <v-container>
        <p class="font-weight-black text-h6">New Semester</p><br>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="semester.semesterName" label="Semester Name"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="semester.semesterStartDate" label="Semester Start Date"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field type="date" v-model="semester.semesterEndDate" label="Semester End Date"></v-text-field>
          </v-col>
        </v-row>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> <!-- Display the error message -->
        <v-btn style="text-align:center;" @click="handleSubmitForm">Submit</v-btn>
      </v-container>
    </v-form>
  </main>
</template>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  data() {
    return {
      semester: {
        semesterName: '',
        semesterStartDate: '',
        semesterEndDate: ''
      },
      errorMessage: '' // Variable to hold the error message
    };
  },
  methods: {
    async handleSubmitForm() {
      if (!this.semester.semesterName || !this.semester.semesterStartDate || !this.semester.semesterEndDate) {
        this.errorMessage = 'Please fill in all fields.'; // Set the error message
        return;
      }

      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters/`;

      axios.post(apiURL, this.semester, { headers: { token } })
        .then((response) => {
          alert("Semester has been successfully added.");
          this.$router.push("/instructorSemesters");
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            this.errorMessage = error.response.data.error; // Set the error message from the backend response
          } else {
            console.log(error);
          }
        });
    }
  }
}
</script>

<style>
#contentNavbar .nav-link.router-link-exact-active {
  background-color: #eee;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>