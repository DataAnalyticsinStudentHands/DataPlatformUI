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
      isLoggedIn: false
    }
  },
  actions: {
    async login(email, password) {
      try {
        console.log(email, password)
        const response = await axios.post(`${apiURL}/userdata/login`, {email, password});
        console.log("test")
        console.log(response)
        if (response) {
          this.$patch({
            isLoggedIn: true,
            role: response.data.role,
            userId: response.data.userId,
            token: response.data.token
          });
          this.$router.push("/");
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
    },
    persist: {
      storage: sessionStorage
    }
  },
});