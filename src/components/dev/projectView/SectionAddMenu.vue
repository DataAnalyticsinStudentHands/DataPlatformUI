/**
 * src/components/dev/projectView/SectionAddMenu.vue
 *
 * Dropdown menu for adding optional sections to a project.
 * Shows available sections that haven't been added yet.
 */

<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    location="top"
    offset="8"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="outlined"
        color="#6366f1"
        class="add-section-btn"
        :disabled="availableSections.length === 0"
      >
        <v-icon start size="20">mdi-plus-circle-outline</v-icon>
        {{ $t('Add Section') }}
        <v-icon end size="18">{{ menuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </template>

    <v-card min-width="300" class="section-menu-card">
      <v-card-title class="menu-header">
        <v-icon size="20" color="#6366f1" class="mr-2">mdi-view-grid-plus-outline</v-icon>
        {{ $t('Add Optional Section') }}
      </v-card-title>

      <v-divider></v-divider>

      <v-list density="compact" class="section-list">
        <v-list-item
          v-for="section in availableSections"
          :key="section.id"
          class="section-item"
          @click="addSection(section.id)"
        >
          <template v-slot:prepend>
            <v-icon :color="getIconColor(section.id)" size="22">
              {{ section.icon }}
            </v-icon>
          </template>

          <v-list-item-title class="section-name">
            {{ section.name }}
          </v-list-item-title>

          <v-list-item-subtitle class="section-desc">
            {{ section.description }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-icon size="18" color="#16a34a">mdi-plus</v-icon>
          </template>
        </v-list-item>

        <v-list-item v-if="availableSections.length === 0" class="empty-state">
          <v-list-item-title class="text-center text-medium-emphasis">
            {{ $t('All sections have been added') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions class="menu-footer">
        <v-btn
          variant="text"
          size="small"
          color="#666"
          @click="menuOpen = false"
        >
          {{ $t('Cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  availableSections: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['add']);

const menuOpen = ref(false);

// Icon colors for different section types
const sectionColors = {
  partners: '#059669',   // Green
  timeline: '#2563eb',   // Blue
  impact: '#ea580c',     // Orange
  poster: '#7c3aed',     // Purple
};

function getIconColor(sectionId) {
  return sectionColors[sectionId] || '#666';
}

function addSection(sectionId) {
  emit('add', sectionId);
  menuOpen.value = false;
}
</script>

<style scoped>
.add-section-btn {
  text-transform: none;
  font-weight: 600;
  border-style: dashed;
  border-width: 2px;
}

.section-menu-card {
  border-radius: 12px;
  overflow: hidden;
}

.menu-header {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 16px;
  display: flex;
  align-items: center;
}

.section-list {
  padding: 8px 0;
  max-height: 300px;
  overflow-y: auto;
}

.section-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.section-item:hover {
  background-color: #f0fdf4;
}

.section-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a1a;
}

.section-desc {
  font-size: 0.75rem;
  color: #666;
  margin-top: 2px;
}

.empty-state {
  padding: 24px 16px;
}

.menu-footer {
  padding: 8px 16px;
  justify-content: flex-end;
}
</style>
