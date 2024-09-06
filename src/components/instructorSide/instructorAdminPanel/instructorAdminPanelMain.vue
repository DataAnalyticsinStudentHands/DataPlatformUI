<script>
  import useVuelidate from "@vuelidate/core";
  //import { minLength, required } from "@vuelidate/validators";
  import axios from "axios";
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  
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
            email: "", // Holds user email input
            selectedRole: null, // Holds the selected role from dropdown
            roles: ["Org Admin", "Group Admin", "Group Instructor"], // Available role options
            error: "", // Error message if API fails
            success: "" // Success message after API call
        };
      /*return {
        isConfirmPasswordValid: false,
        code: "",
        newPassword: "",
        confirmNewPassword: "",
        error: "",
        success: "",
        loginLink: "",
        toggle: "hide",
      };*/
    },
    methods: { 

      // Validates form and password confirmation before requesting a password reset for logged-in users using a verification code. On success, navigates to the appropriate dashboard with a success message.
      async submitForm() {
        const isFormCorrect = await this.v$.$validate();
        if (isFormCorrect) {
            const store = useLoggedInUserStore();
            if (!this.email || !this.selectedRole) {
                this.error = "Please fill in all fields.";
                return;
            }
            // Reset any previous messages
            this.error = "";
            this.success = "";

            // Prepare data for API request
            const userData = {
                email: this.email,
                role: this.selectedRole
            };
            let apiURL =  import.meta.env.VITE_ROOT_API + `/instructorSideData/elevateuser`;
          axios
            .put(apiURL, userData, {
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
    
  };
</script>





<!-- /elevateUserForm -->
<template>
    <main>      
      <div v-if="loading" class="loading-container">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else>
        <v-form @submit.prevent="submitForm">
            <v-container style="width: 90%; margin: 0 auto;">
                <v-col cols="12" md="6">
                    <v-col-title class="font-weight-black text-h5">Elevate User Role</v-col-title>

                    <!-- Email Input -->
                    <v-text-field
                        v-model="email"
                        label="User Email"
                        type="email"
                        required
                        outlined
                        dense
                    ></v-text-field>
                    
                    <!-- Role Dropdown -->
                    <v-select
                        v-model="selectedRole"
                        :items="roles"
                        label="Select Role"
                        required
                        outlined
                        dense
                    ></v-select>

                    <!-- Submit Button -->
                    <v-btn @click="submitForm">
                        Submit
                    </v-btn>                    
                </v-col>

                <!-- Success or Error Alerts -->
                <v-alert 
                    v-if="error" 
                    type="warning" 
                    dense
                    border="left"
                    colored-border
                    elevation="2"
                >{{ error }}</v-alert>
                <v-alert 
                    v-if="success" 
                    type="success" 
                    dense                
                    border="left"
                    colored-border
                    elevation="2"                
                >{{ success }}</v-alert>
            </v-container> 
        </v-form>              
      </div>
    </main>  
</template>
  
