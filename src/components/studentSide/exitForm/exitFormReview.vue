<!--
  File: src/components/studentSide/exitForm/exitFormReview.vue
  
  This component provides a comprehensive review of all information entered in the exit form
  before final submission. It displays the selected experience, progress on aspirations and goals,
  barriers encountered, activity contributions, personal growth assessments, and open-ended
  reflections. Each section includes edit buttons that navigate back to the specific form step
  for modifications. The layout adapts for mobile and desktop views.
-->

<template>
<!-- Disabled form wrapper for read-only display -->
<v-form disabled>
<v-container>
<!-- Review section title -->
<v-row>
    <v-col>
        <p 
            class="font-weight-black text-h6"
        >{{$t('Review')}}</p>
    </v-col>
</v-row>
<v-row><v-col></v-col></v-row>

<!-- Selected experience section with responsive edit buttons -->
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
        <!-- Show instructor if present -->
        <p v-if="displayInstructor" class="review-section-content pl-3">
            <v-icon size="small" class="mr-1">mdi-account-tie</v-icon>
            {{ $t('Instructor') }}: {{ displayInstructor }}
        </p>
    </v-col>
</v-row>
</div>

<div v-if="goalFormExists">
    <!-- Aspirations Progress section with responsive edit buttons -->
    <v-row class="d-flex justify-center align-center">
        <v-col sm="1" class="d-none d-sm-flex"></v-col>
        <v-col cols="1" class="d-sm-none"></v-col>
        <v-col cols="10" class="pb-0">
            <h2 class="section-title text-center">
                {{ $t('Aspirations Progress') }}
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
        <v-col cols="12">
            <p class="form-label">{{$t('At the beginning of the semester, we asked you to share your aspirations. Now we would like to review your progress towards these aspirations.')}}</p>
        </v-col>
    </v-row>
    <v-row v-for="(aspiration, index) in aspirations" :key="'asp-' + index">
        <v-col cols="12">
            <h4 class="aspiration-title">{{$t('Aspiration')}} {{ index + 1 }}</h4>
            <p class="review-section-content pl-3">{{ aspiration.text }}</p>
            <p class="form-label pl-3">{{$t('Progress Made')}}:</p>
            <p class="review-section-content pl-3">{{ $t(aspiration.progressSelected) }}</p>
            <p class="form-label pl-3">{{$t('Experience Connection')}}:</p>
            <p class="review-section-content pl-3">{{ $t(aspiration.experienceConnectionSelected) }}</p>
        </v-col>
    </v-row>
    
    <!-- Goals Progress section with responsive edit buttons -->
    <v-row class="d-flex justify-center align-center">
        <v-col sm="1" class="d-none d-sm-flex"></v-col>
        <v-col cols="1" class="d-sm-none"></v-col>
        <v-col cols="10" class="pb-0">
            <h2 class="section-title text-center">
                {{ $t('Goals Progress') }}
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
        <v-col cols="12">
            <p class="form-label">{{$t('Here is how you rated your progress towards each goal and the activities that contributed to your progress.')}}</p>
        </v-col>
    </v-row>
    <v-row v-for="(goal, index) in goals" :key="'goal-' + index">
        <v-col cols="12">
            <h4 class="goal-title">{{$t('Goal')}} {{ index + 1 }}</h4>
            <p class="review-section-content pl-3">{{ goal.text }}</p>
            <p class="form-label pl-3">{{$t('Progress Made')}}:</p>
            <p class="review-section-content pl-3">{{ $t(goal.progressMade) }}</p>
            <p class="form-label pl-3">{{$t('Experience Connection')}}:</p>
            <p class="review-section-content pl-3">{{ $t(goal.experienceConnection) }}</p>
        </v-col>
    </v-row>
    
    <!-- Goal Barriers section with responsive edit buttons -->
    <v-row class="d-flex justify-center align-center">
        <v-col sm="1" class="d-none d-sm-flex"></v-col>
        <v-col cols="1" class="d-sm-none"></v-col>
        <v-col cols="10" class="pb-0">
            <h2 class="section-title text-center">
                {{ $t('Goal Barriers') }}
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
        <v-col cols="12">
            <p class="form-label">{{$t('Below are the goals you faced barriers to achieving this semester.')}}</p>
            <v-list v-if="!exitForm.goalIssues.goals[5].checked" density="compact" class="pa-0">
                <v-list-item 
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
            <h3 class="review-section-title">{{ $t('Barriers Description') }}</h3>
            <p class="form-label">{{$t('For one of the goals you selected above, described below are the barriers encountered and the strategies employed to overcome them:')}}</p>
            <p class="review-section-content pl-3">{{ exitForm.goalIssues.issuesDescription || $t('No barriers were described.') }}</p>
        </v-col>
    </v-row>
    
    <!-- Activity Contributions section -->
    <div v-if="activitiesExist">
        <v-row class="d-flex justify-center align-center">
            <v-col sm="1" class="d-none d-sm-flex"></v-col>
            <v-col cols="1" class="d-sm-none"></v-col>
            <v-col cols="10" class="pb-0">
                <h2 class="section-title text-center">
                    {{ $t('Activity Contributions to Goals') }}
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
            <v-col cols="12">
                <p class="form-label">{{$t('Below is a summary of how activities contributed to your goals throughout the semester:')}}</p>
            </v-col>
        </v-row>
        <v-row v-for="(activity, index) in exitForm.experienceActivities" :key="activity.activityID">
            <v-col cols="12">
                <h4 class="goal-title">{{$t('Activity')}} {{ index + 1 }}: {{ activity.activityName }}</h4>
                <div v-if="goalsContributions(activity.activityID).length === 0">
                    <p class="review-section-content pl-3">{{$t('No specific goals contributed.')}}</p>
                </div>
                <div v-else>
                    <p class="form-label pl-3">{{$t('Contributed to Goals')}}:</p>
                    <v-list density="compact" class="pa-0 pl-3">
                        <v-list-item 
                            v-for="(goal, gIndex) in goalsContributions(activity.activityID)" 
                            :key="'goal-' + gIndex"
                        >
                            <v-list-item-title class="text-subtitle-2">
                                {{ goal }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </div>
            </v-col>
        </v-row>
    </div>
</div>

<!-- Growth section with responsive edit buttons -->
<v-row class="d-flex justify-center align-center">
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <v-col cols="10" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Growth') }}
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
        <h3 class="review-section-title">{{ $t('Experience Contributions') }}</h3>
        <p class="form-label">{{$t('How this experience contributed to your graduate/professional goals:')}}</p>
        <p class="review-section-content pl-3" style="white-space: pre-line;">{{ exitForm.experienceContributions }}</p>
    </v-col>
</v-row>

<!-- Data & Society Likelihood Section -->
<div v-if="isDataAndSocietyExperience">
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('Future Plans') }}</h3>
            <p class="form-label">{{$t('Your likelihood of taking the following actions:')}}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t('Enroll in another Data & Society Course') }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.likelihoodOf.enrollAnotherCourseSelected) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t('Complete the Data & Society minor') }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.likelihoodOf.completeMinorSelected) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t('Recommend this course to a friend') }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.likelihoodOf.recommendCourseSelected) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t('Pursue a career in Data Science') }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.likelihoodOf.pursueCareerSelected) || $t('No response provided') }}</p>
        </v-col>
    </v-row>
