<!-- /goalSettingForm -->
<!-- might need to adjustcommunityEngagementExperiences
Array to match others and add input fields for goals and aspirations  -->
<template>
  <!-- <p>this.formSubmitted: {{formSubmitted}}</p>
  <p>isExperienceIDInvalid: {{isExperienceIDInvalid}}</p>
  <p>goalForm.experienceID: {{goalForm.experienceID}}</p>
  <p>experienceIDRules: {{experienceIDRules}}</p> -->
  <!-- <p>isIsGoalSettingFormFilledInvalid: {{ isIsGoalSettingFormFilledInvalid }}</p>
  <p>isAspirationsValid {{ isAspirationsValid }}</p> -->
  <!-- <p>isCommunityEngagementExperiencesInvalid: {{ isCommunityEngagementExperiencesInvalid }}</p>
  <p>isGoalSettingFormFilledCheck: {{ isGoalSettingFormFilledCheck }}</p> -->
  
  <v-form 
  ref="form"
  @submit.prevent>
  <v-container>
    <div>
      <p class="font-weight-black text-h5 text--primary">Goal Setting Form</p>
      <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.</p>
    </div>
    <v-row>
      <v-col cols="12" md="5">
        <p class="font-weight-black text-h8">Current Semester:</p>
        <v-text-field v-model="goalForm.semester" label="Semester" readonly></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11" md="10">
        <p 
        :class="{'error-text': isExperienceIDInvalid}"
        class="font-weight-black text-h8">
          Which experience are you filling out this form for:
        </p>
        <div>
          <v-autocomplete
            v-model="selectedExperience"
            label="Select an Experience"
            :items="formattedExperiences"
            clearable
            @update:modelValue="updateExperienceID"
            :rules="experienceIDRules"
            required
          ></v-autocomplete>




        </div>
      </v-col>
    </v-row>

<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isIsGoalSettingFormFilledInvalid}"
  class="font-weight-black text-h8">Have you already filled out this form for another experience this semester?</p>
  <v-radio-group 
  v-model="isGoalSettingFormFilled"
  :rules="isGoalSettingFormFilledRules"
  :class="{'error-text': isIsGoalSettingFormFilledInvalid}">
    <v-radio label="Yes" value="Yes"></v-radio>
    <v-radio label="No" value="No"></v-radio>
  </v-radio-group>
</v-col>

<transition-group name="slide-y-transition" tag="div">
<div v-show="isGoalSettingFormFilled === 'No'" key="neverFilledForm">


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': formSubmitted && isCommunityEngagementExperiencesInvalid}"
  class="font-weight-black text-h8">
    What kind of community engagement experiences, if any, have you had? Check all that apply.
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
        :label="engagementExperience.label"
        :rules="communityEngagementExperiencesRules"
        :indeterminate="goalForm.communityEngagement.communityEngagementExperiences[goalForm.communityEngagement.communityEngagementExperiences.length - 1].checked && !engagementExperience.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.communityEngagement.communityEngagementExperiences[goalForm.communityEngagement.communityEngagementExperiences.length - 1].checked && !engagementExperience.checked && hoveredCheckboxID1 === engagementExperience.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0);"
      >
          De-select "None of the above" to select this.
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="engagementExperience.id === 6 && engagementExperience.checked">
        <v-col cols="12">
          <v-text-field
            ref="otherExperienceField"
            placeholder="Please Specify" 
            :class="{'error-text': isOtherEngagementExperienceInvalid}"
            v-model="goalForm.communityEngagement.communityEngagementExperiencesOther"
            :rules="communityEngagementExperiencesOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>

  <div v-if="isCommunityEngagementExperiencesInvalid" class="styled-error-text">Information is required</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isPreviousEngagementExperiencesInvalid}"
  class="font-weight-black text-h8">From your previous community engagement experiences, which of the following activities have you engaged in?</p>
  <div v-for="previousExperience in goalForm.communityEngagement.previousEngagementExperiences" :key="previousExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID2 = previousExperience.id" 
  @mouseleave="hoveredCheckboxID2 = null">
      <v-checkbox 
      :class="{'error-text': isPreviousEngagementExperiencesInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        :label="previousExperience.label" 
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
        style="transform: translate(-100%, 0);"
      >
          De-select "None of the above" to select this.
      </span>
    </transition>
      <transition name="slide-y-transition">
      <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
      <v-text-field 
      ref="previousEngagementExperiencesOtherRef"
      :class="{'error-text': isPreviousEngagementExperiencesOtherInvalid}"
        placeholder="Please Specify" 
        v-model="goalForm.communityEngagement.previousEngagementExperiencesOther"
        :rules="previousEngagementExperiencesOtherRules"
      >
      </v-text-field>
    </v-col>
    </v-row>
    </transition>
    </div>
    <div v-if="isPreviousEngagementExperiencesInvalid" class="styled-error-text">Information is required</div>
