<!-- /goalSettingForm -->
<template>
  <v-container>
    <div>
      <p class="font-weight-black text-h5 text--primary">Goal Setting Form</p>
      <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.</p>
    </div>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="12" md="5">
        <p class="font-weight-black text-h8">Current Semester: </p>
        <v-text-field v-model="goalForm.semester" label="Semester" readonly></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11" md="10">
        {{ goalForm.experiences }}
        <p class="font-weight-black text-h8">
          Please indicate which one of the experience(s) you are participating in this semester:
        </p>
        <v-select v-model="goalForm.experienceID" :items="goalForm.experiences" label="Experience"></v-select>
      </v-col>
    </v-row>

    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">What kind of community engagement experiences, if any, have you had? Check all that apply.</p>
      <div v-for="engagementExperience in goalForm.communityEngagement.communityEngagementExperiences" :key="engagementExperience.id" style="padding: 10px;">
        <label style="color: #656565;">
          <input type="checkbox" v-model="engagementExperience.checked" style="outline: 2px solid gray; margin-right: 5px;">
          {{ engagementExperience.label }}
        </label>
        <br>
        <input v-if="engagementExperience.id === 6 && engagementExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.communityEngagement.communityEngagementExperiencesOther" style="margin-top: 5px;">
      </div>
    </v-col>

    <v-col cols="12" md="10">
  <p class="font-weight-black text-h8">From your previous community engagement experiences, which of the following activities have you engaged in?</p>
  <div style="padding: 10px;">
    <div v-for="previousExperience in goalForm.communityEngagement.previousEngagementExperiences" :key="previousExperience.id">
      <label style="display: flex; align-items: center; color: #808080;">
        <input type="checkbox" v-model="previousExperience.checked" style="outline: 2px solid #808080; margin-right: 10px;">
        {{ previousExperience.label }}
      </label>
      <br>
      <input v-if="previousExperience.id === 8 && previousExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.communityEngagement.previousEngagementExperiencesOther" style="margin-top: 5px;">
    </div>
  </div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">What, if any, tools have you used for community engagement activities?</p>
  <div style="padding: 10px;">
    <div v-for="activitiesTool in goalForm.communityEngagement.engagementActivitiesTools" :key="activitiesTool.id">
      <label style="display: flex; align-items: center; color: #808080;">
        <input type="checkbox" v-model="activitiesTool.checked" style="outline: 2px solid #808080; margin-right: 10px;">
        {{ activitiesTool.label }}
      </label>
      <br>
      <input v-if="activitiesTool.id === 8 && activitiesTool.checked" type="text" placeholder="Please Specify" v-model="goalForm.communityEngagement.engagementActivitiesToolOther" style="margin-top: 5px;">
    </div>
  </div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">What kind of research experiences, if any, have you had? Check all that apply.</p>
  <div style="padding: 10px;">
    <div v-for="currentExperience in goalForm.researchExperience.currentResearchExperience" :key="currentExperience.id">
      <label style="display: flex; align-items: center; color: gray;">
        <input type="checkbox" v-model="currentExperience.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ currentExperience.label }}
      </label>
      <br>
      <input v-if="currentExperience.id === 7 && currentExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.currentResearchExperienceOther" style="margin-top: 5px;">
    </div>
  </div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">From your previous research experiences, which of the following activities have you engaged in?</p>
  <div style="padding: 10px;">
    <div v-for="previousExperience in goalForm.researchExperience.previousResearchExperience" :key="previousExperience.id">
      <label style="display: flex; align-items: center; color: gray;">
        <input type="checkbox" v-model="previousExperience.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ previousExperience.label }}
      </label>
      <br>
      <input v-if="previousExperience.id === 8 && previousExperience.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.previousResearchExperienceOther" style="margin-top: 5px;">
    </div>
  </div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">What, if any, tools are you familiar with?</p>
  <div style="padding: 10px;">
    <div v-for="familiarTool in goalForm.researchExperience.familiarTools" :key="familiarTool.id">
      <label style="display: flex; align-items: center; color: gray; margin-right: 10px;">
        <input type="checkbox" v-model="familiarTool.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ familiarTool.label }}
      </label>
      <br>
      <input v-if="familiarTool.id === 8 && familiarTool.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.familiarToolOther" style="margin-top: 5px;">
    </div>
  </div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">What, if any, research services are you interested in?</p>
  <div style="padding: 10px;">
    <div v-for="interest in goalForm.researchExperience.interestResearchService" :key="interest.id">
      <label style="display: flex; align-items: center; color: gray; margin-right: 10px;">
        <input type="checkbox" v-model="interest.checked" style="outline: 2px solid gray; margin-right: 10px;">
        {{ interest.label }}
      </label>
      <br>
      <input v-if="interest.id === 8 && interest.checked" type="text" placeholder="Please Specify" v-model="goalForm.researchExperience.interestResearchServiceOther" style="margin-top: 5px;">
    </div>
  </div>
