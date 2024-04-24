<!-- studentGoalFormViewer - this view presents Goal Setting Form data for a single student -->
<template>
<div v-if="goalForm">
<v-form disabled>
<v-container>
<v-row>
    <v-col>
        <v-btn @click="$router.back()">Back</v-btn>
    </v-col>
</v-row>
<!-- Section: Selected Experience -->
<v-row>
    <v-col>
        <p 
            class="font-weight-black text-h6"
        >{{ firstName }} {{ lastName }} - Goal Form</p>
    </v-col>
</v-row>
<v-row><v-col></v-col></v-row>
<div class="review-section">
<v-row>
    <v-col cols="10">
        <p class="review-section-content pl-3 font-weight-bold">
            {{ experienceCategory }} - {{ experienceName }}
        </p>
    </v-col>
</v-row>
</div>
<!-- Section: HichProject Items -->
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

<!-- Background Title -->
<v-row class="d-flex justify-center align-center">
    <!-- Empty Column for Space -->
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <!-- Title Column -->
    <v-col cols="12" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Background') }}
        </h2>
    </v-col>
</v-row>


<!-- Section: Community Engagement Experiences -->
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

<!-- Section: Previous Community Engagement Experiences -->
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

<!-- Section: Engagement Activities Tools -->
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

<!-- Section: Current Research Experience -->
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

<!-- Section: Previous Research Experience -->
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

<!-- Section: Familiar Tools -->
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

<!-- Section: Research/Service Interests -->
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

<!-- Section: Leadership Position Interest -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Leadership Position Interest') }}</h3>
        <p class="form-label">{{ $t('Are you interested in potentially holding a leadership position?') }}</p>
        <p class="review-section-content">{{ $t(goalForm.researchExperience.leadershipOption) }}</p>
    </v-col>
</v-row>

<!-- Growth Title -->
<v-row class="d-flex justify-center align-center">
    <!-- Empty Column for Space -->
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <!-- Title Column -->
    <v-col cols="12" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Growth Goals') }}
        </h2>
    </v-col>
</v-row>

<!-- Problem Solving Goal -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Problem Solving Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('problem solving') }}</u>.
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.problemSolvingGoal) }}</p>
    </v-col>
</v-row>

