<!--
goalFormMain.vue
Main component for the goal setting form with a multi-step stepper interface.
Handles form validation, data persistence, and navigation between different sections
including experience selection, background, growth goals, aspirations, and final review.
-->

<template>
<!-- Title and help dialog -->
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

<!-- Main stepper component with form sections -->
<v-container>
    <v-row>
        <v-col>
            <v-stepper
                :alt-labels="showAltLabels"
                v-model="currentStep"
                :mobile="$vuetify.display.xs"
                :flat="$vuetify.display.xs"
            >
                <!-- Stepper header with navigation steps -->
                <v-stepper-header>
                    <v-stepper-item
                        ref="step0"
                        :title="$t('Experience')"
                        icon="mdi-hand-heart"
                        edit-icon="mdi-hand-heart"
                        value="0"
                        :error="expError"
                        :editable="checkJump(0)"
                    ></v-stepper-item>
                    
                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step1"
                        :title="$t('Background')"
                        icon="mdi-earth"
                        edit-icon="mdi-earth"
                        value="1"
                        :error="commResError"
                        :editable="checkJump(1)"
                    ></v-stepper-item>
                    
                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step2"
                        :title="$t('Growth')"
                        icon="mdi-sprout"
                        edit-icon="mdi-sprout"
                        value="2"
                        :error="growthError"
                        :editable="checkJump(2)"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step3"
                        :title="$t('Aspirations')"
                        icon="mdi-image-filter-hdr"
                        edit-icon="mdi-image-filter-hdr"
                        value="3"
                        :error="aspError"
                        :editable="checkJump(3)"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step4"
                        :title="$t('Goals')"
                        icon="mdi-flag-variant"
                        edit-icon="mdi-flag-variant"
                        value="4"
                        :error="goalsError"
                        :editable="checkJump(4)"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step5"
                        :title="$t('Review')"
                        icon="mdi-check-bold"
                        edit-icon="mdi-check-bold"
                        value="5"
                        :editable="checkJump(5)"
                    ></v-stepper-item>
                </v-stepper-header>

                <!-- Progress bar indicator -->
                <div id="progress-bar" :style="{ width: progressBarWidth }"></div>

                <!-- Desktop/tablet view with window items -->
                <v-container>
                <v-stepper-window v-if="$vuetify.display.smAndUp">
                    <v-stepper-window-item value="0">
                    <goal-form-exp
                        ref="GoalFormExpRef"
                        :goalForm="goalForm"
                        :experiences="experiences"
                        :experienceID="experienceID"
                        :expRegistrationID="expRegistrationIDFromIncomplete"
                        :incompleteFormID="incompleteFormID"
                        @form-valid="handleFormValid"
                        @form-invalid="handleFormInvalid('exp')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('exp', $event)"
                        @update-selected-experience="handleSelectedExperience"
                        @update-found-document-id="foundDocumentId = $event"
                        @update-hich-project="updateHichProject"
                        @update-original-goal-form="updateOriginalGoalForm"
                        @update-experiences="experiences = $event"
                        @update-experienceID="experienceID = $event"
                        @populate-existing-form="handlePopulateExistingForm"
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
                        :isCHWExperience="isCHWExperience"
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
                        :hichProject="goalForm.hichProject"
                        :goalForm="goalForm"
                        @change-step="currentStep = $event"
                    ></goal-form-review>
                    </v-stepper-window-item>                    
                </v-stepper-window>
                </v-container>

                <!-- Mobile view with slide transitions -->
                <v-container v-if="$vuetify.display.xs" class="pa-0 ma-0">
                    <v-scroll-x-reverse-transition group hide-on-leave>
                    <div v-show="currentStep === 0" key="step0">
                        <goal-form-exp
                            ref="GoalFormExpRef"
                            :goalForm="goalForm"
                            :experiences="experiences"
                            :experienceID="experienceID"
                            :expRegistrationID="expRegistrationIDFromIncomplete"
                            :incompleteFormID="incompleteFormID"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('exp')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('exp', $event)"
                            @update-selected-experience="handleSelectedExperience"
                            @update-found-document-id="foundDocumentId = $event"
                            @update-hich-project="updateHichProject"
                            @update-original-goal-form="updateOriginalGoalForm"
                            @update-experiences="experiences = $event"
                            @update-experienceID="experienceID = $event"
                            @populate-existing-form="handlePopulateExistingForm"
                        ></goal-form-exp>
                    </div>
                    <div v-show="currentStep === 1" key="step1">
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
                    </div>
                    <div v-show="currentStep === 2" key="step2">
                        <goal-form-growth
                            ref="GoalFormGrowthRef"
                            :goalForm="goalForm"
                            :isCHWExperience="isCHWExperience"
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
                            :hichProject="goalForm.hichProject"
                            :goalForm="goalForm"
                            @change-step="currentStep = $event"
                        ></goal-form-review>
                    </div>
                    </v-scroll-x-reverse-transition>
                </v-container>

                <!-- Navigation buttons (Previous, Next, Submit) -->
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
                        <!-- Submit button for final step -->
                        <v-btn 
                            v-if="currentStep === 5" 
                            type="submit" 
                            @click="submitFormCleanup" 
                            class="btn"
                        >
                            {{$t('Submit Form')}}
                        </v-btn>
                        <!-- Edit and confirmation buttons for background step when form exists -->
                        <template v-if="currentStep === 1 && hasCompletedGoalForm && !isBackgroundEditActive && $vuetify.display.smAndUp">
                            <v-btn @click="handleBackgroundEditClick" class="mr-5" append-icon="mdi-pencil">Edit</v-btn>
                            <v-btn type="submit" @click="triggerValidation">Looks Good!</v-btn>
                        </template>
                        <!-- Mobile layout for edit and confirmation buttons -->
                        <template v-if="currentStep === 1 && hasCompletedGoalForm && !isBackgroundEditActive && $vuetify.display.xs">
                            <v-row>
                                <v-col>
                                    <v-btn @click="handleBackgroundEditClick" class="mr-5" append-icon="mdi-pencil">Edit</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-btn type="submit" @click="triggerValidation">Looks Good!</v-btn> 
                                </v-col>
                            </v-row>
                        </template>
                        <!-- Next button for regular navigation -->
                        <v-btn 
                            v-else-if="currentStep !== 5 && !(currentStep === 1 && hasCompletedGoalForm && !isBackgroundEditActive)" 
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

