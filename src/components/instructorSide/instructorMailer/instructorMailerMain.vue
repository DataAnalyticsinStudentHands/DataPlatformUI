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

          <!-- Content for Entry Form Monitor -->
          <div v-if="tab === 'overview'">
            <instructor-mailer-overview />
          </div>

          <!-- Content for Entry Form Monitor -->
          <div v-if="tab === 'manualMailer'">
            <instructor-manual-mailer />
          </div>
          
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import InstructorManualMailer from './instructorManualMailer.vue';
import InstructorMailerOverview from './InstructorMailerOverview.vue';
export default {
    name: "instructorMailer",
    components: {
      InstructorManualMailer,
      InstructorMailerOverview
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