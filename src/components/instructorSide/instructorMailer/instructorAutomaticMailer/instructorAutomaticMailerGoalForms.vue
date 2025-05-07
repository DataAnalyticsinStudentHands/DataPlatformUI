<!-- instructorAutomaticMailerGoalForms - this view presents a form to configure the Automatic Reminder Emails for Goal Forms -->
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
                <h1>Goal Setting Form Email Configuration</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-switch
                    v-model="goalSettingFormEmail.enabled"
                    :label="goalSettingFormEmailStatus"
                ></v-switch>
            </v-col>
        </v-row>
        <div v-if="goalSettingFormEmail.enabled">
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="goalSettingFormEmail.firstEmailDays"
                        label="First Email Days"
                        type="number"
                        min="0"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        v-model="goalSettingFormEmail.secondEmailDays"
                        label="Second Email Days"
                        type="number"
                        min="0"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-checkbox
                        v-model="goalSettingFormEmail.multilingual"
                        label="Include Translation"
                        hide-details    
                    ></v-checkbox>
                    <div class="text-subtitle-2 ml-4">Write a message in English and Spanish. Students will receive one based on their "Language Preference"</div>
                </v-col>
            </v-row>
            <div v-if="!goalSettingFormEmail.multilingual">
                <v-row>
                    <v-col class="d-flex text-h6">
                        Email
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field 
                            v-model="goalSettingFormEmail.emailSubject"
                            label="Subject Header" 
                            hide-details
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <ckeditor :editor="editor" v-model="goalSettingFormEmail.emailContent" :config="editorConfig" @ready="onEditorReady"></ckeditor>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-btn @click="addStudentName">Add Student Name</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn @click="addExperienceName">Add Experience Name</v-btn>
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
                                    v-model="goalSettingFormEmail.emailSubjectEnglish"
                                    label="Subject Header" 
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <ckeditor :editor="editor" v-model="goalSettingFormEmail.emailContentEnglish" :config="editorConfig" @ready="onEditorEnglishReady"></ckeditor>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-btn @click="addStudentNameEnglish">Add Student Name</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn @click="addExperienceNameEnglish">Add Experience Name</v-btn>
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
                                    v-model="goalSettingFormEmail.emailSubjectSpanish"
                                    label="Subject Header" 
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <ckeditor :editor="editor" v-model="goalSettingFormEmail.emailContentSpanish" :config="editorConfig" @ready="onEditorSpanishReady"></ckeditor>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-btn @click="addStudentNameSpanish">Add Student Name</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn @click="addExperienceNameSpanish">Add Experience Name</v-btn>
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
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'vue3-toastify';

