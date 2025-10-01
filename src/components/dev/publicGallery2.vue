<template>
  <div class="bento-container">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Floating Navigation -->
    <nav class="floating-nav">
      <v-container>
        <div class="nav-content">
          <div class="nav-logo">
            <v-icon size="32" color="white">mdi-hexagon-multiple</v-icon>
            <span class="ml-2 text-h6 font-weight-bold">Projects Lab</span>
          </div>
          <div class="nav-actions">
            <v-btn variant="text" color="white" class="mx-1">Discover</v-btn>
            <v-btn variant="text" color="white" class="mx-1">Collections</v-btn>
            <v-btn variant="text" color="white" class="mx-1">About</v-btn>
            <v-btn 
              variant="flat" 
              color="white"
              class="ml-3 glass-button"
            >
              <v-icon start>mdi-plus</v-icon>
              Submit Project
            </v-btn>
          </div>
        </div>
      </v-container>
    </nav>

    <!-- Hero Section with Floating Cards -->
    <section class="hero-bento">
      <v-container>
        <!-- Floating Title -->
        <div class="floating-header">
          <h1 class="bento-title">
            <span class="title-line">Discover</span>
            <span class="title-line gradient-text">Engage</span>
            <span class="title-line">Transform</span>
          </h1>
          <p class="bento-subtitle">
            Where ideas transform into impactful solutions
          </p>
        </div>

        <!-- Bento Grid -->
        <div class="bento-grid">
          <!-- Large Featured Project -->
          <div class="bento-item bento-large glass-card scroll-animate">
            <div class="bento-content">
              <v-chip color="amber" size="small" class="mb-3">
                <v-icon start size="small">mdi-fire</v-icon>
                Trending Now
              </v-chip>
              <h2 class="text-h4 font-weight-bold mb-3">
                {{ featuredProject.projectName }}
              </h2>
              <p class="text-body-1 mb-4 text-white-darken-1">
                {{ featuredProject.projectDescription }}
              </p>
              
              <div class="stat-pills mb-4">
                <div class="stat-pill">
                  <v-icon size="small">mdi-account-group</v-icon>
                  <span>{{ featuredProject.memberCount }} collaborators</span>
                </div>
                <div class="stat-pill">
                  <v-icon size="small">mdi-star</v-icon>
                  <span>{{ featuredProject.rating }} rating</span>
                </div>
              </div>

              <v-btn 
                size="large"
                color="white"
                class="explore-btn"
                @click="viewProject(featuredProject)"
              >
                Explore Project
                <v-icon end>mdi-arrow-right-circle</v-icon>
              </v-btn>
            </div>
            
            <div class="bento-visual">
              <img 
                :src="featuredProject.image" 
                :alt="featuredProject.projectName"
                class="featured-image"
              />
              <div class="image-overlay"></div>
            </div>
          </div>

          <!-- Live Stats Widget -->
          <div class="bento-item bento-stats glass-card scroll-animate">
            <div class="stats-header">
              <v-icon color="green" size="small">mdi-circle</v-icon>
              <span class="ml-2 text-caption">Live Activity</span>
            </div>
            <div class="stats-content">
              <div class="stat-row">
                <div class="stat-number">{{ animatedStats.projects }}</div>
                <div class="stat-label">Active Projects</div>
              </div>
              <div class="stat-row">
                <div class="stat-number">{{ animatedStats.members }}</div>
                <div class="stat-label">Team Members</div>
              </div>
              <div class="mini-chart">
                <svg viewBox="0 0 100 40" class="activity-chart">
                  <polyline
                    :points="chartPoints"
                    fill="none"
                    stroke="url(#gradient)"
                    stroke-width="2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bento-item bento-actions glass-card scroll-animate">
            <h3 class="text-h6 mb-4">Quick Explore</h3>
            <div class="action-buttons">
              <v-btn
                v-for="action in quickActions"
                :key="action.label"
                :color="action.color"
                variant="tonal"
                size="small"
                class="mb-2 mr-2"
                @click="filterByCategory(action.label)"
              >
                <v-icon start size="small">{{ action.icon }}</v-icon>
                {{ action.label }}
              </v-btn>
            </div>
          </div>

          <!-- Recent Activity Feed -->
          <div class="bento-item bento-activity glass-card scroll-animate">
            <div class="activity-header">
              <h3 class="text-h6">Recent Updates</h3>
              <v-icon color="primary">mdi-refresh</v-icon>
            </div>
            <div class="activity-list">
              <div 
                v-for="activity in recentActivities"
                :key="activity.id"
                class="activity-item"
              >
                <div class="activity-icon">
                  <v-icon :color="activity.color" size="small">
                    {{ activity.icon }}
                  </v-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mini Project Cards -->
          <div 
            v-for="(project, index) in miniProjects"
            :key="project._id"
            class="bento-item bento-mini glass-card project-hover scroll-animate"
            @click="viewProject(project)"
          >
            <div 
              class="mini-bg"
              :style="{ 
                background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`
              }"
            ></div>
            <div class="mini-content">
              <v-chip 
                :color="project.chipColor" 
                size="x-small"
                class="mb-2"
              >
                {{ project.category }}
              </v-chip>
              <h4 class="text-subtitle-1 font-weight-bold mb-1">
                {{ project.projectName }}
              </h4>
              <p class="text-caption text-white-darken-1">
                {{ truncateText(project.description, 60) }}
              </p>
              <div class="mini-footer">
                <span class="text-caption">
                  <v-icon size="x-small">mdi-account-multiple</v-icon>
                  {{ project.memberCount }}
                </span>
                <span class="text-caption">
                  <v-icon size="x-small">mdi-file-document</v-icon>
                  {{ project.fileCount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Categories -->
        <div class="floating-categories scroll-animate">
          <div class="category-cloud">
            <div 
              v-for="tag in trendingTags"
              :key="tag.name"
              class="floating-tag glass-card"
              :style="{ 
                '--delay': tag.delay,
                fontSize: `${tag.size}rem`
              }"
              @click="filterByTag(tag.name)"
            >
              #{{ tag.name }}
              <span class="tag-count">{{ tag.count }}</span>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Secondary Projects Section -->
    <section class="secondary-section">
      <v-container>
        <div class="section-header scroll-animate">
          <h2 class="text-h4 font-weight-bold">Explore by Impact Area</h2>
          <div class="filter-tabs">
            <v-chip-group
              v-model="selectedFilter"
              mandatory
              selected-class="filter-active"
            >
              <v-chip
                v-for="filter in filterOptions"
                :key="filter"
                class="filter-chip"
                variant="flat"
              >
                {{ filter }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>

        <!-- Horizontal Scroll Cards -->
        <div class="horizontal-scroll-container scroll-animate">
          <div class="scroll-wrapper">
            <div 
              v-for="project in scrollProjects"
              :key="project._id"
              class="scroll-card glass-card"
            >
              <div 
                class="card-image"
                :style="{ backgroundImage: `url(${project.image})` }"
              >
                <div class="card-overlay">
                  <v-chip color="white" size="small">
                    {{ project.status }}
                  </v-chip>
                </div>
              </div>
              <div class="card-content">
                <h3 class="text-h6 font-weight-medium">{{ project.projectName }}</h3>
                <p class="text-caption mt-1">{{ project.team }}</p>
                
                <div class="card-stats">
                  <div class="stat">
                    <v-icon size="small" color="primary">mdi-calendar</v-icon>
                    <span>{{ project.duration }}</span>
                  </div>
                  <div class="stat">
                    <v-icon size="small" color="success">mdi-trending-up</v-icon>
                    <span>{{ project.impact }}% impact</span>
                  </div>
                </div>
                
                <v-btn 
                  variant="tonal" 
                  color="primary"
                  size="small"
                  block
                  class="mt-3"
                >
                  View Details
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <v-container>
        <div class="cta-content glass-card scroll-animate">
          <h2 class="text-h3 font-weight-bold gradient-text mb-4">
            Ready to make an impact?
          </h2>
          <p class="text-h6 mb-6">
            Join our community of innovators and change-makers
          </p>
          <v-btn
            size="x-large"
            color="white"
            class="cta-button"
            @click="navigateToFullGallery"
          >
            Explore All Projects
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Featured project
const featuredProject = ref({
  _id: 'featured_1',
  projectName: 'Climate Action Platform',
  projectDescription: 'Leveraging machine learning to predict and mitigate environmental impacts in urban areas through community-driven data collection.',
  memberCount: 24,
  rating: 4.8,
  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'
});

// Mini projects for bento grid
const miniProjects = ref([
  {
    _id: 'mini_1',
    projectName: 'Health Equity Dashboard',
    description: 'Real-time analytics for healthcare access disparities',
    category: 'Healthcare',
    chipColor: 'red',
    gradient: ['#FF6B6B', '#FF8E53'],
    memberCount: 12,
    fileCount: 34
  },
  {
    _id: 'mini_2', 
    projectName: 'Smart City Sensors',
    description: 'IoT network monitoring urban environmental quality',
    category: 'Technology',
    chipColor: 'blue',
    gradient: ['#4E65FF', '#92EFFD'],
    memberCount: 8,
    fileCount: 56
  }
]);

// Horizontal scroll projects
const scrollProjects = ref([
  {
    _id: 'scroll_1',
    projectName: 'Community Garden Network',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    team: 'Urban Sustainability Team',
    duration: '6 months',
    impact: 85,
    status: 'Active'
  },
  {
    _id: 'scroll_2',
    projectName: 'Digital Literacy Program',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    team: 'Education Outreach',
    duration: '12 months',
    impact: 92,
    status: 'Active'
  },
  {
    _id: 'scroll_3',
    projectName: 'Mental Health Support App',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    team: 'Wellness Initiative',
    duration: '3 months',
    impact: 78,
    status: 'Beta'
  },
  {
    _id: 'scroll_4',
    projectName: 'Renewable Energy Tracker',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
    team: 'Green Tech Lab',
    duration: '9 months',
    impact: 88,
    status: 'Active'
  },
  {
    _id: 'scroll_5',
    projectName: 'Food Security Mapping',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
    team: 'Social Impact Group',
    duration: '4 months',
    impact: 81,
    status: 'Active'
  }
]);

// Quick action buttons
const quickActions = ref([
  { label: 'Healthcare', icon: 'mdi-hospital', color: 'red' },
  { label: 'Education', icon: 'mdi-school', color: 'blue' },
  { label: 'Environment', icon: 'mdi-leaf', color: 'green' },
  { label: 'Technology', icon: 'mdi-chip', color: 'purple' },
  { label: 'Community', icon: 'mdi-account-group', color: 'orange' }
]);

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    icon: 'mdi-file-document-plus',
    color: 'primary',
    title: 'New report added to Climate Action',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: 'mdi-account-plus',
    color: 'success',
    title: '3 members joined Health Dashboard',
    time: '5 hours ago'
  },
  {
    id: 3,
    icon: 'mdi-update',
    color: 'warning',
    title: 'Smart City updated to v2.1',
    time: '1 day ago'
  },
  {
    id: 4,
    icon: 'mdi-star',
    color: 'amber',
    title: 'Digital Literacy won innovation award',
    time: '2 days ago'
  }
]);

// Trending tags with floating animation
const trendingTags = ref([
  { name: 'sustainability', count: 42, size: 1.2, delay: '0s' },
  { name: 'data-science', count: 38, size: 1, delay: '0.5s' },
  { name: 'community', count: 56, size: 1.4, delay: '1s' },
  { name: 'innovation', count: 31, size: 1.1, delay: '1.5s' },
  { name: 'health-tech', count: 27, size: 0.9, delay: '2s' },
  { name: 'education', count: 45, size: 1.3, delay: '2.5s' }
]);

// Filter options
const filterOptions = ref(['All', 'Healthcare', 'Education', 'Environment', 'Technology', 'Social Impact']);
const selectedFilter = ref(0);

// Animated statistics
const animatedStats = reactive({
  projects: 0,
  members: 0
});

let statsAnimated = false;

// Chart data for activity widget
const chartPoints = computed(() => {
  const points = [5, 15, 8, 20, 14, 30, 25, 35, 28, 38];
  return points.map((y, x) => `${x * 10},${40 - y}`).join(' ');
});

// Intersection Observer for scroll animations
let observer = null;

// Lifecycle
onMounted(() => {
  // Don't animate stats immediately, wait for scroll
  // Set up scroll animations
  setupScrollAnimations();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Scroll animation setup
const setupScrollAnimations = () => {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        
        // Trigger stats animation when stats section comes into view (only once)
        if (entry.target.classList.contains('bento-stats') && !statsAnimated) {
          animatedStats.projects = 0;
          animatedStats.members = 0;
          animateValue('projects', 127, 2000);
          animateValue('members', 450, 2500);
          statsAnimated = true;
        }
      }
    });
  }, options);

  // Observe all elements with scroll-animate class
  const animatedElements = document.querySelectorAll('.scroll-animate');
  animatedElements.forEach(el => observer.observe(el));
};

// Methods
const animateValue = (key, end, duration) => {
  let start = 0;
  const increment = end / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= end) {
      animatedStats[key] = end;
      clearInterval(timer);
    } else {
      animatedStats[key] = Math.floor(start);
    }
  }, 16);
};

const viewProject = (project) => {
  console.log('View project:', project._id);
};

const filterByCategory = (category) => {
  console.log('Filter by category:', category);
};

const filterByTag = (tag) => {
  console.log('Filter by tag:', tag);
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

const navigateToFullGallery = () => {
  router.push('/publicProjects');
};
</script>

<style scoped>
/* Container and Background */
.bento-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  position: relative;
  overflow-x: hidden;
  color: white;
}

.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #4facfe 0%, transparent 70%);
  top: -200px;
  left: -200px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #00f2fe 0%, transparent 70%);
  bottom: -100px;
  right: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #a8ff78 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(-30px, -20px) scale(1.02); }
}

/* Floating Navigation */
.floating-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px 0;
  background: rgba(15, 15, 30, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  color: white;
}

.nav-actions {
  display: flex;
  align-items: center;
}

/* Glass Morphism Card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.glass-button {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Hero Bento Section */
.hero-bento {
  padding-top: 120px;
  position: relative;
  z-index: 1;
}

.floating-header {
  text-align: center;
  margin-bottom: 60px;
  animation: slideInDown 1s ease-out;
}

.bento-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 20px;
}

.title-line {
  display: block;
  animation: slideInLeft 1s ease-out;
}

.title-line:nth-child(2) {
  animation-delay: 0.2s;
}

.title-line:nth-child(3) {
  animation-delay: 0.4s;
}

.gradient-text {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #a8ff78 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bento-subtitle {
  font-size: 1.5rem;
  opacity: 0.8;
  animation: fadeIn 1s ease-out 0.6s both;
}

/* Bento Grid Layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 80px;
}

.bento-item {
  padding: 30px;
  transition: all 0.3s ease;
}

/* Scroll Animation Classes */
.scroll-animate {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.scroll-animate.scroll-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered animations for bento items */
.bento-large.scroll-visible {
  transition-delay: 0s;
}

.bento-stats.scroll-visible {
  transition-delay: 0.1s;
}

.bento-actions.scroll-visible {
  transition-delay: 0.2s;
}

.bento-activity.scroll-visible {
  transition-delay: 0.3s;
}

.bento-mini:nth-child(5).scroll-visible {
  transition-delay: 0.4s;
}

.bento-mini:nth-child(6).scroll-visible {
  transition-delay: 0.5s;
}

.floating-categories.scroll-visible {
  transition-delay: 0.6s;
}

.section-header.scroll-visible {
  transition-delay: 0s;
}

.horizontal-scroll-container.scroll-visible {
  transition-delay: 0.2s;
}

.cta-content.scroll-visible {
  animation: fadeInScale 0.8s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.bento-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.bento-large {
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
}

.bento-stats {
  grid-column: span 1;
}

.bento-actions {
  grid-column: span 1;
}

.bento-activity {
  grid-column: span 2;
}

.bento-mini {
  grid-column: span 1;
  cursor: pointer;
  position: relative;
}

/* Bento Content Styles */
.bento-visual {
  position: relative;
  flex: 1;
  height: 100%;
  margin-left: 30px;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2));
  border-radius: 15px;
}

.stat-pills {
  display: flex;
  gap: 15px;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
}

/* Stats Widget */
.stats-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-row {
  margin-bottom: 20px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.7;
}

.mini-chart {
  margin-top: 20px;
}

.activity-chart {
  width: 100%;
  height: 40px;
}

/* Activity Feed */
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* Mini Project Cards */
.mini-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  border-radius: 20px 20px 0 0;
  opacity: 0.3;
}

.mini-content {
  position: relative;
  z-index: 1;
}

.mini-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Floating Categories */
.floating-categories {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
}

.category-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.floating-tag {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: floatTag 6s infinite ease-in-out;
  animation-delay: var(--delay);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.floating-tag:hover {
  transform: translateY(-5px) scale(1.05);
  background: rgba(255, 255, 255, 0.15);
}

.tag-count {
  font-size: 0.8em;
  opacity: 0.7;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

@keyframes floatTag {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Secondary Section */
.secondary-section {
  padding: 100px 0 80px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.filter-tabs {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  margin: 0 5px;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Horizontal Scroll */
.horizontal-scroll-container {
  overflow-x: auto;
  padding: 20px 0;
  margin: 0 -20px;
}

.scroll-wrapper {
  display: flex;
  gap: 20px;
  padding: 0 20px;
}

.scroll-card {
  min-width: 300px;
  transition: all 0.3s ease;
}

.scroll-card:hover {
  transform: scale(1.05);
}

.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 20px 20px 0 0;
  position: relative;
}

.card-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
}

.card-content {
  padding: 20px;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  position: relative;
  z-index: 1;
}

.cta-content {
  text-align: center;
  padding: 60px;
  background: rgba(255, 255, 255, 0.03);
}

.cta-button {
  background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
  color: white !important;
  font-weight: 600;
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 1280px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .bento-large {
    grid-column: span 3;
  }
  
  .bento-activity {
    grid-column: span 3;
  }
}

@media (max-width: 960px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  
  .bento-item {
    grid-column: span 1 !important;
  }
  
  .bento-large {
    flex-direction: column;
  }
  
  .bento-visual {
    margin-left: 0;
    margin-top: 30px;
    height: 300px;
  }
  
  .nav-actions {
    display: none;
  }
}

/* Custom scrollbar for horizontal scroll */
.horizontal-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.horizontal-scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 10px;
}
</style>