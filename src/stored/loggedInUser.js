import { defineStore } from 'pinia'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Defining a store
export const useLoggedInUserStore = defineStore({
  id: 'loggedInUser',
  state: () => {
    return {
      userId: "",
      role: "",
      token: "",
      firstName: "",
      lastName: "",
      isLoggedIn: false,
      unverified: null,
      languagePreference: "",
      hasCompletedEntryForm: false,
      hasRegisteredExperiences: false,
      goalSettingFormCompletion: {},
      loading: false,
    }
  },
  getters: { //getting the roles
    getRole() {
      return this.role
    }
  },
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post(`${apiURL}/userdata/login`, {email, password});
        if (response) {
          this.$patch({
            isLoggedIn: true,
            role: response.data.userRole,
            userId: response.data.userID,
            token: response.data.token,
            languagePreference: response.data.languagePreference
          });

          // Save the token to localStorage
          localStorage.setItem("token", response.data.token);
            
          // Set the global default header for axios
          axios.defaults.headers.common['token'] = response.data.token;

          let token = localStorage.getItem("token");

        // If userStatus is 'Pending', update unverified and token fields
        if (response.data.userStatus === 'Pending') {
          console.log('pending fetched');
          this.$patch({
            unverified: true,
            token: response.data.token
          });
          return;
        }

        await this.getFullName();
          
          if (this.role === 'Instructor') {
            this.$router.push("/instructorDash");
          } else if (this.role === 'Student') {
            // After successful login, check if the student has completed forms
            await this.checkFormCompletion();
            if (this.hasCompletedEntryForm) {
              this.$router.push("/studentDashboard");
            } else {
              this.$router.push("/studentEntryForm");
            }
          } else {
            this.$router.push("/");
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
            const message = "Invalid email or password."
            toast.error(message, {
              position: 'top-right',
              toastClassName: 'Toastify__toast--delete',
              limit: 2,
              multiple: false
            });
        } else {
            console.log(error);
        }
      }
    },
    logout(reset = false) {
      // Reset value after user log out
      this.$patch({
        userId: "",
        role: "",
        token: "",
        firstName: "",
        lastName: "",
        isLoggedIn: false,
        unverified: null,
        languagePreference: "",
        hasCompletedEntryForm: false,
        hasRegisteredExperiences: false,
        goalSettingFormCompletion: {},
        loading: false,
      });

      // Clear the token from localStorage
      localStorage.removeItem("token");

      // Remove the global default header for axios
      delete axios.defaults.headers.common['token'];
    },    
    async getFullName() {
      let token = localStorage.getItem("token");
      let url = import.meta.env.VITE_ROOT_API + `/userdata/user`;

      try {
        let fullName = await axios.get(url, { headers: { token } });
        if (fullName) {
          this.$patch({
            firstName: fullName.data.user.firstName,
            lastName: fullName.data.user.lastName
          })
        }
      } catch (error) {
        console.log(error);
    }
    },
    async verifyExistingAcc(responseData) {
      // Extract the required details from the responseData
      const { token, userID, userRole, languagePreference } = responseData;

      // Update the Pinia store with the extracted details
      this.$patch({
        isLoggedIn: true,
        role: userRole,
        userId: userID,
        token: token,
        languagePreference: languagePreference
      });

      // Save the new token to localStorage
      localStorage.setItem("token", token);

      // Set the global default header for axios
      axios.defaults.headers.common['token'] = token;

      // If the status of the user is 'Pending', update the unverified field
      if (responseData.userStatus === 'Pending') {
        this.$patch({
          unverified: true,
          token: token
        });
        return; // Return from the method since the account is still pending
      }

      // Fetch the full name of the user
      await this.getFullName();

      // Navigate to the appropriate dashboard based on the user's role
      if (this.role === 'Instructor') {
        this.$router.push("/instructorDash");
      } else if (this.role === 'Student') {
        // After successful verification, check if the student has completed forms
        await this.checkFormCompletion();
        if (this.hasCompletedEntryForm) {
          this.$router.push("/studentDashboard");
        } else {
          this.$router.push("/studentEntryForm");
        }
      } else {
        this.$router.push("/");
      }
    },

    setLanguagePreference(langPref) {
      this.languagePreference = langPref;
    },
    async checkFormCompletion() {
      try {
        const response = await axios.get(`${apiURL}/studentSideData/studentChecklist`, {
          headers: { token: this.token }
        });
        if (response && response.data) {
          console.log('response.data: ', response.data);
          this.$patch({
            hasCompletedEntryForm: response.data.hasCompletedEntryForm,
            hasRegisteredExperiences: response.data.hasRegisteredExperiences,
            goalSettingFormCompletion: response.data.goalSettingFormCompletion,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    startLoading() {
      this.loading = true;
    },
    stopLoading() {
      this.loading = false;
    },
    persist: {
      storage: sessionStorage
    }
  },
});