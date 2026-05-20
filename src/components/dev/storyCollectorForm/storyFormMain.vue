<!--
storyFormMain.vue
Orchestrator for the Story Collector form. Manages a 5-step stepper (Context,
Community, Resource Feedback, Partnership, Review), holds the shared form
data, delegates validation to child components, and on submit flattens the
nested {original, translation} shape into the export column layout.
-->

<template>
<v-container style="width: 100%; margin: 0 auto;">
    <div style="display: flex; align-items: center;">
        <p class="font-weight-black text-h5 text--primary">
            Story Collector Form
        </p>
        <v-dialog width="500">
            <template v-slot:activator="{ props }">
                <v-btn
                    size="x-small"
                    class="pb-2"
                    variant="text"
                    icon="mdi-help-circle-outline"
                    flat
                    v-bind="props"
                ></v-btn>
            </template>
            <template v-slot:default="{ isActive }">
                <v-card title="Story Collector Form">
                    <v-card-text>
                        Use this form to collect user stories. Choose the interview
                        language on the first step — if it is not English, a
                        translation field will appear under every open-ended
                        question so the original response and its English
                        translation can both be recorded.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="Close" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
    <p class="text-subtitle-1">
        Fill out all four sections, then review before submitting.
    </p>
</v-container>

<v-container>
    <v-row>
        <v-col>
            <v-stepper
                :alt-labels="showAltLabels"
                v-model="currentStep"
                :mobile="$vuetify.display.xs"
                :flat="$vuetify.display.xs"
            >
                <v-stepper-header>
                    <v-stepper-item
                        title="Context"
                        icon="mdi-information-outline"
                        edit-icon="mdi-information-outline"
                        value="0"
                        :error="contextError"
                        :editable="checkJump(0)"
                    ></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item
                        title="Community"
                        icon="mdi-home-city-outline"
                        edit-icon="mdi-home-city-outline"
                        value="1"
                        :error="communityError"
                        :editable="checkJump(1)"
                    ></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item
                        title="Resource Feedback"
                        icon="mdi-hand-heart"
                        edit-icon="mdi-hand-heart"
                        value="2"
                        :error="resourceError"
                        :editable="checkJump(2)"
                    ></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item
                        title="Partnership"
                        icon="mdi-handshake-outline"
                        edit-icon="mdi-handshake-outline"
                        value="3"
                        :error="partnershipError"
                        :editable="checkJump(3)"
                    ></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item
                        title="Review"
                        icon="mdi-check-bold"
                        edit-icon="mdi-check-bold"
                        value="4"
                        :editable="checkJump(4)"
                    ></v-stepper-item>
                </v-stepper-header>

                <div id="progress-bar" :style="{ width: progressBarWidth }"></div>

                <v-container>
                    <v-stepper-window v-if="$vuetify.display.smAndUp">
                        <v-stepper-window-item value="0">
                            <story-form-context
                                ref="StoryFormContextRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('context')"
                            ></story-form-context>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="1">
                            <story-form-community
                                ref="StoryFormCommunityRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('community')"
                            ></story-form-community>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="2">
                            <story-form-resource
                                ref="StoryFormResourceRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('resource')"
                            ></story-form-resource>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="3">
                            <story-form-partnership
                                ref="StoryFormPartnershipRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('partnership')"
                            ></story-form-partnership>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="4">
                            <story-form-review
                                :storyForm="storyForm"
                                @change-step="currentStep = $event"
                            ></story-form-review>
                        </v-stepper-window-item>
                    </v-stepper-window>

                    <v-scroll-x-reverse-transition v-if="$vuetify.display.xs">
                        <div v-show="currentStep === 0" key="step0">
                            <story-form-context
                                ref="StoryFormContextRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('context')"
                            ></story-form-context>
                        </div>
                        <div v-show="currentStep === 1" key="step1">
                            <story-form-community
                                ref="StoryFormCommunityRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('community')"
                            ></story-form-community>
                        </div>
                        <div v-show="currentStep === 2" key="step2">
                            <story-form-resource
                                ref="StoryFormResourceRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('resource')"
                            ></story-form-resource>
                        </div>
                        <div v-show="currentStep === 3" key="step3">
                            <story-form-partnership
                                ref="StoryFormPartnershipRef"
                                :storyForm="storyForm"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('partnership')"
                            ></story-form-partnership>
                        </div>
                        <div v-show="currentStep === 4" key="step4">
                            <story-form-review
                                :storyForm="storyForm"
                                @change-step="currentStep = $event"
                            ></story-form-review>
                        </div>
                    </v-scroll-x-reverse-transition>
                </v-container>

                <v-row justify="space-between" class="ma-1">
                    <v-col cols="auto">
                        <v-btn
                            v-if="currentStep !== 0"
                            type="button"
                            @click="handlePreviousClick"
                            class="btn"
                        >
                            Previous
                        </v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn
                            v-if="currentStep === lastStep"
                            type="submit"
                            @click="submitForm"
                            class="btn"
                        >
                            Submit Form
                        </v-btn>
                        <v-btn
                            v-else
                            type="submit"
                            @click="triggerValidation"
                            class="btn"
                        >
                            Next
                        </v-btn>
                    </v-col>
                </v-row>
            </v-stepper>
        </v-col>
    </v-row>
