<!--
 historyTable.vue
 
 Displays a history of database backups 
-->
<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="records"
      :items-per-page="5"
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
  computed: {
    apiBase() {
      return import.meta.env.VITE_ROOT_API;
    }
  },
  methods: {
    getHeaders() {
      return { token: useLoggedInUserStore().token };
    },
    async loadHistory() {
      // Fetches backup history from the server and updates records.
      this.loading = true;
      try {
        const { data } = await axios.get(`${this.apiBase}/backup/history`, {
          headers: this.getHeaders()
        });
        this.records = data;
      } catch (e) {
        console.error('[Backup] load history failed:', e.message);
      } finally {
        this.loading = false;
      }
    },
    formatDate(ts) {
      const d = new Date(ts);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleString();
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
