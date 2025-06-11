<!--
  File: src/components/studentSide/exitForm/exitFormReview.vue
  
  This component provides a comprehensive review of all information entered in the exit form
  before final submission. It displays the selected experience, progress on aspirations and goals,
  barriers encountered, activity contributions, personal growth assessments, and open-ended
  reflections. Each section includes edit buttons that navigate back to the specific form step
  for modifications. The layout adapts for mobile and desktop views.
-->

<template>
<v-container>
<v-form disabled>
<!-- Review Header -->
<v-row>
    <v-col>
        <p 
            class="section-title text-center ma-0"
        >Exit Form {{$t('Review')}}</p>
    </v-col>
</v-row>
<v-row><v-col></v-col></v-row>

<!-- Selected Experience Section -->
<div class="review-section">
<v-row>
    <v-col sm="10" xs="12" class="pb-0">
        <h3 class="review-section-title">
            {{ $t('Selected Experience') }}
            <!-- Mobile edit button -->
            <v-btn v-if="$vuetify.display.xs"
                icon
                size="small"
                variant="text"
                @click="emitStepChange(0)"
                class="pb-2"
            >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </h3>
    </v-col>
    <!-- Desktop edit button -->
    <v-col class="text-right pb-0" v-if="$vuetify.display.smAndUp">
        <v-btn
            icon
            size="small"
            variant="text"
            @click="emitStepChange(0)"
        >
        <v-icon>mdi-pencil</v-icon>
        </v-btn>
    </v-col>
</v-row>
<v-row>
    <v-col cols="10" class="pt-0">
        <p class="review-section-content pl-3">
            {{ displayExperienceText }}
        </p>
    </v-col>
</v-row>
</div>

