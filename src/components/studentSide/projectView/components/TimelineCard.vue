/**
 * src/components/studentSide/projectView/components/TimelineCard.vue
 *
 * Timeline display with colored markers and hover animations.
 * Supports vertical (list) and horizontal (bar with alternating labels) layouts.
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

    <!-- ======================== -->
    <!-- VERTICAL TIMELINE        -->
    <!-- ======================== -->
    <div v-if="layout === 'vertical'" class="timeline-vertical">
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
          <div v-if="milestone.dateStart" class="timeline-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{{ formatDate(milestone.dateStart) }}</span>
            <span v-if="milestone.dateType === 'range' && milestone.dateEnd">
              &nbsp;— {{ formatDate(milestone.dateEnd) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================== -->
    <!-- HORIZONTAL TIMELINE      -->
    <!-- ======================== -->
    <div v-else-if="layout === 'horizontal'" class="timeline-horizontal">
      <div class="h-timeline-track" :style="{ gridTemplateColumns: `repeat(${milestones.length}, 1fr)` }">
        <!-- Milestone columns -->
        <div
          v-for="(milestone, index) in milestones"
          :key="milestone.id"
          class="h-timeline-col"
        >
          <!-- TOP label (even indices: 0, 2, 4...) -->
          <div class="h-label h-label-top" :class="{ 'h-label-visible': index % 2 === 0 }">
            <template v-if="index % 2 === 0">
              <div class="h-label-title" :style="{ color: milestone.color }">
                {{ milestone.title }}
              </div>
              <div class="h-label-desc">{{ milestone.description }}</div>
              <div v-if="milestone.dateStart" class="h-label-date">
                {{ formatDateShort(milestone.dateStart) }}
                <span v-if="milestone.dateType === 'range' && milestone.dateEnd">
                  — {{ formatDateShort(milestone.dateEnd) }}
                </span>
              </div>
            </template>
          </div>

          <!-- Connector stem from top label to dot -->
          <div class="h-stem" :class="{ 'h-stem-visible': index % 2 === 0 }">
            <div class="h-stem-line" :style="{ backgroundColor: index % 2 === 0 ? milestone.color : 'transparent' }"></div>
          </div>

          <!-- Dot on the central line -->
          <div class="h-dot-row">
            <div
              class="h-dot"
              :style="{ backgroundColor: milestone.color, boxShadow: '0 0 0 3px ' + milestone.color + '33' }"
            ></div>
          </div>

          <!-- Connector stem from dot to bottom label -->
          <div class="h-stem" :class="{ 'h-stem-visible': index % 2 !== 0 }">
            <div class="h-stem-line" :style="{ backgroundColor: index % 2 !== 0 ? milestone.color : 'transparent' }"></div>
          </div>

          <!-- BOTTOM label (odd indices: 1, 3, 5...) -->
          <div class="h-label h-label-bottom" :class="{ 'h-label-visible': index % 2 !== 0 }">
            <template v-if="index % 2 !== 0">
              <div class="h-label-title" :style="{ color: milestone.color }">
                {{ milestone.title }}
              </div>
              <div class="h-label-desc">{{ milestone.description }}</div>
              <div v-if="milestone.dateStart" class="h-label-date">
                {{ formatDateShort(milestone.dateStart) }}
                <span v-if="milestone.dateType === 'range' && milestone.dateEnd">
                  — {{ formatDateShort(milestone.dateEnd) }}
                </span>
              </div>
            </template>
          </div>
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
const props = defineProps({
  title: {
    type: String,
    default: 'Project Timeline',
  },
  milestones: {
    type: Array,
    required: true,
    default: () => [],
  },
  layout: {
    type: String,
    default: 'vertical',
    validator: (v) => ['vertical', 'horizontal'].includes(v),
  },
});

function formatDate(isoString) {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(isoString) {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
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

/* ============================================
   VERTICAL TIMELINE (original style)
   ============================================ */
.timeline-vertical {
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

.timeline-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #6366f1;
  font-weight: 500;
  margin-top: 3px;
}

.timeline-date svg {
  flex-shrink: 0;
  opacity: 0.7;
}

/* ============================================
   HORIZONTAL TIMELINE
   ============================================ */
.timeline-horizontal {
  position: relative;
  overflow-x: auto;
  padding: 8px 0;
}

.h-timeline-track {
  display: grid;
  grid-template-rows: auto auto auto auto auto;
  min-width: max-content;
  position: relative;
  z-index: 1;
}

.h-timeline-col {
  display: grid;
  grid-row: 1 / -1;
  grid-template-rows: subgrid;
  justify-items: center;
  min-width: 120px;
  padding: 0 8px;
}

/* Labels (top & bottom) */
.h-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: center;
  padding: 4px 2px;
  width: 100%;
}

.h-label-bottom {
  justify-content: flex-start;
}

.h-label-visible {
  /* visible labels have content */
}

.h-label-title {
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 2px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.h-label-desc {
  font-size: 10px;
  color: #718096;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.h-label-date {
  font-size: 9px;
  color: #6366f1;
  font-weight: 500;
  margin-top: 2px;
}

/* Stems connecting labels to dots */
.h-stem {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h-stem-line {
  width: 2px;
  height: 100%;
  border-radius: 1px;
  transition: background-color 0.2s ease;
}

.h-stem:not(.h-stem-visible) .h-stem-line {
  background-color: transparent !important;
}

/* Dot row (the central axis) — each column's dot-row draws the line segment */
.h-dot-row {
  height: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Continuous horizontal line through all dot rows */
.h-dot-row::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #cbd5e1;
  transform: translateY(-50%);
  z-index: 0;
}

/* Rounded caps on first and last columns */
.h-timeline-col:first-child .h-dot-row::before {
  left: 50%;
  border-radius: 1px 0 0 1px;
}

.h-timeline-col:last-child .h-dot-row::before {
  right: 50%;
  border-radius: 0 1px 1px 0;
}

.h-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  cursor: default;
  position: relative;
  z-index: 1;
}

.h-timeline-col:hover .h-dot {
  transform: scale(1.4);
}

.h-timeline-col:hover .h-label-title {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
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
