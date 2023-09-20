<template>
  <main>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Welcome {{ firstName }} {{ lastName }}
    </h1>
    <v-container style="width: 90%; margin: 0 auto;">
      <v-card
      class="mx-auto"
      width="350"
      >
      <v-list>
          <v-list-item>
              <v-list-item-title class="flex-grow-1 text-center">
                  Student Checklist
                  <v-icon>mdi-clipboard-check</v-icon>
              </v-list-item-title>
          </v-list-item>

          <v-list-group value="Entry Form">
              <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" color="green darken-4" class="light-green-bg">

                      <!-- Display the title "Entry Form" -->
                      <span class="text-green-800">Entry Form</span>

                      <!-- Append the mdi-message-alert icon -->
                      <template v-slot:append>
                          <v-icon class="text-green-800">mdi-check-bold</v-icon>
                      </template>
                  </v-list-item>
              </template>
              <v-list-item class="list-item-no-padding flex light-green-bg">
                  <div class="flex items-center no-right-margin">
                      <v-icon class="no-right-margin text-green-800" size="small">mdi-door-open</v-icon>
                      <span class="text-sm text-green-800">Thank you for completing the Student Entry Form!</span>
                  </div>
              </v-list-item>
          </v-list-group>


          <v-list-group value="Goal Form">
              <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" class="light-red-bg">
                  <span class="text-red-800">Goal Forms</span>
                      <template v-slot:append>
                          <v-icon class="text-red-800">mdi-message-alert</v-icon>
                      </template>
                  </v-list-item>
              </template>
              <v-list-item class="list-item-no-padding flex light-red-bg">
                  <div class="flex items-center no-right-margin">
                      <v-icon class="no-right-margin text-red-800" size="small">mdi-flag-checkered</v-icon>
                      <span class="text-sm text-red-800">Please complete 2
                          <router-link to="/goalSettingForm" class="text-blue-500 underline">Goal Setting Forms</router-link><br>(2 Remaining)
                      </span>
                  </div>
              </v-list-item>
          </v-list-group>
      </v-list>
      </v-card>
  </v-container>
</main>
</template>

  <script>
  import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import { DateTime } from "luxon";
  import axios from "axios";
  export default {
    data() {
      return {
        queryData: [],
        firstName: "",
        lastName: ""
      };
    },
    mounted() {
      let token = localStorage.getItem("token");
      let url = import.meta.env.VITE_ROOT_API + `/userdata/user`;
      axios
        .get(url, {
          headers: {token},
        })
        .then(
          (res) => {
            this.firstName = res.data.user.firstName;
            this.lastName = res.data.user.lastName;
          },
          (err) => {
            if (err) {
              this.$router.push("/login");
            }
          }
        )
      let apiURL = import.meta.env.VITE_ROOT_API + `/dashboarddata/recentEvent/`;
      this.queryData = [];
      axios.get(apiURL,{
          headers: { token: localStorage.getItem("token") },
        }).then((resp) => {
        this.queryData = resp.data;
      });
      if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
    },
    methods: {
      routePush(routeName) {
        this.$router.push({ name: routeName });
      },
      formattedDate(datetimeDB) {
        return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
      },
    },
  };
  </script>
  
  
<style scoped>
.list-item-no-padding {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
}

.no-right-margin {
    margin-right: 0.5rem !important; /* Remove the right margin */
}

.light-green-bg {
    background-color: #e6f7e9; /* This is a very light green color. Adjust if needed */
}

.light-red-bg {
    background-color: #ffe6e6; /* This is a very light red color. Adjust if needed */
}


</style>
