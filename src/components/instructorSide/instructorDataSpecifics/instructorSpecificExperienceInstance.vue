<!-- instructorSpecificExperienceInstance - this view presents a single Experience Instance's data -->
<template>
<v-container>
    <v-form>
        <v-row>
            <v-col>
                <p class="font-weight-black text-h6">Experience Instance: {{ experienceData.experienceName }}</p><br>
            </v-col>
        </v-row>

        <v-row>
            <p class="font-weight-black text-h7">Session</p>
        </v-row>

        <v-row>
            <v-col>
            <v-text-field
                v-model="sessionData.sessionName"
                readonly
            ></v-text-field>
            </v-col>
        </v-row>



        <v-row>
            <p class="font-weight-black text-h7">Experience</p>
        </v-row>

        <v-row>
            <v-col>
                <v-text-field
                    label="Experience Name"
                    v-model="experienceData.experienceName"
                    readonly
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <p class="font-weight-black text-h7">Activities</p>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-card flat>
              <v-card-title>
                <v-row>
                  <v-col>
                    Selected Activities
                  </v-col>
                </v-row>
              </v-card-title>
              <v-list class="scrollable-list">
                <v-list-item
                  v-for="activity in selectedActivities"
                  :key="activity._id"
                >
                <v-row>
                  <v-col cols="10">
                    {{ activity.activityName }}
                  </v-col>
                  <v-col>
                    <v-icon
                      @click.stop="removeActivity(activity)"
                      class="mdi-close"
                    >
                      mdi-close
                    </v-icon>
                  </v-col>
                </v-row>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              flat
              title="Add Activities"
            >
              <template v-slot:text>
                <v-text-field
                  v-model="activitySearch"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  single-line
                  variant="outlined"
                  hide-details
                ></v-text-field>
              </template>
              <v-data-table
                :headers="activityHeaders"
                :items="filteredActivityData"
                item-value="_id"
                items-per-page="-1"
                class="scrollable-table"
                hover
                :search="activitySearch"
              >
                <template v-slot:body="{ items }">
                  <template v-for="item in items" :key="item._id">
                    <tr
                      @click="selectActivity(item)"
                      @mouseover="hoveredItem = item._id"
                      @mouseleave="hoveredItem = null"
                      class="pointer-cursor activity-row"
                    >
                      <td>
                        <div class="activity-content">
                          {{ item.activityName }}
                          <v-icon v-if="hoveredItem === item._id" class="mdi-plus">mdi-plus</v-icon>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
                <template v-slot:bottom>

                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>



        <v-row>
            <p class="font-weight-black text-h7">Exit Form Release Date</p>
        </v-row>

        <v-row>
            <v-col cols="6">
                <v-text-field
                    label="Exit Form Release Date"
                    type="date"
                    v-model="exitFormReleaseDate"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-btn @click="goBack" style="margin-right: 10px;">
                Cancel
                </v-btn>
                <v-btn style="text-align: center;" @click="handleSubmitForm">Submit</v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto" v-if="canExpInstanceBeDeleted">
                <v-btn @click="showDeleteDialog = true">Delete</v-btn>
            </v-col>
        </v-row>
    </v-form>
</v-container>
<!-- Delete Dialog -->
<v-dialog v-model="showDeleteDialog" persistent width="auto">
    <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this experience instance?</v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="showDeleteDialog = false">No</v-btn>
            <v-btn color="green darken-1" text @click="confirmDelete">Yes</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";
import { setTransitionHooks } from "vue";

