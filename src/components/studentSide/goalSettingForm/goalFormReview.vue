<!--
goalFormReview.vue
Final review component for the goal setting form that displays all entered information
in a read-only format with edit buttons to navigate back to specific sections.
Shows selected experience, HICH projects, background data, growth goals, aspirations,
and goals with responsive layout for mobile and desktop views.
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
            {{ selectedExperience?.text }}
        </p>
    </v-col>
</v-row>
</div>

<!-- HICH Projects section (conditional display) -->
<div v-if="hichProject && hichProject.length > 0">
    <v-row>
        <v-col cols="12">
            <h3 class="review-section-title">{{ $t('HICH Projects') }}</h3>
            <v-list density="compact" class="pa-0">
                <v-list-item v-for="item in hichProject" :key="item">
                <v-list-item-title class="text-subtitle-2">
                    {{ item }}
                </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-col>
    </v-row>
</div>

<!-- Background section (conditional display based on edit state) -->
<div v-if="isBackgroundEditActive || !hasCompletedGoalForm">
<!-- Background title with responsive edit buttons -->
<v-row class="d-flex justify-center align-center">
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <v-col cols="10" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Background') }}
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

<!-- Community engagement experiences review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title mb-1">{{ $t('Community Engagement Experiences') }}</h3>
        <p class="form-label">{{ $t('What kind of community engagement experiences, if any, have you had? Check all that apply.') }}</p>
        <v-list density="compact" class="pa-0">
            <v-list-item v-for="experience in processedCommunityEngagementExperiences" :key="experience.id">
                <v-list-item-title class="text-subtitle-2">
                    {{ $t(experience.label) }}: <strong>{{ experience.checked }}</strong>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="displayOtherExperience" class="text-subtitle-2">
                {{ $t('Other:') }} {{ goalForm.communityEngagement.communityEngagementExperiencesOther }}
            </v-list-item>
        </v-list>
    </v-col>
</v-row>

<!-- Previous community engagement experiences review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title mb-1">{{ $t('Previous Community Engagement Experiences') }}</h3>
        <p class="form-label">{{ $t('From your previous community engagement experiences, which of the following activities have you engaged in?') }}</p>
        <v-list density="compact" class="pa-0">
            <v-list-item v-for="previousExperience in processedPreviousEngagementExperiences" :key="previousExperience.id">
                <v-list-item-title class="text-subtitle-2">
                    {{ $t(previousExperience.label) }}: <strong>{{ previousExperience.checked }}</strong>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="displayPreviousOtherExperience" class="text-subtitle-2">
                {{ $t('Other:') }} {{ goalForm.communityEngagement.previousEngagementExperiencesOther }}
            </v-list-item>
        </v-list>
    </v-col>
</v-row>

<!-- Engagement activities tools review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title mb-1">{{ $t('Engagement Activities Tools') }}</h3>
        <p class="form-label">{{ $t('What, if any, tools have you used for community engagement activities?') }}</p>
        <v-list density="compact" class="pa-0">
            <v-list-item v-for="activitiesTool in processedEngagementActivitiesTools" :key="activitiesTool.id">
                <v-list-item-title class="text-subtitle-2">
                    {{ $t(activitiesTool.label) }}: <strong>{{ activitiesTool.checked }}</strong>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="displayEngagementActivitiesToolOther" class="text-subtitle-2">
                {{ $t('Other:') }} {{ goalForm.communityEngagement.engagementActivitiesToolOther }}
            </v-list-item>
        </v-list>
    </v-col>
</v-row>

<!-- Current research experience review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title mb-1">{{ $t('Current Research Experience') }}</h3>
        <p class="form-label">{{ $t('What kind of research experiences, if any, have you had? Check all that apply.') }}</p>
        <v-list density="compact" class="pa-0">
            <v-list-item v-for="currentExperience in processedCurrentResearchExperience" :key="currentExperience.id">
                <v-list-item-title class="text-subtitle-2">
                    {{ $t(currentExperience.label) }}: <strong>{{ currentExperience.checked }}</strong>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="displayCurrentResearchExperienceOther" class="text-subtitle-2">
                {{ $t('Other:') }} {{ goalForm.researchExperience.currentResearchExperienceOther }}
            </v-list-item>
        </v-list>
    </v-col>
</v-row>

<!-- Previous research experience review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title mb-1">{{ $t('Previous Research Experience') }}</h3>
        <p class="form-label">{{ $t('From your previous research experiences, which of the following activities have you engaged in?') }}</p>
        <v-list density="compact" class="pa-0">
            <v-list-item v-for="previousExperience in processedPreviousResearchExperience" :key="previousExperience.id">
                <v-list-item-title class="text-subtitle-2">
                    {{ $t(previousExperience.label) }}: <strong>{{ previousExperience.checked }}</strong>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="displayPreviousResearchExperienceOther" class="text-subtitle-2">
                {{ $t('Other:') }} {{ goalForm.researchExperience.previousResearchExperienceOther }}
            </v-list-item>
        </v-list>
    </v-col>
</v-row>