</div>

<!-- HICH Net Promoter Section -->
<div v-if="isHICHExperience">
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('HICH Recommendations') }}</h3>
            <p class="form-label">{{$t('How likely are you to recommend the following to a friend?')}}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t('HICH') }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.hichNetPromoter.recommendHICH) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t("HICH's socials and workshops") }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.hichNetPromoter.recommendSocialsWorkshops) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t("HICH's volunteer projects") }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.hichNetPromoter.recommendVolunteerProjects) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h4 class="goal-title">{{ $t("HICH's mentorship program") }}</h4>
            <p class="review-section-content pl-3">{{ $t(exitForm.hichNetPromoter.recommendMentorshipProgram) || $t('No response provided') }}</p>
        </v-col>
    </v-row>
</div>

<!-- Growth Assessment Reviews -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Problem Solving') }}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('problem solving')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(exitForm.generalGrowth.problemSolving) || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Effective Communication') }}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('effective communication')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(exitForm.generalGrowth.effectiveCommunication) || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Teamwork') }}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teamwork')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(exitForm.generalGrowth.teamwork) || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Cultural Humility') }}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('cultural humility')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(exitForm.generalGrowth.culturalHumility) || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Ethical Decision Making') }}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('ethical decision making')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(exitForm.generalGrowth.ethicalDecisionMaking) || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Professional Responsibility') }}</h3>
        <p class="form-label">
            {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('professional responsibility')}}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(exitForm.generalGrowth.professionalResponsibility) || $t('No response provided') }}</p>
    </v-col>
