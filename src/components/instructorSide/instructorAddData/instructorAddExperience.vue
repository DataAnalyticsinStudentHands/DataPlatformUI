<!--'/instructorAddExperience' this view presents a form to create a new Experience-->
<template>
  <main>
    <v-form @submit.prevent="handleSubmitForm">
      <v-container>
        <p class="font-weight-black text-h6">New Experience</p>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="experience.experienceCategory" label="Experience Category"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="experience.experienceName" label="Experience Name"></v-text-field>
          </v-col>
        </v-row>
        <!-- <v-row>
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
                      @click.stop="removeSelectedActivity(activity)"
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
                :items="activities"
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
        </v-row> -->
        <v-row>
          <v-col>
            <v-btn @click="$router.back()">
              Cancel
            </v-btn>
            <v-btn style="text-align: center; margin-left: 10px;" @click="handleSubmitForm">Submit</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </main>
</template>

<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  data() {
    return {
      experience: {
        experienceCategory: '',
        experienceName: '',
      },
      activities: [],
      originalActivities: [],
      activityHeaders: [
        {
          title: "Activity Name",
          value: "activityName",
          key: "activityName",
          align: "start",
          sortable: true
        }
      ],
      selectedActivities: [],
      activitySearch: "",
      hoveredItem: null,
    };
  },
  beforeMount() {
    window.scrollTo(0, 0);
    this.fetchActivityData();
  },
  methods: {

    fetchActivityData() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/`;
      axios
        .get(apiURL, { headers: { token } })
        .then((resp) => {
          const activities = resp.data;
          this.activities = activities.filter((activity) => activity.activityStatus === true);
          this.originalActivities = [...this.activities];
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    handleSubmitForm() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experiences/`;
      axios
        .post(apiURL, {
          experienceCategory: this.experience.experienceCategory,
          experienceName: this.experience.experienceName,
          activities: this.selectedActivities.map(activity => activity._id),
        }, {
          headers: { token },
        })
        .then(() => {
          this.$router.push({ 
              name: 'instructorDataManagement',
              params: {
                activeTab: 2,
                toastType: 'success',
                toastMessage: 'Experience added!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
            }
          });
        })
        .catch((error) => {
          this.handleError(error);
        });
    },
    selectActivity(activity) {
      // Add to selectedActivities
      this.selectedActivities.push(activity);

      // Remove from the activities list
      this.activities = this.activities.filter(a => a._id !== activity._id);
    },

    removeSelectedActivity(activity) {
      // Remove from selectedActivities
      this.selectedActivities = this.selectedActivities.filter(a => a._id !== activity._id);

      // Find original index in the originalActivities array
      const originalIndex = this.originalActivities.findIndex(a => a._id === activity._id);

      // Check if the activity is already in the activities list
      const alreadyPresent = this.activities.some(a => a._id === activity._id);

      // Re-insert at the original position if not present
      if (!alreadyPresent && originalIndex !== -1) {
        this.activities.splice(originalIndex, 0, activity);
      }
    },
  },
};
</script>

<style scoped>
#contentNavbar .nav-link.router-link-exact-active {
  background-color: #eee;
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
