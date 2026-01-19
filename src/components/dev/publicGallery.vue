<template>
  <v-container fluid class="pa-0">
    <!-- Hero Carousel Section -->
    <section class="hero-section">
      <v-carousel
        v-model="activeSlide"
        height="100vh"
        hide-delimiter-background
        show-arrows="hover"
        cycle
        :interval="6000"
        class="hero-carousel"
      >
        <v-carousel-item
          v-for="(project, index) in heroProjects"
          :key="project._id"
        >
          <div class="carousel-slide">
            <!-- Background Image with Overlay -->
            <div 
              class="slide-background"
              :style="{
                backgroundImage: `url(${project.heroImage})`,
              }"
            >
              <div class="overlay"></div>
            </div>

            <!-- Content Container -->
            <v-container class="slide-content">
              <v-row align="center" justify="center" style="min-height: 100vh;">
                <v-col cols="12" md="10" lg="8">
                  <div class="text-center text-white">
                    <!-- Animated Badge -->
                    <v-slide-y-transition>
                      <v-chip
                        v-if="activeSlide === index"
                        color="white"
                        class="mb-4 project-badge"
                        size="large"
                      >
                        <v-icon start>mdi-star</v-icon>
                        Featured Project
                      </v-chip>
                    </v-slide-y-transition>

                    <!-- Project Title -->
                    <v-slide-y-transition>
                      <h1 
                        v-if="activeSlide === index"
                        class="hero-title mb-4"
                      >
                        {{ project.projectName }}
                      </h1>
                    </v-slide-y-transition>

                    <!-- Project Description -->
                    <v-slide-y-transition>
                      <p 
                        v-if="activeSlide === index"
                        class="hero-description mb-6"
                      >
                        {{ project.projectDescription }}
                      </p>
                    </v-slide-y-transition>

                    <!-- Meta Information -->
                    <v-slide-y-transition>
                      <div v-if="activeSlide === index" class="mb-6">
                        <v-chip
                          v-for="tag in project.tags.slice(0, 3)"
                          :key="tag"
                          class="ma-1"
                          color="white"
                          variant="outlined"
                          size="large"
                        >
                          {{ tag }}
                        </v-chip>
                      </div>
                    </v-slide-y-transition>

                    <!-- CTA Buttons -->
                    <v-slide-y-transition>
                      <div v-if="activeSlide === index">
                        <v-btn
                          size="x-large"
                          color="white"
                          class="mr-3 mb-3"
                          @click="viewProject(project)"
                        >
                          Explore Project
                          <v-icon end>mdi-arrow-right</v-icon>
                        </v-btn>
                        <v-btn
                          size="x-large"
                          variant="outlined"
                          color="white"
                          class="mb-3"
                          @click="scrollToProjects"
                        >
                          View All Projects
                        </v-btn>
                      </div>
                    </v-slide-y-transition>
                  </div>
                </v-col>
              </v-row>
            </v-container>

            <!-- Project Stats Overlay -->
            <div class="stats-overlay">
              <v-container>
                <v-row>
                  <v-col cols="4" class="text-center">
                    <div class="stat-item">
                      <v-icon color="white" size="30">mdi-account-group</v-icon>
                      <div class="stat-number">{{ project.memberCount }}</div>
                      <div class="stat-label">Team Members</div>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="stat-item">
                      <v-icon color="white" size="30">mdi-file-document</v-icon>
                      <div class="stat-number">{{ project.fileCount }}</div>
                      <div class="stat-label">Documents</div>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="stat-item">
                      <v-icon color="white" size="30">mdi-calendar</v-icon>
                      <div class="stat-number">{{ project.sessionName }}</div>
                      <div class="stat-label">Session</div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator">
        <v-icon color="white" size="40" class="bounce">mdi-chevron-down</v-icon>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section id="featured-projects" class="featured-section py-16">
      <v-container>
        <!-- Section Header -->
        <v-row class="mb-12">
          <v-col cols="12" class="text-center">
            <h2 class="section-title" ref="sectionTitle">
              Transforming Ideas into Impact
            </h2>
            <p class="section-subtitle mt-4">
              Discover how our students and community partners are creating meaningful change
            </p>
          </v-col>
        </v-row>

        <!-- Featured Project Cards -->
        <v-row>
          <v-col 
            v-for="(project, index) in featuredProjects"
            :key="project._id"
            cols="12"
            :md="index === 0 ? 12 : 6"
            class="project-col"
          >
            <div 
              :ref="`projectCard${index}`"
              class="project-card-wrapper"
              :class="{ 'featured-card': index === 0 }"
            >
              <v-card 
                class="project-card elevation-8"
                @click="viewProject(project)"
              >
                <v-row no-gutters v-if="index === 0">
                  <!-- Large Featured Card Layout -->
                  <v-col cols="12" md="7">
                    <div 
                      class="project-image featured-image"
                      :style="{ backgroundImage: `url(${project.featuredImage})` }"
                    >
                      <v-chip 
                        color="primary" 
                        class="position-absolute"
                        style="top: 20px; left: 20px;"
                      >
                        <v-icon start>mdi-trending-up</v-icon>
                        Top Project
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" md="5" class="d-flex flex-column">
                    <v-card-text class="pa-6 flex-grow-1">
                      <div class="overline mb-2 primary--text">{{ project.experienceCategory }}</div>
                      <h3 class="text-h4 font-weight-bold mb-3">{{ project.projectName }}</h3>
                      <p class="text-body-1 mb-4">{{ project.projectDescription }}</p>
                      
                      <div class="mb-4">
                        <v-chip
                          v-for="tag in project.tags.slice(0, 4)"
                          :key="tag"
                          class="mr-2 mb-2"
                          variant="tonal"
                          color="primary"
                        >
                          {{ tag }}
                        </v-chip>
                      </div>

                      <v-divider class="mb-4" />

                      <v-row no-gutters>
                        <v-col cols="6">
                          <div class="stat-mini">
                            <v-icon size="small" color="primary">mdi-account-group</v-icon>
                            <span class="ml-1">{{ project.memberCount }} members</span>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="stat-mini">
                            <v-icon size="small" color="primary">mdi-file-document</v-icon>
                            <span class="ml-1">{{ project.fileCount }} files</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    
                    <v-card-actions class="pa-6 pt-0">
                      <v-btn 
                        color="primary" 
                        variant="flat"
                        size="large"
                        block
                      >
                        View Project Details
                        <v-icon end>mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-col>
                </v-row>

                <!-- Regular Card Layout -->
                <div v-else>
                  <div 
                    class="project-image"
                    :style="{ 
                      backgroundImage: `url(${project.featuredImage})`,
                      height: '250px'
                    }"
                  >
                    <v-chip 
                      :color="getStatusColor(project.projectStatus)" 
                      class="position-absolute"
                      style="top: 15px; right: 15px;"
                      size="small"
                    >
                      {{ project.projectStatus }}
                    </v-chip>
                  </div>

                  <v-card-text class="pa-5">
                    <div class="overline mb-2 primary--text">{{ project.experienceCategory }}</div>
                    <h3 class="text-h5 font-weight-bold mb-3">{{ project.projectName }}</h3>
                    <p class="text-body-2 mb-3 text-medium-emphasis" style="min-height: 60px;">
                      {{ truncateText(project.projectDescription, 120) }}
                    </p>
                    
                    <div class="mb-3">
                      <v-chip
                        v-for="tag in project.tags.slice(0, 3)"
                        :key="tag"
                        size="small"
                        class="mr-1 mb-1"
                        variant="tonal"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>

                    <v-divider class="mb-3" />

                    <div class="d-flex justify-space-between align-center">
                      <div class="text-caption">
                        <v-icon size="x-small">mdi-account-group</v-icon>
                        {{ project.memberCount }} members
                      </div>
                      <div class="text-caption">
                        <v-icon size="x-small">mdi-update</v-icon>
                        {{ formatDate(project.updatedAt) }}
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions class="px-5 pb-4">
                    <v-btn 
                      color="primary" 
                      variant="tonal"
                      block
                    >
                      Learn More
                    </v-btn>
                  </v-card-actions>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>

        <!-- View All CTA -->
        <v-row class="mt-12">
          <v-col cols="12" class="text-center">
            <v-btn
              size="x-large"
              color="primary"
              variant="flat"
              @click="navigateToGallery"
            >
              Explore All Projects
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section py-12">
      <v-container>
        <v-row>
          <v-col 
            v-for="stat in projectStats"
            :key="stat.label"
            cols="6"
            md="3"
            class="text-center"
          >
            <div class="stat-box" ref="statBox">
              <v-icon :color="stat.color" size="48" class="mb-3">{{ stat.icon }}</v-icon>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeSlide = ref(0);

