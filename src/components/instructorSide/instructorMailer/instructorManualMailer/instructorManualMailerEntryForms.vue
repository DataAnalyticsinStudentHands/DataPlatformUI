<!-- instructorManualMailerEntryForms - this view allows Instructors to select students who have not completed their Student Entry Forms, and send a bulk email to those students -->
<template>
<v-container>
    <div v-if="entryFormLoading">
    <v-row>
        <v-col class="d-flex justify-center">
            <v-progress-circular indeterminate></v-progress-circular>
        </v-col>
    </v-row>
    </div>
    <div v-else-if="!entryFormLoading">
    <v-row>
        <v-col cols="5">
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
                    :items="filteredStudentsWithoutEntryForm"
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
            <v-col cols="12">
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
                    <v-col cols="12">
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
                    <v-col cols="12">
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
</v-container>

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
    name: "InstructorManualMailerEntryForms",
    components: {
        ckeditor: Ckeditor
    },
    inject: ['setTab'],
    data() {
        return {
            mailType: null,
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
        this.fetchStudentsWithoutEntryForm();
    },

    computed: {
        filteredStudentsWithoutEntryForm() {
            if (!this.studentSearch) {
                // If there is no search term, return the original list excluding those in emailRecipients
                return this.studentsWithoutEntryForm.filter(student => 
                    !this.emailRecipients.some(recipient => recipient._id === student._id));
            }

            const searchLower = this.studentSearch.toLowerCase();

            return this.studentsWithoutEntryForm.filter(student => {
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

        // Fetches the list of students without entry forms by sending a GET request to the backend API. Upon receiving the response, it stores the list of students in the component's state. Finally, it updates the loading state to indicate that the fetching process is complete.
        async fetchStudentsWithoutEntryForm() {
            this.entryFormLoading = true;
            const user = useLoggedInUserStore();
            let token = user.token;
            // const token = import.meta.env.VITE_TOKEN;
            let url = import.meta.env.VITE_ROOT_API + '/instructorSideData/students-without-entry-form';
    
            try {
            const response = await axios.get(url, { headers: { token } });
            this.studentsWithoutEntryForm = response.data;
            } catch (error) {
                this.handleError(error);
            } finally {
                this.entryFormLoading = false;
            }
        },

        // Toggles the selection of a student identified by their ID. If the student ID is not already in the list of selected students, it adds it. If the student ID is already in the list, it removes it.
        toggleSelection(studentID) {
            const index = this.selectedStudents.indexOf(studentID);
            if (index === -1) {
                this.selectedStudents.push(studentID);
            } else {
                this.selectedStudents.splice(index, 1);
            }
        },
    
        // Selects all students in the filtered list if any of them are not currently selected. If all students in the filtered list are already selected, it deselects them while keeping students selected that are not currently in the filtered list.
        selectAllStudents() {
            // Check if any student in the filtered list is not selected
            const anyUnselected = this.filteredStudentsWithoutEntryForm.some(student => !this.selectedStudents.includes(student._id));

            if (anyUnselected) {
                // If any students are unselected, select all students in the filtered list
                this.selectedStudents = this.filteredStudentsWithoutEntryForm.map(student => student._id);
            } else {
                // If all students in the filtered list are already selected, deselect them
                // This operation keeps students selected that are not currently in the filtered list
                this.selectedStudents = this.selectedStudents.filter(id => !this.filteredStudentsWithoutEntryForm.some(student => student._id === id));
            }
        },

        // Filters students from the original list based on selected IDs, then adds them to the `emailRecipients` array. This step ensures that duplicates are not added if the button is clicked more than once. Finally, it clears both `selectedEmailRecipients` and `selectedStudents` arrays.
        addSelectedToEmailRecipients() {
            // Filter students from the original list based on selected IDs
            const selectedStudentsInfo = this.studentsWithoutEntryForm.filter(student => 
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

        // Toggles the selection of a student in the email recipients list based on their ID. If the student ID is not already selected, it adds it to the `selectedEmailRecipients` array. If the student ID is already selected, it removes it from the array.
        toggleEmailSelection(studentID) {
            const index = this.selectedEmailRecipients.indexOf(studentID);
            if (index === -1) {
                this.selectedEmailRecipients.push(studentID);
            } else {
                this.selectedEmailRecipients.splice(index, 1);
            }
        },

        // Selects or deselects all email recipients in the filtered list based on their current selection state. If any of the recipients in the filtered list are not selected, it selects all of them. If all recipients in the filtered list are already selected, it deselects them.
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

        // Removes selected email recipients from the list of email recipients. After removal, it clears the selection of both email recipients and students.
        removeSelectedFromEmailRecipients() {
            // Filter out selected email recipients
            this.emailRecipients = this.emailRecipients.filter(recipient =>
                !this.selectedEmailRecipients.includes(recipient._id));

            // Clear the selection after moving
            this.selectedEmailRecipients = [];
            this.selectedStudents = [];
        },

        // Sets the editorInstance property to the provided editorInstance when the editor is ready.
        onEditorReady(editorInstance) {
            this.editorInstance = editorInstance;
        },

        // Sets the editorEnglishInstance property to the provided editorInstance when the editor is ready.
        onEditorEnglishReady(editorInstance) {
            this.editorEnglishInstance = editorInstance;
        },

        // Sets the editorSpanishInstance property to the provided editorInstance when the editor is ready.
        onEditorSpanishReady(editorInstance) {
            this.editorSpanishInstance = editorInstance;
        },

        // Inserts a placeholder text "{{STUDENT_NAME}}" at the current cursor position in the editor, if the editor instance exists.
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

        // Inserts a placeholder text "{{STUDENT_NAME}}" at the current cursor position in the English editor, if the editor instance exists.
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

        // Inserts a placeholder text "{{STUDENT_NAME}}" at the current cursor position in the Spanish editor, if the editor instance exists.
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

        // Sends an email to the selected recipients with the specified subject and content. If the option to include Spanish content is selected, it sends the email with both English and Spanish versions.
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
2
                    // Use axios.post to send the email data
                    const response = axios.post(apiURL, emailData, {
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
                    const user = useLoggedInUserStore(); // Assuming this exists from your previous code
                    const token = import.meta.env.VITE_TOKEN;
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

        // Cancels the email sending process by closing the dialog window.
        cancelEmail() {
            this.sendEmailDialog = false;
        }

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