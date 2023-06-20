<!--'/instructorSpecificSemester' this page will only show experiences-->
<template>
  <main class="">
    <v-container>
      <p class="font-weight-black text-h6">Semester: {{ semester.semesterName }}</p>
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
      <div style="text-align:right;">
        <v-btn style="text-align:center;" @click="handleUpdateForm" >
          Update
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
        semesterName: '',
        semesterStartDate: '',
        semesterEndDate: '',
        semesterStatus: false
      }
    };
  },
  beforeMount() {
    const user = useLoggedInUserStore();
    let token = user.token;
    let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters`;
    axios
      .get(`${url}/${this.$route.params.id}`, {
        headers: { token },
      })
      .then((resp) => {
        let data = resp.data[0];
        console.log(resp.data[0]);
        this.semester.semesterName = data.semesterName;
        this.semester.semesterStartDate = DateTime.fromISO(data.semesterStartDate)
          .plus({ days: 1 })
          .toISODate();
        this.semester.semesterEndDate = DateTime.fromISO(data.semesterEndDate)
          .plus({ days: 1 })
          .toISODate();
        this.semester.semesterStatus = data.semesterStatus;
      });
  },
  methods: {
    handleUpdateForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/semesters`;
      
      // Retrieve the existing semester status from the API before updating
      axios.get(`${url}/${this.$route.params.id}`, {
        headers: { token },
      }).then((resp) => {
        let data = resp.data[0];
        // Preserve the existing semester status when updating the form
        this.semester.semesterStatus = data.semesterStatus;
        // Update the form data
        axios.put(`${url}/${this.$route.params.id}`, this.semester, {
          headers: { token },
        }).then(() => {
          alert("Update has been saved.");
          this.$router.back().catch((error) => {
            console.log(error);
          });
        });
      });
    },
  }
}
</script>
