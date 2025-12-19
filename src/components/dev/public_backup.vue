<template>
  <v-container fluid class="pa-0 engaged-public">
    <!-- Top Nav (simple + translucent) -->
    <header class="public-nav">
      <v-container class="py-2">
        <v-row align="center" no-gutters>
          <v-col cols="12" class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="28" color="primary" class="mr-2">mdi-hexagon-multiple</v-icon>
              <div class="text-subtitle-1 font-weight-bold">
                Data Platform <span class="mx-1 text-disabled">×</span> Engaged Data
              </div>
            </div>
            <div class="d-none d-sm-flex align-center">
              <v-btn variant="text" class="mx-1" @click="scrollTo('explainer')">About</v-btn>
              <v-btn variant="text" class="mx-1" @click="scrollTo('featured')">Featured</v-btn>
              <v-btn color="primary" class="ml-3" @click="goToSignIn">
                Sign in
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </header>

    <!-- HERO / Celebration intro (slideshow) -->
    <section class="hero-section">
      <v-carousel
        v-model="activeSlide"
        height="92vh"
        hide-delimiter-background
        show-arrows="hover"
        cycle
        :interval="6500"
        class="hero-carousel"
      >
        <v-carousel-item v-for="(p, i) in heroSlides" :key="p._id">
          <div class="slide">
            <div class="slide-bg" :style="{ backgroundImage: `url(${p.image})` }">
              <div class="bg-overlay"></div>
            </div>

            <v-container class="fill-height position-relative hero-content">
              <v-row class="fill-height" align="center" justify="center">
                <v-col cols="12" md="10" lg="8" class="text-center text-white">
                  <v-chip v-if="activeSlide === i" color="white" class="mb-3" size="large">
                    <v-icon start>mdi-star</v-icon>
                    Featured Project
                  </v-chip>

                  <h1 v-if="activeSlide === i" class="hero-title mb-2">
                    {{ p.projectName }}
                  </h1>

                  <p v-if="activeSlide === i" class="hero-subtitle mb-4">
                    {{ p.description }}
                  </p>

                  <div v-if="activeSlide === i" class="mb-4">
                    <v-chip
                      v-for="t in p.tags.slice(0, 4)"
                      :key="t"
                      class="ma-1"
                      color="white"
                      variant="outlined"
                      size="large"
                    >
                      {{ t }}
                    </v-chip>
                  </div>

                  <div v-if="activeSlide === i">
                    <v-btn size="x-large" color="white" class="mb-2" @click="viewProject(p)">
                      Explore Project
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>

            <!-- quick stats overlay (per project) -->
            <div class="stats-bar">
              <v-container>
                <v-row>
                  <v-col cols="4" class="text-center">
                    <div class="stat-icon"><v-icon color="white">mdi-account-group</v-icon></div>
                    <div class="stat-num text-white">{{ p.memberCount }}</div>
                    <div class="stat-label text-white">Members</div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="stat-icon"><v-icon color="white">mdi-school</v-icon></div>
                    <div class="stat-num text-white">{{ p.experienceCategory }}</div>
                    <div class="stat-label text-white">Experience</div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="stat-icon"><v-icon color="white">mdi-calendar</v-icon></div>
                    <div class="stat-num text-white">{{ p.sessionName }}</div>
                    <div class="stat-label text-white">Session</div>
                  </v-col>
                </v-row>
              </v-container>
            </div>

            <div class="scroll-cue">
              <v-icon color="white" size="40" class="bounce">mdi-chevron-down</v-icon>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </section>

    <!-- COMBINED EXPLAINER + SCALE SECTION (Side by Side) -->
    <section id="explainer" class="combined-section py-16">
      <v-container>
        <v-row>
          <!-- LEFT: What is Engaged Data -->
          <v-col cols="12" lg="6" class="mb-8 mb-lg-0">
            <div class="section-content">
              <h2 class="section-title mb-4">What is <span class="brand-gradient">Engaged Data</span>?</h2>
              <p class="section-subtitle mb-6">
                A project‑based learning platform that helps organizations collect goals and project materials, 
                transform them into clean data products, and return insights for continuous improvement.
              </p>

              <!-- Feature Cards - Vertical Stack -->
              <div class="feature-cards-vertical">
                <v-card class="elevation-4 feature-card mb-4">
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <div class="feature-icon">
                        <v-icon color="primary" size="32">mdi-clipboard-text-outline</v-icon>
                      </div>
                      <div class="ml-4 flex-grow-1">
                        <h3 class="text-h6 font-weight-bold mb-2">Collect</h3>
                        <p class="text-body-2 text-medium-emphasis">
                          Goal Setting and Student Entry forms capture aspirations, context, and baseline skills
                          across <strong>Experiences</strong> and <strong>Sessions</strong>.
                        </p>
                        <div class="mt-3">
                          <v-chip size="small" class="mr-2" variant="tonal" color="primary">Experiences</v-chip>
                          <v-chip size="small" class="mr-2" variant="tonal" color="primary">Sessions</v-chip>
                          <v-chip size="small" variant="tonal" color="primary">Projects</v-chip>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="elevation-4 feature-card mb-4">
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <div class="feature-icon">
                        <v-icon color="success" size="32">mdi-database-cog</v-icon>
                      </div>
                      <div class="ml-4 flex-grow-1">
                        <h3 class="text-h6 font-weight-bold mb-2">Transform</h3>
                        <p class="text-body-2 text-medium-emphasis">
                          We format submissions into consistent <strong>data products</strong> aligned to experiences and activities —
                          ready for downstream analysis in your tools.
                        </p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="elevation-4 feature-card">
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <div class="feature-icon">
                        <v-icon color="indigo" size="32">mdi-chart-line</v-icon>
                      </div>
                      <div class="ml-4 flex-grow-1">
                        <h3 class="text-h6 font-weight-bold mb-2">Improve</h3>
                        <p class="text-body-2 text-medium-emphasis">
                          At the end of each experience, results are delivered back to instructors/leaders to identify
                          what contributed to student goals — and what didn't — to drive continuous improvement.
                        </p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-col>

          <!-- RIGHT: Who is Using it -->
          <v-col cols="12" lg="6">
            <div class="section-content">
              <div class="scale-header mb-6">
                <h2 class="section-title mb-2">Who is using it?</h2>
                <p class="section-subtitle mb-4">
                  The Data Platform powers Engaged Data across organizations and experiences.
                  Here's the scale at a glance.
                </p>
                <v-chip-group multiple class="mb-4">
                  <v-chip v-for="c in categoryChips.slice(0,5)" :key="c.name" class="ma-1" variant="tonal">
                    {{ c.name }}&nbsp;<span class="text-disabled">({{ c.count }})</span>
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- KPI Boxes -->
              <v-row class="kpi-grid" ref="kpiRef">
                <v-col cols="6" class="mb-4">
                  <div class="kpi-box">
                    <v-icon size="40" color="primary">mdi-account-multiple</v-icon>
                    <div class="kpi-number">{{ animated.participants }}</div>
                    <div class="kpi-label">Participants</div>
                  </div>
                </v-col>
                <v-col cols="6" class="mb-4">
                  <div class="kpi-box">
                    <v-icon size="40" color="success">mdi-school</v-icon>
                    <div class="kpi-number">{{ animated.experiences }}</div>
                    <div class="kpi-label">Experiences</div>
                  </div>
                </v-col>
                <v-col cols="6" class="mb-4">
                  <div class="kpi-box">
                    <v-icon size="40" color="indigo">mdi-calendar-multiple</v-icon>
                    <div class="kpi-number">{{ animated.sessions }}</div>
                    <div class="kpi-label">Sessions</div>
                  </div>
                </v-col>
                <v-col cols="6" class="mb-4">
                  <div class="kpi-box">
                    <v-icon size="40" color="amber">mdi-folder-star</v-icon>
                    <div class="kpi-number">{{ animated.projects }}</div>
                    <div class="kpi-label">Active Projects</div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 3) CELEBRATION: Featured Projects -->
    <section id="featured" class="featured-section py-16">
      <v-container>
        <v-row class="mb-10" justify="center">
          <v-col cols="12" md="10" class="text-center">
            <h2 class="section-title">Celebrating Work in the Open</h2>
            <p class="section-subtitle">
              A curated selection of projects and experiences from our community.
            </p>
          </v-col>
        </v-row>

        <!-- horizontally scrollable cards (inspiration from publicGallery2 bottom) -->
        <div class="h-scroll-container">
          <div class="h-scroll">
            <div v-for="card in featuredCards" :key="card._id" class="h-card" @click="viewProject(card)">
              <div class="h-card-image" :style="{ backgroundImage: `url(${card.image})` }">
              </div>
              <div class="h-card-body">
                <div class="text-overline mb-1">{{ card.experienceCategory }}</div>
                <div class="text-subtitle-1 font-weight-medium">{{ card.projectName }}</div>
                <p class="text-caption text-medium-emphasis mt-1">{{ truncate(card.description, 110) }}</p>

                <div class="h-card-stats mt-3">
                  <div class="d-flex align-center mr-3 text-caption">
                    <v-icon size="16" class="mr-1">mdi-account-group</v-icon>{{ card.memberCount }}
                  </div>
                  <div class="d-flex align-center text-caption">
                    <v-icon size="16" class="mr-1">mdi-file-document</v-icon>{{ card.fileCount }}
                  </div>
                </div>

                <v-chip-group class="mt-3">
                  <v-chip v-for="t in card.tags.slice(0,3)" :key="t" size="x-small" variant="tonal" class="mr-1">{{ t }}</v-chip>
                </v-chip-group>

                <v-btn variant="tonal" color="primary" size="small" block class="mt-3">
                  View details
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <!-- CTA -->
    <section class="cta-section py-14">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" class="cta-card">
            <h3 class="text-h4 font-weight-bold mb-3">
              Ready to bring Engaged Data to your program?
            </h3>
            <p class="text-body-1 text-medium-emphasis mb-6">
              Partner with us to deliver measurable outcomes with a data-informed, project‑based approach.
            </p>
            <div class="d-flex flex-wrap ga-3">
              <v-btn size="large" color="primary" @click="goToContact">
                Contact us
                <v-icon end>mdi-email</v-icon>
              </v-btn>
              <v-btn size="large" variant="tonal" color="primary" @click="goToSignIn">
                Sign in
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Toggle mock vs live. For live, wire your endpoints in loadLive().
 * Keep this true for demo data out of the box.
 */
