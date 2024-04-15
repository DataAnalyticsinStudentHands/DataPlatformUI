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
                :mobile="$vuetify.display.xs"
                :flat="$vuetify.display.xs"
            >
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


                <!-- Progress Bar -->
                <div id="progress-bar" :style="{ width: progressBarWidth }"></div>

                <!-- Non-Mobile View -->
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
                        :hichProject="goalForm.hichProject"
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
                        <template v-if="currentStep === 1 && hasCompletedGoalForm && !isBackgroundEditActive && $vuetify.display.smAndUp">
                            <v-btn @click="handleBackgroundEditClick" class="mr-5" append-icon="mdi-pencil">Edit</v-btn>
                            <v-btn type="submit" @click="triggerValidation">Looks Good!</v-btn>
                        </template>
                        <!-- Edit and Looks Good! buttons for step 1 when form exists, but for mobile -->
                        <template v-if="currentStep === 1 && hasCompletedGoalForm && !isBackgroundEditActive && $vuetify.display.xs">
                            <!-- <v-btn @click="handleBackgroundEditClick" class="mr-5" append-icon="mdi-pencil">Editxs</v-btn>
                            <v-btn type="submit" @click="triggerValidation">Looks Good!xs</v-btn> -->
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
                        <!-- Next button for other steps -->
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
<!-- Confirm Leave Dialog -->
<v-dialog v-model="leaveDialog" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">
            Confirm Navigation
        </v-card-title>
        <v-card-text>
            <p>Are you sure you want to leave? <strong>Your responses will be saved for later.</strong></p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelLeave">
                Cancel
            </v-btn>
            <v-btn color="red darken-2" text @click="confirmLeave">
                Yes, Leave
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- Incomplete Form Found Dialog -->
<v-dialog v-model="showIncompleteFormFoundDialog" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">
            Resume Your Progress?
        </v-card-title>
        <v-card-text>
            <p>We found an incomplete Goal Setting Form from your last session. Would you like to continue where you left off or start a new form?</p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="startNew">
                Start New
            </v-btn>
            <v-btn color="red darken-2" text @click="continueProgress">
                Continue
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
        formSubmitSuccess: false,
        experiences:[{
            experienceIDFromList:'',
            experienceCategory:'',
            experienceName:''
        }],
        experienceID: null,
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
        },
        hichProject: [],
        },
        originalGoalForm: {},
        leaveDialog: false,
        nextFunction: null,
        isFirstInput: true,
        incompleteFormID: null,
        showIncompleteFormFoundDialog: false,
        tempIncompleteForm: {},
        expRegistrationIDFromIncomplete: null,
        initialDataLoaded: false,

    }
},
async created() {
    // Initialize the debounced function
    this.debouncedUpdateGoalForm = debounce(this.updateGoalForm, 1000);
    await this.fetchLatestGoalSettingForm();
},
async mounted() {
    await this.checkIncompleteForm();
},
watch: {
    currentStep(newVal) {
        const newStep = Number(newVal); // Convert newVal to a number

        // Update currentStep with the new value
        this.currentStep = newStep;

        // Specifically track visitation to step 5
        if (newStep === 5 && !this.allowedStepsForJump.includes(newStep)) {
            this.allowedStepsForJump.push(newStep);
        }
    },
    goalForm: {
        handler(newVal, oldVal) {
            if (this.initialDataLoaded && this.isFirstInput) {
                this.handleFirstInput();
            } else if (this.initialDataLoaded) {
                // Use the debounced method for subsequent updates
                this.handleInput();
            }
        },
        deep: true,
    },
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
        return this.$refs.GoalFormExpRef?.shouldShowHichCheckboxes && this.goalForm.hichProject.length > 0;
    },

    isUserLoggedIn() {
        const store = useLoggedInUserStore();
        return store.isLoggedIn;
    },
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
                // Wait for the next DOM update cycle to complete
                await this.$nextTick();
            } else {
                this.hasCompletedGoalForm = false;
                this.goalSettingFormBackground = null;
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            // Set initialDataLoaded to true after handling both found and not found cases
            this.initialDataLoaded = true;
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
        this.goalForm.hichProject = newVal;
    },

    updateOriginalGoalForm(newVal) {
        this.originalGoalForm = this.deepClone(newVal);;
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

        // User can jump if the current step is valid and the corresponding section is edited
        return isCurrentStepValid && (isSectionEdited || this.allowedStepsForJump.includes(step));
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
            console.log('handleUpdateForm')
            this.handleUpdateForm();
        } else {
            // If previously filled document wasn't found, create new document
            console.log('handleSubmitForm')
            this.handleSubmitForm();
        }
    },

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

        } catch (error) {
            this.handleError(error);
        }
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

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    isObjectEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    },

    cancelLeave() {
        this.leaveDialog = false;
    },

    confirmLeave() {
        this.dialog = false;
        if (this.nextFunction) {
            this.nextFunction();
            this.nextFunction = null; // Clear the stored next function
        }
    },

    async handleFirstInput() {
        if (this.isFirstInput) {
            this.isFirstInput = false;

            try {
                const user = useLoggedInUserStore();
                const token = user.token;
                let apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/goal-forms";
                // Find the expRegistrationID corresponding to the selected experience
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
        const userID = user.userId;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-forms/${this.incompleteFormID}`;

        const { hichProject, ...restOfGoalForm } = this.goalForm;
        
        const payload = {
            goalForm: restOfGoalForm, 
            hichProject
        };

        axios.patch(apiURL, payload, { headers: { token }})
            .then(response => {
            })
            .catch(error => {
                this.handleError(error);
            });
    },

    handleInput() {
        this.debouncedUpdateGoalForm();
    },

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

    continueProgress() {
        this.isFirstInput = false;
        this.goalForm = this.tempIncompleteForm.incompleteForm.goalForm;
        this.expRegistrationIDFromIncomplete = this.tempIncompleteForm.incompleteForm.expRegistrationID;
        this.incompleteFormID = this.tempIncompleteForm.incompleteForm._id;
        this.goalForm.hichProject = this.tempIncompleteForm.incompleteForm.hichProject;
        this.showIncompleteFormFoundDialog = false;
    },

    isSectionEdited(section) {
        if (section === 'backgroundSection') {
            // Compare the relevant parts of goalForm against their original values
            const originalCommunityEngagement = this.originalGoalForm.communityEngagement;
            const currentCommunityEngagement = this.goalForm.communityEngagement;
            const originalResearchExperience = this.originalGoalForm.researchExperience;
            const currentResearchExperience = this.goalForm.researchExperience;

            // Use lodash's isEqual to perform deep comparison
            const communityEngagementEdited = !isEqual(originalCommunityEngagement, currentCommunityEngagement);
            const researchExperienceEdited = !isEqual(originalResearchExperience, currentResearchExperience);

            return communityEngagementEdited || researchExperienceEdited;
        } else if (section === 'growthSection') {
            // Compare the growthGoal part of the form against its original values
            const originalGrowthGoal = this.originalGoalForm.growthGoal;
            const currentGrowthGoal = this.goalForm.growthGoal;

            // Use lodash's isEqual to perform a deep comparison
            return !isEqual(originalGrowthGoal, currentGrowthGoal);
        } else if (section === 'aspirationsSection') {
            // Compare the growthGoal part of the form against its original values
            const originalAspirations = this.originalGoalForm.aspirations;
            const currentAspirations = this.goalForm.aspirations;

            // Use lodash's isEqual to perform a deep comparison
            return !isEqual(originalAspirations, currentAspirations);
        } else if (section === 'goalsSection') {
            // Compare the growthGoal part of the form against its original values
            const originalGoals = this.originalGoalForm.goals;
            const currentGoals = this.goalForm.goals;

            // Use lodash's isEqual to perform a deep comparison
            return !isEqual(originalGoals, currentGoals);
        }
    },


},

beforeRouteLeave(to, from, next) {
    // If the user is logged out, allow navigation without confirmation
    if (!this.isUserLoggedIn || this.formSubmitSuccess) {
        next();
        return;
    }

    // If there are unsaved changes and user is still logged in
    if (!this.isObjectEqual(this.goalForm, this.originalGoalForm)) {
        this.nextFunction = next;
        this.leaveDialog = true;
    } else {
        next(); // Proceed with navigation
    }
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