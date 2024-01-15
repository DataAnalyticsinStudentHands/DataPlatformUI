<template>

<v-form 
    ref="form"
    @submit.prevent="handleValidations"
>
<v-container>

    <v-col cols="12" md="10">
  <p 
    :class="{'error-text': formSubmitted && isCommunityEngagementExperiencesInvalid}"
    class="font-weight-black text-h8"
    ref="communityEngagementExperiencesRef"
  >
    {{$t('What kind of community engagement experiences, if any, have you had? Check all that apply.')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div 
    v-for="engagementExperience in goalForm.communityEngagement.communityEngagementExperiences" 
    :key="engagementExperience.id"
    class="relative"
    @mouseover="hoveredCheckboxID1 = engagementExperience.id" 
    @mouseleave="hoveredCheckboxID1 = null"
  >
    <v-checkbox 
        :class="{'error-text': formSubmitted && isCommunityEngagementExperiencesInvalid}"
        density="compact"
        class="ma-0 pa-0" 
        hide-details="true"
        v-model="engagementExperience.checked" 
        :label="$t(engagementExperience.label)"
        :rules="communityEngagementExperiencesRules"
        :indeterminate="goalForm.communityEngagement.communityEngagementExperiences[goalForm.communityEngagement.communityEngagementExperiences.length - 1].checked && !engagementExperience.checked"
    >
    </v-checkbox>


    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="engagementExperience.id === 6 && engagementExperience.checked">
        <v-col cols="12">
          <v-text-field
            :ref="`otherExperienceRef-${engagementExperience.id}`"
            :placeholder="$t('Please specify')" 
            :class="{'error-text': isOtherEngagementExperienceInvalid}"
            v-model="goalForm.communityEngagement.communityEngagementExperiencesOther"
            :rules="communityEngagementExperiencesOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>

  <div v-if="isCommunityEngagementExperiencesInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
    :class="{'error-text': isPreviousEngagementExperiencesInvalid}"
    class="font-weight-black text-h8"
    ref="previousEngagementExperiencesRef"
  >
    {{$t('From your previous community engagement experiences, which of the following activities have you engaged in?')}}
  </p>
  <div v-for="previousExperience in goalForm.communityEngagement.previousEngagementExperiences" :key="previousExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID2 = previousExperience.id" 
  @mouseleave="hoveredCheckboxID2 = null">
      <v-checkbox 
        :class="{'error-text': isPreviousEngagementExperiencesInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        :label="$t(previousExperience.label)" 
        v-model="previousExperience.checked"
        :rules="previousEngagementExperiencesRules"
        :indeterminate="goalForm.communityEngagement.previousEngagementExperiences[goalForm.communityEngagement.previousEngagementExperiences.length - 1].checked && !previousExperience.checked"
      >
      </v-checkbox>


      <transition name="slide-y-transition">
      <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
      <v-text-field 
        :ref="`previousEngagementExperiencesOtherRef-${previousExperience.id}`"
        :class="{'error-text': isPreviousEngagementExperiencesOtherInvalid}"
        :placeholder="$t('Please specify')" 
        v-model="goalForm.communityEngagement.previousEngagementExperiencesOther"
        :rules="previousEngagementExperiencesOtherRules"
      >
      </v-text-field>
    </v-col>
    </v-row>
    </transition>
    </div>
    <div v-if="isPreviousEngagementExperiencesInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
</v-col>

<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isEngagementActivitiesToolsInvalid}"
  class="font-weight-black text-h8"
  ref="engagementActivitiesToolsRef">
    {{$t('What, if any, tools have you used for community engagement activities?')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="activitiesTool in goalForm.communityEngagement.engagementActivitiesTools" :key="activitiesTool.id"
  class="relative"
  @mouseover="hoveredCheckboxID3 = activitiesTool.id" 
  @mouseleave="hoveredCheckboxID3 = null">
    <v-checkbox 
    :class="{'error-text': isEngagementActivitiesToolsInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="activitiesTool.checked" 
        :label="$t(activitiesTool.label)"
        :rules="engagementActivitiesToolsRules"
        :indeterminate="goalForm.communityEngagement.engagementActivitiesTools[goalForm.communityEngagement.engagementActivitiesTools.length - 1].checked && !activitiesTool.checked"
    >
    </v-checkbox>


    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="activitiesTool.id === 8 && activitiesTool.checked">
        <v-col cols="12">
          <v-text-field 
          :ref="`engagementActivitiesToolOtherRef-${activitiesTool.id}`"
          :class="{'error-text': isEngagementActivitiesToolOtherInvalid}"
            :placeholder="$t('Please specify')" 
            v-model="goalForm.communityEngagement.engagementActivitiesToolOther" 
            :rules="engagementActivitiesToolOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isEngagementActivitiesToolsInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isCurrentResearchExperienceInvalid}"
  class="font-weight-black text-h8"
  ref="currentResearchExperienceRef">
    {{$t('What kind of research experiences, if any, have you had? Check all that apply.')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="currentExperience in goalForm.researchExperience.currentResearchExperience" :key="currentExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID4 = currentExperience.id" 
  @mouseleave="hoveredCheckboxID4 = null">
    <v-checkbox 
    :class="{'error-text': isCurrentResearchExperienceInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="currentExperience.checked" 
        :label="$t(currentExperience.label)"
        :rules="currentResearchExperienceRules"
        :indeterminate="goalForm.researchExperience.currentResearchExperience[goalForm.researchExperience.currentResearchExperience.length - 1].checked && !currentExperience.checked"
    >
    </v-checkbox>

 

    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="currentExperience.id === 7 && currentExperience.checked">
        <v-col cols="12">
          <v-text-field 
          :ref="`currentResearchExperienceOtherRef-${currentExperience.id}`"
          :class="{'error-text': isCurrentResearchExperienceOtherInvalid}"
            :placeholder="$t('Please specify')" 
            v-model="goalForm.researchExperience.currentResearchExperienceOther" 
            :rules="currentResearchExperienceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isCurrentResearchExperienceInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isPreviousResearchExperienceInvalid}"
  class="font-weight-black text-h8"
  ref="previousResearchExperienceRef">
    {{$t('From your previous research experiences, which of the following activities have you engaged in?')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="previousExperience in goalForm.researchExperience.previousResearchExperience" :key="previousExperience.id"
  class="relative"
  @mouseover="hoveredCheckboxID5 = previousExperience.id" 
  @mouseleave="hoveredCheckboxID5 = null">
    <v-checkbox 
    :class="{'error-text': isPreviousResearchExperienceInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="previousExperience.checked" 
        :label="$t(previousExperience.label)"
        :rules="previousResearchExperienceRules"
        :indeterminate="goalForm.researchExperience.previousResearchExperience[goalForm.researchExperience.previousResearchExperience.length - 1].checked && !previousExperience.checked"
    >
    </v-checkbox>


    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="previousExperience.id === 8 && previousExperience.checked">
        <v-col cols="12">
          <v-text-field 
          :ref="`previousResearchExperienceOtherRef-${previousExperience.id}`"
          :class="{'error-text': isPreviousResearchExperienceOtherInvalid}"
            :placeholder="$t('Please specify')" 
            v-model="goalForm.researchExperience.previousResearchExperienceOther" 
            :rules="previousResearchExperienceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isPreviousResearchExperienceInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isFamiliarToolsInvalid}"
  class="font-weight-black text-h8"
  ref="familiarToolsRef">
    {{$t('What, if any, tools are you familiar with?')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="familiarTool in goalForm.researchExperience.familiarTools" :key="familiarTool.id"
  class="relative"
  @mouseover="hoveredCheckboxID6 = familiarTool.id" 
  @mouseleave="hoveredCheckboxID6 = null">
    <v-checkbox 
    :class="{'error-text': isFamiliarToolsInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="familiarTool.checked" 
        :label="$t(familiarTool.label)"
        :rules="familiarToolsRules"
        :indeterminate="goalForm.researchExperience.familiarTools[goalForm.researchExperience.familiarTools.length - 1].checked && !familiarTool.checked"
    >
    </v-checkbox>


    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="familiarTool.id === 10 && familiarTool.checked">
        <v-col cols="12">
          <v-text-field 
          :ref="`familiarToolOtherRef-${familiarTool.id}`"
          :class="{'error-text': isFamiliarToolOtherInvalid}"
            :placeholder="$t('Please specify')" 
            v-model="goalForm.researchExperience.familiarToolOther" 
            :rules="familiarToolOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isFamiliarToolsInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isInterestResearchServiceInvalid}"
  class="font-weight-black text-h8"
  ref="interestResearchServiceRef">
    {{$t('What are your research/service interests? Check all that apply.')}}
  </p>

  <!-- Loop through all checkboxes -->
  <div v-for="interest in goalForm.researchExperience.interestResearchService" :key="interest.id"
  class="relative"
  @mouseover="hoveredCheckboxID7 = interest.id" 
  @mouseleave="hoveredCheckboxID7 = null">
    <v-checkbox 
    :class="{'error-text': isInterestResearchServiceInvalid}"
        density="compact"
        class="ma-0 pa-0" hide-details="true"
        v-model="interest.checked" 
        :label="$t(interest.label)"
        :rules="interestResearchServiceRules"
        :indeterminate="goalForm.researchExperience.interestResearchService[goalForm.researchExperience.interestResearchService.length - 1].checked && !interest.checked"
    >
    </v-checkbox>


    <!-- "Please Specify" text field for the 'Other' option -->
    <transition name="slide-y-transition">
    <v-row v-show="interest.id === 8 && interest.checked">
        <v-col cols="12">
          <v-text-field 
          :ref="`interestResearchServiceOtherRef-${interest.id}`"
          :class="{'error-text': isInterestResearchServiceOtherInvalid}"
            :placeholder="$t('Please specify')"
            v-model="goalForm.researchExperience.interestResearchServiceOther" 
            :rules="interestResearchServiceOtherRules"
          >
          </v-text-field>
        </v-col>
    </v-row>
  </transition>
  </div>
  <div v-if="isInterestResearchServiceInvalid" class="v-input__details error-text">{{$t('Information is required.')}}</div>
</v-col>


<v-col cols="12" md="10">
  <p 
  :class="{'error-text': isLeadershipOptionInvalid}"
  class="font-weight-black text-h8"
  ref="leadershipOptionRef">{{$t('Are you interested in potentially holding a leadership position?')}}</p>
  <v-radio-group 
  :class="{'error-text': isLeadershipOptionInvalid}"
  v-model="goalForm.researchExperience.leadershipOption"
  :rules="leadershipOptionRules">
    <v-radio :label="$t('Yes')" value="Yes"></v-radio>
    <v-radio :label="$t('Maybe')" value="Maybe"></v-radio>
    <v-radio label="No" value="No"></v-radio>
  </v-radio-group>
</v-col>
</v-container>
</v-form>

<!-- Scroll to Error Button -->
<v-btn
    v-if="hasValidationErrors"
    @click="scrollToErrorField"
    color="error"
    icon
    class="pa-1 fixed-button"
    elevation="4"
    size="small"
>
    <v-icon>mdi-alert-circle</v-icon>
    <v-tooltip activator="parent" location="start">Jump to Error</v-tooltip>
</v-btn>

</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';

export default {
name: "GoalFormCommunityResearch",
props: {
    goalForm: Object,
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
data() {
    return {
        formSubmitted: false,
        hoveredCheckboxID1: null,
        hoveredCheckboxID2: null,
        hoveredCheckboxID3: null,
        hoveredCheckboxID4: null,
        hoveredCheckboxID5: null,
        hoveredCheckboxID6: null,
        hoveredCheckboxID7: null,
        communityEngagementExperiencesRules: [
            () => {
            if (!this.formSubmitted) {
                return true;
            }
            
            return this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked) || this.$t('Information is required.');
            }
        ],
        communityEngagementExperiencesOtherRules: [
            v => {
                if (!this.formSubmitted) return true;
                
                const otherExperience = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.id === 6);

                // If the condition for v-show is false (Other not checked), validation passes automatically
                if (!otherExperience || !otherExperience.checked) return true;

                return !!v || this.$t("If 'Other' is selected, please specify.");
            },
        ],
        previousEngagementExperiencesRules: [
            () => {
                if (!this.formSubmitted) {
                    return true;
                }
                
                return this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked) || this.$t('Information is required.');
            }
        ],
        previousEngagementExperiencesOtherRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    
                    const previousExperience = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.id === 8);

                    // If the condition for v-show is false (Other not checked), validation passes automatically
                    if (!previousExperience || !previousExperience.checked) return true;

                    return !!v || this.$t("If 'Other' is selected, please specify.");
                },
        ],
        engagementActivitiesToolsRules: [
            () => {
                if (!this.formSubmitted) {
                    return true;
                }
                
                return this.goalForm.communityEngagement.engagementActivitiesTools.some(exp => exp.checked) || this.$t('Information is required.');
                }
        ],
        engagementActivitiesToolOtherRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    
                    const engagementActivitiesTool = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.id === 8);

                    // If the condition for v-show is false (Other not checked), validation passes automatically
                    if (!engagementActivitiesTool || !engagementActivitiesTool.checked) return true;

                    return !!v || this.$t("If 'Other' is selected, please specify.");
                },
        ],
        currentResearchExperienceRules: [
            () => {
                if (!this.formSubmitted) {
                    return true;
                }
                
                return this.goalForm.researchExperience.currentResearchExperience.some(exp => exp.checked) || this.$t('Information is required.');
                }
        ],
        currentResearchExperienceOtherRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    
                    const researchExperience = this.goalForm.researchExperience.currentResearchExperience.find(p => p.id === 7);

                    // If the condition for v-show is false (Other not checked), validation passes automatically
                    if (!researchExperience || !researchExperience.checked) return true;

                    return !!v || this.$t("If 'Other' is selected, please specify.");
                }
        ],
        previousResearchExperienceRules: [
            () => {
                if (!this.formSubmitted) {
                    return true;
                }
                
                return this.goalForm.researchExperience.previousResearchExperience.some(exp => exp.checked) || this.$t('Information is required.');
                }
        ],
        previousResearchExperienceOtherRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    
                    const previousExperience = this.goalForm.researchExperience.previousResearchExperience.find(p => p.id === 8);

                    // If the condition for v-show is false (Other not checked), validation passes automatically
                    if (!previousExperience || !previousExperience.checked) return true;

                    return !!v || this.$t("If 'Other' is selected, please specify.");
                }
        ],
        familiarToolsRules: [
            () => {
                if (!this.formSubmitted) {
                    return true;
                }
                
                return this.goalForm.researchExperience.familiarTools.some(exp => exp.checked) || this.$t('Information is required.');
                }
        ],
        familiarToolOtherRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    
                    const familiarTool = this.goalForm.researchExperience.familiarTools.find(p => p.id === 10);

                    // If the condition for v-show is false (Other not checked), validation passes automatically
                    if (!familiarTool || !familiarTool.checked) return true;

                    return !!v || this.$t("If 'Other' is selected, please specify.");
                }
        ],
        interestResearchServiceRules: [
            () => {
                if (!this.formSubmitted) {
                    return true;
                }
                
                return this.goalForm.researchExperience.interestResearchService.some(exp => exp.checked) || this.$t('Information is required.');
                }
        ],
        interestResearchServiceOtherRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    
                    const researchService = this.goalForm.researchExperience.interestResearchService.find(p => p.id === 8);

                    // If the condition for v-show is false (Other not checked), validation passes automatically
                    if (!researchService || !researchService.checked) return true;

                    return !!v || this.$t("If 'Other' is selected, please specify.");
                }
        ],
        leadershipOptionRules: [
            v => {
                    if (!this.formSubmitted) return true;

                    return !!v || this.$t('Information is required.');
                },
        ],

    }
},
watch: {
    'goalForm.communityEngagement.communityEngagementExperiences': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(engagementExperience => {
            if (engagementExperience.id !== lastCheckbox.id) {
              engagementExperience.checked = false;
            }
          });
        }

        const otherExperience= newVal.find(exp => exp.id === 6);
        if (otherExperience && otherExperience.checked && this.formSubmitted) {
            this.$refs.otherExperienceRef[5].validate();
        }
      }
    },
    'goalForm.communityEngagement.previousEngagementExperiences': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(experience => {
            if (experience.id !== lastCheckbox.id) {
              experience.checked = false;
            }
          });
        }
        const previousExperience= newVal.find(exp => exp.id === 8);
        if (previousExperience && previousExperience.checked && this.formSubmitted) {
          this.$refs.previousEngagementExperiencesOtherRef[7].validate();
        }
      }
    },
    'goalForm.communityEngagement.engagementActivitiesTools': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(tool => {
            if (tool.id !== lastCheckbox.id) {
              tool.checked = false;
            }
          });
        }
        const engagementActivitiesTool= newVal.find(exp => exp.id === 8);
        if (engagementActivitiesTool && engagementActivitiesTool.checked && this.formSubmitted) {
          this.$refs.engagementActivitiesToolOtherRef[7].validate();
        }
      }
    },
    'goalForm.researchExperience.currentResearchExperience': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(experience => {
            if (experience.id !== lastCheckbox.id) {
              experience.checked = false;
            }
          });
        }
        const researchExperience= newVal.find(exp => exp.id === 7);
        if (researchExperience && researchExperience.checked && this.formSubmitted) {
          this.$refs.currentResearchExperienceOtherRef[6].validate();
        }
      }
    },
    'goalForm.researchExperience.previousResearchExperience': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(experience => {
            if (experience.id !== lastCheckbox.id) {
              experience.checked = false;
            }
          });
        }
        const previousExperience= newVal.find(exp => exp.id === 8);
        if (previousExperience && previousExperience.checked && this.formSubmitted) {
          this.$refs.previousResearchExperienceOtherRef[7].validate();
        }
      }
    },
    'goalForm.researchExperience.familiarTools': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(tool => {
            if (tool.id !== lastCheckbox.id) {
              tool.checked = false;
            }
          });
        }
        const familiarTool= newVal.find(exp => exp.id === 10);
        if (familiarTool && familiarTool.checked && this.formSubmitted) {
          this.$refs.familiarToolOtherRef[9].validate();
        }
      }
    },
    'goalForm.researchExperience.interestResearchService': {
      deep: true,
      handler(newVal) {
        // Find the last checkbox
        const lastCheckbox = newVal[newVal.length - 1];

        // If the last checkbox is checked, uncheck all other checkboxes
        if (lastCheckbox && lastCheckbox.checked) {
          newVal.forEach(interestItem => {
            if (interestItem.id !== lastCheckbox.id) {
              interestItem.checked = false;
            }
          });
        }
        const researchService= newVal.find(exp => exp.id === 8);
        if (researchService && researchService.checked && this.formSubmitted) {
          this.$refs.interestResearchServiceOtherRef[7].validate();
        }
      }
    },
    hasValidationErrors(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.$emit('validation-change', { isValid: !newValue });
        }
    },
},
computed: {
    isCommunityEngagementExperiencesInvalid() {
        // If form hasn't been submitted then skip validation
        if (!this.formSubmitted) return '';

        // Check if at least one checkbox is checked
        if (!this.goalForm.communityEngagement.communityEngagementExperiences.some(exp => exp.checked)) {
        return this.$t('Information is required.');
        }
        return '';
    },
    isOtherEngagementExperienceInvalid() {
        if (!this.formSubmitted) return false;
        const otherExperience = this.goalForm.communityEngagement.communityEngagementExperiences.find(p => p.id === 6);
        return otherExperience.checked && !this.goalForm.communityEngagement.communityEngagementExperiencesOther;
    },
    isPreviousEngagementExperiencesInvalid() {
        if (!this.formSubmitted) return '';

        // Check if at least one checkbox is checked
        if (!this.goalForm.communityEngagement.previousEngagementExperiences.some(exp => exp.checked)) {
        return this.$t('Information is required.');
        }
        return '';
    },
    isPreviousEngagementExperiencesOtherInvalid() {
        if (!this.formSubmitted) return false;
        const previousExperience = this.goalForm.communityEngagement.previousEngagementExperiences.find(p => p.id === 8);
        return previousExperience.checked && !this.goalForm.communityEngagement.previousEngagementExperiencesOther;
    },
    isEngagementActivitiesToolsInvalid() {
        if (!this.formSubmitted) return '';

        // Check if at least one checkbox is checked
        if (!this.goalForm.communityEngagement.engagementActivitiesTools.some(exp => exp.checked)) {
        return this.$t('Information is required.');
        }
        return '';
    },
    isEngagementActivitiesToolOtherInvalid() {
        if (!this.formSubmitted) return false;
        const engagementActivitiesTool = this.goalForm.communityEngagement.engagementActivitiesTools.find(p => p.id === 8);
        return engagementActivitiesTool.checked && !this.goalForm.communityEngagement.engagementActivitiesToolOther;
    },
    isCurrentResearchExperienceInvalid() {
        if (!this.formSubmitted) return '';

        // Check if at least one checkbox is checked
        if (!this.goalForm.researchExperience.currentResearchExperience.some(exp => exp.checked)) {
        return this.$t('Information is required.');
        }
        return '';
    },
    isCurrentResearchExperienceOtherInvalid() {
        if (!this.formSubmitted) return false;
        const researchExperience = this.goalForm.researchExperience.currentResearchExperience.find(p => p.id === 7);
        return researchExperience.checked && !this.goalForm.researchExperience.currentResearchExperienceOther;
    },
    isPreviousResearchExperienceInvalid() {
        if (!this.formSubmitted) return '';

        // Check if at least one checkbox is checked
        if (!this.goalForm.researchExperience.previousResearchExperience.some(exp => exp.checked)) {
        return this.$t('Information is required.');
        }
        return '';
    },
    isPreviousResearchExperienceOtherInvalid() {
        if (!this.formSubmitted) return false;
        const previousExperience = this.goalForm.researchExperience.previousResearchExperience.find(p => p.id === 8);
        return previousExperience.checked && !this.goalForm.researchExperience.previousResearchExperienceOther;
    },
    isFamiliarToolsInvalid() {
        if (!this.formSubmitted) return '';

        // Check if at least one checkbox is checked
        if (!this.goalForm.researchExperience.familiarTools.some(exp => exp.checked)) {
        return this.$t('Information is required.');
        }
        return '';
    },
    isFamiliarToolOtherInvalid() {
        if (!this.formSubmitted) return false;
        const familiarTool = this.goalForm.researchExperience.familiarTools.find(p => p.id === 10);
        return familiarTool.checked && !this.goalForm.researchExperience.familiarToolOther;
    },
    isInterestResearchServiceInvalid() {
        if (!this.formSubmitted) return '';

        // Check if at least one checkbox is checked
        if (!this.goalForm.researchExperience.interestResearchService.some(exp => exp.checked)) {
            return this.$t('Information is required.');
        }
        return '';
    },
    isInterestResearchServiceOtherInvalid() {
        if (!this.formSubmitted) return false;
        const researchService = this.goalForm.researchExperience.interestResearchService.find(p => p.id === 8);
        return researchService.checked && !this.goalForm.researchExperience.interestResearchServiceOther;
    },
    isLeadershipOptionInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.researchExperience.leadershipOption) !== true;
    },
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
            return this.isCommunityEngagementExperiencesInvalid || this.isOtherEngagementExperienceInvalid || this.isPreviousEngagementExperiencesInvalid || this.isPreviousEngagementExperiencesOtherInvalid || this.isEngagementActivitiesToolsInvalid || this.isEngagementActivitiesToolOtherInvalid || this.isCurrentResearchExperienceInvalid || this.isCurrentResearchExperienceOtherInvalid || this.isPreviousResearchExperienceInvalid || this.isPreviousResearchExperienceOtherInvalid || this.isFamiliarToolsInvalid || this.isFamiliarToolOtherInvalid || this.isInterestResearchServiceInvalid || this.isInterestResearchServiceOtherInvalid || this.isLeadershipOptionInvalid;
    },

},
methods: {
    async handleValidations() {
        console.log('handleValidations called')
        this.formSubmitted = true;
        const { valid } = await this.$refs.form.validate();
        if (valid) {
            console.log('form is valid!');
            this.$emit('form-valid');
        } else {
            this.$emit('form-invalid');
            toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: false
            });
        }
    },

    scrollToErrorField() {
        const errorFields = [
            'communityEngagementExperiencesRef',
            'otherExperienceRef',
            'previousEngagementExperiencesRef',
            'previousEngagementExperiencesOtherRef',
            'engagementActivitiesToolsRef',
            'engagementActivitiesToolOtherRef',
            'currentResearchExperienceRef',
            'currentResearchExperienceOtherRef',
            'previousResearchExperienceRef',
            'previousResearchExperienceOtherRef',
            'familiarToolsRef',
            'familiarToolOtherRef',
            'interestResearchServiceRef',
            'interestResearchServiceOtherRef',
            'leadershipOptionRef'
        ];

        for (let i = 0; i < errorFields.length; i++) {
            if (this.isFieldInvalid(errorFields[i])) {
                console.log('this.isFieldInvalid: ', this.isFieldInvalid(errorFields[i]));
                console.log('errorFields[i]: ', errorFields[i]);

                let ref;
                switch (errorFields[i]) {
                    case 'otherExperienceRef':
                        ref = this.$refs[`otherExperienceRef-6`][0];
                        break;
                    case 'previousEngagementExperiencesOtherRef':
                        ref = this.$refs[`previousEngagementExperiencesOtherRef-8`][0];
                        break;
                    case 'engagementActivitiesToolOtherRef':
                        ref = this.$refs[`engagementActivitiesToolOtherRef-8`][0];
                        break;
                    case 'currentResearchExperienceOtherRef':
                        ref = this.$refs[`currentResearchExperienceOtherRef-7`][0];
                        break;
                    case 'previousResearchExperienceOtherRef':
                        ref = this.$refs[`previousResearchExperienceOtherRef-8`][0];
                        break;
                    case 'familiarToolOtherRef':
                        ref = this.$refs[`familiarToolOtherRef-10`][0];
                        break;
                    case 'interestResearchServiceOtherRef':
                        ref = this.$refs[`interestResearchServiceOtherRef-8`][0];
                        break;
                    default:
                        ref = this.$refs[errorFields[i]];
                        break;
                }


                if (ref) {
                    const element = ref.$el ? ref.$el : ref;
                    console.log('element: ', element);
                    this.$emit('scroll-to-error', element);
                    break;
                }
            }
        }
    },

    isFieldInvalid(fieldRef) {
        switch (fieldRef) {
            case 'communityEngagementExperiencesRef':
                return this.isCommunityEngagementExperiencesInvalid;
            case 'otherExperienceRef':
                return this.isOtherEngagementExperienceInvalid;
            case 'previousEngagementExperiencesRef':
                return this.isPreviousEngagementExperiencesInvalid;
            case 'previousEngagementExperiencesOtherRef':
                return this.isPreviousEngagementExperiencesOtherInvalid;
            case 'engagementActivitiesToolsRef':
                return this.isEngagementActivitiesToolsInvalid;
            case 'engagementActivitiesToolOtherRef':
                return this.isEngagementActivitiesToolOtherInvalid;
            case 'currentResearchExperienceRef':
                return this.isCurrentResearchExperienceInvalid;
            case 'currentResearchExperienceOtherRef':
                return this.isCurrentResearchExperienceOtherInvalid;
            case 'previousResearchExperienceRef':
                return this.isPreviousResearchExperienceInvalid;
            case 'previousResearchExperienceOtherRef':
                return this.isPreviousResearchExperienceOtherInvalid;
            case 'familiarToolsRef':
                return this.isFamiliarToolsInvalid;
            case 'familiarToolOtherRef':
                return this.isFamiliarToolOtherInvalid;
            case 'interestResearchServiceRef':
                return this.isInterestResearchServiceInvalid;
            case 'interestResearchServiceOtherRef':
                return this.isInterestResearchServiceOtherInvalid;
            case 'leadershipOptionRef':
                return this.isLeadershipOptionInvalid;
            default:
                return false;
        }
    },
},
}
</script>

<style scoped>
.error-text {
    color: rgb(176, 0, 32);
}

.fixed-button {
    position: fixed;
    bottom: 20px; /* Adjust the bottom value as needed */
    right: 20px; /* Adjust the right value as needed */
    z-index: 1000;
}

</style>