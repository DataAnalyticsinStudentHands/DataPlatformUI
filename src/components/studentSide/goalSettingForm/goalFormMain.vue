<template>
<!-- Title -->
<v-container style="width: 100%; margin: 0 auto;">
    <div style="display: flex; align-items:center;">
        <p class="font-weight-black text-h5 text--primary">
            {{ $t("Goal Setting Form") }}
        </p>
        <v-dialog width="500">
            <template v-slot:activator="{ props }">
                <v-btn
                    size="x-small"
                    class="pb-2"
                    variant="text"
                    icon="mdi-help-circle-outline"
                    flat
                    v-bind="props"
                >
                </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card :title="$t('Goal Setting Form')">
                    <v-card-text>
                    {{$t('The goal setting process helps us to continue to tailor classes and programming to the needs our students. We do use your feedback to improve future classes and programs. Goal setting also allows you to be more intentional as you go through the experience and gives you a chance to reflect at the end of the course.')}}
                    </v-card-text>

                    <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        text="Close"
                        @click="isActive.value = false"
                    ></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
    <p class="text-subtitle-1">{{$t("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.")}}</p>
</v-container>

<!-- Stepper Component -->
<v-container>
    <v-row>
        <v-col>
            <v-stepper
                :alt-labels="showAltLabels"
                v-model="currentStep"
                :mobile="$vuetify.display.sm"
                :flat="$vuetify.display.xs"
            >
                <v-stepper-header>
                    <v-stepper-item
                        ref="step0"
                        title="Experience"
                        icon="mdi-hand-heart"
                        edit-icon="mdi-hand-heart"
                        value="0"
                        :error="expError"
                        :editable="checkJump(0)"
                    ></v-stepper-item>
                    
                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step1"
                        title="Background"
                        icon="mdi-earth"
                        edit-icon="mdi-earth"
                        value="1"
                        :error="commResError"
                        :editable="checkJump(1)"
                    ></v-stepper-item>
                    
                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step2"
                        title="Growth"
                        icon="mdi-sprout"
                        edit-icon="mdi-sprout"
                        value="2"
                        :error="growthError"
                        :editable="checkJump(2)"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step3"
                        title="Aspirations"
                        icon="mdi-image-filter-hdr"
                        edit-icon="mdi-image-filter-hdr"
                        value="3"
                        :error="aspError"
                        :editable="checkJump(3)"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step4"
                        title="Goals"
                        icon="mdi-flag-variant"
                        edit-icon="mdi-flag-variant"
                        value="4"
                        :error="goalsError"
                        :editable="checkJump(4)"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step5"
                        title="Review"
                        icon="mdi-check-bold"
                        edit-icon="mdi-check-bold"
                        value="5"
                        :editable="checkJump(5)"
                    ></v-stepper-item>
                </v-stepper-header>


                <!-- Progress Bar -->
                <div id="progress-bar" :style="{ width: progressBarWidth }"></div>

                <!-- Non-Mobile View -->
                <v-container>
                <v-stepper-window v-if="$vuetify.display.smAndUp">
                    <v-stepper-window-item value="0">
                    <goal-form-exp
                        ref="GoalFormExpRef"
                        :goalForm="goalForm"
                        @form-valid="handleFormValid"
                        @form-invalid="handleFormInvalid('exp')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('exp', $event)"
                        @update-selected-experience="handleSelectedExperience"
                        @update-found-document-id="foundDocumentId = $event"
                        @update-hich-project="updateHichProject"
                    ></goal-form-exp>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="1">
                    <goal-form-comm-res
                        ref="GoalFormCommResRef"
                        :goalForm="goalForm"
                        :hasCompletedGoalForm="hasCompletedGoalForm"
                        :is-background-edit-active="isBackgroundEditActive"
                        @form-valid="handleFormValid"
                        @form-invalid="handleFormInvalid('commRes')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('commRes', $event)"
                    ></goal-form-comm-res>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="2">
                    <goal-form-growth
                        ref="GoalFormGrowthRef"
                        :goalForm="goalForm"
                        @form-valid="handleFormValid"
                        @form-invalid="handleFormInvalid('growth')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('growth', $event)"
                    ></goal-form-growth>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="3">
                    <goal-form-asp
                        ref="GoalFormAspRef"
                        :goalForm="goalForm"
                        @form-valid="handleFormValid"
                        @form-invalid="handleFormInvalid('asp')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('asp', $event)"
                    ></goal-form-asp>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="4">
                    <goal-form-goals
                        ref="GoalFormGoalsRef"
                        :goalForm="goalForm"
                        @form-valid="handleFormValid"
                        @form-invalid="handleFormInvalid('goals')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('goals', $event)"
                    ></goal-form-goals>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="5">
                    <goal-form-review
                        ref="GoalFormReviewRef"
                        :selectedExperience="selectedExperience"
                        :hasCompletedGoalForm="hasCompletedGoalForm"
                        :isBackgroundEditActive="isBackgroundEditActive"
                        :goalForm="goalForm"
                        @change-step="currentStep = $event"
                    ></goal-form-review>
                    </v-stepper-window-item>                    
                </v-stepper-window>
                </v-container>

                <!-- Mobile View with Vuetify Slide Transition -->
                <v-container v-if="$vuetify.display.xs" class="pa-0 ma-0">
                    <v-scroll-x-reverse-transition group hide-on-leave>
                    <div v-show="currentStep === 0" key="step0">
                        <goal-form-exp
                            ref="GoalFormExpRef"
                            :goalForm="goalForm"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('exp')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('exp', $event)"
                            @update-selected-experience="handleSelectedExperience"
                            @update-found-document-id="foundDocumentId = $event"
                            @update-hich-project="updateHichProject"
                        ></goal-form-exp>
                    </div>
                    <div v-show="currentStep === 1" key="step1">
                        <goal-form-comm-res
                            ref="GoalFromCommRes"
                            :goalForm="goalForm"
                            :hasCompletedGoalForm="hasCompletedGoalForm"
                            :is-background-edit-active="isBackgroundEditActive"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('commRes')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('commRes', $event)"
                        ></goal-form-comm-res>
                    </div>
                    <div v-show="currentStep === 2" key="step2">
                        <goal-form-growth
                            ref="GoalFormGrowthRef"
                            :goalForm="goalForm"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('growth')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('growth', $event)"
                        ></goal-form-growth>
                    </div>
                    <div v-show="currentStep === 3" key="step3">
                        <goal-form-asp
                            ref="GoalFormAspRef"
                            :goalForm="goalForm"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('asp')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('asp', $event)"
                        ></goal-form-asp>
                    </div>
                    <div v-show="currentStep === 4" key="step4">
                            <goal-form-goals
                            ref="GoalFormGoalsRef"
                            :goalForm="goalForm"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('goals')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('goals', $event)"
                        ></goal-form-goals>
                    </div>
                    <div v-show="currentStep === 5" key="step5">
                        <goal-form-review
                            ref="GoalFormReviewRef"
                            :selectedExperience="selectedExperience"
                            :hasCompletedGoalForm="hasCompletedGoalForm"
                            :isBackgroundEditActive="isBackgroundEditActive"
                            :goalForm="goalForm"
                            @change-step="currentStep = $event"
                        ></goal-form-review>
                    </div>
                    </v-scroll-x-reverse-transition>
                </v-container>

                <!-- Previous, Next, and Submit buttons -->
                <v-row justify="space-between" class="ma-1">
                    <v-col cols="auto">
                        <v-btn
                            v-if="currentStep !== 0"
                            type="button" 
                            @click="handlePreviousClick"
                            class="btn"
                        >
                        {{$t('Previous')}}
                        </v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <!-- Conditional rendering for Submit Form button -->
                        <v-btn 
                            v-if="currentStep === 5" 
                            type="submit" 
                            @click="submitFormCleanup" 
                            class="btn"
                        >
                            {{$t('Submit Form')}}
                        </v-btn>
                        <!-- Edit and Looks Good! buttons for step 1 when form exists -->
                        <template v-if="currentStep === 1 && hasCompletedGoalForm && !isBackgroundEditActive">
                            <v-btn @click="handleBackgroundEditClick" class="mr-5" append-icon="mdi-pencil">Edit</v-btn>
                            <v-btn type="submit" @click="triggerValidation">Looks Good!</v-btn>
                        </template>
                        <!-- Next button for other steps -->
                        <v-btn 
                            v-else-if="currentStep !== 5" 
                            type="submit" 
                            @click="triggerValidation" 
                            class="btn"
                        >
                            {{$t('Next')}}
                        </v-btn>
                    </v-col>
                </v-row>



            </v-stepper>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { toast } from 'vue3-toastify';

