<template>
<v-container>
    <v-row>
        <v-col class="d-flex justify-center font-weight-black text-h6">
            Manual Mailer
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
        <instructor-manual-mailer-entry-forms />
    </div>
</v-container>
</template>

<script>
import InstructorManualMailerEntryForms from './instructorManualMailerEntryForms.vue';
export default {
    name: 'instructorManualMailer',
    components: {
        InstructorManualMailerEntryForms
    },
    data() {
      return {
        selection: 1,
      };
    },
}
</script>