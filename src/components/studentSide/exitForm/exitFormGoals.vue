<!--
  File: src/components/studentSide/exitForm/exitFormGoals.vue
  
  This component handles the goals assessment section of the exit form. It evaluates student
  progress on their semester goals set at the beginning of the course. The component includes
  three main sections: progress assessment, course contribution evaluation, and barriers
  encountered. Students can describe challenges they faced and strategies they used to overcome
  them. Both mobile and desktop layouts are provided with responsive table designs.
-->

<template>
<v-container>
    <v-form
        ref="form"
        @submit.prevent="handleValidations"
    >

        <!-- Goals Progress Assessment Section -->
        <v-row>
            <v-col cols="12">
                <p ref="goalProgressField" :class="{'text-custom-red': isGoalProgressInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">{{$t('At the beginning of the semester, we asked you to share three goals for your participation in this course. Now we would like to know about your progress towards these goals and which activities from the course contributed to your progress.')}}</p>

                <p :class="{'text-custom-red': isGoalProgressInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">{{$t('For each goal listed below, please pick the option that best describes the progress you made.')}}</p>
            </v-col>
        </v-row>

        <!-- Mobile Progress View -->
        <v-row class="d-sm-none">
            <v-col cols="12">
                <div v-if="exitForm.goal1">
                    <div class="font-semibold italic">"{{ exitForm.goal1 }}"</div>
                    <v-radio-group v-model="exitForm.progressMade.goalOneProgressSelected" :rules="[requiredRule]">
                        <v-radio
                            v-for="option in exitForm.progressMade.goalOneProgressResults"
                            :label="$t(option.xs_label)"
                            :key="option.id"
                            :value="option.label"
                        ></v-radio>
                    </v-radio-group>
                </div>
                <div v-if="exitForm.goal2">
                    <div class="font-semibold italic">"{{ exitForm.goal2 }}"</div>
                    <v-radio-group v-model="exitForm.progressMade.goalTwoProgressSelected" :rules="[requiredRule]">
                        <v-radio
                            v-for="option in exitForm.progressMade.goalTwoProgressResults"
                            :label="$t(option.xs_label)"
                            :key="option.id"
                            :value="option.label"
                        ></v-radio>
                    </v-radio-group>
                </div>
                <div v-if="exitForm.goal3">
                    <div class="font-semibold italic">"{{ exitForm.goal3 }}"</div>
                    <v-radio-group v-model="exitForm.progressMade.goalThreeProgressSelected" :rules="[requiredRule]">
                        <v-radio
                            v-for="option in exitForm.progressMade.goalThreeProgressResults"
                            :label="$t(option.xs_label)"
                            :key="option.id"
                            :value="option.label"
                        ></v-radio>
                    </v-radio-group>
                </div>
                <div v-if="exitForm.goal4">
                    <div class="font-semibold italic">"{{ exitForm.goal4 }}"</div>
                    <v-radio-group v-model="exitForm.progressMade.goalFourProgressSelected" :rules="[requiredRule]">
                        <v-radio
                            v-for="option in exitForm.progressMade.goalFourProgressResults"
                            :label="$t(option.xs_label)"
                            :key="option.id"
                            :value="option.label"
                        ></v-radio>
                    </v-radio-group>
                </div>
                <div v-if="exitForm.goal5">
                    <div class="font-semibold italic">"{{ exitForm.goal5 }}"</div>
                    <v-radio-group v-model="exitForm.progressMade.goalFiveProgressSelected" :rules="[requiredRule]">
                        <v-radio
                            v-for="option in exitForm.progressMade.goalFiveProgressResults"
                            :label="$t(option.xs_label)"
                            :key="option.id"
                            :value="option.label"
                        ></v-radio>
                    </v-radio-group>
                </div>
            </v-col>
        </v-row>

        <!-- Desktop Progress View -->
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-table class="d-none d-sm-flex">
                        <thead>
                            <tr>
                                <th></th>
                                <th v-for="option in exitForm.progressMade.goalOneProgressResults" :key="option.id" class="text-center">{{ $t(option.label) }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="exitForm.goal1">
                                <td>{{ exitForm.goal1 }}</td>
                                <td v-for="option in exitForm.progressMade.goalOneProgressResults" :key="option.id">
                                <v-radio-group v-model="exitForm.progressMade.goalOneProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalOneProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                </v-radio-group>
                                </td>
                            </tr>
                            <tr v-if="exitForm.goal2">
                                <td>{{ exitForm.goal2 }}</td>
                                <td v-for="option in exitForm.progressMade.goalTwoProgressResults" :key="option.id">
                                <v-radio-group v-model="exitForm.progressMade.goalTwoProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalTwoProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                </v-radio-group>
                                </td>
                            </tr>
                            <tr v-if="exitForm.goal3">
                                <td>{{ exitForm.goal3 }}</td>
                                <td v-for="option in exitForm.progressMade.goalThreeProgressResults" :key="option.id">
                                <v-radio-group v-model="exitForm.progressMade.goalThreeProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalThreeProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                </v-radio-group>
                                </td>
                            </tr>
                            <tr v-if="exitForm.goal4">
                                <td>{{ exitForm.goal4 }}</td>
                                <td v-for="option in exitForm.progressMade.goalFourProgressResults" :key="option.id">
                                <v-radio-group v-model="exitForm.progressMade.goalFourProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFourProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                </v-radio-group>
                                </td>
                            </tr>
                            <tr v-if="exitForm.goal5">
                                <td>{{ exitForm.goal5 }}</td>
                                <td v-for="option in exitForm.progressMade.goalFiveProgressResults" :key="option.id">
                                <v-radio-group v-model="exitForm.progressMade.goalFiveProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFiveProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                </v-radio-group>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>

        <!-- Course Connection Assessment Section -->
        <v-row>
            <v-col cols="12">
                <p ref="goalConnectionField" :class="{'text-custom-red': isGoalConnectionInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">{{$t('For each goal listed below, please pick the option that best describes the progress you made.')}}</p>
            </v-col>
        </v-row>

        <!-- Mobile Connection View -->
        <v-row class="d-sm-none">
            <v-col cols="12">
                <v-row>
                    <v-col cols="12">
                        <div v-if="exitForm.goal1">
                            <div class="font-semibold italic">"{{ exitForm.goal1 }}"</div>
                            <p class="text-caption text-gray-500">{{$t('The progress I made towards this goal was...')}}</p>
                            <v-radio-group v-model="exitForm.progressMade.goalOneExperienceConnectionSelected" :rules="[requiredRule]">
                                <v-radio
                                    v-for="option in exitForm.progressMade.goalOneExperienceConnection"
                                    :label="$t(option.xs_label)"
                                    :key="option.id"
                                    :value="option.label"
                                ></v-radio>
                            </v-radio-group>
                        </div>
                        <div v-if="exitForm.goal2">
                            <div class="font-semibold italic">"{{ exitForm.goal2 }}"</div>
                            <p class="text-caption text-gray-500">{{$t('The progress I made towards this goal was...')}}</p>
                            <v-radio-group v-model="exitForm.progressMade.goalTwoExperienceConnectionSelected" :rules="[requiredRule]">
                                <v-radio
                                    v-for="option in exitForm.progressMade.goalTwoExperienceConnection"
                                    :label="$t(option.xs_label)"
                                    :key="option.id"
                                    :value="option.label"
                                ></v-radio>
                            </v-radio-group>
                        </div>
                        <div v-if="exitForm.goal3">
                            <div class="font-semibold italic">"{{ exitForm.goal3 }}"</div>
                            
                            <p class="text-caption text-gray-500">{{$t('The progress I made towards this goal was...')}}</p>
                            <v-radio-group v-model="exitForm.progressMade.goalThreeExperienceConnectionSelected" :rules="[requiredRule]">
                                <v-radio
                                    v-for="option in exitForm.progressMade.goalThreeExperienceConnection"
                                    :label="$t(option.xs_label)"
                                    :key="option.id"
                                    :value="option.label"
                                ></v-radio>
                            </v-radio-group>
                        </div>
                        <div v-if="exitForm.goal4">
                            <div class="font-semibold italic">"{{ exitForm.goal4 }}"</div>
                            
                            <p class="text-caption text-gray-500">The progress I made towards this goal was...</p>
                            <v-radio-group v-model="exitForm.progressMade.goalFourExperienceConnectionSelected" :rules="[requiredRule]">
                                <v-radio
                                    v-for="option in exitForm.progressMade.goalFourExperienceConnection"
                                    :label="$t(option.xs_label)"
                                    :key="option.id"
                                    :value="option.label"
                                ></v-radio>
                            </v-radio-group>
                        </div>
                        <div v-if="exitForm.goal5">
                            <div class="font-semibold italic">"{{ exitForm.goal5 }}"</div>
                            
                            <p class="text-caption text-gray-500">The progress I made towards this goal was...</p>
                            <v-radio-group v-model="exitForm.progressMade.goalFiveExperienceConnectionSelected" :rules="[requiredRule]">
                                <v-radio
                                    v-for="option in exitForm.progressMade.goalFiveExperienceConnection"
                                    :label="$t(option.xs_label)"
                                    :key="option.id"
                                    :value="option.label"
                                ></v-radio>
                            </v-radio-group>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Desktop Connection View -->
        <v-row>
            <v-col cols="12">
                <v-card>
                <v-table class="d-none d-sm-flex">
                    <thead>
                        <tr>
                            <th></th>
                            <th v-for="option in exitForm.progressMade.goalOneExperienceConnection" :key="option.id" class="text-center">{{ $t(option.label) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="exitForm.goal1">
                            <td>{{ exitForm.goal1 }}</td>
                            <td v-for="option in exitForm.progressMade.goalOneExperienceConnection" :key="option.id">
                            <v-radio-group v-model="exitForm.progressMade.goalOneExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalOneExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                                <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                            </v-radio-group>
                            </td>
                        </tr>
                        <tr v-if="exitForm.goal2">
                            <td>{{ exitForm.goal2 }}</td>
                            <td v-for="option in exitForm.progressMade.goalTwoExperienceConnection" :key="option.id">
                            <v-radio-group v-model="exitForm.progressMade.goalTwoExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalTwoExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                                <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                            </v-radio-group>
                            </td>
                        </tr>
                        <tr v-if="exitForm.goal3">
                            <td>{{ exitForm.goal3 }}</td>
                            <td v-for="option in exitForm.progressMade.goalThreeExperienceConnection" :key="option.id">
                            <v-radio-group v-model="exitForm.progressMade.goalThreeExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalThreeExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                                <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                            </v-radio-group>
                            </td>
                        </tr>
                        <tr v-if="exitForm.goal4">
                            <td>{{ exitForm.goal4 }}</td>
                            <td v-for="option in exitForm.progressMade.goalFourExperienceConnection" :key="option.id">
                            <v-radio-group v-model="exitForm.progressMade.goalFourExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFourExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                                <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                            </v-radio-group>
                            </td>
                        </tr>
                        <tr v-if="exitForm.goal5">
                            <td>{{ exitForm.goal5 }}</td>
                            <td v-for="option in exitForm.progressMade.goalFiveExperienceConnection" :key="option.id">
                            <v-radio-group v-model="exitForm.progressMade.goalFiveExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFiveExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                                <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                            </v-radio-group>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                </v-card>
            </v-col>
        </v-row>

        <!-- Goal Barriers Selection -->
        <v-row>
            <v-col cols="12">
                <p ref="goalIssuesField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGoalIssuesInvalid }">{{$t('Please select which goal(s) you faced barriers to achieving this semester.')}}</p>
                <v-list density="compact">
                    <v-list-item
                        v-for="(goal, index) in existingGoals"
                        :key="index"
                        density="compact"
                        class="ma-0 pa-0"
                    >
                        <v-checkbox
                            v-model="exitForm.goalIssues.goals[index].checked"
                            density="compact"
                            :disabled="exitForm.goalIssues.goals[5].checked"
                            :indeterminate="exitForm.goalIssues.goals[5].checked"
                            :label="goal"
                            outlined
                        ></v-checkbox>
                    </v-list-item>
                    <v-list-item
                        density="compact"
                        class="ma-0 pa-0"
                    >
                        <v-checkbox
                            v-model="exitForm.goalIssues.goals[5].checked"
                            @change="handleNoneSelected"
                            density="compact"
                            label="None"
                            outlined
                            :error-messages="goalIssuesErrorMessage"
                        ></v-checkbox>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>

        <!-- Hidden validation field -->
        <v-text-field
            v-show="false"
            :rules="goalIssuesRules"
        ></v-text-field>

        <!-- Barrier Description -->
        <v-row>
            <v-col cols="12">
                <p class="font-weight-black text-h8 mb-2">
                {{$t('For one of the goals you selected above, please describe what those barriers were and what strategies you employed to overcome those barriers in 3-4 sentences.')}}
                </p>
            </v-col>
        </v-row>
        <v-row dense class="mt-0 pt-0">
            <v-col cols="12">
                <v-textarea
                    v-model="exitForm.goalIssues.issuesDescription"
                    class="mt-0"
                    outlined
                    dense
                    :label="$t('Descriptions/Strategies')"
                    rows="4"
                ></v-textarea>
            </v-col>
        </v-row>

    </v-form>
</v-container>

<!-- Floating error navigation button -->
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
    name: "ExitFormGoals",
    props: {
      exitForm: Object,
      existingGoals: Array,
    },
    emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
    data() {
        return {
            formSubmitted: false,
            // Validation rule that only applies after form submission
            requiredRule: value => {
                if (!this.formSubmitted) {
                    return true;
                }
                return !!value || this.$t('Information is required.');
            },
        }
    },

    mounted() {
        // Scroll to top on component mount
        this.$nextTick(() => {
            window.scrollTo(0, 0);
        });
    },

    watch: {
      // Emit validation state changes and control tooltip
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
        // Validate progress selections for all existing goals
        isGoalProgressInvalid() {
            const goalProgressProperties = this.existingGoals.map((_, index) => {
                const goalNumber = (index + 1).toString();
                const suffix = goalNumber === '1' ? 'One'
                            : goalNumber === '2' ? 'Two'
                            : goalNumber === '3' ? 'Three'
                            : goalNumber === '4' ? 'Four'
                            : 'Five';
                return `goal${suffix}ProgressSelected`;
            });

            return goalProgressProperties.some(progressProperty => {
                return !this.exitForm.progressMade[progressProperty];
            });
        },
        
        // Validate course connection selections for all existing goals
        isGoalConnectionInvalid() {
            const goalConnectionProperties = this.existingGoals.map((_, index) => {
                const goalNumber = (index + 1).toString();
                const suffix = goalNumber === '1' ? 'One'
                            : goalNumber === '2' ? 'Two'
                            : goalNumber === '3' ? 'Three'
                            : goalNumber === '4' ? 'Four'
                            : 'Five';
                return `goal${suffix}ExperienceConnectionSelected`;
            });

            return goalConnectionProperties.some(connectionProperty => {
                return !this.exitForm.progressMade[connectionProperty];
            });
        },
        
        // Error message for goal issues selection
        goalIssuesErrorMessage() {
            const ruleResult = this.goalIssuesRules[0]();
            if (this.formSubmitted && typeof ruleResult === 'string') {
                return ruleResult;
            }
            return '';
        },
        
        // Check if goal issues selection is invalid
        isGoalIssuesInvalid() {
            return this.goalIssuesErrorMessage.length > 0;
        },
        
        // Validation rules for goal issues checkboxes
        goalIssuesRules() {
            return [
                () => this.exitForm.goalIssues.goals.some(goal => goal.checked) || this.$t('Please select at least one.')
            ];
        },
        
        // Overall validation state
        hasValidationErrors() {
            if (!this.formSubmitted) return false;
                return this.isGoalProgressInvalid || this.isGoalConnectionInvalid || this.isGoalIssuesInvalid
        },
    },

    methods: {
        // Validate form and emit result
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

        // Handle "None" checkbox selection logic
        handleNoneSelected() {
            if (this.exitForm.goalIssues.goals[5].checked) {
                this.exitForm.goalIssues.goals.forEach((goal, index) => {
                    if (index !== 5) {
                        goal.checked = false;
                    }
                })
            }
        },

        // Navigate to first error field
        scrollToErrorField() {
              const errorFields = [
                  'goalProgressField',
                  'goalConnectionField',
                  'goalIssuesField'
              ];
  
              for (let i = 0; i < errorFields.length; i++) {
                  if (this.isFieldInvalid(errorFields[i])) {
                      const ref = this.$refs[errorFields[i]];
                      const element = ref.$el ? ref.$el : ref;
                      this.$emit('scroll-to-error', element);
                      break;
                  }
              }
          },
      
          // Check if specific field is invalid
          isFieldInvalid(fieldRef) {
                switch (fieldRef) {
                    case 'goalProgressField':
                        return this.isGoalProgressInvalid;
                    case 'goalConnectionField':
                        return this.isGoalConnectionInvalid;
                    case 'goalIssuesField':
                        return this.isGoalIssuesInvalid;
                    default:
                        return false;
                }
            },
    },
}
</script>

<style scoped>
  /* Floating error button positioning */
  .fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
</style>