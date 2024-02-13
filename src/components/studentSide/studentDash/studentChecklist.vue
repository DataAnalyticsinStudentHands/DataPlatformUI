<template>
      <v-card
      class="mx-auto elevation-12"
      color="#385F73"
      width="100%"
      >
      <v-list>
          <v-list-item>
              <v-list-item-title class="flex-grow-1 text-center">
                  <span class="font-weight-black text-lg">{{$t('Checklist')}}</span>
                  <v-icon>mdi-clipboard-check</v-icon>
              </v-list-item-title>
          </v-list-item>

          <v-list-group value="Entry Form">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :color="hasCompletedEntryForm ? 'green darken-4' : ''" :class="hasCompletedEntryForm ? 'light-green-bg' : 'light-red-bg'" class="font-weight-black text-base">
                    <span :class="hasCompletedEntryForm ? 'text-green-800' : 'text-red-800'">
                        {{ hasCompletedEntryForm ? $t('Student Entry Form') : $t('Complete Student Entry Form') }}
                    </span>
                    <template v-slot:append>
                        <v-icon :class="hasCompletedEntryForm ? 'text-green-800' : 'text-red-800'">{{ hasCompletedEntryForm ? 'mdi-check-bold' : 'mdi-alert-circle' }}</v-icon>
                    </template>
                </v-list-item>
            </template>
            <v-list-item class="list-item-no-padding flex" :class="hasCompletedEntryForm ? 'light-green-bg' : 'light-red-bg'">
                <div class="flex items-center no-right-margin">
                    <v-icon :class="hasCompletedEntryForm ? 'text-green-800' : 'text-red-800'" size="small">{{'mdi-door-open'}}</v-icon>
                    <span :class="hasCompletedEntryForm ? 'text-sm text-green-800' : 'text-sm text-red-800'">
                        {{ hasCompletedEntryForm ? $t('Thank you for completing the Student Entry Form!') : $t('Please complete the ') }}
                        <router-link v-if="!hasCompletedEntryForm" to="/studentEntryForm" class="text-blue-500 underline">{{$t('Student Entry Form')}}</router-link>
                    </span>
                </div>
            </v-list-item>
        </v-list-group>



        <v-list-group v-if="hasCompletedEntryForm" value="Register Experiences">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :class="registeredExperiences.length === 0 ? 'light-red-bg' : 'light-green-bg'" @click="registeredExperiences.length === 0">
                    <span class="text-red-800 font-weight-black" v-if="registeredExperiences.length === 0">{{$t('Register your Experiences')}}</span>
                    <span class="text-green-800 font-weight-black" v-else>{{$t('Experiences Registered')}}</span>
                    <template v-slot:append>
                        <v-icon class="text-red-800" v-if="registeredExperiences.length === 0">mdi-alert-circle</v-icon>
                        <v-icon class="text-green-800" v-else>mdi-check-bold</v-icon>
                    </template>
                </v-list-item>
            </template>
            <v-list-item class="list-item-no-padding flex" :class="registeredExperiences.length === 0 ? 'light-red-bg' : 'light-green-bg'">
                <div class="flex items-center no-right-margin">
                    <v-icon :class="registeredExperiences.length === 0 ? 'text-red-800' : 'text-green-800'" size="small">mdi-flag-checkered</v-icon>
                    <span :class="registeredExperiences.length === 0 ? 'text-sm text-red-800' : 'text-sm text-green-800'">
                        <span v-if="registeredExperiences.length === 0">{{$t('Please use the “Add/Remove Experiences” button to register!')}}</span>
                        <span v-else>{{$t('Congratulations on registering for your experiences! Good luck!')}}</span>
                    </span>
                </div>
            </v-list-item>
        </v-list-group>
        <v-list-group value="Goal Form" v-if="registeredExperiences.length && !exitFormsReleased" :class="areAllGoalsSet ? 'light-green-bg' : 'light-red-bg'">
          <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <span :class="areAllGoalsSet ? 'text-green-800 font-weight-black' : 'text-red-800 font-weight-black'">
                    <span v-if="registeredExperiences.length === 1">
                        {{ areAllGoalsSet ? $t('Completed Goal Setting Form') : $t('Complete Goal Setting Form') }}
                    </span>
                    <span v-if="registeredExperiences.length > 1">
                        {{ areAllGoalsSet ? $t('Completed Goal Setting Forms') : $t('Complete Goal Setting Forms') }}
                    </span>
                </span>
                  <template v-slot:append>
                      <v-icon :class="areAllGoalsSet ? 'text-green-800' : 'text-red-800'">{{ areAllGoalsSet ? 'mdi-check-bold' : 'mdi-alert-circle' }}</v-icon>
                  </template>
              </v-list-item>
          </template>
            <!-- Loop through selected experiences and create a dropdown item for each one -->
            <v-list-item 
                v-for="experience in registeredExperiences" 
                :key="experience._id" 
                :class="isGoalFormCompleted(experience._id) ? 'light-green-bg' : 'light-red-bg'"
            >
                <span :class="isGoalFormCompleted(experience._id) ? 'text-sm text-green-800' : 'text-sm text-red-800'">
                    {{ isGoalFormCompleted(experience._id) ? $t('Completed Goal Setting Form for') : $t('Complete Goal Setting Form for') }}
                    <!-- Conditionally render router-link or plain text based on completion status -->
                    <router-link 
                        v-if="!isGoalFormCompleted(experience._id)"
                        :to="{ name: 'goalSettingForm', params: { id: experience._id } }" 
                        class="text-blue-600 underline hover:text-blue-800"
                    >
                        {{ experience.experienceInstance.name }}
                    </router-link>
                    <span v-else class="text-green-800">
                        {{ experience.experienceInstance.name }}
                    </span>
                </span> 
            </v-list-item>
       </v-list-group>

       <v-list-group v-if="registeredExperiences.length && exitFormsReleased" :class="areAllExitFormsCompleted ? 'light-green-bg' : 'light-red-bg'">
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <span :class="areAllExitFormsCompleted ? 'text-green-800 font-weight-black' : 'text-red-800 font-weight-black'">
                  {{ areAllExitFormsCompleted ? 'Completed' : 'Complete' }} Exit Form<span v-if="registeredExperiences.length > 1">s</span>
              </span>
                <template v-slot:append>
                    <v-icon :class="areAllExitFormsCompleted ? 'text-green-800' : 'text-red-800'">{{ areAllExitFormsCompleted ? 'mdi-check-bold' : 'mdi-alert-circle' }}</v-icon>
                </template>
            </v-list-item>
        </template>
          <!-- Loop through selected experiences and create a dropdown item for each one -->
          <v-list-item 
              v-for="experience in registeredExperiences" 
              :key="experience._id" 
              :class="isExitFormCompleted(experience._id) ? 'light-green-bg' : 'light-red-bg'"
          >
              <span :class="isExitFormCompleted(experience._id) ? 'text-sm text-green-800' : 'text-sm text-red-800'">
                  {{ isExitFormCompleted(experience._id) ? 'Completed' : 'Complete' }} Exit Form for 
              </span> 
              <!-- Conditionally render router-link or plain text based on completion status -->
              <router-link 
                  v-if="!isExitFormCompleted(experience._id)"
                  :to="{ name: 'exitForm', params: { id: experience._id } }" 
                  class="text-blue-600 underline hover:text-blue-800"
              >
                  {{ experience.experienceName }}
              </router-link>
              <!-- Render plain text if form is completed -->
              <span v-else class="text-green-800">
                  {{ experience.experienceName }}
              </span>
          </v-list-item>
      </v-list-group>
      </v-list>
      </v-card>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
    name: 'StudentChecklist',
    computed: {
        // Access store and its state
        store() {
            return useLoggedInUserStore();
        },
        hasCompletedEntryForm() {
            return this.store.hasCompletedEntryForm;
        },
        exitFormsReleased() {
            return this.store.exitFormsReleased;
        },
        areAllGoalsSet() {
            if (!this.goalSettingFormCompletion) {
                return false;
            }
            return this.store.registeredExperiences.every(experience => {
                return this.goalSettingFormCompletion[experience._id];
            });
        },
        goalSettingFormCompletion() {
            return this.store.goalSettingFormCompletion;
        },
        exitFormCompletion() {
            return this.store.exitFormCompletion;
        },
        areAllExitFormsCompleted() {
            if (!this.exitFormCompletion) {
                return false;
            }
            return this.store.registeredExperiences.every(experience => {
                return this.exitFormCompletion[experience._id];
            });
        },
        registeredExperiences() {
            return this.store.registeredExperiences;
        }
    },
    methods: {
        isGoalFormCompleted(registrationId) {
            return this.goalSettingFormCompletion[registrationId];
        },
        isExitFormCompleted(experienceId) {
            return this.exitFormCompletion && this.exitFormCompletion[experienceId];
        },
    }
}
</script>

<style>

</style>