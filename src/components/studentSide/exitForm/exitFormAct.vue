<!--
  File: src/components/studentSide/exitForm/exitFormAct.vue
  
  This component handles the activities contribution section of the exit form. It allows students
  to map which course activities helped them make progress towards their specific goals. The
  component provides both mobile and desktop views with different layouts - mobile uses a list
  format while desktop uses a table format. Students can select multiple goals per activity or
  indicate that an activity didn't contribute to any goals.
-->

<template>
    <v-container>
    <v-form
        ref="form"
        @submit.prevent="handleValidations"
    >
        <!-- Mobile View -->
        <div class="d-sm-none">
            <v-row>
                <v-col cols="12">
                    <p ref="goalActivityProgressMobileField" class="font-weight-black text-h8 mb-2" :class="{'text-custom-red': isGoalActivityProgressMobileInvalidTitle && formSubmitted}">
                    {{$t("For each activity listed, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select 'no goals'.")}}
                    </p>
                </v-col>
            </v-row>
    
            <!-- Activity list with goal checkboxes -->
            <v-row>
                <v-col cols="12">
                    <div v-for="activity in exitForm.experienceActivities" :key="activity.activityID">
                        <div class="font-weight-black">{{ activity.activityName }}</div>
                        <v-checkbox
                            v-if="exitForm.goal1"
                            :label="`${$t('Goal 1')}: ${exitForm.goal1}`"
                            :id="`${activity.activityID}-goal1`"
                            :value="activity.activityID"
                            v-model="exitForm.activitiesContribution.goalOneContributions"
                            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"  
                            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                            density="compact"
                        ></v-checkbox>
                        <v-checkbox
                            v-if="exitForm.goal2"
                            :label="`${$t('Goal 2')}: ${exitForm.goal2}`"
                            :id="`${activity.activityID}-goal2`"
                            :value="activity.activityID"
                            v-model="exitForm.activitiesContribution.goalTwoContributions"
                            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                            @change="updateContribution(activity.activityID, 'goalTwoContributions', $event)"
                            density="compact"
                        ></v-checkbox>
                        <v-checkbox
                        v-if="exitForm.goal3"
                            :label="`${$t('Goal 3')}: ${exitForm.goal3}`"
                            :id="`${activity.activityID}-goal3`"
                            :value="activity.activityID"
                            v-model="exitForm.activitiesContribution.goalThreeContributions"
                            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                            @change="updateContribution(activity.activityID, 'goalThreeContributions', $event)"
                            density="compact"
                        ></v-checkbox>
                        <v-checkbox
                            v-if="exitForm.goal4"
                            :label="`${$t('Goal 4')}: ${exitForm.goal4}`"
                            :id="`${activity.activityID}-goal4`"
                            :value="activity.activityID"
                            v-model="exitForm.activitiesContribution.goalFourContributions"
                            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                            @change="updateContribution(activity.activityID, 'goalFourContributions', $event)"
                            density="compact"    
                        ></v-checkbox>
                        <v-checkbox
                            v-if="exitForm.goal5"
                            :label="`${$t('Goal 5')}: ${exitForm.goal5}`"
                            :id="`${activity.activityID}-goal5`"
                            :value="activity.activityID"
                            v-model="exitForm.activitiesContribution.goalFiveContributions"
                            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                            @change="updateContribution(activity.activityID, 'goalFiveContributions', $event)"
                            density="compact"
                        ></v-checkbox>
                        <v-checkbox
                            :id="`${activity.activityID}-noGoals`"
                            :value="activity.activityID"
                            v-model="exitForm.activitiesContribution.noContributions"
                            :label="$t('No Goals')"
                            @change="updateContribution(activity.activityID, 'noContributions', $event)"
                            density="compact"
                        ></v-checkbox>
                        <!-- Hidden field for validation -->
                        <v-text-field
                            v-show="false"
                            :rules="[() => validateGoalActivityProgress(activity)]"
                        ></v-text-field>
                        <p class="text-sm text-custom-red mb-3 pt-0" v-if="!isGoalActivityProgressMobileInvalid[activity.activityID] && formSubmitted">{{$t('At least one checkbox must be selected for each activity.')}}</p>
                    </div>
                </v-col>
            </v-row>
        </div>
    
        <!-- Desktop View -->
        <div class="d-none d-sm-inline">
            <!-- Goals summary -->
            <v-row>
                <v-col cols="12">
                    <p class="font-weight-black text-h8 mb-2">
                    {{$t('Below is a list of your goals from the beginning of the semester:')}}
                    </p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12">
                    <v-list density="compact">
                        <template v-for="(goal, index) in [exitForm.goal1, exitForm.goal2, exitForm.goal3, exitForm.goal4, exitForm.goal5]">
                            <v-list-item v-if="goal" :key="index">
                                <span class="font-weight-black text-center">{{$t('Goal')}} {{ index + 1 }}: </span>
                                {{ goal }}
                            </v-list-item>
                        </template>
                    </v-list>
                </v-col>
            </v-row>
    
            <v-row>
                <v-col cols="12">
                    <p ref="goalActivityProgressField" class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isGoalActivityProgressInvalid && formSubmitted }">
                    {{$t("For each activity listed, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select 'no goals'.")}}
                    </p>
                </v-col>
            </v-row>
    
            <!-- Activities contribution table -->
            <v-row>
                <v-col cols="12">
                    <v-table>
                        <thead>
                            <tr>
                                <th></th>
                                <th v-for="(goal, index) in existingGoals" :key="index">{{$t('Goal')}} {{ index + 1 }}</th>
                                <th>{{$t('No Goals')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="activity in exitForm.experienceActivities" :key="activity.activityID">
                                <td>{{ activity.activityName }}</td>
                                <td>
                                <v-checkbox
                                    :id="`${activity.activityID}-goal1`"
                                    :value="activity.activityID"
                                    v-model="exitForm.activitiesContribution.goalOneContributions"
                                    :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                                    :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                                    @change="updateContribution(activity.activityID, 'goalOneContributions', $event)"
                                    density="compact"
                                    
                                ></v-checkbox>
                                </td>
                                <td>
                                <v-checkbox
                                    :id="`${activity.activityID}-goal2`"
                                    :value="activity.activityID"
                                    v-model="exitForm.activitiesContribution.goalTwoContributions"
                                    :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                                    :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                                    @change="updateContribution(activity.activityID, 'goalTwoContributions', $event)"
                                    density="compact"
                                    
                                ></v-checkbox>
                                </td>
                                <td>
                                <v-checkbox
                                    :id="`${activity.activityID}-goal3`"
                                    :value="activity.activityID"
                                    v-model="exitForm.activitiesContribution.goalThreeContributions"
                                    :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"  
                                    :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)" 
                                    @change="updateContribution(activity.activityID, 'goalThreeContributions', $event)"
                                    density="compact"
                                    
                                ></v-checkbox>
                                </td>
                                <td v-show="existingGoals.length >= 4">
                                <v-checkbox
                                    :id="`${activity.activityID}-goal4`"
                                    :value="activity.activityID"
                                    v-model="exitForm.activitiesContribution.goalFourContributions"
                                    :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                                    :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                                    @change="updateContribution(activity.activityID, 'goalFourContributions', $event)"
                                    density="compact"
                                    
                                ></v-checkbox>
                                </td>
                                <td v-show="existingGoals.length >= 5">
                                <v-checkbox
                                    :id="`${activity.activityID}-goal5`"
                                    :value="activity.activityID"
                                    v-model="exitForm.activitiesContribution.goalFiveContributions"
                                    :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                                    :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                                    @change="updateContribution(activity.activityID, 'goalFiveContributions', $event)"
                                    density="compact"
                                    
                                ></v-checkbox>
                                </td>
                                <td>
                                <v-checkbox
                                    :id="`${activity.activityID}-noGoals`"
                                    :value="activity.activityID"
                                    v-model="exitForm.activitiesContribution.noContributions"
                                    @change="updateContribution(activity.activityID, 'noContributions', $event.target.checked)"
                                    density="compact"
                                    
                                ></v-checkbox>
                                </td>
                                <!-- Hidden field for validation -->
                                <v-text-field
                                v-show="false"
                                :rules="[() => validateGoalActivityProgress(activity)]"
                                ></v-text-field>
                            </tr>
                        </tbody>
                    </v-table>
                    <p class="text-sm text-custom-red" v-if="isGoalActivityProgressInvalid && formSubmitted">{{$t('At least one checkbox must be selected for each activity.')}}</p>
                </v-col>
            </v-row>
        </div>
    </v-form>
    
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
    
    
    </v-container>
    </template>
    
    <script>
    import { toast } from 'vue3-toastify';
    
    export default {
        name: "ExitFormActivities",
        props: {
          exitForm: Object,
          existingGoals: Array,
        },
        emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
        data() {
            return {
                formSubmitted: false,
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
            // Validate each activity in mobile view
            isGoalActivityProgressMobileInvalid() {
                let validity = {};
                this.exitForm.experienceActivities.forEach(activity => {
                    const activityID = activity.activityID;
                    const isAnyChecked = [
                        this.exitForm.activitiesContribution.goalOneContributions,
                        this.exitForm.activitiesContribution.goalTwoContributions,
                        this.exitForm.activitiesContribution.goalThreeContributions,
                        this.exitForm.activitiesContribution.goalFourContributions,
                        this.exitForm.activitiesContribution.goalFiveContributions,
                        this.exitForm.activitiesContribution.noContributions
                    ].some(contributions => contributions.includes(activityID));
    
                    validity[activityID] = isAnyChecked;
                });
                return validity;
            },
            
            // Check if any activity is invalid in mobile view
            isGoalActivityProgressMobileInvalidTitle() {
                return Object.values(this.isGoalActivityProgressMobileInvalid).includes(false);
            },
            
            // Validate activities in desktop view
            isGoalActivityProgressInvalid() {
                // Map existing goals to contribution property names
                const goalContributionProperties = this.existingGoals.map((_, index) => {
                    const goalNumber = index + 1;
                    const suffix = goalNumber === 1 ? 'One'
                                    : goalNumber === 2 ? 'Two'
                                    : goalNumber === 3 ? 'Three'
                                    : goalNumber === 4 ? 'Four'
                                    : 'Five';
                    return `goal${suffix}Contributions`;
                });
    
                return this.exitForm.experienceActivities.some(activity => {
                    const activityID = activity.activityID;
                    
                    // Check if activity is mapped to any goal or marked as no contribution
                    const isAnyChecked = goalContributionProperties.some(prop => 
                        this.exitForm.activitiesContribution[prop].includes(activityID)
                    ) || this.exitForm.activitiesContribution.noContributions.includes(activityID);
                    
                    return !isAnyChecked;
                });
            },
            
            // Overall validation state
            hasValidationErrors() {
                if (!this.formSubmitted) return false;
                    return this.isGoalActivityProgressMobileInvalidTitle || this.isGoalActivityProgressInvalid
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
    
            // Handle checkbox selection logic
            updateContribution(activityId, goal, checked) {
                if (goal === 'noContributions') {
                let newActivitiesContribution = { ...this.exitForm.activitiesContribution };
    
                if (checked) {
                    // Clear activity from all goal contributions when "No Goals" is selected
                    ['goalOneContributions', 'goalTwoContributions', 'goalThreeContributions', 
                    'goalFourContributions', 'goalFiveContributions'].forEach(g => {
                        newActivitiesContribution[g] = newActivitiesContribution[g].filter(id => id !== activityId);
                    });
                } else {
                    // Remove from 'noContributions' when unchecked
                    newActivitiesContribution['noContributions'] = newActivitiesContribution['noContributions'].filter(id => id !== activityId);
                }
    
                // Trigger Vue reactivity
                this.exitForm.activitiesContribution = newActivitiesContribution;
                }
            },
    
            // Validate individual activity has at least one selection
            validateGoalActivityProgress(activity) {
                const activityID = activity.activityID;
                const isAnyChecked = Object.values(this.exitForm.activitiesContribution).some(contributions => 
                    contributions.includes(activityID)
                );
                return isAnyChecked || this.$t('At least one checkbox must be selected for each activity.');
            },
    
            // Navigate to first error field
            scrollToErrorField() {
                  const errorFields = [
                      'goalActivityProgressField'
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
                        case 'goalActivityProgressField':
                            return this.isGoalActivityProgressInvalid;
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