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
              >
                View Public Page
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
            <v-card v-if="slot.projectId" class="slot-card filled-slot" elevation="2">
              <!-- Slot Header -->
              <div class="slot-header">
                <div class="slot-position">{{ slot.position }}</div>
                <div class="text-subtitle-2 font-weight-bold text-truncate ml-3">
                  {{ getProjectTitle(slot) }}
                </div>
                <v-spacer />
                <v-chip
                  v-if="slot.showInHero"
                  size="x-small"
                  color="amber-darken-2"
                  variant="flat"
                  prepend-icon="mdi-star"
                >
                  Hero
                </v-chip>
                <v-btn icon variant="text" size="small" @click="removeSlot(idx)">
                  <v-icon size="18">mdi-close</v-icon>
                </v-btn>
              </div>

              <!-- Project Preview -->
              <div class="slot-project-preview pa-4">
                <div class="d-flex align-start">
                  <v-avatar v-if="getProjectAvatar(slot)" size="48" class="mr-3 flex-shrink-0">
                    <v-img :src="getProjectAvatar(slot)" />
                  </v-avatar>
                  <v-avatar v-else size="48" color="grey-lighten-3" class="mr-3 flex-shrink-0">
                    <v-icon color="grey">mdi-account</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1 overflow-hidden">
                    <div class="text-caption text-medium-emphasis">
                      {{ getProjectAuthor(slot) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ getProjectExperience(slot) }} &middot; {{ getProjectSession(slot) }}
                    </div>
                  </div>
                </div>
              </div>

              <v-divider />

              <!-- Slot Configuration -->
              <v-card-text class="pa-4">
                <!-- Show in Hero toggle -->
                <v-switch
                  v-model="slot.showInHero"
                  label="Show in hero carousel"
                  density="compact"
                  color="#c8102e"
                  hide-details
                  class="mb-3"
                  @update:model-value="markChanged"
                />

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

                <!-- Hero Image -->
                <div class="mb-3">
                  <div class="text-caption font-weight-medium mb-1">Hero Background Image</div>
                  <div class="d-flex align-center ga-2">
                    <v-btn
                      size="small"
                      variant="outlined"
                      prepend-icon="mdi-upload"
                      @click="triggerHeroUpload(slot)"
                    >
                      Upload
                    </v-btn>
                    <v-chip v-if="slot.heroImageUrl" size="small" closable @click:close="clearHeroImage(slot)">
                      Custom image set
                    </v-chip>
                    <span v-else class="text-caption text-medium-emphasis">Uses poster/avatar</span>
                  </div>
                </div>

                <!-- Project Stats (auto-populated) -->
                <div v-if="slot.showInHero" class="stats-display">
                  <div class="text-caption font-weight-medium mb-2">Hero Stats</div>
                  <div class="d-flex ga-3">
                    <v-chip variant="tonal" prepend-icon="mdi-account-group" size="small">
                      {{ getProjectMemberCount(slot) }} Members
                    </v-chip>
                    <v-chip variant="tonal" prepend-icon="mdi-school" size="small">
                      {{ getProjectExperience(slot) }}
                    </v-chip>
                    <v-chip variant="tonal" prepend-icon="mdi-calendar" size="small">
                      {{ getProjectSession(slot) }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Empty Slot -->
            <v-card
              v-else
              class="slot-card empty-slot d-flex align-center justify-center"
              elevation="0"
              @click="openPicker(slot.position)"
            >
              <div class="text-center pa-8">
                <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-plus-circle-outline</v-icon>
                <div class="text-body-2 text-medium-emphasis">
                  Add Project to Slot {{ slot.position }}
                </div>
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

    <!-- Hidden file input for hero image upload -->
    <input
      ref="heroFileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleHeroUpload"
    />
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getConfig,
  saveConfig,
  getEligibleProjects,
  uploadHeroImage,
} from './services/featuredProjectsService.js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// =============================================================================
// STATE
// =============================================================================

const loading = ref(true);
const saving = ref(false);
const hasChanges = ref(false);
// The 5-slot array (always 5 entries, some may be empty placeholders)
const slots = ref([]);

// Picker state
const pickerOpen = ref(false);
const pickerSearch = ref('');
const pickerTargetPosition = ref(null);
const eligibleProjects = ref([]);
const loadingEligible = ref(false);

// Hero image upload state
const heroFileInput = ref(null);
const uploadTargetSlot = ref(null);

// Lookup map: projectId -> eligible project data (for display)
const eligibleLookup = ref({});

const publicPageUrl = computed(() => {
  const base = window.location.origin;
  return `${base}/platform/featured`;
});

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

function getProjectAuthor(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.projectViewForm?.authors?.[0]?.name || 'Unknown Author';
}

function getProjectAvatar(slot) {
  const proj = eligibleLookup.value[slot.projectId];
  return proj?.projectViewForm?.authors?.[0]?.avatarUrl || '';
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
        showInHero: s.showInHero ?? true,
        achievementTag: s.achievementTag || '',
        heroImageUrl: s.heroImageUrl || '',
        stats: Array.isArray(s.stats) && s.stats.length === 3
          ? s.stats.map(st => ({ ...st }))
          : createDefaultStats(),
      }));
    }
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
    showInHero: true,
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
        showInHero: s.showInHero,
        achievementTag: s.achievementTag || '',
        heroImageUrl: s.heroImageUrl || '',
        stats: s.showInHero ? s.stats : [],
      }));

    const saved = await saveConfig(payload);

    // Sync back from server response
    if (saved && Array.isArray(saved.slots)) {
      slots.value = saved.slots.map(s => ({
        position: s.position,
        projectId: s.projectId,
        projectViewFormId: s.projectViewFormId,
        showInHero: s.showInHero ?? true,
        achievementTag: s.achievementTag || '',
        heroImageUrl: s.heroImageUrl || '',
        stats: Array.isArray(s.stats) && s.stats.length === 3
          ? s.stats.map(st => ({ ...st }))
          : createDefaultStats(),
      }));
    }

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

// Hero image upload
function triggerHeroUpload(slot) {
  uploadTargetSlot.value = slot;
  heroFileInput.value?.click();
}

async function handleHeroUpload(event) {
  const file = event.target.files?.[0];
  if (!file || !uploadTargetSlot.value) return;

  try {
    const url = await uploadHeroImage(uploadTargetSlot.value.position, file);
    uploadTargetSlot.value.heroImageUrl = url;
    hasChanges.value = true;
  } catch (err) {
    toast.error('Failed to upload hero image.');
    console.error('Hero upload error:', err);
  } finally {
    // Reset file input
    if (heroFileInput.value) heroFileInput.value.value = '';
    uploadTargetSlot.value = null;
  }
}

function clearHeroImage(slot) {
  slot.heroImageUrl = '';
  hasChanges.value = true;
}
</script>

<style scoped>
.featured-manager {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.slot-card {
  min-height: 200px;
  border-radius: 12px;
  transition: box-shadow 0.2s ease;
}

.filled-slot {
  border: 2px solid transparent;
}

.filled-slot:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12) !important;
}

.empty-slot {
  border: 2px dashed #ccc;
  cursor: pointer;
  background: #fafafa;
}

.empty-slot:hover {
  border-color: #c8102e;
  background: #fff5f5;
}

.slot-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
  border-radius: 12px 12px 0 0;
}

.slot-position {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.slot-project-preview {
  background: #fafafa;
}

.stat-row {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 6px;
}

.eligible-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.eligible-item:hover {
  background: #f5f5f5;
}
</style>
