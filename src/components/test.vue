<template> <!-- Start of the Student Entry Form template -->

    <v-container style="width: 90%; margin: 0 auto;"> <!-- Container for the form title and description -->
      <div style="display: flex; align-items: center;">
        <p class="font-weight-black text-h5 text--primary">
          {{ $t('Student Entry Form') }}
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
              <v-card :title="$t('Student Entry Form')">
                <v-card-text>
                  {{$t('This entry form collects basic information about you, so that we can know you better! Some of this information will be shared with your instructor or experience leader. You can update this information at any time in your “profile”.')}}
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
      <p class="text-subtitle-1">
        {{ $t("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.") }}
      </p>
    </v-container>

    <v-container>
        <v-row>
            <v-col>
                <v-stepper
                    :alt-labels="showAltLabels"
                    v-model="currentStep"
                >
                    <v-stepper-header>
                        <v-stepper-item
                            title="Demographics"
                            icon="mdi-account"
                            value="0"
                            :error="demoError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            title="Degree Program"
                            icon="mdi-school"
                            value="1"
                            :error="degreeError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            title="Graduate/Professional"
                            icon="mdi-account-school"
                            value="2"
                            :error="gradProfError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            title="Review"
                            icon="mdi-check-bold"
                            value="3"
                        ></v-stepper-item>
                    </v-stepper-header>

                    <v-stepper-window>
                        <v-stepper-window-item value="0">
                        <test-entry-demo 
                            ref="testEntryDemoRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('demo')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('demo', $event)"
                        ></test-entry-demo>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="1">
                            <test-entry-enrolled
                                ref="testEntryEnrolledRef"
                                :studentInformation="studentInformation"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('enrolled')"
                                @scroll-to-error="handleScrollToError"
                                @validation-change="handleValidationChange('enrolled', $event)"
                            ></test-entry-enrolled>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="2">
                            <test-entry-grad-prof
                                ref="testEntryGradProfRef"
                                :studentInformation="studentInformation"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('gradprof')"
                                @scroll-to-error="handleScrollToError"
                                @validation-change="handleValidationChange('gradprof', $event)"
                            ></test-entry-grad-prof>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="3">
                            <test-entry-review
                                ref="testEntryReview"
                                :studentInformation="studentInformation"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('review')"
                                @scroll-to-error="handleScrollToError"
                                @validation-change="handleValidationChange('review', $event)"
                            ></test-entry-review>
                        </v-stepper-window-item>
                    </v-stepper-window>
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
                            <v-btn type="submit" @click="triggerValidation" class="btn">{{$t('Next')}}</v-btn>
                        </v-col>
                    </v-row>
                </v-stepper>
                currentStep {{ currentStep  }}
            </v-col>
        </v-row>
    </v-container>
    {{ studentInformation }}
</template>

<script>
import TestEntryDemo from './testEntryDemo.vue';
import testEntryEnrolled from './testEntryEnrolled.vue';
import testEntryGradProf from './testEntryGradProf.vue';
import testEntryReview from './testEntryReview.vue';

