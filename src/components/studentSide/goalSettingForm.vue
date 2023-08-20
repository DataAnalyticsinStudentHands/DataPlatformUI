<!-- /goalSettingForm -->
<!-- might need to adjustcommunityEngagementExperiences
Array to match others and add input fields for goals and aspirations  -->
<template>
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
        <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.experienceID }">
          Which experience are you filling out this form for:
        </p>
        <div class="mt-2 text-sm text-red-600 dark:text-red-500"><b>{{errors.experienceID}}</b></div>
        <div>
          <select v-model="goalForm.experienceID" style="border: 1px solid #808080; padding: 5px; border-radius: 4px;">
            <option v-for="experience in goalForm.experiences" :value="experience.experienceID" :key="experience.experienceID">
              {{ experience.experienceCategory }}: {{ experience.experienceName }}
            </option>
          </select>
          
        </div>
      </v-col>
    </v-row>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.isGoalSettingFormFilled }">Have you already filled out this form for another experience this semester?</p>
  <v-radio-group v-model="isGoalSettingFormFilled" :error="!!errors.isGoalSettingFormFilled">
    <v-radio label="Yes" value="Yes"></v-radio>
    <v-radio label="No" value="No"></v-radio>
  </v-radio-group>
  <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.isGoalSettingFormFilled}}</div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedEngagementExperience || errors.otherEngagementExperienceText}">What kind of community engagement experiences, if any, have you had? Check all that apply.</p>
  <div v-for="engagementExperience in goalForm.communityEngagement.communityEngagementExperiences" :key="engagementExperience.id">
    <label style="color: #656565;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedEngagementExperience || errors.otherEngagementExperienceText}">
      <input type="checkbox" v-model="engagementExperience.checked" style="outline: 2px solid gray; margin-right: 5px;">
      {{ engagementExperience.label }}
    </label>
    <input v-if="engagementExperience.id === 6 && engagementExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.communityEngagement.communityEngagementExperiencesOther" style="margin-top: 5px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
  </div>
  <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.noCheckedEngagementExperience}}</div>
  <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.otherEngagementExperienceText}}</div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedPreviousEngagementExperience || errors.otherPreviousEngagementExperienceText}">From your previous community engagement experiences, which of the following activities have you engaged in?</p>
  <div style="padding: 10px;">
    <div v-for="previousExperience in goalForm.communityEngagement.previousEngagementExperiences" :key="previousExperience.id">
      <label style="display: flex; align-items: center; color: #808080;">
        <input type="checkbox" v-model="previousExperience.checked" style="outline: 2px solid #808080; margin-right: 10px;">
        {{ previousExperience.label }}
      </label>
      <input v-if="previousExperience.id === 8 && previousExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.communityEngagement.previousEngagementExperiencesOther" style="margin-top: 5px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
    </div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.noCheckedPreviousEngagementExperience}}</div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.otherPreviousEngagementExperienceText}}</div>
  </div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedEngagementActivitiesTool || errors.otherEngagementActivitiesToolText}">What, if any, tools have you used for community engagement activities?</p>
  <div style="padding: 10px;">
    <div v-for="activitiesTool in goalForm.communityEngagement.engagementActivitiesTools" :key="activitiesTool.id">
      <label style="display: flex; align-items: center; color: #808080;">
        <input type="checkbox" v-model="activitiesTool.checked" style="outline: 2px solid #808080; margin-right: 10px;">
        {{ activitiesTool.label }}
      </label>
      <input v-if="activitiesTool.id === 8 && activitiesTool.checked" type="text" placeholder="Please Specify" v-model="goalForm.communityEngagement.engagementActivitiesToolOther" style="margin-top: 5px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
    </div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.noCheckedEngagementActivitiesTool}}</div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.otherEngagementActivitiesToolText}}</div>
  </div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedResearchExperience || errors.otherCurrentExperienceText}">What kind of research experiences, if any, have you had? Check all that apply.</p>
  <div style="padding: 10px;">
    <div v-for="currentExperience in goalForm.researchExperience.currentResearchExperience" :key="currentExperience.id">
      <label style="display: flex; align-items: center; color: gray;">
        <input type="checkbox" v-model="currentExperience.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ currentExperience.label }}
      </label>
      <input v-if="currentExperience.id === 7 && currentExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.currentResearchExperienceOther" style="margin-top: 5px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
    </div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.noCheckedResearchExperience}}</div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.otherCurrentExperienceText}}</div>
  </div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8"  :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedPreviousExperience || errors.otherPreviousExperienceText}">From your previous research experiences, which of the following activities have you engaged in?</p>
  <div style="padding: 10px;">
    <div v-for="previousExperience in goalForm.researchExperience.previousResearchExperience" :key="previousExperience.id">
      <label style="display: flex; align-items: center; color: gray;">
        <input type="checkbox" v-model="previousExperience.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ previousExperience.label }}
      </label>
      <input v-if="previousExperience.id === 8 && previousExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.previousResearchExperienceOther" style="margin-top: 5px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
    </div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.noCheckedPreviousExperience}}</div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.otherPreviousExperienceText}}</div>
  </div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedFamiliarTools || errors.otherFamiliarToolText}">What, if any, tools are you familiar with?</p>
  <div style="padding: 10px;">
    <div v-for="familiarTool in goalForm.researchExperience.familiarTools" :key="familiarTool.id">
      <label style="display: flex; align-items: center; color: gray; margin-right: 10px;">
        <input type="checkbox" v-model="familiarTool.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ familiarTool.label }}
      </label>
      <input v-if="familiarTool.id === 10 && familiarTool.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.familiarToolOther" style="margin-top: 5px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
    </div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.noCheckedFamiliarTools}}</div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.otherFamiliarToolText}}</div>
  </div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedInterestResearchService || errors.otherInterestResearchServiceText}">What are your research/service interests? Check all that apply.</p>
  <div style="padding: 10px;">
    <div v-for="interest in goalForm.researchExperience.interestResearchService" :key="interest.id">
      <label style="display: flex; align-items: center; color: gray; margin-right: 10px;">
        <input type="checkbox" v-model="interest.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ interest.label }}
      </label>
      <input v-if="interest.id === 8 && interest.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.interestResearchServiceOther" style="margin-top: 5px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
    </div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.noCheckedInterestResearchService}}</div>
    <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.otherInterestResearchServiceText}}</div>
  </div>
