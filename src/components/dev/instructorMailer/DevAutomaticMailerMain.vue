<template>
<v-container>
    <v-row>
        <v-col class="d-flex justify-center font-weight-black text-h6">
            Automatic Mailer
        </v-col>
    </v-row>
    <v-row>
        <v-col class="d-flex justify-center">
            <v-btn
                class="mr-10"
                @click="selection = 1"
                :active="selection === 1"
            >
                Entry Forms
            </v-btn>
            <v-btn
                @click="selection = 2"
                :active="selection === 2"
            >
                Goal Forms
            </v-btn>
        </v-col>
    </v-row>

    <div v-if="selection === 1">
        <dev-automatic-mailer-entry-forms />
    </div>
    <div v-else-if="selection === 2">
        <dev-automatic-mailer-goal-forms />
    </div>
</v-container>
</template>

<script>
import DevAutomaticMailerEntryForms from './DevAutomaticMailerEntryForms.vue';
import DevAutomaticMailerGoalForms from './DevAutomaticMailerGoalForms.vue';
export default {
    name: 'DevAutomaticMailerMain',
    components: {
        DevAutomaticMailerEntryForms,
        DevAutomaticMailerGoalForms
    },
    data() {
        return {
        selection: 1,
        };
    },
}
</script>
