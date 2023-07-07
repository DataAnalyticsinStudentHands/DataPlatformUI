<template>
  <v-container style="width: 90%; margin: 0 auto;">
    <p class="font-weight-black text-h5 text--primary">Student Entry Form</p>
    <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again later.</p>
  </v-container>
  <v-form @submit.prevent="handleSubmitForm">
    <v-container style="width: 90%; margin: 0 auto;">
      <p class="font-weight-black text-h6">Demographics Information</p>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="studentInformation.cityOrigin" label="City of Origin" :rules="[v => !!v || 'Information is required']" required></v-text-field>
        </v-col>
      </v-row>
      <p class="font-weight-black">What languages do you speak?</p>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="studentInformation.primaryLanguage" label="Primary Language" :rules="[v => !!v || 'Information is required']" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="studentInformation.otherLanguages" label="Other Languages"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="7">
          <p class="font-weight-black">What language do you prefer to receive communication in?</p>
          <v-radio-group v-model="studentInformation.languagePreference" :rules="[v => !!v || 'Information is required']" required>
            <v-radio label="English" value="English" v-model="studentInformation.languagePreference"></v-radio>
            <v-radio label="Spanish" value="Spanish" v-model="studentInformation.languagePreference"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <div>
  <p class="font-weight-black">What are your pronouns? Select all that apply.</p>
  <div v-for="pronoun in studentInformation.pronouns" :key="pronoun.id" style="margin-top: 10px;">
    <label style="display: flex; align-items: center; color: #808080;">
      <input type="checkbox" v-model="pronoun.checked" style="outline: 2px solid gray; margin-right: 10px;">
      {{ pronoun.label }}
    </label>
    <input v-if="pronoun.id === 5 && pronoun.checked" type="text" placeholder="Other" v-model="studentInformation.otherPronouns" style="margin-left: 10px; border: none; border-bottom: 1px solid grey; padding: 5px; border-radius: 0;">
  </div>
  <br>
