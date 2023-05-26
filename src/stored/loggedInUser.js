import { defineStore } from 'pinia'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API

// Defining a store
export const useLoggedInUserStore = defineStore({
  id: 'loggedInUser',
  state: () => {
    return {
      name: "",
      role: 0,
      isLoggedIn: false
    }
  },
  actions: {
    async login(username, password) {
      try {
        // Hash the password before sending it to the server
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        console.log(username, password)
        const response = await axios.post(apiURL + `/userdata/login`, {username, password});
        console.log(response)
        if (response) {
          this.$patch({
            isLoggedIn: true,
            userId: response.data.userId,
            userRole: response.data.userRole
          });
          this.$router.push("/");
        }
      } catch (error) {
        console.log(error)
        alert("Invalid credentials. Please try again.");
      }
    },
    logout() {
      // Reset value after user log out
      this.$patch({
        name: "",
        role: 0,
        isLoggedIn: false
      });
    },
    persist: {
      storage: sessionStorage
    }
  },
});