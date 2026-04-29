<!--
storyFormReview.vue
Read-only review step. Displays all 4 sections (Context / Community / Resource
Feedback / Partnership) with pencil-icon edit buttons that jump back to the
respective step. Translated fields render as stacked original + translation.
-->

<template>
<v-form disabled>
<v-container>
    <v-row>
        <v-col>
            <p class="font-weight-black text-h6">Review</p>
            <p class="text-subtitle-2" style="color: grey;">
                Review everything below, then submit. Use the pencil icon on any
                section to make changes.
            </p>
        </v-col>
    </v-row>

    <!-- Section A: Context -->
    <div class="review-section">
        <div class="section-header">
            <h3 class="review-section-title">Context</h3>
            <v-btn icon size="small" variant="text" @click="emitStepChange(0)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </div>

        <div class="field-row">
            <span class="form-label">Recorded date</span>
            <span class="review-value">{{ storyForm.context.recordedDate || emptyPlaceholder }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Zip code</span>
            <span class="review-value">{{ storyForm.context.zipCode || emptyPlaceholder }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Age</span>
            <span class="review-value">{{ storyForm.context.age ?? emptyPlaceholder }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Race / ethnicity</span>
            <span class="review-value">{{ raceEthnicityDisplay }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Contact type</span>
            <span class="review-value">{{ storyForm.context.contactType || emptyPlaceholder }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Interview language</span>
            <span class="review-value">{{ languageLabel(storyForm.context.interviewLanguage) }}</span>
        </div>
    </div>

    <!-- Section B: Community -->
    <div class="review-section">
        <div class="section-header">
            <h3 class="review-section-title">Community</h3>
            <v-btn icon size="small" variant="text" @click="emitStepChange(1)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </div>

        <ReviewTranslatedField
            label="Do you like your community in Houston? Why?"
            :field="storyForm.community.likeCommunity"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="What negatively affects your quality of life?"
            :field="storyForm.community.negativeFactors"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Good things that can address negative factors?"
            :field="storyForm.community.positiveFactors"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Things that help people be healthy? Useful resources?"
            :field="storyForm.community.healthResources"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="What prevents people from being healthy?"
            :field="storyForm.community.healthBarriers"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Open notes"
            :field="storyForm.community.openNotes"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
    </div>

    <!-- Section C: Resource Feedback -->
    <div class="review-section">
        <div class="section-header">
            <h3 class="review-section-title">Resource Feedback</h3>
            <v-btn icon size="small" variant="text" @click="emitStepChange(2)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </div>

        <ReviewTranslatedField
            label="Name of resource, workshop, or event"
            :field="storyForm.resource.resourceName"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="How was your experience? Why?"
            :field="storyForm.resource.experience"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Would you recommend it? Have you shared it?"
            :field="storyForm.resource.wouldRecommend"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Any other health concerns or barriers I may assist with?"
            :field="storyForm.resource.otherConcerns"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Open notes"
            :field="storyForm.resource.openNotes"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
    </div>

    <!-- Section D: Partnership -->
    <div class="review-section">
        <div class="section-header">
            <h3 class="review-section-title">Partnership</h3>
            <v-btn icon size="small" variant="text" @click="emitStepChange(3)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </div>

        <div class="field-row">
            <span class="form-label">Organization</span>
            <span class="review-value">{{ storyForm.partnership.orgName || emptyPlaceholder }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Representative</span>
            <span class="review-value">{{ storyForm.partnership.repName || emptyPlaceholder }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Email</span>
            <span class="review-value">{{ storyForm.partnership.repEmail || emptyPlaceholder }}</span>
        </div>
        <div class="field-row">
            <span class="form-label">Phone</span>
            <span class="review-value">{{ storyForm.partnership.repPhone || emptyPlaceholder }}</span>
        </div>

        <ReviewTranslatedField
            label="Can we collaborate on activities? What type?"
            :field="storyForm.partnership.collaborateOnActivities"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Can they refer people to us?"
            :field="storyForm.partnership.referPeople"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Can we join their events with a table?"
            :field="storyForm.partnership.joinWithTable"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Can we host an event at their location?"
            :field="storyForm.partnership.hostEventAtLocation"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Can we participate at their activities?"
            :field="storyForm.partnership.participateAtActivities"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
        <ReviewTranslatedField
            label="Open notes"
            :field="storyForm.partnership.openNotes"
            :show-translation="showTranslation"
            :empty-placeholder="emptyPlaceholder"
        />
    </div>
</v-container>
</v-form>
</template>

<script>
const LANGUAGE_LABELS = {
    en: "English",
    es: "Spanish",
    vi: "Vietnamese",
    zh: "Mandarin",
    other: "Other",
};

const ReviewTranslatedField = {
    name: "ReviewTranslatedField",
    props: {
        label: { type: String, required: true },
        field: { type: Object, required: true },
        showTranslation: { type: Boolean, default: false },
        emptyPlaceholder: { type: String, default: "(not provided)" },
    },
    template: `
        <div class="translated-review">
            <p class="form-label">{{ label }}</p>
            <p class="review-content">{{ field.original || emptyPlaceholder }}</p>
            <p v-if="showTranslation" class="review-translation">
                <span class="translation-tag">EN</span>
                {{ field.translation || emptyPlaceholder }}
            </p>
        </div>
    `,
};

export default {
name: "StoryFormReview",
components: { ReviewTranslatedField },
props: {
    storyForm: {
        type: Object,
        required: true,
    },
},
emits: ["change-step"],
data() {
    return {
        emptyPlaceholder: "(not provided)",
    };
},
computed: {
    showTranslation() {
        return this.storyForm.context.interviewLanguage !== 'en';
    },
    raceEthnicityDisplay() {
        const race = this.storyForm.context.raceEthnicity;
        if (!race) return this.emptyPlaceholder;
        if (race === "Other (please specify):") {
            const other = this.storyForm.context.raceEthnicityOther;
            return other && other.trim() ? `Other: ${other}` : race;
        }
        return race;
    },
},
methods: {
    emitStepChange(step) {
        this.$emit('change-step', step);
    },
    languageLabel(code) {
        return LANGUAGE_LABELS[code] || this.emptyPlaceholder;
    },
},
};
</script>

<style scoped>
.review-section {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background: #f9f9f9;
    margin-bottom: 16px;
}
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
.review-section-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
}
.field-row {
    display: flex;
    flex-wrap: wrap;
    padding: 4px 0;
    border-bottom: 1px dashed #eee;
}
.field-row:last-of-type {
    border-bottom: none;
}
.form-label {
    color: grey;
    font-weight: 500;
    font-size: 0.75rem;
    flex: 0 0 220px;
    margin: 0;
}
.review-value {
    font-size: 0.9rem;
    flex: 1 1 auto;
}
.translated-review {
    padding: 8px 0;
    border-bottom: 1px dashed #eee;
}
.translated-review:last-of-type {
    border-bottom: none;
}
.review-content {
    font-size: 0.9rem;
    margin: 2px 0 4px 0;
    white-space: pre-wrap;
}
.review-translation {
    font-size: 0.85rem;
    color: #555;
    margin: 4px 0 0 0;
    padding: 6px 10px;
    background: #fff;
    border-left: 3px solid #c8102e;
    border-radius: 3px;
    white-space: pre-wrap;
}
.translation-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    color: #c8102e;
    margin-right: 6px;
    vertical-align: middle;
}
</style>
