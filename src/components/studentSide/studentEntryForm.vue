<!-- PHIL, REMEMBER TO TURN OFF ALL DEPENDENT VALUES BEFORE FORM SUBMISSION -->

<template> <!-- Start of the Student Entry Form template -->

  <v-container style="width: 90%; margin: 0 auto;"> <!-- Container for the form title and description -->
    <p class="font-weight-black text-h5 text--primary">Student Entry Form</p>
    <p class="text-subtitle-1">Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again later.</p>
  </v-container>
  <v-form 
  ref="form"
  @submit.prevent="handleValidations">
    <v-container style="width: 90%; margin: 0 auto;">
      <p 
      :class="{'error-text': isDemographicsInformationInvalid}"
      class="font-weight-black text-h6 mb-2">Demographics Information</p>
      <p 
      class="font-weight-black">In which city were you born?</p>
      <v-row class="mb-4">
      <v-col cols="12" md="6">
          <v-text-field 
          v-model="studentInformation.cityOrigin" 
          label="City of Origin" 
          outlined>
          </v-text-field>
      </v-col>
      </v-row>

      <p 
      class="font-weight-black">What languages do you speak?</p>
      <v-row class="mb-4">
          <v-col cols="12" md="6">
              <v-text-field 
              v-model="studentInformation.primaryLanguage" 
              label="Primary Language" 
              outlined>
              </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
              <v-text-field 
              v-model="studentInformation.otherLanguages" 
              label="Other Languages" 
              outlined>
              </v-text-field>
          </v-col>
      </v-row>
      <v-row class="mb-4">
          <v-col cols="12" md="7">
              <p :class="{'error-text': isLanguagePreferenceInvalid}" class="font-weight-black">What language do you prefer to receive communication in?</p>
              <v-radio-group 
              :class="{'error-text': isLanguagePreferenceInvalid}" 
              v-model="studentInformation.languagePreference" 
              :rules="[v => !!v || 'Information is required']" 
              required>
              <v-radio label="English" value="English"></v-radio>
              <v-radio label="Spanish" value="Spanish"></v-radio>
              </v-radio-group>
          </v-col>
      </v-row>

  <v-row class="mb-4">
        <v-col cols="12">
      <div>
        <p 
            :class="{'error-text': isOtherPronounsInvalid}"
            class="font-weight-black">What are your pronouns? Select all that apply.</p>

        <!-- Loop through all checkboxes except the last one -->
        <div 
          v-for="pronoun in studentInformation.pronouns.slice(0, -1)" 
          :key="pronoun.id"
          class="relative"
          @mouseover="hoveredCheckboxID = pronoun.id" 
          @mouseleave="hoveredCheckboxID = null"
          >
            <v-checkbox 
                density="compact"
                class="ma-0 pa-0" hide-details="true"
                v-model="pronoun.checked" 
                :label="pronoun.label"
                :color="pronoun.id === 5 && isOtherPronounsInvalid ? 'error' : ''"
                :indeterminate="studentInformation.pronouns[studentInformation.pronouns.length - 1].checked && !pronoun.checked"
            >
            </v-checkbox>

    <!-- Tooltip -->
    <transition name="slide-y-transition">
      <span 
        v-if="studentInformation.pronouns[studentInformation.pronouns.length - 1].checked && !pronoun.checked && hoveredCheckboxID === pronoun.id"
        class="absolute top-0 left-0 mt-2 ml-6 px-2 py-1 text-xs text-white bg-gray-800 rounded"
        style="transform: translate(-100%, 0);"
      >
          De-select "Prefer not to answer" to select this.
      </span>
    </transition>
        </div>

        <!-- "Other" text field -->
            <v-row>
                <v-col cols="6">
                  <transition name="slide-y-transition">
                    <div v-show="isOtherPronounChecked">
                    <v-text-field 
                      ref="otherPronounsField"
                      :class="{'error-text': isOtherPronounsInvalid}"
                      placeholder="Other" 
                      v-model="studentInformation.otherPronouns" 
                      outlined
                      :rules="otherPronounsRules"
                    >
                    </v-text-field>
                  </div>
                  </transition>
                </v-col>
            </v-row>

        <!-- Loop for the last checkbox ("Prefer not to say") -->
        <div v-if="studentInformation.pronouns.length">
            <v-checkbox 
                density="compact"
                class="ma-0 pa-0" hide-details="true"
                v-model="studentInformation.pronouns[studentInformation.pronouns.length - 1].checked" 
                :label="studentInformation.pronouns[studentInformation.pronouns.length - 1].label"
            >
            </v-checkbox>
        </div>
    </div>
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
        <v-col cols="12" md="10">
          <p 
          :class="{'error-text': isUhStatusInvalid}"
          class="font-weight-black text-h8">Are you currently enrolled in a degree program at the University of Houston?</p>
          <v-radio-group 
          :class="{'error-text': isUhStatusInvalid}"
          v-model="studentInformation.enrolledUHInfo.uhStatus" :rules="[v => !!v || 'Information is required']" required>
            <v-radio label="Yes" value="Yes" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
            <v-radio label="No" value="No" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>


      <transition-group name="slide-y-transition" tag="div">
        <div v-show="isUHStudent" key="uhStudent">

    <div>
          <p 
          :class="{'error-text': isEnrolledUHInfoInvalid}"
          class="font-weight-black text-h6">UH Student Only</p>
          <v-row>
          <v-col cols="12" md="7">
                <v-text-field 
                ref="uhEmailField"
                v-model="studentInformation.enrolledUHInfo.uhEmail" 
                label="UH Email"
                :rules="uhEmailRules"
                ></v-text-field>
          </v-col>
          </v-row>


          <v-row>
          <v-col cols="12" md="4">
            <v-text-field 
            ref="peopleSoftIDField"
            v-model="studentInformation.enrolledUHInfo.peopleSoftID" 
            label="PeopleSoft ID"
            :rules="peopleSoftIDRules"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field 
            type="date" 
            v-model="studentInformation.enrolledUHInfo.expectedGraduationYear" 
            label="Expected Graduation Date" 
            min="2023-01-01" 
            max="2099-12-31"></v-text-field>
          </v-col>
        </v-row>

          <v-row>
            <v-col cols="12" md="7">
              <p 
              class="font-weight-black text-h8">Do you live on or off campus?</p>
              <v-radio-group 
              v-model="studentInformation.enrolledUHInfo.livingOnCampus">
                <v-radio label="On-Campus" value="On-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
                <v-radio label="Off-Campus" value="Off-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        <p 
        :class="{'error-text': isEducationalBackgroundAndGoalsInvalid}"
        class="font-weight-black text-h6">Educational Background and Goals</p>
          <v-row>
            <v-col cols="12" md="7">
                <p 
                :class="{'error-text': isHonorsCollegeStatusInvalid}"
                class="font-weight-black text-h8">Are you a member of the Honors College?</p>
                <v-radio-group 
                :class="{'error-text': isHonorsCollegeStatusInvalid}"
                v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"
                :rules="honorsCollegeStatusRules" 
                :error-messages="honorsCollegeStatusErrorMessage"
                >
                  <v-radio 
                  label="Yes" value="Yes" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                  <v-radio label="No" value="No" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="7">
                <p 
                :class="{'error-text': isHonorsCollegeAffiliatedStatusInvalid}"
                class="font-weight-black text-h8">Are you affiliated with the Honors College in any other way? If yes, please specify.</p>
                <v-radio-group 
                :class="{'error-text': isHonorsCollegeAffiliatedStatusInvalid}"
                v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"
                :rules="honorsCollegeAffiliatedStatusRules"
                :error-messages="honorsCollegeAffiliatedStatusErrorMessage">
                  <v-radio label="Yes" value="Yes" v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
                  <transition name="slide-y-transition">
                    <v-text-field 
                    ref="honorsCollegeAffiliatedHowField"
                    v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow" v-show="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus == 'Yes'" 
                    label="Please specify"
                    :rules="honorsCollegeAffiliatedHowRules"
                    ></v-text-field>
                </transition>
                  <v-radio label="No" value="No" v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus"></v-radio>
                </v-radio-group>
            </v-col>
          </v-row> 


          <v-row>
              <v-col cols="12" md="7">
                    <p 
                    :class="{'error-text': isMajorsInvalid}"
                    class="font-weight-black text-h8">What is/are your current major(s)?</p>
                    <v-autocomplete
                        ref="majorsField"
                        clearable
                        chips
                        v-model="studentInformation.enrolledUHInfo.majors" 
                        :items="filteredMajors.map(major => major['Plan Name'])" 
                        label="Select a Major" 
                        multiple
                        :rules="majorsRules"
                        >
                    </v-autocomplete>
              </v-col>
          </v-row>
          <v-row>
            <!-- Honors College Minors not given -->
            <v-col cols="11" md="7">
                <p 
                :class="{'error-text': isHonorsMinorsInvalid}"
                class="font-weight-black text-h8">Are you pursuing, or planning to pursue, any of the following Honors College minors?</p>
                <v-autocomplete
                  ref="honorsMinorsRef"
                  v-model="studentInformation.enrolledUHInfo.honorsMinors" 
                  :items="['None', 'Data & Society', 'Medicine & Society', 'Phronesis', 'Creative Work', 'Energy & Sustainability', 'Leadership Studies', 'Global Engagement and Research']" 
                  label="Select a Honors Minor" 
                  multiple
                  clearable
                  chips
                  :rules="honorsMinorsRules">
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
                <p 
                class="font-weight-black text-h8">Are you pursuing any other minors?</p>
                <v-autocomplete
                  v-model="studentInformation.enrolledUHInfo.otherMinors" 
                  :items="filteredMinors.map(minor => minor['Plan Name'])" 
                  label="Select a Minor" 
                  multiple 
                  clearable
                  chips></v-autocomplete>
            </v-col>
          </v-row>
          <p 
          :class="{'error-text': isOtherEngagementValid}"
          class="font-weight-black text-h6">Other Engagement</p>
          <v-row>
            <v-col cols="12" md="7">
                <p 
                class="font-weight-black text-h8">Are you a member of Honors in Community Health (HICH)?</p>
                <v-radio-group
                v-model="studentInformation.hichInfo.hichStatus">
                  <v-radio label="Yes" value="Yes" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                  <v-radio label="No" value="No" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
               <p 
               class="font-weight-black text-h8">Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?</p>
                <v-radio-group 
                v-model="studentInformation.hichInfo.hichHistoryStatus">
                  <v-radio label="Yes" value="Yes" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                  <v-radio label="No" value="No" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
        <v-col cols="11">
            <p 
            v-show="isUHStudent"
            :class="{'error-text': isServiceStatusInvalid}"
            class="font-weight-black text-h8">
                {{ studentInformation.enrolledUHInfo.uhStatus !== 'Yes' 
                  ? 'Have you had experience with Community Service?' 
                  : 'Have you had other experience with Community Service?' }}
            </p>
            <v-radio-group 
            v-model="studentInformation.communityServiceInfo.serviceStatus"
            :rules="serviceStatusRules"
            :class="{'error-text': isServiceStatusInvalid}">
              <v-radio label="Yes" value="Yes" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
              <v-radio label="No" value="No" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
            </v-radio-group>
        </v-col>
        <v-col cols="11" md="10">
          <transition name="slide-y-transition">
            <div v-show="(studentInformation.communityServiceInfo.serviceStatus == 'Yes')">
              <p 
              :class="{'error-text': isServiceHistoryDescInvalid}"
              class="font-weight-black text-h8">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
              <v-textarea 
              v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" 
              label="Please specify"
              :rules="serviceHistoryDescRules"
              ></v-textarea>
            </div>
          </transition>
        </v-col>
        <v-col cols="11" md="10">
          <transition name="slide-y-transition">
            <div v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
          <p class="font-weight-black text-h8">Are you a member of any community organizations outside the University? Please list.</p>
          <v-row>
            <v-textarea v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" label="Please specify"></v-textarea>
          </v-row>
        </div>
          </transition>
        </v-col>
      </v-row>
    </div>

  </div>
  
  <div v-show="isNotUHStudent" key="notUHStudent">


    <div>
      <p 
      :class="{'error-text': isServiceStatusInvalid || isServiceHistoryDescInvalid}"
      class="font-weight-black text-h6">Non-UH Students Only</p>
    </div>
    <div>
      <v-col
      cols="11">
          <p 
          :class="{'error-text': isServiceStatusInvalid}"
          class="font-weight-black text-h8">
              {{ studentInformation.enrolledUHInfo.uhStatus !== 'Yes' 
                ? 'Have you had experience with Community Service?' 
                : 'Have you had other experience with Community Service?' }}
          </p>
          <v-radio-group 
          v-model="studentInformation.communityServiceInfo.serviceStatus"
          :rules="serviceStatusRules"
          :class="{'error-text': isServiceStatusInvalid}">
            <v-radio label="Yes" value="Yes" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
            <v-radio label="No" value="No" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="11" md="10">
          <transition name="slide-y-transition">
            <div v-show="(studentInformation.communityServiceInfo.serviceStatus == 'Yes')">
          <p 
          :class="{'error-text': isServiceHistoryDescInvalid}"
          class="font-weight-black text-h8">Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.</p>
          <v-textarea 
          v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" 
          label="Please specify"
          :rules="serviceHistoryDescRules"
          ></v-textarea>
        </div>
        </transition>
        </v-col>
        <transition name="slide-y-transition">
          <div v-show="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
        <v-col cols="11" md="10">
          <p class="font-weight-black text-h8" >Are you a member of any community organizations outside the University? Please list.</p>
          <v-row v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
            <v-textarea v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" label="Please specify"></v-textarea>
          </v-row>
        </v-col>
        </div>
        </transition>
    </div>

  </div>
  </transition-group>


      <p 
      :class="{'error-text': isGraduateProfessionalSchoolGoalsInvalid}"
      class="font-weight-black text-h6">Graduate/Professional School Goals</p>
        <v-col cols="12" md="10">
          <p 
          :class="{'error-text': isProgramGradProStatusValid}"
          class="font-weight-black text-h8">Do you currently plan to pursue graduate or professional (e.g. medical, law) school?</p>
          <v-radio-group 
          :class="{'error-text': isProgramGradProStatusValid}"
          v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"
          :rules="programGradProStatusRules">
            <v-radio label="Yes" value="Yes" v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
            <v-radio label="No" value="No" v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
          </v-radio-group>
        </v-col>
        <transition name="slide-y-transition">
        <v-col cols="12" md="10" v-if="studentInformation.graduateProfessionalSchool.programGradProStatus === 'Yes'">
          <p class="font-weight-black text-h8">If you are planning to pursue graduate school, what type of program?</p>
          <div>
            <div v-for="programType in studentInformation.graduateProfessionalSchool.programGradProType" :key="programType.id">
              <v-checkbox 
              v-model="programType.checked" :label="programType.label"
              density="compact"
              class="ma-0 pa-0" hide-details="true"></v-checkbox>
              <v-row>
                <v-col cols="12" md="10">
                  <transition name="slide-y-transition">
                    <v-text-field v-if="programType.id === 4 && programType.checked" label="Please Specify" v-model="studentInformation.graduateProfessionalSchool.phDTextbox"></v-text-field>
                  </transition>
                  <transition name="slide-y-transition">
                    <v-text-field v-if="programType.id === 7 && programType.checked" label="Please Specify" v-model="studentInformation.graduateProfessionalSchool.masterTextbox"></v-text-field>
                  </transition>
                  <transition name="slide-y-transition">
                    <v-text-field v-if="programType.id === 8 && programType.checked" label="Please Specify" v-model="studentInformation.graduateProfessionalSchool.otherTextbox"></v-text-field>
                  </transition>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col> 
      </transition>
        <v-col cols="12" md="10">
          <p 
          :class="{'error-text': isSpecializedDegCertStatusInvalid}"
          class="font-weight-black text-h8">Are you planning to pursue any other kind of specialized degree / certificate program?</p>
          <v-radio-group 
          :class="{'error-text': isSpecializedDegCertStatusInvalid}"
          v-model="studentInformation.specializedDegCert.specializedDegCertStatus"
          :rules="specializedDegCertStatusRules">
            <v-radio label="Yes" value="Yes" v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
            <v-radio label="No" value="No" v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
          </v-radio-group>
        </v-col>
        <transition name="slide-y-transition">
        <v-col cols="12" md="10" v-if="studentInformation.specializedDegCert.specializedDegCertStatus === 'Yes'">
          <p class="font-weight-black text-h8">If you are planning to pursue a specialized degree / certificate program, what type of program?</p>
          <div>
            <div v-for="specializedType in studentInformation.specializedDegCert.specializedDegCertType" :key="specializedType.id">
              <v-checkbox 
              v-model="specializedType.checked" 
              :label="specializedType.label"
              density="compact"
              class="ma-0 pa-0" hide-details="true"></v-checkbox>
              <v-row>
                <v-col cols="12" md="10">
                  <transition name="slide-y-transition">
                  <v-text-field v-if="specializedType.id === 6 && specializedType.checked" label="Please Specify" v-model="studentInformation.specializedDegCert.professionalDesignOther"></v-text-field>
                </transition>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </transition>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn type="submit" methods="handleValidations" class="btn btn-success">Submit Form</v-btn>
          </v-col>
        </v-row>
    </v-container>
  </v-form>
