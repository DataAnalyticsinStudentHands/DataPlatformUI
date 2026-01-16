<!--
goalFormExp.vue
Form component for experience selection in the goal setting process.
Allows users to select which experience they're completing the form for,
checks for existing forms, and conditionally displays HICH project selection
with validation and loading states.
-->

<template>
<div>
<!-- Main form wrapper with validation handling -->
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
    <v-container style="width: 100%; margin: 0 auto;">
        <v-row>
            <v-col>
                <p 
                    class="font-weight-black text-h6"
                >{{$t('Experience')}}</p>
            </v-col>
        </v-row>
        <v-row></v-row>
        <v-col cols="12"></v-col>
        
        <!-- Experience selection section -->
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

        <!-- Experience status feedback section -->
        <v-row dense style="padding-bottom: 1rem;" v-show="selectedExperience">
            <v-col cols="11">
                <div style="display: flex; flex-direction: column; align-items: flex-start; min-height: 3.8rem; justify-content: center;">
                <!-- Loading indicator for form checking -->
                <v-progress-circular 
                    v-show="isLoadingExpCheck"
                    indeterminate 
                    size="20"
                ></v-progress-circular>

                <!-- Warning message when form already exists -->
                <div v-if="experienceFoundWarning" style="display: flex; align-items: center; color: #4A90E2; font-weight: bold;">
                    <v-icon left small style="margin-right: 0.5rem; color: #4A90E2;">mdi-alert-circle</v-icon>
                    {{$t('Hi there! You have already filled out a Goal Setting Form for this experience. Please note that submitting another form for the same experience will overwrite your previous responses.')}}
                </div>

                <!-- Success message when no existing form found -->
                <div v-if="experienceFoundWarning === false" style="display: flex; align-items: center; color: #4CAF50; font-weight: bold;">
                    <v-icon left small style="margin-right: 0.5rem; color: #4CAF50;">mdi-check-circle</v-icon>
                    {{$t("You haven't filled out a Goal Setting form for this experience. Complete this form to start your progress!")}}
                </div>
                </div>
            </v-col>
        </v-row>
        
        <!-- HICH Projects conditional selection section -->
        <v-fade-transition>
            <v-row v-if="shouldShowHichCheckboxes">
                <v-col cols="12">
                    <p :class="{'error-text': isHICHProjectInvalid}" class="font-weight-black text-h8">
                        {{$t('Please select which HICH Project you are involved in:')}}
                    </p>

                    <v-checkbox
                        v-for="(item, index) in hichCheckboxItems"
                        :key="index"
                        :label="item"
                        :value="item"
                        v-model="hichProject"
                        :class="{'error-text': isHICHProjectInvalid}"
                        density="compact"
                        class="ma-0 pa-0" 
                        hide-details="true"
                    ></v-checkbox>
                    <div v-if="isHICHProjectInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
                </v-col>
            </v-row>
        </v-fade-transition>
    </v-container>
</v-form>
</div>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';
import axios from "axios";

