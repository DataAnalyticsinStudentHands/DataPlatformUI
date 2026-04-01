<template>
  <v-container fluid class="pa-0 engaged-public">
    <!-- Top Nav (simple + translucent) -->
    <header class="public-nav">
      <v-container class="py-2">
        <v-row align="center" no-gutters>
          <v-col cols="12" class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="28" color="primary" class="mr-2"
                >mdi-hexagon-multiple</v-icon
              >
              <div class="text-subtitle-1 font-weight-bold">
                Data Platform <span class="mx-1 text-disabled">×</span> Engaged
                Data
              </div>
            </div>
            <div class="d-none d-sm-flex align-center">
              <v-btn variant="text" class="mx-1" @click="scrollTo('explainer')"
                >About</v-btn
              >
              <v-btn variant="text" class="mx-1" @click="scrollTo('featured')"
                >Featured</v-btn
              >
              <v-btn color="primary" class="ml-3" @click="goToSignIn">
                Sign in
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </header>

    <!-- HERO / Celebration intro (slideshow) -->
    <section v-if="heroSlides.length" class="hero-section">
      <v-carousel
        v-model="activeSlide"
        height="92vh"
        hide-delimiter-background
        show-arrows="hover"
        cycle
        :interval="8000"
        class="hero-carousel"
      >
        <v-carousel-item v-for="(p, i) in heroSlides" :key="p._id">
          <div class="slide">
            <div
              class="slide-bg"
              :style="{ backgroundImage: `url(${p.image})` }"
            >
              <div class="bg-overlay"></div>
            </div>

            <v-container class="fill-height position-relative hero-content">
              <v-row class="fill-height" align="center" justify="center">
                <v-col cols="12" md="10" lg="8" class="text-center text-white">
                  <v-chip
                    v-if="activeSlide === i"
                    color="white"
                    class="mb-3"
                    size="large"
                  >
                    <v-icon start>mdi-star</v-icon>
                    {{ p.achievementTag || "Featured Project" }}
                  </v-chip>

                  <h1 v-if="activeSlide === i" class="hero-title mb-2">
                    {{ p.projectName }}
                  </h1>

                  <p v-if="activeSlide === i" class="hero-subtitle mb-4">
                    {{ p.description }}
                  </p>

                  <!-- Student Attribution for Real Projects -->
                  <div
                    v-if="activeSlide === i && p.studentName"
                    class="student-attribution mb-4"
                  >
                    <v-avatar v-if="p.studentPhoto" size="48" class="mr-3">
                      <v-img :src="p.studentPhoto" />
                    </v-avatar>
                    <div class="text-white">
                      <div class="font-weight-medium">{{ p.studentName }}</div>
                      <div class="text-caption opacity-90">
                        {{ p.fellowship || p.experienceCategory }}
                      </div>
                    </div>
                  </div>

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
                    <v-btn
                      size="x-large"
                      color="white"
                      class="mb-2"
                      @click="viewProject(p)"
                    >
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
                    <div class="stat-icon">
                      <v-icon color="white">{{
                        p.stat1Icon || "mdi-account-group"
                      }}</v-icon>
                    </div>
                    <div class="stat-num text-white">
                      {{ p.stat1Value || p.memberCount }}
                    </div>
                    <div class="stat-label text-white">
                      {{ p.stat1Label || "Members" }}
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="stat-icon">
                      <v-icon color="white">{{
                        p.stat2Icon || "mdi-school"
                      }}</v-icon>
                    </div>
                    <div class="stat-num text-white">
                      {{ p.stat2Value || p.experienceCategory }}
                    </div>
                    <div class="stat-label text-white">
                      {{ p.stat2Label || "Experience" }}
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="stat-icon">
                      <v-icon color="white">{{
                        p.stat3Icon || "mdi-calendar"
                      }}</v-icon>
                    </div>
                    <div class="stat-num text-white">
                      {{ p.stat3Value || p.sessionName }}
                    </div>
                    <div class="stat-label text-white">
                      {{ p.stat3Label || "Session" }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </div>

            <div class="scroll-cue">
              <v-icon color="white" size="40" class="bounce"
                >mdi-chevron-down</v-icon
              >
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
              <h2 class="section-title mb-4">
                What is <span class="brand-gradient">Engaged Data</span>?
              </h2>
              <p class="section-subtitle mb-6">
                A project‑based learning platform that helps organizations
                collect goals and project materials, transform them into clean
                data products, and return insights for continuous improvement.
              </p>

              <!-- Feature Cards - Vertical Stack -->
              <div class="feature-cards-vertical">
                <v-card class="elevation-4 feature-card mb-4">
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <div class="feature-icon">
                        <v-icon color="primary" size="32"
                          >mdi-clipboard-text-outline</v-icon
                        >
                      </div>
                      <div class="ml-4 flex-grow-1">
                        <h3 class="text-h6 font-weight-bold mb-2">Collect</h3>
                        <p class="text-body-2 text-medium-emphasis">
                          Goal Setting and Student Entry forms capture
                          aspirations, context, and baseline skills across
                          <strong>Experiences</strong> and
                          <strong>Sessions</strong>.
                        </p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="elevation-4 feature-card mb-4">
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <div class="feature-icon">
                        <v-icon color="success" size="32"
                          >mdi-database-cog</v-icon
                        >
                      </div>
                      <div class="ml-4 flex-grow-1">
                        <h3 class="text-h6 font-weight-bold mb-2">Transform</h3>
                        <p class="text-body-2 text-medium-emphasis">
                          We format submissions into consistent
                          <strong>data products</strong> aligned to experiences
                          and activities — ready for downstream analysis in your
                          tools.
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
                          At the end of each experience, results are delivered
                          back to instructors/leaders to identify what
                          contributed to student goals — and what didn't — to
                          drive continuous improvement.
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
                  The Data Platform powers Engaged Data across organizations and
                  experiences. Here's the scale at a glance.
                </p>
                <v-chip-group multiple class="mb-4">
                  <v-chip
                    v-for="c in categoryChips.slice(0, 5)"
                    :key="c.name"
                    class="ma-1"
                    variant="tonal"
                  >
                    {{ c.name }}&nbsp;<span class="text-disabled"
                      >({{ c.count }})</span
                    >
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- KPI Boxes -->
              <v-row class="kpi-grid" ref="kpiRef">
                <v-col cols="6" class="mb-4">
                  <div class="kpi-box">
                    <v-icon size="40" color="primary"
                      >mdi-account-multiple</v-icon
                    >
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
                    <v-icon size="40" color="indigo"
                      >mdi-calendar-multiple</v-icon
                    >
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
    <section v-if="featuredCards.length" id="featured" class="featured-section py-16">
      <v-container>
        <v-row class="mb-10" justify="center">
          <v-col cols="12" md="10" class="text-center">
            <h2 class="section-title mb-3">Celebrating Work in the Open</h2>
            <p class="section-subtitle text-center mx-auto">
              A curated selection of projects and experiences from our
              community.
            </p>
          </v-col>
        </v-row>

        <!-- horizontally scrollable cards with navigation buttons -->
        <div class="h-scroll-wrapper" @mouseleave="hideScrollButtons">
          <!-- Left hover zone and button -->
          <div
            class="scroll-hover-zone scroll-hover-left"
            @mouseenter="checkAndShowLeftButton"
            @mouseleave="onLeaveLeftZone"
          >
            <button
              class="scroll-nav-button scroll-nav-left"
              :class="{ visible: showLeftButton }"
              @click="scrollCards('left')"
            >
              <v-icon size="24" color="white">mdi-chevron-left</v-icon>
            </button>
          </div>

          <!-- Right hover zone and button -->
          <div
            class="scroll-hover-zone scroll-hover-right"
            @mouseenter="checkAndShowRightButton"
            @mouseleave="onLeaveRightZone"
          >
            <button
              class="scroll-nav-button scroll-nav-right"
              :class="{ visible: showRightButton }"
              @click="scrollCards('right')"
            >
              <v-icon size="24" color="white">mdi-chevron-right</v-icon>
            </button>
          </div>

          <div
            class="h-scroll-container"
            ref="scrollContainer"
            @scroll="updateScrollButtons"
          >
            <div class="h-scroll">
              <div
                v-for="card in featuredCards"
                :key="card._id"
                class="h-card"
                :class="{ highlighted: highlightedProjectId === card._id }"
                :data-project-id="card._id"
                @click="viewProject(card)"
              >
                <!-- Real Project Indicator Badge -->
                <v-chip
                  v-if="card.isRealProject"
                  class="real-project-badge"
                  color="success"
                  size="small"
                >
                  <v-icon start size="14">mdi-check-circle</v-icon>
                  Real Research
                </v-chip>

                <div
                  class="h-card-image"
                  :style="{ backgroundImage: `url(${card.image})` }"
                >
                  <!-- Poster Preview Overlay for Real Projects -->
                  <div v-if="card.posterImage" class="poster-preview">
                    <v-icon color="white" size="24"
                      >mdi-file-document-outline</v-icon
                    >
                  </div>
                </div>
                <div class="h-card-body">
                  <!-- Card content wrapper that can grow -->
                  <div class="card-content-wrapper">
                    <div class="text-overline mb-1">
                      {{ card.experienceCategory }}
                    </div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ card.projectName }}
                    </div>

                    <!-- Student Attribution in Card -->
                    <div v-if="card.studentName" class="student-mini mt-2 mb-2">
                      <v-avatar v-if="card.studentPhoto" size="24" class="mr-2">
                        <v-img :src="card.studentPhoto" />
                      </v-avatar>
                      <span class="text-caption text-medium-emphasis">{{
                        card.studentName
                      }}</span>
                    </div>

                    <p class="text-caption text-medium-emphasis mt-1">
                      {{ truncate(card.description, 110) }}
                    </p>

                    <div class="h-card-stats mt-3">
                      <div
                        v-if="card.presentedAt"
                        class="d-flex align-center mr-3 text-caption text-success"
                      >
                        <v-icon size="16" class="mr-1">mdi-presentation</v-icon
                        >{{ card.presentedAt }}
                      </div>
                      <div v-else class="d-flex align-center mr-3 text-caption">
                        <v-icon size="16" class="mr-1">mdi-account-group</v-icon
                        >{{ card.memberCount }}
                      </div>
                      <div class="d-flex align-center text-caption">
                        <v-icon size="16" class="mr-1">mdi-file-document</v-icon
                        >{{ card.fileCount }}
                      </div>
                    </div>

                    <v-chip-group class="mt-3">
                      <v-chip
                        v-for="t in card.tags.slice(0, 3)"
                        :key="t"
                        size="x-small"
                        variant="tonal"
                        class="mr-1"
                        >{{ t }}</v-chip
                      >
                    </v-chip-group>
                  </div>

                  <!-- Button pushed to bottom -->
                  <v-btn
                    variant="tonal"
                    color="primary"
                    size="small"
                    class="mt-3 card-action-button"
                  >
                    View details
                  </v-btn>
                </div>
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
              Partner with us to deliver measurable outcomes with a
              data-informed, project‑based approach.
            </p>
            <div class="d-flex flex-wrap ga-3">
              <v-btn size="large" color="primary" @click="goToContact">
                Contact us
                <v-icon end>mdi-email</v-icon>
              </v-btn>
              <v-btn
                size="large"
                variant="tonal"
                color="primary"
                @click="goToSignIn"
              >
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
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getPublicFeatured } from "./featuredProjects/services/featuredProjectsService.js";
import { buildFileUrl } from "./projectView/services/projectViewFormService.js";

