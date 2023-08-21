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
  <p>isCommunityEngagementExperiencesInvalid: {{ isCommunityEngagementExperiencesInvalid }}</p>
  <p>isGoalSettingFormFilledCheck: {{ isGoalSettingFormFilledCheck }}</p>
  
  <v-form 
  ref="form"
  @submit.prevent="submitFormValidations">
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
            variant="underlined"
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
  <div v-for="engagementExperience in goalForm.communityEngagement.communityEngagementExperiences" :key="engagementExperience.id">
    <v-checkbox 
          ref="communityEngagementExperiencesRef"
      :class="{'error-text': formSubmitted && isCommunityEngagementExperiencesInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="engagementExperience.checked" 
        :label="engagementExperience.label"
        :rules="communityEngagementExperiencesRules"
    >
    </v-checkbox>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="engagementExperience.id === 6 && engagementExperience.checked">
        <v-col cols="12">
          <v-text-field 
            placeholder="Please Specify" 
            v-model="goalForm.communityEngagement.communityEngagementExperiencesOther" 
            outlined
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
</v-col>


<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">From your previous community engagement experiences, which of the following activities have you engaged in?</p>
  <div v-for="previousExperience in goalForm.communityEngagement.previousEngagementExperiences" :key="previousExperience.id">
      <v-checkbox 
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        :label="previousExperience.label" 
        v-model="previousExperience.checked"
      >
      </v-checkbox>
      <transition name="slide-y-transition">
      <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
      <v-text-field 
        placeholder="Please Specify" 
        v-model="goalForm.communityEngagement.previousEngagementExperiencesOther"
        outlined
      >
      </v-text-field>
    </v-col>
    </v-row>
    </transition>
    </div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">
    What, if any, tools have you used for community engagement activities?
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="activitiesTool in goalForm.communityEngagement.engagementActivitiesTools" :key="activitiesTool.id">
    <v-checkbox 
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="activitiesTool.checked" 
        :label="activitiesTool.label"
    >
    </v-checkbox>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="activitiesTool.id === 8 && activitiesTool.checked">
        <v-col cols="12">
          <v-text-field 
            placeholder="Please Specify" 
            v-model="goalForm.communityEngagement.engagementActivitiesToolOther" 
            outlined
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
</v-col>


<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">
    What kind of research experiences, if any, have you had? Check all that apply.
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="currentExperience in goalForm.researchExperience.currentResearchExperience" :key="currentExperience.id">
    <v-checkbox 
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="currentExperience.checked" 
        :label="currentExperience.label"
    >
    </v-checkbox>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="currentExperience.id === 7 && currentExperience.checked">
        <v-col cols="12">
          <v-text-field 
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.currentResearchExperienceOther" 
            outlined
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
</v-col>


<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">
    From your previous research experiences, which of the following activities have you engaged in?
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="previousExperience in goalForm.researchExperience.previousResearchExperience" :key="previousExperience.id">
    <v-checkbox 
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="previousExperience.checked" 
        :label="previousExperience.label"
    >
    </v-checkbox>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
          <v-text-field 
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.previousResearchExperienceOther" 
            outlined
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
</v-col>


<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">
    What, if any, tools are you familiar with?
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="familiarTool in goalForm.researchExperience.familiarTools" :key="familiarTool.id">
    <v-checkbox 
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="familiarTool.checked" 
        :label="familiarTool.label"
    >
    </v-checkbox>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="familiarTool.id === 10 && familiarTool.checked">
        <v-col cols="12">
          <v-text-field 
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.familiarToolOther" 
            outlined
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
</v-col>


<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">
    What are your research/service interests? Check all that apply.
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="interest in goalForm.researchExperience.interestResearchService" :key="interest.id">
    <v-checkbox 
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="interest.checked" 
        :label="interest.label"
    >
    </v-checkbox>

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="interest.id === 8 && interest.checked">
        <v-col cols="12">
          <v-text-field 
            placeholder="Please Specify" 
            v-model="goalForm.researchExperience.interestResearchServiceOther" 
            outlined
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
</v-col>