</v-col>

<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isEngagementActivitiesToolsInvalid}"
  class="font-weight-black text-h8">
    What, if any, tools have you used for community engagement activities?
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
        :label="activitiesTool.label"
        :rules="engagementActivitiesToolsRules"
        :indeterminate="goalForm.communityEngagement.engagementActivitiesTools[goalForm.communityEngagement.engagementActivitiesTools.length - 1].checked && !activitiesTool.checked"
    >
    </v-checkbox>
    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.communityEngagement.engagementActivitiesTools[goalForm.communityEngagement.engagementActivitiesTools.length - 1].checked && !activitiesTool.checked && hoveredCheckboxID3 === activitiesTool.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0);"
      >
          De-select "None of the above" to select this.
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="activitiesTool.id === 8 && activitiesTool.checked">
        <v-col cols="12">
          <v-text-field 
          ref="engagementActivitiesToolOtherRef"
          :class="{'error-text': isEngagementActivitiesToolOtherInvalid}"
            placeholder="Please Specify" 
            v-model="goalForm.communityEngagement.engagementActivitiesToolOther" 
            :rules="engagementActivitiesToolOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isEngagementActivitiesToolsInvalid" class="styled-error-text">Information is required</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isCurrentResearchExperienceInvalid}"
  class="font-weight-black text-h8">
    What kind of research experiences, if any, have you had? Check all that apply.
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
        :label="currentExperience.label"
        :rules="currentResearchExperienceRules"
        :indeterminate="goalForm.researchExperience.currentResearchExperience[goalForm.researchExperience.currentResearchExperience.length - 1].checked && !currentExperience.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.currentResearchExperience[goalForm.researchExperience.currentResearchExperience.length - 1].checked && !currentExperience.checked && hoveredCheckboxID4 === currentExperience.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0);"
      >
          De-select "None of the above" to select this.
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="currentExperience.id === 7 && currentExperience.checked">
        <v-col cols="12">
          <v-text-field 
          ref="currentResearchExperienceOtherRef"
          :class="{'error-text': isCurrentResearchExperienceOtherInvalid}"
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.currentResearchExperienceOther" 
            :rules="currentResearchExperienceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isCurrentResearchExperienceInvalid" class="styled-error-text">Information is required</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isPreviousResearchExperienceInvalid}"
  class="font-weight-black text-h8">
    From your previous research experiences, which of the following activities have you engaged in?
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
        :label="previousExperience.label"
        :rules="previousResearchExperienceRules"
        :indeterminate="goalForm.researchExperience.previousResearchExperience[goalForm.researchExperience.previousResearchExperience.length - 1].checked && !previousExperience.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.previousResearchExperience[goalForm.researchExperience.previousResearchExperience.length - 1].checked && !previousExperience.checked && hoveredCheckboxID5 === previousExperience.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0);"
      >
          De-select "None of the above" to select this.
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
          <v-text-field 
          ref="previousResearchExperienceOtherRef"
          :class="{'error-text': isPreviousResearchExperienceOtherInvalid}"
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.previousResearchExperienceOther" 
            :rules="previousResearchExperienceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isPreviousResearchExperienceInvalid" class="styled-error-text">Information is required</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isFamiliarToolsInvalid}"
  class="font-weight-black text-h8">
    What, if any, tools are you familiar with?
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
        :label="familiarTool.label"
        :rules="familiarToolsRules"
        :indeterminate="goalForm.researchExperience.familiarTools[goalForm.researchExperience.familiarTools.length - 1].checked && !familiarTool.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.familiarTools[goalForm.researchExperience.familiarTools.length - 1].checked && !familiarTool.checked && hoveredCheckboxID6 === familiarTool.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0);"
      >
          De-select "None of the above" to select this.
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="familiarTool.id === 10 && familiarTool.checked">
        <v-col cols="12">
          <v-text-field 
          ref="familiarToolOtherRef"
          :class="{'error-text': isFamiliarToolOtherInvalid}"
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.familiarToolOther" 
            :rules="familiarToolOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isFamiliarToolsInvalid" class="styled-error-text">Information is required</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isInterestResearchServiceInvalid}"
  class="font-weight-black text-h8">
    What are your research/service interests? Check all that apply.
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
        :label="interest.label"
        :rules="interestResearchServiceRules"
        :indeterminate="goalForm.researchExperience.interestResearchService[goalForm.researchExperience.interestResearchService.length - 1].checked && !interest.checked"
    >
    </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
      v-if="goalForm.researchExperience.interestResearchService[goalForm.researchExperience.interestResearchService.length - 1].checked && !interest.checked && hoveredCheckboxID7 === interest.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0);"
      >
          De-select "None of the above" to select this.
      </span>
    </transition>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="interest.id === 8 && interest.checked">
        <v-col cols="12">
          <v-text-field 
          ref="interestResearchServiceOtherRef"
          :class="{'error-text': isInterestResearchServiceOtherInvalid}"
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.interestResearchServiceOther" 
            :rules="interestResearchServiceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isInterestResearchServiceInvalid" class="styled-error-text">Information is required</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isLeadershipOptionInvalid}"
  class="font-weight-black text-h8">Are you interested in potentially holding a leadership position?</p>
  <v-radio-group 
  :class="{'error-text': isLeadershipOptionInvalid}"
  v-model="goalForm.researchExperience.leadershipOption"
  :rules="leadershipOptionRules">
    <v-radio label="Yes" value="Yes"></v-radio>
    <v-radio label="Maybe" value="Maybe"></v-radio>
    <v-radio label="No" value="No"></v-radio>
  </v-radio-group>
