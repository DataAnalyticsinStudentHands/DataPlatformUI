/**
 * src/components/dev/projectView/components/TagsCard.vue
 *
 * Reusable tags display component with hover animations.
 * Used in both Research and Development templates.
 */

<template>
  <article class="card tags-card">
    <div class="tags">
      <span 
        v-for="(tag, index) in tags" 
        :key="index"
        class="tag"
      >
        {{ tag }}
      </span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    required: true,
    default: () => [],
  },
});
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
  background: #f0f1ff;
  color: #4338ca;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.tag:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
  background: #e0e1ff;
}

/* Smaller variant for Development template */
.tags-card.compact .tag {
  font-size: 11px;
}

.tags-card.compact .tag:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.25);
}
</style>