import GoalFormExp from './goalFormExp.vue';
import GoalFormCommRes from './goalFormCommRes.vue';
import GoalFormGrowth from './goalFormGrowth.vue';
import GoalFormAsp from './goalFormAsp.vue';
import GoalFormGoals from './goalFormGoals.vue';
import GoalFormReview from './goalFormReview.vue';

export default {
name: "GoalSettingForm",
components: {
    GoalFormExp,
    GoalFormCommRes,
    GoalFormGrowth,
    GoalFormAsp,
    GoalFormGoals,
    GoalFormReview
},
data() {
    return {
        currentStep: 0,
        allowedStepsForJump: [0],
        expError: false,
        commResError: false,
        growthError: false,
        aspError: false,
        goalsError: false,
        foundDocumentId: null,
        hasCompletedGoalForm: false,
        goalSettingFormBackground: null,
        isBackgroundEditActive: false,
        selectedExperience: null,
        hichProject: [],
        goalForm: {
        experiences:[{
            experienceIDFromList:'',
            experienceCategory:'',
            experienceName:''
        }],
        experienceID: null,
        communityEngagement: {
            communityEngagementExperiences: [
            { id: 1, label: "Volunteer organizations (e.g. scouts, nonprofits, food banks)", checked: false },
            { id: 2, label: "Political campaigns", checked: false },
            { id: 3, label: "Faith based organizations", checked: false },
            { id: 4, label: "Short-term volunteer opportunities (e.g. day of service events)", checked: false },
            { id: 5, label: "Medical mission trips", checked: false },
            { id: 6, label: "Other", checked: false },
            { id: 7, label: "None of the above", checked: false }
            ],
            communityEngagementExperiencesOther: '',
            previousEngagementExperiences: [
            { id: 1, label: "Mentoring someone", checked: false },
            { id: 2, label: "Volunteering at a community event (e.g. health fair)", checked: false },
            { id: 3, label: "Recruiting volunteers", checked: false },
            { id: 4, label: "Organizing a service project", checked: false },
            { id: 5, label: "Serving as translator", checked: false },
            { id: 6, label: "Fundraising", checked: false },
            { id: 7, label: "Emergency response volunteering", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
            ],
            previousEngagementExperiencesOther: '',
            engagementActivitiesTools: [
            { id: 1, label: "Social media", checked: false },
            { id: 2, label: "Scheduling software (e.g. when is good, doodle)", checked: false },
            { id: 3, label: "Fundraising platforms", checked: false },
            { id: 4, label: "Survey tools", checked: false },
            { id: 5, label: "Graphic design tools (e.g. adobe, canva)", checked: false },
            { id: 6, label: "Project management Tool", checked: false },
            { id: 7, label: "Digital media (e.g. podcasting, streaming video)", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
            ],
            engagementActivitiesToolOther: '',
        },
        researchExperience: {
            currentResearchExperience: [
            { id: 1, label: "Introduction to Statistics / Introduction to Biostatistics / Introduction to Research courses", checked: false },
            { id: 2, label: "Advanced statistics and programming courses", checked: false },
            { id: 3, label: "HERE", checked: false },
            { id: 4, label: "SURF", checked: false },
            { id: 5, label: "PURS", checked: false },
            { id: 6, label: "Volunteered/Interned in a lab", checked: false },
            { id: 7, label: "Other", checked: false },
            { id: 8, label: "None of the above", checked: false }
            ],
            currentResearchExperienceOther: '',
            previousResearchExperience: [
            { id: 1, label: "Designing your own research project", checked: false },
            { id: 2, label: "Literature review", checked: false },
            { id: 3, label: "Data collection in a clinical setting", checked: false },
            { id: 4, label: "Data collection in a laboratory setting", checked: false },
            { id: 5, label: "Data collection in a public health/community setting", checked: false },
            { id: 6, label: "Analyzing data with a statistical package", checked: false },
            { id: 7, label: "Writing/assisting with a manuscript", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
            ],
            previousResearchExperienceOther: '',
            familiarTools: [
            { id: 1, label: "Excel", checked: false },
            { id: 2, label: "R", checked: false },
            { id: 3, label: "Python", checked: false },
            { id: 4, label: "STATA", checked: false },
            { id: 5, label: "GIS", checked: false },
            { id: 6, label: "ATLAS", checked: false },
            { id: 7, label: "Nvivo", checked: false },
            { id: 8, label: "Tableau", checked: false },
            { id: 9, label: "SAS", checked: false },
            { id: 10, label: "Other", checked: false },
            { id: 11, label: "None of the above", checked: false }
            ],
            familiarToolOther: '',
            interestResearchService: [
            { id: 1, label: "Education", checked: false },
            { id: 2, label: "Community Health", checked: false },
            { id: 3, label: "Mental Health", checked: false },
            { id: 4, label: "Incarceration / Criminal Justice", checked: false },
            { id: 5, label: "Chronic Disease", checked: false },
            { id: 6, label: "Environment and occupational health", checked: false },
            { id: 7, label: "Government/Law/Policy", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
            ],
            interestResearchServiceOther: '',
            leadershipOption: ''
        },
        growthGoal: {
            problemSolvingGoal: '',
            effectiveCommunicationGoal: '',
            teamworkGoal: '',
            culturalHumilityGoal: '',
            ethicalDecisionMakingGoal: '',
            professionalResponsibilityGoal: ''
        },
        aspirations: {
            aspirationOne: '',
            aspirationTwo: '',
            aspirationThree: '',
        },
        goals: {
            goalOne: '',
            goalTwo: '',
            goalThree: '',
            goalFour: '',
            goalFive: '',
        }
        },
    }
},
created() {
    this.fetchLatestGoalSettingForm();
},
watch: {
    currentStep(newVal) {
        // Convert newVal to a number and update currentStep
        this.currentStep = Number(newVal);

        // Check if the converted currentStep is higher than the highest step in allowedStepsForJump
        if (this.allowedStepsForJump.length === 0 || this.currentStep > Math.max(...this.allowedStepsForJump)) {
            this.allowedStepsForJump.push(this.currentStep);
        }
    }
},
computed: {
    showAltLabels() {
        if (this.$vuetify.display.mdAndUp || this.$vuetify.display.xs) {
            return false;
        } else {
            return true;
        }
    },

    progressBarWidth() {
        const stepWidth = 16.66;
        return `${stepWidth * (this.currentStep + 1)}%`
    },

    shouldIncludeHichProject() {
        // Access the child component's computed property via a ref
        // Ensure to handle cases where the child component or the computed property is not available
        return this.$refs.GoalFormExpRef?.shouldShowHichCheckboxes && this.hichProject.length > 0;
    }
},
methods: {
    async fetchLatestGoalSettingForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/latest-goal-setting-form';

        try {
            const response = await axios.get(apiURL, { headers: { token } });

            // Check if a goal setting form was found
            if (response.data.formFound) {
                this.hasCompletedGoalForm = true;
                this.goalSettingFormBackground = response.data.goalSettingFormBackground;
                this.updateGoalFormWithBackgroundData();
            } else {
                this.hasCompletedGoalForm = false;
                this.goalSettingFormBackground = null;
            }
        } catch (error) {
            this.handleError(error);
        }
    },

    updateGoalFormWithBackgroundData() {
        if (this.goalSettingFormBackground && this.goalSettingFormBackground.goalForm) {
            const { communityEngagement, researchExperience } = this.goalSettingFormBackground.goalForm;

            // Update communityEngagement
            this.goalForm.communityEngagement = {
                ...this.goalForm.communityEngagement,
                communityEngagementExperiences: communityEngagement.communityEngagementExperiences,
                communityEngagementExperiencesOther: communityEngagement.communityEngagementExperiencesOther,
                previousEngagementExperiences: communityEngagement.previousEngagementExperiences,
                previousEngagementExperiencesOther: communityEngagement.previousEngagementExperiencesOther,
                engagementActivitiesTools: communityEngagement.engagementActivitiesTools,
                engagementActivitiesToolOther: communityEngagement.engagementActivitiesToolOther,
            };

            // Update researchExperience
            this.goalForm.researchExperience = {
                ...this.goalForm.researchExperience,
                currentResearchExperience: researchExperience.currentResearchExperience,
                currentResearchExperienceOther: researchExperience.currentResearchExperienceOther,
                previousResearchExperience: researchExperience.previousResearchExperience,
                previousResearchExperienceOther: researchExperience.previousResearchExperienceOther,
                familiarTools: researchExperience.familiarTools,
                familiarToolOther: researchExperience.familiarToolOther,
                interestResearchService: researchExperience.interestResearchService,
                interestResearchServiceOther: researchExperience.interestResearchServiceOther,
                leadershipOption: researchExperience.leadershipOption,
            };
        }
    },

    handleBackgroundEditClick() {
        this.isBackgroundEditActive = true;
    },


    handleFormValid() {
        this.currentStep++;
    },

    updateHichProject(newVal) {
        this.hichProject = newVal;
    },
    
    handleFormInvalid(section) {
        if (section === "exp") {
            this.expError = true;
        } else if (section === "commRes") {
            this.commResError = true;
        } else if (section === "growth") {
            this.growthError = true;
        } else if (section === "asp") {
            this.aspError = true;
        } else if (section === "goals") {
            this.goalsError = true;
        }
    },

    handleScrollToError(element) {
        if (element && element.scrollIntoView) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    },

    handleValidationChange(section, { isValid }) {
        if (section === "exp") {
            this.expError = !isValid;
        } else if (section === "commRes") {
            this.commResError = !isValid;
        } else if (section === "growth") {
            this.growthError = !isValid;
        } else if (section === "asp") {
            this.aspError = !isValid;
        } else if (section === "goals") {
            this.goalsError = !isValid;
        }
    },

    triggerValidation() {
        if (this.currentStep === 0) {
            this.triggerExpValidation();
        } else if (this.currentStep === 1) {
            this.triggerCommResValidation();
        } else if (this.currentStep === 2) {
            this.triggerGrowthValidation();
        } else if (this.currentStep === 3) {
            this.triggerAspValidation();
        } else if (this.currentStep === 4) {
            this.triggerGoalsValidation();
        }
    },

    triggerExpValidation() {
        if (this.$refs.GoalFormExpRef) {
            this.$refs.GoalFormExpRef.handleValidations();
        }
    },

    triggerCommResValidation() {
        if (this.$refs.GoalFormCommResRef) {
            this.$refs.GoalFormCommResRef.handleValidations();
        }
    },

    triggerGrowthValidation() {
        if (this.$refs.GoalFormGrowthRef) {
            this.$refs.GoalFormGrowthRef.handleValidations();
        }
    },

    triggerAspValidation() {
        if (this.$refs.GoalFormAspRef) {
            this.$refs.GoalFormAspRef.handleValidations();
        }
    },    

    triggerGoalsValidation() {
        if (this.$refs.GoalFormGoalsRef) {
            this.$refs.GoalFormGoalsRef.handleValidations();
        }
    },

    handleSelectedExperience(value) {
        this.selectedExperience = value;
    },

    stepVisited(step) {
        if (!this.visitedSteps.includes(step)) {
            this.visitedSteps.push(step);
        }
    },

    checkJump(step) {
        // Check if the current step is valid
        const isCurrentStepValid = this.isStepValid(this.currentStep);

        // Allow jump if the step is allowed and the current step is valid
        return isCurrentStepValid && this.allowedStepsForJump.includes(step);
    },

    isStepValid(step) {
        switch(step) {
            case 0: return !this.expError;
            case 1: return !this.commResError;
            case 2: return !this.growthError;
            case 3: return !this.aspError;
            case 4: return !this.goalsError;
            default: return true;
        }
    },

    handlePreviousClick() {
        // Check if the current step has errors
        if (this.isStepValid(this.currentStep)) {
            // Navigate to the previous step if there are no errors
            this.currentStep = Math.max(this.currentStep - 1, 0);
        } else {
            // Show the toast error message
            toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: false
            });
        }
    },

    submitFormCleanup() {
        // Check condition for "Other" text fields
        const isOtherCommunityEngagementExperiencesChecked = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.id === 6)?.checked || false;

        if (!isOtherCommunityEngagementExperiencesChecked) {
        this.goalForm.communityEngagement.communityEngagementExperiencesOther = '';
        }

        const isOtherPreviousEngagementExperienceChecked = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.id === 8)?.checked || false;

        if (!isOtherPreviousEngagementExperienceChecked) {
        this.goalForm.communityEngagement.previousEngagementExperiencesOther = '';
        }

        const isOtherEngagementActivitiesToolsChecked = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.id === 8)?.checked || false;

        if (!isOtherEngagementActivitiesToolsChecked) {
        this.goalForm.communityEngagement.engagementActivitiesToolOther= '';
        }

        const isOtherCurrentResearchExperienceChecked = this.goalForm.researchExperience.currentResearchExperience.find(p => p.id === 7)?.checked || false;

        if (!isOtherCurrentResearchExperienceChecked) {
        this.goalForm.researchExperience.currentResearchExperienceOther= '';
        }

        const isOtherPreviousResearchExperienceChecked = this.goalForm.researchExperience.previousResearchExperience.find(p => p.id === 8)?.checked || false;

        if (!isOtherPreviousResearchExperienceChecked) {
        this.goalForm.researchExperience.previousResearchExperienceOther= '';
        }

        const isOtherFamiliarToolsChecked = this.goalForm.researchExperience.familiarTools.find(p => p.id === 10)?.checked || false;

        if (!isOtherFamiliarToolsChecked) {
        this.goalForm.researchExperience.familiarToolOther= '';
        }

        const isInterestResearchServiceChecked = this.goalForm.researchExperience.interestResearchService.find(p => p.id === 8)?.checked || false;

        if (!isInterestResearchServiceChecked) {
        this.goalForm.researchExperience.interestResearchServiceOther= '';
        }

        //Check conditions for having not filled out form previously for semester (nested dependencies)
        if (this.isGoalSettingFormFilled === 'Yes') {
        this.goalForm.communityEngagement.communityEngagementExperiences.forEach(experience => {
            experience.checked = false;
        });
        this.goalForm.communityEngagement.communityEngagementExperiencesOther = '';
        
        this.goalForm.communityEngagement.previousEngagementExperiences.forEach(experience => {
            experience.checked = false;
        });
        this.goalForm.communityEngagement.previousEngagementExperiencesOther = '';
        
        this.goalForm.communityEngagement.engagementActivitiesTools.forEach(experience => {
            experience.checked = false;
        });
        this.goalForm.communityEngagement.engagementActivitiesToolOther = '';
        
        this.goalForm.researchExperience.currentResearchExperience.forEach(experience => {
            experience.checked = false;
        });
        this.goalForm.researchExperience.currentResearchExperienceOther = '';
        
        this.goalForm.researchExperience.previousResearchExperience.forEach(experience => {
            experience.checked = false;
        });
        this.goalForm.researchExperience.previousResearchExperienceOther = '';
        
        this.goalForm.researchExperience.familiarTools.forEach(experience => {
            experience.checked = false;
        });
        this.goalForm.researchExperience.familiarToolOther = '';
        
        this.goalForm.researchExperience.interestResearchService.forEach(experience => {
            experience.checked = false;
        });
        this.goalForm.researchExperience.interestResearchServiceOther = '';
        
        this.goalForm.researchExperience.leadershipOption = '';
    }

    // Ensure that aspirations and goals are in order

    // Extract the aspirations from the goalForm
        const aspirationsArray = [
            this.goalForm.aspirations.aspirationOne,
            this.goalForm.aspirations.aspirationTwo,
            this.goalForm.aspirations.aspirationThree
        ];

        // Filter out empty aspirations
        const filledAspirations = aspirationsArray.filter(aspiration => aspiration && aspiration.trim() !== '');

        // Reset the aspirations in the goalForm
        this.goalForm.aspirations.aspirationOne = filledAspirations[0] || '';
        this.goalForm.aspirations.aspirationTwo = filledAspirations[1] || '';
        this.goalForm.aspirations.aspirationThree = filledAspirations[2] || '';

        // Extract the goals from the goalForm
        const goalsArray = [
            this.goalForm.goals.goalOne,
            this.goalForm.goals.goalTwo,
            this.goalForm.goals.goalThree,
            this.goalForm.goals.goalFour,
            this.goalForm.goals.goalFive
        ];

        // Filter out empty goals
        const filledGoals = goalsArray.filter(goal => goal && goal.trim() !== '');

        // Reset the goals in the goalForm
        this.goalForm.goals.goalOne = filledGoals[0] || '';
        this.goalForm.goals.goalTwo = filledGoals[1] || '';
        this.goalForm.goals.goalThree = filledGoals[2] || '';
        this.goalForm.goals.goalFour = filledGoals[3] || '';
        this.goalForm.goals.goalFive = filledGoals[4] || '';

        // After cleaning up the data, check whether to update or create
        if (this.foundDocumentId) {
            this.handleUpdateForm();
        } else {
            // If previously filled document wasn't found, create new document
            this.handleSubmitForm();
            
        }
    },

    handleSubmitForm() {
        const user = useLoggedInUserStore();
        const token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/goal-forms";
        // Find the expRegistrationID corresponding to the selected experience
        const selectedExp = this.goalForm.experiences.find(exp => exp.experienceID === this.selectedExperience.value);

        const expRegistrationID = selectedExp.expRegistrationID;

        const goalFormSubmission = {
            expRegistrationID,
            experienceID: this.selectedExperience.value,
            goalForm: {
                communityEngagement: {
                    communityEngagementExperiences: this.goalForm.communityEngagement.communityEngagementExperiences,
                    communityEngagementExperiencesOther: this.goalForm.communityEngagement.communityEngagementExperiencesOther,
                    previousEngagementExperiences: this.goalForm.communityEngagement.previousEngagementExperiences,
                    previousEngagementExperiencesOther: this.goalForm.communityEngagement.previousEngagementExperiencesOther,
                    engagementActivitiesTools: this.goalForm.communityEngagement.engagementActivitiesTools,
                    engagementActivitiesToolOther: this.goalForm.communityEngagement.engagementActivitiesToolOther,
                },
                researchExperience: {
                    currentResearchExperience: this.goalForm.researchExperience.currentResearchExperience,
                    currentResearchExperienceOther: this.goalForm.researchExperience.currentResearchExperienceOther,
                    previousResearchExperience: this.goalForm.researchExperience.previousResearchExperience,
                    previousResearchExperienceOther: this.goalForm.researchExperience.previousResearchExperienceOther,
                    familiarTools: this.goalForm.researchExperience.familiarTools,
                    familiarToolOther: this.goalForm.researchExperience.familiarToolOther,
                    interestResearchService: this.goalForm.researchExperience.interestResearchService,
                    interestResearchServiceOther: this.goalForm.researchExperience.interestResearchServiceOther,
                    leadershipOption: this.goalForm.researchExperience.leadershipOption,
                },
                growthGoal: {
                    problemSolvingGoal: this.goalForm.growthGoal.problemSolvingGoal,
                    effectiveCommunicationGoal: this.goalForm.growthGoal.effectiveCommunicationGoal,
                    teamworkGoal: this.goalForm.growthGoal.teamworkGoal,
                    culturalHumilityGoal: this.goalForm.growthGoal.culturalHumilityGoal,
                    ethicalDecisionMakingGoal: this.goalForm.growthGoal.ethicalDecisionMakingGoal,
                    professionalResponsibilityGoal: this.goalForm.growthGoal.professionalResponsibilityGoal,
                },
                aspirations: {
                    aspirationOne: this.goalForm.aspirations.aspirationOne,
                    aspirationTwo: this.goalForm.aspirations.aspirationTwo,
                    aspirationThree: this.goalForm.aspirations.aspirationThree,
                },
                goals: {
                    goalOne: this.goalForm.goals.goalOne,
                    goalTwo: this.goalForm.goals.goalTwo,
                    goalThree: this.goalForm.goals.goalThree,
                    goalFour: this.goalForm.goals.goalFour,
                    goalFive: this.goalForm.goals.goalFive,
                },
            },
        }
        // Conditionally add hichProject if it should be included
        if (this.shouldIncludeHichProject) {
            goalFormSubmission.hichProject = this.hichProject;
        }

        axios
        .post(apiURL, goalFormSubmission, { headers: { token } })
        .then(() => {
            const motivatingMessages = [
            "Goals successfully set! You're on the right track!",
            "Great job setting your goals! Let's make them happen!",
            "Goals locked in! Believe in yourself and you'll achieve them.",
            "You've set your goals! Now, let's conquer them together!",
            "Your goals are set! Keep pushing forward and you'll achieve them.",
            "Way to go! Every goal you set brings you one step closer to success.",
            ];
            const randomMessage = motivatingMessages[Math.floor(Math.random() * motivatingMessages.length)];

            // Update pinia store
            this.updateChecklistStore();

        
            this.$router.push({ 
                name: 'studentDashboard',
                params: {
                    toastType: 'success',
                    toastMessage: this.$t(randomMessage),
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--create'
                }
            });
        })
        .catch((error) => {
            this.handleError(error);
        });
    },

    async updateChecklistStore() {
        const user = useLoggedInUserStore();
        await user.checkFormCompletion();
    },

    async handleUpdateForm() {   
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goal-forms/' + this.foundDocumentId;

        let updatedGoalForm = {
            goalForm: this.goalForm,
            // Conditionally add hichProject if it should be included
            ...(this.shouldIncludeHichProject && { hichProject: this.hichProject })
        };

        axios.put(apiURL, updatedGoalForm, { headers: { token } })
            .then(() => {
                const motivatingMessages = [
                    "Goals updated successfully! Keep pushing forward!",
                    "Great job updating your goals! Let's continue on this journey together!",
                    "Goals refreshed! Remember, every step counts towards achieving them.",
                    "You've adjusted your goals! Stay focused and you'll achieve them in no time.",
                    "Way to keep refining your vision! Remember, it's the journey that counts.",
                ];
                const randomMessage = motivatingMessages[Math.floor(Math.random() * motivatingMessages.length)];
                
                // Update pinia store
                this.updateChecklistStore();

                this.$router.push({ 
                        name: 'studentDashboard',
                        params: {
                        toastType: 'info',
                        toastMessage: randomMessage,
                        toastPosition: 'top-right',
                        toastCSS: 'Toastify__toast--update'
                    }
                    });
            })
            .catch((error) => {
                this.handleError(error);
            });
    },

},

}
</script>

<style scoped>
#progress-bar {
    height: 4px;
    background-color: #c8102e;
    transition: width 0.3s ease;
}
</style>