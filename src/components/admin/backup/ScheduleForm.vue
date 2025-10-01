<!--
/**
 * src/components/admin/backup/ScheduleForm.vue
 * 
 * A form component for configuring the recurrence schedule for automatic database backups.
 * It fetches the current schedule, allows the user to select a new recurrence pattern 
 * (e.g., daily, weekly), and saves the updated configuration. On a successful update, it 
 * emits an event to notify the parent component.
 */
-->
<template>
  <div>
    <div v-if="loading" class="text-center py-3">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading schedule…</p>
    </div>

    <!-- Schedule form -->
    <form v-else @submit.prevent="save">
      <v-select
        label="Recurrence"
        v-model="recurrence"
        :items="recurrenceOptions"
        item-title="text"
        item-value="value"
        variant="outlined"
        density="compact"
      ></v-select>

      <v-btn
        type="submit"
        variant="outlined"
        color="primary"
        :loading="saving"
        :disabled="saving"
      >
        {{ saving ? 'Saving…' : 'Save Schedule' }}
      </v-btn>
    </form>
  </div>
</template>


<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: 'ScheduleForm',
  emits: ['schedule-updated'],
  data() {
    return {
      recurrence: 'biweekly',  
      recurrenceOptions: [
        { text: 'Every day', value: 'daily' },
        { text: 'Every week', value: 'weekly' },
        { text: 'Every 2 weeks', value: 'biweekly' },
        { text: 'Every month', value: 'monthly' },
        { text: 'No automatic schedule', value: 'none' }
      ],
      loading: false,
      saving: false
    };
  },
  async mounted() {
    this.loading = true;
    const API = import.meta.env.VITE_ROOT_API;
    const userStore = useLoggedInUserStore();
    const headers = { token: userStore.token }; 

    try {
      const url = `${API}/backup/config`;
        const { data } = await axios.get(
          url,
          { headers }
        );
      this.recurrence = data.recurrence || 'biweekly';
    } catch (err) {
      console.error('Failed to load config:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async save() {
      // Persists the updated recurrence to the server.
      this.saving = true;
      const API        = import.meta.env.VITE_ROOT_API;
      const userStore  = useLoggedInUserStore();
      const headers    = { token: userStore.token };
      const url        = `${API}/backup/config`;
      const payload    = { recurrence: this.recurrence };
        
      try {
        await axios.put(url, payload, { headers });
        toast.success('Schedule updated!');
        this.$emit('schedule-updated');
      } catch (err) {
        console.error(err);
        toast.error('Could not update schedule');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>
