<template>



<v-card
          class="mx-auto elevation-12"
          color="#385F73"
          width="100%"
        >
          <v-list>
            <v-list-item class="grey lighten-1">
              <v-list-item-title class="flex-grow-1 text-center">
                <span class="font-weight-black text-base">{{semesterName}}</span>
              </v-list-item-title>
            </v-list-item>


            <v-list-item>
                <v-list-item-title class="flex-grow-1 text-center">
                  <span class="font-weight-black text-base">Experiences</span>
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
                  ref="expTooltip"
                  v-model="shouldShowTooltip"
                  :location="($vuetify.display.xs || $vuetify.display.sm) ? 'bottom' : 'left'"
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
                          <v-list-subheader>All Experiences</v-list-subheader>
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

                      <!-- Action Buttons Column -->
                      <v-col cols="12" md="2" class="text-center d-flex align-center justify-center">
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

                      <!-- My Experiences Column -->
                      <v-col cols="12" md="5">
                        <v-list density="compact">
                          <v-list-subheader>My Experiences</v-list-subheader>
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

</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
    name: "StudentExperienceRegistration",
    data() {
        return {
            allExperiences: [], // Will contain all experiences from API
            selectedExperiences: [], // Experiences selected by the student
            selectedExperience: null, // Currently selected experience from "allExperiences"
            unselectedExperience: null, // Currently selected experience from "selectedExperiences"
            dialog: false,
            selectedListItem: null, 
            shouldShowTooltip: false,
        }
    },
    watch: {
        dialog(newVal) {
            if (newVal) {
                const store = useLoggedInUserStore();
                // Directly use the registered experiences from the store
                this.selectedExperiences = [...store.registeredExperiences];
            }
        }
    },
    async mounted() {
      this.fetchExperiences();
    },
    computed: {
        // Access registeredExperiences from the store
        registeredExperiences() {
          const store = useLoggedInUserStore();
          return store.registeredExperiences;
        },
        semesterName() {
            const store = useLoggedInUserStore();
            return store.semesterName;
        },
    },
    methods: {
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
            // Check if the experience is already selected based on its ID
            return this.selectedExperiences.some(selectedExp => selectedExp._id === experience._id);
        },
        async fetchExperiences() {
          const user = useLoggedInUserStore();
          let token = user.token;
          let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experiencesWithActivities/';

          try {
            const response = await axios.get(apiURL, { headers: { token } });
            this.allExperiences = response.data;
          } catch (error) {
            this.handleError(error);
          }
        },
        async registerExperiences() {
          const store = useLoggedInUserStore();
          // Map selected experiences to their IDs before sending
          const experienceIDs = this.selectedExperiences.map(exp => exp._id);

          await store.registerExperiences(experienceIDs);

          // Close the dialog after registration
          this.dialog = false;
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
</style>