<!-- Familiar tools review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title mb-1">{{ $t('Familiar Tools') }}</h3>
        <p class="form-label">{{ $t('What, if any, tools are you familiar with?') }}</p>
        <v-list density="compact" class="pa-0">
            <v-list-item v-for="familiarTool in processedFamiliarTools" :key="familiarTool.id">
                <v-list-item-title class="text-subtitle-2">
                    {{ $t(familiarTool.label) }}: <strong>{{ familiarTool.checked }}</strong>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="displayFamiliarToolOther" class="text-subtitle-2">
                {{ $t('Other:') }} {{ goalForm.researchExperience.familiarToolOther }}
            </v-list-item>
        </v-list>
    </v-col>
</v-row>

<!-- Research/service interests review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Research/Service Interests') }}</h3>
        <p class="form-label">{{ $t('What are your research/service interests? Check all that apply.') }}</p>
        <v-list density="compact" class="pa-0">
            <v-list-item v-for="interest in processedInterestResearchService" :key="interest.id">
                <v-list-item-title class="text-subtitle-2">
                    {{ $t(interest.label) }}: <strong>{{ interest.checked }}</strong>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="displayInterestResearchServiceOther" class="text-subtitle-2">
                {{ $t('Other:') }} {{ goalForm.researchExperience.interestResearchServiceOther }}
            </v-list-item>
        </v-list>
    </v-col>
</v-row>

<!-- Leadership position interest review -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Leadership Position Interest') }}</h3>
        <p class="form-label">{{ $t('Are you interested in potentially holding a leadership position?') }}</p>
        <p class="review-section-content">{{ $t(goalForm.researchExperience.leadershipOption) }}</p>
    </v-col>
</v-row>
</div>

<!-- Growth goals section with responsive edit buttons -->
<v-row class="d-flex justify-center align-center">
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <v-col cols="10" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Growth Goals') }}
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

<!-- Individual growth goal reviews -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Problem Solving Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('problem solving') }}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.problemSolvingGoal) }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Effective Communication Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('effective communication.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.effectiveCommunicationGoal) }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Teamwork Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('teamwork.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.teamworkGoal) }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Cultural Humility Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('cultural humility.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.culturalHumilityGoal) }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Ethical Decision Making Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('ethical decision making.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.ethicalDecisionMakingGoal) }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Professional Responsibility Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('professional responsibility.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.professionalResponsibilityGoal) }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Social Responsibility Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('social responsibility.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.socialResponsibilityGoal) }}</p>
    </v-col>
</v-row>

