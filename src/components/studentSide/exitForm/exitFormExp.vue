<!--
  File: src/components/studentSide/exitForm/exitFormExp.vue
  
  This component handles the experience selection step in the exit form process. It displays
  a dropdown of available experiences that students can fill exit forms for, checks whether
  an exit form has already been submitted for the selected experience, and warns users if
  they're about to overwrite existing responses. The component also handles loading experiences
  from incomplete forms and manages the flow based on whether goal forms and activities exist
  for the selected experience.
-->

<template>
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
    <v-container style="width: 100%; margin: 0 auto;">
        <v-row></v-row>
        <v-col cols="12"></v-col>
        <v-row dense>
            <v-col cols="11" md="10">
                <div>
                <p 
                    :class="{'error-text': isExperienceIDInvalid}"
                    class="font-weight-black text-h8"
                >
                    {{$t('Which experience are you filling out this form for:')}}
                </p>
                <!-- Experience selection dropdown -->
                <v-autocomplete
                    v-model="selectedExperience"
                    :label="$t('Select an Experience')"
                    :items="formattedExperiences"
                    item-title="text"
                    item-value="value"
                    clearable
                    :rules="experienceIDRules"
                    required
                ></v-autocomplete>
                </div>
            </v-col>
        </v-row>

        <!-- Status messages for selected experience -->
        <v-row dense style="padding-bottom: 1rem;" v-show="selectedExperience">
            <v-col cols="11">
                <div style="display: flex; flex-direction: column; align-items: flex-start; min-height: 3.8rem; justify-content: center;">
                <!-- Loading indicator -->
                <v-progress-circular 
                    v-show="isLoadingExpCheck"
                    indeterminate 
                    size="20"
                ></v-progress-circular>

                <!-- Warning message for existing exit form -->
                <div v-if="experienceFoundWarning" style="display: flex; align-items: center; color: #4A90E2; font-weight: bold;">
                    <v-icon left small style="margin-right: 0.5rem; color: #4A90E2;">mdi-alert-circle</v-icon>
                    {{$t('Hi there! You have already filled out an Exit Form for this experience. Please note that submitting another form for the same experience will overwrite your previous responses.')}}
                </div>

                <!-- Success message for new exit form -->
                <div v-if="experienceFoundWarning === false" style="display: flex; align-items: center; color: #4CAF50; font-weight: bold;">
                    <v-icon left small style="margin-right: 0.5rem; color: #4CAF50;">mdi-check-circle</v-icon>
                    {{$t("You haven't filled out an Exit Form for this experience. Complete this form to complete your experience!")}}
                </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</v-form>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';
import axios from "axios";

