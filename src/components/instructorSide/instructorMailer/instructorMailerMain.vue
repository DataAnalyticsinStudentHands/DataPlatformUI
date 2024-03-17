<template>
<v-container>
    <v-row>
        <v-col>
            <v-tabs v-model="tab" grow>
            <v-tab value="Overview">
              Overview
            </v-tab>
            <v-tab value="manualMailer">
              Manual Mailer
            </v-tab>
            <v-tab value="autoMailer">
              Automatic Mailer
            </v-tab>
          </v-tabs>

          <!-- Content for Entry Form Monitor -->
          <div v-if="tab === 'manualMailer'">
            <InstructorManualMailer />
          </div>
          
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import InstructorManualMailer from './instructorManualMailer.vue';
export default {
    name: "instructorMailer",
    components: {
      InstructorManualMailer
    },
    data() {
      return {
        tab: 'manualMailer',
      };
    },
}
</script>

<style scoped>

</style>