const USE_DEMO_DATA = true;

// HERO / celebration slides (minimal, curated)
const heroSlides = ref([
  {
    _id: '531750090654550',
    projectName: 'Building a Healthcare Accessibility Index for Houston',
    description: 'Understanding disparities in healthcare access through geographic proximity, need assessment, and non-medical barriers.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop',
    tags: ['healthcare', 'accessibility', 'geographic-analysis', 'equity'],
    memberCount: 1,
    experienceCategory: 'CHWI',
    sessionName: 'Spring 2025'
  },
  {
    _id: '301750284297896',
    projectName: 'Assessing lead poisoning vulnerability in Harris County',
    description: 'Mapping areas most in need of blood-lead level testing to protect vulnerable communities from environmental health threats.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&h=900&fit=crop',
    tags: ['environmental-health', 'lead-poisoning', 'vulnerable-populations', 'mapping'],
    memberCount: 1,
    experienceCategory: 'EDS',
    sessionName: 'Fall 2024'
  },
  {
    _id: '171750177726109',
    projectName: 'The Role of Non-Medical Barriers on Transplant Eligibility',
    description: 'Revealing how structural inequities embedded in transplant evaluation exclude marginalized populations from life-saving care.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1600&h=900&fit=crop',
    tags: ['healthcare-equity', 'transplant', 'structural-barriers', 'access'],
    memberCount: 1,
    experienceCategory: 'Minor Data & Society',
    sessionName: 'Summer 2025'
  }
]);

