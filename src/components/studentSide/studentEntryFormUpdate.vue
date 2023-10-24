<template> <!-- Start of the Student Entry Form template -->

  <v-container style="width: 90%; margin: 0 auto;"> <!-- Container for the form title and description -->
    <div style="display: flex; align-items: center;">
      <p class="font-weight-black text-h5 text--primary">
        {{ getTranslation('Student Entry Form') }}
      </p>
        <v-dialog width="500">
          <template v-slot:activator="{ props }">
            <v-btn
              size="x-small"
              class="pb-2"
              variant="text"
              icon="mdi-help-circle-outline"
              flat
              v-bind="props"
            >
            </v-btn>
          </template>
  
          <template v-slot:default="{ isActive }">
            <v-card title="Student Entry Form">
              <v-card-text>
                This entry form collects basic information about you, so that we can know you better! Some of this information will be shared with your instructor or experience leader. You can update this information at any time in your “profile”.
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
  
                <v-btn
                  text="Close"
                  @click="isActive.value = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
    </div>
    <p class="text-subtitle-1">
      {{ getTranslation("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.") }}
    </p>
  </v-container>
  
    <v-form 
    ref="form"
    @submit.prevent="handleValidations">
      <v-container style="width: 90%; margin: 0 auto;">
        <p 
        :class="{'error-text': isDemographicsInformationInvalid}"
        class="font-weight-black text-h6 mb-2">{{ getTranslation('Demographics Information') }}</p>
        <p 
        class="font-weight-black">{{ getTranslation('Where are you from? (Ie, place(s) you call home)') }}</p>
        <v-row class="mb-4">
        <v-col cols="12" md="6">
            <v-text-field 
            v-model="studentInformation.cityOrigin" 
            :label="getTranslation('Place of Origin')" 
            outlined>
            </v-text-field>
        </v-col>
        </v-row>
  
        <p 
        class="font-weight-black">{{ getTranslation('What languages do you speak?') }}</p>
        <v-row class="mb-4">
            <v-col cols="12" md="6">
                <v-text-field 
                v-model="studentInformation.primaryLanguage" 
                :label="getTranslation('Primary Language')" 
                outlined>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field 
                v-model="studentInformation.otherLanguages" 
                :label="getTranslation('Other Languages')" 
                outlined>
                </v-text-field>
            </v-col>
        </v-row>
    <v-row class="mb-4">
          <v-col cols="12">
        <div>
          <p 
              :class="{'error-text': isOtherPronounsInvalid}"
              class="font-weight-black">{{ getTranslation('What are your pronouns? Select all that apply.') }}</p>
  
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
                  :label="getTranslation(pronoun.label)"
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
                        :placeholder="getTranslation('Please specify')" 
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
                  :label="getTranslation(studentInformation.pronouns[studentInformation.pronouns.length - 1].label)"
              >
              </v-checkbox>
          </div>
      </div>
    </v-col>
    </v-row>
  
  
  
  
        <p class="font-weight-black text-h8">{{ getTranslation('Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?') }}</p>
        <v-row>
          <v-col cols="12" md="10">
            <v-textarea v-model="studentInformation.commentsByStaff" :label="getTranslation('Comments')"></v-textarea>
          </v-col>
        </v-row>
        <p class="font-weight-black text-h8">{{ getTranslation('Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?') }}</p>
        <v-row>
          <v-col cols="12" md="10">
            <v-textarea v-model="studentInformation.issuesConcernsTriggers" :label="getTranslation('Issues, Concerns, Triggers')"></v-textarea>
          </v-col>
        </v-row>
  
  
        <v-row>
          <v-col cols="12" md="10">
            <p 
            :class="{'error-text': isUhStatusInvalid}"
            class="font-weight-black text-h8">{{ getTranslation('Are you currently enrolled in a degree program at the University of Houston?') }}</p>
            <v-radio-group 
            :class="{'error-text': isUhStatusInvalid}"
            v-model="studentInformation.enrolledUHInfo.uhStatus" :rules="[v => !!v || 'Information is required']" required>
              <v-radio :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
              <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.enrolledUHInfo.uhStatus"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
  
  
        <transition-group name="slide-y-transition" tag="div">
          <div v-show="isUHStudent" key="uhStudent">
  
      <div>
            <p 
            :class="{'error-text': isEnrolledUHInfoInvalid}"
            class="font-weight-black text-h6">{{ getTranslation('UH Student Only') }}</p>
            <v-row>
            <v-col cols="12" md="7">
                  <v-text-field 
                  ref="uhEmailField"
                  v-model="studentInformation.enrolledUHInfo.uhEmail" 
                  :label="getTranslation('UH Email')"
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
              :label="getTranslation('Expected Graduation Date')" 
              min="2023-01-01" 
              max="2099-12-31"></v-text-field>
            </v-col>
          </v-row>
  
            <v-row>
              <v-col cols="12" md="7">
                <p 
                class="font-weight-black text-h8">{{ getTranslation('Do you live on or off campus?') }}</p>
                <v-radio-group 
                v-model="studentInformation.enrolledUHInfo.livingOnCampus">
                  <v-radio :label="getTranslation('On-Campus')" value="On-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
                  <v-radio :label="getTranslation('Off-Campus')" value="Off-Campus" v-model="studentInformation.enrolledUHInfo.livingOnCampus"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          <p 
          :class="{'error-text': isEducationalBackgroundAndGoalsInvalid}"
          class="font-weight-black text-h6">{{getTranslation('Educational Background and Goals')}}</p>
            <v-row>
              <v-col cols="12" md="7">
                  <p 
                  :class="{'error-text': isHonorsCollegeStatusInvalid}"
                  class="font-weight-black text-h8">{{getTranslation('Are you a member of the Honors College?')}}</p>
                  <v-radio-group 
                  :class="{'error-text': isHonorsCollegeStatusInvalid}"
                  v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"
                  :rules="honorsCollegeStatusRules" 
                  :error-messages="honorsCollegeStatusErrorMessage"
                  >
                    <v-radio 
                    :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                    <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.enrolledUHInfo.honorsCollegeStatus"></v-radio>
                  </v-radio-group>
              </v-col>
            </v-row>
          <v-row>
            <v-col cols="12" md="7">
            <p 
              class="font-weight-black text-h8">
                  {{ getTranslation('Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?') }}
              </p>
            <div 
                v-for="affiliatedType in studentInformation.enrolledUHInfo.honorsCollegeAffiliated"
                :key="affiliatedType.id"
            >
                <v-checkbox
                    v-model="affiliatedType.checked"
                    :label="getTranslation(affiliatedType.label)"
                    density="compact"
                    class="ma-0 pa-0" 
                    :hide-details="true"
                ></v-checkbox>
                <v-row>
                    <v-col cols="12" md="10">
                        <transition name="slide-y-transition">
                            <v-text-field
                                ref="honorsCollegeAffiliatedOtherField"
                                v-model="studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther"
                                v-show="affiliatedType.id === 12 && affiliatedType.checked"
                                :label="getTranslation('Please specify')"
                                :rules="honorsCollegeAffiliatedOtherRules"
                            ></v-text-field>
                        </transition>
                    </v-col>
                </v-row>
            </div>
          </v-col>
        </v-row>
  
  
  
            <v-row>
                <v-col cols="12" md="7">
                      <p 
                      :class="{'error-text': isMajorsInvalid}"
                      class="font-weight-black text-h8">{{getTranslation('What is/are your current major(s)?')}}</p>
                      <v-autocomplete
                          ref="majorsField"
                          clearable
                          chips
                          v-model="studentInformation.enrolledUHInfo.majors" 
                          :items="filteredMajors.map(major => major['Plan Name'])" 
                          :label= "getTranslation('Select a Major')"
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
                  class="font-weight-black text-h8">{{getTranslation('Are you pursuing, or planning to pursue, any of the following Honors College minors?')}}</p>
                  <v-autocomplete
                    ref="honorsMinorsRef"
                    v-model="studentInformation.enrolledUHInfo.honorsMinors" 
                    :items="['None', 'Data & Society', 'Medicine & Society', 'Phronesis', 'Creative Work', 'Energy & Sustainability', 'Leadership Studies', 'Global Engagement and Research']" 
                    :label="getTranslation('Select an Honors Minor')" 
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
                  class="font-weight-black text-h8">{{getTranslation('Are you pursuing any other minors?')}}</p>
                  <v-autocomplete
                    v-model="studentInformation.enrolledUHInfo.otherMinors" 
                    :items="filteredMinors.map(minor => minor['Plan Name'])" 
                    :label="getTranslation('Select a Minor')" 
                    multiple 
                    clearable
                    chips></v-autocomplete>
              </v-col>
            </v-row>
            <p 
            :class="{'error-text': isOtherEngagementValid}"
            class="font-weight-black text-h6">{{getTranslation('Other Engagement')}}</p>
            <v-row>
              <v-col cols="12" md="7">
                  <p 
                  class="font-weight-black text-h8">{{getTranslation('Are you a member of Honors in Community Health (HICH)?')}}</p>
                  <v-radio-group
                  v-model="studentInformation.hichInfo.hichStatus">
                    <v-radio :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                    <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.hichInfo.hichStatus"></v-radio>
                  </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="7">
                 <p 
                 class="font-weight-black text-h8">{{getTranslation('Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?')}}</p>
                  <v-radio-group 
                  v-model="studentInformation.hichInfo.hichHistoryStatus">
                    <v-radio :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                    <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.hichInfo.hichHistoryStatus"></v-radio>
                  </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
          <v-col cols="11">
              <p 
              v-show="isUHStudent"
              :class="{'error-text': isServiceStatusInvalid}"
              class="font-weight-black text-h8">
              {{getTranslation('Have you had experience with Community Service?')}}
              </p>
              <v-radio-group 
              v-model="studentInformation.communityServiceInfo.serviceStatus"
              :rules="serviceStatusRules"
              :class="{'error-text': isServiceStatusInvalid}">
                <v-radio :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
                <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
              </v-radio-group>
          </v-col>
          <v-col cols="11" md="10">
            <transition name="slide-y-transition">
              <div v-show="(studentInformation.communityServiceInfo.serviceStatus == 'Yes')">
                <p 
                :class="{'error-text': isServiceHistoryDescInvalid}"
                class="font-weight-black text-h8">{{getTranslation('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</p>
                <v-textarea 
                v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" 
                :label="getTranslation('Please specify')"
                :rules="serviceHistoryDescRules"
                ></v-textarea>
              </div>
            </transition>
          </v-col>
          <v-col cols="11" md="10">
            <transition name="slide-y-transition">
              <div v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
            <p class="font-weight-black text-h8">{{getTranslation('Are you a member of any community organizations outside the University? Please list.')}}</p>
            <v-row>
              <v-textarea v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" :label="getTranslation('Please specify')"></v-textarea>
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
        class="font-weight-black text-h6">{{getTranslation('Non-UH Students Only')}}</p>
      </div>
      <div>
        <v-col
        cols="11">
            <p 
            :class="{'error-text': isServiceStatusInvalid}"
            class="font-weight-black text-h8">
              {{getTranslation('Have you had experience with Community Service?')}}
            </p>
            <v-radio-group 
            v-model="studentInformation.communityServiceInfo.serviceStatus"
            :rules="serviceStatusRules"
            :class="{'error-text': isServiceStatusInvalid}">
              <v-radio :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
              <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.communityServiceInfo.serviceStatus"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="11" md="10">
            <transition name="slide-y-transition">
              <div v-show="(studentInformation.communityServiceInfo.serviceStatus == 'Yes')">
            <p 
            :class="{'error-text': isServiceHistoryDescInvalid}"
            class="font-weight-black text-h8">{{getTranslation('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</p>
            <v-textarea 
            v-model="studentInformation.communityServiceInfo.serviceHistoryDesc" 
            :label="getTranslation('Please specify')"
            :rules="serviceHistoryDescRules"
            ></v-textarea>
          </div>
          </transition>
          </v-col>
          <transition name="slide-y-transition">
            <div v-show="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
          <v-col cols="11" md="10">
            <p class="font-weight-black text-h8" >{{getTranslation('Are you a member of any community organizations outside the University? Please list.')}}</p>
            <v-row v-if="studentInformation.communityServiceInfo.serviceStatus == 'Yes'">
              <v-textarea v-model="studentInformation.communityServiceInfo.serviceOrgsOutsideUH" :label="getTranslation('Please specify')"></v-textarea>
            </v-row>
          </v-col>
          </div>
          </transition>
      </div>
  
    </div>
    </transition-group>
  
  
        <p 
        :class="{'error-text': isGraduateProfessionalSchoolGoalsInvalid}"
        class="font-weight-black text-h6">{{getTranslation('Graduate/Professional School Goals')}}</p>
          <v-col cols="12" md="10">
            <p 
            :class="{'error-text': isProgramGradProStatusValid}"
            class="font-weight-black text-h8">{{ getTranslation('Do you currently plan to pursue graduate or professional (e.g. medical, law) school?') }}</p>
            <v-radio-group 
            :class="{'error-text': isProgramGradProStatusValid}"
            v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"
            :rules="programGradProStatusRules">
              <v-radio :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
              <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.graduateProfessionalSchool.programGradProStatus"></v-radio>
            </v-radio-group>
          </v-col>
          <transition name="slide-y-transition">
          <v-col cols="12" md="10" v-if="studentInformation.graduateProfessionalSchool.programGradProStatus === 'Yes'">
            <p 
              :class="{'error-text': formSubmitted && isProgramGradProTypeInvalid}"
              class="font-weight-black text-h8">{{getTranslation('If you are planning to pursue graduate school, what type of program?')}}</p>
            <div>
              <div v-for="programType in studentInformation.graduateProfessionalSchool.programGradProType" :key="programType.id">
                <v-checkbox 
                  v-model="programType.checked" :label="getTranslation(programType.label)"
                  density="compact"
                  class="ma-0 pa-0" hide-details="true"
                  :class="{'error-text': formSubmitted && isProgramGradProTypeInvalid}"
                  :rules="programGradProTypeRules"
                ></v-checkbox>
                <v-row>
                  <v-col cols="12" md="10">
                    <transition name="slide-y-transition">
                      <v-text-field 
                      ref="phDTextboxField"
                      v-show="programType.id === 4 && programType.checked" :label="getTranslation('Please specify')" v-model="studentInformation.graduateProfessionalSchool.phDTextbox"
                      :rules="phDTextboxRules"
                      ></v-text-field>
                    </transition>
                    <transition name="slide-y-transition">
                      <v-text-field 
                      ref="masterTextboxField"
                      v-show="programType.id === 7 && programType.checked" :label="getTranslation('Please specify')" v-model="studentInformation.graduateProfessionalSchool.masterTextbox"
                      :rules="masterTextboxRules"
                      ></v-text-field>
                    </transition>
                    <transition name="slide-y-transition">
                      <v-text-field 
                      ref="otherTextboxField"
                      v-show="programType.id === 8 && programType.checked" :label="getTranslation('Please specify')" v-model="studentInformation.graduateProfessionalSchool.otherTextbox"
                      :rules="otherTextboxRules"
                      ></v-text-field>
                    </transition>
                  </v-col>
                </v-row>
              </div>
              <div v-if="isProgramGradProTypeInvalid" :key="isProgramGradProTypeInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
            </div>
          </v-col> 
        </transition>
          <v-col cols="12" md="10">
            <p 
            :class="{'error-text': isSpecializedDegCertStatusInvalid}"
            class="font-weight-black text-h8">{{getTranslation('Are you planning to pursue any other kind of specialized degree / certificate program?')}}</p>
            <v-radio-group 
            :class="{'error-text': isSpecializedDegCertStatusInvalid}"
            v-model="studentInformation.specializedDegCert.specializedDegCertStatus"
            :rules="specializedDegCertStatusRules">
              <v-radio :label="getTranslation('Yes')" value="Yes" v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
              <v-radio :label="getTranslation('No')" value="No" v-model="studentInformation.specializedDegCert.specializedDegCertStatus"></v-radio>
            </v-radio-group>
          </v-col>
          <transition name="slide-y-transition">
          <v-col cols="12" md="10" v-if="studentInformation.specializedDegCert.specializedDegCertStatus === 'Yes'">
            <p 
            :class="{'error-text': formSubmitted && isSpecializedDegCertTypeInvalid}"
            class="font-weight-black text-h8">{{getTranslation('If you are planning to pursue a specialized degree / certificate program, what type of program?')}}</p>
            <div>
              <div v-for="specializedType in studentInformation.specializedDegCert.specializedDegCertType" :key="specializedType.id">
                <v-checkbox 
                v-model="specializedType.checked" 
                :label="getTranslation(specializedType.label)"
                density="compact"
                class="ma-0 pa-0" hide-details="true"
                :class="{'error-text': formSubmitted && isSpecializedDegCertTypeInvalid}"
                :rules="specializedDegCertTypeRules"
                ></v-checkbox>
                <v-row>
                  <v-col cols="12" md="10">
                    <transition name="slide-y-transition">
                    <v-text-field 
                    ref="professionalDesignOtherField"
                    v-show="specializedType.id === 6 && specializedType.checked" :label="getTranslation('Please specify')" v-model="studentInformation.specializedDegCert.professionalDesignOther"
                    :rules="professionalDesignOtherRules"
                    ></v-text-field>
                  </transition>
                  </v-col>
                </v-row>
              </div>
              <div v-if="isSpecializedDegCertTypeInvalid" class="styled-error-text">{{getTranslation('Information is required.')}}</div>
            </div>
          </v-col>
        </transition>
          <v-row>
            <v-col cols="12" md="4">
              <v-btn type="submit" methods="handleValidations" class="btn btn-success">{{getTranslation('Submit Form')}}</v-btn>
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
  
  
  .styled-error-text {
    -webkit-text-size-adjust: 100%;
      tab-size: 4;
      font-family: "Roboto", sans-serif;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      --v-theme-overlay-multiplier: 1;
      --v-scrollbar-offset: 0px;
      --v-theme-background: 255,255,255;
      --v-theme-background-overlay-multiplier: 1;
      --v-theme-surface: 255,255,255;
      --v-theme-surface-overlay-multiplier: 1;
      --v-theme-surface-variant: 66,66,66;
      --v-theme-surface-variant-overlay-multiplier: 2;
      --v-theme-on-surface-variant: 238,238,238;
      --v-theme-primary: 98,0,238;
      --v-theme-primary-overlay-multiplier: 2;
      --v-theme-primary-darken-1: 55,0,179;
      --v-theme-primary-darken-1-overlay-multiplier: 2;
      --v-theme-secondary: 3,218,198;
      --v-theme-secondary-overlay-multiplier: 1;
      --v-theme-secondary-darken-1: 1,135,134;
      --v-theme-secondary-darken-1-overlay-multiplier: 1;
      --v-theme-error: 176,0,32;
      --v-theme-error-overlay-multiplier: 2;
      --v-theme-info: 33,150,243;
      --v-theme-info-overlay-multiplier: 1;
      --v-theme-success: 76,175,80;
      --v-theme-success-overlay-multiplier: 1;
      --v-theme-warning: 251,140,0;
      --v-theme-warning-overlay-multiplier: 1;
      --v-theme-on-background: 0,0,0;
      --v-theme-on-surface: 0,0,0;
      --v-theme-on-primary: 255,255,255;
      --v-theme-on-primary-darken-1: 255,255,255;
      --v-theme-on-secondary: 0,0,0;
      --v-theme-on-secondary-darken-1: 255,255,255;
      --v-theme-on-error: 255,255,255;
      --v-theme-on-info: 255,255,255;
      --v-theme-on-success: 255,255,255;
      --v-theme-on-warning: 255,255,255;
      --v-border-color: 0, 0, 0;
      --v-border-opacity: 0.12;
      --v-high-emphasis-opacity: 0.87;
      --v-medium-emphasis-opacity: 0.6;
      --v-disabled-opacity: 0.38;
      --v-idle-opacity: 0.04;
      --v-hover-opacity: 0.04;
      --v-focus-opacity: 0.12;
      --v-selected-opacity: 0.08;
      --v-activated-opacity: 0.12;
      --v-pressed-opacity: 0.12;
      --v-dragged-opacity: 0.08;
      --v-theme-kbd: 33, 37, 41;
      --v-theme-on-kbd: 255, 255, 255;
      --v-theme-code: 245, 245, 245;
      --v-theme-on-code: 0, 0, 0;
      --v-input-control-height: 56px;
      --v-input-padding-top: 16px;
      --select-chips-margin-bottom: 0px;
      --autocomplete-chips-margin-bottom: 0px;
      --combobox-chips-margin-bottom: 0px;
      --file-input-chips-margin-bottom: 0px;
      font-weight: 400;
      letter-spacing: 0.0333333333em;
      font-size: 12px;
      color: rgb(var(--v-theme-error));
      border-width: 0;
      border-style: solid;
      border-color: #e5e7eb;
      --tw-border-spacing-x: 0;
      --tw-border-spacing-y: 0;
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-rotate: 0;
      --tw-skew-x: 0;
      --tw-skew-y: 0;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-pan-x: ;
      --tw-pan-y: ;
      --tw-pinch-zoom: ;
      --tw-scroll-snap-strictness: proximity;
      --tw-ordinal: ;
      --tw-slashed-zero: ;
      --tw-numeric-figure: ;
      --tw-numeric-spacing: ;
      --tw-numeric-fraction: ;
      --tw-ring-inset: ;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-color: rgb(59 130 246 / 0.5);
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-ring-shadow: 0 0 #0000;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-colored: 0 0 #0000;
      --tw-blur: ;
      --tw-brightness: ;
      --tw-contrast: ;
      --tw-grayscale: ;
      --tw-hue-rotate: ;
      --tw-invert: ;
      --tw-saturate: ;
      --tw-sepia: ;
      --tw-drop-shadow: ;
      --tw-backdrop-blur: ;
      --tw-backdrop-brightness: ;
      --tw-backdrop-contrast: ;
      --tw-backdrop-grayscale: ;
      --tw-backdrop-hue-rotate: ;
      --tw-backdrop-invert: ;
      --tw-backdrop-opacity: ;
      --tw-backdrop-saturate: ;
      --tw-backdrop-sepia: ;
      background-repeat: no-repeat;
      box-sizing: inherit;
      padding: 0;
      margin: 0;
      line-height: 12px;
      word-break: break-word;
      word-wrap: break-word;
      hyphens: auto;
      transition-duration: 150ms;
      transform-origin: center center;
  }
  
  
  
  
  </style>
  
  <script>
  // Imports
  import { ref } from 'vue';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import axios from "axios";
  export default {
    setup() {
  
      const translations = {
        Spanish: {
          "Student Entry Form": "Formulario de Inscripción para Estudiantes",
          "Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.": "Complete los detalles requeridos y presione el botón de enviar. No se preocupe, podrá editar estos detalles nuevamente más tarde.",
          "Demographics Information": "Información Demográfica",
          "Where are you from? (Ie, place(s) you call home)": "¿De dónde eres? (lugar(es) al que usted llama hogar)",
          "Place of Origin": "Lugar de Origen",
          "What languages do you speak?": "¿Qué idiomas hablas?",
          "Primary Language": "Idioma principal",
          "Other Languages": "Otros idiomas",
          "What are your pronouns? Select all that apply.": "¿Cuáles son sus pronombres preferidos? Seleccione todas las que correspondan.",
          "She/her/hers": "Ella",
          "He/him/his": "El",
          "They/them/theirs": "Ellos/Ellas/Elle",
          "Other": "Otro",
          "Please specify": "Por favor especificar",
          "Prefer not to answer": "Prefiero no responder",
          "Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?": "¿Tiene algún comentario sobre la forma en que los instructores/personal utilizan estos pronombres en entornos públicos o privados?",
          "Comments": "Comentarios",
          "Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?": "¿Hay algún problema, inquietud o desencadenante personal que le gustaría que los instructores tuvieran en cuenta al facilitar lecciones y reuniones?",
          "Issues, Concerns, Triggers": "Problemas, Inquietudes, Desencadenantes",
          "Are you currently enrolled in a degree program at the University of Houston?": "¿Está actualmente inscrito en un programa de estudios en la Universidad de Houston?",
          "Yes": "Si",
          "UH Student Only": "Solo Estudiantes de UH",
          "UH Email": "Correo Electrónico de UH",
          "Expected Graduation Date": "Fecha Estimada de Graduación",
          "Do you live on or off campus?": "¿Vives dentro o fuera del campus?",
          "On-Campus": "Dentro del campus",
          "Off-Campus": "Fuera del campus",
          "Educational Background and Goals": "Antecedentes Educativos y Objetivos",
          "Are you a member of the Honors College?": "¿Eres miembro del Honors College?",
          "Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?": "¿Está afiliado al Honors College de alguna otra manera (que no sean cursos de Datos y Sociedad, participar en una especialización con Honores o HICH)?",
          "What is/are your current major(s)?": "¿Cuál es/son su(s) especialidad(es) actual(es) en la universidad?",
          "Select a Major": "Seleccione una Carrera",
          "Are you pursuing, or planning to pursue, any of the following Honors College minors?": "¿Está cursando o planea cursar alguna de las siguientes asignaturas secundarias del Honors College?",
          "Select an Honors Minor": "Seleccione una Asignatura Secundaria del Honors College",
          "Are you pursuing any other minors?": "¿Está persiguiendo otros programas menores? Por favor enumere.",
          "Select a Minor": "Seleccione un Programa Menor",
          "Other Engagement": "Otras Participaciones",
          "Are you a member of Honors in Community Health (HICH)?": "¿Es usted miembro del Honors in Community Health (HICH)?",
          "Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?": "¿Ha participado en proyectos de HICH (PEERS, Recursos Receptivos, BREATHE, Cuidado Creativo, etc.)?",
          "Have you had experience with Community Service?": "¿Ha tenido otra experiencia con el Servicio Comunitario?",
          "Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.": "Por favor describa brevemente cualquier oportunidad de servicio comunitario en la que participó. Incluya la organización y el alcance del servicio.",
          "Are you a member of any community organizations outside the University? Please list.": "¿Es usted miembro de alguna organización comunitaria fuera de la Universidad? Por favor enumere.",
          "Non-UH Students Only": "Solo Estudiantes No de UH",
          "Graduate/Professional School Goals": "Objetivos de Posgrado/Escuela Profesional",
          "Do you currently plan to pursue graduate or professional (e.g. medical, law) school?": "¿Actualmente planea seguir una carrera de posgrado o profesional (por ejemplo, medicina, derecho)?",
          "If you are planning to pursue graduate school, what type of program?": "Si planea seguir una escuela de posgrado, ¿qué tipo de programa?",
          "Physician Assistant: PA": "Asistente Medico/a",
          "Nursing: MSN, DNP": "Enfermería: MSN, DNP",
          "Law: JD": "Leyes: JD",
          "Master's: MPH, MBA, MA, MS, MEd, etc": "Maestría: MPH, MBA, MA, MS, MEd, etc",
          "Are you planning to pursue any other kind of specialized degree / certificate program?": "¿Planea seguir algún otro tipo de programa de grado especializado / certificado?",
          "If you are planning to pursue a specialized degree / certificate program, what type of program?": "Si planea seguir un programa especializado de título/certificado, ¿qué tipo de programa?",
          "Nursing: PRN, RN, CNA, etc": "Enfermería: PRN, RN, CNA, etc",
          "Social Work: LSW/LCSW": "Trabajo Social: LSW/LCSW",
          "Business: Certified Public Accountant (CPA, Licensed Public Accountant (LPA), Certified Financial Planner (CFP)": "Negocio: Certificado para Contador/a Publico/a (o CPA en inglés), Contador/a Publico/a con Licencia (o LPA en inglés), Certificado para Planificador Financiero (o CFP en inglés)",
          "Engineering/Technology: Professional Engineer (PE), Certified Technology Specialist (CTS), etc": "Ingeniería/Tecnología: Ingeniero Profesional (o PE en inglés), Certificado para Especialistas en Tecnología (o CTS en inglés), etc",
          "Project Management: Certified Associate in Project Management (CAPM), Project Management Professional (PMP)": "Gestión de Proyectos: Certificado Asociado en Gestión de Proyectos (o CAPM en inglés), Profesional en Gestión de Proyectos (o PMP en inglés)",
          "Other Professional Designation": "Otra designación profesional",
          "Submit Form": "Enviar Formulario",
          "Information is required.": "Se requiere información",
          "If Other is selected, please specify pronouns.": "Si seleccionó 'Otro', por favor especifique sus pronombres.",
          "Email must end with @cougarnet.uh.edu or @uh.edu": "El correo electrónico debe terminar con @cougarnet.uh.edu o @uh.edu.",
          "A valid UH email is required.": "Se requiere un correo electrónico válido de Universidad de Houston.",
          "A valid PeopleSoftID is required.": "Se requiere un PeopleSoftID válido.",
          "If Other is selected, please specify affiliation.": "Si seleccionó 'Otro', por favor especifique su afiliación.",
          "At least one Major is required.": "Se requiere al menos una carrera.",
          "Please select at least one Minor, or 'None'.": "Por favor, seleccione al menos una especialidad secundaria o 'Ninguna'.",
          "If 'PhD' is selected, please specify.": "Si se selecciona 'PhD', por favor especifique.",
          "If 'Master\'s' is selected, please specify.": "Si se selecciona 'Maestría', por favor especifique.",
          "If 'Other' is selected, please specify.": "Si seleccionó 'Otro', por favor especifique.",
          "Oops! Error(s) detected. Please review and try again.": "¡Ups! Se detectó(ron) error(es). Por favor, revise y vuelva a intentarlo.",
          "Thank you for completing the Student Entry Form!": "¡Gracias por completar el Formulario de Inscripción para Estudiantes!",
        }
      };
  
      // Reactive State
      const currentLanguage = ref('English'); // default value
      
      const getTranslation = (key) => {
        return (translations[currentLanguage.value] && translations[currentLanguage.value][key]) || key;
      };
  
      // Lifecycle Hooks or Logic (like the login check)
      if (useLoggedInUserStore().languagePreference === "Spanish") {
          currentLanguage.value = "Spanish";
      }
      
      // Return the reactive properties and methods to access in the template
      return {
        getTranslation,
      };
    },
    data() {
      return {
        studentInformation: {
          cityOrigin: '', 
          primaryLanguage: '',
          otherLanguages: '',
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
            honorsCollegeAffiliated: [
              { id: 1, label: "Senior Honors Thesis", checked: false },
              { id: 2, label: "Honors Mentorship Program", checked: false },
              { id: 3, label: "Honors Club Theatre", checked: false },
              { id: 4, label: "Honors Dodgeball Society", checked: false },
              { id: 5, label: "Student Governing Board", checked: false },
              { id: 6, label: "Bonner Leaders Program", checked: false },
              { id: 7, label: "Hobby/Leland/Harris Fellow", checked: false },
              { id: 8, label: "Mellon Research Scholars", checked: false },
              { id: 9, label: "Speech & Debate", checked: false },
              { id: 10, label: "Model Arab League, Model UN, etc.", checked: false },
              { id: 11, label: "Honors Ambassadors", checked: false },
              { id: 12, label: "Other", checked: false },
            ],
            honorsCollegeAffiliatedOther: '',
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
  
                return !!v || this.getTranslation('If Other is selected, please specify pronouns.');
            },
        ],
        uhEmailRules: [
            v => {
                // If user is not a UH student, validation passes automatically
                if (!this.uHStudentCheck) return true;
  
                // Otherwise, check if the email is not empty
                return !!v || this.getTranslation('A valid UH email is required.');
            },
            v => {
                // If user is not a UH student, validation passes automatically
                if (!this.uHStudentCheck) return true;
  
                // Otherwise, validate the email format
                return /[@](cougarnet\.uh\.edu|uh\.edu)$/.test(v) || this.getTranslation('Email must end with @cougarnet.uh.edu or @uh.edu');
            }
        ],
        peopleSoftIDRules: [
            v => {
                // If user is not a UH student, validation passes automatically
                if (!this.uHStudentCheck) return true;
  
                // Otherwise, check if the email is not empty
                return !!v || this.getTranslation('A valid PeopleSoftID is required.');
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
  
                return !!v || this.getTranslation('Information is required.');
            },
        ],
        honorsCollegeAffiliatedOtherRules: [
          v => {
              // If user is not a UH student, validation passes automatically
              if (!this.uHStudentCheck) {
                return true
              };
              // if user is a UH student, but did not choose "Other" for affiliation with Honors College, then validation passess automatically
              if (this.uHStudentCheck && this.studentInformation.enrolledUHInfo.honorsCollegeAffiliated[11].checked === false) {
                return true
              };
              return !!v || this.getTranslation('If Other is selected, please specify affiliation.');
          },
        ],
        majorsRules: [
            v => {
                // If user is not a UH student, validation passes automatically
                if (!this.uHStudentCheck) return true;
  
                return (v && v.length > 0) || this.getTranslation('At least one Major is required.');
            }
        ],
        honorsMinorsRules: [
        v => {
                // If user is not a UH student, validation passes automatically
                if (!this.uHStudentCheck) return true;
  
                return (v && v.length > 0) || this.getTranslation("Please select at least one Minor, or 'None'.");
            }
        ],
        serviceStatusRules: [
            v => {
              return !!v || this.getTranslation('Information is required.');
            }
        ],
        serviceHistoryDescRules: [
          v => {
          // if user has not had comm-service experience, then skip validation.
                if (!this.formSubmitted || this.studentInformation.communityServiceInfo.serviceStatus === 'No') return true;
  
                return !!v || this.getTranslation('Information is required.');
              }
        ],
        programGradProStatusRules: [
            v => {
              return !!v || this.getTranslation('Information is required.');
            }
        ],
        programGradProTypeRules: [
            v => {
              if (!this.formSubmitted || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                return true;
              }
  
              return this.studentInformation.graduateProfessionalSchool.programGradProType.some(type => type.checked) || this.getTranslation('Information is required.');
            }
        ],
        phDTextboxRules: [
          v => {
              // conditions to skip validation
              if (!this.formSubmitted || (this.studentInformation.graduateProfessionalSchool.programGradProType[3].checked === false ) || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                return true
              }
              return !!v || this.getTranslation("If 'PhD' is selected, please specify.");
            }
        ],
        masterTextboxRules: [
          v => {
            // conditions to skip validation
              if (!this.formSubmitted || (this.studentInformation.graduateProfessionalSchool.programGradProType[6].checked === false ) || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                return true
              }
              return !!v || this.getTranslation("If 'Master\'s' is selected, please specify.");
            }
        ],
        otherTextboxRules: [
          v => {
            // conditions to skip validation
              if (!this.formSubmitted || (this.studentInformation.graduateProfessionalSchool.programGradProType[7].checked === false ) || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
                return true
              }
              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
            }
        ],
        specializedDegCertStatusRules: [
          v => {
                return !!v || this.getTranslation('Information is required.');
              }
        ],
        specializedDegCertTypeRules: [
            v => {
              if (!this.formSubmitted || this.studentInformation.specializedDegCert.specializedDegCertStatus === 'No') {
                return true;
              }
  
              return this.studentInformation.specializedDegCert.specializedDegCertType.some(type => type.checked) || this.getTranslation('Information is required.');
            }
        ],
        professionalDesignOtherRules: [
          v => {
              // conditions to skip validation
              if (!this.formSubmitted || (this.studentInformation.specializedDegCert.specializedDegCertType[5].checked === false ) || this.studentInformation.specializedDegCert.specializedDegCertStatus === 'No') {
                return true
              }
              return !!v || this.getTranslation("If 'Other' is selected, please specify.");
            }
        ],
      }
    },
    beforeMount() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let userGivenID = user.userId;
      let url = import.meta.env.VITE_ROOT_API + `/studentSideData/studentInformation`;
      axios.get(url + `/${userGivenID}`, { headers: { token },})
        .then((resp) => {
          this.studentInformation = resp.data.studentData.studentInformation;
        });
    },
    mounted() {
      // Fetch the JSON data
      fetch('./majorsAndMinors.json')
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
    'studentInformation.enrolledUHInfo.honorsCollegeAffiliated': {
        deep: true,
        handler(newValue) {
            if (newValue.includes('Other') && this.formSubmitted) {
                this.$refs.honorsCollegeAffiliatedOtherField.validate();
            }
        }
    },
    'studentInformation.enrolledUHInfo.honorsMinors': {
          handler(newValues) {
              if (newValues.includes('None') && newValues.length > 1) {
                  this.studentInformation.enrolledUHInfo.honorsMinors = ['None'];
              }
          },
          deep: true
      },
      'studentInformation.graduateProfessionalSchool.programGradProStatus': {
        deep: true,
        handler(newValue) {
          if (this.formSubmitted) {
  
          }
        }
      },
      'studentInformation.graduateProfessionalSchool.programGradProType': {
          deep: true,
          handler(newValue) {
              if (this.formSubmitted) {
                  const phDItem = newValue.find(item => item.id === 4);
                  const masterItem = newValue.find(item => item.id === 7);
                  const otherItem = newValue.find(item => item.id === 8);
                  
                  // Validate for phDTextbox
                  if (phDItem && phDItem.checked) {
                      const index = newValue.indexOf(phDItem);
                      if (this.$refs.phDTextboxField[index]) {
                          this.$refs.phDTextboxField[index].validate();
                      }
                  }
                  
                  // Validate for masterTextbox
                  if (masterItem && masterItem.checked) {
                      const index = newValue.indexOf(masterItem);
                      if (this.$refs.masterTextboxField[index]) {
                          this.$refs.masterTextboxField[index].validate();
                      }
                  }
  
                  // Validate for otherTextbox
                  if (otherItem && otherItem.checked) {
                      const index = newValue.indexOf(otherItem);
                      if (this.$refs.otherTextboxField[index]) {
                          this.$refs.otherTextboxField[index].validate();
                      }
                  }
              }
          }
      },
      'studentInformation.specializedDegCert.specializedDegCertType': {
          deep: true,
          handler(newValue) {
              if (this.formSubmitted) {
                  const otherItem = newValue.find(item => item.id === 6);
                  // Validate for professionalDesignOther
                  if (otherItem && otherItem.checked) {
                      const index = newValue.indexOf(otherItem);
                      if (this.$refs.professionalDesignOtherField[index]) {
                          this.$refs.professionalDesignOtherField[index].validate();
                      }
                  }
              }
          }
      },
      'studentInformation.enrolledUHInfo.honorsCollegeAffiliated': {
          deep: true,
          handler(newValue) {
              if (this.formSubmitted) {
                  const otherItem = newValue.find(item => item.id === 12);
                  // Validate for honorsCollegeAffiliatedOther
                  if (otherItem && otherItem.checked) {
                      const index = newValue.indexOf(otherItem);
                      if (this.$refs.honorsCollegeAffiliatedOtherField[index]) {
                          this.$refs.honorsCollegeAffiliatedOtherField[index].validate();
                      }
                  }
              }
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
        return this.isOtherPronounsInvalid;
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
  
        return this.isHonorsCollegeStatusInvalid || this.isHonorsCollegeAffiliatedOtherInvalid || this.isMajorsInvalid || this.isHonorsMinorsInvalid;
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
    isProgramGradProTypeInvalid() {
      if (!this.formSubmitted || this.studentInformation.graduateProfessionalSchool.programGradProStatus === 'No') {
        return ''
      };
  
      //Check if at least one checkbox is checked
      if (!this.studentInformation.graduateProfessionalSchool.programGradProType.some(type => type.checked)) {
        return 'Information is required.';
      }
      return '';
  
    },
    isSpecializedDegCertStatusInvalid() {
      if (!this.formSubmitted) return false;
      const rule = v => !!v || 'Information is required';
      return rule(this.studentInformation.specializedDegCert.specializedDegCertStatus) !== true;
    },
    isSpecializedDegCertTypeInvalid() {
      if (!this.formSubmitted || this.studentInformation.specializedDegCert.specializedDegCertStatus === "No") {
        return ''
      }
  
      // Check if at least one checkbox is checked
      if (!this.studentInformation.specializedDegCert.specializedDegCertType.some(type => type.checked)) {
        return 'Information is required.'
      };
      return '';
  
    },
    isGraduateProfessionalSchoolGoalsInvalid() {
        if (!this.formSubmitted) return false;
  
        const isPhDTextboxValid = this.phDTextboxRules[0](this.studentInformation.graduateProfessionalSchool.phDTextbox);
  
        // Check if the rule returned a string (indicating an error message)
        const isPhDTextboxInvalid = typeof isPhDTextboxValid === 'string';
  
        const isMastersTextboxValid = this.masterTextboxRules[0](this.studentInformation.graduateProfessionalSchool.masterTextbox);
  
        // Check if the rule returned a string (indicating an error message)
        const isMastersTextboxInValid = typeof isMastersTextboxValid === 'string';
        
        const isOtherTextboxValid = this.otherTextboxRules[0](this.studentInformation.graduateProfessionalSchool.otherTextbox);
  
        // Check if the rule returned a string (indicating an error message)
        const isOtherTextboxInValid = typeof isOtherTextboxValid === 'string';
        
        const isProfessionalDesignOtherValid = this.professionalDesignOtherRules[0](this.studentInformation.specializedDegCert.professionalDesignOther);
  
        // Check if the rule returned a string (indicating an error message)
        const isProfessionalDesignOtherInValid = typeof isProfessionalDesignOtherValid === 'string';
  
        return this.isProgramGradPrStatusValid || this.isSpecializedDegCertStatusInvalid || isPhDTextboxInvalid || isMastersTextboxInValid || isOtherTextboxInValid || isProfessionalDesignOtherInValid;
    },
    // Computed function to get the ref of phDTextboxField (it's within a for loop)
    phDTextboxFieldRef() {
        return this.$refs.phDTextboxField ? this.$refs.phDTextboxField.find(ref => ref.someCondition) : null;
    }
    },
    methods: {
      async handleValidations() {
        this.formSubmitted = true;
        const { valid } = await this.$refs.form.validate()
        if (valid) {
          this.cleanupFormData();
          this.submitCompletedForm();
        } else {
          toast.error(this.getTranslation("Oops! Error(s) detected. Please review and try again."), {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete'
            });
          return;
        }
      },
  
      async submitCompletedForm() {
        const user = useLoggedInUserStore()
        let token = user.token
        let apiURL = import.meta.env.VITE_ROOT_API + '/studentSideData/entryForms/';
        
        try {
          // Submit the entry form
          await axios.post(apiURL, { studentInformation: this.studentInformation}, { headers: { token } });
  
          // After form submission, call the checkFormCompletion action to update the hasCompletedEntryForm state
          await user.checkFormCompletion();
          
          // Show the success message and navigate to the dashboard
          this.$router.push({ 
            name: 'studentDashboard',
            params: {
              toastType: 'success',
              toastMessage: this.getTranslation('Thank you for completing the Student Entry Form!'),
              toastPosition: 'top-right',
              toastCSS: 'Toastify__toast--create'
            }
          });
  
        } catch (error) {
          // Log the error if form submission fails
          console.log(error);
        }
      },
      cleanupFormData() {
        // Check condition for "Other" pronouns
        const otherPronoun = this.studentInformation.pronouns.find(p => p.id === 5);
        const isOtherPronounChecked = otherPronoun ? otherPronoun.checked : false;
  
        if (!isOtherPronounChecked) {
          this.studentInformation.otherPronouns = '';
        }
  
        // Check condition for UH student
        //Check condition for "honorsCollegeAffiliated"
        const honorsCollegeAffiliatedCheck = this.studentInformation.enrolledUHInfo.honorsCollegeAffiliated[11].checked === true;
  
        if (!this.uHStudentCheck) {
          this.studentInformation.enrolledUHInfo.uhEmail = '';
          this.studentInformation.enrolledUHInfo.peopleSoftID = '';
          this.studentInformation.enrolledUHInfo.expectedGraduationYear = '';
          this.studentInformation.enrolledUHInfo.livingOnCampus = '';
          this.studentInformation.enrolledUHInfo.honorsCollegeStatus = '';
          this.studentInformation.enrolledUHInfo.honorsCollegeAffiliated = [
            { id: 1, label: "Senior Honors Thesis", checked: false },
            { id: 2, label: "Honors Mentorship Program", checked: false },
            { id: 3, label: "Honors Club Theatre", checked: false },
            { id: 4, label: "Honors Dodgeball Society", checked: false },
            { id: 5, label: "Student Governing Board", checked: false },
            { id: 6, label: "Bonner Leaders Program", checked: false },
            { id: 7, label: "Hobby/Leland/Harris Fellow", checked: false },
            { id: 8, label: "Mellon Research Scholars", checked: false },
            { id: 9, label: "Speech & Debate", checked: false },
            { id: 10, label: "Model Arab League, Model UN, etc.", checked: false },
            { id: 11, label: "Honors Ambassadors", checked: false },
            { id: 12, label: "Other", checked: false },
          ],
          this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther = '';
          this.studentInformation.enrolledUHInfo.majors = [];
          this.studentInformation.enrolledUHInfo.honorsMinors = [];
          this.studentInformation.enrolledUHInfo.otherMinors = [];
          this.studentInformation.hichInfo.hichStatus = '';
          this.studentInformation.hichInfo.hichHistoryStatus = '';
        } else if (this.uHStudentCheck && !honorsCollegeAffiliatedCheck) {
          this.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther = '';
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
  
  
        const professionalDesignOtherFind = this.studentInformation.specializedDegCert.specializedDegCertType.find(p => p.id === 6);
  
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