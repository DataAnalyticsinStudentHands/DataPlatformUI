<!-- 
studentGoalFormViewer.vue
Instructor-side view for displaying a single student's Goal Setting Form data.
Redesigned UI matching the project pages aesthetic with sectioned card layout.
-->

<template>
  <main class="goal-form-viewer-page">
    <v-container class="py-8">
      <!-- Loading State -->
      <v-row v-if="loading" justify="center" class="py-16">
        <v-col cols="12" class="text-center">
          <v-progress-circular 
            indeterminate 
            color="#c8102e" 
            size="48"
            width="4"
          ></v-progress-circular>
          <p class="text-body-2 text-medium-emphasis mt-4">{{ $t('Loading goal form...') }}</p>
        </v-col>
      </v-row>

      <template v-else-if="goalForm">
        <!-- Page Header -->
        <div class="page-header mb-6">
          <div class="d-flex align-center mb-2">
            <v-btn 
              icon 
              variant="text" 
              size="small" 
              @click="$router.back()"
              class="mr-2"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-icon color="#c8102e" size="32" class="mr-3">mdi-target</v-icon>
            <div class="flex-grow-1">
              <div class="d-flex align-center flex-wrap">
                <h1 class="text-h5 font-weight-bold mr-3">{{ firstName }} {{ lastName }}</h1>
                <v-chip color="#c8102e" size="small" variant="tonal">
                  <v-icon start size="14">mdi-file-document-check</v-icon>
                  {{ $t('Goal Form') }}
                </v-chip>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ experienceCategory }} - {{ experienceName }}</p>
            </div>
          </div>
        </div>

        <v-row>
          <!-- Main Content Column -->
          <v-col cols="12" lg="8">
            <v-card class="form-card" elevation="2">
              
              <!-- HICH Projects Section (if applicable) -->
              <div v-if="hichProject && hichProject.length > 0" class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <v-icon color="white" size="18">mdi-briefcase-outline</v-icon>
                  </div>
                  <div>
                    <h2 class="section-title">{{ $t('HICH Projects') }}</h2>
                    <p class="section-subtitle">{{ $t('Associated project selections') }}</p>
                  </div>
                </div>
                <div class="section-content">
                  <v-chip
                    v-for="item in hichProject"
                    :key="item"
                    color="#c8102e"
                    variant="tonal"
                    class="mr-2 mb-2"
                  >
                    {{ item }}
                  </v-chip>
                </div>
              </div>

              <v-divider v-if="hichProject && hichProject.length > 0"></v-divider>

              <!-- Background Section -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <v-icon color="white" size="18">mdi-account-details</v-icon>
                  </div>
                  <div>
                    <h2 class="section-title">{{ $t('Background') }}</h2>
                    <p class="section-subtitle">{{ $t('Previous experiences and skills') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <!-- Community Engagement Experiences -->
                  <div class="form-subsection">
                    <h4 class="subsection-title">{{ $t('Community Engagement Experiences') }}</h4>
                    <p class="subsection-question">{{ $t('What kind of community engagement experiences, if any, have you had?') }}</p>
                    <div class="response-chips">
                      <v-chip
                        v-for="exp in processedCommunityEngagementExperiences"
                        :key="exp.id"
                        :color="exp.checked === 'Yes' ? 'success' : 'grey'"
                        :variant="exp.checked === 'Yes' ? 'flat' : 'outlined'"
                        size="small"
                        class="mr-2 mb-2"
                      >
                        <v-icon start size="14">{{ exp.checked === 'Yes' ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        {{ $t(exp.label) }}
                      </v-chip>
                    </div>
                    <p v-if="displayOtherExperience" class="other-response">
                      <strong>{{ $t('Other:') }}</strong> {{ goalForm.communityEngagement.communityEngagementExperiencesOther }}
                    </p>
                  </div>

                  <!-- Previous Engagement Experiences -->
                  <div class="form-subsection">
                    <h4 class="subsection-title">{{ $t('Previous Engagement Activities') }}</h4>
                    <p class="subsection-question">{{ $t('From your previous community engagement experiences, which activities have you engaged in?') }}</p>
                    <div class="response-chips">
                      <v-chip
                        v-for="exp in processedPreviousEngagementExperiences"
                        :key="exp.id"
                        :color="exp.checked === 'Yes' ? 'success' : 'grey'"
                        :variant="exp.checked === 'Yes' ? 'flat' : 'outlined'"
                        size="small"
                        class="mr-2 mb-2"
                      >
                        <v-icon start size="14">{{ exp.checked === 'Yes' ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        {{ $t(exp.label) }}
                      </v-chip>
                    </div>
                    <p v-if="displayPreviousOtherExperience" class="other-response">
                      <strong>{{ $t('Other:') }}</strong> {{ goalForm.communityEngagement.previousEngagementExperiencesOther }}
                    </p>
                  </div>

                  <!-- Engagement Tools -->
                  <div class="form-subsection">
                    <h4 class="subsection-title">{{ $t('Engagement Tools') }}</h4>
                    <p class="subsection-question">{{ $t('What tools have you used for community engagement activities?') }}</p>
                    <div class="response-chips">
                      <v-chip
                        v-for="tool in processedEngagementActivitiesTools"
                        :key="tool.id"
                        :color="tool.checked === 'Yes' ? 'success' : 'grey'"
                        :variant="tool.checked === 'Yes' ? 'flat' : 'outlined'"
                        size="small"
                        class="mr-2 mb-2"
                      >
                        <v-icon start size="14">{{ tool.checked === 'Yes' ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        {{ $t(tool.label) }}
                      </v-chip>
                    </div>
                    <p v-if="displayEngagementActivitiesToolOther" class="other-response">
                      <strong>{{ $t('Other:') }}</strong> {{ goalForm.communityEngagement.engagementActivitiesToolOther }}
                    </p>
                  </div>

                  <!-- Research Experience -->
                  <div class="form-subsection">
                    <h4 class="subsection-title">{{ $t('Research Experience') }}</h4>
                    <p class="subsection-question">{{ $t('What kind of research experiences have you had?') }}</p>
                    <div class="response-chips">
                      <v-chip
                        v-for="exp in processedCurrentResearchExperience"
                        :key="exp.id"
                        :color="exp.checked === 'Yes' ? 'success' : 'grey'"
                        :variant="exp.checked === 'Yes' ? 'flat' : 'outlined'"
                        size="small"
                        class="mr-2 mb-2"
                      >
                        <v-icon start size="14">{{ exp.checked === 'Yes' ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        {{ $t(exp.label) }}
                      </v-chip>
                    </div>
                    <p v-if="displayCurrentResearchExperienceOther" class="other-response">
                      <strong>{{ $t('Other:') }}</strong> {{ goalForm.researchExperience.currentResearchExperienceOther }}
                    </p>
                  </div>

                  <!-- Familiar Tools -->
                  <div class="form-subsection">
                    <h4 class="subsection-title">{{ $t('Familiar Tools') }}</h4>
                    <p class="subsection-question">{{ $t('What tools are you familiar with?') }}</p>
                    <div class="response-chips">
                      <v-chip
                        v-for="tool in processedFamiliarTools"
                        :key="tool.id"
                        :color="tool.checked === 'Yes' ? 'success' : 'grey'"
                        :variant="tool.checked === 'Yes' ? 'flat' : 'outlined'"
                        size="small"
                        class="mr-2 mb-2"
                      >
                        <v-icon start size="14">{{ tool.checked === 'Yes' ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        {{ $t(tool.label) }}
                      </v-chip>
                    </div>
                    <p v-if="displayFamiliarToolOther" class="other-response">
                      <strong>{{ $t('Other:') }}</strong> {{ goalForm.researchExperience.familiarToolOther }}
                    </p>
                  </div>

                  <!-- Research/Service Interests -->
                  <div class="form-subsection">
                    <h4 class="subsection-title">{{ $t('Research/Service Interests') }}</h4>
                    <div class="response-chips">
                      <v-chip
                        v-for="interest in processedInterestResearchService"
                        :key="interest.id"
                        :color="interest.checked === 'Yes' ? 'success' : 'grey'"
                        :variant="interest.checked === 'Yes' ? 'flat' : 'outlined'"
                        size="small"
                        class="mr-2 mb-2"
                      >
                        <v-icon start size="14">{{ interest.checked === 'Yes' ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        {{ $t(interest.label) }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Leadership Interest -->
                  <div class="form-subsection">
                    <h4 class="subsection-title">{{ $t('Leadership Interest') }}</h4>
                    <p class="subsection-question">{{ $t('Are you interested in a leadership position?') }}</p>
                    <v-chip
                      :color="goalForm.researchExperience.leadershipOption === 'Yes' ? 'success' : 'grey'"
                      variant="flat"
                    >
                      <v-icon start size="16">{{ goalForm.researchExperience.leadershipOption === 'Yes' ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                      {{ $t(goalForm.researchExperience.leadershipOption) }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Growth Goals Section -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <v-icon color="white" size="18">mdi-trending-up</v-icon>
                  </div>
                  <div>
                    <h2 class="section-title">{{ $t('Growth Goals') }}</h2>
                    <p class="section-subtitle">{{ $t('Expected growth during the program') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div class="growth-goals-grid">
                    <div class="growth-goal-item">
                      <v-icon color="#c8102e" size="20" class="mb-2">mdi-puzzle</v-icon>
                      <h5 class="goal-label">{{ $t('Problem Solving') }}</h5>
                      <v-chip color="#c8102e" variant="tonal" size="small">
                        {{ $t(goalForm.growthGoal.problemSolvingGoal) }}
                      </v-chip>
                    </div>
                    <div class="growth-goal-item">
                      <v-icon color="#c8102e" size="20" class="mb-2">mdi-message-text</v-icon>
                      <h5 class="goal-label">{{ $t('Effective Communication') }}</h5>
                      <v-chip color="#c8102e" variant="tonal" size="small">
                        {{ $t(goalForm.growthGoal.effectiveCommunicationGoal) }}
                      </v-chip>
                    </div>
                    <div class="growth-goal-item">
                      <v-icon color="#c8102e" size="20" class="mb-2">mdi-account-group</v-icon>
                      <h5 class="goal-label">{{ $t('Teamwork') }}</h5>
                      <v-chip color="#c8102e" variant="tonal" size="small">
                        {{ $t(goalForm.growthGoal.teamworkGoal) }}
                      </v-chip>
                    </div>
                    <div class="growth-goal-item">
                      <v-icon color="#c8102e" size="20" class="mb-2">mdi-earth</v-icon>
                      <h5 class="goal-label">{{ $t('Cultural Humility') }}</h5>
                      <v-chip color="#c8102e" variant="tonal" size="small">
                        {{ $t(goalForm.growthGoal.culturalHumilityGoal) }}
                      </v-chip>
                    </div>
                    <div class="growth-goal-item">
                      <v-icon color="#c8102e" size="20" class="mb-2">mdi-scale-balance</v-icon>
                      <h5 class="goal-label">{{ $t('Ethical Decision Making') }}</h5>
                      <v-chip color="#c8102e" variant="tonal" size="small">
                        {{ $t(goalForm.growthGoal.ethicalDecisionMakingGoal) }}
                      </v-chip>
                    </div>
                    <div class="growth-goal-item">
                      <v-icon color="#c8102e" size="20" class="mb-2">mdi-briefcase-check</v-icon>
                      <h5 class="goal-label">{{ $t('Professional Responsibility') }}</h5>
                      <v-chip color="#c8102e" variant="tonal" size="small">
                        {{ $t(goalForm.growthGoal.professionalResponsibilityGoal) }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Aspirations Section -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <v-icon color="white" size="18">mdi-star-shooting</v-icon>
                  </div>
                  <div>
                    <h2 class="section-title">{{ $t('Aspirations') }}</h2>
                    <p class="section-subtitle">{{ $t('Long-term aspirations and vision') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div class="aspiration-item" v-if="goalForm.aspirations.aspirationOne">
                    <div class="aspiration-number">1</div>
                    <p class="aspiration-text">{{ goalForm.aspirations.aspirationOne }}</p>
                  </div>
                  <div class="aspiration-item" v-if="goalForm.aspirations.aspirationTwo">
                    <div class="aspiration-number">2</div>
                    <p class="aspiration-text">{{ goalForm.aspirations.aspirationTwo }}</p>
                  </div>
                  <div class="aspiration-item" v-if="goalForm.aspirations.aspirationThree">
                    <div class="aspiration-number">3</div>
                    <p class="aspiration-text">{{ goalForm.aspirations.aspirationThree }}</p>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Goals Section -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <v-icon color="white" size="18">mdi-flag-checkered</v-icon>
                  </div>
                  <div>
                    <h2 class="section-title">{{ $t('Goals') }}</h2>
                    <p class="section-subtitle">{{ $t('Goals for this experience') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <div class="goal-item" v-if="goalForm.goals.goalOne">
                    <div class="goal-number">1</div>
                    <p class="goal-text">{{ goalForm.goals.goalOne }}</p>
                  </div>
                  <div class="goal-item" v-if="goalForm.goals.goalTwo">
                    <div class="goal-number">2</div>
                    <p class="goal-text">{{ goalForm.goals.goalTwo }}</p>
                  </div>
                  <div class="goal-item" v-if="goalForm.goals.goalThree">
                    <div class="goal-number">3</div>
                    <p class="goal-text">{{ goalForm.goals.goalThree }}</p>
                  </div>
                  <div class="goal-item" v-if="goalForm.goals.goalFour">
                    <div class="goal-number">4</div>
                    <p class="goal-text">{{ goalForm.goals.goalFour }}</p>
                  </div>
                  <div class="goal-item" v-if="goalForm.goals.goalFive">
                    <div class="goal-number">5</div>
                    <p class="goal-text">{{ goalForm.goals.goalFive }}</p>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Sidebar Column -->
          <v-col cols="12" lg="4" class="d-none d-lg-block">
            <div class="sidebar-sticky">
              <!-- Student Info Card -->
              <v-card class="sidebar-card mb-4" variant="outlined">
                <v-card-title class="sidebar-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-account</v-icon>
                  {{ $t('Student Information') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <div class="sidebar-info-item mb-3">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">{{ $t('Name') }}</div>
                    <div class="text-body-1 font-weight-medium">{{ firstName }} {{ lastName }}</div>
                  </div>
                  <div class="sidebar-info-item mb-3">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">{{ $t('Experience') }}</div>
                    <div class="text-body-2">{{ experienceName }}</div>
                  </div>
                  <div class="sidebar-info-item">
                    <div class="text-caption font-weight-medium text-medium-emphasis mb-1">{{ $t('Category') }}</div>
                    <div class="text-body-2">{{ experienceCategory }}</div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Quick Navigation Card -->
              <v-card class="sidebar-card" variant="outlined">
                <v-card-title class="sidebar-header">
                  <v-icon color="#c8102e" class="mr-2">mdi-navigation</v-icon>
                  {{ $t('Quick Navigation') }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <v-list density="compact" class="pa-0">
                    <v-list-item class="nav-item" @click="scrollToSection('background')">
                      <template v-slot:prepend>
                        <v-icon size="18" color="#c8102e">mdi-account-details</v-icon>
                      </template>
                      <v-list-item-title>{{ $t('Background') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="nav-item" @click="scrollToSection('growth')">
                      <template v-slot:prepend>
                        <v-icon size="18" color="#c8102e">mdi-trending-up</v-icon>
                      </template>
                      <v-list-item-title>{{ $t('Growth Goals') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="nav-item" @click="scrollToSection('aspirations')">
                      <template v-slot:prepend>
                        <v-icon size="18" color="#c8102e">mdi-star-shooting</v-icon>
                      </template>
                      <v-list-item-title>{{ $t('Aspirations') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="nav-item" @click="scrollToSection('goals')">
                      <template v-slot:prepend>
                        <v-icon size="18" color="#c8102e">mdi-flag-checkered</v-icon>
                      </template>
                      <v-list-item-title>{{ $t('Goals') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </main>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "StudentGoalFormViewer",
  data() {
    return {
      firstName: "",
      lastName: "",
      experienceName: "",
      experienceCategory: "",
      goalForm: null,
      hichProject: [],
      loading: true,
    }
  },
  async created() {
    await this.fetchGoalForm(
      useLoggedInUserStore().navigationData.studentID, 
      useLoggedInUserStore().navigationData.expInstanceID
    );
  },

  computed: {
    processedCommunityEngagementExperiences() {
      if (!this.goalForm?.communityEngagement?.communityEngagementExperiences) return [];
      const noneSelected = this.goalForm.communityEngagement.communityEngagementExperiences.some(e => e.label === 'None of the above' && e.checked);
      return this.goalForm.communityEngagement.communityEngagementExperiences
        .filter(e => e.label !== 'None of the above' && e.label !== 'Other')
        .map(e => ({ ...e, checked: noneSelected ? 'No' : (e.checked ? 'Yes' : 'No') }));
    },
    displayOtherExperience() {
      return this.goalForm?.communityEngagement?.communityEngagementExperiences?.find(e => e.label === 'Other')?.checked;
    },
    processedPreviousEngagementExperiences() {
      if (!this.goalForm?.communityEngagement?.previousEngagementExperiences) return [];
      const noneSelected = this.goalForm.communityEngagement.previousEngagementExperiences.some(e => e.label === 'None of the above' && e.checked);
      return this.goalForm.communityEngagement.previousEngagementExperiences
        .filter(e => e.label !== 'None of the above' && e.label !== 'Other')
        .map(e => ({ ...e, checked: noneSelected ? 'No' : (e.checked ? 'Yes' : 'No') }));
    },
    displayPreviousOtherExperience() {
      return this.goalForm?.communityEngagement?.previousEngagementExperiences?.find(e => e.label === 'Other')?.checked;
    },
    processedEngagementActivitiesTools() {
      if (!this.goalForm?.communityEngagement?.engagementActivitiesTools) return [];
      const noneSelected = this.goalForm.communityEngagement.engagementActivitiesTools.some(t => t.label === 'None of the above' && t.checked);
      return this.goalForm.communityEngagement.engagementActivitiesTools
        .filter(t => t.label !== 'None of the above' && t.label !== 'Other')
        .map(t => ({ ...t, checked: noneSelected ? 'No' : (t.checked ? 'Yes' : 'No') }));
    },
    displayEngagementActivitiesToolOther() {
      return this.goalForm?.communityEngagement?.engagementActivitiesTools?.find(t => t.label === 'Other')?.checked;
    },
    processedCurrentResearchExperience() {
      if (!this.goalForm?.researchExperience?.currentResearchExperience) return [];
      const noneSelected = this.goalForm.researchExperience.currentResearchExperience.some(e => e.label === 'None of the above' && e.checked);
      return this.goalForm.researchExperience.currentResearchExperience
        .filter(e => e.label !== 'None of the above' && e.label !== 'Other')
        .map(e => ({ ...e, checked: noneSelected ? 'No' : (e.checked ? 'Yes' : 'No') }));
    },
    displayCurrentResearchExperienceOther() {
      return this.goalForm?.researchExperience?.currentResearchExperience?.find(e => e.label === 'Other')?.checked;
    },
    processedPreviousResearchExperience() {
      if (!this.goalForm?.researchExperience?.previousResearchExperience) return [];
      const noneSelected = this.goalForm.researchExperience.previousResearchExperience.some(e => e.id === 9 && e.checked);
      return this.goalForm.researchExperience.previousResearchExperience
        .filter(e => e.label !== 'None of the above' && e.label !== 'Other')
        .map(e => ({ ...e, checked: noneSelected ? 'No' : (e.checked ? 'Yes' : 'No') }));
    },
    displayPreviousResearchExperienceOther() {
      return this.goalForm?.researchExperience?.previousResearchExperience?.find(e => e.id === 8)?.checked;
    },
    processedFamiliarTools() {
      if (!this.goalForm?.researchExperience?.familiarTools) return [];
      const noneSelected = this.goalForm.researchExperience.familiarTools.some(t => t.label === 'None of the above' && t.checked);
      return this.goalForm.researchExperience.familiarTools
        .filter(t => t.label !== 'None of the above' && t.label !== 'Other')
        .map(t => ({ ...t, checked: noneSelected ? 'No' : (t.checked ? 'Yes' : 'No') }));
    },
    displayFamiliarToolOther() {
      return this.goalForm?.researchExperience?.familiarTools?.find(t => t.label === 'Other')?.checked;
    },
    processedInterestResearchService() {
      if (!this.goalForm?.researchExperience?.interestResearchService) return [];
      const noneSelected = this.goalForm.researchExperience.interestResearchService.some(i => i.label === 'None of the above' && i.checked);
      return this.goalForm.researchExperience.interestResearchService
        .filter(i => i.label !== 'None of the above' && i.label !== 'Other')
        .map(i => ({ ...i, checked: noneSelected ? 'No' : (i.checked ? 'Yes' : 'No') }));
    },
    displayInterestResearchServiceOther() {
      return this.goalForm?.researchExperience?.interestResearchService?.find(i => i.label === 'Other')?.checked;
    },
  },

  methods: {
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
        this.hichProject = response.data.hichProject || [];
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    scrollToSection(section) {
      // Implementation for smooth scrolling to sections
      console.log('Scroll to:', section);
    }
  }
}
</script>

<style scoped>
/* Page Background */
.goal-form-viewer-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

/* Main Form Card */
.form-card {
  border-radius: 12px;
  overflow: hidden;
}

/* Form Sections */
.form-section {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #c8102e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0;
}

.section-content {
  padding-left: 52px;
}

/* Subsections */
.form-subsection {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-subsection:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.subsection-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.subsection-question {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 12px;
}

.response-chips {
  display: flex;
  flex-wrap: wrap;
}

.other-response {
  margin-top: 12px;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
  font-size: 0.9rem;
}

/* Growth Goals Grid */
.growth-goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.growth-goal-item {
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.goal-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #444;
  margin-bottom: 8px;
}

/* Aspirations & Goals Items */
.aspiration-item,
.goal-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  margin-bottom: 12px;
}

.aspiration-item:last-child,
.goal-item:last-child {
  margin-bottom: 0;
}

.aspiration-number,
.goal-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 16px;
  flex-shrink: 0;
}

.aspiration-text,
.goal-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* Sidebar */
.sidebar-sticky {
  position: sticky;
  top: 24px;
}

.sidebar-card {
  border-radius: 12px;
  border-color: #e0e0e0;
}

.sidebar-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-info-item {
  padding: 10px 12px;
  background-color: #fafafa;
  border-radius: 8px;
}

.nav-item {
  border-radius: 8px;
  margin-bottom: 4px;
  cursor: pointer;
}

.nav-item:hover {
  background-color: rgba(200, 16, 46, 0.08);
}

/* Responsive */
@media (max-width: 1280px) {
  .sidebar-sticky {
    position: static;
  }
}

@media (max-width: 960px) {
  .form-section {
    padding: 24px 20px;
  }
  
  .section-content {
    padding-left: 0;
    margin-top: 16px;
  }
  
  .growth-goals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .growth-goals-grid {
    grid-template-columns: 1fr;
  }
}
</style>