</v-container>

<v-dialog v-model="leaveDialog" persistent max-width="500px">
    <v-card>
        <v-card-title class="text-h5">Confirm Navigation</v-card-title>
        <v-card-text>
            <p>You have unsaved changes. Are you sure you want to leave this page?</p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelLeave">Cancel</v-btn>
            <v-btn color="red darken-2" text @click="confirmLeave">Yes, Leave</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import isEqual from 'lodash.isequal';
import StoryFormContext from './storyFormContext.vue';
import StoryFormCommunity from './storyFormCommunity.vue';
import StoryFormResource from './storyFormResource.vue';
import StoryFormPartnership from './storyFormPartnership.vue';
import StoryFormReview from './storyFormReview.vue';

// Maps the nested storyForm data model to the flat column names used by the
// export. Produces an object whose keys match the 43 columns from the source
// spreadsheet; downstream code (backend or CSV exporter) can rely on these
// exact names. Note: normalizes the export's 'Translatiom' typo to 'Translation'.
function flattenForExport(storyForm) {
    const c = storyForm.context;
    const community = storyForm.community;
    const resource = storyForm.resource;
    const partnership = storyForm.partnership;

    return {
        "Recorded Date": c.recordedDate,
        "Which zip code was the story collected in?": c.zipCode,
        "Age of participant:": c.age,
        "Race/ethnicity of participant: - Selected Choice": c.raceEthnicity,
        "Race/ethnicity of participant: - Other (please specify):": c.raceEthnicityOther,
        "Contact type:": c.contactType,
        "Interview language": c.interviewLanguage,

        "Do you like your community in Houston? Why?": community.likeCommunity.original,
        "Translation - Do you like your community in Houston? Why?": community.likeCommunity.translation,
        "Within your community, what negatively affects your quality of life?": community.negativeFactors.original,
        "Translation - Within your community, what negatively affects your quality of life?": community.negativeFactors.translation,
        "What are some good things within your community that you think can be used to solve/address these negative factors?": community.positiveFactors.original,
        "Translation - What are some good things within your community that you think can be used to solve/address these negative factors?": community.positiveFactors.translation,
        "In your community, what are some things that help people be healthy? What resources are useful?": community.healthResources.original,
        "Translation - In your community, what are some things that help people be healthy? What resources are useful?": community.healthResources.translation,
        "In your community, what is preventing people from being healthy?": community.healthBarriers.original,
        "Translation - In your community, what is preventing people from being healthy?": community.healthBarriers.translation,
        "Open notes: (community)": community.openNotes.original,
        "Translation - Open notes: (community)": community.openNotes.translation,

        "Name of resource, workshop, or event:": resource.resourceName.original,
        "Translation - Name of resource, workshop, or event:": resource.resourceName.translation,
        "How was your experience? Why?": resource.experience.original,
        "Translation - How was your experience? Why?": resource.experience.translation,
        "Would you recommend it to anyone else? Have you shared it with other people, family, friends?": resource.wouldRecommend.original,
        "Translation - Would you recommend it to anyone else? Have you shared it with other people, family, friends?": resource.wouldRecommend.translation,
        "Are there any other health concerns or barriers that I may assist you with?": resource.otherConcerns.original,
        "Translation - Are there any other health concerns or barriers that I may assist you with?": resource.otherConcerns.translation,
        "Open notes: (resource)": resource.openNotes.original,
        "Translation - Open notes: (resource)": resource.openNotes.translation,

        "Name of organization:": partnership.orgName,
        "Name of representative:": partnership.repName,
        "Email of representative:": partnership.repEmail,
        "Phone number of representative:": partnership.repPhone,
        "Can we collaborate on activities? What type activities?": partnership.collaborateOnActivities.original,
        "Translation - Can we collaborate on activities? What type activities?": partnership.collaborateOnActivities.translation,
        "Can they refer people to us?": partnership.referPeople.original,
        "Translation - Can they refer people to us?": partnership.referPeople.translation,
        "Can we join their events with a table?": partnership.joinWithTable.original,
        "Translation - Can we join their events with a table?": partnership.joinWithTable.translation,
        "Can we host an event or do education at their location?": partnership.hostEventAtLocation.original,
        "Translation - Can we host an event or do education at their location?": partnership.hostEventAtLocation.translation,
        "Can we participate at their activities? What type activities?": partnership.participateAtActivities.original,
        "Translation - Can we participate at their activities? What type activities?": partnership.participateAtActivities.translation,
        "Open notes: (partnership)": partnership.openNotes.original,
        "Translation - Open notes: (partnership)": partnership.openNotes.translation,
    };
}

