<template>
    <main class="">
      <div class="text-center">
        <br>
        <p class="font-weight-black text-h6">
          {{ showInactive ? 'Archived' : '' }} Sessions
        </p>
        <br><v-btn style="text-align:center; margin-right:2rem;">
          <router-link class="" to="/instructorAddSession">Add New Session</router-link>
        </v-btn>
  
        <v-btn style="text-align:center" @click="toggleShowInactive">
          {{ showInactive ? 'Show Sessions' : 'Show Archived Sessions' }}
        </v-btn>     
  
        <br><br>
  
        <v-btn style="text-align:center; margin-right:2rem;" @click="deactivateSessions" v-if="selectedSessions.length > 0 && !showInactive">
          Archive
        </v-btn>
  
        <v-btn style="text-align:center" @click="activateSessions" v-if="selectedSessions.length > 0 && showInactive">
          Activate
        </v-btn>
        <br><br>
        <v-text-field v-model="searchTerm" placeholder="Search by session name or date ranges"></v-text-field>
      </div>
  
      <div v-if="loading" justify="center" align="center">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else style="display: flex; justify-content: center;">
        <div style="max-height: 400px; overflow-y: auto;">
          <v-table style="width: 100%">
            <thead>
              <tr>
                <th class="text-left column-margin"></th>
                <th class="text-left column-margin">Session</th>
                <th class="text-left column-margin">Date Ranges</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="session in filteredSessionData" 
                :key="session._id"
                :style="{ cursor: 'pointer' }"
                :class="{ 'hoverRow': hoverId === session._id}"
                @mouseenter="hoverId = session._id"
                @mouseleave="hoverId = null"
                >
  
                <td class="text-left">
                  <input type="checkbox" v-model="selectedSessions" :value="session._id" style="outline: 2px solid #808080; margin-right: 10px;">
                </td>
  
                <td class="text-left" @click="editSession(session._id)">{{ session.sessionName }}</td>
  
                <td class="text-left" @click="editSession(session._id)">{{ formatDate(session.sessionPeriod.startDate) + " to " + formatDate(session.sessionPeriod.endDate) }}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </v-table>
        </div>
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
    components: {
    },
    data() {
      return {
        sessionData: [],
        showInactive: false,
        selectedSessions: [],
        searchTerm: "",
        hoverId: null,
      };
    },
    mounted() {
      useLoggedInUserStore().startLoading();
      this.fetchSessionData()
        .then(() => {
          useLoggedInUserStore().stopLoading();
        })
        .catch((error) => {
          this.handleError(error);
          useLoggedInUserStore().stopLoading();
        });
      window.scrollTo(0, 0);
    },
    methods: {
      formatDate(datetimeDB) {
        const formattedDate = DateTime.fromISO(datetimeDB).toFormat('MM-dd-yyyy');
        return formattedDate;
      },
  
      editSession(sessionID) {
        this.$router.push({ name: "instructorSpecificSession", params: { id: sessionID } });
      },
  
      async fetchSessionData() {
        try {
          const user = useLoggedInUserStore();
          let token = user.token;
          let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/`;
          const resp = await axios.get(apiURL, { headers: { token } });
          this.sessionData = resp.data;
        } catch (error) {
          this.handleError(error);
          throw error;
        }
      },
  
  
      toggleShowInactive() {
        this.showInactive = !this.showInactive;
        this.selectedSessions = [];
      },
  
      async deactivateSessions() {

        useLoggedInUserStore().startLoading();

        try {

          const user = useLoggedInUserStore();
          const token = user.token;
          const updateStatus = { sessionStatus: false };

          for (const sessionID of this.selectedSessions) {
            const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/${sessionID}`;
            await axios.put(apiURL, updateStatus, { headers: { token } });
          }

          toast.success(this.selectedSessions.length === 1 ? 'Session archived!' : 'Sessions archived!', {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create'
          });

        } catch (error) {
          this.handleError(error);
        } finally {
          this.selectedSessions = [];
          await this.fetchSessionData();
          useLoggedInUserStore().stopLoading();
        }
      },
      
      async activateSessions() {
        useLoggedInUserStore().startLoading();
        try {
          const user = useLoggedInUserStore();
          const token = user.token;
          const updateStatus = { sessionStatus: true };

          for (const sessionID of this.selectedSessions) {
            const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/sessions/${sessionID}`;
            await axios.put(apiURL, updateStatus, { headers: { token } });
          }

          toast.success(this.selectedSessions.length === 1 ? 'Session activated!' : 'Sessions activated!', {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create'
          });

        } catch (error) {
          this.handleError(error);
        } finally {
          this.selectedSessions = [];
          await this.fetchSessionData();
          useLoggedInUserStore().stopLoading();
        }
      },
    },
  
    computed: {
      filteredSessionData() {
        const searchTerm = this.searchTerm.toLowerCase();
        const filteredData = this.sessionData.filter((session) => {
          const sessionName = session.sessionName.toLowerCase();
          const startDateFormatted = this.formatDate(session.sessionPeriod.startDate);
          const endDateFormatted = this.formatDate(session.sessionPeriod.endDate);
          const dateRange = startDateFormatted + " to " + endDateFormatted;
          
          return sessionName.includes(searchTerm) ||
            startDateFormatted.includes(searchTerm) ||
            endDateFormatted.includes(searchTerm) ||
            dateRange.includes(searchTerm);
          
        });
  
        if (this.showInactive) {
          return filteredData.filter((session) => !session.sessionStatus);
        } else {
          return filteredData.filter((session) => session.sessionStatus);
        }
      },
      loading() {
        const store = useLoggedInUserStore();
        console.log('loading: ', store.loading);
        return store.loading;
      }
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
  
  .hoverRow {
      background-color: rgb(200, 201, 205);
      transition: background-color 0.3s ease-in-out;
    }
  
  
  </style>
  