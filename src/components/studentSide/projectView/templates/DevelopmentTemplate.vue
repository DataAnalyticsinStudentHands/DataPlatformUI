/**
 * src/components/studentSide/projectView/templates/DevelopmentTemplate.vue
 *
 * Dynamic template for Development/Team style projects.
 * Multi-author layout with timeline, impact grid, and image poster.
 * Receives project data as props instead of hardcoded values.
 */

<template>
  <div class="development-template">
    <!-- Hero Section -->
    <ProjectHeroMulti
      :label="project.label"
      :title="project.title"
      :description="project.description"
      :authors="project.authors"
    />

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column: Info Cards -->
      <div class="info-column">
        <!-- Tags -->
        <TagsCard 
          v-if="project.tags && project.tags.length > 0"
          :tags="project.tags"
          class="compact"
        />

        <!-- Key Achievements with Conclusion -->
        <FindingsCard
          v-if="project.findings && project.findings.length > 0"
          header-title="Key Achievements"
          :findings="project.findings"
          :conclusion="project.conclusion"
          :compact="true"
        />

        <!-- Development Timeline — stays in sidebar unless horizontal -->
        <TimelineCard
          v-if="project.milestones && project.milestones.length > 0 && (project.timelineLayout || 'vertical') === 'vertical'"
          title="Development Timeline"
          :milestones="project.milestones"
          layout="vertical"
        />

        <!-- Platform Impact -->
        <ImpactCard
          v-if="project.impactItems && project.impactItems.length > 0"
          title="Platform Impact"
          :impact-items="project.impactItems"
          :columns="2"
        />

        <!-- Partners -->
        <PartnersCard
          v-if="project.partners && project.partners.length > 0"
          :partners="project.partners"
          :columns="2"
          :compact="true"
        />
      </div>

      <!-- Right Column: Poster/Architecture -->
      <div class="poster-column">
        <PosterCardImage
          :title="project.poster?.title || 'System Architecture'"
          :image-url="project.poster?.url"
        />
      </div>
    </div>

    <!-- Horizontal Timeline — full width below grid -->
    <TimelineCard
      v-if="project.milestones && project.milestones.length > 0 && (project.timelineLayout || 'vertical') === 'horizontal'"
      title="Development Timeline"
      :milestones="project.milestones"
      layout="horizontal"
      class="full-width-timeline"
    />

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
  ProjectHeroMulti,
  TagsCard,
  FindingsCard,
  PartnersCard,
  TimelineCard,
  ImpactCard,
  PosterCardImage,
  FooterBanner
} from '../components';

const props = defineProps({
  project: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.templateType === 'development';
    }
  }
});
</script>

<style scoped>
.development-template {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(180deg, #f8f9fc 0%, #eef1f8 100%);
  min-height: 100vh;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
  gap: 12px;
  margin-top: 8px;
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.poster-column {
  display: flex;
  flex-direction: column;
}

/* Full-width horizontal timeline below the grid */
.full-width-timeline {
  margin-top: 12px;
}

/* Responsive: Stack on smaller screens */
@media (max-width: 1024px) {
  .development-template {
    padding: 16px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .poster-column {
    order: -1; /* Move poster to top on mobile */
  }
}

@media (max-width: 768px) {
  .development-template {
    padding: 12px;
  }
}
</style>