<!-- Confirmation dialog for leaving with unsaved changes -->
<v-dialog v-model="leaveDialog" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">
            {{$t('Confirm Navigation')}}
        </v-card-title>
        <v-card-text>
            <p>{{$t('Are you sure you want to leave?')}} <strong>{{$t('Your responses will be saved for later.')}}</strong></p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelLeave">
                {{$t('Cancel')}}
            </v-btn>
            <v-btn color="red darken-2" text @click="confirmLeave">
                {{$t('Yes, Leave')}}
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Dialog for resuming incomplete form -->
<v-dialog v-model="showIncompleteFormFoundDialog" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">
            {{$t('Resume Your Progress?')}}
        </v-card-title>
        <v-card-text>
            <p>{{$t('We found an incomplete Goal Setting Form from your last session. Would you like to continue where you left off or start a new form?')}}</p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="startNew">
                {{$t('Start New')}}
            </v-btn>
            <v-btn color="red darken-2" text @click="continueProgress">
                {{$t('Continue')}}
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
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
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

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
        // Current step and navigation control
        currentStep: 0,
        allowedStepsForJump: [0],
        
        // Error states for each form section
        expError: false,
        commResError: false,
        growthError: false,
        aspError: false,
        goalsError: false,
        
        // Form state and tracking
        foundDocumentId: null,
        hasCompletedGoalForm: false,
        goalSettingFormBackground: null,
        isBackgroundEditActive: false,
        selectedExperience: null,
        formSubmitSuccess: false,
        
        // Experience data
        experiences:[{
            experienceIDFromList:'',
            experienceCategory:'',
            experienceName:''
        }],
        experienceID: null,
        
        // Main goal form data structure
        goalForm: {
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
            { id: 6, label: "REACH", checked: false },
            { id: 7, label: "Volunteered/Interned in a lab", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
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
            { id: 8, label: "Public presentation/communication", checked: false },
            { id: 9, label: "Other", checked: false },
            { id: 10, label: "None of the above", checked: false }
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
            { id: 10, label: "Omeka", checked: false },
            { id: 11, label: "Other", checked: false },
            { id: 12, label: "None of the above", checked: false }
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
            { id: 8, label: "Social Justice", checked: false },
            { id: 9, label: "Public History", checked: false },
            { id: 10, label: "Other", checked: false },
            { id: 11, label: "None of the above", checked: false }
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
            professionalResponsibilityGoal: '',
            socialResponsibilityGoal: '',
            digitalLiteracyGoal: '',
        },
        // Add CHW growth goals (will be populated only for CHW experiences)
        chwGrowthGoals: {
            interpersonalRelationshipBuildingGoal: '',
            serviceCoordinationNavigationGoal: '',
            evaluationResearchGoal: '',
            knowledgeBaseHealthIssuesGoal: '',
            teachingEducationGoal: '',
            advocacyGoal: '',
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
        },
        hichProject: [],
        },
        originalGoalForm: {},
        
        // Dialog and navigation state
        leaveDialog: false,
        nextFunction: null,
        
        // Form persistence and incomplete form handling
        isFirstInput: true,
        incompleteFormID: null,
        showIncompleteFormFoundDialog: false,
        tempIncompleteForm: {},
        expRegistrationIDFromIncomplete: null,
        initialDataLoaded: false,
    }
},
async created() {
    // Initialize debounced function and fetch existing form data
    this.debouncedUpdateGoalForm = debounce(this.updateGoalForm, 1000);
    await this.fetchLatestGoalSettingForm();
},
async mounted() {
  // First check for incomplete forms
  await this.checkIncompleteForm();
  
  // If continuing an incomplete form that already has experience selected
  if (this.expRegistrationIDFromIncomplete) {
    // The form data is already loaded from incomplete form
    // Just ensure the experience selection component knows about it
    this.$nextTick(() => {
      if (this.$refs.GoalFormExpRef) {
        this.$refs.GoalFormExpRef.setSelectedExperience(
          this.expRegistrationIDFromIncomplete
        );
      }
    });
  }
},
watch: {
    // Track current step changes and update allowed navigation
    currentStep(newVal) {
        const newStep = Number(newVal);
        this.currentStep = newStep;

        // Allow navigation to step 5 once visited
        if (newStep === 5 && !this.allowedStepsForJump.includes(newStep)) {
            this.allowedStepsForJump.push(newStep);
        }
    },
    // Watch for goal form changes and trigger auto-save
    goalForm: {
        handler(newVal, oldVal) {
            if (this.initialDataLoaded && this.isFirstInput) {
                this.handleFirstInput();
            } else if (this.initialDataLoaded) {
                this.handleInput();
            }
        },
        deep: true,
    },
},
computed: {
    // Determine if stepper should show alternative labels based on screen size
    showAltLabels() {
        if (this.$vuetify.display.mdAndUp || this.$vuetify.display.xs) {
            return false;
        } else {
            return true;
        }
    },

    // Calculate progress bar width based on current step
    progressBarWidth() {
        const stepWidth = 16.66;
        return `${stepWidth * (this.currentStep + 1)}%`
    },

    // Check if HICH project data should be included in submission
    shouldIncludeHichProject() {
        return this.$refs.GoalFormExpRef?.shouldShowHichCheckboxes && this.goalForm.hichProject.length > 0;
    },

    // Check user login status from store
    isUserLoggedIn() {
        const store = useLoggedInUserStore();
        return store.isLoggedIn;
    },

    // Determine if current experience is CHW type
    isCHWExperience() {
        // Check multiple sources for CHW designation
        if (this.selectedExperience?.value && this.experiences) {
        const experience = this.experiences.find(exp => 
            exp.experienceID === this.selectedExperience.value
        );
        if (experience?.experienceName === "CHW Certification") {
            return true;
        }
        }
        
        // Also check if CHW fields are already populated
        if (this.goalForm.chwGrowthGoals && 
            Object.values(this.goalForm.chwGrowthGoals).some(val => val)) {
        return true;
        }
        
        return false;
    },
},
methods: {
    // Fetch the latest completed goal setting form for background data
    async fetchLatestGoalSettingForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/latest-goal-setting-form';

        try {
            const response = await axios.get(apiURL, { headers: { token } });

            if (response.data.formFound) {
                this.hasCompletedGoalForm = true;
                this.goalSettingFormBackground = response.data.goalSettingFormBackground;
                this.updateGoalFormWithBackgroundData();
                await this.$nextTick();
            } else {
                this.hasCompletedGoalForm = false;
                this.goalSettingFormBackground = null;
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            this.initialDataLoaded = true;
        }
    },

    // Update current form with background data from previous submission
    updateGoalFormWithBackgroundData() {
        if (this.goalSettingFormBackground && this.goalSettingFormBackground.goalForm) {
            const { communityEngagement, researchExperience } = this.goalSettingFormBackground.goalForm;

            this.goalForm.communityEngagement = {
                ...this.goalForm.communityEngagement,
                communityEngagementExperiences: communityEngagement.communityEngagementExperiences,
                communityEngagementExperiencesOther: communityEngagement.communityEngagementExperiencesOther,
                previousEngagementExperiences: communityEngagement.previousEngagementExperiences,
                previousEngagementExperiencesOther: communityEngagement.previousEngagementExperiencesOther,
                engagementActivitiesTools: communityEngagement.engagementActivitiesTools,
                engagementActivitiesToolOther: communityEngagement.engagementActivitiesToolOther,
            };

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

    // Enable editing mode for background section
    handleBackgroundEditClick() {
        this.isBackgroundEditActive = true;
    },

    // Handle successful form validation and advance to next step
    handleFormValid() {
        this.currentStep++;
    },

    // Update methods for child component data
    updateHichProject(newVal) {
        this.goalForm.hichProject = newVal;
    },

    updateOriginalGoalForm(newVal) {
        this.originalGoalForm = this.deepClone(newVal);
    },
    
    // Set error states for form sections
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

    // Scroll to error element for better user experience
    handleScrollToError(element) {
        if (element && element.scrollIntoView) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    },

    // Update validation state for form sections
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

    // Trigger validation for current step
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

    // Individual validation triggers for each form section
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

    // Update selected experience from child component
    async handleSelectedExperience(value) {
        this.selectedExperience = value;
        
        // Check if this experience has a completed form
        if (value && value.hasCompletedForm && value.expRegistrationID) {
        // Fetch and populate the existing form
        await this.fetchExistingGoalForm(value.expRegistrationID);
        }
    },

    // Determine if user can jump to a specific step
    checkJump(step) {
        const stepToSectionMap = {
            1: 'backgroundSection',
            2: 'growthSection',
            3: 'aspirationsSection',
            4: 'goalsSection',
        };

        const section = stepToSectionMap[step];
        const isCurrentStepValid = this.isStepValid(this.currentStep);
        const isSectionEdited = this.isSectionEdited(section);

        return isCurrentStepValid && (isSectionEdited || this.allowedStepsForJump.includes(step));
    },

    // Check if current step has valid data
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

    // Check if a form section has been edited
    isSectionEdited(section) {
        if (section === 'backgroundSection') {
            const originalCommunityEngagement = this.originalGoalForm.communityEngagement;
            const currentCommunityEngagement = this.goalForm.communityEngagement;
            const originalResearchExperience = this.originalGoalForm.researchExperience;
            const currentResearchExperience = this.goalForm.researchExperience;

            const communityEngagementEdited = !isEqual(originalCommunityEngagement, currentCommunityEngagement);
            const researchExperienceEdited = !isEqual(originalResearchExperience, currentResearchExperience);

            const originalGrowthGoal = this.originalGoalForm.growthGoal;
            const currentGrowthGoal = this.goalForm.growthGoal;
            const growthGoalEdited = !isEqual(originalGrowthGoal, currentGrowthGoal);

            return communityEngagementEdited || researchExperienceEdited || growthGoalEdited;
        } else if (section === 'growthSection') {
            const originalGrowthGoal = this.originalGoalForm.growthGoal;
            const currentGrowthGoal = this.goalForm.growthGoal;
            return !isEqual(originalGrowthGoal, currentGrowthGoal);
        } else if (section === 'aspirationsSection') {
            const originalAspirations = this.originalGoalForm.aspirations;
            const currentAspirations = this.goalForm.aspirations;
            return !isEqual(originalAspirations, currentAspirations);
        } else if (section === 'goalsSection') {
            const originalGoals = this.originalGoalForm.goals;
            const currentGoals = this.goalForm.goals;
            return !isEqual(originalGoals, currentGoals);
        }
    },

    // Handle previous button click with validation check
    handlePreviousClick() {
        if (this.isStepValid(this.currentStep)) {
            this.currentStep = Math.max(this.currentStep - 1, 0);
        } else {
            toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: false
            });
        }
    },

    // Clean up form data and submit
    submitFormCleanup() {
        // Clear "Other" text fields if corresponding checkbox not checked
        const isOtherCommunityEngagementExperiencesChecked = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.label === "Other")?.checked || false;

        if (!isOtherCommunityEngagementExperiencesChecked) {
        this.goalForm.communityEngagement.communityEngagementExperiencesOther = '';
        }

        const isOtherPreviousEngagementExperienceChecked = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.label === "Other")?.checked || false;

        if (!isOtherPreviousEngagementExperienceChecked) {
        this.goalForm.communityEngagement.previousEngagementExperiencesOther = '';
        }

        const isOtherEngagementActivitiesToolsChecked = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.label === "Other")?.checked || false;

        if (!isOtherEngagementActivitiesToolsChecked) {
        this.goalForm.communityEngagement.engagementActivitiesToolOther= '';
        }

        const isOtherCurrentResearchExperienceChecked = this.goalForm.researchExperience.currentResearchExperience.find(p => p.label === "Other")?.checked || false;

        if (!isOtherCurrentResearchExperienceChecked) {
        this.goalForm.researchExperience.currentResearchExperienceOther= '';
        }

        const isOtherPreviousResearchExperienceChecked = this.goalForm.researchExperience.previousResearchExperience.find(p => p.label === "Other")?.checked || false;

        if (!isOtherPreviousResearchExperienceChecked) {
        this.goalForm.researchExperience.previousResearchExperienceOther= '';
        }

        const isOtherFamiliarToolsChecked = this.goalForm.researchExperience.familiarTools.find(p => p.label === "Other")?.checked || false;

        if (!isOtherFamiliarToolsChecked) {
        this.goalForm.researchExperience.familiarToolOther= '';
        }

        const isInterestResearchServiceChecked = this.goalForm.researchExperience.interestResearchService.find(p => p.label === "Other")?.checked || false;

        if (!isInterestResearchServiceChecked) {
        this.goalForm.researchExperience.interestResearchServiceOther= '';
        }

        // Clear all background data if form was previously filled
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

    // Reorder aspirations and goals to remove gaps
        const aspirationsArray = [
            this.goalForm.aspirations.aspirationOne,
            this.goalForm.aspirations.aspirationTwo,
            this.goalForm.aspirations.aspirationThree
        ];

        const filledAspirations = aspirationsArray.filter(aspiration => aspiration && aspiration.trim() !== '');

        this.goalForm.aspirations.aspirationOne = filledAspirations[0] || '';
        this.goalForm.aspirations.aspirationTwo = filledAspirations[1] || '';
        this.goalForm.aspirations.aspirationThree = filledAspirations[2] || '';

        const goalsArray = [
            this.goalForm.goals.goalOne,
            this.goalForm.goals.goalTwo,
            this.goalForm.goals.goalThree,
            this.goalForm.goals.goalFour,
            this.goalForm.goals.goalFive
        ];

        const filledGoals = goalsArray.filter(goal => goal && goal.trim() !== '');

        this.goalForm.goals.goalOne = filledGoals[0] || '';
        this.goalForm.goals.goalTwo = filledGoals[1] || '';
        this.goalForm.goals.goalThree = filledGoals[2] || '';
        this.goalForm.goals.goalFour = filledGoals[3] || '';
        this.goalForm.goals.goalFive = filledGoals[4] || '';

        // Submit as update or new form based on existing document
        if (this.foundDocumentId) {
            this.handleUpdateForm();
        } else {
            this.handleSubmitForm();
        }
    },

    // Submit new goal form
    async handleSubmitForm() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const userID = user.userId;
            const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-forms/${this.incompleteFormID}`;
            await axios.patch(apiURL, { completed: true, userID: userID,  }, { headers: { token }});
            this.formSubmitSuccess = true;
            const motivatingMessages = [
                "Goals successfully set! You're on the right track!",
                "Great job setting your goals! Let's make them happen!",
                "Goals locked in! Believe in yourself and you'll achieve them.",
                "You've set your goals! Now, let's conquer them together!",
                "Your goals are set! Keep pushing forward and you'll achieve them.",
                "Way to go! Every goal you set brings you one step closer to success.",
            ];
            const randomMessage = motivatingMessages[Math.floor(Math.random() * motivatingMessages.length)];

            this.updateChecklistStore();

            user.navigationData = {
                toastType: 'success',
                toastMessage: this.$t(randomMessage),
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
            };

            this.$router.push({ 
                name: 'studentDashboard'
            });

        } catch (error) {
            this.handleError(error);
        }
    },

    // Update user's checklist completion status
    async updateChecklistStore() {
        const user = useLoggedInUserStore();
        await user.checkFormCompletion();
    },

    // Update existing goal form
    async handleUpdateForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goal-forms/' + this.foundDocumentId;

        let updatedGoalForm = {
            goalForm: this.goalForm,
            ...(this.shouldIncludeHichProject && { hichProject: this.goalForm.hichProject }),
            tempIncompleteFormID: this.incompleteFormID
        };

        axios.put(apiURL, updatedGoalForm, { headers: { token } })
            .then(() => {
                this.formSubmitSuccess = true;
                const motivatingMessages = [
                    "Goals updated successfully! Keep pushing forward!",
                    "Great job updating your goals! Let's continue on this journey together!",
                    "Goals refreshed! Remember, every step counts towards achieving them.",
                    "You've adjusted your goals! Stay focused and you'll achieve them in no time.",
                    "Way to keep refining your vision! Remember, it's the journey that counts.",
                ];
                const randomMessage = motivatingMessages[Math.floor(Math.random() * motivatingMessages.length)];
                
                this.updateChecklistStore();

                user.navigationData = {
                    toastType: 'info',
                    toastMessage: randomMessage,
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--update'
                };

                this.$router.push({ 
                    name: 'studentDashboard'
                });
            })
            .catch((error) => {
                this.handleError(error);
            });
    },

    // Utility methods for object operations
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    isObjectEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    },

    // Dialog handling methods
    cancelLeave() {
        this.leaveDialog = false;
    },

    confirmLeave() {
        this.dialog = false;
        if (this.nextFunction) {
            this.nextFunction();
            this.nextFunction = null;
        }
    },

    // Create initial incomplete form on first user input
    async handleFirstInput() {
        if (this.isFirstInput) {
            this.isFirstInput = false;

            try {
                const user = useLoggedInUserStore();
                const token = user.token;
                let apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/goal-forms";
                
                const selectedExp = this.experiences.find(exp => exp.experienceID === this.selectedExperience.value);
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
                            socialResponsibilityGoal: this.goalForm.growthGoal.socialResponsibilityGoal,
                            digitalLiteracyGoal: this.goalForm.growthGoal.digitalLiteracyGoal,
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
                
                if (this.shouldIncludeHichProject) {
                    goalFormSubmission.hichProject = this.goalForm.hichProject;
                }

                const response = await axios.post(apiURL, goalFormSubmission, { headers: { token } });
                this.incompleteFormID = response.data.goalForm._id;
            } catch (error) {
                    this.handleError(error);
            }
        }
    },

updateGoalForm() {
    const user = useLoggedInUserStore();
    const token = user.token;
    const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-forms/${this.incompleteFormID}`;
    
    // Keep the destructuring but also extract chwGrowthGoals
    const { hichProject, chwGrowthGoals, ...restOfGoalForm } = this.goalForm;
    
    const payload = {
        goalForm: {
            ...restOfGoalForm,
            hichProject,  // Put hichProject back inside goalForm where it belongs
            // Only include chwGrowthGoals if it's a CHW experience
            ...(this.isCHWExperience && { chwGrowthGoals })
        }
    };
    
    axios.patch(apiURL, payload, { headers: { token }})
        .then(response => {
            console.log('Auto-save successful');
        })
        .catch(error => {
            console.error('Auto-save error:', error);
            this.handleError(error);
        });
},

    // Trigger debounced auto-save
    handleInput() {
        this.debouncedUpdateGoalForm();
    },

    // Check for existing incomplete forms
    async checkIncompleteForm() {
        const user = useLoggedInUserStore();
        const token = user.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-form-incomplete/`;
        try {
            const response = await axios.get(apiURL, { headers: { token } });
            if (response.data.incompleteForm) {
                this.tempIncompleteForm = response.data;
                this.showIncompleteFormFoundDialog = true;
            }
        } catch (error) {
            this.handleError(error);
        }
    },

    // Delete incomplete form and start fresh
    async startNew() {
        const user = useLoggedInUserStore();
        const token = user.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-forms/${this.tempIncompleteForm.incompleteForm._id}`;

        try {
            await axios.delete(apiURL, { headers: { token } });
            this.tempIncompleteForm = {};
            this.showIncompleteFormFoundDialog = false;
        } catch (error) {
            this.handleError(error);
        }
    },

    // Continue with incomplete form data
    continueProgress() {
        this.isFirstInput = false;
        this.goalForm = this.tempIncompleteForm.incompleteForm.goalForm;
        this.expRegistrationIDFromIncomplete = this.tempIncompleteForm.incompleteForm.expRegistrationID;
        this.incompleteFormID = this.tempIncompleteForm.incompleteForm._id;
        this.goalForm.hichProject = this.tempIncompleteForm.incompleteForm.hichProject;
        this.showIncompleteFormFoundDialog = false;

        // Trigger validations for all sections
        this.$nextTick(() => {
            this.triggerCommResValidation();
            this.triggerGrowthValidation();
            this.triggerAspValidation();
            this.triggerGoalsValidation();
        });
    },

  async fetchExistingGoalForm(expRegistrationID) {
    const user = useLoggedInUserStore();
    const token = user.token;
    const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-forms/by-registration/${expRegistrationID}`;
    
    try {
      const response = await axios.get(apiURL, { headers: { token } });
      
      if (response.data.formFound) {
        const existingForm = response.data.goalForm;
        
        // Store the document ID for updating
        this.foundDocumentId = existingForm._id;
        
        // Pre-populate all form fields
        this.handlePopulateExistingForm(existingForm.goalForm);
        
        // Handle HICH project if present
        if (existingForm.hichProject) {
          this.goalForm.hichProject = existingForm.hichProject;
        }
        
        return true; // Form was found and populated
      }
      return false; // No form found
    } catch (error) {
      console.error('Error fetching existing goal form:', error);
      return false;
    }
  },
  
handlePopulateExistingForm(existingGoalForm) {
    // Handle both direct object and wrapped response
    const formData = existingGoalForm.goalForm || existingGoalForm;
    
    if (!formData) return;
    
    // Community Engagement
    if (formData.communityEngagement) {
        this.goalForm.communityEngagement = {
            ...this.goalForm.communityEngagement,
            ...formData.communityEngagement
        };
    }
    
    // Research Experience
    if (formData.researchExperience) {
        this.goalForm.researchExperience = {
            ...this.goalForm.researchExperience,
            ...formData.researchExperience
        };
    }
    
    // Growth Goals
    if (formData.growthGoal) {
        this.goalForm.growthGoal = {
            ...this.goalForm.growthGoal,
            ...formData.growthGoal
        };
    }
    
    // CHW Growth Goals (if present)
    if (formData.chwGrowthGoals) {
        this.goalForm.chwGrowthGoals = {
            ...this.goalForm.chwGrowthGoals,
            ...formData.chwGrowthGoals
        };
    }
    
    // Aspirations
    if (formData.aspirations) {
        this.goalForm.aspirations = {
            ...this.goalForm.aspirations,
            ...formData.aspirations
        };
    }
    
    // Goals
    if (formData.goals) {
        this.goalForm.goals = {
            ...this.goalForm.goals,
            ...formData.goals
        };
    }
    
    // HICH Project
    if (existingGoalForm.hichProject || formData.hichProject) {
        this.goalForm.hichProject = existingGoalForm.hichProject || formData.hichProject;
    }
    
    // Store the populated form as original for comparison
    this.originalGoalForm = this.deepClone(this.goalForm);
    
    // Allow navigation to all steps since form is complete
    this.$nextTick(() => {
        this.allowedStepsForJump = [0, 1, 2, 3, 4, 5];
    });
},
},

// Navigation guard to prevent data loss
beforeRouteLeave(to, from, next) {
    if (!this.isUserLoggedIn || this.formSubmitSuccess) {
        next();
        return;
    }

    if (!this.isObjectEqual(this.goalForm, this.originalGoalForm)) {
        this.nextFunction = next;
        this.leaveDialog = true;
    } else {
        next();
    }
},
}
</script>

<style scoped>
/* Progress bar styling */
#progress-bar {
    height: 4px;
    background-color: #c8102e;
    transition: width 0.3s ease;
}
</style>