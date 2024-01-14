<template>
<v-container>
    <v-row>
      <v-col>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab @click="selectTab(0)">Experience Instances</v-tab>
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
import { useLoggedInUserStore } from "@/stored/loggedInUser";

import instructorActivities from './instructorActivities.vue';
import instructorExperienceInstances from './instructorExperienceInstances.vue';
import instructorExperiences from './instructorExperiences.vue';
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
      this.loadActiveTab();
    },
    methods: {
      initializeComponent() {
        const store = useLoggedInUserStore();

        // Check if there's an activeTab parameter in the route
        if (this.$route.params.activeTab !== undefined) {
          // If there is, use it and update the store
          this.tab = parseInt(this.$route.params.activeTab);
          store.instructorDataManagementActiveTab = this.tab;
        } else {
          // If not, load the tab from the store
          this.tab = store.instructorDataManagementActiveTab;
        }

        // Handle toast messages
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
          const store = useLoggedInUserStore();
          store.instructorDataManagementActiveTab  = index;
        },
        loadActiveTab() {
          const store = useLoggedInUserStore();
          this.tab = store.instructorDataManagementActiveTab !== undefined ? store.instructorDataManagementActiveTab : 0;
          console.log('tab: ', this.tab);
        },
    }
};
</script>
