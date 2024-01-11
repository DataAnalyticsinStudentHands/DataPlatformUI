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
            <v-text-field
                v-model="sessionData.sessionName"
                readonly
            ></v-text-field>
            </v-col>
        </v-row>



        <v-row>
            <p class="font-weight-black text-h7">Experience</p>
        </v-row>

        <v-row>
            <v-col>
                <v-text-field
                    label="Experience Name"
                    v-model="experienceData.experienceName"
                    readonly
                ></v-text-field>
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

<br><br><br><br><br><br><br>
sessionData: {{ sessionData }}
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
    name: 'instructorSpecificExperienceInstance',
    data() {
        return {
            sessionData: {},
            experienceData: {},
            selectedSessionID: null,
            selectedExperienceID: null,
            exitFormReleaseDate: null,
        }
    },
    created() {

        this.fetchExperienceInstance();
    },
    methods: {
        async fetchExperienceInstance() {
            const instanceID = this.$route.params.id; // Get instance ID from route parameter
            const user = useLoggedInUserStore();
            let token = user.token;
            let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/${instanceID}`;

            try {
                const response = await axios.get(apiURL, { headers: { token } });
                const instanceData = response.data;
                this.selectedSessionID = instanceData.sessionID;
                this.selectedExperienceID = instanceData.experience.id;
                this.exitFormReleaseDate = instanceData.exitFormReleaseDate.slice(0, 10); // Format date as 'YYYY-MM-DD'

                // Fetch session and experience details
                this.fetchSessionDetails();
                this.fetchExperienceDetails();
            } catch (error) {
                this.handleError(error);
            }
        },

        async fetchSessionDetails() {
            const user = useLoggedInUserStore();
            let token = user.token;
            let sessionAPIURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/${this.selectedSessionID}`;
            
            try {
                const sessionResponse = await axios.get(sessionAPIURL, { headers: { token } });
                this.sessionData = sessionResponse.data;
            } catch (error) {
                this.handleError(error);
            }
        },

        async fetchExperienceDetails() {
            const user = useLoggedInUserStore();
            let token = user.token;
            let experienceAPIURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${this.selectedExperienceID}`;

            try {
                const experienceResponse = await axios.get(experienceAPIURL, { headers: { token } });
                this.experienceData = experienceResponse.data;
            } catch (error) {
                this.handleError(error);
            }
        },

        goBack() {
            this.$router.push({
                name: 'instructorDataManagement',
                params: {
                    activeTab: 0
                }
            });
        },

        async handleSubmitForm() {
            const user = useLoggedInUserStore();
            let token = user.token;
            const instanceID = this.$route.params.id;
            let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/update-exit-form-release-date/${instanceID}`;

            try {
                await axios.put(apiURL, { exitFormReleaseDate: this.exitFormReleaseDate }, { headers: { token } })
                    .then(() => {
                        this.$router.push({ 
                            name: 'instructorDataManagement',
                            params: {
                                activeTab: 0,
                                toastType: 'info',
                                toastMessage: 'Experience Instance updated!',
                                toastPosition: 'top-right',
                                toastCSS: 'Toastify__toast--update'
                            }
                        });
                    });
            } catch (error) {
                this.handleError(error);
            }
        },
    }
}
</script>