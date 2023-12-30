<template>
<v-container>
    <v-row>
      <v-col>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab @click="selectTab(0)">Sessions</v-tab>
          <v-tab @click="selectTab(1)">Experiences</v-tab>
          <v-tab @click="selectTab(2)">Activities</v-tab>
        </v-tabs>
  
        <div v-if="tab === 0">
          <instructor-sessions />
        </div>
        <div v-if="tab === 1">
          <instructor-experiences />
        </div>
        <div v-if="tab === 2">
          <instructor-activities />
        </div>
      </v-col>
    </v-row>
</v-container>
</template>

<script>
import instructorActivities from './instructorActivities.vue';
import instructorExperiences from './instructorExperiences.vue';
import instructorSessions from './instructorSessions.vue';

export default {
    components: {
        instructorActivities,
        instructorExperiences,
        instructorSessions
    },
    data() {
        return {
        tab: 0,
        };
    },
    methods: {
        selectTab(index) {
        this.tab = index;
        }
    }
};
</script>
  