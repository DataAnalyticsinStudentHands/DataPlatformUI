<!--
 collectionsForm.vue
 
 Fetches available collections from serverand allows the user to select which collections should be included in backups.
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
  data() {
    return {
      collections: [],      // all collection names from the database
      selected: [],         // user’s current selection
      loading: false,
      saving: false
    };
  },
  computed: {
    apiBase() {
      return import.meta.env.VITE_ROOT_API;
    }
  },
  async mounted() {
    this.loading = true;
    try {
      const { data } = await axios.get(
        `${this.apiBase}/backup/collections`,
        { headers: this.getHeaders() }
      );
      this.collections = Array.isArray(data?.allCollections) ? data.allCollections : [];

      // If no explicit selection saved, default to all
      this.selected    = Array.isArray(data?.selectedCollections) && data.selectedCollections.length
        ? data.selectedCollections
        : [...this.collections];
    } catch (err) {
      console.error('[Backup] load collections failed:', err.message);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    getHeaders() {
      return { token: useLoggedInUserStore().token };
    },
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
        const payload = { collections: this.selected };
        await axios.put(
          `${this.apiBase}/backup/config`,
          payload,
          { headers: this.getHeaders() }
        );
        toast.success('Collections saved!');
      } catch (err) {
        console.error('[Backup] save collections failed:', err.message);
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
