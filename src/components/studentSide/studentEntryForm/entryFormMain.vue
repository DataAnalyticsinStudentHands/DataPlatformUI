<template> <!-- Start of the Student Entry Form template -->

    <v-container style="width: 100%; margin: 0 auto;"> <!-- Container for the form title and description -->
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
                    :mobile="$vuetify.display.xs"
                    :flat="$vuetify.display.xs"
                >
                    <v-stepper-header>
                        <v-stepper-item
                            ref="step0"
                            :title="$t('Demographics')"
                            icon="mdi-account"
                            edit-icon="mdi-account"
                            value="0"
                            :error="demoError"
                            :editable="checkJump(0)"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step1"
                            :title="$t('Degree Program')"
                            icon="mdi-school"
                            edit-icon="mdi-school"
                            value="1"
                            :error="degreeError"
                            :editable="checkJump(1)"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step2"
                            :title="$t('Graduate/Professional')"
                            icon="mdi-account-school"
                            edit-icon="mdi-account-school"
                            value="2"
                            :error="gradProfError"
                            :editable="checkJump(2)"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            ref="step3"
                            :title="$t('Review')"
                            icon="mdi-check-bold"
                            edit-icon="mdi-check-bold"
                            value="3"
                            :editable="checkJump(3)"
                        ></v-stepper-item>
                    </v-stepper-header>
                    <div id="progress-bar" :style="{ width: progressBarWidth }"></div>

                    <!-- Non-Mobile View -->
                    <v-container class="ma-0 pa-0">
                    <v-stepper-window v-if="$vuetify.display.smAndUp">
                        <v-stepper-window-item value="0">
                        <entry-form-demo
                            ref="EntryFormDemoRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('demo')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('demo', $event)"
                        ></entry-form-demo>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="1">
                            <entry-form-enrolled
                                ref="EntryFormEnrolledRef"
                                :studentInformation="studentInformation"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('enrolled')"
                                @scroll-to-error="handleScrollToError"
                                @validation-change="handleValidationChange('enrolled', $event)"
                            ></entry-form-enrolled>
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
                        <entry-form-demo
                            ref="EntryFormDemoRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('demo')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('demo', $event)"
                        ></entry-form-demo>
                    </div>
                    <div v-show="currentStep === 1" key="step1">
                        <entry-form-enrolled
                            ref="EntryFormEnrolledRef"
                            :studentInformation="studentInformation"
                            @form-valid="handleFormValid"
                            @form-invalid="handleFormInvalid('enrolled')"
                            @scroll-to-error="handleScrollToError"
                            @validation-change="handleValidationChange('enrolled', $event)"
                        ></entry-form-enrolled>
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
      <!-- First time user v-dialog -->
    <v-dialog v-model="showNewUserDialog" width="500">
    <v-card>
        <v-card-title class="font-weight-bold">
        {{$t('Welcome In!')}}
        </v-card-title>
        
        <v-card-text>
        {{$t('We are happy to have you! Your first task is to complete the Student Entry Form.')}}
        </v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" @click="showNewUserDialog = false"></v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>

        <!-- Confirmation Dialog -->
        <v-dialog v-model="dialog" persistent max-width="500px">
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
                    <p>We found an incomplete Student Entry Form from your last session. Would you like to continue where you left off or start a new form?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="startNew">
                        Start New
                    </v-btn>
                    <v-btn color="red darken-2" text @click="resumeProgress">
                        Continue
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

</template>

<script>
import EntryFormDemo from './entryFormDemo.vue';
import EntryFormEnrolled from './entryFormEnrolled.vue';
import EntryFormGradProf from './entryFormGradProf.vue';
import EntryFormReview from './entryFormReview.vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from 'axios';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';


