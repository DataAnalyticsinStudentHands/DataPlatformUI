<!--
FeaturedProjectsManager.vue
Instructor page for managing which projects appear on the public Featured page.
Up to 5 project slots with configurable stats, achievement tags, and hero images.
-->

<template>
  <main class="featured-manager">
    <v-container class="py-8">
      <!-- Loading -->
      <v-row v-if="loading" class="fill-height" align="center" justify="center" style="min-height: 60vh;">
        <v-col cols="auto">
          <v-progress-circular indeterminate color="#c8102e" size="72" />
        </v-col>
      </v-row>

      <template v-else>
        <!-- Page Header -->
        <div class="page-header mb-6">
          <div class="d-flex align-center mb-2">
            <v-btn
              icon
              variant="text"
              size="small"
              class="mr-2"
              @click="router.push({ name: 'instructorProjects' })"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-icon color="#c8102e" size="36" class="mr-3">mdi-star-shooting</v-icon>
            <div class="flex-grow-1">
              <div class="d-flex align-center flex-wrap">
                <h1 class="text-h4 font-weight-bold mr-3">Featured Projects</h1>
                <v-chip v-if="slots.length > 0" color="#c8102e" size="small" class="font-weight-medium">
                  {{ slots.length }} / 5 slots
                </v-chip>
              </div>
              <p class="text-body-1 text-medium-emphasis mb-0">
                Select up to 5 projects to showcase on the public Featured page.
              </p>
            </div>
            <div class="d-flex ga-2">
              <v-btn
                variant="outlined"
                color="primary"
                :href="publicPageUrl"
                target="_blank"
                prepend-icon="mdi-open-in-new"
                :disabled="!hasSavedProjects"
              >
                View Public Page
              </v-btn>
              <v-btn
                variant="outlined"
                :disabled="!hasChanges"
                prepend-icon="mdi-undo"
                @click="undoChanges"
              >
                Undo
              </v-btn>
              <v-btn
                color="#c8102e"
                :loading="saving"
                :disabled="!hasChanges"
                prepend-icon="mdi-content-save"
                @click="saveChanges"
              >
                Save
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Slots Grid -->
        <v-row>
          <v-col
            v-for="(slot, idx) in displaySlots"
            :key="slot.position"
            cols="12"
            md="6"
            lg="4"
          >
            <!-- Filled Slot -->
            <v-card v-if="slot.projectId" class="slot-card filled-slot" elevation="0">
              <!-- Card Header -->
              <div class="slot-card-header">
                <div class="slot-position">{{ slot.position }}</div>
                <div class="slot-title-group">
                  <h3 class="slot-title">{{ getProjectTitle(slot) }}</h3>
                  <div v-if="getProjectName(slot) && getProjectName(slot) !== getProjectTitle(slot)" class="slot-project-name">
                    {{ getProjectName(slot) }}
                  </div>
                </div>
                <v-spacer />
                <v-btn icon variant="text" size="x-small" class="remove-btn" @click="removeSlot(idx)">
                  <v-icon size="16">mdi-close</v-icon>
                </v-btn>
              </div>

              <!-- Project Info -->
              <div class="slot-project-info">
                <div class="info-row">
                  <v-icon size="16" color="#c8102e">mdi-account</v-icon>
                  <span class="info-label">Author</span>
                  <span class="info-value">{{ getProjectAuthor(slot) }}</span>
                </div>
                <div class="info-row">
                  <v-icon size="16" color="#c8102e">mdi-school</v-icon>
                  <span class="info-label">Experience</span>
                  <span class="info-value">{{ getProjectExperience(slot) }}</span>
                </div>
                <div class="info-row">
                  <v-icon size="16" color="#c8102e">mdi-calendar</v-icon>
                  <span class="info-label">Session</span>
                  <span class="info-value">{{ getProjectSession(slot) }}</span>
                </div>
              </div>

              <!-- Configuration -->
              <div class="slot-config">
                <div class="config-section-label">
                  <v-icon size="14" color="#c8102e">mdi-cog-outline</v-icon>
                  <span>Configuration</span>
                </div>

                <!-- Achievement Tag -->
                <v-text-field
                  v-model="slot.achievementTag"
                  label="Achievement Tag"
                  placeholder="e.g. Published Research, Award Winner"
                  variant="outlined"
                  density="compact"
                  maxlength="50"
                  counter
                  hide-details="auto"
                  class="mb-3"
                  @update:model-value="markChanged"
                />

                <!-- Project Stats (auto-populated) -->
                <div class="stats-display">
                  <div class="stats-label">Hero Stats</div>
                  <div class="d-flex flex-wrap ga-2">
                    <v-chip variant="tonal" color="#c8102e" prepend-icon="mdi-account-group" size="small">
                      {{ getProjectMemberCount(slot) }} Members
                    </v-chip>
                    <v-chip variant="tonal" color="#c8102e" prepend-icon="mdi-school" size="small">
                      {{ getProjectExperience(slot) }}
                    </v-chip>
                    <v-chip variant="tonal" color="#c8102e" prepend-icon="mdi-calendar" size="small">
                      {{ getProjectSession(slot) }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card>

            <!-- Empty Slot -->
            <v-card
              v-else
              class="slot-card empty-slot"
              elevation="0"
              @click="openPicker(slot.position)"
            >
              <div class="empty-slot-content">
                <div class="empty-slot-icon-wrapper">
                  <v-icon size="32" color="#c8102e">mdi-plus</v-icon>
                </div>
                <div class="empty-slot-label">Add Project</div>
                <div class="empty-slot-sublabel">Slot {{ slot.position }}</div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>

    <!-- Project Picker Dialog -->
    <v-dialog v-model="pickerOpen" max-width="720" scrollable>
      <v-card>
        <v-toolbar color="#c8102e" density="compact">
          <v-toolbar-title>Select a Project</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="pickerOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-text-field
            v-model="pickerSearch"
            placeholder="Search by project name or student..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="mb-4"
          />

          <!-- Loading eligible projects -->
          <div v-if="loadingEligible" class="text-center py-8">
            <v-progress-circular indeterminate color="#c8102e" />
          </div>

          <!-- No eligible projects -->
          <v-alert v-else-if="filteredEligible.length === 0" type="info" variant="tonal" class="mb-0">
            {{ eligibleProjects.length === 0
              ? 'No eligible projects found. Projects must have consent to feature and a published Project View.'
              : 'No projects match your search.'
            }}
          </v-alert>

          <!-- Eligible project list -->
          <v-list v-else lines="three" class="eligible-list">
            <v-list-item
              v-for="proj in filteredEligible"
              :key="proj._id"
              :disabled="isAlreadyFeatured(proj._id)"
              class="eligible-item"
              @click="selectProject(proj)"
            >
              <template #prepend>
                <v-avatar
                  v-if="proj.projectViewForm?.authors?.[0]?.avatarUrl"
                  size="40"
                >
                  <v-img :src="proj.projectViewForm.authors[0].avatarUrl" />
                </v-avatar>
                <v-avatar v-else size="40" color="grey-lighten-3">
                  <v-icon color="grey">mdi-account</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ proj.projectViewForm?.title || proj.projectName }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="proj.projectName && proj.projectName !== proj.projectViewForm?.title" class="text-caption text-medium-emphasis">
                {{ proj.projectName }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ proj.projectViewForm?.authors?.[0]?.name || 'Unknown author' }}
                &middot; {{ proj.experienceName || '' }}
                &middot; {{ proj.sessionName || '' }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <v-chip size="x-small" color="green" variant="tonal" class="mr-1">Published</v-chip>
                <v-chip size="x-small" variant="tonal" class="mr-1">
                  {{ proj.memberCount || 1 }} member{{ (proj.memberCount || 1) !== 1 ? 's' : '' }}
                </v-chip>
                <v-chip v-if="isAlreadyFeatured(proj._id)" size="x-small" color="orange" variant="tonal">
                  Already featured
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Unsaved Changes Dialog -->
    <v-dialog v-model="showLeaveDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Unsaved Changes</v-card-title>
        <v-card-text>
          You have unsaved changes. Leaving this page will discard them.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showLeaveDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmLeave">Leave</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import {
  getConfig,
  saveConfig,
  getEligibleProjects,
} from './services/featuredProjectsService.js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// =============================================================================
// STATE
// =============================================================================

