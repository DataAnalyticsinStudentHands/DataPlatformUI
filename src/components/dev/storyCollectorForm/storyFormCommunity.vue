<!--
storyFormCommunity.vue
Step 1 — Community questions. Six open-ended questions about the participant's
relationship with their Houston community, positive / negative quality-of-life
factors, and community health. Each question uses TranslatedTextarea so an
English translation field appears automatically for non-English interviews.
-->

<template>
<v-form ref="form" @submit.prevent="handleValidations">
<v-container>
    <v-row>
        <v-col>
            <p class="font-weight-black text-h6">Community</p>
            <p class="text-subtitle-2" style="color: grey;">
                Questions about the participant's community experience in Houston.
            </p>
        </v-col>
    </v-row>

    <v-col cols="12" md="10">
        <TranslatedTextarea
            label="Do you like your community in Houston? Why?"
            :original="storyForm.community.likeCommunity.original"
            @update:original="storyForm.community.likeCommunity.original = $event"
            :translation="storyForm.community.likeCommunity.translation"
            @update:translation="storyForm.community.likeCommunity.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Within your community, what negatively affects your quality of life?"
            :original="storyForm.community.negativeFactors.original"
            @update:original="storyForm.community.negativeFactors.original = $event"
            :translation="storyForm.community.negativeFactors.translation"
            @update:translation="storyForm.community.negativeFactors.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="What are some good things within your community that you think can be used to solve/address these negative factors?"
            :original="storyForm.community.positiveFactors.original"
            @update:original="storyForm.community.positiveFactors.original = $event"
            :translation="storyForm.community.positiveFactors.translation"
            @update:translation="storyForm.community.positiveFactors.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="In your community, what are some things that help people be healthy? What resources are useful?"
            :original="storyForm.community.healthResources.original"
            @update:original="storyForm.community.healthResources.original = $event"
            :translation="storyForm.community.healthResources.translation"
            @update:translation="storyForm.community.healthResources.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="In your community, what is preventing people from being healthy?"
            :original="storyForm.community.healthBarriers.original"
            @update:original="storyForm.community.healthBarriers.original = $event"
            :translation="storyForm.community.healthBarriers.translation"
            @update:translation="storyForm.community.healthBarriers.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Open notes"
            :original="storyForm.community.openNotes.original"
            @update:original="storyForm.community.openNotes.original = $event"
            :translation="storyForm.community.openNotes.translation"
            @update:translation="storyForm.community.openNotes.translation = $event"
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

export default {
name: "StoryFormCommunity",
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
    };
},
computed: {
    needsTranslation() {
        return this.storyForm.context.interviewLanguage !== 'en';
    },
    missingTranslations() {
        if (!this.needsTranslation) return [];
        const fields = [
            'likeCommunity', 'negativeFactors', 'positiveFactors',
            'healthResources', 'healthBarriers', 'openNotes',
        ];
        return fields.filter(key => {
            const field = this.storyForm.community[key];
            return field.original.trim() !== '' && field.translation.trim() === '';
        });
    },
    hasAnyError() {
        return this.missingTranslations.length > 0;
    },
},
methods: {
    handleValidations() {
        this.formSubmitted = true;

        if (!this.hasAnyError) {
            this.$emit('form-valid');
        } else {
            // eslint-disable-next-line no-console
            console.warn('[storyFormCommunity] blocking advance — missing translations:', this.missingTranslations);
            this.$emit('form-invalid');
            toast.error(
                "English translation is required for each answered question.",
                {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false,
                }
            );
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
