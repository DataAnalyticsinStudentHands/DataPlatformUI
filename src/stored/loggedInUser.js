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
      semesterName: "",
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
          this.setTokenHeader(response.data.token);

          let token = localStorage.getItem("token");

        // If userStatus is 'Pending', update unverified and token fields
        if (response.data.userStatus === 'Pending') {
          this.$patch({
            isLoggedIn: false,
            unverified: true,
            token: response.data.token
          });
          return;
        }

        await this.getFullName();

        await this.getCurrentSemester();
        
        
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return {
            toast: true,
            message: 'Invalid email or password.',
            type: 'error',
          };
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
      this.removeTokenHeader();
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
        role: userRole,
        userId: userID,
        token: token,
        languagePreference: languagePreference
      });

      // Save the new token to localStorage
      localStorage.setItem("token", token);

      // Set the global default header for axios
      this.setTokenHeader(token);

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
    },
    async verifyFromRegistration() {

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
    setTokenHeader(token) {
      if (token) {
        axios.defaults.headers.common['token'] = token;
        this.token = token;
      }
    },
    removeTokenHeader() {
        delete axios.defaults.headers.common['token'];
        this.token = "";
    },   
    startLoading() {
      this.loading = true;
    },
    stopLoading() {
      this.loading = false;
    },
    async getCurrentSemester() {
      try {
        const response = await axios.get(`${apiURL}/studentSideData/goalForms/semester`, {
          headers: { token: this.token }
        });
        
        if (response && response.data) {
          this.$patch({
            semesterName: response.data.semesterName
          });
        }
      } catch (error) {
          console.log(error)
      }
    },
    persist: {
      storage: sessionStorage
    }
  },
});