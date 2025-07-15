<template>
  <div>
    <div v-if="loading" class="text-center py-3">
      Loading schedule…
    </div>

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
        class="btn-save"
        :disabled="saving"
      >
        {{ saving ? 'Saving…' : 'Save Schedule' }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
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
      this.saving = true;
      try {
        const API        = import.meta.env.VITE_ROOT_API;
        const userStore  = useLoggedInUserStore();
        const headers    = { token: userStore.token };
        const url        = `${API}/backup/config`;
        const payload    = { recurrence: this.recurrence };
        
        const { data } = await axios.put(url, payload, { headers });
        alert('Schedule updated!');

        this.$emit('schedule-updated');
      } catch (err) {
        console.error(err);
        alert('Could not update schedule.');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>
<style scoped>
.btn-save {
  background-color: rgb(200,16,46); 
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: opacity 0.2s;
}
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-save:not(:disabled):hover {
  opacity: 0.9;
}
</style>