export default {
name: "ExitFormExperiences",
props: {
    exitForm: Object,
    originalExitForm: Object,
    originalExitFormTwo: Object,
    isFirstInput: Boolean,
    expRegistrationIDFromIncomplete: String,
    tempIncompleteForm: Object,
    startNewSelected: Boolean,
    currentlyUsingIncompleteForm: Boolean
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change", "update-original-exit-form", "update-selected-experience", "update-found-document-id", "reset-exit-form", "update-activities-exist", "update-goal-form-exists", "reset-error-flags", "update-incomplete-exp-registration", "update-data-and-society", "update-first-input"],
data() {
    return {
        formSubmitted: false,
        selectedExperience: null,
        experienceIDRules: [
            v => {
            if (this.formSubmitted) {
                return !!v || this.$t('Information is required.');
            }
            return true;
            }
      ],
      isLoadingExpCheck: false,
      experienceFoundWarning: null,
    }
},
mounted() {
    // Initialize component view and language settings
    this.$nextTick(() => {
        window.scrollTo(0, 0);
    });
    const user = useLoggedInUserStore();

    // Set language preference
    if (user.languagePreference === "Spanish") {
        this.$i18n.locale = 'es';
    } else {
        this.$i18n.locale = 'en';
    }
    user.startLoading();

    try {
        // Load available experiences and handle route parameters
        this.fetchExperiences().then(() => {
        if (this.startNewSelected === false) {
            this.selectExperienceFromRouteParam();
        }
        });

    } catch (error) {
        this.handleError('Error:', error);
    } finally {
        user.stopLoading();
    }
},
watch: {
    // Check for existing forms when experience selection changes
    selectedExperience(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.checkExistingForm(newVal);
      }
      if (!newVal) {
        this.experienceFoundWarning = null;
      }
    },

    // Emit validation state changes
    hasValidationErrors(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.$emit('validation-change', { isValid: !newValue });
        }
    },

    // Handle incomplete form experience selection
    expRegistrationIDFromIncomplete(newVal) {
        if (newVal) {
            const matchedExperience = this.exitForm.experiences.find(experience => experience.expRegistrationID === newVal);
            this.selectedExperience = matchedExperience ? matchedExperience.experienceID : null;
        }
    },
    
    // Handle new form selection from route
    startNewSelected(newVal) {
        if (newVal === true) {
            this.selectExperienceFromRouteParam();
        }
    }
},
computed: {
    // Validation state for experience selection
    isExperienceIDInvalid() {
      if (!this.formSubmitted) return false;
      return this.selectedExperience === null || this.selectedExperience === '';
    },

    // Format experiences for dropdown display
    formattedExperiences() {
      return this.exitForm.experiences.map(experience => ({
        text: `${experience.experienceCategory}: ${experience.experienceName}`,
        value: experience.experienceID,
        expRegistrationID: experience.expRegistrationID
      }));
    },

    // Overall validation state
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
        return this.isExperienceIDInvalid;
    },
},
methods: {
    // Fetch available experiences from API
    async fetchExperiences() {
        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experiences-available-for-forms/exit-forms/';

        try {
            const response = await axios.get(apiURL, { headers: { token } });
            
            let tempExitForm = JSON.parse(JSON.stringify(this.exitForm));
            
            // Map API response to experience format
            tempExitForm.experiences = response.data.map(experience => ({
                experienceID: experience._id,
                experienceCategory: experience.experienceCategory,
                experienceName: experience.experienceName,
                expRegistrationID: experience.expRegistrationID
            }));
            
            this.$emit("update-original-exit-form", tempExitForm);
            this.exitForm.experiences = tempExitForm.experiences;
            
        } catch (error) {
            this.handleError(error);
        }
    },

    // Check if exit form already exists for selected experience
    async checkExistingForm() {
        this.isLoadingExpCheck = true;
        const selectedExperienceInfo = this.formattedExperiences.find(exp => exp.value === this.selectedExperience);
        const expRegistrationID = selectedExperienceInfo ? selectedExperienceInfo.expRegistrationID : null;

        let tempExitForm = {};

        // Determine which form state to use as base
        if (this.currentlyUsingIncompleteForm) {
            tempExitForm = JSON.parse(JSON.stringify(this.originalExitFormTwo));
        } else {
            if (this.tempIncompleteForm && this.tempIncompleteForm.incompleteForm && Object.keys(this.tempIncompleteForm.incompleteForm).length > 0) {
                tempExitForm = JSON.parse(JSON.stringify(this.exitForm));
            } else {
                tempExitForm = JSON.parse(JSON.stringify(this.originalExitForm));
            }
        }

        this.$emit('reset-exit-form');
        
        tempExitForm.experienceID = selectedExperienceInfo.value;
        tempExitForm.expRegistrationID = selectedExperienceInfo.expRegistrationID;

        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/has-completed-EF-for-registration/';
        
        try {
            const response = await axios.get(apiURL + `${expRegistrationID}`, {
                headers: {
                    token: token
                }
            });

            // Check if experience is Data & Society related
            const textPatterns = ["Data & Society", "Data And Society", "Data and Society", "Minor Data & Society", "Minor Data And Society", "Minor Data and Society"];
            const containsDataAndSociety = selectedExperienceInfo && textPatterns.some(pattern => selectedExperienceInfo.text.includes(pattern));
            this.$emit("update-data-and-society", containsDataAndSociety);

            // Process goal form data if exists
            if (response.data.goalFormFound) {
                this.$emit('update-goal-form-exists', response.data.goalFormFound);

                const goalFormData = response.data.goalForm;

                tempExitForm.goalSettingFormID = goalFormData._id;

                // Update aspirations and goals
                tempExitForm.aspiration1 = goalFormData.goalForm.aspirations?.aspirationOne;
                tempExitForm.aspiration2 = goalFormData.goalForm.aspirations?.aspirationTwo;
                tempExitForm.aspiration3 = goalFormData.goalForm.aspirations?.aspirationThree;
                tempExitForm.goal1 = goalFormData.goalForm.goals?.goalOne;
                tempExitForm.goal2 = goalFormData.goalForm.goals?.goalTwo;
                tempExitForm.goal3 = goalFormData.goalForm.goals?.goalThree;
                tempExitForm.goal4 = goalFormData.goalForm.goals?.goalFour;
                tempExitForm.goal5 = goalFormData.goalForm.goals?.goalFive;
                
                this.$emit("update-original-exit-form", tempExitForm);

                // Update current form state
                this.exitForm.experienceID = selectedExperienceInfo.value;
                this.exitForm.expRegistrationID = selectedExperienceInfo.expRegistrationID;
                this.exitForm.goalSettingFormID = goalFormData._id;
                this.exitForm.aspiration1 = goalFormData.goalForm.aspirations?.aspirationOne;
                this.exitForm.aspiration2 = goalFormData.goalForm.aspirations?.aspirationTwo;
                this.exitForm.aspiration3 = goalFormData.goalForm.aspirations?.aspirationThree;
                this.exitForm.goal1 = goalFormData.goalForm.goals?.goalOne;
                this.exitForm.goal2 = goalFormData.goalForm.goals?.goalTwo;
                this.exitForm.goal3 = goalFormData.goalForm.goals?.goalThree;
                this.exitForm.goal4 = goalFormData.goalForm.goals?.goalFour;
                this.exitForm.goal5 = goalFormData.goalForm.goals?.goalFive;

            } else {
                // Clear goal form data if none exists
                this.$emit('update-goal-form-exists', false);

                tempExitForm.goalSettingFormID = null;
                tempExitForm.aspiration1 = null;
                tempExitForm.aspiration2 = null;
                tempExitForm.aspiration3 = null;
                tempExitForm.goal1 = null;
                tempExitForm.goal2 = null;
                tempExitForm.goal3 = null;
                tempExitForm.goal4 = null;
                tempExitForm.goal5 = null;

                this.$emit("update-original-exit-form", tempExitForm);

                this.exitForm.experienceID = selectedExperienceInfo.value;
                this.exitForm.expRegistrationID = selectedExperienceInfo.expRegistrationID;
                this.exitForm.goalSettingFormID = null;
                this.exitForm.aspiration1 = null;
                this.exitForm.aspiration2 = null;
                this.exitForm.aspiration3 = null;
                this.exitForm.goal1 = null;
                this.exitForm.goal2 = null;
                this.exitForm.goal3 = null;
                this.exitForm.goal4 = null;
                this.exitForm.goal5 = null;
            }

            // Set warning state based on existing exit form
            if (response.data && response.data.exitFormFound === false) {
                this.$emit('update-found-document-id', null);
                this.experienceFoundWarning = false;
            }
            else if (response.data && response.data.exitFormFound) {
                this.$emit('update-found-document-id', response.data.exitFormID);
                this.experienceFoundWarning = true;
            } else {
                this.$emit('update-found-document-id', null);
                this.experienceFoundWarning = false;
            }

            // Process activities if they exist
            if (response.data && response.data.activities && response.data.activities.length > 0) {
                tempExitForm.experienceActivities = response.data.activities;
                this.$emit("update-original-exit-form", tempExitForm);
                this.exitForm.experienceActivities = response.data.activities;
                this.$emit('update-activities-exist', true);
            } else {
                this.$emit('update-activities-exist', false);
            }

            this.$emit('reset-error-flags');
            this.$emit("update-first-input", true);
            this.$emit("update-selected-experience", selectedExperienceInfo);

        } catch (error) {
            this.handleError("An unexpected error occurred while checking for existing form:", error);
        } finally {
            this.isLoadingExpCheck = false;
            if (this.expRegistrationIDFromIncomplete && this.expRegistrationIDFromIncomplete.length) {
                this.$emit("update-incomplete-exp-registration");
            }
        }
    },

    // Update experience selection in form state
    updateExperienceID(selected) {
        const selectedExperienceInfo = this.formattedExperiences.find(exp => exp.value === selected);

        if (!selected) {
            this.exitForm.experienceID = null;
            this.exitForm.expRegistrationID = null;
            this.$emit("update-selected-experience", null);
            return;
        }

        let tempExitForm = JSON.parse(JSON.stringify(this.exitForm));

        tempExitForm.experienceID = selectedExperienceInfo.value;
        tempExitForm.expRegistrationID = selectedExperienceInfo.expRegistrationID;

        this.$emit("update-original-exit-form", tempExitForm);

        this.exitForm.experienceID = selectedExperienceInfo.value;
        this.exitForm.expRegistrationID = selectedExperienceInfo.expRegistrationID;

        this.$emit("update-selected-experience", selectedExperienceInfo);
    },   

    // Validate form and proceed if valid
    async handleValidations() {
        this.formSubmitted = true;
        const { valid } = await this.$refs.form.validate();

        if (valid) {
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

    // Find experience display text by ID
    findExperienceText(experienceID) {
        const experience = this.formattedExperiences.find(exp => exp.value === experienceID);
        return experience ? experience.text.trim() : '';
    },

    // Auto-select experience from route parameters
    selectExperienceFromRouteParam() {
        // Handle incomplete form or new form selection
        if (this.tempIncompleteForm && this.tempIncompleteForm.incompleteForm && Object.keys(this.tempIncompleteForm.incompleteForm).length > 0) {
            if (this.startNewSelected) {
                const experienceRegistrationIDFromRoute = useLoggedInUserStore().navigationData.registrationID;
                if (experienceRegistrationIDFromRoute) {
                    const matchingExperience = this.exitForm.experiences.find(exp => exp.expRegistrationID === experienceRegistrationIDFromRoute);

                    if (matchingExperience) {
                        this.selectedExperience = matchingExperience.experienceID;
                        const selectedExperienceText = this.formattedExperiences.find(exp => exp.value === this.selectedExperience)?.text;

                        this.$emit("update-selected-experience", { text: selectedExperienceText, value: this.selectedExperience, expRegistrationID: experienceRegistrationIDFromRoute });
                    } else {
                        console.log('No matching experience found for the given expRegistrationID');
                    }
                }
            }
        } else {
            const experienceRegistrationIDFromRoute = useLoggedInUserStore().navigationData.registrationID;
                if (experienceRegistrationIDFromRoute) {
                    const matchingExperience = this.exitForm.experiences.find(exp => exp.expRegistrationID === experienceRegistrationIDFromRoute);

                    if (matchingExperience) {
                        this.selectedExperience = matchingExperience.experienceID;
                        const selectedExperienceText = this.formattedExperiences.find(exp => exp.value === this.selectedExperience)?.text;

                        this.$emit("update-selected-experience", { text: selectedExperienceText, value: this.selectedExperience, expRegistrationID: experienceRegistrationIDFromRoute });
                    } else {
                        console.log('No matching experience found for the given expRegistrationID');
                    }
                }
        }
    },    
},
}
</script>

<style scoped>
/* Error state styling for required fields */
.error-text {
    color: rgb(176, 0, 32);
}
</style>