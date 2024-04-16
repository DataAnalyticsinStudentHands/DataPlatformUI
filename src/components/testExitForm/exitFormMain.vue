<template>
<!-- Title -->
<v-container style="width: 100%; margin: 0 auto;">
    <div style="display: flex; align-items:center;">
        <p class="font-weight-black text-h5 text--primary">
            {{ $t("Exit Form") }}
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
                <!-- ***NEED TO CHANGE*** -->
                <v-card :title="$t('Exit Form')">
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
                        v-if="goalFormExists"
                        title="Aspirations"
                        icon="mdi-image-filter-hdr"
                        edit-icon="mdi-image-filter-hdr"
                        value="1"
                        :error="aspError"
                        :editable="checkJump(1)"
                    ></v-stepper-item>
                    
                    <v-divider v-if="goalFormExists"></v-divider>

                    <v-stepper-item
                        ref="step2"
                        v-if="goalFormExists"
                        title="Goals"
                        icon="mdi-flag-variant"
                        edit-icon="mdi-flag-variant"
                        value="2"
                        :error="goalsError"
                        :editable="checkJump(2)"
                    ></v-stepper-item>

                    <v-divider v-if="goalFormExists"></v-divider>

                    <v-stepper-item
                        ref="step3"
                        v-if="goalFormExists && activitiesExist"
                        title="Activities"
                        icon="mdi-toolbox"
                        edit-icon="mdi-toolbox"
                        value="3"
                        :error="actError"
                        :editable="checkJump(3)"
                    ></v-stepper-item>

                    <v-divider v-if="goalFormExists && activitiesExist"></v-divider>

                    <v-stepper-item
                        ref="step4"
                        title="Growth"
                        icon="mdi-sprout"
                        edit-icon="mdi-sprout"
                        value="4"
                        :error="growthError"
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
                    <exit-form-exp
                        ref="ExitFormExpRef"
                        :exitForm="exitForm"
                        @form-valid="handleFormValid(0)"
                        @form-invalid="handleFormInvalid('exp')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('exp', $event)"
                        @update-selected-experience="handleSelectedExperience"
                        @update-found-document-id="foundDocumentId = $event"
                        @reset-exit-form="resetExitForm"
                        @update-goal-form-exists="handleGoalFormExists"
                        @update-activities-exist="handleActivitiesExist"
                    ></exit-form-exp>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="1">
                    <exit-form-asp
                        ref="ExitFormAspRef"
                        :exitForm="exitForm"
                        @form-valid="handleFormValid(1)"
                        :goalFormExists="goalFormExists"
                        @form-invalid="handleFormInvalid('asp')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('asp', $event)"
                    ></exit-form-asp>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="2">
                    <exit-form-goals
                        ref="ExitFormGoalsRef"
                        :exitForm="exitForm"
                        :existingGoals="existingGoals"
                        @form-valid="handleFormValid(2)"
                        @form-invalid="handleFormInvalid('goals')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('goals', $event)"
                    ></exit-form-goals>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="3">
                    <exit-form-act
                        ref="ExitFormActRef"
                        :exitForm="exitForm"
                        :existingGoals="existingGoals"
                        @form-valid="handleFormValid(3)"
                        @form-invalid="handleFormInvalid('act')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('act', $event)"
                    ></exit-form-act>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="4">
                    <exit-form-growth
                        ref="ExitFormGrowthRef"
                        :exitForm="exitForm"
                        @form-valid="handleFormValid(4)"
                        @form-invalid="handleFormInvalid('growth')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('growth', $event)"
                    ></exit-form-growth>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="5">
                    <exit-form-review
                        ref="ExitFormReviewRef"
                        :selectedExperience="selectedExperience"
                        :exitForm="exitForm"
                        @change-step="currentStep = $event"
                    ></exit-form-review>
                    </v-stepper-window-item>                    
                </v-stepper-window>
                </v-container>

                <!-- Mobile View with Vuetify Slide Transition -->
                <v-container v-if="$vuetify.display.xs" class="pa-0 ma-0">
                    <v-scroll-x-reverse-transition group hide-on-leave>
                    <div v-show="currentStep === 0" key="step0">
                        <exit-form-exp
                            ref="ExitFormExpRef"
                            :exitForm="exitForm"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('exp')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('exp', $event)"
                            @update-selected-experience="handleSelectedExperience"
                            @update-found-document-id="foundDocumentId = $event"
                            @reset-exit-form="resetExitForm"
                        ></exit-form-exp>
                    </div>
                    <div v-show="currentStep === 1" key="step1">
                        <exit-form-asp
                            ref="ExitFormAspRef"
                            :exitForm="exitForm"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('asp')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('asp', $event)"
                        ></exit-form-asp>
                    </div>
                    <div v-show="currentStep === 2" key="step2">
                        <exit-form-goals
                            ref="ExitFormGoalsRef"
                            :exitForm="exitForm"
                            :existingGoals="existingGoals"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('goals')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('goals', $event)"
                        ></exit-form-goals>
                    </div>
                    <div v-show="currentStep === 3" key="step3">
                        <exit-form-act
                            ref="ExitFormActRef"
                            :exitForm="exitForm"
                            :existingGoals="existingGoals"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('act')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('act', $event)"
                        ></exit-form-act>
                    </div>
                    <div v-show="currentStep === 4" key="step4">
                            <exit-form-growth
                            ref="ExitFormGrowthRef"
                            :exitForm="exitForm"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('growth')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('growth', $event)"
                        ></exit-form-growth>
                    </div>
                    <div v-show="currentStep === 5" key="step5">
                        <exit-form-review
                            ref="ExitFormReviewRef"
                            :selectedExperience="selectedExperience"
                            :exitForm="exitForm"
                            :goalFormExists="goalFormExists"
                            :activitiesExist="activitiesExist"
                            @change-step="currentStep = $event"
                        ></exit-form-review>
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
<!-- Confirm Leave Dialog -->
<v-dialog v-model="leaveDialog" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">
            Confirm Navigation
        </v-card-title>
        <v-card-text>
            <p>Are you sure you want to leave? <strong>Unsaved changes will be lost.</strong></p>
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
<!-- <br><br><br><br>
exitForm:
<br>
{{ exitForm }} -->
goalFormExists: {{ goalFormExists }}
<br><br>
activitiesExist: {{ activitiesExist }}
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { toast } from 'vue3-toastify';