</div>

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
        <v-col cols="12" md="10">
          <p class="font-weight-black text-h8">Are you currently enrolled in a degree program at the University of Houston?</p>
          <v-radio-group v-model="studentInformation.enrolledUHInfo.uhStatus" :rules="[v => !!v || 'Information is required']" required>
            <v-radio label="Yes" value=true v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
            <v-radio label="No" value=false v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    <div v-if="studentInformation.enrolledUHInfo.uhStatus == 'true'">
      <p class="font-weight-black text-h6">UH Student Only</p>
          <v-row>
            <v-col cols="12" md="7">
              <v-text-field v-model="studentInformation.enrolledUHInfo.uhEmail" label="UH Email"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field v-model="studentInformation.enrolledUHInfo.peopleSoftID" label="PeopleSoft ID"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field type="date" v-model="studentInformation.enrolledUHInfo.expectedGraduationYear" label="Expected Graduation Date" min="2023-01-01" max="2099-12-31"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
              <p class="font-weight-black text-h8">Do you live on or off campus?</p>
              <v-radio-group v-model="studentInformation.enrolledUHInfo.livingOnCampus">
                <v-radio label="On-Campus" value=true v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
                <v-radio label="Off-Campus" value=false v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        <p class="font-weight-black text-h6">Educational Background and Goals</p>
          <v-row>
            <v-col cols="12" md="7">
              <p class="font-weight-black text-h8">Are you a member of the Honors College?</p>
              <v-radio-group v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus">
                <v-radio label="Yes" value=true v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                <v-radio label="No" value=false v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
              <p class="font-weight-black text-h8">Are you affiliated with the Honors College in any other way? If yes, please specify.</p>
              <v-radio-group v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus">
                <v-radio label="Yes" value=true v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
                <v-text-field v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow" v-if="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus == 'true'" label="Please specify"></v-text-field>
                <v-radio label="No" value=false v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row> 
          <v-row>
            <v-col cols="12" md="7">
              <p class="font-weight-black text-h8">What is/are your current major(s)?</p>
              <v-select v-model="studentInformation.enrolledUHInfo.majors" :items="filteredMajors.map(major => major['Plan Name'])" label="Select a Major" multiple chips></v-select>
            </v-col>
          </v-row>
          <v-row>
            <!-- Honors College Minors not given -->
            <v-col cols="11" md="7">
              <p class="font-weight-black text-h8">Are you pursuing, or planning to pursue, any of the following Honors College minors?</p>
              <v-select v-model="studentInformation.enrolledUHInfo.honorsMinors" :items="['Data & Society', 'Medicine & Society', 'Phronesis', 'Creative Work', 'Energy & Sustainability', 'Leadership Studies', 'Global Engagement and Research']" label="Select a Honors Minor" multiple chips></v-select>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
              <p class="font-weight-black text-h8">Are you pursuing any other minors? Please list.</p>
              <v-select v-model="studentInformation.enrolledUHInfo.otherMinors" :items="filteredMinors.map(minor => minor['Plan Name'])" label="Select a Minor" multiple chips></v-select>
            </v-col>
          </v-row>
        <p class="font-weight-black text-h6">Other Engagement</p>
          <v-row>
            <v-col cols="12" md="7">
              <p class="font-weight-black text-h8">Are you a member of Honors in Community Health (HICH)?</p>
              <v-radio-group v-model="studentInformation.hichInfo.hichStatus">
                <v-radio label="Yes" value=true v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                <v-radio label="No" value=false v-model="studentInformation.hichInfo.hichStatus"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
              <p class="font-weight-black text-h8">Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?</p>
              <v-radio-group v-model="studentInformation.hichInfo.hichHistoryStatus">
                <v-radio label="Yes" value=true v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                <v-radio label="No" value=false v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="11">
              <p class="font-weight-black text-h8">Have you had other experience with Community Service?</p>
              <v-radio-group v-model="studentInformation.communityServiceInfo.serviceStatus">
                <v-radio label="Yes" value=true v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
                <v-radio label="No" value=false v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
                  <p class="font-weight-black text-h8" v-if="(studentInformation.communityServiceInfo.serviceStatus == 'true')">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
                  <v-textarea v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" v-if="(studentInformation.communityServiceInfo.serviceStatus == 'true')" label="Please specify"></v-textarea>
                  <p class="font-weight-black text-h8" v-if="studentInformation.communityServiceInfo.serviceStatus == 'true'">Are you a member of any community organizations outside the University? Please list.</p>
                  <v-text-field v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" v-if="studentInformation.communityServiceInfo.serviceStatus == 'true'" label="Please specify"></v-text-field>
              </v-radio-group>
            </v-col>
          </v-row>
    </div>
    <div v-if="studentInformation.enrolledUHInfo.uhStatus == 'false'">
      <p class="font-weight-black text-h6">Non-UH Students Only</p>
        <v-col cols="11">
          <p class="font-weight-black text-h8">Have you had experience with Community Service?</p>
          <v-radio-group v-model="studentInformation.communityServiceInfo.serviceStatus">
            <v-radio label="Yes" value=true v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
            <v-radio label="No" value=false v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="11" md="10">
          <p class="font-weight-black text-h8" v-if="(studentInformation.communityServiceInfo.serviceStatus == 'true')">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
          <v-textarea v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" v-if="(studentInformation.communityServiceInfo.serviceStatus == 'true')" label="Please specify"></v-textarea>
        </v-col>
        <v-col cols="11" md="10">
          <p class="font-weight-black text-h8" v-if="studentInformation.communityServiceInfo.serviceStatus == 'true'">Are you a member of any community organizations outside the University? Please list.</p>
          <v-row v-if="studentInformation.communityServiceInfo.serviceStatus == 'true'">
            <v-textarea v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" label="Please specify"></v-textarea>
          </v-row>
        </v-col>
    </div>
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
              <v-text-field v-if="specializedType.id === 6 && specializedType.checked" label="Please Specify" v-model="studentInformation.specializedDegCert.professionalDesignOther"></v-text-field>
            </div>
          </div>
        </v-col>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn type="submit" methods="handleSubmitForm" @click="$event => showToast()" class="btn btn-success">Submit Form</v-btn>
          </v-col>
        </v-row>
    </v-container>
  </v-form>
</template>