<div v-if="goalFormExists">
    <!-- Aspirations Progress Section -->
    <v-row>
        <v-col sm="10" xs="12">
            <h2 class="section-title mb-0">{{$t('Aspirations Progress')}}
                <!-- Mobile edit button -->
                <v-btn v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(1)"
                    class="pb-2"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </h2>
        </v-col>
        <!-- Desktop edit button -->
        <v-col class="text-right pb-0" v-if="$vuetify.display.smAndUp">
            <v-btn
                icon
                size="small"
                variant="text"
                @click="emitStepChange(1)"
            >
            <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
        <p>{{$t('At the beginning of the semester, we asked you to share your aspirations. Now we would like to review your progress towards these aspirations.')}}</p>
        </v-col>
    </v-row>
    <v-row v-for="(aspiration, index) in aspirations" :key="'asp-' + index">
        <v-col cols="12">
            <v-list-item>
                <v-list-item-title>
                    <strong>{{$t('Aspiration')}} {{ index + 1 }}:</strong> {{ aspiration.text }}
                </v-list-item-title>
                <v-list-item class="subtitle-enhanced">
                    {{ $t(aspiration.progressSelected) }}
                </v-list-item>
                <v-list-item class="subtitle-enhanced">
                    {{ $t(aspiration.experienceConnectionSelected) }}
                </v-list-item>
            </v-list-item>
        </v-col>
    </v-row>
    
    <!-- Goals Progress Section -->
    <v-row>
        <v-col sm="10" xs="12">
            <h2 class="section-title mb-0">{{$t('Goals Progress')}}
                <!-- Mobile edit button -->
                <v-btn v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(2)"
                    class="pb-2"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </h2>
        </v-col>
        <!-- Desktop edit button -->
        <v-col class="text-right pb-0" v-if="$vuetify.display.smAndUp">
            <v-btn
                icon
                size="small"
                variant="text"
                @click="emitStepChange(2)"
            >
            <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <p>{{$t('Here is how you rated your progress towards each goal and the activities that contributed to your progress.')}}</p>
        </v-col>
    </v-row>
    <v-row v-for="(goal, index) in goals" :key="'goal-' + index">
        <v-col cols="12">
            <v-list-item>
                <v-list-item-title>
                    <strong>{{$t('Goal')}} {{ index + 1 }}:</strong> {{ goal.text }}
                </v-list-item-title>
                <v-list-item class="subtitle-enhanced">
                    {{$t('Progress Made')}}: {{ $t(goal.progressMade) }}
                </v-list-item>
                <v-list-item class="subtitle-enhanced">
                    {{$t('Experience Connection')}}: {{ $t(goal.experienceConnection) }}
                </v-list-item>
            </v-list-item>
        </v-col>
    </v-row>
    
    <!-- Goal Barriers Section -->
    <v-row>
        <v-col sm="10" xs="12">
            <h2 class="section-title mb-0">{{$t('Goal Barriers')}}
                <!-- Mobile edit button -->
                <v-btn v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(2)"
                    class="pb-2"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </h2>
        </v-col>
        <!-- Desktop edit button -->
        <v-col class="text-right pb-0" v-if="$vuetify.display.smAndUp">
            <v-btn
                icon
                size="small"
                variant="text"
                @click="emitStepChange(2)"
            >
            <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <p>{{$t('Below are the goals you faced barriers to achieving this semester.')}}</p>
            <v-list-item
                v-if="!exitForm.goalIssues.goals[5].checked"
                v-for="(goal, index) in goalsWithBarriers"
                :key="'barrier-' + index"
                class="subtitle-enhanced"
            >
                <v-list-item>
                    {{ goal.label }}
                </v-list-item>
            </v-list-item>
            <p v-if="exitForm.goalIssues.goals[5].checked" class="subtitle-enhanced">{{$t('No significant barriers were faced.')}}</p>
        </v-col>
    </v-row>
    <v-row v-if="exitForm.goalIssues.issuesDescription && exitForm.goalIssues.issuesDescription.length">
        <v-col cols="12">
            <p>{{$t('For one of the goals you selected above, described below are the barriers encountered and the strategies employed to overcome them:')}}</p>
            <p class="subtitle-enhanced">{{ exitForm.goalIssues.issuesDescription || $t('No barriers were described.') }}</p>
        </v-col>
    </v-row>
    
    <!-- Activity Contributions Section -->
    <div v-if="activitiesExist">
        <v-row>
            <v-col sm="10" xs="12">
                <h2 class="section-title mb-0">{{$t('Activity Contributions to Goals')}}
                <!-- Mobile edit button -->
                <v-btn v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(3)"
                    class="pb-2"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                </h2>
            </v-col>
            <!-- Desktop edit button -->
            <v-col class="text-right pb-0" v-if="$vuetify.display.smAndUp">
                <v-btn
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(3)"
                >
                <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <p>{{$t('Below is a summary of how activities contributed to your goals throughout the semester:')}}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-list dense>
                    <v-list-item v-for="(activity, index) in exitForm.experienceActivities" :key="activity.activityID">
                        <v-list-item-title class="font-weight-bold">{{$t('Activity')}} {{ index + 1 }}: {{ activity.activityName }}</v-list-item-title>
                        <div v-if="goalsContributions(activity.activityID).length === 0">
                            <v-list-item>
                                {{$t('No specific goals contributed.')}}
                            </v-list-item>
                        </div>
                        <div v-else>
                            <v-list-item>
                                {{$t('Contributed to Goals')}}:
                            </v-list-item>
                            <v-list-item 
                                v-for="(goal, gIndex) in goalsContributions(activity.activityID)" 
                                :key="'goal-' + gIndex"
                                class="subtitle-enhanced-nowrap"
                            >
                                {{ goal }}
                            </v-list-item>
                        </div>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </div>
</div>

<!-- Growth and Reflection Section -->
<v-row class="mt-5">
    <v-col sm="10" xs="12">
        <h2 class="section-title mb-0">{{$t('Growth')}}
                <!-- Mobile edit button -->
                <v-btn v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(4)"
                    class="pb-2"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
        </h2>
    </v-col>
    <!-- Desktop edit button -->
    <v-col class="text-right pb-0" v-if="$vuetify.display.smAndUp">
        <v-btn
            icon
            size="small"
            variant="text"
            @click="emitStepChange(4)"
        >
        <v-icon>mdi-pencil</v-icon>
        </v-btn>
    </v-col>
