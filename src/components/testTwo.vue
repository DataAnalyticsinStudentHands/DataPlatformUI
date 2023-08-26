<template>
  <v-container>
    <v-card
        title="Select a question:"    
    >
        <v-autocomplete
            v-model="selectedQuestion"
            clearable
            :items="entryFormQuestions"
            item-title="label"
            item-value="value"
            label="Question"
            >
        </v-autocomplete>
        <BarChart v-if="loaded" :chartData="transformedChartData" />
    </v-card>
  </v-container>
  <v-btn @click="fetchData">Fetch Data</v-btn>
</template>

<script>
import axios from 'axios';
import BarChart from './testThree.vue'
export default {
    components: { BarChart },
    data() {
        return {
            selectedQuestion: null,
            transformedChartData: {},
            loaded: false,
            entryFormQuestions: [
                {label: "What language do you prefer to receive communication in?", value: "languagePreference"},
                {label: "What are your pronouns?", value: "pronouns"},
                {label: "Are you currently enrolled in a degree program at the University of Houston?", value: "uhStatus"},
                {label: "Do you live on or off campus?", value: "livingOnCampus"},
                {label: "Are you a member of the Honors College?", value: "honorsCollegeStatus"},
                {label: "Are you affiliated with the Honors College in any other way?", value: "honorsCollegeAffiliatedStatus"},
                {label: "What is/are your current major(s)?", value: "majors"},
                {label: "Are you pursuing, or planning to pursue, any of the following Honors College minors?", value: "honorsMinors"},
                {label: "Are you pursuing any other minors?", value: "otherMinors"},
                {label: "Are you a member of Honors in Community Health (HICH)?", value: "hichStatus"},
                {label: "Have you participated in HICH Projects?", value: "hichHistoryStatus"},
                {label: "Have you had experience with Community Service?", value: "serviceStatus"},
                {label: "Do you currently plan to pursue graduate or professional school?", value: "programGradProStatus"},
                {label: "If you are planning to pursue graduate school, what type of program?", value: "programGradProType"},
                {label: "Are you planning to pursue any other kind of specialized degree / certificate program?", value: "specializedDegCertStatus"},
                {label: "If you are planning to pursue a specialized degree / certificate program, what type of program?", value: "specializedDegCertType"},
            ]
        }
    },
    methods: {
        async fetchData() {
            let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkOGZkMzQ1MC1mZTQzLTExZWQtODI3Zi1lOTY4NjNkOTI2OTgiLCJ1c2VyUm9sZSI6IlN0dWRlbnQiLCJpYXQiOjE2OTMwMDc2MzksImV4cCI6MTY5MzAxOTYzOX0.82eFA0E4tXKmHQOgRFujcVXXuo0RRj97nrE5-ZQngL8";
            let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/reportEntryForm/`;
            try {
                const response = await axios.post(apiURL, 
                    { id: this.selectedQuestion },
                    { headers: { "token": token } }
                );
                this.transformedChartData = {
                    labels: response.data.map(item => item._id),
                    datasets: [{
                        backgroundColor: '#f87979',
                        data: response.data.map(item => item.count)
                    }]
                };
                this.loaded = true
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

    }
}
</script>

<style>
.v-field__input > input[size="1"] {
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

.v-field__input > input[size="1"]::before,
.v-field__input > input[size="1"]::after {
  display: none;
}

</style>