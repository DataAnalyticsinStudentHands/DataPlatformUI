/**
 * src/components/dev/projectView/components/ImpactCard.vue
 *
 * Impact summary grid with emoji icons and hover animations.
 * Displays the impact of the project on different stakeholder groups.
 * Used exclusively in the Development template.
 */

<template>
  <article class="card impact-card">
    <!-- Header -->
    <div class="card-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
      <h3>{{ title }}</h3>
    </div>

    <!-- Impact Grid -->
    <div class="impact-grid" :class="gridClass">
      <div 
        v-for="item in impactItems" 
        :key="item.id" 
        class="impact-item"
      >
        <div class="impact-icon">{{ item.icon }}</div>
        <div class="impact-label">{{ item.label }}</div>
        <div class="impact-text">{{ item.text }}</div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!impactItems || impactItems.length === 0" class="empty-state">
      <p>No impact items added yet.</p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Platform Impact',
  },
  impactItems: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Number,
    default: 2,
    validator: (value) => [1, 2, 3, 4].includes(value),
  },
});

const gridClass = computed(() => ({
  [`cols-${props.columns}`]: true,
}));
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #1a1a2e;
}

.card-header svg {
  color: #6366f1;
  flex-shrink: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

/* Impact Grid */
.impact-grid {
  display: grid;
  gap: 8px;
}

.impact-grid.cols-1 {
  grid-template-columns: 1fr;
}

.impact-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.impact-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.impact-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Impact Item */
.impact-item {
  background: #fafafa;
  border: 1px solid #e8e8ee;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: all 0.2s ease;
}

.impact-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: #c7d2fe;
}

.impact-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.impact-label {
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 2px;
}

.impact-text {
  font-size: 10px;
  color: #4a5568;
  line-height: 1.3;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #a0aec0;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 768px) {
  .impact-grid.cols-2,
  .impact-grid.cols-3,
  .impact-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>