function makeEmptyStoryForm() {
    const empty = () => ({ original: "", translation: "" });
    return {
        context: {
            recordedDate: new Date().toISOString().slice(0, 10),
            zipCode: "",
            age: "",
            raceEthnicity: "",
            raceEthnicityOther: "",
            contactType: "",
            interviewLanguage: "en",
        },
        community: {
            likeCommunity: empty(),
            negativeFactors: empty(),
            positiveFactors: empty(),
            healthResources: empty(),
            healthBarriers: empty(),
            openNotes: empty(),
        },
        resource: {
            resourceName: empty(),
            experience: empty(),
            wouldRecommend: empty(),
            otherConcerns: empty(),
            openNotes: empty(),
        },
        partnership: {
            orgName: "",
            repName: "",
            repEmail: "",
            repPhone: "",
            collaborateOnActivities: empty(),
            referPeople: empty(),
            joinWithTable: empty(),
            hostEventAtLocation: empty(),
            participateAtActivities: empty(),
            openNotes: empty(),
        },
    };
}

export default {
name: "StoryCollectorForm",
components: {
    StoryFormContext,
    StoryFormCommunity,
    StoryFormResource,
    StoryFormPartnership,
    StoryFormReview,
},
data() {
    return {
        currentStep: 0,
        allowedStepsForJump: [0],

        contextError: false,
        communityError: false,
        resourceError: false,
        partnershipError: false,

        storyForm: makeEmptyStoryForm(),
        originalStoryForm: null,

        leaveDialog: false,
        nextFunction: null,
        formSubmitSuccess: false,
    };
},
computed: {
    lastStep() {
        return 4;
    },
    totalSteps() {
        return this.lastStep + 1;
    },
    progressBarWidth() {
        return ((this.currentStep + 1) / this.totalSteps) * 100 + '%';
    },
    showAltLabels() {
        return this.$vuetify.display.smAndUp;
    },
},
mounted() {
    this.originalStoryForm = JSON.parse(JSON.stringify(this.storyForm));
},
methods: {
    checkJump(step) {
        return this.allowedStepsForJump.includes(step);
    },
    triggerValidation() {
        switch (this.currentStep) {
            case 0: this.$refs.StoryFormContextRef?.handleValidations(); break;
            case 1: this.$refs.StoryFormCommunityRef?.handleValidations(); break;
            case 2: this.$refs.StoryFormResourceRef?.handleValidations(); break;
            case 3: this.$refs.StoryFormPartnershipRef?.handleValidations(); break;
            default: break;
        }
    },
    handleFormValid() {
        this.clearErrorForStep(this.currentStep);
        if (!this.allowedStepsForJump.includes(this.currentStep + 1)) {
            this.allowedStepsForJump.push(this.currentStep + 1);
        }
        this.currentStep++;
    },
    handleFormInvalid(section) {
        if (section === 'context') this.contextError = true;
        else if (section === 'community') this.communityError = true;
        else if (section === 'resource') this.resourceError = true;
        else if (section === 'partnership') this.partnershipError = true;
    },
    clearErrorForStep(step) {
        if (step === 0) this.contextError = false;
        else if (step === 1) this.communityError = false;
        else if (step === 2) this.resourceError = false;
        else if (step === 3) this.partnershipError = false;
    },
    handlePreviousClick() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    },
    submitForm() {
        // TODO: POST to backend when endpoints exist.
        const payload = flattenForExport(this.storyForm);
        // eslint-disable-next-line no-console
        console.log('Story Collector Form submission payload:', payload);
        this.formSubmitSuccess = true;
        this.originalStoryForm = JSON.parse(JSON.stringify(this.storyForm));
        toast.success('Story submitted (scaffold stub — no backend yet).', {
            position: 'top-right',
            multiple: false,
        });
    },
    cancelLeave() {
        this.leaveDialog = false;
        this.nextFunction = null;
    },
    confirmLeave() {
        this.leaveDialog = false;
        if (this.nextFunction) {
            const proceed = this.nextFunction;
            this.nextFunction = null;
            proceed();
        }
    },
},
beforeRouteLeave(to, from, next) {
    const dirty = !isEqual(this.storyForm, this.originalStoryForm);
    if (dirty && !this.formSubmitSuccess) {
        this.leaveDialog = true;
        this.nextFunction = next;
    } else {
        next();
    }
},
};
</script>

<style scoped>
#progress-bar {
    height: 4px;
    background: #c8102e;
    transition: width 0.3s ease;
}
</style>
