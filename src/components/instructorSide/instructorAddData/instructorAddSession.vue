<!--
  instructorAddSession.vue
  
  Form component for instructors to create new sessions with name and date period validation.
  Features comprehensive form validation, error handling, and navigation to data management 
  page upon successful session creation with toast notifications.
  Redesigned UI matching the project pages aesthetic.
-->
<template>
  <main class="add-session-page">
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
          <v-icon color="#c8102e" size="32" class="mr-3">mdi-calendar-plus</v-icon>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ $t('New Session') }}</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Create a new session for your organization') }}</p>
          </div>
        </div>
      </div>

      <v-row>
        <!-- Main Form Column -->
        <v-col cols="12" lg="8">
          <v-card class="form-card" elevation="2">
            <v-form ref="form" @submit.prevent="handleSubmitForm">
              <!-- Section 1: Session Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">1</div>
                  <div>
                    <h2 class="section-title">{{ $t('Session Information') }}</h2>
                    <p class="section-subtitle">{{ $t('Enter the basic details for your session') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-text-field
                    v-model="session.sessionName"
                    :label="$t('Session Name')"
                    :placeholder="$t('Enter a descriptive name for your session')"
                    :rules="nameRules"
                    variant="outlined"
                    required
                    counter="100"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-calendar-text</v-icon>
                    </template>
                  </v-text-field>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Section 2: Session Period -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-number">2</div>
                  <div>
                    <h2 class="section-title">{{ $t('Session Period') }}</h2>
                    <p class="section-subtitle">{{ $t('Define the start and end dates for this session') }}</p>
                  </div>
                </div>

                <div class="section-content">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        type="date"
                        v-model="session.sessionPeriod.startDate"
                        :label="$t('Start Date')"
                        :rules="dateRules"
                        variant="outlined"
                        required
                      >
                        <template v-slot:prepend-inner>
                          <v-icon size="20" color="#666">mdi-calendar-start</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        type="date"
                        v-model="session.sessionPeriod.endDate"
                        :label="$t('End Date')"
                        :rules="dateRules"
                        variant="outlined"
                        required
                      >
                        <template v-slot:prepend-inner>
                          <v-icon size="20" color="#666">mdi-calendar-end</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <!-- Error Message Alert -->
                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    class="mt-2"
                    closable
                    @click:close="errorMessage = ''"
                  >
                    {{ errorMessage }}
                  </v-alert>
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
                  :disabled="!session.sessionName || !session.sessionPeriod.startDate || !session.sessionPeriod.endDate"
                >
                  <v-icon start size="18">mdi-check</v-icon>
                  {{ $t('Create Session') }}
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
import { toast } from 'vue3-toastify';

export default {
  name: 'instructorAddSession',
  data() {
    return {
      // Session object containing form data for name and date period
      session: {
        sessionName: "",
        sessionPeriod: {
          startDate: "",
          endDate: ""
        }
      },
      // Error message display for API response errors
      errorMessage: "",
      // Loading state for submit button
      submitting: false,
      // Validation rules for session name and date fields
      nameRules: [
        v => !!v || this.$t('Session name is required'),
        v => (v && v.length >= 2) || this.$t('Session name must be at least 2 characters'),
        v => (v && v.length <= 100) || this.$t('Session name cannot exceed 100 characters')
      ],
      dateRules: [v => !!v || this.$t('Date is required')],
    };
  },
  beforeMount() {
    // Scroll to top of view
    window.scrollTo(0, 0);
  },
  methods: {
    // Validates the form and, if valid, submits session data. On successful submission, navigates to the instructor data management view with a success toast message.
    async handleSubmitForm() {
      // Validate the form before submission
      const isValid = await this.$refs.form.validate();
      if (isValid.valid) {
        this.submitting = true;
        // Form is valid, submit the data
        const user = useLoggedInUserStore();
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/`;

        axios.post(apiURL, {
          sessionName: this.session.sessionName,
          sessionPeriod: this.session.sessionPeriod
        })
        .then(() => {
          user.navigationData = {
              activeTab: 0,
              toastType: 'success',
              toastMessage: 'Session added!',
              toastPosition: 'top-right',
              toastCSS: 'Toastify__toast--create'
          };
          this.$router.push({
            name: 'instructorDataManagement'
          });
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            this.errorMessage = error.response.data.error;
          } else {
            this.handleError(error);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
      } else {
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
        });
      }
    }
  }
}
</script>

<style scoped>
/* Page Background */
.add-session-page {
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

/* Responsive */
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