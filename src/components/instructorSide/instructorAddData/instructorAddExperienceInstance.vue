<template>
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
                    label="Please Select Experiences"
                    v-model="selectedExperiences"
                    :rules="experienceRules"
                    multiple
                    chips
                    return-object
                    clearable
                ></v-autocomplete>
            </v-col>
        </v-row>

        <!-- Main Row for Experiences and Button -->
        <v-row>
            <!-- Column for the Button -->
            <v-col cols="12" md="4">
                <v-btn 
                    v-if="selectedExperiences && selectedExperiences.length"
                    @click="openDatePicker" 
                    :disabled="isSetDateButtonDisabled"
                >
                    Set Exit Form Release Date
                </v-btn>
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





<!-- 
        <v-row>
            <p class="font-weight-black text-h7">Exit Form Release Date</p>
        </v-row>

        <v-row>
            <v-col cols="6">
                <v-text-field
                    label="Exit Form Release Date"
                    type="date"
                    v-model="exitFormReleaseDate"
                    :rules="dateRules"
                ></v-text-field>
            </v-col>
        </v-row> 
-->

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
            selectedExperiences: null,
            registrationStartDate: null,
            registrationEndDate: null,
            exitFormReleaseDate: null,
            sessionRules: [v => !!v || 'Session is required'],
            experienceRules: [
                v => !!v && v.length > 0 || 'Experience is required',
            ],
            dateRules: [v => !!v || 'Date is required'],
            selectedExperiencesForExitFormReleaseDate: [],
            showDatePicker: false,
            selectedDate: new Date(),
            showExitFormError: false,
        }
    },

    created() {
        this.fetchActiveSessions();
    },

    watch: {
        selectedSession(newVal, oldVal) {
            if (newVal && newVal._id) {
                this.fetchActiveExperiences(newVal._id);
            } else {
                this.experienceData = [];
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
    },

    methods: {
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

        async fetchActiveExperiences(sessionID) {
            useLoggedInUserStore().startLoading();
            try {
                const user = useLoggedInUserStore();
                let token = user.token;

                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/available-experiences-for-instance?sessionID=${sessionID}`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.experienceData = resp.data;
            } catch (error) {
                this.handleError(error);
            } finally {
                useLoggedInUserStore().stopLoading();
            }
        },

        getSelectedExperience() {
            const selectedExperience = this.experienceData.find(
                experience => experience._id === this.selectedExperienceID
            );
            return {
                id: selectedExperience?._id,
                category: selectedExperience?.experienceCategory,
                name: selectedExperience?.experienceName
            };
        },

        async fetchActivitiesForExperience(experienceID) {
            const user = useLoggedInUserStore();
            let token = user.token;
            let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/activities/experience/` + experienceID;
            try {
                const response = await axios.get(apiURL, { headers: { token } });
                return response.data;
            } catch (error) {
                console.error('Error fetching activities:', error);
                this.handleError(error);
                return [];
            }
        },

        openDatePicker() {
            this.showDatePicker = true;
        },

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



        removeExitFormReleaseDate(expId) {
            const experience = this.selectedExperiences.find(e => e._id === expId);
            if (experience) {
                delete experience.exitFormReleaseDate;
                this.selectedExperiencesForExitFormReleaseDate = 
                    this.selectedExperiencesForExitFormReleaseDate.filter(id => id !== expId);

            }
        },

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
                exitFormReleaseDate: exp.exitFormReleaseDate
            }));

            // API call
            try {
                const user = useLoggedInUserStore();
                const token = user.token;
                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experience-instances/multiple`;
                const response = await axios.post(apiURL, {
                    sessionID: this.selectedSession._id,
                    experienceData
                }, { headers: { token } });

                // Handle response here, e.g., redirecting or displaying a success message
                this.$router.push({ 
                    name: 'instructorDataManagement',
                    params: {
                        activeTab: 0,
                        toastType: 'success',
                        toastMessage: 'Experience Instance added!',
                        toastPosition: 'top-right',
                        toastCSS: 'Toastify__toast--create'
                    }
                });
            } catch (error) {
                // Handle error
                console.error('Error creating experience instances:', error);
                toast.error('Failed to create experience instances. Please try again.', {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
            }
        },


        goBack() {
            this.$router.push({
                name: 'instructorDataManagement',
                params: {
                    activeTab: 0,
                }
            });
        },

    }
}
</script>

<style scoped>
.error-text {
    color: red;
}
</style>