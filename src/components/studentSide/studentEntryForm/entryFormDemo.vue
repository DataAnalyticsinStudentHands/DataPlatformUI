<template>
    <v-form 
        ref="form"
        @submit.prevent="handleValidations"
    >
        <v-container style="width: 100%; margin: 0 auto;">
            <v-row class="">
            <v-col cols="12"></v-col>
    
    
    
    
    
    
        </v-row>
            <p 
            class="font-weight-black text-h6 mb-4">{{ $t('Demographics Information') }}</p>
            <p 
            class="font-weight-black mb-2">{{ $t('Where are you from? (Ie, place(s) you call home)') }}</p>
            <v-row class="mb-4">
            <v-col cols="12" md="6">
                <v-text-field 
                v-model="studentInformation.cityOrigin" 
                :label="$t('Place of Origin')" 
                outlined>
                </v-text-field>
            </v-col>
            </v-row>
    
            <p 
            class="font-weight-black">{{ $t('What languages do you speak?') }}</p>
            <v-row class="mb-4">
                <v-col cols="12" md="6">
                    <v-text-field 
                    v-model="studentInformation.primaryLanguage" 
                    :label="$t('Primary Language')" 
                    outlined>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field 
                    v-model="studentInformation.otherLanguages" 
                    :label="$t('Other Languages')" 
                    outlined>
                    </v-text-field>
                </v-col>
            </v-row>
    
    
    
            <div>
            <p 
                :class="{'error-text': isOtherPronounsInvalid}"
                class="font-weight-black">{{ $t('What are your pronouns? Select all that apply.') }}</p>
    
            <!-- Loop through all checkboxes except the last one -->
            <div 
                v-for="pronoun in studentInformation.pronouns.slice(0, -1)" 
                :key="pronoun.id"
                class="relative"
                @mouseover="hoveredCheckboxID = pronoun.id" 
                @mouseleave="hoveredCheckboxID = null"
                >
                <v-checkbox 
                    density="compact"
                    class="ma-0 pa-0" hide-details="true"
                    v-model="pronoun.checked" 
                    :label="$t(pronoun.label)"
                    :color="pronoun.id === 5 && isOtherPronounsInvalid ? 'error' : ''"
                    :indeterminate="studentInformation.pronouns[studentInformation.pronouns.length - 1].checked && !pronoun.checked"
                >
                </v-checkbox>
    
            </div>
    
            <!-- "Other" text field -->
                <v-row>
                    <v-col cols="6">
                        <transition name="slide-y-transition">
                        <div v-show="isOtherPronounChecked">
                        <v-text-field 
                            ref="otherPronounsField"
                            :class="{'error-text': isOtherPronounsInvalid}"
                            :placeholder="$t('Please specify')" 
                            v-model="studentInformation.otherPronouns" 
                            outlined
                            :rules="otherPronounsRules"
                        >
                        </v-text-field>
                        </div>
                        </transition>
                    </v-col>
                </v-row>
    
            <!-- Loop for the last checkbox ("Prefer not to say") -->
            <div v-if="studentInformation.pronouns.length">
                <v-checkbox 
                    density="compact"
                    class="ma-0 pa-0" hide-details="true"
                    v-model="studentInformation.pronouns[studentInformation.pronouns.length - 1].checked" 
                    :label="$t(studentInformation.pronouns[studentInformation.pronouns.length - 1].label)"
                >
                </v-checkbox>
            </div>
    
        </div>

        <p class="font-weight-black text-h8 mt-4">{{ $t('Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?') }}</p>
        <v-row>
            <v-col cols="12" md="10">
            <v-textarea v-model="studentInformation.commentsByStaff" :label="$t('Comments')"></v-textarea>
            </v-col>
        </v-row>
        <p class="font-weight-black text-h8">{{ $t('Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?') }}</p>
        <v-row>
            <v-col cols="12" md="10">
            <v-textarea v-model="studentInformation.issuesConcernsTriggers" :label="$t('Issues, Concerns, Triggers')"></v-textarea>
            </v-col>
        </v-row>

    
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
      name: "EntryFormDemo",
      props: {
          studentInformation: Object,
      },
      emits: ['form-valid', 'form-invalid', 'scroll-to-error', 'validation-change'],
      data() {
        return {
          formSubmitted: false,
          hoveredCheckboxID: null,
          showErrorBanner: false,
          otherPronounsRules: [
              v => {
                  if (!this.formSubmitted) return true;
                  // Get the 'Other' pronoun object from studentInformation.pronouns
                  const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
    
                  // If the condition for v-show is false (Other pronoun not checked), validation passes automatically
                  if (!otherPronoun || !otherPronoun.checked) return true;
    
                  return !!v || this.$t('If Other is selected, please specify pronouns.');
              },
          ],
          jumpToErrorTooltip: false,
        };
      },
      watch: {
        'studentInformation.pronouns': {
            deep: true,
            handler(newVal) {
                const preferNotToAnswer = newVal.find(p => p.id === 6);
                if (preferNotToAnswer && preferNotToAnswer.checked) {
                    newVal.forEach(pronoun => {
                        if (pronoun.id !== 6) {
                            pronoun.checked = false;
                        }
                    });
                }
    
                const otherPronoun = newVal.find(pronoun => pronoun.id === 5);
                if (otherPronoun && otherPronoun.checked && this.formSubmitted) {
                    this.$refs.otherPronounsField.validate();
                }
            }
        },
        isOtherPronounsInvalid(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('validation-change', { isValid: !newVal });
            }
            if (newVal) {
            this.jumpToErrorTooltip = true;
            } else {
                this.jumpToErrorTooltip = false;
            }
        },
      },
      computed: {
        isOtherPronounChecked() {
            const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
            return otherPronoun ? otherPronoun.checked : false;
        },
        isOtherPronounsInvalid() {
          if (!this.formSubmitted) return false;
          const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
          return otherPronoun.checked && !this.studentInformation.otherPronouns;
        },
        hasValidationErrors() {
            if (!this.formSubmitted) return false;
            return this.isOtherPronounsInvalid;
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
                'otherPronounsField'
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
            // Add logic to determine if a field is invalid based on its ref
            if (fieldRef === 'otherPronounsField') return this.isOtherPronounsInvalid;
            // Include other fields if necessary
        },
    
      },
    };
    </script>
    
    
    <style>
    .relative {
      position: relative;
    }
    
    .btn-success {
      background-color: green;
      color: white;
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
    