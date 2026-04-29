<!--
storyFormPartnership.vue
Step 3 — Organization / partnership outreach. Captures contact details for
an organization representative plus five translated questions about potential
collaboration. Org name is required; email/phone are validated when filled.
-->

<template>
<v-form ref="form" @submit.prevent="handleValidations">
<v-container>
    <v-row>
        <v-col>
            <p class="font-weight-black text-h6">Partnership</p>
            <p class="text-subtitle-2" style="color: grey;">
                Organization contact details and potential collaboration.
            </p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="6">
            <p :class="{ 'error-text': isOrgNameInvalid }" class="font-weight-black text-h8 mb-1">
                Name of organization<span class="error-text"> *</span>
            </p>
            <v-text-field
                v-model="storyForm.partnership.orgName"
                :rules="orgNameRules"
                :error="isOrgNameInvalid"
            ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
            <p class="font-weight-black text-h8 mb-1">Name of representative</p>
            <v-text-field
                v-model="storyForm.partnership.repName"
            ></v-text-field>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="6">
            <p :class="{ 'error-text': isEmailInvalid }" class="font-weight-black text-h8 mb-1">
                Email of representative
            </p>
            <v-text-field
                v-model="storyForm.partnership.repEmail"
                :rules="emailRules"
                :error="isEmailInvalid"
                type="email"
            ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
            <p :class="{ 'error-text': isPhoneInvalid }" class="font-weight-black text-h8 mb-1">
                Phone number of representative
            </p>
            <v-text-field
                v-model="storyForm.partnership.repPhone"
                :rules="phoneRules"
                :error="isPhoneInvalid"
            ></v-text-field>
        </v-col>
    </v-row>

    <v-col cols="12" md="10">
        <TranslatedTextarea
            label="Can we collaborate on activities? What type of activities?"
            :original="storyForm.partnership.collaborateOnActivities.original"
            @update:original="storyForm.partnership.collaborateOnActivities.original = $event"
            :translation="storyForm.partnership.collaborateOnActivities.translation"
            @update:translation="storyForm.partnership.collaborateOnActivities.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Can they refer people to us?"
            :original="storyForm.partnership.referPeople.original"
            @update:original="storyForm.partnership.referPeople.original = $event"
            :translation="storyForm.partnership.referPeople.translation"
            @update:translation="storyForm.partnership.referPeople.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Can we join their events with a table?"
            :original="storyForm.partnership.joinWithTable.original"
            @update:original="storyForm.partnership.joinWithTable.original = $event"
            :translation="storyForm.partnership.joinWithTable.translation"
            @update:translation="storyForm.partnership.joinWithTable.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Can we host an event or do education at their location?"
            :original="storyForm.partnership.hostEventAtLocation.original"
            @update:original="storyForm.partnership.hostEventAtLocation.original = $event"
            :translation="storyForm.partnership.hostEventAtLocation.translation"
            @update:translation="storyForm.partnership.hostEventAtLocation.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Can we participate at their activities? What type of activities?"
            :original="storyForm.partnership.participateAtActivities.original"
            @update:original="storyForm.partnership.participateAtActivities.original = $event"
            :translation="storyForm.partnership.participateAtActivities.translation"
            @update:translation="storyForm.partnership.participateAtActivities.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Open notes"
            :original="storyForm.partnership.openNotes.original"
            @update:original="storyForm.partnership.openNotes.original = $event"
            :translation="storyForm.partnership.openNotes.translation"
            @update:translation="storyForm.partnership.openNotes.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />
    </v-col>
</v-container>
</v-form>
</template>

<script>
import { toast } from 'vue3-toastify';
import TranslatedTextarea from './TranslatedTextarea.vue';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s().+-]{7,}$/;

export default {
name: "StoryFormPartnership",
components: { TranslatedTextarea },
props: {
    storyForm: {
        type: Object,
        required: true,
    },
},
emits: ["form-valid", "form-invalid"],
data() {
    return {
        formSubmitted: false,
        orgNameRules: [v => !!v || "Organization name is required"],
        emailRules: [
            v => !v || EMAIL_RE.test(v) || "Enter a valid email address",
        ],
        phoneRules: [
            v => !v || PHONE_RE.test(v) || "Enter a valid phone number",
        ],
    };
},
computed: {
    isOrgNameInvalid() {
        if (!this.formSubmitted) return false;
        return !this.storyForm.partnership.orgName;
    },
    isEmailInvalid() {
        if (!this.formSubmitted) return false;
        const v = this.storyForm.partnership.repEmail;
        return !!v && !EMAIL_RE.test(v);
    },
    isPhoneInvalid() {
        if (!this.formSubmitted) return false;
        const v = this.storyForm.partnership.repPhone;
        return !!v && !PHONE_RE.test(v);
    },
    needsTranslation() {
        return this.storyForm.context.interviewLanguage !== 'en';
    },
    missingTranslations() {
        if (!this.needsTranslation) return [];
        const fields = [
            'collaborateOnActivities', 'referPeople', 'joinWithTable',
            'hostEventAtLocation', 'participateAtActivities', 'openNotes',
        ];
        return fields.filter(key => {
            const field = this.storyForm.partnership[key];
            return field.original.trim() !== '' && field.translation.trim() === '';
        });
    },
    hasAnyError() {
        return (
            this.isOrgNameInvalid ||
            this.isEmailInvalid ||
            this.isPhoneInvalid ||
            this.missingTranslations.length > 0
        );
    },
},
methods: {
    handleValidations() {
        this.formSubmitted = true;

        if (!this.hasAnyError) {
            this.$emit('form-valid');
        } else {
            // eslint-disable-next-line no-console
            console.warn('[storyFormPartnership] blocking advance:', {
                isOrgNameInvalid: this.isOrgNameInvalid,
                isEmailInvalid: this.isEmailInvalid,
                isPhoneInvalid: this.isPhoneInvalid,
                missingTranslations: this.missingTranslations,
            });
            this.$emit('form-invalid');
            toast.error("Please correct the errors before continuing.", {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: false,
            });
        }
    },
},
};
</script>

<style scoped>
.error-text {
    color: rgb(176, 0, 32);
}
</style>
