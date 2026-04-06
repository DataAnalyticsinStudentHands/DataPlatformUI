<template>
<v-container>
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
</v-container>
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
import { toast } from 'vue3-toastify';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { mockAutoMailerConfig } from './mockData.js';

export default {
name: "DevAutomaticMailerEntryForms",
components: {
    ckeditor: Ckeditor
},
inject: ['setTab'],
data() {
    return {
        entryFormEmail: { ...mockAutoMailerConfig.entryForm },
        editorInstance: null,
        editorEnglishInstance: null,
        editorSpanishInstance: null,
        editor: ClassicEditor,
        editorConfig: {},
        applyEmailConfigsConfirm: false,
    };
},
computed: {
    entryFormEmailStatus() {
        return this.entryFormEmail.enabled ? 'Enabled' : 'Disabled';
    },

    emailDisabled() {
        const emailDaysInvalid = this.entryFormEmail.firstEmailDays < 1 || this.entryFormEmail.secondEmailDays < 1;

        const multilingualFieldsInvalid = this.entryFormEmail.multilingual && (
            !this.entryFormEmail.emailSubjectEnglish ||
            !this.entryFormEmail.emailSubjectSpanish ||
            !this.entryFormEmail.emailContentEnglish ||
            !this.entryFormEmail.emailContentSpanish
        );

        const nonMultilingualFieldsInvalid = !this.entryFormEmail.multilingual && (
            !this.entryFormEmail.emailSubject ||
            !this.entryFormEmail.emailContent
        );

        return emailDaysInvalid || multilingualFieldsInvalid || nonMultilingualFieldsInvalid;
    }
},
methods: {

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
        try {
            console.log('[DevMailer] Apply Entry Form Auto-Mailer config:', this.entryFormEmail);

            toast.info('Entry Form Automatic Mailer Updated!', {
                position: "top-right",
                toastClassName: "Toastify__toast--update",
                multiple: false
            });

            this.setTab('overview');
        } catch (error) {
            console.error('Apply config error:', error);
            toast.error('Failed to apply configuration.', {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete'
            });
        } finally {
            this.applyEmailConfigsConfirm = false;
        }
    }
}
}
</script>

<style scoped>
:deep(.ck-editor__editable h1) {
  font-size: 2rem;
  font-weight: bold;
}

:deep(.ck-editor__editable h2) {
  font-size: 1.5rem;
  font-weight: bold;
}

:deep(.ck-editor__editable h3) {
  font-size: 1.17rem;
  font-weight: bold;
}

:deep(.ck-editor__editable h4) {
  font-size: 1rem;
  font-weight: bold;
}

:deep(.ck-editor__editable ol) {
  list-style-type: decimal;
  padding-left: 2em;
}

:deep(.ck-editor__editable ul) {
  list-style-type: disc;
  padding-left: 2em;
}

:deep(.ck-editor__editable blockquote) {
  border-left: 4px solid #ccc;
  padding-left: 16px;
  margin-left: 0;
  margin-bottom: 12px;
  color: #666;
  font-style: italic;
}

:deep(.ck-editor__editable table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 12px;
}

:deep(.ck-editor__editable th),
:deep(.ck-editor__editable td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
}

:deep(.ck-editor__editable th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

:deep(.ck-editor__editable a) {
  color: #1a73e8;
  text-decoration: underline;
}

:deep(.ck-editor__editable p) {
  margin-bottom: 0.6em;
}
</style>
