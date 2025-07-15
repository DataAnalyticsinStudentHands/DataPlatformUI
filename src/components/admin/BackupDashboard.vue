<template>
  <div class="container py-4">
    <h1 class="text-h4 font-weight-bold">{{ $t('Database Backup') }}</h1>

    <p class="mb-3">
      <strong>Next scheduled run:</strong>
      {{ nextRunDisplay }}
    </p>
    
    <div class="row gy-4">
      <div class="col-md-6">
        <div class="card p-3">
          <h5>Backup Schedule</h5>
          <ScheduleForm @schedule-updated="fetchNextRun" />
        </div>

        <div class="card p-3 mt-3">
          <h5>Collections</h5>
          <CollectionsForm
            :initial="selectedCollections"
            @collections-changed="onCollectionsChanged"
          />
        </div>

        <div class="card p-3 mt-3 text-center">
          <button
            class="btn-save w-100"
            :disabled="running"
            @click="runNow"
          >
            {{ running ? 'Running…' : 'Run Backup Now' }}
          </button>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-3">
          <h5>Backup History</h5>
          <HistoryTable ref="historyTable"/>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import ScheduleForm from './backup/ScheduleForm.vue';
import CollectionsForm from './backup/CollectionsForm.vue';
import HistoryTable from './backup/HistoryTable.vue';

export default {
  name: 'BackupDashboard',
  components: {ScheduleForm, CollectionsForm, HistoryTable},
  data() {
    return {
      nextRun: null,
      running: false,
      selectedCollections: []
    };
  },
  computed: {
    nextRunDisplay() {
      if (!this.nextRun) return 'Loading…';
      return new Date(this.nextRun).toLocaleString();
    }
  },
  async mounted() {
    await this.fetchNextRun();
  },
  methods: {
    onCollectionsChanged(list) {
      this.selectedCollections = list;
    },
    async fetchNextRun() {
      const API = import.meta.env.VITE_ROOT_API;
      const userStore = useLoggedInUserStore();
      const headers = { token: userStore.token };
      const url = `${API}/backup/config`;  

        try {
          const { data } = await axios.get(url, { headers });
          this.nextRun = data.nextRun;
        } catch (err) {
          console.error('Could not load schedule:', err);
        }
    },
    async runNow() {
      this.running = true;
      try {
        const API = import.meta.env.VITE_ROOT_API;
        const userStore = useLoggedInUserStore();
        const headers   = { token: userStore.token };

        const url = `${API}/backup/run`;

        await axios.post(url, null, { headers });
        alert('Backup completed!');
        await this.fetchNextRun();

        if (this.$refs.historyTable) {
         await this.$refs.historyTable.loadHistory();
        }
      } catch (err) {
        console.error(err);
        alert('Backup failed.');
      } finally {
        this.running = false;
      }
    },
    onScheduleUpdated(newNextRun) {
      this.nextRun = newNextRun;
    }
  }
};
</script>
<style scoped>
.card {
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
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