// Mock data with real-looking project images from Unsplash
const generateHeroProjects = () => {
  const heroImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=900&fit=crop', // Collaboration
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&h=900&fit=crop', // Environmental
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop', // Healthcare
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&h=900&fit=crop', // Technology
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1600&h=900&fit=crop', // Education
  ];

  const featuredImages = [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', // Data analysis
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop', // Community
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop', // Innovation
    'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&h=600&fit=crop', // Research
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop', // Healthcare tech
  ];

  const projectNames = [
    'Community Health Data Dashboard',
    'Sustainable Urban Gardens Initiative',
    'AI-Powered Patient Care System',
    'Educational Equity Research Platform',
    'Environmental Impact Tracker'
  ];

  const descriptions = [
    'Transforming healthcare delivery through innovative data visualization and community engagement strategies.',
    'Building sustainable food systems and green spaces in underserved urban communities across the city.',
    'Leveraging artificial intelligence to improve patient outcomes and streamline healthcare workflows.',
    'Researching and addressing disparities in educational access and outcomes for marginalized students.',
    'Tracking and analyzing environmental metrics to drive sustainable policy decisions and community action.'
  ];

  const tags = [
    ['healthcare', 'data-visualization', 'community', 'innovation'],
    ['sustainability', 'urban-planning', 'environment', 'community'],
    ['artificial-intelligence', 'healthcare', 'technology', 'research'],
    ['education', 'equity', 'research', 'policy'],
    ['environment', 'data-analysis', 'sustainability', 'technology']
  ];

  return projectNames.map((name, index) => ({
    _id: `hero_${index}`,
    projectName: name,
    projectDescription: descriptions[index],
    heroImage: heroImages[index],
    featuredImage: featuredImages[index],
    projectStatus: 'Active',
    experienceCategory: ['Healthcare Research', 'Environmental Studies', 'Data Science', 'Public Policy', 'Community Health'][index],
    sessionName: 'Fall 2024',
    tags: tags[index],
    fileCount: Math.floor(Math.random() * 30) + 10,
    memberCount: Math.floor(Math.random() * 10) + 5,
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }));
};