</v-col>

</div>
</transition-group>

<!-- growth section -->
<p 
:class="{'error-text': isGrowthInvalid}"
class="font-weight-black text-h6">Growth</p>
<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isProblemSolvingGoalInvalid}"
  class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>problem solving</u>.</p>
  <v-radio-group 
  :class="{'error-text': isProblemSolvingGoalInvalid}"
  v-model="goalForm.growthGoal.problemSolvingGoal" 
  :rules="problemSolvingGoalRules"
  >
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isEffectiveCommunicationGoalInvalid}"
  class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>effective communication</u>.</p>
  <v-radio-group 
  v-model="goalForm.growthGoal.effectiveCommunicationGoal"
  :class="{'error-text': isEffectiveCommunicationGoalInvalid}"
  :rules="effectiveCommunicationGoalRules">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isTeamworkGoalInvalid}"
  class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>teamwork</u>.</p>
  <v-radio-group 
  v-model="goalForm.growthGoal.teamworkGoal"
  :class="{'error-text': isTeamworkGoalInvalid}"
  :rules="teamworkGoalRules">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isCulturalHumilityGoalInvalid}"
  class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>cultural humility</u>.</p>
  <v-radio-group 
  v-model="goalForm.growthGoal.culturalHumilityGoal"
  :class="{'error-text': isCulturalHumilityGoalInvalid}"
  :rules="culturalHumilityGoalRules">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isEthicalDecisionMakingGoalInvalid}"
  class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>ethical decision making</u>.</p>
  <v-radio-group 
  v-model="goalForm.growthGoal.ethicalDecisionMakingGoal"
  :class="{'error-text': isEthicalDecisionMakingGoalInvalid}"
  :rules="ethicalDecisionMakingGoalRules">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isProfessionalResponsibilityGoalInvalid}"
  class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>professional responsibility</u>.</p>
  <v-radio-group 
  v-model="goalForm.growthGoal.professionalResponsibilityGoal"
  :class="{'error-text': isProfessionalResponsibilityGoalInvalid}"
  :rules="professionalResponsibilityGoalRules"
  >
    <v-radio label="No growth" value="No growth" ></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isAspirationsInvalid}"
  class="font-weight-black text-h8" style="margin-bottom: 2px;">
    <span
    >Please describe 2-3 long-term aspirations you may have.</span>
      <br><br>
    Aspirations are statements that describe where you want to end up without necessarily describing exactly how you will get there. 
    <br> Examples:
    <br>
    <ul>
      <li>“I want to focus my career on cancer disparities”</li>
      <li>“I want to lead a non-profit that addresses food insecurity”</li>
      <li>“I want to teach English in a different country”</li>
    </ul>  
  </p>

  <v-text-field
    ref="aspiration1Field"
    label="Aspiration 1:"
    v-model="goalForm.aspirations.aspirationOne"
    :error="isAspirationsInvalid"
  ></v-text-field>

  <v-text-field
    ref="aspiration2Field"
    label="Aspiration 2:"
    v-model="goalForm.aspirations.aspirationTwo"
    :error="isAspirationsInvalid"
  ></v-text-field>

  <v-text-field
    ref="aspiration3Field"
    label="Aspiration 3:"
    v-model="goalForm.aspirations.aspirationThree"
    :error-messages="aspirationsErrorMessages"
  ></v-text-field>