// Featured cards (horizontal)
const featuredCards = ref([
  {
    _id: '531750090654550',
    projectName: 'Building a Healthcare Accessibility Index for Houston',
    description: 'Evaluating healthcare accessibility through geographic proximity, need assessment, and non-medical barriers to create a comprehensive index for Houston/Harris County area.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    projectStatus: 'Active',
    memberCount: 1,
    fileCount: 3,
    tags: ['healthcare', 'accessibility', 'geographic-analysis'],
    experienceCategory: 'Community Health'
  },
  {
    _id: '421750092075315',
    projectName: 'Missed Diagnoses and Inpatient Access Barriers Derail Psychiatric Care for Justice-Involved Texans',
    description: 'Visualizing the pathway for justice-involved individuals with mental disorders from ED arrival to inpatient admission, emphasizing how limited bed capacity and diagnostic gaps derail treatment.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    projectStatus: 'Active',
    memberCount: 1,
    fileCount: 2,
    tags: ['mental-health', 'justice-system', 'healthcare-access'],
    experienceCategory: 'Health & Justice'
  },
  {
    _id: '301750284297896',
    projectName: 'Assessing lead poisoning vulnerability in communities throughout Harris County',
    description: 'Mapping and determining areas in Harris County most in need of regular blood-lead level tests to advocate for communities disproportionately facing health consequences of lead exposure.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
    projectStatus: 'Active',
    memberCount: 1,
    fileCount: 3,
    tags: ['environmental-health', 'lead-poisoning', 'vulnerable-populations'],
    experienceCategory: 'Environmental Health'
  },
  {
    _id: '071750694122484',
    projectName: 'Behind the Numbers: What Campus Spending Reveals About Special Education in Texas',
    description: 'Examining how school funding inequities affect resource allocation for special education and the consequences for student outcomes in underfunded districts across Texas.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    projectStatus: 'Active',
    memberCount: 1,
    fileCount: 3,
    tags: ['education', 'equity', 'special-education'],
    experienceCategory: 'Education Policy'
  },
  {
    _id: '171750177726109',
    projectName: 'The Role of Non-Medical Barriers on Transplant Eligibility',
    description: 'Investigating how non-medical drivers of health like housing, caregiver availability, and transportation intersect with medical criteria to shape access to the lung transplant waitlist.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop',
    projectStatus: 'Active',
    memberCount: 1,
    fileCount: 3,
    tags: ['healthcare-access', 'health-equity', 'transplant'],
    experienceCategory: 'Healthcare Equity'
  }
]);

