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
                    {{$t('Hi there! You have already filled out a Goal Setting Form for this experience. Please note that submitting another form for the same experience will overwrite your previous responses.')}}
                </div>

                <!-- Message when experienceFoundWarning is false -->
                <div v-if="experienceFoundWarning === false" style="display: flex; align-items: center; color: #4CAF50; font-weight: bold;">
                    <v-icon left small style="margin-right: 0.5rem; color: #4CAF50;">mdi-check-circle</v-icon>
                    {{$t("You haven't filled out a Goal Setting form for this experience. Complete this form to start your progress!")}}
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
name: "GoalFormExperiences",
props: {
    goalForm: Object,
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change", "update-selected-experience", "update-found-document-id"],
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
        this.fetchHasFilledForm();
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
        console.log('selectedExperience newVal: ', newVal);
        console.log('selectedExperience oldVal: ', oldVal);
      if (newVal && newVal !== oldVal) {
        this.checkExistingForm(newVal);
      }
      if (!newVal) {
        this.experienceFoundWarning = null;
      }
    },

    isExperienceIDInvalid(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.$emit("validation-change", { isValid: !newVal });
        }
    },
},
computed: {
    isExperienceIDInvalid() {
      if (!this.formSubmitted) return false;
      return this.selectedExperience === null || this.selectedExperience === '';
    },

    formattedExperiences() {
      return this.goalForm.experiences.map(experience => ({
        text: `${experience.experienceCategory}: ${experience.experienceName}`,
        value: experience.experienceID
      }));
    },
},
methods: {
    async fetchExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/current-sessions-experiences/';

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.goalForm.experiences = response.data.map(experience => ({
          experienceID: experience._id,
          experienceCategory: experience.experienceCategory,
          experienceName: experience.experienceName,
          expRegistrationID: experience.expRegistrationID
        }));
        console.log('this.goalForm.experiences: ', this.goalForm.experiences);
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchHasFilledForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/has-filled-goal-setting-form/';

        try {
        const response = await axios.get(apiURL, {
            headers: {
            token: token
            }
        });
        this.hasFilledForm = response.data.hasFilled;
        if (this.hasFilledForm) {
            this.goalForm.communityEngagement = response.data.communityEngagement;
            this.goalForm.researchExperience = response.data.researchExperience;
        }

        } catch (error) {
            this.handleError("Error fetching form fill status:", error);
        }
    },

    async checkExistingForm() {
        this.isLoadingExpCheck = true;
        console.log('this.selectedExperience: ', this.selectedExperience);
        const experienceID = this.selectedExperience;
        console.log('experienceID: ', experienceID);
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/has-completed-GSF-for-experience/';
        console.log('apiURL: ', apiURL);

        try {
            const response = await axios.get(apiURL + `${experienceID}`, {
            headers: {
                token: token
            }
            });

            console.log('response: ', response.data);

            // If the document wasn't found
            if (response.data.documentFound === false) {
                console.log('document wasnt found');
                this.$emit('update-found-document-id', null);
                this.experienceFoundWarning = false;
            return;
            }

            // If a document was found
            if (response.data && response.data.id) {
                console.log('document was found');
                this.$emit('update-found-document-id', response.data.id);
                this.experienceFoundWarning = true;
            } else {
                this.$emit('update-found-document-id', null);
                this.experienceFoundWarning = false;
            }
        } catch (error) {
            this.handleError("An unexpected error occurred while checking for existing form:", error);
        } finally {
            this.isLoadingExpCheck = false; 
        }
    },

    updateExperienceID(selected) {
        if (!selected) {
            this.goalForm.experienceID = null;
            this.$emit("update-selected-experience", null); // Emit null if no experience is selected
            return;
        }

        // The selected variable already has the experienceID
        console.log('selected: ', selected);
        this.goalForm.experienceID = selected;
        console.log('this.goalForm.experienceID: ', this.goalForm.experienceID);

        // Find the text corresponding to the selected value
        const selectedExperienceText = this.formattedExperiences.find(exp => exp.value === selected)?.text;

        // Emit an object with both text and value
        this.$emit("update-selected-experience", { text: selectedExperienceText, value: selected });
    },

    selectExperienceFromRouteParam() {
        const experienceRegistrationIDFromRoute = this.$route.params.id;
        console.log('experienceRegistrationIDFromRoute: ', experienceRegistrationIDFromRoute);
        if (experienceRegistrationIDFromRoute) {
            // Find the experience in the array that matches the expRegistrationID
            const matchingExperience = this.goalForm.experiences.find(exp => exp.expRegistrationID === experienceRegistrationIDFromRoute);

            if (matchingExperience) {
                // Set the selectedExperience to the experienceID of the matching experience
                this.selectedExperience = matchingExperience.experienceID;
            } else {
                console.log('No matching experience found for the given expRegistrationID');
            }
        }
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
},
}
</script>

<style scoped>
.error-text {
    color: rgb(176, 0, 32);
}

</style>