</v-col>

<v-col cols="12" md="10" v-if="isGoalSettingFormFilled === 'No'">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.noCheckedPreviousEngagementExperience || errors.otherPreviousEngagementExperienceText}">Are you interested in potentially holding a leadership position?</p>
  <v-radio-group v-model="goalForm.researchExperience.leadershipOption" :error="!!errors.problemSolvingGoal">
    <v-radio label="Yes" value="Yes"></v-radio>
    <v-radio label="Maybe" value="Maybe"></v-radio>
    <v-radio label="No" value="No"></v-radio>
  </v-radio-group>
</v-col>

<!-- growth section -->
<p class="font-weight-black text-h6">Growth</p>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.problemSolvingGoal }">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>problem solving</u>.</p>
  <v-radio-group v-model="goalForm.growthGoal.problemSolvingGoal" :error="!!errors.problemSolvingGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.effectiveCommunicationGoal }">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>effective communication</u>.</p>
  <v-radio-group v-model="goalForm.growthGoal.effectiveCommunicationGoal" :error="!!errors.effectiveCommunicationGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.teamworkGoal }">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>teamwork</u>.</p>
  <v-radio-group v-model="goalForm.growthGoal.teamworkGoal" :error="!!errors.teamworkGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.culturalHumilityGoal }">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>cultural humility</u>.</p>
  <v-radio-group v-model="goalForm.growthGoal.culturalHumilityGoal" :error="!!errors.culturalHumilityGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.ethicalDecisionMakingGoal }">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>ethical decision making</u>.</p>
  <v-radio-group v-model="goalForm.growthGoal.ethicalDecisionMakingGoal" :error="!!errors.ethicalDecisionMakingGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.professionalResponsibilityGoal }">Please indicate your expectation of the growth you anticipate to see during your program in the area of <u>professional responsibility</u>.</p>
  <v-radio-group v-model="goalForm.growthGoal.professionalResponsibilityGoal" :error="!!errors.professionalResponsibilityGoal">
    <v-radio label="No growth" value="No growth" ></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>


<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormAspirations }">Please describe 2-3 long-term aspirations you may have.<br><br> Aspirations are statements that describe where you want to end up without necessarily describing exactly how you will get there. <br> Examples:
    <br><ul><li>“I want to focus my career on cancer disparities”</li><li>“I want to lead a non-profit that addresses food insecurity”</li><li>“I want to teach English in a different country”</li></ul>  </p>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormAspirations }">Aspiration 1: </label>
  <input type="text" v-model="goalForm.aspirations.aspirationOne" style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormAspirations }" >
  <br>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormAspirations }">Aspiration 2: </label>
  <input type="text" v-model="goalForm.aspirations.aspirationTwo" style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormAspirations }" >
  <br>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormAspirations }">Aspiration 3: </label>
  <input type="text" v-model="goalForm.aspirations.aspirationThree" style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormAspirations }" >
  <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.goalFormAspirations}}</div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8" style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormGoals }">Please outline 3-5 goals that you have for this experience. <br><br>
    Goals are statements that describe what it means for an experience to be a success from your perspective,<br>
    Examples:<br>
    <ul><li>“I want to connect with people working on cancer research”</li><li>“I want to research access to nutrition education in public schools”</li><li>“I want to develop my presentation skills”</li></ul></p>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormGoals }" >Goal 1: </label>
  <input type="text" v-model="goalForm.goals.goalOne" rules="[v => !!v || 'Information is required']" required style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormGoals }" >
  <br>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormGoals }" >Goal 2: </label>
  <input type="text" v-model="goalForm.goals.goalTwo" rules="[v => !!v || 'Information is required']" required style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormGoals }" >
  <br>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormGoals }" >Goal 3: </label>
  <input type="text" v-model="goalForm.goals.goalThree" rules="[v => !!v || 'Information is required']" required style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormGoals }" >
  <br>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormGoals }" >Goal 4: </label>
  <input type="text" v-model="goalForm.goals.goalFour" style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormGoals }" >
  <br>
  <label style="margin-bottom: 2px;" :class="{ 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500': errors.goalFormGoals }" >Goal 5: </label>
  <input type="text" v-model="goalForm.goals.goalFive" style="margin-top: 5px; margin-bottom: 2px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;" :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400': errors.goalFormGoals }" >
  <div class="mt-2 text-sm text-red-600 dark:text-red-500">{{errors.goalFormGoals}}</div>
</v-col>



<v-row>
  <v-col cols="12" md="4">
    <v-btn @click="submitFormValidation">Submit Form</v-btn>
  </v-col>
</v-row>
</v-container>
<p>ERRORS {{  this.errors }}</p>
<p>{{ filledGoalsCount }} goals filled out of 5</p>
<p>{{ filledAspirationsCount }} aspirations filled out of 3</p>
</template>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
  data() {
    return {
      errors: {},
      isGoalSettingFormFilled: null,
      goalForm: {
        semester: '',
        experiences:[{
          experienceIDFromList:'',
          experienceCategory:'',
          experienceName:''
        }],
        experienceID: '',
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
      }
    }
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
    }
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
  submitFormValidation() {
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