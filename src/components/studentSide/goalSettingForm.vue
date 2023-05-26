<template>
  <v-container>
    <p class="font-weight-black text-h5 text--primary">Goal Setting Form</p>
    <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again later.</p>
  </v-container>
  <v-container>
    <!--
    <p class="font-weight-black text-h6">Background Information</p>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="studentInformation.firstName" label="First Name"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="studentInformation.lastName" label="Last Name"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="7">
        <v-text-field v-model="studentInformation.preferredEmail" label="Preferred Email"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field v-model="studentInformation.enrolledUHInfo.peopleSoftID" label="PeopleSoft ID"></v-text-field>
      </v-col>
    </v-row>-->
    <row>
      <p class="font-weight-black text-h8">Write the Semester (EX: Fall 2021)</p>
      <v-col cols="12" md="5">
        <v-text-field v-model="goalForm.semester" label="Semester"></v-text-field>
      </v-col>
    </row>
    <v-row>
      <v-col cols="11" md="10">
        <p class="font-weight-black text-h8">Please indicate which one of the experience(s) you are participating in this semester:</p>
        <v-radio-group v-model="goalForm.experienceID">
          <v-radio v-model="goalForm.experienceID" label="Office of Undergraduate Research (OUR) Programs (HERE,SURF, PURS, Mellon, REACH)" value="Office of Undergraduate Research (OUR) Programs (HERE,SURF, PURS, Mellon, REACH)"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="Honors in Community Health" value="Honors in Community Health"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="The Pharis Fellowship" value="The Pharis Fellowship"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="CHW Certification Training" value="CHW Certification Training"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="Internship - General" value="Internship - General"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="Internship - MBS" value="Internship - MBS"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="Internship - Public Health" value="Internship - Public Health"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="Apprenticeship - Research Assistant" value="Apprenticeship - Research Assistant"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="DS Research Project" value="DS Research Project"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="HON 3350 - Principles of Data & Society" value="HON 3350 - Principles of Data & Society"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="HON 4350 - Data & Society in Practice" value="HON 4350 - Data & Society in Practice"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="HON 4355 - Engaged Data" value="HON 4355 - Engaged Data"></v-radio>
          <v-radio v-model="goalForm.experienceID" label="HON 3397 - Health, Justice, Data" value="HON 3397 - Health, Justice, Data"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row v-if="goalForm.experienceID=='Honors in Community Health'">
      <v-col cols="11" md="10">
        <p class="font-weight-black text-h8">Please select the experiences in HICH you are involved in that you are setting your goals for. (You may select more than one.)</p>
        <v-radio-group v-model="goalForm.hichOption">
          <v-radio v-model="goalForm.hichOption" label="HICH General Body Member" value="HICH General Body Member"></v-radio>
          <v-radio v-model="goalForm.hichOption" label="HICH Leadership - Research and Development" value="HICH Leadership - Research and Development"></v-radio>
          <v-radio v-model="goalForm.hichOption" label="HICH Leadership - Project Heads" value="HICH Leadership - Project Heads"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">What kind of community engagement experiences, if any, have you had? Check all that apply.</p>
        <div>
          <div v-for="engagementExperience in goalForm.communityEngagement.communityEngagementExperiences" :key="engagementExperience.id">
            <v-checkbox v-model="engagementExperience.checked" :label="engagementExperience.label"></v-checkbox>
            <v-text-field v-if="engagementExperience.id === 6 && engagementExperience.checked" label="Please Specify" v-model="goalForm.communityEngagement.communityEngagementExperiencesOther"></v-text-field>
          </div>
        </div>
    </v-col>
    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">From your previous community engagement experiences, which of the following activities have you engaged in?</p>
        <div>
          <div v-for="previousExperience in goalForm.communityEngagement.previousEngagementExperiences" :key="previousExperience.id">
            <v-checkbox v-model="previousExperience.checked" :label="previousExperience.label"></v-checkbox>
            <v-text-field v-if="previousExperience.id === 8 && previousExperience.checked" label="Please Specify" v-model="goalForm.communityEngagement.previousEngagementExperiencesOther"></v-text-field>
          </div>
        </div>
    </v-col>
    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">What, if any, tools have you used for community engagement activities?</p>
        <div>
          <div v-for="activitiesTool in goalForm.communityEngagement.engagementActivitiesTools" :key="activitiesTool.id">
            <v-checkbox v-model="activitiesTool.checked" :label="activitiesTool.label"></v-checkbox>
            <v-text-field v-if="activitiesTool.id === 8 && activitiesTool.checked" label="Please Specify" v-model="goalForm.communityEngagement.engagementActivitiesToolOther"></v-text-field>
          </div>
        </div>
    </v-col>
    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">What kind of research experiences, if any, have you had? Check all that apply.</p>
        <div>
          <div v-for="currentExperience in goalForm.researchExperience.currentResearchExperience" :key="currentExperience.id">
            <v-checkbox v-model="currentExperience.checked" :label="currentExperience.label"></v-checkbox>
            <v-text-field v-if="currentExperience.id === 7 && currentExperience.checked" label="Please Specify" v-model="goalForm.researchExperience.currentResearchExperienceOther"></v-text-field>
          </div>
        </div>
    </v-col>
    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">From your previous research experiences, which of the following activities have you engaged in?</p>
        <div>
          <div v-for="previousExperience in goalForm.researchExperience.previousResearchExperience" :key="previousExperience.id">
            <v-checkbox v-model="previousExperience.checked" :label="previousExperience.label"></v-checkbox>
            <v-text-field v-if="previousExperience.id === 8 && previousExperience.checked" label="Please Specify" v-model="goalForm.researchExperience.previousResearchExperienceOther"></v-text-field>
          </div>
        </div>
    </v-col>
    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">What, if any, tools are you familiar with?</p>
        <div>
          <div v-for="familiarTool in goalForm.researchExperience.familiarTools" :key="familiarTool.id">
            <v-checkbox v-model="familiarTool.checked" :label="familiarTool.label"></v-checkbox>
            <v-text-field v-if="familiarTool.id === 8 && familiarTool.checked" label="Please Specify" v-model="goalForm.researchExperience.familiarToolOther"></v-text-field>
          </div>
        </div>
    </v-col>
    <v-col cols="12" md="10">
      <p class="font-weight-black text-h8">What, if any, tools are you familiar with?</p>
        <div>
          <div v-for="interest in goalForm.researchExperience.interestResearchService" :key="interest.id">
            <v-checkbox v-model="interest.checked" :label="interest.label"></v-checkbox>
            <v-text-field v-if="interest.id === 8 && interest.checked" label="Please Specify" v-model="goalForm.researchExperience.interestResearchServiceOther"></v-text-field>
          </div>
        </div>
    </v-col>
    <v-col cols="12" md="10">
        <p class="font-weight-black text-h8">Are you interested in potentially holding a leadership position?</p>
        <v-radio-group v-model="goalForm.researchExperience.leadershipOption">
          <v-radio label="Yes" value="Yes" v-model="goalForm.researchExperience.leadershipOption"></v-radio>
          <v-radio label="Maybe" value="Maybe" v-model="goalForm.researchExperience.leadershipOption"></v-radio>
          <v-radio label="No" value="No" v-model="goalForm.researchExperience.leadershipOption"></v-radio>
        </v-radio-group>
      </v-col>

    <p class="font-weight-black text-h6">Growth</p>
      <v-col cols="12" md="10">
        <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of problem solving.</p>
        <v-radio-group v-model="goalForm.growthGoal.problemSolvingGoal">
          <v-radio label="No growth" value="No growth" v-model="goalForm.growthGoal.problemSolvingGoal"></v-radio>
          <v-radio label="A little growth" value="A little growth" v-model="goalForm.growthGoal.problemSolvingGoal"></v-radio>
          <v-radio label="A moderate amount of growth" value="A moderate amount of growth" v-model="goalForm.growthGoal.problemSolvingGoal"></v-radio>
          <v-radio label="A lot of growth" value="A lot of growth" v-model="goalForm.growthGoal.problemSolvingGoal"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" md="10">
        <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of effective communication.</p>
        <v-radio-group v-model="goalForm.growthGoal.effectiveCommunicationGoal">
          <v-radio label="No growth" value="No growth" v-model="goalForm.growthGoal.effectiveCommunicationGoal"></v-radio>
          <v-radio label="A little growth" value="A little growth" v-model="goalForm.growthGoal.effectiveCommunicationGoal"></v-radio>
          <v-radio label="A moderate amount of growth" value="A moderate amount of growth" v-model="goalForm.growthGoal.effectiveCommunicationGoal"></v-radio>
          <v-radio label="A lot of growth" value="A lot of growth" v-model="goalForm.growthGoal.effectiveCommunicationGoal"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" md="10">
        <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of teamwork.</p>
        <v-radio-group v-model="goalForm.growthGoal.teamworkGoal">
          <v-radio label="No growth" value="No growth" v-model="goalForm.growthGoal.teamworkGoal"></v-radio>
          <v-radio label="A little growth" value="A little growth" v-model="goalForm.growthGoal.teamworkGoal"></v-radio>
          <v-radio label="A moderate amount of growth" value="A moderate amount of growth" v-model="goalForm.growthGoal.teamworkGoal"></v-radio>
          <v-radio label="A lot of growth" value="A lot of growth" v-model="goalForm.growthGoal.teamworkGoal"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" md="10">
        <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of cultural humility.</p>
        <v-radio-group v-model="goalForm.growthGoal.culturalHumilityGoal">
          <v-radio label="No growth" value="No growth" v-model="goalForm.growthGoal.culturalHumilityGoal"></v-radio>
          <v-radio label="A little growth" value="A little growth" v-model="goalForm.growthGoal.culturalHumilityGoal"></v-radio>
          <v-radio label="A moderate amount of growth" value="A moderate amount of growth" v-model="goalForm.growthGoal.culturalHumilityGoal"></v-radio>
          <v-radio label="A lot of growth" value="A lot of growth" v-model="goalForm.growthGoal.culturalHumilityGoal"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" md="10">
        <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of ethical decision making.</p>
        <v-radio-group v-model="goalForm.growthGoal.ethicalDecisionMakingGoal">
          <v-radio label="No growth" value="No growth" v-model="goalForm.growthGoal.ethicalDecisionMakingGoal"></v-radio>
          <v-radio label="A little growth" value="A little growth" v-model="goalForm.growthGoal.ethicalDecisionMakingGoal"></v-radio>
          <v-radio label="A moderate amount of growth" value="A moderate amount of growth" v-model="goalForm.growthGoal.ethicalDecisionMakingGoal"></v-radio>
          <v-radio label="A lot of growth" value="A lot of growth" v-model="goalForm.growthGoal.ethicalDecisionMakingGoal"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" md="10">
        <p class="font-weight-black text-h8">Please indicate your expectation of the growth you anticipate to see during your program in the area of professional responsibility.</p>
        <v-radio-group v-model="goalForm.growthGoal.professionalResponsibilityGoal">
          <v-radio label="No growth" value="No growth" v-model="goalForm.growthGoal.professionalResponsibilityGoal"></v-radio>
          <v-radio label="A little growth" value="A little growth" v-model="goalForm.growthGoal.professionalResponsibilityGoal"></v-radio>
          <v-radio label="A moderate amount of growth" value="A moderate amount of growth" v-model="goalForm.growthGoal.professionalResponsibilityGoal"></v-radio>
          <v-radio label="A lot of growth" value="A lot of growth" v-model="goalForm.growthGoal.professionalResponsibilityGoal"></v-radio>
        </v-radio-group>
      </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      goalForm: {
        semester: '',
        experienceID: '',
        hichOption: '',
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
        }
      }
    }
  },
  computed: {
    year() {
      return new Date(this.dateInput).getFullYear()
    }
  }
}
</script>