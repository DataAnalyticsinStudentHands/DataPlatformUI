<!-- instructorAddExperienceInstance - this view presents a form to create a new Experience Instance -->
<template>
<div>
<v-container>
    <v-form
        ref="form"
        @submit.prevent="handleSubmitForm"
    >
        <v-row>
            <v-col>
                <p class="font-weight-black text-h6">New Experience Instances</p><br>
            </v-col>
        </v-row>

        <v-row>
            <p class="font-weight-black text-h7">Session</p>
        </v-row>

        <v-row>
            <v-col>
                <v-autocomplete
                    :items="sessionData"
                    item-title="sessionName"
                    item-value="_id"
                    label="Please Select a Session"
                    v-model="selectedSession"
                    :rules="sessionRules"
                    return-object
                ></v-autocomplete>
            </v-col>
        </v-row>

        <v-row>
            <p class="font-weight-black text-h7">Experiences</p>
        </v-row>

        <v-row>
            <v-col>
                <v-autocomplete
                    :items="experienceData"
                    item-title="experienceName"
                    item-value="_id"
                    label="Please Select an Experience"
                    v-model="selectedExperiences"
                    :rules="experienceRules"
                    multiple
                    chips
                    return-object
                    clearable
                ></v-autocomplete>
            </v-col>
        </v-row>

        <v-row>
            <p class="font-weight-black text-h7">Activities</p>
        </v-row>
        <v-row>
    <v-col v-if="selectedExperiences && selectedExperiences.length">
        <v-card>
            <v-tabs v-model="activitiesTab">
                <v-tab v-for="experience in selectedExperiences" :key="experience._id" :value="experience._id">
                    {{ experience.experienceName }}
                </v-tab>
            </v-tabs>

            <v-card-text>
                <v-window v-model="activitiesTab">
                    <v-window-item v-for="experience in selectedExperiences" :key="experience._id" :value="experience._id">
                        <v-row>
                            <v-col cols="6">
                                <v-card flat>
                                    <v-card-title>
                                        <v-row>
                                            <v-col>Selected Activities</v-col>
                                        </v-row>
                                    </v-card-title>
                                    <v-list class="scrollable-list">
                                        <v-list-item v-for="activity in selectedActivities" :key="activity._id">
                                            <v-row>
                                                <v-col cols="10">
                                                    {{ activity.activityName }}
                                                </v-col>
                                                <v-col>
                                                    <v-icon @click.stop="removeActivity(activity)">
                                                        mdi-close
                                                    </v-icon>
                                                </v-col>
                                            </v-row>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-col>
                            <v-col>
                                <v-card flat title="Add Activities">
                                    <template v-slot:text>
                                        <v-text-field
                                            v-model="activitySearch"
                                            label="Search"
                                            prepend-inner-icon="mdi-magnify"
                                            single-line
                                            variant="outlined"
                                            hide-details
                                        ></v-text-field>
                                    </template>
                                    <v-data-table
                                        :headers="activityHeaders"
                                        :items="filteredActivityData"
                                        item-value="_id"
                                        items-per-page="-1"
                                        class="scrollable-table"
                                        hover
                                        :search="activitySearch"
                                    >
                                        <template v-slot:body="{ items }">
                                            <template v-for="item in items" :key="item._id">
                                                <tr
                                                    @click="selectActivity(item)"
                                                    @mouseover="hoveredItem = item._id"
                                                    @mouseleave="hoveredItem = null"
                                                    class="pointer-cursor activity-row"
                                                >
                                                    <td>
                                                        <div class="activity-content">
                                                            {{ item.activityName }}
                                                            <v-icon v-if="hoveredItem === item._id">
                                                                mdi-plus
                                                            </v-icon>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </template>
                                        <template v-slot:bottom></template>
                                    </v-data-table>
                                </v-card>
                            </v-col>
                        </v-row>
                        <!-- Add the checkbox and text field for "Include Registration Code" here -->
                        <v-row>
                            <v-col>
                                <v-checkbox
                                    v-model="registrationCodes[experience._id].include"
                                    :label="'Include Registration Code for ' + experience.experienceName"
                                    hide-details
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-row v-if="registrationCodes[experience._id].include">
                            <v-col cols="6">
                                <v-text-field
                                    v-model="registrationCodes[experience._id].code"
                                    label="Enter Registration Code"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-col>
    <v-col v-if="!selectedExperiences || !selectedExperiences.length">
        <p class="font-italic">Please Select an Experience</p>
    </v-col>
