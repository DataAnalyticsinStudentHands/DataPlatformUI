<template>
<main>
  <v-form @submit.prevent="handleUpdateForm">
    <v-container>
      <p class="font-weight-black text-h6">Session: {{ session.sessionName }}</p><br>
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

      <v-row>
        <v-col>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <v-btn @click="$router.back()">
            Cancel
          </v-btn>
          <v-btn style="text-align: center; margin-left: 10px;" @click="handleUpdateForm" >Submit</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" v-if="canSessionBeDeleted">
          <v-btn @click="showDeleteDialog = true">Delete</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</main>
<!-- Delete Dialog -->
<v-dialog v-model="showDeleteDialog" persistent width="auto">
  <v-card>
    <v-card-title class="text-h5">Confirm Delete</v-card-title>
    <v-card-text>Are you sure you want to delete this session?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red-darken-1" text @click="showDeleteDialog = false">No</v-btn>
      <v-btn color="green-darken-1" text @click="confirmDelete">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
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
        errorMessage: "",
        canSessionBeDeleted: false,
        showDeleteDialog: false,
      };
    },
    created() {
      this.fetchSessionData();
      this.checkIfSessionCanBeDeleted();
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

        async checkIfSessionCanBeDeleted() {
          try {
            const user = useLoggedInUserStore();
            const token = user.token;
            const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/session/can-be-deleted/${this.$route.params.id}`;

            const response = await axios.get(url, { headers: { token } });
            this.canSessionBeDeleted = response.data.canBeDeleted;
          } catch (error) {
            this.handleError(error);
          }
        }, 
        
        confirmDelete() {
          this.deleteSession();
          this.showDeleteDialog = false;
        },

        async deleteSession() {
          try {
            const user = useLoggedInUserStore();
            const token = user.token;
            let deleteURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/session/delete/${this.$route.params.id}`;

            await axios.delete(deleteURL, { headers: { token } });

            this.$router.push({
              name: 'instructorDataManagement',
              params: {
                activeTab: 1,
                toastType: 'success',
                toastMessage: 'Session Deleted!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
              }
            });
          } catch (error) {
            this.handleError(error);
          }
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
  