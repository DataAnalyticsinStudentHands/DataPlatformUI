<!-- /goalSettingForm -->
<template>
  <div v-if="loading" class="loading-container">
  <v-progress-circular indeterminate></v-progress-circular>
</div>
<div v-else>
  <v-form 
  ref="form"
  @submit.prevent>
  <v-container  style="width: 90%; margin: 0 auto;">
    <div>

      
    <p class="font-weight-black text-h5 text--primary">{{getTranslation('Goal Setting Form')}}</p>


    <p class="text-subtitle-1">{{getTranslation("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.")}}</p>
</div>
<v-row dense>
    <v-col cols="12" md="5">
      <p class="font-weight-black text-h8">{{getTranslation('Current Semester:')}}</p>
      <v-text-field v-model="goalForm.semester" :label="getTranslation('Semester')" readonly></v-text-field>
    </v-col>
</v-row>
<v-row dense>
  <v-col cols="11" md="10">
    <div>
    <p 
      :class="{'error-text': isExperienceIDInvalid}"
      class="font-weight-black text-h8">
        {{getTranslation('Which experience are you filling out this form for:')}}
    </p>
      <v-autocomplete
        v-model="selectedExperience"
        :label="getTranslation('Select an Experience')"
        :items="formattedExperiences"
        item-title="text"
        item-value="value"
        clearable
        @update:modelValue="updateExperienceID"
        :rules="experienceIDRules"
        required
      ></v-autocomplete>
    </div>
  </v-col>
</v-row>


<v-row dense style="padding-bottom: 1rem;">
  <v-col cols="11">
    <!-- Container without min-height -->
    <div style="display: flex; flex-direction: column; align-items: flex-start; min-height: 3.8rem; justify-content: center;">
      <!-- Loading wheel -->
      <v-progress-circular 
        v-show="isLoadingExpCheck"
        indeterminate 
        size="20"
      ></v-progress-circular>

      <!-- Message when experienceFoundWarning is true -->
      <div v-if="experienceFoundWarning" style="display: flex; align-items: center; color: #4A90E2; font-weight: bold;">
        <v-icon left small style="margin-right: 0.5rem; color: #4A90E2;">mdi-alert-circle</v-icon>
        {{getTranslation('Hi there! You have already filled out a Goal Setting Form for this experience. Please note that submitting another form for the same experience will overwrite your previous responses.')}}
      </div>

      <!-- Message when experienceFoundWarning is false -->
      <div v-if="experienceFoundWarning === false" style="display: flex; align-items: center; color: #4CAF50; font-weight: bold;">
        <v-icon left small style="margin-right: 0.5rem; color: #4CAF50;">mdi-check-circle</v-icon>
        {{getTranslation("You haven't filled out a Goal Setting form for this experience. Complete this form to start your progress!")}}
      </div>
    </div>
  </v-col>
</v-row>





