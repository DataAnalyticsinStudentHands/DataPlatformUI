<!-- instructorDataManagementMain - this is the parent container for Instructor Data Management. It renders child components:
  instructorActivities
  instructorExperiences
  instructorSessions
-->
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
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

import instructorActivities from './instructorActivities.vue';
import instructorExperiences from './instructorExperiences.vue';
import instructorSessions from './instructorSessions.vue';

export default {
    components: {
        instructorActivities,
        instructorExperiences,
        instructorSessions,
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

      // Initializes the component by checking if there's an activeTab in Pinia's navigationData. If found, updates the component's tab state and also updates the store with the active tab. If not found, loads the tab from the store. Additionally, handles toast messages based on navigationData, displaying them accordingly.
      initializeComponent() {
        const store = useLoggedInUserStore();

        // Check if there's an activeTab in Pinia's navigationData
        if (store.navigationData?.activeTab !== undefined) {
          // If there is, use it and update the store
          this.tab = parseInt(store.navigationData.activeTab);
          store.instructorDataManagementActiveTab = this.tab;
        } else {
          // If not, load the tab from the store
          this.tab = store.instructorDataManagementActiveTab;
        }

        // Handle toast messages from Pinia's navigationData
        if (store.navigationData?.toastType) {
          toast[store.navigationData.toastType](store.navigationData.toastMessage, { 
            position: store.navigationData.toastPosition,
            toastClassName: store.navigationData.toastCSS,
            limit: 1,
          });
        }
      },

      // Updates the selected tab to the specified index and also updates the active tab in the store accordingly.
      selectTab(index) {
        this.tab = index;
        const store = useLoggedInUserStore();
        store.instructorDataManagementActiveTab  = index;
      },

      // Loads the active tab from the store, or defaults to index 0 if no active tab is set in the store.
      loadActiveTab() {
        const store = useLoggedInUserStore();
        this.tab = store.instructorDataManagementActiveTab !== undefined ? store.instructorDataManagementActiveTab : 0;
      },
    }
};
</script>
