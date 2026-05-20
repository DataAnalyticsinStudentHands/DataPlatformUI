<!--
storyFormContext.vue
Step 0 — Context / metadata for a collected story. Captures recording date,
zip code, participant age & race/ethnicity, contact type, and the interview
language (which drives the translation UI in later steps).
-->

<template>
<v-form ref="form" @submit.prevent="handleValidations">
<v-container>
    <v-row>
        <v-col>
            <p class="font-weight-black text-h6">Context</p>
            <p class="text-subtitle-2" style="color: grey;">
                Basic information about this story and the interview.
            </p>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="6">
            <p :class="{ 'error-text': isDateInvalid }" class="font-weight-black text-h8 mb-1">
                Recorded Date<span class="error-text"> *</span>
            </p>
            <v-text-field
                v-model="storyForm.context.recordedDate"
                type="date"
                :rules="dateRules"
                :error="isDateInvalid"
            ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
            <p :class="{ 'error-text': isZipInvalid }" class="font-weight-black text-h8 mb-1">
                Zip code where story was collected<span class="error-text"> *</span>
            </p>
            <v-text-field
                v-model="storyForm.context.zipCode"
                label="5-digit ZIP"
                :rules="zipRules"
                :error="isZipInvalid"
                maxlength="5"
            ></v-text-field>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="4">
            <p :class="{ 'error-text': isAgeInvalid }" class="font-weight-black text-h8 mb-1">
                Age of participant<span class="error-text"> *</span>
            </p>
            <v-select
                v-model="storyForm.context.age"
                :items="ageOptions"
                :rules="requiredRules"
                :error="isAgeInvalid"
            ></v-select>
        </v-col>

        <v-col cols="12" md="8">
            <p :class="{ 'error-text': isRaceInvalid }" class="font-weight-black text-h8 mb-1">
                Race / ethnicity of participant<span class="error-text"> *</span>
            </p>
            <v-select
                v-model="storyForm.context.raceEthnicity"
                :items="raceEthnicityOptions"
                :rules="requiredRules"
                :error="isRaceInvalid"
            ></v-select>

            <div v-if="isOtherRaceSelected">
                <p
                    :class="{ 'error-text': isRaceOtherInvalid }"
                    class="font-weight-black text-h8 mb-1"
                >
                    Please specify<span class="error-text"> *</span>
                </p>
                <v-text-field
                    v-model="storyForm.context.raceEthnicityOther"
                    :rules="raceOtherRules"
                    :error="isRaceOtherInvalid"
                ></v-text-field>
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="6">
            <p :class="{ 'error-text': isContactTypeInvalid }" class="font-weight-black text-h8 mb-1">
                Contact type<span class="error-text"> *</span>
            </p>
            <v-select
                v-model="storyForm.context.contactType"
                :items="contactTypeOptions"
                :rules="requiredRules"
                :error="isContactTypeInvalid"
            ></v-select>
        </v-col>

        <v-col cols="12" md="6">
            <p :class="{ 'error-text': isLanguageInvalid }" class="font-weight-black text-h8 mb-1">
                Interview language<span class="error-text"> *</span>
            </p>
            <p class="text-caption" style="color: grey; margin-top: -4px;">
                Drives whether a translation field appears for each open question.
            </p>
            <!-- TODO: confirm language list with client -->
            <v-select
                v-model="storyForm.context.interviewLanguage"
                :items="interviewLanguageOptions"
                item-title="label"
                item-value="value"
                :rules="requiredRules"
                :error="isLanguageInvalid"
            ></v-select>
        </v-col>
    </v-row>
</v-container>
</v-form>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
name: "StoryFormContext",
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
        ageOptions: [
            "18-24",
            "25-44",
            "45-64",
            "65 and older",
        ],
        raceEthnicityOptions: [
            "Hispanic and Latino Americans",
            "Black and African Americans",
            "White and European Americans",
            "Asian Americans",
            "Middle Easterners and North Africans",
            "Native Americans and Alaska Natives",
            "Other (please specify):",
        ],
        contactTypeOptions: [
            "First time story",
            "Follow-up story",
            "Partnership",
        ],
        interviewLanguageOptions: [
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "vi", label: "Vietnamese" },
            { value: "zh", label: "Mandarin" },
            { value: "other", label: "Other" },
        ],
        requiredRules: [v => !!v || "This field is required"],
        dateRules: [v => !!v || "Date is required"],
        zipRules: [
            v => !!v || "Zip code is required",
            v => /^\d{5}$/.test(v) || "Must be a 5-digit zip code",
        ],
        raceOtherRules: [
            v => !!(v && v.trim()) || "Please specify",
        ],
    };
},
computed: {
    isOtherRaceSelected() {
        return this.storyForm.context.raceEthnicity === "Other (please specify):";
    },
    isDateInvalid() {
        if (!this.formSubmitted) return false;
        return !this.storyForm.context.recordedDate;
    },
    isZipInvalid() {
        if (!this.formSubmitted) return false;
        const v = this.storyForm.context.zipCode;
        return !v || !/^\d{5}$/.test(v);
    },
    isAgeInvalid() {
        if (!this.formSubmitted) return false;
        return !this.storyForm.context.age;
    },
    isRaceInvalid() {
        if (!this.formSubmitted) return false;
        return !this.storyForm.context.raceEthnicity;
    },
    isRaceOtherInvalid() {
        if (!this.formSubmitted) return false;
        if (!this.isOtherRaceSelected) return false;
        const v = this.storyForm.context.raceEthnicityOther;
        return !v || !v.trim();
    },
    isContactTypeInvalid() {
        if (!this.formSubmitted) return false;
        return !this.storyForm.context.contactType;
    },
    isLanguageInvalid() {
        if (!this.formSubmitted) return false;
        return !this.storyForm.context.interviewLanguage;
    },
    hasAnyError() {
        return (
            this.isDateInvalid ||
            this.isZipInvalid ||
            this.isAgeInvalid ||
            this.isRaceInvalid ||
            this.isRaceOtherInvalid ||
            this.isContactTypeInvalid ||
            this.isLanguageInvalid
        );
    },
},
watch: {
    "storyForm.context.raceEthnicity"(newVal) {
        if (newVal !== "Other (please specify):") {
            this.storyForm.context.raceEthnicityOther = "";
        }
    },
},
methods: {
    handleValidations() {
        this.formSubmitted = true;

        if (!this.hasAnyError) {
            this.$emit('form-valid');
        } else {
            // eslint-disable-next-line no-console
            console.warn('[storyFormContext] blocking advance:', {
                isDateInvalid: this.isDateInvalid,
                isZipInvalid: this.isZipInvalid,
                isAgeInvalid: this.isAgeInvalid,
                isRaceInvalid: this.isRaceInvalid,
                isRaceOtherInvalid: this.isRaceOtherInvalid,
                isContactTypeInvalid: this.isContactTypeInvalid,
                isLanguageInvalid: this.isLanguageInvalid,
            });
            this.$emit('form-invalid');
            toast.error("Please complete all required fields.", {
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
