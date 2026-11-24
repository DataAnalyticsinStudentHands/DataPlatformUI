<template>
  <section aria-label="Expected versus achieved growth">
    <div class="chart-heading mb-5">
      <div><h3 class="text-h6 font-weight-medium">Expected vs. achieved growth</h3><p class="text-body-2 text-medium-emphasis mt-1">Share reporting “A lot of growth”</p></div>
      <div class="legend text-caption"><span><i class="legend-mark expected" />Expected</span><span><i class="legend-mark achieved" />Achieved</span></div>
    </div>
    <div class="growth-axis text-caption text-medium-emphasis" aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
    <div v-for="area in growth" :key="area.key" class="growth-area">
      <div class="area-label">{{ area.label }}</div>
      <div>
        <div v-for="series in area.series" :key="series.key" class="growth-row">
          <div class="bar-track" role="img" :aria-label="`${area.label}, ${series.label}: ${format(series.percentage)}, ${series.count} of ${series.total} valid responses`">
            <div class="bar-fill" :class="series.key" :style="{ width: `${Math.min(series.percentage || 0, 100)}%` }" />
          </div>
          <span class="text-caption text-right">{{ format(series.percentage) }}</span>
        </div>
      </div>
    </div>
    <details class="chart-details text-caption text-medium-emphasis mt-4">
      <summary>About this chart</summary>
      <p class="mt-2">Valid answers are counted separately for expected and achieved growth. These are self-reports, not measured skill gains.</p>
      <div v-for="area in growth" :key="area.key" class="mt-2"><span class="area-label">{{ area.label }}</span>: <span v-for="(series, index) in area.series" :key="series.key">{{ index ? ' · ' : '' }}{{ series.label }} {{ series.count }}/{{ series.total }}</span></div>
    </details>
  </section>
</template>

<script>
export default {
  name: "GrowthComparisonChart",
  props: { growth: { type: Array, required: true } },
  methods: {
    format(value) { return value == null ? "No data" : `${value}%`; },
  },
};
</script>

<style scoped>
.chart-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.legend { display: flex; gap: 16px; }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend-mark { width: 10px; height: 10px; border-radius: 3px; }
.expected { background: #adb5bd; }
.achieved { background: #c8102e; }
.growth-axis { display: flex; justify-content: space-between; margin-left: 202px; margin-right: 62px; margin-bottom: 8px; }
.growth-area { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 22px; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.area-label { font-size: 0.9rem; font-weight: 500; }
.area-label::first-letter { text-transform: uppercase; }
.growth-row { display: grid; grid-template-columns: minmax(0, 1fr) 52px; gap: 10px; align-items: center; margin: 4px 0; }
.bar-track { height: 10px; background: #f2f3f5; border-radius: 3px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 3px; }
.chart-details summary { cursor: pointer; width: fit-content; }
@media (max-width: 600px) {
  .growth-area { grid-template-columns: 1fr; gap: 4px; }
  .growth-axis { margin-left: 0; }
}
</style>
