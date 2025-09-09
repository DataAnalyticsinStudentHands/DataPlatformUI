<!--
goalFormGrowth.vue
Form component for collecting user growth expectations across eight key skill areas.
Users select their anticipated level of growth (none, little, moderate, or a lot) for each area
including problem solving, communication, teamwork, cultural humility, ethical decision making,
professional responsibility, social responsibility, and digital literacy.
For CHW experiences, additional CHW-specific growth goals are included.
-->

<template>
<!-- Main form wrapper with validation handling -->
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
<v-container>
    <!-- Growth section title -->
    <p 
    class="font-weight-black text-h6">{{$t('Growth')}}</p>
    
    <!-- Problem solving growth expectation -->
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
    
    <!-- Effective communication growth expectation -->
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
    
    <!-- Teamwork growth expectation -->
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
    
    <!-- Cultural humility growth expectation -->
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
    
    <!-- Ethical decision making growth expectation -->
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
    
    <!-- Professional responsibility growth expectation -->
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
    
    <!-- Social responsibility growth expectation -->
    <v-col cols="12" md="10">
        <span 
        :class="{'error-text': isSocialResponsibilityGoalInvalid}"
        class="font-weight-black text-h8"
        ref="socialResponsibilityGoalRef"
        >
        {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('social responsibility.') }}</u>
        </span>
        <v-radio-group 
        v-model="goalForm.growthGoal.socialResponsibilityGoal"
        :class="{'error-text': isSocialResponsibilityGoalInvalid}"
        :rules="socialResponsibilityGoalRules"
        >
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>
    
    <!-- Digital literacy growth expectation -->
    <v-col cols="12" md="10">
        <span 
        :class="{'error-text': isDigitalLiteracyGoalInvalid}"
        class="font-weight-black text-h8"
        ref="digitalLiteracyGoalRef"
        >
        {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('digital literacy.') }}</u>
        </span>
        <v-radio-group 
        v-model="goalForm.growthGoal.digitalLiteracyGoal"
        :class="{'error-text': isDigitalLiteracyGoalInvalid}"
        :rules="digitalLiteracyGoalRules"
        >
            <v-radio :label="$t('No growth')" value="No growth"></v-radio>
            <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
            <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
            <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
        </v-radio-group>
    </v-col>

    <!-- CHW Growth Goals Section (conditional) -->
    <div v-if="isCHWExperience">
        <!-- Interpersonal Relationship Building -->
        <v-col cols="12" md="10">
            <span 
                :class="{'error-text': isCHWInterpersonalGoalInvalid}"
                class="font-weight-black text-h8"
                ref="chwInterpersonalGoalRef"
            >
                {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('interpersonal and relationship building') }}</u>.
            </span>
            <v-radio-group 
                v-model="goalForm.chwGrowthGoals.interpersonalRelationshipBuildingGoal"
                :class="{'error-text': isCHWInterpersonalGoalInvalid}"
                :rules="chwGoalRules"
            >
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
        
        <!-- Service Coordination and Navigation -->
        <v-col cols="12" md="10">
            <span 
                :class="{'error-text': isCHWServiceCoordGoalInvalid}"
                class="font-weight-black text-h8"
                ref="chwServiceCoordGoalRef"
            >
                {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('service coordination and navigation') }}</u>.
            </span>
            <v-radio-group 
                v-model="goalForm.chwGrowthGoals.serviceCoordinationNavigationGoal"
                :class="{'error-text': isCHWServiceCoordGoalInvalid}"
                :rules="chwGoalRules"
            >
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
        
        <!-- Evaluation and Research -->
        <v-col cols="12" md="10">
            <span 
                :class="{'error-text': isCHWEvaluationGoalInvalid}"
                class="font-weight-black text-h8"
                ref="chwEvaluationGoalRef"
            >
                {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('evaluation and research') }}</u>.
            </span>
            <v-radio-group 
                v-model="goalForm.chwGrowthGoals.evaluationResearchGoal"
                :class="{'error-text': isCHWEvaluationGoalInvalid}"
                :rules="chwGoalRules"
            >
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
        
        <!-- Knowledge Base on Health Issues -->
        <v-col cols="12" md="10">
            <span 
                :class="{'error-text': isCHWKnowledgeGoalInvalid}"
                class="font-weight-black text-h8"
                ref="chwKnowledgeGoalRef"
            >
                {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('knowledge base on specific health issues') }}</u>.
            </span>
            <v-radio-group 
                v-model="goalForm.chwGrowthGoals.knowledgeBaseHealthIssuesGoal"
                :class="{'error-text': isCHWKnowledgeGoalInvalid}"
                :rules="chwGoalRules"
            >
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
        
        <!-- Teaching and Education -->
        <v-col cols="12" md="10">
            <span 
                :class="{'error-text': isCHWTeachingGoalInvalid}"
                class="font-weight-black text-h8"
                ref="chwTeachingGoalRef"
            >
                {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('teaching and education') }}</u>.
            </span>
            <v-radio-group 
                v-model="goalForm.chwGrowthGoals.teachingEducationGoal"
                :class="{'error-text': isCHWTeachingGoalInvalid}"
                :rules="chwGoalRules"
            >
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
        
        <!-- Advocacy -->
        <v-col cols="12" md="10">
            <span 
                :class="{'error-text': isCHWAdvocacyGoalInvalid}"
                class="font-weight-black text-h8"
                ref="chwAdvocacyGoalRef"
            >
                {{ $t('Please indicate your expectation of the growth you anticipate to see during your program in the area of') }} <u>{{ $t('advocacy') }}</u>.
            </span>
            <v-radio-group 
                v-model="goalForm.chwGrowthGoals.advocacyGoal"
                :class="{'error-text': isCHWAdvocacyGoalInvalid}"
                :rules="chwGoalRules"
            >
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </div>
</v-container>
</v-form>

