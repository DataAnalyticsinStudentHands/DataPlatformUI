/**
 * src/components/dev/projectView/components/TimelineCard.vue
 *
 * Development timeline display with colored markers and hover animations.
 * Used exclusively in the Development template.
 */

<template>
  <article class="card timeline-card">
    <!-- Header -->
    <div class="card-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <h3>{{ title }}</h3>
    </div>

    <!-- Timeline -->
    <div class="timeline">
      <div 
        v-for="(milestone, index) in milestones" 
        :key="milestone.id"
        class="timeline-item"
      >
        <div 
          class="timeline-marker" 
          :style="{ backgroundColor: milestone.color }"
        ></div>
        <div class="timeline-content">
          <div class="timeline-title">{{ milestone.title }}</div>
          <div class="timeline-desc">{{ milestone.description }}</div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!milestones || milestones.length === 0" class="empty-state">
      <p>No milestones added yet.</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Development Timeline',
  },
  milestones: {
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

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: #fafafa;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.timeline-item:hover {
  background: #f0f0ff;
  transform: translateX(4px);
}

.timeline-marker {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 3px;
  transition: transform 0.2s ease;
}

.timeline-item:hover .timeline-marker {
  transform: scale(1.2);
}

.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-title {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 2px;
}

.timeline-desc {
  font-size: 11px;
  color: #718096;
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
</style>