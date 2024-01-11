<template>
<v-container>
    <!-- Sessions Title -->
    <v-row>
        <v-col>
            <p class="d-flex justify-center font-weight-black text-h6">
                Sessions
            </p>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card flat>
                <!-- Top Management Row -->
                <v-card-title>
                    <v-row class="d-flex justify-start">
                        <v-col md="6">
                            <!-- Search Fields -->
                            <v-text-field
                                v-model="sessionSearch"
                                density="comfortable"
                                :label="searchLabel"
                                flat
                                hide-details
                                variant="solo-filled"
                            >
                                <!-- Search Menu Icons -->
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
                                            >
                                                <v-list-item-title>{{ item }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>
                                <template v-slot:append-inner>
                                    <div class="pointer-cursor mr-3">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </div>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-title>
                <!-- Data Table -->
                <v-data-table
    :headers="sessionHeaders"
    :items="sessionData"
    item-key="_id"
    v-model="selectedSessions"
    hover
    return-object
>
    <!-- Custom Slot for Table Body -->
    <template v-slot:body="{ items }">
        <tr v-for="item in items" :key="item._id" @click="editSession(item)" class="pointer-cursor">
            <td>
                <v-checkbox-btn density="compact" @click.stop="toggleSelection(item)"></v-checkbox-btn>
            </td>
            <!-- Render Session Name -->
            <td>{{ item.sessionName }}</td>
            <!-- Render Start Date -->
            <td>{{ formatDate(item.sessionPeriod.startDate) }}</td>
            <!-- Render End Date -->
            <td>{{ formatDate(item.sessionPeriod.endDate) }}</td>
        </tr>
    </template>
</v-data-table>



            </v-card>
        </v-col>
    </v-row>
</v-container>
<br><br><br>
sessionData:
<br>
{{ sessionData }}
<br><br><br>
selectedSessions:
<br>
{{ selectedSessions }}
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
        sessionSearch: "",
        searchLabel: "Search by Session Name",
        searchMenuItems: [
            "Session Name",
            "Start Date",
            "End Date"
        ],
        sessionHeaders: [
            {
                title: "",
                sortable: false,
                align: "center",
                width: "30px"
            },
            {
                title: "Session Name",
                value: "sessionName",
                align: "start",
                sortable: true
            },
            {
                title: "Start Date",
                value: "sessionPeriod.startDate",
                align: "start",
                sortable: true
            },
            {
                title: "End Date",
                value: "sessionPeriod.endDate",
                align: "start",
                sortable: true
            }
        ],
        selectedSessions: [],



    sessionData: [],
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
},
methods: {
    async fetchSessionData() {
        try {
            const user = useLoggedInUserStore();
            // let token = user.token;

            const token = `
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI5NTAyYjE5MC01MDBlLTExZWUtYmIzYy04NWUwMjgxZTljOGEiLCJ1c2VyUm9sZSI6Ikluc3RydWN0b3IiLCJvcmdJRCI6IjY0ZTNiN2Y0YWY2YmFlMzZiZjQyZDUxYiIsImlhdCI6MTcwNDk4NDg5MSwiZXhwIjoxNzA0OTk2ODkxfQ.T-nWbVKugDaSbgmCMwSWWDNPMNq4dmahpmovRSj4-QE
            `
            let apiURL = import.meta.env.VITE_ROOT_API + `/instructorSideData/sessions/`;
            const resp = await axios.get(apiURL, { headers: { token } });
            this.sessionData = resp.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    editSession(session) {
        console.log("Edit Session: ", session);
    },

    formatDate(datetimeDB) {
        const formattedDate = DateTime.fromISO(datetimeDB).toFormat('MM-dd-yyyy');
        return formattedDate;
    },

    isSelected(item) {
        return this.selectedSessions.some((selectedItem) => selectedItem._id === item._id);
    },
    toggleSelection(item) {
        const index = this.selectedSessions.findIndex((selectedItem) => selectedItem._id === item._id);
        if (index >= 0) {
            // Already selected, remove it
            this.selectedSessions.splice(index, 1);
        } else {
            // Not selected, add it
            this.selectedSessions.push(item);
        }
    },
},
};
</script>


<style>

.hoverRow {
    background-color: rgb(200, 201, 205);
    transition: background-color 0.3s ease-in-out;
}


.pointer-cursor {
  cursor: pointer;
}

.full-width-height {
    width: 100%;
    height: 100%;
    cursor: pointer;
}

</style>
