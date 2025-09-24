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
      Loading schedule…
    </div>

    <!-- Schedule form -->
    <form v-else @submit.prevent="save">
      <div class="mb-3">
        <label for="recurrence" class="form-label">Recurrence</label>
        <select
          id="recurrence"
          class="form-select"
          v-model="recurrence"
        >
          <option value="daily">Every day</option>
          <option value="weekly">Every week</option>
          <option value="biweekly">Every 2 weeks</option>
          <option value="monthly">Every month</option>
          <option value="none">No automatic schedule</option>
        </select>
      </div>

      <button
        type="submit"
        class="btn-outline-save"
        :disabled="saving"
      >
        {{ saving ? 'Saving…' : 'Save Schedule' }}
      </button>
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

<style scoped>
.btn-outline-save {
  background: transparent;
  color: rgb(200,16,46);
  border: 2px solid rgb(200,16,46);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;
}
.btn-outline-save:hover,
.btn-outline-save:focus {
  background-color: #f5f9f9;
  border-color: rgba(200,16,46,0.8);
}
.btn-outline-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>