const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const hasChanges = ref(false);
// The 5-slot array (always 5 entries, some may be empty placeholders)
const slots = ref([]);
// Snapshot of slots as last loaded/saved — used for undo
const originalSlots = ref([]);

// Picker state
const pickerOpen = ref(false);
const pickerSearch = ref('');
const pickerTargetPosition = ref(null);
const eligibleProjects = ref([]);
const loadingEligible = ref(false);


// Unsaved-changes guard state
const showLeaveDialog = ref(false);
const confirmedLeave = ref(false);
const pendingNavigation = ref(null);

// Lookup map: projectId -> eligible project data (for display)
const eligibleLookup = ref({});

const publicPageUrl = computed(() => {
  const base = window.location.origin;
  return `${base}/platform/featured`;
});

const hasSavedProjects = computed(() =>
  originalSlots.value.some(s => s.projectId)
);

// =============================================================================
// COMPUTED
// =============================================================================

/** Always show 5 slots (filled + empty placeholders) */
const displaySlots = computed(() => {
  const result = [];
  for (let pos = 1; pos <= 5; pos++) {
    const existing = slots.value.find(s => s.position === pos);
    if (existing) {
      result.push(existing);
    } else {
      result.push({ position: pos, projectId: null });
    }
  }
  return result;
});

