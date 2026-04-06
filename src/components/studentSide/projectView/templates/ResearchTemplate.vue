/**
 * src/components/studentSide/projectView/templates/ResearchTemplate.vue
 *
 * Dynamic template for Research/Fellowship style projects.
 * Single author layout with PDF poster display.
 * Receives project data as props instead of hardcoded values.
 */

<template>
  <div class="research-template">
    <!-- Hero Section -->
    <ProjectHeroSingle
      :label="project.label"
      :title="project.title"
      :description="project.description"
      :author="project.author"
    />

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column: Info Cards -->
      <div class="info-column">
        <!-- Tags -->
        <TagsCard 
          v-if="project.tags && project.tags.length > 0"
          :tags="project.tags" 
        />

        <!-- Key Findings with Conclusion -->
        <FindingsCard
          v-if="project.findings && project.findings.length > 0"
          header-title="Key Findings"
          :findings="project.findings"
          :conclusion="project.conclusion"
        />

        <!-- Partners -->
        <PartnersCard
          v-if="project.partners && project.partners.length > 0"
          :partners="project.partners"
          :columns="3"
        />
      </div>

      <!-- Right Column: Poster -->
      <div class="poster-column">
        <PosterCardPdf
          :title="project.poster?.title || 'Research Poster'"
          :pdf-url="project.poster?.url"
        />
      </div>
    </div>

    <!-- Footer Banner -->
    <FooterBanner
      v-if="project.footer"
      :icon="project.footer.icon"
      :message="project.footer.message"
      :variant="project.footer.variant"
    />
  </div>
</template>

<script setup>
import {
  ProjectHeroSingle,
  TagsCard,
  FindingsCard,
  PartnersCard,
  PosterCardPdf,
  FooterBanner
} from '../components';

const props = defineProps({
  project: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.templateType === 'research' || !value.templateType;
    }
  }
});
</script>

<style scoped>
.research-template {
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
  .research-template {
    padding: 16px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .poster-column {
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .research-template {
    padding: 12px;
  }

  .poster-column {
    min-height: 400px;
  }
}
</style>