<template>
  <main>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Welcome {{ firstName }} {{ lastName }}
    </h1>
    <v-container fluid style="width: 90%; margin: 0 auto;">
      <v-row>
        <v-col cols="12" md="5" offset-md="1" class="align-start">
      <v-card
      class="mx-auto elevation-12"
      color="#385F73"
      width="100%"
      >
      <v-list>
          <v-list-item>
              <v-list-item-title class="flex-grow-1 text-center">
                  <span class="font-weight-black text-lg">Student Checklist</span>
                  <v-icon>mdi-clipboard-check</v-icon>
              </v-list-item-title>
          </v-list-item>

          <v-list-group value="Entry Form">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :color="hasCompletedEntryForm ? 'green darken-4' : ''" :class="hasCompletedEntryForm ? 'light-green-bg' : 'light-red-bg'" class="font-weight-black text-base">
                    <span :class="hasCompletedEntryForm ? 'text-green-800' : 'text-red-800'">
                        {{ hasCompletedEntryForm ? 'Student Entry Form' : 'Complete Student Entry Form' }}
                    </span>
                    <template v-slot:append>
                        <v-icon :class="hasCompletedEntryForm ? 'text-green-800' : 'text-red-800'">{{ hasCompletedEntryForm ? 'mdi-check-bold' : 'mdi-alert-circle' }}</v-icon>
                    </template>
                </v-list-item>
            </template>
            <v-list-item class="list-item-no-padding flex" :class="hasCompletedEntryForm ? 'light-green-bg' : 'light-red-bg'">
                <div class="flex items-center no-right-margin">
                    <v-icon :class="hasCompletedEntryForm ? 'text-green-800' : 'text-red-800'" size="small">{{'mdi-door-open'}}</v-icon>
                    <span :class="hasCompletedEntryForm ? 'text-sm text-green-800' : 'text-sm text-red-800'">
                        {{ hasCompletedEntryForm ? 'Thank you for completing the Student Entry Form!' : 'Please complete the ' }}
                        <router-link v-if="!hasCompletedEntryForm" to="/studentEntryForm" class="text-blue-500 underline">Student Entry Form</router-link>
                    </span>
                </div>
            </v-list-item>
        </v-list-group>



        <v-list-group v-if="hasCompletedEntryForm" value="Register Experiences">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :class="selectedExperiencesFinal.length === 0 ? 'light-red-bg' : 'light-green-bg'" @click="selectedExperiencesFinal.length === 0 && updateTooltipStatus()">
                    <span class="text-red-800 font-weight-black" v-if="selectedExperiencesFinal.length === 0">Register your Experiences</span>
                    <span class="text-green-800 font-weight-black" v-else>Experiences Registered</span>
                    <template v-slot:append>
                        <v-icon class="text-red-800" v-if="selectedExperiencesFinal.length === 0">mdi-alert-circle</v-icon>
                        <v-icon class="text-green-800" v-else>mdi-check-bold</v-icon>
                    </template>
                </v-list-item>
            </template>
            <v-list-item class="list-item-no-padding flex" :class="selectedExperiencesFinal.length === 0 ? 'light-red-bg' : 'light-green-bg'">
                <div class="flex items-center no-right-margin">
                    <v-icon :class="selectedExperiencesFinal.length === 0 ? 'text-red-800' : 'text-green-800'" size="small">mdi-flag-checkered</v-icon>
                    <span :class="selectedExperiencesFinal.length === 0 ? 'text-sm text-red-800' : 'text-sm text-green-800'">
                        <span v-if="selectedExperiencesFinal.length === 0">Please use the "Add/Remove Experiences" button to register!</span>
                        <span v-else>Congratulations on registering for your experiences! Good luck!</span>
                    </span>
                </div>
            </v-list-item>
        </v-list-group>
        <v-list-group value="Goal Form" v-if="selectedExperiencesFinal.length" class="light-red-bg">
          <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                  <span class="text-red-800 font-weight-black">Complete Goal Setting Form<span v-if="selectedExperiencesFinal.length > 1">s</span></span>
                  <template v-slot:append>
                      <v-icon class="text-red-800">mdi-alert-circle</v-icon>
                  </template>
              </v-list-item>
          </template>
          <!-- Loop through selected experiences and create a dropdown item for each one -->
          <v-list-item class="light-red-bg" v-for="experience in selectedExperiencesFinal" :key="experience._id">
              <span class="text-sm text-red-800">Complete Goal Setting Form for </span> 
              <router-link 
                  :to="{ name: 'goalSettingForm', params: { id: experience._id } }" 
                  class="text-blue-600 underline hover:text-blue-800">
                  {{ experience.experienceName }}
              </router-link>
          </v-list-item>
      </v-list-group>

      
      </v-list>
      </v-card>

    </v-col>
      <!-- Spacer between the checklists -->
      <v-col cols="12" md="1"></v-col>
      <v-col v-if="hasCompletedEntryForm" cols="12" md="5" class="align-start">



        <v-card
          class="mx-auto elevation-12"
          color="#385F73"
          width="100%"
        >
          <v-list>
            <v-list-item class="grey lighten-1">
              <v-list-item-title class="flex-grow-1 text-center">
                <span class="font-weight-black text-base">Fall 2023</span>
              </v-list-item-title>
            </v-list-item>


            <v-list-item>
                <v-list-item-title class="flex-grow-1 text-center">
                  <span class="font-weight-black text-base">Registered Experiences</span>
                    <v-icon>mdi-school</v-icon>
                </v-list-item-title>

                <!-- Dynamic Experience List Items -->
                <v-list-item class="unclickable"
                    v-for="experience in selectedExperiencesFinal"
                    :key="experience._id"
                    :value="experience"
                >
                    <v-list-item-title>
                        {{ experience.experienceName }}
                    </v-list-item-title>
                </v-list-item>

                <!-- Display message when the list is empty -->
                <v-list-item v-if="selectedExperiencesFinal.length === 0">
                    <v-list-item-title>
                        (No Registered Experiences)
                    </v-list-item-title>
                </v-list-item>
            </v-list-item>





          <!-- Add Experiences Button -->
        <v-list-item>
          <v-row class="justify-center">
            <v-col cols="auto">

              <v-tooltip
                  v-model="shouldShowTooltip"
                  location="right"
              >
                  <template v-slot:activator="{ props }">
                      <v-btn
                          color="grey-lighten-2"
                          v-bind="props"
                          @click="dialog = true"
                      >
                          Add / Remove Experiences
                      </v-btn>
                  </template>
                  <span>Register Here!</span>
              </v-tooltip>

          <v-dialog
            v-model="dialog"
            persistent
            width="1024"
            scrim="rgba(0, 0, 0, 0.7)"
          >
            <v-card>
              <v-card-title>
                <span class="font-weight-black text-xl">Add / Remove Experiences - Fall 2023</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="5">
                    <v-list density="compact">
                      <v-list-subheader> All Experiences</v-list-subheader>

                        <v-list-item
                          v-for="experience in allExperiences"
                          :key="experience._id"
                          @click="toggleExperienceSelection(experience)"
                          :class="isSelected(experience) ? 'light-red-bg' : ''"
                        >
                          <v-list-item-title>
                            {{ experience.experienceName }}
                          </v-list-item-title>
                          
                          <!-- Add a check icon to show which items are selected -->
                          <template v-slot:append>
                            <v-icon v-if="isSelected(experience)">mdi-check</v-icon>
                          </template>
                        </v-list-item>
                    </v-list>
                  </v-col>
                  <!-- Action Buttons -->
                  <v-col cols="2" class="text-center d-flex align-center justify-center">
                    <div>
                        <v-row class="mb-2">
                            <v-btn @click="addAllToSelected">
                                <v-icon>mdi-chevron-double-right</v-icon>
                            </v-btn>
                        </v-row>
                        <v-row>
                            <v-btn @click="removeAllFromSelected">
                                <v-icon>mdi-chevron-double-left</v-icon>
                            </v-btn>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="5">
                  <v-list density="compact">
                      <v-list-subheader> My Experiences</v-list-subheader>
                      <v-list-item
                          v-for="experience in selectedExperiences"
                          :key="experience._id"
                          :value="experience"
                          @click="removeFromMyExperiences(experience)"
                      >
                          <v-list-item-title>
                              {{ experience.experienceName }}
                          </v-list-item-title>
                      </v-list-item>
                  </v-list>
              </v-col>

                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="clearSelectedExperiences"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="saveExperiences"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-list-item>
        </v-list>
        </v-card>

    </v-col>
    </v-row>
  </v-container>
