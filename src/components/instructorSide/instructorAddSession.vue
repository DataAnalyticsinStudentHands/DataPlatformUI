<template>
  <main>
    <v-form ref="form" @submit.prevent="handleSubmitForm">
      <v-container>
        <p class="font-weight-black text-h6">New Session</p><br>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="session.sessionName" 
              label="Session Name"
              :rules="nameRules"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field 
              type="date" 
              v-model="session.sessionPeriod.startDate" 
              label="Session Start Date"
              :rules="dateRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field 
              type="date" 
              v-model="session.sessionPeriod.endDate" 
              label="Session End Date"
              :rules="dateRules"
            ></v-text-field>
          </v-col>
        </v-row>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <v-btn @click="$router.push({ name: 'instructorDataManagement', params: { activeTab: 1 } })">
          Cancel
        </v-btn>
        <v-btn style="text-align: center; margin-left: 10px;" type="submit">Submit</v-btn>
      </v-container>
    </v-form>
  </main>
</template>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';

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
      errorMessage: "",
      nameRules: [v => !!v || 'Session name is required'],
      dateRules: [v => !!v || 'Date is required'],
    };
  },
  beforeMount() {
    window.scrollTo(0, 0);
  },
  methods: {
    async handleSubmitForm() {
      // Validate the form before submission
      const isValid = await this.$refs.form.validate();
      if (isValid.valid) {
        // Form is valid, submit the data
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/`;

        axios.post(apiURL, {
          sessionName: this.session.sessionName,
          sessionPeriod: this.session.sessionPeriod
        }, { headers: { token } })
        .then(() => {
          this.$router.push({
            name: 'instructorDataManagement',
            params: {
              activeTab: 1,
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
            this.handleError(error);
          }
        });
      } else {
        console.log('Form is invalid');
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: false
        });
      }
    }
  }
}
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
