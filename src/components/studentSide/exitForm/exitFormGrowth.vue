<template>
<v-container>
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
    <!-- Experience contribution to Graduate/Professional Goals -->
    <v-row class="mt-5">
        <v-col cols="12">
            <p ref="experienceContributionGradProfField" class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red' : isExperienceContributionGradProfInvalid && formSubmitted}">
            {{$t('How did this experience contribute to your graduate/professional goals?')}}
            </p>
        </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12">
                <v-textarea
                    v-model="exitForm.experienceContributions"
                    outlined
                    dense
                    :label="$t('Contribution Description')"
                    rows="4"
                    class="mt-0"
                    :rules="[requiredRule]"
                ></v-textarea>
            </v-col>
    </v-row>

      <!-- Data & Society likelihood questions -->

    <!-- If Experience is not Data & Society, hide -->
    <div v-if="dataAndSociety">

    <!-- Mobile View -->
    <div class="d-sm-none">
    <v-row>
        <v-col cols="12">
        <p ref="likelihoodField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isLikelihoodInvalid && formSubmitted}"> {{$t('Use the scale provided to rate your likelihood of taking the actions listed:')}}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
        <div>
            <div class="font-weight-black">{{$t('Enroll in another Data & Society Course')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.enrollAnotherCourseSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.enrollAnotherCourse"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>
        <div>
            <div class="font-weight-black">{{$t('Complete the Data & Society minor')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.completeMinorSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.completeMinor"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>
        <div>
            <div class="font-weight-black">{{$t('Pursue a career in Data Science')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.recommendCourseSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.recommendCourse"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>
        <div>
            <div class="font-weight-black">{{$t('Pursue a career in Data Science')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.pursueCareerSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.pursueCareer"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>

        </v-col>
    </v-row>
    </div>



    <!-- Non-Mobile View -->  
    <v-row class="d-none d-sm-inline">
        <v-row>
        <v-col cols="12">
            <p ref="likelihoodField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isLikelihoodInvalid && formSubmitted}"> {{$t('Use the scale provided to rate your likelihood of taking the actions listed:')}}</p>
        </v-col>
        </v-row>
        <v-col cols="12">
        <v-card>
        <v-table>
            <thead>
            <tr>
                <th></th>
                <th v-for="option in exitForm.likelihoodOf.enrollAnotherCourse" :key="option.id">{{ $t(option.label) }}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{{$t('Enroll in another Data & Society Course')}}</td>
                <td v-for="option in exitForm.likelihoodOf.enrollAnotherCourse" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.enrollAnotherCourseSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.enrollAnotherCourseSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            <tr>
                <td>{{$t('Complete the Data & Society minor')}}</td>
                <td v-for="option in exitForm.likelihoodOf.completeMinor" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.completeMinorSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.completeMinorSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            <tr>
                <td>{{$t('Recommend this course to a friend')}}</td>
                <td v-for="option in exitForm.likelihoodOf.recommendCourse" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.recommendCourseSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.recommendCourseSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            <tr>
                <td>{{$t('Pursue a career in Data Science')}}</td>
                <td v-for="option in exitForm.likelihoodOf.pursueCareer" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.pursueCareerSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.pursueCareerSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            </tbody>
        </v-table>
        </v-card>
    </v-col>
    </v-row>
    </div>


    <!-- Growth -->
    <v-row>
        <v-col cols="12">
            <p ref="growthProblemSolvingField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProblemSolvingInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('problem solving')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.problemSolving" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthEffCommField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEffCommInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('effective communication')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.effectiveCommunication" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthTeamworkField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthTeamworkInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teamwork')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.teamwork" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthCulHumField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthCulHumInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('cultural humility')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.culturalHumility" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthEthicsField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEthicsInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('ethical decision making')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.ethicalDecisionMaking" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthProfResField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProfResInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>professional responsibility</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.professionalResponsibility" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>

    <!-- Biggest Lessons and Key Takeaways -->
    <v-row>
        <v-col cols="12">
            <p ref="biggestLessonsField" class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isBiggestLessonsInvalid && formSubmitted }">
            {{$t('What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.biggestLessons"
                class="mt-0"
                outlined
                dense
                :label="$t('Lessons/Takeaways')"
                rows="4"
                :rules="[requiredRule]"
            ></v-textarea>
        </v-col>
    </v-row>

    <!-- Engage and Support -->
    <v-row>
        <v-col cols="12">
            <p ref="supportOthersField" class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isSupportOthersInvalid && formSubmitted }">
            {{$t('Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.supportOthers"
                class="mt-0"
                outlined
                dense
                :label="$t('Engage/Support')"
                rows="4"
                :rules="[requiredRule]"
            ></v-textarea>
        </v-col>
    </v-row>

    <!-- Other Comments/Recommendations -->
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8 mb-2">
            {{$t('Use this space to provide any other comments or recommendations you would like to share.')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.comments"
                class="mt-0"
                outlined
                dense
                :label="$t('Comments/Recommendations')"
                rows="4"
            ></v-textarea>
        </v-col>
    </v-row>


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


</v-container>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
    name: "ExitFormGrowth",
    props: {
        exitForm: Object,
        dataAndSociety: Boolean
    },
    emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
    data() {
        return {
            formSubmitted: false,
            requiredRule: value => {
                // If form has not been submitted, pass validation
                if (!this.formSubmitted) {
                    return true;
                }
                // Otherwise, check if the value is present
                return !!value || this.$t('Information is required.');
            },
        }
    },

    mounted() {
        window.scrollTo(0, 0);
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
        isExperienceContributionGradProfInvalid() {
            return !this.exitForm.experienceContributions || this.exitForm.experienceContributions.trim() === '';
        },
        isGrowthProblemSolvingInvalid() {
            return !this.exitForm.generalGrowth.problemSolving;
        },
        isGrowthEffCommInvalid() {
            return !this.exitForm.generalGrowth.effectiveCommunication;
        },
        isGrowthTeamworkInvalid() {
            return !this.exitForm.generalGrowth.teamwork;
        },
        isGrowthCulHumInvalid() {
            return !this.exitForm.generalGrowth.culturalHumility;
        },
        isGrowthEthicsInvalid() {
            return !this.exitForm.generalGrowth.ethicalDecisionMaking;
        },
        isGrowthProfResInvalid() {
            return !this.exitForm.generalGrowth.professionalResponsibility;
        },
        isBiggestLessonsInvalid() {
            return !this.exitForm.openEnded.biggestLessons;
        },
        isSupportOthersInvalid() {
            return !this.exitForm.openEnded.supportOthers;
        },
        isLikelihoodInvalid() {
            return !this.exitForm.likelihoodOf.enrollAnotherCourseSelected || !this.exitForm.likelihoodOf.completeMinorSelected || !this.exitForm.likelihoodOf.recommendCourseSelected || !this.exitForm.likelihoodOf.pursueCareerSelected;
        },
        hasValidationErrors() {
            if (!this.formSubmitted) return false;
            
            // List of all common validations
            const commonValidations = this.isExperienceContributionGradProfInvalid || 
                                    this.isGrowthProblemSolvingInvalid || 
                                    this.isGrowthEffCommInvalid || 
                                    this.isGrowthTeamworkInvalid || 
                                    this.isGrowthCulHumInvalid || 
                                    this.isGrowthEthicsInvalid || 
                                    this.isGrowthProfResInvalid || 
                                    this.isBiggestLessonsInvalid || 
                                    this.isSupportOthersInvalid;

            // Add the likelihood validation only if dataAndSociety is true
            if (this.dataAndSociety) {
                return commonValidations || this.isLikelihoodInvalid;
            } else {
                return commonValidations;
            }
        },
    },

    methods: {
        async handleValidations() {
            console.log('handleValidations from exitFormGrowth')
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
                  'experienceContributionGradProfField',
                  'growthProblemSolvingField',
                  'growthEffCommField',
                  'growthTeamworkField',
                  'growthCulHumField',
                  'growthEthicsField',
                  'growthProfResField',
                  'biggestLessonsField',
                  'supportOthersField',
                  'likelihoodField'
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
                    case 'experienceContributionGradProfField':
                        return this.isExperienceContributionGradProfInvalid;
                    case 'growthProblemSolvingField':
                        return this.isGrowthProblemSolvingInvalid;
                    case 'growthEffCommField':
                        return this.isGrowthEffCommInvalid;
                    case 'growthTeamworkField':
                        return this.isGrowthTeamworkInvalid;
                    case 'growthCulHumField':
                        return this.isGrowthCulHumInvalid;
                    case 'growthEthicsField':
                        return this.isGrowthEthicsInvalid;
                    case 'growthProfResField':
                        return this.isGrowthProfResInvalid;
                    case 'biggestLessonsField':
                        return this.isBiggestLessonsInvalid;
                    case 'supportOthersField':
                        return this.isSupportOthersInvalid;
                    case 'likelihoodField':
                        return this.isLikelihoodInvalid;
                    default:
                        return false;
                }
            },

    },

}
</script>

<style scoped>
.fixed-button {
    position: fixed;
    bottom: 20px; /* Adjust the bottom value as needed */
    right: 20px; /* Adjust the right value as needed */
    z-index: 1000;
}
</style>