<template>
<v-container>
    <div v-if="configLoading">
        <v-row>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate></v-progress-circular>
            </v-col>
        </v-row>
    </div>
    <div v-else>
        <v-row>
            <v-col cols="12" class="d-flex text-h6">
                <h1>Entry Form Email Configuration</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-switch
                    v-model="entryFormEmail.enabled"
                    :label="entryFormEmailStatus"
                ></v-switch>
            </v-col>
        </v-row>
        <div v-if="entryFormEmail.enabled">
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="entryFormEmail.firstEmailDays"
                        label="First Email Days"
                        type="number"
                        min="0"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        v-model="entryFormEmail.secondEmailDays"
                        label="Second Email Days"
                        type="number"
                        min="0"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-checkbox
                        v-model="entryFormEmail.multilingual"
                        label="Include Translation"
                        hide-details    
                    ></v-checkbox>
                    <div class="text-subtitle-2 ml-4">Write a message in English and Spanish. Students will receive one based on their "Language Preference"</div>
                </v-col>
            </v-row>
            <div v-if="!entryFormEmail.multilingual">
                <v-row>
                    <v-col class="d-flex text-h6">
                        Email
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field 
                            v-model="entryFormEmail.emailSubject"
                            label="Subject Header" 
                            hide-details
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <ckeditor :editor="editor" v-model="entryFormEmail.emailContent" :config="editorConfig" @ready="onEditorReady"></ckeditor>
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
                                    v-model="entryFormEmail.emailSubjectEnglish"
                                    label="Subject Header" 
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <ckeditor :editor="editor" v-model="entryFormEmail.emailContentEnglish" :config="editorConfig" @ready="onEditorEnglishReady"></ckeditor>
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
                                    v-model="entryFormEmail.emailSubjectSpanish"
                                    label="Subject Header" 
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <ckeditor :editor="editor" v-model="entryFormEmail.emailContentSpanish" :config="editorConfig" @ready="onEditorSpanishReady"></ckeditor>
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
        </div>
        <v-row>
            <v-col class="d-flex justify-end">
                <v-btn 
                    @click="applyEmailConfigsConfirm = true"
                    :disabled="emailDisabled"
                >Apply</v-btn>
            </v-col>
        </v-row>
    </div>
</v-container>
<!-- Confirmation Dialog -->
<v-dialog v-model="applyEmailConfigsConfirm" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">
            Confirm Email
        </v-card-title>
        <v-card-text>
            <p>Are you sure you want to apply this configuration?</p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelEmailConfigs">
                Cancel
            </v-btn>
            <v-btn color="red darken-2" text @click="applyEmailConfigs">
                Yes
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'vue3-toastify';

export default {
name: "InstructorAutomaticMailerEntryForms",
components: {
    ckeditor: CKEditor.component
},
inject: ['setTab'],
data() {
    return {
        entryFormEmail: {
            type: 'entryForm',
            enabled: false,
            firstEmailDays: 7,
            secondEmailDays: 14,
            multilingual: false,
            emailSubject: 'Reminder to Complete Your Entry Form',
            emailSubjectEnglish: 'Email Subject English',
            emailSubjectSpanish: 'Email Subject Spanish',
            emailContent: 'Please complete your entry form',
            emailContentEnglish: 'Email Content English',
            emailContentSpanish: 'Email Content Spanish',
        },
        configLoading: false,
        editorInstance: null,
        editorEnglishInstance: null,
        editorSpanishInstance: null,
        editor: ClassicEditor,
        editorConfig: {},
        applyEmailConfigsConfirm: false,
    };
},
created() {
    this.fetchAutoMailerConfigEntryForms();
},
computed: {
    entryFormEmailStatus() {
        return this.entryFormEmail.enabled ? 'Enabled' : 'Disabled';
    },

    emailDisabled() {
        // Check if firstEmailDays and secondEmailDays are less than 1
        const emailDaysInvalid = this.entryFormEmail.firstEmailDays < 1 || this.entryFormEmail.secondEmailDays < 1;

        // If multilingual is true, check that all relevant fields are not empty
        const multilingualFieldsInvalid = this.entryFormEmail.multilingual && (
            !this.entryFormEmail.emailSubjectEnglish ||
            !this.entryFormEmail.emailSubjectSpanish ||
            !this.entryFormEmail.emailContentEnglish ||
            !this.entryFormEmail.emailContentSpanish
        );

        // If multilingual is false, check that the non-language-specific fields are not empty
        const nonMultilingualFieldsInvalid = !this.entryFormEmail.multilingual && (
            !this.entryFormEmail.emailSubject ||
            !this.entryFormEmail.emailContent
        );

        // The button should be disabled if any of the above conditions are true
        return emailDaysInvalid || multilingualFieldsInvalid || nonMultilingualFieldsInvalid;
    }
},
methods: {
    async fetchAutoMailerConfigEntryForms() {
        this.configLoading = true;
        const user = useLoggedInUserStore();
        const token = user.token;
        // const token = import.meta.env.VITE_TOKEN;
        const type = 'entryForm';
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/auto-mailer-config/${type}`;

        try {
            const response = await axios.get(url, { headers: { token } });
            console.log('response: ', response);
            // Create a new object excluding the _id field
            const { _id, ...configWithoutId } = response.data;
            
            // Assign the modified config to your component's state
            this.entryFormEmail = configWithoutId;

        } catch (error) {
            this.handleError(error);
        } finally {
            this.configLoading = false;
        }
    },

    onEditorReady(editorInstance) {
        this.editorInstance = editorInstance;
    },

    onEditorEnglishReady(editorInstance) {
        this.editorEnglishInstance = editorInstance;
    },

    onEditorSpanishReady(editorInstance) {
        this.editorSpanishInstance = editorInstance;
    },

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

    cancelEmailConfigs() {
        this.applyEmailConfigsConfirm = false;
    },

    applyEmailConfigs() {
        const user = useLoggedInUserStore();
        const token = user.token;
        // const token = import.meta.env.VITE_TOKEN;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/auto-mailer-config/entryForm`;
        try {
            const response = axios.put(apiURL, this.entryFormEmail, { headers: { token }});
            console.log('Configuration updated successfully', response.data);

            // Display the toast message
            toast.info('Entry Form Automatic Mailer Updated!', {
                position: "top-right",
                toastClassName: "Toastify__toast--update",
                multiple: false
            });

            this.setTab('overview');

        } catch (error) {
            this.handleError(error);
        } finally {
            this.applyEmailConfigsConfirm = false;
        }
    }
}
}
</script>

<style scoped>
</style>
