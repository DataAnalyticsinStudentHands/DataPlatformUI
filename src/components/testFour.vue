<template>
    <div>
      <!-- Semester selection -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-combobox
            v-model="selectedSemesters"
            :items="semesters"
            label="Select Semesters"
            multiple
            chips
            clearable
          ></v-combobox>
        </v-col>
      </v-row>
  
      <!-- Reports using Expansion Panels -->
        <v-expansion-panels 
            v-model="reportPanels" 
            @update:modelValue="handlePanelToggle"
            variant="popout"
            :disabled="reportsDisabled"
            multiple    
        >
            <v-expansion-panel
                value="goal-setting-count"
            >
                <v-expansion-panel-title>
                    <template v-slot:default="{ expanded }">
                    <v-row no-gutters>
                        <v-col cols="4" class="d-flex justify-start">
                        Total # of Students
                        </v-col>
                        <v-col
                        cols="8"
                        class="text-grey"
                        >
                        <v-fade-transition leave-absolute>
                            <span
                            v-if="expanded"
                            key="0"
                            >
                            i.e. the number of students who have submitted a goal setting form for the specified semester(s)
                            </span>
                            <span
                            v-else
                            key="1"
                            >
                            {{ trip.name }}
                            </span>
                        </v-fade-transition>
                        </v-col>
                    </v-row>
                    </template>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                    <v-row>
                        <!-- Column for currentCount -->
                        <v-col cols="3" class="d-flex align-center">
                            {{ currentCount }}
                        </v-col>

                        <!-- Column for the breakdown -->
                        <v-col cols="9">
                            <!-- Example breakdown for Fall 2023 -->
                            <v-row no-gutters class="py-1">
                                <v-col class="text-grey">
                                    Fall 2023: <strong>27</strong>
                                </v-col>
                            </v-row>

                            <!-- Example breakdown for Spring 2023 -->
                            <v-row no-gutters class="py-1">
                                <v-col class="text-grey">
                                    Spring 2023: <strong>54</strong>
                                </v-col>
                            </v-row>

                            <!-- Add more rows as needed for additional semesters -->
                        </v-col>
                    </v-row>
                </v-expansion-panel-text>



            </v-expansion-panel>
        </v-expansion-panels>


        <v-row class="mb-4">
            <v-col cols="12">



        <v-expansion-panels>
        <v-expansion-panel>
        <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
            <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start">
                Trip name
                </v-col>
                <v-col
                cols="8"
                class="text-grey"
                >
                <v-fade-transition leave-absolute>
                    <span
                    v-if="expanded"
                    key="0"
                    >
                    Enter a name for the trip
                    </span>
                    <span
                    v-else
                    key="1"
                    >
                    {{ trip.name }}
                    </span>
                </v-fade-transition>
                </v-col>
            </v-row>
            </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <v-text-field
            v-model="trip.name"
            hide-details
            placeholder="Caribbean Cruise"
            ></v-text-field>
        </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
        <v-expansion-panel-title v-slot="{ open }">
            <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
                Location
            </v-col>
            <v-col
                cols="8"
                class="text--secondary"
            >
                <v-fade-transition leave-absolute>
                <span
                    v-if="open"
                    key="0"
                >
                    Select trip destination
                </span>
                <span
                    v-else
                    key="1"
                >
                    {{ trip.location }}
                </span>
                </v-fade-transition>
            </v-col>
            </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-col cols="5">
                <v-select
                v-model="trip.location"
                :items="locations"
                chips
                flat
                variant="solo"
                ></v-select>
            </v-col>

            <v-divider
                vertical
                class="mx-4"
            ></v-divider>

            <v-col cols="3">
                Select your destination of choice
                <br>
                <a href="#">Learn more</a>
            </v-col>
            </v-row>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                variant="text"
                color="secondary"
            >
                Cancel
            </v-btn>
            <v-btn
                variant="text"
                color="primary"
            >
                Save
            </v-btn>
            </v-card-actions>
        </v-expansion-panel-text>
        </v-expansion-panel>
            <v-expansion-panel>
            <v-expansion-panel-title v-slot="{ open }">
                <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start">
                    Start and end dates
                </v-col>
                <v-col
                    cols="8"
                    class="text--secondary"
                >
                    <v-fade-transition leave-absolute>
                    <span v-if="open">When do you want to travel?</span>
                    <v-row
                        v-else
                        no-gutters
                        style="width: 100%"
                    >
                        <v-col cols="6" class="d-flex justify-start">
                        Start date: {{ trip.start || 'Not set' }}
                        </v-col>
                        <v-col cols="6" class="d-flex justify-start">
                        End date: {{ trip.end || 'Not set' }}
                        </v-col>
                    </v-row>
                    </v-fade-transition>
                </v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-row
                justify="space-around"
                no-gutters
                >
                <v-col cols="3">
                    <v-text-field
                    v-model="trip.start"
                    label="Start date"
                    type="date"
                    ></v-text-field>
                </v-col>

                <v-col cols="3">
                    <v-text-field
                    v-model="trip.end"
                    label="End date"
                    type="date"
                    ></v-text-field>
                </v-col>
                </v-row>
            </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

    </v-col>
    </v-row>

    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        semesters: ["Spring 2023", "Fall 2023"], // Example semesters
        selectedSemesters: [],
        trip: {
            name: '',
            location: null,
            start: null,
            end: null,
        },
        locations: ['Australia', 'Barbados', 'Chile', 'Denmark', 'Ecuador', 'France'],
        currentCount: 0,
        reportPanels: [],
      };
    },
    computed: {
        reportsDisabled() {
            return !this.selectedSemesters.length;
        }
    },
    methods: {
        handlePanelToggle(value) {
            console.log('handlePanelToggle called');
            // Check if the 'goal-setting-count' panel is opened
            if (value.includes('goal-setting-count')) {
                this.animateCount();
            }
        },
        animateCount() {
            this.currentCount = 0; // Reset the counter

            let interval = 8; // The delay in milliseconds between increments
            let maxCount = 100;

            for (let i = 1; i <= maxCount; i++) {
                setTimeout(() => {
                    this.currentCount = i;
                }, interval * i);
            }
        },
    },
  }
  </script>
  