const router = useRouter();

// HERO / celebration slides — populated from API in loadLive()
const heroSlides = ref([]);

// Featured cards (horizontal) — populated from API in loadLive()
const featuredCards = ref([]);

// SCALE metrics (animated)
const metrics = reactive({
  participants: 0,
  experiences: 0,
  sessions: 0,
  projects: 0,
  categories: [],
});

// Animated numbers
const animated = reactive({
  participants: 0,
  experiences: 0,
  sessions: 0,
  projects: 0,
});

const categoryChips = computed(() =>
  metrics.categories.slice().sort((a, b) => b.count - a.count)
);

// Slideshow state
const activeSlide = ref(0);

// Highlighted card state
const highlightedProjectId = ref(null);

// Scroll navigation refs
const scrollContainer = ref(null);
const showLeftButton = ref(false);
const showRightButton = ref(false);
const isHoveringLeft = ref(false);
const isHoveringRight = ref(false);

// Animation on scroll
let observer = null;
let animatedOnce = false;

onMounted(() => {
  loadLive();
  setupObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

// ----- Data loading -----
function resolveImageUrls(p) {
  return {
    ...p,
    image: buildFileUrl(p.image),
    posterImage: buildFileUrl(p.posterImage),
    posterFull: buildFileUrl(p.posterFull),
    studentPhoto: buildFileUrl(p.studentPhoto),
  };
}

async function loadLive() {
  try {
    const f = await getPublicFeatured();

    if (Array.isArray(f.hero) && f.hero.length)
      heroSlides.value = f.hero.map(resolveImageUrls);
    if (Array.isArray(f.featured) && f.featured.length)
      featuredCards.value = f.featured.map(resolveImageUrls);

    // Populate KPI metrics from API response if available
    if (f.metrics) {
      metrics.participants = f.metrics.participants || 0;
      metrics.experiences = f.metrics.experiences || 0;
      metrics.sessions = f.metrics.sessions || 0;
      metrics.projects = f.metrics.projects || 0;
      metrics.categories = f.metrics.categories || [];
    }
  } catch (e) {
    // API error — router guard should have prevented reaching here with no data
    console.error("Failed to load featured projects:", e);
  }
}

// ----- Animations -----
function setupObserver() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting && !animatedOnce) {
          animatedOnce = true;
          animateNumber(
            "participants",
            metrics.participants,
            prefersReduced ? 0 : 1800
          );
          animateNumber(
            "experiences",
            metrics.experiences,
            prefersReduced ? 0 : 1500
          );
          animateNumber(
            "sessions",
            metrics.sessions,
            prefersReduced ? 0 : 1500
          );
          animateNumber(
            "projects",
            metrics.projects,
            prefersReduced ? 0 : 1700
          );
        }
      });
    },
    { threshold: 0.3 }
  );

  const kpi = document.querySelector(".combined-section");
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
  if (!text) return "";
  return text.length <= n ? text : text.slice(0, n) + "…";
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ----- Scroll Navigation Methods -----
function checkScrollPosition() {
  if (!scrollContainer.value) return;

  const container = scrollContainer.value;
  const scrollLeft = container.scrollLeft;
  const scrollWidth = container.scrollWidth;
  const clientWidth = container.clientWidth;

  // Update left button visibility
  if (isHoveringLeft.value) {
    showLeftButton.value = scrollLeft > 10;
  }

  // Update right button visibility
  if (isHoveringRight.value) {
    showRightButton.value = scrollLeft < scrollWidth - clientWidth - 10;
  }
}

