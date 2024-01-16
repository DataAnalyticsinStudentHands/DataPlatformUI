<template>



      <v-card
          class="mx-auto elevation-12"
          color="#385F73"
          width="100%"
        >
          <v-list>
            <v-list-item>
                <v-list-item-title class="flex-grow-1 text-center">
                  <span class="font-weight-black text-base">My Experiences</span>
                  <v-dialog width="500">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        size="x-small"
                        class="pb-3"
                        variant="text"
                        icon="mdi-help-circle-outline"
                        flat
                        v-bind="props"
                      >
                      </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card title="Registered Experiences">
                        <v-card-text>
                          Experiences are courses, projects, research, and other opportunities for growth. Select the Experiences you are a part of!
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn
                            text="Close"
                            @click="isActive.value = false"
                          ></v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-list-item-title>

                <!-- Iterate over each session -->
                <div v-for="(session, sessionId) in sessionGroupedExperiences" :key="sessionId">
                  <v-list-item class="grey lighten-1">
                    <v-list-item-title class="flex-grow-1 text-center">
                      <span class="font-weight-black text-base">{{ session.sessionName }}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Iterate over experiences in the session -->
                  <v-list-item
                      v-for="experience in session.experiences"
                      :key="experience._id"
                  >
                      <v-list-item-title>
                          {{ experience.experienceName }}
                      </v-list-item-title>
                  </v-list-item>

                  <!-- Display message when there are no experiences in the session -->
                  <v-list-item v-if="session.experiences.length === 0">
                      <v-list-item-title>(No Registered Experiences)</v-list-item-title>
                  </v-list-item>
                </div>



            </v-list-item>





          <!-- Add Experiences Button -->
        <v-list-item>
          <v-row class="justify-center">
            <v-col cols="auto">

              <v-tooltip
                  ref="expTooltip"
                  v-model="shouldShowTooltip"
                  :location="($vuetify.display.xs || $vuetify.display.sm) ? 'bottom' : 'left'"
                  class="custom-tooltip"
              >
                  <template v-slot:activator="{ props }">
                      <v-btn
                          color="grey-lighten-2"
                          v-bind="props"
                          @click="openDialog"
                      >
                          Add / Remove Experiences
                      </v-btn>
                  </template>
                  <span>Register Here!</span>
              </v-tooltip>

              <v-dialog
                v-model="dialog"
                persistent
                max-width="100%"
                scrim="rgba(0, 0, 0, 0.7)"
              >
                <v-card>
                  <v-card-title>
                    <span class="font-weight-black text-xl">Add / Remove Experiences - {{ semesterName }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>

                      <!-- All Experiences Column -->
                      <v-col cols="12" md="5">
                        <v-list density="compact">
                          <!-- Iterate over each session and its experiences -->
                          <template v-for="session in availableExperiencesForRegistration" :key="session.session.id">
                            <v-list-item-subtitle>{{ session.session.name }}</v-list-item-subtitle>
                            <v-list-item
                                v-for="experience in session.availableExperiences"
                                :key="experience._id"
                                @click="isSelected(experience) ? null : toggleExperienceSelection(experience)"
                                :class="isSelected(experience) ? 'selected-experience light-green-bg' : isSelectedForAddition(experience) ? 'light-red-bg' : ''"
                            >
                                <v-row class="justify-center" no-gutters>
                                    <v-col class="text-truncate">
                                        <v-list-item-title>{{ experience.experienceName }}</v-list-item-title>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-icon v-if="isSelected(experience)">mdi-check</v-icon>
                                    </v-col>
                                </v-row>
                            </v-list-item>
                        </template>
                        </v-list>
                      </v-col>


                      <!-- Action Buttons Column -->
                      <v-col cols="12" md="2" class="text-center d-flex align-center justify-center">
                        <div>
                          <v-row class="mb-2">
                            <v-btn @click="addSelectedToMyExperiences">
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                          </v-row>
                          <v-row>
                            <v-btn @click="removeMarkedFromSelected">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                          </v-row>
                        </div>
                      </v-col>

                      <!-- My Experiences Column -->
                      <v-col cols="12" md="5">
                        <v-list density="compact">
                          <v-list-subheader>My Experiences</v-list-subheader>
                          <v-list-item
                                v-for="experience in selectedExperiences"
                                :key="experience._id"
                                @click="toggleRemovalSelection(experience)"
                                :class="isMarkedForRemoval(experience) ? 'light-red-bg' : ''"
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

        <!-- {{ registeredExperiences }} -->

</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
    name: "StudentExperienceRegistration",
    data() {
        return {
            allExperiences: [], // Will contain all experiences from API
            selectedExperiences: [], // Currently selected experience from "allExperiences"
            unselectedExperience: null, // Currently selected experience from "selectedExperiences"
            dialog: false,
            selectedListItem: null, 
            shouldShowTooltip: false,
            availableExperiencesForRegistration: [],
            selectedExperienceIDs: [],
            markedForRemovalIDs: [],
        }
    },
    watch: {
        // dialog(newVal) {
        //     if (newVal) {
        //         const store = useLoggedInUserStore();
        //         // Directly use the registered experiences from the store
        //         this.selectedExperiences = [...store.registeredExperiences];
        //     }
        // }
    },
    computed: {
        // Access registeredExperiences from the store
        registeredExperiences() {
          const store = useLoggedInUserStore();
          return store.registeredExperiences;
        },

        // Group registered experiences by their sessions
        sessionGroupedExperiences() {
          const grouped = {};

          this.registeredExperiences.forEach(exp => {
            const sessionID = exp.session.id;
            if (!grouped[sessionID]) {
              grouped[sessionID] = {
                sessionName: exp.session.name,
                sessionPeriod: exp.session.sessionPeriod,
                experiences: []
              };
            }
            grouped[sessionID].experiences.push({
              _id: exp._id,
              experienceName: exp.experienceInstance.name,
              // Include any other necessary experience properties here
            });
          });

          return grouped;
        },

        semesterName() {
            const store = useLoggedInUserStore();
            return store.semesterName;
        },
    },
    methods: {
      toggleExperienceSelection(experience) {
          const index = this.selectedExperienceIDs.indexOf(experience._id);
          if (index === -1) {
              this.selectedExperienceIDs.push(experience._id);
          } else {
              this.selectedExperienceIDs.splice(index, 1);
          }
      },
      isSelectedForAddition(experience) {
          return this.selectedExperienceIDs.includes(experience._id) && !this.isSelected(experience);
      },
        removeFromMyExperiences(experience) {
            const index = this.selectedExperiences.findIndex(exp => exp._id === experience._id);
            if (index !== -1) {
                this.selectedExperiences.splice(index, 1);
            }
        },
        addSelectedToMyExperiences() {
            this.selectedExperienceIDs.forEach(selectedID => {
                this.availableExperiencesForRegistration.forEach(session => {
                    const experience = session.availableExperiences.find(exp => exp._id === selectedID);
                    if (experience && !this.isSelected(experience)) {
                        this.selectedExperiences.push({
                            _id: experience._id,
                            experienceName: experience.experienceName,
                        });
                    }
                });
            });
            // Clear the selectedExperienceIDs after adding them to selectedExperiences
            this.selectedExperienceIDs = [];
        },
        toggleRemovalSelection(experience) {
            const index = this.markedForRemovalIDs.indexOf(experience._id);
            if (index === -1) {
                this.markedForRemovalIDs.push(experience._id);
            } else {
                this.markedForRemovalIDs.splice(index, 1);
            }
        },
        isMarkedForRemoval(experience) {
            return this.markedForRemovalIDs.includes(experience._id);
        },
        removeMarkedFromSelected() {
            this.markedForRemovalIDs.forEach(removalID => {
                const index = this.selectedExperiences.findIndex(exp => exp._id === removalID);
                if (index !== -1) {
                    this.selectedExperiences.splice(index, 1);
                }
            });
            this.markedForRemovalIDs = [];
        },
        clearSelectedExperiences() {
            // Clear the selections without affecting the registered experiences
            this.selectedExperienceIDs = [];
            this.markedForRemovalIDs = [];
            
            // Close the dialog
            this.dialog = false;
        },

        isSelected(experience) {
            // Check if the experience is already selected based on its ID
            return this.selectedExperiences.some(selectedExp => selectedExp._id === experience._id);
        },
        saveExperiences() {
          const store = useLoggedInUserStore();
          store.updateRegisteredExperiences(this.selectedExperiences);
          this.clearSelectedExperiences(); // Clear selections and Close the dialog
        },
        async fetchAvailableExperiencesForRegistration() {
          const user = useLoggedInUserStore();
          const token = user.token;
          let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experience-instances/available-for-registration';

          try {
            const response = await axios.get(apiURL, { headers: { token } });
            if (response.data && response.data.length > 0) {
              // Sort sessions by name
              response.data.sort((a, b) => a.session.name.localeCompare(b.session.name));

              // Sort experiences within each session
              response.data.forEach(session => {
                session.availableExperiences.sort((a, b) => a.experienceName.localeCompare(b.experienceName));
              });
            }
            
            this.availableExperiencesForRegistration = response.data;
            console.log('availableExperiencesForRegistration: ', this.availableExperiencesForRegistration);
          } catch (error) {
            this.handleError(error);
          }
        },
        openDialog() {
          this.fetchAvailableExperiencesForRegistration().then(() => {
            const store = useLoggedInUserStore();
            const newSelectedExperiences = [];

            // Update newSelectedExperiences based on registeredExperiences
            store.registeredExperiences.forEach(registeredExp => {
              this.availableExperiencesForRegistration.forEach(session => {
                session.availableExperiences.forEach(availableExp => {
                  if (availableExp._id === registeredExp.experienceInstance.id) {
                    console.log('Match found');
                    newSelectedExperiences.push({
                      _id: availableExp._id,
                      experienceName: availableExp.experienceName,
                    });
                  }
                });
              });
            });

            // Update selectedExperiences with new array to trigger reactivity
            this.selectedExperiences = [...newSelectedExperiences];
          });

          this.dialog = true;
        },
    }
}
</script>


<style scoped>
.custom-tooltip {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-style: italic;
}

.selected-experience {
    cursor: default; /* Change cursor to indicate non-selectability */
}

</style>