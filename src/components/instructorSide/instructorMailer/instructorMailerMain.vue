<template>
<v-container>
    <v-row>
        <v-col>
            <v-tabs v-model="tab" grow>
            <v-tab value="overview">
              Overview
            </v-tab>
            <v-tab value="manualMailer">
              Manual Mailer
            </v-tab>
            <v-tab value="autoMailer">
              Automatic Mailer
            </v-tab>
          </v-tabs>

          <!-- Content for Overview -->
          <div v-if="tab === 'overview'">
            <instructor-mailer-overview />
          </div>

          <!-- Content for Manual Mailer -->
          <div v-if="tab === 'manualMailer'">
            <instructor-manual-mailer-main />
          </div>

          <!-- Content for Automatic Mailer -->
          <div v-if="tab === 'autoMailer'">
            <instructor-automatic-mailer-main />
          </div>
          
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import InstructorManualMailerMain from './instructorManualMailer/instructorManualMailerMain.vue';
import InstructorMailerOverview from './instructorMailerOverview.vue';
import InstructorAutomaticMailerMain from './instructorAutomaticMailer/instructorAutomaticMailerMain.vue';
export default {
    name: "instructorMailer",
    components: {
      InstructorManualMailerMain,
      InstructorMailerOverview,
      InstructorAutomaticMailerMain
    },
    data() {
      return {
        tab: 'overview',
      };
    },
    provide() {
      return {
        setTab: this.setTab
      };
    },
    methods: {
      setTab(tab) {
        this.tab = tab;
      }
    },
}
</script>

<style scoped>

</style>