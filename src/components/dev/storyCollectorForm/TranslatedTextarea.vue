<!--
TranslatedTextarea.vue
Reusable question + translation pair. Renders a single textarea when the
interview language is English, or two stacked textareas (original + English
translation) otherwise. Used for every translated field across the Community,
Resource Feedback, and Partnership steps.
-->

<template>
<div class="translated-field">
    <p
        :class="{ 'error-text': showError }"
        class="font-weight-black text-h8 mb-1"
    >
        {{ label }}<span v-if="required" class="error-text"> *</span>
    </p>

    <v-textarea
        :model-value="original"
        @update:model-value="$emit('update:original', $event)"
        :label="originalFieldLabel"
        :rules="originalRules"
        :error="showError && !isOriginalValid"
        :rows="rows"
        auto-grow
        density="comfortable"
    ></v-textarea>

    <v-textarea
        v-if="showTranslation"
        :model-value="translation"
        @update:model-value="$emit('update:translation', $event)"
        label="English translation"
        prepend-inner-icon="mdi-translate"
        :rules="translationRules"
        :error="showError && !isTranslationValid"
        :rows="rows"
        auto-grow
        density="comfortable"
        class="translation-field"
    ></v-textarea>
</div>
</template>

<script>
const LANGUAGE_LABELS = {
    en: "English",
    es: "Spanish",
    vi: "Vietnamese",
    zh: "Mandarin",
    other: "original language",
};

export default {
name: "TranslatedTextarea",
props: {
    label: { type: String, required: true },
    original: { type: String, default: "" },
    translation: { type: String, default: "" },
    interviewLanguage: { type: String, default: "en" },
    required: { type: Boolean, default: false },
    rows: { type: Number, default: 2 },
    formSubmitted: { type: Boolean, default: false },
},
emits: ["update:original", "update:translation"],
computed: {
    showTranslation() {
        return this.interviewLanguage && this.interviewLanguage !== "en";
    },
    languageLabel() {
        return LANGUAGE_LABELS[this.interviewLanguage] || "original language";
    },
    originalFieldLabel() {
        return this.showTranslation ? `Response in ${this.languageLabel}` : "";
    },
    originalHasContent() {
        return !!(this.original && this.original.trim());
    },
    translationHasContent() {
        return !!(this.translation && this.translation.trim());
    },
    isOriginalValid() {
        if (this.required) return this.originalHasContent;
        return true;
    },
    isTranslationValid() {
        if (!this.showTranslation) return true;
        if (this.originalHasContent && !this.translationHasContent) return false;
        return true;
    },
    showError() {
        return this.formSubmitted && (!this.isOriginalValid || !this.isTranslationValid);
    },
    originalRules() {
        if (!this.required) return [];
        return [v => (!!v && v.trim().length > 0) || "This field is required"];
    },
    translationRules() {
        if (!this.showTranslation) return [];
        return [
            v => {
                if (!this.originalHasContent) return true;
                if (!!v && v.trim().length > 0) return true;
                return "English translation is required when a response is entered";
            },
        ];
    },
},
};
</script>

<style scoped>
.translated-field {
    margin-bottom: 16px;
}
.error-text {
    color: rgb(176, 0, 32);
}
.translation-field :deep(.v-field) {
    background: #fafafa;
}
</style>
