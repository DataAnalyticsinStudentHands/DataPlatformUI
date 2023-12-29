<!--'/instructorExperiences' this page will only show experiences-->
<template>
    <v-container>
        <!-- Tabs for Navigation -->
        <v-row>
            <v-col>
                <v-tabs
                    fixed-tabs
                >
                    <v-tab>
                        <!-- <router-link to="/instructorSemesters">Semesters</router-link> -->
                        Sessions
                    </v-tab>
                    <v-tab>
                        <!-- <router-link to="/instructorExperiences">Experiences</router-link> -->
                        Experiences
                    </v-tab>
                    <v-tab>
                        <!-- <router-link to="/instructorActivities">Activities</router-link> -->
                        Activities
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <div class="d-flex justify-center font-weight-black text-h6">
                    {{  showInactive ? 'Inactive' : 'Active' }} Experiences
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-row>
                            <!-- Search -->
                            <v-col cols="5">
                                <v-text-field
                                    v-model="experienceSearch"
                                    density="comfortable"
                                    :label=searchLabel
                                    flat
                                    hide-details
                                    variant="solo-filled"
                                >
                                    <!-- Prepend Icon with Menu -->
                                    <template v-slot:prepend-inner="{ blur }">
                                    <v-menu>
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
                                            @click="console.log(item)"
                                        >
                                            <v-list-item-title>{{ item }}</v-list-item-title>
                                        </v-list-item>
                                        </v-list>
                                    </v-menu>
                                    </template>
                                </v-text-field>
                            </v-col>


                            <!-- Add New Experience Button -->
                            <v-col cols="7" class="text-end align-self-center">
                                <v-btn 
                                    @click="console.log('Add New Experience')"
                                    elevation="1"
                                    prepend-icon="mdi-plus"
                                >
                                    Add New Experience
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table
                        :headers="dynamicExperienceHeaders"
                        :items="experienceData"
                        item-key="_id"
                        item-value="_id"
                        show-select
                        v-model="selectedExperiences"
                    >
                        <template v-if="$vuetify.display.mdAndUp" v-slot:item.actions="{ item }">
                            <v-icon
                                v-if="isSingleSelection"
                                size="small"
                                class="me-2"
                                @click="console.log('edit item')"
                            >
                                mdi-pencil
                            </v-icon>
                            <v-icon
                                size="small"
                                class="me-2"
                                @click="console.log('deactivate item')"
                            >
                                mdi-minus-circle-outline
                            </v-icon>
                            <v-icon
                                size="small"
                                @click="console.log('delete item')"
                            >
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>


                    <!-- Skeleton Loader Add Afterwards -->
                    <!-- <v-data-table :loading="!loading" :items="experienceData">
                        <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                    </v-data-table> -->


                </v-card>
            </v-col>
        </v-row>


    </v-container>




    <br><br><br><br><br><br><br><br><br>

    {{ experienceData }}










    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>




    <main>
      <div><center>
        <br>
        <h2>
          <router-link to="/instructorSemesters">Semesters</router-link> |
          <router-link to="/instructorExperiences">Experiences</router-link> |
          <router-link to="/instructorActivities">Activities</router-link>
        </h2><br>
        <p class="font-weight-black text-h6">
          {{ showInactive ? 'Inactive' : 'Active' }} Experiences
        </p>
  
        <br><v-btn style="text-align:center; margin-right:2rem;">
          <router-link to="/instructorAddExperience">Add New Experience</router-link>
        </v-btn>
  
        <v-btn @click="toggleShowInactive">
          {{ showInactive ? 'Show Active Experiences' : 'Show Inactive Experiences' }}
        </v-btn>
        
        <br><br>
  
        <v-btn @click="deactivateExperiences" v-if="selectedExperiences.length > 0 && !showInactive" style="text-align:center; margin-right:2rem;">
          Deactivate
        </v-btn>
  
        <v-btn @click="activateExperiences" v-if="selectedExperiences.length > 0 && showInactive">
          Activate
        </v-btn>
        
        <br><br>
        <v-text-field
          v-model="searchQuery"
          label="Search by experience category or name"
          solo-inverted
          hide-details
          outlined
          dense
        ></v-text-field>
        <br></center>
      </div>
      <div v-if="loading" justify="center" align="center">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else style="display: flex; justify-content: center;">
    <div style="max-height: 400px; overflow-y: auto;">
        <v-table style="width: 100%">
          <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">Experience Category</th>
              <th class="text-left">Experience Name</th>
            <th></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="experience in filteredExperienceData" 
              :key="experience._id"
              :style="{ cursor: 'pointer' }"
              :class="{ 'hoverRow': hoverId === experience._id}"
              @mouseenter="hoverId = experience._id"
              @mouseleave="hoverId = null"
              >
  
              <td class="text-left">
                <input type="checkbox" v-model="selectedExperiences" :value="experience._id" style="outline: 2px solid #808080; margin-right: 10px;">
              </td>
  
              <td class="text-left" @click="editExperience(experience._id)">{{ experience.experienceCategory }}</td>
              <td class="text-left" @click="editExperience(experience._id)">{{ experience.experienceName }}</td>
  
            </tr>
          </tbody>
        </v-table></div>
      </div>
    </main>
  </template>
  
  <script>
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import axios from "axios";
  import { DateTime } from "luxon";
  
  export default {
    data() {
      return {
        experienceData: [],
        showInactive: false,
        selectedExperiences: [],
        searchQuery: '',
        hoverId: null,
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
                title: 'Actions', 
                value: 'actions', 
                sortable: false 
            },
        ],
        experienceSearch: "",
        searchMenuItems: ['Option 1', 'Option 2', 'Option 3'],
        searchLabel: "Search All Text Columns",
      };
    },
  
    mounted() {
      useLoggedInUserStore().startLoading();
      this.fetchExperienceData()
      .then(() => {
        useLoggedInUserStore().stopLoading();
      })
      .catch(() => {
        this.handleError(error);
        useLoggedInUserStore().stopLoading();
      });
  
      window.scrollTo(0, 0);
      if (this.$route.params.toastType) {
        toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
          position: this.$route.params.toastPosition,
          toastClassName: this.$route.params.toastCSS
        });
      }
    },
    methods: {
  
      async fetchExperienceData() {
        try {
          const user = useLoggedInUserStore();
        //   let token = user.token;
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwMzgyNzU2NywiZXhwIjoxNzAzODM5NTY3fQ._JinVkUPOIdnLaNDoJqMWsXL-3EfU_4rQORi_rwYDyI'
          let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experiences/";
          const resp = await axios.get(apiURL, { headers: { token } });
          this.experienceData = resp.data;
        } catch (error) {
          this.handleError(error);
          throw error
        }
      },
  
  
      formatDate(datetimeDB) {
        return DateTime.fromISO(datetimeDB).toFormat("MM-dd-yyyy");
      },
  
      editExperience(experienceID) {
        this.$router.push({ name: "instructorSpecificExperience", params: { id: experienceID } });
      },
  
      toggleShowInactive() {
        this.showInactive = !this.showInactive;
        this.selectedExperiences = [];
      },
  
      deactivateExperiences() {
        const user = useLoggedInUserStore();
        // let token = user.token;
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwMzgyNzU2NywiZXhwIjoxNzAzODM5NTY3fQ._JinVkUPOIdnLaNDoJqMWsXL-3EfU_4rQORi_rwYDyI'
        const updateStatus = { experienceStatus: false };
  
        const promises = this.selectedExperiences.map((experienceID) => {
          let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/${experienceID}`;
          return axios.put(apiURL, updateStatus, { headers: { token } });
        });
  
        Promise.all(promises)
          .then(() => {
            const message = (this.selectedExperiences.length === 1 ? 'Experience' : 'Experiences') + ' deactivated!'
            this.selectedExperiences = [];
            this.fetchExperienceData();
  
            toast.success(message, {
                position: 'top-right',
                toastClassName: 'Toastify__toast--create'
              });
            })
            
          .catch((error) => {
            this.handleError(error);
          });
      },
  
      activateExperiences() {
        const user = useLoggedInUserStore();
        // let token = user.token;
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxODE3MDM0NzI1MDAxMjIiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwMzgyNzU2NywiZXhwIjoxNzAzODM5NTY3fQ._JinVkUPOIdnLaNDoJqMWsXL-3EfU_4rQORi_rwYDyI'
        const updateStatus = { experienceStatus: true };
  
        const promises = this.selectedExperiences.map((experienceID) => {
          let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experiences/${experienceID}`;
          return axios.put(apiURL, updateStatus, { headers: { token } });
        });
  
        Promise.all(promises)
          .then(() => {
            const message = (this.selectedExperiences.length === 1 ? 'Experience' : 'Experiences') + ' activated!'
            this.selectedExperiences = [];
            this.fetchExperienceData();
            toast.success(message, {
                position: 'top-right',
                toastClassName: 'Toastify__toast--create'
            });
          })
          .catch((error) => {
            this.handleError(error);
          });
      },
  
    },
  
    computed: {
      filteredExperienceData() {
        const query = this.searchQuery.toLowerCase().trim();
        if (this.showInactive) {
          return this.experienceData.filter(
            (experience) =>
              !experience.experienceStatus &&
              (experience.experienceCategory.toLowerCase().includes(query) ||
                experience.experienceName.toLowerCase().includes(query))
          );
        } else {
          return this.experienceData.filter(
            (experience) =>
              experience.experienceStatus &&
              (experience.experienceCategory.toLowerCase().includes(query) ||
                experience.experienceName.toLowerCase().includes(query))
          );
        }
      },
      loading() {
        const store = useLoggedInUserStore()
        return store.loading;
      },
      isSingleSelection() {
        return this.selectedExperiences.length <= 1;
      },
      dynamicExperienceHeaders() {
        // Filter out the Actions column if the screen size is smaller than medium
        return this.$vuetify.display.mdAndUp
            ? this.experienceHeaders
            : this.experienceHeaders.filter(header => header.value !== 'actions');
        }
    }
  
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
  
  .hoverRow {
      background-color: rgb(200, 201, 205);
      transition: background-color 0.3s ease-in-out;
    }

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
  