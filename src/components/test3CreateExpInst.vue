<template> 
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
                            title="Choose Sessions"
                            icon="mdi-calendar-multiple"
                            value="0"
                            :error="sessionsError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step1"
                            title="Choose Experiences"
                            icon="mdi-earth"
                            value="1"
                            :error="experiencesError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step2"
                            title="Exit Form Release"
                            icon="mdi-form-select"
                            value="2"
                            :error="exitFormReleaseError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step3"
                            title="Review"
                            icon="mdi-check-bold"
                            value="3"
                        ></v-stepper-item>
                    </v-stepper-header>
                    <div id="progress-bar" :style="{ width: progressBarWidth }"></div>

                    <!-- Non-Mobile View -->
                    <v-container class="ma-0 pa-0">
                    <v-stepper-window v-if="$vuetify.display.smAndUp">
                        <v-stepper-window-item value="0">
                        <choose-sessions
                            ref="ChooseSessionsRef"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('sessions')"
                            @validation-change="handleValidationChange('sessions', $event)"
                        ></choose-sessions>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="1">
                            <choose-experiences
                                ref="ChooseExperiencesRef"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('experiences')"
                                @validation-change="handleValidationChange('experiences', $event)"
                            ></choose-experiences>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="2">
                            <exit-form-release
                                ref="ExitFormReleaseRef"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('exitformrelease')"
                                @validation-change="handleValidationChange('exitformrelease', $event)"
                            ></exit-form-release>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="3">
                            <exp-inst-review
                                ref="ExpInstReviewRef"
                            ></exp-inst-review>
                        </v-stepper-window-item>
                    </v-stepper-window>
                </v-container>

                <!-- Mobile View -->
                <v-container v-if="$vuetify.display.xs" class="pa-0 ma-0">
                    <v-scroll-x-reverse-transition group hide-on-leave>
                    <div v-show="currentStep === 0" key="step0">
                        <choose-sessions
                            ref="ChooseSessionsRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('sessions')"
                            @validation-change="handleValidationChange('sessions', $event)"
                        ></choose-sessions>
                    </div>
                    <div v-show="currentStep === 1" key="step1">
                        <choose-experiences
                            ref="ChooseExperiencesRef"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('experiences')"
                            @validation-change="handleValidationChange('experiences', $event)"
                        ></choose-experiences>
                    </div>
                    <div v-show="currentStep === 2" key="step2">
                        <exit-form-release
                            ref="ExitFormReleaseRef"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('exitformrelease')"
                            @validation-change="handleValidationChange('exitformrelease', $event)"
                        ></exit-form-release>
                    </div>
                    <div v-show="currentStep === 3" key="step3">
                        <exp-inst-review
                            ref="ExpInstReviewRef"
                        ></exp-inst-review>
                    </div>
                    </v-scroll-x-reverse-transition>
                </v-container>

                    <v-row justify="space-between" class="ma-1">
                        <v-col cols="auto">
                            <v-btn 
                            type="button" 
                            @click="currentStep = Math.max(currentStep - 1, 0)" 
                            class="btn"
                            :disabled="currentStep === 0"
                            >
                            {{$t('Previous')}}
                            </v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <!-- Conditional rendering for Submit Form button -->
                            <v-btn 
                                v-if="currentStep === 3" 
                                type="submit" 
                                @click="submitForm" 
                                class="btn"
                            >
                                {{$t('Create Experience Instances')}}
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
</template>

<script>
import ChooseSessions from './test3ChooseSessions.vue';
import ChooseExperiences from './test3ChooseExperiences.vue';
import ExitFormRelease from './test3ExitFormRelease.vue';
import ExpInstReview from './test3ExpInstReview.vue';


import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from 'axios';

export default {
    name: "test3CreateExpInst",
    components: {
        ChooseSessions,
        ChooseExperiences,
        ExitFormRelease,
        ExpInstReview
    },

    data() {
        return {
            currentStep: 0,
            sessionsError: false,
            experiencesError: false,
            exitFormReleaseError: false,
            dialog: false,
            nextFunction: null,
        }
    },
    mounted() {

    },
    computed: {
        showAltLabels() {
            if (this.$vuetify.display.mdAndUp || this.$vuetify.display.xs) {
                console.log('mdAndUp')
                return false;
            } else {
                return true;
            }
        },
        progressBarWidth() {
            const stepWidth = 25; // Assuming each step is 25% of the total width
            return `${stepWidth * (this.currentStep + 1)}%`;
        },
    },
    methods: {
        triggerValidation() {
            console.log('triggerValidation')
            console.log(this.currentStep)
            if (this.currentStep === 0) {
                console.log('currentStep === 0')
                this.triggerChooseSessionsValidation();
            } else if (this.currentStep === 1) {
                this.triggerChooseExperiencesValidation();
            } else if (this.currentStep === 2) {
                this.triggerExitFormReleaseValidation();
            }
        },
        triggerChooseSessionsValidation() {
            console.log('triggerChooseSessionValidation')
            if (this.$refs.ChooseSessionsRef) {
                this.$refs.ChooseSessionsRef.handleValidations();
            }
        },
        triggerChooseExperiencesValidation() {
            if (this.$refs.ChooseExperiencesRef) {
                this.$refs.ChooseExperiencesRef.handleValidations();
            }
        },
        triggerExitFormReleaseValidation() {
            if (this.$refs.ExitFormReleaseRef) {
                this.$refs.ExitFormReleaseRef.handleValidations();
            }
        },
        handleFormValid() {
            this.currentStep++;
        },
        handleFormInvalid(section) {
            if (section === 'sessions') {
                this.sessionsError = true;
            } else if (section === 'experiences') {
                this.experiencesError = true;
            } else if (section === 'exitformrelease') {
                this.exitFormReleaseError = true;
            }
        },
        handleValidationChange(section, { isValid }) {
            if (section === 'sessions') {
                this.sessionsError = !isValid;
            } else if (section === 'experiences') {
                this.experiencesError = !isValid;
            } else if (section === 'exitformrelease') {
                this.exitFormReleaseError = !isValid;
            }
        },
        submitForm() {
            // Call the method in the child component
            if (this.$refs.ExpInstReviewRef) {
                this.$refs.ExpInstReviewRef.createExpInstances();
            }
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
