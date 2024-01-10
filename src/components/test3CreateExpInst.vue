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
                            :error="demoError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step1"
                            title="Choose Experiences"
                            icon="mdi-earth"
                            value="1"
                            :error="degreeError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step2"
                            title="Exit Form Release"
                            icon="mdi-account-school"
                            value="2"
                            :error="gradProfError"
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
                            @form-invalid="handleFormInvalid('demo')"
                            @validation-change="handleValidationChange('demo', $event)"
                        ></choose-sessions>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="1">
                            <choose-experiences
                                ref="ChooseExperiencesRef"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('enrolled')"
                                @validation-change="handleValidationChange('enrolled', $event)"
                            ></choose-experiences>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="2">
                            <entry-form-grad-prof
                                ref="EntryFormGradProfRef"
                                :studentInformation="studentInformation"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('gradprof')"
                                @scroll-to-error="handleScrollToError"
                                @validation-change="handleValidationChange('gradprof', $event)"
                            ></entry-form-grad-prof>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="3">
                            <entry-form-review
                                ref="EntryFormReview"
                                :studentInformation="studentInformation"
                                @change-step="currentStep = $event"
                            ></entry-form-review>
                        </v-stepper-window-item>
                    </v-stepper-window>
                </v-container>

                <!-- Mobile View with Vuetify Slide Transition -->
                <v-container v-if="$vuetify.display.xs" class="pa-0 ma-0">
                    <v-scroll-x-reverse-transition group hide-on-leave>
                    <div v-show="currentStep === 0" key="step0">
                        <choose-sessions
                            ref="ChooseSessionsRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('demo')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('demo', $event)"
                        ></choose-sessions>
                    </div>
                    <div v-show="currentStep === 1" key="step1">
                        <choose-experiences
                            ref="ChooseExperiencesRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('enrolled')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('enrolled', $event)"
                        ></choose-experiences>
                    </div>
                    <div v-show="currentStep === 2" key="step2">
                        <entry-form-grad-prof
                            ref="EntryFormGradProfRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('gradprof')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('gradprof', $event)"
                        ></entry-form-grad-prof>
                    </div>
                    <div v-show="currentStep === 3" key="step3">
                        <entry-form-review
                            ref="EntryFormReview"
                            :studentInformation="studentInformation"
                            @change-step="currentStep = $event"
                        ></entry-form-review>
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

        <!-- Confirmation Dialog -->
        <v-dialog v-model="dialog" persistent max-width="500px">
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
</template>

<script>
import ChooseSessions from './test3ChooseSessions.vue';
import ChooseExperiences from './test3ChooseExperiences.vue';
import EntryFormGradProf from '@/components/studentSide/studentEntryForm/entryFormGradProf.vue';
import EntryFormReview from '@/components/studentSide/studentEntryForm/entryFormReview.vue';


import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from 'axios';

