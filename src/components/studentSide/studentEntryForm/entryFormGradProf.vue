<template>
    <v-form    
        ref="form"
        @submit.prevent="handleValidations"
    >

    <v-container>

      <p 
      class="font-weight-black text-h6">{{$t('Graduate/Professional School Goals')}}</p>
        <v-col cols="12" md="10">
          <p 
          :class="{'error-text': isProgramGradProStatusInvalid}"
          class="font-weight-black text-h8">{{ $t('Do you currently plan to pursue graduate or professional (e.g. medical, law) school?') }}</p>
          <v-radio-group 
          ref="programGradProStatusField"
          :class="{'error-text': isProgramGradProStatusInvalid}"
          v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"
          :rules="programGradProStatusRules">
            <v-radio :label="$t('Yes')" value="Yes" v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
            <v-radio :label="$t('No')" value="No" v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
          </v-radio-group>
        </v-col>
        <transition name="slide-y-transition">
        <v-col cols="12" md="10" v-if="studentInformation.graduateProfessionalSchool.programGradProStatus === 'Yes'">
          <p 
            ref="programGradProTypeField"
            :class="{'error-text': formSubmitted && isProgramGradProTypeAllInvalid}"
            class="font-weight-black text-h8">{{$t('If you are planning to pursue graduate school, what type of program?')}}</p>
          <div>
            <div v-for="programType in studentInformation.graduateProfessionalSchool.programGradProType" :key="programType.id">
              <v-checkbox 
                v-model="programType.checked" :label="$t(programType.label)"
                density="compact"
                class="ma-0 pa-0" hide-details="true"
                :class="{'error-text': formSubmitted && isProgramGradProTypeInvalid}"
                :rules="programGradProTypeRules"
              ></v-checkbox>
              <v-row>
                <v-col cols="12" md="10">
                  <transition name="slide-y-transition">
                    <v-text-field 
                    ref="phDTextboxField"
                    v-show="programType.id === 4 && programType.checked" :label="$t('Please specify')" v-model="studentInformation.graduateProfessionalSchool.phDTextbox"
                    :rules="phDTextboxRules"
                    ></v-text-field>
                  </transition>
                  <transition name="slide-y-transition">
                    <v-text-field 
                    ref="masterTextboxField"
                    v-show="programType.id === 7 && programType.checked" :label="$t('Please specify')" v-model="studentInformation.graduateProfessionalSchool.masterTextbox"
                    :rules="masterTextboxRules"
                    ></v-text-field>
                  </transition>
                  <transition name="slide-y-transition">
                    <v-text-field 
                    ref="otherTextboxField"
                    v-show="programType.id === 8 && programType.checked" :label="$t('Please specify')" v-model="studentInformation.graduateProfessionalSchool.otherTextbox"
                    :rules="otherTextboxRules"
                    ></v-text-field>
                  </transition>
                </v-col>
              </v-row>
            </div>
            <div v-if="isProgramGradProTypeInvalid" :key="isProgramGradProTypeInvalid" class="text-error text-caption">{{$t('Information is required.')}}</div>
          </div>
        </v-col> 
      </transition>
        <v-col cols="12" md="10">
          <p 
          :class="{'error-text': isSpecializedDegCertStatusInvalid}"
          class="font-weight-black text-h8">{{$t('Are you planning to pursue any other kind of specialized degree / certificate program?')}}</p>
          <v-radio-group 
          ref="specializedDegCertStatusField"
          :class="{'error-text': isSpecializedDegCertStatusInvalid}"
          v-model="studentInformation.specializedDegCert.specializedDegCertStatus"
          :rules="specializedDegCertStatusRules">
            <v-radio :label="$t('Yes')" value="Yes" v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
            <v-radio :label="$t('No')" value="No" v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
          </v-radio-group>
        </v-col>
        <transition name="slide-y-transition">
        <v-col cols="12" md="10" v-if="studentInformation.specializedDegCert.specializedDegCertStatus === 'Yes'">
          <p 
            ref="specializedDegCertTypeField"
          :class="{'error-text': formSubmitted && isSpecializedDegCertTypeAllInvalid}"
          class="font-weight-black text-h8">{{$t('If you are planning to pursue a specialized degree / certificate program, what type of program?')}}</p>
          <div>
            <div v-for="specializedType in studentInformation.specializedDegCert.specializedDegCertType" :key="specializedType.id">
              <v-checkbox 
              v-model="specializedType.checked" 
              :label="$t(specializedType.label)"
              density="compact"
              class="ma-0 pa-0" hide-details="true"
              :class="{'error-text': formSubmitted && isSpecializedDegCertTypeInvalid}"
              :rules="specializedDegCertTypeRules"
              ></v-checkbox>
              <v-row>
                <v-col cols="12" md="10">
                  <transition name="slide-y-transition">
                  <v-text-field 
                  v-show="specializedType.id === 6 && specializedType.checked" :label="$t('Please specify')" v-model="studentInformation.specializedDegCert.professionalDesignOther"
                  :rules="professionalDesignOtherRules"
                  ></v-text-field>
                </transition>
                </v-col>
              </v-row>
            </div>
            <div v-if="isSpecializedDegCertTypeInvalid" class="text-error text-caption">{{$t('Information is required.')}}</div>
          </div>
        </v-col>
      </transition>
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
    <v-tooltip activator="parent" location="start" v-model="jumpToErrorTooltip">Jump to Error</v-tooltip>