export default {
    name: "test",
    components: {
        EntryFormDemo,
        EntryFormEnrolled,
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
                commentsByStaff: '',
                issuesConcernsTriggers: '',
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
            formSubmitSuccess: false,
            originalStudentInformation: {},
            isFirstInput: true,
            formID: null,
            showIncompleteFormFoundDialog: false,
            tempIncompleteForm: {},
            allowedStepsForJump: [0],
        }
    },
    created() {
        // Initialize the debounced function
        this.debouncedUpdateStudentInformation = debounce(this.updateStudentInformation, 1000);
    },
    async mounted() {
        this.originalStudentInformation = this.deepClone(this.studentInformation);
        const loggedInUserStore = useLoggedInUserStore();
        loggedInUserStore.checkFormCompletion();
        // Check the hasCompletedEntryForm state
        if (!loggedInUserStore.hasCompletedEntryForm) {
            this.checkIncompleteForm();
        }

        // Translations
        if (loggedInUserStore.languagePreference === "Spanish") {
            // Set to Spanish
            this.$i18n.locale = 'es';
        } else {
            // Default to English
            this.$i18n.locale = 'en';
        }
    },
    watch: {
        studentInformation: {
            handler(newVal, oldVal) {
                if (this.isFirstInput) {
                    this.handleFirstInput();
                } else {
                    // Use the debounced method for subsequent updates
                    this.handleInput();
                }
            },
            deep: true,
        },
        currentStep(newVal) {
            const newStep = Number(newVal); // Convert newVal to a number

            // Update currentStep with the new value
            this.currentStep = newStep;

            // Specifically track visitation to step 5
            if (newStep === 3 && !this.allowedStepsForJump.includes(newStep)) {
                this.allowedStepsForJump.push(newStep);
            }

            if (newStep === 3) {
                this.cleanupFormData();
            }
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
            const stepWidth = 25; // Each step is 25% of the total width
            return `${stepWidth * (this.currentStep + 1)}%`;
        },
        uHStudentCheck() {
            return this.studentInformation.enrolledUHInfo.uhStatus === 'Yes';
        },
        isUserLoggedIn() {
            const store = useLoggedInUserStore();
            return store.isLoggedIn;
        },
    },
    methods: {
        triggerValidation() {
            if (this.currentStep === 0) {
                this.triggerDemoValidation();
            } else if (this.currentStep === 1) {
                this.triggerDegreeValidation();
            } else if (this.currentStep === 2) {
                this.triggerGradProfValidation();
            }
        },
        triggerDemoValidation() {
            if (this.$refs.EntryFormDemoRef) {
                this.$refs.EntryFormDemoRef.handleValidations();
            }
        },
        triggerDegreeValidation() {
            if (this.$refs.EntryFormEnrolledRef) {
                this.$refs.EntryFormEnrolledRef.handleValidations();
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
        submitForm() {
            // Assuming `formID` holds the ID of the form being updated
            const user = useLoggedInUserStore();
            const token = user.token;
            const userID = user.userId;
            const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/entry-forms/${this.formID}`;

            // Set completed to true
            const formData = { ...this.studentInformation, completed: true, userID: userID };

            axios.patch(apiURL, formData, { headers: { token } })
                .then(response => {
                    this.formSubmitSuccess = true;
                    // Update form completion status in the user store or wherever it's needed
                    user.checkFormCompletion();
                    // Navigate to dashboard with success message
                    this.$router.push({ 
                        name: 'studentDashboard',
                        params: {
                            toastType: 'success',
                            toastMessage: this.$t('Thank you for completing the Student Entry Form!'),
                            toastPosition: 'top-right',
                            toastCSS: 'Toastify__toast--create'
                        }
                    });
                })
                .catch(error => {
                    this.handleError(error);
                });
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


            async handleFirstInput() {
                if (this.isFirstInput) {
                    this.isFirstInput = false;

                    const formData = {
                        ...this.studentInformation,
                        completed: false,
                    };

                    try {
                        const user = useLoggedInUserStore();
                        const token = user.token;
                        const apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/entry-forms/';

                        const response = await axios.post(apiURL, formData, { headers: { token } })

                        this.formID = response.data.entryForm._id;
                    } catch (error) {
                        this.handleError(error);
                    }
                }
            },
            updateStudentInformation() {
                // Your update logic here
                const user = useLoggedInUserStore();
                const userID = user.userId;
                const token = user.token;
                const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/entry-forms/${this.formID}`;

                axios.patch(apiURL, { 
                    studentInformation: this.studentInformation,
                    userID: userID
                 }, { headers: { token }})
                    .then(response => {
                    })
                    .catch(error => {
                        this.handleError(error);
                    });
            },

            handleInput() {
                // Instead of calling updateStudentInformation directly, call the debounced version
                this.debouncedUpdateStudentInformation();
            },

            async checkIncompleteForm() {
                const user = useLoggedInUserStore();
                const token = user.token;
                const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/entry-form-incomplete/`;
                try {
                    const response = await axios.get(apiURL, { headers: { token } });
                    if (!response.data.entryForm) {
                        this.showNewUserDialog = true; // Open the dialog if the condition is met
                    } else {
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
                const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/entry-forms/${this.tempIncompleteForm.entryForm._id}`;

                try {
                    await axios.delete(apiURL, { headers: { token } });
                    this.tempIncompleteForm = {};
                    this.showIncompleteFormFoundDialog = false;
                } catch (error) {
                    this.handleError(error);
                }
            },


            resumeProgress() {
                this.isFirstInput = false;
                this.studentInformation = this.tempIncompleteForm.entryForm.studentInformation;
                this.formID = this.tempIncompleteForm.entryForm._id;
                this.showIncompleteFormFoundDialog = false;
            },

            updateOriginalStudentInformation(newVal) {
                this.originalStudentInformation = this.deepClone(newVal);;
            },

            checkJump(step) {
                const stepToSectionMap = {
                    0: 'demoSection',
                    1: 'degreeSection',
                    2: 'gradProfSection',
                };

                const section = stepToSectionMap[step];
                const isCurrentStepValid = this.isStepValid(this.currentStep);
                const isSectionEdited = this.isSectionEdited(section);

                // User can jump if the current step is valid and the corresponding section is edited
                return isCurrentStepValid && (isSectionEdited || this.allowedStepsForJump.includes(step));
            },

            isStepValid(step) {
                switch(step) {
                    case 0: return !this.demoError;
                    case 1: return !this.degreeError;
                    case 2: return !this.gradProfError;
                    default: return true;
                }
            },

            isSectionEdited(section) {
                if (section === 'demoSection') {
                    // Extract the demo section parts from both the current and original student information
                    const originalDemo = {
                        cityOrigin: this.originalStudentInformation.cityOrigin,
                        primaryLanguage: this.originalStudentInformation.primaryLanguage,
                        otherLanguages: this.originalStudentInformation.otherLanguages,
                        pronouns: this.originalStudentInformation.pronouns,
                        otherPronouns: this.originalStudentInformation.otherPronouns,
                        commentsByStaff: this.originalStudentInformation.commentsByStaff,
                        issuesConcernsTriggers: this.originalStudentInformation.issuesConcernsTriggers,
                    };

                    const currentDemo = {
                        cityOrigin: this.studentInformation.cityOrigin,
                        primaryLanguage: this.studentInformation.primaryLanguage,
                        otherLanguages: this.studentInformation.otherLanguages,
                        pronouns: this.studentInformation.pronouns,
                        otherPronouns: this.studentInformation.otherPronouns,
                        commentsByStaff: this.studentInformation.commentsByStaff,
                        issuesConcernsTriggers: this.studentInformation.issuesConcernsTriggers,
                    };

                    // Use lodash's isEqual to perform a deep comparison
                    return !isEqual(originalDemo, currentDemo);
                } else if (section === 'degreeSection') {
                    const originalDegree = this.originalStudentInformation.enrolledUHInfo;
                    const currentDegree = this.studentInformation.enrolledUHInfo;

                    return !isEqual(originalDegree, currentDegree);
                } else if (section === 'gradProfSection') {
                    const originalGradProf = {
                        graduateProfessionalSchool: this.originalStudentInformation.graduateProfessionalSchool,
                        specializedDegCert: this.originalStudentInformation.specializedDegCert,
                    }

                    const currentGradProf = {
                        graduateProfessionalSchool: this.studentInformation.graduateProfessionalSchool,
                        specializedDegCert: this.studentInformation.specializedDegCert,
                    }

                    return !isEqual(originalGradProf, currentGradProf);
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
        if (!this.isObjectEqual(this.studentInformation, this.originalStudentInformation)) {
            this.nextFunction = next;
            this.dialog = true;
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
