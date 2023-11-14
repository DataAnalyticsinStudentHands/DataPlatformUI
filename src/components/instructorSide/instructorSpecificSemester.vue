<!--'/instructorSpecificSemester' this page will only show experiences-->
<template>
  <main class="">
    <v-container>
      <p class="font-weight-black text-h6">Semester: {{ semester.originalSemesterName }}</p>
      <br>
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
            <th class="text-left">Experience Code</th>
            <th class="text-left">Experience Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="experience in semester.experiences" :key="experience._id">
            <td class="text-left">
              <input
                type="checkbox"
                :value="experience._id"
                v-model="selectedExperiences"
                style="outline: 2px solid #808080; margin-right: 10px;"
              />
            </td>
            <td class="text-left">{{ experience.experienceCategory }}</td>
            <td class="text-left">{{ experience.experienceName }}</td>
          </tr>
        </tbody>
      </v-table>
      <div style="text-align:left;">
        <v-btn style="text-align:center;" @click="handleUpdateForm" class="mr-4">
          Update
        </v-btn>
        <v-btn @click=$router.back() style="margin-right: 10px;">
          Cancel
        </v-btn>

      </div>
    </v-container>
  </main>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { DateTime } from "luxon";



export default {
  props: ["id"],
  data() {
    return {
      semester: {
        originalSemesterName: "",
        semesterName: '',
        semesterStartDate: '',
        semesterEndDate: '',
        semesterStatus: false,
        experiences: [],
      },
      selectedExperiences: [],
    };
  },

  beforeMount() {
    window.scrollTo(0, 0);
    this.fetchExperienceData();
    this.fetchSemesterData();
  },

  methods: {

    fetchSemesterData(){
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/semesters`;
      axios
        .get(`${url}/${this.$route.params.id}`, {
          headers: { token },
        })
        .then((resp) => {
          let data = resp.data;
          this.semester.originalSemesterName = data.semesterName;
          this.semester.semesterName = data.semesterName;
          this.semester.semesterStartDate = DateTime.fromISO(data.semesterStartDate)
            .plus({ days: 1 })
            .toISODate();
          this.semester.semesterEndDate = DateTime.fromISO(data.semesterEndDate)
            .plus({ days: 1 })
            .toISODate();
          this.semester.semesterStatus = data.semesterStatus;
          this.selectedExperiences = data.experiences;
        })
        .catch((error) => {
            this.handleError(error);
          });
    },

    fetchExperienceData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          this.semester.experiences = resp.data.filter((experience) => experience.experienceStatus === true);
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    handleUpdateForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      const updatedSemester = {
        semesterName: this.semester.semesterName,
        semesterStartDate: this.semester.semesterStartDate,
        semesterEndDate:this.semester.semesterEndDate,
        experiences: this.selectedExperiences,
      };
      let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/semesters`;
      axios.get(`${url}/${this.$route.params.id}`, {
        headers: { token },
      }).then((resp) => {
        let data = resp.data;
        this.semester.semesterStatus = data.semesterStatus;
        axios.put(`${url}/${this.$route.params.id}`, updatedSemester, {
          headers: { token },
        }).then(() => {
          this.$router.push({ 
              name: 'instructorSemesters',
              params: {
                toastType: 'info',
                toastMessage: 'Semester updated!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--update'
            }
          });
        });
      });
    },
    
  },
};
</script>