</template>

<style>
.v-field__input > input[size="1"] {
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

.v-field__input > input[size="1"]::before,
.v-field__input > input[size="1"]::after {
  display: none;
}

.no-padding {
  padding-left: 0 !important;
  padding-right: 0 !important;
}


.slide-y-transition-enter-active, .slide-y-transition-leave-active {
	transition: all 0.5s ease-in-out;
}
/* delay leave of parent element */
.slide-y-transition-leave-active {
  transition-delay: 0.25s;
  transition: all 0.5s ease-in-out;
}


.error-text {
  color: darkred;
  }

</style>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
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
          specializedDegCertStatus: '',
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
      minors: [],
      formSubmitted: false,
      hoveredCheckboxID: null,
      otherPronounsRules: [
          v => {
              if (!this.formSubmitted) return true;
              // Get the 'Other' pronoun object from studentInformation.pronouns
              const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);

              // If the condition for v-show is false (Other pronoun not checked), validation passes automatically
              if (!otherPronoun || !otherPronoun.checked) return true;

              return !!v || 'If Other is selected, please specify pronouns.';
          },
      ],
      uhEmailRules: [
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              // Otherwise, check if the email is not empty
              return !!v || 'A valid UH email is required.';
          },
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              // Otherwise, validate the email format
              return /[@](cougarnet\.uh\.edu|uh\.edu)$/.test(v) || 'Email must end with @cougarnet.uh.edu or @uh.edu';
          }
      ],
      peopleSoftIDRules: [
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              // Otherwise, check if the email is not empty
              return !!v || 'A valid PeopleSoftID is required.';
          },
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              // Otherwise, validate the email format
              return /^\d+$/.test(v) || 'PeopleSoftID must contain only numbers.';
          }
      ],
      honorsCollegeStatusRules: [
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              return !!v || 'Information is required.';
          },
      ],
      honorsCollegeAffiliatedStatusRules: [
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              return !!v || 'Information is required.';
          },
      ],
      honorsCollegeAffiliatedHowRules: [
      v => {
          // If user is not a UH student, validation passes automatically
          if (!this.uHStudentCheck) return true;
          // if user is a UH student, but did not choose "yes" for affiliation with Honors College in any other way, then validation passess automatically
          if (this.uHStudentCheck && this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus !== 'Yes') return true;

          return !!v || 'Information is required.';
      },
      ],
      majorsRules: [
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              return (v && v.length > 0) || 'At least one Major is required.';
          }
      ],
      honorsMinorsRules: [
      v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) return true;

              return (v && v.length > 0) || 'Please select at least one Minor, or "None".';
          }
      ],
      serviceStatusRules: [
          v => {
            return !!v || 'Information is required.';
          }
      ],
      serviceHistoryDescRules: [
        v => {
        // if user has not had comm-service experience, then skip validation.
              if (!this.formSubmitted || this.studentInformation.communityServiceInfo.serviceStatus === 'No') return true;

              return !!v || 'Information is required.';
            }
      ],
      programGradProStatusRules: [
          v => {
            return !!v || 'Information is required.';
          }
      ],
      specializedDegCertStatusRules: [
        v => {
          return !!v || 'Information is required.';
        }
      ]
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
  watch: {
    'studentInformation.pronouns': {
        deep: true,
        handler(newVal) {
            const preferNotToAnswer = newVal.find(p => p.id === 6);
            if (preferNotToAnswer && preferNotToAnswer.checked) {
                newVal.forEach(pronoun => {
                    if (pronoun.id !== 6) {
                        pronoun.checked = false;
                    }
                });
            }

            const otherPronoun = newVal.find(pronoun => pronoun.id === 5);
            if (otherPronoun && otherPronoun.checked && this.formSubmitted) {
              console.log('philtest')
                this.$refs.otherPronounsField.validate();
            }
        }
    },
  'studentInformation.enrolledUHInfo.uhStatus'(newValue) {
      if (newValue === 'Yes' && this.formSubmitted) {
          // Trigger validation on the fields
          this.$refs.uhEmailField.validate();
          this.$refs.peopleSoftIDField.validate();
          this.$refs.majorsField.validate();
          this.$refs.honorsMinorsRef.validate();
      }
  },
  'studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus'(newValue) {
    if (newValue === 'Yes' && this.formSubmitted) {
      // Trigger child validations for "Are you affiliated with the Honors College in any other way? If yes, please specify."
      this.$refs.honorsCollegeAffiliatedHowField.validate();
    }
  },

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
    },
    isDemographicsInformationInvalid() {
      if (!this.formSubmitted) return false;
      return this.isLanguagePreferenceInvalid || this.isOtherPronounsInvalid;
    },
    isLanguagePreferenceInvalid() {
      if (!this.formSubmitted) return false;
      const rule = v => !!v || 'Information is required';
      return rule(this.studentInformation.languagePreference) !== true;
    },
    isOtherPronounChecked() {
        const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
        return otherPronoun ? otherPronoun.checked : false;
    },
    isOtherPronounsInvalid() {
      if (!this.formSubmitted) return false;
      const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
      return otherPronoun.checked && !this.studentInformation.otherPronouns;
    },
    isUhStatusInvalid() {
      if (!this.formSubmitted) return false;
      const rule = v => !!v || 'Information is required.';
      return rule(this.studentInformation.enrolledUHInfo.uhStatus) !== true;
    },
    isUHStudent() {
      return this.studentInformation.enrolledUHInfo.uhStatus === 'Yes';
    },
    isNotUHStudent() {
      return this.studentInformation.enrolledUHInfo.uhStatus === 'No';
    },
    uHStudentCheck() {
      return this.formSubmitted && this.studentInformation.enrolledUHInfo.uhStatus === 'Yes';
    },
    isEnrolledUHInfoInvalid() {
      // if user is not UH Student, skip validation
      if (!this.uHStudentCheck) return false;

      // Check if UH Email is invalid
      const isUHEmailInvalid = this.uhEmailRules.some(rule => 
      typeof rule(this.studentInformation.enrolledUHInfo.uhEmail) === 'string'
      );

      // Check if PeopleSoftID is invalid
      const isPeopleSoftIDInvalid = this.peopleSoftIDRules.some(rule => 
      typeof rule(this.studentInformation.enrolledUHInfo.peopleSoftID) === 'string'
      );

      // Return true if either input is invalid
      return isUHEmailInvalid || isPeopleSoftIDInvalid;
  },
  isHonorsCollegeStatusInvalid() {
      // if user is not UH Student, skip validation
      if (!this.uHStudentCheck) return false;
      const rule = v => !!v || 'Information is required';
      return rule(this.studentInformation.enrolledUHInfo.honorsCollegeStatus) !== true;
  },
  honorsCollegeStatusErrorMessage() {
      if (this.uHStudentCheck) {
          // Evaluate the validation rule
          const validationResult = this.honorsCollegeStatusRules[0](this.studentInformation.enrolledUHInfo.honorsCollegeStatus);
          
          // If validation passes (result is true), return an empty string
          if (validationResult === true) {
              return '';
          }

          // Otherwise, return the error message
          return validationResult;
      }
      // If user is not a UH student, then return empty string.
      return '';
  },
  isHonorsCollegeAffiliatedStatusInvalid() {
      // if user is not UH Student, skip validation
      if (!this.uHStudentCheck) return false;

      const radioRule = v => !!v || 'Information is required';
      const isRadioInvalid = radioRule(this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus) !== true;

      const isTextFieldInvalid = this.studentInformation.enrolledUHInfo.uhStatus === 'Yes' && 
                                 this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus === 'Yes' && 
                                 this.honorsCollegeAffiliatedHowRules.some(rule => 
                                     typeof rule(this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow) === 'string');

      return isRadioInvalid || isTextFieldInvalid;
  },
  honorsCollegeAffiliatedStatusErrorMessage() {
      if (this.uHStudentCheck) {
          // Evaluate the validation rule
          const validationResult = this.honorsCollegeAffiliatedStatusRules[0](this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus);
          
          // If validation passes (result is true), return an empty string
          if (validationResult === true) {
              return '';
          }

          // Otherwise, return the error message
          return validationResult;
      }
      return '';
  },
  isMajorsInvalid() {
      // if user is not UH Student, skip validation
      if (!this.uHStudentCheck) return false;

      // Check the validation rule for the majors
      return this.majorsRules[0](this.studentInformation.enrolledUHInfo.majors) !== true;
  },
  isHonorsMinorsInvalid() {
      // if user is not UH Student, skip validation
      if (!this.uHStudentCheck) return false;

    // Check the validation rule for the minors
    return this.honorsMinorsRules[0](this.studentInformation.enrolledUHInfo.honorsMinors) !== true;
  },
  isEducationalBackgroundAndGoalsInvalid() {
      // if user is not UH Student, skip validation
      if (!this.uHStudentCheck) return false;

      return this.isHonorsCollegeStatusInvalid || this.isHonorsCollegeAffiliatedStatusInvalid || this.isMajorsInvalid || this.isHonorsMinorsInvalid;
  },
  isOtherEngagementValid() {
      // if user is not UH Student, skip validation
      if (!this.uHStudentCheck) return false;

      // Check serviceStatus validation
      return this.isServiceStatusInvalid || this.isServiceHistoryDescInvalid;
  },
  isServiceStatusInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.studentInformation.communityServiceInfo.serviceStatus) !== true;
  },
  isServiceHistoryDescInvalid() {
    // if form wasn't submitted, or if user has not had comm-service experience, then skip validation.
    if (!this.formSubmitted || this.studentInformation.communityServiceInfo.serviceStatus === 'No') return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.studentInformation.communityServiceInfo.serviceHistoryDesc) !== true;
  },
  isProgramGradProStatusValid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.studentInformation.graduateProfessionalSchool.programGradProStatus) !== true;
  },
  isSpecializedDegCertStatusInvalid() {
    if (!this.formSubmitted) return false;
    const rule = v => !!v || 'Information is required';
    return rule(this.studentInformation.specializedDegCert.specializedDegCertStatus) !== true;
  },
  isGraduateProfessionalSchoolGoalsInvalid() {
    if (!this.formSubmitted) return false;

    return this.isProgramGradProStatusValid || this.isSpecializedDegCertStatusInvalid;
  },
  },
  methods: {
    async handleValidations() {
      this.formSubmitted = true;
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.cleanupFormData();
        this.submitCompletedForm();
      } else {
        toast.error("Oops! Error(s) detected. Please review and try again.", {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete'
          });
        return;
      }
    },
    async submitCompletedForm() {
      console.log('this.studentInformation', this.studentInformation)
      const user = useLoggedInUserStore()
      let token = user.token
      let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/entryForms/';
      axios.post(apiURL, { studentInformation: this.studentInformation}, { headers: { token } }).then(() => {
        this.$router.push({ 
              name: 'studentDashboard',
              params: {
                toastType: 'success',
                toastMessage: 'Thank you for completing the Student Entry Form!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
    },
    cleanupFormData() {
      // Check condition for "Other" pronouns
      const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
      const isOtherPronounChecked = otherPronoun ? otherPronoun.checked : false;

      if (!isOtherPronounChecked) {
        this.studentInformation.otherPronouns = '';
      }

      // Check condition for UH student
      //Check condition for "honorsCollegeAffiliatedStatus"
      const honorsCollegeAffiliatedStatusCheck = this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus === 'Yes';

      if (!this.uHStudentCheck) {
        this.studentInformation.enrolledUHInfo.uhEmail = '';
        this.studentInformation.enrolledUHInfo.peopleSoftID = '';
        this.studentInformation.enrolledUHInfo.expectedGraduationYear = '';
        this.studentInformation.enrolledUHInfo.livingOnCampus = '';
        this.studentInformation.enrolledUHInfo.honorsCollegeStatus = '';
        this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus = '';
        this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow = '';
        this.studentInformation.enrolledUHInfo.majors = [];
        this.studentInformation.enrolledUHInfo.honorsMinors = [];
        this.studentInformation.enrolledUHInfo.otherMinors = [];
        this.studentInformation.hichInfo.hichStatus = '';
        this.studentInformation.hichInfo.hichHistoryStatus = '';
      } else if (this.uhStudentCheck && !honorsCollegeAffiliatedStatusCheck) {
        this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow = '';
      }
      
      //Check condition for "serviceStatus"
      const serviceStatusCheck = this.studentInformation.communityServiceInfo.serviceStatus === 'Yes';
      if (!serviceStatusCheck) {
        this.studentInformation.communityServiceInfo.serviceHistoryDesc = '';
        this.studentInformation.communityServiceInfo.serviceOrgsOutsideUH = '';
      }

      //Check condition for programGradProStatus
      const phDTextboxFind = this.studentInformation.graduateProfessionalSchool.programGradProType.find(p => p.id === 4);
      const isphDTextboxChecked = phDTextboxFind ? phDTextboxFind.checked : false;

      const masterTextboxFind = this.studentInformation.graduateProfessionalSchool.programGradProType.find(p => p.id === 7);
      const isMasterTextboxChecked = masterTextboxFind ? masterTextboxFind.checked : false;

      const otherTextboxFind = this.studentInformation.graduateProfessionalSchool.programGradProType.find(p => p.id === 8);
      const isOtherTextboxChecked = otherTextboxFind ? otherTextboxFind.checked : false;

      const programGradProStatusCheck = this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'Yes';

      if(!programGradProStatusCheck) {
        this.studentInformation.graduateProfessionalSchool.programGradProType.forEach(item => {
            item.checked = false;
        });
        this.studentInformation.graduateProfessionalSchool.phDTextbox = '';
        this.studentInformation.graduateProfessionalSchool.masterTextbox = '';
        this.studentInformation.graduateProfessionalSchool.otherTextbox = '';
      } else {
        if (!isphDTextboxChecked) {
          this.studentInformation.graduateProfessionalSchool.phDTextbox = '';
        }
        if (!isMasterTextboxChecked) {
          this.studentInformation.graduateProfessionalSchool.masterTextbox = '';
        }
        if (!isOtherTextboxChecked) {
          this.studentInformation.graduateProfessionalSchool.otherTextbox = '';
        }
      }

      //Check condition for specializedDegCertStatus
      const specializedDegCertStatusCheck = this.studentInformation.specializedDegCert.specializedDegCertStatus === 'Yes';

      const professionalDesignOtherFind = this.studentInformation.graduateProfessionalSchool.programGradProType.find(p => p.id === 6);
      const isProfessionalDesignOtherChecked = professionalDesignOtherFind ?professionalDesignOtherFind.checked : false;

      if (!specializedDegCertStatusCheck) {
        this.studentInformation.specializedDegCert.specializedDegCertType.forEach(item => {
          item.checked = false;
        });
        this.studentInformation.specializedDegCert.professionalDesignOther = '';
      } else {
        if (!isProfessionalDesignOtherChecked) {
          this.studentInformation.specializedDegCert.professionalDesignOther = '';
        }
      }

    },
  },
}
</script>