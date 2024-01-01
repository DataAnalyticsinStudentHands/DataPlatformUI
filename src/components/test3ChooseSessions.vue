<template>
<v-container style="width: 100%; margin: 0 auto;">
    <v-row>
    <v-col>
        <p class="font-weight-black text-h6 mb-4">Please Choose One or More Sessions</p>
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
                <template v-slot:append>
                    <v-icon v-show="isSelected(session._id)">mdi-check-bold</v-icon>
                </template>
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
                    <v-row>
                        <v-col>
                            <v-text-field
                                ref="startDateFieldRef"
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
                                                title="Please select a date"
                                                header="Session Start Date"
                                            ></v-date-picker>
                                    </v-card-item>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="dialogStartDate = false">Cancel</v-btn>
                                        <v-btn color="primary" @click="submitStartDate">Submit</v-btn>
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

<v-btn
    v-if="hasValidationErrors"
    @click="scrollToErrorField"
    color="error"
    icon
    class="pa-1 fixed-button"
    elevation="4"
    size="small"
>
    <v-icon>mdi-alert-circle</v-icon>
    <v-tooltip activator="parent" location="start">Jump to Error</v-tooltip>
</v-btn>
    
</template>
    
<script>
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { DateTime } from "luxon";
import axios from 'axios';

export default {
    name: "TestEntryDemo",
    props: {
        studentInformation: Object,
    },
    emits: ['form-valid', 'form-invalid', 'scroll-to-error', 'validation-change'],
    data() {
        return {
            sessionData: [],
            formSubmitted: false,
            showErrorBanner: false,
            selectedSessions: [],
            editingSessionID: null,
            dialogStartDate: false,
            editingSessionName: '',
            originalStartDate: '',
            selectedStartDate: new Date(),
            tempStartDate: '',
        };
    },
    created() {
        this.fetchActiveSessions();
    },
    watch: {

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
            if (!this.editingSession) return '';
            return DateTime.fromISO(this.editingSession.sessionPeriod.endDate).toFormat('yyyy-MM-dd');;
        },

        isSessionNameChanged() {
            return this.editingSessionName !== this.editingSession?.sessionName;
        },

        isStartDateChanged() {
            let originalDateFormatted = DateTime.fromISO(this.originalStartDate).toFormat('yyyy-MM-dd');
            let tempDateFormatted = DateTime.fromISO(this.tempStartDate).toFormat('yyyy-MM-dd');
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
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDA4ODM0NCwiZXhwIjoxNzA0MTAwMzQ0fQ.HIEmOfW42Zts7WOfmekma-5LLXlcO7UPFSF0CtQqsVM  
                `
            
                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/active`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.sessionData = resp.data;
            } catch (error) {
                this.handleError(error);
                throw error;
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
        },


        closeQuickEdit() {
            this.editingSessionID = null;
        },

        revertQuickEditChanges() {
            this.editingSessionName = this.editingSession.sessionName;
            this.tempStartDate = this.editingSession.sessionPeriod.startDate;
            this.selectedStartDate = new Date(this.editingSession.sessionPeriod.startDate);
        },

        submitStartDate() {
            console.log('submitStartDate');
            this.tempStartDate = this.selectedStartDate.toISOString();
            this.dialogStartDate = false;
        },
        
        async handleValidations() {
            this.formSubmitted = true;
            const { valid } = await this.$refs.form.validate();
            if (valid) {
            console.log('form is valid!');
            this.$emit('form-valid');
            } else {
            this.$emit('form-invalid');
            toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: false
                });
            }
        },

        handleUpdateForm() {
            console.log('handleUpdateForm');
            if (this.editingSession) {
                this.editingSession.sessionName = this.editingSessionName;
                this.editingSession.sessionPeriod.startDate = this.tempStartDate;
            }
            this.editingSessionID = null;
            toast.info('Session Updated!', {
                position: 'top-right',
                toastClassName: 'Toastify__toast--update'
            });
        },

        scrollToErrorField() {
            const errorFields = [
                'otherPronounsField'
            ];

            for (let i = 0; i < errorFields.length; i++) {
                if (this.isFieldInvalid(errorFields[i])) {
                    // Emit the actual DOM element or component reference
                    const ref = this.$refs[errorFields[i]];
                    const element = ref.$el ? ref.$el : ref; // If ref is a Vue component, use ref.$el to get the DOM element
                    this.$emit('scroll-to-error', element);
                    break;
                }
            }
        },

        isFieldInvalid(fieldRef) {
            // Add logic to determine if a field is invalid based on its ref
            if (fieldRef === 'otherPronounsField') return this.isOtherPronounsInvalid;
            // Include other fields if necessary
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
