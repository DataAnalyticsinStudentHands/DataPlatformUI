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
      currentActivityId: null,
      exitFormsReleased: false,
      exitFormCompletion: {},
      registrationExists: false,
      registeredExperiences: [],
      orgName: "",
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

          // Check if the user is either an Instructor or a Student
          if (response.data.userRole === 'Instructor' || response.data.userRole === 'Student') {
            await this.getCurrentSemester();

            // Additional check for the Student role
            if (response.data.userRole === 'Student') {
              await this.fetchRegisteredExperiences();
            }
          }

          // Officially log the user in
          this.$patch({
            isLoggedIn: true,
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return {
            toast: true,
            message: 'Invalid email or password.',
            type: 'error',
          };
        } else {
            this.handleError(error);
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
        currentActivityId: null,
        exitFormsReleased: false,
        exitFormCompletion: {},
        registrationExists: false,
        registeredExperiences: [],
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
        this.handleError(error);
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
      // await this.getFullName();
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
            exitFormCompletion: response.data.exitFormCompletion,
          });
        }
      } catch (error) {
        this.handleError(error);
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
          const today = new Date(); // Define today's date
          const exitFormReleaseDate = new Date(response.data.exitFormReleaseDate); // Convert the exitFormReleaseDate to a Date object
    
          this.$patch({
            semesterName: response.data.semesterName,
            exitFormsReleased: exitFormReleaseDate <= today, // Compare exitFormReleaseDate with today
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },  
    async fetchRegisteredExperiences() {
      const token = localStorage.getItem("token");
      const url = `${apiURL}/studentSideData/registeredExperiences`;
  
      try {
        const response = await axios.get(url, { headers: { token } });
        if (response.data && response.data.experiences) {
          // Update the registeredExperiences state
          this.registeredExperiences = response.data.experiences;
          this.registrationExists = true;
        } else {
          this.registrationExists = false;
          this.registeredExperiences = [];
        }
      } catch (error) {
        this.handleError(error);
      }
    },  
    async registerExperiences(experienceIDs) {
      const token = localStorage.getItem('token');
      const method = this.registrationExists ? 'put' : 'post';
      const url = `${apiURL}/studentSideData/registerExperiences`;
  
      try {
        await axios({
          method,
          url,
          headers: { token },
          data: { experienceIDs },
        });
  
        // Update the store's state
        this.registrationExists = true;
        this.registeredExperiences = experienceIDs;
  
        // Additional logic if needed
        toast.success('Experiences Registered!', {
          position: 'top-right',
          toastClassName: 'Toastify__toast--create'
        });
  
        await this.checkFormCompletion();
        await this.fetchRegisteredExperiences();
      } catch (error) {
        // Handle error
        this.handleError(error);
      }
    },
    async handleError(error) {
      // console.log(error);
      toast.error("An unexpected error has occurred and has been logged for future improvement. Please try again later.", {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          limit: 1,
      });
    },
    setOrgName(name) {
      this.orgName = name;
    },
    persist: {
      storage: sessionStorage
    }
  },
});