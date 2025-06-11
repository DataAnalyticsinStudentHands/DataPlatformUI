<!--
src/components/studentSide/studentDash/studentDashboard.vue
Main dashboard component for students that displays welcome message, checklist, and experience registration.
Handles loading states, toast notifications, and language preferences.
-->

<template>
  <!-- Loading spinner display -->
  <div v-if="loading" class="loading-container">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <div v-else>
  <main>
      <!-- Welcome header with student name -->
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        {{$t('Welcome')}} {{ fullName }}
      </h1>
    <v-container fluid style="width: 90%; margin: 0 auto;">
      <v-row>
        <!-- Student checklist column -->
        <v-col cols="12" md="5" offset-md="1" class="align-start">
          <StudentChecklist />
        </v-col>
   
      <!-- Spacer between the checklists -->
      <v-col cols="12" md="1"></v-col>
     
      <!-- Experience registration column (only shown after entry form completion) -->
      <v-col v-if="hasCompletedEntryForm" cols="12" md="5" class="align-start">
      <StudentExperienceRegistration />
      </v-col>
    </v-row>
  </v-container>
</main>
</div>
</template>

<script>
import StudentChecklist from './studentChecklist.vue';
import StudentExperienceRegistration from './studentExpReg.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  components: {
    StudentChecklist,
    StudentExperienceRegistration
  },
  data() {
    return {
    };
  },
  async mounted() {
    const loggedInUserStore = useLoggedInUserStore();
    
    // Display toast notification if navigation data contains one
    if (loggedInUserStore.navigationData?.toastType) {
        toast[loggedInUserStore.navigationData.toastType](this.$t(loggedInUserStore.navigationData.toastMessage), {
            position: loggedInUserStore.navigationData.toastPosition,
            toastClassName: loggedInUserStore.navigationData.toastCSS
        });
        loggedInUserStore.navigationData = null;
    }
    
    // Set language preference based on user settings
    if (loggedInUserStore.languagePreference === "Spanish") {
      this.$i18n.locale = 'es';
    } else {
      this.$i18n.locale = 'en';
    }
  },
  computed: {
    // Loading state from store
    loading() {
      const store = useLoggedInUserStore();
      return store.loading;
    },
    // Entry form completion status
    hasCompletedEntryForm() {
      const store = useLoggedInUserStore();
      return store.hasCompletedEntryForm;
    },
    // Combined first and last name for display
    fullName() {
      const store = useLoggedInUserStore();
      return (store.firstName.trim() + ' ' + store.lastName.trim());
    },
  },
  methods: {
  },
};
</script>

<style>
/* Custom styling for list items and backgrounds */
.list-item-no-padding {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}
.no-right-margin {
  margin-right: 0.5rem !important;
}
.light-green-bg {
  background-color: #e6f7e9;
}
.light-red-bg {
  background-color: #ffe6e6;
}
.light-grey-bg {
  background-color: #f5f5f5;
}
.unclickable {
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
}
</style>