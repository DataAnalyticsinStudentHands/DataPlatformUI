<template>
    <v-row style="margin-top: 1rem;" justify="center">
      
      <!-- Text: Student's Information -->
      <v-col class="text-center">
        <p class="font-weight-black text-h5">{{$t("Your Student Entry Form")}}</p>
      </v-col>
  
    </v-row>
    <v-form disabled>
      <div v-if="loading" class="loading-container">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else>
      <v-container style="width: 90%; margin: 0 auto;">
        <v-row class="mt-3">
          <v-col class="text-left" cols="10">
            <p class="font-weight-black text-h6">{{$t('Demographics Information')}}
              <!-- Mobile View Edit Button -->
              <v-btn v-if="$vuetify.display.xs"
                  icon
                  size="small"
                  variant="text"
                  @click="emitStepChange(0)"
                  class="mb-1"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </p>

          </v-col>

          <!-- Non-Mobile View Edit Button -->
          <v-col class="text-right" v-if="$vuetify.display.smAndUp">
              <v-btn
                icon
                size="small"
                variant="text"
                @click="emitStepChange(0)"
                class="mb-1"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
        </v-row>
        <v-row class="mt-0" v-if="this.studentInformation.cityOrigin">
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Place of Origin')}}</label>
              <p style="margin: 0;">{{ this.studentInformation.cityOrigin }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" v-if="this.studentInformation.primaryLanguage">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Primary Language')}}</label>
              <p style="margin: 0;">{{ this.studentInformation.primaryLanguage }}</p>
            </v-col>
            <v-col cols="12" md="4" v-if="this.studentInformation.otherLanguages">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Other Languages')}}</label>
              <p style="margin: 0;">{{ this.studentInformation.otherLanguages }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="11" md="6" v-if="checkedPronouns">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Pronouns')}}</label>
              <p style="margin: 0;">{{ $t(checkedPronouns) }}</p>
            </v-col>
            <v-col cols="11" md="6" v-if="this.studentInformation.otherPronouns">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Other Pronouns')}}</label>
              <p style="margin: 0;">{{ this.studentInformation.otherPronouns }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" v-if="this.studentInformation.commentsByStaff">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?')}}</label>
              <p style="margin: 0;">{{ this.studentInformation.commentsByStaff }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" v-if="this.studentInformation.issuesConcernsTriggers">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?')}}</label>
              <p style="margin: 0;">{{ this.studentInformation.issuesConcernsTriggers }}</p>
            </v-col>
          </v-row>
          <div v-if="this.studentInformation.enrolledUHInfo?.uhStatus == 'Yes'">
            <v-row no-gutters class="align-center mt-4 mb-0 pb-0">
              <v-col class="text-left" cols="10">
                <p class="font-weight-black text-h6">
                  {{ $t("UH Student's Information") }}
                  <!-- Mobile View Edit Button -->
                  <v-btn
                    v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(1)"
                    class="mb-1"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </p>
              </v-col>

              <!-- Non-Mobile View Edit Button -->
              <v-col class="text-right" v-if="$vuetify.display.smAndUp">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="emitStepChange(1)"
                  class="mb-1"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col cols="12" md="6">
                  <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('UH Email')}}</label>
                  <p style="margin: 0;">{{ this.studentInformation.enrolledUHInfo?.uhEmail }}</p>
                </v-col>
              <v-col cols="12" md="3">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('PeopleSoft ID')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.enrolledUHInfo?.peopleSoftID }}</p>
              </v-col>
              <v-col cols="12" md="3" v-if="this.studentInformation.enrolledUHInfo?.expectedGraduationYear">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Expected Graduation Date')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.enrolledUHInfo?.expectedGraduationYear }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" v-if="this.studentInformation.enrolledUHInfo?.livingOnCampus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Do you live on or off campus?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.enrolledUHInfo?.livingOnCampus) }}</p>
              </v-col>
            </v-row>
            <br><p class="font-weight-black text-h7">{{$t('Educational Background and Goals')}}</p>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you currently enrolled in a degree program at the University of Houston?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.enrolledUHInfo?.uhStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you a member of the Honors College?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.enrolledUHInfo?.honorsCollegeStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="10" v-if="honorsCollegeAffiliated">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?')}}</label>
                <p style="margin: 0;">{{ honorsCollegeAffiliated }}</p>
              </v-col>
              <v-col cols="11" v-if="this.studentInformation.enrolledUHInfo?.honorsCollegeAffiliatedOther">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Other Honors College Affiliation Information')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.enrolledUHInfo?.honorsCollegeAffiliatedOther }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('What is/are your current major(s)?')}}</label>
                <p style="margin: 0;">{{ majors }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you pursuing, or planning to pursue, any of the following Honors College minors?')}}</label>
                <p style="margin: 0;">{{ honorsMinors }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you pursuing any other minors?')}}</label>
                <p style="margin: 0;">{{ otherMinors }}</p>
              </v-col>
            </v-row>
            <br><p class="font-weight-black text-h7">{{$t('Other Engagement')}}</p>
            <v-row>
              <v-col cols="12" md="6" v-if="this.studentInformation.hichInfo?.hichStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you a member of Honors in Community Health (HICH)?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.hichInfo?.hichStatus) }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="this.studentInformation.hichInfo?.hichHistoryStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.hichInfo?.hichHistoryStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Have you had experience with Community Service?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.communityServiceInfo?.serviceStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentInformation.communityServiceInfo?.serviceHistoryDesc">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.communityServiceInfo?.serviceHistoryDesc }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentInformation.communityServiceInfo?.serviceOrgsOutsideUH">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you a member of any community organizations outside the University?')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.communityServiceInfo?.serviceOrgsOutsideUH }}</p>
              </v-col>
            </v-row>
          </div>
          <div v-if="this.studentInformation.enrolledUHInfo?.uhStatus == 'No'">
            <v-row no-gutters class="align-center mt-4 mb-0 pb-0">
              <v-col class="text-left" cols="10">
                <p class="font-weight-black text-h6">{{$t("Non-UH Student's Information")}}
                  <!-- Mobile View Edit Button -->
                  <v-btn
                    v-if="$vuetify.display.xs"
                    icon
                    size="small"
                    variant="text"
                    @click="emitStepChange(1)"
                    class="mb-1"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </p>
              </v-col>

              <!-- Non-Mobile View Edit Button -->
              <v-col class="text-right" v-if="$vuetify.display.smAndUp">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="emitStepChange(1)"
                  class="mb-1"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Have you had experience with Community Service?')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.communityServiceInfo?.serviceStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentInformation.communityServiceInfo?.serviceStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.communityServiceInfo?.serviceHistoryDesc }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentInformation.communityServiceInfo?.serviceStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you a member of any community organizations outside the University?')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.communityServiceInfo?.serviceOrgsOutsideUH }}</p>
              </v-col>
            </v-row>
          </div>
          <v-row no-gutters class="pt-2 mt-4">
            <v-col class="text-left" cols="10">
              <p class="font-weight-black text-h6">{{$t('Graduate/Professional School Goals')}}
                <!-- Mobile View Edit Button -->
                <v-btn
                  v-if="$vuetify.display.xs"
                  icon
                  size="small"
                  variant="text"
                  @click="emitStepChange(2)"
                  class="mb-1"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </p>
            </v-col>
            <!-- Non-Mobile View Edit Button -->
            <v-col class="text-right" v-if="$vuetify.display.smAndUp">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="emitStepChange(2)"
                  class="mb-1"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
          </v-row>
            <v-row class="mt-1">
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Do you currently plan to pursue graduate or professional (e.g. medical, law) school?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.graduateProfessionalSchool?.programGradProStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="11" v-if="this.studentInformation.graduateProfessionalSchool?.programGradProStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('If you are planning to pursue graduate school, what type of program?')}}</label>
                <p style="margin: 0;">{{ programGradProType }}</p>
              </v-col>
            </v-row>
            <v-row v-if="this.studentInformation.graduateProfessionalSchool?.programGradProStatus === 'Yes'">
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('PhD Information')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.graduateProfessionalSchool?.phDTextbox }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t("Master's Information")}}</label>
                <p style="margin: 0;">{{ this.studentInformation.graduateProfessionalSchool?.masterTextbox }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Other Professional Schooling Information')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.graduateProfessionalSchool?.otherTextbox }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Are you planning to pursue any other kind of specialized degree / certificate program?')}}</label>
                <p style="margin: 0;">{{ $t(this.studentInformation.specializedDegCert?.specializedDegCertStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="specializedDCType">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Listed Specialized Degree / Certificate Program')}}</label>
                <p style="margin: 0;">{{ specializedDCType }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="this.studentInformation.specializedDegCert?.specializedDegCertType.find(other => other.id === 6 && other.checked)">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{$t('Other Specialized Degree / Certificate Program')}}</label>
                <p style="margin: 0;">{{ this.studentInformation.specializedDegCert?.professionalDesignOther }}</p>
              </v-col>
            </v-row> 
      </v-container>
      </div>
  </v-form>
</template>

<script>
import { ref } from 'vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
    name: "EntryFormReview",
    props: {
        studentInformation: Object,
    },
    emits: ['change-step'],
data() {
  return {
      userData: [],
      studentData: [],
  };
},

computed: {
  checkedPronouns() {
    if (this.studentInformation && this.studentInformation.pronouns) {
      return this.studentInformation.pronouns
        .filter(pronoun => pronoun.checked === true)
        .map(item => this.$t(item.label))
        .join(", ");
    }
    return ""; // Return a default value or handle the case when the data is not available
  },
  honorsCollegeAffiliated() {
    return this.studentData.enrolledUHInfo?.honorsCollegeAffiliated.filter(aff => aff.checked === true).map(aff => aff.label).join(", ");
  },
  majors() {
    const majors = this.studentInformation.enrolledUHInfo?.majors;
    return Array.isArray(majors) && majors.length > 0 ? majors.join(", ") : "None";
  },
  honorsMinors() {
    const honorsMinors = this.studentInformation.enrolledUHInfo?.honorsMinors;
    return Array.isArray(honorsMinors) && honorsMinors.length > 0 ? honorsMinors.join(", ") : "None";
  },
  otherMinors() {
    const otherMinors = this.studentInformation.enrolledUHInfo?.otherMinors;
    return Array.isArray(otherMinors) && otherMinors.length > 0 ? otherMinors.join(", ") : "None";
  },
  programGradProType() {
    return this.studentInformation.graduateProfessionalSchool?.programGradProType.filter(program => program.checked === true).map(program => this.$t(program.label)).join(", ");
  },
  specializedDCType() {
    return this.studentInformation.specializedDegCert?.specializedDegCertType.filter(program => program.checked === true).map(program => this.$t(program.label)).join(", ");
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
  loading() {
    const store = useLoggedInUserStore();
    return store.loading;
  },
  completedEntryForm() {
    const store = useLoggedInUserStore();
    return store.hasCompletedEntryForm;
  }
},
methods: {
  emitStepChange(stepNumber) {
    this.$emit('change-step', stepNumber);
  },
}
}
</script>