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
        <v-table style="width: 80%">
          <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">Experience Category</th>
              <th class="text-left">Experience Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="experience in experiences" :key="experience._id">
              <td class="text-left">
                <input
                  type="checkbox"
                  v-model="selectedExperiences"
                  :value="experience._id"
                  style="outline: 2px solid #808080; margin-right: 10px;"
                />
              </td>
              <td class="text-left">{{ experience.experienceCategory }}</td>
              <td class="text-left">{{ experience.experienceName }}</td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <v-btn style="text-align: center;" @click="handleSubmitForm">Submit</v-btn>
        <v-btn @click=$router.back() style="margin-left: 10px;">
          Cancel
        </v-btn>
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
        semesterName: "",
        semesterStartDate: "",
        semesterEndDate: "",
      },
      experiences: [],
      selectedExperiences: [],
      errorMessage: ""
    };
  },
  beforeMount() {
    window.scrollTo(0, 0);
    this.fetchExperienceData();
  },
    methods: {
    fetchExperienceData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const experiences = resp.data;
          this.experiences = experiences.filter((experience) => experience.experienceStatus === true);
        })
        .catch((error) => {
          this.handleError(error);
        });
    },
    handleSubmitForm() {
      if (
        !this.semester.semesterName ||
        !this.semester.semesterStartDate ||
        !this.semester.semesterEndDate
      ) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }

      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/semesters/`;

      axios
        .post(apiURL, {
          semesterName: this.semester.semesterName,
          semesterStartDate: this.semester.semesterStartDate,
          semesterEndDate: this.semester.semesterEndDate,
          experiences: this.selectedExperiences, 
        }, { headers: { token } })
        .then(() => {
          this.$router.push({ 
              name: 'instructorSemesters',
              params: {
                toastType: 'success',
                toastMessage: 'Semester added!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
            }
          });


        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            this.errorMessage = error.response.data.error;
          } else {
            this.handleError(error);
          }
        });
    }
  }
};
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