</v-row>





        <v-row>
            <p class="font-weight-black text-h7">Exit Form Release Date</p>
        </v-row>
        <!-- Main Row for Experiences and Button -->
        <v-row>
            <!-- Column for the Button -->
            <v-col cols="12" md="4" v-if="selectedExperiences && selectedExperiences.length">
                <v-btn 
                    @click="openDatePicker" 
                    :disabled="isSetDateButtonDisabled"
                >
                    Set Exit Form Release Date
                </v-btn>
            </v-col>

            <v-col cols="12" md="4" v-else>
                <p class="font-italic">Please Select an Experience</p>
            </v-col>



            <!-- Column for Experiences -->
            <v-col cols="12" md="8">
                <!-- Section for selecting experiences to set the release date -->
                <div v-if="selectedExperiences && selectedExperiences.some(e => !e.exitFormReleaseDate)">
                    <p :class="{'error-text': showExitFormError}" class="text-subtitle-2">Select Experiences to Set an Exit Form Release Date</p>
                    <v-chip-group v-model="selectedExperiencesForExitFormReleaseDate" multiple>
                        <v-chip 
                            v-for="experience in selectedExperiences.filter(e => !e.exitFormReleaseDate)"
                            :key="experience._id" 
                            class="ma-1" 
                            color="blue-darken-3"
                            :value="experience._id"
                        >
                            {{ experience.experienceName }}
                        </v-chip>
                    </v-chip-group>
                </div>

                <!-- Display groups of experiences by their set release date -->
                <div v-for="(groupedExperiences, groupDate) in groupedExperiences" :key="groupDate">
                    <p class="text-subtitle-2">Exit Form Release Date: {{ groupDate }}</p>
                    <v-chip 
                        v-for="experience in groupedExperiences"
                        :key="experience._id" 
                        class="ma-1"
                    >
                        {{ experience.experienceName }}
                        <v-icon
                            end
                            size="x-small"
                            @click.stop="removeExitFormReleaseDate(experience._id)"
                        >
                            mdi-close-circle
                        </v-icon>
                    </v-chip>
                </div>
            </v-col>
        </v-row>


        <v-row>
            <v-col>
                <v-btn @click="goBack" style="margin-right: 10px;">
                Cancel
                </v-btn>
                <v-btn style="text-align: center;" type="submit">Submit</v-btn>
            </v-col>
        </v-row>
    </v-form>
</v-container>

<!-- Dialog for Date Picker -->
<v-dialog v-model="showDatePicker" width="auto">
    <v-card>
        <v-card-title class="headline">Pick a Date</v-card-title>
        <v-card-text>
            <v-date-picker v-model="selectedDate" show-adjacent-months></v-date-picker>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showDatePicker = false">Cancel</v-btn>
            <v-btn color="primary" @click="setExitFormReleaseDate">Set</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
<!-- <br><br><br><br>
<br><br><br><br>
selectedExperience:
<br>
{{ selectedExperience }}
<br><br><br><br>
selectedExperiences:
<br>
{{ selectedExperiences }}
<br><br><br><br>
activitiesTab:
<br>
{{ activitiesTab }}
<br><br><br><br>
selectedActivities:
<br>
{{ selectedActivities }}
<br><br><br><br>
activityData:
<br>
{{ activityData }}
<br><br><br><br>
experienceData:
<br>
{{ experienceData }}
<br><br><br><br>
selectedSession:
<br>
{{ selectedSession }} -->
</div>
</template>




    
<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { toast } from 'vue3-toastify';

