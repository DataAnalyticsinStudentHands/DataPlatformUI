<template>
<v-container>
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6 mb-4">Please Choose One or More Experiences</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title>
                    <v-row class="d-flex justify-start">
                        <v-col md="6">
                            <v-text-field
                                v-model="experienceSearch"
                                density="comfortable"
                                :label="searchLabel"
                                flat
                                hide-details
                                variant="solo-filled"
                                @keyup.enter="addSearchChip"
                            >

                                <!-- Prepend Icon with Menu -->
                                <template v-slot:prepend-inner>
                                    <v-menu
                                        location="bottom"
                                    >
                                        <template v-slot:activator="{ props }">
                                            <div
                                                v-bind="props"
                                                class="pointer-cursor"
                                                @click.stop
                                            >
                                                <v-icon>mdi-magnify</v-icon>
                                                <v-icon>mdi-chevron-down</v-icon>
                                            </div>
                                        </template>
                                        <v-list>
                                            <v-list-item
                                                v-for="item in searchMenuItems"
                                                :key="item"
                                                @click="updateSearchCriteria(item)"
                                            >
                                                <v-list-item-title>{{ item }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>
                                <template v-slot:append-inner>
                                    <div class="pointer-cursor mr-3" @click="addSearchChip">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </div>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <!-- Chips Row -->
                    <v-row v-if="showChipsRow" dense>
                        <v-col>
                            <!-- Search Chips -->
                            <v-chip-group
                                v-if="searchCriteria.length"
                                v-model="selectedSearchChips"
                                column
                                multiple
                            >
                                <v-chip
                                    v-for="(criteria, index) in searchCriteria"
                                    :key="index"
                                    @click="selectSearchChip(index)"
                                    filter
                                    variant="outlined"
                                    class="ma-2"
                                >
                                    {{ criteria.category + '="' + criteria.term + '"' }}
                                    <v-icon
                                        end
                                        @click.stop="removeSearchChip(index)"
                                    >mdi-close</v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-col>
                    </v-row>
                </v-card-title>

                <v-data-table
                      :headers="experienceHeaders"
                      :items="filteredExperienceData"
                      item-key="_id"
                      item-value="_id"
                      show-select
                      v-model="selectedExperiences"
                  >
                      <!-- Slot for Edit Column -->
                      <template v-slot:item.edit="{ item }">
                          <v-btn
                              @click="editExperience(item)"
                              icon="mdi-pencil"
                              variant="text" 
                              size="small"
                          ></v-btn>
                      </template>

                      <!-- Slot for Activities Column -->
                      <template v-slot:item.activities="{ item }">
                          <div>{{ item.activitiesCount }}</div>
                      </template>
                  </v-data-table>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
      <!-- Column for Session Cards -->
      <v-col cols="6">
        <v-row v-for="session in selectedSessions" :key="session._id">
          <v-col cols="12">
            <v-card flat>
              <v-card-title>{{ session.sessionName }}</v-card-title>
              <v-card-text>
                Start Date: {{ new Date(session.sessionPeriod.startDate).toLocaleDateString() }}
                <br>
                End Date: {{ new Date(session.sessionPeriod.endDate).toLocaleDateString() }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

</v-container>
<br><br><br><br><br>
    {{ selectedSessions }}

<v-dialog v-model="showEditDialog" max-width="600px">
    <v-card
        width="700"
    >
        <edit-experience
            :experience="currentExperience"
            :isInDialog="true"
            @update-success="handleUpdateSuccess"
        ></edit-experience>
    <br>
    </v-card>
</v-dialog>


<br><br><br><br><br><br>
experienceData: {{ experienceData }}
</template>
    
<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';
import axios from 'axios';
import EditExperience from '@/components/instructorSide/instructorSpecificExperience.vue';

export default {
    name: 'ChooseExperiences',
    components: {
        EditExperience
    },
    props: {
        
    },
    emits: ['form-valid', 'form-invalid', 'validation-change'],
    data() {
        return {
            experienceData: [],
            searchLabel: 'Search All Text Fields',
            experienceSearch: "",
            searchMenuItems: ['All Text Fields', 'Experience Category', 'Experience Name'],
            searchCriteria: [],
            selectedSearchChips: [],
            experienceHeaders: [
                {
                    title: 'Experience Category',
                    value: 'experienceCategory',
                    align: 'start',
                    sortable: true
                },
                {
                    title: 'Experience Name',
                    value: 'experienceName',
                    align: 'start',
                    sortable: true
                },
                {
                    title: 'Activities',
                    value: 'activitiesCount',
                    align: 'center',
                    sortable: true
                },
                { 
                    title: '', 
                    value: 'edit',
                    align: 'end',
                    sortable: false 
                },
            ],       
            filteredExperienceData: [],     
            selectedExperiences: [],
            showEditDialog: false,
            selectedExperience: null,
            
        }
    },
    created() {
        this.fetchExperiences();
    },
    watch: {

        hasValidationErrors(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.$emit('validation-change', { isValid: !newValue });
            }
        },

    },
    computed: {
        showChipsRow() {
            return this.searchCriteria.length > 0
        },

        hasValidationErrors() {
            if (!this.formSubmitted) return false;
                return this.isUhStatusInvalid || this.isEnrolledUHInfoInvalid || this.isHonorsCollegeStatusInvalid || this.isHonorsCollegeAffiliatedInvalid || this.isMajorsInvalid || this.isHonorsMinorsInvalid || this.isServiceStatusInvalid || this.isServiceHistoryDescInvalid;
        },

        selectedSessions() {
            const user = useLoggedInUserStore();
            return user.selectedSessionsDetails;
        }
    },
    methods: {
        async fetchExperiences() {
            const user = useLoggedInUserStore();
            // const token = user.token;

            const token = `
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDEwNjY4NiwiZXhwIjoxNzA0MTE4Njg2fQ.DvPLGomaGLDsYwzjCs9TbeI8lflr3KOtGs0rXRuHBiE
            `

            try {
                let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/active`;
                const resp = await axios.get(apiURL, { headers: { token } });
                this.experienceData = resp.data.map(item => ({
                    ...item,
                    activitiesCount: item.activities.length
                }));
                this.filteredExperienceData = [...this.experienceData];
            } catch (error) {
                this.handleError(error);
            }
        },

        addSearchChip() {
            if (this.experienceSearch) {
                this.searchCriteria.push({
                    category: this.searchLabel.replace('Search ', ''),
                    term: this.experienceSearch
                });
                // Select the new chip by default
                this.selectedSearchChips.push(this.searchCriteria.length - 1);
                // Clear the input field after adding the chip
                this.experienceSearch = ''; 
                // Call search
                this.performSearch();
            }
        },


        updateSearchCriteria(selectedItem) {
            this.searchLabel = 'Search ' + selectedItem;
        },

        selectSearchChip(index) {
            const selectedIndex = this.selectedSearchChips.indexOf(index);
            if(selectedIndex >= 0) {
                // If the chip is already selected, create a new array without this chip
                this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
            } else {
                // If the chip is not selected, create a new array with this chip added
                this.selectedSearchChips = [...this.selectedSearchChips, index];
            }
            // Call search
            this.performSearch();
        },

        removeSearchChip(index) {
            this.searchCriteria.splice(index, 1);
            // Update selectedSearchChips to reflect the removal
            this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
            // Adjust the indexes of the remaining selected chips
            this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
            // Call search
            this.performSearch();
        },

        performSearch() {
            let searchGroups = {};
            this.selectedSearchChips.forEach(index => {
                let criteria = this.searchCriteria[index];
                if (!searchGroups[criteria.category]) {
                    searchGroups[criteria.category] = [];
                }
                searchGroups[criteria.category].push(criteria.term.toLowerCase());
            })

            this.filteredExperienceData = this.experienceData.filter(item => {
                return Object.keys(searchGroups).every(category => {
                    if (category === 'All Text Fields') {
                        return searchGroups[category].every(term =>
                            item.experienceCategory.toLowerCase().includes(term) || item.experienceName.toLowerCase().includes(term)
                        );
                    } else if (category === 'Experience Category') {
                        return searchGroups[category].every(term => 
                            item.experienceCategory.toLowerCase().includes(term)
                        );
                    } else if (category === 'Experience Name') {
                        return searchGroups[category].every(term => 
                            item.experienceName.toLowerCase().includes(term)
                        );
                    }
                    return true;
                })
            })
        },

        editExperience(experience) {
            this.currentExperience = experience;
            this.showEditDialog = true;
        },

        handleUpdateSuccess() {
            this.showEditDialog = false;
            toast.info('Experience Updated!', {
                position: 'top-right',
                toastClassName: 'Toastify__toast--update',
                multiple: false
            })
            // Refetch Experiences
            this.fetchExperiences();
        },

        async handleValidations() {
            console.log('handleValidations called')
            this.formSubmitted = true;
            const { valid } = await this.$refs.form.validate();
            if (valid) {
                console.log('form is valid!');
                this.$emit('form-valid');
            } else {
                this.$emit('form-invalid');
                toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
            }
        },
    }
}
</script>
    
<style scoped>

.pointer-cursor {
  cursor: pointer;
}

:deep(.v-text-field input[type="text"]:focus) {
    outline: none !important;
    box-shadow: none !important;
    border: 1px solid transparent !important; /* Update this line if you have a different border style */
    background-color: transparent !important;
}

</style>