</v-col>




<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isGoalsInvalid}"
  class="font-weight-black text-h8">
    <span
    >Please outline 3-5 goals that you have for this experience.</span> 
    <br><br>
    Goals are statements that describe what it means for an experience to be a success from your perspective,<br>
    Examples:<br>
    <ul>
      <li>“I want to connect with people working on cancer research”</li>
      <li>“I want to research access to nutrition education in public schools”</li>
      <li>“I want to develop my presentation skills”</li>
    </ul>
  </p>

  <v-text-field
    label="Goal 1:"
    v-model="goalForm.goals.goalOne"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
    label="Goal 2:"
    v-model="goalForm.goals.goalTwo"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
    label="Goal 3:"
    v-model="goalForm.goals.goalThree"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
    label="Goal 4:"
    v-model="goalForm.goals.goalFour"
    :error="isGoalsInvalid"
  ></v-text-field>

  <v-text-field
    label="Goal 5:"
    v-model="goalForm.goals.goalFive"
    :error-messages="goalsErrorMessages"
  ></v-text-field>
  
</v-col>




<v-row>
  <v-col cols="12" md="4">
    <v-btn @click="submitFormValidation">Submit Form</v-btn>
  </v-col>
</v-row>
</v-container>
<!-- <p>ERRORS {{  this.errors }}</p>
<p>{{ filledGoalsCount }} goals filled out of 5</p>
<p>{{ filledAspirationsCount }} aspirations filled out of 3</p>


