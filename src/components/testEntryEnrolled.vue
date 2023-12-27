<template>

<v-form 
    ref="form"
    @submit.prevent="handleValidations"
>

<v-container>
<v-row>
        <v-col cols="12" md="10">
          <p 
          :class="{'error-text': isUhStatusInvalid}"
          class="font-weight-black text-h8">{{ $t('Are you currently enrolled in a degree program at the University of Houston?') }}</p>
          <v-radio-group 
          ref="uhStatusField"
          :class="{'error-text': isUhStatusInvalid}"
          v-model="studentInformation.enrolledUHInfo.uhStatus" :rules="[v => !!v || $t('Information is required')]" required
          
          >
            <v-radio :label="$t('Yes')" value="Yes" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
            <v-radio :label="$t('No')" value="No" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>


      <transition-group name="slide-y-transition" tag="div">
        <div v-show="isUHStudent" key="uhStudent">

    <div>
          <p 
          :class="{'error-text': isEnrolledUHInfoInvalid}"
          class="font-weight-black text-h6">{{ $t('UH Student Only') }}</p>
          <v-row>
          <v-col cols="12" md="7">
                <v-text-field 
                ref="uhEmailField"
                v-model="studentInformation.enrolledUHInfo.uhEmail" 
                :label="$t('UH Email')"
                :rules="uhEmailRules"
                ></v-text-field>
          </v-col>
          </v-row>


          <v-row>
          <v-col cols="12" md="4">
            <v-text-field 
            ref="peopleSoftIDField"
            v-model="studentInformation.enrolledUHInfo.peopleSoftID" 
            label="PeopleSoft ID"
            :rules="peopleSoftIDRules"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field 
            type="date" 
            v-model="studentInformation.enrolledUHInfo.expectedGraduationYear" 
            :label="$t('Expected Graduation Date')" 
            min="2023-01-01" 
            max="2099-12-31"></v-text-field>
          </v-col>
        </v-row>

          <v-row>
            <v-col cols="12" md="7">
              <p 
              class="font-weight-black text-h8">{{ $t('Do you live on or off campus?') }}</p>
              <v-radio-group 
              v-model="studentInformation.enrolledUHInfo.livingOnCampus">
                <v-radio :label="$t('On-Campus')" value="On-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
                <v-radio :label="$t('Off-Campus')" value="Off-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        <p 
        class="font-weight-black text-h6">{{$t('Educational Background and Goals')}}</p>
          <v-row>
            <v-col cols="12" md="7">
                <p 
                :class="{'error-text': isHonorsCollegeStatusInvalid}"
                class="font-weight-black text-h8">{{$t('Are you a member of the Honors College?')}}</p>
                <v-radio-group 
                ref="honorsCollegeStatusField"
                :class="{'error-text': isHonorsCollegeStatusInvalid}"
                v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"
                :rules="honorsCollegeStatusRules" 
                :error-messages="honorsCollegeStatusErrorMessage"
                >
                  <v-radio 
                  :label="$t('Yes')" value="Yes" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                  <v-radio :label="$t('No')" value="No" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                </v-radio-group>
            </v-col>
          </v-row>
        <v-row>
          <v-col cols="12" md="7">
          <p 
            ref="honorsCollegeAffiliatedField"
            :class="{'error-text': isHonorsCollegeAffiliatedInvalid}"
            class="font-weight-black text-h8">
                {{ $t('Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?') }}
            </p>
          <div 
              v-for="affiliatedType in studentInformation.enrolledUHInfo.honorsCollegeAffiliated"
              :key="affiliatedType.id"
          >
              <v-checkbox
                  v-model="affiliatedType.checked"
                  :label="$t(affiliatedType.label)"
                  density="compact"
                  class="ma-0 pa-0" 
                  :hide-details="true"
              ></v-checkbox>
              <v-row>
                  <v-col cols="12" md="10">
                      <transition name="slide-y-transition">
                          <v-text-field
                              ref="honorsCollegeAffiliatedOtherField"
                              v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther"
                              v-show="affiliatedType.id === 12 && affiliatedType.checked"
                              :label="$t('Please specify')"
                              :rules="honorsCollegeAffiliatedOtherRules"
                          ></v-text-field>
                      </transition>
                  </v-col>
              </v-row>
          </div>
        </v-col>
      </v-row>
          <v-row>
              <v-col cols="12" md="7">
                    <p 
                    :class="{'error-text': isMajorsInvalid}"
                    class="font-weight-black text-h8">{{$t('What is/are your current major(s)?')}}</p>
                    <v-autocomplete
                        ref="majorsField"
                        clearable
                        chips
                        v-model="studentInformation.enrolledUHInfo.majors" 
                        :items="filteredMajors.map(major => major['Plan Name'])" 
                        :label= "$t('Select a Major')"
                        multiple
                        :rules="majorsRules"
                        >
                    </v-autocomplete>
              </v-col>
          </v-row>
          <v-row>
            <!-- Honors College Minors not given -->
            <v-col cols="11" md="7">
                <p 
                :class="{'error-text': isHonorsMinorsInvalid}"
                class="font-weight-black text-h8">{{$t('Are you pursuing, or planning to pursue, any of the following Honors College minors?')}}</p>
                <v-autocomplete
                  ref="honorsMinorsRef"
                  v-model="studentInformation.enrolledUHInfo.honorsMinors" 
                  :items="['None', 'Data & Society', 'Medicine & Society', 'Phronesis', 'Creative Work', 'Energy & Sustainability', 'Leadership Studies', 'Global Engagement and Research']" 
                  :label="$t('Select an Honors Minor')" 
                  multiple
                  clearable
                  chips
                  :rules="honorsMinorsRules">
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
                <p 
                class="font-weight-black text-h8">{{$t('Are you pursuing any other minors?')}}</p>
                <v-autocomplete
                  v-model="studentInformation.enrolledUHInfo.otherMinors" 
                  :items="filteredMinors.map(minor => minor['Plan Name'])" 
                  :label="$t('Select a Minor')" 
                  multiple 
                  clearable
                  chips></v-autocomplete>
            </v-col>
          </v-row>
          <p 
          class="font-weight-black text-h6">{{$t('Other Engagement')}}</p>
          <v-row>
            <v-col cols="12" md="7">
                <p 
                class="font-weight-black text-h8">{{$t('Are you a member of Honors in Community Health (HICH)?')}}</p>
                <v-radio-group
                v-model="studentInformation.hichInfo.hichStatus">
                  <v-radio :label="$t('Yes')" value="Yes" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                  <v-radio :label="$t('No')" value="No" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
               <p 
               class="font-weight-black text-h8">{{$t('Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?')}}</p>
                <v-radio-group 
                v-model="studentInformation.hichInfo.hichHistoryStatus">
                  <v-radio :label="$t('Yes')" value="Yes" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                  <v-radio :label="$t('No')" value="No" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
        <v-col cols="11">
            <p 
            v-show="isUHStudent"
            :class="{'error-text': isServiceStatusInvalid}"
            class="font-weight-black text-h8">
            {{$t('Have you had experience with Community Service?')}}
            </p>
            <v-radio-group 
            ref="serviceStatusField"
            v-model="studentInformation.communityServiceInfo.serviceStatus"
            :rules="serviceStatusRules"
            :class="{'error-text': isServiceStatusInvalid}">
              <v-radio :label="$t('Yes')" value="Yes" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
              <v-radio :label="$t('No')" value="No" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
            </v-radio-group>
        </v-col>
        <v-col cols="11" md="10" v-if="(studentInformation.communityServiceInfo.serviceStatus == 'Yes')">
          <transition name="slide-y-transition">
            <div>
              <p 
              :class="{'error-text': isServiceHistoryDescInvalid}"
              class="font-weight-black text-h8">{{$t('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</p>
              <v-textarea 
              ref="serviceHistoryDescField"
              class="ml-1"
              v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" 
              :label="$t('Please specify')"
              :rules="serviceHistoryDescRules"
              ></v-textarea>
            </div>
          </transition>
        </v-col>
        <v-col cols="11" md="10" v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
          <transition name="slide-y-transition">
            <div>
          <p class="font-weight-black text-h8 mb-4">{{$t('Are you a member of any community organizations outside the University? Please list.')}}</p>
          <v-row>
            <v-textarea v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" :label="$t('Please specify')" class="ml-4"></v-textarea>
          </v-row>
        </div>
          </transition>
        </v-col>
      </v-row>
    </div>

  </div>
  
  <div v-show="isNotUHStudent" key="notUHStudent">


    <div>
      <p 
      :class="{'error-text': isServiceStatusInvalid || isServiceHistoryDescInvalid}"
      class="font-weight-black text-h6">{{$t('Non-UH Students Only')}}</p>
    </div>
    <div>
      <v-col
      cols="11">
          <p 
          :class="{'error-text': isServiceStatusInvalid}"
          class="font-weight-black text-h8">
            {{$t('Have you had experience with Community Service?')}}
          </p>
          <v-radio-group 
          ref="serviceStatusFieldTwo"
          v-model="studentInformation.communityServiceInfo.serviceStatus"
          :rules="serviceStatusRules"
          :class="{'error-text': isServiceStatusInvalid}">
            <v-radio :label="$t('Yes')" value="Yes" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
            <v-radio :label="$t('No')" value="No" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="11" md="10">
          <transition name="slide-y-transition">
            <div v-show="(studentInformation.communityServiceInfo.serviceStatus == 'Yes')">
          <p 
          :class="{'error-text': isServiceHistoryDescInvalid}"
          class="font-weight-black text-h8">{{$t('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</p>
          <v-textarea 
          ref="serviceHistoryDescFieldTwo"
          v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" 
          :label="$t('Please specify')"
          :rules="serviceHistoryDescRules"
          ></v-textarea>
        </div>
        </transition>
        </v-col>
        <transition name="slide-y-transition">
          <div v-show="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
        <v-col cols="11" md="10">
          <p class="font-weight-black text-h8 mb-4" >{{$t('Are you a member of any community organizations outside the University? Please list.')}}</p>
          <v-row v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
            <v-textarea v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" :label="$t('Please specify')"></v-textarea>
          </v-row>
        </v-col>
        </div>
        </transition>
    </div>

  </div>
  </transition-group>


</v-container>

</v-form>

<v-btn
  v-if="hasValidationErrors"
  @click="scrollToErrorField"
  color="error"
  icon
  class="pa-1 fixed-button"
  elevation="4"
  size="small"
>
  <v-icon>mdi-alert-circle</v-icon>
  <v-tooltip activator="parent" location="start">Jump to Error</v-tooltip>
</v-btn>



</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';

export default {
    name: 'testEntryEnrolled',
    props: {
        studentInformation: Object,
    },
    emits: ['form-valid', 'form-invalid', 'scroll-to-error', 'validation-change'],
    data() {
        return {
            formSubmitted: false,
            majors: [],
            minors: [],
            uhEmailRules: [
                v => {
                    // If user is not a UH student, validation passes automatically
                    if (!this.uHStudentCheck) return true;

                    // Otherwise, check if the email is not empty
                    return !!v || this.$t('A valid UH email is required.');
                },
                v => {
                    // If user is not a UH student, validation passes automatically
                    if (!this.uHStudentCheck) return true;

                    // Otherwise, validate the email format
                    return /[@](cougarnet\.uh\.edu|uh\.edu)$/.test(v) || this.$t('Email must end with @cougarnet.uh.edu or @uh.edu');
                }
            ],
            peopleSoftIDRules: [
                v => {
                    // If user is not a UH student, validation passes automatically
                    if (!this.uHStudentCheck) return true;

                    // Otherwise, check if the email is not empty
                    return !!v || this.$t('A valid PeopleSoftID is required.');
                },
                v => {
                    // If user is not a UH student, validation passes automatically
                    if (!this.uHStudentCheck) return true;

                    // Otherwise, validate the email format
                    return /^\d+$/.test(v) || 'PeopleSoftID must contain only numbers.';
                }
            ],
            honorsCollegeStatusRules: [
                v => {
                    // If user is not a UH student, validation passes automatically
                    if (!this.uHStudentCheck) return true;

                    return !!v || this.$t('Information is required.');
                },
            ],
            honorsCollegeAffiliatedOtherRules: [
                v => {
                    // If user is not a UH student, validation passes automatically
                    if (!this.uHStudentCheck) {
                    return true
                    };
                    // if user is a UH student, but did not choose "Other" for affiliation with Honors College, then validation passess automatically
                    if (this.uHStudentCheck && this.studentInformation.enrolledUHInfo.honorsCollegeAffiliated[11].checked === false) {
                    return true
                    };
                    return !!v || this.$t('If Other is selected, please specify affiliation.');
                },
            ],
            majorsRules: [
                v => {
                    // If user is not a UH student, validation passes automatically
                    if (!this.uHStudentCheck) return true;

                    return (v && v.length > 0) || this.$t('At least one Major is required.');
                }
            ],
            honorsMinorsRules: [
                v => {
                        // If user is not a UH student, validation passes automatically
                        if (!this.uHStudentCheck) return true;

                        return (v && v.length > 0) || this.$t("Please select at least one Minor, or 'None'.");
                    }
            ],
            serviceStatusRules: [
                v => {
                    return !!v || this.$t('Information is required.');
                }
            ],
            serviceHistoryDescRules: [
                v => {
                // if user has not had comm-service experience, then skip validation.
                    if (!this.formSubmitted || this.studentInformation.communityServiceInfo.serviceStatus === 'No') return true;

                    return !!v || this.$t('Information is required.');
                    }
            ],
        }
    },
    mounted() {
        // Fetch the JSON data
        fetch('./majorsAndMinors.json')
        .then(response => response.json())
        .then(data => {
            this.majors = data;
            this.minors = data;
        })
        .catch(error => {
            console.log('Error:', error);
        });

        const loggedInUserStore = useLoggedInUserStore();

        // Translations
        if (loggedInUserStore.languagePreference === "Spanish") {
            // Set to Spanish
            this.$i18n.locale = 'es';
        } else {
            // Default to English
            this.$i18n.locale = 'en';
        }

        // Check the hasCompletedEntryForm state
        if (!loggedInUserStore.hasCompletedEntryForm) {
            this.showNewUserDialog = true; // Open the dialog if the condition is met
        }
    },
    watch: {
        'studentInformation.enrolledUHInfo.uhStatus'(newValue) {
            if (newValue === 'Yes' && this.formSubmitted) {
                // Trigger validation on the fields
                this.$refs.uhEmailField.validate();
                this.$refs.peopleSoftIDField.validate();
                this.$refs.majorsField.validate();
                this.$refs.honorsMinorsRef.validate();
            }
        },
        'studentInformation.enrolledUHInfo.honorsCollegeAffiliated': {
            deep: true,
            handler(newValue) {
                if (newValue.includes('Other') && this.formSubmitted) {
                    this.$refs.honorsCollegeAffiliatedOtherField.validate();
                }
            }
        },
        'studentInformation.enrolledUHInfo.honorsMinors': {
            handler(newValues) {
                if (newValues.includes('None') && newValues.length > 1) {
                    this.studentInformation.enrolledUHInfo.honorsMinors = ['None'];
                }
            },
            deep: true
        },
        hasValidationErrors(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.$emit('validation-change', { isValid: !newValue });
            }
        },
    },
    computed: {
        filteredMajors() {
            return this.majors.filter(major => major['Plan Type'] === 'MAJ');
        },
        filteredMinors() {
            return this.minors.filter(minor => minor['Plan Type'] === 'MIN');
        },
        isUhStatusInvalid() {
            if (!this.formSubmitted) return false;
            const rule = v => !!v || this.$t('Information is required.');
            return rule(this.studentInformation.enrolledUHInfo.uhStatus) !== true;
        },
        isUHStudent() {
            return this.studentInformation.enrolledUHInfo.uhStatus === 'Yes';
        },
        isNotUHStudent() {
            return this.studentInformation.enrolledUHInfo.uhStatus === 'No';
        },
        uHStudentCheck() {
            return this.formSubmitted && this.studentInformation.enrolledUHInfo.uhStatus === 'Yes';
        },
        isEnrolledUHInfoInvalid() {
            // if user is not UH Student, skip validation
            if (!this.uHStudentCheck) return false;

            // Check if UH Email is invalid
            const isUHEmailInvalid = this.uhEmailRules.some(rule => 
            typeof rule(this.studentInformation.enrolledUHInfo.uhEmail) === 'string'
            );

            // Check if PeopleSoftID is invalid
            const isPeopleSoftIDInvalid = this.peopleSoftIDRules.some(rule => 
            typeof rule(this.studentInformation.enrolledUHInfo.peopleSoftID) === 'string'
            );

            // Return true if either input is invalid
            return isUHEmailInvalid || isPeopleSoftIDInvalid;
        },
        isHonorsCollegeStatusInvalid() {
            // if user is not UH Student, skip validation
            if (!this.uHStudentCheck) return false;
            const rule = v => !!v || this.$t('Information is required');
            return rule(this.studentInformation.enrolledUHInfo.honorsCollegeStatus) !== true;
        },
        isHonorsCollegeAffiliatedInvalid() {
          // If the user is not a UH student, validation is automatically passed
          if (!this.uHStudentCheck) return false;

          // Find the "Other" affiliated type
          const otherAffiliatedType = this.studentInformation.enrolledUHInfo.honorsCollegeAffiliated.find(affiliatedType => affiliatedType.id === 12);

          // Check if "Other" is selected and if the affiliated other text field is empty
          if (otherAffiliatedType && otherAffiliatedType.checked && !this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther) {
              return true; // Invalid if "Other" is selected and the text field is empty
          }

          return false; // Valid in all other cases
      },
        honorsCollegeStatusErrorMessage() {
            if (this.uHStudentCheck) {
                // Evaluate the validation rule
                const validationResult = this.honorsCollegeStatusRules[0](this.studentInformation.enrolledUHInfo.honorsCollegeStatus);
                
                // If validation passes (result is true), return an empty string
                if (validationResult === true) {
                    return '';
                }

                // Otherwise, return the error message
                return validationResult;
            }
            // If user is not a UH student, then return empty string.
            return '';
        },
        isMajorsInvalid() {
            // if user is not UH Student, skip validation
            if (!this.uHStudentCheck) return false;

            // Check the validation rule for the majors
            return this.majorsRules[0](this.studentInformation.enrolledUHInfo.majors) !== true;
        },
        isHonorsMinorsInvalid() {
            // if user is not UH Student, skip validation
            if (!this.uHStudentCheck) return false;

            // Check the validation rule for the minors
            return this.honorsMinorsRules[0](this.studentInformation.enrolledUHInfo.honorsMinors) !== true;
        },
        isServiceStatusInvalid() {
            if (!this.formSubmitted) return false;
            const rule = v => !!v || this.$t('Information is required');
            return rule(this.studentInformation.communityServiceInfo.serviceStatus) !== true;
        },
        isServiceHistoryDescInvalid() {
            // if form wasn't submitted, or if user has not had comm-service experience, then skip validation.
            if (!this.formSubmitted || this.studentInformation.communityServiceInfo.serviceStatus === 'No') return false;
            const rule = v => !!v || this.$t('Information is required');
            return rule(this.studentInformation.communityServiceInfo.serviceHistoryDesc) !== true;
        },
        hasValidationErrors() {
            if (!this.formSubmitted) return false;
                return this.isUhStatusInvalid || this.isEnrolledUHInfoInvalid || this.isHonorsCollegeStatusInvalid || this.isHonorsCollegeAffiliatedInvalid || this.isMajorsInvalid || this.isHonorsMinorsInvalid || this.isServiceStatusInvalid || this.isServiceHistoryDescInvalid;
        },
    },
    methods: {
        async handleValidations() {
            console.log('handleValidations called')
            this.formSubmitted = true;
            const { valid } = await this.$refs.form.validate();
            if (valid) {
                console.log('form is valid!');
                this.$emit('form-valid');
            } else {
                this.$emit('form-invalid');
                toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
            }
        },
        scrollToErrorField() {
            const errorFields = [
                'uhStatusField',
                'uhEmailField',
                'peopleSoftIDField',
                'honorsCollegeStatusField',
                'honorsCollegeAffiliatedField',
                'honorsCollegeAffiliatedOtherField',
                'majorsField',
                'honorsMinorsRef',
                'serviceStatusField',
                'serviceStatusFieldTwo',
                'serviceHistoryDescField',
                'serviceHistoryDescFieldTwo'
            ];

            for (let i = 0; i < errorFields.length; i++) {
                if (this.isFieldInvalid(errorFields[i])) {
                    // Emit the actual DOM element or component reference
                    const ref = this.$refs[errorFields[i]];
                    const element = ref.$el ? ref.$el : ref; // If ref is a Vue component, use ref.$el to get the DOM element
                    console.log('element: ', element);
                    this.$emit('scroll-to-error', element);
                    break;
                }
            }
        },
        isFieldInvalid(fieldRef) {
            switch (fieldRef) {
                case 'uhStatusField':
                    return this.isUhStatusInvalid;
                case 'uhEmailField':
                    return this.isEnrolledUHInfoInvalid;
                case 'peopleSoftIDField':
                    return this.isEnrolledUHInfoInvalid;
                case 'honorsCollegeStatusField':
                    return this.isHonorsCollegeStatusInvalid;
                case 'honorsCollegeAffiliatedField':
                    return this.isHonorsCollegeAffiliatedInvalid;
                case 'honorsCollegeAffiliatedOtherField':
                    return this.isHonorsCollegeAffiliatedOtherInvalid;
                case 'majorsField':
                    return this.isMajorsInvalid;
                case 'honorsMinorsRef':
                    return this.isHonorsMinorsInvalid;
                case 'serviceStatusField':
                    return this.isServiceStatusInvalid;
                case 'serviceStatusFieldTwo':
                    return this.isServiceStatusInvalid;
                case 'serviceHistoryDescFieldTwo':
                    return this.isServiceHistoryDescInvalid;
                case 'serviceHistoryDescField':
                    return this.isServiceHistoryDescInvalid;
                default:
                    return false;
            }
        },
    }
}
</script>

<style>

.v-field__input > input[size="1"] {
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

.v-field__input > input[size="1"]::before,
.v-field__input > input[size="1"]::after {
  display: none;
}

.no-padding {
  padding-left: 0 !important;
  padding-right: 0 !important;
}


.error-text {
    color: #B00020;
}

.fixed-button {
  position: fixed;
  bottom: 20px; /* Adjust the bottom value as needed */
  right: 20px; /* Adjust the right value as needed */
  z-index: 1000;
}


</style>