</v-row>

<!-- CHW Growth Assessment Section -->
<div v-if="isCHWExperience">
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('Interpersonal Relationship Building') }}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('interpersonal relationship building')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ $t(exitForm.chwGrowth.interpersonalRelationshipBuilding) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('Service Coordination and Navigation') }}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('service coordination and navigation')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ $t(exitForm.chwGrowth.serviceCoordinationNavigation) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('Evaluation and Research') }}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('evaluation and research')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ $t(exitForm.chwGrowth.evaluationResearch) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('Knowledge Base on Health Issues') }}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('knowledge base on health issues')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ $t(exitForm.chwGrowth.knowledgeBaseHealthIssues) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('Teaching and Education') }}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teaching and education')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ $t(exitForm.chwGrowth.teachingEducation) || $t('No response provided') }}</p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('Advocacy') }}</h3>
            <p class="form-label">
                {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('advocacy')}}</u>.
            </p>
            <p class="review-section-content pl-3">{{ $t(exitForm.chwGrowth.advocacy) || $t('No response provided') }}</p>
        </v-col>
    </v-row>
</div>

<!-- Open-Ended Reflections -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Biggest Lessons') }}</h3>
        <p class="form-label">
            {{$t('What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?')}}
        </p>
        <p class="review-section-content pl-3" style="white-space: pre-line;">{{ exitForm.openEnded.biggestLessons || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Supporting Others') }}</h3>
        <p class="form-label">
            {{$t('Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?')}}
        </p>
        <p class="review-section-content pl-3" style="white-space: pre-line;">{{ exitForm.openEnded.supportOthers || $t('No response provided') }}</p>
    </v-col>
</v-row>

<v-row v-if="exitForm.openEnded.comments && exitForm.openEnded.comments.length">
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Additional Comments') }}</h3>
        <p class="form-label">
            {{$t('Use this space to provide any other comments or recommendations you would like to share.')}}
        </p>
        <p class="review-section-content pl-3" style="white-space: pre-line;">{{ exitForm.openEnded.comments || $t('No response provided') }}</p>
    </v-col>
</v-row>

</v-container>
</v-form>
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
        
        // Display experience text from selected or incomplete form (without instructor - shown separately)
        displayExperienceText() {
            // First try from selectedExperience prop
            if (this.selectedExperience) {
                // Build base text without instructor (instructor shown separately)
                const category = this.getExperienceCategory();
                const name = this.getExperienceName();
                if (category && name) {
                    return `${category}: ${name}`;
                }
                // Fallback: if text already includes instructor in parentheses, strip it
                if (this.selectedExperience.text) {
                    return this.selectedExperience.text.split(' (')[0];
                }
            }
            
            // Fallback to incomplete form data
            if (this.expRegistrationIDFromIncompleteBackup) {
                const matchingExperience = this.exitForm.experiences.find(
                    experience => experience.expRegistrationID === this.expRegistrationIDFromIncompleteBackup
                );
                if (matchingExperience) {
                    return `${matchingExperience.experienceCategory}: ${matchingExperience.experienceName}`;
                }
            }
            
            return '';
        },
        
        // Display instructor if present
        displayInstructor() {
            // First try from selectedExperience prop
            if (this.selectedExperience && this.selectedExperience.instructor) {
                return this.selectedExperience.instructor;
            }
            
            // Try from exitForm directly (set during checkExistingForm)
            if (this.exitForm.instructor) {
                return this.exitForm.instructor;
            }
            
            // Fallback to incomplete form data
            if (this.expRegistrationIDFromIncompleteBackup) {
                const matchingExperience = this.exitForm.experiences.find(
                    experience => experience.expRegistrationID === this.expRegistrationIDFromIncompleteBackup
                );
                if (matchingExperience && matchingExperience.instructor) {
                    return matchingExperience.instructor;
                }
            }
            
            return null;
        },
        
        // Check if this is a Data & Society experience
        isDataAndSocietyExperience() {
            // First check if there's actual likelihood data filled out
            const hasLikelihoodData = this.exitForm.likelihoodOf && (
                (this.exitForm.likelihoodOf.enrollAnotherCourseSelected && 
                 this.exitForm.likelihoodOf.enrollAnotherCourseSelected !== "") ||
                (this.exitForm.likelihoodOf.completeMinorSelected && 
                 this.exitForm.likelihoodOf.completeMinorSelected !== "") ||
                (this.exitForm.likelihoodOf.recommendCourseSelected && 
                 this.exitForm.likelihoodOf.recommendCourseSelected !== "") ||
                (this.exitForm.likelihoodOf.pursueCareerSelected && 
                 this.exitForm.likelihoodOf.pursueCareerSelected !== "")
            );
            
            if (hasLikelihoodData) {
                return true;
            }
            
            // Then check experience name as fallback using same patterns as exitFormExp.vue
            const textPatterns = [
                "Data & Society", "Data And Society", "Data and Society", 
                "Minor Data & Society", "Minor Data And Society", "Minor Data and Society"
            ];
            
            // Check selectedExperience.text
            if (this.selectedExperience?.text) {
                const baseText = this.selectedExperience.text.split(' (')[0];
                if (textPatterns.some(pattern => baseText.includes(pattern))) {
                    return true;
                }
            }
            
            // Check from experiences list using expRegistrationIDFromIncompleteBackup
            if (this.expRegistrationIDFromIncompleteBackup) {
                const matchingExperience = this.exitForm.experiences.find(
                    experience => experience.expRegistrationID === this.expRegistrationIDFromIncompleteBackup
                );
                if (matchingExperience) {
                    const expText = `${matchingExperience.experienceCategory}: ${matchingExperience.experienceName}`;
                    if (textPatterns.some(pattern => expText.includes(pattern))) {
                        return true;
                    }
                }
            }
            
            return false;
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
        
        // Check if this is a HICH experience
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
        
        // Helper to get experience category from various sources
        getExperienceCategory() {
            if (this.selectedExperience) {
                // Check if we have the raw category/name fields
                const expRegistrationID = this.selectedExperience.expRegistrationID;
                if (expRegistrationID && this.exitForm.experiences) {
                    const exp = this.exitForm.experiences.find(e => e.expRegistrationID === expRegistrationID);
                    if (exp) return exp.experienceCategory;
                }
            }
            return null;
        },
        
        // Helper to get experience name from various sources
        getExperienceName() {
            if (this.selectedExperience) {
                const expRegistrationID = this.selectedExperience.expRegistrationID;
                if (expRegistrationID && this.exitForm.experiences) {
                    const exp = this.exitForm.experiences.find(e => e.expRegistrationID === expRegistrationID);
                    if (exp) return exp.experienceName;
                }
            }
            return null;
        }
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