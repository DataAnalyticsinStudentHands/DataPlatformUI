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
            class="font-weight-black text-h6"
        >Exit Form {{$t('Review')}}</p>
    </v-col>
</v-row>
<v-row><v-col></v-col></v-row>

<!-- Selected Experience Section -->
<div class="review-section">
<v-row>
    <v-col cols="10" class="pb-0">
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
    <v-row class="d-flex justify-center align-center">
        <v-col sm="1" class="d-none d-sm-flex"></v-col>
        <v-col cols="1" class="d-sm-none"></v-col>
        <v-col cols="10" class="pb-0">
            <h2 class="section-title text-center">
                {{$t('Aspirations Progress')}}
            </h2>
        </v-col>
        <v-col cols="1" class="d-sm-none">
            <!-- Mobile edit button -->
            <v-btn v-if="$vuetify.display.xs"
                icon
                size="small"
                variant="text"
                @click="emitStepChange(1)"
            >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </v-col>
        <!-- Desktop edit button -->
        <v-col cols="1" class="d-none d-sm-flex">
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
        <p class="form-label">{{$t('At the beginning of the semester, we asked you to share your aspirations. Now we would like to review your progress towards these aspirations.')}}</p>
        </v-col>
    </v-row>
    <v-row v-for="(aspiration, index) in aspirations" :key="'asp-' + index">
        <v-col cols="12">
            <h4 class="aspiration-title">{{$t('Aspiration')}} {{ index + 1 }}</h4>
            <p class="review-section-content pl-3">{{ aspiration.text }}</p>
            <p class="form-label pl-3">{{$t('Progress Made')}}: {{ $t(aspiration.progressSelected) }}</p>
            <p class="form-label pl-3">{{$t('Experience Connection')}}: {{ $t(aspiration.experienceConnectionSelected) }}</p>
        </v-col>
    </v-row>
    
    <!-- Goals Progress Section -->
    <v-row class="d-flex justify-center align-center">
        <v-col sm="1" class="d-none d-sm-flex"></v-col>
        <v-col cols="1" class="d-sm-none"></v-col>
        <v-col cols="10" class="pb-0">
            <h2 class="section-title text-center">
                {{$t('Goals Progress')}}
            </h2>
        </v-col>
        <v-col cols="1" class="d-sm-none">
            <!-- Mobile edit button -->
            <v-btn v-if="$vuetify.display.xs"
                icon
                size="small"
                variant="text"
                @click="emitStepChange(2)"
            >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </v-col>
        <!-- Desktop edit button -->
        <v-col cols="1" class="d-none d-sm-flex">
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
            <p class="form-label">{{$t('Here is how you rated your progress towards each goal and the activities that contributed to your progress.')}}</p>
        </v-col>
    </v-row>
    <v-row v-for="(goal, index) in goals" :key="'goal-' + index">
        <v-col cols="12">
            <h4 class="goal-title">{{$t('Goal')}} {{ index + 1 }}</h4>
            <p class="review-section-content pl-3">{{ goal.text }}</p>
            <p class="form-label pl-3">{{$t('Progress Made')}}: {{ $t(goal.progressMade) }}</p>
            <p class="form-label pl-3">{{$t('Experience Connection')}}: {{ $t(goal.experienceConnection) }}</p>
        </v-col>
    </v-row>
    
    <!-- Goal Barriers Section -->
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('Goal Barriers')}}</h3>
            <p class="form-label">{{$t('Below are the goals you faced barriers to achieving this semester.')}}</p>
            <v-list density="compact" class="pa-0">
                <v-list-item
                    v-if="!exitForm.goalIssues.goals[5].checked"
                    v-for="(goal, index) in goalsWithBarriers"
                    :key="'barrier-' + index"
                >
                    <v-list-item-title class="text-subtitle-2">
                        {{ goal.label }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
            <p v-if="exitForm.goalIssues.goals[5].checked" class="review-section-content pl-3">{{$t('No significant barriers were faced.')}}</p>
        </v-col>
    </v-row>
    <v-row v-if="exitForm.goalIssues.issuesDescription && exitForm.goalIssues.issuesDescription.length">
        <v-col cols="12">
            <p class="form-label">{{$t('For one of the goals you selected above, described below are the barriers encountered and the strategies employed to overcome them:')}}</p>
            <p class="review-section-content pl-3">{{ exitForm.goalIssues.issuesDescription || $t('No barriers were described.') }}</p>
        </v-col>
    </v-row>
    
    <!-- Activity Contributions Section -->
    <div v-if="activitiesExist">
        <v-row class="d-flex justify-center align-center">
            <v-col sm="1" class="d-none d-sm-flex"></v-col>
            <v-col cols="1" class="d-sm-none"></v-col>
            <v-col cols="10" class="pb-0">
                <h2 class="section-title text-center">
                    {{$t('Activity Contributions to Goals')}}
                </h2>
            </v-col>
            <v-col cols="1" class="d-sm-none">
                <!-- Mobile edit button -->
                <v-btn v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(3)"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-col>
            <!-- Desktop edit button -->
            <v-col cols="1" class="d-none d-sm-flex">
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
                <p class="form-label">{{$t('Below is a summary of how activities contributed to your goals throughout the semester:')}}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-list density="compact" class="pa-0">
                    <v-list-item v-for="(activity, index) in exitForm.experienceActivities" :key="activity.activityID">
                        <div>
                            <h4 class="goal-title">{{$t('Activity')}} {{ index + 1 }}: {{ activity.activityName }}</h4>
                            <div v-if="goalsContributions(activity.activityID).length === 0">
                                <p class="review-section-content pl-3">{{$t('No specific goals contributed.')}}</p>
                            </div>
                            <div v-else>
                                <p class="form-label pl-3">{{$t('Contributed to Goals')}}:</p>
                                <ul class="pl-6">
                                    <li v-for="(goal, gIndex) in goalsContributions(activity.activityID)" 
                                        :key="'goal-' + gIndex"
                                        class="review-section-content"
                                    >
                                        {{ goal }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </div>
</div>

<!-- Growth and Reflection Section -->
<v-row class="d-flex justify-center align-center mt-5">
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <v-col cols="10" class="pb-0">
        <h2 class="section-title text-center">
            {{$t('Growth')}}
        </h2>
    </v-col>
    <v-col cols="1" class="d-sm-none">
        <!-- Mobile edit button -->
        <v-btn v-if="$vuetify.display.xs"
            icon
            size="small"
            variant="text"
            @click="emitStepChange(4)"
        >
            <v-icon>mdi-pencil</v-icon>
        </v-btn>
    </v-col>
    <!-- Desktop edit button -->
    <v-col cols="1" class="d-none d-sm-flex">
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
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Graduate/Professional Goals Contribution')}}</h3>
        <p class="form-label">{{$t('How this experience contributed to your graduate/professional goals:')}}</p>
        <p class="review-section-content pl-3" style="white-space: pre-line;">{{ exitForm.experienceContributions }}</p>
    </v-col>
</v-row>

<!-- Growth Assessment Reviews -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Problem Solving Growth')}}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('problem solving')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ exitForm.generalGrowth.problemSolving || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Effective Communication Growth')}}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('effective communication')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ exitForm.generalGrowth.effectiveCommunication || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Teamwork Growth')}}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teamwork')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ exitForm.generalGrowth.teamwork || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Cultural Humility Growth')}}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('cultural humility')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ exitForm.generalGrowth.culturalHumility || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Ethical Decision Making Growth')}}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('ethical decision making')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ exitForm.generalGrowth.ethicalDecisionMaking || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Professional Responsibility Growth')}}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('professional responsibility')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ exitForm.generalGrowth.professionalResponsibility || 'No response provided' }}</p>
    </v-col>