<!-- Effective Communication Goal -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Effective Communication Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('effective communication.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.effectiveCommunicationGoal) }}</p>
    </v-col>
</v-row>

<!-- Teamwork Goal -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Teamwork Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('teamwork.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.teamworkGoal) }}</p>
    </v-col>
</v-row>

<!-- Cultural Humility Goal -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Cultural Humility Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('cultural humility.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.culturalHumilityGoal) }}</p>
    </v-col>
</v-row>


<!-- Ethical Decision Making Goal -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Ethical Decision Making Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('ethical decision making.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.ethicalDecisionMakingGoal) }}</p>
    </v-col>
</v-row>

<!-- Professional Responsibility Goal -->
<v-row>
    <v-col cols="12">
        <h3 class="review-section-title">{{ $t('Professional Responsibility Goal') }}</h3>
        <p class="form-label">
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('professional responsibility.') }}</u>
        </p>
        <p class="review-section-content pl-3">{{ $t(goalForm.growthGoal.professionalResponsibilityGoal) }}</p>
    </v-col>
</v-row>


<!-- Aspirations Title -->
<v-row class="d-flex justify-center align-center">
    <!-- Empty Column for Space -->
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <!-- Title Column -->
    <v-col cols="12" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Aspirations') }}
        </h2>
    </v-col>
</v-row>


<!-- Aspirations Section -->
<v-row>
    <v-col cols="12">
        <p class="form-label">
            {{$t('Please describe 2-3 long-term aspirations you may have.')}}
            <br><br>
            {{$t('Aspirations are statements that describe where you want to end up without necessarily describing exactly how you will get there.')}}
        </p>
        
        <!-- Aspiration 1 -->
        <h4 class="aspiration-title">{{ $t('Aspiration 1') }}</h4>
        <p class="review-section-content pl-3">{{ $t(goalForm.aspirations.aspirationOne) }}</p>

        <!-- Aspiration 2 -->
        <h4 v-if="goalForm.aspirations.aspirationTwo" class="aspiration-title">{{ $t('Aspiration 2') }}</h4>
        <p v-if="goalForm.aspirations.aspirationTwo" class="review-section-content pl-3">{{ $t(goalForm.aspirations.aspirationTwo) }}</p>

        <!-- Aspiration 3 -->
        <h4 v-if="goalForm.aspirations.aspirationThree" class="aspiration-title">{{ $t('Aspiration 3') }}</h4>
        <p v-if="goalForm.aspirations.aspirationThree" class="review-section-content pl-3">{{ $t(goalForm.aspirations.aspirationThree) }}</p>
    </v-col>
</v-row>

<!-- Goals Title -->
<v-row class="d-flex justify-center align-center">
    <!-- Empty Column for Space -->
    <v-col sm="1" class="d-none d-sm-flex"></v-col>
    <v-col cols="1" class="d-sm-none"></v-col>
    <!-- Title Column -->
    <v-col cols="12" class="pb-0">
        <h2 class="section-title text-center">
            {{ $t('Goals') }}
        </h2>
    </v-col>
</v-row>

<!-- Goals Section -->
<v-row>
    <v-col cols="12">
        <p class="form-label">
            {{$t('Please outline 3-5 goals that you have for this experience.')}}
            <br><br>
            {{$t('Goals are statements that describe what it means for an experience to be a success from your perspective,')}}
        </p>
        
        <!-- Goal 1 -->
        <h4 v-if="goalForm.goals.goalOne" class="goal-title">{{ $t('Goal 1') }}</h4>
        <p v-if="goalForm.goals.goalOne" class="review-section-content pl-3">{{ $t(goalForm.goals.goalOne) }}</p>

        <!-- Goal 2 -->
        <h4 v-if="goalForm.goals.goalTwo" class="goal-title">{{ $t('Goal 2') }}</h4>
        <p v-if="goalForm.goals.goalTwo" class="review-section-content pl-3">{{ $t(goalForm.goals.goalTwo) }}</p>

        <!-- Goal 3 -->
        <h4 v-if="goalForm.goals.goalThree" class="goal-title">{{ $t('Goal 3') }}</h4>
        <p v-if="goalForm.goals.goalThree" class="review-section-content pl-3">{{ $t(goalForm.goals.goalThree) }}</p>

        <!-- Goal 4 -->
        <h4 v-if="goalForm.goals.goalFour" class="goal-title">{{ $t('Goal 4') }}</h4>
        <p v-if="goalForm.goals.goalFour" class="review-section-content pl-3">{{ $t(goalForm.goals.goalFour) }}</p>

        <!-- Goal 5 -->
        <h4 v-if="goalForm.goals.goalFive" class="goal-title">{{ $t('Goal 5') }}</h4>
        <p v-if="goalForm.goals.goalFive" class="review-section-content pl-3">{{ $t(goalForm.goals.goalFive) }}</p>
    </v-col>
</v-row>
</v-container>
</v-form>
</div>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
    name: "studentGoalFormViewer",
    data() {
        return {
            firstName: "",
            lastName: "",
            experienceName: "",
            experienceCategory: "",
            goalForm: {},
        }
    },
    async created() {
        await this.fetchGoalForm(this.$route.params.studentID, this.$route.params.expInstanceID);
    },
    computed: {
        processedCommunityEngagementExperiences() {
            const noneSelected = this.goalForm.communityEngagement.communityEngagementExperiences.some(experience => experience.id === 7 && experience.checked);
            return this.goalForm.communityEngagement.communityEngagementExperiences
                .filter(experience => experience.id !== 7) // Exclude "None of the above"
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.id !== 6 || experience.checked);
        },
        displayOtherExperience() {
            return this.goalForm.communityEngagement.communityEngagementExperiences.find(experience => experience.id === 6)?.checked;
        },
        processedPreviousEngagementExperiences() {
            const noneSelected = this.goalForm.communityEngagement.previousEngagementExperiences.some(experience => experience.id === 9 && experience.checked);
            return this.goalForm.communityEngagement.previousEngagementExperiences
                .filter(experience => experience.id !== 9) // Exclude "None of the above"
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.id !== 8 || experience.checked);
        },
        displayPreviousOtherExperience() {
            return this.goalForm.communityEngagement.previousEngagementExperiences.find(experience => experience.id === 8)?.checked;
        },
        processedEngagementActivitiesTools() {
            const noneSelected = this.goalForm.communityEngagement.engagementActivitiesTools.some(tool => tool.id === 9 && tool.checked);
            return this.goalForm.communityEngagement.engagementActivitiesTools
                .filter(tool => tool.id !== 9) // Exclude "None of the above"
                .map(tool => ({
                    ...tool,
                    checked: noneSelected ? 'No' : (tool.checked ? 'Yes' : 'No')
                }))
                .filter(tool => tool.id !== 8 || tool.checked);
        },
        displayEngagementActivitiesToolOther() {
            return this.goalForm.communityEngagement.engagementActivitiesTools.find(tool => tool.id === 8)?.checked;
        },
        processedCurrentResearchExperience() {
            const noneSelected = this.goalForm.researchExperience.currentResearchExperience.some(experience => experience.id === 8 && experience.checked);
            return this.goalForm.researchExperience.currentResearchExperience
                .filter(experience => experience.id !== 8) // Exclude "None of the above"
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.id !== 7 || experience.checked);
        },
        displayCurrentResearchExperienceOther() {
            return this.goalForm.researchExperience.currentResearchExperience.find(experience => experience.id === 7)?.checked;
        },
        processedPreviousResearchExperience() {
            const noneSelected = this.goalForm.researchExperience.previousResearchExperience.some(experience => experience.id === 9 && experience.checked);
            return this.goalForm.researchExperience.previousResearchExperience
                .filter(experience => experience.id !== 9) // Exclude "None of the above"
                .map(experience => ({
                    ...experience,
                    checked: noneSelected ? 'No' : (experience.checked ? 'Yes' : 'No')
                }))
                .filter(experience => experience.id !== 8 || experience.checked);
        },
        displayPreviousResearchExperienceOther() {
            return this.goalForm.researchExperience.previousResearchExperience.find(experience => experience.id === 8)?.checked;
        },
        processedFamiliarTools() {
            const noneSelected = this.goalForm.researchExperience.familiarTools.some(tool => tool.id === 11 && tool.checked);
            return this.goalForm.researchExperience.familiarTools
                .filter(tool => tool.id !== 11) // Exclude "None of the above"
                .map(tool => ({
                    ...tool,
                    checked: noneSelected ? 'No' : (tool.checked ? 'Yes' : 'No')
                }))
                .filter(tool => tool.id !== 10 || tool.checked);
        },
        displayFamiliarToolOther() {
            return this.goalForm.researchExperience.familiarTools.find(tool => tool.id === 10)?.checked;
        },
        processedInterestResearchService() {
            const noneSelected = this.goalForm.researchExperience.interestResearchService.some(interest => interest.id === 9 && interest.checked);
            return this.goalForm.researchExperience.interestResearchService
                .filter(interest => interest.id !== 9) // Exclude "None of the above"
                .map(interest => ({
                    ...interest,
                    checked: noneSelected ? 'No' : (interest.checked ? 'Yes' : 'No')
                }))
                .filter(interest => interest.id !== 8 || interest.checked);
        },
        displayInterestResearchServiceOther() {
            return this.goalForm.researchExperience.interestResearchService.find(interest => interest.id === 8)?.checked;
        },
    },
    methods: {

        // Fetches the goal form for a specific student and experience instance. It sends a GET request to the backend API with the student's ID and experience instance ID as parameters. Upon receiving the response, it extracts the relevant data and stores them in the component's state.
        async fetchGoalForm(studentID, expInstanceID) {
            const user = useLoggedInUserStore();
            const token = user.token;
            const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/goal-form`;

            try {
                const response = await axios.get(url, {
                    headers: { token },
                    params: { userID: studentID, expInstanceID }
                });
                this.firstName = response.data.firstName;
                this.lastName = response.data.lastName;
                this.experienceName = response.data.experienceName;
                this.experienceCategory = response.data.experienceCategory;
                this.goalForm = response.data.goalForm;

            } catch (error) {
                this.handleError(error);
            }
        }
    }
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
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.review-section {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.review-section-content {
    font-size: 1rem;
    margin-bottom: 10px;
}

.review-section-content, .form-label {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.form-label {
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 0.75rem;
  color: grey;
}

.v-list-item {
    min-width: 0; /* Override minimum width */
}

.v-list-item-title {
    white-space: normal; /* Allow text to wrap */
}

.section-title {
    font-size: 1.25rem; /* Adjusted for larger section titles */
    font-weight: bold;
    margin-bottom: 10px;
}

.aspiration-title {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
}

.goal-title {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
}


</style>