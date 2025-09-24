<!--
/**
 * src/components/admin/backup/HistoryTable.vue
 *
 * Displays a history of database backup operations in a table. This component fetches 
 * backup records from the server, showing the timestamp and file size for each. It includes 
 * methods for formatting data for display and can be programmatically refreshed by its 
 * parent component to show the latest history.
 */
-->
<template>
  <div>
    <div v-if="loading" class="text-center py-3">
      Loading history…
    </div>

    <!-- History table -->
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
      records: [],        // Array of { timestamp: ISO, size: bytes }
      loading: false
    };
  },
  methods: {
    async loadHistory() {
      // Fetches the backup history from the server and updates `records`.
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
        return Math.round(kb) + ' KB';
      }
      const mb = kb / 1024;
      return Math.round(mb.toFixed(2)) + ' MB';
    }
  },
  mounted() {
    this.loadHistory();
  }
};
</script>
