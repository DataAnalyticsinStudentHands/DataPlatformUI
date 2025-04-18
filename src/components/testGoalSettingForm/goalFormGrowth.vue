<template>
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
<v-container>
    <!-- growth section -->
    <p 
    class="font-weight-black text-h6">{{$t('Growth')}}</p>
    <v-col cols="12" md="10">
        <span 
            :class="{'error-text': isProblemSolvingGoalInvalid}"
            class="font-weight-black text-h8"
            ref="problemSolvingGoalRef"
        >
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('problem solving') }}</u>.
        </span>

        <v-radio-group 
        :class="{'error-text': isProblemSolvingGoalInvalid}"
        v-model="goalForm.growthGoal.problemSolvingGoal" 
        :rules="problemSolvingGoalRules"
        >
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>
    <v-col cols="12" md="10">
        <span 
        :class="{'error-text': isEffectiveCommunicationGoalInvalid}"
        class="font-weight-black text-h8"
        ref="effectiveCommunicationGoalRef"
        >
        {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('effective communication.') }}</u>
        </span>
        <v-radio-group 
        v-model="goalForm.growthGoal.effectiveCommunicationGoal"
        :class="{'error-text': isEffectiveCommunicationGoalInvalid}"
        :rules="effectiveCommunicationGoalRules">
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>
    <v-col cols="12" md="10">
        <span
        :class="{'error-text': isTeamworkGoalInvalid}"
        class="font-weight-black text-h8"
        ref="teamworkGoalRef"
        >
        {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('teamwork.') }}</u>
        </span>
        <v-radio-group 
        v-model="goalForm.growthGoal.teamworkGoal"
        :class="{'error-text': isTeamworkGoalInvalid}"
        :rules="teamworkGoalRules">
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>
    <v-col cols="12" md="10">
        <span 
        :class="{'error-text': isCulturalHumilityGoalInvalid}"
        class="font-weight-black text-h8"
        ref="culturalHumilityGoalRef"
        >
            {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('cultural humility.') }}</u>
        </span>
        <v-radio-group 
        v-model="goalForm.growthGoal.culturalHumilityGoal"
        :class="{'error-text': isCulturalHumilityGoalInvalid}"
        :rules="culturalHumilityGoalRules">
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>
    <v-col cols="12" md="10">
        <span 
        :class="{'error-text': isEthicalDecisionMakingGoalInvalid}"
        class="font-weight-black text-h8"
        ref="ethicalDecisionMakingGoalRef"
        >
        {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('ethical decision making.') }}</u>
        </span>
        <v-radio-group 
        v-model="goalForm.growthGoal.ethicalDecisionMakingGoal"
        :class="{'error-text': isEthicalDecisionMakingGoalInvalid}"
        :rules="ethicalDecisionMakingGoalRules">
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>
    <v-col cols="12" md="10">
        <span 
        :class="{'error-text': isProfessionalResponsibilityGoalInvalid}"
        class="font-weight-black text-h8"
        ref="professionalResponsibilityGoalRef"
        >
        {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('professional responsibility.') }}</u>
        </span>
        <v-radio-group 
        v-model="goalForm.growthGoal.professionalResponsibilityGoal"
        :class="{'error-text': isProfessionalResponsibilityGoalInvalid}"
        :rules="professionalResponsibilityGoalRules"
        >
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>
</v-container>
</v-form>

<!-- Scroll to Error Button -->
<v-btn
    v-if="hasValidationErrors"
    @click="scrollToErrorField"
    color="error"
    icon
    class="pa-1 fixed-button"
    elevation="4"
    size="small"
>
    <v-icon>mdi-alert-circle</v-icon>
    <v-tooltip activator="parent" location="start" v-model="jumpToErrorTooltip">Jump to Error</v-tooltip>