</v-btn>



</template>

<script>
import { toast } from 'vue3-toastify';

export default {
    name: "EntryFormGradProf",
    props: {
        studentInformation: Object,
    },
    emits: ['form-valid', 'form-invalid', 'scroll-to-error', 'validation-change'],
    data() {
        return {
            formSubmitted: false,
            jumpToErrorTooltip: false,
            programGradProStatusRules: [
                v => {
                    return !!v || this.$t('Information is required.');
                }
            ],
            programGradProTypeRules: [
                v => {
                    if (!this.formSubmitted || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                    return true;
                    }

                    return this.studentInformation.graduateProfessionalSchool.programGradProType.some(type => type.checked) || this.$t('Information is required.');
                }
            ],
            phDTextboxRules: [
                v => {
                    // conditions to skip validation
                    if (!this.formSubmitted || (this.studentInformation.graduateProfessionalSchool.programGradProType[3].checked === false ) || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                    return true
                    }
                    return !!v || this.$t("If 'PhD' is selected, please specify.");
                }
            ],
            masterTextboxRules: [
                v => {
                // conditions to skip validation
                    if (!this.formSubmitted || (this.studentInformation.graduateProfessionalSchool.programGradProType[6].checked === false ) || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                    return true
                    }
                    return !!v || this.$t("If 'Master\'s' is selected, please specify.");
                }
            ],
            otherTextboxRules: [
                v => {
                // conditions to skip validation
                    if (!this.formSubmitted || (this.studentInformation.graduateProfessionalSchool.programGradProType[7].checked === false ) || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                    return true
                    }
                    return !!v || this.$t("If 'Other' is selected, please specify.");
                }
            ],
            specializedDegCertStatusRules: [
                v => {
                    return !!v || this.$t('Information is required.');
                    }
            ],
            specializedDegCertTypeRules: [
                v => {
                    if (!this.formSubmitted || this.studentInformation.specializedDegCert.specializedDegCertStatus === 'No') {
                    return true;
                    }

                    return this.studentInformation.specializedDegCert.specializedDegCertType.some(type => type.checked) || this.$t('Information is required.');
                }
            ],
            professionalDesignOtherRules: [
                v => {
                    // conditions to skip validation
                    if (!this.formSubmitted || (this.studentInformation.specializedDegCert.specializedDegCertType[5].checked === false ) || this.studentInformation.specializedDegCert.specializedDegCertStatus === 'No') {
                    return true
                    }
                    return !!v || this.$t("If 'Other' is selected, please specify.");
                }
            ],
        }
    },
    watch: {
        hasValidationErrors(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.$emit('validation-change', { isValid: !newValue });
            }
            if (newValue) {
                this.jumpToErrorTooltip = true;
            } else {
                this.jumpToErrorTooltip = false;
            }
        },
    },
    computed: {
        isProgramGradProStatusInvalid() {
            if (!this.formSubmitted) return false;
            const rule = v => !!v || this.$t('Information is required');
            // Here, if the rule returns true, it means the input is valid, hence 'false' is returned for 'invalid'.
            // Conversely, if the rule returns false (meaning the input is invalid), 'true' is returned for 'invalid'.
            return rule(this.studentInformation.graduateProfessionalSchool.programGradProStatus) !== true;
        },

        isProgramGradProTypeInvalid() {
            if (!this.formSubmitted || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                return '';
            }

            // Check if at least one checkbox is checked
            const isAnyCheckboxChecked = this.studentInformation.graduateProfessionalSchool.programGradProType.some(type => type.checked);
            if (!isAnyCheckboxChecked) {
                return this.$t('Information is required.');
            }
        },
        isProgramGradProTypeAllInvalid() {
            if (!this.formSubmitted || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                return '';
            }

            // Check if at least one checkbox is checked
            const isAnyCheckboxChecked = this.studentInformation.graduateProfessionalSchool.programGradProType.some(type => type.checked);
            if (!isAnyCheckboxChecked) {
                return this.$t('Information is required.');
            }

            // Validate PhD text field if it's shown
            const isPhDTextboxValid = this.phDTextboxRules.every(rule => rule(this.studentInformation.graduateProfessionalSchool.phDTextbox) === true);
            const isPhDTextboxShown = this.studentInformation.graduateProfessionalSchool.programGradProType[3].checked;
            if (isPhDTextboxShown && !isPhDTextboxValid) {
                return this.$t("If 'PhD' is selected, please specify.");
            }

            // Validate Master's text field if it's shown
            const isMasterTextboxValid = this.masterTextboxRules.every(rule => rule(this.studentInformation.graduateProfessionalSchool.masterTextbox) === true);
            const isMasterTextboxShown = this.studentInformation.graduateProfessionalSchool.programGradProType[6].checked;
            if (isMasterTextboxShown && !isMasterTextboxValid) {
                return this.$t("If 'Master's' is selected, please specify.");
            }

            // Validate Other text field if it's shown
            const isOtherTextboxValid = this.otherTextboxRules.every(rule => rule(this.studentInformation.graduateProfessionalSchool.otherTextbox) === true);
            const isOtherTextboxShown = this.studentInformation.graduateProfessionalSchool.programGradProType[7].checked;
            if (isOtherTextboxShown && !isOtherTextboxValid) {
                return this.$t("If 'Other' is selected, please specify.");
            }

            return '';
        },
        isSpecializedDegCertStatusInvalid() {
            if (!this.formSubmitted) return false;
            const rule = v => !!v || this.$t('Information is required');
            return rule(this.studentInformation.specializedDegCert.specializedDegCertStatus) !== true;
        },
        isSpecializedDegCertTypeInvalid() {
            if (!this.formSubmitted || this.studentInformation.specializedDegCert.specializedDegCertStatus === "No") {
                return '';
            }

            // Check if at least one checkbox is checked
            if (!this.studentInformation.specializedDegCert.specializedDegCertType.some(type => type.checked)) {
                return this.$t('Information is required.');
            }

            return '';
        },

        isSpecializedDegCertTypeAllInvalid() {
            if (!this.formSubmitted || this.studentInformation.specializedDegCert.specializedDegCertStatus === "No") {
                return '';
            }

            // Check if at least one checkbox is checked
            const isAnyCheckboxChecked = this.studentInformation.specializedDegCert.specializedDegCertType.some(type => type.checked);
            if (!isAnyCheckboxChecked) {
                return this.$t('Information is required.');
            }

            // Validate Other's text field if it's shown
            const isOtherTextboxShown = this.studentInformation.specializedDegCert.specializedDegCertType[5].checked;
            const isOtherValid = this.professionalDesignOtherRules.every(rule => rule(this.studentInformation.specializedDegCert.professionalDesignOther) === true);
            if (isOtherTextboxShown && !isOtherValid) {
                return this.$t("If 'Other' is selected, please specify.");
            }

            return '';
        },

        hasValidationErrors() {
            if (!this.formSubmitted) return false;
                return this.isProgramGradProStatusInvalid || this.isProgramGradProTypeInvalid || this.isProgramGradProTypeAllInvalid || this.isSpecializedDegCertStatusInvalid || this.isSpecializedDegCertTypeInvalid || this.isSpecializedDegCertTypeAllInvalid;
        },
    },
    methods: {
        async handleValidations() {
            this.formSubmitted = true;
            const { valid } = await this.$refs.form.validate();
            if (valid) {
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
                'programGradProStatusField',
                'programGradProTypeField',
                'phDTextboxField',
                'masterTextboxField',
                'otherTextboxField',
                'specializedDegCertStatusField',
                'specializedDegCertTypeField',
            ];

            for (let i = 0; i < errorFields.length; i++) {
                if (this.isFieldInvalid(errorFields[i])) {
                    // Emit the actual DOM element or component reference
                    const ref = this.$refs[errorFields[i]];
                    const element = ref.$el ? ref.$el : ref; // If ref is a Vue component, use ref.$el to get the DOM element
                    this.$emit('scroll-to-error', element);
                    break;
                }
            }
        },
        isFieldInvalid(fieldRef) {
            switch (fieldRef) {
                case 'programGradProStatusField':
                    return this.isProgramGradProStatusInvalid;
                case 'programGradProTypeField':
                    return this.isProgramGradProTypeAllInvalid;
                case 'phDTextboxField':
                return this.isProgramGradProTypeInvalid;
                case 'masterTextboxField':
                return this.isProgramGradProTypeInvalid;
                case 'otherTextboxField':
                return this.isProgramGradProTypeInvalid;
                case 'specializedDegCertStatusField':
                    return this.isSpecializedDegCertStatusInvalid;
                case 'specializedDegCertTypeField':
                    return this.isSpecializedDegCertTypeAllInvalid;
                default:
                    return false;
            }
        },
    }
}
</script>