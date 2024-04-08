<!-- instructorMailerOverview - this view shows Overview information regarding the Manual Mailer and Automatic Mailer -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- Enhanced Current Jobs section using v-card -->
        <v-card class="ma-5" elevation="2">
          <v-card-title class="justify-center">Current Jobs</v-card-title>
          <v-card-text class="text-center">
            <div>{{ emailsSent }}/{{ totalEmails }} Emails Sent</div>
            <v-progress-linear
              v-model="progress"
              color="#c8102e"
              height="20"
              striped
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
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
  computed: {
    progress() {
      return (this.emailsSent / this.totalEmails) * 100;
    },
  },
  methods: {
  // Initiates listening to email progress updates. Creates an EventSource to establish a connection with the server-sent events endpoint. Handles incoming messages to update the component's state with the number of emails sent and the total number of emails to be sent. Closes the EventSource connection in case of errors.
    listenToEmailProgress() {
      const user = useLoggedInUserStore();
      const token = user.token;
      // const token = import.meta.env.VITE_TOKEN;

      const evtSource = new EventSource(`${import.meta.env.VITE_ROOT_API}/instructorSideData/email-progress?token=${encodeURIComponent(token)}`);

      evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
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
