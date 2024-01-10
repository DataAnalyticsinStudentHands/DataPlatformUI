<template>
<v-container>
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6 mb-4">Exit Form Release</p>
        </v-col>
    </v-row>

    <v-row v-for="session in experienceInstanceCreationDetails" :key="session._id">
        <v-col cols="12">
            <v-card flat>
                <v-row>
                    <!-- Column for Session Information -->
                    <v-col cols="4">
                        <v-card-title>{{ session.sessionName }}</v-card-title>
                        <v-card-text>
                            Start Date: {{ formatDate(session.sessionPeriod.startDate) }}
                            <br>
                            End Date: {{ formatDate(session.sessionPeriod.endDate) }}
                        </v-card-text>
                    </v-col>
                    <!-- Column for Experience Chips -->
                    <v-col cols="8">
                        <!-- Section for selecting experiences -->
                        <div v-if="session.experiences.some(exp => !exp.exitFormReleaseDate)">
                            <v-row class="mt-1">
                                <!-- Subtitle for Selecting Experiences -->
                                <v-col>
                                    <p class="text-subtitle-2">Select Experiences to Set an Exit Form Release Date</p>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col>
                                    <v-chip-group v-model="selectedExperiences[session._id]" multiple>
                                        <v-chip v-for="experience in session.experiences.filter(exp => !exp.exitFormReleaseDate)"
                                                :key="experience.id" class="ma-1" color="blue-darken-3"
                                                :value="experience.id">
                                            {{ experience.name }}
                                        </v-chip>
                                    </v-chip-group>
                                </v-col>
                            </v-row>
                        </div>
                        <!-- Section for Experiences with Set Exit Form Release Date -->
                        <div v-if="session.experiences.some(exp => exp.exitFormReleaseDate)">
                            <div v-for="(groupedExperiences, date) in groupExperiencesByDate(session.experiences)" :key="date">
                                <v-row class="mt-1">
                                    <v-col cols="12">
                                        <p class="text-subtitle-2">Exit Form Release Date: {{ formatDate(date) }}</p>
                                        <v-chip v-for="exp in groupedExperiences" 
                                                :key="exp.id" 
                                                class="ma-1" 
                                                color="green-darken-2"
                                            >
                                            {{ exp.name }}
                                            <v-icon
                                                end
                                                size="x-small"
                                                @click.stop="removeExitFormReleaseDate(session._id, exp.id)"
                                            >mdi-close-circle</v-icon>
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn append-icon="mdi-calendar" @click="openDialog(session._id)">
                        {{ buttonText[session._id] }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-divider :thickness="4" class="my-divider"></v-divider>
    </v-row>
    <!-- Dialog for Date Picker -->
    <v-dialog v-model="showDialog" width="auto">
        <v-card>
            <v-card-item>
                <v-date-picker v-model="selectedDate" elevation="24" show-adjacent-months></v-date-picker>
            </v-card-item>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="showDialog = false">Cancel</v-btn>
                <v-btn color="primary" @click="submitDate">Set</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
<!-- 
<br><br><br><br><br><br>
exitFormDates: {{ exitFormDates }}
<br>
selectedExperiences: {{ selectedExperiences }}
<br>
experienceInstanceCreationDetails: {{ experienceInstanceCreationDetails }} 
-->

</template>


    
<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';

export default {
    name: "test3ExitFormRelease",
    data() {
        return {
            showDialog: false,
            selectedDate: null,
            exitFormDates: {},
            selectedExperiences: {},  // Tracks selected experiences for each session
            activeSessionID: null,    // Tracks the currently active session for setting the date
        }
    },
    emits: ['form-valid', 'form-invalid', 'validation-change'],
    created() {
        this.initializeSelectedExperiences();
    },
    watch: {
        hasValidationErrors(newVal) {
            this.$emit('validation-change', { isValid: !newVal });
        },
    },
    computed: {
        experienceInstanceCreationDetails() {
            const user = useLoggedInUserStore();
            return user.experienceInstanceCreationDetails;
        },
        hasUnassignedExperiences() {
            return this.experienceInstanceCreationDetails.some(session => 
                session.experiences.some(exp => 
                    !Object.values(this.exitFormDates).flat().find(e => e.id === exp.id)
                )
            );
        },
        buttonText() {
            const buttonTexts = {};
            this.experienceInstanceCreationDetails.forEach(session => {
                const anySelected = this.selectedExperiences[session._id] && this.selectedExperiences[session._id].length > 0;
                buttonTexts[session._id] = anySelected ? "Set Release Dates for selected" : "Set Release Dates for All";
            });
            return buttonTexts;
        },

        hasValidationErrors() {
            return this.experienceInstanceCreationDetails.some(session => 
                session.experiences.some(exp => !exp.exitFormReleaseDate)
            );
        },
        
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },

        initializeSelectedExperiences() {
            // Initialize selectedExperiences for each session with empty arrays
            this.experienceInstanceCreationDetails.forEach(session => {
                this.selectedExperiences[session._id] = [];
            });
        },

        openDialog(sessionID) {
            this.activeSessionID = sessionID;
            this.showDialog = true;
            const session = this.experienceInstanceCreationDetails.find(s => s._id === sessionID);
            
            if (session) {
                // Pre-select all experiences only if none are currently selected
                if (!this.selectedExperiences[sessionID] || this.selectedExperiences[sessionID].length === 0) {
                    this.selectedExperiences[sessionID] = session.experiences.map(exp => exp.id);
                }
            }
        },

        submitDate() {
            if (this.selectedDate && this.activeSessionID) {
                const session = this.experienceInstanceCreationDetails.find(s => s._id === this.activeSessionID);
                if (session) {
                    session.experiences.forEach(exp => {
                        if (this.selectedExperiences[this.activeSessionID].includes(exp.id)) {
                            exp.exitFormReleaseDate = this.selectedDate;
                        }
                    });
                }
                this.selectedExperiences[this.activeSessionID] = [];
                this.activeSessionID = null;

                // Update the store
                const userStore = useLoggedInUserStore();
                userStore.updateexperienceInstanceCreationDetails(this.experienceInstanceCreationDetails);
            }
            this.showDialog = false;
        },

        groupExperiencesByDate(experiences) {
            return experiences.reduce((grouped, exp) => {
                if (exp.exitFormReleaseDate) {
                    const dateStr = this.formatDate(exp.exitFormReleaseDate);
                    if (!grouped[dateStr]) {
                        grouped[dateStr] = [];
                    }
                    grouped[dateStr].push(exp);
                }
                return grouped;
            }, {});
        },

        removeExitFormReleaseDate(sessionID, experienceID) {
            const session = this.experienceInstanceCreationDetails.find(s => s._id === sessionID);
            if (session) {
                const experience = session.experiences.find(e => e.id === experienceID);
                if (experience) {
                    // Remove the exitFormReleaseDate from the clicked experience
                    delete experience.exitFormReleaseDate;
                }
            }
        },

        handleValidations() {
            if (!this.hasValidationErrors) {
                this.$emit('form-valid');
            } else {
                this.$emit('form-invalid');
                toast.error(this.$t("Please assign a Release Date for each Experience."), {
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
.my-divider {
    border-color: black !important; /* Ensures overriding of default styles */
}
</style>
