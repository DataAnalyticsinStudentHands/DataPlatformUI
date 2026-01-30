/**
 * src/components/dev/projectView/templates/ProjectTemplate.vue
 *
 * Unified template that renders project sections based on enabledSections.
 * Replaces the separate Research and Development templates.
 * Sections are rendered in a consistent order regardless of when they were enabled.
 */

<template>
  <div class="project-template">
    <!-- Hero Section (always rendered) -->
    <ProjectHeroSingle
      v-if="project.authors.length === 1"
      :label="project.label"
      :title="project.title"
      :description="project.description"
      :author="project.authors[0]"
    />
    <ProjectHeroMulti
      v-else
      :label="project.label"
      :title="project.title"
      :description="project.description"
      :authors="project.authors"
    />

    <!-- Main Content Grid -->
    <div class="content-grid" :class="{ 'no-poster': !hasPoster }">
      <!-- Left Column: Info Cards -->
      <div class="info-column">
        <!-- Tags (always rendered) -->
        <TagsCard
          v-if="project.tags && project.tags.length > 0"
          :tags="project.tags"
        />

        <!-- Key Findings with Conclusion (always rendered) -->
        <FindingsCard
          v-if="project.findings && project.findings.length > 0"
          header-title="Key Findings"
          :findings="project.findings"
          :conclusion="project.conclusion"
          :compact="hasManyOptionalSections"
        />

        <!-- Partners (optional, order: 30) -->
        <PartnersCard
          v-if="isSectionEnabled('partners') && project.partners && project.partners.length > 0"
          :partners="project.partners"
          :columns="hasManyOptionalSections ? 2 : 3"
          :compact="hasManyOptionalSections"
        />

        <!-- Timeline (optional, order: 40) -->
        <TimelineCard
          v-if="isSectionEnabled('timeline') && project.milestones && project.milestones.length > 0"
          title="Project Timeline"
          :milestones="project.milestones"
        />

        <!-- Impact (optional, order: 50) -->
        <ImpactCard
          v-if="isSectionEnabled('impact') && project.impactItems && project.impactItems.length > 0"
          title="Impact Summary"
          :impact-items="project.impactItems"
          :columns="2"
        />
      </div>

      <!-- Right Column: Poster (optional, order: 60) -->
      <div v-if="hasPoster" class="poster-column">
        <PosterCardPdf
          v-if="project.poster?.type === 'pdf'"
          :title="project.poster?.title || 'Research Poster'"
          :pdf-url="project.poster?.url"
        />
        <PosterCardImage
          v-else
          :title="project.poster?.title || 'Project Diagram'"
          :image-url="project.poster?.url"
        />
      </div>
    </div>

    <!-- Footer Banner (always rendered) -->
    <FooterBanner
      v-if="project.footer"
      :icon="project.footer.icon"
      :message="project.footer.message"
      :variant="project.footer.variant"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  ProjectHeroSingle,
  ProjectHeroMulti,
  TagsCard,
  FindingsCard,
  PartnersCard,
  TimelineCard,
  ImpactCard,
  PosterCardPdf,
  PosterCardImage,
  FooterBanner
} from '../components';
import { isSectionEnabled as checkSectionEnabled } from '../types/sectionTypes.js';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  }
});

// Get enabled sections from project
const enabledSections = computed(() => props.project.enabledSections || []);

// Check if a specific section is enabled
function isSectionEnabled(sectionId) {
  return checkSectionEnabled(sectionId, enabledSections.value);
}

// Check if poster section is enabled and has data
const hasPoster = computed(() => {
  return isSectionEnabled('poster') && props.project.poster;
});

// Count enabled optional sidebar sections for compact mode
const hasManyOptionalSections = computed(() => {
  const sidebarSections = ['partners', 'timeline', 'impact'];
  const enabledCount = sidebarSections.filter(s => isSectionEnabled(s)).length;
  return enabledCount >= 2;
});
</script>

<style scoped>
.project-template {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(180deg, #f8f9fc 0%, #eef1f8 100%);
  min-height: 100vh;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(280px, 400px) 1fr;
  gap: 16px;
  margin-top: 8px;
}

/* When no poster, info column can take full width or expand */
.content-grid.no-poster {
  grid-template-columns: 1fr;
  max-width: 800px;
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.poster-column {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Responsive: Stack on smaller screens */
@media (max-width: 1024px) {
  .project-template {
    padding: 16px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .content-grid.no-poster {
    max-width: none;
  }

  .poster-column {
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .project-template {
    padding: 12px;
  }

  .poster-column {
    min-height: 400px;
  }
}
</style>