import ExitFormExp from './exitFormExp.vue';
import ExitFormAsp from './exitFormAsp.vue';
import ExitFormGoals from './exitFormGoals.vue';
import ExitFormAct from './exitFormAct.vue';
import ExitFormGrowth from './exitFormGrowth.vue';
import ExitFormReview from './exitFormReview.vue';

export default {
name: "GoalSettingForm",
components: {
    ExitFormExp,
    ExitFormAsp,
    ExitFormGoals,
    ExitFormAct,
    ExitFormGrowth,
    ExitFormReview
},
data() {
    return {
        currentStep: 0,
        allowedStepsForJump: [0],
        expError: false,
        aspError: false,
        goalsError: false,
        actError: false,
        growthError: false,
        foundDocumentId: null,
        hasCompletedGoalForm: false,
        goalSettingFormBackground: null,
        isBackgroundEditActive: false,
        selectedExperience: null,
        hichProject: [],
        formSubmitSuccess: false,
        exitForm: {
            semester: "",
            experiences: [
                {
                _id: "",
                experienceCategory: "",
                experienceName: ""
                }
            ],
            goalForm:[{
                aspiration1:"",
                aspiration2:"",
                aspiration3:"",
                goal1:"",
                goal2:"",
                goal3:"",
                goal4:"",
                goal5:"",}
            ],
            goalSettingFormID: "",
            experienceActivities:[],
            progressMade: {
                aspirationOneProgressResults: [
                { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
                ],
                aspirationTwoProgressResults: [
                { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
                ],
                aspirationThreeProgressResults: [
                { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
                ],
                aspirationOneProgressSelected: "",
                aspirationTwoProgressSelected:"",
                aspirationThreeProgressSelected: "",
                aspirationOneExperienceConnection: [
                { id: 1, label: "The progress I made towards this aspiration was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this aspiration was partly due to this course", xs_label: "Partly due to this course.",  checked: false },
                { id: 3, label: "The progress I made towards this aspiration was not due to this course", xs_label: "Not due to this course.",  checked: false }
                ],
                aspirationTwoExperienceConnection: [
                { id: 1, label: "The progress I made towards this aspiration was largely due to this course",  xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this aspiration was partly due to this course",  xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this aspiration was not due to this course",  xs_label: "Not due to this course.", checked: false }
                ],
                aspirationThreeExperienceConnection: [
                { id: 1, label: "The progress I made towards this aspiration was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this aspiration was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this aspiration was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                aspirationOneExperienceConnectionSelected: null,
                aspirationTwoExperienceConnectionSelected: null,
                aspirationThreeExperienceConnectionSelected: null,
                goalOneProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalTwoProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalThreeProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalFourProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalFiveProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalOneProgressSelected: null,
                goalTwoProgressSelected: null,
                goalThreeProgressSelected: null,
                goalFourProgressSelected: null,
                goalFiveProgressSelected: null,
                goalOneExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalTwoExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalThreeExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalFourExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalFiveExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalOneExperienceConnectionSelected: null,
                goalTwoExperienceConnectionSelected: null,
                goalThreeExperienceConnectionSelected: null,
                goalFourExperienceConnectionSelected: null,
                goalFiveExperienceConnectionSelected: null,
            },
            //section to describe obstacles and how it was overcome
            goalIssues: {
                goals: [
                { id: 1, label: "Goal 1", checked: false },
                { id: 2, label: "Goal 2", checked: false },
                { id: 3, label: "Goal 3", checked: false },
                { id: 4, label: "Goal 4", checked: false },
                { id: 5, label: "Goal 5", checked: false },
                { id: 6, label: "No Goals", checked: false },
                ],
                issuesDescription: ""
            },
            //array that includes which activities contributed towards the goals
            activitiesContribution: {
                goalOneContributions: [],
                goalTwoContributions: [],
                goalThreeContributions: [],
                goalFourContributions: [],
                goalFiveContributions: [],
                noContributions: []
            },
            //how experience contributed to goals, net promoter question
            experienceContributions: "",
            //likliehood of doing certain actions based on the experience taken
            likelihoodOf: {
                enrollAnotherCourse: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                completeMinor: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                recommendCourse: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                pursueCareer: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                enrollAnotherCourseSelected: "",
                completeMinorSelected: "",
                recommendCourseSelected: "",
                pursueCareerSelected: "",
            },
            //general growth goals and the results after experience
            generalGrowth: {
                problemSolving: "",
                effectiveCommunication: "",
                teamwork: "",
                culturalHumility: "",
                ethicalDecisionMaking: "",
                professionalResponsibility: ""
            },
            //general open-ended
            openEnded: {
                biggestLessons: "",
                supportOthers: "",
                comments: ""
            }
        },
        originalExitForm: {
            semester: "",
            experiences: [
                {
                _id: "",
                experienceCategory: "",
                experienceName: ""
                }
            ],
            goalForm:[{
                aspiration1:"",
                aspiration2:"",
                aspiration3:"",
                goal1:"",
                goal2:"",
                goal3:"",
                goal4:"",
                goal5:"",}
            ],
            goalSettingFormID: "",
            experienceActivities:[],
            progressMade: {
                aspirationOneProgressResults: [
                { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
                ],
                aspirationTwoProgressResults: [
                { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
                ],
                aspirationThreeProgressResults: [
                { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
                ],
                aspirationOneProgressSelected: "",
                aspirationTwoProgressSelected:"",
                aspirationThreeProgressSelected: "",
                aspirationOneExperienceConnection: [
                { id: 1, label: "The progress I made towards this aspiration was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this aspiration was partly due to this course", xs_label: "Partly due to this course.",  checked: false },
                { id: 3, label: "The progress I made towards this aspiration was not due to this course", xs_label: "Not due to this course.",  checked: false }
                ],
                aspirationTwoExperienceConnection: [
                { id: 1, label: "The progress I made towards this aspiration was largely due to this course",  xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this aspiration was partly due to this course",  xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this aspiration was not due to this course",  xs_label: "Not due to this course.", checked: false }
                ],
                aspirationThreeExperienceConnection: [
                { id: 1, label: "The progress I made towards this aspiration was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this aspiration was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this aspiration was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                aspirationOneExperienceConnectionSelected: null,
                aspirationTwoExperienceConnectionSelected: null,
                aspirationThreeExperienceConnectionSelected: null,
                goalOneProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalTwoProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalThreeProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalFourProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalFiveProgressResults: [
                { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
                { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
                { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
                { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
                ],
                goalOneProgressSelected: null,
                goalTwoProgressSelected: null,
                goalThreeProgressSelected: null,
                goalFourProgressSelected: null,
                goalFiveProgressSelected: null,
                goalOneExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalTwoExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalThreeExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalFourExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalFiveExperienceConnection: [
                { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course.", checked: false },
                { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course.", checked: false },
                { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course.", checked: false }
                ],
                goalOneExperienceConnectionSelected: null,
                goalTwoExperienceConnectionSelected: null,
                goalThreeExperienceConnectionSelected: null,
                goalFourExperienceConnectionSelected: null,
                goalFiveExperienceConnectionSelected: null,
            },
            //section to describe obstacles and how it was overcome
            goalIssues: {
                goals: [
                { id: 1, label: "Goal 1", checked: false },
                { id: 2, label: "Goal 2", checked: false },
                { id: 3, label: "Goal 3", checked: false },
                { id: 4, label: "Goal 4", checked: false },
                { id: 5, label: "Goal 5", checked: false },
                { id: 6, label: "No Goals", checked: false },
                ],
                issuesDescription: ""
            },
            //array that includes which activities contributed towards the goals
            activitiesContribution: {
                goalOneContributions: [],
                goalTwoContributions: [],
                goalThreeContributions: [],
                goalFourContributions: [],
                goalFiveContributions: [],
                noContributions: []
            },
            //how experience contributed to goals, net promoter question
            experienceContributions: "",
            //likliehood of doing certain actions based on the experience taken
            likelihoodOf: {
                enrollAnotherCourse: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                completeMinor: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                recommendCourse: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                pursueCareer: [
                { id: 1, label: "Extremely likely", checked: false },
                { id: 2, label: "Somewhat likely", checked: false },
                { id: 3, label: "Neutral likely/unlikely", checked: false },
                { id: 4, label: "Somewhat unlikely", checked: false },
                { id: 5, label: "Extremely unlikely", checked: false }
                ],
                enrollAnotherCourseSelected: "",
                completeMinorSelected: "",
                recommendCourseSelected: "",
                pursueCareerSelected: "",
            },
            //general growth goals and the results after experience
            generalGrowth: {
                problemSolving: "",
                effectiveCommunication: "",
                teamwork: "",
                culturalHumility: "",
                ethicalDecisionMaking: "",
                professionalResponsibility: ""
            },
            //general open-ended
            openEnded: {
                biggestLessons: "",
                supportOthers: "",
                comments: ""
            }
        },
        leaveDialog: false,
        nextFunction: null,
        goalFormExists: false,
        activitiesExist: false,
    }
},
async created() {
    // await this.fetchGoalSettingFormData();
    // await this.fetchExperienceActivities();
},
watch: {
    currentStep(newVal) {
        // Convert newVal to a number and update currentStep
        this.currentStep = Number(newVal);

        // Check if the converted currentStep is higher than the highest step in allowedStepsForJump
        if (this.allowedStepsForJump.length === 0 || this.currentStep > Math.max(...this.allowedStepsForJump)) {
            this.allowedStepsForJump.push(this.currentStep);
        }
    },
    originalExitForm(newVal) {
        console.log('newVal: ', newVal);
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
        return this.$refs.ExitFormExpRef?.shouldShowHichCheckboxes && this.hichProject.length > 0;
    },

    isUserLoggedIn() {
        const store = useLoggedInUserStore();
        return store.isLoggedIn;
    },

    existingGoals() {
        // Filter out empty, null, or undefined goals
        return [
            this.exitForm.goal1, 
            this.exitForm.goal2, 
            this.exitForm.goal3, 
            this.exitForm.goal4, 
            this.exitForm.goal5
        ].filter(goal => goal);
    },
},
methods: {
    // async fetchLatestGoalSettingForm() {
    //     const user = useLoggedInUserStore();
    //     // let token = user.token;

    //     const token = import.meta.env.VITE_TOKEN;

    //     let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/latest-goal-setting-form';

    //     try {
    //         const response = await axios.get(apiURL, { headers: { token } });

    //         // Check if a goal setting form was found
    //         if (response.data.formFound) {
    //             this.hasCompletedGoalForm = true;
    //             this.goalSettingFormBackground = response.data.goalSettingFormBackground;
    //             this.updateGoalFormWithBackgroundData();
    //         } else {
    //             this.hasCompletedGoalForm = false;
    //             this.goalSettingFormBackground = null;
    //         }
    //     } catch (error) {
    //         this.handleError(error);
    //     }
    // },

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

    async fetchGoalSettingFormData() {
        console.log('fetchGoalSettingFormData')
          const user = useLoggedInUserStore();
          // const token = user.token;

          const token = import.meta.env.VITE_TOKEN;

          const experienceID = this.$route.params.id; // Use experienceID from route params

        //   const expRegistrationID = "851707301679949"

          const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goal-form/${expRegistrationID}`;

          axios.get(apiURL, { headers: { token } })
          .then((resp) => {
              this.goalFormExists = resp.data.goalFormExists;

              if (this.goalFormExists) {
                const goalFormData = resp.data.goalForm;

                // Set the goal setting form ID
                this.exitForm.goalSettingFormID = resp.data._id;

                // Update aspirations
                this.exitForm.aspiration1 = goalFormData.aspirations?.aspirationOne;
                this.exitForm.aspiration2 = goalFormData.aspirations?.aspirationTwo;
                this.exitForm.aspiration3 = goalFormData.aspirations?.aspirationThree;
                // Update goals
                this.exitForm.goal1 = goalFormData.goals?.goalOne;
                this.exitForm.goal2 = goalFormData.goals?.goalTwo;
                this.exitForm.goal3 = goalFormData.goals?.goalThree;
                this.exitForm.goal4 = goalFormData.goals?.goalFour;
                this.exitForm.goal5 = goalFormData.goals?.goalFive;
                // DELETE ME
                // this.exitForm.goal1 = "I want to obtain comprehensive knowledge of community health, including social determinants of health, health disparities, and the importance of cultural competency."
                // this.exitForm.goal2 = "I want to develop practical skills essential for the role of a CHW, such as learning how to effectively communicate with diverse populations and navigating healthcare systems.";
                // this.exitForm.goal3 = "I want to enhance my employment opportunities in the public/community health field and learn about specific roles in the career.";
                // this.exitForm.goal4 = "I want to build a network in public health by connecting with peers, instructors, and community leaders to obtain valuable insights and opportunities for mentorship and collaboration.";
                // this.exitForm.goal5 = "I want to contribute to community empowerment and health equity to fulfill my passion for making a difference in my community and helping others.";
              }
          })
          .catch((error) => {
              this.handleError(error);
          });
      },

      async fetchExperienceActivities() {
            // const experienceID = this.$route.params.id;
            const token = import.meta.env.VITE_TOKEN;
            const experienceID = "1c2ac6b0-6911-11ee-acdd-43267c0573ee"
            const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/experience/${experienceID}/activities`;

            axios.get(apiURL, { headers: { token } })
            .then((resp) => {
                // Update experience activities
                // DELETE ME
                this.exitForm.experienceActivities = 
                [
                    {
                        "activityID": "061701356800973",
                        "activityName": "Motivational Interviewing Role Play"
                    },
                    {
                        "activityID": "501701357349009",
                        "activityName": "Reading/Topic - Mapping/Needs Assessment/Grants"
                    },
                    {
                        "activityID": "511701356844338",
                        "activityName": "Reading/Topic - Maternal Health/Purple Crying"
                    },
                    {
                        "activityID": "561701357366365",
                        "activityName": "Reading/Topic - Cultural competency/cultural humility/implicit bias"
                    },
                    {
                        "activityID": "681701357396485",
                        "activityName": "Reading/Topic - Physical activity/mental health"
                    },
                    {
                        "activityID": "861701356689564",
                        "activityName": "Community Health Project"
                    },
                ]
                // this.exitForm.experienceActivities = resp.data.map((activity) => ({
                //     activityID: activity._id,
                //     activityName: activity.activityName
                // }));
            })
            .catch((error) => {
                this.handleError(error);
            });
        },

    handleBackgroundEditClick() {
        this.isBackgroundEditActive = true;
    },


    handleFormValid() {
        this.currentStep++;
    },

    resetExitForm() {
        console.log('resetExitForm originalExitForm :', this.originalExitForm);
        console.log('resetExitForm exitForm :', this.exitForm);
        const tempExperiences = this.exitForm.experiences;
        this.exitForm = JSON.parse(JSON.stringify(this.originalExitForm));
        this.exitForm.experiences = tempExperiences;
    },
    
    handleFormInvalid(section) {
        if (section === "exp") {
            this.expError = true;
        } else if (section === "asp") {
            this.aspError = true;
        } else if (section === "goals") {
            this.goalsError = true;
        } else if (section === "act") {
            this.actError = true;
        } else if (section === "growth") {
            this.growthError = true;
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
        } else if (section === "asp") {
            this.aspError = !isValid;
        } else if (section === "goals") {
            this.goalsError = !isValid;
        } else if (section === "act") {
            this.actError = !isValid;
        } else if (section === "growth") {
            this.growthError = !isValid;
        }
    },

    triggerValidation() {

        if (this.goalFormExists) {
            switch (this.currentStep) {
                case 0:
                    this.triggerExpValidation();
                    break;
                case 1:
                    this.triggerAspValidation();
                    break;
                case 2:
                    this.triggerGoalsValidation();
                    break;
                case 3:
                    // Determine which validation to trigger based on activities existence
                    if (this.activitiesExist) {
                        this.triggerActValidation();
                    } else {
                        this.triggerGrowthValidation();
                    }
                    break;
                case 4:
                    if (this.activitiesExist) {
                        this.triggerGrowthValidation();
                    }
                    break;
                default:
                    console.log('Invalid currentStep with goalFormExists');
            }
        } else if (!this.goalFormExists) {
            if (this.currentStep === 0) {
                this.triggerExpValidation();
            } else if (this.currentStep === 1) {
                this.triggerGrowthValidation();
            }
        } else {
            console.log('Configuration not handled');
        }
    },

    triggerExpValidation() {
        if (this.$refs.ExitFormExpRef) {
            this.$refs.ExitFormExpRef.handleValidations();
        }
    },

    triggerAspValidation() {
        if (this.$refs.ExitFormAspRef) {
            this.$refs.ExitFormAspRef.handleValidations();
        }
    },

    triggerCommResValidation() {
        if (this.$refs.GoalFormCommResRef) {
            this.$refs.GoalFormCommResRef.handleValidations();
        }
    },

    triggerGoalsValidation() {
        if (this.$refs.ExitFormGoalsRef) {
            this.$refs.ExitFormGoalsRef.handleValidations();
        }
    },
    
    triggerActValidation() {
        if (this.$refs.ExitFormActRef) {
            this.$refs.ExitFormActRef.handleValidations();
        }
    },

    triggerGrowthValidation() {
        if (this.$refs.ExitFormGrowthRef) {
            this.$refs.ExitFormGrowthRef.handleValidations();
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
            case 1: return !this.aspError;
            case 2: return !this.goalsError;
            case 3: return !this.actError;
            case 4: return !this.growthError;
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
        // After cleaning up the data, check whether to update or create
        if (this.foundDocumentId) {
            // this.handleUpdateForm();
        } else {
            // If previously filled document wasn't found, create new document
            // this.handleSubmitForm();
        }
    },

    handleSubmitForm() {
        const user = useLoggedInUserStore();
        // const token = user.token;

        const token = import.meta.env.VITE_TOKEN;

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
        // let token = user.token;

        const token = import.meta.env.VITE_TOKEN;

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

    handleGoalFormExists(goalFormExists) {
        this.goalFormExists = goalFormExists;
    },

    handleActivitiesExist(activitiesExist) {
        this.activitiesExist = activitiesExist;
    },

    handleAllowedStepsForJump() {
        this.allowedStepsForJump = [0];
    }


},

beforeRouteLeave(to, from, next) {
    // If the user is logged out, allow navigation without confirmation
    if (!this.isUserLoggedIn || this.formSubmitSuccess) {
        next();
        return;
    }

    // If there are unsaved changes and user is still logged in
    if (!this.isObjectEqual(this.exitForm, this.originalExitForm)) {
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