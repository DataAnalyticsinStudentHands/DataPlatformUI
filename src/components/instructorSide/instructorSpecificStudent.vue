<template>
    <v-form disabled>
      <br><p class="font-weight-black text-h5" style="text-align: center;">Student's Information</p>
        <v-container style="width: 90%; margin: 0 auto;">
          <p class="font-weight-black text-h6">Basic Information</p><br>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="userData.firstName" label="First Name" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="userData.lastName" label="Last Name" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="userData.phoneNumber" label="Phone Number" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="userData.email" label="Email" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
          
          <p class="font-weight-black text-h6">Demographics Information</p><br>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="studentData.studentInformation.cityOrigin" label="City of Origin" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="studentData.studentInformation.languagePreference" label="Language Preference" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="studentData.studentInformation.primaryLanguage" label="Primary Language" variant="outlined" required></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="studentData.studentInformation.otherLanguages" label="Other Languages" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="11" md="6">
                  <v-text-field v-model="checkedPronouns" label="Pronouns" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="11" md="6">
                <v-text-field v-if="studentData.studentInformation.pronouns.find(pronoun => pronoun.id === 5 && pronoun.checked)" label="Other Pronouns" v-model="studentData.studentInformation.otherPronouns" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="studentData.studentInformation.commentsByStaff" variant="outlined" label="Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="studentData.studentInformation.issuesConcernsTriggers" variant="outlined" label="Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?"></v-textarea>
              </v-col>
            </v-row>
            <div v-if="studentData.studentInformation.enrolledUHInfo.uhStatus == true">
              <p class="font-weight-black text-h6">UH Student's Information</p><br>
              <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="studentData.studentInformation.enrolledUHInfo.uhEmail" label="UH Email" variant="outlined"></v-text-field>
                  </v-col>
                <v-col cols="12" md="3">
                  <v-text-field v-model="studentData.studentInformation.enrolledUHInfo.peopleSoftID" label="PeopleSoft ID" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field type="date" v-model="studentData.studentInformation.enrolledUHInfo.expectedGraduationYear" label="Expected Graduation Date" min="2023-01-01" max="2099-12-31" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Do you live on or off campus?" v-model="livingPreference" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <p class="font-weight-black text-h7">Educational Background and Goals</p><br>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="uhStatus" label="Are you currently enrolled in a degree program at the University of Houston?" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Are you a member of the Honors College?" v-model="honorsCollegeStatus" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Are you affiliated with the Honors College in any other way?" v-model="honorsCollegeAffiliatedStatus" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="honorsCollegeAffiliatedStatus==='Yes'">
                  <v-text-field label="If yes, please specify." v-model="studentData.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="What is/are your current major(s)?" v-model="majors" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Are you pursuing, or planning to pursue, any of the following Honors College minors?" v-model="honorsMinors" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Are you pursuing any other minors? Please list." v-model="otherMinors" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <p class="font-weight-black text-h7">Other Engagement</p><br>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Are you a member of Honors in Community Health (HICH)?" v-model="hichStatus" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?" v-model="hichHistoryStatus" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Have you had other experience with Community Service?" v-model="serviceStatus" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea v-if="serviceStatus === 'Yes'" label="Please briefly describe any community service opportunities you were involved in. Include organization and scope of service." v-model="studentData.studentInformation.communityServiceInfo.serviceHistoryDesc" variant="outlined"></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea v-if="serviceStatus === 'Yes'" label="Are you a member of any community organizations outside the University? Please list." v-model="studentData.studentInformation.communityServiceInfo.serviceOrgsOutsideUH" variant="outlined"></v-textarea>
                </v-col>
              </v-row>
            </div>
            <div v-if="studentData.studentInformation.enrolledUHInfo.uhStatus == false">
              <p class="font-weight-black text-h6">Non-UH Students Information</p><br>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Have you had other experience with Community Service?" v-model="serviceStatus" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea v-if="serviceStatus === 'Yes'" label="Please briefly describe any community service opportunities you were involved in. Include organization and scope of service." v-model="studentData.studentInformation.communityServiceInfo.serviceHistoryDesc" variant="outlined"></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea v-if="serviceStatus === 'Yes'" label="Are you a member of any community organizations outside the University? Please list." v-model="studentData.studentInformation.communityServiceInfo.serviceOrgsOutsideUH" variant="outlined"></v-textarea>
                </v-col>
              </v-row>
            </div>
              <p class="font-weight-black text-h6">Graduate/Professional School Goals</p><br>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Do you currently plan to pursue graduate or professional (e.g. medical, law) school?" v-model="programGradProStatus" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="11">
                    <v-text-field v-model="programGradProType" v-if="programGradProStatus === 'Yes'" label="If you are planning to pursue graduate school, what type of program?" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="11">
                  <v-text-field v-if="studentData.studentInformation.graduateProfessionalSchool.programGradProType.find(programType => programType.id === 4 && programType.checked)" label="PhD Information" v-model="studentData.studentInformation.graduateProfessionalSchool.phDTextbox" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="11">
                  <v-text-field v-if="studentData.studentInformation.graduateProfessionalSchool.programGradProType.find(programType => programType.id === 7 && programType.checked)" label="Master Information" v-model="studentData.studentInformation.graduateProfessionalSchool.masterTextbox" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="11">
                  <v-text-field v-if="studentData.studentInformation.graduateProfessionalSchool.programGradProType.find(programType => programType.id === 8 && programType.checked)" label="Other Professional Schooling Information" v-model="studentData.studentInformation.graduateProfessionalSchool.otherTextbox" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="Are you planning to pursue any other kind of specialized degree / certificate program?" v-model="specializedDegCertStatus" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <!-- <v-row>
                <v-col>
                  <v-textarea v-if="specializedDegCertStatus == 'Yes'" v-model="specializedDegCertType" label="Listed Specialized Degree / Certificate Program" variant="outlined"></v-textarea>
                </v-col>
              </v-row> -->
              <!-- <v-row>
                <v-col>
                  <v-text-field v-if="studentData.studentInformation.specializedDegCert.specializedDegCertType.find(other => other.id === 6 && other.checked)" v-model="studentData.studentInformation.specializedDegCert.professionalDesignOther" label="Other Specialized Degree / Certificate Program" variant="outlined"></v-text-field>
                </v-col>
              </v-row> -->
        </v-container>
    </v-form>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  data() {
    return {
        userData: [],
        studentData: []
    };
  },
  beforeMount() {
    const user = useLoggedInUserStore();
    let token = user.token;
    let url = import.meta.env.VITE_ROOT_API + `/studentSideData/studentInformation`;
    axios.get(url + `/${this.$route.params.userID}`, { headers: { token },})
      .then((resp) => {
        this.userData = resp.data.userData;
        this.studentData = resp.data.studentData;
      });
  },
  computed: {
    checkedPronouns() {
      return this.studentData.studentInformation.pronouns.filter(pronoun => pronoun.checked === true).map(item => item.label).join(", ");
    },
    livingPreference() {
      const enrolledUHInfo = this.studentData.studentInformation.enrolledUHInfo;
      return enrolledUHInfo && enrolledUHInfo.livingOnCampus ? 'On-Campus' : 'Off-Campus';
    },
    uhStatus() {
      return this.studentData.studentInformation.enrolledUHInfo.uhStatus ? 'Yes' : 'No';
    },
    honorsCollegeStatus() {
      return this.studentData.studentInformation.enrolledUHInfo.honorsCollegeStatus ? 'Yes' : 'No';
    },
    honorsCollegeAffiliatedStatus() {
      return this.studentData.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus ? 'Yes' : 'No';
    },
    majors() {
      const majors = this.studentData.studentInformation.enrolledUHInfo.majors;
      return Array.isArray(majors) && majors.length > 0 ? majors.join(", ") : "None";
    },
    honorsMinors() {
      const honorsMinors = this.studentData.studentInformation.enrolledUHInfo.honorsMinors;
      return Array.isArray(honorsMinors) && honorsMinors.length > 0 ? honorsMinors.join(", ") : "None";
    },
    otherMinors() {
      const otherMinors = this.studentData.studentInformation.enrolledUHInfo.otherMinors;
      return Array.isArray(otherMinors) && otherMinors.length > 0 ? otherMinors.join(", ") : "None";
    },
    hichStatus() {
      return this.studentData.studentInformation.hichInfo.hichStatus ? 'Yes' : 'No';
    },
    hichHistoryStatus() {
      return this.studentData.studentInformation.hichInfo.hichHistoryStatus ? 'Yes' : 'No';
    },
    serviceStatus() {
      return this.studentData.studentInformation.communityServiceInfo.serviceStatus ? 'Yes' : 'No';
    },
    programGradProStatus() {
      return this.studentData.studentInformation.graduateProfessionalSchool.programGradProStatus ? 'Yes' : 'No';
    },
    programGradProType() {
      return this.studentData.studentInformation.graduateProfessionalSchool.programGradProType.filter(program => program.checked === true).map(program => program.label).join(", ");
    },
    specializedDegCertStatus() {
      return this.studentData.studentInformation.specializedDegCert.specializedDegCertStatus ? 'Yes' : 'No';
    },
    specializedDegCertType() {
      return this.studentData.studentInformation.specializedDegCert.specializedDegCertType.filter(program => program.checked === true).map(program => program.label).join(", ");
    },
},
  methods: {
  }
}
</script>