</v-row>

<!-- CHW Growth Assessment Section -->
<div v-if="isCHWExperience">
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('Interpersonal Relationship Building Growth')}}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('interpersonal relationship building')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ exitForm.chwGrowth.interpersonalRelationshipBuilding || $t('No response provided') }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('Service Coordination and Navigation Growth')}}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('service coordination and navigation')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ exitForm.chwGrowth.serviceCoordinationNavigation || $t('No response provided') }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('Evaluation and Research Growth')}}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('evaluation and research')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ exitForm.chwGrowth.evaluationResearch || $t('No response provided') }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('Knowledge Base on Health Issues Growth')}}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('knowledge base on health issues')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ exitForm.chwGrowth.knowledgeBaseHealthIssues || $t('No response provided') }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('Teaching and Education Growth')}}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teaching and education')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ exitForm.chwGrowth.teachingEducation || $t('No response provided') }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('Advocacy Growth')}}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('advocacy')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ exitForm.chwGrowth.advocacy || $t('No response provided') }}</p>
        </v-col>
    </v-row>
</div>

<!-- HICH Net Promoter Section -->
<div v-if="isHICHExperience">
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('HICH Recommendation Score')}}</h3>
            <p class="form-label">{{$t('How likely are you to recommend HICH to a friend?')}}</p>
            <p class="review-section-content pl-3">{{ exitForm.hichNetPromoter.recommendHICH || "" }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('HICH Socials and Workshops Recommendation')}}</h3>
            <p class="form-label">{{$t("How likely are you to recommend HICH's socials and workshops to a friend?")}}</p>
            <p class="review-section-content pl-3">{{ exitForm.hichNetPromoter.recommendSocialsWorkshops || "" }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('HICH Volunteer Projects Recommendation')}}</h3>
            <p class="form-label">{{$t("How likely are you to recommend HICH's volunteer projects to a friend?")}}</p>
            <p class="review-section-content pl-3">{{ exitForm.hichNetPromoter.recommendVolunteerProjects || "" }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{$t('HICH Mentorship Program Recommendation')}}</h3>
            <p class="form-label">{{$t("How likely are you to recommend HICH's mentorship program to a friend?")}}</p>
            <p class="review-section-content pl-3">{{ exitForm.hichNetPromoter.recommendMentorshipProgram || "" }}</p>
        </v-col>
    </v-row>