function checkAndShowLeftButton() {
  isHoveringLeft.value = true;
  checkScrollPosition();
}

function checkAndShowRightButton() {
  isHoveringRight.value = true;
  checkScrollPosition();
}

function onLeaveLeftZone() {
  isHoveringLeft.value = false;
  showLeftButton.value = false;
}

function onLeaveRightZone() {
  isHoveringRight.value = false;
  showRightButton.value = false;
}

function hideScrollButtons() {
  isHoveringLeft.value = false;
  isHoveringRight.value = false;
  showLeftButton.value = false;
  showRightButton.value = false;
}

function scrollCards(direction) {
  if (!scrollContainer.value) return;

  const container = scrollContainer.value;
  const scrollAmount = 380;

  if (direction === "left") {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
}

function updateScrollButtons() {
  // Re-check scroll position to update button visibility
  checkScrollPosition();
}

function viewProject(p) {
  router.push(`/project/${p.projectViewFormId}`);
}

function goToSignIn() {
  router.push('/login');
}

function goToGallery() {
  router.push("/publicProjects");
}

function goToContact() {
  router.push("/contact");
}
</script>

<style scoped>
/* --- Layout & Nav --- */
.public-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* --- HERO --- */
.hero-section {
  position: relative;
}
.hero-carousel {
  position: relative;
}

.hero-content {
  padding-bottom: 140px !important;
}

.slide {
  position: relative;
  height: 92vh;
  overflow: hidden;
}
.slide-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  animation: slowZoom 22s ease-in-out infinite;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.6));
}

