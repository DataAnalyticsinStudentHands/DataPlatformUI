<template>
<v-container>
    <v-form>
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
                    v-model="selectedSessionID"
                ></v-autocomplete>
            </v-col>
        </v-row>

        <v-row>
            <p class="font-weight-black text-h7">Experience</p>
        </v-row>

        <v-row>
            <v-col>
                <v-autocomplete
                    :items="experienceData"
                    item-title="experienceName"
                    item-value="_id"
                    label="Please Select an Experience"
                    v-model="selectedExperienceID"
                ></v-autocomplete>
            </v-col>
        </v-row>

        <v-row>
            <p class="font-weight-black text-h7">Exit Form Release Date</p>
        </v-row>

        <v-row>
            <v-col cols="6">
                <v-text-field
                    label="Exit Form Release Date"
                    type="date"
                    v-model="exitFormReleaseDate"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-btn @click="goBack" style="margin-left: 10px;">
                Cancel
                </v-btn>
                <v-btn style="text-align: center;" @click="handleSubmitForm">Submit</v-btn>
            </v-col>
        </v-row>
    </v-form>
</v-container>


<br><br><br><br>

<div v-if="selectedSessionID">
    Selected Session ID: {{ selectedSessionID }}
</div>


<!-- Display selected experience ID -->
<div v-if="selectedExperienceID">
    Selected Experience ID: {{ selectedExperienceID }}
</div>

<br><br><br><br><br>
sessionData: {{ sessionData }}
<br>
Selected Session ID: {{ selectedSessionID }}
<br>
experienceData: {{ experienceData }}
<br>
Selected Session ID: {{ selectedSessionID }}
<br>
selectedExperienceID: {{ selectedExperienceID }}
<br>
registrationStartDate: {{ registrationStartDate }}
<br>
registrationEndDate: {{ registrationEndDate }}
<br>
exitFormReleaseDate: {{ exitFormReleaseDate }}


</template>


  
<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
    name: 'instructorAddExperenceInstance',

    data() {
        return {
            sessionData: [],
            selectedSessionID: null,
            experienceData: [],
            selectedExperienceID: null,
            registrationStartDate: null,
            registrationEndDate: null,
            exitFormReleaseDate: null,
        }
    },

    created() {
        this.fetchActiveSessions();
        this.fetchActiveExperiences();
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

        async fetchActiveExperiences() {
            useLoggedInUserStore().startLoading();
            try {
                const user = useLoggedInUserStore();
                let token = user.token;

                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/active`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.experienceData = resp.data;
            } catch (error) {
                this.handleError(error);
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
            console.log('apiURL', apiURL);
            try {
                const response = await axios.get(apiURL, { headers: { token } });
                return response.data;
            } catch (error) {
                console.error('Error fetching activities:', error);
                this.handleError(error);
                return [];
            }
        },

        async handleSubmitForm() {
            const user = useLoggedInUserStore();
            let token = user.token;

            // Fetch activities for the selected experience
            const activities = await this.fetchActivitiesForExperience(this.selectedExperienceID);

            // Construct the data object for the API call
            const postData = {
                experience: this.getSelectedExperience(),
                sessionID: this.selectedSessionID,
                activities: activities,
                exitFormReleaseDate: this.exitFormReleaseDate
            };

            console.log('postData: ', postData);

            try {
                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experience-instances`;
                await axios.post(apiURL, postData, { headers: { token } })
                    .then(() => {
                        this.$router.push({ 
                            name: 'instructorDataManagement',
                            params: {
                                activeTab: 1,
                                toastType: 'success',
                                toastMessage: 'Experience Instance added!',
                                toastPosition: 'top-right',
                                toastCSS: 'Toastify__toast--create'
                            }
                        });
                    });
            } catch (error) {
                this.handleError(error);
            }
        },

        goBack() {
            this.$router.push({
                name: 'instructorDataManagement',
                params: {
                    activeTab: 1,
                }
            });
        },

    }
}
</script>