</v-row>

<!-- Professional Goals Contribution -->
<v-row>
    <v-col>
        <p>{{$t('How this experience contributed to your graduate/professional goals:')}}</p>
    </v-col>
</v-row>
<v-row>
    <v-col cols="12">
        <div class="subtitle-enhanced" style="white-space: pre-line;">{{ exitForm.experienceContributions }}</div>
    </v-col>
</v-row>

<!-- Growth Assessment Reviews -->
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('problem solving')}}</u>.
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.generalGrowth.problemSolving || $t('No response provided') }}
        </div>
    </v-col>
</v-row>
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('effective communication')}}</u>.
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.generalGrowth.effectiveCommunication || $t('No response provided') }}
        </div>
    </v-col>
</v-row>
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teamwork')}}</u>.
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.generalGrowth.teamwork || $t('No response provided') }}
        </div>
    </v-col>
</v-row>
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('cultural humility')}}</u>.
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.generalGrowth.culturalHumility || $t('No response provided') }}
        </div>
    </v-col>
</v-row>
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('ethical decision making')}}</u>.
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.generalGrowth.ethicalDecisionMaking || $t('No response provided') }}
        </div>
    </v-col>
</v-row>
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('professional responsibility')}}</u>.
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.generalGrowth.professionalResponsibility || 'No response provided' }}
        </div>
    </v-col>
</v-row>

<!-- Open-Ended Reflections -->
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?')}}
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.openEnded.biggestLessons || $t('No response provided') }}
        </div>
    </v-col>
</v-row>
<v-row class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?')}}
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.openEnded.supportOthers || $t('No response provided') }}
        </div>
    </v-col>
</v-row>
<v-row v-if="exitForm.openEnded.comments && exitForm.openEnded.comments.length" class="mt-5">
    <v-col cols="12">
        <p>
            {{$t('Use this space to provide any other comments or recommendations you would like to share.')}}
        </p>
        <div class="subtitle-enhanced">
            {{ exitForm.openEnded.comments || $t('No response provided') }}
        </div>
    </v-col>
</v-row>

</v-form>
</v-container>
</template>

