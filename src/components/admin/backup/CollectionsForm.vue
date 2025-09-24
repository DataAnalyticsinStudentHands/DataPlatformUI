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
      Loading…
    </div>

    <div v-else>
      <div class="mb-2">
        <button class="link-button me-3" @click="selectAll">
          Select All
        </button>
        <button class="link-button" @click="clearAll">
          Clear All
        </button>
      </div>

      <!-- Scrollable checkbox list -->
      <div
        class="scroll-area rounded p-2 mb-3"
        style="max-height: 200px; overflow-y: auto;"
      >
        <div
          v-for="col in collections"
          :key="col"
          class="form-check"
        >
          <input
            :id="col"
            class="form-check-input"
            type="checkbox"
            :value="col"
            v-model="selected"
          />
          <label class="form-check-label" :for="col">
            {{ col }}
          </label>
        </div>
      </div>

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
            <span
              class="badge bg-light text-dark ms-1"
              :title="selected.join(', ')"
              style="cursor: pointer;"
            >
              +{{ selected.length - 3 }} more
            </span>
          </template>
        </small>
      </div>

      <!-- Save Collections button -->
      <button
        class="btn-outline-save"
        :disabled="saving"
        @click="save"
      >
        {{ saving ? 'Saving…' : 'Save Collections' }}
      </button>
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
  border: 1px solid #dee2e6;
}

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

.link-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0 0.5rem 0 0;
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 0.25rem;
}
.link-button:hover {
  background-color: #f5f5f5;
}
</style>