<style>
.v-field__input input {
   display: none;
}
</style>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
  data() {
    return {
      studentInformation: {
        cityOrigin: '', 
        primaryLanguage: '',
        otherLanguages: '',
        languagePreference: '',
        pronouns: [
          { id: 1, label: "She/her/hers", checked: false },
          { id: 2, label: "He/him/his", checked: false },
          { id: 3, label: "They/them/theirs", checked: false },
          { id: 4, label: "Ze/Zir/Zirs", checked: false },
          { id: 5, label: "Other", checked: false },
          { id: 6, label: "Prefer not to answer", checked: false },
        ],
        otherPronouns: '',
        commentsByStaff: '',
        issuesConcernsTriggers: '',
        enrolledUHInfo: {
          uhStatus: null,
          uhEmail: '',
          peopleSoftID: '',
          expectedGraduationYear: '',
          livingOnCampus: false,
          honorsCollegeStatus: false,
          honorsCollegeAffiliatedStatus: false,
          honorsCollegeAffiliatedHow: '',
          majors: [], 
          honorsMinors: [],
          otherMinors: []
        },
        hichInfo: {
          hichStatus: false,
          hichHistoryStatus: false
        },
        communityServiceInfo: {
          serviceStatus: false,
          serviceHistoryDesc: '',
          serviceOrgsOutsideUH: ''
        },
        graduateProfessionalSchool: {
          programGradProStatus: false,
          programGradProType: [
            { id: 1, label: "MD/DO", checked: false },
            { id: 2, label: "Physician Assistant: PA", checked: false },
            { id: 3, label: "Nursing: MSN, DNP", checked: false },
            { id: 4, label: "PhD", checked: false },
            { id: 5, label: "DrPH", checked: false },
            { id: 6, label: "Law: JD", checked: false },
            { id: 7, label: "Master's: MPH, MBA, MA, MS, MEd, etc", checked: false },
            { id: 8, label: "Other", checked: false },
          ],
          phDTextbox: '',
          masterTextbox: '',
          otherTextbox: '',
        },
        specializedDegCert: {
          specializedDegCertStatus: false,
          specializedDegCertType: [
            { id: 1, label: "Nursing: PRN, RN, CNA, etc", checked: false },
            { id: 2, label: "Social Work: LSW/LCSW", checked: false },
            { id: 3, label: "Business: Certified Public Accountant (CPA, Licensed Public Accountant (LPA), Certified Financial Planner (CFP)", checked: false },
            { id: 4, label: "Engineering/Technology: Professional Engineer (PE), Certified Technology Specialist (CTS), etc", checked: false },
            { id: 5, label: "Project Management: Certified Associate in Project Management (CAPM), Project Management Professional (PMP)", checked: false },
            { id: 6, label: "Other Professional Designation", checked: false }
          ],
          professionalDesignOther: '',
        },
      },
      majors: [],
      minors: []
    }
  },
  mounted() {
    // Fetch the JSON data
    fetch('../../majorsAndMinors.json')
      .then(response => response.json())
      .then(data => {
        this.majors = data;
        this.minors = data;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  },
  computed: {
    year() {
      return new Date(this.dateInput).getFullYear()
    },
    filteredMajors() {
      return this.majors.filter(major => major['Plan Type'] === 'MAJ');
    },
    filteredMinors() {
      return this.minors.filter(minor => minor['Plan Type'] === 'MIN');
    }
  },
  methods: {
    async handleSubmitForm() {
      const user = useLoggedInUserStore()
      let token = user.token
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/entryForms/';
      axios.post(apiURL, { studentInformation: this.studentInformation}, { headers: { token } }).then(() => {
        this.$router.push('/studentDashboard');
        this.studentInformation = {
            cityOrigin: '',
            primaryLanguage: '',
            otherLanguages: '',
            languagePreference: '',
            pronouns: [],
            otherPronouns: '',
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
              majors: [], 
              honorsMinors: [],
              otherMinors: []
            },
            hichInfo: {
             hichStatus: '',
             hichHistoryStatus: ''
            },
            communityServiceInfo: {
              serviceStatus: '',
              serviceHistoryDesc: '',
              serviceOrgsOutsideUH: ''
            },
            graduateProfessionalSchool: {
              programGradProStatus: '',
              programGradProType: [],
              phDTextbox: '',
              masterTextbox: '',
              otherTextbox: '',
            },
            specializedDegCert: {
              specializedDegCertStatus: '',
              specializedDegCertType: [],
              professionalDesignOther: '',
            },
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
}
</script>