export default {
    name: 'instructorSpecificExperienceInstance',
    data() {
        return {
            sessionData: {},
            experienceData: {},
            selectedSessionID: null,
            selectedExperienceID: null,
            exitFormReleaseDate: null,
            canExpInstanceBeDeleted: false,
            showDeleteDialog: false,
            activityData: [],
            originalExpInstanceName: "",
            selectedActivities: [],
            originalActivities: [],
            activitySearch: "",
            activityHeaders: [
                {
                title: "Activity Name",
                value: "activityName",
                key: "activityName",
                align: "start",
                sortable: true
                }
            ],
            hoveredItem: null,
        }
    },
    async created() {
        await this.fetchActivityData();
        this.fetchExperienceInstance();
        this.checkIfExpInstanceCanBeDeleted();
    },

    computed: {
        filteredActivityData() {
            // Check if selectedActivities is not empty
            if (this.selectedActivities && this.selectedActivities.length > 0) {
                // Return activities from activityData not present in selectedActivities
                return this.activityData.filter(activity => 
                    !this.selectedActivities.some(selectedActivity => 
                        selectedActivity._id === activity._id
                    )
                );
            } else {
                // If no activities are selected, return all activities
                return this.activityData;
            }
        }
    },
    
    methods: {

      // Fetches data for a specific experience instance identified by the instance ID in the route parameters. Retrieves information such as the session ID, experience ID, and exit form release date from the backend API. Additionally, filters and retrieves the relevant activities associated with the instance. Finally, fetches details for the session and experience related to this instance. If there's an error during the process, handles the error.
        async fetchExperienceInstance() {
            const instanceID = this.$route.params.id; // Get instance ID from route parameter
            const user = useLoggedInUserStore();
            let token = user.token;
            let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/${instanceID}`;

            try {
                const response = await axios.get(apiURL, { headers: { token } });
                const instanceData = response.data;
                this.selectedSessionID = instanceData.sessionID;
                this.selectedExperienceID = instanceData.experience.id;
                this.exitFormReleaseDate = instanceData.exitFormReleaseDate.slice(0, 10); // Format date as 'YYYY-MM-DD'

                this.selectedActivities = this.activityData.filter(activity =>
                    instanceData.activities.some(instanceActivity => instanceActivity.id === activity._id)
                );

                // Fetch session and experience details
                this.fetchSessionDetails();
                this.fetchExperienceDetails();
            } catch (error) {
                this.handleError(error);
            }
        },

        // Retrieves details for the session associated with the current experience instance. Utilizes the session ID obtained from the instance data to fetch session information from the backend API. Stores the retrieved session data for further use. 
        async fetchSessionDetails() {
            const user = useLoggedInUserStore();
            let token = user.token;
            let sessionAPIURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/${this.selectedSessionID}`;
            
            try {
                const sessionResponse = await axios.get(sessionAPIURL, { headers: { token } });
                this.sessionData = sessionResponse.data;
            } catch (error) {
                this.handleError(error);
            }
        },

        // Retrieves details for the experience associated with the current experience instance. Utilizes the experience ID obtained from the instance data to fetch experience information from the backend API. Stores the retrieved experience data for further use.
        async fetchExperienceDetails() {
            const user = useLoggedInUserStore();
            let token = user.token;
            let experienceAPIURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/${this.selectedExperienceID}`;

            try {
                const experienceResponse = await axios.get(experienceAPIURL, { headers: { token } });
                this.experienceData = experienceResponse.data;
            } catch (error) {
                this.handleError(error);
            }
        },

        // Retrieves activity data from the backend API. Filters the retrieved activities to include only those with an active status. Stores the filtered activity data for further use.
        async fetchActivityData() {
            const user = useLoggedInUserStore();
            let token = user.token;
            let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;

            try {
                const response = await axios.get(apiURL, { headers: { token } });
                const activities = response.data;
                this.activityData = activities.filter(activity => activity.activityStatus === true);
                this.originalActivityData = [...this.activityData];
            } catch (error) {
                this.handleError(error);
            }
        },

        // Checks if the current experience instance can be deleted. Retrieves the instance ID from the route parameter and sends a request to the backend API to determine if the instance can be deleted. Sets a flag based on the response indicating whether the instance can be deleted or not.
        async checkIfExpInstanceCanBeDeleted() {
            const user = useLoggedInUserStore();
            const token = user.token;
            const instanceID = this.$route.params.id; // Get instance ID from route parameter
            const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instance/can-be-deleted/${instanceID}`;

            try {
                const response = await axios.get(url, { headers: { token } });
                this.canExpInstanceBeDeleted = response.data.canBeDeleted;
            } catch (error) {
                this.handleError(error);
            }
        },

        // Executes the deletion of the experience instance and hides the delete dialog.
        confirmDelete() {
            this.deleteExpInstance();
            this.showDeleteDialog = false;
        },

        // Deletes the experience instance from the backend API and redirects to a different page or shows a success message upon successful deletion.
        async deleteExpInstance() {
            const instanceID = this.$route.params.id; // Get instance ID from route parameter
            const user = useLoggedInUserStore();
            const token = user.token;
            const url = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instance/delete/${instanceID}`;

            try {
                await axios.delete(url, { headers: { token } });

                // Redirect to a different page or show a success message
                this.$router.push({
                    name: 'instructorDataManagement',
                    params: {
                        activeTab: 0,
                        toastType: 'success',
                        toastMessage: 'Experience Instance Deleted!',
                        toastPosition: 'top-right',
                        toastCSS: 'Toastify__toast--create'
                    }
                });
            } catch (error) {
                this.handleError(error);
            }
        },

        // Redirects to the instructor data management page with a specified active tab.
        goBack() {
            this.$router.push({
                name: 'instructorDataManagement',
                params: {
                    activeTab: 0
                }
            });
        },

        // Submits the form data for the experience instance, updating the exit form release date. Upon successful submission, redirects to the instructor data management page with a success message.
        async handleSubmitForm() {
            const user = useLoggedInUserStore();
            let token = user.token;
            const instanceID = this.$route.params.id;
            let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/update-single-instance/${instanceID}`;

            try {
                await axios.put(apiURL, {
                    exitFormReleaseDate: this.exitFormReleaseDate,
                    activities: this.selectedActivities  // Including activities in the payload
                }, { headers: { token } })
                .then(() => {
                    this.$router.push({ 
                        name: 'instructorDataManagement',
                        params: {
                            activeTab: 0,
                            toastType: 'info',
                            toastMessage: 'Experience Instance updated!',
                            toastPosition: 'top-right',
                            toastCSS: 'Toastify__toast--update'
                        }
                    });
                });
            } catch (error) {
                this.handleError(error);
            }
        },

        // Adds the provided activity to the list of selected activities.
        selectActivity(activity) {
            this.selectedActivities.push(activity)
        },

        // Removes the specified activity from the list of selected activities.
        removeActivity(activity) {
            this.selectedActivities = this.selectedActivities.filter(selectedActivity => selectedActivity._id !== activity._id);
        },
    }
}
</script>

<style>
.pointer-cursor {
    cursor: pointer;
}

.activity-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.mdi-close {
  cursor: pointer;
}

.scrollable-table {
    height: 300px; /* Adjust the height as needed */
    overflow-y: auto;
  }

  /* Optional: Style to improve the appearance when scrolling */
  .scrollable-table::-webkit-scrollbar {
    width: 10px;
  }

  .scrollable-table::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .scrollable-table::-webkit-scrollbar-thumb {
    background: #888;
  }

  .scrollable-table::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .scrollable-list {
    height: 370px; /* Adjust the height as needed */
    overflow-y: auto;
  }

  /* Optional: Style to improve the appearance when scrolling */
  .scrollable-list::-webkit-scrollbar {
    width: 10px;
  }

  .scrollable-list::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .scrollable-list::-webkit-scrollbar-thumb {
    background: #888;
  }

  .scrollable-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

</style>