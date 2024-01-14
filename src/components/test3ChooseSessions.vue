<template>
<v-container style="width: 100%; margin: 0 auto;">
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6 mb-4">Please Choose One or More Sessions</p>
        </v-col>
    </v-row>

    <v-row>
    <!-- Column for Session Cards -->
    <v-col cols="6">
        <v-row v-for="session in sessionData" :key="session._id">
        <v-col cols="12">
            <!-- Session Card -->
            <v-card 
                :title="session.sessionName" 
                :color="isSelected(session._id) ? 'light-green-accent-1' : ''" 
            >
                <v-card-text>
                    <div>Start Date: {{ new Date(session.sessionPeriod.startDate).toLocaleDateString() }}</div>
                    <div>End Date: {{ new Date(session.sessionPeriod.endDate).toLocaleDateString() }}</div>
                </v-card-text>
                <v-card-actions>
                    <v-btn 
                        color="primary" 
                        @click="toggleSessionSelection(session)"
                    >
                        {{ isSelected(session._id) ? 'Deselect' : 'Select' }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn 
                        append-icon="mdi-pencil" 
                        @click="editSession(session._id)"
                    >
                        Quick Edit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        </v-row>
    </v-col>

        <!-- Column for Quick Edit Form -->
        <v-scale-transition>
            <v-col v-if="editingSessionID" cols="6">
                <!-- Quick Edit Form -->
                <v-form @submit.prevent="handleUpdateForm">
                    <p class="font-weight-black text-h6">Quick Edit</p><br>
                    <v-row>
                        <v-col>
                            <v-text-field 
                                v-model="editingSessionName" 
                                label="Session Name"
                            >
                                <template v-slot:append>
                                    <v-badge
                                        v-if="isSessionNameChanged"
                                        floating
                                        icon="mdi-pencil"
                                        text-color="blue-darken-4"
                                        color="blue-lighten-4"
                                    ></v-badge>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <!-- Start Date -->
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="formattedStartDate"
                                label="Session Start Date"
                                readonly
                            >
                                <template v-slot:append>
                                    <v-btn
                                        variant="text"
                                        icon="mdi-calendar"
                                        @click="dialogStartDate = true"
                                    ></v-btn>
                                    <v-badge
                                        v-if="isStartDateChanged"
                                        floating
                                        icon="mdi-pencil"
                                        text-color="blue-darken-4"
                                        color="blue-lighten-4"
                                    ></v-badge>                            
                                </template>
                            </v-text-field>
                            <v-dialog 
                                v-model="dialogStartDate"
                                width="auto"
                            >
                                <v-card>
                                    <v-card-item>
                                            <v-date-picker 
                                                v-model="selectedStartDate"
                                                elevation="24"
                                                title="Session Start Date"
                                                show-adjacent-months
                                            ></v-date-picker>
                                    </v-card-item>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="dialogStartDate = false">Cancel</v-btn>
                                        <v-btn color="primary" @click="submitStartDate">Set</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    
                    <!-- End Date -->
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="formattedEndDate"
                                label="Session End Date"
                                readonly
                            >
                                <template v-slot:append>
                                    <v-btn
                                        variant="text"
                                        icon="mdi-calendar"
                                        @click="dialogEndDate = true"
                                    ></v-btn>
                                    <v-badge
                                        v-if="isEndDateChanged"
                                        floating
                                        icon="mdi-pencil"
                                        text-color="blue-darken-4"
                                        color="blue-lighten-4"
                                    ></v-badge>                            
                                </template>
                            </v-text-field>
                            <v-dialog 
                                v-model="dialogEndDate"
                                width="auto"
                            >
                                <v-card>
                                    <v-card-item>
                                            <v-date-picker 
                                                v-model="selectedEndDate"
                                                elevation="24"
                                                title="Session End Date"
                                                show-adjacent-months
                                            ></v-date-picker>
                                    </v-card-item>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="dialogEndDate = false">Cancel</v-btn>
                                        <v-btn color="primary" @click="submitEndDate">Set</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>

                    <v-row class="mt-0">
                        <v-col class="pa-0">
                            <v-btn @click="closeQuickEdit">
                                Cancel
                            </v-btn>
                        </v-col>
                        <v-col class="pa-0">
                            <v-btn @click="revertQuickEditChanges">
                                Revert
                            </v-btn>
                        </v-col>
                        <v-col class="pa-0">
                            <v-btn style="text-align: center;" @click="handleUpdateForm">Submit</v-btn>
                        </v-col>
                        <v-col cols="4"></v-col>
                    </v-row> 
                </v-form>
            </v-col>
        </v-scale-transition>
    </v-row>
</v-container>
    
</template>
    
<script>
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { DateTime } from "luxon";
import axios from 'axios';

export default {
    name: "ChooseSessions",
    props: {
        
    },
    emits: ['form-valid', 'form-invalid', 'validation-change'],
    data() {
        return {
            sessionData: [],
            formSubmitted: false,
            showErrorBanner: false,
            selectedSessions: [],
            editingSessionID: null,
            editingSessionName: '',
            dialogStartDate: false,
            originalStartDate: '',
            selectedStartDate: new Date(),
            tempStartDate: '',

            dialogEndDate: false,
            originalEndDate: '',
            selectedEndDate: new Date(),
            tempEndDate: '',
        };
    },
    created() {
        this.fetchActiveSessions();
    },
    watch: {
        selectedSessions: {
            handler(newVal) {
                // Check if the array has at least one item
                const isValid = newVal.length > 0

                // Emit the validation change event
                this.$emit('validation-change', { isValid });
            },
            deep: true
        }
    },
    computed: {
        editingSession() {
            if (!this.editingSessionID) return null;
            return this.sessionData.find(session => session._id === this.editingSessionID);
        },

        formattedStartDate() {
            // If tempStartDate is set (i.e., a new date has been picked), format it. Otherwise, use the original date.
            return this.tempStartDate 
                ? DateTime.fromISO(this.tempStartDate).toFormat('MM-dd-yyyy') 
                : DateTime.fromISO(this.editingSession?.sessionPeriod.startDate).toFormat('MM-dd-yyyy');
        },

        formattedEndDate() {
            // If tempEndDate is set (i.e., a new date has been picked), format it. Otherwise, use the original date.
            return this.tempEndDate 
                ? DateTime.fromISO(this.tempEndDate).toFormat('MM-dd-yyyy') 
                : DateTime.fromISO(this.editingSession?.sessionPeriod.endDate).toFormat('MM-dd-yyyy');
        },

        isSessionNameChanged() {
            return this.editingSessionName !== this.editingSession?.sessionName;
        },

        isStartDateChanged() {
            let originalDateFormatted = DateTime.fromISO(this.originalStartDate).toFormat('yyyy-MM-dd');
            let tempDateFormatted = DateTime.fromISO(this.tempStartDate).toFormat('yyyy-MM-dd');
            return tempDateFormatted !== originalDateFormatted;
        },

        isEndDateChanged() {
            let originalDateFormatted = DateTime.fromISO(this.originalEndDate).toFormat('yyyy-MM-dd');
            let tempDateFormatted = DateTime.fromISO(this.tempEndDate).toFormat('yyyy-MM-dd');
            return tempDateFormatted !== originalDateFormatted;
        },

        hasValidationErrors() {
            if (!this.formSubmitted) return false;
            return this.isOtherPronounsInvalid;
        },
    },
    methods: {
        async fetchActiveSessions() {
            useLoggedInUserStore().startLoading();
            try {
                const user = useLoggedInUserStore();
                // let token = user.token;

                let token = `
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNTI2NzY2OCwiZXhwIjoxNzA1Mjc5NjY4fQ.cAYCcJzzRRimGBOYy3089_aFXf3naZKAvXCvctNukvA
                `
            
                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/active`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.sessionData = resp.data;
            } catch (error) {
                this.handleError(error);
            }
        },
        
        toggleSessionSelection(session) {
            const index = this.selectedSessions.indexOf(session._id);
            if (index > -1) {
                // Session is currently selected, remove it from the array
                this.selectedSessions.splice(index, 1);
            } else {
                this.selectedSessions.push(session._id);
            }
            // Get full session details for the selected sessions
            const selectedFullDetails = this.selectedSessions.map(sessionId => 
                this.sessionData.find(s => s._id === sessionId)
            );

            // Update the Pinia store with the full details
            const user = useLoggedInUserStore();
            user.updateexperienceInstanceCreationDetails(selectedFullDetails);
        },
        
        isSelected(sessionID) {
            return this.selectedSessions.includes(sessionID);
        },

        editSession(sessionID) {
            this.editingSessionID = sessionID;
            this.editingSessionName = this.editingSession.sessionName;

            this.originalStartDate = this.editingSession.sessionPeriod.startDate;
            this.selectedStartDate = new Date(this.originalStartDate);
            this.tempStartDate = this.originalStartDate;

            this.originalEndDate = this.editingSession.sessionPeriod.endDate;
            this.selectedEndDate = new Date(this.originalEndDate);
            this.tempEndDate = this.originalEndDate;
        },


        closeQuickEdit() {
            this.editingSessionID = null;
        },

        revertQuickEditChanges() {
            this.editingSessionName = this.editingSession.sessionName;

            this.tempStartDate = this.editingSession.sessionPeriod.startDate;
            this.selectedStartDate = new Date(this.editingSession.sessionPeriod.startDate);

            this.tempEndDate = this.editingSession.sessionPeriod.endDate;
            this.selectedEndDate = new Date(this.editingSession.sessionPeriod.endDate);
        },

        submitStartDate() {
            console.log('submitStartDate');
            this.tempStartDate = this.selectedStartDate.toISOString();
            this.dialogStartDate = false;
        },

        submitEndDate() {
            console.log('submitEndDate');
            this.tempEndDate = this.selectedEndDate.toISOString();
            this.dialogEndDate = false;
        },

        handleUpdateForm() {
            console.log('handleUpdateForm');
            if (this.editingSession) {
                this.editingSession.sessionName = this.editingSessionName;
                this.editingSession.sessionPeriod.startDate = this.tempStartDate;
                this.editingSession.sessionPeriod.endDate = this.tempEndDate;
            }
            this.editingSessionID = null;
            toast.info('Session Updated!', {
                position: 'top-right',
                toastClassName: 'Toastify__toast--update'
            });
        },

        handleValidations() {
            // Check if at least one session is selected
            if (this.selectedSessions.length > 0) {
                this.$emit('form-valid');
                this.$emit('validation-change', { isValid: true });
            } else {
                this.$emit('form-invalid');
                this.$emit('validation-change', { isValid: false });
                toast.error(this.$t("Please select at least one Session."), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
            }
        },

    },
};
</script>

<style scoped>

.error-text {
    color: #B00020;
    }


    .fixed-button {
    position: fixed;
    bottom: 20px; /* Adjust the bottom value as needed */
    right: 20px; /* Adjust the right value as needed */
    z-index: 1000;
}
</style>
