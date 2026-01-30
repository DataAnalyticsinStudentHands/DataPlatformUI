/**
 * src/components/dev/projectView/components/TagsCard.vue
 *
 * Reusable tags display component with hover animations.
 * Supports tags with custom colors.
 * Used in both Research and Development templates.
 */

<template>
  <article class="card tags-card">
    <div class="tags">
      <span
        v-for="tag in normalizedTags"
        :key="tag.id"
        class="tag"
        :style="getTagStyle(tag.color)"
      >
        {{ tag.text }}
      </span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  tags: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Normalize tags to always have the object format
// Supports both old string format and new object format for backwards compatibility
const normalizedTags = computed(() => {
  return props.tags.map((tag, index) => {
    if (typeof tag === 'string') {
      // Legacy string format - use default color
      return {
        id: `tag-${index}`,
        text: tag,
        color: '#4338ca', // Default indigo
      };
    }
    return tag;
  });
});

// Generate tag styles based on color
function getTagStyle(color) {
  // Create a tonal/lighter background from the main color
  const bgColor = hexToRgba(color, 0.12);
  return {
    backgroundColor: bgColor,
    color: color,
  };
}

// Convert hex to rgba for background
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.tags-card {
  padding: 12px 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.tag:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  filter: brightness(0.95);
}

/* Smaller variant for Development template */
.tags-card.compact .tag {
  font-size: 11px;
}

.tags-card.compact .tag:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
