<template>
  <div>
    <div v-if="loading" class="text-center py-3">
      Loading history…
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rec, i) in records" :key="i">
          <td>{{ formatDate(rec.timestamp) }}</td>
          <td>{{ formatSize(rec.size) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from '@/stored/loggedInUser';

export default {
  name: 'HistoryTable',
  data() {
    return {
      records: [],
      loading: false
    };
  },
  methods: {
    async loadHistory() {
      this.loading = true;
      try {
        const API = import.meta.env.VITE_ROOT_API;
        const token = useLoggedInUserStore().token;
        const { data } = await axios.get(`${API}/backup/history`, {
          headers: { token }
        });
        this.records = data;
      } catch (e) {
        console.error('Failed to load history:', e);
      } finally {
        this.loading = false;
      }
    },
    formatDate(ts) {
      return new Date(ts).toLocaleString();
    },
    formatSize(bytes) {
      const kb = bytes / 1024;
      if (kb < 1024) {
        const kb = bytes / 1024;
        return Math.round(kb) + ' KB';
      }
      return Math.round((kb / 1024).toFixed(4)) + ' MB';
    }
  },
  mounted() {
    this.loadHistory();
  }
};
</script>
