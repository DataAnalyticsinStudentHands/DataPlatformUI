<template>
<v-container>
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>

    <!-- Experience contribution to Graduate/Professional Goals -->
    <v-row class="mt-5">
        <v-col cols="12">
            <p class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red' : isExperienceContributionGradProfInvalid && formSubmitted}">
            {{$t('How did this experience contribute to your graduate/professional goals?')}}
            </p>
        </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12">
                <v-textarea
                    v-model="exitForm.experienceContributions"
                    outlined
                    dense
                    :label="$t('Contribution Description')"
                    rows="4"
                    class="mt-0"
                    :rules="[requiredRule]"
                ></v-textarea>
            </v-col>
    </v-row>


    <!-- Growth -->
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProblemSolvingInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('problem solving')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.problemSolving" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEffCommInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('effective communication')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.effectiveCommunication" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthTeamworkInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teamwork')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.teamwork" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthCulHumInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('cultural humility')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.culturalHumility" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEthicsInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('ethical decision making')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.ethicalDecisionMaking" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProfResInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>professional responsibility</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.professionalResponsibility" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>

    <!-- Biggest Lessons and Key Takeaways -->
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isBiggestLessonsInvalid && formSubmitted }">
            {{$t('What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.biggestLessons"
                class="mt-0"
                outlined
                dense
                :label="$t('Lessons/Takeaways')"
                rows="4"
                :rules="[requiredRule]"
            ></v-textarea>
        </v-col>
    </v-row>

    <!-- Engage and Support -->
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isSupportOthersInvalid && formSubmitted }">
            {{$t('Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.supportOthers"
                class="mt-0"
                outlined
                dense
                :label="$t('Engage/Support')"
                rows="4"
                :rules="[requiredRule]"
            ></v-textarea>
        </v-col>
    </v-row>

    <!-- Other Comments/Recommendations -->
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8 mb-2">
            {{$t('Use this space to provide any other comments or recommendations you would like to share.')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.comments"
                class="mt-0"
                outlined
                dense
                :label="$t('Comments/Recommendations')"
                rows="4"
            ></v-textarea>
        </v-col>
    </v-row>


</v-form>
</v-container>
</template>

<script>
export default {
    name: "ExitFormGrowth",
    props: {
        exitForm: Object,
    },
    emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
    data() {
        return {
            formSubmitted: false,
            requiredRule: value => {
                // If form has not been submitted, pass validation
                if (!this.formSubmitted) {
                    return true;
                }
                // Otherwise, check if the value is present
                return !!value || this.$t('Information is required.');
            },
        }
    },

    computed: {
        isExperienceContributionGradProfInvalid() {
            return !this.exitForm.experienceContributions || this.exitForm.experienceContributions.trim() === '';
        },
        isGrowthProblemSolvingInvalid() {
            return !this.exitForm.generalGrowth.problemSolving;
        },
        isGrowthEffCommInvalid() {
            return !this.exitForm.generalGrowth.effectiveCommunication;
        },
        isGrowthTeamworkInvalid() {
            return !this.exitForm.generalGrowth.teamwork;
        },
        isGrowthCulHumInvalid() {
            return !this.exitForm.generalGrowth.culturalHumility;
        },
        isGrowthEthicsInvalid() {
            return !this.exitForm.generalGrowth.ethicalDecisionMaking;
        },
        isGrowthProfResInvalid() {
            return !this.exitForm.generalGrowth.professionalResponsibility;
        },
        isBiggestLessonsInvalid() {
            return !this.exitForm.openEnded.biggestLessons;
        },
        isSupportOthersInvalid() {
            return !this.exitForm.openEnded.supportOthers;
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
    },

}
</script>

<style scoped>

</style>