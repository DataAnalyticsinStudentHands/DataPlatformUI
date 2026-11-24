<template>
  <section class="mt-8 growth-dashboard" aria-label="Growth dashboard">
    <div class="dashboard-heading mb-4">
      <div>
        <h2 class="text-h5 font-weight-bold">Growth overview</h2>
        <p class="text-body-2 text-medium-emphasis mt-1">{{ dashboard.experience }} · {{ dashboard.session }}</p>
      </div>
      <v-btn variant="tonal" color="#c8102e" class="action-btn" :loading="pdfLoading" @click="$emit('download')"><v-icon start size="20">mdi-download</v-icon>Download PDF</v-btn>
    </div>
    <v-card elevation="2" class="dashboard-card">
      <div class="dashboard-body">
        <div class="coverage-row mb-5">
          <v-chip size="small" color="#c8102e" variant="tonal"><v-icon start size="16">mdi-account-group-outline</v-icon>{{ dashboard.coverage.paired }} students in analysis</v-chip>
          <v-menu :close-on-content-click="false" max-width="320">
            <template #activator="{ props }"><v-btn v-bind="props" icon="mdi-information-outline" size="x-small" variant="text" aria-label="Response coverage and generation time" /></template>
            <v-card class="pa-4"><h3 class="text-subtitle-2 mb-2">Response coverage</h3><p class="text-body-2">{{ dashboard.coverage.goalCompleted }} goal forms · {{ dashboard.coverage.exitCompleted }} exit forms · {{ dashboard.coverage.registered }} registered students</p><p class="text-body-2 mt-2">Outcomes include students with both forms.</p><p class="text-caption text-medium-emphasis mt-2">Generated {{ generatedTime }}</p></v-card>
          </v-menu>
        </div>
        <v-alert v-if="!dashboard.coverage.paired" type="info" variant="tonal" class="mb-4">No students have completed both forms yet.</v-alert>
        <v-alert v-if="dashboard.coverage.exitCompleted > dashboard.coverage.registered || dashboard.coverage.goalCompleted > dashboard.coverage.registered" type="warning" variant="tonal" class="mb-4">Completed forms exceed the registered total. Check the student count.</v-alert>
        <div class="dashboard-content">
          <div class="kpi-grid">
            <v-card v-for="kpi in dashboard.kpis" :key="kpi.key" flat class="kpi-card">
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between mb-3">
                  <span class="metric-icon"><v-icon size="22">{{ icons[kpi.key] }}</v-icon></span>
                  <v-menu :close-on-content-click="false" max-width="300">
                    <template #activator="{ props }"><v-btn v-bind="props" icon="mdi-information-outline" size="x-small" variant="text" :aria-label="`How ${kpi.label.toLowerCase()} is calculated`" /></template>
                    <v-card class="pa-4"><h3 class="text-subtitle-2 mb-2">{{ kpi.label }}</h3><p class="text-body-2">{{ kpi.description }}</p></v-card>
                  </v-menu>
                </div>
                <h3 class="metric-label">{{ kpi.label }}</h3>
                <div class="metric-value my-2">{{ format(kpi.percentage) }}</div>
                <p class="text-caption text-medium-emphasis">{{ kpi.count }} / {{ kpi.total }} {{ kpi.unit }}</p>
              </v-card-text>
            </v-card>
          </div>
          <div class="results-panel">
            <div class="d-flex align-center justify-space-between mb-3">
              <h3 class="text-h6 font-weight-medium">Report preview</h3>
              <v-btn
                v-if="pdfUrl"
                variant="text"
                size="small"
                class="action-btn"
                aria-label="Enlarge report preview"
                @click="isPreviewExpanded = true"
              >
                <v-icon start size="20">mdi-fullscreen</v-icon>
                Enlarge
              </v-btn>
            </div>
            <iframe v-if="pdfUrl" :src="pdfUrl" title="Generated growth report PDF" class="pdf-preview" />
            <div v-else class="preview-empty"><v-icon size="48" color="#c8102e" class="mb-4">mdi-file-document-outline</v-icon><v-btn variant="tonal" color="#c8102e" class="action-btn" :loading="pdfLoading" @click="$emit('preview')">Preview PDF</v-btn></div>
            <p class="text-caption text-medium-emphasis mt-3">Uses the latest saved responses when generated.</p>
          </div>
        </div>
        <div class="mt-6 pt-6 chart-section"><GrowthComparisonChart :growth="dashboard.growth" /></div>
      </div>
    </v-card>
    <ZoomModal
      v-if="pdfUrl"
      v-model="isPreviewExpanded"
      title="Growth report"
      :src="pdfUrl"
      type="pdf"
    />
  </section>
</template>

<script>
import GrowthComparisonChart from "./GrowthComparisonChart.vue";
import ZoomModal from "../studentSide/projectView/components/ZoomModal.vue";

export default {
  name: "GrowthDashboard",
  components: { GrowthComparisonChart, ZoomModal },
  props: {
    dashboard: { type: Object, required: true },
    pdfUrl: { type: String, default: "" },
    pdfLoading: { type: Boolean, default: false },
  },
  emits: ["download", "preview"],
  data() {
    return {
      isPreviewExpanded: false,
      icons: { completion: "mdi-clipboard-check-outline", progress: "mdi-trending-up", connection: "mdi-school-outline", recommendation: "mdi-thumb-up-outline" },
    };
  },
  watch: {
    pdfUrl() { this.isPreviewExpanded = false; },
  },
  computed: { generatedTime() { return new Date(this.dashboard.generatedAt).toLocaleString(); } },
  methods: { format(value) { return value == null ? "No data" : `${value}%`; } },
};
</script>

<style scoped>
.dashboard-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.dashboard-card { border-radius: 12px; overflow: hidden; }
.dashboard-body { padding: 24px; }
.coverage-row { display: flex; align-items: center; gap: 4px; }
.kpi-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.kpi-card { background: #fafafa; border: 1px solid #e8e8e8; border-radius: 10px; }
.metric-icon { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: rgba(200, 16, 46, 0.07); color: #c8102e; border-radius: 10px; }
.metric-label { font-size: 0.9rem; font-weight: 500; line-height: 1.4; }
.metric-value { font-size: 2rem; font-weight: 600; line-height: 1.2; font-variant-numeric: tabular-nums; }
.results-panel { min-width: 0; }
.dashboard-content { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); gap: 24px; align-items: start; }
.pdf-preview { width: 100%; height: 560px; border: 0; }
.preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; background: #fafafa; border: 1px dashed #ddd; border-radius: 10px; }
.chart-section { border-top: 1px solid #e8e8e8; }
.action-btn { text-transform: none; font-weight: 500; font-size: 0.9rem; letter-spacing: 0.25px; }
@media (max-width: 960px) { .dashboard-content { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .dashboard-body { padding: 16px; } }
@media (max-width: 480px) { .kpi-grid { grid-template-columns: 1fr; } }
</style>
