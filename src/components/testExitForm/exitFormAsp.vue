<template>
<v-container>
  <v-form 
    ref="form"
    @submit.prevent="handleValidations"
  >

    <!-- Aspirations -->
    <div v-if="goalFormExists">
      <v-row dense>
          <v-col cols="12">
          <p class="font-weight-black text-h8">{{$t('At the beginning of the semester, we asked you to share two to three aspirations. Now we would like to know about your progress towards these aspirations. Below is a list of your aspirations from the beginning of the semester.')}}</p>
          </v-col>
      </v-row>
      <v-row dense>
          <v-col cols="12">
          <v-list density="compact">
              <template v-for="(aspiration, index) in [exitForm.aspiration1, exitForm.aspiration2, exitForm.aspiration3]">
              <v-list-item v-if="aspiration" :key="index">
                  <v-list-item-title>
                    <span class="font-weight-black"> {{$t('Aspiration')}} {{ index + 1 }}: </span>
                  </v-list-item-title>
                  {{ aspiration }}
              </v-list-item>
              </template>
          </v-list>
          </v-col>
      </v-row>

      <!-- Aspirations Progress Table -->
      <v-row>
          <v-col cols="12">
            <p :class="{'text-custom-red': isAspirationProgressInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">{{$t('For each aspiration listed, please pick the option that best describes the progress you made.')}}</p>
          </v-col>
      </v-row>

    <!-- Mobile View -->
    <v-row class="d-sm-none">
        <v-col cols="12">
          <div v-if="exitForm.aspiration1">
              <div class="font-semibold italic">“{{ exitForm.aspiration1 }}”</div>
              <v-radio-group v-model="exitForm.progressMade.aspirationOneProgressSelected" :rules="[requiredRule]">
              <v-radio
                  v-for="option in exitForm.progressMade.aspirationOneProgressResults"
                  :label="$t(option.xs_label)"
                  :key="option.id"
                  :value="option.label"
              ></v-radio>
              </v-radio-group>
          </div>
          <div v-if="exitForm.aspiration2">
              <div class="font-semibold italic">“{{ exitForm.aspiration2 }}”</div>
              <v-radio-group v-model="exitForm.progressMade.aspirationTwoProgressSelected"  :rules="[requiredRule]">
              <v-radio
                  v-for="option in exitForm.progressMade.aspirationTwoProgressResults"
                  :label="$t(option.xs_label)"
                  :key="option.id"
                  :value="option.label"
              ></v-radio>
              </v-radio-group>
          </div>
          <div v-if="exitForm.aspiration3">
              <div class="font-semibold italic">“{{ exitForm.aspiration3 }}”</div>
              <v-radio-group v-model="exitForm.progressMade.aspirationThreeProgressSelected"  :rules="[requiredRule]">
              <v-radio
                  v-for="option in exitForm.progressMade.aspirationThreeProgressResults"
                  :label="$t(option.xs_label)"
                  :key="option.id"
                  :value="option.label"
              ></v-radio>
              </v-radio-group>
          </div>
        </v-col>
    </v-row>

    <!-- Non-Mobile View -->  
    <v-row class="d-none d-sm-flex">
        <v-col cols="12">
          <v-card>
            <v-table>
                <thead>
                  <tr>
                      <th></th>
                      <th v-for="option in exitForm.progressMade.aspirationOneProgressResults" :key="option.id" class="text-center">{{ $t(option.label) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="exitForm.aspiration1">
                      <td>{{ exitForm.aspiration1 }}</td>
                      <td v-for="option in exitForm.progressMade.aspirationOneProgressResults" :key="option.id">
                      <v-radio-group v-model="exitForm.progressMade.aspirationOneProgressSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationOneProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                          <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                      </v-radio-group>
                      </td>
                  </tr>
                  <tr v-if="exitForm.aspiration2">
                      <td>{{ exitForm.aspiration2 }}</td>
                      <td v-for="option in exitForm.progressMade.aspirationTwoProgressResults" :key="option.id">
                      <v-radio-group v-model="exitForm.progressMade.aspirationTwoProgressSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationTwoProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                          <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                      </v-radio-group>
                      </td>
                  </tr>
                  <tr v-if="exitForm.aspiration3">
                      <td>{{ exitForm.aspiration3 }}</td>
                      <td v-for="option in exitForm.progressMade.aspirationThreeProgressResults" :key="option.id">
                      <v-radio-group v-model="exitForm.progressMade.aspirationThreeProgressSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationThreeProgressSelected && formSubmitted) ? $t('Please select one.') : ''">
                          <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                      </v-radio-group>
                      </td>
                  </tr>
                </tbody>
            </v-table>
          </v-card>
      </v-col>
    </v-row>

    <!-- Aspirations Connection Table -->
    <v-row>
      <v-col cols="12">
          <p :class="{'text-custom-red': isAspirationConnectionInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">{{$t('For each aspiration listed, please pick the option that best describes the progress you made.')}}</p>
      </v-col>
    </v-row>

    <!-- Mobile View -->
    <v-row class="d-sm-none">
      <v-col cols="12">
          <v-row>
            <v-col cols="12">
                <div v-if="exitForm.aspiration1">
                    <div class="font-semibold italic">“{{ exitForm.aspiration1 }}”</div>
                    <p class="text-caption text-gray-500">{{$t('The progress I made towards this aspiration was...')}}</p>
                    <v-radio-group v-model="exitForm.progressMade.aspirationOneExperienceConnectionSelected"  :rules="[requiredRule]">
                      <v-radio
                          v-for="option in exitForm.progressMade.aspirationOneExperienceConnection"
                          :label="$t(option.xs_label)"
                          :key="option.id"
                          :value="option.label"
                      ></v-radio>
                    </v-radio-group>
                </div>
                <div v-if="exitForm.aspiration2">
                    <div class="font-semibold italic">“{{ exitForm.aspiration2 }}”</div>
                    <p class="text-caption text-gray-500">{{$t('The progress I made towards this aspiration was...')}}</p>
                    <v-radio-group v-model="exitForm.progressMade.aspirationTwoExperienceConnectionSelected"  :rules="[requiredRule]">
                      <v-radio
                          v-for="option in exitForm.progressMade.aspirationTwoExperienceConnection"
                          :label="$t(option.xs_label)"
                          :key="option.id"
                          :value="option.label"
                      ></v-radio>
                    </v-radio-group>
                </div>
                <div v-if="exitForm.aspiration3">
                    <div class="font-semibold italic">“{{ exitForm.aspiration3 }}”</div>
                    
                    <p class="text-caption text-gray-500">{{$t('The progress I made towards this aspiration was...')}}</p>
                    <v-radio-group v-model="exitForm.progressMade.aspirationThreeExperienceConnectionSelected"  :rules="[requiredRule]">
                      <v-radio
                          v-for="option in exitForm.progressMade.aspirationThreeExperienceConnection"
                          :label="$t(option.xs_label)"
                          :key="option.id"
                          :value="option.label"
                      ></v-radio>
                    </v-radio-group>
                </div>
            </v-col>
          </v-row>
      </v-col>
    </v-row>


    <!-- Non-Mobile View -->
    <v-row>
      <v-col cols="12">
          <v-card>
            <v-table class="d-none d-sm-flex">
                <thead>
                  <tr>
                      <th></th>
                      <th v-for="option in exitForm.progressMade.aspirationOneExperienceConnection" :key="option.id" class="text-center">{{ $t(option.label) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="exitForm.aspiration1">
                      <td>{{ exitForm.aspiration1 }}</td>
                      <td v-for="option in exitForm.progressMade.aspirationOneExperienceConnection" :key="option.id">
                      <v-radio-group v-model="exitForm.progressMade.aspirationOneExperienceConnectionSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationOneExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                          <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                      </v-radio-group>
                      </td>
                  </tr>
                  <tr v-if="exitForm.aspiration2">
                      <td>{{ exitForm.aspiration2 }}</td>
                      <td v-for="option in exitForm.progressMade.aspirationTwoExperienceConnection" :key="option.id">
                      <v-radio-group v-model="exitForm.progressMade.aspirationTwoExperienceConnectionSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationTwoExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                          <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                      </v-radio-group>
                      </td>
                  </tr>
                  <tr v-if="exitForm.aspiration3">
                      <td>{{ exitForm.aspiration3 }}</td>
                      <td v-for="option in exitForm.progressMade.aspirationThreeExperienceConnection" :key="option.id">
                      <v-radio-group v-model="exitForm.progressMade.aspirationThreeExperienceConnectionSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationThreeExperienceConnectionSelected && formSubmitted) ? $t('Please select one.') : ''">
                          <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                      </v-radio-group>
                      </td>
                  </tr>
                </tbody>
            </v-table>
          </v-card>
      </v-col>
    </v-row>


    </div>
  </v-form>
</v-container>
</template>

<script>
  export default {
    name: "ExitFormAspirations",
    props: {
      exitForm: Object,
      goalFormExists: Boolean,
    },
    emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
    data() {
      return {
        formSubmitted: false,
        requiredRule: value => {
          // If form has not been submitted, pass validation
          if (!this.formSubmitted) {
              return true;
          }
          // Otherwise, check if the value is present
          return !!value || this.$t('Information is required.');
          },
      }
    },

    computed: {
      isAspirationProgressInvalid() {
          // Check the first two aspirations for validity as they are required.
          const isAspirationOneInvalid = !this.exitForm.progressMade.aspirationOneProgressSelected;
          const isAspirationTwoInvalid = !this.exitForm.progressMade.aspirationTwoProgressSelected;
          
          // Check if the third aspiration exists. If it doesn't, don't validate it.
          const isAspirationThreeInvalid = this.exitForm.aspiration3 && !this.exitForm.progressMade.aspirationThreeProgressSelected;

          // The form is invalid if the first two are invalid or if the third one is invalid when it exists.
          return isAspirationOneInvalid || isAspirationTwoInvalid || isAspirationThreeInvalid;
      },

      isAspirationConnectionInvalid() {
          const isAspirationOneConnectionInvalid = !this.exitForm.progressMade.aspirationOneExperienceConnectionSelected;
          const isAspirationTwoConnectionInvalid = !this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected;

          const isAspirationThreeConnectionInvalid = this.exitForm.aspiration3 && !this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected;

          return isAspirationOneConnectionInvalid || isAspirationTwoConnectionInvalid || isAspirationThreeConnectionInvalid;
      },
    },

    methods: {
      async handleValidations() {
          this.formSubmitted = true;
          const { valid } = await this.$refs.form.validate();
          if (valid) {
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
          // const errorFields = [
          //     'communityEngagementExperiencesRef',
          //     'otherExperienceRef',
          //     'previousEngagementExperiencesRef',
          //     'previousEngagementExperiencesOtherRef',
          //     'engagementActivitiesToolsRef',
          //     'engagementActivitiesToolOtherRef',
          //     'currentResearchExperienceRef',
          //     'currentResearchExperienceOtherRef',
          //     'previousResearchExperienceRef',
          //     'previousResearchExperienceOtherRef',
          //     'familiarToolsRef',
          //     'familiarToolOtherRef',
          //     'interestResearchServiceRef',
          //     'interestResearchServiceOtherRef',
          //     'leadershipOptionRef'
          // ];

          // for (let i = 0; i < errorFields.length; i++) {
          //     if (this.isFieldInvalid(errorFields[i])) {

          //         let ref;
          //         switch (errorFields[i]) {
          //             case 'otherExperienceRef':
          //                 ref = this.$refs[`otherExperienceRef-6`][0];
          //                 break;
          //             case 'previousEngagementExperiencesOtherRef':
          //                 ref = this.$refs[`previousEngagementExperiencesOtherRef-8`][0];
          //                 break;
          //             case 'engagementActivitiesToolOtherRef':
          //                 ref = this.$refs[`engagementActivitiesToolOtherRef-8`][0];
          //                 break;
          //             case 'currentResearchExperienceOtherRef':
          //                 ref = this.$refs[`currentResearchExperienceOtherRef-7`][0];
          //                 break;
          //             case 'previousResearchExperienceOtherRef':
          //                 ref = this.$refs[`previousResearchExperienceOtherRef-8`][0];
          //                 break;
          //             case 'familiarToolOtherRef':
          //                 ref = this.$refs[`familiarToolOtherRef-10`][0];
          //                 break;
          //             case 'interestResearchServiceOtherRef':
          //                 ref = this.$refs[`interestResearchServiceOtherRef-8`][0];
          //                 break;
          //             default:
          //                 ref = this.$refs[errorFields[i]];
          //                 break;
          //         }


          //         if (ref) {
          //             const element = ref.$el ? ref.$el : ref;
          //             this.$emit('scroll-to-error', element);
          //             break;
          //         }
          //     }
          // }
      },
      
      isFieldInvalid(fieldRef) {
          switch (fieldRef) {
              // case 'communityEngagementExperiencesRef':
              //     return this.isCommunityEngagementExperiencesInvalid;
              // case 'otherExperienceRef':
              //     return this.isOtherEngagementExperienceInvalid;
              // case 'previousEngagementExperiencesRef':
              //     return this.isPreviousEngagementExperiencesInvalid;
              // case 'previousEngagementExperiencesOtherRef':
              //     return this.isPreviousEngagementExperiencesOtherInvalid;
              // case 'engagementActivitiesToolsRef':
              //     return this.isEngagementActivitiesToolsInvalid;
              // case 'engagementActivitiesToolOtherRef':
              //     return this.isEngagementActivitiesToolOtherInvalid;
              // case 'currentResearchExperienceRef':
              //     return this.isCurrentResearchExperienceInvalid;
              // case 'currentResearchExperienceOtherRef':
              //     return this.isCurrentResearchExperienceOtherInvalid;
              // case 'previousResearchExperienceRef':
              //     return this.isPreviousResearchExperienceInvalid;
              // case 'previousResearchExperienceOtherRef':
              //     return this.isPreviousResearchExperienceOtherInvalid;
              // case 'familiarToolsRef':
              //     return this.isFamiliarToolsInvalid;
              // case 'familiarToolOtherRef':
              //     return this.isFamiliarToolOtherInvalid;
              // case 'interestResearchServiceRef':
              //     return this.isInterestResearchServiceInvalid;
              // case 'interestResearchServiceOtherRef':
              //     return this.isInterestResearchServiceOtherInvalid;
              // case 'leadershipOptionRef':
              //     return this.isLeadershipOptionInvalid;
              // default:
              //     return false;
          }
      },
    }
  }
</script>

<style>

</style>