const heroProjects = ref(generateHeroProjects());
const featuredProjects = ref(heroProjects.value.slice(0, 5));

// Project statistics
const projectStats = ref([
  { icon: 'mdi-folder-multiple', value: '127', label: 'Active Projects', color: 'primary' },
  { icon: 'mdi-account-group', value: '450+', label: 'Team Members', color: 'success' },
  { icon: 'mdi-file-document-multiple', value: '2.3k', label: 'Documents', color: 'warning' },
  { icon: 'mdi-trophy', value: '23', label: 'Awards Won', color: 'error' }
]);

// Intersection Observer for scroll animations
let observer = null;

onMounted(() => {
  setupScrollAnimations();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const setupScrollAnimations = () => {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, options);

  // Observe section title
  const sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) observer.observe(sectionTitle);

  // Observe project cards
  const projectCards = document.querySelectorAll('.project-card-wrapper');
  projectCards.forEach(card => observer.observe(card));

  // Observe stat boxes
  const statBoxes = document.querySelectorAll('.stat-box');
  statBoxes.forEach(box => observer.observe(box));
};

// Methods
const viewProject = (project) => {
  console.log('View project:', project._id);
  // router.push(`/projects/${project._id}`);
};

const scrollToProjects = () => {
  const element = document.getElementById('featured-projects');
  element?.scrollIntoView({ behavior: 'smooth' });
};

const navigateToGallery = () => {
  router.push('/publicProjects');
};

const formatDate = (date) => {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Proposed': return 'warning';
    case 'Archived': return 'grey';
    default: return 'default';
  }
};
</script>

<style scoped>
/* Hero Section Styles */
.hero-section {
  position: relative;
  overflow: hidden;
}

.hero-carousel {
  position: relative;
}

.carousel-slide {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.slide-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  animation: slowZoom 20s ease-in-out infinite;
}

@keyframes slowZoom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.slide-content {
  position: relative;
  z-index: 2;
  height: 100%;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-description {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  max-width: 800px;
  margin: 0 auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.project-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Stats Overlay */
.stats-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  z-index: 2;
}

.stat-item {
  color: white;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 8px 0 4px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-7px); }
}

/* Featured Section */
.featured-section {
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  position: relative;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.section-title.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Project Cards */
.project-card-wrapper {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.project-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.project-card-wrapper:nth-child(1) { transition-delay: 0.1s; }
.project-card-wrapper:nth-child(2) { transition-delay: 0.2s; }
.project-card-wrapper:nth-child(3) { transition-delay: 0.3s; }
.project-card-wrapper:nth-child(4) { transition-delay: 0.4s; }
.project-card-wrapper:nth-child(5) { transition-delay: 0.5s; }

.project-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.project-image {
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: all 0.5s ease;
}

.featured-image {
  height: 100%;
  min-height: 400px;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.featured-card {
  grid-column: span 2;
}

.stat-mini {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

/* Statistics Section */
.stats-section {
  background: white;
  border-top: 1px solid #e0e0e0;
}

.stat-box {
  padding: 20px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.stat-box.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stat-box:nth-child(1) { transition-delay: 0.1s; }
.stat-box:nth-child(2) { transition-delay: 0.2s; }
.stat-box:nth-child(3) { transition-delay: 0.3s; }
.stat-box:nth-child(4) { transition-delay: 0.4s; }

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }

  .featured-card {
    grid-column: span 1;
  }
}

/* Global transitions */
.v-slide-y-transition-enter-active,
.v-slide-y-transition-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.v-slide-y-transition-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.v-slide-y-transition-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>