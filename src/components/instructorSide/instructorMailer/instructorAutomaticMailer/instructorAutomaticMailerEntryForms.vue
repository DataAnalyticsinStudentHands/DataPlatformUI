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
                <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor>
            </v-col>
        </v-row>
    </div>
</v-container>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
name: "InstructorAutomaticMailerEntryForms",
components: {
    ckeditor: CKEditor.component
},
data() {
    return {
        entryFormEmail: {
            enabled: false,
            firstEmailDays: 7,
            secondEmailDays: 14,
            emailSubject: 'Reminder to Complete Your Entry Form',
            emailContent: 'Please complete your entry form',
        },
        configLoading: false,
        editorInstance: null,
        editor: ClassicEditor,
        editorData: 'Please complete your Entry Form.',
        editorConfig: {},
    };
},
created() {
    this.fetchAutoMailerConfigEntryForms();
},
computed: {
    entryFormEmailStatus() {
        return this.entryFormEmail.enabled ? 'Enabled' : 'Disabled';
    }
},
methods: {
    async fetchAutoMailerConfigEntryForms() {
        this.configLoading = true;
        const user = useLoggedInUserStore();
        // const token = user.token;
        const token = import.meta.env.VITE_TOKEN;
        const type = 'entryForm';
        let url = import.meta.env.VITE_ROOT_API + `/instructorSideData/auto-mailer-config/${type}`;

        try {
            const response = await axios.get(url, { headers: { token } });
            console.log('response: ', response);
            this.entryFormEmail = response.data;
        } catch (error) {
            this.handleError(error);
        } finally {
            this.configLoading = false;
        }
    },

    onEditorReady(editorInstance) {
        this.editorInstance = editorInstance;
    },
}
}
</script>

<style scoped>
</style>
