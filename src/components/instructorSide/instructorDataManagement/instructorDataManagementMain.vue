<template>
<v-container>
    <v-row>
      <v-col>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab @click="selectTab(0)">Experience Slots</v-tab>
          <v-tab @click="selectTab(1)">Sessions</v-tab>
          <v-tab @click="selectTab(2)">Experiences</v-tab>
          <v-tab @click="selectTab(3)">Activities</v-tab>
        </v-tabs>
  
        <div v-if="tab === 0">
          <instructor-experience-instances />
        </div>
        <div v-if="tab === 1">
          <instructor-sessions />
        </div>
        <div v-if="tab === 2">
          <instructor-experiences />
        </div>
        <div v-if="tab === 3">
          <instructor-activities />
        </div>
      </v-col>
    </v-row>
</v-container>
</template>

<script>
import { toast } from 'vue3-toastify';
import instructorActivities from './instructorActivities.vue';
import instructorExperienceInstances from './instructorExperienceInstances.vue';
import instructorExperiences from '@/components/instructorSide/instructorExperiences.vue';
import instructorSessions from './instructorSessions.vue';

export default {
    components: {
        instructorActivities,
        instructorExperiences,
        instructorSessions,
        instructorExperienceInstances
    },
    data() {
        return {
            tab: 0,
        };
    },
    watch: {
      '$route': function() {
        this.initializeComponent();
      }
    },
    mounted() {
      this.initializeComponent();
    },
    methods: {
        initializeComponent() {
          // Handling route parameters
          if (this.$route.params.activeTab) {
            this.tab = parseInt(this.$route.params.activeTab);
          };
          // Handling toast messages
          if (this.$route.params.toastType) {
            toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
              position: this.$route.params.toastPosition,
              toastClassName: this.$route.params.toastCSS,
              limit: 1,
            });
          }
        },
        selectTab(index) {
          this.tab = index;
        }
    }
};
</script>
