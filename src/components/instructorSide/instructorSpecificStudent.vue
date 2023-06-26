<template>
    <v-form disabled>
      <br><p class="font-weight-black text-h5" style="text-align: center;">Student's Information</p>
        <v-container>
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
              <v-col cols="12" md="6">
                <v-text-field v-model="studentData.studentInformation.primaryLanguage" label="Primary Language" variant="outlined" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="studentData.studentInformation.otherLanguages" label="Other Languages" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="studentData.studentInformation.languagePreference" label="Language Preference" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="11" md="6">
                  <v-text-field v-model="checkedPronouns" label="Pronouns" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="11" md="6">
                  <v-text-field v-if="studentData.studentInformation.pronouns.find(pronoun => pronoun.id === 5)" label="Other Pronouns" v-model="studentData.studentInformation.otherPronouns" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="10">
                <v-textarea v-model="studentData.studentInformation.commentsByStaff" variant="outlined" label="Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="10">
                <v-textarea v-model="studentData.studentInformation.issuesConcernsTriggers" variant="outlined" label="Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?"></v-textarea>
              </v-col>
            </v-row>
            <div v-if="studentData.studentInformation.enrolledUHInfo.uhStatus == true">
              <p class="font-weight-black text-h6">UH Student's Information</p>
              <v-row>
                  <v-col cols="12" md="5">
                    <v-text-field v-model="studentData.studentInformation.enrolledUHInfo.uhEmail" label="UH Email" variant="outlined"></v-text-field>
                  </v-col>
                <v-col cols="12" md="3">
                  <v-text-field v-model="studentData.studentInformation.enrolledUHInfo.peopleSoftID" label="PeopleSoft ID" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field type="date" v-model="studentData.studentInformation.enrolledUHInfo.expectedGraduationYear" label="Expected Graduation Date" min="2023-01-01" max="2099-12-31" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="7">
                  <v-text-field label="Do you live on or off campus?" v-model="livingPreference" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <p class="font-weight-black text-h7">Educational Background and Goals</p>
              <!-- <v-row>
                <v-col cols="12" md="7">
                  <v-text-field variant="outlined" label="Are you a member of the Honors College?">{{ yesOrNo(studentData.studentInformation.enrolledUHInfo.honorsCollegeStatus) }}</v-text-field>
                </v-col>
              </v-row> -->
            </div>
            
            <!--
              <p class="font-weight-black text-h6" v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">Educational Background and Goals</p>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="12" md="7">
                    <p class="font-weight-black text-h8">Are you a member of the Honors College?</p>
                    <v-radio-group v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus">
                      <v-radio label="Yes" value=true v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                      <v-radio label="No" value=false v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="12" md="7">
                    <p class="font-weight-black text-h8">Are you affiliated with the Honors College in any other way? If yes, please specify.</p>
                    <v-radio-group v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus">
                      <v-radio label="Yes" value=true v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
                      <v-text-field v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow" v-if="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus == 'true'" label="Please specify"></v-text-field>
                      <v-radio label="No" value=false v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row> 
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="12" md="7">
                    <p class="font-weight-black text-h8">What is/are your current major(s)?</p>
                    <v-select v-model="studentInformation.enrolledUHInfo.majors" :items="filteredMajors.map(major => major['Plan Name'])" label="Select a Major" multiple chips></v-select>
                  </v-col>
                </v-row>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="11" md="7">
                    <p class="font-weight-black text-h8">Are you pursuing, or planning to pursue, any of the following Honors College minors?</p>
                    <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Data & Society"></v-checkbox>
                  </v-col>
                </v-row>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="12" md="7">
                    <p class="font-weight-black text-h8">Are you pursuing any other minors? Please list.</p>
                    <v-select v-model="studentInformation.enrolledUHInfo.otherMinors" :items="filteredMinors.map(minor => minor['Plan Name'])" label="Select a Minor" multiple chips></v-select>
                  </v-col>
                </v-row>
              <p class="font-weight-black text-h6" v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">Other Engagement</p>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="12" md="7">
                    <p class="font-weight-black text-h8">Are you a member of Honors in Community Health (HICH)?</p>
                    <v-radio-group v-model="studentInformation.hichInfo.hichStatus">
                      <v-radio label="Yes" value=true v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                      <v-radio label="No" value=false v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="12" md="7">
                    <p class="font-weight-black text-h8">Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?</p>
                    <v-radio-group v-model="studentInformation.hichInfo.hichHistoryStatus">
                      <v-radio label="Yes" value=true v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                      <v-radio label="No" value=false v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
                  <v-col cols="11">
                    <p class="font-weight-black text-h8">Have you had other experience with Community Service?</p>
                    <v-radio-group v-model="studentInformation.communityServiceInfo.serviceStatus">
                      <v-radio label="Yes" value=true v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
                      <v-radio label="No" value=false v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
                        <p class="font-weight-black text-h8" v-if="(studentInformation.communityServiceInfo.serviceStatus == 'true') || (studentInformation.communityServiceInfo.serviceStatus == 'false')">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
                        <v-textarea v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" v-if="(studentInformation.communityServiceInfo.serviceStatus == 'true') || (studentInformation.communityServiceInfo.serviceStatus == 'false')" label="Please specify"></v-textarea>
                        <p class="font-weight-black text-h8" v-if="studentInformation.communityServiceInfo.serviceStatus == 'true'">Are you a member of any community organizations outside the University? Please list.</p>
                        <v-text-field v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" v-if="studentInformation.communityServiceInfo.serviceStatus == 'true'" label="Please specify"></v-text-field>
                    </v-radio-group>
                  </v-col>
                </v-row>
            <p class="font-weight-black text-h6" v-if="studentInformation.enrolledUHInfo.uhStatus == 'false'">Non-UH Students Only</p>
              <v-col cols="11" md="10">
                <p class="font-weight-black text-h8" v-if="studentInformation.enrolledUHInfo.uhStatus == 'false'">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
                <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'false'">
                  <v-textarea v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" label="Please specify"></v-textarea>
                </v-row>
              </v-col>
            <p class="font-weight-black text-h6">Graduate/Professional School Goals</p>
              <v-col cols="12" md="10">
                <p class="font-weight-black text-h8">Do you currently plan to pursue graduate or professional (e.g. medical, law) school?</p>
                <v-radio-group v-model="studentInformation.graduateProfessionalSchool.programGradProStatus">
                  <v-radio label="Yes" value=true v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
                  <v-radio label="No" value=false v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="10" v-if="studentInformation.graduateProfessionalSchool.programGradProStatus === 'true'">
                <p class="font-weight-black text-h8">If you are planning to pursue graduate school, what type of program?</p>
                <div>
                  <div v-for="programType in studentInformation.graduateProfessionalSchool.programGradProType" :key="programType.id">
                    <v-checkbox v-model="programType.checked" :label="programType.label"></v-checkbox>
                    <v-text-field v-if="programType.id === 4 && programType.checked" label="Please Specify" v-model="studentInformation.graduateProfessionalSchool.phDTextbox"></v-text-field>
                    <v-text-field v-if="programType.id === 7 && programType.checked" label="Please Specify" v-model="studentInformation.graduateProfessionalSchool.masterTextbox"></v-text-field>
                    <v-text-field v-if="programType.id === 8 && programType.checked" label="Please Specify" v-model="studentInformation.graduateProfessionalSchool.otherTextbox"></v-text-field>
                  </div>
                </div>
              </v-col> 
              <v-col cols="12" md="10">
                <p class="font-weight-black text-h8">Are you planning to pursue any other kind of specialized degree / certificate program?</p>
                <v-radio-group v-model="studentInformation.specializedDegCert.specializedDegCertStatus">
                  <v-radio label="Yes" value=true v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
                  <v-radio label="No" value=false v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="10" v-if="studentInformation.specializedDegCert.specializedDegCertStatus === 'true'">
                <p class="font-weight-black text-h8">If you are planning to pursue a specialized degree / certificate program, what type of program?</p>
                <div>
                  <div v-for="specializedType in studentInformation.specializedDegCert.specializedDegCertType" :key="specializedType.id">
                    <v-checkbox v-model="specializedType.checked" :label="specializedType.label"></v-checkbox>
                    <v-text-field v-if="specializedType.id === 6 && specializedType.checked" label="Please Specify" v-model="studentInformation.specializedDegCert.professionDesignOther"></v-text-field>
                  </div>
                </div>
              </v-col> -->
        </v-container>
    </v-form>
{{ this.studentData }}
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
      return this.studentData.studentInformation.enrolledUHInfo.livingOnCampus ? 'On-Campus' : 'Off-Campus';
    },
  },
  methods: {
    yesOrNo(status) {
      return status ? 'Yes' : 'No';
    }
  }
}
</script>