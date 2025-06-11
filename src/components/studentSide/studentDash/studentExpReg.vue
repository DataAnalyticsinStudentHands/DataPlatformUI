<!--
src/components/studentSide/studentDash/studentExpReg.vue
Student experience registration component that allows students to view, add, and remove experiences.
Handles experience selection, registration codes, and session-based grouping of experiences.
-->

<template>
  <!-- Main experience registration card -->
  <v-card
      class="mx-auto elevation-12"
      color="#385F73"
      width="100%"
    >
      <v-list>
        <v-list-item>
            <!-- Header with help dialog -->
            <v-list-item-title class="flex-grow-1 text-center">
              <span class="font-weight-black text-base">{{$t('My Experiences')}}</span>
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
                  <v-card :title="$t('Registered Experiences')">
                    <v-card-text>
                      {{$t('Experiences are courses, projects, research, and other opportunities for growth. Select the Experiences you are a part of!')}}
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        :text="$t('Close')"
                        @click="isActive.value = false"
                      ></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-list-item-title>

            <!-- Display experiences grouped by session -->
            <div v-for="(session, sessionId) in sessionGroupedExperiences" :key="sessionId">
              <v-list-item class="grey lighten-1">
                <v-list-item-title class="flex-grow-1 text-center">
                  <span class="font-weight-black text-base">{{ session.sessionName }}</span>
                </v-list-item-title>
              </v-list-item>

              <!-- Individual experiences within the session -->
              <v-list-item
                  v-for="experience in session.experiences"
                  :key="experience._id"
              >
                  <v-list-item-title>
                      {{ experience.experienceName }}
                  </v-list-item-title>
              </v-list-item>

              <!-- Empty state message -->
              <v-list-item v-if="session.experiences.length === 0">
                  <v-list-item-title>(No Registered Experiences)</v-list-item-title>
              </v-list-item>
            </div>

        </v-list-item>

        <!-- Add/Remove experiences button with tooltip -->
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
                          {{$t('Add / Remove Experiences')}}
                      </v-btn>
                  </template>
                  <span>{{$t('Register Here!')}}</span>
              </v-tooltip>

              <!-- Main experience selection dialog -->
              <v-dialog
                v-model="dialog"
                persistent
                max-width="100%"
                scrim="rgba(0, 0, 0, 0.7)"
              >
                <v-card>
                  <v-card-title>
                    <span class="font-weight-black text-xl">{{$t('Add / Remove Experiences')}} - {{ semesterName }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>

                      <!-- Available experiences column -->
                      <v-col cols="12" md="5">
                        <v-list density="compact">
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

                      <!-- Action buttons column -->
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

                      <!-- Selected experiences column -->
                      <v-col cols="12" md="5">
                        <v-list density="compact">
                          <v-list-subheader>{{$t('My Experiences')}}</v-list-subheader>
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
                      {{$t('Close')}}
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="saveExperiences"
                    >
                      {{$t('Save')}}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

        </v-col>
      </v-row>
    </v-list-item>

        </v-list>
        </v-card>

<!-- Registration code input dialog -->
<v-dialog v-model="registrationDialog" max-width="400px">
  <v-card>
    <v-card-title nowrap>Enter Registration Code</v-card-title>
    <v-card-text>{{ currentExperienceName }}</v-card-text>
    <v-card-text>
      <v-text-field
        v-model="enteredRegistrationCode"
        label="Registration Code"
        required
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="closeRegistrationDialog">Cancel</v-btn>
      <v-btn color="blue darken-1" text @click="confirmRegistrationCode">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { toast } from 'vue3-toastify';

export default {
    name: "StudentExperienceRegistration",
    data() {
        return {
            allExperiences: [],
            selectedExperiences: [],
            unselectedExperience: null,
            dialog: false,
            selectedListItem: null, 
            shouldShowTooltip: false,
            availableExperiencesForRegistration: [],
            selectedExperienceIDs: [],
            markedForRemovalIDs: [],
            registrationDialog: false,
            enteredRegistrationCode: '',
            currentExperience: null,
            currentExperienceName: '',
            experiencesToProcess: [],
        }
    },
    computed: {
        // Store data access
        registeredExperiences() {
          const store = useLoggedInUserStore();
          return store.registeredExperiences;
        },
        semesterName() {
            const store = useLoggedInUserStore();
            return store.semesterName;
        },

        // Group registered experiences by their sessions for display
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
            });
          });

          return grouped;
        },
    },
    methods: {
      // Experience selection management
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
      isSelected(experience) {
          return this.selectedExperiences.some(selectedExp => selectedExp._id === experience._id);
      },

      // Experience addition and processing
      addSelectedToMyExperiences() {
        this.experiencesToProcess = [];
        this.selectedExperienceIDs.forEach(selectedID => {
          this.availableExperiencesForRegistration.forEach(session => {
            const experience = session.availableExperiences.find(exp => exp._id === selectedID);
            if (experience && !this.isSelected(experience)) {
              if (experience.registrationCode) {
                this.experiencesToProcess.push(experience);
              } else {
                this.addExperienceToSelected(experience);
              }
            }
          });
        });
        this.selectedExperienceIDs = [];
        this.processNextExperience();
      },
      processNextExperience() {
        if (this.experiencesToProcess.length > 0) {
          this.currentExperience = this.experiencesToProcess.shift();
          this.currentExperienceName = this.currentExperience.experienceName;
          this.registrationDialog = true;
        }
      },
      addExperienceToSelected(experience) {
        this.selectedExperiences.push({
          _id: experience._id,
          experienceName: experience.experienceName,
        });
      },

      // Registration code handling
      closeRegistrationDialog() {
        this.registrationDialog = false;
        this.enteredRegistrationCode = '';
        this.currentExperience = null;
        this.currentExperienceName = '';
        this.experiencesToProcess = [];
      },
      confirmRegistrationCode() {
        if (this.currentExperience && this.currentExperience.registrationCode === this.enteredRegistrationCode) {
          this.addExperienceToSelected(this.currentExperience);
          this.enteredRegistrationCode = '';
          this.currentExperience = null;
          this.registrationDialog = false;
          this.processNextExperience();
        } else {
          toast.error(this.$t("Oops! Wrong Registration Code Provided. Please try again."), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              multiple: false
          });
        }
      },

      // Experience removal management
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

      // Dialog and data management
      clearSelectedExperiences() {
          this.selectedExperienceIDs = [];
          this.markedForRemovalIDs = [];
          this.dialog = false;
      },
      saveExperiences() {
        const store = useLoggedInUserStore();
        store.updateRegisteredExperiences(this.selectedExperiences);
        this.clearSelectedExperiences();
      },

      // API and initialization
      async fetchAvailableExperiencesForRegistration() {
        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experience-instances/available-for-registration';

        try {
          const response = await axios.get(apiURL, { headers: { token } });
          if (response.data && response.data.length > 0) {
            response.data.sort((a, b) => a.session.name.localeCompare(b.session.name));

            response.data.forEach(session => {
              session.availableExperiences.sort((a, b) => a.experienceName.localeCompare(b.experienceName));
            });
          }    
          
          this.availableExperiencesForRegistration = response.data;
        } catch (error) {
          this.handleError(error);
        }
      },
      openDialog() {
        this.fetchAvailableExperiencesForRegistration().then(() => {
          const store = useLoggedInUserStore();
          const newSelectedExperiences = [];

          store.registeredExperiences.forEach(registeredExp => {
            this.availableExperiencesForRegistration.forEach(session => {
              session.availableExperiences.forEach(availableExp => {
                if (availableExp._id === registeredExp.experienceInstance.id) {
                  newSelectedExperiences.push({
                    _id: availableExp._id,
                    experienceName: availableExp.experienceName,
                  });
                }
              });
            });
          });

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
    cursor: default;
}
</style>