<template>
  <v-container>
    <v-row>
      <v-col>
        Current Jobs: <span>{{ emailsSent }}/{{ totalEmails }}</span> Emails Sent
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      emailsSent: 0,
      totalEmails: 0,
    };
  },
  mounted() {
    this.listenToEmailProgress();
  },
  methods: {
    listenToEmailProgress() {
      const token = import.meta.env.VITE_TOKEN;

      const evtSource = new EventSource(`${import.meta.env.VITE_ROOT_API}/instructorSideData/email-progress?token=${encodeURIComponent(token)}`);

      evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('data: ', data);
        this.emailsSent = data.sent;
        this.totalEmails = data.total;
      };

      evtSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        evtSource.close();
      };
    }
  },
  beforeUnmount() {
    if (this.evtSource) {
      this.evtSource.close();
    }
  }
};
</script>
