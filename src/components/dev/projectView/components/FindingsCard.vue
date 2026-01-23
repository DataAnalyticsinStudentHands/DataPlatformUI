/**
 * src/components/dev/projectView/components/FindingsCard.vue
 *
 * Key findings/achievements display with colored stat cards and conclusion text.
 * Supports multiple color variants via the finding.variant property.
 * Used in both Research and Development templates.
 */

<template>
  <article class="card findings-card">
    <!-- Header -->
    <div class="card-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <h3>{{ headerTitle }}</h3>
    </div>

    <!-- Findings Grid -->
    <div class="findings-grid" :class="gridClass">
      <div 
        v-for="finding in findings" 
        :key="finding.id"
        class="finding"
        :class="getVariantClass(finding.variant)"
      >
        <div class="finding-stat">{{ finding.stat }}</div>
        <p>{{ finding.description }}</p>
      </div>
    </div>

    <!-- Conclusion Text -->
    <div v-if="conclusion && conclusion.text" class="conclusion-text">
      <p>{{ conclusion.text }}</p>
      <span v-if="conclusion.attribution" class="attribution">
        {{ conclusion.attribution }}
      </span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { FINDING_VARIANTS } from '../types/projectTypes.js';

const props = defineProps({
  headerTitle: {
    type: String,
    default: 'Key Findings',
  },
  findings: {
    type: Array,
    required: true,
    default: () => [],
  },
  conclusion: {
    type: Object,
    default: () => ({ text: '', attribution: '' }),
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const gridClass = computed(() => ({
  'compact': props.compact,
  [`grid-${props.findings.length}`]: true,
}));

function getVariantClass(variant) {
  const variantMap = {
    [FINDING_VARIANTS.CRITICAL]: 'finding-critical',
    [FINDING_VARIANTS.DATA]: 'finding-data',
    [FINDING_VARIANTS.WARNING]: 'finding-warning',
    [FINDING_VARIANTS.SUCCESS]: 'finding-success',
    [FINDING_VARIANTS.PURPLE]: 'finding-purple',
  };
  return variantMap[variant] || 'finding-data';
}
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

/* Findings Grid */
.findings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.findings-grid.grid-1 {
  grid-template-columns: 1fr;
}

.findings-grid.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.findings-grid.compact {
  margin-bottom: 12px;
}

.finding {
  padding: 14px 10px;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.finding:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
  filter: brightness(1.05);
}

/* Compact variant */
.findings-grid.compact .finding {
  padding: 12px 8px;
  border-radius: 8px;
}

.findings-grid.compact .finding:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.findings-grid.compact .finding-stat {
  font-size: 20px;
  margin-bottom: 4px;
}

.findings-grid.compact .finding p {
  font-size: 10px;
  line-height: 1.3;
}

/* Variant Styles */
.finding-critical {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
}
.finding-critical .finding-stat {
  color: #b91c1c;
}

.finding-data {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
}
.finding-data .finding-stat {
  color: #1d4ed8;
}

.finding-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
}
.finding-warning .finding-stat {
  color: #b45309;
}

.finding-success {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
}
.finding-success .finding-stat {
  color: #16a34a;
}

.finding-purple {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border: 1px solid #e9d5ff;
}
.finding-purple .finding-stat {
  color: #7c3aed;
}

.finding-stat {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
}

.finding p {
  font-size: 11px;
  color: #4a5568;
  margin: 0;
  line-height: 1.4;
}

/* Conclusion Text */
.conclusion-text {
  color: #4a5568;
  line-height: 1.5;
  font-size: 13px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px;
  border-left: 3px solid #6366f1;
}

.findings-grid.compact + .conclusion-text {
  font-size: 12px;
  line-height: 1.45;
  padding: 12px;
}

.conclusion-text p {
  margin: 0 0 10px 0;
}

.conclusion-text .attribution {
  font-size: 13px;
  color: #6366f1;
  font-weight: 600;
}

.findings-grid.compact + .conclusion-text .attribution {
  font-size: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .findings-grid {
    grid-template-columns: 1fr;
  }
}
</style>