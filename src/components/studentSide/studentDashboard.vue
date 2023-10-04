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
                <v-list-item v-bind="props" :class="registeredExperiences.length === 0 ? 'light-red-bg' : 'light-green-bg'" @click="registeredExperiences.length === 0 && updateTooltipStatus()">
                    <span class="text-red-800 font-weight-black" v-if="registeredExperiences.length === 0">Register your Experiences</span>
                    <span class="text-green-800 font-weight-black" v-else>Experiences Registered</span>
                    <template v-slot:append>
                        <v-icon class="text-red-800" v-if="registeredExperiences.length === 0">mdi-alert-circle</v-icon>
                        <v-icon class="text-green-800" v-else>mdi-check-bold</v-icon>
                    </template>
                </v-list-item>
            </template>
            <v-list-item class="list-item-no-padding flex" :class="registeredExperiences.length === 0 ? 'light-red-bg' : 'light-green-bg'">
                <div class="flex items-center no-right-margin">
                    <v-icon :class="registeredExperiences.length === 0 ? 'text-red-800' : 'text-green-800'" size="small">mdi-flag-checkered</v-icon>
                    <span :class="registeredExperiences.length === 0 ? 'text-sm text-red-800' : 'text-sm text-green-800'">
                        <span v-if="registeredExperiences.length === 0">Please use the "Add/Remove Experiences" button to register!</span>
                        <span v-else>Congratulations on registering for your experiences! Good luck!</span>
                    </span>
                </div>
            </v-list-item>
        </v-list-group>
        <v-list-group value="Goal Form" v-if="registeredExperiences.length" :class="areAllGoalsSet ? 'light-green-bg' : 'light-red-bg'">
          <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <span :class="areAllGoalsSet ? 'text-green-800 font-weight-black' : 'text-red-800 font-weight-black'">
                    {{ areAllGoalsSet ? 'Completed' : 'Complete' }} Goal Setting Form<span v-if="registeredExperiences.length > 1">s</span>
                </span>
                  <template v-slot:append>
                      <v-icon :class="areAllGoalsSet ? 'text-green-800' : 'text-red-800'">{{ areAllGoalsSet ? 'mdi-check-bold' : 'mdi-alert-circle' }}</v-icon>
                  </template>
              </v-list-item>
          </template>
            <!-- Loop through selected experiences and create a dropdown item for each one -->
            <v-list-item 
                v-for="experience in registeredExperiences" 
                :key="experience._id" 
                :class="isFormCompleted(experience._id) ? 'light-green-bg' : 'light-red-bg'"
            >
                <span :class="isFormCompleted(experience._id) ? 'text-sm text-green-800' : 'text-sm text-red-800'">
                    {{ isFormCompleted(experience._id) ? 'Completed' : 'Complete' }} Goal Setting Form for 
                </span> 
                <!-- Conditionally render router-link or plain text based on completion status -->
                <router-link 
                    v-if="!isFormCompleted(experience._id)"
                    :to="{ name: 'goalSettingForm', params: { id: experience._id } }" 
                    class="text-blue-600 underline hover:text-blue-800"
                >
                    {{ experience.experienceName }}
                </router-link>
                <!-- Render plain text if form is completed -->
                <span v-else class="text-green-800">
                    {{ experience.experienceName }}
                </span>
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
                    v-for="experience in registeredExperiences"
                    :key="experience._id"
                    :value="experience"
                >
                    <v-list-item-title>
                        {{ experience.experienceName }}
                    </v-list-item-title>
                </v-list-item>

                <!-- Display message when the list is empty -->
                <v-list-item v-if="registeredExperiences.length === 0">
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
                  location="bottom"
                  class="custom-tooltip"
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
                  @click="registerExperiences"
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
      registeredExperiences: [],
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
      registrationExists: false,
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
    this.fetchRegisteredExperiences();
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    };
    // Check if the route has a parameter named 'action' with value 'register'
    if (this.$route.params.action === 'register') {
      // Open the 'Add / Remove Experiences' dialog
      this.dialog = true;
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.selectedExperiences = [...this.registeredExperiences]
      }
    }
  },
  computed: {
    hasCompletedEntryForm() {
      const store = useLoggedInUserStore();
      return store.hasCompletedEntryForm;
    },
    goalSettingFormCompletion() {
      const store = useLoggedInUserStore();
      return store.goalSettingFormCompletion;
    },
    areAllGoalsSet() {
      if (!this.goalSettingFormCompletion) {
        // goalSettingFormCompletion is undefined, return false
        return false;
      }
      console.log('this.goalSettingFormCompletion:', this.goalSettingFormCompletion);
      return this.registeredExperiences.every(experience => {
        console.log('experience._id:', experience._id);
        return this.goalSettingFormCompletion[experience._id];
      });
    },

  },
  methods: {
    async fetchExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experiencesWithActivities/';

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.allExperiences = response.data;
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
    async fetchRegisteredExperiences() {
      const token = localStorage.getItem('token');
      const url = import.meta.env.VITE_ROOT_API + '/studentSideData/registeredExperiences';

      try {
        const response = await axios.get(url, { headers: { token } });
        if (response.data && response.data.experienceIDs) {
          // Registration already exists, so a PUT request will be made
          this.registrationExists = true;
          // Map the experienceIDs to the full experience objects
          this.registeredExperiences = response.data.experienceIDs.map(id => this.allExperiences.find(exp => exp._id === id)).filter(exp => exp); // filter out any undefined elements just in case an ID doesn't match ant experience
        } else {
          // Registration doesn't exist, therefore a POST request will be made
          this.registrationExists = false;
          this.registeredExperiences = [];
        }
      } catch (error) {
        console.log('Error fetching registered experiences: ', error);
        this.registeredExperiences = [];
      }
    },
    async registerExperiences() {
      console.log('Before update:', this.goalSettingFormCompletion, this.registeredExperiences);
      // Depending if a registration already exists, use either POST or PUT
      const method = this.registrationExists ? 'put' : 'post';
      // Create an array of experienceIDs from the selected experiences
      const experienceIDs = this.selectedExperiences.map(exp => exp._id);

      // Define the URL for the API endpoint
      const url = import.meta.env.VITE_ROOT_API + '/studentSideData/registerExperiences';

      // Get token from local storage
      const token = localStorage.getItem('token');

      try {
        // Make the POST request to register the experiences
        await axios({
          method,
          url,
          headers: { token },
          data: { experienceIDs },
        });
        this.registrationExists = true;

        // Handle success
        toast.success('Experiences Registered!', {
          position: 'top-right',
          toastClassName: 'Toastify__toast--create'
        });

        // Update the final selected experiences list and close the dialog
        this.registeredExperiences = [...this.selectedExperiences];

        if (this.registeredExperiences.length === 0) {
          this.goalSettingFormCompletion = {};
        }

        // Update session stores
        const user = useLoggedInUserStore()
        await user.checkFormCompletion();

        console.log('After update:', this.goalSettingFormCompletion, this.registeredExperiences);

        // Wait for the next DOM update cycle, then close the dialog
        this.$nextTick(() => {
          this.dialog = false;
        });

      } catch (error) {
        console.error('Error registering experiences: ', error);
        toast.error('Error registering experiences. Please contact an administrator.', {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete'
        });
      }
    },
    isFormCompleted(experienceId) {
      return this.goalSettingFormCompletion && this.goalSettingFormCompletion[experienceId];
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


<style scoped>
.custom-tooltip {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-style: italic;
}
</style>