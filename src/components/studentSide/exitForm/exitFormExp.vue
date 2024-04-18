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
                <v-autocomplete
                    v-model="selectedExperience"
                    :label="$t('Select an Experience')"
                    :items="formattedExperiences"
                    item-title="text"
                    item-value="value"
                    clearable
                    @update:modelValue="updateExperienceID"
                    :rules="experienceIDRules"
                    required
                ></v-autocomplete>
                </div>
            </v-col>
        </v-row>

        <v-row dense style="padding-bottom: 1rem;" v-show="selectedExperience">
            <v-col cols="11">
                <!-- Container without min-height -->
                <div style="display: flex; flex-direction: column; align-items: flex-start; min-height: 3.8rem; justify-content: center;">
                <!-- Loading wheel -->
                <v-progress-circular 
                    v-show="isLoadingExpCheck"
                    indeterminate 
                    size="20"
                ></v-progress-circular>

                <!-- Message when experienceFoundWarning is true -->
                <div v-if="experienceFoundWarning" style="display: flex; align-items: center; color: #4A90E2; font-weight: bold;">
                    <v-icon left small style="margin-right: 0.5rem; color: #4A90E2;">mdi-alert-circle</v-icon>
                    {{$t('Hi there! You have already filled out an Exit Form for this experience. Please note that submitting another form for the same experience will overwrite your previous responses.')}}
                </div>

                <!-- Message when experienceFoundWarning is false -->
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
    isFirstInput: Boolean,
    expRegistrationIDFromIncomplete: String
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change", "update-original-exit-form", "update-selected-experience", "update-found-document-id", "reset-exit-form", "update-activities-exist", "update-goal-form-exists", "reset-error-flags", "update-incomplete-exp-registration"],
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
    const user = useLoggedInUserStore();

    // Translations
    if (user.languagePreference === "Spanish") {
        // Set to Spanish
        this.$i18n.locale = 'es';
    } else {
        // Default to English
        this.$i18n.locale = 'en';
    }
    user.startLoading();

    try {
        this.fetchExperiences().then(() => {
        // this.fetchHasFilledForm();
        this.selectExperienceFromRouteParam();
        });

    } catch (error) {
        // Handle any errors that occur during the fetch operations
        this.handleError('Error:', error);
    } finally {
        user.stopLoading();
    }
},
watch: {
    selectedExperience(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        console.log('checkExistingForm called');
        this.checkExistingForm(newVal);
      }
      if (!newVal) {
        this.experienceFoundWarning = null;
      }
    },

    hasValidationErrors(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.$emit('validation-change', { isValid: !newValue });
        }
    },

    expRegistrationIDFromIncomplete(newVal) {
        if (newVal) {
            const matchedExperience = this.exitForm.experiences.find(experience => experience.expRegistrationID === newVal);
            this.selectedExperience = matchedExperience ? matchedExperience.experienceID : null;
        }
    },

},
computed: {
    isExperienceIDInvalid() {
      if (!this.formSubmitted) return false;
      return this.selectedExperience === null || this.selectedExperience === '';
    },

    formattedExperiences() {
      return this.exitForm.experiences.map(experience => ({
        text: `${experience.experienceCategory}: ${experience.experienceName}`,
        value: experience.experienceID,
        expRegistrationID: experience.expRegistrationID  // Include the registration ID
      }));
    },

    hasValidationErrors() {
        if (!this.formSubmitted) return false;
        return this.isExperienceIDInvalid;
    },
},
methods: {
    async fetchExperiences() {
        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experiences-available-for-forms/exit-forms/';

        try {
            const response = await axios.get(apiURL, { headers: { token } });
            
            // Create a deep copy of this.exitForm
            let tempExitForm = JSON.parse(JSON.stringify(this.exitForm));
            
            // Map the response data to the tempExitForm's experiences
            tempExitForm.experiences = response.data.map(experience => ({
            experienceID: experience._id,
            experienceCategory: experience.experienceCategory,
            experienceName: experience.experienceName,
            expRegistrationID: experience.expRegistrationID
            }));
            
            // Emit the event with the original exit form to update it elsewhere as needed
            this.$emit("update-original-exit-form", tempExitForm);

            // Now update this.exitForm with the changes from tempExitForm
            this.exitForm.experiences = tempExitForm.experiences;
            
        } catch (error) {
            this.handleError(error);
        }
    },

    async checkExistingForm() {
        this.isLoadingExpCheck = true;
        const selectedExperienceInfo = this.formattedExperiences.find(exp => exp.value === this.selectedExperience);
        const expRegistrationID = selectedExperienceInfo ? selectedExperienceInfo.expRegistrationID : null;
        this.$emit('reset-exit-form');

        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/has-completed-EF-for-registration/';

        try {
            const response = await axios.get(apiURL + `${expRegistrationID}`, {
                headers: {
                    token: token
                }
            });

            console.log('response: ', response.data);

            if (response.data.goalFormFound) {
                this.$emit('update-goal-form-exists', response.data.goalFormFound);

                // Create a deep copy of this.exitForm
                let tempExitForm = JSON.parse(JSON.stringify(this.exitForm));

                const goalFormData = response.data.goalForm;

                // Set the goal setting form ID
                tempExitForm.goalSettingFormID = goalFormData._id;

                // Update aspirations
                tempExitForm.aspiration1 = goalFormData.goalForm.aspirations?.aspirationOne;
                tempExitForm.aspiration2 = goalFormData.goalForm.aspirations?.aspirationTwo;
                tempExitForm.aspiration3 = goalFormData.goalForm.aspirations?.aspirationThree;
                // Update goals
                tempExitForm.goal1 = goalFormData.goalForm.goals?.goalOne;
                tempExitForm.goal2 = goalFormData.goalForm.goals?.goalTwo;
                tempExitForm.goal3 = goalFormData.goalForm.goals?.goalThree;
                tempExitForm.goal4 = goalFormData.goalForm.goals?.goalFour;
                tempExitForm.goal5 = goalFormData.goalForm.goals?.goalFive;
                
                // Emit the event with the original exit form to update it elsewhere as needed
                this.$emit("update-original-exit-form", tempExitForm);

                // Update exitForm
                // Set the goal setting form ID
                this.exitForm.goalSettingFormID = goalFormData._id;

                // Update aspirations
                this.exitForm.aspiration1 = goalFormData.goalForm.aspirations?.aspirationOne;
                this.exitForm.aspiration2 = goalFormData.goalForm.aspirations?.aspirationTwo;
                this.exitForm.aspiration3 = goalFormData.goalForm.aspirations?.aspirationThree;
                // Update goals
                this.exitForm.goal1 = goalFormData.goalForm.goals?.goalOne;
                this.exitForm.goal2 = goalFormData.goalForm.goals?.goalTwo;
                this.exitForm.goal3 = goalFormData.goalForm.goals?.goalThree;
                this.exitForm.goal4 = goalFormData.goalForm.goals?.goalFour;
                this.exitForm.goal5 = goalFormData.goalForm.goals?.goalFive;

            } else {
                // Create a deep copy of this.exitForm
                let tempExitForm = JSON.parse(JSON.stringify(this.exitForm));

                tempExitForm.goalSettingFormID = null;
                // Update aspirations
                tempExitForm.aspiration1 = null;
                tempExitForm.aspiration2 = null;
                tempExitForm.aspiration3 = null;
                // Update goals
                tempExitForm.goal1 = null;
                tempExitForm.goal2 = null;
                tempExitForm.goal3 = null;
                tempExitForm.goal4 = null;
                tempExitForm.goal5 = null;

                // Emit the event with the original exit form to update it elsewhere as needed
                this.$emit("update-original-exit-form", tempExitForm);

                // Update exitForm
                this.exitForm.goalSettingFormID = null;
                // Update aspirations
                this.exitForm.aspiration1 = null;
                this.exitForm.aspiration2 = null;
                this.exitForm.aspiration3 = null;
                // Update goals
                this.exitForm.goal1 = null;
                this.exitForm.goal2 = null;
                this.exitForm.goal3 = null;
                this.exitForm.goal4 = null;
                this.exitForm.goal5 = null;
            }

            // If an Exit Form document wasn't found
            if (response.data && response.data.exitFormFound === false) {
                this.$emit('update-found-document-id', null);
                this.experienceFoundWarning = false;
            }
            // If an Exit Form document was found
            else if (response.data && response.data.exitFormFound) {
                this.$emit('update-found-document-id', response.data.exitFormID);
                this.experienceFoundWarning = true;
            } else {
                this.$emit('update-found-document-id', null);
                this.experienceFoundWarning = false;
            }

            if (response.data && response.data.activities && response.data.activities.length > 0) {
                this.exitForm.experienceActivities = response.data.activities;
                this.$emit('update-activities-exist', true);
            } else {
                this.$emit('update-activities-exist', false);
            }

            this.$emit('reset-error-flags');


        } catch (error) {
            this.handleError("An unexpected error occurred while checking for existing form:", error);
        } finally {
            this.isLoadingExpCheck = false;
            if (this.expRegistrationIDFromIncomplete && this.expRegistrationIDFromIncomplete.length) {
                this.$emit("update-incomplete-exp-registration");
            }
        }
    },

    updateExperienceID(selected) {
        const selectedExperienceInfo = this.formattedExperiences.find(exp => exp.value === selected);

        if (!selected) {
            this.exitForm.experienceID = null;
            this.exitForm.expRegistrationID = null;
            this.$emit("update-selected-experience", null); // Emit null if no experience is selected
            return;
        }

        // Create a deep copy of this.exitForm
        let tempExitForm = JSON.parse(JSON.stringify(this.exitForm));

        // Include both experienceID and expRegistrationID in the emitted data
        tempExitForm.experienceID = selectedExperienceInfo.value;
        tempExitForm.expRegistrationID = selectedExperienceInfo.expRegistrationID;

        // Update original Exit Form first
        // Emit the event with the original exit form to update it elsewhere as needed
        this.$emit("update-original-exit-form", tempExitForm);

        // Update exitForm
        this.exitForm.experienceID = selectedExperienceInfo.value;
        this.exitForm.expRegistrationID = selectedExperienceInfo.expRegistrationID;

        // Emit an object with all necessary details
        this.$emit("update-selected-experience", selectedExperienceInfo);
    },   

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

    findExperienceText(experienceID) {
        const experience = this.formattedExperiences.find(exp => exp.value === experienceID);
        return experience ? experience.text.trim() : '';
    },

    selectExperienceFromRouteParam() {
        const experienceRegistrationIDFromRoute = this.$route.params.registrationID;
        if (experienceRegistrationIDFromRoute) {
            // Find the experience in the array that matches the expRegistrationID
            const matchingExperience = this.exitForm.experiences.find(exp => exp.expRegistrationID === experienceRegistrationIDFromRoute);

            if (matchingExperience) {
                // Set the selectedExperience to the experienceID of the matching experience
                this.selectedExperience = matchingExperience.experienceID;
                // Find the text corresponding to the selected value
                const selectedExperienceText = this.formattedExperiences.find(exp => exp.value === this.selectedExperience)?.text;

                // Emit an object with both text and value
                this.$emit("update-selected-experience", { text: selectedExperienceText, value: this.selectedExperience, expRegistrationID: experienceRegistrationIDFromRoute });
            } else {
                console.log('No matching experience found for the given expRegistrationID');
            }
        }
    },    
},
}
</script>

<style scoped>
.error-text {
    color: rgb(176, 0, 32);
}

</style>