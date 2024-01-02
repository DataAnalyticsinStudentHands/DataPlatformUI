<template>
    <main>
      <v-form @submit.prevent="handleSubmitForm">
        <v-container>
          <p class="font-weight-black text-h6">New Session</p><br>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="session.sessionName" label="Session Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field type="date" v-model="session.sessionPeriod.startDate" label="Session Start Date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field type="date" v-model="session.sessionPeriod.endDate" label="Session End Date"></v-text-field>
            </v-col>
          </v-row>
  
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <v-btn @click=$router.back() style="margin-left: 10px;">
            Cancel
          </v-btn>
          <v-btn style="text-align: center;" @click="handleSubmitForm">Submit</v-btn>
        </v-container>
      </v-form>
    </main>
  </template>
  
  <script>
  import axios from "axios";
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  
  export default {
    name: 'instructorAddSession',
    data() {
      return {
        session: {
          sessionName: "",
          sessionPeriod: {
            startDate: "",
            endDate: ""
          }
        },
        errorMessage: ""
      };
    },
    beforeMount() {
      window.scrollTo(0, 0);
    },
      methods: {

      handleSubmitForm() {
        if (
          !this.session.sessionName ||
          !this.session.sessionPeriod.startDate ||
          !this.session.sessionPeriod.endDate
        ) {
          this.errorMessage = "Please fill in all fields.";
          return;
        }
  
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/`;
  
        axios
          .post(apiURL, {
            sessionName: this.session.sessionName,
            sessionPeriod: {
                startDate: this.session.sessionPeriod.startDate,
                endDate: this.session.sessionPeriod.endDate
            }
          }, { headers: { token } })
          .then(() => {
            console.log('before router push');
            this.$router.push({ 
                name: 'instructorDataManagement',
                params: {
                  activeTab: 0,
                  toastType: 'success',
                  toastMessage: 'Session added!',
                  toastPosition: 'top-right',
                  toastCSS: 'Toastify__toast--create'
              }
            });

          })
          .catch((error) => {
            if (error.response && error.response.data && error.response.data.error) {
              this.errorMessage = error.response.data.error;
            } else {
                console.log('error: ', error);
              this.handleError(error);
            }
          });
      }
    }
  };
  </script>
  
  <style>
  #contentNavbar .nav-link.router-link-exact-active {
    background-color: #eee;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  