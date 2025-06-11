<!--
goalFormGoals.vue
Form component for collecting user goals in the goal setting process.
Validates that users provide at least 3 out of 5 possible experience-specific goals
with detailed examples and guidance for what constitutes a well-defined goal.
-->

<template>
<!-- Main form wrapper with validation handling -->
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
<v-container>
    <v-row>
        <v-col>
            <p 
                class="font-weight-black text-h6"
            >{{$t('Goals')}}</p>
        </v-col>
    </v-row>
    
    <!-- Goals section with comprehensive instructions and examples -->
    <v-col cols="12" md="10">
        <p 
        :class="{'error-text': isGoalsInvalid}"
        class="font-weight-black text-h8">
            <span
            >{{$t('Please outline 3-5 goals that you have for this experience.')}}</span> 
            <br><br>
            {{$t('Goals are statements that describe what it means for an experience to be a success from your perspective,')}}<br><br>
            {{$t('Examples:')}}<br><br>
            <ul>
            <span class="text-subtitle-2 font-weight-black text-h8">
                <li>{{$t('"In this class this semester, I want to develop my research and analytical skills by working on a research project that investigates access to nutrition education in public schools in the greater Houston area."')}}</li>
                <li><br></li>
                <li>{{$t('"I want to analyze a large dataset and learn how to create visuals that effectively communicate my findings. This would allow me to build my technical skills which would help me at many stages of my career."')}}</li>
                <li><br></li>
                <li>{{$t('"I would like to improve my presentation skills and how I communicate with instructors and my peers so that I feel less anxious in front of other people and become more concise in getting my point across."')}}</li>
                <li><br></li>
                <li>{{$t('"I want to practice asking my peers and instructors for help when I feel stuck with my project, rather than trying to figure it out by myself."')}}</li>
                <li><br></li>
            </span>
            </ul>
        </p>

        <!-- Five goal text areas with validation -->
        <v-textarea
            :label="$t('Goal 1:')"
            v-model="goalForm.goals.goalOne"
            :error="isGoalsInvalid"
            auto-grow
            rows="3"    
        ></v-textarea>

        <v-textarea
        :label="$t('Goal 2:')"
            v-model="goalForm.goals.goalTwo"
            :error="isGoalsInvalid"
            auto-grow
            rows="3"
        ></v-textarea>

        <v-textarea
        :label="$t('Goal 3:')"
            v-model="goalForm.goals.goalThree"
            :error="isGoalsInvalid"
            auto-grow
            rows="3"
        ></v-textarea>

        <v-textarea
        :label="$t('Goal 4:')"
            v-model="goalForm.goals.goalFour"
            :error="isGoalsInvalid"
            auto-grow
            rows="3"
        ></v-textarea>

        <v-textarea
        :label="$t('Goal 5:')"
            v-model="goalForm.goals.goalFive"
            :error-messages="goalsErrorMessages"
            auto-grow
            rows="3"
        ></v-textarea>
        
    </v-col>
</v-container>
</v-form>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
name: "GoalFormGoals",
props: {
    goalForm: Object
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
data() {
    return {
        // Form submission and validation state
        formSubmitted: false,
        isGoalsValid: null,
    }
},
watch: {
    // Emit validation changes to parent component
    hasValidationErrors(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.$emit('validation-change', { isValid: !newValue });
        }
    },
},
computed: {
    // Check if goals are invalid based on minimum requirement
    isGoalsInvalid() {
        if (!this.formSubmitted) return false;
        return this.filledGoalsCount < 3;
    },
    
    // Count how many goals have been filled out
    filledGoalsCount() {
        const { goalOne, goalTwo, goalThree, goalFour, goalFive } = this.goalForm.goals;
        const goalsArray = [goalOne, goalTwo, goalThree, goalFour, goalFive];
        return goalsArray.filter(goal => goal && goal.trim() !== '').length;
    },
    
    // Generate error messages for goals validation
    goalsErrorMessages() {
        if (this.formSubmitted && this.filledGoalsCount < 3) {
        this.isGoalsValid = false;
        return [this.$t('Please fill out at least 3 goals.')];
        }
        this.isGoalsValid = true;
        return [];
    },
    
    // Overall validation state for the form
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
            return this.isGoalsInvalid;
    },
},
methods: {
    // Handle form validation and emit appropriate events
    async handleValidations() {
        this.formSubmitted = true;

        if (!this.isGoalsInvalid) {
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
}
}
</script>

<style scoped>
/* Error text styling */
.error-text {
    color: rgb(176, 0, 32);
}

/* Fixed positioning for buttons (if needed) */
.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>