</v-col>

<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">Are you interested in potentially holding a leadership position?</p>
  <v-radio-group v-model="goalForm.researchExperience.leadershipOption">
    <v-radio label="Yes" value="Yes"></v-radio>
    <v-radio label="Maybe" value="Maybe"></v-radio>
    <v-radio label="No" value="No"></v-radio>
  </v-radio-group>
</v-col>

<p class="font-weight-black text-h6">Growth</p>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of problem solving.</p>
  <v-radio-group v-model="goalForm.growthGoal.problemSolvingGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of effective communication.</p>
  <v-radio-group v-model="goalForm.growthGoal.effectiveCommunicationGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of teamwork.</p>
  <v-radio-group v-model="goalForm.growthGoal.teamworkGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of cultural humility.</p>
  <v-radio-group v-model="goalForm.growthGoal.culturalHumilityGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of ethical decision making.</p>
  <v-radio-group v-model="goalForm.growthGoal.ethicalDecisionMakingGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-col cols="12" md="10">
  <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of professional responsibility.</p>
  <v-radio-group v-model="goalForm.growthGoal.professionalResponsibilityGoal">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
</v-col>
<v-row>
  <v-col cols="12" md="4">
    <v-btn @click="handleSubmitForm">Submit Form</v-btn>
  </v-col>
</v-row>
</v-container>
</template>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
  data() {
    return {
      goalForm: {
        semester: '',
        experiences:[],
        experienceID: '',
        communityEngagement: {
          communityEngagementExperiences: [
            { id: 1, label: "Volunteer organizations (e.g. scouts, nonprofits, food banks)", checked: false },
            { id: 2, label: "Political campaigns", checked: false },
            { id: 3, label: "Faith based organizations", checked: false },
            { id: 4, label: "Short-term volunteer opportunities (e.g. day of service events)", checked: false },
            { id: 5, label: "Medical mission trips", checked: false },
            { id: 6, label: "Other", checked: false }
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
            { id: 8, label: "Other", checked: false }
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
            { id: 8, label: "Other", checked: false }
          ],
          engagementActivitiesToolOther: '',
        },
        researchExperience: {
          currentResearchExperience: [
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
            { id: 8, label: "Other", checked: false }
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
      this.goalForm.experiences = response.data.map(experience => experience.experienceCategory + ': ' + experience.experienceName);
      // this.goalForm.experiences = response.data;
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  },
    async handleSubmitForm() {
      const user = useLoggedInUserStore()
      let token = user.token
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/goalForms/';
      axios.post(apiURL, this.goalForm, { headers: { token } }).then(() => {
        alert("Goal Information has been successfully added.");
        this.goalForm = {
            semester: '',
            primaryLanguage: '',
            experienceID: '',
            communityEngagement:{
              communityEngagementExperiences: [],
              communityEngagementExperiencesOther:'',
              previousEngagementExperiences: [],
              previousEngagementExperiencesOther:'',
              engagementActivitiesTools: [],
              engagementActivitiesToolOther: ''
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
              leadershipOption: ''
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
            }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
}
</script>