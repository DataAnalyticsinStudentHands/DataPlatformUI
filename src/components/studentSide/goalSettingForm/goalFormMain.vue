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
                        value="0"
                        :error="expError"
                    ></v-stepper-item>
                    
                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step1"
                        title="Community/Research"
                        icon="mdi-earth"
                        value="1"
                        :error="commResError"
                    ></v-stepper-item>
                    
                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step2"
                        title="Growth"
                        icon="mdi-sprout"
                        value="2"
                        :error="growthError"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step3"
                        title="Aspirations"
                        icon="mdi-image-filter-hdr"
                        value="3"
                        :error="aspError"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step4"
                        title="Goals"
                        icon="mdi-flag-variant"
                        value="4"
                        :error="goalsError"
                    ></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item
                        ref="step5"
                        title="Review"
                        icon="mdi-check-bold"
                        value="5"
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
                    ></goal-form-exp>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="1">
                    <goal-form-comm-res
                        ref="GoalFormCommResRef"
                        :goalForm="goalForm"
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
                        ></goal-form-exp>
                    </div>
                    <div v-show="currentStep === 1" key="step1">
                        <goal-form-comm-res
                            ref="GoalFromCommRes"
                            :goalForm="goalForm"
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
                            @click="currentStep = Math.max(currentStep - 1, 0)" 
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
                            @click="submitForm" 
                            class="btn"
                        >
                            {{$t('Submit Form')}}
                        </v-btn>
                        <!-- Next button for other steps -->
                        <v-btn 
                            v-else 
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
goalForm.experienceID: {{ goalForm.experienceID }}
<br>
selectedExperience: {{ selectedExperience }}
</template>

<script>
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
        expError: false,
        commResError: false,
        growthError: false,
        aspError: false,
        goalsError: false,
        selectedExperience: null,
        goalForm: {
        experiences:[{
            experienceIDFromList:'',
            experienceCategory:'',
            experienceName:''
        }],
        experienceID: null,
        communityEngagement: {
            communityEngagementExperiences: [
            { id: 1, label: "Volunteer organizations (e.g. scouts, nonprofits, food banks)", checked: true },
            { id: 2, label: "Political campaigns", checked: false },
            { id: 3, label: "Faith based organizations", checked: false },
            { id: 4, label: "Short-term volunteer opportunities (e.g. day of service events)", checked: false },
            { id: 5, label: "Medical mission trips", checked: false },
            { id: 6, label: "Other", checked: false },
            { id: 7, label: "None of the above", checked: false }
            ],
            communityEngagementExperiencesOther: '',
            previousEngagementExperiences: [
            { id: 1, label: "Mentoring someone", checked: true },
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
            { id: 1, label: "Social media", checked: true },
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
            { id: 2, label: "Advanced statistics and programming courses", checked: true },
            { id: 3, label: "HERE", checked: false },
            { id: 4, label: "SURF", checked: false },
            { id: 5, label: "PURS", checked: false },
            { id: 6, label: "Volunteered/Interned in a lab", checked: false },
            { id: 7, label: "Other", checked: false },
            { id: 8, label: "None of the above", checked: false }
            ],
            currentResearchExperienceOther: '',
            previousResearchExperience: [
            { id: 1, label: "Designing your own research project", checked: true },
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
            { id: 1, label: "Excel", checked: true },
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
            { id: 1, label: "Education", checked: true },
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
            leadershipOption: 'Yes'
        },
        growthGoal: {
            problemSolvingGoal: 'No growth',
            effectiveCommunicationGoal: 'No growth',
            teamworkGoal: 'No growth',
            culturalHumilityGoal: 'No growth',
            ethicalDecisionMakingGoal: 'No growth',
            professionalResponsibilityGoal: 'No growth'
        },
        aspirations: {
            aspirationOne: 'asd',
            aspirationTwo: 'asd',
            aspirationThree: '',
        },
        goals: {
            goalOne: 'asd',
            goalTwo: 'asd',
            goalThree: 'asd',
            goalFour: '',
            goalFive: '',
        }
        },
    }
},
computed: {
    showAltLabels() {
        if (this.$vuetify.display.mdAndUp || this.$vuetify.display.xs) {
            console.log('mdAndUp');
            return false;
        } else {
            return true;
        }
    },

    progressBarWidth() {
        const stepWidth = 16.66;
        return `${stepWidth * (this.currentStep + 1)}%`
    }
},
methods: {
    handleFormValid() {
        this.currentStep++;
    },
    
    handleFormInvalid(section) {
        console.log('handleFormInvalid section: ', section);
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
        console.log('handleValidationChange section: ', section);
        console.log('handleValidationChange isValid: ', isValid);
        if (section === "exp") {
            this.expError = !isValid;
        } else if (section === "commRes") {
            this.commResError = !isValid;
        } else if (section === "growth") {
            this.growthError = !isValid;
            console.log('growthError: ', this.growthError);
        } else if (section === "asp") {
            this.aspError = !isValid;
        } else if (section === "goals") {
            this.goalsError = !isValid;
        }
    },

    triggerValidation() {
        console.log('triggerValidation')
        console.log('currentStep: ', this.currentStep)
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
        console.log('handleSelectedExperience - selectedExperience: ', this.selectedExperience);
        console.log('handleSelectedExperience - experienceID: ', this.experienceID);
    },

    submitForm() {
        console.log('Submit Form');
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