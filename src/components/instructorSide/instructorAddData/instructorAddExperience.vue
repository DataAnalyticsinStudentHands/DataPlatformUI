<!--'/instructorAddExperience' this view presents a form to create a new Experience-->
<template>
  <main>
    <!-- Form for creating a new experience -->
    <v-form @submit.prevent="handleSubmitForm">

      <v-container>
        <!-- Page title -->
        <p class="font-weight-black text-h6">New Experience</p>

        <v-row>
          <v-col cols="12" md="6">
            <!-- Input for the experience category -->
            <v-text-field v-model="experience.experienceCategory" label="Experience Category" :readonly="isReadOnly"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <!-- Input for the experience name -->
            <v-text-field v-model="experience.experienceName" label="Experience Name"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <!-- Cancel button to go back to the previous page -->
            <v-btn @click="$router.back()">
              Cancel
            </v-btn>
            <!-- Submit button for the form -->
            <v-btn style="text-align: center; margin-left: 10px;" @click="handleSubmitForm">Submit</v-btn>
          </v-col>
        </v-row>

      </v-container>

    </v-form>
  </main>
</template>

<script>
import { computed } from 'vue';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  setup() {
    // Access the logged-in user's store
    const userStore = useLoggedInUserStore();

    // Computed property to determine if the form should be read-only
    // Only users with roles 'Global Admin', 'Org Admin', or 'Instructor' can edit
    const isReadOnly = computed(() => {
      const allowedRoles = ['Global Admin', 'Org Admin', 'Instructor'];
      return !allowedRoles.includes(userStore.role);
    });
    return {
      userStore,
      isReadOnly
    };
  },
  data() {
    return {
      experience: {
        experienceCategory: '',
        experienceName: '',
      },
      activities: [],
      originalActivities: [],
      activityHeaders: [
        {
          title: "Activity Name",
          value: "activityName",
          key: "activityName",
          align: "start",
          sortable: true
        }
      ],
      selectedActivities: [],
      activitySearch: "",
      hoveredItem: null,
    };
  },
  beforeMount() {
  // Scroll the window to the top
    window.scrollTo(0, 0);

    // Get the logged-in user from the store
    const user = useLoggedInUserStore();

    // If the user has the 'Group Admin' role, set the experience category to the user's group
    if (user.role === 'Group Admin') {
      this.experience.experienceCategory = user.group;
      console.log('this.experiencecat: ', this.experience.experienceCategory)
    }

    // Fetch additional activity data before the component is mounted
    this.fetchActivityData();
  },
  methods: {

    // Retrieves active activities from the backend, filtering them based on their status, and stores them for display.
    fetchActivityData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const activities = resp.data;
          this.activities = activities.filter((activity) => activity.activityStatus === true);
          this.originalActivities = [...this.activities];
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    // Submits a new experience along with selected activities to the backend and navigates to the data management view with a success toast message indicating the experience has been added.
    handleSubmitForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
      axios
        .post(apiURL, {
          experienceCategory: this.experience.experienceCategory,
          experienceName: this.experience.experienceName,
          activities: this.selectedActivities.map(activity => activity._id),
        }, {
          headers: { token },
        })
        .then(() => {
          user.navigationData = {
            activeTab: 1,
            toastType: 'success',
            toastMessage: 'Experience added!',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
          };

          this.$router.push({ 
              name: 'instructorDataManagement'
          });
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    // Adds a selected activity to the selectedActivities array for inclusion in an experience, and removes it from the available activities list to prevent duplicate selection.
    selectActivity(activity) {
      // Add to selectedActivities
      this.selectedActivities.push(activity);

      // Remove from the activities list
      this.activities = this.activities.filter(a => a._id !== activity._id);
    },

    // Removes an activity from the selectedActivities list and reinserts it back into the original activities list at its initial position, if it isn't already present, maintaining the initial order of activities.
    removeSelectedActivity(activity) {
      // Remove from selectedActivities
      this.selectedActivities = this.selectedActivities.filter(a => a._id !== activity._id);

      // Find original index in the originalActivities array
      const originalIndex = this.originalActivities.findIndex(a => a._id === activity._id);

      // Check if the activity is already in the activities list
      const alreadyPresent = this.activities.some(a => a._id === activity._id);

      // Re-insert at the original position if not present
      if (!alreadyPresent && originalIndex !== -1) {
        this.activities.splice(originalIndex, 0, activity);
      }
    },
  },
};
</script>

<style scoped>
#contentNavbar .nav-link.router-link-exact-active {
  background-color: #eee;
}

/* Medium Devices, Desktops */
@media only screen and (min-width: 992px) {
  #contentNavbar .nav-item {
    border: 3px solid black;
    border-right: none;
  }

  #contentNavbar .nav-item:last-child {
    border: 1px solid black;
  }
}

.pointer-cursor {
    cursor: pointer;
}

.activity-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.mdi-close {
  cursor: pointer;
}

.scrollable-table {
    height: 300px; /* Adjust the height as needed */
    overflow-y: auto;
  }

  /* Optional: Style to improve the appearance when scrolling */
  .scrollable-table::-webkit-scrollbar {
    width: 10px;
  }

  .scrollable-table::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .scrollable-table::-webkit-scrollbar-thumb {
    background: #888;
  }

  .scrollable-table::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .scrollable-list {
    height: 370px; /* Adjust the height as needed */
    overflow-y: auto;
  }

  /* Optional: Style to improve the appearance when scrolling */
  .scrollable-list::-webkit-scrollbar {
    width: 10px;
  }

  .scrollable-list::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .scrollable-list::-webkit-scrollbar-thumb {
    background: #888;
  }

  .scrollable-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }


</style>