// SCALE metrics (animated)
const metrics = reactive({
  participants: 0,
  experiences: 0,
  sessions: 0,
  projects: 0,
  categories: [] // { name, count }
});

// Animated numbers
const animated = reactive({
  participants: 0,
  experiences: 0,
  sessions: 0,
  projects: 0
});

const categoryChips = computed(() =>
  metrics.categories
    .slice()
    .sort((a, b) => b.count - a.count)
);

// Slideshow state
const activeSlide = ref(0);

// Animation on scroll
let observer = null;
let animatedOnce = false;

onMounted(() => {
  if (USE_DEMO_DATA) {
    loadDemo();
  } else {
    loadLive();
  }
  setupObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

// ----- Data loading -----
function loadDemo() {
  // Real data from database
  metrics.participants = 795;
  metrics.experiences = 44;
  metrics.sessions = 13;
  metrics.projects = 18;

  metrics.categories = [
    { name: 'Minor Data & Society', count: 19 },
    { name: 'Honors OCE', count: 15 },
    { name: 'HICH', count: 4 },
    { name: 'CHWI', count: 2 },
    { name: 'EDS', count: 2 }
  ];
}

async function loadLive() {
  /**
   * Example shape you can return from your backend:
   * GET /api/public/metrics
   * {
   *   participants: number,                 // distinct expRegistrationData.userID (registrationStatus = true)
   *   experiences: number,                  // experiencedata.countDocuments()
   *   sessions: number,                     // sessiondata.countDocuments()
   *   projects: number,                     // projectdata.countDocuments({ projectStatus: 'Active' })
   *   categories: [{ name, count }]         // group by experienceData.experienceCategory
   * }
   *
   * GET /api/public/featured
   * { hero: [...], featured: [...] }        // arrays with fields used above
   */
  try {
    const [m, f] = await Promise.all([
      fetch('/api/public/metrics').then(r => r.json()),
      fetch('/api/public/featured').then(r => r.json())
    ]);

    metrics.participants = m.participants ?? 0;
    metrics.experiences = m.experiences ?? 0;
    metrics.sessions = m.sessions ?? 0;
    metrics.projects = m.projects ?? 0;
    metrics.categories = Array.isArray(m.categories) ? m.categories : [];

    if (Array.isArray(f.hero) && f.hero.length) heroSlides.value = f.hero;
    if (Array.isArray(f.featured) && f.featured.length) featuredCards.value = f.featured;
  } catch (e) {
    // Fallback to demo if live fails, without breaking the page
    loadDemo();
    // console.warn('Failed to load live public data. Falling back to demo.', e);
  }
}

// ----- Animations -----
function setupObserver() {
  // respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  observer = new IntersectionObserver(
    entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting && !animatedOnce) {
          animatedOnce = true;
          // count-up animation
          animateNumber('participants', metrics.participants, prefersReduced ? 0 : 1800);
          animateNumber('experiences', metrics.experiences, prefersReduced ? 0 : 1500);
          animateNumber('sessions', metrics.sessions, prefersReduced ? 0 : 1500);
          animateNumber('projects', metrics.projects, prefersReduced ? 0 : 1700);
        }
      });
    },
    { threshold: 0.3 }
  );

  const kpi = document.querySelector('.combined-section');
  if (kpi) observer.observe(kpi);
}