</v-btn>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
name: "GoalFormGrowth",
props: {
    goalForm: Object
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
data() {
    return {
        formSubmitted: false,
        jumpToErrorTooltip: false,
        problemSolvingGoalRules: [
            v => {
                if (!this.formSubmitted) return true;

                return !!v || this.$t('Information is required.');
            },
        ],
        effectiveCommunicationGoalRules: [
            v => {
                    if (!this.formSubmitted) return true;

                    return !!v || this.$t('Information is required.');
                },
        ],
        teamworkGoalRules: [
            v => {
                    if (!this.formSubmitted) return true;

                    return !!v || this.$t('Information is required.');
                },
        ],
        culturalHumilityGoalRules: [
        v => {
                if (!this.formSubmitted) return true;

                return !!v || this.$t('Information is required.');
            },
        ],
        ethicalDecisionMakingGoalRules: [
        v => {
                if (!this.formSubmitted) return true;

                return !!v || this.$t('Information is required.');
            },
        ],
        professionalResponsibilityGoalRules: [
        v => {
                if (!this.formSubmitted) return true;

                return !!v || this.$t('Information is required.');
            },
        ],
    }
},
watch: {
    hasValidationErrors(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.$emit('validation-change', { isValid: !newValue });
        }
        if (newValue) {
            this.jumpToErrorTooltip = true;
        } else {
            this.jumpToErrorTooltip = false;
        }
    },
},
computed: {
    isProblemSolvingGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.problemSolvingGoal) !== true;
    },
    isEffectiveCommunicationGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.effectiveCommunicationGoal) !== true;
    },
    isTeamworkGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.teamworkGoal) !== true;
    },
    isCulturalHumilityGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.culturalHumilityGoal) !== true;
    },
    isEthicalDecisionMakingGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.ethicalDecisionMakingGoal) !== true;
    },
    isProfessionalResponsibilityGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.professionalResponsibilityGoal) !== true;
    },
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
            return this.isProblemSolvingGoalInvalid || this.isEffectiveCommunicationGoalInvalid || this.isTeamworkGoalInvalid || this.isCulturalHumilityGoalInvalid || this.isEthicalDecisionMakingGoalInvalid || this.isProfessionalResponsibilityGoalInvalid;
    },
},
methods: {
    async handleValidations() {
        this.formSubmitted = true;
        const { valid } = await this.$refs.form.validate();
        if (valid) {
            this.$emit('form-valid');
        } else {
            this.$emit('form-invalid');
            toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: false
            });
        }
    },

    scrollToErrorField() {
        const errorFields = [
            'problemSolvingGoalRef',
            'effectiveCommunicationGoalRef',
            'teamworkGoalRef',
            'culturalHumilityGoalRef',
            'ethicalDecisionMakingGoalRef',
            'professionalResponsibilityGoalRef',
        ];

        for (let i = 0; i < errorFields.length; i++) {
            if (this.isFieldInvalid(errorFields[i])) {
                // Emit the actual DOM element or component reference
                const ref = this.$refs[errorFields[i]];
                const element = ref.$el ? ref.$el : ref; // If ref is a Vue component, use ref.$el to get the DOM element
                this.$emit('scroll-to-error', element);
                break;
            }
        }
    },

    isFieldInvalid(fieldRef) {
        switch (fieldRef) {
            case 'problemSolvingGoalRef':
                return this.isProblemSolvingGoalInvalid;
            case 'effectiveCommunicationGoalRef':
                return this.isEffectiveCommunicationGoalInvalid;
            case 'teamworkGoalRef':
                return this.isTeamworkGoalInvalid;
            case 'culturalHumilityGoalRef':
                return this.isCulturalHumilityGoalInvalid;
            case 'ethicalDecisionMakingGoalRef':
                return this.isEthicalDecisionMakingGoalInvalid;
            case 'professionalResponsibilityGoalRef':
                return this.isProfessionalResponsibilityGoalInvalid;
            default:
                return false;
        }
    },

},
}
</script>

<style scoped>
.error-text {
    color: rgb(176, 0, 32);
}

.fixed-button {
    position: fixed;
    bottom: 20px; /* Adjust the bottom value as needed */
    right: 20px; /* Adjust the right value as needed */
    z-index: 1000;
}

</style>