<transition-group name="slide-y-transition" tag="div">
<div v-show="hasFilledForm === false" key="neverFilledForm">


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': formSubmitted && isCommunityEngagementExperiencesInvalid}"
  class="font-weight-black text-h8">
    {{getTranslation('What kind of community engagement experiences, if any, have you had? Check all that apply.')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div 
  v-for="engagementExperience in goalForm.communityEngagement.communityEngagementExperiences" 
  :key="engagementExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID1 = engagementExperience.id" 
  @mouseleave="hoveredCheckboxID1 = null"
  >
    <v-checkbox 
      :class="{'error-text': formSubmitted && isCommunityEngagementExperiencesInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="engagementExperience.checked" 
        :label="getTranslation(engagementExperience.label)"
        :rules="communityEngagementExperiencesRules"
        :indeterminate="goalForm.communityEngagement.communityEngagementExperiences[goalForm.communityEngagement.communityEngagementExperiences.length - 1].checked && !engagementExperience.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.communityEngagement.communityEngagementExperiences[goalForm.communityEngagement.communityEngagementExperiences.length - 1].checked && !engagementExperience.checked && hoveredCheckboxID1 === engagementExperience.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0); max-width: 15vw; white-space: normal;"
      >
          {{getTranslation("De-select 'None of the above' to select this.")}}
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="engagementExperience.id === 6 && engagementExperience.checked">
        <v-col cols="12">
          <v-text-field
            ref="otherExperienceField"
            :placeholder="getTranslation('Please specify')" 
            :class="{'error-text': isOtherEngagementExperienceInvalid}"
            v-model="goalForm.communityEngagement.communityEngagementExperiencesOther"
            :rules="communityEngagementExperiencesOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>

  <div v-if="isCommunityEngagementExperiencesInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isPreviousEngagementExperiencesInvalid}"
  class="font-weight-black text-h8">{{getTranslation('From your previous community engagement experiences, which of the following activities have you engaged in?')}}</p>
  <div v-for="previousExperience in goalForm.communityEngagement.previousEngagementExperiences" :key="previousExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID2 = previousExperience.id" 
  @mouseleave="hoveredCheckboxID2 = null">
      <v-checkbox 
      :class="{'error-text': isPreviousEngagementExperiencesInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        :label="getTranslation(previousExperience.label)" 
        v-model="previousExperience.checked"
        :rules="previousEngagementExperiencesRules"
        :indeterminate="goalForm.communityEngagement.previousEngagementExperiences[goalForm.communityEngagement.previousEngagementExperiences.length - 1].checked && !previousExperience.checked"
      >
      </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
        v-if="goalForm.communityEngagement.previousEngagementExperiences[goalForm.communityEngagement.previousEngagementExperiences.length - 1].checked && !previousExperience.checked && hoveredCheckboxID2 === previousExperience.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0); max-width: 15vw; white-space: normal;"
      >
        {{getTranslation("De-select 'None of the above' to select this.")}}
      </span>
    </transition>
      <transition name="slide-y-transition">
      <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
      <v-text-field 
      ref="previousEngagementExperiencesOtherRef"
      :class="{'error-text': isPreviousEngagementExperiencesOtherInvalid}"
        :placeholder="getTranslation('Please specify')" 
        v-model="goalForm.communityEngagement.previousEngagementExperiencesOther"
        :rules="previousEngagementExperiencesOtherRules"
      >
      </v-text-field>
    </v-col>
    </v-row>
    </transition>
    </div>
    <div v-if="isPreviousEngagementExperiencesInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
</v-col>

<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isEngagementActivitiesToolsInvalid}"
  class="font-weight-black text-h8">
    {{getTranslation('What, if any, tools have you used for community engagement activities?')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="activitiesTool in goalForm.communityEngagement.engagementActivitiesTools" :key="activitiesTool.id"
  class="relative"
  @mouseover="hoveredCheckboxID3 = activitiesTool.id" 
  @mouseleave="hoveredCheckboxID3 = null">
    <v-checkbox 
    :class="{'error-text': isEngagementActivitiesToolsInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="activitiesTool.checked" 
        :label="getTranslation(activitiesTool.label)"
        :rules="engagementActivitiesToolsRules"
        :indeterminate="goalForm.communityEngagement.engagementActivitiesTools[goalForm.communityEngagement.engagementActivitiesTools.length - 1].checked && !activitiesTool.checked"
    >
    </v-checkbox>
    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.communityEngagement.engagementActivitiesTools[goalForm.communityEngagement.engagementActivitiesTools.length - 1].checked && !activitiesTool.checked && hoveredCheckboxID3 === activitiesTool.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0); max-width: 15vw; white-space: normal;"
      >
          {{getTranslation("De-select 'None of the above' to select this.")}}
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="activitiesTool.id === 8 && activitiesTool.checked">
        <v-col cols="12">
          <v-text-field 
          ref="engagementActivitiesToolOtherRef"
          :class="{'error-text': isEngagementActivitiesToolOtherInvalid}"
            :placeholder="getTranslation('Please specify')" 
            v-model="goalForm.communityEngagement.engagementActivitiesToolOther" 
            :rules="engagementActivitiesToolOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isEngagementActivitiesToolsInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isCurrentResearchExperienceInvalid}"
  class="font-weight-black text-h8">
    {{getTranslation('What kind of research experiences, if any, have you had? Check all that apply.')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="currentExperience in goalForm.researchExperience.currentResearchExperience" :key="currentExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID4 = currentExperience.id" 
  @mouseleave="hoveredCheckboxID4 = null">
    <v-checkbox 
    :class="{'error-text': isCurrentResearchExperienceInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="currentExperience.checked" 
        :label="getTranslation(currentExperience.label)"
        :rules="currentResearchExperienceRules"
        :indeterminate="goalForm.researchExperience.currentResearchExperience[goalForm.researchExperience.currentResearchExperience.length - 1].checked && !currentExperience.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.currentResearchExperience[goalForm.researchExperience.currentResearchExperience.length - 1].checked && !currentExperience.checked && hoveredCheckboxID4 === currentExperience.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0); max-width: 15vw; white-space: normal;"
      >
          {{getTranslation("De-select 'None of the above' to select this.")}}
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="currentExperience.id === 7 && currentExperience.checked">
        <v-col cols="12">
          <v-text-field 
          ref="currentResearchExperienceOtherRef"
          :class="{'error-text': isCurrentResearchExperienceOtherInvalid}"
            :placeholder="getTranslation('Please specify')" 
            v-model="goalForm.researchExperience.currentResearchExperienceOther" 
            :rules="currentResearchExperienceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isCurrentResearchExperienceInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isPreviousResearchExperienceInvalid}"
  class="font-weight-black text-h8">
    {{getTranslation('From your previous research experiences, which of the following activities have you engaged in?')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="previousExperience in goalForm.researchExperience.previousResearchExperience" :key="previousExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID5 = previousExperience.id" 
  @mouseleave="hoveredCheckboxID5 = null">
    <v-checkbox 
    :class="{'error-text': isPreviousResearchExperienceInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="previousExperience.checked" 
        :label="getTranslation(previousExperience.label)"
        :rules="previousResearchExperienceRules"
        :indeterminate="goalForm.researchExperience.previousResearchExperience[goalForm.researchExperience.previousResearchExperience.length - 1].checked && !previousExperience.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.previousResearchExperience[goalForm.researchExperience.previousResearchExperience.length - 1].checked && !previousExperience.checked && hoveredCheckboxID5 === previousExperience.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0); max-width: 15vw; white-space: normal;"
      >
          {{getTranslation("De-select 'None of the above' to select this.")}}
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
          <v-text-field 
          ref="previousResearchExperienceOtherRef"
          :class="{'error-text': isPreviousResearchExperienceOtherInvalid}"
            :placeholder="getTranslation('Please specify')" 
            v-model="goalForm.researchExperience.previousResearchExperienceOther" 
            :rules="previousResearchExperienceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isPreviousResearchExperienceInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isFamiliarToolsInvalid}"
  class="font-weight-black text-h8">
    {{getTranslation('What, if any, tools are you familiar with?')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="familiarTool in goalForm.researchExperience.familiarTools" :key="familiarTool.id"
  class="relative"
  @mouseover="hoveredCheckboxID6 = familiarTool.id" 
  @mouseleave="hoveredCheckboxID6 = null">
    <v-checkbox 
    :class="{'error-text': isFamiliarToolsInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="familiarTool.checked" 
        :label="getTranslation(familiarTool.label)"
        :rules="familiarToolsRules"
        :indeterminate="goalForm.researchExperience.familiarTools[goalForm.researchExperience.familiarTools.length - 1].checked && !familiarTool.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.familiarTools[goalForm.researchExperience.familiarTools.length - 1].checked && !familiarTool.checked && hoveredCheckboxID6 === familiarTool.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0); max-width: 15vw; white-space: normal;"
      >
          {{getTranslation("De-select 'None of the above' to select this.")}}
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="familiarTool.id === 10 && familiarTool.checked">
        <v-col cols="12">
          <v-text-field 
          ref="familiarToolOtherRef"
          :class="{'error-text': isFamiliarToolOtherInvalid}"
            :placeholder="getTranslation('Please specify')" 
            v-model="goalForm.researchExperience.familiarToolOther" 
            :rules="familiarToolOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isFamiliarToolsInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isInterestResearchServiceInvalid}"
  class="font-weight-black text-h8">
    {{getTranslation('What are your research/service interests? Check all that apply.')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="interest in goalForm.researchExperience.interestResearchService" :key="interest.id"
  class="relative"
  @mouseover="hoveredCheckboxID7 = interest.id" 
  @mouseleave="hoveredCheckboxID7 = null">
    <v-checkbox 
    :class="{'error-text': isInterestResearchServiceInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="interest.checked" 
        :label="getTranslation(interest.label)"
        :rules="interestResearchServiceRules"
        :indeterminate="goalForm.researchExperience.interestResearchService[goalForm.researchExperience.interestResearchService.length - 1].checked && !interest.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.interestResearchService[goalForm.researchExperience.interestResearchService.length - 1].checked && !interest.checked && hoveredCheckboxID7 === interest.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0); max-width: 15vw; white-space: normal;"
      >
          {{getTranslation("De-select 'None of the above' to select this.")}}
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="interest.id === 8 && interest.checked">
        <v-col cols="12">
          <v-text-field 
          ref="interestResearchServiceOtherRef"
          :class="{'error-text': isInterestResearchServiceOtherInvalid}"
            :placeholder="getTranslation('Please specify')"
            v-model="goalForm.researchExperience.interestResearchServiceOther" 
            :rules="interestResearchServiceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isInterestResearchServiceInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isLeadershipOptionInvalid}"
  class="font-weight-black text-h8">{{getTranslation('Are you interested in potentially holding a leadership position?')}}</p>
  <v-radio-group 
  :class="{'error-text': isLeadershipOptionInvalid}"
  v-model="goalForm.researchExperience.leadershipOption"
  :rules="leadershipOptionRules">
    <v-radio :label="getTranslation('Yes')" value="Yes"></v-radio>
    <v-radio :label="getTranslation('Maybe')" value="Maybe"></v-radio>
    <v-radio label="No" value="No"></v-radio>
  </v-radio-group>
</v-col>

</div>
</transition-group>

<!-- growth section -->
<p 
:class="{'error-text': isGrowthInvalid}"
class="font-weight-black text-h6">{{getTranslation('Growth')}}</p>
<v-col cols="12" md="10">
  <span 
  :class="{'error-text': isProblemSolvingGoalInvalid}"
  class="font-weight-black text-h8"
  v-html="getTranslation('Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>problem solving</u>.')">
</span>
  <v-radio-group 
  :class="{'error-text': isProblemSolvingGoalInvalid}"
  v-model="goalForm.growthGoal.problemSolvingGoal" 
  :rules="problemSolvingGoalRules"
  >
    <v-radio :label="getTranslation('No growth')" value="No growth"></v-radio>
    <v-radio :label="getTranslation('A little growth')" value="A little growth"></v-radio>
    <v-radio :label="getTranslation('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
    <v-radio :label="getTranslation('A lot of growth')" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <span 
  :class="{'error-text': isEffectiveCommunicationGoalInvalid}"
  class="font-weight-black text-h8"
  v-html="getTranslation('Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>effective communication</u>.')"></span>
  <v-radio-group 
  v-model="goalForm.growthGoal.effectiveCommunicationGoal"
  :class="{'error-text': isEffectiveCommunicationGoalInvalid}"
  :rules="effectiveCommunicationGoalRules">
    <v-radio :label="getTranslation('No growth')" value="No growth"></v-radio>
    <v-radio :label="getTranslation('A little growth')" value="A little growth"></v-radio>
    <v-radio :label="getTranslation('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
    <v-radio :label="getTranslation('A lot of growth')" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <span
  :class="{'error-text': isTeamworkGoalInvalid}"
  class="font-weight-black text-h8"
  v-html="getTranslation('Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>teamwork</u>.')"></span>
  <v-radio-group 
  v-model="goalForm.growthGoal.teamworkGoal"
  :class="{'error-text': isTeamworkGoalInvalid}"
  :rules="teamworkGoalRules">
    <v-radio :label="getTranslation('No growth')" value="No growth"></v-radio>
    <v-radio :label="getTranslation('A little growth')" value="A little growth"></v-radio>
    <v-radio :label="getTranslation('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
    <v-radio :label="getTranslation('A lot of growth')" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <span 
  :class="{'error-text': isCulturalHumilityGoalInvalid}"
  class="font-weight-black text-h8"
  v-html="getTranslation('Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>cultural humility</u>.')"></span>
  <v-radio-group 
  v-model="goalForm.growthGoal.culturalHumilityGoal"
  :class="{'error-text': isCulturalHumilityGoalInvalid}"
  :rules="culturalHumilityGoalRules">
    <v-radio :label="getTranslation('No growth')" value="No growth"></v-radio>
    <v-radio :label="getTranslation('A little growth')" value="A little growth"></v-radio>
    <v-radio :label="getTranslation('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
    <v-radio :label="getTranslation('A lot of growth')" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <span 
  :class="{'error-text': isEthicalDecisionMakingGoalInvalid}"
  class="font-weight-black text-h8"
  v-html="getTranslation('Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>ethical decision making</u>.')"></span>
  <v-radio-group 
  v-model="goalForm.growthGoal.ethicalDecisionMakingGoal"
  :class="{'error-text': isEthicalDecisionMakingGoalInvalid}"
  :rules="ethicalDecisionMakingGoalRules">
    <v-radio :label="getTranslation('No growth')" value="No growth"></v-radio>
    <v-radio :label="getTranslation('A little growth')" value="A little growth"></v-radio>
    <v-radio :label="getTranslation('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
    <v-radio :label="getTranslation('A lot of growth')" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <span 
  :class="{'error-text': isProfessionalResponsibilityGoalInvalid}"
  class="font-weight-black text-h8"
  v-html="getTranslation('Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>professional responsibility</u>.')"></span>
  <v-radio-group 
  v-model="goalForm.growthGoal.professionalResponsibilityGoal"
  :class="{'error-text': isProfessionalResponsibilityGoalInvalid}"
  :rules="professionalResponsibilityGoalRules"
  >
    <v-radio :label="getTranslation('No growth')" value="No growth"></v-radio>
    <v-radio :label="getTranslation('A little growth')" value="A little growth"></v-radio>
    <v-radio :label="getTranslation('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
    <v-radio :label="getTranslation('A lot of growth')" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isAspirationsInvalid}"
  class="font-weight-black text-h8" style="margin-bottom: 2px;">
    <span
    >{{getTranslation('Please describe 2-3 long-term aspirations you may have.')}}</span>
    <br><br>
    {{getTranslation('Aspirations are statements that describe where you want to end up without necessarily describing exactly how you will get there.')}}
    <br> {{getTranslation('Examples:')}}
    <br>
    <ul>
      <li>{{getTranslation('“I want to focus my career on cancer disparities”')}}</li>
      <li>{{getTranslation('“I want to lead a non-profit that addresses food insecurity”')}}</li>
      <li>{{getTranslation('“I want to teach English in a different country”')}}</li>
    </ul>  
  </p>

  <v-text-field
    ref="aspiration1Field"
    :label="getTranslation('Aspiration 1:')"
    v-model="goalForm.aspirations.aspirationOne"
    :error="isAspirationsInvalid"
  ></v-text-field>

  <v-text-field
    ref="aspiration2Field"
    :label="getTranslation('Aspiration 2:')"
    v-model="goalForm.aspirations.aspirationTwo"
    :error="isAspirationsInvalid"
  ></v-text-field>

  <v-text-field
    ref="aspiration3Field"
    :label="getTranslation('Aspiration 3:')"
    v-model="goalForm.aspirations.aspirationThree"
    :error-messages="aspirationsErrorMessages"
  ></v-text-field>
</v-col>




<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isGoalsInvalid}"
  class="font-weight-black text-h8">
    <span
    >{{getTranslation('Please outline 3-5 goals that you have for this experience.')}}</span> 
    <br><br>
    {{getTranslation('Goals are statements that describe what it means for an experience to be a success from your perspective,')}}<br>
    {{getTranslation('Examples:')}}<br>
    <ul>
      <li>{{getTranslation('“I want to connect with people working on cancer research”')}}</li>
      <li>{{getTranslation('“I want to research access to nutrition education in public schools”')}}</li>
      <li>{{getTranslation('“I want to develop my presentation skills”')}}</li>
    </ul>
  </p>

  <v-text-field
    :label="getTranslation('Goal 1:')"
    v-model="goalForm.goals.goalOne"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
  :label="getTranslation('Goal 2:')"
    v-model="goalForm.goals.goalTwo"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
  :label="getTranslation('Goal 3:')"
    v-model="goalForm.goals.goalThree"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
  :label="getTranslation('Goal 4:')"
    v-model="goalForm.goals.goalFour"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
  :label="getTranslation('Goal 5:')"
    v-model="goalForm.goals.goalFive"
    :error-messages="goalsErrorMessages"
  ></v-text-field>
  
</v-col>




<v-row>
  <v-col cols="12" md="4">
    <v-btn @click="submitFormValidation">{{getTranslation('Submit Form')}}</v-btn>
  </v-col>
</v-row>

</v-container>
</v-form>

</div>
</template>

<style>
.v-field__input > input[size="1"] {
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

.v-field__input > input[size="1"]::before,
.v-field__input > input[size="1"]::after {
  display: none;
}



.slide-y-transition-enter-active, .slide-y-transition-leave-active {
	transition: all 0.5s ease-in-out;
}
/* delay leave of parent element */
.slide-y-transition-leave-active {
  transition-delay: 0.25s;
  transition: all 0.5s ease-in-out;
}


.error-text {
  color: darkred;
  }


.styled-error-text {
  -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: "Roboto", sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    --v-theme-overlay-multiplier: 1;
    --v-scrollbar-offset: 0px;
    --v-theme-background: 255,255,255;
    --v-theme-background-overlay-multiplier: 1;
    --v-theme-surface: 255,255,255;
    --v-theme-surface-overlay-multiplier: 1;
    --v-theme-surface-variant: 66,66,66;
    --v-theme-surface-variant-overlay-multiplier: 2;
    --v-theme-on-surface-variant: 238,238,238;
    --v-theme-primary: 98,0,238;
    --v-theme-primary-overlay-multiplier: 2;
    --v-theme-primary-darken-1: 55,0,179;
    --v-theme-primary-darken-1-overlay-multiplier: 2;
    --v-theme-secondary: 3,218,198;
    --v-theme-secondary-overlay-multiplier: 1;
    --v-theme-secondary-darken-1: 1,135,134;
    --v-theme-secondary-darken-1-overlay-multiplier: 1;
    --v-theme-error: 176,0,32;
    --v-theme-error-overlay-multiplier: 2;
    --v-theme-info: 33,150,243;
    --v-theme-info-overlay-multiplier: 1;
    --v-theme-success: 76,175,80;
    --v-theme-success-overlay-multiplier: 1;
    --v-theme-warning: 251,140,0;
    --v-theme-warning-overlay-multiplier: 1;
    --v-theme-on-background: 0,0,0;
    --v-theme-on-surface: 0,0,0;
    --v-theme-on-primary: 255,255,255;
    --v-theme-on-primary-darken-1: 255,255,255;
    --v-theme-on-secondary: 0,0,0;
    --v-theme-on-secondary-darken-1: 255,255,255;
    --v-theme-on-error: 255,255,255;
    --v-theme-on-info: 255,255,255;
    --v-theme-on-success: 255,255,255;
    --v-theme-on-warning: 255,255,255;
    --v-border-color: 0, 0, 0;
    --v-border-opacity: 0.12;
    --v-high-emphasis-opacity: 0.87;
    --v-medium-emphasis-opacity: 0.6;
    --v-disabled-opacity: 0.38;
    --v-idle-opacity: 0.04;
    --v-hover-opacity: 0.04;
    --v-focus-opacity: 0.12;
    --v-selected-opacity: 0.08;
    --v-activated-opacity: 0.12;
    --v-pressed-opacity: 0.12;
    --v-dragged-opacity: 0.08;
    --v-theme-kbd: 33, 37, 41;
    --v-theme-on-kbd: 255, 255, 255;
    --v-theme-code: 245, 245, 245;
    --v-theme-on-code: 0, 0, 0;
    --v-input-control-height: 56px;
    --v-input-padding-top: 16px;
    --select-chips-margin-bottom: 0px;
    --autocomplete-chips-margin-bottom: 0px;
    --combobox-chips-margin-bottom: 0px;
    --file-input-chips-margin-bottom: 0px;
    font-weight: 400;
    letter-spacing: 0.0333333333em;
    font-size: 12px;
    color: rgb(var(--v-theme-error));
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    --tw-border-spacing-x: 0;
    --tw-border-spacing-y: 0;
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-pan-x: ;
    --tw-pan-y: ;
    --tw-pinch-zoom: ;
    --tw-scroll-snap-strictness: proximity;
    --tw-ordinal: ;
    --tw-slashed-zero: ;
    --tw-numeric-figure: ;
    --tw-numeric-spacing: ;
    --tw-numeric-fraction: ;
    --tw-ring-inset: ;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgb(59 130 246 / 0.5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;
    --tw-blur: ;
    --tw-brightness: ;
    --tw-contrast: ;
    --tw-grayscale: ;
    --tw-hue-rotate: ;
    --tw-invert: ;
    --tw-saturate: ;
    --tw-sepia: ;
    --tw-drop-shadow: ;
    --tw-backdrop-blur: ;
    --tw-backdrop-brightness: ;
    --tw-backdrop-contrast: ;
    --tw-backdrop-grayscale: ;
    --tw-backdrop-hue-rotate: ;
    --tw-backdrop-invert: ;
    --tw-backdrop-opacity: ;
    --tw-backdrop-saturate: ;
    --tw-backdrop-sepia: ;
    background-repeat: no-repeat;
    box-sizing: inherit;
    padding: 0;
    margin: 0;
    line-height: 12px;
    word-break: break-word;
    word-wrap: break-word;
    hyphens: auto;
    transition-duration: 150ms;
    transform-origin: center center;
}

</style>

<script>
import { ref } from 'vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from "axios";
export default {
  setup() {
    const translations = {
      Spanish: {
        "Goal Setting Form": "Formulario de Establecimiento de Objetivos",
        "Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.": "Complete los detalles requeridos y presione el botón de enviar. No se preocupe, podrá editar estos detalles nuevamente más tarde.",
        "Current Semester:": "Semestre Actual",
        "Semester": "Semestre",
        "Which experience are you filling out this form for:": "¿Para cuál experiencia está completando este formulario?",
        "Select an Experience": "Seleccione una Experiencia",
        "Hi there! You have already filled out a Goal Setting Form for this experience. Please note that submitting another form for the same experience will overwrite your previous responses.": "¡Hola! Ya ha completado un Formulario de Establecimiento de Objetivos para esta experiencia. Tenga en cuenta que enviar otro formulario para la misma experiencia sobrescribirá sus respuestas anteriores.",
        "You haven't filled out a Goal Setting form for this experience. Complete this form to start your progress!": "No ha completado un Formulario de Establecimiento de Objetivos para esta experiencia. ¡Complete este formulario para comenzar su progreso!",
        "What kind of community engagement experiences, if any, have you had? Check all that apply.": "¿Qué tipo de experiencias de participación comunitaria, si las hubo, ha tenido? Marque todo lo que corresponda.",
        "De-select 'None of the above' to select this.": "Deseleccione 'Ninguna de las anteriores' para seleccionar esto.",
        "Volunteer organizations (e.g. scouts, nonprofits, food banks)": "Organizaciones de voluntarios (por ejemplo, exploradores, organizaciones sin fines de lucro, bancos de alimentos)",
        "Political campaigns": "Campañas políticas",
        "Faith based organizations": "Organizaciones basadas en la fe",
        "Short-term volunteer opportunities (e.g. day of service events)": "Oportunidades de voluntariado a corto plazo (por ejemplo, eventos del día de servicio)",
        "Medical mission trips": "Viajes de misiones médicas",
        "Other": "Otro",
        "Please specify": "Por favor especificar",
        "None of the above": "Ninguna de las anteriores",
        "Information is required.": "Se requiere información.",
        "From your previous community engagement experiences, which of the following activities have you engaged in?": "De sus experiencias previas de participación comunitaria, ¿en cuáles de las siguientes actividades se ha involucrado?",
        "Mentoring someone": "Asesorar a alguien",
        "Volunteering at a community event (e.g. health fair)": "Voluntariado/a en un evento comunitario (por ejemplo, feria de salud)",
        "Recruiting volunteers": "Reclutamiento de voluntarios/as",
        "Organizing a service project": "Organizar un proyecto de servicio",
        "Serving as translator": "Sirviendo como traductor",
        "Fundraising": "Recaudación de fondos",
        "Emergency response volunteering": "Voluntariado de respuesta a emergencias",
        "What, if any, tools have you used for community engagement activities?": "¿Qué herramientas, si alguna, ha utilizado para las actividades de participación comunitaria?",
        "Social media": "Redes sociales",
        "Scheduling software (e.g. when is good, doodle)": "Software de programación (por ejemplo, when is good, doodle)",
        "Fundraising platforms": "Plataformas de recaudación de fondos",
        "Survey tools": "Herramientas de encuesta",
        "Graphic design tools (e.g. adobe, canva)": "Herramientas de diseño gráfico (por ejemplo, adobe, canva)",
        "Project management Tool": "Herramienta de gestión de proyectos",
        "Digital media (e.g. podcasting, streaming video)": "Medios digitales (por ejemplo, podcasting, transmisión de video)",
        "What kind of research experiences, if any, have you had? Check all that apply.": "¿Qué tipo de experiencias de investigación, si las hubo, ha tenido? Marque todo lo que corresponda.",
        "Introduction to Statistics / Introduction to Biostatistics / Introduction to Research courses": "Cursos de Introducción a la Estadística / Introducción a la Bioestadística / Introducción a la Investigación",
        "Advanced statistics and programming courses": "Cursos avanzados de estadística y programación",
        "Volunteered/Interned in a lab": "Voluntario/a o internado/a en un laboratorio",
        "From your previous research experiences, which of the following activities have you engaged in?": "De sus experiencias previas de investigación, ¿cuál de las siguientes actividades ha realizado?",
        "Designing your own research project": "Diseñando su propio proyecto de investigación",
        "Literature review": "Revisión de literatura",
        "Data collection in a clinical setting": "Recopilación de datos en un entorno clínico",
        "Data collection in a laboratory setting": "Recopilación de datos en un entorno de laboratorio",
        "Data collection in a public health/community setting": "Recopilación de datos en un entorno de salud pública/comunitario",
        "Analyzing data with a statistical package": "Análisis de datos con un paquete estadístico",
        "Writing/assisting with a manuscript": "Escribir/ayudar con un manuscrito",
        "What, if any, tools are you familiar with?": "¿Con qué herramientas, si las hay, está familiarizado?",
        "What are your research/service interests? Check all that apply.": "¿Cuáles son sus intereses de investigación/servicio? Marque todo lo que corresponda",
        "Education": "Educación",
        "Community Health": "Salud de la comunidad",
        "Mental Health": "Salud mental",
        "Incarceration / Criminal Justice": "Encarcelamiento / Justicia Penal",
        "Chronic Disease": "Enfermedades crónicas",
        "Environment and occupational health": "Medio ambiente y salud ocupacional",
        "Government/Law/Policy": "Gobierno/Ley/Política",
        "Are you interested in potentially holding a leadership position?": "¿Está interesado en ocupar un puesto de liderazgo?",
        "Yes": "Si",
        "Maybe": "Tal vez",
        "Growth": "Crecimiento",
        "Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>problem solving</u>.": "Por favor indique su expectativa del crecimiento que anticipa ver durante su programa en el área de <u>resolución de problemas.</u>",
        "No growth": "Sin crecimiento",
        "A little growth": "Sin crecimiento",
        "A moderate amount of growth": "Una cantidad moderada de crecimiento",
        "A lot of growth": "Mucho crecimiento",
        "Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>effective communication</u>.": "Por favor indique su expectativa del crecimiento que anticipa ver durante su programa en el área de <u>comunicación efectiva</u>.",
        "Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>teamwork</u>.": "Por favor indique su expectativa del crecimiento que anticipa ver durante su programa en el área de <u>trabajo en equipo</u>.",
        "Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>cultural humility</u>.": "Por favor indique su expectativa del crecimiento que anticipa ver durante su programa en el área de <u>humildad cultural</u>.",
        "Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>ethical decision making</u>.": "Por favor indique su expectativa del crecimiento que anticipa ver durante su programa en el área de <u>toma de decisiones éticas</u>.",
        "Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>professional responsibility</u>.": "Por favor indique su expectativa del crecimiento que anticipa ver durante su programa en el área de <u>responsabilidad profesional</u>.",
        "Please describe 2-3 long-term aspirations you may have.": "Por favor describa 2 o 3 aspiraciones a largo plazo que pueda tener.",
        "Aspirations are statements that describe where you want to end up without necessarily describing exactly how you will get there.": "Las aspiraciones son declaraciones que describen dónde quiere terminar sin necesariamente describir exactamente cómo llegará allí.",
        "Examples:": "Por ejemplo:",
        "“I want to focus my career on cancer disparities”": "“Quiero centrar mi carrera en las disparidades del cáncer”",
        "“I want to lead a non-profit that addresses food insecurity”": "“Quiero dirigir una organización sin fines de lucro que aborde la inseguridad alimentaria”",
        "“I want to teach English in a different country”": "“Quiero enseñar inglés en un país diferente”",
        "Aspiration 1:": "Aspiración 1:",
        "Aspiration 2:": "Aspiración 2:",
        "Aspiration 3:": "Aspiración 3:",
        "Please outline 3-5 goals that you have for this experience.": "Por favor describa entre 3 y 5 metas que tiene para esta experiencia.",
        "Goals are statements that describe what it means for an experience to be a success from your perspective,": "Las metas son declaraciones que describen lo que significa que una experiencia sea un éxito desde su perspectiva",
        "“I want to connect with people working on cancer research”": "“Quiero conectarme con personas que trabajan en la investigación del cáncer”",
        "“I want to research access to nutrition education in public schools”": "“Quiero investigar el acceso a la educación nutricional en las escuelas públicas”",
        "“I want to develop my presentation skills”": "“Quiero desarrollar mis habilidades de presentación”",
        "Goal 1:": "Objetivo 1:",
        "Goal 2:": "Objetivo 2:",
        "Goal 3:": "Objetivo 3:",
        "Goal 4:": "Objetivo 4:",
        "Goal 5:": "Objetivo 5:",
        "Submit Form": "Enviar Formulario",
        "If 'Other' is selected, please specify.": "Si seleccionó 'Otro', por favor especifique.",
        "Please fill out at least 2 aspirations.": "Por favor, complete al menos 2 aspiraciones.",
        "Please fill out at least 3 goals.": "Por favor, complete al menos 3 metas.",
        "Oops! Error(s) detected. Please review and try again.": "¡Ups! Se detectó(ron) error(es). Por favor, revise y vuelva a intentarlo.",
        "Goals successfully set! You're on the right track!": "¡Metas establecidas con éxito! ¡Vas por buen camino!",
        "Great job setting your goals! Let's make them happen!": "¡Buen trabajo estableciendo tus metas! ¡Vamos a hacerlas realidad!",
        "Goals locked in! Believe in yourself and you'll achieve them.": "¡Metas aseguradas! Cree en ti mismo y las lograrás.",
        "You've set your goals! Now, let's conquer them together!": "¡Has establecido tus metas! Ahora, ¡conquistémoslas juntos!",
        "Your goals are set! Keep pushing forward and you'll achieve them.": "¡Tus metas están definidas! Sigue adelante y las alcanzarás.",
        "Way to go! Every goal you set brings you one step closer to success.": "¡Bien hecho! Cada meta que estableces te acerca un paso más al éxito.",
      },
    };

    // Reactive State
    const currentLanguage = ref('English'); // default value
    
    const getTranslation = (key) => {
      return (translations[currentLanguage.value] && translations[currentLanguage.value][key]) || key;
    };

    if (useLoggedInUserStore().languagePreference === "Spanish") {
      currentLanguage.value = "Spanish";
    }

    return {
      getTranslation,
    }
  },
  
  data() {
    return {
      selectedExperience: null,
      isGoalSettingFormFilled: null,
      goalForm: {
        semester: '',
        experiences:[{
          experienceIDFromList:'',
          experienceCategory:'',
          experienceName:''
        }],
        experienceID: null,
        communityEngagement: {
          communityEngagementExperiences: [
            { id: 1, label: "Volunteer organizations (e.g. scouts, nonprofits, food banks)", checked: false },
            { id: 2, label: "Political campaigns", checked: false },
            { id: 3, label: "Faith based organizations", checked: false },
            { id: 4, label: "Short-term volunteer opportunities (e.g. day of service events)", checked: false },
            { id: 5, label: "Medical mission trips", checked: false },
            { id: 6, label: "Other", checked: false },
            { id: 7, label: "None of the above", checked: false }
          ],
          communityEngagementExperiencesOther: '',
          previousEngagementExperiences: [
            { id: 1, label: "Mentoring someone", checked: false },
            { id: 2, label: "Volunteering at a community event (e.g. health fair)", checked: false },
            { id: 3, label: "Recruiting volunteers", checked: false },
            { id: 4, label: "Organizing a service project", checked: false },
            { id: 5, label: "Serving as translator", checked: false },
            { id: 6, label: "Fundraising", checked: false },
            { id: 7, label: "Emergency response volunteering", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
          ],
          previousEngagementExperiencesOther: '',
          engagementActivitiesTools: [
            { id: 1, label: "Social media", checked: false },
            { id: 2, label: "Scheduling software (e.g. when is good, doodle)", checked: false },
            { id: 3, label: "Fundraising platforms", checked: false },
            { id: 4, label: "Survey tools", checked: false },
            { id: 5, label: "Graphic design tools (e.g. adobe, canva)", checked: false },
            { id: 6, label: "Project management Tool", checked: false },
            { id: 7, label: "Digital media (e.g. podcasting, streaming video)", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
          ],
          engagementActivitiesToolOther: '',
        },
        researchExperience: {
          currentResearchExperience: [
            { id: 1, label: "Introduction to Statistics / Introduction to Biostatistics / Introduction to Research courses  ", checked: false },
            { id: 2, label: "Advanced statistics and programming courses", checked: false },
            { id: 3, label: "HERE", checked: false },
            { id: 4, label: "SURF", checked: false },
            { id: 5, label: "PURS", checked: false },
            { id: 6, label: "Volunteered/Interned in a lab", checked: false },
            { id: 7, label: "Other", checked: false },
            { id: 8, label: "None of the above", checked: false }
          ],
          currentResearchExperienceOther: '',
          previousResearchExperience: [
            { id: 1, label: "Designing your own research project", checked: false },
            { id: 2, label: "Literature review", checked: false },
            { id: 3, label: "Data collection in a clinical setting", checked: false },
            { id: 4, label: "Data collection in a laboratory setting", checked: false },
            { id: 5, label: "Data collection in a public health/community setting", checked: false },
            { id: 6, label: "Analyzing data with a statistical package", checked: false },
            { id: 7, label: "Writing/assisting with a manuscript", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
          ],
          previousResearchExperienceOther: '',
          familiarTools: [
            { id: 1, label: "Excel", checked: false },
            { id: 2, label: "R", checked: false },
            { id: 3, label: "Python", checked: false },
            { id: 4, label: "STATA", checked: false },
            { id: 5, label: "GIS", checked: false },
            { id: 6, label: "ATLAS", checked: false },
            { id: 7, label: "Nvivo", checked: false },
            { id: 8, label: "Tableau", checked: false },
            { id: 9, label: "SAS", checked: false },
            { id: 10, label: "Other", checked: false },
            { id: 11, label: "None of the above", checked: false }
          ],
          familiarToolOther: '',
          interestResearchService: [
            { id: 1, label: "Education", checked: false },
            { id: 2, label: "Community Health", checked: false },
            { id: 3, label: "Mental Health", checked: false },
            { id: 4, label: "Incarceration / Criminal Justice", checked: false },
            { id: 5, label: "Chronic Disease", checked: false },
            { id: 6, label: "Environment and occupational health", checked: false },
            { id: 7, label: "Government/Law/Policy", checked: false },
            { id: 8, label: "Other", checked: false },
            { id: 9, label: "None of the above", checked: false }
          ],
          interestResearchServiceOther: '',
          leadershipOption: ''
        },
        growthGoal: {
          problemSolvingGoal: '',
          effectiveCommunicationGoal: '',
          teamworkGoal: '',
          culturalHumilityGoal: '',
          ethicalDecisionMakingGoal: '',
          professionalResponsibilityGoal: ''
        },
        aspirations: {
          aspirationOne: '',
          aspirationTwo: '',
          aspirationThree: '',
        },
        goals: {
          goalOne: '',
          goalTwo: '',
          goalThree: '',
          goalFour: '',
          goalFive: '',
        }
      },
      formSubmitted: false,
      isGoalsValid: null,
      hoveredCheckboxID1: null,
      hoveredCheckboxID2: null,
      hoveredCheckboxID3: null,
      hoveredCheckboxID4: null,
      hoveredCheckboxID5: null,
      hoveredCheckboxID6: null,
      hoveredCheckboxID7: null,
      hasFilledForm: null,
      experienceFoundWarning: null,
      foundDocumentId: null,
      isLoadingExpCheck: false,
      experienceIDRules: [
        v => {
          if (this.formSubmitted) {
            return !!v || this.getTranslation('Information is required.');
          }
          return true;
        }
      ],
      isGoalSettingFormFilledRules: [
      v => {
              if (!this.formSubmitted) return true;

              return !!v || this.getTranslation('Information is required.');
          },
      ],
      communityEngagementExperiencesRules: [
        () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked) || this.getTranslation('Information is required.');
        }
      ],
      communityEngagementExperiencesOtherRules: [
        v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const otherExperience = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.id === 6);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!otherExperience || !otherExperience.checked) return true;

              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
          },
      ],
      previousEngagementExperiencesRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked) || this.getTranslation('Information is required.');
        }
      ],
      previousEngagementExperiencesOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const previousExperience = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!previousExperience || !previousExperience.checked) return true;

              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
          },
      ],
      engagementActivitiesToolsRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.communityEngagement.engagementActivitiesTools.some(exp => exp.checked) || this.getTranslation('Information is required.');
        }
      ],
      engagementActivitiesToolOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const engagementActivitiesTool = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!engagementActivitiesTool || !engagementActivitiesTool.checked) return true;

              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
          },
      ],
      currentResearchExperienceRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.currentResearchExperience.some(exp => exp.checked) || this.getTranslation('Information is required.');
        }
      ],
      currentResearchExperienceOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const researchExperience = this.goalForm.researchExperience.currentResearchExperience.find(p => p.id === 7);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!researchExperience || !researchExperience.checked) return true;

              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
        }
      ],
      previousResearchExperienceRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.previousResearchExperience.some(exp => exp.checked) || this.getTranslation('Information is required.');
        }
      ],
      previousResearchExperienceOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const previousExperience = this.goalForm.researchExperience.previousResearchExperience.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!previousExperience || !previousExperience.checked) return true;

              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
        }
      ],
      familiarToolsRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.familiarTools.some(exp => exp.checked) || this.getTranslation('Information is required.');
        }
      ],
      familiarToolOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const familiarTool = this.goalForm.researchExperience.familiarTools.find(p => p.id === 10);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!familiarTool || !familiarTool.checked) return true;

              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
        }
      ],
      interestResearchServiceRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.interestResearchService.some(exp => exp.checked) || this.getTranslation('Information is required.');
        }
      ],
      interestResearchServiceOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const researchService = this.goalForm.researchExperience.interestResearchService.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!researchService || !researchService.checked) return true;

              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
        }
      ],
      leadershipOptionRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;

              return !!v || this.getTranslation('Information is required.');
          },
      ],

      problemSolvingGoalRules: [
        v => {
              if (!this.formSubmitted) return true;

              return !!v || this.getTranslation('Information is required.');
          },
      ],
      effectiveCommunicationGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || this.getTranslation('Information is required.');
        },
      ],
      teamworkGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || this.getTranslation('Information is required.');
        },
      ],
      culturalHumilityGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || this.getTranslation('Information is required.');
        },
      ],
      ethicalDecisionMakingGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || this.getTranslation('Information is required.');
        },
      ],
      professionalResponsibilityGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || this.getTranslation('Information is required.');
        },
      ],
      aspirationsRules: [
        () => {
          if (this.formSubmitted && this.filledAspirationsCount < 2) {
            return this.getTranslation('Please fill out at least 2 aspirations.');
          }
          return true;
        }
      ],
      isAspirationsValid: true,
    }
  },
  watch: {
    selectedExperience(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.checkExistingForm(newVal);
      }
    },
    'goalForm.communityEngagement.communityEngagementExperiences': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(engagementExperience => {
            if (engagementExperience.id !== lastCheckbox.id) {
              engagementExperience.checked = false;
            }
          });
        }

        const otherExperience= newVal.find(exp => exp.id === 6);
        if (otherExperience && otherExperience.checked && this.formSubmitted) {
            this.$refs.otherExperienceField[5].validate();
        }
      }
    },
    'goalForm.communityEngagement.previousEngagementExperiences': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(experience => {
            if (experience.id !== lastCheckbox.id) {
              experience.checked = false;
            }
          });
        }
        const previousExperience= newVal.find(exp => exp.id === 8);
        if (previousExperience && previousExperience.checked && this.formSubmitted) {
          this.$refs.previousEngagementExperiencesOtherRef[7].validate();
        }
      }
    },
    'goalForm.communityEngagement.engagementActivitiesTools': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(tool => {
            if (tool.id !== lastCheckbox.id) {
              tool.checked = false;
            }
          });
        }
        const engagementActivitiesTool= newVal.find(exp => exp.id === 8);
        if (engagementActivitiesTool && engagementActivitiesTool.checked && this.formSubmitted) {
          this.$refs.engagementActivitiesToolOtherRef[7].validate();
        }
      }
    },
    'goalForm.researchExperience.currentResearchExperience': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(experience => {
            if (experience.id !== lastCheckbox.id) {
              experience.checked = false;
            }
          });
        }
        const researchExperience= newVal.find(exp => exp.id === 7);
        if (researchExperience && researchExperience.checked && this.formSubmitted) {
          this.$refs.currentResearchExperienceOtherRef[6].validate();
        }
      }
    },
    'goalForm.researchExperience.previousResearchExperience': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(experience => {
            if (experience.id !== lastCheckbox.id) {
              experience.checked = false;
            }
          });
        }
        const previousExperience= newVal.find(exp => exp.id === 8);
        if (previousExperience && previousExperience.checked && this.formSubmitted) {
          this.$refs.previousResearchExperienceOtherRef[7].validate();
        }
      }
    },
    'goalForm.researchExperience.familiarTools': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(tool => {
            if (tool.id !== lastCheckbox.id) {
              tool.checked = false;
            }
          });
        }
        const familiarTool= newVal.find(exp => exp.id === 10);
        if (familiarTool && familiarTool.checked && this.formSubmitted) {
          this.$refs.familiarToolOtherRef[9].validate();
        }
      }
    },
    'goalForm.researchExperience.interestResearchService': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(interestItem => {
            if (interestItem.id !== lastCheckbox.id) {
              interestItem.checked = false;
            }
          });
        }
        const researchService= newVal.find(exp => exp.id === 8);
        if (researchService && researchService.checked && this.formSubmitted) {
          this.$refs.interestResearchServiceOtherRef[7].validate();
        }
      }
    },
  },
  computed: {
    year() {
      return new Date(this.dateInput).getFullYear()
    },
    filledGoalsCount() {
      // Extract the goals from the goalForm
      const { goalOne, goalTwo, goalThree, goalFour, goalFive } = this.goalForm.goals;

      // Create an array of the goals
      const goalsArray = [goalOne, goalTwo, goalThree, goalFour, goalFive];

      // Filter the array to only include non-empty values and return its length
      return goalsArray.filter(goal => goal && goal.trim() !== '').length;
    },
    filledAspirationsCount() {
      // Extract the aspirations from the goalForm
      const { aspirationOne, aspirationTwo, aspirationThree } = this.goalForm.aspirations;

      // Create an array of the aspirations
      const aspirationsArray = [aspirationOne, aspirationTwo, aspirationThree];

      // Filter the array to only include non-empty values and return its length
      return aspirationsArray.filter(aspiration => aspiration && aspiration.trim() !== '').length;
    },
    formattedExperiences() {
      return this.goalForm.experiences.map(experience => ({
        text: `${experience.experienceCategory}: ${experience.experienceName}`,
        value: experience.experienceID
      }));
    },
    isExperienceIDInvalid() {
      if (!this.formSubmitted) return false;
      return this.selectedExperience === null || this.selectedExperience === '';
    },
  isGoalSettingFormFilledCheck() {
    return this.hasFilledForm === true;
  },
  isCommunityEngagementExperiencesInvalid() {
    // If form hasn't been submitted or isGoalSettingFormFilledCheck = true i.e. it has already been filled, then skip validation
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked)) {
      return 'Information is required.';
    }
    return '';
  },
  isOtherEngagementExperienceInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const otherExperience = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.id === 6);
    return otherExperience.checked && !this.goalForm.communityEngagement.communityEngagementExperiencesOther;
  },
  isPreviousEngagementExperiencesInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.communityEngagement.previousEngagementExperiences.some(exp => exp.checked)) {
      return 'Information is required.';
    }
    return '';
  },
  isPreviousEngagementExperiencesOtherInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const previousExperience = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.id === 8);
    return previousExperience.checked && !this.goalForm.communityEngagement.previousEngagementExperiencesOther;
  },
  isEngagementActivitiesToolsInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.communityEngagement.engagementActivitiesTools.some(exp => exp.checked)) {
      return 'Information is required.';
    }
    return '';
  },
  isEngagementActivitiesToolOtherInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const engagementActivitiesTool = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.id === 8);
    return engagementActivitiesTool.checked && !this.goalForm.communityEngagement.engagementActivitiesToolOther;
  },
  isCurrentResearchExperienceInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.researchExperience.currentResearchExperience.some(exp => exp.checked)) {
      return 'Information is required.';
    }
    return '';
  },
  isCurrentResearchExperienceOtherInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const researchExperience = this.goalForm.researchExperience.currentResearchExperience.find(p => p.id === 7);
    return researchExperience.checked && !this.goalForm.researchExperience.currentResearchExperienceOther;
  },
  isPreviousResearchExperienceInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.researchExperience.previousResearchExperience.some(exp => exp.checked)) {
      return 'Information is required.';
    }
    return '';
  },
  isPreviousResearchExperienceOtherInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const previousExperience = this.goalForm.researchExperience.previousResearchExperience.find(p => p.id === 8);
    return previousExperience.checked && !this.goalForm.researchExperience.previousResearchExperienceOther;
  },
  isFamiliarToolsInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.researchExperience.familiarTools.some(exp => exp.checked)) {
      return 'Information is required.';
    }
    return '';
  },
  isFamiliarToolOtherInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const familiarTool = this.goalForm.researchExperience.familiarTools.find(p => p.id === 10);
    return familiarTool.checked && !this.goalForm.researchExperience.familiarToolOther;
  },
  isInterestResearchServiceInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.researchExperience.interestResearchService.some(exp => exp.checked)) {
      return 'Information is required.';
    }
    return '';
  },
  isInterestResearchServiceOtherInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const researchService = this.goalForm.researchExperience.interestResearchService.find(p => p.id === 8);
    return researchService.checked && !this.goalForm.researchExperience.interestResearchServiceOther;
  },
  isLeadershipOptionInvalid() {
    if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.goalForm.researchExperience.leadershipOption) !== true;
  },

  isProblemSolvingGoalInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.goalForm.growthGoal.problemSolvingGoal) !== true;
  },
  isEffectiveCommunicationGoalInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.goalForm.growthGoal.effectiveCommunicationGoal) !== true;
  },
  isTeamworkGoalInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.goalForm.growthGoal.teamworkGoal) !== true;
  },
  isCulturalHumilityGoalInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.goalForm.growthGoal.culturalHumilityGoal) !== true;
  },
  isEthicalDecisionMakingGoalInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.goalForm.growthGoal.ethicalDecisionMakingGoal) !== true;
  },
  isProfessionalResponsibilityGoalInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.goalForm.growthGoal.professionalResponsibilityGoal) !== true;
  },
  isAspirationsInvalid() {
    if (!this.formSubmitted) return false;
    return this.filledAspirationsCount < 2;
  },
  aspirationsErrorMessages() {
    if (this.formSubmitted && this.filledAspirationsCount < 2) {
      this.isAspirationsValid = false;
      return [this.getTranslation('Please fill out at least 2 aspirations.')];
    }
    this.isAspirationsValid = true;
    return [];
  },
  isGoalsInvalid() {
    if (!this.formSubmitted) return false;
    return this.filledGoalsCount < 3;
  },
  goalsErrorMessages() {
    if (this.formSubmitted && this.filledGoalsCount < 3) {
      this.isGoalsValid = false;
      return [this.getTranslation('Please fill out at least 3 goals.')];
    }
    this.isGoalsValid = true;
    return [];
  },
  isGrowthInvalid() {
    if (!this.formSubmitted) return false;
    return this.isProblemSolvingGoalInvalid || this.isEffectiveCommunicationGoalInvalid || this.isTeamworkGoalInvalid || this.isCulturalHumilityGoalInvalid || this.isEthicalDecisionMakingGoalInvalid || this.isProfessionalResponsibilityGoalInvalid || this.isAspirationsInvalid || this.isGoalsInvalid;
  },
  loading() {
    const store = useLoggedInUserStore();
    return store.loading;
  }

  }, 
  mounted() {
    useLoggedInUserStore().startLoading();

    try {
      this.fetchSemester();
      this.fetchExperiences().then(() => {
        this.fetchHasFilledForm();
        this.selectExperienceFromRouteParam();
      });
    } catch (error) {
      // Handle any errors that occur during the fetch operations
      console.error('Error:', error);
    } finally {
      useLoggedInUserStore().stopLoading();
    }
  },

  methods: {
    async fetchSemester() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goalForms/semester';

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.goalForm.semester = response.data.semesterName;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchExperiences() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/currentSemesterExperiences/';

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.goalForm.experiences = response.data.map(experience => ({
        experienceID: experience._id,
        experienceCategory: experience.experienceCategory,
        experienceName: experience.experienceName
      }));
        // this.goalForm.experiences = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  async fetchHasFilledForm() {
    const user = useLoggedInUserStore();
    let token = user.token;
    let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/hasFilledGoalSettingForm/';

    try {
      const response = await axios.get(apiURL, {
        headers: {
          token: token
        }
      });
      this.hasFilledForm = response.data.hasFilled;
      if (this.hasFilledForm) {
          this.goalForm.communityEngagement = response.data.communityEngagement;
          this.goalForm.researchExperience = response.data.researchExperience;
      }

    } catch (error) {
      console.error("Error fetching form fill status:", error);
    }
  },
  async checkExistingForm() {
      this.isLoadingExpCheck = true;
      const experienceID = this.selectedExperience;
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/hasCompletedGSFforSemesterExperience/';

      try {
        const response = await axios.get(apiURL + `${experienceID}`, {
          headers: {
            token: token
          }
        });

        // If the document wasn't found
        if (response.data.documentFound === false) {
          this.foundDocumentId = null;
          this.experienceFoundWarning = false;
          return;
        }

        // If a document was found
        if (response.data && response.data.id) {
          this.foundDocumentId = response.data.id;
          this.experienceFoundWarning = true;
        } else {
          this.foundDocumentId = null;
          this.experienceFoundWarning = false;
        }
      } catch (error) {
        console.error("An unexpected error occurred while checking for existing form:", error);
      } finally {
        this.isLoadingExpCheck = false; 
    }
  },
  updateExperienceID(selected) {
    // If the selected value is empty, set experienceID to null or an empty string and exit the method
    if (!selected) {
      this.goalForm.experienceID = null;
      return;
    }

    const experience = this.goalForm.experiences.find(exp => `${exp.experienceCategory}: ${exp.experienceName}` === selected);
    if (experience) {
      this.goalForm.experienceID = experience.experienceID;
    }
  },
  selectExperienceFromRouteParam() {
      const experienceIdFromRoute = this.$route.params.id;
      if (experienceIdFromRoute) {
        this.selectedExperience = experienceIdFromRoute;
      }
  },
  async submitFormValidation() {
    this.formSubmitted = true;
    const { valid } = await this.$refs.form.validate()

    //need to manually validate aspirations and goals because of multiple v-text-fields for one validation
    if (valid && !this.isAspirationsInvalid && !this.isGoalsInvalid) {
      this.cleanupFormData();
    } else {
      toast.error(this.getTranslation("Oops! Error(s) detected. Please review and try again."), {
        position: 'top-right',
        toastClassName: 'Toastify__toast--delete'
      });
    }
    return;
  },
  cleanupFormData() {
    // Check condition for "Other" text fields
    const isOtherCommunityEngagementExperiencesChecked = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.id === 6)?.checked || false;

    if (!isOtherCommunityEngagementExperiencesChecked) {
      this.goalForm.communityEngagement.communityEngagementExperiencesOther = '';
    }

    const isOtherPreviousEngagementExperienceChecked = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.id === 8)?.checked || false;

    if (!isOtherPreviousEngagementExperienceChecked) {
      this.goalForm.communityEngagement.previousEngagementExperiencesOther = '';
    }

    const isOtherEngagementActivitiesToolsChecked = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.id === 8)?.checked || false;

    if (!isOtherEngagementActivitiesToolsChecked) {
      this.goalForm.communityEngagement.engagementActivitiesToolOther= '';
    }

    const isOtherCurrentResearchExperienceChecked = this.goalForm.researchExperience.currentResearchExperience.find(p => p.id === 7)?.checked || false;

    if (!isOtherCurrentResearchExperienceChecked) {
      this.goalForm.researchExperience.currentResearchExperienceOther= '';
    }

    const isOtherPreviousResearchExperienceChecked = this.goalForm.researchExperience.previousResearchExperience.find(p => p.id === 8)?.checked || false;

    if (!isOtherPreviousResearchExperienceChecked) {
      this.goalForm.researchExperience.previousResearchExperienceOther= '';
    }

    const isOtherFamiliarToolsChecked = this.goalForm.researchExperience.familiarTools.find(p => p.id === 10)?.checked || false;

    if (!isOtherFamiliarToolsChecked) {
      this.goalForm.researchExperience.familiarToolOther= '';
    }

    const isInterestResearchServiceChecked = this.goalForm.researchExperience.interestResearchService.find(p => p.id === 8)?.checked || false;

    if (!isInterestResearchServiceChecked) {
      this.goalForm.researchExperience.interestResearchServiceOther= '';
    }

    //Check conditions for having not filled out form previously for semester (nested dependencies)
    if (this.isGoalSettingFormFilled === 'Yes') {
      this.goalForm.communityEngagement.communityEngagementExperiences.forEach(experience => {
          experience.checked = false;
      });
      this.goalForm.communityEngagement.communityEngagementExperiencesOther = '';
      
      this.goalForm.communityEngagement.previousEngagementExperiences.forEach(experience => {
          experience.checked = false;
      });
      this.goalForm.communityEngagement.previousEngagementExperiencesOther = '';
      
      this.goalForm.communityEngagement.engagementActivitiesTools.forEach(experience => {
          experience.checked = false;
      });
      this.goalForm.communityEngagement.engagementActivitiesToolOther = '';
      
      this.goalForm.researchExperience.currentResearchExperience.forEach(experience => {
          experience.checked = false;
      });
      this.goalForm.researchExperience.currentResearchExperienceOther = '';
      
      this.goalForm.researchExperience.previousResearchExperience.forEach(experience => {
          experience.checked = false;
      });
      this.goalForm.researchExperience.previousResearchExperienceOther = '';
      
      this.goalForm.researchExperience.familiarTools.forEach(experience => {
          experience.checked = false;
      });
      this.goalForm.researchExperience.familiarToolOther = '';
      
      this.goalForm.researchExperience.interestResearchService.forEach(experience => {
          experience.checked = false;
      });
      this.goalForm.researchExperience.interestResearchServiceOther = '';
      
      this.goalForm.researchExperience.leadershipOption = '';
  }

  // Ensure that aspirations and goals are in order

  // Extract the aspirations from the goalForm
    const aspirationsArray = [
        this.goalForm.aspirations.aspirationOne,
        this.goalForm.aspirations.aspirationTwo,
        this.goalForm.aspirations.aspirationThree
    ];

    // Filter out empty aspirations
    const filledAspirations = aspirationsArray.filter(aspiration => aspiration && aspiration.trim() !== '');

    // Reset the aspirations in the goalForm
    this.goalForm.aspirations.aspirationOne = filledAspirations[0] || '';
    this.goalForm.aspirations.aspirationTwo = filledAspirations[1] || '';
    this.goalForm.aspirations.aspirationThree = filledAspirations[2] || '';

    // Extract the goals from the goalForm
    const goalsArray = [
        this.goalForm.goals.goalOne,
        this.goalForm.goals.goalTwo,
        this.goalForm.goals.goalThree,
        this.goalForm.goals.goalFour,
        this.goalForm.goals.goalFive
    ];

    // Filter out empty goals
    const filledGoals = goalsArray.filter(goal => goal && goal.trim() !== '');

    // Reset the goals in the goalForm
    this.goalForm.goals.goalOne = filledGoals[0] || '';
    this.goalForm.goals.goalTwo = filledGoals[1] || '';
    this.goalForm.goals.goalThree = filledGoals[2] || '';
    this.goalForm.goals.goalFour = filledGoals[3] || '';
    this.goalForm.goals.goalFive = filledGoals[4] || '';

    // After cleaning up the data, check whether to update or create
    if (this.foundDocumentId) {
        this.handleUpdateForm();
    } else {
        // If previously filled document wasn't found, create new document
        this.handleSubmitForm();
        
    }
  },
  async handleUpdateForm() {    
    const user = useLoggedInUserStore();
    let token = user.token;
    let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goalForms/' + this.foundDocumentId;

    const updatedGoalForm = {
      goalForm: {
        growthGoal: this.goalForm.growthGoal,
        aspirations: this.goalForm.aspirations,
        goals: this.goalForm.goals
      }
    };

  axios
    .put(apiURL, updatedGoalForm, { headers: { token } })
    .then(() => {
      const motivatingMessages = [
        "Goals updated successfully! Keep pushing forward!",
        "Great job updating your goals! Let's continue on this journey together!",
        "Goals refreshed! Remember, every step counts towards achieving them.",
        "You've adjusted your goals! Stay focused and you'll achieve them in no time.",
        "Way to keep refining your vision! Remember, it's the journey that counts.",
      ];
      const randomMessage = motivatingMessages[Math.floor(Math.random() * motivatingMessages.length)];
      
      // Update pinia store
      this.updateChecklistStore();

      this.$router.push({ 
            name: 'studentDashboard',
            params: {
              toastType: 'info',
              toastMessage: randomMessage,
              toastPosition: 'top-right',
              toastCSS: 'Toastify__toast--update'
          }
        });
    })
    .catch((error) => {
      console.log(error);
    });
},

  async handleSubmitForm() {
    const user = useLoggedInUserStore();
    let token = user.token;
    let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goalForms/';

    const goalForm = {
      semester: this.goalForm.semester,
      experienceID: this.selectedExperience,
      goalForm: {
        communityEngagement: {
          communityEngagementExperiences: this.goalForm.communityEngagement.communityEngagementExperiences,
          communityEngagementExperiencesOther: this.goalForm.communityEngagement.communityEngagementExperiencesOther,
          previousEngagementExperiences: this.goalForm.communityEngagement.previousEngagementExperiences,
          previousEngagementExperiencesOther: this.goalForm.communityEngagement.previousEngagementExperiencesOther,
          engagementActivitiesTools: this.goalForm.communityEngagement.engagementActivitiesTools,
          engagementActivitiesToolOther: this.goalForm.communityEngagement.engagementActivitiesToolOther,
        },
        researchExperience: {
          currentResearchExperience: this.goalForm.researchExperience.currentResearchExperience,
          currentResearchExperienceOther: this.goalForm.researchExperience.currentResearchExperienceOther,
          previousResearchExperience: this.goalForm.researchExperience.previousResearchExperience,
          previousResearchExperienceOther: this.goalForm.researchExperience.previousResearchExperienceOther,
          familiarTools: this.goalForm.researchExperience.familiarTools,
          familiarToolOther: this.goalForm.researchExperience.familiarToolOther,
          interestResearchService: this.goalForm.researchExperience.interestResearchService,
          interestResearchServiceOther: this.goalForm.researchExperience.interestResearchServiceOther,
          leadershipOption: this.goalForm.researchExperience.leadershipOption,
        },
        growthGoal: {
          problemSolvingGoal: this.goalForm.growthGoal.problemSolvingGoal,
          effectiveCommunicationGoal: this.goalForm.growthGoal.effectiveCommunicationGoal,
          teamworkGoal: this.goalForm.growthGoal.teamworkGoal,
          culturalHumilityGoal: this.goalForm.growthGoal.culturalHumilityGoal,
          ethicalDecisionMakingGoal: this.goalForm.growthGoal.ethicalDecisionMakingGoal,
          professionalResponsibilityGoal: this.goalForm.growthGoal.professionalResponsibilityGoal,
        },
        aspirations: {
          aspirationOne: this.goalForm.aspirations.aspirationOne,
          aspirationTwo: this.goalForm.aspirations.aspirationTwo,
          aspirationThree: this.goalForm.aspirations.aspirationThree,
        },
        goals: {
          goalOne: this.goalForm.goals.goalOne,
          goalTwo: this.goalForm.goals.goalTwo,
          goalThree: this.goalForm.goals.goalThree,
          goalFour: this.goalForm.goals.goalFour,
          goalFive: this.goalForm.goals.goalFive,
        },
      },
    };    

    axios
      .post(apiURL, goalForm, { headers: { token } })
      .then(() => {
        const motivatingMessages = [
          "Goals successfully set! You're on the right track!",
          "Great job setting your goals! Let's make them happen!",
          "Goals locked in! Believe in yourself and you'll achieve them.",
          "You've set your goals! Now, let's conquer them together!",
          "Your goals are set! Keep pushing forward and you'll achieve them.",
          "Way to go! Every goal you set brings you one step closer to success.",
        ];
        const randomMessage = motivatingMessages[Math.floor(Math.random() * motivatingMessages.length)];

        // Update pinia store
        this.updateChecklistStore();

      
        this.$router.push({ 
              name: 'studentDashboard',
              params: {
                toastType: 'success',
                toastMessage: this.getTranslation(randomMessage),
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async updateChecklistStore() {
    const user = useLoggedInUserStore();
    await user.checkFormCompletion();
  },

  },
}
</script>