function animateNumber(key, end, duration = 1500) {
  if (duration === 0) {
    animated[key] = end;
    return;
  }
  let start = 0;
  const step = Math.max(1, Math.floor(end / (duration / 16)));
  const t = setInterval(() => {
    start += step;
    if (start >= end) {
      animated[key] = end;
      clearInterval(t);
    } else {
      animated[key] = start;
    }
  }, 16);
}

// ----- UI helpers -----
function truncate(text, n) {
  if (!text) return '';
  return text.length <= n ? text : text.slice(0, n) + '…';
}

function statusColor(s) {
  switch (s) {
    case 'Active': return 'success';
    case 'Beta': return 'warning';
    case 'Proposed': return 'primary';
    case 'Archived': return 'grey';
    default: return 'default';
  }
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function viewProject(p) {
  // Link to your public project detail route if you expose one
  // router.push({ name: 'publicProject', params: { id: p._id } });
  console.log('View project', p._id);
}

function goToSignIn() {
  router.push('/login');
}

function goToGallery() {
  router.push('/publicProjects');
}

function goToContact() {
  router.push('/contact');
}
</script>

<style scoped>
/* --- Layout & Nav --- */
.public-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

/* --- HERO --- */
.hero-section { position: relative; }
.hero-carousel { position: relative; }

.hero-content {
  padding-bottom: 140px !important;
}

.slide { position: relative; height: 92vh; overflow: hidden; }
.slide-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  animation: slowZoom 22s ease-in-out infinite;
}
.bg-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.6));
}

