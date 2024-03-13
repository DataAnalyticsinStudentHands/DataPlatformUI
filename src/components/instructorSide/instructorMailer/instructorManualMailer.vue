<template>
<v-container>
    <v-row>
        <v-col class="d-flex justify-center font-weight-black text-h6">
            Manual Mailer
        </v-col>
    </v-row>
    <v-row>
        <v-col class="d-flex justify-center">
            <v-btn
                class="mr-10"
                @click="entryFormsSelection"
                :active="selection === 1"                
            >
                Entry Forms
            </v-btn>
            <v-btn
                @click="selection = 2"
                :active="selection === 2"   
            >
                Goal Forms
            </v-btn>            
        </v-col>
    </v-row>
    <v-row v-if="selection === 1 && entryFormLoading">
        <v-col class="d-flex justify-center">
            <v-progress-circular indeterminate></v-progress-circular>
        </v-col>
    </v-row>
    <v-row v-else-if="selection === 1 && !entryFormLoading">
        <v-col cols="8">
            <v-row>
                <v-col>
                    <v-card
                        flat
                        title="Students Without an Entry Form"
                    >
                        <template v-slot:text>
                            <v-text-field
                                v-model="studentSearch"
                                label="Search"
                                prepend-inner-icon="mdi-magnify"
                                single-line
                                variant="outlined"
                                hide-details
                            ></v-text-field>
                        </template>
                        <v-data-table
                            :headers="studentHeaders"
                            :items="studentsWithoutEntryForm"
                            item-value="_id"
                            items-per-page="-1"
                            class="scrollable-table"
                            hover
                            :search="studentSearch"
                        >
                            <template v-slot:body="{ items }">
                                <template v-for="item in items" :key="item._id">
                                    <tr
                                        @mouseover="hoveredItem = item._id"
                                        @mouseleave="hoveredItem = null"
                                        class="pointer-cursor student-row"
                                    >
                                        <td>
                                            <div class="activity-content">
                                                <td>{{ item.firstName }} {{ item.lastName }}</td>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="activity-content">
                                                <td>{{ item.email }}</td>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                            <template v-slot:bottom></template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
        <v-col>
            Hello
        </v-col>
    </v-row>
</v-container>
{{  }}
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
    name: "InstructorManualMailer",
    data() {
        return {
            mailType: null,
            selection: null,
            studentSearch: null,
            studentsWithoutEntryForm: [],
            studentHeaders: [
                {
                    title: "Student Name",
                    value: "fullName",
                    key: "firstName",
                    align: "start",
                    sortable: true
                },
                {
                    title: "Email",
                    value: "email",
                    key: "email",
                    align: "start",
                    sortable: true
                },
            ],
            entryFormLoading: false,
            hoveredItem: null,
        }
    },

    methods: {
        async entryFormsSelection() {
            this.selection = 1;
            await this.fetchStudentsWithoutEntryForm();
        },

        async fetchStudentsWithoutEntryForm() {
            this.entryFormLoading = true;
            // const user = useLoggedInUserStore();
            // let token = user.token;
            const token = import.meta.env.VITE_TOKEN;
            let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/students-without-entry-form';
    
            try {
            const response = await axios.get(url, { headers: { token } });
            this.studentsWithoutEntryForm = response.data;
            console.log('this.studentsWithoutEntryForm: ', this.studentsWithoutEntryForm);
            } catch (error) {
                this.handleError(error);
            } finally {
                this.entryFormLoading = false;
            }
        },
    },
}
</script>

<style scoped>

.pointer-cursor {
    cursor: pointer;
}

.student-content {
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