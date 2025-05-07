<template>
  <div v-if="loading" class="loading-container">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <div v-else>
  <main>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        {{$t('Welcome')}} {{ fullName }}
      </h1>
    <v-container fluid style="width: 90%; margin: 0 auto;">
      <v-row>
        <v-col cols="12" md="5" offset-md="1" class="align-start">

          <StudentChecklist />

        </v-col>
    
      <!-- Spacer between the checklists -->
      <v-col cols="12" md="1"></v-col>
      
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
    if (loggedInUserStore.navigationData?.toastType) {
        toast[loggedInUserStore.navigationData.toastType](this.$t(loggedInUserStore.navigationData.toastMessage), {
            position: loggedInUserStore.navigationData.toastPosition,
            toastClassName: loggedInUserStore.navigationData.toastCSS
        });

        loggedInUserStore.navigationData = null;
    }
    // Translations
    if (loggedInUserStore.languagePreference === "Spanish") {
      // Set to Spanish
      this.$i18n.locale = 'es';
    } else {
      // Default to English
      this.$i18n.locale = 'en';
    }
  },
  computed: {
    loading() {
      const store = useLoggedInUserStore();
      return store.loading;
    },
    hasCompletedEntryForm() {
      const store = useLoggedInUserStore();
      return store.hasCompletedEntryForm;
    },
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
.list-item-no-padding {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

.no-right-margin {
  margin-right: 0.5rem !important; /* Remove the right margin */
}

.light-green-bg {
  background-color: #e6f7e9; /* This is a very light green color. Adjust if needed */
}

.light-red-bg {
  background-color: #ffe6e6; /* This is a very light red color. Adjust if needed */
}

.light-grey-bg {
  background-color: #f5f5f5; /* Adjust the shade of grey if needed */
}

.unclickable {
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
}


</style>

