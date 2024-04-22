<template>
    <v-container>
    <v-form
        ref="form"
        @submit.prevent="handleValidations"
    >
        <!-- Activity Progress -->
    
        <!-- Mobile View -->
        <div class="d-sm-none">
    
            <v-row>
                <v-col cols="12">
                    <p ref="goalActivityProgressMobileField" class="font-weight-black text-h8 mb-2" :class="{'text-custom-red': isGoalActivityProgressMobileInvalidTitle && formSubmitted}">
                    {{$t("For each activity listed, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select 'no goals'.")}}
                    </p>
                </v-col>
            </v-row>
    
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
                        <!-- Dummy Text Fields for Group Validation -->
                        <v-text-field
                            v-show="false"
                            :rules="[() => validateGoalActivityProgress(activity)]"
                        ></v-text-field>
                        <p class="text-sm text-custom-red mb-3 pt-0" v-if="!isGoalActivityProgressMobileInvalid[activity.activityID] && formSubmitted">{{$t('At least one checkbox must be selected for each activity.')}}</p>
                    </div>
                </v-col>
            </v-row>
        </div>
    
        <!-- Non-Mobile View -->
        <div class="d-none d-sm-inline">
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
                                <!-- Dummy Text Fields for Group Validation -->
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
            this.$nextTick(() => {
                window.scrollTo(0, 0);
            });
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
    
                    // Set the validity for each activity
                    validity[activityID] = isAnyChecked;
                });
                return validity;
            },
            isGoalActivityProgressMobileInvalidTitle() {
                // Check if any activity is invalid
                return Object.values(this.isGoalActivityProgressMobileInvalid).includes(false);
            },
            isGoalActivityProgressInvalid() {
                // Generate an array of contribution property names based on existing goals
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
                    
                    // Check if the activity contributes to any of the active goals or "None"
                    const isAnyChecked = goalContributionProperties.some(prop => 
                        this.exitForm.activitiesContribution[prop].includes(activityID)
                    ) || this.exitForm.activitiesContribution.noContributions.includes(activityID);
                    
                    // If no checkboxes are checked for the activity, return true (invalid)
                    return !isAnyChecked;
                });
            },
            hasValidationErrors() {
                if (!this.formSubmitted) return false;
                    return this.isGoalActivityProgressMobileInvalidTitle || this.isGoalActivityProgressInvalid
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
    
            updateContribution(activityId, goal, checked) {
                if (goal === 'noContributions') {
                let newActivitiesContribution = { ...this.exitForm.activitiesContribution };
    
                if (checked) {
                    // Clear the activityId from all other goals
                    ['goalOneContributions', 'goalTwoContributions', 'goalThreeContributions', 
                    'goalFourContributions', 'goalFiveContributions'].forEach(g => {
                        newActivitiesContribution[g] = newActivitiesContribution[g].filter(id => id !== activityId);
                    });
                } else {
                    // Remove the activityId from 'noContributions' if it's present
                    newActivitiesContribution['noContributions'] = newActivitiesContribution['noContributions'].filter(id => id !== activityId);
                }
    
                // Assign the new object to ensure Vue tracks the update
                this.exitForm.activitiesContribution = newActivitiesContribution;
                }
            },
    
            validateGoalActivityProgress(activity) {
                // Check if at least one checkbox is selected for the activity
                const activityID = activity.activityID;
                const isAnyChecked = Object.values(this.exitForm.activitiesContribution).some(contributions => 
                    contributions.includes(activityID)
                );
                return isAnyChecked || this.$t('At least one checkbox must be selected for each activity.');
            },
    
            scrollToErrorField() {
                  const errorFields = [
                      'goalActivityProgressField'
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
    .fixed-button {
        position: fixed;
        bottom: 20px; /* Adjust the bottom value as needed */
        right: 20px; /* Adjust the right value as needed */
        z-index: 1000;
    }
    </style>