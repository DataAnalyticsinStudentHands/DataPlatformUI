<template>
  <v-container>
    <p class="font-weight-black text-h5 text--primary">Goal Setting Form</p>
    <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again later.</p>
  </v-container>
  <v-container>
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
    </v-row>
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
      studentInformation: {
        firstName: '',
        lastName: '',
        preferredEmail: '',
        enrolledUHInfo: {
            peopleSoftID: '',
        },
      },
      goalForm: {
        semester: '',
        experienceID: '',
        hichOption: '',
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