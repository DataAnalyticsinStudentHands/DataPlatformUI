<!--
  instructorAddExperience.vue
  
  Form component for instructors to create new experiences with associated activities. Provides role-based 
  access control, activity selection functionality, and handles experience category assignment based on user roles.
  Supports activity management through selection and removal with proper state maintenance.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="add-experience-page">
    <v-container class="py-8">
      <!-- Page Header -->
      <div class="page-header mb-6">
        <div class="d-flex align-center mb-2">
          <v-btn 
            icon 
            variant="text" 
            size="small" 
            @click="$router.back()"
            class="mr-2"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-icon color="brand-fg" size="32" class="mr-3">mdi-school-plus-outline</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('New Experience') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Create a new experience for your sessions') }}</p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="8">
          <v-card class="form-card" elevation="2">
            <v-form ref="form" @submit.prevent="handleSubmitForm">
              <!-- Section 1: Experience Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Experience Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Enter the basic details for your experience') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="experience.experienceCategory"
                    :label="$t('Experience Category')"
                    :placeholder="$t('Enter the category for this experience')"
                    :rules="categoryRules"
                    :readonly="isReadOnly"
                    variant="outlined"
                    required
                    counter="100"
                    class="mb-4"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" class="text-medium-emphasis">mdi-shape-outline</v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="experience.experienceName"
                    :label="$t('Experience Name')"
                    :placeholder="$t('Enter a descriptive name for your experience')"
                    :rules="nameRules"
                    variant="outlined"
                    required
                    counter="100"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" class="text-medium-emphasis">mdi-school-outline</v-icon>
                    </template>
                  </v-text-field>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <v-btn 
                  variant="outlined"
                  size="large"
                  @click="$router.back()"
                  class="action-btn"
                >
                  {{ $t('Cancel') }}
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn 
                  type="submit"
                  size="large"
                  color="primary"
                  class="action-btn submit-btn"
                  :loading="submitting"
                  :disabled="!experience.experienceCategory || !experience.experienceName"
                >
                  <v-icon start size="18">mdi-check</v-icon>
                  {{ $t('Create Experience') }}
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script>
import { computed } from 'vue';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "InstructorAddExperience",
  setup() {
    const userStore = useLoggedInUserStore();

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
      submitting: false,
      categoryRules: [
        v => !!v || this.$t('Experience category is required'),
        v => (v && v.length >= 2) || this.$t('Category must be at least 2 characters'),
        v => (v && v.length <= 100) || this.$t('Category cannot exceed 100 characters')
      ],
      nameRules: [
        v => !!v || this.$t('Experience name is required'),
        v => (v && v.length >= 2) || this.$t('Name must be at least 2 characters'),
        v => (v && v.length <= 100) || this.$t('Name cannot exceed 100 characters')
      ]
    };
  },
  beforeMount() {
    window.scrollTo(0, 0);

    const user = useLoggedInUserStore();

    if (user.role === 'Group Admin') {
      this.experience.experienceCategory = user.group;
    }

    this.fetchActivityData();
  },
  methods: {
    fetchActivityData() {
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      axios
        .get(apiURL)
        .then((resp) => {
          const activities = resp.data;
          this.activities = activities.filter((activity) => activity.activityStatus === true);
          this.originalActivities = [...this.activities];
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    async handleSubmitForm() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.submitting = true;
      const user = useLoggedInUserStore();
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
      axios
        .post(apiURL, {
          experienceCategory: this.experience.experienceCategory,
          experienceName: this.experience.experienceName,
          activities: this.selectedActivities.map(activity => activity._id),
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
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    selectActivity(activity) {
      this.selectedActivities.push(activity);
      this.activities = this.activities.filter(a => a._id !== activity._id);
    },

    removeSelectedActivity(activity) {
      this.selectedActivities = this.selectedActivities.filter(a => a._id !== activity._id);
      const originalIndex = this.originalActivities.findIndex(a => a._id === activity._id);
      const alreadyPresent = this.activities.some(a => a._id === activity._id);

      if (!alreadyPresent && originalIndex !== -1) {
        this.activities.splice(originalIndex, 0, activity);
      }
    },
  },
};
</script>

<!-- Shared add/edit form layout (.page-header, .form-card, .form-section, .section-*, .form-actions,
     .action-btn, .submit-btn and their 960px overrides); keep this block before the local one -->
<style scoped src="@/styles/instructor-add-edit-form.css"></style>

<style scoped>
/* Page Background */
.add-experience-page {
  background-color: rgb(var(--v-theme-page-bg));
  min-height: 100vh;
}

/* Sidebar */
.sidebar-sticky {
  position: sticky;
  top: 24px;
}

.sidebar-card {
  border-radius: 12px;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

.sidebar-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.tip-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid rgb(var(--v-theme-divider-faint));
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-item .v-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

/* Responsive */
@media (max-width: 1280px) {
  .sidebar-sticky {
    position: static;
  }
}
</style>