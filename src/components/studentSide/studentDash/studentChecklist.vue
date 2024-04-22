<template>
    <!-- registeredExperiences: {{ registeredExperiences }}
    <br><br><br>
    goalSettingFormCompletion: {{ goalSettingFormCompletion }}
    <br><br><br>
    exitFormCompletion: {{ exitFormCompletion }} -->
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

          <!-- Entry Form -->
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


        <!-- Register for Experiences -->
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

        <!-- Goal Forms -->
        <v-list-group value="Goal Form" v-if="hasGoalFormsToComplete" :class="areAllGoalsSet ? 'light-green-bg' : 'light-red-bg'">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                    <span :class="areAllGoalsSet ? 'text-green-800 font-weight-black' : 'text-red-800 font-weight-black'">
                        <span v-if="Object.keys(filteredGoalFormCompletion).length === 1">
                            {{ areAllGoalsSet ? $t('Completed Goal Setting Form') : $t('Complete Goal Setting Form') }}
                        </span>
                        <span v-if="Object.keys(filteredGoalFormCompletion).length > 1">
                            {{ areAllGoalsSet ? $t('Completed Goal Setting Forms') : $t('Complete Goal Setting Forms') }}
                        </span>
                    </span>
                    <template v-slot:append>
                        <v-icon :class="areAllGoalsSet ? 'text-green-800' : 'text-red-800'">{{ areAllGoalsSet ? 'mdi-check-bold' : 'mdi-alert-circle' }}</v-icon>
                    </template>
                </v-list-item>
            </template>
            <!-- Loop through filteredGoalFormCompletion to create a dropdown item for each one -->
            <v-list-item 
                v-for="(completed, registrationId) in filteredGoalFormCompletion" 
                :key="registrationId" 
                :class="completed ? 'light-green-bg' : 'light-red-bg'"
            >
                <span :class="completed ? 'text-sm text-green-800' : 'text-sm text-red-800'">
                    {{ completed ? $t('Completed Goal Setting Form for') : $t('Complete Goal Setting Form for') }}
                    <!-- Conditionally render router-link or plain text based on completion status -->
                    <router-link 
                        v-if="!completed"
                        :to="{ name: 'goalSettingForm', params: { registrationID: registrationId } }" 
                        class="text-blue-600 underline hover:text-blue-800"
                    >
                        {{ findExperienceName(registrationId) }}
                    </router-link>
                    <!-- Render the experience name -->
                    <span v-else :class="completed ? 'text-green-800' : 'text-red-800'">
                        {{ findExperienceName(registrationId) }}
                    </span>
                </span>
            </v-list-item>
        </v-list-group>


       <!-- Exit Forms -->
       <v-list-group 
        v-if="hasExitFormsToComplete" 
        :class="areAllExitFormsCompleted ? 'light-green-bg' : 'light-red-bg'">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                    <span :class="areAllExitFormsCompleted ? 'text-green-800 font-weight-black' : 'text-red-800 font-weight-black'">
                        {{ areAllExitFormsCompleted ? 'Completed' : 'Complete' }} Exit Form<span v-if="Object.keys(exitFormCompletion).length > 1">s</span>
                    </span>
                    <template v-slot:append>
                        <v-icon :class="areAllExitFormsCompleted ? 'text-green-800' : 'text-red-800'">{{ areAllExitFormsCompleted ? 'mdi-check-bold' : 'mdi-alert-circle' }}</v-icon>
                    </template>
                </v-list-item>
            </template>
            <!-- Loop through exitFormCompletion to get each completed form's ID -->
            <v-list-item 
                v-for="registrationId in Object.keys(exitFormCompletion)" 
                :key="registrationId"
                :class="isExitFormCompleted(registrationId) ? 'light-green-bg' : 'light-red-bg'">
                <span :class="isExitFormCompleted(registrationId) ? 'text-sm text-green-800' : 'text-sm text-red-800'">
                    {{ isExitFormCompleted(registrationId) ? 'Completed' : 'Complete' }} Exit Form for 
                    <!-- Conditionally render router-link or plain text based on completion status -->
                    <router-link 
                        v-if="!isExitFormCompleted(registrationId)"
                        :to="{ name: 'exitForm', params: { registrationID: registrationId } }" 
                        class="text-blue-600 underline hover:text-blue-800"
                    >
                        {{ findExperienceName(registrationId) }}
                    </router-link>
                    <!-- Display the name from the registeredExperiences -->
                    <span v-else class="'text-green-800'">
                        {{ findExperienceName(registrationId) }}
                    </span>
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
        },
        hasGoalFormsToComplete() {
            const exitIds = Object.keys(this.exitFormCompletion);
            // Check if there's at least one goal setting form ID that is not in the exit form completion IDs
            return Object.keys(this.goalSettingFormCompletion).some(key => !exitIds.includes(key));
        },
        hasExitFormsToComplete() {
            return Object.keys(this.exitFormCompletion).length > 0;
        },
        areAllExitFormsCompleted() {
            return Object.keys(this.exitFormCompletion).every(key => this.exitFormCompletion[key]);
        },
        filteredGoalFormCompletion() {
            const exitIds = Object.keys(this.exitFormCompletion);
            return Object.keys(this.goalSettingFormCompletion).reduce((acc, key) => {
                if (!exitIds.includes(key)) {
                    acc[key] = this.goalSettingFormCompletion[key];
                }
                return acc;
            }, {});
        },
    },
    methods: {
        isGoalFormCompleted(registrationId) {
            return this.goalSettingFormCompletion[registrationId];
        },
        isExitFormCompleted(experienceId) {
            return this.exitFormCompletion && this.exitFormCompletion[experienceId];
        },
        findExperienceName(registrationId) {
            const experience = this.registeredExperiences.find(exp => exp._id === registrationId);
            return experience ? experience.experienceInstance.name : 'Unknown Experience';
        },
    }
}
</script>

<style>

</style>