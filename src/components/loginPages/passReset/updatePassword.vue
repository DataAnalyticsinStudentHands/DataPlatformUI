<!-- /updatePasswordForm -->
<template>
  <main>
    <v-container style="width: 90%; margin: 0 auto;">
      <p class="font-weight-black text-h5 text--primary">User Password Update Form</p>
      <p class="text-subtitle-1">{{$t("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again.")}}</p>
    </v-container>
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <v-form @submit.prevent="activateAccount">
        <v-container style="width: 90%; margin: 0 auto;">
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="code" :label="$t('Current Password')" 
              type="password"
              name="secretToken"
              id="secretToken"
              placeholder="••••••••"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="newPassword" :label="$t('New Password')"
              type="password"
              name="secretToken"
              id="secretToken"
              placeholder="••••••••"
              outlined
              dense
            ></v-text-field>
            <v-alert
              v-if="v$.newPassword.$error"
              type="error"
              dense
            >
              <div v-for="error of v$.newPassword.$errors" :key="error.$uid">
                {{ error.$message }}!
              </div>
            </v-alert>
          </v-col>          
          <v-col cols="12" md="6">
              <v-text-field v-model="confirmNewPassword" :label="$t('Confirm New Password')"
                type="password"
                name="secretToken"
                id="secretToken"
                placeholder="••••••••"
                outlined
                dense
              ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-alert
              v-if="error"
              type="warning"
              border="left"
              colored-border
              elevation="2"
              dense
            >
              {{ error }}
            </v-alert>
          </v-col>
            <v-col cols="12" md="6">
              <v-alert
                v-if="success"
                type="success"
                border="left"
                colored-border
                elevation="2"
                dense
              >
                {{ success }}
              </v-alert>
          </v-col>
          <v-btn
            @click="activateAccount"            
          >
            {{$t('Reset Password')}}
          </v-btn>
        </v-container>
      </v-form>
    </div>
  </main>  
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "VerifyAccount",
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
  },
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
    this.queryData = [];
    axios
      .get(apiURL, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(
        (resp) => {
          this.queryData = resp.data;
        },
        (err) => {
          if (err) {
            this.$router.push("/login");
          }
        }
      );
    window.scrollTo(0, 0);
  },
  data() {
    return {
      isConfirmPasswordValid: false,
      code: "",
      newPassword: "",
      confirmNewPassword: "",
      error: "",
      success: "",
      loginLink: "",
      toggle: "hide",
    };
  },
  methods: {
    
    // Validates that the new password and its confirmation match. Updates the validation state and sets an error message if they do not align.
    checkConfirmPassword() {
      this.isConfirmPasswordValid = true;
      if (this.newPassword !== this.confirmNewPassword) {
        this.error = "Passwords do not match.";
        this.isConfirmPasswordValid = false;
      }
    },

    // Validates form and password confirmation before requesting a password reset for logged-in users using a verification code. On success, navigates to the appropriate dashboard with a success message.
    async activateAccount() {
      const isFormCorrect = await this.v$.$validate();
      this.checkConfirmPassword();
      if (isFormCorrect && this.isConfirmPasswordValid) {
        const store = useLoggedInUserStore();
        let user = {
          code: this.code,
          newPassword: this.newPassword,
          error: this.error,
        };
        let apiURL =
          import.meta.env.VITE_ROOT_API + `/userdata/password-reset/logged-in`;
        axios
          .put(apiURL, user, {
            headers: { token: store.token },
          })
          .then(
            (res) => {
              if (res.status == 200) {
                //populating the success variables
                this.success = res.data.error;
                this.loginLink = " Login";
                this.error = "";
                // Show the success message and navigate to the dashboard
                if (store.role === 'Student') {
                  this.$router.push({ 
                    name: 'studentDashboard',
                    params: {
                      toastType: 'success',
                      toastMessage: 'Password successfully reset!',
                      toastPosition: 'top-right',
                      toastCSS: 'Toastify__toast--create'
                    }
                  });
                } else if (store.role === 'Instructor') {
                  this.$router.push({ 
                    name: 'instructorDash',
                    params: {
                      toastType: 'success',
                      toastMessage: 'Password successfully reset!',
                      toastPosition: 'top-right',
                      toastCSS: 'Toastify__toast--create'
                    }
                  });
                }

              }
            },
            (err) => {
              this.error = err.response.data.error;
              this.success = "";
              toast.error('An error occurred. Please try again later.', {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete'
              });
            }
          );
      }
    },
  },
  validations() {
    return {
      newPassword: {
        required,
        minLengthValue: minLength(8),
      },
    };
  },
};
</script>
