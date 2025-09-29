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
    <v-data-table
      :headers="headers"
      :items="records"
      :loading="loading"
      loading-text="Loading history…"
      class="elevation-1"
      density="compact"
    >
      <template v-slot:item.timestamp="{ item }">
        {{ formatDate(item.timestamp) }}
      </template>
      <template v-slot:item.size="{ item }">
        {{ formatSize(item.size) }}
      </template>
    </v-data-table>
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
      loading: false,
      headers: [
        { title: 'Timestamp', key: 'timestamp', sortable: true },
        { title: 'Size', key: 'size', sortable: false }
      ]
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
      return mb.toFixed(2) + ' MB';
    }
  },
  mounted() {
    this.loadHistory();
  }
};
</script>
