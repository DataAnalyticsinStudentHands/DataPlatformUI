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
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading…</p>
    </div>

    <div v-else>
      <div class="mb-2">
        <v-btn variant="text" size="small" @click="selectAll" class="me-2">
          Select All
        </v-btn>
        <v-btn variant="text" size="small" @click="clearAll">
          Clear All
        </v-btn>
      </div>

      <!-- Scrollable checkbox list -->
      <v-card
        class="scroll-area pa-2 mb-3"
        variant="outlined"
        style="max-height: 200px; overflow-y: auto;"
      >
        <v-checkbox
          v-for="col in collections"
          :key="col"
          :label="col"
          :value="col"
          v-model="selected"
          density="compact"
          hide-details
        ></v-checkbox>
      </v-card>

      <!-- Summary of selection -->
      <div class="mb-3">
        <small class="text-muted">
          Selected:
          <template v-if="selected.length === 0">
            none
          </template>
          <template v-else-if="selected.length <= 3">
            {{ selected.join(', ') }}
          </template>
          <template v-else>
            {{ selected.slice(0,3).join(', ') }}
            <v-chip size="small" class="ms-1">
              +{{ selected.length - 3 }} more
              <v-tooltip activator="parent" location="top">{{ selected.join(', ') }}</v-tooltip>
            </v-chip>
          </template>
        </small>
      </div>

      <!-- Save Collections button -->
      <v-btn
        variant="outlined"
        color="primary"
        :loading="saving"
        :disabled="saving"
        @click="save"
      >
        {{ saving ? 'Saving…' : 'Save Collections' }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useLoggedInUserStore } from '@/stored/loggedInUser';

export default {
  name: 'CollectionsForm',
  emits: ['collections-changed'],
  data() {
    return {
      collections: [],      // all collection names from the database
      selected: [],         // user’s current selection
      loading: false,
      saving: false
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const API   = import.meta.env.VITE_ROOT_API;
      const token = useLoggedInUserStore().token;
      const { data } = await axios.get(
        `${API}/backup/collections`,
        { headers: { token } }
      );
      this.collections = data.allCollections;

      // If no explicit selection saved, default to all
      this.selected    = data.selectedCollections.length
        ? data.selectedCollections
        : [...this.collections];
    } catch (err) {
      console.error('Failed to load collections:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    selectAll() {
      this.selected = [...this.collections];
    },
    clearAll() {
      this.selected = [];
    },
    async save() {
      // Persists the current selection to the server and notifies parent.
      this.saving = true;
      try {
        const API   = import.meta.env.VITE_ROOT_API;
        const token = useLoggedInUserStore().token;
        const payload = { collections: this.selected };
        await axios.put(
          `${API}/backup/collections`,
          payload,
          { headers: { token } }
        );
        this.$emit('collections-changed', payload.collections);
        toast.success('Collections saved!');
      } catch (err) {
        console.error('Failed to save collections:', err);
        toast.error('Could not save collections.');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.scroll-area {
  background: #f8f9fa;
}
</style>
