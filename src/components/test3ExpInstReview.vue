<template>
<v-container>
    <v-row v-for="session in experienceDetails" :key="session._id">
    <v-col cols="12">
        <v-card class="mb-3" flat>
        <v-card-title>
            Session: {{ session.sessionName }}
            <span class="grey--text">({{ formatDate(session.sessionPeriod.startDate) }} - {{ formatDate(session.sessionPeriod.endDate) }})</span>
        </v-card-title>
        <v-card-text>
            <v-list>
            <v-list-item v-for="experience in session.experiences" :key="experience.id">
                <v-list-item-title>{{ experience.name }}</v-list-item-title>
                <v-list-item-subtitle>
                <div>Category: {{ experience.category }}</div>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                <div>Exit Form Release Date: {{ formatDate(experience.exitFormReleaseDate) }}</div>
                </v-list-item-subtitle>
            </v-list-item>
            </v-list>
        </v-card-text>
        </v-card>
    </v-col>
    </v-row>
</v-container>
<!-- {{ experienceDetails }} -->
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default {
  name: 'ExpInstReview',
  computed: {
    experienceDetails() {
      const userStore = useLoggedInUserStore();
      return userStore.experienceInstanceCreationDetails;
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async createExpInstances() {
        for (const session of this.experienceDetails) {
            try {
                const store = useLoggedInUserStore();
                let token = store.token;

                // let token = `
                // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDkwNDIxMiwiZXhwIjoxNzA0OTE2MjEyfQ.984qyRLCppNjok5SrZ7bo2gxJi0Nrp4oVkHDM0YJ17E
                // `

                let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/multiple`;
                let experienceData = session.experiences.map(exp => ({
                    id: exp.id,
                    exitFormReleaseDate: exp.exitFormReleaseDate // Include exitFormReleaseDate
                }));

                const response = await axios.post(apiURL, {
                    sessionID: session._id,
                    experienceData // Include the experienceData array
                }, { headers: { token } });

                console.log('response: ', response);

                this.$router.push({ 
                    name: 'instructorDataManagement',
                    params: {
                        activeTab: 0,
                        toastType: 'success',
                        toastMessage: 'Experience Instances added!',
                        toastPosition: 'top-right',
                        toastCSS: 'Toastify__toast--create'
                    }
                });



            } catch (error) {
                // Handle the error
                this.handleError(error);
            }
        }
    },
  }
}
</script>
