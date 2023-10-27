<template>
  <main>
    <v-container>
      <v-row>
        <v-col class="text-center">
          <h1
            class="font-bold text-4xl text-red-700 tracking-widest mt-10"
          >
            Welcome {{ firstName }} {{ lastName }}
          </h1>
        </v-col>
      </v-row>
      
      <v-row class="my-6">
        <v-col
          :cols="12"
          class="ml-10"
        >

        </v-col>
      </v-row>
      
      <v-row>
        <v-col :cols="12">
          <v-card @click="dialog = true" class="mx-auto" max-width="400">
            <v-card-title color="red darken-2">
              Goal Form Completion Tracker
            </v-card-title>
            <v-card-subtitle class="text-wrap">
              <span class="red-darken-5">See a list of students who have registered for an Experience this Semester, but have not completed a Goal Setting Form for that Experience.</span>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      
      <v-dialog v-model="dialog" persistent width="1024">
      <v-card>
        <v-card-title>
          Goal Form Completion Tracker
        </v-card-title>
        <!-- v-dialog content -->
        <v-card-subtitle class="text-h6">
          Select an Experience
        </v-card-subtitle>

        <v-container>
          <v-row>
            <v-col cols="12" sm="8" md="8">
              <v-autocomplete
                v-model="selectedExperience"
                :items="formattedExperiences"
                label="Experience"
                item-title="text"
                item-value="value"
                clearable
                @update:modelValue="updateExperienceID"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>

      <!-- Table -->
      <div style="display: flex; justify-content: center;">
        <table style="width: 95%;">
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
            <tr
              v-for="student in studentsWithoutGoalForm"
              :key="student.userID"
              :class="{ 'hoverRow': hoverId === student.userID }"
              @mouseenter="hoverId = student.userID"
              @mouseleave="hoverId = null"
              @click="navigateToProfile(student.userID)"
            >
              <td class="text-left">{{ student.fullName }}</td>
              <td class="text-left">{{ student.email }}</td>
              <td class="text-left">{{ student.pronouns.map(p => p.label).join(', ') }}</td>
              <td class="text-left">{{ student.majors.join(', ') }}</td>
              <td class="text-left">{{ student.honorsMinors.join(', ') }}</td>
              <td class="text-left">{{ student.expectedGraduationDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

        <!-- Further content of the dialog goes here -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    </v-container>
  </main>
</template>




<script>
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { DateTime } from "luxon";
import axios from "axios";
export default {
  data() {
    return {
      queryData: [],
      firstName: "",
      lastName: "",
      dialog: false,
      selectedExperience: null,
      experiences: [],
      studentsWithoutGoalForm: [],
      hoverId: null,
    };
  },
  mounted() {
    let token = localStorage.getItem("token");
    let url = import.meta.env.VITE_ROOT_API + `/userdata/user`;
    axios
      .get(url, {
        headers: {token},
      })
      .then(
        (res) => {
          this.firstName = res.data.user.firstName;
          this.lastName = res.data.user.lastName;
        },
        (err) => {
          if (err) {
            this.$router.push("/login");
          }
        }
      )
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
    this.fetchExperiences();
  },
  watch: {
    selectedExperience: 'fetchStudentsWithoutGoalForm', // Fetch data whenever selectedExperience changes
  },
  computed: {
    formattedExperiences() {
      return this.experiences.map(experience => ({
        text: `${experience.experienceCategory}: ${experience.experienceName}`,
        value: experience.experienceID
      }));
    },
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    updateExperienceID(selected) {
      // If the selected value is empty, set selectedExperience to null and exit the method
      if (!selected) {
        this.selectedExperience = null;
        return;
      }

      // If a value is selected, set selectedExperience to the value of the selected experience
      this.selectedExperience = selected;
    },
    async fetchExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/activeSemesterExperiences/';

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.experiences = response.data.map(experience => ({
          experienceID: experience._id,
          experienceCategory: experience.experienceCategory,
          experienceName: experience.experienceName
        }));
      } catch (error) {
        console.log(error);
      }
    },
    async fetchStudentsWithoutGoalForm(experienceID) {
      let token = localStorage.getItem("token");
      let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/studentsWithoutGoalForm?experienceID=${experienceID}`;
      try {
        const response = await axios.get(url, { headers: {token} });
        this.studentsWithoutGoalForm = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    navigateToProfile(userID) {
      this.$router.push({
        name: "instructorSpecificStudent",
        params: { userID: userID },
      });
    },

  },
};
</script>

<style scoped>
.text-wrap {
  white-space: normal;
}

</style>

<style>
.v-field__input > input[size="1"] {
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

.v-field__input > input[size="1"]::before,
.v-field__input > input[size="1"]::after {
  display: none;
}

.hoverRow {
  background-color: #f0f0f0; /* light grey background */
  cursor: pointer;
}
</style>