<!--
goalFormAsp.vue
Form component for collecting user aspirations in the goal setting process.
Validates that users provide at least 2 out of 3 possible long-term aspirations
with examples and guidance for what constitutes an aspiration.
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
            >{{$t('Aspirations')}}</p>
        </v-col>
    </v-row>
    
    <!-- Aspirations section with instructions and examples -->
    <v-col cols="12" md="10">
        <p 
        :class="{'error-text': isAspirationsInvalid}"
        class="font-weight-black text-h8" style="margin-bottom: 2px;">
            <span
            >{{$t('Please describe 2-3 long-term aspirations you may have.')}}</span>
            <br><br>
            {{$t('Aspirations are statements that describe where you want to end up without necessarily describing exactly how you will get there.')}}
            <br> {{$t('Examples:')}}
            <br>
            <ul>
            <li>{{$t('"I want to focus my career on cancer disparities"')}}</li>
            <li>{{$t('"I want to lead a non-profit that addresses food insecurity"')}}</li>
            <li>{{$t('"I want to teach English in a different country"')}}</li>
            </ul>  
        </p>

        <!-- Three aspiration text areas with validation -->
        <v-textarea
            ref="aspiration1Ref"
            :label="$t('Aspiration 1:')"
            v-model="goalForm.aspirations.aspirationOne"
            :error="isAspirationsInvalid"
            auto-grow
            rows="3"
        ></v-textarea>

        <v-textarea
            ref="aspiration2Ref"
            :label="$t('Aspiration 2:')"
            v-model="goalForm.aspirations.aspirationTwo"
            :error="isAspirationsInvalid"
            auto-grow
            rows="3"
        ></v-textarea>

        <v-textarea
            ref="aspiration3Ref"
            :label="$t('Aspiration 3:')"
            v-model="goalForm.aspirations.aspirationThree"
            :error-messages="aspirationsErrorMessages"
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
name: "GoalFormAspirations",
props: {
    goalForm: Object
},
emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
data() {
    return {
        // Form submission and validation state
        formSubmitted: false,
        isAspirationsValid: true,
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
    // Check if aspirations are invalid based on minimum requirement
    isAspirationsInvalid() {
        if (!this.formSubmitted) return false;
        return this.filledAspirationsCount < 2;
    },
    
    // Count how many aspirations have been filled out
    filledAspirationsCount() {
      const { aspirationOne, aspirationTwo, aspirationThree } = this.goalForm.aspirations;
      const aspirationsArray = [aspirationOne, aspirationTwo, aspirationThree];
      return aspirationsArray.filter(aspiration => aspiration && aspiration.trim() !== '').length;
    },
    
    // Generate error messages for aspirations validation
    aspirationsErrorMessages() {
        if (this.formSubmitted && this.filledAspirationsCount < 2) {
            this.isAspirationsValid = false;
            return [this.$t('Please fill out at least 2 aspirations.')];
        }
        this.isAspirationsValid = true;
        return [];
    },
    
    // Overall validation state for the form
    hasValidationErrors() {
        if (!this.formSubmitted) return false;
            return this.isAspirationsInvalid;
    },
},
methods: {
    // Handle form validation and emit appropriate events
    async handleValidations() {
        this.formSubmitted = true;

        if (!this.isAspirationsInvalid) {
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
},
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