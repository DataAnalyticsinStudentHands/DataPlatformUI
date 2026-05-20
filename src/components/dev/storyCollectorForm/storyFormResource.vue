<!--
storyFormResource.vue
Step 2 — Resource / event feedback. Five open-ended questions about a specific
resource, workshop, or event the participant has attended, plus open notes.
-->

<template>
<v-form ref="form" @submit.prevent="handleValidations">
<v-container>
    <v-row>
        <v-col>
            <p class="font-weight-black text-h6">Resource Feedback</p>
            <p class="text-subtitle-2" style="color: grey;">
                Feedback on a resource, workshop, or event the participant has used.
            </p>
        </v-col>
    </v-row>

    <v-col cols="12" md="10">
        <TranslatedTextarea
            label="Name of resource, workshop, or event"
            :original="storyForm.resource.resourceName.original"
            @update:original="storyForm.resource.resourceName.original = $event"
            :translation="storyForm.resource.resourceName.translation"
            @update:translation="storyForm.resource.resourceName.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
            :rows="1"
        />

        <TranslatedTextarea
            label="How was your experience? Why?"
            :original="storyForm.resource.experience.original"
            @update:original="storyForm.resource.experience.original = $event"
            :translation="storyForm.resource.experience.translation"
            @update:translation="storyForm.resource.experience.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Would you recommend it to anyone else? Have you shared it with other people, family, friends?"
            :original="storyForm.resource.wouldRecommend.original"
            @update:original="storyForm.resource.wouldRecommend.original = $event"
            :translation="storyForm.resource.wouldRecommend.translation"
            @update:translation="storyForm.resource.wouldRecommend.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Are there any other health concerns or barriers that I may assist you with?"
            :original="storyForm.resource.otherConcerns.original"
            @update:original="storyForm.resource.otherConcerns.original = $event"
            :translation="storyForm.resource.otherConcerns.translation"
            @update:translation="storyForm.resource.otherConcerns.translation = $event"
            :interview-language="storyForm.context.interviewLanguage"
            :form-submitted="formSubmitted"
        />

        <TranslatedTextarea
            label="Open notes"
            :original="storyForm.resource.openNotes.original"
            @update:original="storyForm.resource.openNotes.original = $event"
            :translation="storyForm.resource.openNotes.translation"
            @update:translation="storyForm.resource.openNotes.translation = $event"
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
name: "StoryFormResource",
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
            'resourceName', 'experience', 'wouldRecommend',
            'otherConcerns', 'openNotes',
        ];
        return fields.filter(key => {
            const field = this.storyForm.resource[key];
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
            console.warn('[storyFormResource] blocking advance — missing translations:', this.missingTranslations);
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
