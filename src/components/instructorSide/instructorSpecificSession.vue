<template>
<main>
  <v-form @submit.prevent="handleUpdateForm">
    <v-container>
      <p class="font-weight-black text-h6">Update Session</p><br>
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
      <v-btn @click="$router.back()">
        Cancel
      </v-btn>
      <v-btn style="text-align: center; margin-left: 10px;" @click="handleUpdateForm" >Submit</v-btn>
    </v-container>
  </v-form>
</main>
</template>

  <script>
  import axios from "axios";
import { DateTime } from "luxon";
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  
  export default {
    name: 'instructorSpecificSession',
    data() {
      return {
        session: {
          originalSessionName: "",
          sessionName: "",
          sessionPeriod: {
            startDate: "",
            endDate: ""
          }
        },
        errorMessage: ""
      };
    },
    created() {
      window.scrollTo(0, 0);
      this.fetchSessionData();
    },
      methods: {
        fetchSessionData() {
            const user = useLoggedInUserStore();
            let token = user.token;
            let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions`;
            axios
                .get(`${url}/${this.$route.params.id}`, {
                    headers: { token },
                })
                .then((resp) => {
                    let data = resp.data;
                    this.session.originalSessionName = data.sessionName;
                    this.session.sessionName = data.sessionName;
                    // Format the dates to 'yyyy-MM-dd'
                    this.session.sessionPeriod.startDate = DateTime.fromISO(data.sessionPeriod.startDate).toFormat('yyyy-MM-dd');
                    this.session.sessionPeriod.endDate = DateTime.fromISO(data.sessionPeriod.endDate).toFormat('yyyy-MM-dd');
                })
                .catch((error) => {
                    this.handleError(error);
                });
        },

            handleUpdateForm() {
              const user = useLoggedInUserStore();
                let token = user.token;
                const updatedSession = {
                    sessionName: this.session.sessionName,
                    sessionPeriod: {
                        startDate: DateTime.fromFormat(this.session.sessionPeriod.startDate, 'yyyy-MM-dd').toISO(),
                        endDate: DateTime.fromFormat(this.session.sessionPeriod.endDate, 'yyyy-MM-dd').toISO()
                    },
                };
                let url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions`;
                axios.put(`${url}/${this.$route.params.id}`, updatedSession, {
                    headers: { token },
                }).then(() => {
                    this.$router.push({ 
                        name: 'instructorDataManagement',
                        params: {
                            activeTab: 1,
                            toastType: 'info',
                            toastMessage: 'Session updated!',
                            toastPosition: 'top-right',
                            toastCSS: 'Toastify__toast--update'
                        }
                    });
                }).catch((error) => {
                    this.errorMessage = "Error updating session: " + error.message;
                });
            },
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
  