</main>

</template>

<script>
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
      allExperiences: [], // Will contain all experiences from API
      selectedExperiences: [], // Experiences selected by the student
      selectedExperiencesFinal: [],
      selectedExperience: null, // Currently selected experience from "allExperiences"
      unselectedExperience: null, // Currently selected experience from "selectedExperiences"
      dialog: false,
      graphExpandDialog: false,
      items: [
        { text: 'Real-Time', icon: 'mdi-clock' },
        { text: 'Audience', icon: 'mdi-account' },
        { text: 'Conversions', icon: 'mdi-flag' },
      ],
      selectedListItem: null, 
      shouldShowTooltip: false,
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
    let apiURL = import.meta.env.VITE_ROOT_API + `/dashboarddata/recentEvent/`;
    this.queryData = [];
    axios.get(apiURL,{
        headers: { token: localStorage.getItem("token") },
      }).then((resp) => {
      this.queryData = resp.data;
    });
    this.fetchExperiences();
    if (this.$route.params.toastType) {
    toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
      position: this.$route.params.toastPosition,
      toastClassName: this.$route.params.toastCSS
    });
  }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.selectedExperiences = [...this.selectedExperiencesFinal]
      }
    }
  },
  computed: {
    hasCompletedEntryForm() {
      const store = useLoggedInUserStore();
      return store.hasCompletedEntryForm;
    }
  },
  methods: {
    async fetchExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experiencesWithActivities/';

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.allExperiences = response.data;

        // The logging of activities is optional and can be removed if not required
        this.allExperiences.forEach(experience => {
          console.log(`Experience: ${experience.experienceName}`);
          if (experience.activities && experience.activities.length > 0) {
            console.log('Associated Activities:', experience.activities);
          } else {
            console.log('No associated activities.');
          }
        });

      } catch (error) {
        console.log(error);
      }
    },
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    toggleExperienceSelection(experience) {
      const index = this.selectedExperiences.findIndex(exp => exp._id === experience._id);
      if (index !== -1) {
        // Experience is already selected, so remove it
        this.selectedExperiences.splice(index, 1);
      } else {
        // Add the experience to the selected list
        this.selectedExperiences.push(experience);
      }
    },
    removeFromMyExperiences(experience) {
      const index = this.selectedExperiences.findIndex(exp => exp._id === experience._id);
      if (index !== -1) {
        this.selectedExperiences.splice(index, 1);
      }
    },
    addAllToSelected() {
      for (const experience of this.allExperiences) {
        if (!this.isSelected(experience)) {
          this.selectedExperiences.push(experience);
        }
      }
    },
    removeAllFromSelected() {
      this.selectedExperiences = [];
    },
    saveExperiences() {
      this.selectedExperiencesFinal = [...this.selectedExperiences];
      this.dialog = false;
    },

    clearSelectedExperiences() {
      this.selectedExperiences = [];
      this.dialog = false;
    },
    isSelected(experience) {
      return this.selectedExperiences.some(exp => exp._id === experience._id);
    },
    updateTooltipStatus() {
      this.shouldShowTooltip = !this.shouldShowTooltip;
    },
  },
};
</script>


<style>
.list-item-no-padding {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

.no-right-margin {
  margin-right: 0.5rem !important; /* Remove the right margin */
}

.light-green-bg {
  background-color: #e6f7e9; /* This is a very light green color. Adjust if needed */
}

.light-red-bg {
  background-color: #ffe6e6; /* This is a very light red color. Adjust if needed */
}

.light-grey-bg {
  background-color: #f5f5f5; /* Adjust the shade of grey if needed */
}

.unclickable {
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
}


</style>