<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Digital Literacy Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('digital literacy.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.digitalLiteracyGoal) }}</p>
    </v-col>
</v-row>

<!-- Aspirations section with responsive edit buttons -->
<v-row class="d-flex justify-center align-center">
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <v-col cols="10" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Aspirations') }}
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

<!-- Aspirations content display -->
<v-row>
    <v-col cols="12">
        <p class="form-label">
            {{$t('Please describe 2-3 long-term aspirations you may have.')}}
            <br><br>
            {{$t('Aspirations are statements that describe where you want to end up without necessarily describing exactly how you will get there.')}}
        </p>
        
        <!-- Individual aspirations with conditional display -->
        <h4 class="aspiration-title">{{ $t('Aspiration 1') }}</h4>
        <p class="review-section-content pl-3">{{ $t(goalForm.aspirations.aspirationOne) }}</p>

        <h4 v-if="goalForm.aspirations.aspirationTwo" class="aspiration-title">{{ $t('Aspiration 2') }}</h4>
        <p v-if="goalForm.aspirations.aspirationTwo" class="review-section-content pl-3">{{ $t(goalForm.aspirations.aspirationTwo) }}</p>

        <h4 v-if="goalForm.aspirations.aspirationThree" class="aspiration-title">{{ $t('Aspiration 3') }}</h4>
        <p v-if="goalForm.aspirations.aspirationThree" class="review-section-content pl-3">{{ $t(goalForm.aspirations.aspirationThree) }}</p>
    </v-col>
</v-row>

<!-- Goals section with responsive edit buttons -->
<v-row class="d-flex justify-center align-center">
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <v-col cols="10" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Goals') }}
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

<!-- Goals content display -->
<v-row>
    <v-col cols="12">
        <p class="form-label">
            {{$t('Please outline 3-5 goals that you have for this experience.')}}
            <br><br>
            {{$t('Goals are statements that describe what it means for an experience to be a success from your perspective,')}}
        </p>
        
        <!-- Individual goals with conditional display -->
        <h4 v-if="goalForm.goals.goalOne" class="goal-title">{{ $t('Goal 1') }}</h4>
        <p v-if="goalForm.goals.goalOne" class="review-section-content pl-3">{{ $t(goalForm.goals.goalOne) }}</p>

        <h4 v-if="goalForm.goals.goalTwo" class="goal-title">{{ $t('Goal 2') }}</h4>
        <p v-if="goalForm.goals.goalTwo" class="review-section-content pl-3">{{ $t(goalForm.goals.goalTwo) }}</p>

        <h4 v-if="goalForm.goals.goalThree" class="goal-title">{{ $t('Goal 3') }}</h4>
        <p v-if="goalForm.goals.goalThree" class="review-section-content pl-3">{{ $t(goalForm.goals.goalThree) }}</p>

        <h4 v-if="goalForm.goals.goalFour" class="goal-title">{{ $t('Goal 4') }}</h4>
        <p v-if="goalForm.goals.goalFour" class="review-section-content pl-3">{{ $t(goalForm.goals.goalFour) }}</p>

        <h4 v-if="goalForm.goals.goalFive" class="goal-title">{{ $t('Goal 5') }}</h4>
        <p v-if="goalForm.goals.goalFive" class="review-section-content pl-3">{{ $t(goalForm.goals.goalFive) }}</p>
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
        goalForm: Object,
        hasCompletedGoalForm: Boolean,
        isBackgroundEditActive: Boolean,
        hichProject: Array
    },
    emits: ["change-step"],
    computed: {
        // Data processing computed properties for background review display
        processedCommunityEngagementExperiences() {
            const noneSelected = this.goalForm.communityEngagement.communityEngagementExperiences.some(experience => experience.label === 'None of the above' && experience.checked);
            return this.goalForm.communityEngagement.communityEngagementExperiences
                .filter(experience => experience.label !== 'None of the above')
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.label !== 'Other' || experience.checked);
        },
        displayOtherExperience() {
            return this.goalForm.communityEngagement.communityEngagementExperiences.find(experience => experience.label === 'Other')?.checked;
        },
        processedPreviousEngagementExperiences() {
            const noneSelected = this.goalForm.communityEngagement.previousEngagementExperiences.some(experience => experience.label === 'None of the above' && experience.checked);
            return this.goalForm.communityEngagement.previousEngagementExperiences
                .filter(experience => experience.label !== 'None of the above')
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.label !== 'Other' || experience.checked);
        },
        displayPreviousOtherExperience() {
            return this.goalForm.communityEngagement.previousEngagementExperiences.find(experience => experience.label === 'Other')?.checked;
        },
        processedEngagementActivitiesTools() {
            const noneSelected = this.goalForm.communityEngagement.engagementActivitiesTools.some(tool => tool.label === 'None of the above' && tool.checked);
            return this.goalForm.communityEngagement.engagementActivitiesTools
                .filter(tool => tool.label !== 'None of the above')
                .map(tool => ({
                    ...tool,
                    checked: noneSelected ? 'No' : (tool.checked ? 'Yes' : 'No')
                }))
                .filter(tool => tool.label !== 'Other' || tool.checked);
        },
        displayEngagementActivitiesToolOther() {
            return this.goalForm.communityEngagement.engagementActivitiesTools.find(tool => tool.label === 'Other')?.checked;
        },
        processedCurrentResearchExperience() {
            const noneSelected = this.goalForm.researchExperience.currentResearchExperience.some(experience => experience.label === 'None of the above' && experience.checked);
            return this.goalForm.researchExperience.currentResearchExperience
                .filter(experience => experience.label !== 'None of the above')
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.label !== 'Other' || experience.checked);
        },
        displayCurrentResearchExperienceOther() {
            return this.goalForm.researchExperience.currentResearchExperience.find(experience => experience.label === 'Other')?.checked;
        },
        processedPreviousResearchExperience() {
            const noneSelected = this.goalForm.researchExperience.previousResearchExperience.some(experience => experience.label === 'None of the above' && experience.checked);
            return this.goalForm.researchExperience.previousResearchExperience
                .filter(experience => experience.label !== 'None of the above')
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.label !== 'Other' || experience.checked);
        },
        displayPreviousResearchExperienceOther() {
            return this.goalForm.researchExperience.previousResearchExperience.find(experience => experience.label === 'Other')?.checked;
        },
        processedFamiliarTools() {
            const noneSelected = this.goalForm.researchExperience.familiarTools.some(tool => tool.label === 'None of the above' && tool.checked);
            return this.goalForm.researchExperience.familiarTools
                .filter(tool => tool.label !== 'None of the above')
                .map(tool => ({
                    ...tool,
                    checked: noneSelected ? 'No' : (tool.checked ? 'Yes' : 'No')
                }))
                .filter(tool => tool.label !== 'Other' || tool.checked);
        },
        displayFamiliarToolOther() {
            return this.goalForm.researchExperience.familiarTools.find(tool => tool.label === 'Other')?.checked;
        },
        processedInterestResearchService() {
            const noneSelected = this.goalForm.researchExperience.interestResearchService.some(interest => interest.label === 'None of the above' && interest.checked);
            return this.goalForm.researchExperience.interestResearchService
                .filter(interest => interest.label !== 'None of the above')
                .map(interest => ({
                    ...interest,
                    checked: noneSelected ? 'No' : (interest.checked ? 'Yes' : 'No')
                }))
                .filter(interest => interest.label !== 'Other' || interest.checked);
        },
        displayInterestResearchServiceOther() {
            return this.goalForm.researchExperience.interestResearchService.find(interest => interest.label === 'Other')?.checked;
        },
    },
    methods: {
        // Emit step change event to parent for navigation
        emitStepChange(stepNumber) {
            this.$emit('change-step', stepNumber);
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