<!--
  File: src/components/studentSide/exitForm/exitFormMain.vue
  
  This component manages the main exit form interface for students completing their course experience.
  It implements a multi-step form using a stepper component that guides users through documenting
  their experience, aspirations, goals, activities, growth, and final review. The form supports
  saving incomplete progress and resuming later, with conditional steps based on whether the
  student completed initial goal forms and participated in activities.
-->

<template>
    <!-- Exit Form Header Section -->
    <v-container style="width: 100%; margin: 0 auto;">
        <div style="display: flex; align-items:center;">
            <p class="font-weight-black text-h5 text--primary">
                {{ $t("Exit Form") }}
            </p>
            <!-- Help Dialog -->
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
                    <v-card :title="$t('Exit Form')">
                        <v-card-text>
                        {{$t('The exit survey helps us to connect the goals you made at the beginning of the semester to the activities in the course. This is also an opportunity for you to give us feedback on the experience as a whole. Even if you did not fill out your goals at the beginning of the semester, you can still complete the exit survey to give us general feedback. ')}}
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

    <!-- Multi-Step Form Stepper -->
    <v-container>
        <v-row>
            <v-col>
                <v-stepper
                    :alt-labels="showAltLabels"
                    v-model="currentStep"
                    :mobile="$vuetify.display.xs"
                    :flat="$vuetify.display.xs"
                >
                    <!-- Stepper Header with Conditional Steps -->
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
                            v-if="goalFormExists"
                            :title="$t('Aspirations')"
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
                            :title="$t('Goals')"
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
                            :title="$t('Activities')"
                            icon="mdi-toolbox"
                            edit-icon="mdi-toolbox"
                            :value="actCurrentStepValue"
                            :error="actError"
                            :editable="checkJump(3)"
                        ></v-stepper-item>

                        <v-divider v-if="goalFormExists && activitiesExist"></v-divider>

                        <v-stepper-item
                            ref="step4"
                            :title="$t('Growth')"
                            icon="mdi-sprout"
                            edit-icon="mdi-sprout"
                            :value="growthCurrentStepValue"
                            :error="growthError"
                            :editable="checkJump(4)"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step5"
                            :title="$t('Review')"
                            icon="mdi-check-bold"
                            edit-icon="mdi-check-bold"
                            :value="reviewCurrentStepValue"
                            :editable="checkJump(5)"
                        ></v-stepper-item>
                    </v-stepper-header>

                    <!-- Progress Bar -->
                    <div id="progress-bar" :style="{ width: progressBarWidth }"></div>

                    <!-- Desktop View -->
                    <v-container>
                    <v-stepper-window v-if="$vuetify.display.smAndUp">
                        <!-- Experience Step -->
                        <v-stepper-window-item value="0">
                        <exit-form-exp
                            ref="ExitFormExpRef"
                            :exitForm="exitForm"
                            :originalExitForm="originalExitForm"
                            :originalExitFormTwo="originalExitFormTwo"
                            :isFirstInput="isFirstInput"
                            :expRegistrationIDFromIncomplete="expRegistrationIDFromIncomplete"
                            :tempIncompleteForm="tempIncompleteForm"
                            :startNewSelected="startNewSelected"
                            :currentlyUsingIncompleteForm="currentlyUsingIncompleteForm"
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
                            @update-first-input="handleUpdateFirstInput"
                        ></exit-form-exp>
                        </v-stepper-window-item>
                        <!-- Aspirations Step -->
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
                        <!-- Goals Step -->
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
                        <!-- Activities Step -->
                        <v-stepper-window-item :value="actCurrentStepValue">
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
                        <!-- Growth Step -->
                        <v-stepper-window-item :value="growthCurrentStepValue">
                        <exit-form-growth
                            ref="ExitFormGrowthRef"
                            :key="componentsKey"
                            :exitForm="exitForm"
                            :dataAndSociety="dataAndSociety"
                            :selectedExperience="selectedExperience"
                            @form-valid="handleFormValid(4)"
                            @form-invalid="handleFormInvalid('growth')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('growth', $event)"
                        ></exit-form-growth>
                        </v-stepper-window-item>
                        <!-- Review Step -->
                        <v-stepper-window-item :value="reviewCurrentStepValue">
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
                    <v-stepper-window v-if="$vuetify.display.xs">
                        <v-stepper-window-item value="0">
                        <exit-form-exp
                            ref="ExitFormExpRef"
                            :exitForm="exitForm"
                            :originalExitForm="originalExitForm"
                            :originalExitFormTwo="originalExitFormTwo"
                            :isFirstInput="isFirstInput"
                            :expRegistrationIDFromIncomplete="expRegistrationIDFromIncomplete"
                            :tempIncompleteForm="tempIncompleteForm"
                            :startNewSelected="startNewSelected"
                            :currentlyUsingIncompleteForm="currentlyUsingIncompleteForm"
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
                            @update-first-input="handleUpdateFirstInput"
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
                        <v-stepper-window-item :value="actCurrentStepValue">
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
                        <v-stepper-window-item :value="growthCurrentStepValue">
                        <exit-form-growth
                            ref="ExitFormGrowthRef"
                            :key="componentsKey"
                            :exitForm="exitForm"
                            :dataAndSociety="dataAndSociety"
                            :selectedExperience="selectedExperience"
                            @form-valid="handleFormValid(4)"
                            @form-invalid="handleFormInvalid('growth')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('growth', $event)"
                        ></exit-form-growth>
                        </v-stepper-window-item>
                        <v-stepper-window-item :value="reviewCurrentStepValue">
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

                    <!-- Navigation Buttons -->
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
                            <v-btn 
                                v-if="showSubmitButton" 
                                type="submit" 
                                @click="submitFormCleanup" 
                                class="btn"
                            >
                                {{$t('Submit Form')}}
                            </v-btn>
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
                {{ $t('Confirm Navigation') }}
            </v-card-title>
            <v-card-text>
                <p>{{ $t('Are you sure you want to leave?') }} <strong>{{ $t('Your responses will be saved for later.') }}</strong></p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancelLeave">
                    {{ $t('Cancel') }}
                </v-btn>
                <v-btn color="red darken-2" text @click="confirmLeave">
                    {{ $t('Yes, Leave') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Incomplete Form Found Dialog -->
    <v-dialog v-model="showIncompleteFormFoundDialog" persistent max-width="500px">
        <v-card>
            <v-card-title class="text-h5">
                {{ $t('Resume Your Progress?') }}
            </v-card-title>
            <v-card-text>
                <p>{{ $t('We found an incomplete Exit Form from your last session. Would you like to continue where you left off or start a new form?') }}</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="startNew">
                    {{ $t('Start New') }}
                </v-btn>
                <v-btn color="red darken-2" text @click="continueProgress">
                    {{ $t('Continue') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

// Import dependencies and child components
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
        // Stepper navigation state
        currentStep: 0,
        allowedStepsForJump: [0],
        
        // Form validation error flags
        expError: false,
        aspError: false,
        goalsError: false,
        actError: false,
        growthError: false,
        
        // Form metadata
        foundDocumentId: null,
        goalSettingFormBackground: null,
        selectedExperience: null,
        hichProject: [],
        formSubmitSuccess: false,
        
        // Main exit form data structure
        exitForm: {
            semester: "",
            experiences: [
                {
                _id: "",
                experienceCategory: "",
                experienceName: "",
                expRegistrationID: "",      
                expInstanceID: "",          
                instructor: null
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
            expInstanceID: "",
            instructor: null,
            experienceActivities:[],
            
            // Progress tracking for aspirations and goals
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
            
            // Goal obstacles and solutions section
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
            
            // Activity contribution mapping to goals
            activitiesContribution: {
                goalOneContributions: [],
                goalTwoContributions: [],
                goalThreeContributions: [],
                goalFourContributions: [],
                goalFiveContributions: [],
                noContributions: []
            },
            
            // Overall experience impact rating
            experienceContributions: "",
            
            // Future action likelihood ratings
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
            
            // General skill growth assessments
            generalGrowth: {
                problemSolving: "",
                effectiveCommunication: "",
                teamwork: "",
                culturalHumility: "",
                ethicalDecisionMaking: "",
                professionalResponsibility: ""
            },

            chwGrowth: {
                interpersonalRelationshipBuilding: "",
                serviceCoordinationNavigation: "",
                evaluationResearch: "",
                knowledgeBaseHealthIssues: "",
                teachingEducation: "",
                advocacy: ""
            },

            hichNetPromoter: {
                recommendHICH: "",
                recommendSocialsWorkshops: "",
                recommendVolunteerProjects: "",
                recommendMentorshipProgram: ""
            },
            
            // Open-ended feedback questions
            openEnded: {
                biggestLessons: "",
                supportOthers: "",
                comments: ""
            }
        },
        
        // Original form state for comparison and reset
        originalExitFormTwo: {},
        originalExitForm: {
            semester: "",
            experiences: [
                {
                _id: "",
                experienceCategory: "",
                experienceName: "",
                expRegistrationID: "",      
                expInstanceID: "",         
                instructor: null
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
            expInstanceID: "",          
            instructor: null,                   
            experienceActivities:[],
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
            activitiesContribution: {
                goalOneContributions: [],
                goalTwoContributions: [],
                goalThreeContributions: [],
                goalFourContributions: [],
                goalFiveContributions: [],
                noContributions: []
            },
            experienceContributions: "",
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
            generalGrowth: {
                problemSolving: "",
                effectiveCommunication: "",
                teamwork: "",
                culturalHumility: "",
                ethicalDecisionMaking: "",
                professionalResponsibility: ""
            },
            chwGrowth: {
                interpersonalRelationshipBuilding: "",
                serviceCoordinationNavigation: "",
                evaluationResearch: "",
                knowledgeBaseHealthIssues: "",
                teachingEducation: "",
                advocacy: ""
            },
            hichNetPromoter: {
                recommendHICH: "",
                recommendSocialsWorkshops: "",
                recommendVolunteerProjects: "",
                recommendMentorshipProgram: ""
            },
            openEnded: {
                biggestLessons: "",
                supportOthers: "",
                comments: ""
            }
        },
        
        // Dialog and navigation state
        leaveDialog: false,
        nextFunction: null,
        
        // Form configuration flags
        goalFormExists: false,
        activitiesExist: false,
        componentsKey: 0,
        isFirstInput: true,
        
        // Incomplete form management
        incompleteFormID: null,
        showIncompleteFormFoundDialog: false,
        tempIncompleteForm: {},
        expRegistrationIDFromIncomplete: null,
        expRegistrationIDFromIncompleteBackup: null,
        dataAndSociety: false,
        startNewSelected: false,
        currentlyUsingIncompleteForm: false,
    }
},

// Lifecycle hooks
async created() {
    // Initialize debounced save function
    this.debouncedUpdateExitForm = debounce(this.updateExitForm, 1000);
},
async mounted() {
    // Clone original form state for comparison
    this.originalExitFormTwo = this.deepClone(this.originalExitForm);
    // Check for previously saved incomplete forms
    await this.checkIncompleteForm();
    // Scroll to top of page
    this.$nextTick(() => {
        window.scrollTo(0, 0);
    });
},

// Watchers for reactive updates
watch: {
    // Track step progression and update allowed navigation
    currentStep(newVal) {
        this.currentStep = Number(newVal);
        if (this.allowedStepsForJump.length === 0 || this.currentStep > Math.max(...this.allowedStepsForJump)) {
            this.allowedStepsForJump.push(this.currentStep);
        }
    },
    
    // Auto-save form changes with debouncing
    exitForm: {
        handler(newVal, oldVal) {
            if (newVal && !isEqual(newVal, this.originalExitForm)) {
                if (this.isFirstInput) {
                    this.handleFirstInput();
                } else {
                    this.handleInput();
                }
            }
        },
        deep: true,
    },
},

// Computed properties
computed: {
    // Stepper label display configuration
    showAltLabels() {
        if (this.$vuetify.display.mdAndUp || this.$vuetify.display.xs) {
            return false;
        } else {
            return true;
        }
    },

    // Progress bar width calculation based on available steps
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

    // Check if HICH project checkboxes should be included
    shouldIncludeHichProject() {
        return this.$refs.ExitFormExpRef?.shouldShowHichCheckboxes && this.hichProject.length > 0;
    },

    // User authentication status
    isUserLoggedIn() {
        const store = useLoggedInUserStore();
        return store.isLoggedIn;
    },

    // Filter and return non-empty goals
    existingGoals() {
        return [
            this.exitForm.goal1, 
            this.exitForm.goal2, 
            this.exitForm.goal3, 
            this.exitForm.goal4, 
            this.exitForm.goal5
        ].filter(goal => goal);
    },

    // Determine if submit button should be shown based on current step
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

    // Step visibility helpers
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
        return this.currentStep === 1;
    },
    showReviewStep() {
        if (this.goalFormExists) {
            if (this.activitiesExist) {
                return this.currentStep === 5;
            }
            return this.currentStep === 4;
        }
        return this.currentStep === 2;
    },
    
    // Dynamic step values based on form configuration
    actCurrentStepValue() {
        if (this.goalFormExists && this.activitiesExist) {
            return 3;
        } else {
            return 993;
        }
    },
    growthCurrentStepValue() {
        if (this.goalFormExists && this.activitiesExist) {
            return 4;
        } else if (this.goalFormExists && !this.activitiesExist) {
            return 3;
        } else if (!this.goalFormExists) {
            return 1;
        }
    },
    reviewCurrentStepValue() {
        if (this.goalFormExists && this.activitiesExist) {
            return 5;
        } else if (this.goalFormExists && !this.activitiesExist) {
            return 4;
        } else if (!this.goalFormExists) {
            return 2;
        }
    },
},

methods: {
    // Legacy method for updating goal form with background data
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

    // Form navigation and validation handlers
    handleFormValid() {
        this.currentStep++;
    },

    // Reset form to original state
    resetExitForm() {
        const tempExperiences = this.exitForm.experiences;
        this.exitForm = JSON.parse(JSON.stringify(this.originalExitForm));
        this.exitForm.experiences = tempExperiences;
        this.componentsKey++;
        this.allowedStepsForJump = [0];
    },

    // Clear all validation error flags
    resetErrorFlags() {
        this.expError = false;
        this.aspError = false;
        this.goalsError = false;
        this.actError = false;
        this.growthError = false;
    },
    
    // Set error flag for specific form section
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

    // Smooth scroll to error element
    handleScrollToError(element) {
        if (element && element.scrollIntoView) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    },

    // Update validation state for form sections
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

    // Trigger validation for current step
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

    // Individual step validation triggers
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

    // Event handlers from child components
    handleSelectedExperience(value) {
        this.selectedExperience = value;
    },
    stepVisited(step) {
        if (!this.visitedSteps.includes(step)) {
            this.visitedSteps.push(step);
        }
    },

    // Step navigation validation
    checkJump(step) {
        const stepToSectionMap = {
            1: 'aspirationsSection',
            2: 'goalsSection',
            3: 'activitiesSection',
            4: 'growthSection',
        };
        const section = stepToSectionMap[step];
        const isCurrentStepValid = this.isStepValid(this.currentStep);
        const isSectionEdited = this.isSectionEdited(section);
        return isCurrentStepValid && (isSectionEdited || this.allowedStepsForJump.includes(step));
    },

    // Validate specific step based on form configuration
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

    // Check if section has been modified from original state
    isSectionEdited(section) {        
        if (section === 'aspirationsSection') {
            const originalAspirationOneProgressSelected = this.originalExitFormTwo.progressMade.aspirationOneProgressSelected;
            const originalAspirationTwoProgressSelected = this.originalExitFormTwo.progressMade.aspirationTwoProgressSelected;
            const originalAspirationThreeProgressSelected = this.originalExitFormTwo.progressMade.aspirationThreeProgressSelected;

            const originalAspirationOneExperienceConnectionSelected = this.originalExitFormTwo.progressMade.aspirationOneExperienceConnectionSelected;
            const originalAspirationTwoExperienceConnectionSelected = this.originalExitFormTwo.progressMade.aspirationTwoExperienceConnectionSelected;
            const originalAspirationThreeExperienceConnectionSelected = this.originalExitFormTwo.progressMade.aspirationThreeExperienceConnectionSelected;

            const currentAspirationOneProgressSelected = this.exitForm.progressMade.aspirationOneProgressSelected;
            const currentAspirationTwoProgressSelected = this.exitForm.progressMade.aspirationTwoProgressSelected;
            const currentAspirationThreeProgressSelected = this.exitForm.progressMade.aspirationThreeProgressSelected;

            const currentAspirationOneExperienceConnectionSelected = this.exitForm.progressMade.aspirationOneExperienceConnectionSelected;
            const currentAspirationTwoExperienceConnectionSelected = this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected;
            const currentAspirationThreeExperienceConnectionSelected = this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected;

            const aspirationOneProgressSelectedEdited = !isEqual(originalAspirationOneProgressSelected, currentAspirationOneProgressSelected);
            const aspirationTwoProgressSelectedEdited = !isEqual(originalAspirationTwoProgressSelected, currentAspirationTwoProgressSelected);
            const aspirationThreeProgressSelectedEdited = !isEqual(originalAspirationThreeProgressSelected, currentAspirationThreeProgressSelected);
            const aspirationOneExperienceConnectionSelectedEdited = !isEqual(originalAspirationOneExperienceConnectionSelected, currentAspirationOneExperienceConnectionSelected);
            const aspirationTwoExperienceConnectionSelectedEdited = !isEqual(originalAspirationTwoExperienceConnectionSelected, currentAspirationTwoExperienceConnectionSelected);
            const aspirationThreeExperienceConnectionSelectedEdited = !isEqual(originalAspirationThreeExperienceConnectionSelected, currentAspirationThreeExperienceConnectionSelected);

            const editedCheck = aspirationOneProgressSelectedEdited || aspirationTwoProgressSelectedEdited || aspirationThreeProgressSelectedEdited || aspirationOneExperienceConnectionSelectedEdited || aspirationTwoExperienceConnectionSelectedEdited || aspirationThreeExperienceConnectionSelectedEdited;

            return editedCheck
        } else if (section === 'goalsSection') {
            const originalGoalOneProgressSelected = this.originalExitFormTwo.progressMade.goalOneProgressSelected;
            const originalGoalTwoProgressSelected = this.originalExitFormTwo.progressMade.goalTwoProgressSelected;
            const originalGoalThreeProgressSelected = this.originalExitFormTwo.progressMade.goalThreeProgressSelected;
            const originalGoalFourProgressSelected = this.originalExitFormTwo.progressMade.goalFourProgressSelected;
            const originalGoalFiveProgressSelected = this.originalExitFormTwo.progressMade.goalFiveProgressSelected;

            const originalGoalOneExperienceConnectionSelected = this.originalExitFormTwo.progressMade.goalOneProgressSelected;
            const originalGoalTwoExperienceConnectionSelected = this.originalExitFormTwo.progressMade.goalTwoProgressSelected;
            const originalGoalThreeExperienceConnectionSelected = this.originalExitFormTwo.progressMade.goalThreeProgressSelected;
            const originalGoalFourExperienceConnectionSelected = this.originalExitFormTwo.progressMade.goalFourProgressSelected;
            const originalGoalFiveExperienceConnectionSelected = this.originalExitFormTwo.progressMade.goalFiveProgressSelected;

            const originalGoalIssues = this.originalExitFormTwo.goalIssues;

            const currentGoalOneProgressSelected = this.exitForm.progressMade.goalOneProgressSelected;
            const currentGoalTwoProgressSelected = this.exitForm.progressMade.goalTwoProgressSelected;
            const currentGoalThreeProgressSelected = this.exitForm.progressMade.goalThreeProgressSelected;
            const currentGoalFourProgressSelected = this.exitForm.progressMade.goalFourProgressSelected;
            const currentGoalFiveProgressSelected = this.exitForm.progressMade.goalFiveProgressSelected;

            const currentGoalOneExperienceConnectionSelected = this.exitForm.progressMade.goalOneProgressSelected;
            const currentGoalTwoExperienceConnectionSelected = this.exitForm.progressMade.goalTwoProgressSelected;
            const currentGoalThreeExperienceConnectionSelected = this.exitForm.progressMade.goalThreeProgressSelected;
            const currentGoalFourExperienceConnectionSelected = this.exitForm.progressMade.goalFourProgressSelected;
            const currentGoalFiveExperienceConnectionSelected = this.exitForm.progressMade.goalFiveProgressSelected;

            const currentGoalIssues = this.exitForm.goalIssues;

            const goalOneProgressSelectedEdited = !isEqual(originalGoalOneProgressSelected, currentGoalOneProgressSelected);
            const goalTwoProgressSelectedEdited = !isEqual(originalGoalTwoProgressSelected, currentGoalTwoProgressSelected);
            const goalThreeProgressSelectedEdited = !isEqual(originalGoalThreeProgressSelected, currentGoalThreeProgressSelected);
            const goalFourProgressSelectedEdited = !isEqual(originalGoalFourProgressSelected, currentGoalFourProgressSelected);
            const goalFiveProgressSelectedEdited = !isEqual(originalGoalFiveProgressSelected, currentGoalFiveProgressSelected);
            const goalOneExperienceConnectionSelectedEdited = !isEqual(originalGoalOneExperienceConnectionSelected, currentGoalOneExperienceConnectionSelected);
            const goalTwoExperienceConnectionSelectedEdited = !isEqual(originalGoalTwoExperienceConnectionSelected, currentGoalTwoExperienceConnectionSelected);
            const goalThreeExperienceConnectionSelectedEdited = !isEqual(originalGoalThreeExperienceConnectionSelected, currentGoalThreeExperienceConnectionSelected);
            const goalFourExperienceConnectionSelectedEdited = !isEqual(originalGoalFourExperienceConnectionSelected, currentGoalFourExperienceConnectionSelected);
            const goalFiveExperienceConnectionSelectedEdited = !isEqual(originalGoalFiveExperienceConnectionSelected, currentGoalFiveExperienceConnectionSelected);
            const goalIssuesEdited = !isEqual(originalGoalIssues, currentGoalIssues);

            const editedCheck = goalOneProgressSelectedEdited || goalTwoProgressSelectedEdited || goalThreeProgressSelectedEdited || goalFourProgressSelectedEdited || goalFiveProgressSelectedEdited || goalOneExperienceConnectionSelectedEdited || goalTwoExperienceConnectionSelectedEdited || goalThreeExperienceConnectionSelectedEdited || goalFourExperienceConnectionSelectedEdited || goalFiveExperienceConnectionSelectedEdited || goalIssuesEdited;

            return editedCheck
        } else if (section === 'activitiesSection') {
            const originalActivitiesContribution = this.originalExitFormTwo.activitiesContribution;
            const currentActivitiesContribution = this.exitForm.activitiesContribution;
            const activitiesContributionEdited = !isEqual(originalActivitiesContribution, currentActivitiesContribution);
            return activitiesContributionEdited
        } else if (section === 'growthSection') {
            const originalExperienceContributions = this.originalExitFormTwo.experienceContributions;

            let enrollAnotherCourseSelectedEdited = null;
            let completeMinorSelectedEdited = null;
            let recommendCourseSelectedEdited = null;
            let pursueCareerSelectedEdited = null;

            if (this.dataAndSociety) {
                const originalEnrollAnotherCourseSelected = this.originalExitFormTwo.likelihoodOf.enrollAnotherCourseSelected;
                const originalCompleteMinorSelected = this.originalExitFormTwo.likelihoodOf.completeMinorSelected;
                const originalRecommendCourseSelected = this.originalExitFormTwo.likelihoodOf.recommendCourseSelected;
                const originalPursueCareerSelected = this.originalExitFormTwo.likelihoodOf.pursueCareerSelected;

                const currentEnrollAnotherCourseSelected = this.exitForm.likelihoodOf.enrollAnotherCourseSelected || "";
                const currentCompleteMinorSelected = this.exitForm.likelihoodOf.completeMinorSelected || "";
                const currentRecommendCourseSelected = this.exitForm.likelihoodOf.recommendCourseSelected || "";
                const currentPursueCareerSelected = this.exitForm.likelihoodOf.pursueCareerSelected || "";

                enrollAnotherCourseSelectedEdited = !isEqual(originalEnrollAnotherCourseSelected, currentEnrollAnotherCourseSelected);
                completeMinorSelectedEdited = !isEqual(originalCompleteMinorSelected, currentCompleteMinorSelected);
                recommendCourseSelectedEdited = !isEqual(originalRecommendCourseSelected, currentRecommendCourseSelected);
                pursueCareerSelectedEdited = !isEqual(originalPursueCareerSelected, currentPursueCareerSelected);
            }

            const originalGeneralGrowth = this.originalExitFormTwo.generalGrowth;
            const originalOpenEnded = this.originalExitFormTwo.openEnded;
            const originalChwGrowth = this.originalExitFormTwo.chwGrowth;
            const currentExperienceContributions = this.exitForm.experienceContributions;
            const currentGeneralGrowth = this.exitForm.generalGrowth;
            const currentOpenEnded = this.exitForm.openEnded;
            const currentChwGrowth = this.exitForm.chwGrowth;

            const experienceContributionsEdited = !isEqual(originalExperienceContributions, currentExperienceContributions);
            const generalGrowthEdited = !isEqual(originalGeneralGrowth, currentGeneralGrowth);
            const openEndedEdited = !isEqual(originalOpenEnded, currentOpenEnded);
            const chwGrowthEdited = !isEqual(originalChwGrowth, currentChwGrowth);

            if (this.dataAndSociety) {
                const editedCheck = experienceContributionsEdited || enrollAnotherCourseSelectedEdited || completeMinorSelectedEdited || recommendCourseSelectedEdited || pursueCareerSelectedEdited || generalGrowthEdited || openEndedEdited || chwGrowthEdited;;
                return editedCheck;
            } else {
                const editedCheck = experienceContributionsEdited || generalGrowthEdited || openEndedEdited || chwGrowthEdited;
                return editedCheck;
            }
        }
    },

    // Navigate to previous step with validation check
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

    // Form submission handler
    submitFormCleanup() {
        if (this.foundDocumentId) {
            this.handleUpdateForm();
        } else {
            this.handleSubmitForm();
        }
    },

    // Create new exit form submission
    async handleSubmitForm() {
        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const userID = user.userId;
            const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-forms/${this.incompleteFormID}`;
            await axios.patch(apiURL, { completed: true, userID: userID,  }, { headers: { token }});
            this.formSubmitSuccess = true;
            
            // Randomized success messages
            const motivatingMessages = [
                "Well done on completing your journey! Reflect on your growth and get ready for what's next!",
                "Congratulations on wrapping up! You've put in the work and made real progress towards your aspirations.",
                "You've completed your Exit Form! Take a moment to appreciate how far you've come and the goals you've reached.",
                "Exit completed! Your dedication to your goals has truly paid off. Onward to new achievements!",
                "Fantastic job on your Exit Form! Your journey shows just how much you can accomplish with focus and persistence.",
                "You've crossed the finish line for this experience! Your efforts in reaching your goals are truly inspiring."
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

    // Update form completion status in store
    async updateChecklistStore() {
        const user = useLoggedInUserStore();
        await user.checkFormCompletion();
    },

    // Update existing exit form
async handleUpdateForm() {
    const user = useLoggedInUserStore();
    let token = user.token;
    let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/exit-forms/' + this.foundDocumentId;

    const expRegistrationID = (this.selectedExperience && this.selectedExperience.expRegistrationID) || this.tempIncompleteForm.incompleteForm.expRegistrationID;

    // Prepare base form data
    const exitFormData = {
        expRegistrationID: expRegistrationID,
        exitForm: {
            progressMade: {
                aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected || "No aspiration",
                aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected || "No aspiration",
                aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected || "No aspiration",
                aspirationOneExperienceConnection: this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || "No aspiration",
                aspirationTwoExperienceConnection: this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || "No aspiration",
                aspirationThreeExperienceConnection: this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || "No aspiration",
                goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected || "No goal",
                goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected || "No goal",
                goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected || "No goal",
                goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected || "No goal",
                goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected || "No goal",
                goalOneExperienceConnection: this.exitForm.progressMade.goalOneExperienceConnectionSelected || "No goal",
                goalTwoExperienceConnection: this.exitForm.progressMade.goalTwoExperienceConnectionSelected || "No goal",
                goalThreeExperienceConnection: this.exitForm.progressMade.goalThreeExperienceConnectionSelected || "No goal",
                goalFourExperienceConnection: this.exitForm.progressMade.goalFourExperienceConnectionSelected || "No goal",
                goalFiveExperienceConnection: this.exitForm.progressMade.goalFiveExperienceConnectionSelected || "No goal",
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
                noContributions: this.exitForm.activitiesContribution.noContributions,
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

    // Only add HICH data if there's actual data (not empty strings)
    const hasHichData = (
        (this.exitForm.hichNetPromoter.recommendHICH !== "" && 
         this.exitForm.hichNetPromoter.recommendHICH !== null && 
         this.exitForm.hichNetPromoter.recommendHICH !== undefined) ||
        (this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== "" && 
         this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== null && 
         this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== undefined) ||
        (this.exitForm.hichNetPromoter.recommendVolunteerProjects !== "" && 
         this.exitForm.hichNetPromoter.recommendVolunteerProjects !== null && 
         this.exitForm.hichNetPromoter.recommendVolunteerProjects !== undefined) ||
        (this.exitForm.hichNetPromoter.recommendMentorshipProgram !== "" && 
         this.exitForm.hichNetPromoter.recommendMentorshipProgram !== null && 
         this.exitForm.hichNetPromoter.recommendMentorshipProgram !== undefined)
    );

    if (hasHichData) {
        exitFormData.exitForm.hichNetPromoter = {
            recommendHICH: this.exitForm.hichNetPromoter.recommendHICH || "",
            recommendSocialsWorkshops: this.exitForm.hichNetPromoter.recommendSocialsWorkshops || "",
            recommendVolunteerProjects: this.exitForm.hichNetPromoter.recommendVolunteerProjects || "",
            recommendMentorshipProgram: this.exitForm.hichNetPromoter.recommendMentorshipProgram || ""
        };
    }

    // Only add CHW data if there's actual data
    const hasChwData = (
        this.exitForm.chwGrowth.interpersonalRelationshipBuilding ||
        this.exitForm.chwGrowth.serviceCoordinationNavigation ||
        this.exitForm.chwGrowth.evaluationResearch ||
        this.exitForm.chwGrowth.knowledgeBaseHealthIssues ||
        this.exitForm.chwGrowth.teachingEducation ||
        this.exitForm.chwGrowth.advocacy
    );

    if (hasChwData) {
        exitFormData.exitForm.chwGrowth = {
            interpersonalRelationshipBuilding: this.exitForm.chwGrowth.interpersonalRelationshipBuilding || "",
            serviceCoordinationNavigation: this.exitForm.chwGrowth.serviceCoordinationNavigation || "",
            evaluationResearch: this.exitForm.chwGrowth.evaluationResearch || "",
            knowledgeBaseHealthIssues: this.exitForm.chwGrowth.knowledgeBaseHealthIssues || "",
            teachingEducation: this.exitForm.chwGrowth.teachingEducation || "",
            advocacy: this.exitForm.chwGrowth.advocacy || ""
        };
    }

    let updatedExitForm = {
        exitForm: exitFormData.exitForm,
        tempIncompleteFormID: this.incompleteFormID
    };

    axios.put(apiURL, updatedExitForm, { headers: { token } })
        .then(() => {
            this.formSubmitSuccess = true;
            const motivatingMessages = [
                "Exit Form updated!",
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

    // Utility methods
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    isObjectEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    },

    // Navigation confirmation dialog handlers
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

    // Form configuration update handlers
    handleGoalFormExists(goalFormExists) {
        this.goalFormExists = goalFormExists;
    },
    handleActivitiesExist(activitiesExist) {
        this.activitiesExist = activitiesExist;
    },
    handleAllowedStepsForJump() {
        this.allowedStepsForJump = [0];
    },

    // Handle first input to create incomplete form
async handleFirstInput() {
    if (this.isFirstInput) {
        this.isFirstInput = false;

        try {
            const user = useLoggedInUserStore();
            const token = user.token;
            let apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/exit-forms";

            const expRegistrationID = (this.selectedExperience && this.selectedExperience.expRegistrationID) || this.tempIncompleteForm.incompleteForm.expRegistrationID;

            // Prepare initial form data
            const exitFormData = {
                expRegistrationID: expRegistrationID,
                exitForm: {
                    progressMade: {
                        aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected || "No aspiration",
                        aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected || "No aspiration",
                        aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected || "No aspiration",
                        aspirationOneExperienceConnection: this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || "No aspiration",
                        aspirationTwoExperienceConnection: this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || "No aspiration",
                        aspirationThreeExperienceConnection: this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || "No aspiration",
                        goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected || "No goal",
                        goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected || "No goal",
                        goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected || "No goal",
                        goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected || "No goal",
                        goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected || "No goal",
                        goalOneExperienceConnection: this.exitForm.progressMade.goalOneExperienceConnectionSelected || "No goal",
                        goalTwoExperienceConnection: this.exitForm.progressMade.goalTwoExperienceConnectionSelected || "No goal",
                        goalThreeExperienceConnection: this.exitForm.progressMade.goalThreeExperienceConnectionSelected || "No goal",
                        goalFourExperienceConnection: this.exitForm.progressMade.goalFourExperienceConnectionSelected || "No goal",
                        goalFiveExperienceConnection: this.exitForm.progressMade.goalFiveExperienceConnectionSelected || "No goal",
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
                        noContributions: this.exitForm.activitiesContribution.noContributions,
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

            // Only add HICH data if there's actual data
            const hasHichData = (
                (this.exitForm.hichNetPromoter.recommendHICH !== "" && 
                 this.exitForm.hichNetPromoter.recommendHICH !== null && 
                 this.exitForm.hichNetPromoter.recommendHICH !== undefined) ||
                (this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== "" && 
                 this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== null && 
                 this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== undefined) ||
                (this.exitForm.hichNetPromoter.recommendVolunteerProjects !== "" && 
                 this.exitForm.hichNetPromoter.recommendVolunteerProjects !== null && 
                 this.exitForm.hichNetPromoter.recommendVolunteerProjects !== undefined) ||
                (this.exitForm.hichNetPromoter.recommendMentorshipProgram !== "" && 
                 this.exitForm.hichNetPromoter.recommendMentorshipProgram !== null && 
                 this.exitForm.hichNetPromoter.recommendMentorshipProgram !== undefined)
            );

            if (hasHichData) {
                exitFormData.exitForm.hichNetPromoter = {
                    recommendHICH: this.exitForm.hichNetPromoter.recommendHICH || "",
                    recommendSocialsWorkshops: this.exitForm.hichNetPromoter.recommendSocialsWorkshops || "",
                    recommendVolunteerProjects: this.exitForm.hichNetPromoter.recommendVolunteerProjects || "",
                    recommendMentorshipProgram: this.exitForm.hichNetPromoter.recommendMentorshipProgram || ""
                };
            }

            // Only add CHW data if there's actual data
            const hasChwData = (
                this.exitForm.chwGrowth.interpersonalRelationshipBuilding ||
                this.exitForm.chwGrowth.serviceCoordinationNavigation ||
                this.exitForm.chwGrowth.evaluationResearch ||
                this.exitForm.chwGrowth.knowledgeBaseHealthIssues ||
                this.exitForm.chwGrowth.teachingEducation ||
                this.exitForm.chwGrowth.advocacy
            );

            if (hasChwData) {
                exitFormData.exitForm.chwGrowth = {
                    interpersonalRelationshipBuilding: this.exitForm.chwGrowth.interpersonalRelationshipBuilding || "",
                    serviceCoordinationNavigation: this.exitForm.chwGrowth.serviceCoordinationNavigation || "",
                    evaluationResearch: this.exitForm.chwGrowth.evaluationResearch || "",
                    knowledgeBaseHealthIssues: this.exitForm.chwGrowth.knowledgeBaseHealthIssues || "",
                    teachingEducation: this.exitForm.chwGrowth.teachingEducation || "",
                    advocacy: this.exitForm.chwGrowth.advocacy || ""
                };
            }

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

    // Debounced input handler
    handleInput() {
        this.debouncedUpdateExitForm();
    },

    // Update original form state reference
    updateOriginalExitForm(newVal) {
        this.originalExitForm = this.deepClone(newVal);
    },

    // Check for incomplete forms on mount
    async checkIncompleteForm() {
        const user = useLoggedInUserStore();
        const token = user.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-form-incomplete/`;
        try {
            const response = await axios.get(apiURL, { headers: { token } });
            if (response.data.incompleteForm) {
                this.tempIncompleteForm = response.data;
                this.expRegistrationIDFromIncompleteBackup = this.tempIncompleteForm.incompleteForm.expRegistrationID;
                this.currentlyUsingIncompleteForm = true;
                this.showIncompleteFormFoundDialog = true;
            }
        } catch (error) {
            this.handleError(error);
        }
    },

    // Start new form, deleting incomplete one
    async startNew() {
        const user = useLoggedInUserStore();
        const token = user.token;
        const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-forms/${this.tempIncompleteForm.incompleteForm._id}`;

        try {
            await axios.delete(apiURL, { headers: { token } });
            this.tempIncompleteForm = {};
            this.showIncompleteFormFoundDialog = false;
            this.startNewSelected = true;
        } catch (error) {
            this.handleError(error);
        }
    },

    // Continue with incomplete form
    continueProgress() {
        this.isFirstInput = false;
        const tempExperiences = this.exitForm.experiences;
        this.exitForm = JSON.parse(JSON.stringify(this.originalExitForm));
        this.exitForm.experiences = tempExperiences;
        const existingExitForm = this.tempIncompleteForm.incompleteForm.exitForm;

        // Transform saved progress data to current form structure
        this.exitForm.progressMade.aspirationOneProgressSelected = existingExitForm.progressMade.aspirationOneProgressResults;
        this.exitForm.progressMade.aspirationTwoProgressSelected = existingExitForm.progressMade.aspirationTwoProgressResults;
        this.exitForm.progressMade.aspirationThreeProgressSelected = existingExitForm.progressMade.aspirationThreeProgressResults;

        // Restore aspiration progress and connections
        const aspirations = ['aspirationOne', 'aspirationTwo', 'aspirationThree'];
        aspirations.forEach(aspiration => {
            const selectedProgress = existingExitForm.progressMade[aspiration + 'ProgressResults'];
            this.exitForm.progressMade[aspiration + 'ProgressSelected'] = selectedProgress;
            this.exitForm.progressMade[aspiration + 'ProgressResults'] = this.exitForm.progressMade[aspiration + 'ProgressResults'].map(option => ({
                ...option,
                checked: option.label === selectedProgress
            }));

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

        // Restore goal issues selections
        const dbGoals = existingExitForm.goalIssues.goals;
        this.exitForm.goalIssues.goals = this.exitForm.goalIssues.goals.map(goal => ({
            ...goal,
            checked: dbGoals.includes(goal.label)
        }));
        this.exitForm.goalIssues.issuesDescription = existingExitForm.goalIssues.issuesDescription;

        // Restore remaining form sections
        this.exitForm.activitiesContribution = existingExitForm.activitiesContribution;
        this.exitForm.experienceContributions = existingExitForm.experienceContributions;

        const likelihoodCategories = ['enrollAnotherCourse', 'completeMinor', 'recommendCourse', 'pursueCareer'];
        likelihoodCategories.forEach(category => {
            this.exitForm.likelihoodOf[category + 'Selected'] = existingExitForm.likelihoodOf[category];
        });

        this.exitForm.generalGrowth = existingExitForm.generalGrowth;
        this.exitForm.openEnded = existingExitForm.openEnded;

        // Restore HICH Net Promoter data if it exists
        if (existingExitForm.hichNetPromoter) {
            this.exitForm.hichNetPromoter = existingExitForm.hichNetPromoter;
        }

        // Restore CHW Growth data if it exists
        if (existingExitForm.chwGrowth) {
            this.exitForm.chwGrowth = existingExitForm.chwGrowth;
        }

        this.originalExitForm = JSON.parse(JSON.stringify(this.exitForm));
        this.expRegistrationIDFromIncomplete = this.tempIncompleteForm.incompleteForm.expRegistrationID
        this.incompleteFormID = this.tempIncompleteForm.incompleteForm._id;
        this.showIncompleteFormFoundDialog = false;

        // Validate restored sections
        this.$nextTick(() => {
            if (this.goalFormExists) {
                this.triggerAspValidation();
                this.triggerGoalsValidation();
                if (this.activitiesExist) {
                    this.triggerActValidation();
                }
            }
            this.triggerGrowthValidation();
        });
    },

    // Auto-save incomplete form updates
updateExitForm() {
    const user = useLoggedInUserStore();
    const token = user.token;
    const userID = user.userId;
    const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/exit-forms/${this.incompleteFormID}`;

    const expRegistrationID = (this.selectedExperience && this.selectedExperience.expRegistrationID) || this.tempIncompleteForm.incompleteForm.expRegistrationID;

    // Prepare autosave data
    const exitFormData = {
        expRegistrationID: expRegistrationID,
        exitForm: {
            progressMade: {
                aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected || "No aspiration",
                aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected || "No aspiration",
                aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected || "No aspiration",
                aspirationOneExperienceConnection: this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || "No aspiration",
                aspirationTwoExperienceConnection: this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || "No aspiration",
                aspirationThreeExperienceConnection: this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || "No aspiration",
                goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected || "No goal",
                goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected || "No goal",
                goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected || "No goal",
                goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected || "No goal",
                goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected || "No goal",
                goalOneExperienceConnection: this.exitForm.progressMade.goalOneExperienceConnectionSelected || "No goal",
                goalTwoExperienceConnection: this.exitForm.progressMade.goalTwoExperienceConnectionSelected || "No goal",
                goalThreeExperienceConnection: this.exitForm.progressMade.goalThreeExperienceConnectionSelected || "No goal",
                goalFourExperienceConnection: this.exitForm.progressMade.goalFourExperienceConnectionSelected || "No goal",
                goalFiveExperienceConnection: this.exitForm.progressMade.goalFiveExperienceConnectionSelected || "No goal",
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
                noContributions: this.exitForm.activitiesContribution.noContributions,
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

    // Only add HICH data if there's actual data
    const hasHichData = (
        (this.exitForm.hichNetPromoter.recommendHICH !== "" && 
         this.exitForm.hichNetPromoter.recommendHICH !== null && 
         this.exitForm.hichNetPromoter.recommendHICH !== undefined) ||
        (this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== "" && 
         this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== null && 
         this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== undefined) ||
        (this.exitForm.hichNetPromoter.recommendVolunteerProjects !== "" && 
         this.exitForm.hichNetPromoter.recommendVolunteerProjects !== null && 
         this.exitForm.hichNetPromoter.recommendVolunteerProjects !== undefined) ||
        (this.exitForm.hichNetPromoter.recommendMentorshipProgram !== "" && 
         this.exitForm.hichNetPromoter.recommendMentorshipProgram !== null && 
         this.exitForm.hichNetPromoter.recommendMentorshipProgram !== undefined)
    );

    if (hasHichData) {
        exitFormData.exitForm.hichNetPromoter = {
            recommendHICH: this.exitForm.hichNetPromoter.recommendHICH || "",
            recommendSocialsWorkshops: this.exitForm.hichNetPromoter.recommendSocialsWorkshops || "",
            recommendVolunteerProjects: this.exitForm.hichNetPromoter.recommendVolunteerProjects || "",
            recommendMentorshipProgram: this.exitForm.hichNetPromoter.recommendMentorshipProgram || ""
        };
    }

    // Only add CHW data if there's actual data
    const hasChwData = (
        this.exitForm.chwGrowth.interpersonalRelationshipBuilding ||
        this.exitForm.chwGrowth.serviceCoordinationNavigation ||
        this.exitForm.chwGrowth.evaluationResearch ||
        this.exitForm.chwGrowth.knowledgeBaseHealthIssues ||
        this.exitForm.chwGrowth.teachingEducation ||
        this.exitForm.chwGrowth.advocacy
    );

    if (hasChwData) {
        exitFormData.exitForm.chwGrowth = {
            interpersonalRelationshipBuilding: this.exitForm.chwGrowth.interpersonalRelationshipBuilding || "",
            serviceCoordinationNavigation: this.exitForm.chwGrowth.serviceCoordinationNavigation || "",
            evaluationResearch: this.exitForm.chwGrowth.evaluationResearch || "",
            knowledgeBaseHealthIssues: this.exitForm.chwGrowth.knowledgeBaseHealthIssues || "",
            teachingEducation: this.exitForm.chwGrowth.teachingEducation || "",
            advocacy: this.exitForm.chwGrowth.advocacy || ""
        };
    }

    axios.patch(apiURL, exitFormData, { headers: { token }})
        .then(response => {
        })
        .catch(error => {
            this.handleError(error);
        });
},

    // Additional event handlers
    handleUpdateIncompleteExpRegistration() {
        this.expRegistrationIDFromIncomplete = null;
    },
    handleUpdateDataAndSociety(status) {
        this.dataAndSociety = status;
    },
    handleUpdateFirstInput(status) {
        this.isFirstInput = status;
    }
},

// Vue Router navigation guard
beforeRouteLeave(to, from, next) {
    // Allow navigation if user is logged out or form is submitted
    if (!this.isUserLoggedIn || this.formSubmitSuccess) {
        next();
        return;
    }

    // Check for unsaved changes
    if (!this.isObjectEqual(this.exitForm, this.originalExitForm)) {
        this.nextFunction = next;
        this.leaveDialog = true;
    } else {
        next();
    }
},
}
</script>

<style scoped>
/* Progress bar styling for stepper component */
#progress-bar {
    height: 4px;
    background-color: #c8102e;
    transition: width 0.3s ease;
}
</style>