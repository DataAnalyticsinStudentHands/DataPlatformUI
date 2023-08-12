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
      firstTimeLoginTF: false
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
            token: response.data.token
          });
          
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
    logout() {
      // Reset value after user log out
      this.$patch({
        userId: "",
        role: "",
        token: "",
        isLoggedIn: false
      });
      this.$router.push("/login");
      //location.reload(); attempt on trying to remove navigation bar when logging out
    },
    persist: {
      storage: sessionStorage
    }
  },
});