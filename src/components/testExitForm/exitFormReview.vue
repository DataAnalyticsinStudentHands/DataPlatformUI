<template>
<v-container>
<v-form disabled>
<!-- Section: Selected Experience -->
<v-row>
    <v-col>
        <p 
            class="font-weight-black text-h6"
        >{{$t('Review')}}</p>
    </v-col>
</v-row>
<v-row><v-col></v-col></v-row>
<div class="review-section">
<v-row>
    <v-col cols="10" class="pb-0">
        <h3 class="review-section-title">
            {{ $t('Selected Experience') }}
            <!-- Mobile View Edit Button -->
            <v-btn v-if="$vuetify.display.xs"
                icon
                size="small"
                variant="text"
                @click="emitStepChange(0)"
                class="pb-2"
            >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </h3>
    </v-col>
    <!-- Non-Mobile View Edit Button -->
    <v-col class="text-right pb-0" v-if="$vuetify.display.smAndUp">
        <v-btn
            icon
            size="small"
            variant="text"
            @click="emitStepChange(0)"
        >
        <v-icon>mdi-pencil</v-icon>
        </v-btn>
    </v-col>
</v-row>
<v-row>
    <v-col cols="10" class="pt-0">
        <p class="review-section-content pl-3">
            {{ selectedExperience?.text }}
        </p>
    </v-col>
</v-row>
</div>

</v-form>

</v-container>
</template>


<script>
export default {
    name: "GoalFormReview",
    props: {
        selectedExperience: Object,
        exitForm: Object,
        isBackgroundEditActive: Boolean,
        goalFormExists: Boolean,
        activitiesExist: Boolean
    },
    emits: ["change-step"],
    computed: {

    },
    methods: {
        emitStepChange(stepNumber) {
            this.$emit('change-step', stepNumber);
        },
    },
}
</script>


<style scoped>
.review-section {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.review-section-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.review-section {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.review-section-content {
    font-size: 1rem;
    margin-bottom: 10px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 0.75rem;
  color: grey;
}

.v-list-item {
    min-width: 0; /* Override minimum width */
}

.v-list-item-title {
    white-space: normal; /* Allow text to wrap */
}

.section-title {
    font-size: 1.25rem; /* Adjusted for larger section titles */
    font-weight: bold;
    margin-bottom: 10px;
}

.aspiration-title {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
}

.goal-title {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
}


</style>