<template>
  <v-container>
    <p class="font-weight-black text-h5 text--primary">Registration</p>
    <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again later.</p>
  </v-container>
  <v-container>
    <p class="font-weight-black text-h6">Demographics Information</p>
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
      <v-col cols="12" md="6">
        <v-text-field v-model="studentInformation.cityOrigin" label="City of Origin"></v-text-field>
      </v-col>
    </v-row>
    <p class="font-weight-black text-h8">What languages do you speak?</p>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="studentInformation.primaryLanguage" label="Primary Language"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="studentInformation.otherLanguages" label="Other Languages"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="7">
        <p class="font-weight-black text-h8">What language do you prefer to receive communication in?</p>
        <v-radio-group v-model="studentInformation.languagePreference">
          <v-radio label="English" value="English" v-model="studentInformation.languagePreference"></v-radio>
          <v-radio label="Spanish" value="Spanish" v-model="studentInformation.languagePreference"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11" md="7">
        <p class="font-weight-black text-h8">What are your pronouns? Select all that apply.</p>
        <v-checkbox v-model="studentInformation.pronouns.she" label="She/her/hers"></v-checkbox>
        <v-checkbox v-model="studentInformation.pronouns.he" label="He/him/his"></v-checkbox>
        <v-checkbox v-model="studentInformation.pronouns.they" label="They/them/theirs"></v-checkbox>
        <v-checkbox v-model="studentInformation.pronouns.ze" label="Ze/Zir/Zirs"></v-checkbox>
        <v-checkbox v-model="studentInformation.pronouns.other" label="Other"></v-checkbox>
        <v-text-field v-model="studentInformation.pronouns.otherPronouns" v-if="studentInformation.pronouns.other" label="Please specify"></v-text-field>
        <v-checkbox v-model="studentInformation.pronouns.preferNotToAnswer" label="Prefer not to answer"></v-checkbox>
      </v-col>
    </v-row>
    <p class="font-weight-black text-h8">Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?</p>
    <v-row>
      <v-col cols="12" md="10">
        <v-textarea v-model="studentInformation.commentsByStaff" label="Comments"></v-textarea>
      </v-col>
    </v-row>
    <p class="font-weight-black text-h8">Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?</p>
    <v-row>
      <v-col cols="12" md="10">
        <v-textarea v-model="studentInformation.issuesConcernsTriggers" label="Issues, Concerns, Triggers"></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="7">
        <p class="font-weight-black text-h8">Are you currently enrolled in a degree program at the University of Houston?</p>
        <v-radio-group v-model="studentInformation.enrolledUHInfo.uhStatus">
          <v-radio label="Yes" value="Yes" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
          <v-radio label="No" value="No" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <p class="font-weight-black text-h6" v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">UH Student Only</p>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <v-text-field v-model="studentInformation.enrolledUHInfo.uhEmail" label="UH Email"></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="3">
            <v-text-field v-model="studentInformation.enrolledUHInfo.peopleSoftID" label="PeopleSoft ID"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field type="date" v-model="studentInformation.enrolledUHInfo.expectedGraduationYear" label="Expected Graduation Date" min="2023-01-01" max="2099-12-31"></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <p class="font-weight-black text-h8">Do you live on or off campus?</p>
            <v-radio-group v-model="studentInformation.enrolledUHInfo.livingOnCampus">
              <v-radio label="On-Campus" value="On-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
              <v-radio label="Off-Campus" value="Off-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      <p class="font-weight-black text-h6" v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">Educational Background and Goals</p>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <p class="font-weight-black text-h8">Are you a member of the Honors College?</p>
            <v-radio-group v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus">
              <v-radio label="Yes" value="Yes" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
              <v-radio label="No" value="No" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <p class="font-weight-black text-h8">Are you affiliated with the Honors College in any other way? If yes, please specify.</p>
            <v-radio-group v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus">
              <v-radio label="Yes" value="Yes" v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
              <v-text-field v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow" v-if="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus == 'Yes'" label="Please specify"></v-text-field>
              <v-radio label="No" value="No" v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <p class="font-weight-black text-h8">What is/are your current major(s)?</p>
            <v-text-field v-model="studentInformation.enrolledUHInfo.majorID" label="Major(s)"></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="11" md="7">
            <p class="font-weight-black text-h8">Are you pursuing, or planning to pursue, any of the following Honors College minors?</p>
            <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Data & Society"></v-checkbox>
            <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Medicine & Society"></v-checkbox>
            <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Phronesis"></v-checkbox>
            <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Creative Work"></v-checkbox>
            <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Energy and Sustainability"></v-checkbox>
            <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Leadership Studies"></v-checkbox>
            <v-checkbox v-model="studentInformation.enrolledUHInfo.honorsMinor" label="Global Engagement and Research"></v-checkbox>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <p class="font-weight-black text-h8">Are you pursuing any other minors? Please list.</p>
            <v-text-field v-model="studentInformation.enrolledUHInfo.otherMinor" label="Other Minor(s)"></v-text-field>
          </v-col>
        </v-row>
      <p class="font-weight-black text-h6" v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">Other Engagement</p>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <p class="font-weight-black text-h8">Are you a member of Honors in Community Health (HICH)?</p>
            <v-radio-group v-model="studentInformation.hichInfo.hichStatus">
              <v-radio label="Yes" value="Yes" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
              <v-radio label="No" value="No" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="12" md="7">
            <p class="font-weight-black text-h8">Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?</p>
            <v-radio-group v-model="studentInformation.hichInfo.hichHistoryStatus">
              <v-radio label="Yes" value="Yes" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
              <v-radio label="No" value="No" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'Yes'">
          <v-col cols="11">
            <p class="font-weight-black text-h8">Have you had other experience with Community Service?</p>
            <v-radio-group v-model="studentInformation.communityServiceInfo.serviceStatus">
              <v-radio label="Yes" value="Yes" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
              <v-radio label="No" value="No" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
                <p class="font-weight-black text-h8" v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
                <v-textarea v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'" label="Please specify"></v-textarea>
                <p class="font-weight-black text-h8" v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">Are you a member of any community organizations outside the University? Please list.</p>
                <v-text-field v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'" label="Please specify"></v-text-field>
            </v-radio-group>
          </v-col>
        </v-row>
    <p class="font-weight-black text-h6" v-if="studentInformation.enrolledUHInfo.uhStatus == 'No'">Non-UH Students Only</p>
      <v-col cols="11" md="10">
        <p class="font-weight-black text-h8" v-if="studentInformation.enrolledUHInfo.uhStatus == 'No'">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
        <v-row v-if="studentInformation.enrolledUHInfo.uhStatus == 'No'">
          <v-textarea v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" label="Please specify"></v-textarea>
        </v-row>
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
        cityOrigin: '',
        primaryLanguage: '',
        otherLanguages: '',
        languagePreference: '',
        pronouns: {
          she: false,
          he: false,
          they: false,
          ze: false,
          other: false,
          otherPronouns: '',
          preferNotToAnswer: false,
        },
        commentsByStaff: '',
        issuesConcernsTriggers: '',
        enrolledUHInfo: {
          uhStatus: '',
          uhEmail: '',
          peopleSoftID: '',
          expectedGraduationYear: '',
          livingOnCampus: '',
          honorsCollegeStatus: '',
          honorsCollegeAffiliatedStatus: '',
          honorsCollegeAffiliatedHow: '',
          majorID: '',
          honorsMinor: [],
          otherMinor: ''
        },
        hichInfo: {
          hichStatus: '',
          hichHistoryStatus: ''
        },
        communityServiceInfo: {
          serviceStatus: '',
          serviceHistoryDesc: '',
          serviceOrgsOutsideUH: ''
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