export default {
    name: "test",
    components: {
        TestEntryDemo,
        testEntryEnrolled,
        testEntryGradProf,
        testEntryReview
    },

    data() {
        return {
            currentStep: 0,
            demoError: false,
            degreeError: false,
            gradProfError: false,
            studentInformation: {
                cityOrigin: '',
                primaryLanguage: '',
                otherLanguages: '',
                pronouns: [
                    { id: 1, label: "She/her/hers", checked: false },
                    { id: 2, label: "He/him/his", checked: false },
                    { id: 3, label: "They/them/theirs", checked: false },
                    { id: 4, label: "Ze/Zir/Zirs", checked: false },
                    { id: 5, label: "Other", checked: false },
                    { id: 6, label: "Prefer not to answer", checked: false },
                ],
                otherPronouns: '',
                enrolledUHInfo: {
                    uhStatus: '',
                    uhEmail: '',
                    peopleSoftID: '',
                    expectedGraduationYear: '',
                    livingOnCampus: '',
                    honorsCollegeStatus: '',
                    honorsCollegeAffiliated: [
                        { id: 1, label: "Senior Honors Thesis", checked: false },
                        { id: 2, label: "Honors Mentorship Program", checked: false },
                        { id: 3, label: "Honors Club Theatre", checked: false },
                        { id: 4, label: "Honors Dodgeball Society", checked: false },
                        { id: 5, label: "Student Governing Board", checked: false },
                        { id: 6, label: "Bonner Leaders Program", checked: false },
                        { id: 7, label: "Hobby/Leland/Harris Fellow", checked: false },
                        { id: 8, label: "Mellon Research Scholars", checked: false },
                        { id: 9, label: "Speech & Debate", checked: false },
                        { id: 10, label: "Model Arab League, Model UN, etc.", checked: false },
                        { id: 11, label: "Honors Ambassadors", checked: false },
                        { id: 12, label: "Other", checked: false },
                    ],
                    honorsCollegeAffiliatedOther: '',
                    majors: [], 
                    honorsMinors: [],
                    otherMinors: []
                    },
                    hichInfo: {
                        hichStatus: '',
                        hichHistoryStatus: ''
                    },
                    communityServiceInfo: {
                        serviceStatus: '',
                        serviceHistoryDesc: '',
                        serviceOrgsOutsideUH: ''
                },
                graduateProfessionalSchool: {
                    programGradProStatus: '',
                    programGradProType: [
                        { id: 1, label: "MD/DO", checked: false },
                        { id: 2, label: "Physician Assistant: PA", checked: false },
                        { id: 3, label: "Nursing: MSN, DNP", checked: false },
                        { id: 4, label: "PhD", checked: false },
                        { id: 5, label: "DrPH", checked: false },
                        { id: 6, label: "Law: JD", checked: false },
                        { id: 7, label: "Master's: MPH, MBA, MA, MS, MEd, etc", checked: false },
                        { id: 8, label: "Other", checked: false },
                    ],
                    phDTextbox: '',
                    masterTextbox: '',
                    otherTextbox: '',
                },
                specializedDegCert: {
                    specializedDegCertStatus: '',
                    specializedDegCertType: [
                        { id: 1, label: "Nursing: PRN, RN, CNA, etc", checked: false },
                        { id: 2, label: "Social Work: LSW/LCSW", checked: false },
                        { id: 3, label: "Business: Certified Public Accountant (CPA, Licensed Public Accountant (LPA), Certified Financial Planner (CFP)", checked: false },
                        { id: 4, label: "Engineering/Technology: Professional Engineer (PE), Certified Technology Specialist (CTS), etc", checked: false },
                        { id: 5, label: "Project Management: Certified Associate in Project Management (CAPM), Project Management Professional (PMP)", checked: false },
                        { id: 6, label: "Other Professional Designation", checked: false }
                    ],
                    professionalDesignOther: '',
                }
            }
        }
    },
    computed: {
        showAltLabels() {
            if (this.$vuetify.display.mdAndUp) {
                console.log('mdAndUp')
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        triggerValidation() {
            console.log('triggerValidation')
            console.log(this.currentStep)
            if (this.currentStep === 0) {
                console.log('currentStep === 0')
                this.triggerDemoValidation();
            } else if (this.currentStep === 1) {
                this.triggerDegreeValidation();
            } else if (this.currentStep === 2) {
                this.triggerGradProfValidation();
            }
        },
        triggerDemoValidation() {
            console.log('triggerDemoValidation')
            if (this.$refs.testEntryDemoRef) {
                this.$refs.testEntryDemoRef.handleValidations();
            }
        },
        triggerDegreeValidation() {
            if (this.$refs.testEntryEnrolledRef) {
                this.$refs.testEntryEnrolledRef.handleValidations();
            }
        },
        triggerGradProfValidation() {
            if (this.$refs.testEntryGradProfRef) {
                this.$refs.testEntryGradProfRef.handleValidations();
            }
        },
        handleFormValid() {
            this.currentStep++;
        },
        handleFormInvalid(section) {
            if (section === 'demo') {
                this.demoError = true;
            } else if (section === 'degree') {
                this.degreeError = true;
            } else if (section === 'gradprof') {
                this.gradProfError = true;
            }
        },
        handleValidationChange(section, { isValid }) {
            if (section === 'demo') {
                this.demoError = !isValid;
            } else if (section === 'enrolled') {
                this.degreeError = !isValid;
            } else if (section === 'gradprof') {
                this.gradProfError = !isValid;
            }
        },
        handleScrollToError(errorFieldRef) {
            const element = errorFieldRef.$el ? errorFieldRef.$el : errorFieldRef;
            console.log('element: ', element);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
    }

}
</script>