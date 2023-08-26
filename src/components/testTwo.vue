<template>
    <v-container>
      <v-card title="Select a question:">
          <v-autocomplete
              v-model="selectedQuestion"
              clearable
              :items="entryFormQuestions"
              item-title="label"
              item-value="value"
              label="Question"
          ></v-autocomplete>

          <v-card class="mt-4">
            <v-card-title>Filters</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-select
                            dense
                            v-model="uhStatus"
                            :items="['Yes', 'No']"
                            label="UH Status"
                            clearable
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            dense
                            v-model="honorsCollegeStatus"
                            :items="['Yes', 'No']"
                            label="Honors College Status"
                            clearable
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            dense
                            v-model="hichStatus"
                            :items="['Yes', 'No']"
                            label="HICH Status"
                            clearable
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            dense
                            v-model="programGradProStatus"
                            :items="['Yes', 'No']"
                            label="Pursuing Graduate/Professional School"
                            clearable
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            dense
                            v-model="specializedDegCertStatus"
                            :items="['Yes', 'No']"
                            label="Pursuing Specialized Degree/Certificate Program"
                            clearable
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            dense
                            v-model="livingOnCampus"
                            :items="['On-Campus', 'Off-Campus']"
                            label="Living On-Campus"
                            clearable
                        ></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>


          
          <v-row>
            <!-- Additional Information Section -->
            <v-col cols="4">
                <v-card class="info-card" v-if="loaded">
                <v-card-text>
                    <p class="font-bold">
                    <span class="text-red-800">{{ uniqueUserCount }}</span> total students.
                    </p>
                </v-card-text>
                </v-card>
                
                <v-card class="info-card" v-if="loaded">
                <v-card-text>
                    <p class="font-bold">
                    <span class="text-red-800">{{ unansweredCount }}</span> students did not answer this question.
                    </p>
                </v-card-text>
                </v-card>
                
                <v-card class="info-card" v-if="loaded">
                <v-card-text>
                    <p class="font-bold">
                    Chart shows <span class="text-red-800">{{ totalCount }}</span> selections from <span class="text-red-800">{{ uniqueUserCount - unansweredCount }}</span> respondents.
                    </p>
                </v-card-text>
                </v-card>
            </v-col>
                        
            <!-- BarChart Section -->
            <v-col cols="8">
              <BarChart v-if="loaded" :chartData="transformedChartData" />
            </v-col>
          </v-row>
      </v-card>
    </v-container>
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
            uniqueUserCount: 0,
            unansweredCount: 0,
            totalCount: 0,
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
            ],
            uhStatus: null,
            honorsCollegeStatus: null,
            hichStatus: null,
            programGradProStatus: null,
            specializedDegCertStatus: null,
            livingOnCampus: null,
        }
    },
    watch: {
        selectedQuestion(newVal) {
            if (newVal !== null) {
                this.fetchData();
            }
        },
        uhStatus: 'fetchData',
        honorsCollegeStatus: 'fetchData',
        hichStatus: 'fetchData',
        programGradProStatus: 'fetchData',
        specializedDegCertStatus: 'fetchData',
        livingOnCampus: 'fetchData'
    },
    methods: {
        async fetchData() {
            let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkOGZkMzQ1MC1mZTQzLTExZWQtODI3Zi1lOTY4NjNkOTI2OTgiLCJ1c2VyUm9sZSI6IlN0dWRlbnQiLCJpYXQiOjE2OTMwMDc2MzksImV4cCI6MTY5MzAxOTYzOX0.82eFA0E4tXKmHQOgRFujcVXXuo0RRj97nrE5-ZQngL8";
            let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/reportEntryForm/`;

            // Prepare the request body with the selected question and filter data
            let requestBody = {
                id: this.selectedQuestion,
                uhStatus: this.uhStatus,
                honorsCollegeStatus: this.honorsCollegeStatus,
                hichStatus: this.hichStatus,
                programGradProStatus: this.programGradProStatus,
                specializedDegCertStatus: this.specializedDegCertStatus,
                livingOnCampus: this.livingOnCampus
            };

            try {
                const response = await axios.post(apiURL, requestBody,
                    { id: this.selectedQuestion },
                    { headers: { "token": token } }
                );
                this.uniqueUserCount = response.data.uniqueUserCount;
                this.unansweredCount = response.data.unansweredCount
                this.transformedChartData = {
                    labels: response.data.data.map(item => item._id),
                    datasets: [{
                        backgroundColor: '#f87979',
                        data: response.data.data.map(item => item.count)
                    }]
                };
                this.totalCount = response.data.data.reduce((acc, curr) => acc + curr.count, 0);

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

.info-section {
    padding: 1.25rem;  /* 20px when base font-size is 16px */
    background-color: #fafafa;  /* Light gray background */
    border-radius: 0.625rem;  /* 10px when base font-size is 16px */
    box-shadow: 0px 0px 0.625rem rgba(0, 0, 0, 0.1);  /* 10px when base font-size is 16px */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.info-section h3 {
    color: #333;  /* Dark gray color */
    margin-bottom: 0.625rem;  /* 10px when base font-size is 16px */
}

.response-count {
    font-size: 1.5rem;  /* 24px when base font-size is 16px */
    color: #8B0000;  /* Dark red color */
    font-weight: bold;
}


</style>