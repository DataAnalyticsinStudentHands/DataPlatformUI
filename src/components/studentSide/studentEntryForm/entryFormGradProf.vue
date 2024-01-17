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
            <div v-if="isProgramGradProTypeInvalid" :key="isProgramGradProTypeInvalid" class="styled-error-text">{{$t('Information is required.')}}</div>
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
            <div v-if="isSpecializedDegCertTypeInvalid" class="styled-error-text">{{$t('Information is required.')}}</div>
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
    <v-tooltip activator="parent" location="start">Jump to Error</v-tooltip>
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

<style>

.error-text {
    color: #B00020;
}



.styled-error-text {
  -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: "Roboto", sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    --v-theme-overlay-multiplier: 1;
    --v-scrollbar-offset: 0px;
    --v-theme-background: 255,255,255;
    --v-theme-background-overlay-multiplier: 1;
    --v-theme-surface: 255,255,255;
    --v-theme-surface-overlay-multiplier: 1;
    --v-theme-surface-variant: 66,66,66;
    --v-theme-surface-variant-overlay-multiplier: 2;
    --v-theme-on-surface-variant: 238,238,238;
    --v-theme-primary: 98,0,238;
    --v-theme-primary-overlay-multiplier: 2;
    --v-theme-primary-darken-1: 55,0,179;
    --v-theme-primary-darken-1-overlay-multiplier: 2;
    --v-theme-secondary: 3,218,198;
    --v-theme-secondary-overlay-multiplier: 1;
    --v-theme-secondary-darken-1: 1,135,134;
    --v-theme-secondary-darken-1-overlay-multiplier: 1;
    --v-theme-error: 176,0,32;
    --v-theme-error-overlay-multiplier: 2;
    --v-theme-info: 33,150,243;
    --v-theme-info-overlay-multiplier: 1;
    --v-theme-success: 76,175,80;
    --v-theme-success-overlay-multiplier: 1;
    --v-theme-warning: 251,140,0;
    --v-theme-warning-overlay-multiplier: 1;
    --v-theme-on-background: 0,0,0;
    --v-theme-on-surface: 0,0,0;
    --v-theme-on-primary: 255,255,255;
    --v-theme-on-primary-darken-1: 255,255,255;
    --v-theme-on-secondary: 0,0,0;
    --v-theme-on-secondary-darken-1: 255,255,255;
    --v-theme-on-error: 255,255,255;
    --v-theme-on-info: 255,255,255;
    --v-theme-on-success: 255,255,255;
    --v-theme-on-warning: 255,255,255;
    --v-border-color: 0, 0, 0;
    --v-border-opacity: 0.12;
    --v-high-emphasis-opacity: 0.87;
    --v-medium-emphasis-opacity: 0.6;
    --v-disabled-opacity: 0.38;
    --v-idle-opacity: 0.04;
    --v-hover-opacity: 0.04;
    --v-focus-opacity: 0.12;
    --v-selected-opacity: 0.08;
    --v-activated-opacity: 0.12;
    --v-pressed-opacity: 0.12;
    --v-dragged-opacity: 0.08;
    --v-theme-kbd: 33, 37, 41;
    --v-theme-on-kbd: 255, 255, 255;
    --v-theme-code: 245, 245, 245;
    --v-theme-on-code: 0, 0, 0;
    --v-input-control-height: 56px;
    --v-input-padding-top: 16px;
    --select-chips-margin-bottom: 0px;
    --autocomplete-chips-margin-bottom: 0px;
    --combobox-chips-margin-bottom: 0px;
    --file-input-chips-margin-bottom: 0px;
    font-weight: 400;
    letter-spacing: 0.0333333333em;
    font-size: 12px;
    color: rgb(var(--v-theme-error));
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    --tw-border-spacing-x: 0;
    --tw-border-spacing-y: 0;
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-pan-x: ;
    --tw-pan-y: ;
    --tw-pinch-zoom: ;
    --tw-scroll-snap-strictness: proximity;
    --tw-ordinal: ;
    --tw-slashed-zero: ;
    --tw-numeric-figure: ;
    --tw-numeric-spacing: ;
    --tw-numeric-fraction: ;
    --tw-ring-inset: ;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgb(59 130 246 / 0.5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;
    --tw-blur: ;
    --tw-brightness: ;
    --tw-contrast: ;
    --tw-grayscale: ;
    --tw-hue-rotate: ;
    --tw-invert: ;
    --tw-saturate: ;
    --tw-sepia: ;
    --tw-drop-shadow: ;
    --tw-backdrop-blur: ;
    --tw-backdrop-brightness: ;
    --tw-backdrop-contrast: ;
    --tw-backdrop-grayscale: ;
    --tw-backdrop-hue-rotate: ;
    --tw-backdrop-invert: ;
    --tw-backdrop-opacity: ;
    --tw-backdrop-saturate: ;
    --tw-backdrop-sepia: ;
    background-repeat: no-repeat;
    box-sizing: inherit;
    padding: 0;
    margin: 0;
    line-height: 12px;
    word-break: break-word;
    word-wrap: break-word;
    hyphens: auto;
    transition-duration: 150ms;
    transform-origin: center center;
}

</style>