@keyframes slowZoom {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.hero-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  line-height: 1.1;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  max-width: 760px;
  margin: 0 auto;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

/* Student Attribution in Hero */
.student-attribution {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 8px 16px 8px 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stats-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  padding: 16px 0;
  z-index: 2;
}
.stat-icon {
  opacity: 0.9;
}
.stat-num {
  font-weight: 700;
  font-size: 1.2rem;
  margin-top: 4px;
  color: white;
}
.stat-label {
  font-size: 0.8rem;
  opacity: 0.85;
  color: white;
}

.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
}
.bounce {
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-6px);
  }
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
  color: rgba(0, 0, 0, 0.7);
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
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.feature-card:hover {
  transform: translateX(6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.1) !important;
}
.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.04);
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
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  text-align: center;
  height: 100%;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.kpi-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.1);
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
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
}

/* --- Featured horizontal cards --- */
.featured-section {
  background: linear-gradient(180deg, #f7fafc, #ffffff);
  border-bottom: 1px solid #eee;
}

.h-scroll-wrapper {
  position: relative;
}

.h-scroll-container {
  overflow-x: auto;
  padding-bottom: 8px;
  padding-top: 12px;
  scroll-behavior: smooth;
}
.h-scroll {
  display: flex;
  gap: 20px;
  padding: 12px 4px 12px 4px;
}
.h-scroll::-webkit-scrollbar {
  height: 8px;
}
.h-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 8px;
}

