<template>
<v-container>
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6 mb-4">
                Assign Experiences to {{ singleSession ? 'Session' : 'Sessions' }}
            </p>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card flat>
                <v-card-title>
                    <v-row class="d-flex justify-start">
                        <v-col md="6">
                            <v-text-field
                                v-model="experienceSearch"
                                density="comfortable"
                                :label="searchLabel"
                                flat
                                hide-details
                                variant="solo-filled"
                                @keyup.enter="addSearchChip"
                            >

                                <!-- Prepend Icon with Menu -->
                                <template v-slot:prepend-inner>
                                    <v-menu
                                        location="bottom"
                                    >
                                        <template v-slot:activator="{ props }">
                                            <div
                                                v-bind="props"
                                                class="pointer-cursor"
                                                @click.stop
                                            >
                                                <v-icon>mdi-magnify</v-icon>
                                                <v-icon>mdi-chevron-down</v-icon>
                                            </div>
                                        </template>
                                        <v-list>
                                            <v-list-item
                                                v-for="item in searchMenuItems"
                                                :key="item"
                                                @click="updateSearchCriteria(item)"
                                            >
                                                <v-list-item-title>{{ item }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>
                                <template v-slot:append-inner>
                                    <div class="pointer-cursor mr-3" @click="addSearchChip">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </div>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- Choose Session button -->
                        <v-col cols="3" class="align-self-center">
                            <v-menu
                                v-model="showChooseSessionMenu" 
                                offset-y
                                :disabled="singleSession"
                            >
                                <template v-slot:activator="{ props }">
                                    <v-btn 
                                        v-bind="props"
                                    >
                                        {{ singleSession ? selectedSessions[0].sessionName : selectedSessionName}}
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item
                                        v-for="session in selectedSessions"
                                        :key="session._id"
                                        @click="chooseSession(session)"
                                    >
                                        <v-list-item-title>{{ session.sessionName }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-col>
                        <!-- Add To Session button -->
                        <v-col cols="3" class="text-end align-self-center">
                            <v-btn 
                                :disabled="isAddToSessionDisabled"
                                @click="handleAddToSession"
                            >Add to Session</v-btn>
                        </v-col>
                    </v-row>

                    <!-- Chips Row -->
                    <v-row v-if="showChipsRow" dense>
                        <v-col>
                            <!-- Search Chips -->
                            <v-chip-group
                                v-if="searchCriteria.length"
                                v-model="selectedSearchChips"
                                column
                                multiple
                            >
                                <v-chip
                                    v-for="(criteria, index) in searchCriteria"
                                    :key="index"
                                    @click="selectSearchChip(index)"
                                    filter
                                    variant="outlined"
                                    class="ma-2"
                                >
                                    {{ criteria.category + '="' + criteria.term + '"' }}
                                    <v-icon
                                        end
                                        @click.stop="removeSearchChip(index)"
                                    >mdi-close</v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-col>
                    </v-row>
                </v-card-title>

                <v-data-table
                      :headers="experienceHeaders"
                      :items="filteredExperienceData"
                      item-key="_id"
                      item-value="_id"
                      show-select
                      v-model="selectedExperiences"
                      disabled
                  >
                      <!-- Slot for Edit Column -->
                      <template v-slot:item.edit="{ item }">
                          <v-btn
                              @click="editExperience(item)"
                              icon="mdi-pencil"
                              variant="text" 
                              size="small"
                          ></v-btn>
                      </template>

                      <!-- Slot for Activities Column -->
                      <!-- <template v-slot:item.activities="{ item }">
                          <div>{{ item.activitiesCount }}</div>
                      </template> -->
                  </v-data-table>
            </v-card>
            <v-divider :thickness="4" class="my-divider"></v-divider>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6 mb-4">
                {{ singleSession ? 'Session' : 'Sessions' }}
            </p>
        </v-col>
    </v-row>
    <v-row v-for="session in selectedSessions" :key="session._id">
      <!-- Column for Full-width Card -->
      <v-col cols="12">
        <v-card flat>
          <v-row>
            <!-- Column for Session Information -->
            <v-col cols="4">
              <v-card-title>{{ session.sessionName }}</v-card-title>
              <v-card-text>
                Start Date: {{ new Date(session.sessionPeriod.startDate).toLocaleDateString() }}
                <br>
                End Date: {{ new Date(session.sessionPeriod.endDate).toLocaleDateString() }}
              </v-card-text>
            </v-col>
            <!-- Column for Experience Chips -->
            <v-col cols="8" class="mt-2">
                <div v-if="session.experienceIDs && session.experienceIDs.length > 0">
                    <v-chip
                        v-for="experience in mapExperienceData(session.experienceIDs)"
                        :key="experience._id"
                        class="ma-1"
                        color="blue-darken-3"
                    >
                        {{ experience.experienceName }}
                        <v-icon
                            end
                            @click.stop="removeSessionExperienceChip(experience._id, session._id)"
                        >mdi-delete</v-icon>
                    </v-chip>
                </div>
            </v-col>
          </v-row>
          <v-card-actions
            v-if="session.experienceIDs && session.experienceIDs.length > 0"
          >
          <!-- Clear Experiences Button -->
            <v-btn
                color="red darken-1"
                text
                @click="clearSessionExperiences(session._id)"
            >
                Clear Experiences
            </v-btn>
        </v-card-actions>
        </v-card>
        <v-divider :thickness="2" class="my-divider"></v-divider>

      </v-col>
    </v-row>
</v-container>

<!-- Dialog for quick update -->
<v-dialog v-model="showEditDialog" max-width="600px">
    <v-card
        width="600"
    >
        <edit-experience
            :experience="currentExperience"
            :isInDialog="true"
            @update-success="handleUpdateSuccess"
            @close-dialog="closeEditDialog"
        ></edit-experience>
    <br>
    </v-card>
</v-dialog>

<!-- <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
selectedSessionName: {{ selectedSessionName }}
<br>
selectedExperiences: {{ selectedExperiences }}
<br>
selectedSessions: {{ selectedSessions }}
<br><br><br><br><br><br>
experienceData: {{ experienceData }}
selectedSessions: {{ selectedSessions }} -->

</template>
    
<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';
import axios from 'axios';
import EditExperience from '@/components/instructorSide/instructorSpecificExperience.vue';

export default {
    name: 'ChooseExperiences',
    components: {
        EditExperience
    },
    props: {
        
    },
    emits: ['form-valid', 'form-invalid', 'validation-change'],
    data() {
        return {
            experienceData: [],
            searchLabel: 'Search All Text Fields',
            experienceSearch: "",
            searchMenuItems: ['All Text Fields', 'Experience Category', 'Experience Name'],
            searchCriteria: [],
            selectedSearchChips: [],
            experienceHeaders: [
                {
                    title: 'Experience Category',
                    value: 'experienceCategory',
                    align: 'start',
                    sortable: true
                },
                {
                    title: 'Experience Name',
                    value: 'experienceName',
                    align: 'start',
                    sortable: true
                },
                { 
                    title: '', 
                    value: 'edit',
                    align: 'end',
                    sortable: false 
                },
            ],       
            filteredExperienceData: [],     
            selectedExperiences: [],
            showEditDialog: false,
            selectedSessionName: 'Select a Session',
            showChooseSessionMenu: false,
            selectedSessionExperienceIDs: [],
            attemptedNavigation: false,
            
        }
    },
    created() {
        this.fetchExperiences();
    },
    watch: {

        hasValidationErrors(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.$emit('validation-change', { isValid: !newValue });
            }
        },

    },
    computed: {
        showChipsRow() {
            return this.searchCriteria.length > 0
        },

        hasValidationErrors() {
            if (!this.formSubmitted) return false;
                return this.isUhStatusInvalid || this.isEnrolledUHInfoInvalid || this.isHonorsCollegeStatusInvalid || this.isHonorsCollegeAffiliatedInvalid || this.isMajorsInvalid || this.isHonorsMinorsInvalid || this.isServiceStatusInvalid || this.isServiceHistoryDescInvalid;
        },

        selectedSessions() {
            const user = useLoggedInUserStore();
            return user.experienceInstanceCreationDetails;
        },

        isAddToSessionDisabled() {
            // When there is only one session, it should be automatically selected,
            // so the check for 'Select a Session' is unnecessary.
            if (this.singleSession) {
                return this.selectedExperiences.length === 0;
            } else {
                return this.selectedSessionName === 'Select a Session' || this.selectedExperiences.length === 0;
            }
        },

        sessionExperienceChips() {
            const chips = {};
            this.experienceData.forEach(experience => {
                chips[experience._id] = {
                    experienceCategory: experience.experienceCategory,
                    experienceName: experience.experienceName
                };
            });
            console.log("sessionExperienceChips computed:", chips);
            return chips;
        },

        singleSession() {
            return this.selectedSessions.length === 1;
        },
    },
    methods: {
        async fetchExperiences() {
            const user = useLoggedInUserStore();
            // const token = user.token;

            const token = `
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNTI2NzY2OCwiZXhwIjoxNzA1Mjc5NjY4fQ.cAYCcJzzRRimGBOYy3089_aFXf3naZKAvXCvctNukvA
            `

            try {
                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/active`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.experienceData = resp.data.map(item => ({
                    ...item,
                    activitiesCount: item.activities.length
                }));
                this.filteredExperienceData = [...this.experienceData];
            } catch (error) {
                this.handleError(error);
            }
        },

        addSearchChip() {
            if (this.experienceSearch) {
                this.searchCriteria.push({
                    category: this.searchLabel.replace('Search ', ''),
                    term: this.experienceSearch
                });
                // Select the new chip by default
                this.selectedSearchChips.push(this.searchCriteria.length - 1);
                // Clear the input field after adding the chip
                this.experienceSearch = ''; 
                // Call search
                this.performSearch();
            }
        },


        updateSearchCriteria(selectedItem) {
            this.searchLabel = 'Search ' + selectedItem;
        },

        selectSearchChip(index) {
            const selectedIndex = this.selectedSearchChips.indexOf(index);
            if(selectedIndex >= 0) {
                // If the chip is already selected, create a new array without this chip
                this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
            } else {
                // If the chip is not selected, create a new array with this chip added
                this.selectedSearchChips = [...this.selectedSearchChips, index];
            }
            // Call search
            this.performSearch();
        },

        removeSearchChip(index) {
            this.searchCriteria.splice(index, 1);
            // Update selectedSearchChips to reflect the removal
            this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
            // Adjust the indexes of the remaining selected chips
            this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
            // Call search
            this.performSearch();
        },

        performSearch() {
            // Update the selectedSessionExperienceIDs if there is only one session
            if (this.singleSession) {
                this.selectedSessionExperienceIDs = this.selectedSessions[0].experienceIDs || [];
            }

            let sessionFilteredData = this.selectedSessionExperienceIDs.length > 0
                ? this.experienceData.filter(item => !this.selectedSessionExperienceIDs.includes(item._id))
                : [...this.experienceData];

            let searchGroups = {};
            this.selectedSearchChips.forEach(index => {
                let criteria = this.searchCriteria[index];
                if (!searchGroups[criteria.category]) {
                    searchGroups[criteria.category] = [];
                }
                searchGroups[criteria.category].push(criteria.term.toLowerCase());
            });

            this.filteredExperienceData = sessionFilteredData.filter(item => {
                return Object.keys(searchGroups).every(category => {
                    if (category === 'All Text Fields') {
                        return searchGroups[category].every(term =>
                            item.experienceCategory.toLowerCase().includes(term) || item.experienceName.toLowerCase().includes(term)
                        );
                    } else if (category === 'Experience Category') {
                        return searchGroups[category].every(term => 
                            item.experienceCategory.toLowerCase().includes(term)
                        );
                    } else if (category === 'Experience Name') {
                        return searchGroups[category].every(term => 
                            item.experienceName.toLowerCase().includes(term)
                        );
                    }
                    return true;
                });
            });
        },

        editExperience(experience) {
            this.currentExperience = experience;
            this.showEditDialog = true;
        },

        handleUpdateSuccess() {
            this.showEditDialog = false;
            toast.info('Experience Updated!', {
                position: 'top-right',
                toastClassName: 'Toastify__toast--update',
                multiple: false
            })
            // Refetch Experiences
            this.fetchExperiences();
        },

        chooseSession(session) {
            this.selectedSessionName = session.sessionName;
            this.selectedSessionExperienceIDs = session.experienceIDs || [];
            console.log("Session selected:", session);
            this.performSearch();
        },

        handleAddToSession() {
            // Existing code for adding experiences to sessions
            if (this.singleSession) {
                const session = this.selectedSessions[0];
                session.experienceIDs = [...new Set([...session.experienceIDs || [], ...this.selectedExperiences])];
                toast.success(`Experiences added to ${session.sessionName}!`, {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--create'
                });
            } else {
                const sessionIndex = this.selectedSessions.findIndex(session => session.sessionName === this.selectedSessionName);
                if (sessionIndex !== -1) {
                    const existingExperienceIDs = this.selectedSessions[sessionIndex].experienceIDs || [];
                    this.selectedSessions[sessionIndex].experienceIDs = [...new Set([...existingExperienceIDs, ...this.selectedExperiences])];
                    toast.success(`Experiences added to ${this.selectedSessionName}!`, {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--create'
                    });
                }
            }

            // New code for updating sessions with detailed experience data
            this.selectedSessions.forEach(session => {
                if (session.experienceIDs) {
                    session.experiences = session.experienceIDs.map(id => {
                        const experience = this.experienceData.find(exp => exp._id === id);
                        return {
                            id: experience._id,
                            category: experience.experienceCategory,
                            name: experience.experienceName
                        };
                    });
                }
            });

            // Update the Pinia store with the modified sessions
            const userStore = useLoggedInUserStore();
            userStore.updateexperienceInstanceCreationDetails(this.selectedSessions);

            // Rest of the existing code for resetting and checking validation state
            this.updateFilteredData();
            this.selectedExperiences = [];
            this.checkAndUpdateValidationState();
        },


        updateFilteredData() {
            // Update the selectedSessionExperienceIDs based on the updated selectedSessions
            if (this.singleSession) {
                this.selectedSessionExperienceIDs = this.selectedSessions[0].experienceIDs || [];
            } else {
                const selectedSession = this.selectedSessions.find(session => session.sessionName === this.selectedSessionName);
                this.selectedSessionExperienceIDs = selectedSession ? selectedSession.experienceIDs || [] : [];
            }

            this.performSearch();
        },


        resetSessionSelection() {
            // Reset the selected session name and selectedExperiences
            this.selectedSessionName = 'Select a Session';
            this.selectedExperiences = [];
        },


        clearSessionExperiences(sessionID) {
            const sessionIndex = this.selectedSessions.findIndex(session => session._id === sessionID);
            if (sessionIndex !== -1) {
                // Clear the experiences from the session
                this.selectedSessions[sessionIndex].experienceIDs = [];
                toast.info(`Experiences cleared from ${this.selectedSessions[sessionIndex].sessionName}!`, {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--update'
                });

                // Update the filtered data based on the cleared experiences
                this.updateFilteredData();
            }

            // Check and emit validation state after clearing experiences
            this.checkAndUpdateValidationState();
        },




        mapExperienceData(experienceIDs) {
        return experienceIDs.map(id => {
            if (this.sessionExperienceChips[id]) {
            return {
                _id: id,
                ...this.sessionExperienceChips[id]
            };
            }
            return null;
        }).filter(e => e !== null);
        },


        removeSessionExperienceChip(experienceID, sessionID) {
            console.log('removeSessionExperienceChip');
            console.log('experienceID: ', experienceID);
            console.log('sessionID: ', sessionID);
            // Find the session by its ID
            const sessionIndex = this.selectedSessions.findIndex(session => session._id === sessionID);
            if (sessionIndex !== -1) {
                // Remove the experience ID from the session's experienceIDs array
                const experienceIndex = this.selectedSessions[sessionIndex].experienceIDs.indexOf(experienceID);
                if (experienceIndex !== -1) {
                    this.selectedSessions[sessionIndex].experienceIDs.splice(experienceIndex, 1);

                    // Update the selectedSessionExperienceIDs
                    this.selectedSessionExperienceIDs = this.selectedSessions[sessionIndex].experienceIDs || [];

                    // Update the filtered data
                    this.updateFilteredData();
                }
            }

            // Check and emit validation state after clearing experiences
            this.checkAndUpdateValidationState();
        },

        checkAndUpdateValidationState() {
            // Check if each session has at least one experience
            const isEverySessionValid = this.selectedSessions.every(session => 
                session.experienceIDs && session.experienceIDs.length > 0
            );

            // Emit the validation change event
            this.$emit('validation-change', { isValid: isEverySessionValid });
        },

        closeEditDialog() {
            this.showEditDialog = false;
        },

        async handleValidations() {
            console.log('handleValidations called');
            this.formSubmitted = true;

            // Use the same check logic
            this.checkAndUpdateValidationState();

            // Check if each session has at least one experience
            const isEverySessionValid = this.selectedSessions.every(session => 
                session.experienceIDs && session.experienceIDs.length > 0
            );

            if (isEverySessionValid) {
                console.log('form is valid!');
                this.$emit('form-valid');
            } else {
                console.log('form is invalid. Some sessions do not have experiences assigned.');
                this.$emit('form-invalid');
                toast.error(this.$t("Please assign at least one experience to each session."), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
            }
        },

    }
}
</script>
    
<style scoped>

.pointer-cursor {
  cursor: pointer;
}

:deep(.v-text-field input[type="text"]:focus) {
    outline: none !important;
    box-shadow: none !important;
    border: 1px solid transparent !important; /* Update this line if you have a different border style */
    background-color: transparent !important;
}

.my-divider {
    border-color: black !important; /* Ensures overriding of default styles */
}

</style>