<p>goalForm: {{ goalForm }}</p> -->
</v-form>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
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
      experienceIDRules: [
        v => {
          if (this.formSubmitted) {
            return !!v || 'Information is required.';
          }
          return true;
        }
      ],
      isGoalSettingFormFilledRules: [
      v => {
              if (!this.formSubmitted) return true;

              return !!v || 'Information is required.';
          },
      ],
      communityEngagementExperiencesRules: [
        () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            console.log('skip validation');
            return true;
          }
          
          return this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked) || 'Information is required.';
        }
      ],
      communityEngagementExperiencesOtherRules: [
        v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const otherExperience = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.id === 6);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!otherExperience || !otherExperience.checked) return true;

              return !!v || 'If Other is selected, please specify.';
          },
      ],
      previousEngagementExperiencesRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked) || 'Information is required.';
        }
      ],
      previousEngagementExperiencesOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const previousExperience = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!previousExperience || !previousExperience.checked) return true;

              return !!v || 'If Other is selected, please specify.';
          },
      ],
      engagementActivitiesToolsRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.communityEngagement.engagementActivitiesTools.some(exp => exp.checked) || 'Information is required.';
        }
      ],
      engagementActivitiesToolOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const engagementActivitiesTool = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!engagementActivitiesTool || !engagementActivitiesTool.checked) return true;

              return !!v || 'If Other is selected, please specify.';
          },
      ],
      currentResearchExperienceRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.currentResearchExperience.some(exp => exp.checked) || 'Information is required.';
        }
      ],
      currentResearchExperienceOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const researchExperience = this.goalForm.researchExperience.currentResearchExperience.find(p => p.id === 7);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!researchExperience || !researchExperience.checked) return true;

              return !!v || 'If Other is selected, please specify.';
        }
      ],
      previousResearchExperienceRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.previousResearchExperience.some(exp => exp.checked) || 'Information is required.';
        }
      ],
      previousResearchExperienceOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const previousExperience = this.goalForm.researchExperience.previousResearchExperience.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!previousExperience || !previousExperience.checked) return true;

              return !!v || 'If Other is selected, please specify.';
        }
      ],
      familiarToolsRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.familiarTools.some(exp => exp.checked) || 'Information is required.';
        }
      ],
      familiarToolOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const familiarTool = this.goalForm.researchExperience.familiarTools.find(p => p.id === 10);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!familiarTool || !familiarTool.checked) return true;

              return !!v || 'If Other is selected, please specify.';
        }
      ],
      interestResearchServiceRules: [
      () => {
          if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) {
            return true;
          }
          
          return this.goalForm.researchExperience.interestResearchService.some(exp => exp.checked) || 'Information is required.';
        }
      ],
      interestResearchServiceOtherRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;
              
              const researchService = this.goalForm.researchExperience.interestResearchService.find(p => p.id === 8);

              // If the condition for v-show is false (Other not checked), validation passes automatically
              if (!researchService || !researchService.checked) return true;

              return !!v || 'If Other is selected, please specify.';
        }
      ],
      leadershipOptionRules: [
      v => {
              if (!this.formSubmitted || this.isGoalSettingFormFilledCheck) return true;

              return !!v || 'Information is required.';
          },
      ],

      problemSolvingGoalRules: [
        v => {
              if (!this.formSubmitted) return true;

              return !!v || 'Information is required.';
          },
      ],
      effectiveCommunicationGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || 'Information is required.';
        },
      ],
      teamworkGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || 'Information is required.';
        },
      ],
      culturalHumilityGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || 'Information is required.';
        },
      ],
      ethicalDecisionMakingGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || 'Information is required.';
        },
      ],
      professionalResponsibilityGoalRules: [
      v => {
            if (!this.formSubmitted) return true;

            return !!v || 'Information is required.';
        },
      ],
      aspirationsRules: [
        () => {
          if (this.formSubmitted && this.filledAspirationsCount < 2) {
            return 'Please fill out at least 2 aspirations.';
          }
          return true;
        }
      ],
      isAspirationsValid: true,
    }
  },
  watch: {
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
      return this.goalForm.experiences.map(experience => `${experience.experienceCategory}: ${experience.experienceName}`);
    },
    isExperienceIDInvalid() {
    if (!this.formSubmitted) return false;
    return this.experienceIDRules[0](this.goalForm.experienceID) !== true;
  },
  isIsGoalSettingFormFilledInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.isGoalSettingFormFilled) !== true;
  },
  isGoalSettingFormFilledCheck() {
    return this.isGoalSettingFormFilled === 'Yes';
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
      return ['Please fill out at least 2 aspirations.'];
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
      return ['Please fill out at least 3 goals.'];
    }
    this.isGoalsValid = true;
    return [];
  },
  isGrowthInvalid() {
    if (!this.formSubmitted) return false;
    return this.isProblemSolvingGoalInvalid || this.isEffectiveCommunicationGoalInvalid || this.isTeamworkGoalInvalid || this.isCulturalHumilityGoalInvalid || this.isEthicalDecisionMakingGoalInvalid || this.isProfessionalResponsibilityGoalInvalid || this.isAspirationsInvalid || this.isGoalsInvalid;
  },

  }, 
  mounted() {
    this.fetchSemester();
    this.fetchExperiences();
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
  updateExperienceID(selected) {

    // If the selected value is empty, set experienceID to null or an empty string and exit the method
    if (!selected) {
      this.goalForm.experienceID = null; // or '' if you prefer an empty string
      return;
    }

    const experience = this.goalForm.experiences.find(exp => `${exp.experienceCategory}: ${exp.experienceName}` === selected);
    if (experience) {
      this.goalForm.experienceID = experience.experienceID;
    }
  },
  async submitFormValidation() {
    this.formSubmitted = true;
    const { valid } = await this.$refs.form.validate()

    //need to manually validate aspirations and goals because of multiple v-text-fields for one validation
    if (valid) {
      this.cleanupFormData();
    } else {
      toast.error("Oops! Error(s) detected. Please review and try again.", {
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

    // After cleaning up the data, submit the form
    this.handleSubmitForm();
  },

  async handleSubmitForm() {
    console.log('submit form called');
    const user = useLoggedInUserStore();
    let token = user.token;
    let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goalForms/';

    const goalForm = {
      semester: this.goalForm.semester,
      experienceID: this.goalForm.experienceID,
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

      
        this.$router.push({ 
              name: 'studentDashboard',
              params: {
                toastType: 'success',
                toastMessage: randomMessage,
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  },
}
</script>