/* Scroll Navigation Hover Zones and Buttons */
.scroll-hover-zone {
  position: absolute;
  top: 0;
  bottom: 16px;
  width: 100px;
  z-index: 5;
  pointer-events: all;
}

.scroll-hover-left {
  left: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.01) 0%,
    transparent 100%
  );
}

.scroll-hover-right {
  right: 0;
  background: linear-gradient(
    -90deg,
    rgba(255, 255, 255, 0.01) 0%,
    transparent 100%
  );
}

.scroll-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}

.scroll-nav-button.visible {
  opacity: 1;
  pointer-events: all;
}

.scroll-nav-button:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.scroll-nav-left {
  left: 16px;
}

.scroll-nav-right {
  right: 16px;
}

/* --- Card Structure with Fixed Button Position --- */
.h-card {
  min-width: 320px;
  width: 360px;
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}
.h-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Highlighted card styles */
.h-card.highlighted {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(79, 172, 254, 0.3);
  border: 2px solid #4facfe;
}

.h-card.highlight-pulse {
  animation: highlightPulse 1s ease-in-out 2;
}

@keyframes highlightPulse {
  0% {
    box-shadow: 0 20px 40px rgba(79, 172, 254, 0.3);
  }
  50% {
    box-shadow: 0 20px 50px rgba(79, 172, 254, 0.5);
    transform: translateY(-8px);
  }
  100% {
    box-shadow: 0 20px 40px rgba(79, 172, 254, 0.3);
  }
}

.h-card-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

/* Real Project Badge */
.real-project-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 5;
  background: linear-gradient(135deg, #4caf50, #66bb6a) !important;
  color: white !important;
  font-weight: 500;
}

/* Poster Preview Indicator */
.poster-preview {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card body with flexbox to push button down */
.h-card-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Content wrapper that can grow */
.card-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Student Mini Attribution in Card */
.student-mini {
  display: flex;
  align-items: center;
}

.h-card-stats {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.65);
}

/* Button stays at bottom with margin-top: auto */
.card-action-button {
  margin-top: auto !important;
}

/* --- CTA --- */
.cta-section {
  background: linear-gradient(180deg, #ffffff, #f9fbfe);
}
.cta-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

/* --- Responsive --- */
@media (max-width: 1280px) {
  .kpi-number {
    font-size: 2rem;
  }
}

@media (max-width: 960px) {
  .stat-num {
    font-size: 1.1rem;
    color: white;
  }
  .h-card {
    min-width: 280px;
    width: 300px;
  }

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

  .student-attribution {
    flex-direction: column;
    text-align: center;
    padding: 12px;
  }
}

</style>
