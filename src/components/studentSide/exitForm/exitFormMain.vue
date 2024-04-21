<template>
    <!-- selectedExperience: {{selectedExperience}} -->
    <!-- isFirstInput: {{ isFirstInput }} -->
    <!-- <br><br> -->
    <!-- {{ exitForm }} -->
    currentStep: {{ currentStep }}
<!-- Title -->
<v-container style="width: 100%; margin: 0 auto;">
    <div style="display: flex; align-items:center;">
        <p class="font-weight-black text-h5 text--primary">
            {{ $t("Exit Form") }}
        </p>
        <v-dialog width="500">
            <!-- HELP BUTTON - NEED TO EDIT CONTENTS -->
            <!-- <template v-slot:activator="{ props }">
                <v-btn
                    size="x-small"
                    class="pb-2"
                    variant="text"
                    icon="mdi-help-circle-outline"
                    flat
                    v-bind="props"
                >
                </v-btn>
            </template> -->

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
                :mobile="$vuetify.display.xs"
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
                        :isFirstInput="isFirstInput"
                        :expRegistrationIDFromIncomplete="expRegistrationIDFromIncomplete"
                        @form-valid="handleFormValid(0)"
                        @form-invalid="handleFormInvalid('exp')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('exp', $event)"
                        @update-original-exit-form="updateOriginalExitForm"
                        @update-selected-experience="handleSelectedExperience"
                        @update-found-document-id="foundDocumentId = $event"
                        @reset-exit-form="resetExitForm"
                        @reset-error-flags="resetErrorFlags"
                        @update-goal-form-exists="handleGoalFormExists"
                        @update-activities-exist="handleActivitiesExist"
                        @update-incomplete-exp-registration="handleUpdateIncompleteExpRegistration"
                        @update-data-and-society="handleUpdateDataAndSociety"
                    ></exit-form-exp>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="1">
                    <exit-form-asp
                        ref="ExitFormAspRef"
                        :key="componentsKey"
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
                        :key="componentsKey"
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
                        :key="componentsKey"
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
                        :key="componentsKey"
                        :exitForm="exitForm"
                        :dataAndSociety="dataAndSociety"
                        @form-valid="handleFormValid(4)"
                        @form-invalid="handleFormInvalid('growth')"
                        @scroll-to-error="handleScrollToError"
                        @validation-change="handleValidationChange('growth', $event)"
                    ></exit-form-growth>
                    </v-stepper-window-item>
                    <v-stepper-window-item value="5">
                    <exit-form-review
                        ref="ExitFormReviewRef"
                        :key="componentsKey"
                        :selectedExperience="selectedExperience"
                        :exitForm="exitForm"
                        :goalFormExists="goalFormExists"
                        :activitiesExist="activitiesExist"
                        :expRegistrationIDFromIncompleteBackup="expRegistrationIDFromIncompleteBackup"
                        @change-step="currentStep = $event"
                    ></exit-form-review>
                    </v-stepper-window-item>                    
                </v-stepper-window>
                </v-container>

                <!-- Mobile View -->
                <v-container v-if="$vuetify.display.xs" class="pa-0 ma-0">
                    <v-scroll-x-reverse-transition group hide-on-leave>
                    <div v-show="showExperienceStep" key="step0">
                        <exit-form-exp
                            ref="ExitFormExpRef"
                            :exitForm="exitForm"
                            :isFirstInput="isFirstInput"
                            :expRegistrationIDFromIncomplete="expRegistrationIDFromIncomplete"
                            @form-valid="handleFormValid(0)"
                            @form-invalid="handleFormInvalid('exp')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('exp', $event)"
                            @update-original-exit-form="updateOriginalExitForm"
                            @update-selected-experience="handleSelectedExperience"
                            @update-found-document-id="foundDocumentId = $event"
                            @reset-exit-form="resetExitForm"
                            @reset-error-flags="resetErrorFlags"
                            @update-goal-form-exists="handleGoalFormExists"
                            @update-activities-exist="handleActivitiesExist"
                            @update-incomplete-exp-registration="handleUpdateIncompleteExpRegistration"
                            @update-data-and-society="handleUpdateDataAndSociety"
                        ></exit-form-exp>
                    </div>
                    <div v-show="showAspirationsStep" key="step1">
                        <exit-form-asp
                            ref="ExitFormAspRef"
                            :key="componentsKey"
                            :exitForm="exitForm"
                            @form-valid="handleFormValid(1)"
                            :goalFormExists="goalFormExists"
                            @form-invalid="handleFormInvalid('asp')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('asp', $event)"
                        ></exit-form-asp>
                    </div>
                    <div v-show="showGoalsStep" key="step2">
                        <exit-form-goals
                            ref="ExitFormGoalsRef"
                            :key="componentsKey"
                            :exitForm="exitForm"
                            :existingGoals="existingGoals"
                            @form-valid="handleFormValid(2)"
                            @form-invalid="handleFormInvalid('goals')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('goals', $event)"
                        ></exit-form-goals>
                    </div>
                    <div v-show="showActivitiesStep" key="step3">
                        <exit-form-act
                            ref="ExitFormActRef"
                            :key="componentsKey"
                            :exitForm="exitForm"
                            :existingGoals="existingGoals"
                            @form-valid="handleFormValid(3)"
                            @form-invalid="handleFormInvalid('act')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('act', $event)"
                        ></exit-form-act>
                    </div>
                    <div v-show="showGrowthStep" key="step4">
                            <exit-form-growth
                                ref="ExitFormGrowthRef"
                                :key="componentsKey"
                                :exitForm="exitForm"
                                :dataAndSociety="dataAndSociety"
                                @form-valid="handleFormValid(4)"
                                @form-invalid="handleFormInvalid('growth')"
                                @scroll-to-error="handleScrollToError"
                                @validation-change="handleValidationChange('growth', $event)"
                        ></exit-form-growth>
                    </div>
                    <div v-show="showReviewStep" key="step5">
                        <exit-form-review
                            ref="ExitFormReviewRef"
                            :key="componentsKey"
                            :selectedExperience="selectedExperience"
                            :exitForm="exitForm"
                            :goalFormExists="goalFormExists"
                            :activitiesExist="activitiesExist"
                            :expRegistrationIDFromIncompleteBackup="expRegistrationIDFromIncompleteBackup"
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
                            v-if="showSubmitButton" 
                            type="submit" 
                            @click="submitFormCleanup" 
                            class="btn"
                        >
                            {{$t('Submit Form')}}
                        </v-btn>
                        <!-- Next button for other steps -->
                        <v-btn 
                            v-else-if="!showSubmitButton" 
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
            <p>We found an incomplete Exit Form from your last session. Would you like to continue where you left off or start a new form?</p>
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
<!-- <br><br><br><br><br><br><br><br><br><br><br><br><br>
{{ exitForm }} -->
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
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

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
        goalSettingFormBackground: null,
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
        componentsKey: 0,
        isFirstInput: true,
        incompleteFormID: null,
        showIncompleteFormFoundDialog: false,
        tempIncompleteForm: {},
        expRegistrationIDFromIncomplete: null,
        expRegistrationIDFromIncompleteBackup: null,
        dataAndSociety: false,
    }
},
async created() {
    // Initialize the debounced function
    this.debouncedUpdateExitForm = debounce(this.updateExitForm, 1000);
},
async mounted() {
    await this.checkIncompleteForm();
    window.scrollTo(0, 0);
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
    exitForm: {
        handler(newVal, oldVal) {
            console.log('newVal: ', newVal);
            console.log('this.originalExitForm: ', this.originalExitForm);
            if (newVal && !isEqual(newVal, this.originalExitForm)) {
                if (this.isFirstInput) {
                    this.handleFirstInput();
                } else {
                    // Use the debounced method for subsequent updates
                    this.handleInput();
                }
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
        let stepWidth = 0;
        if (this.goalFormExists && this.activitiesExist) {
            stepWidth = 16.66;
        } else if (this.goalFormExists && !this.activitiesExist) {
            stepWidth = 20;
        } else if (!this.goalFormExists) {
            stepWidth = 33.33;
        }
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

    showSubmitButton() {
        if (this.goalFormExists && this.activitiesExist) {
            if (this.currentStep === 5) {
                return true;
            }
        } else if (this.goalFormExists && !this.activitiesExist) {
            if (this.currentStep === 4) {
                return true;
            }
        } else if (!this.goalFormExists) {
            if (this.currentStep === 2) {
                return true;
            }
        }
        return false;
    },

    showExperienceStep() {
        return this.currentStep === 0;
    },
    showAspirationsStep() {
        return this.currentStep === 1;
    },
    showGoalsStep() {
        return this.currentStep === 2 && this.goalFormExists;
    },
    showActivitiesStep() {
        return this.currentStep === 3 && this.goalFormExists && this.activitiesExist;
    },
    showGrowthStep() {
        if (this.goalFormExists) {
            return this.currentStep === 4 || (!this.activitiesExist && this.currentStep === 3);
        }
        return this.currentStep === 1;  // Handle case when there is no goal form
    },
    showReviewStep() {
        if (this.goalFormExists) {
            if (this.activitiesExist) {
                return this.currentStep === 5;
            }
            return this.currentStep === 4;  // When there are no activities
        }
        return this.currentStep === 2;  // When there is no goal form
    },
},
methods: {
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

    handleFormValid() {
        this.currentStep++;
    },

    resetExitForm() {
        const tempExperiences = this.exitForm.experiences;
        if (!this.incompleteFormID || !this.incompleteFormID.length) {
            this.exitForm = JSON.parse(JSON.stringify(this.originalExitForm));
        }
        this.exitForm.experiences = tempExperiences;
        // Code to refresh all the child components
        this.componentsKey++;
        // Reset allowedStepsForJump to prevent navigation
        this.allowedStepsForJump = [0];
    },

    // Method to fix a bug: section has errors. User fixes the errors, then goes to exitFormExp to change experience. Since exitForm is reset, the previous section that had errors should not have errors, but it does
    resetErrorFlags() {
        // Reset all error flags
        this.expError = false;
        this.aspError = false;
        this.goalsError = false;
        this.actError = false;
        this.growthError = false;
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

    // TO EDIT: NEED TO UPDATE TO ALLOW JUMPING WHEN CONTINUING FORM.
    checkJump(step) {
        // Check if the current step is valid
        const isCurrentStepValid = this.isStepValid(this.currentStep);

        // Allow jump if the step is allowed and the current step is valid
        return isCurrentStepValid && this.allowedStepsForJump.includes(step);
    },

    isStepValid(step) {
        if (this.goalFormExists && this.activitiesExist) {
            switch(step) {
                case 0: return !this.expError;
                case 1: return !this.aspError;
                case 2: return !this.goalsError;
                case 3: return !this.actError;
                case 4: return !this.growthError;
                default: return true;
            }
        } else if (this.goalFormExists && !this.activitiesExist) {
            switch(step) {
                case 0: return !this.expError;
                case 1: return !this.aspError;
                case 2: return !this.goalsError;
                case 3: return !this.growthError;
                default: return true;
            }
        } else if (!this.goalFormExists) {
            switch(step) {
                case 0: return !this.expError;
                case 1: return !this.growthError;
                default: return true;
            }
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
            this.handleUpdateForm();
        } else {
            // If previously filled document wasn't found, create new document
            this.handleSubmitForm();
        }
    },

    async handleSubmitForm() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const userID = user.userId;
            const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-forms/${this.incompleteFormID}`;
            await axios.patch(apiURL, { completed: true, userID: userID,  }, { headers: { token }});
            this.formSubmitSuccess = true;
            const motivatingMessages = [
                "Well done on completing your journey! Reflect on your growth and get ready for what's next!",
                "Congratulations on wrapping up! You've put in the work and made real progress towards your aspirations.",
                "You've completed your Exit Form! Take a moment to appreciate how far you've come and the goals you've reached.",
                "Exit completed! Your dedication to your goals has truly paid off. Onward to new achievements!",
                "Fantastic job on your Exit Form! Your journey shows just how much you can accomplish with focus and persistence.",
                "You've crossed the finish line for this experience! Your efforts in reaching your goals are truly inspiring."
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
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/exit-forms/' + this.foundDocumentId;

        // Set 'expRegistrationID' from 'selectedExperience' if it exists, otherwise from 'tempIncompleteForm'
        const expRegistrationID = (this.selectedExperience && this.selectedExperience.expRegistrationID) || this.tempIncompleteForm.incompleteForm.expRegistrationID;

        const exitFormData = {
            expRegistrationID: expRegistrationID,
            exitForm: {
            progressMade: {
                aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected || "No aspiration",
                aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected || "No aspiration",
                aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected || "No aspiration",
                aspirationOneExperienceConnection:this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || "No aspiration",
                aspirationTwoExperienceConnection:this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || "No aspiration",
                aspirationThreeExperienceConnection:this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || "No aspiration",
                goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected || "No goal",
                goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected || "No goal",
                goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected || "No goal",
                goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected || "No goal",
                goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected || "No goal",
                goalOneExperienceConnection:this.exitForm.progressMade.goalOneExperienceConnectionSelected || "No goal",
                goalTwoExperienceConnection:this.exitForm.progressMade.goalTwoExperienceConnectionSelected || "No goal",
                goalThreeExperienceConnection:this.exitForm.progressMade.goalThreeExperienceConnectionSelected || "No goal",
                goalFourExperienceConnection:this.exitForm.progressMade.goalFourExperienceConnectionSelected || "No goal",
                goalFiveExperienceConnection:this.exitForm.progressMade.goalFiveExperienceConnectionSelected || "No goal",
            },
            goalIssues: {
                goals: this.exitForm.goalIssues.goals.filter(goal => goal.checked).map(goal => goal.label),
                issuesDescription: this.exitForm.goalIssues.issuesDescription
            },
            activitiesContribution: {
                goalOneContributions: this.exitForm.activitiesContribution.goalOneContributions,
                goalTwoContributions: this.exitForm.activitiesContribution.goalTwoContributions,
                goalThreeContributions: this.exitForm.activitiesContribution.goalThreeContributions,
                goalFourContributions: this.exitForm.activitiesContribution.goalFourContributions,
                goalFiveContributions: this.exitForm.activitiesContribution.goalFiveContributions,
                noContributions:this.exitForm.activitiesContribution.noContributions,
            },
            experienceContributions: this.exitForm.experienceContributions,
            likelihoodOf: {
                enrollAnotherCourse: this.exitForm.likelihoodOf.enrollAnotherCourseSelected || "",
                completeMinor: this.exitForm.likelihoodOf.completeMinorSelected || "",
                recommendCourse: this.exitForm.likelihoodOf.recommendCourseSelected || "",
                pursueCareer: this.exitForm.likelihoodOf.pursueCareerSelected || "",
            },
            generalGrowth: {
                problemSolving: this.exitForm.generalGrowth.problemSolving,
                effectiveCommunication: this.exitForm.generalGrowth.effectiveCommunication,
                teamwork: this.exitForm.generalGrowth.teamwork,
                culturalHumility: this.exitForm.generalGrowth.culturalHumility,
                ethicalDecisionMaking: this.exitForm.generalGrowth.ethicalDecisionMaking,
                professionalResponsibility: this.exitForm.generalGrowth.professionalResponsibility
            },
            openEnded: {
                biggestLessons: this.exitForm.openEnded.biggestLessons,
                supportOthers: this.exitForm.openEnded.supportOthers,
                comments: this.exitForm.openEnded.comments
            }
            }
        };

        let updatedExitForm = {
            exitForm: exitFormData,
            tempIncompleteFormID: this.incompleteFormID
        };

        axios.put(apiURL, updatedExitForm, { headers: { token } })
            .then(() => {
                this.formSubmitSuccess = true;
                const motivatingMessages = [
                    "Exit Form updated!",
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
    },

    async handleFirstInput() {
        console.log('handleFirstInput called');
        if (this.isFirstInput) {
            this.isFirstInput = false;

            try {
                const user = useLoggedInUserStore();
                const token = user.token;
                let apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/exit-forms";

                // Set 'expRegistrationID' from 'selectedExperience' if it exists, otherwise from 'tempIncompleteForm'
                const expRegistrationID = (this.selectedExperience && this.selectedExperience.expRegistrationID) || this.tempIncompleteForm.incompleteForm.expRegistrationID;

                const exitFormData = {
                    expRegistrationID: expRegistrationID,
                    exitForm: {
                    progressMade: {
                        aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected || "No aspiration",
                        aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected || "No aspiration",
                        aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected || "No aspiration",
                        aspirationOneExperienceConnection:this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || "No aspiration",
                        aspirationTwoExperienceConnection:this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || "No aspiration",
                        aspirationThreeExperienceConnection:this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || "No aspiration",
                        goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected || "No goal",
                        goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected || "No goal",
                        goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected || "No goal",
                        goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected || "No goal",
                        goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected || "No goal",
                        goalOneExperienceConnection:this.exitForm.progressMade.goalOneExperienceConnectionSelected || "No goal",
                        goalTwoExperienceConnection:this.exitForm.progressMade.goalTwoExperienceConnectionSelected || "No goal",
                        goalThreeExperienceConnection:this.exitForm.progressMade.goalThreeExperienceConnectionSelected || "No goal",
                        goalFourExperienceConnection:this.exitForm.progressMade.goalFourExperienceConnectionSelected || "No goal",
                        goalFiveExperienceConnection:this.exitForm.progressMade.goalFiveExperienceConnectionSelected || "No goal",
                    },
                    goalIssues: {
                        goals: this.exitForm.goalIssues.goals.filter(goal => goal.checked).map(goal => goal.label),
                        issuesDescription: this.exitForm.goalIssues.issuesDescription
                    },
                    activitiesContribution: {
                        goalOneContributions: this.exitForm.activitiesContribution.goalOneContributions,
                        goalTwoContributions: this.exitForm.activitiesContribution.goalTwoContributions,
                        goalThreeContributions: this.exitForm.activitiesContribution.goalThreeContributions,
                        goalFourContributions: this.exitForm.activitiesContribution.goalFourContributions,
                        goalFiveContributions: this.exitForm.activitiesContribution.goalFiveContributions,
                        noContributions:this.exitForm.activitiesContribution.noContributions,
                    },
                    experienceContributions: this.exitForm.experienceContributions,
                    likelihoodOf: {
                        enrollAnotherCourse: this.exitForm.likelihoodOf.enrollAnotherCourseSelected || "",
                        completeMinor: this.exitForm.likelihoodOf.completeMinorSelected || "",
                        recommendCourse: this.exitForm.likelihoodOf.recommendCourseSelected || "",
                        pursueCareer: this.exitForm.likelihoodOf.pursueCareerSelected || "",
                    },
                    generalGrowth: {
                        problemSolving: this.exitForm.generalGrowth.problemSolving,
                        effectiveCommunication: this.exitForm.generalGrowth.effectiveCommunication,
                        teamwork: this.exitForm.generalGrowth.teamwork,
                        culturalHumility: this.exitForm.generalGrowth.culturalHumility,
                        ethicalDecisionMaking: this.exitForm.generalGrowth.ethicalDecisionMaking,
                        professionalResponsibility: this.exitForm.generalGrowth.professionalResponsibility
                    },
                    openEnded: {
                        biggestLessons: this.exitForm.openEnded.biggestLessons,
                        supportOthers: this.exitForm.openEnded.supportOthers,
                        comments: this.exitForm.openEnded.comments
                    }
                    }
                };

                try {
                    const response = await axios.post(apiURL, exitFormData, {
                        headers: { token }
                    });
                    this.incompleteFormID = response.data.exitForm._id;
                } catch (error) {
                    this.handleError(error);
                }
            } catch (error) {
                    this.handleError(error);
            }
        }
    },

    handleInput() {
        this.debouncedUpdateExitForm();
    },

    updateOriginalExitForm(newVal) {
        this.originalExitForm = this.deepClone(newVal);
    },

    async checkIncompleteForm() {
        const user = useLoggedInUserStore();
        const token = user.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-form-incomplete/`;
        try {
            const response = await axios.get(apiURL, { headers: { token } });
            if (response.data.incompleteForm) {
                this.tempIncompleteForm = response.data;
                this.expRegistrationIDFromIncompleteBackup = this.tempIncompleteForm.incompleteForm.expRegistrationID;
                this.showIncompleteFormFoundDialog = true;
            }
        } catch (error) {
            this.handleError(error);
        }
    },

    async startNew() {
        const user = useLoggedInUserStore();
        const token = user.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-forms/${this.tempIncompleteForm.incompleteForm._id}`;

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
        const tempExperiences = this.exitForm.experiences;
        this.exitForm = JSON.parse(JSON.stringify(this.originalExitForm));
        this.exitForm.experiences = tempExperiences;
        const existingExitForm = this.tempIncompleteForm.incompleteForm.exitForm;


        // Transforming progressMade data
        this.exitForm.progressMade.aspirationOneProgressSelected = existingExitForm.progressMade.aspirationOneProgressResults;
        this.exitForm.progressMade.aspirationTwoProgressSelected = existingExitForm.progressMade.aspirationTwoProgressResults;
        this.exitForm.progressMade.aspirationThreeProgressSelected = existingExitForm.progressMade.aspirationThreeProgressResults;

        // Handle aspiration progress and experience connections
        const aspirations = ['aspirationOne', 'aspirationTwo', 'aspirationThree'];
        aspirations.forEach(aspiration => {
            // Set the selected progress
            const selectedProgress = existingExitForm.progressMade[aspiration + 'ProgressResults'];
            this.exitForm.progressMade[aspiration + 'ProgressSelected'] = selectedProgress;
            this.exitForm.progressMade[aspiration + 'ProgressResults'] = this.exitForm.progressMade[aspiration + 'ProgressResults'].map(option => ({
                ...option,
                checked: option.label === selectedProgress
            }));

            // Set the selected experience connection
            const selectedConnection = existingExitForm.progressMade[aspiration + 'ExperienceConnection'];
            this.exitForm.progressMade[aspiration + 'ExperienceConnectionSelected'] = selectedConnection;
            this.exitForm.progressMade[aspiration + 'ExperienceConnection'] = this.exitForm.progressMade[aspiration + 'ExperienceConnection'].map(option => ({
                ...option,
                checked: option.label === selectedConnection
            }));
        });

        this.exitForm.progressMade.aspirationOneExperienceConnectionSelected = existingExitForm.progressMade.aspirationOneExperienceConnection;
        this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected = existingExitForm.progressMade.aspirationTwoExperienceConnection;
        this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected = existingExitForm.progressMade.aspirationThreeExperienceConnection;

        this.exitForm.progressMade.goalOneProgressSelected = existingExitForm.progressMade.goalOneProgressResults;
        this.exitForm.progressMade.goalTwoProgressSelected = existingExitForm.progressMade.goalTwoProgressResults;
        this.exitForm.progressMade.goalThreeProgressSelected = existingExitForm.progressMade.goalThreeProgressResults;
        this.exitForm.progressMade.goalFourProgressSelected = existingExitForm.progressMade.goalFourProgressResults;
        this.exitForm.progressMade.goalFiveProgressSelected = existingExitForm.progressMade.goalFiveProgressResults;

        this.exitForm.progressMade.goalOneExperienceConnectionSelected = existingExitForm.progressMade.goalOneExperienceConnection;
        this.exitForm.progressMade.goalTwoExperienceConnectionSelected = existingExitForm.progressMade.goalTwoExperienceConnection;
        this.exitForm.progressMade.goalThreeExperienceConnectionSelected = existingExitForm.progressMade.goalThreeExperienceConnection;
        this.exitForm.progressMade.goalFourExperienceConnectionSelected = existingExitForm.progressMade.goalFourExperienceConnection;
        this.exitForm.progressMade.goalFiveExperienceConnectionSelected = existingExitForm.progressMade.goalFiveExperienceConnection;

        // Transforming goalIssues data
        const dbGoals = existingExitForm.goalIssues.goals;
        this.exitForm.goalIssues.goals = this.exitForm.goalIssues.goals.map(goal => ({
            ...goal,
            checked: dbGoals.includes(goal.label)  // Check if the goal label is included in the dbGoals array
        }));
        this.exitForm.goalIssues.issuesDescription = existingExitForm.goalIssues.issuesDescription;


        // Activities Contribution
        this.exitForm.activitiesContribution = existingExitForm.activitiesContribution;

        // Experience Contribution
        this.exitForm.experienceContributions = existingExitForm.experienceContributions;

        // Likelihood Of
        const likelihoodCategories = ['enrollAnotherCourse', 'completeMinor', 'recommendCourse', 'pursueCareer'];
        likelihoodCategories.forEach(category => {
            // Assign the selected value from the database to the 'Selected' property in the Vue model
            this.exitForm.likelihoodOf[category + 'Selected'] = existingExitForm.likelihoodOf[category + 'Selected'];

            // Map each option, checking if it matches the selected value
            this.exitForm.likelihoodOf[category] = this.exitForm.likelihoodOf[category].map(option => ({
                ...option,
                checked: option.label === this.exitForm.likelihoodOf[category + 'Selected']
            }));
        });

        // General Growth
        this.exitForm.generalGrowth = existingExitForm.generalGrowth;

        // Open Ended
        this.exitForm.openEnded = existingExitForm.openEnded;

        this.expRegistrationIDFromIncomplete = this.tempIncompleteForm.incompleteForm.expRegistrationID

        this.incompleteFormID = this.tempIncompleteForm.incompleteForm._id;
        this.showIncompleteFormFoundDialog = false;
    },

    updateExitForm() {
        const user = useLoggedInUserStore();
        const token = user.token;
        const userID = user.userId;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-forms/${this.incompleteFormID}`;

        // Set 'expRegistrationID' from 'selectedExperience' if it exists, otherwise from 'tempIncompleteForm'
        const expRegistrationID = (this.selectedExperience && this.selectedExperience.expRegistrationID) || this.tempIncompleteForm.incompleteForm.expRegistrationID;

        const exitFormData = {
            expRegistrationID: expRegistrationID,
            exitForm: {
            progressMade: {
                aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected || "No aspiration",
                aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected || "No aspiration",
                aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected || "No aspiration",
                aspirationOneExperienceConnection:this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || "No aspiration",
                aspirationTwoExperienceConnection:this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || "No aspiration",
                aspirationThreeExperienceConnection:this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || "No aspiration",
                goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected || "No goal",
                goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected || "No goal",
                goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected || "No goal",
                goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected || "No goal",
                goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected || "No goal",
                goalOneExperienceConnection:this.exitForm.progressMade.goalOneExperienceConnectionSelected || "No goal",
                goalTwoExperienceConnection:this.exitForm.progressMade.goalTwoExperienceConnectionSelected || "No goal",
                goalThreeExperienceConnection:this.exitForm.progressMade.goalThreeExperienceConnectionSelected || "No goal",
                goalFourExperienceConnection:this.exitForm.progressMade.goalFourExperienceConnectionSelected || "No goal",
                goalFiveExperienceConnection:this.exitForm.progressMade.goalFiveExperienceConnectionSelected || "No goal",
            },
            goalIssues: {
                goals: this.exitForm.goalIssues.goals.filter(goal => goal.checked).map(goal => goal.label),
                issuesDescription: this.exitForm.goalIssues.issuesDescription
            },
            activitiesContribution: {
                goalOneContributions: this.exitForm.activitiesContribution.goalOneContributions,
                goalTwoContributions: this.exitForm.activitiesContribution.goalTwoContributions,
                goalThreeContributions: this.exitForm.activitiesContribution.goalThreeContributions,
                goalFourContributions: this.exitForm.activitiesContribution.goalFourContributions,
                goalFiveContributions: this.exitForm.activitiesContribution.goalFiveContributions,
                noContributions:this.exitForm.activitiesContribution.noContributions,
            },
            experienceContributions: this.exitForm.experienceContributions,
            likelihoodOf: {
                enrollAnotherCourse: this.exitForm.likelihoodOf.enrollAnotherCourseSelected || "",
                completeMinor: this.exitForm.likelihoodOf.completeMinorSelected || "",
                recommendCourse: this.exitForm.likelihoodOf.recommendCourseSelected || "",
                pursueCareer: this.exitForm.likelihoodOf.pursueCareerSelected || "",
            },
            generalGrowth: {
                problemSolving: this.exitForm.generalGrowth.problemSolving,
                effectiveCommunication: this.exitForm.generalGrowth.effectiveCommunication,
                teamwork: this.exitForm.generalGrowth.teamwork,
                culturalHumility: this.exitForm.generalGrowth.culturalHumility,
                ethicalDecisionMaking: this.exitForm.generalGrowth.ethicalDecisionMaking,
                professionalResponsibility: this.exitForm.generalGrowth.professionalResponsibility
            },
            openEnded: {
                biggestLessons: this.exitForm.openEnded.biggestLessons,
                supportOthers: this.exitForm.openEnded.supportOthers,
                comments: this.exitForm.openEnded.comments
            }
            }
        };

        axios.patch(apiURL, exitFormData, { headers: { token }})
            .then(response => {
            })
            .catch(error => {
                this.handleError(error);
            });
    },

    handleUpdateIncompleteExpRegistration() {
        // Set this to null so that the app start a new form when user selects a new experiences
        this.expRegistrationIDFromIncomplete = null;
    },

    handleUpdateDataAndSociety(status) {
        this.dataAndSociety = status;
    },
    
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