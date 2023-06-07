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
        semesterStartDate:'',
        semesterEndDate:''
      }
    };
  },
  methods: {
    async handleSubmitForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters/`;
      
      axios.post(apiURL, this.semester, {headers: { token }})
      .then((response) => {
        alert("Semester has been successfully added.");
        this.$router.push("/instructorSemesters");
      })
      .catch((error) => {
        console.log(error);
      });
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