export default {
name: "InstructorAutomaticMailerGoalForms",
components: {
    ckeditor: Ckeditor
},
inject: ['setTab'],
data() {
    return {
        goalSettingFormEmail: {
            type: 'goalSettingForm',
            enabled: false,
            firstEmailDays: null,
            secondEmailDays: null,
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
    this.fetchAutoMailerConfigGoalSettingForms();
},
computed: {
    goalSettingFormEmailStatus() {
        return this.goalSettingFormEmail.enabled ? 'Enabled' : 'Disabled';
    },

    emailDisabled() {
        // Check if firstEmailDays and secondEmailDays are less than 1
        const emailDaysInvalid = this.goalSettingFormEmail.firstEmailDays < 1 || this.goalSettingFormEmail.secondEmailDays < 1;

        // If multilingual is true, check that all relevant fields are not empty
        const multilingualFieldsInvalid = this.goalSettingFormEmail.multilingual && (
            !this.goalSettingFormEmail.emailSubjectEnglish ||
            !this.goalSettingFormEmail.emailSubjectSpanish ||
            !this.goalSettingFormEmail.emailContentEnglish ||
            !this.goalSettingFormEmail.emailContentSpanish
        );

        // If multilingual is false, check that the non-language-specific fields are not empty
        const nonMultilingualFieldsInvalid = !this.goalSettingFormEmail.multilingual && (
            !this.goalSettingFormEmail.emailSubject ||
            !this.goalSettingFormEmail.emailContent
        );

        // The button should be disabled if any of the above conditions are true
        return emailDaysInvalid || multilingualFieldsInvalid || nonMultilingualFieldsInvalid;
    }
},
methods: {

    // Fetches the auto-mailer configurations for goal setting forms by sending a GET request to the backend API. Upon receiving the response, it extracts the configuration data, excluding the `_id` field, and assigns the modified configuration to the component's state.
    async fetchAutoMailerConfigGoalSettingForms() {
        this.configLoading = true;
        const user = useLoggedInUserStore();
        const token = user.token;
        // const token = import.meta.env.VITE_TOKEN;
        const type = 'goalSettingForm';
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/auto-mailer-config/${type}`;

        try {
            const response = await axios.get(url, { headers: { token } });
            // Create a new object excluding the _id field
            const { _id, ...configWithoutId } = response.data;
            
            // Assign the modified config to your component's state
            this.goalSettingFormEmail = configWithoutId;

        } catch (error) {
            this.handleError(error);
        } finally {
            this.configLoading = false;
        }
    },

    // Sets the `editorInstance` property to the provided `editorInstance` when the editor is ready.
    onEditorReady(editorInstance) {
        this.editorInstance = editorInstance;
    },

    // Sets the `editorEnglishInstance` property to the provided `editorInstance` when the editor is ready.
    onEditorEnglishReady(editorInstance) {
        this.editorEnglishInstance = editorInstance;
    },

    // Sets the `editorSpanishInstance` property to the provided `editorInstance` when the editor is ready.
    onEditorSpanishReady(editorInstance) {
        this.editorSpanishInstance = editorInstance;
    },

    // Adds the placeholder "{{STUDENT_NAME}}" to the editor content at the current cursor position, if the editor instance is available.
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

    // Adds the placeholder "{{STUDENT_NAME}}" to the English editor content at the current cursor position, if the editor instance is available.
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

    // Adds the placeholder "{{STUDENT_NAME}}" to the Spanish editor content at the current cursor position, if the editor instance is available.
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

    // Adds the placeholder "{{EXPERIENCE_NAME}}" to the editor content at the current cursor position, if the editor instance is available.
    addExperienceName() {
        const editor = this.editorInstance;
        if (editor) {
            editor.model.change(writer => {
                const placeholderText = writer.createText('{{EXPERIENCE_NAME}}');
                const insertPosition = editor.model.document.selection.getFirstPosition();
                editor.model.insertContent(placeholderText, insertPosition);
            });
        }
    },

    // Adds the placeholder "{{EXPERIENCE_NAME}}" to the English editor content at the current cursor position, if the editor instance is available.
    addExperienceNameEnglish() {
        const editor = this.editorEnglishInstance;
        if (editor) {
            editor.model.change(writer => {
                const placeholderText = writer.createText('{{EXPERIENCE_NAME}}');
                const insertPosition = editor.model.document.selection.getFirstPosition();
                editor.model.insertContent(placeholderText, insertPosition);
            });
        }
    },

    // Adds the placeholder "{{EXPERIENCE_NAME}}" to the Spanish editor content at the current cursor position, if the editor instance is available.
    addExperienceNameSpanish() {
        const editor = this.editorSpanishInstance;
        if (editor) {
            editor.model.change(writer => {
                const placeholderText = writer.createText('{{EXPERIENCE_NAME}}');
                const insertPosition = editor.model.document.selection.getFirstPosition();
                editor.model.insertContent(placeholderText, insertPosition);
            });
        }
    },

    // Updates the state to hide the confirmation dialog for applying email configurations by setting `applyEmailConfigsConfirm` to `false`.
    cancelEmailConfigs() {
        this.applyEmailConfigsConfirm = false;
    },

    // Applies the email configurations for goal setting forms by sending a PUT request to the backend API with the updated configuration data. Upon successful update, it displays a toast message confirming the update and sets the tab to 'overview'.
    applyEmailConfigs() {
        const user = useLoggedInUserStore();
        const token = user.token;
        // const token = import.meta.env.VITE_TOKEN;
        let apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/auto-mailer-config/goalSettingForm`;
        try {
            const response = axios.put(apiURL, this.goalSettingFormEmail, { headers: { token }});
            
            // Display the toast message
            toast.info('Goal Form Automatic Mailer Updated!', {
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
