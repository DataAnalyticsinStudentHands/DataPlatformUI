<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <v-sheet color="#ce1a34" class="pa-8 mb-6">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <h1 class="text-h3 text-white font-weight-bold mb-3">
              Explore Our Projects
            </h1>
            <p class="text-h6 text-white-darken-1">
              Discover innovative student and community initiatives making real impact
            </p>
            
            <!-- Global Search -->
            <v-text-field
              v-model="searchQuery"
              placeholder="Search projects by name, description, or tags..."
              variant="solo"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              class="mx-auto mt-6"
              style="max-width: 600px;"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container>
      <v-row>
        <!-- Filters Sidebar -->
        <v-col cols="12" md="3">
          <div class="sticky-filters">
            <v-card class="pa-4">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h6 font-weight-bold">Filters</h3>
                <v-btn 
                  variant="text" 
                  size="small" 
                  color="primary"
                  @click="resetFilters"
                  v-if="hasActiveFilters"
                >
                  Clear all
                </v-btn>
              </div>

              <!-- Status Filter -->
              <div class="mb-4">
                <p class="text-subtitle-2 font-weight-medium mb-2">Status</p>
                <v-chip-group
                  v-model="filters.status"
                  column
                  multiple
                  filter
                >
                  <v-chip
                    v-for="status in availableStatuses"
                    :key="status"
                    :value="status"
                    variant="outlined"
                    filter
                    size="small"
                  >
                    {{ status }}
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- Experience Category Filter -->
              <div class="mb-4">
                <p class="text-subtitle-2 font-weight-medium mb-2">Experience Category</p>
                <v-chip-group
                  v-model="filters.experienceCategory"
                  column
                  multiple
                  filter
                >
                  <v-chip
                    v-for="cat in availableCategories"
                    :key="cat"
                    :value="cat"
                    variant="outlined"
                    filter
                    size="small"
                  >
                    {{ cat }}
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- Session Filter -->
              <div class="mb-4">
                <p class="text-subtitle-2 font-weight-medium mb-2">Session</p>
                <v-select
                  v-model="filters.session"
                  :items="availableSessions"
                  variant="outlined"
                  density="compact"
                  multiple
                  clearable
                  hide-details
                />
              </div>

              <!-- Tags Filter -->
              <div class="mb-4">
                <p class="text-subtitle-2 font-weight-medium mb-2">Tags</p>
                <v-autocomplete
                  v-model="filters.tags"
                  :items="availableTags"
                  variant="outlined"
                  density="compact"
                  multiple
                  chips
                  closable-chips
                  clearable
                  hide-details
                />
              </div>

              <!-- Document Count Range -->
              <div class="mb-4">
                <p class="text-subtitle-2 font-weight-medium mb-2">
                  Documents: {{ filters.minDocs }}+
                </p>
                <v-slider
                  v-model="filters.minDocs"
                  :max="20"
                  :min="0"
                  :step="1"
                  thumb-label
                  hide-details
                />
              </div>

              <!-- Sort Options -->
              <div>
                <p class="text-subtitle-2 font-weight-medium mb-2">Sort by</p>
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </div>
            </v-card>
          </div>
        </v-col>

        <!-- Projects Grid -->
        <v-col cols="12" md="9">
          <!-- Results Header -->
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <span class="text-h6 font-weight-medium">
                {{ filteredProjects.length }} Projects
              </span>
              <v-chip-group v-if="hasActiveFilters" class="ml-2 d-inline-flex">
                <v-chip
                  v-for="filter in activeFilterChips"
                  :key="filter"
                  size="small"
                  closable
                  @click:close="removeFilter(filter)"
                >
                  {{ filter }}
                </v-chip>
              </v-chip-group>
            </div>
            
            <!-- View Toggle -->
            <v-btn-toggle v-model="viewMode" mandatory>
              <v-btn value="grid" icon="mdi-view-grid" size="small" />
              <v-btn value="list" icon="mdi-view-list" size="small" />
            </v-btn-toggle>
          </div>

          <!-- Project Cards Grid -->
          <v-row v-if="viewMode === 'grid'">
            <v-col 
              v-for="project in paginatedProjects" 
              :key="project._id"
              cols="12" 
              sm="6" 
              lg="4"
            >
              <v-card 
                class="h-100 d-flex flex-column project-card" 
                elevation="2"
                @click="viewProject(project)"
              >
                <!-- Card Image/Placeholder -->
                <div 
                  class="card-header"
                  :style="{
                    background: `linear-gradient(135deg, ${project.colorGradient[0]} 0%, ${project.colorGradient[1]} 100%)`,
                    height: '120px',
                    position: 'relative'
                  }"
                >
                  <div class="pa-3 text-white">
                    <v-icon size="40" class="mb-2">{{ project.icon }}</v-icon>
                    <div class="text-overline">{{ project.experienceCategory }}</div>
                  </div>
                  <v-chip 
                    :color="getStatusColor(project.projectStatus)" 
                    size="x-small"
                    class="position-absolute"
                    style="top: 10px; right: 10px;"
                  >
                    {{ project.projectStatus }}
                  </v-chip>
                </div>

                <v-card-text class="flex-grow-1">
                  <!-- Title & Description -->
                  <h3 class="text-h6 font-weight-bold mb-2 project-title">
                    {{ project.projectName }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-3 project-description">
                    {{ truncateText(project.projectDescription, 100) }}
                  </p>

                  <!-- Meta Chips -->
                  <div class="mb-3">
                    <v-chip-group>
                      <v-chip 
                        size="x-small" 
                        color="primary" 
                        variant="tonal"
                        prepend-icon="mdi-school"
                      >
                        {{ project.experienceName }}
                      </v-chip>
                      <v-chip 
                        size="x-small" 
                        variant="tonal"
                        prepend-icon="mdi-calendar"
                      >
                        {{ project.sessionName }}
                      </v-chip>
                      <v-chip 
                        v-if="project.groupName"
                        size="x-small" 
                        variant="tonal"
                        prepend-icon="mdi-folder"
                      >
                        {{ project.groupName }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <!-- Tags -->
                  <div class="mb-3" v-if="project.tags.length > 0">
                    <v-chip 
                      v-for="tag in project.tags.slice(0, 3)" 
                      :key="tag"
                      size="x-small"
                      class="mr-1 mb-1"
                      variant="outlined"
                    >
                      {{ tag }}
                    </v-chip>
                    <span v-if="project.tags.length > 3" class="text-caption text-medium-emphasis">
                      +{{ project.tags.length - 3 }} more
                    </span>
                  </div>
                </v-card-text>

                <!-- Stats Row -->
                <v-divider />
                <v-card-text class="py-2">
                  <v-row no-gutters align="center">
                    <v-col cols="4" class="text-center">
                      <v-icon size="small" color="primary">mdi-file-document</v-icon>
                      <div class="text-caption">{{ project.fileCount }} files</div>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-icon size="small" color="primary">mdi-account-group</v-icon>
                      <div class="text-caption">{{ project.memberCount }} members</div>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-icon size="small" color="primary">mdi-update</v-icon>
                      <div class="text-caption">v{{ project.currentVersion }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>

                <!-- Footer -->
                <v-divider />
                <v-card-text class="py-2 text-caption text-medium-emphasis">
                  <div class="d-flex justify-space-between align-center">
                    <span>
                      <v-icon size="x-small">mdi-account</v-icon>
                      {{ project.ownerNames.join(', ') }}
                    </span>
                    <span>{{ formatDate(project.updatedAt) }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- List View -->
          <v-data-table
            v-else
            :headers="tableHeaders"
            :items="filteredProjects"
            :items-per-page="itemsPerPage"
            class="elevation-2"
          >
            <template v-slot:item.projectName="{ item }">
              <div class="font-weight-medium">{{ item.projectName }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ truncateText(item.projectDescription, 60) }}
              </div>
            </template>
            <template v-slot:item.projectStatus="{ item }">
              <v-chip 
                :color="getStatusColor(item.projectStatus)" 
                size="small"
              >
                {{ item.projectStatus }}
              </v-chip>
            </template>
            <template v-slot:item.tags="{ item }">
              <v-chip 
                v-for="tag in item.tags.slice(0, 2)" 
                :key="tag"
                size="x-small"
                class="mr-1"
              >
                {{ tag }}
              </v-chip>
            </template>
            <template v-slot:item.updatedAt="{ item }">
              {{ formatDate(item.updatedAt) }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn 
                icon="mdi-eye" 
                size="small" 
                variant="text"
                @click="viewProject(item)"
              />
            </template>
          </v-data-table>

          <!-- Pagination -->
          <v-pagination
            v-if="viewMode === 'grid'"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            class="mt-4"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Mock data generation
const generateMockProjects = () => {
  const experiences = ['Research Methods', 'Community Health', 'Data Science', 'Public Policy', 'Environmental Studies'];
  const sessions = ['Fall 2024', 'Spring 2025', 'Summer 2024', 'Winter 2024'];
  const statuses = ['Active', 'Proposed', 'Archived'];
  const tags = ['healthcare', 'education', 'sustainability', 'technology', 'community', 'research', 'innovation', 'social-impact', 'data-analysis', 'public-health'];
  const groups = ['Health Innovation', 'Tech for Good', 'Community Partners', null, null];
  const icons = ['mdi-hospital', 'mdi-school', 'mdi-earth', 'mdi-chip', 'mdi-account-group'];
  const gradients = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#30cfd0', '#330867'],
  ];

  const projects = [];
  const baseDate = new Date('2024-01-01');
  
  for (let i = 1; i <= 50; i++) {
    const experienceIdx = Math.floor(Math.random() * experiences.length);
    const updatedDate = new Date(baseDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000);
    
    projects.push({
      _id: `project_${i}`,
      projectName: `Project ${i}: ${['Improving', 'Analyzing', 'Building', 'Studying'][i % 4]} ${['Healthcare', 'Education', 'Community', 'Technology'][i % 4]} ${['Access', 'Outcomes', 'Systems', 'Solutions'][i % 4]}`,
      projectDescription: `This initiative focuses on ${['developing innovative solutions', 'conducting comprehensive research', 'building community partnerships', 'analyzing complex data'][i % 4]} to address ${['critical challenges', 'emerging needs', 'systemic issues', 'community concerns'][i % 4]} in ${['urban healthcare', 'educational equity', 'environmental sustainability', 'social services'][i % 4]}. Our team is working to ${['create lasting impact', 'drive meaningful change', 'foster collaboration', 'generate insights'][i % 4]} through ${['evidence-based approaches', 'community engagement', 'data-driven methods', 'participatory research'][i % 4]}.`,
      projectStatus: statuses[Math.floor(Math.random() * (i < 30 ? 2 : 3))], // Favor Active/Proposed
      experienceCategory: experiences[experienceIdx],
      experienceName: experiences[experienceIdx],
      sessionName: sessions[Math.floor(Math.random() * sessions.length)],
      groupName: groups[Math.floor(Math.random() * groups.length)],
      tags: tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1),
      fileCount: Math.floor(Math.random() * 25),
      memberCount: Math.floor(Math.random() * 12) + 1,
      currentVersion: Math.floor(Math.random() * 10) + 1,
      ownerNames: [`User ${i}`, ...(Math.random() > 0.7 ? [`User ${i + 50}`] : [])],
      updatedAt: updatedDate,
      icon: icons[experienceIdx % icons.length],
      colorGradient: gradients[i % gradients.length]
    });
  }
  
  // Sort by updated date (most recent first)
  return projects.sort((a, b) => b.updatedAt - a.updatedAt);
};

// Data
const projects = ref(generateMockProjects());
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 12;
const viewMode = ref('grid');
const sortBy = ref('recent');

// Filters
const filters = ref({
  status: ['Active'],
  experienceCategory: [],
  session: [],
  tags: [],
  minDocs: 0
});

// Sort options
const sortOptions = [
  { title: 'Most Recent', value: 'recent' },
  { title: 'Most Documents', value: 'documents' },
  { title: 'Most Members', value: 'members' },
  { title: 'Alphabetical', value: 'alphabetical' }
];

// Table headers for list view
const tableHeaders = [
  { title: 'Project', key: 'projectName', width: '30%' },
  { title: 'Experience', key: 'experienceName' },
  { title: 'Session', key: 'sessionName' },
  { title: 'Status', key: 'projectStatus' },
  { title: 'Files', key: 'fileCount' },
  { title: 'Members', key: 'memberCount' },
  { title: 'Tags', key: 'tags' },
  { title: 'Updated', key: 'updatedAt' },
  { title: '', key: 'actions', sortable: false }
];

// Available filter options (derived from data)
const availableStatuses = computed(() => 
  [...new Set(projects.value.map(p => p.projectStatus))]
);

const availableCategories = computed(() => 
  [...new Set(projects.value.map(p => p.experienceCategory))]
);

const availableSessions = computed(() => 
  [...new Set(projects.value.map(p => p.sessionName))]
);

const availableTags = computed(() => 
  [...new Set(projects.value.flatMap(p => p.tags))]
);

// Filtered and sorted projects
const filteredProjects = computed(() => {
  let result = projects.value;
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p => 
      p.projectName.toLowerCase().includes(query) ||
      p.projectDescription.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  
  // Apply status filter
  if (filters.value.status.length > 0) {
    result = result.filter(p => filters.value.status.includes(p.projectStatus));
  }
  
  // Apply experience category filter
  if (filters.value.experienceCategory.length > 0) {
    result = result.filter(p => filters.value.experienceCategory.includes(p.experienceCategory));
  }
  
  // Apply session filter
  if (filters.value.session.length > 0) {
    result = result.filter(p => filters.value.session.includes(p.sessionName));
  }
  
  // Apply tags filter
  if (filters.value.tags.length > 0) {
    result = result.filter(p => 
      filters.value.tags.some(tag => p.tags.includes(tag))
    );
  }
  
  // Apply minimum documents filter
  if (filters.value.minDocs > 0) {
    result = result.filter(p => p.fileCount >= filters.value.minDocs);
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'documents':
      result = [...result].sort((a, b) => b.fileCount - a.fileCount);
      break;
    case 'members':
      result = [...result].sort((a, b) => b.memberCount - a.memberCount);
      break;
    case 'alphabetical':
      result = [...result].sort((a, b) => a.projectName.localeCompare(b.projectName));
      break;
    case 'recent':
    default:
      result = [...result].sort((a, b) => b.updatedAt - a.updatedAt);
  }
  
  return result;
});

// Paginated projects for grid view
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() => 
  Math.ceil(filteredProjects.value.length / itemsPerPage)
);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return filters.value.status.length !== 1 ||
    filters.value.status[0] !== 'Active' ||
    filters.value.experienceCategory.length > 0 ||
    filters.value.session.length > 0 ||
    filters.value.tags.length > 0 ||
    filters.value.minDocs > 0;
});

