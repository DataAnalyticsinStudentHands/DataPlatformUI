<!--
updateUserData.vue - User Profile Update Component

This component provides a form interface for authenticated users to update their personal
information including first name, last name, email address, and language preference.
The form requires password confirmation for security and includes real-time validation.
After successful update, users are redirected to their appropriate dashboard with a
notification message in their preferred language.
-->

<template>
  <main>

    <!-- Container for user information update form with a subtitle that reassures the user -->
    <v-container style="width: 90%; margin: 0 auto;">
      <p class="font-weight-black text-h5 text--primary">User Information Update Form</p>
      <p class="text-subtitle-1">{{$t("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again.")}}</p>
    </v-container>

    <!-- Loading spinner to show while data is being fetched -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <!-- Form to update user details like name, email, language preference, and password -->
    <div v-else>
    <v-form @submit.prevent="handleSubmitForm">
      <v-container style="width: 90%; margin: 0 auto;">
        <!-- Input fields for first name, last name, and email -->
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="firstName" 
            :label="$t('New First Name')" 
            :rules="nameRules"
            :error-messages="firstNameError"
            :error="showErrors && firstNameError.length > 0"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="lastName" 
            :label="$t('New Last Name')" 
            :rules="nameRules"
            :error-messages="lastNameError"
            :error="showErrors && lastNameError.length > 0"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="email" 
            :label="$t('New Email')" 
            :rules="emailRules"
            :error-messages="emailError"
            :error="showErrors && emailError.length > 0"
          ></v-text-field>
        </v-col>

        <!-- Radio group for selecting language preference -->
        <v-col cols="12" md="6">
          <v-radio-group v-model="languagePreference" :label="$t('New Language Preference')" row>
            <v-radio :label="$t('English')" value="English" color="black"></v-radio>
            <v-radio :label="$t('Spanish')" value="Spanish" color="black"></v-radio>
          </v-radio-group>
        </v-col>

        <!-- Password confirmation field to finalize changes -->
        <v-col cols="12" md="6">
          <p>{{$t('Please enter your password to confirm your changes:')}}</p>
          <v-text-field 
            v-model="confirmPassword" 
            :label="$t('Password')" 
            type="password"
            :rules="passwordRules"
            :error-messages="passwordError"
            :error="showErrors && passwordError.length > 0"
          ></v-text-field>
        </v-col>

        <!-- Submit button to save changes -->
        <v-btn @click="handleSubmitForm">{{$t('Submit')}}</v-btn>
      </v-container>
    </v-form>
  </div>
  </main>
</template>


<script>
  import axios from "axios";
  import { useLoggedInUserStore } from "@/stored/loggedInUser";

  export default {
    data() {
      // Component state for form fields and validation rules
      return {
        userData: [],
        firstName: '',
        lastName: '',
        email: '',
        languagePreference: '',
        confirmPassword: '',
        showErrors: false,
        // Validation rules for form inputs
        emailRules: [
          v => !!v || this.$t('Email is required'),
          v => /.+@.+/.test(v) || this.$t('Email must be valid')
        ],
        passwordRules: [
          v => !!v || this.$t('Password is required'),
          v => v.length >= 8 || this.$t('Password must be at least 8 characters long')
        ],
        nameRules: [
          v => !!v || this.$t('This field is required')
        ],
      };
    },
    mounted() {
      // Fetch current user data and populate form fields
      const user = useLoggedInUserStore();
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/user/`;

      try {
        useLoggedInUserStore().startLoading();

        axios.get(apiURL)
          .then((resp) => {
            this.userData = resp.data.user;
            this.firstName = this.userData.firstName;
            this.lastName = this.userData.lastName;
            this.email = this.userData.email;
            this.languagePreference = this.userData.languagePreference;
          })
          .catch((error) => {
            this.handleError(error);
          })
          .finally(() => {
            useLoggedInUserStore().stopLoading();
          });

        window.scrollTo(0, 0);
      } catch (error) {
        this.handleError('Error:', error);
        useLoggedInUserStore().stopLoading();
      }
    },

    computed: {
      // Loading state from the store
      loading() {
        const store = useLoggedInUserStore();
        return store.loading;
      },
      // Email validation with internationalized error messages
      emailError() {
        if (!this.email) {
          return this.$t('Email is required');
        } else if (!/.+@.+/.test(this.email)) {
          return this.$t('Email must be valid');
        }
        return "";
      },
      // Password validation with internationalized error messages
      passwordError() {
        if (!this.confirmPassword) {
          return this.$t('Password is required');
        } else if (this.confirmPassword.length < 8) {
          return this.$t('Password must be at least 8 characters long');
        }
        return "";
      },
      // First name validation
      firstNameError() {
        if (!this.firstName) {
          return this.$t('First name is required');
        }
        return "";
      },
      // Last name validation
      lastNameError() {
        if (!this.lastName) {
          return this.$t('Last name is required');
        }
        return "";
      }
    },

    methods: {
      // Updates user information and navigates to appropriate dashboard with success notification
      async handleSubmitForm() {
        this.showErrors = true;

        const user = useLoggedInUserStore();
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/update-user-data`;

        // Validate form before submission
        if (!this.emailError && !this.passwordError && !this.firstNameError && !this.lastNameError) {
          try {
            await axios.put(apiURL, {
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email,
              languagePreference: this.languagePreference,
              password: this.confirmPassword,
            });

            // Update store with new user information
            user.firstName = this.firstName;
            user.lastName = this.lastName;
            user.languagePreference = this.languagePreference;
            user.setLanguagePreference(this.languagePreference);

            // Prepare success notification in user's preferred language
            let toastMessage = user.languagePreference === 'English' 
              ? 'User information updated!' 
              : '¡Información del Usuario actualizada!';

            user.navigationData = {
              toastType: 'info',
              toastMessage: toastMessage,
              toastPosition: 'top-right',
              toastCSS: 'Toastify__toast--update',
            };
            
            // Navigate to appropriate dashboard based on user role
            this.$router.push({ name: user.role === 'Student' ? 'studentDashboard' : 'instructorDash' });

          } catch (error) {
            this.handleError(error);
          }
        }
      }

    }
  }
</script>

<style scoped>
/* Centered loading spinner container */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>