<!-- /exitFormsAvailable -->
<template>
  <main class="">
      <br>
      <p class="font-weight-black text-h6 text-center">Exit Forms</p>
      <br>
    <div style="display: flex; justify-content: center;">
      <div style="max-height: 400px; overflow-y: auto;">
        <v-table style="width: 100%">
          <thead>
            <tr>
              <th class="text-left column-margin"></th>
              <th class="text-left column-margin">Experience Name</th>
              <th class="text-left column-margin">Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="experiences !== undefined && experiences.length === 0">
              <tr>
                <td colspan="5" class="text-center">No Exit Forms available.</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(experience, index) in experiences" :key="experience.experienceID">
                <td></td>
                <td class="text-left" @click="createExitForm(experience)">{{ experience.experienceName }}</td>
                <td class="text-left" @click="createExitForm(experience)">{{ experience.exitFormCreated ? 'Complete' : 'Incomplete' }}</td>
                <td></td>
                <td></td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </div>
    </div>
  </main>
  {{ experiences }}
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      experiences: [],
      searchTerm: "",
    };
  },
  mounted() {
    this.fetchExperiences();
    window.scrollTo(0, 0);
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
  },
  methods: {
    fetchExperiences() {
      const user = useLoggedInUserStore();
      const token = user.token;
      const apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/completedExperiences";

      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          this.experiences = resp.data;
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    createExitForm(experience) {
      this.$router.push({ 
        name: "exitForm", 
        params: { 
          id: experience.experienceID
        } 
      });
    },


  },
};
</script>

<style>
#contentNavbar .nav-link.router-link-exact-active {
  background-color: #eee;
}
.column-margin {
  margin-right: 10px;
}

/* Medium Devices, Desktops */
@media only screen and (min-width: 992px) {
  #contentNavbar .nav-item {
    border: 3px solid black;
    border-right: none;
  }
  #contentNavbar .nav-item:last-child {
    border: 1px solid black;
  }
}
</style>