<!-- Floating error navigation button -->
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
    goalForm: Object,
    isCHWExperience: {
        type: Boolean,
        default: false
    }
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
data() {
    return {
        // Form submission state and UI control
        formSubmitted: false,
        jumpToErrorTooltip: false,
        
        // Validation rules for each growth area
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
        socialResponsibilityGoalRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    return !!v || this.$t('Information is required.');
                },
        ],
        digitalLiteracyGoalRules: [
            v => {
                    if (!this.formSubmitted) return true;
                    return !!v || this.$t('Information is required.');
                },
        ],
        // CHW-specific validation rules
        chwGoalRules: [
            v => {
                if (!this.formSubmitted || !this.isCHWExperience) return true;
                return !!v || this.$t('Information is required.');
            },
        ],
    }
},
watch: {
    // Watch validation state changes and manage tooltip visibility
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
    // Individual validation state computed properties for each growth area
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
    isSocialResponsibilityGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.socialResponsibilityGoal) !== true;
    },
    isDigitalLiteracyGoalInvalid() {
        if (!this.formSubmitted) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.growthGoal.digitalLiteracyGoal) !== true;
    },
    
    // CHW-specific validation computed properties
    isCHWInterpersonalGoalInvalid() {
        if (!this.formSubmitted || !this.isCHWExperience) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.chwGrowthGoals?.interpersonalRelationshipBuildingGoal) !== true;
    },
    isCHWServiceCoordGoalInvalid() {
        if (!this.formSubmitted || !this.isCHWExperience) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.chwGrowthGoals?.serviceCoordinationNavigationGoal) !== true;
    },
    isCHWEvaluationGoalInvalid() {
        if (!this.formSubmitted || !this.isCHWExperience) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.chwGrowthGoals?.evaluationResearchGoal) !== true;
    },
    isCHWKnowledgeGoalInvalid() {
        if (!this.formSubmitted || !this.isCHWExperience) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.chwGrowthGoals?.knowledgeBaseHealthIssuesGoal) !== true;
    },
    isCHWTeachingGoalInvalid() {
        if (!this.formSubmitted || !this.isCHWExperience) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.chwGrowthGoals?.teachingEducationGoal) !== true;
    },
    isCHWAdvocacyGoalInvalid() {
        if (!this.formSubmitted || !this.isCHWExperience) return false;
        const rule = v => !!v || this.$t('Information is required');
        return rule(this.goalForm.chwGrowthGoals?.advocacyGoal) !== true;
    },
    
    // Overall form validation state
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
        
        const baseErrors = this.isProblemSolvingGoalInvalid || 
            this.isEffectiveCommunicationGoalInvalid || 
            this.isTeamworkGoalInvalid || 
            this.isCulturalHumilityGoalInvalid || 
            this.isEthicalDecisionMakingGoalInvalid || 
            this.isProfessionalResponsibilityGoalInvalid || 
            this.isSocialResponsibilityGoalInvalid || 
            this.isDigitalLiteracyGoalInvalid;
        
        // Include CHW validation errors if it's a CHW experience
        if (this.isCHWExperience) {
            return baseErrors || 
                this.isCHWInterpersonalGoalInvalid ||
                this.isCHWServiceCoordGoalInvalid ||
                this.isCHWEvaluationGoalInvalid ||
                this.isCHWKnowledgeGoalInvalid ||
                this.isCHWTeachingGoalInvalid ||
                this.isCHWAdvocacyGoalInvalid;
        }
        
        return baseErrors;
    },
},
mounted() {
    // Initialize CHW growth goals object if this is a CHW experience and it doesn't exist
    if (this.isCHWExperience && !this.goalForm.chwGrowthGoals) {
        this.goalForm.chwGrowthGoals = {
            interpersonalRelationshipBuildingGoal: '',
            serviceCoordinationNavigationGoal: '',
            evaluationResearchGoal: '',
            knowledgeBaseHealthIssuesGoal: '',
            teachingEducationGoal: '',
            advocacyGoal: ''
        };
    }
},
methods: {
    // Handle form validation and emit appropriate events
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

    // Scroll to first error field and emit scroll event
    scrollToErrorField() {
        const errorFields = [
            'problemSolvingGoalRef',
            'effectiveCommunicationGoalRef',
            'teamworkGoalRef',
            'culturalHumilityGoalRef',
            'ethicalDecisionMakingGoalRef',
            'professionalResponsibilityGoalRef',
            'socialResponsibilityGoalRef',
            'digitalLiteracyGoalRef',
        ];
        
        // Add CHW fields if it's a CHW experience
        if (this.isCHWExperience) {
            errorFields.push(
                'chwInterpersonalGoalRef',
                'chwServiceCoordGoalRef',
                'chwEvaluationGoalRef',
                'chwKnowledgeGoalRef',
                'chwTeachingGoalRef',
                'chwAdvocacyGoalRef'
            );
        }

        for (let i = 0; i < errorFields.length; i++) {
            if (this.isFieldInvalid(errorFields[i])) {
                const ref = this.$refs[errorFields[i]];
                const element = ref.$el ? ref.$el : ref;
                this.$emit('scroll-to-error', element);
                break;
            }
        }
    },

    // Check if specific field has validation errors
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
            case 'socialResponsibilityGoalRef':
                return this.isSocialResponsibilityGoalInvalid;
            case 'digitalLiteracyGoalRef':
                return this.isDigitalLiteracyGoalInvalid;
            // CHW fields
            case 'chwInterpersonalGoalRef':
                return this.isCHWInterpersonalGoalInvalid;
            case 'chwServiceCoordGoalRef':
                return this.isCHWServiceCoordGoalInvalid;
            case 'chwEvaluationGoalRef':
                return this.isCHWEvaluationGoalInvalid;
            case 'chwKnowledgeGoalRef':
                return this.isCHWKnowledgeGoalInvalid;
            case 'chwTeachingGoalRef':
                return this.isCHWTeachingGoalInvalid;
            case 'chwAdvocacyGoalRef':
                return this.isCHWAdvocacyGoalInvalid;
            default:
                return false;
        }
    },
},
}
</script>

<style scoped>
/* Error text styling */
.error-text {
    color: rgb(176, 0, 32);
}

/* Fixed error navigation button */
.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>