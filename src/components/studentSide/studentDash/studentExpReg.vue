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
                      {{ formatExperienceDisplay(experience.experienceName, experience.instructor) }}
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
                class="experiences-dialog"
                scrim="rgba(0, 0, 0, 0.7)"
              >
                <v-card class="d-flex flex-column">
                  <v-card-title
                    class="d-flex align-center px-4"
                    style="position: relative; padding: 20px 16px 12px;"
                  >
                    <span
                      class="dialog-title text-black"
                    >
                      {{ $t('Add / Remove Experiences') }}  {{ semesterName }}
                    </span>

                  <v-btn
                    icon
                    class="close-btn" 
                    small 
                    aria-label="Close dialog"
                    @click="clearSelectedExperiences"
                  >
                    <v-icon size="20">mdi-close</v-icon>
                  </v-btn>
                  </v-card-title>

                 <v-divider class="mx-4" style="border-top: 2px solid black;" />

                  <v-card-text class="d-flex flex-column flex-grow-1 px-4">
                  <div
                    v-if="showTip"
                    class="inline-tip"
                  >
                    {{ $t("Tip: Click an experience, then press Add or Remove.") }}
                  </div>
                    <v-row class="align-stretch flex-grow-1">

                      <!-- Available experiences column -->
                      <v-col cols="12" md="6" class="pr-4 d-flex flex-column">                       
                        <v-list density="compact" class="flex-grow-1 overflow-auto body-text">
                          <v-list-subheader class="pane-title text-black">
                            {{ $t('Available Experiences') }}
                          </v-list-subheader>

                          <template v-for="session in filteredAvailableSessions" :key="session.session.id">

                            <v-card variant="outlined" rounded class="mb-4 pa-3 session-card">
                            <div class="subgroup-header body-text">
                              {{ session.session.name }}
                            </div>

                            <v-list-item
                                dense
                                class="align-center"
                                v-for="experience in session.availableExperiences"
                                :key="experience._id"
                                @click="toggleExperienceSelection(experience)"
                                :class="{
                                  'selection-add': isSelectedForAddition(experience),
                                  'selection-highlight': isSelected(experience)
                                }"
                            >
                            <v-list-item-title class="body-text">
                              {{ formatExperienceDisplay(experience.experienceName, experience.instructor) }}
                            </v-list-item-title>

                            <template #append>
                              <v-icon
                                v-if="isSelected(experience)"
                                size="16"
                              >
                                mdi-check
                              </v-icon>
                            </template>
                          </v-list-item>
                        </v-card>
                        </template>
                        </v-list>
                        
                        <v-btn
                            color="primary lighten-2"
                            dark
                            class="mt-4 mx-auto"
                            style="opacity: .85;"
                            :disabled="!selectedExperienceIDs.length"
                            @click="addSelectedToMyExperiences"
                          >
                            {{ $t('Add to My Experiences') }}
                        </v-btn>
                    </v-col>

                      <!-- My experiences column -->
                      <v-col cols="12" md="6" class="pl-4 d-flex flex-column">
                        <v-list density="compact" class="flex-grow-1 overflow-auto body-text">
                          <v-list-subheader class="pane-title text-black">
                            {{ $t('My Experiences') }}
                          </v-list-subheader>

                          <template
                            v-for="(grp, sessionId) in groupedSelectedExperiences"
                            :key="sessionId"
                          >
                          <v-card variant="outlined" rounded class="mb-4 pa-3 session-card">
                            <div class="subgroup-header body-text">
                              {{ grp.sessionName }}
                            </div>
                            <v-list-item
                              v-for="exp in grp.experiences"
                              :key="exp._id"
                              @click="toggleRemovalSelection(exp)"
                              :class="{ 'selection-remove': isMarkedForRemoval(exp) }"
                            >
                                  <v-list-item-title class="body-text">
                                    {{ formatExperienceDisplay(exp.experienceName, exp.instructor) }}
                                  </v-list-item-title>
                            </v-list-item>
                          </v-card>
                          </template>
                        </v-list>
                        
                        <v-btn
                          color="secondary"
                          outlined
                          class="mt-4 mx-auto"
                          :disabled="!markedForRemovalIDs.length"
                          @click="removeMarkedFromSelected"
                        >
                          {{ $t('Remove from My Experiences') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-card-actions  class="justify-end px-4 pb-4">
                    <v-btn
                      text
                      class="grey darken-1"
                      @click="clearSelectedExperiences"
                    >
                      {{ $t('Cancel') }}
                    </v-btn>

                    <v-btn
                      variant="elevated"
                      color="error"
                      dark
                      class="ml-4  btn-save"
                      @click="saveExperiences"
                    >
                      {{ $t('Save') }}
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
    <v-card-text>{{ formatExperienceDisplay(currentExperienceName, currentExperienceInstructor) }}</v-card-text>
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
            currentExperienceInstructor: '',
            experiencesToProcess: [],
            showTip: false,
        }
    },
    computed: {
        // Group the experiences selected by user
        groupedSelectedExperiences() {
          const grouped = {};
          this.selectedExperiences.forEach(exp => {
            const sid = exp.session.id;
            if (!grouped[sid]) {
              grouped[sid] = {
                sessionName: exp.session.name,
                experiences: []
              };
            }
            grouped[sid].experiences.push(exp);
          });
          return grouped;
        },

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
              instructor: exp.experienceInstance.instructor || null,
            });
          });

          return grouped;
        },
        
        // Filters out any available experience whose _id appears in selectedExperiences
        filteredAvailableSessions() {
          return this.availableExperiencesForRegistration
            .map(session => {
              const kept = session.availableExperiences.filter(
                available_exp => !this.selectedExperiences.some(selected_exp => selected_exp._id === available_exp._id)
              )
              return { session: session.session, availableExperiences: kept }
            })
            .filter(s => s.availableExperiences.length > 0)
        }
    },
    methods: {
      /**
       * Formats experience name with optional instructor
       * @param {string} experienceName - The name of the experience
       * @param {string|null} instructor - Optional instructor name
       * @returns {string} Formatted display string
       */
      formatExperienceDisplay(experienceName, instructor) {
        if (instructor) {
          return `${experienceName} - ${instructor}`;
        }
        return experienceName;
      },

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
                this.experiencesToProcess.push({
                  ...experience,
                  session: session.session
                });
              } else {
                this.addExperienceToSelected(experience, session.session);
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
          this.currentExperienceInstructor = this.currentExperience.instructor || '';
          this.registrationDialog = true;
        }
      },
      addExperienceToSelected(experience, session) {
        this.selectedExperiences.push({
          _id: experience._id,
          experienceName: experience.experienceName,
          instructor: experience.instructor || null,
          session: { ...session }
        });
      },

      // Registration code handling
      closeRegistrationDialog() {
        this.registrationDialog = false;
        this.enteredRegistrationCode = '';
        this.currentExperience = null;
        this.currentExperienceName = '';
        this.currentExperienceInstructor = '';
        this.experiencesToProcess = [];
      },
      confirmRegistrationCode() {
        if (this.currentExperience && this.currentExperience.registrationCode === this.enteredRegistrationCode) {
          this.addExperienceToSelected(this.currentExperience, this.currentExperience.session);
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
              session.availableExperiences.sort((a, b) => {
                // Sort by experience name first, then by instructor if names are equal
                const nameCompare = a.experienceName.localeCompare(b.experienceName);
                if (nameCompare !== 0) return nameCompare;
                // If names are equal, sort by instructor (null/undefined comes first)
                if (!a.instructor && !b.instructor) return 0;
                if (!a.instructor) return -1;
                if (!b.instructor) return 1;
                return a.instructor.localeCompare(b.instructor);
              });
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
                    instructor: availableExp.instructor || null,
                    session: session.session,
                  });
                }
              });
            });
          });

          this.selectedExperiences = [...newSelectedExperiences];
        });

        this.dialog = true;
        this.$nextTick(() => {
          this.showTip = true;
          setTimeout(() => { this.showTip = false }, 3000);
        });
      },
    }
}
</script>

