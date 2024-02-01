<template>
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
<v-container>
    <!-- Goals -->
    <v-col cols="12" md="10">
        <p 
        :class="{'error-text': isGoalsInvalid}"
        class="font-weight-black text-h8">
            <span
            >{{$t('Please outline 3-5 goals that you have for this experience.')}}</span> 
            <br><br>
            {{$t('Goals are statements that describe what it means for an experience to be a success from your perspective,')}}<br>
            {{$t('Examples:')}}<br>
            <ul>
            <li>{{$t('“I want to connect with people working on cancer research”')}}</li>
            <li>{{$t('“I want to research access to nutrition education in public schools”')}}</li>
            <li>{{$t('“I want to develop my presentation skills”')}}</li>
            </ul>
        </p>

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
        formSubmitted: false,
        isGoalsValid: null,
    }
},
watch: {
    hasValidationErrors(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.$emit('validation-change', { isValid: !newValue });
        }
    },
},
computed: {
    isGoalsInvalid() {
        if (!this.formSubmitted) return false;
        return this.filledGoalsCount < 3;
    },
    filledGoalsCount() {
        // Extract the goals from the goalForm
        const { goalOne, goalTwo, goalThree, goalFour, goalFive } = this.goalForm.goals;

        // Create an array of the goals
        const goalsArray = [goalOne, goalTwo, goalThree, goalFour, goalFive];

        // Filter the array to only include non-empty values and return its length
        return goalsArray.filter(goal => goal && goal.trim() !== '').length;
    },
    goalsErrorMessages() {
        if (this.formSubmitted && this.filledGoalsCount < 3) {
        this.isGoalsValid = false;
        return [this.$t('Please fill out at least 3 goals.')];
        }
        this.isGoalsValid = true;
        return [];
    },
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
            return this.isGoalsInvalid;
    },
},
methods: {
    async handleValidations() {
        this.formSubmitted = true;

        // Check the validity of the aspirations directly
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