</div>

<!-- Open-Ended Reflections -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Biggest Lessons and Takeaways')}}</h3>
        <p class="form-label">
            {{$t('What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?')}}
        </p>
        <p class="review-section-content pl-3">{{ exitForm.openEnded.biggestLessons || $t('No response provided') }}</p>
    </v-col>
</v-row>
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Plans to Support Others')}}</h3>
        <p class="form-label">
            {{$t('Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?')}}
        </p>
        <p class="review-section-content pl-3">{{ exitForm.openEnded.supportOthers || $t('No response provided') }}</p>
    </v-col>
</v-row>
<v-row v-if="exitForm.openEnded.comments && exitForm.openEnded.comments.length">
    <v-col cols="12">
        <h3 class="review-section-title">{{$t('Additional Comments')}}</h3>
        <p class="form-label">
            {{$t('Use this space to provide any other comments or recommendations you would like to share.')}}
        </p>
        <p class="review-section-content pl-3">{{ exitForm.openEnded.comments || $t('No response provided') }}</p>
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
        },
        
        // Check if this is a CHW experience
        isCHWExperience() {
            // First check if there's actual CHW growth data filled out
            const hasChwData = this.exitForm.chwGrowth && (
                this.exitForm.chwGrowth.interpersonalRelationshipBuilding ||
                this.exitForm.chwGrowth.serviceCoordinationNavigation ||
                this.exitForm.chwGrowth.evaluationResearch ||
                this.exitForm.chwGrowth.knowledgeBaseHealthIssues ||
                this.exitForm.chwGrowth.teachingEducation ||
                this.exitForm.chwGrowth.advocacy
            );
            
            if (hasChwData) {
                return true;
            }
            
            // Then check experience name as fallback
            if (this.selectedExperience?.text?.includes('CHW')) {
                return true;
            }
            if (this.selectedExperience?.experienceName?.includes('CHW')) {
                return true;
            }
            if (this.expRegistrationIDFromIncompleteBackup) {
                const matchingExperience = this.exitForm.experiences.find(
                    experience => experience.expRegistrationID === this.expRegistrationIDFromIncompleteBackup
                );
                if (matchingExperience?.experienceName?.includes('CHW')) {
                    return true;
                }
            }
            return false;
        },
        
        isHICHExperience() {
            // Check if there's actual HICH net promoter data filled out (not empty strings)
            const hasHichData = this.exitForm.hichNetPromoter && (
                (this.exitForm.hichNetPromoter.recommendHICH !== "" && 
                this.exitForm.hichNetPromoter.recommendHICH !== null && 
                this.exitForm.hichNetPromoter.recommendHICH !== undefined) ||
                (this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== "" && 
                this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== null && 
                this.exitForm.hichNetPromoter.recommendSocialsWorkshops !== undefined) ||
                (this.exitForm.hichNetPromoter.recommendVolunteerProjects !== "" && 
                this.exitForm.hichNetPromoter.recommendVolunteerProjects !== null && 
                this.exitForm.hichNetPromoter.recommendVolunteerProjects !== undefined) ||
                (this.exitForm.hichNetPromoter.recommendMentorshipProgram !== "" && 
                this.exitForm.hichNetPromoter.recommendMentorshipProgram !== null && 
                this.exitForm.hichNetPromoter.recommendMentorshipProgram !== undefined)
            );
            
            if (hasHichData) {
                return true;
            }
            
            // Then check experience name as fallback
            if (this.selectedExperience?.text?.includes('HICH')) {
                return true;
            }
            if (this.expRegistrationIDFromIncompleteBackup) {
                const matchingExperience = this.exitForm.experiences.find(
                    experience => experience.expRegistrationID === this.expRegistrationIDFromIncompleteBackup
                );
                if (matchingExperience?.experienceName?.includes('HICH')) {
                    return true;
                }
            }
            return false;
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

/* Review section title styling */
.review-section-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Review section content styling */
.review-section-content {
    font-size: 1rem;
    margin-bottom: 10px;
}

/* Text wrapping for content and labels */
.review-section-content, .form-label {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

/* Form label styling */
.form-label {
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 0.75rem;
  color: grey;
}

/* List item styling for responsive layout */
.v-list-item {
    min-width: 0;
}

.v-list-item-title {
    white-space: normal;
}

/* Section title styling */
.section-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 10px;
}

/* Aspiration title styling */
.aspiration-title {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
}

/* Goal title styling */
.goal-title {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
}
</style>