<script>
export default {
    name: "GoalFormReview",
    props: {
        selectedExperience: Object,
        exitForm: Object,
        goalFormExists: Boolean,
        activitiesExist: Boolean,
        expRegistrationIDFromIncompleteBackup: String
    },
    emits: ["change-step"],
    mounted() {
        // Scroll to top on component mount
        this.$nextTick(() => {
            window.scrollTo(0, 0);
        });
    },
    computed: {
        // Format aspirations with progress and connection data
        aspirations() {
            return [
                {
                    text: this.exitForm.aspiration1,
                    progressSelected: this.exitForm.progressMade.aspirationOneProgressSelected || "",
                    experienceConnectionSelected: this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || ""
                },
                {
                    text: this.exitForm.aspiration2,
                    progressSelected: this.exitForm.progressMade.aspirationTwoProgressSelected || "",
                    experienceConnectionSelected: this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || ""
                },
                {
                    text: this.exitForm.aspiration3,
                    progressSelected: this.exitForm.progressMade.aspirationThreeProgressSelected || "",
                    experienceConnectionSelected: this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || ""
                }
            ].filter(aspiration => aspiration.text);
        },
        
        // Format goals with progress and connection data
        goals() {
            return [
                {
                    text: this.exitForm.goal1,
                    progressMade: this.exitForm.progressMade.goalOneProgressSelected || "",
                    experienceConnection: this.exitForm.progressMade.goalOneExperienceConnectionSelected || ""
                },
                {
                    text: this.exitForm.goal2,
                    progressMade: this.exitForm.progressMade.goalTwoProgressSelected || "",
                    experienceConnection: this.exitForm.progressMade.goalTwoExperienceConnectionSelected || ""
                },
                {
                    text: this.exitForm.goal3,
                    progressMade: this.exitForm.progressMade.goalThreeProgressSelected || "",
                    experienceConnection: this.exitForm.progressMade.goalThreeExperienceConnectionSelected || ""
                },
                {
                    text: this.exitForm.goal4,
                    progressMade: this.exitForm.progressMade.goalFourProgressSelected || "",
                    experienceConnection: this.exitForm.progressMade.goalFourExperienceConnectionSelected || ""
                },
                {
                    text: this.exitForm.goal5,
                    progressMade: this.exitForm.progressMade.goalFiveProgressSelected || "",
                    experienceConnection: this.exitForm.progressMade.goalFiveExperienceConnectionSelected || ""
                }
            ].filter(goal => goal.text);
        },
        
        // Get goals that had barriers
        goalsWithBarriers() {
            return this.exitForm.goalIssues.goals
                .map((goal, index) => ({ label: this.exitForm['goal' + (index + 1)], checked: goal.checked }))
                .filter(goal => goal.checked);
        },
        
        // Map activity contributions to goal descriptions
        goalsContributions() {
            return (activityID) => {
                let contributions = [];
                if (this.exitForm.activitiesContribution.goalOneContributions.includes(activityID)) {
                    contributions.push(this.exitForm.goal1);
                }
                if (this.exitForm.activitiesContribution.goalTwoContributions.includes(activityID)) {
                    contributions.push(this.exitForm.goal2);
                }
                if (this.exitForm.activitiesContribution.goalThreeContributions.includes(activityID)) {
                    contributions.push(this.exitForm.goal3);
                }
                if (this.exitForm.activitiesContribution.goalFourContributions.includes(activityID)) {
                    contributions.push(this.exitForm.goal4);
                }
                if (this.exitForm.activitiesContribution.goalFiveContributions.includes(activityID)) {
                    contributions.push(this.exitForm.goal5);
                }
                return contributions;
            }
        },
        
        // Display experience text from selected or incomplete form
        displayExperienceText() {
            if (this.selectedExperience && this.selectedExperience.text) {
                return this.selectedExperience.text;
            } else if (this.expRegistrationIDFromIncompleteBackup) {
                const matchingExperience = this.exitForm.experiences.find(experience => experience.expRegistrationID === this.expRegistrationIDFromIncompleteBackup);
                if (matchingExperience) {
                    return `${matchingExperience.experienceCategory}: ${matchingExperience.experienceName}`;
                }
            }
        }
    },
    methods: {
        // Navigate to specific form step based on form configuration
        emitStepChange(stepNumber) {
            if (this.goalFormExists && this.activitiesExist) {
                this.$emit('change-step', stepNumber);
            } else if (this.goalFormExists && !this.activitiesExist) {
                if (stepNumber === 4) {
                    this.$emit('change-step', 3);
                } else {
                    this.$emit('change-step', stepNumber);
                }
            } else if (!this.goalFormExists) {
                if (stepNumber === 4) {
                    this.$emit('change-step', 1);
                } else {
                    this.$emit('change-step', stepNumber);
                }
            }
        },
    },
}
</script>

<style scoped>
/* Review section container styling */
.review-section {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

/* Section title styling */
.review-section-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 15px;
}

/* Experience content box styling */
.review-section-content {
    font-size: 1.1rem;
    margin: 10px 0;
    padding: 8px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* Form label styling */
.form-label {
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #555;
}

/* List item configuration */
.v-list-item {
  min-width: 0;
}

/* List item title styling */
.v-list-item-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 5px;
  white-space: normal;
  overflow: hidden;
  text-overflow: clip;
}

/* Subtitle styling */
.v-list-item-subtitle {
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

/* Main section titles */
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Aspiration and goal titles */
.aspiration-title, .goal-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 10px;
}

/* Enhanced subtitle with wrapping */
.subtitle-enhanced {
  font-size: 1rem;
  color: #2c2c2c;
  line-height: 1.4;
  padding: 8px 16px;
  background-color: #f0f0f0;
  margin: 4px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: block;
  overflow-wrap: break-word;
}

/* Enhanced subtitle without wrapping */
.subtitle-enhanced-nowrap {
  font-size: 1rem;
  color: #2c2c2c;
  padding: 8px 16px;
  background-color: #f0f0f0;
  margin: 4px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>