<style scoped>
.inline-tip {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
  transition: opacity 0.3s ease;
}

.dialog-title {
  font-variant: small-caps;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 19px;      
  letter-spacing: 0.5px;
}

.pane-title {
  font-variant: small-caps;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.close-btn {
  position: absolute;
  top: 12px;     
  right: 12px;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.custom-tooltip {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-style: italic;
}

.selected-experience {
    cursor: default;
}

.subgroup-header {
  background-color: #F5F5F5;       
  border-bottom: 1px solid #E0E0E0;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.body-text {
  font-family: 'Roboto','Inter', system-ui, sans-serif;
  font-size: 14px;         
  font-weight: 400;        
  line-height: 1.5;        
}

.selection-add {
  background-color: rgba(33, 150, 243, 0.2);
  border: 1px solid #2196F3;
  border-radius: 4px;
}

.selection-highlight {
  background-color: rgba(33, 150, 243, 0.1);
  border: 1px solid #2196F3;
  border-radius: 4px;
}

.selection-remove {
  background-color: rgba(158, 158, 158, 0.2);
  border: 1px solid #9E9E9E;
  border-radius: 4px;
}

.btn-primary {
  min-height: 40px;         
  padding: 0 16px;          
  border-radius: 6px;       
  color: #FFF;              
}

.btn-secondary {
  height: 40px;
  padding: 0 16px;
  border-radius: 6px;
  color: #424242;           
}

.btn-save {
  background-color: #C8102E !important;
  color: #FFFFFF !important;
}

.btn-save:hover {
  background-color: #A00B26 !important;
}

.callout-text {
  font-style: italic;
  color: rgba(0, 0, 0, 0.6);
}

.session-card {
  border-color: rgba(0, 0, 0, 0.12) !important;
  display: block;
  width: 100%;
  margin-bottom: 16px;
}
</style>