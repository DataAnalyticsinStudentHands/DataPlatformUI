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
      selectedSessionsDetails: [],
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

            // Additional check for the Student role
            if (response.data.userRole === 'Student') {
              await this.checkFormCompletion();
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
      console.log('logout Pinia')
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
      console.log('checkFormCompletion hit');
      try {
        const response = await axios.get(`${apiURL}/studentSideData/student-checklist`, {
          headers: { token: this.token }
        });

        if (response && response.data) {
          this.$patch({
            hasCompletedEntryForm: response.data.entryFormCompleted,
            hasRegisteredExperiences: response.data.hasRegisteredExperiences
          });

          console.log('hasCompletedEntryForm: ', this.hasCompletedEntryForm);
          console.log('hasRegisteredExperiences: ', this.hasRegisteredExperiences);
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
    async fetchRegisteredExperiences() {
      const token = localStorage.getItem("token");
      const url = `${apiURL}/studentSideData/registered-experiences`;
    
      try {
        const response = await axios.get(url, { headers: { token } });
        if (response.data && response.data.length > 0) {
          // Directly assign the response data to registeredExperiences
          this.registeredExperiences = response.data;
          this.registrationExists = true;
        } else {
          this.registrationExists = false;
          this.registeredExperiences = [];
        }
      } catch (error) {
        this.handleError(error);
      }
    },     
    async updateRegisteredExperiences(selectedExperiences) {
      const token = this.token;
      const registerUrl = `${apiURL}/studentSideData/experience-instances/register`;
      const deregisterUrl = `${apiURL}/studentSideData/registered-experiences`;
    
      try {
        // Determine experiences to register and to deregister
        const experiencesToRegister = selectedExperiences.filter(se => 
          !this.registeredExperiences.some(re => re.experienceInstance.id === se._id));
        const experiencesToDeregister = this.registeredExperiences.filter(re => 
          !selectedExperiences.some(se => se._id === re.experienceInstance.id));
    
        // Register new experiences
        if (experiencesToRegister.length > 0) {
          console.log('registerUrl: ', registerUrl);
          await axios.post(registerUrl, {
            expInstanceIDs: experiencesToRegister.map(e => e._id)
          }, { headers: { token } });
        }
    
        // Deregister experiences
        if (experiencesToDeregister.length > 0) {
          console.log('deregisterUrl: ', deregisterUrl);
          await axios.delete(deregisterUrl, {
            headers: { token },
            data: { expRegistrationIDs: experiencesToDeregister.map(e => e._id) }
          });
        }
    
        // Fetch updated registered experiences
        await this.fetchRegisteredExperiences();
        toast.success('Experiences Registered!', {
          position: 'top-right',
          toastClassName: 'Toastify__toast--create'
        });
    
      } catch (error) {
        this.handleError(error);
      }
    },    
    async handleError(error) {
      console.log(error);
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
    },
    updateSelectedSessionsDetails(sessions) {
      this.selectedSessionsDetails = sessions;
    }
  },
});