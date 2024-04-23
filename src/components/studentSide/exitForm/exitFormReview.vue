<template>
<v-container>
<v-form disabled>
<!-- Section: Selected Experience -->
<v-row>
    <v-col>
        <p 
            class="section-title text-center ma-0"
        >Exit Form {{$t('Review')}}</p>
    </v-col>
</v-row>
<v-row><v-col></v-col></v-row>
<div class="review-section">
<v-row>
    <v-col cols="10" class="pb-0">
        <h3 class="review-section-title">
            {{ $t('Selected Experience') }}
            <!-- Mobile View Edit Button -->
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
    <!-- Non-Mobile View Edit Button -->
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
    <!-- Aspirations Review -->
    <v-row>
        <v-col cols="10">
            <h2 class="section-title mb-0">{{$t('Aspirations Progress')}}</h2>
        </v-col>
        <!-- Non-Mobile View Edit Button -->
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
    <!-- Goals Progress Review -->
    <v-row>
        <v-col cols="10">
            <h2 class="section-title mb-0">{{$t('Goals Progress')}}</h2>
        </v-col>
        <!-- Non-Mobile View Edit Button -->
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
    <!-- Goals Barriers -->
    <v-row>
        <v-col cols="10">
            <h2 class="section-title mb-0">{{$t('Goal Barriers')}}</h2>
        </v-col>
        <!-- Non-Mobile View Edit Button -->
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
    <div v-if="activitiesExist">
        <v-row>
            <v-col cols="10">
                <h2 class="section-title mb-0">{{$t('Activity Contributions to Goals')}}</h2>
            </v-col>
            <!-- Non-Mobile View Edit Button -->
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
<!-- Experience Contribution to Graduate/Professional Goals -->
<v-row class="mt-5">
    <v-col cols="10">
        <h2 class="section-title mb-0">{{$t('Growth')}}</h2>
    </v-col>
    <!-- Non-Mobile View Edit Button -->
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
<!-- Problem Solving Growth Review Section -->
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
<!-- Teamwork Growth Review Section -->
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
<!-- Cultural Humility Growth Review Section -->
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
<!-- Ethical Decision Making Growth Review Section -->
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
<!-- Professional Responsibility Growth Review Section -->
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
<!-- Biggest Lessons and Key Takeaways Review Section -->
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
<!-- Engage and Support Review Section -->
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
<!-- Other Comments/Recommendations Review Section -->
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
        this.$nextTick(() => {
            window.scrollTo(0, 0);
        });
    },
    computed: {
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
            ].filter(aspiration => aspiration.text);  // Filter out undefined or empty aspirations
        },
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
            ].filter(goal => goal.text); // Filters out undefined or empty goals
        },
        goalsWithBarriers() {
            return this.exitForm.goalIssues.goals
                .map((goal, index) => ({ label: this.exitForm['goal' + (index + 1)], checked: goal.checked }))
                .filter(goal => goal.checked);
        },
        goalsContributions() {
            return (activityID) => {
                let contributions = [];
                // Map contributions to goal descriptions
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
                return contributions; // Returns an array of descriptions for goals to which the activity contributes
            }
        },
        displayExperienceText() {
            // Check if selectedExperience exists and has a non-empty text property
            if (this.selectedExperience && this.selectedExperience.text) {
                return this.selectedExperience.text;
            } else if (this.expRegistrationIDFromIncompleteBackup) {
                // Find the experience in exitForm.experiences that matches expRegistrationIDFromIncomplete
                const matchingExperience = this.exitForm.experiences.find(experience => experience.expRegistrationID === this.expRegistrationIDFromIncompleteBackup);
                // If a matching experience is found, return the formatted string
                if (matchingExperience) {
                    return `${matchingExperience.experienceCategory}: ${matchingExperience.experienceName}`;
                }
            }
        }

    },
    methods: {
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
.review-section {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.review-section-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.review-section-content {
    font-size: 1.1rem; /* Adjust the size as needed */
    margin: 10px 0; /* Vertical spacing for separation */
    padding: 8px; /* Padding for better readability */
    background-color: #f9f9f9; /* A light background to distinguish the area */
    border: 1px solid #ddd; /* A subtle border */
    border-radius: 4px; /* Rounded corners for a smooth look */
}


.form-label {
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #555; /* Darker grey for better readability */
}

.v-list-item {
  min-width: 0; /* Override minimum width */
}

.v-list-item-title {
  font-size: 1.1rem; /* Larger font size for main items */
  font-weight: bold; /* Adding bold to emphasize the titles */
  margin-bottom: 5px; /* Space between title and subtitle */
  white-space: normal; /* Allows text to wrap */
  overflow: hidden; /* Keeps the text bound within the container */
  text-overflow: clip; /* Prevents text from being clipped with ellipses */
}


.v-list-item-subtitle {
  font-size: 1rem; /* Slightly larger subtitle */
  color: #333; /* Darker font color for better readability */
  margin-bottom: 10px; /* Increased spacing */
  line-height: 1.4; /* Increase line height to prevent cutting off text */
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.aspiration-title, .goal-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 10px;
}

.subtitle-enhanced {
  font-size: 1rem; /* Appropriate font size for detail text */
  color: #2c2c2c; /* Dark gray for better readability */
  line-height: 1.4; /* Sufficient line spacing for easy reading */
  padding: 8px 16px; /* Padding for visual space around the text */
  background-color: #f0f0f0; /* Light background to distinguish this item */
  margin: 4px 0; /* Margins to space out list items */
  border-radius: 4px; /* Slightly rounded corners for a soft look */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  display: block; /* Ensure it takes up full width available */
  overflow-wrap: break-word; /* Allows long words to break and wrap onto the next line */
}

.subtitle-enhanced-nowrap {
  font-size: 1rem; /* Appropriate font size for detail text */
  color: #2c2c2c; /* Dark gray for better readability */
  padding: 8px 16px; /* Padding for visual space around the text */
  background-color: #f0f0f0; /* Light background to distinguish this item */
  margin: 4px 0; /* Margins to space out list items */
  border-radius: 4px; /* Slightly rounded corners for a soft look */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  white-space: nowrap; /* Prevents text from wrapping to the next line */
  overflow: hidden; /* Hides text that overflows the container's width */
  text-overflow: ellipsis; /* Adds an ellipsis (...) when text overflows */
}


</style>
