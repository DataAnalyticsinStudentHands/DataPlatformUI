import { defineStore } from 'pinia'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API

// Defining a store
export const useLoggedInUserStore = defineStore({
  id: 'loggedInUser',
  state: () => {
    return {
      userId: "",
      role: "",
      token: "",
      isLoggedIn: false,
      firstTimeLoginTF: false,
      languagePreference: "",
      hasCompletedEntryForm: false,
      hasRegisteredExperiences: false,
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
          
          if (this.role === 'Instructor') {
            this.$router.push("/instructorDash");
          } else if (this.role === 'Student') {
            this.$router.push("/studentDashboard");
          } else {
            this.$router.push("/");
          }
        }
      } catch (error) {
        console.log(error)
        alert("Invalid credentials. - Please try again.");
      }
    },
    logout(reset = false) {
      // Reset value after user log out
      this.$patch({
        userId: "",
        role: "",
        token: "",
        isLoggedIn: false
      });

      // Clear the token from localStorage
      localStorage.removeItem("token");

      // Remove the global default header for axios
      delete axios.defaults.headers.common['token'];
    
      let logoutMessage = "";
      if (reset) {
        logoutMessage = "Password Reset! Please login.";
      } else {
        let logoutMessages = [
          'See you soon!',
          'Logged out successfully!',
          'Goodbye for now!',
          'See you next time!',
          "You're safely logged out!",
          'Hope to see you soon!',
          'Session ended. Take care!',
          'Stay safe! See you again!',
          'Successfully signed out!',
          "You've logged out. Goodbye!",
          'Come back soon!'
        ];
        logoutMessage = logoutMessages[Math.floor(Math.random() * logoutMessages.length)];
      }
    
      this.$router.push({
        name: 'Login',
        params: {
          toastType: 'success',
          toastMessage: logoutMessage,
          toastPosition: 'top-right',
          toastCSS: 'Toastify__toast--create'
      },
      });
      //location.reload(); attempt on trying to remove navigation bar when logging out
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
            hasRegisteredExperiences: response.data.hasRegisteredExperiences
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    persist: {
      storage: sessionStorage
    }
  },
});