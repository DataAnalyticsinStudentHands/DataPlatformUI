<template>
  <v-form disabled>
    <v-row style="margin-top: 1rem;">
      <v-col cols="3" style="padding-left: 3rem;">
        <v-btn @click=$router.back()>
          Go Back
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-center">
        <p class="font-weight-black text-h5">Student's Information</p>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
      <v-container style="width: 90%; margin: 0 auto;">
        <br><p class="font-weight-black text-h6">Basic Information</p>
          <v-row>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">First Name</label>
              <p style="margin: 0;">{{ this.userData.firstName }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Last Name</label>
              <p style="margin: 0;">{{ this.userData.lastName }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Email</label>
              <p style="margin: 0;">{{ this.userData.email }}</p>
            </v-col>
            <v-col cols="12" md="4">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Language Preference</label>
              <p style="margin: 0;">{{ languagePreferenceValue }}</p>
            </v-col>
          </v-row>
        <br><p class="font-weight-black text-h6">Demographics Information</p>
        <v-row>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">City of Origin</label>
              <p style="margin: 0;">{{ this.studentData.cityOrigin }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Primary Language</label>
              <p style="margin: 0;">{{ this.studentData.primaryLanguage }}</p>
            </v-col>
            <v-col cols="12" md="4">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Other Languages</label>
              <p style="margin: 0;">{{ this.studentData.otherLanguages }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="11" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Pronouns</label>
              <p style="margin: 0;">{{ checkedPronouns }}</p>
            </v-col>
            <v-col cols="11" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Other Pronouns</label>
              <p style="margin: 0;">{{ this.studentData.otherPronouns }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?</label>
              <p style="margin: 0;">{{ this.studentData.commentsByStaff }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?</label>
              <p style="margin: 0;">{{ this.studentData.issuesConcernsTriggers }}</p>
            </v-col>
          </v-row>
          <div v-if="this.studentData?.enrolledUHInfo?.uhStatus == 'Yes'">
            <br><p class="font-weight-black text-h6">UH Student's Information</p>
            <v-row>
                <v-col cols="12" md="6">
                  <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">UH Email</label>
                  <p style="margin: 0;">{{ this.studentData.enrolledUHInfo.uhEmail }}</p>
                </v-col>
              <v-col cols="12" md="3">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">PeopleSoft ID</label>
                <p style="margin: 0;">{{ this.studentData.enrolledUHInfo.peopleSoftID }}</p>
              </v-col>
              <v-col cols="12" md="3">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Expected Graduation Date</label>
                <p style="margin: 0;">{{ this.studentData.enrolledUHInfo.expectedGraduationYear }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Do you live on or off campus?</label>
                <p style="margin: 0;">{{ this.studentData.enrolledUHInfo.livingOnCampus }}</p>
              </v-col>
            </v-row>
            <br><p class="font-weight-black text-h7">Educational Background and Goals</p>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you currently enrolled in a degree program at the University of Houston?</label>
                <p style="margin: 0;">{{ this.studentData.enrolledUHInfo.uhStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you a member of the Honors College?</label>
                <p style="margin: 0;">{{ this.studentData?.enrolledUHInfo?.honorsCollegeStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="10">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?</label>
                <p style="margin: 0;">{{ honorsCollegeAffiliated }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Other Honors College Affiliation Information</label>
                <p style="margin: 0;">{{ this.studentData?.enrolledUHInfo?.honorsCollegeAffiliatedOther }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">What is/are your current major(s)?</label>
                <p style="margin: 0;">{{ majors }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you pursuing, or planning to pursue, any of the following Honors College minors?</label>
                <p style="margin: 0;">{{ honorsMinors }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you pursuing any other minors? Please list.</label>
                <p style="margin: 0;">{{ otherMinors }}</p>
              </v-col>
            </v-row>
            <br><p class="font-weight-black text-h7">Other Engagement</p>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you a member of Honors in Community Health (HICH)?</label>
                <p style="margin: 0;">{{ this.studentData?.hichInfo?.hichStatus }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Have you participated in HICH Projects?</label>
                <p style="margin: 0;">{{ this.studentData?.hichInfo?.hichHistoryStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Have you had other experience with Community Service?</label>
                <p style="margin: 0;">{{ this.studentData?.communityServiceInfo?.serviceStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</label>
                <p style="margin: 0;">{{ this.studentData.communityServiceInfo.serviceHistoryDesc }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you a member of any community organizations outside the University? Please list.</label>
                <p style="margin: 0;">{{ this.studentData.communityServiceInfo.serviceOrgsOutsideUH }}</p>
              </v-col>
            </v-row>
          </div>
          <div v-if="this.studentData?.enrolledUHInfo?.uhStatus == 'No'">
            <p class="font-weight-black text-h6">Non-UH Students Information</p><br>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Have you had other experience with Community Service?</label>
                <p style="margin: 0;">{{ this.studentData?.communityServiceInfo?.serviceStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</label>
                <p style="margin: 0;">{{ this.studentData.communityServiceInfo.serviceHistoryDesc }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you a member of any community organizations outside the University? Please list.</label>
                <p style="margin: 0;">{{ this.studentData.communityServiceInfo.serviceOrgsOutsideUH }}</p>
              </v-col>
            </v-row>
          </div>
          <br><p class="font-weight-black text-h6">Graduate/Professional School Goals</p>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Do you currently plan to pursue graduate or professional (e.g. medical, law) school?</label>
                <p style="margin: 0;">{{ this.studentData?.graduateProfessionalSchool?.programGradProStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="11" v-if="this.studentData?.graduateProfessionalSchool?.programGradProStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">If you are planning to pursue graduate school, what type of program?</label>
                <p style="margin: 0;">{{ programGradProType }}</p>
              </v-col>
            </v-row>
            <v-row v-if="this.studentData?.graduateProfessionalSchool?.programGradProStatus === 'Yes'">
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">PhD Information</label>
                <p style="margin: 0;">{{ this.studentData?.graduateProfessionalSchool?.phDTextbox }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Master Information</label>
                <p style="margin: 0;">{{ this.studentData?.graduateProfessionalSchool?.masterTextbox }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Other Professional Schooling Information</label>
                <p style="margin: 0;">{{ this.studentData?.graduateProfessionalSchool?.otherTextbox }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Are you planning to pursue any other kind of specialized degree / certificate program?</label>
                <p style="margin: 0;">{{ this.studentData?.specializedDegCert?.specializedDegCertStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="this.studentData?.specializedDegCert?.specializedDegCertStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Listed Specialized Degree / Certificate Program</label>
                <p style="margin: 0;">{{ specializedDCType }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="this.studentData?.specializedDegCert?.specializedDegCertType.find(other => other.id === 6 && other.checked)">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">Other Specialized Degree / Certificate Program</label>
                <p style="margin: 0;">{{ this.studentData.specializedDegCert.professionalDesignOther }}</p>
              </v-col>
            </v-row> 
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
      this.studentData = resp.data.studentData.studentInformation;
    });
},
computed: {
  checkedPronouns() {
    if (this.studentData && this.studentData?.pronouns) {
      return this.studentData?.pronouns
        .filter(pronoun => pronoun.checked === true)
        .map(item => item.label)
        .join(", ");
    }
    return ""; // Return a default value or handle the case when the data is not available
  },
  honorsCollegeAffiliated() {
    return this.studentData.enrolledUHInfo?.honorsCollegeAffiliated.filter(aff => aff.checked === true).map(aff => aff.label).join(", ");
  },
  majors() {
    const majors = this.studentData?.enrolledUHInfo?.majors;
    return Array.isArray(majors) && majors.length > 0 ? majors.join(", ") : "None";
  },
  honorsMinors() {
    const honorsMinors = this.studentData?.enrolledUHInfo?.honorsMinors;
    return Array.isArray(honorsMinors) && honorsMinors.length > 0 ? honorsMinors.join(", ") : "None";
  },
  otherMinors() {
    const otherMinors = this.studentData?.enrolledUHInfo?.otherMinors;
    return Array.isArray(otherMinors) && otherMinors.length > 0 ? otherMinors.join(", ") : "None";
  },
  programGradProType() {
    return this.studentData?.graduateProfessionalSchool?.programGradProType.filter(program => program.checked === true).map(program => program.label).join(", ");
  },
  specializedDCType() {
    return this.studentData?.specializedDegCert?.specializedDegCertType.filter(program => program.checked === true).map(program => program.label).join(", ");
  },
  languagePreferenceValue() {
      if (this.userData && this.userData.languagePreference) {
          return this.userData.languagePreference;
      } else if (this.studentData && this.studentData.languagePreference) {
          return this.studentData.languagePreference;
      } else {
          return ""; // Default value in case it's not found in both formats
      }
  },
},
methods: {
}
}
</script>