export default {
name: "GoalFormExperiences",
props: {
    goalForm: Object,
    experiences: Array,
    experienceID: String,
    expRegistrationID: String,
    incompleteFormID: String
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change", "update-selected-experience", "update-found-document-id", "update-hich-project", "update-original-goal-form", "update-experiences", "update-experienceID"],
data() {
    return {
        // Form state and validation
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
      
      // Loading and status indicators
      isLoadingExpCheck: false,
      experienceFoundWarning: null,
      
      // HICH project data
      hichProject: [],
      hichCheckboxItems: [
        'BREATHE',
        'Creative Care',
        'Operation Fusion',
        'PEERS',
        'Responsive Resourcing',
        'SAIID',
        'WEAR'
        ],
        
      // Local data management
      localExperiences: [],
      localExperienceID: null,
      prevHichProject: [],
    }
},
mounted() {
    // Set up language preference and fetch initial data
    const user = useLoggedInUserStore();

    if (user.languagePreference === "Spanish") {
        this.$i18n.locale = 'es';
    } else {
        this.$i18n.locale = 'en';
    }
    user.startLoading();

    try {
        this.fetchExperiences().then(() => {
        this.fetchHasFilledForm();
        this.selectExperienceFromRouteParam();
        });

    } catch (error) {
        this.handleError('Error:', error);
    } finally {
        user.stopLoading();
    }
},
watch: {
    // Watch for experience selection changes
    selectedExperience(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.checkExistingForm(newVal);
        this.updateIncompleteForm(newVal);
      }
      if (!newVal) {
        this.experienceFoundWarning = null;
      }

        // Reset HICH project selection when not applicable
        if (!this.shouldShowHichCheckboxes) {
            this.hichProject = [];
        }
    },

    // Emit validation state changes to parent
    hasValidationErrors(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.$emit('validation-change', { isValid: !newValue });
        }
    },

    // Sync goal form data with local HICH project selection
    goalForm: {
        handler(newVal) {
            if (newVal && newVal.hichProject) {
                this.hichProject = newVal.hichProject;
            }
        },
        deep: true,
        immediate: true,
    },

    // Emit HICH project updates to parent
    hichProject(newVal) {
        if ((this.prevHichProject.length > 0 && newVal.length === 0) || newVal.length > 0) {
            this.$emit("update-hich-project", newVal);
        }
        this.prevHichProject = [...newVal];
    },

    // Handle registration ID from incomplete forms
    expRegistrationID(newVal) {
        if (newVal) {
            this.selectExperienceMatchingRegistrationID();
        }
    },
},
computed: {
    // Validate experience selection
    isExperienceIDInvalid() {
      if (!this.formSubmitted) return false;
      return this.selectedExperience === null || this.selectedExperience === '';
    },

    // Format experiences for dropdown display
    // Now uses expRegistrationID as value (unique) and includes instructor if present
    formattedExperiences() {
      return this.experiences.map(experience => {
        // Build the display text
        let text = `${experience.experienceCategory}: ${experience.experienceName}`;
        
        // Append instructor if present
        if (experience.instructor) {
          text += ` (Instructor: ${experience.instructor})`;
        }
        
        return {
          text: text,
          value: experience.expRegistrationID, // Use expRegistrationID as unique identifier
          experienceID: experience.experienceID, // Keep for reference
          instructor: experience.instructor // Keep for reference
        };
      });
    },

    // Determine if HICH project checkboxes should be shown
    // Uses the base experience text (without instructor) for checking
    shouldShowHichCheckboxes() {
        const experienceText = this.findExperienceBaseText(this.selectedExperience);
        return experienceText.includes('HICH - Project Volunteer') || experienceText.includes('HICH - Project Head');
    },

    // Validate HICH project selection when required
    isHICHProjectInvalid() {
        if (!this.formSubmitted) return false;
        return this.shouldShowHichCheckboxes && this.hichProject.length === 0;
    },

    // Overall form validation state
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
        return this.isExperienceIDInvalid || this.isHICHProjectInvalid;
    },
},
methods: {
    // Fetch available experiences from API
    async fetchExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/experiences-available-for-forms/goal-forms/';

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.localExperiences = response.data.map(experience => ({
          experienceID: experience._id,
          experienceCategory: experience.experienceCategory,
          experienceName: experience.experienceName,
          expRegistrationID: experience.expRegistrationID,
          expInstanceID: experience.expInstanceID,
          instructor: experience.instructor || null // Capture instructor field
        }));
        this.$emit("update-original-goal-form", this.goalForm);
        this.$emit("update-experiences", this.localExperiences);
      } catch (error) {
        this.handleError(error);
      }
    },

    // Check if user has previously filled goal setting form
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

    // Check if form already exists for selected experience
    // Now uses expRegistrationID to find the experienceID for the API call
    async checkExistingForm() {
        this.isLoadingExpCheck = true;
        
        // Find the experience object using expRegistrationID (the new value)
        const selectedExp = this.experiences.find(exp => exp.expRegistrationID === this.selectedExperience);
        if (!selectedExp) {
            this.isLoadingExpCheck = false;
            return;
        }
        
        const experienceID = selectedExp.experienceID;
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/has-completed-GSF-for-experience/';

        try {
            const response = await axios.get(apiURL + `${experienceID}`, {
            headers: {
                token: token
            }
            });

            if (response.data.documentFound === false) {
                this.$emit('update-found-document-id', null);
                this.experienceFoundWarning = false;
            return;
            }

            if (response.data && response.data.id) {
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

    // Handle experience selection and emit updates
    // Updated to work with expRegistrationID as the value
    updateExperienceID(selected) {
        if (!selected) {
            this.localExperienceID = null;
            this.$emit("update-selected-experience", null);
            this.$emit("update-experienceID", this.localExperienceID);
            return;
        }

        // Find the full experience object
        const selectedExp = this.experiences.find(exp => exp.expRegistrationID === selected);
        if (selectedExp) {
            this.localExperienceID = selectedExp.experienceID;
        }
        
        const selectedExperienceData = this.formattedExperiences.find(exp => exp.value === selected);

        this.$emit("update-selected-experience", { 
            text: selectedExperienceData?.text, 
            value: selected,
            experienceID: selectedExp?.experienceID,
            instructor: selectedExp?.instructor
        });
        this.$emit("update-experienceID", this.localExperienceID);
    },

    // Select experience based on route parameter
    selectExperienceFromRouteParam() {
        const experienceRegistrationIDFromRoute = useLoggedInUserStore().navigationData.registrationID;
        if (experienceRegistrationIDFromRoute) {
            const matchingExperience = this.experiences.find(exp => exp.expRegistrationID === experienceRegistrationIDFromRoute);

            if (matchingExperience) {
                // Set selectedExperience to expRegistrationID (the new value format)
                this.selectedExperience = matchingExperience.expRegistrationID;
                const selectedExperienceData = this.formattedExperiences.find(exp => exp.value === this.selectedExperience);

                this.$emit("update-selected-experience", { 
                    text: selectedExperienceData?.text, 
                    value: this.selectedExperience,
                    experienceID: matchingExperience.experienceID,
                    instructor: matchingExperience.instructor
                });
            } else {
                console.log('No matching experience found for the given expRegistrationID');
            }
        }
    },    

    // Handle form validation with HICH project checks
    async handleValidations() {
        this.formSubmitted = true;
        const { valid } = await this.$refs.form.validate();

        let hichProjectValid = true;
        if (this.shouldShowHichCheckboxes && this.hichProject.length === 0) {
            hichProjectValid = false;
            toast.error(this.$t("Please select at least one HICH Project."), {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: false
            });
        }

        if (valid && hichProjectValid) {
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

    // Find experience full text by expRegistrationID for display purposes
    findExperienceText(expRegistrationID) {
        const experience = this.formattedExperiences.find(exp => exp.value === expRegistrationID);
        return experience ? experience.text.trim() : '';
    },

    // Find experience base text (without instructor) for HICH checkbox logic
    findExperienceBaseText(expRegistrationID) {
        const experience = this.experiences.find(exp => exp.expRegistrationID === expRegistrationID);
        if (!experience) return '';
        return `${experience.experienceCategory}: ${experience.experienceName}`.trim();
    },

    // Select experience that matches registration ID
    selectExperienceMatchingRegistrationID() {
        if (this.expRegistrationID && this.experiences.length) {
            const foundExperience = this.experiences.find(experience => experience.expRegistrationID === this.expRegistrationID);
            if (foundExperience) {
                // Set selectedExperience to expRegistrationID (the new value format)
                this.selectedExperience = foundExperience.expRegistrationID;
                this.updateExperienceID(this.selectedExperience);
            }
        }
    },

    // Update incomplete form with new experience selection
    async updateIncompleteForm(value) {
        // Find experience using expRegistrationID (the new value)
        const selectedExperienceObject = this.localExperiences.find(exp => exp.expRegistrationID === this.selectedExperience);
        if (this.incompleteFormID && selectedExperienceObject) {
            try {
                const user = useLoggedInUserStore();
                const token = user.token;
                const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-forms/${this.incompleteFormID}`
                await axios.patch(apiURL, {expRegistrationID: selectedExperienceObject.expRegistrationID}, { headers: { token } });
            } catch (error) {
                this.handleError(error);
            } finally {
                this.formSubmitted = true;
                const { valid } = await this.$refs.form.validate();

                let hichProjectValid = true;
                if (this.shouldShowHichCheckboxes && this.hichProject.length === 0) {
                    hichProjectValid = false;
                    toast.error(this.$t("Please select at least one HICH Project."), {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete',
                        multiple: false
                    });
                }

                if (!valid || !hichProjectValid) {
                    this.$emit('form-invalid');
                    toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete',
                        multiple: false
                    });
                }
            }
        }
    }
},
}
</script>

<style scoped>
/* Error text styling */
.error-text {
    color: rgb(176, 0, 32);
}

/* Section title styling */
.section-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 10px;
}

/* Review section title styling */
.review-section-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>