<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedPreviousEngagementExperience || errors.otherPreviousEngagementExperienceText}">Are you interested in potentially holding a leadership position?</p>
  <v-radio-group v-model="goalForm.researchExperience.leadershipOption" :error="!!errors.problemSolvingGoal">
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
  <p class="font-weight-black text-h8" style="margin-bottom: 2px;">
    <span
    :class="{'error-text': isAspirationsInvalid}"
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
    :error-messages="aspirationsErrorMessages"
  ></v-text-field>

  <v-text-field
    ref="aspiration2Field"
    label="Aspiration 2:"
    v-model="goalForm.aspirations.aspirationTwo"
    :error-messages="aspirationsErrorMessages"
  ></v-text-field>

  <v-text-field
    ref="aspiration3Field"
    label="Aspiration 3:"
    v-model="goalForm.aspirations.aspirationThree"
    :error-messages="aspirationsErrorMessages"
  ></v-text-field>
</v-col>




<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">
    <span
    :class="{'error-text': isGoalsInvalid && formSubmitted}"
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
    :error-messages="goalsErrorMessages"
  ></v-text-field>

  <v-text-field
    label="Goal 2:"
    v-model="goalForm.goals.goalTwo"
    :error-messages="goalsErrorMessages"
  ></v-text-field>

  <v-text-field
    label="Goal 3:"
    v-model="goalForm.goals.goalThree"
    :error-messages="goalsErrorMessages"
  ></v-text-field>

  <v-text-field
    label="Goal 4:"
    v-model="goalForm.goals.goalFour"
    :error-messages="goalsErrorMessages"
  ></v-text-field>

  <v-text-field
    label="Goal 5:"
    v-model="goalForm.goals.goalFive"
    :error-messages="goalsErrorMessages"
  ></v-text-field>
  
  <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.goalFormGoals}}</div>
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