/** Filter eligible projects by search */
const filteredEligible = computed(() => {
  const q = (pickerSearch.value || '').toLowerCase().trim();
  if (!q) return eligibleProjects.value;
  return eligibleProjects.value.filter(p => {
    const title = (p.projectViewForm?.title || p.projectName || '').toLowerCase();
    const author = (p.projectViewForm?.authors?.[0]?.name || '').toLowerCase();
    const exp = (p.experienceName || '').toLowerCase();
    return title.includes(q) || author.includes(q) || exp.includes(q);
  });
});

// =============================================================================
// HELPERS
// =============================================================================

function createDefaultStats(proj = null) {
  return [
    { icon: 'mdi-account-group', value: String(proj?.memberCount ?? ''), label: 'Members' },
    { icon: 'mdi-school', value: proj?.experienceName ?? '', label: 'Experience' },
    { icon: 'mdi-calendar', value: proj?.sessionName ?? '', label: 'Session' },
  ];
}

function isAlreadyFeatured(projectId) {
  return slots.value.some(s => s.projectId === projectId);
}

function getProjectTitle(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.projectViewForm?.title || proj?.projectName || 'Unknown Project';
}

function getProjectName(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.projectName || '';
}

function getProjectAuthor(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.projectViewForm?.authors?.[0]?.name || 'Unknown Author';
}

function getProjectExperience(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.experienceName || '';
}

function getProjectSession(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.sessionName || '';
}

function getProjectMemberCount(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.memberCount || 1;
}

function markChanged() {
  hasChanges.value = true;
}

function cloneSlots(src) {
  return JSON.parse(JSON.stringify(src));
}

function undoChanges() {
  slots.value = cloneSlots(originalSlots.value);
  hasChanges.value = false;
}


// =============================================================================
// LOAD DATA
// =============================================================================

onMounted(async () => {
  try {
    // Load config and eligible projects in parallel
    const [config, eligible] = await Promise.all([
      getConfig(),
      getEligibleProjects(),
    ]);

    eligibleProjects.value = eligible || [];

    // Build lookup
    const lookup = {};
    for (const p of eligibleProjects.value) {
      lookup[p._id] = p;
    }
    eligibleLookup.value = lookup;

    // Load slots from config
    if (config && Array.isArray(config.slots)) {
      slots.value = config.slots.map(s => ({
        position: s.position,
        projectId: s.projectId,
        projectViewFormId: s.projectViewFormId,
        achievementTag: s.achievementTag || '',
        heroImageUrl: s.heroImageUrl || '',
        stats: Array.isArray(s.stats) && s.stats.length === 3
          ? s.stats.map(st => ({ ...st }))
          : createDefaultStats(),
      }));
    }

    originalSlots.value = cloneSlots(slots.value);
  } catch (err) {
    toast.error('Failed to load featured projects configuration.');
    console.error('FeaturedProjectsManager load error:', err);
  } finally {
    loading.value = false;
  }
});

// =============================================================================
// ACTIONS
// =============================================================================

function openPicker(position) {
  pickerTargetPosition.value = position;
  pickerSearch.value = '';
  pickerOpen.value = true;
}

function selectProject(proj) {
  const pos = pickerTargetPosition.value;
  if (!pos) return;

  // Remove existing slot at this position if any
  const existingIdx = slots.value.findIndex(s => s.position === pos);
  if (existingIdx !== -1) {
    slots.value.splice(existingIdx, 1);
  }

  // Add new slot
  slots.value.push({
    position: pos,
    projectId: proj._id,
    projectViewFormId: proj.projectViewForm?._id || '',
    achievementTag: '',
    heroImageUrl: '',
    stats: createDefaultStats(proj),
  });

  // Sort by position
  slots.value.sort((a, b) => a.position - b.position);

  hasChanges.value = true;
  pickerOpen.value = false;
}

