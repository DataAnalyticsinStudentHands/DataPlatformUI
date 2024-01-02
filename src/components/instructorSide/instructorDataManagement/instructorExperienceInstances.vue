<template>
    <main>
      <div class="text-center">
        <br>
        <p class="font-weight-black text-h6">
          {{ showInactive ? 'Inactive' : 'Active' }} Experience Instances
        </p>
  
        <br><v-btn style="text-align:center; margin-right:2rem;">
          <router-link to="/instructorAddExperienceInstance">Add New Instance</router-link>
        </v-btn>
  
        <v-btn @click="toggleShowInactive">
          {{ showInactive ? 'Show Active Instances' : 'Show Inactive Instances' }}
        </v-btn>

        <v-row class="d-flex justify-center mt-5">

          <v-btn @click="deactivateInstances" v-if="selectedInstances.length > 0 && !showInactive" class="align-center" style="text-align:center; margin-right:2rem;">
            Deactivate
          </v-btn>

        <v-btn @click="activateInstances" v-if="selectedInstances.length > 0 && showInactive" style="text-align:center; margin-right:2rem;">
          Activate
        </v-btn>

        </v-row>

        
        <br><br>

      </div>



      <div v-if="loading" class="text-center">
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
                <th class="text-left">Session Name</th>
                <th class="text-left">Exit Form Release Date</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="instance in filteredExperienceInstances" 
                :key="instance._id"
                :style="{ cursor: 'pointer' }"
                :class="{ 'hoverRow': hoverId === instance._id}"
                @mouseenter="hoverId = instance._id"
                @mouseleave="hoverId = null"
              >
                <td class="text-left">
                  <v-checkbox 
                    v-model="selectedInstances" 
                    :value="instance._id" 
                    :key="`checkbox-${instance._id}`"
                    hide-details
                    ></v-checkbox>
                </td>
                <td class="text-left" @click="editInstance(instance._id)">{{ instance.experience.category }}</td>
                <td class="text-left" @click="editInstance(instance._id)">{{ instance.experience.name }}</td>
                <td class="text-left" @click="editInstance(instance._id)">{{ instance.session.name }}</td>
                <td class="text-left" @click="editInstance(instance._id)">{{ formatDate(instance.exitFormReleaseDate) }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>

    </main>

    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    experienceInstancesData: {{ experienceInstancesData }}
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
        showInactive: false,
        experienceInstancesData: [],
        selectedInstances: [],
        hoverId: null,
      };
    },
  
    created() {
      this.fetchExperienceInstances();
    },

  
    computed: {
      filteredExperienceInstances() {
        return this.experienceInstancesData.filter(instance => 
          this.showInactive ? !instance.expInstanceStatus : instance.expInstanceStatus
        );
      },
      loading() {
        const store = useLoggedInUserStore()
        return store.loading;
      }
    },

    methods: {
      async fetchExperienceInstances() {
        useLoggedInUserStore().startLoading();
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/experience-instances`;
        try {
          const response = await axios.get(apiURL, { headers: { token } });
          this.experienceInstancesData = response.data;
        } catch (error) {
          console.error('Error fetching experience instances:', error);
          this.handleError(error);
        } finally {
          useLoggedInUserStore().stopLoading();
        }
      },

      formatDate(datetimeDB) {
        return DateTime.fromISO(datetimeDB, { zone: 'utc' }).toFormat("MM-dd-yyyy");
      },

      toggleShowInactive() {
        this.showInactive = !this.showInactive;
      },

      async deactivateInstances() {
        await this.updateInstancesStatus(false);
      },

      async activateInstances() {
        await this.updateInstancesStatus(true);
      },

      async updateInstancesStatus(status) {
        const user = useLoggedInUserStore();
        let token = user.token;

        // Prepare the payload with the array of instance IDs and the new status
        const payload = {
          instanceIDs: this.selectedInstances,
          status: status
        };

        let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experience-instances/update-status";

        try {
          // Send a single PUT request with all instance IDs and the desired status
          const response = await axios.put(apiURL, payload, { headers: { token } });

          const message = this.selectedInstances.length === 1 ? 'Instance' : 'Instances';
          toast.success(`${message} ${status ? 'activated!' : 'deactivated!'}`, {
              position: 'top-right',
              toastClassName: 'Toastify__toast--create'
          });

          // Clear the selected instances and refresh the data
          this.selectedInstances = [];
          this.fetchExperienceInstances();
        } catch (error) {
          this.handleError(error);
        }
      },

      editInstance(instanceID) {
        this.$router.push({ name: "instructorSpecificExperienceInstance", params: { id: instanceID } });
      },

    },
  };
  </script>
  
<style>

  .hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
  }
  </style>
  