</style>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
  data() {
    return {
      selectedExperience: null,
      errors: {},
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
      isGoalsInvalid: null,
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
            return true;
          }
          
          return this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked) || 'Information is required.';
        }
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

        // Add additional validations or logic here as needed
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

        // Add additional validations or logic here as needed
      }
    },
    'isGoalSettingFormFilled'(newValue) {
      if (newValue === 'Yes' && this.formSubmitted) {
          // Trigger validation on the fields
          // this.$refs.uhEmailField.validate();
          // this.$refs.peopleSoftIDField.validate();
          // this.$refs.majorsField.validate();
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
    return this.formSubmitted && this.isGoalSettingFormFilled === 'Yes';
  },
  isCommunityEngagementExperiencesInvalid() {
    // If isGoalSettingFormFilledCheck = true i.e. it has already been filled, then skip validation
    if (this.isGoalSettingFormFilledCheck) return '';

    // Check if at least one checkbox is checked
    if (!this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked)) {
      return 'Information is required.';
    }

    return '';
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
  // isGoalsInvalid() {
  //   if (!this.formSubmitted) return false;
  //   return this.filledGoalsCount < 3;
  // },
  goalsErrorMessages() {
    if (this.formSubmitted && this.filledGoalsCount < 3) {
      this.isGoalsInvalid = false;
      return ['Please fill out at least 3 goals.'];
    }
    this.isGoalsInvalid = true;
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
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchExperiences() {
    const user = useLoggedInUserStore();
    let token = user.token;
    let apiURL = import.meta.env.VITE_ROOT_API + '/instructorSideData/experiences/';

    try {
      const response = await axios.get(apiURL, { headers: { token } });
      this.goalForm.experiences = response.data.map(experience => ({
      experienceID: experience._id,
      experienceCategory: experience.experienceCategory,
      experienceName: experience.experienceName
    }));
      // this.goalForm.experiences = response.data;
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  },
  updateExperienceID(selected) {
    console.log('updateexperienceID called');

    // If the selected value is empty, set experienceID to null or an empty string and exit the method
    if (!selected) {
      this.goalForm.experienceID = null; // or '' if you prefer an empty string
      return;
    }

    const experience = this.goalForm.experiences.find(exp => `${exp.experienceCategory}: ${exp.experienceName}` === selected);
    if (experience) {
      console.log('found selected experience:', experience);
      this.goalForm.experienceID = experience.experienceID;
      console.log('experience.experienceID : ', experience.experienceID);
    }
  },
  async submitFormValidation() {
    this.formSubmitted = true;
    const { valid } = await this.$refs.form.validate()

    //need to manually validate aspirations and goals because of multiple v-text-fields for one validation
    if (valid && this.isAspirationsValid && this.isGoalsInvalid) {
      console.log('Form is valid');
    } else {
      this.$refs.communityEngagementExperiencesRef.validate();
      console.log('Form is invalid');
    }
    return;
    this.errors = {}
    if (!this.goalForm.experienceID) {
        this.errors.experienceID = 'Experience is required.'
    }

    ///validation for if goal setting form was filled before
    if (!this.isGoalSettingFormFilled) {
        this.errors.isGoalSettingFormFilled = 'If form is previously filled is required.'
    }

// Validation for communityEngagementExperiences
let noCheckedEngagementExperience = true;
let otherEngagementExperienceChecked = false;

for (const engagementExperience of this.goalForm.communityEngagement.communityEngagementExperiences) {
  if (engagementExperience.checked) {
    noCheckedEngagementExperience = false;
    if (engagementExperience.id === 6) {
      otherEngagementExperienceChecked = true;
      if (!this.goalForm.communityEngagement.communityEngagementExperiencesOther) {
        this.errors.otherEngagementExperienceText = 'Text is required for the "Other" experience.';
      }
    }
  }
}

if (noCheckedEngagementExperience) {
  this.errors.noCheckedEngagementExperience = 'At least one community engagement experience should be checked.';
}

// Validation for previousEngagementExperiences
let noCheckedPreviousEngagementExperience = true;
let otherPreviousEngagementExperienceChecked = false;

for (const previousEngagementExperience of this.goalForm.communityEngagement.previousEngagementExperiences) {
  if (previousEngagementExperience.checked) {
    noCheckedPreviousEngagementExperience = false;
    if (previousEngagementExperience.id === 8) {
      otherPreviousEngagementExperienceChecked = true;
      if (!this.goalForm.communityEngagement.previousEngagementExperiencesOther) {
        this.errors.otherPreviousEngagementExperienceText = 'Text is required for the "Other" experience.';
      }
    }
  }
}

if (noCheckedPreviousEngagementExperience) {
  this.errors.noCheckedPreviousEngagementExperience = 'At least one previous engagement experience should be checked.';
}

// Validation for engagementActivitiesTools
let noCheckedEngagementActivitiesTool = true;
let otherEngagementActivitiesToolChecked = false;

for (const engagementActivitiesTool of this.goalForm.communityEngagement.engagementActivitiesTools) {
  if (engagementActivitiesTool.checked) {
    noCheckedEngagementActivitiesTool = false;
    if (engagementActivitiesTool.id === 8) {
      otherEngagementActivitiesToolChecked = true;
      if (!this.goalForm.communityEngagement.engagementActivitiesToolOther) {
        this.errors.otherEngagementActivitiesToolText = 'Text is required for the "Other" tool.';
      }
    }
  }
}

if (noCheckedEngagementActivitiesTool) {
  this.errors.noCheckedEngagementActivitiesTool = 'At least one engagement activities tool should be checked.';
}

// Validation for researchExperience
let noCheckedResearchExperience = true;
let otherResearchExperienceChecked = false;

for (const currentExperience of this.goalForm.researchExperience.currentResearchExperience) {
  if (currentExperience.checked) {
    noCheckedResearchExperience = false;
    if (currentExperience.id === 7) {
      otherResearchExperienceChecked = true;
      if (!this.goalForm.researchExperience.currentResearchExperienceOther) {
        this.errors.otherCurrentExperienceText = 'Text is required for the "Other" experience.';
      }
    }
  }
}

if (noCheckedResearchExperience) {
  this.errors.noCheckedResearchExperience = 'At least one research experience should be checked.';
}

// Validation for previousResearchExperience
let noCheckedPreviousExperience = true;
let otherPreviousExperienceChecked = false;

for (const previousExperience of this.goalForm.researchExperience.previousResearchExperience) {
  if (previousExperience.checked) {
    noCheckedPreviousExperience = false;
    if (previousExperience.id === 8) {
      otherPreviousExperienceChecked = true;
      if (!this.goalForm.researchExperience.previousResearchExperienceOther) {
        this.errors.otherPreviousExperienceText = 'Text is required for the "Other" experience.';
      }
    }
  }
}

if (noCheckedPreviousExperience) {
  this.errors.noCheckedPreviousExperience = 'At least one previous experience should be checked.';
}

// Validation for familiarTools
let noCheckedFamiliarTools = true;
let otherFamiliarToolChecked = false;

for (const familiarTool of this.goalForm.researchExperience.familiarTools) {
  if (familiarTool.checked) {
    noCheckedFamiliarTools = false;
    if (familiarTool.id === 10) {
      otherFamiliarToolChecked = true;
      if (!this.goalForm.researchExperience.familiarToolOther) {
        this.errors.otherFamiliarToolText = 'Text is required for the "Other" tool.';
      }
    }
  }
}

if (noCheckedFamiliarTools) {
  this.errors.noCheckedFamiliarTools = 'At least one familiar tool should be checked.';
}

// Validation for interestResearchService
let noCheckedInterestResearchService = true;
let otherInterestResearchServiceChecked = false;

for (const interest of this.goalForm.researchExperience.interestResearchService) {
  if (interest.checked) {
    noCheckedInterestResearchService = false;
    if (interest.id === 8) {
      otherInterestResearchServiceChecked = true;
      if (!this.goalForm.researchExperience.interestResearchServiceOther) {
        this.errors.otherInterestResearchServiceText = 'Text is required for the "Other" interest.';
      }
    }
  }
}

if (noCheckedInterestResearchService) {
  this.errors.noCheckedInterestResearchService = 'At least one research/service interest should be checked.';
}
if (!this.goalForm.growthGoal.problemSolvingGoal) {
      this.errors.problemSolvingGoal = 'Please input a response'
    }
    if (!this.goalForm.growthGoal.effectiveCommunicationGoal) {
      this.errors.effectiveCommunicationGoal = 'Please input a response'
    }
    if (!this.goalForm.growthGoal.culturalHumilityGoal) {
      this.errors.culturalHumilityGoal = 'Please input a response'
    }
    if (!this.goalForm.growthGoal.teamworkGoal) {
      this.errors.teamworkGoal = 'Please input a response'
    }
    if (!this.goalForm.growthGoal.ethicalDecisionMakingGoal) {
      this.errors.ethicalDecisionMakingGoal = 'Please input a response'
    }
    if (!this.goalForm.growthGoal.professionalResponsibilityGoal) {
      this.errors.professionalResponsibilityGoal = 'Please input a response.'
    }
    if (this.filledAspirationsCount < 2) {
      this.errors.goalFormAspirations = 'At least 2 aspirations are required.'
    }
    if (this.filledGoalsCount < 3) {
      this.errors.goalFormGoals = 'At least 3 goals are required.'
    }
    if (Object.keys(this.errors).length === 0) {
      this.handleSubmitForm();
    }
  },
  async handleSubmitForm() {
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
      this.goalForm = {
        semester: '',
        primaryLanguage: '',
        experienceID: '',
        communityEngagement: {
          communityEngagementExperiences: [],
          communityEngagementExperiencesOther: '',
          previousEngagementExperiences: [],
          previousEngagementExperiencesOther: '',
          engagementActivitiesTools: [],
          engagementActivitiesToolOther: '',
        },
        researchExperience: {
          currentResearchExperience: [],
          currentResearchExperienceOther: '',
          previousResearchExperience: [],
          previousResearchExperienceOther: '',
          familiarTools: [],
          familiarToolOther: '',
          interestResearchService: [],
          interestResearchServiceOther: '',
          leadershipOption: '',
        },
        growthGoal: {
          problemSolvingGoal: '',
          effectiveCommunicationGoal: '',
          teamworkGoal: '',
          culturalHumilityGoal: '',
          ethicalDecisionMakingGoal: '',
          professionalResponsibilityGoal: '',
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
        },
      };
    
      alert("Goal form has been successfully submitted.");
      this.$router.push('/studentDashboard');
    })
    .catch((error) => {
      console.log(error);
    });
}

  },
}
</script>