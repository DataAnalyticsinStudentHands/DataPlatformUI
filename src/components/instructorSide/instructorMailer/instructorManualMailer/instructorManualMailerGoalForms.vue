<!-- instructorManualMailerGoalForms - this view allows bulk email sending for selected students who have not yet completed their Goal Setting Forms for a Registration -->
<template>
<div v-if="viewLoading">
<v-row>
    <v-col class="d-flex justify-center">
        <v-progress-circular indeterminate></v-progress-circular>
    </v-col>
</v-row>
</div>
<div v-else-if="!viewLoading">
<v-row>
    <v-col cols="12">
        <v-card flat>
            <v-card-title class="pa-4 d-flex justify-space-between align-center">
                Students Without Goal Forms
            </v-card-title>
            
            <v-card-subtitle class="text-h6">
                <v-row>
                <v-col>
                    Select an Experience
                </v-col>
                </v-row>
            </v-card-subtitle>
    
            <v-container>
            <v-row>
                <v-col cols="12" sm="8" md="8">
                <v-autocomplete
                    v-model="selectedExperience"
                    :items="formattedExperiences"
                    label="Experience"
                    item-title="text"
                    item-value="value"
                    clearable
                    active
                ></v-autocomplete>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                <v-btn
                    @click="fetchStudents()"
                    :disabled="!selectedExperience"
                >Fetch Students</v-btn>
                </v-col>
            </v-row>
            </v-container>
        </v-card>
        </v-col>
    </v-row>
    <div v-if="studentsLoading">
        <v-row>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate></v-progress-circular>
            </v-col>
        </v-row>
    </div>
    <div v-else-if="!studentsLoading && studentsWithoutGoalForms && studentsWithoutGoalForms.length">
        <v-row>
            <v-col cols="12">
                <div class="text-h6 pa-4">
                Total Students: {{ totalStudentsCount }}
                </div>
            </v-col>
        </v-row>
    <v-row>
        <v-col cols="5">
            <v-card
                flat
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
                    :items="filteredStudentsWithoutGoalForm"
                    item-value="_id"
                    items-per-page="-1"
                    class="scrollable-table"
                    hover
                >
                    <template v-slot:body="{ items }">
                        <template v-for="item in items" :key="item._id">
                            <tr
                                @click="toggleSelection(item._id)"
                                @mouseover="hoveredItem = item._id"
                                @mouseleave="hoveredItem = null"
                                :class="['pointer-cursor student-row', selectedStudents.includes(item._id) ? 'light-red-bg' : '']"
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
            <v-row class="mt-3">
                <v-col>
                    <v-btn @click="selectAllStudents">Select All</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <!-- Action Buttons Column -->
        <v-col cols="2" class="text-center d-flex align-center justify-center">
            <div>
                <v-row class="mb-2">
                <v-btn @click="addSelectedToEmailRecipients">
                    <v-icon>mdi-chevron-double-right</v-icon>
                </v-btn>
                </v-row>
                <v-row>
                <v-btn @click="removeSelectedFromEmailRecipients">
                    <v-icon>mdi-chevron-double-left</v-icon>
                </v-btn>
                </v-row>
            </div>
        </v-col>
        <v-col cols="5">
            <v-card
                flat
                title="Email Recipients"
            >
                <template v-slot:text>
                    <v-text-field
                        v-model="emailRecipientSearch"
                        label="Search"
                        prepend-inner-icon="mdi-magnify"
                        single-line
                        variant="outlined"
                        hide-details
                    ></v-text-field>
                </template>
                <v-data-table
                    :headers="studentHeaders"
                    :items="filteredEmailRecipients"
                    item-value="_id"
                    items-per-page="-1"
                    class="scrollable-table"
                    hover
                >
                    <template v-slot:body="{ items }">
                        <template v-for="item in items" :key="item._id">
                            <tr
                                @click="toggleEmailSelection(item._id)"
                                @mouseover="hoveredItem = item._id"
                                @mouseleave="hoveredItem = null"
                                :class="['pointer-cursor student-row', selectedEmailRecipients.includes(item._id) ? 'light-red-bg' : '']"
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
            <v-row class="mt-3">
                <v-col>
                    <v-btn @click="selectAllEmailRecipients">Select All</v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <v-row><v-col></v-col></v-row>
    <v-row>
        <v-col>
            <v-checkbox
                v-model="includeSpanish"
                label="Include Translation"
                hide-details    
            ></v-checkbox>
            <div class="text-subtitle-2 ml-4">Write a message in English and Spanish. Students will receive one based on their "Language Preference"</div>
        </v-col>
    </v-row>
    <div v-if="!includeSpanish">
        <v-row>
            <v-col class="d-flex text-h6">
                Email
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-text-field 
                    v-model="emailHeader"
                    label="Subject Header" 
                    hide-details
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2">
                <v-btn @click="addStudentName">Add Student Name</v-btn>
            </v-col>
        </v-row>
    </div>
    <div v-else>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col class="d-flex text-h6">
                        English Email
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field 
                            v-model="emailHeaderEnglish"
                            label="Subject Header" 
                            hide-details
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <ckeditor :editor="editor" v-model="editorDataEnglish" :config="editorConfig" @ready="onEditorEnglishReady"></ckeditor>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-btn @click="addStudentNameEnglish">Add Student Name</v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-row>
                    <v-col class="d-flex text-h6">
                        Spanish Email
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="emailHeaderSpanish"
                            label="Subject Header" 
                            hide-details
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <ckeditor :editor="editor" v-model="editorDataSpanish" :config="editorConfig" @ready="onEditorSpanishReady"></ckeditor>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-btn @click="addStudentNameSpanish">Add Student Name</v-btn>
                    </v-col>
                </v-row>
        </v-col>
    </v-row>
    </div>
    <v-row>
        <v-col class="d-flex justify-end">
            <v-btn 
                @click="sendEmailDialog = true"
                :disabled="emailDisabled"
            >Send</v-btn>
        </v-col>
    </v-row>
    </div>
