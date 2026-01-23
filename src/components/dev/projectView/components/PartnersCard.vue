/**
 * src/components/dev/projectView/components/PartnersCard.vue
 *
 * Partner organizations display with colored icon badges and hover animations.
 * Supports configurable grid columns for different layouts.
 * Used in both Research and Development templates.
 */

<template>
  <article class="card partners-section">
    <!-- Header -->
    <div class="card-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <h3>Partners</h3>
    </div>

    <!-- Description -->
    <p v-if="description" class="partners-description">
      {{ description }}
    </p>

    <!-- Partners Grid -->
    <div class="partners-grid" :class="gridClass">
      <div 
        v-for="partner in partners" 
        :key="partner.id" 
        class="partner-card"
      >
        <div 
          class="partner-icon" 
          :style="{ backgroundColor: partner.color }"
        >
          <span>{{ partner.acronym.charAt(0) }}</span>
        </div>
        <div class="partner-info">
          <div class="partner-acronym">{{ partner.acronym }}</div>
          <div class="partner-name">{{ partner.name }}</div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  partners: {
    type: Array,
    required: true,
    default: () => [],
  },
  description: {
    type: String,
    default: '',
  },
  columns: {
    type: Number,
    default: 3,
    validator: (value) => [1, 2, 3].includes(value),
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const gridClass = computed(() => ({
  [`cols-${props.columns}`]: true,
  'compact': props.compact,
}));
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1a1a2e;
}

.card-header svg {
  color: #6366f1;
  flex-shrink: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.partners-description {
  color: #718096;
  margin: 0 0 12px 0;
  line-height: 1.4;
  font-size: 12px;
}

/* Compact variant */
.partners-section.compact .card-header h3 {
  font-size: 15px;
}

.partners-section.compact .partners-description {
  font-size: 11px;
  margin-bottom: 10px;
}

/* Partners Grid */
.partners-grid {
  display: grid;
  gap: 8px;
}

.partners-grid.cols-1 {
  grid-template-columns: 1fr;
}

.partners-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.partners-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* Partner Card */
.partner-card {
  background: #fafafa;
  border: 1px solid #e8e8ee;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.partner-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
}

.partner-card:hover .partner-icon {
  transform: scale(1.15) rotate(5deg);
}

/* Compact variant */
.partners-grid.compact .partner-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.15);
}

/* Partner Icon */
.partner-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.partner-icon span {
  color: white;
  font-size: 14px;
  font-weight: 700;
}

/* Compact icon */
.partners-grid.compact .partner-icon {
  width: 28px;
  height: 28px;
}

.partners-grid.compact .partner-icon span {
  font-size: 12px;
}

/* Partner Info */
.partner-info {
  flex: 1;
  min-width: 0;
}

.partner-acronym {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 1px;
  color: #1a1a2e;
}

.partner-name {
  font-size: 10px;
  color: #718096;
  line-height: 1.3;
}

/* Compact info */
.partners-grid.compact .partner-acronym {
  font-size: 12px;
}

.partners-grid.compact .partner-name {
  font-size: 9px;
}

/* Responsive */
@media (max-width: 1024px) {
  .partners-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .partners-grid.cols-3,
  .partners-grid.cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>