function removeSlot(displayIdx) {
  const slot = displaySlots.value[displayIdx];
  if (!slot || !slot.projectId) return;
  const realIdx = slots.value.findIndex(s => s.position === slot.position);
  if (realIdx !== -1) {
    slots.value.splice(realIdx, 1);
    hasChanges.value = true;
  }
}

// =============================================================================
// UNSAVED CHANGES GUARD
// =============================================================================

function handleBeforeUnload(e) {
  if (hasChanges.value) {
    e.preventDefault();
    e.returnValue = '';
  }
}

function confirmLeave() {
  showLeaveDialog.value = false;
  confirmedLeave.value = true;
  if (pendingNavigation.value) {
    const destination = pendingNavigation.value;
    pendingNavigation.value = null;
    router.push(destination);
  }
}

onBeforeRouteLeave((to) => {
  if (confirmedLeave.value) return;
  if (hasChanges.value) {
    showLeaveDialog.value = true;
    pendingNavigation.value = to.fullPath;
    return false;
  }
});

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// =============================================================================
// SAVE
// =============================================================================

async function saveChanges() {
  saving.value = true;

  try {
    // Build payload - only send filled slots
    const payload = slots.value
      .filter(s => s.projectId)
      .map(s => ({
        position: s.position,
        projectId: s.projectId,
        projectViewFormId: s.projectViewFormId,
        showInHero: true,
        achievementTag: s.achievementTag || '',
        heroImageUrl: s.heroImageUrl || '',
        stats: s.stats,
      }));

    const saved = await saveConfig(payload);

    // Sync back from server response
    if (saved && Array.isArray(saved.slots)) {
      slots.value = saved.slots.map(s => ({
        position: s.position,
        projectId: s.projectId,
        projectViewFormId: s.projectViewFormId,
        achievementTag: s.achievementTag || '',
        heroImageUrl: s.heroImageUrl || '',
        stats: Array.isArray(s.stats) && s.stats.length === 3
          ? s.stats.map(st => ({ ...st }))
          : createDefaultStats(),
      }));
    }

    originalSlots.value = cloneSlots(slots.value);
    hasChanges.value = false;
    toast.success('Featured projects saved successfully.',
        {
          position: 'top-right',
          toastClassName: 'Toastify__toast--create',
          multiple: true
        }
    );
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.error || err.message;
    toast.error(`Failed to save: ${msg}`);
    console.error('Save error:', err);
  } finally {
    saving.value = false;
  }
}

</script>

<style scoped>
.featured-manager {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* ── Base Card ── */
.slot-card {
  min-height: 200px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Filled Card ── */
.filled-slot {
  border: 1px solid #e8e8ee;
  overflow: hidden;
}

.filled-slot:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(200, 16, 46, 0.3);
}

/* ── Card Header ── */
.slot-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0f0;
}

.slot-position {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.slot-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.slot-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.slot-project-name {
  font-size: 12px;
  color: #718096;
  font-weight: 400;
}

.remove-btn {
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
  color: #c8102e;
}

/* ── Project Info ── */
.slot-project-info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafafa;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.info-label {
  font-weight: 600;
  color: #4a5568;
  min-width: 72px;
  font-size: 12px;
}

.info-value {
  color: #1a1a2e;
  font-size: 13px;
}

/* ── Configuration Section ── */
.slot-config {
  padding: 14px;
  border-top: 1px solid #f0f0f0;
}

.config-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #c8102e;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stats-display {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 10px;
}

.stats-label {
  font-size: 12px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
}

/* ── Empty Slot ── */
.empty-slot {
  border: 2px dashed #d4d4d8;
  cursor: pointer;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot:hover {
  border-color: #c8102e;
  background: rgba(200, 16, 46, 0.04);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.1);
}

.empty-slot-content {
  text-align: center;
  padding: 32px 16px;
}

.empty-slot-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(200, 16, 46, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  transition: all 0.3s ease;
}

.empty-slot:hover .empty-slot-icon-wrapper {
  background: rgba(200, 16, 46, 0.15);
  transform: scale(1.1);
}

.empty-slot-label {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 2px;
}

.empty-slot-sublabel {
  font-size: 12px;
  color: #4a5568;
}

/* ── Picker Dialog ── */
.eligible-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.eligible-item:hover {
  background: #f5f5f5;
}

.eligible-list :deep(.v-list-item-title) {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
</style>