// Active filter chips for display
const activeFilterChips = computed(() => {
  const chips = [];
  if (filters.value.status.length > 0 && !(filters.value.status.length === 1 && filters.value.status[0] === 'Active')) {
    chips.push(...filters.value.status.map(s => `Status: ${s}`));
  }
  if (filters.value.experienceCategory.length > 0) {
    chips.push(...filters.value.experienceCategory.map(c => `Category: ${c}`));
  }
  if (filters.value.session.length > 0) {
    chips.push(...filters.value.session.map(s => `Session: ${s}`));
  }
  if (filters.value.tags.length > 0) {
    chips.push(...filters.value.tags.map(t => `Tag: ${t}`));
  }
  if (filters.value.minDocs > 0) {
    chips.push(`Docs: ${filters.value.minDocs}+`);
  }
  return chips;
});

// Methods
const resetFilters = () => {
  filters.value = {
    status: ['Active'],
    experienceCategory: [],
    session: [],
    tags: [],
    minDocs: 0
  };
  currentPage.value = 1;
};

const removeFilter = (chip) => {
  if (chip.startsWith('Status:')) {
    const status = chip.replace('Status: ', '');
    filters.value.status = filters.value.status.filter(s => s !== status);
  } else if (chip.startsWith('Category:')) {
    const cat = chip.replace('Category: ', '');
    filters.value.experienceCategory = filters.value.experienceCategory.filter(c => c !== cat);
  } else if (chip.startsWith('Session:')) {
    const session = chip.replace('Session: ', '');
    filters.value.session = filters.value.session.filter(s => s !== session);
  } else if (chip.startsWith('Tag:')) {
    const tag = chip.replace('Tag: ', '');
    filters.value.tags = filters.value.tags.filter(t => t !== tag);
  } else if (chip.startsWith('Docs:')) {
    filters.value.minDocs = 0;
  }
};

const viewProject = (project) => {
  // In production, this would navigate to the project detail page
  console.log('View project:', project._id);
  // router.push(`/projects/${project._id}`);
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

const formatDate = (date) => {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return date.toLocaleDateString();
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Proposed': return 'warning';
    case 'Archived': return 'grey';
    default: return 'default';
  }
};

// Reset page when filters change
const onFiltersChange = () => {
  currentPage.value = 1;
};

// Lifecycle
onMounted(() => {
  // Initialize any necessary data
  console.log('Projects Gallery mounted with', projects.value.length, 'projects');
});
</script>

<style scoped>
.sticky-filters {
  position: sticky;
  top: 20px;
}

.project-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
}

.project-title {
  line-height: 1.3;
  min-height: 2.6em;
}

.project-description {
  line-height: 1.4;
  min-height: 2.8em;
}

.card-header {
  overflow: hidden;
}

.v-chip-group {
  gap: 4px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .sticky-filters {
    position: relative;
    top: 0;
  }
}
</style>