</div>

<!-- Confirmation Dialog -->
<v-dialog v-model="sendEmailDialog" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">
            Confirm Email
        </v-card-title>
        <v-card-text>
            <p>Are you sure you want to send emails to <strong>{{ this.emailRecipients.length }}</strong> students?</p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelEmail">
                Cancel
            </v-btn>
            <v-btn color="red darken-2" text @click="sendEmail">
                Yes
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
    name: 'InstructorManualMailerGoalForms',
    components: {
        ckeditor: Ckeditor
    },
    inject: ['setTab'],
    data() {
        return {
            selectedExperience: null,
            expInstances: [],
            studentsWithoutGoalForms: [],
            viewLoading: false,
            studentsLoading: false,
            studentSearch: null,
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
            selectedStudents: [],
            emailRecipients: [],
            selectedEmailRecipients: [],
            emailRecipientSearch: null,
            editorInstance: null,
            editor: ClassicEditor,
            editorData: '',
            editorDataEnglish: '',
            editorDataSpanish: '',
            editorConfig: {
            },
            includeSpanish: false,
            editorEnglishInstance: null,
            editorSpanishInstance: null,
            emailHeader: '',
            emailHeaderEnglish: '',
            emailHeaderSpanish: '',
            sendEmailDialog: false,
        }
    },
    created() {
      this.fetchExperiences();
    },
    computed: {
        formattedExperiences() {
            return this.expInstances.map(instance => ({
                text: `(${instance.sessionName}) ${instance.experienceCategory}: ${instance.experienceName}`,
                value: instance.expInstanceID
            }));
        },
        totalStudentsCount() {
            return this.studentsWithoutGoalForms.length;
        },
        filteredStudentsWithoutGoalForm() {
            if (!this.studentSearch) {
                // If there is no search term, return the original list excluding those in emailRecipients
                return this.studentsWithoutGoalForms.filter(student => 
                    !this.emailRecipients.some(recipient => recipient._id === student._id));
            }

            const searchLower = this.studentSearch.toLowerCase();

            return this.studentsWithoutGoalForms.filter(student => {
                // First, ensure the student is not already in emailRecipients
                const notInEmailRecipients = !this.emailRecipients.some(recipient => recipient._id === student._id);

                // Then, check if the student matches the search criteria
                const matchesSearch = student.firstName.toLowerCase().includes(searchLower) ||
                                    student.lastName.toLowerCase().includes(searchLower) ||
                                    student.email.toLowerCase().includes(searchLower);

                return notInEmailRecipients && matchesSearch;
            });
        },

        filteredEmailRecipients() {
            if (!this.emailRecipientSearch) {
                // If there is no search term, return the original list
                return this.emailRecipients;
            }

            const searchLower = this.emailRecipientSearch.toLowerCase();

            // Filter emailRecipients based on the search term
            return this.emailRecipients.filter(recipient => {
                // You can adjust the fields you wish to search by
                return recipient.firstName.toLowerCase().includes(searchLower) ||
                    recipient.lastName.toLowerCase().includes(searchLower) ||
                    recipient.email.toLowerCase().includes(searchLower);
            });
        },

        emailDisabled() {
            // Check the base condition for emailRecipients
            if (!this.emailRecipients || this.emailRecipients.length === 0) {
                return true;
            }

            // If includeSpanish is false, check for editorData and emailHeader
            if (!this.includeSpanish) {
                return !this.editorData || !this.emailHeader || this.editorData.length === 0 || this.emailHeader.length === 0;
            } else {
                // If includeSpanish is true, check for all English and Spanish properties
                return !this.editorDataEnglish || !this.editorDataSpanish || 
                    !this.emailHeaderEnglish || !this.emailHeaderSpanish ||
                    this.editorDataEnglish.length === 0 || this.editorDataSpanish.length === 0 ||
                    this.emailHeaderEnglish.length === 0 || this.emailHeaderSpanish.length === 0;
            }
        },
    },
    methods: {

        // Fetches the active experience instances for the current instructor. Retrieves the data from the backend API by sending a GET request with the instructor's authentication token. Upon receiving the response, it maps the instance data to a more structured format and stores it in the component's state.
        async fetchExperiences() {
            this.viewLoading = true;
            const user = useLoggedInUserStore();
            let token = user.token;
            // const token = import.meta.env.VITE_TOKEN;
            let apiURL = import.meta.env.VITE_ROOT_API + '/instructorSideData/experience-instances/active/';
    
            try {
                const response = await axios.get(apiURL, { headers: { token } });
                this.expInstances = response.data.map(instance => ({
                    expInstanceID: instance._id,
                    sessionName: instance.session.name,
                    experienceCategory: instance.experience.category,
                    experienceName: instance.experience.name,
                    registrationDate: instance.registrationDate
                }));
            } catch (error) {
                this.handleError(error);
            } finally {
                this.viewLoading = false;
            }
        },

        // Initiates the process of fetching students. Resets the selected students and email recipients. Calls the method to fetch students without goal forms.
        fetchStudents() {
            this.selectedStudents = [];
            this.selectedEmailRecipients = [];
            this.fetchStudentsWithoutGoalForm();
        },

        // Initiates the process of fetching students without goal forms associated with the selected experience. Retrieves the data from the backend API by sending a GET request with the instructor's authentication token and the selected experience ID. Upon receiving the response, it stores the student data in the component's state.
        async fetchStudentsWithoutGoalForm() {
            this.studentsLoading = true;
            const user = useLoggedInUserStore();
            let token = user.token;
            // const token = import.meta.env.VITE_TOKEN;
            let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-without-goal-form/${this.selectedExperience}`;
            
            try {
                const response = await axios.get(url, { headers: { token } });
                this.studentsWithoutGoalForms = response.data;
            } catch (error) {
                this.handleError(error);
            } finally {
                this.studentsLoading = false;
            }
        },

        // Updates the selection status of a student identified by their ID. If the student ID is not already in the selectedStudents array, it adds the ID to the array. Otherwise, it removes the ID from the array, effectively toggling the selection status.
        toggleSelection(studentID) {
            const index = this.selectedStudents.indexOf(studentID);
            if (index === -1) {
                this.selectedStudents.push(studentID);
            } else {
                this.selectedStudents.splice(index, 1);
            }
        },
    
        // Selects or deselects all students in the filtered list based on their current selection status. If any student in the filtered list is not selected, it selects all students. If all students in the filtered list are already selected, it deselects them. This operation maintains the selection of students that are not currently in the filtered list.
        selectAllStudents() {
            // Check if any student in the filtered list is not selected
            const anyUnselected = this.filteredStudentsWithoutGoalForm.some(student => !this.selectedStudents.includes(student._id));

            if (anyUnselected) {
                // If any students are unselected, select all students in the filtered list
                this.selectedStudents = this.filteredStudentsWithoutGoalForm.map(student => student._id);
            } else {
                // If all students in the filtered list are already selected, deselect them
                // This operation keeps students selected that are not currently in the filtered list
                this.selectedStudents = this.selectedStudents.filter(id => !this.filteredStudentsWithoutGoalForm.some(student => student._id === id));
            }
        },

        // Adds the selected students from the original list to the email recipients array. This function filters out students based on their selected IDs, ensures no duplicates are added, clears the selected email recipients, and resets the selected students array.
        addSelectedToEmailRecipients() {
            // Filter students from the original list based on selected IDs
            const selectedStudentsInfo = this.studentsWithoutGoalForms.filter(student => 
                this.selectedStudents.includes(student._id));

            // Add them to the emailRecipients array
            // This step ensures not to add duplicates if the button is clicked more than once
            selectedStudentsInfo.forEach(student => {
                if (!this.emailRecipients.some(recipient => recipient._id === student._id)) {
                    this.emailRecipients.push(student);
                }
            });
            this.selectedEmailRecipients = [];
            this.selectedStudents = [];
        },

        // Toggles the selection of a student for email recipients. If the student ID is not already in the list of selected email recipients, it adds it; otherwise, it removes it.
        toggleEmailSelection(studentID) {
            const index = this.selectedEmailRecipients.indexOf(studentID);
            if (index === -1) {
                this.selectedEmailRecipients.push(studentID);
            } else {
                this.selectedEmailRecipients.splice(index, 1);
            }
        },

        // Selects all email recipients in the filtered list if any of them are unselected; otherwise, deselects all email recipients. This operation ensures that students selected but not currently in the filtered list remain selected.
        selectAllEmailRecipients() {
            // Check if any student in the filtered list is not selected
            const anyUnselected = this.filteredEmailRecipients.some(student => !this.selectedEmailRecipients.includes(student._id));

            if (anyUnselected) {
                // If any students are unselected, select all students in the filtered list
                this.selectedEmailRecipients = this.filteredEmailRecipients.map(student => student._id);
            } else {
                // If all students in the filtered list are already selected, deselect them
                // This operation keeps students selected that are not currently in the filtered list
                this.selectedEmailRecipients = this.selectedEmailRecipients.filter(id => !this.filteredEmailRecipients.some(student => student._id === id));
            }
        },

        // Removes selected email recipients from the recipient list and clears the selection afterward.
        removeSelectedFromEmailRecipients() {
            // Filter out selected email recipients
            this.emailRecipients = this.emailRecipients.filter(recipient =>
                !this.selectedEmailRecipients.includes(recipient._id));

            // Clear the selection after moving
            this.selectedEmailRecipients = [];
            this.selectedStudents = [];
        },

        // Sets the `editorInstance` when the editor is ready.
        onEditorReady(editorInstance) {
            this.editorInstance = editorInstance;
        },

        // Sets the `editorInstance` when the English editor is ready.
        onEditorEnglishReady(editorInstance) {
            this.editorEnglishInstance = editorInstance;
        },

        // Sets the `editorInstance` when the Spanish editor is ready.
        onEditorSpanishReady(editorInstance) {
            this.editorSpanishInstance = editorInstance;
        },

        // Inserts a placeholder {{STUDENT_NAME}} for the student's name into the editor content.
        addStudentName() {
            const editor = this.editorInstance;
            if (editor) {
                editor.model.change(writer => {
                    const placeholderText = writer.createText('{{STUDENT_NAME}}');
                    const insertPosition = editor.model.document.selection.getFirstPosition();
                    editor.model.insertContent(placeholderText, insertPosition);
                });
            }
        },

        // Inserts a placeholder {{STUDENT_NAME}} for the student's name into the English editor content.
        addStudentNameEnglish() {
            const editor = this.editorEnglishInstance;
            if (editor) {
                editor.model.change(writer => {
                    const placeholderText = writer.createText('{{STUDENT_NAME}}');
                    const insertPosition = editor.model.document.selection.getFirstPosition();
                    editor.model.insertContent(placeholderText, insertPosition);
                });
            }
        },

        // Inserts a placeholder {{STUDENT_NAME}} for the student's name into the Spanish editor content.
        addStudentNameSpanish() {
            const editor = this.editorSpanishInstance;
            if (editor) {
                editor.model.change(writer => {
                    const placeholderText = writer.createText('{{STUDENT_NAME}}');
                    const insertPosition = editor.model.document.selection.getFirstPosition();
                    editor.model.insertContent(placeholderText, insertPosition);
                });
            }
        },

        // Sends an email based on the content and recipients specified in the dialog. If the email is not intended to include Spanish content, it sends a single-language email using the English editor data. Otherwise, it sends a multi-language email with both English and Spanish content.
        async sendEmail() {
            if (!this.includeSpanish) {
                try {
                    const user = useLoggedInUserStore();
                    let token = user.token;
                    // const token = import.meta.env.VITE_TOKEN;
                    let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/manual-mailer`;

                    // Prepare the email data
                    const emailData = {
                        recipients: this.emailRecipients.map(recipient => ({
                            email: recipient.email,
                            fullName: `${recipient.firstName} ${recipient.lastName}`
                        })),
                        subject: this.emailHeader,
                        htmlContent: this.editorData
                    };

                    // Use axios.post to send the email data
                    const response = await axios.post(apiURL, emailData, {
                        headers: { token }
                    });

                    this.setTab('overview');
                } catch (error) {
                    this.handleError(error);
                } finally {
                    this.sendEmailDialog = false;
                }
            } else {
                try {
                    const user = useLoggedInUserStore();
                    const token = user.token;
                    // const token = import.meta.env.VITE_TOKEN;
                    let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/manual-mailer/multi-language`;

                    const emailData = {
                        recipients: this.emailRecipients.map(recipient => ({
                            email: recipient.email,
                            fullName: `${recipient.firstName} ${recipient.lastName}`,
                            languagePreference: recipient.languagePreference
                        })),
                        subjectEnglish: this.emailHeaderEnglish,
                        htmlContentEnglish: this.editorDataEnglish,
                        subjectSpanish: this.emailHeaderSpanish,
                        htmlContentSpanish: this.editorDataSpanish
                    };

                    const response = await axios.post(apiURL, emailData, {
                        headers: { token }
                    });

                    this.setTab('overview');
                } catch (error) {
                    this.handleError(error);
                } finally {
                    this.sendEmailDialog = false;
                }
            }
        },

        // Closes the email dialog without sending the email.
        cancelEmail() {
            this.sendEmailDialog = false;
        }
    }
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
height: 600px; /* Adjust the height as needed */
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

.light-red-bg {
    background-color: #ffe6e6;
}


</style>