export default {
    name: "test3CreateExpInst",
    components: {
        ChooseSessions,
        ChooseExperiences,
        EntryFormGradProf,
        EntryFormReview
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
            },
            showNewUserDialog: false,
            dialog: false,
            nextFunction: null,
        }
    },
    mounted() {
        this.originalStudentInformation = this.deepClone(this.studentInformation);
        const loggedInUserStore = useLoggedInUserStore();
            // Check the hasCompletedEntryForm state
            if (!loggedInUserStore.hasCompletedEntryForm) {
                this.showNewUserDialog = true; // Open the dialog if the condition is met
            }
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
        uHStudentCheck() {
            return this.studentInformation.enrolledUHInfo.uhStatus === 'Yes';
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
                this.triggerDegreeValidation();
            } else if (this.currentStep === 2) {
                this.triggerGradProfValidation();
            }
        },
        triggerChooseSessionsValidation() {
            console.log('triggerDemoValidation')
            if (this.$refs.ChooseSessionsRef) {
                this.$refs.ChooseSessionsRef.handleValidations();
            }
        },
        triggerDegreeValidation() {
            if (this.$refs.ChooseExperiencesRef) {
                this.$refs.ChooseExperiencesRef.handleValidations();
            }
        },
        triggerGradProfValidation() {
            if (this.$refs.EntryFormGradProfRef) {
                this.$refs.EntryFormGradProfRef.handleValidations();
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
        handleScrollToError(element) {
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        async submitForm() {
            console.log("Form submission triggered");
            console.log('before cleanup: ', this.studentInformation);
            this.cleanupFormData();
            console.log('cleaned up data: ', this.studentInformation);

            const apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/entry-forms/';

            try {
                const user = useLoggedInUserStore();
                // const token = user.token;

                const token = `
                
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDgzNDUxMSwiZXhwIjoxNzA0ODQ2NTExfQ._eErIYblbUPvbZnbOw4D9UyYTevmUr_qP5PHq3wBl50
                
                `

                const response = await axios.post(apiURL, {
                    studentInformation: this.studentInformation
                }, {
                    headers: { token }
                });

                console.log(response.data)
            } catch (error) {
                console.error('Error submitting form: ', error);
            }
        },
        cleanupFormData() {
            // Check condition for "Other" pronouns
            const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
            const isOtherPronounChecked = otherPronoun ? otherPronoun.checked : false;

            if (!isOtherPronounChecked) {
                this.studentInformation.otherPronouns = '';
            }

            // Check condition for UH student
            //Check condition for "honorsCollegeAffiliated"
            const honorsCollegeAffiliatedCheck = this.studentInformation.enrolledUHInfo.honorsCollegeAffiliated[11].checked === true;

            if (!this.uHStudentCheck) {
                this.studentInformation.enrolledUHInfo.uhEmail = '';
                this.studentInformation.enrolledUHInfo.peopleSoftID = '';
                this.studentInformation.enrolledUHInfo.expectedGraduationYear = '';
                this.studentInformation.enrolledUHInfo.livingOnCampus = '';
                this.studentInformation.enrolledUHInfo.honorsCollegeStatus = '';
                this.studentInformation.enrolledUHInfo.honorsCollegeAffiliated = [
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
                this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther = '';
                this.studentInformation.enrolledUHInfo.majors = [];
                this.studentInformation.enrolledUHInfo.honorsMinors = [];
                this.studentInformation.enrolledUHInfo.otherMinors = [];
                this.studentInformation.hichInfo.hichStatus = '';
                this.studentInformation.hichInfo.hichHistoryStatus = '';
            } else if (this.uHStudentCheck && !honorsCollegeAffiliatedCheck) {
                this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther = '';
            }
            
            //Check condition for "serviceStatus"
            const serviceStatusCheck = this.studentInformation.communityServiceInfo.serviceStatus === 'Yes';
            if (!serviceStatusCheck) {
                this.studentInformation.communityServiceInfo.serviceHistoryDesc = '';
                this.studentInformation.communityServiceInfo.serviceOrgsOutsideUH = '';
            }

            //Check condition for programGradProStatus
            const phDTextboxFind = this.studentInformation.graduateProfessionalSchool.programGradProType.find(p => p.id === 4);
            const isphDTextboxChecked = phDTextboxFind ? phDTextboxFind.checked : false;

            const masterTextboxFind = this.studentInformation.graduateProfessionalSchool.programGradProType.find(p => p.id === 7);
            const isMasterTextboxChecked = masterTextboxFind ? masterTextboxFind.checked : false;

            const otherTextboxFind = this.studentInformation.graduateProfessionalSchool.programGradProType.find(p => p.id === 8);
            const isOtherTextboxChecked = otherTextboxFind ? otherTextboxFind.checked : false;

            const programGradProStatusCheck = this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'Yes';

            if(!programGradProStatusCheck) {
                this.studentInformation.graduateProfessionalSchool.programGradProType.forEach(item => {
                    item.checked = false;
                });
                this.studentInformation.graduateProfessionalSchool.phDTextbox = '';
                this.studentInformation.graduateProfessionalSchool.masterTextbox = '';
                this.studentInformation.graduateProfessionalSchool.otherTextbox = '';
            } else {
                if (!isphDTextboxChecked) {
                    this.studentInformation.graduateProfessionalSchool.phDTextbox = '';
                }
                if (!isMasterTextboxChecked) {
                    this.studentInformation.graduateProfessionalSchool.masterTextbox = '';
                }
                if (!isOtherTextboxChecked) {
                    this.studentInformation.graduateProfessionalSchool.otherTextbox = '';
                }
            }

            //Check condition for specializedDegCertStatus
            const specializedDegCertStatusCheck = this.studentInformation.specializedDegCert.specializedDegCertStatus === 'Yes';


            const professionalDesignOtherFind = this.studentInformation.specializedDegCert.specializedDegCertType.find(p => p.id === 6);

            const isProfessionalDesignOtherChecked = professionalDesignOtherFind ?professionalDesignOtherFind.checked : false;


            if (!specializedDegCertStatusCheck) {
                this.studentInformation.specializedDegCert.specializedDegCertType.forEach(item => {
                    item.checked = false;
                });
                this.studentInformation.specializedDegCert.professionalDesignOther = '';
            } else {
                if (!isProfessionalDesignOtherChecked) {
                    this.studentInformation.specializedDegCert.professionalDesignOther = '';
                }
            }
            },
            confirmLeave() {
                this.dialog = false;
                if (this.nextFunction) {
                    this.nextFunction();
                    this.nextFunction = null; // Clear the stored next function
                }
            },
            cancelLeave() {
                this.dialog = false;
            },
            // Conditions to check if dialog should appear asking if user is sure they want to navigate out
            deepClone(obj) {
                return JSON.parse(JSON.stringify(obj));
            },

            isObjectEqual(obj1, obj2) {
                return JSON.stringify(obj1) === JSON.stringify(obj2);
            },
    },
    beforeRouteLeave(to, from, next) {
        if (!this.isObjectEqual(this.studentInformation, this.originalStudentInformation)) {
            this.nextFunction = next;
            this.dialog = true;
            // Don't call next here
        } else {
            next(); // Proceed with navigation
        }
    }



}
</script>

<style scoped>
#progress-bar {
  height: 4px;
  background-color: #c8102e;
  transition: width 0.3s ease;
}


</style>
