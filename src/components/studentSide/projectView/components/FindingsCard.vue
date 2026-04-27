/**
 * src/components/studentSide/projectView/components/FindingsCard.vue
 *
 * Key findings/achievements display with colored stat cards and conclusion text.
 * Supports dynamic colors via the finding.color property.
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
        v-for="finding in normalizedFindings"
        :key="finding.id"
        class="finding"
        :style="getFindingStyle(finding.color)"
      >
        <div class="finding-stat" :style="getStatStyle(finding)">{{ finding.stat }}</div>
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

// Check if any stat has a long unbreakable word (no spaces, > 7 chars)
const hasLongWord = computed(() => {
  return props.findings.some((f) => {
    const words = (f.stat || '').split(/\s+/);
    return words.some((w) => w.length > 7);
  });
});

// Switch to vertical list layout when stats have long words or 3+ findings with wordy stats
const useVerticalLayout = computed(() => {
  if (hasLongWord.value) return true;
  if (props.findings.length >= 3) {
    return props.findings.some((f) => (f.stat || '').length > 10);
  }
  return false;
});

const gridClass = computed(() => ({
  'compact': props.compact,
  'vertical': useVerticalLayout.value,
  [`grid-${props.findings.length}`]: !useVerticalLayout.value,
}));

// Legacy variant to color mapping for backwards compatibility
const variantColorMap = {
  'critical': '#b91c1c',
  'data': '#1d4ed8',
  'warning': '#b45309',
  'success': '#16a34a',
  'purple': '#7c3aed',
};

// Normalize findings to always have a color property
const normalizedFindings = computed(() => {
  return props.findings.map((finding, index) => {
    // If finding already has a color, use it
    if (finding.color) {
      return finding;
    }
    // Legacy support: convert variant to color
    if (finding.variant && variantColorMap[finding.variant]) {
      return {
        ...finding,
        color: variantColorMap[finding.variant],
      };
    }
    // Fallback to blue
    return {
      ...finding,
      color: '#1d4ed8',
    };
  });
});

// Adaptive font size based on stat text length
function getStatStyle(finding) {
  const len = (finding.stat || '').length;
  const base = props.compact ? 20 : 22;
  const mid = props.compact ? 16 : 18;
  const small = props.compact ? 14 : 15;

  let fontSize = base;
  if (useVerticalLayout.value) {
    // Vertical layout: toned-down sizes since stat sits inline with description
    fontSize = props.compact ? 14 : 15;
  } else {
    if (len > 10) fontSize = small;
    else if (len > 5) fontSize = mid;
  }

  return {
    color: finding.color,
    fontSize: `${fontSize}px`,
  };
}

// Generate finding card styles based on color
function getFindingStyle(color) {
  const rgb = hexToRgb(color);
  if (!rgb) {
    return {};
  }

  // Create light tinted background gradient
  const bgStart = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`;
  const bgEnd = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`;
  const borderColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;

  return {
    background: `linear-gradient(135deg, ${bgStart} 0%, ${bgEnd} 100%)`,
    border: `1px solid ${borderColor}`,
  };
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
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

.finding-stat {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
  word-break: break-word;
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

/* Vertical list layout — stat as title, description underneath */
.findings-grid.vertical {
  grid-template-columns: 1fr;
  gap: 6px;
}

.findings-grid.vertical .finding {
  text-align: left;
  padding: 10px 14px;
}

.findings-grid.vertical .finding-stat {
  font-weight: 700;
  margin-bottom: 2px;
}

.findings-grid.vertical .finding p {
  font-size: 12px;
  line-height: 1.45;
}

.findings-grid.vertical.compact .finding {
  padding: 8px 12px;
}

.findings-grid.vertical.compact .finding p {
  font-size: 11px;
}

/* Responsive */
@media (max-width: 768px) {
  .findings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