@keyframes slowZoom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.hero-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  text-shadow: 0 4px 24px rgba(0,0,0,0.4);
  line-height: 1.1;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  max-width: 760px; margin: 0 auto;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.stats-bar {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(10px);
  padding: 16px 0;
  z-index: 2;
}
.stat-icon { opacity: 0.9; }
.stat-num { font-weight: 700; font-size: 1.2rem; margin-top: 4px; color: white; }
.stat-label { font-size: 0.8rem; opacity: 0.85; color: white; }

.scroll-cue {
  position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%);
}
.bounce { animation: bounce 2s infinite; }
@keyframes bounce {
  0%,20%,50%,80%,100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-6px); }
}

/* --- Combined Section (Side by Side) --- */
.combined-section {
  background: linear-gradient(180deg, #ffffff, #f7fafc);
  border-top: 1px solid #eee;
}

.section-content {
  height: 100%;
}

.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
}
.section-subtitle {
  max-width: 860px;
  color: rgba(0,0,0,0.7);
  line-height: 1.6;
}

.brand-gradient {
  background: linear-gradient(135deg, #4facfe, #00f2fe, #a8ff78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- Feature cards (Vertical in left column) --- */
.feature-cards-vertical {
  display: flex;
  flex-direction: column;
}

.feature-card {
  border-radius: 16px;
  transition: transform .25s ease, box-shadow .25s ease;
}
.feature-card:hover {
  transform: translateX(6px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.1) !important;
}
.feature-icon {
  width: 48px; 
  height: 48px; 
  border-radius: 12px;
  display: inline-flex; 
  align-items: center; 
  justify-content: center;
  background: rgba(0,0,0,0.04);
  flex-shrink: 0;
}

/* --- Scale section (Right column) --- */
.scale-header {
  margin-bottom: 24px;
}

.kpi-grid {
  margin-top: 16px;
}

.kpi-box {
  padding: 24px; 
  border-radius: 16px; 
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  text-align: center;
  height: 100%;
  transition: transform .25s ease, box-shadow .25s ease;
}

.kpi-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.1);
}

.kpi-number {
  font-size: 2.2rem; 
  font-weight: 800; 
  line-height: 1;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent;
  margin-top: 12px;
  margin-bottom: 8px;
}
.kpi-label { 
  font-size: .9rem; 
  color: rgba(0,0,0,0.6); 
}

/* --- Featured horizontal cards --- */
.featured-section { 
  background: linear-gradient(180deg, #f7fafc, #ffffff);
  border-bottom: 1px solid #eee;
}

.h-scroll-container { overflow-x: auto; padding-bottom: 8px; }
.h-scroll {
  display: flex; gap: 20px; padding: 0 4px 2px 4px;
}
.h-scroll::-webkit-scrollbar { height: 8px; }
.h-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 8px;
}
.h-card {
  min-width: 320px; width: 360px; background: white; border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.06);
  overflow: hidden; cursor: pointer;
  transition: transform .25s ease, box-shadow .25s ease;
}
.h-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.h-card-image {
  height: 180px; background-size: cover; background-position: center; position: relative;
}
.h-card-overlay { position: absolute; top: 12px; right: 12px; }
.h-card-body { padding: 14px; }
.h-card-stats { display: flex; align-items: center; color: rgba(0,0,0,0.65); }

/* --- CTA --- */
.cta-section { 
  background: linear-gradient(180deg, #ffffff, #f9fbfe);
}
.cta-card {
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

/* --- Responsive --- */
@media (max-width: 1280px) {
  .kpi-number { font-size: 2rem; }
}

@media (max-width: 960px) {
  .stat-num { font-size: 1.1rem; color: white; }
  .h-card { min-width: 280px; width: 300px; }
  
  /* Stack the sections vertically on mobile */
  .combined-section .section-content {
    margin-bottom: 40px;
  }
  
  .feature-cards-vertical .feature-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .kpi-box {
    padding: 16px;
  }
  
  .kpi-number {
    font-size: 1.6rem;
  }
}
</style>