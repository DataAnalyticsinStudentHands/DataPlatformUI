<!-- instructorDash - this view presents the Instructor's Dashboard -->
<template>
  <main>
    <v-container>
      <v-row>
        <v-col class="text-center">
          <h1
            class="font-bold text-4xl text-red-700 tracking-widest mt-10"
          >
            Welcome {{ firstName }} {{ lastName }}
          </h1>
        </v-col>
      </v-row>
      
      <v-row class="my-6">
        <v-col
          :cols="12"
          class="ml-10"
        >

        </v-col>
      </v-row>
      
      <v-row>
        <v-col :cols="6">
          <v-card @click="navigateToProgressMonitor" class="mx-auto my-card" max-width="400" color="grey-lighten-4" elevation="24">
            <v-card-title class="red darken-2 text-center py-6">
              Student Progress Monitor
            </v-card-title>
          </v-card>
        </v-col>
        <v-col :cols="6">
          <v-card @click="navigateToMailer" class="mx-auto my-card" max-width="400" color="grey-lighten-4" elevation="24">
            <v-card-title class="red darken-2 text-center py-6">
              Student Mailer
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>


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
      lastName: "",
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
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
  },
  
  methods: {

    // Navigates to the progress monitor tool.
    navigateToProgressMonitor() {
      this.$router.push({ name: 'instructorProgressMonitorContainer' });
    },

    // Navigates to the Mailer tool.
    navigateToMailer() {
      this.$router.push({ name: 'instructorMailer' });
    }

  },
};
</script>

<style scoped>
.my-card {
  padding: 20px; /* This will add padding inside the card */
}


.v-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
