<!--
  instructorAddActivity.vue
  
  Form component for instructors to create new activities. Provides a simple interface 
  with activity name input, cancel and submit functionality. Redirects to data management 
  page with success notification upon completion.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="add-activity-page">
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-clipboard-plus-outline</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('New Activity') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Create a new activity for your experiences') }}</p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="8">
          <v-card class="form-card" elevation="2">
            <v-form ref="form" @submit.prevent="handleSubmitForm">
              <!-- Section 1: Activity Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Activity Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Enter the basic details for your activity') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="activity.activityName"
                    :label="$t('Activity Name')"
                    :placeholder="$t('Enter a descriptive name for your activity')"
                    :rules="nameRules"
                    variant="outlined"
                    required
                    counter="100"
                  ></v-text-field>
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
                  color="#c8102e"
                  class="action-btn submit-btn"
                  :loading="submitting"
                  :disabled="!activity.activityName"
                >
                  <v-icon start size="18">mdi-check</v-icon>
                  {{ $t('Create Activity') }}
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
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "InstructorAddActivity",
  data() {
    return {
      // Activity object to hold form data
      activity: {
        activityName: ''
      },
      submitting: false,
      // Validation rules
      nameRules: [
        v => !!v || this.$t('Activity name is required'),
        v => (v && v.length >= 2) || this.$t('Activity name must be at least 2 characters'),
        v => (v && v.length <= 100) || this.$t('Activity name cannot exceed 100 characters')
      ]
    };
  },
 
  methods: {
    // Submits an activity to the backend and redirects to the data management view
    async handleSubmitForm() {
      // Validate form
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.submitting = true;
      try {
        const user = useLoggedInUserStore();
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/activities/`;

        const response = await axios.post(apiURL, this.activity);
        
        if (response.status === 201) {
          user.navigationData = {
            activeTab: 2,
            toastType: 'success',
            toastMessage: 'Activity added!',
            toastPosition: 'top-right',
            toastCSS: 'Toastify__toast--create'
          };
          this.$router.push({
            name: 'instructorDataManagement'
          });
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Page Background */
.add-activity-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

/* Main Form Card */
.form-card {
  border-radius: 12px;
  overflow: hidden;
}

/* Form Sections */
.form-section {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0;
}

.section-content {
  padding-left: 48px;
}

/* Form Actions */
.form-actions {
  display: flex;
  align-items: center;
  padding: 20px 32px;
  background-color: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.action-btn {
  min-width: 120px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.submit-btn {
  color: white !important;
}

/* Sidebar */
.sidebar-sticky {
  position: sticky;
  top: 24px;
}

.sidebar-card {
  border-radius: 12px;
  border-color: #e0e0e0;
}

.sidebar-header {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
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

@media (max-width: 960px) {
  .form-section {
    padding: 24px 20px;
  }
  
  .section-content {
    padding-left: 0;
    margin-top: 16px;
  }
  
  .form-actions {
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .form-actions .v-spacer {
    display: none;
  }
  
  .action-btn {
    flex: 1 1 auto;
  }
}
</style>