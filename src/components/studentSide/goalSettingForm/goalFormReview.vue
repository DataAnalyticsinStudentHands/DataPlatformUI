<template>
<v-form disabled>
<v-container>
<!-- Section: Selected Experience -->
<v-row>
    <v-col cols="12">
    <div class="review-section">
        <h3 class="review-section-title">{{ $t('Selected Experience') }}</h3>
        <p class="review-section-content">{{ selectedExperience?.text }}</p>
    </div>
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


</v-container>
</v-form>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<p>Selected Experience: {{ selectedExperience }}</p>
</template>


<script>
export default {
    name: "GoalFormReview",
    props: {
        selectedExperience: Object,
        goalForm: Object
    },
    emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
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
  font-size: 1.2rem;
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
</style>