export default {
    name: 'instructorAddExperenceInstance',

    data() {
        return {
            sessionData: [],
            selectedSession: null,
            experienceData: [],
            originalExperienceData: [],
            selectedExperiences: null,
            registrationStartDate: null,
            registrationEndDate: null,
            exitFormReleaseDate: null,
            sessionRules: [v => !!v || 'Session is required'],
            experienceRules: [
                v => {
                    
                    if (!this.formSubmitted) return true;
                    !!v && v.length > 0 || 'Experience is required'
                }
            ],
            dateRules: [v => !!v || 'Date is required'],
            selectedExperiencesForExitFormReleaseDate: [],
            showDatePicker: false,
            selectedDate: new Date(),
            showExitFormError: false,
            activitiesTab: null,
            activityData: [],
            originalActivityData: [],
            activityHeaders: [
                {
                title: "Activity Name",
                value: "activityName",
                key: "activityName",
                align: "start",
                sortable: true
                }
            ],
            activitySearch: "",
            hoveredItem: null,
            selectedExperience: null,
            registrationCodes: {}
        }
    },

    created() {
        this.fetchActivityData();
        this.fetchActiveSessions().then(() => {
            if (useLoggedInUserStore().navigationData?.id) {
                const matchingSession = this.sessionData.find(session => session._id === useLoggedInUserStore().navigationData?.id);
                if (matchingSession) {
                    this.selectedSession = matchingSession;
                }
            }
        });
    },

    watch: {
        selectedSession(newVal, oldVal) {
            if (newVal && newVal._id) {
                this.selectedExperiences = [];
                this.fetchActiveExperiences(newVal._id);
            } else {
                this.experienceData = [];
            }
        },

        selectedExperiences(newVal) {
            if (newVal && newVal.length > 0) {
                this.activitiesTab = newVal[0]._id;

                // Initialize registrationCodes for new experiences
                newVal.forEach(exp => {
                    if (!this.registrationCodes.hasOwnProperty(exp._id)) {
                        this.registrationCodes = { 
                            ...this.registrationCodes, 
                            [exp._id]: { include: false, code: '' } 
                        };
                    }
                });
            } else if (newVal.length === 0) {
                this.selectedExperience = {};
                this.activitiesTab = null;
            }
        },
        activitiesTab(newVal) {
            // Find the experience that matches the newVal (which is the _id of the experience)
            let matchingExperience = this.selectedExperiences.find(experience => experience._id === newVal);
            if (matchingExperience) {
                this.selectedExperience = matchingExperience;
            } else {
                console.log('no matching experience');
            }
        }
    },    

    computed: {
        groupedExperiences() {
            if (!this.selectedExperiences) {
                return {};
            }

            const grouped = this.selectedExperiences.reduce((acc, exp) => {
                if (exp.exitFormReleaseDate) {
                    const dateStr = new Date(exp.exitFormReleaseDate).toLocaleDateString();
                    if (!acc[dateStr]) {
                        acc[dateStr] = [];
                    }
                    acc[dateStr].push(exp);
                }
                return acc;
            }, {});
            return grouped;
        },

        isSetDateButtonDisabled() {
            const noExperiences = !this.selectedExperiences || this.selectedExperiences.length === 0;
            const allHaveDates = this.selectedExperiences?.every(e => e.exitFormReleaseDate);
            const noneSelected = this.selectedExperiences?.some(e => !e.exitFormReleaseDate) &&
                                this.selectedExperiencesForExitFormReleaseDate.length === 0;


            return noExperiences || allHaveDates || noneSelected;
        },

        selectedActivities() {
            return this.activityData.filter(activity => this.selectedExperience?.activities?.includes(activity._id));
        },

        filteredActivityData() {
            // Get IDs of selected activities
            const selectedActivityIDs = this.selectedActivities.map(activity => activity._id);

            // Filter activityData to exclude activities that are in selectedActivities
            return this.activityData.filter(activity => !selectedActivityIDs.includes(activity._id));
        }
    },

    methods: {

        // Fetches active session data for the instructor from the backend using the stored token, and updates session data state upon successful retrieval.
        async fetchActiveSessions() {
            useLoggedInUserStore().startLoading();
            try {
                const user = useLoggedInUserStore();
                let token = user.token;
                
                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/active`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.sessionData = resp.data;
            } catch (error) {
                this.handleError(error);
            }
        },

        // Retrieves activity data marked as active from the backend using the instructor's stored token and updates the component's activity data state with the results, also keeping an original copy for reference.
        fetchActivityData() {
            const user = useLoggedInUserStore();
            let token = user.token;

            let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
            axios
                .get(apiURL, { headers: { token } })
                .then((resp) => {
                const activities = resp.data;
                this.activityData = activities.filter((activity) => activity.activityStatus === true);
                this.originalActivityData = [...this.activityData];
                })
                .catch((error) => {
                    this.handleError(error);
                });
        },

        
        // Fetches available experiences for a given session ID from the backend using the instructor's stored token, updates experience data state with the response, and keeps an original copy for reference.
        async fetchActiveExperiences(sessionID) {
            useLoggedInUserStore().startLoading();
            try {
                const user = useLoggedInUserStore();
                let token = user.token;

                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/available-experiences-for-instance?sessionID=${sessionID}`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.experienceData = resp.data;
                this.originalExperienceData = [...this.experienceData];
            } catch (error) {
                this.handleError(error);
            } finally {
                useLoggedInUserStore().stopLoading();
            }
        },

        // Opens the date picker dialog
        openDatePicker() {
            this.showDatePicker = true;
        },

        // Sets the exit form release date for selected experiences based on a chosen date, removes those experiences from the selection for setting release dates, and resets the date picker state.
        setExitFormReleaseDate() {
            if (this.selectedDate) {
                this.selectedExperiences.forEach(exp => {
                    if (this.selectedExperiencesForExitFormReleaseDate.includes(exp._id)) {
                        exp.exitFormReleaseDate = new Date(this.selectedDate).toISOString();
                        // Remove the ID from the selectedExperiencesForExitFormReleaseDate array
                        const index = this.selectedExperiencesForExitFormReleaseDate.indexOf(exp._id);
                        if (index > -1) {
                            this.selectedExperiencesForExitFormReleaseDate.splice(index, 1);
                        }
                    }
                });

                this.showDatePicker = false;
                this.selectedDate = null;
            }
        },

        
        // Removes the exit form release date from a specified experience and updates the list of experiences pending a release date assignment.
        removeExitFormReleaseDate(expId) {
            const experience = this.selectedExperiences.find(e => e._id === expId);
            if (experience) {
                delete experience.exitFormReleaseDate;
                this.selectedExperiencesForExitFormReleaseDate = 
                    this.selectedExperiencesForExitFormReleaseDate.filter(id => id !== expId);

            }
        },

        // Ensures all selected experiences have an exit form release date before validating and submitting the form. If validation passes, it constructs the experience data payload and performs an API call to create experience instances. On successful creation, navigates to the instructor data management view with a success toast message.
        async handleSubmitForm() {
            // Check if all selected experiences have an exit form release date
            if (this.selectedExperiences && this.selectedExperiences.length) {
                const allExperiencesHaveDates = this.selectedExperiences.every(exp => exp.exitFormReleaseDate);
                if (!allExperiencesHaveDates) {
                    this.showExitFormError = true;
                    toast.error('Please set an exit form release date for all experiences.', {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete',
                        multiple: false
                    });
                    return; // Stop the form submission if not all experiences have dates
                }
            }

            // Validate the form before submission
            const isValid = await this.$refs.form.validate();
            if (!isValid.valid) {
                toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
                return;
            }

            // Prepare the experience data for the API call
            const experienceData = this.selectedExperiences.map(exp => ({
                id: exp._id,
                exitFormReleaseDate: exp.exitFormReleaseDate,
                activities: exp.activities.map(actId => {
                    const activity = this.activityData.find(activity => activity._id === actId);
                    return {
                        id: actId,
                        name: activity ? activity.activityName : undefined
                    };
                }),
                registrationCode: this.registrationCodes[exp._id].include ? this.registrationCodes[exp._id].code : undefined
            }));

            // API call
            try {
                const user = useLoggedInUserStore();
                const token = user.token;

                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experience-instances/multiple`;

                await axios.post(apiURL, {
                    sessionID: this.selectedSession._id,
                    experienceData
                }, { headers: { token } });

                // Handle response here, e.g., redirecting or displaying a success message
                user.navigationData = {
                    activeTab: 0,
                    toastType: 'success',
                    toastMessage: 'Experience Instance added!',
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--create'
                };

                this.$router.push({
                    name: 'instructorDataManagement'
                });
            } catch (error) {
                // Handle error
                this.handleError(error);
                toast.error('Failed to create experience instances. Please try again.', {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
            }
        },

        // Adds the selected activity's ID to the list of activities within a selected experience.
        selectActivity(activity) {
            this.selectedExperience.activities.push(activity._id)
        },

        // Identifies and removes a specified activity's ID from the list of activities within a selected experience, based on the activity's ID.
        removeActivity(activity) {
            // Find the index of the activity's _id in the selectedExperience.activities array
            const index = this.selectedExperience.activities.indexOf(activity._id);

            // If the activity's _id is found in the array, remove it
            if (index !== -1) {
                this.selectedExperience.activities.splice(index, 1);
            }
        },

        // Navigate backwards
        goBack() {
            useLoggedInUserStore().navigationData = {
                activeTab: 0,
            };
            this.$router.push({
                name: 'instructorDataManagement'
            });
        },

    }
}
</script>

<style scoped>
.error-text {
    color: red;
}

.pointer-cursor {
    cursor: pointer;
}

.activity-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.mdi-close {
    cursor: pointer;
}

.scrollable-table {
    height: 300px; /* Adjust the height as needed */
    overflow-y: auto;
    }

    /* Optional: Style to improve the appearance when scrolling */
    .scrollable-table::-webkit-scrollbar {
    width: 10px;
    }

    .scrollable-table::-webkit-scrollbar-track {
    background: #f1f1f1;
    }

    .scrollable-table::-webkit-scrollbar-thumb {
    background: #888;
    }

    .scrollable-table::-webkit-scrollbar-thumb:hover {
    background: #555;
    }

    .scrollable-list {
    height: 370px; /* Adjust the height as needed */
    overflow-y: auto;
    }

    /* Optional: Style to improve the appearance when scrolling */
    .scrollable-list::-webkit-scrollbar {
    width: 10px;
    }

    .scrollable-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    }

    .scrollable-list::-webkit-scrollbar-thumb {
    background: #888;
    }

    .scrollable-list::-webkit-scrollbar-thumb:hover {
    background: #555;
    }


</style>