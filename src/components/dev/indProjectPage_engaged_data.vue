<template>
  <div class="page">
    <!-- Hero Header -->
    <header class="hero">
      <div class="hero-content">
        <div class="hero-left">
          <div class="hero-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>Engaged Data Science</span>
          </div>
          <h1>Building a Data Platform for Goal-Driven Experiences</h1>
          <p class="hero-description">
            Developing a comprehensive web application that captures and connects 
            student goals to their experiential learning journeys, enabling progress 
            tracking, reflections, and actionable insights for instructors and program leaders.
          </p>
        </div>
        <div class="hero-authors">
          <div class="author-card">
            <img
              class="author-avatar"
              src="@/assets/philip_headshot.jpg"
              alt="Philip headshot"
            />
            <div class="author-details">
              <div class="author-info">
                <span class="author-name">Philip</span>
                <span class="author-role">Lead Developer</span>
              </div>
              <blockquote class="author-quote">
                "Building this platform taught me that great software comes from 
                asking better questions—understanding what users actually need."
              </blockquote>
            </div>
          </div>
          <div class="author-card">
            <img
              class="author-avatar"
              src="@/assets/navya_headshot.jpg"
              alt="Navya headshot"
            />
            <div class="author-details">
              <div class="author-info">
                <span class="author-name">Navya</span>
                <span class="author-role">Application Developer</span>
              </div>
              <blockquote class="author-quote">
                "This was my first exposure to professional software development, 
                learning to build with scalability and maintainability in mind."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Two-column content -->
    <section class="content-grid">
      <div class="left">
        <!-- Tags -->
        <article class="card tags-card">
          <div class="tags">
            <span>Educational Technology</span>
            <span>Experiential Learning</span>
            <span>Full-Stack Development</span>
            <span>FERPA-Compliant</span>
          </div>
        </article>

        <!-- Key Achievements -->
        <article class="card findings-card">
          <div class="card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Key Achievements</h3>
          </div>
          <div class="findings-grid">
            <div class="finding finding-critical">
              <div class="finding-stat">7+</div>
              <p>Major releases delivered across the platform</p>
            </div>
            <div class="finding finding-data">
              <div class="finding-stat">RBAC</div>
              <p>Role-based access control with FERPA compliance</p>
            </div>
            <div class="finding finding-warning">
              <div class="finding-stat">Cloud</div>
              <p>Migrated to scalable Reclaim Cloud infrastructure</p>
            </div>
          </div>
          <div class="conclusion-text">
            <p>
              The platform connects goals to experiences to outcomes through a carefully designed data model. What used to require manual tracking across spreadsheets now flows automatically, giving instructors and program leaders a foundation for improving their experiences.
            </p>
            <span class="attribution">— Philip, Lead Developer</span>
          </div>
        </article>

        <!-- Timeline / Milestones -->
        <article class="card timeline-card">
          <div class="card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h3>Development Timeline</h3>
          </div>
          <div class="timeline">
            <div class="timeline-item" v-for="(milestone, index) in milestones" :key="index">
              <div class="timeline-marker" :style="{ backgroundColor: milestone.color }"></div>
              <div class="timeline-content">
                <div class="timeline-title">{{ milestone.title }}</div>
                <div class="timeline-desc">{{ milestone.description }}</div>
              </div>
            </div>
          </div>
        </article>

        <!-- Partners Section -->
        <article class="card partners-section">
          <div class="card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3>Partners</h3>
          </div>
          <p class="partners-description">
            This platform was developed in collaboration with the Honors College and 
            the HPE Data Science Institute, supporting the Data & Society program's mission.
          </p>
          <div class="partners-grid">
            <div class="partner-card" v-for="partner in partners" :key="partner.acronym">
              <div class="partner-icon" :style="{ backgroundColor: partner.color }">
                <span>{{ partner.acronym.charAt(0) }}</span>
              </div>
              <div class="partner-info">
                <div class="partner-acronym">{{ partner.acronym }}</div>
                <div class="partner-name">{{ partner.name }}</div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="right">
        <!-- Poster card -->
        <article class="card poster-card" @click="openModal">
          <div class="poster-card-header">
            <h3>System Architecture</h3>
            <div class="expand-hint">
              <span>Click to enlarge</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="expand-icon">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </div>
          <div class="poster-embed-wrapper">
            <img 
              :src="posterImageUrl" 
              class="poster-image"
              alt="System Architecture Diagram"
            />
          </div>
        </article>

        <!-- Impact Summary Card -->
        <article class="card impact-card">
          <div class="card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <h3>Platform Impact</h3>
          </div>
          <div class="impact-grid">
            <div class="impact-item">
              <div class="impact-icon">👨‍🎓</div>
              <div class="impact-label">For Students</div>
              <div class="impact-text">Guided, auto-saving forms that reduce frustration</div>
            </div>
            <div class="impact-item">
              <div class="impact-icon">👩‍🏫</div>
              <div class="impact-label">For Instructors</div>
              <div class="impact-text">Real-time progress monitoring & flexible exports</div>
            </div>
            <div class="impact-item">
              <div class="impact-icon">🔬</div>
              <div class="impact-label">For Researchers</div>
              <div class="impact-text">Clean, structured data with full provenance</div>
            </div>
            <div class="impact-item">
              <div class="impact-icon">🎯</div>
              <div class="impact-label">For Programs</div>
              <div class="impact-text">Foundation for understanding effective learning</div>
            </div>
          </div>
        </article>

        <!-- Zoom modal -->
        <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>System Architecture</h3>
              <div class="modal-controls">
                <button class="zoom-btn" @click="zoomOut" :disabled="zoomLevel <= 0.5">−</button>
                <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
                <button class="zoom-btn" @click="zoomIn" :disabled="zoomLevel >= 3">+</button>
                <button class="close-btn" @click="closeModal">✕</button>
              </div>
            </div>
            <div class="modal-body">
              <div class="image-container" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }">
                <img :src="posterImageUrl" class="poster-full" alt="System Architecture Diagram" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="footer-banner">
      <div class="icon">ℹ️</div>
      <p>
        This project page is publicly viewable via a secure link. Team members 
        may revoke access at any time.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

import posterImage from "@/assets/sample_architecture.png";
const posterImageUrl = ref(posterImage);
const isModalOpen = ref(false);
const zoomLevel = ref(1);

const milestones = ref([
  { 
    title: "JWT Authentication", 
    description: "Protected all endpoints with token-based auth",
    color: "#059669"
  },
  { 
    title: "Student Forms UI Overhaul", 
    description: "Stepped workflows with auto-save and validation",
    color: "#2563eb"
  },
  { 
    title: "Instructor Tools Suite", 
    description: "Filtering, progress monitor, and export tools",
    color: "#7c3aed"
  },
  { 
    title: "Cloud Migration", 
    description: "Moved to Reclaim Cloud for scalability",
    color: "#ea580c"
  },
  { 
    title: "Security 2.0 & RBAC", 
    description: "FERPA-aligned role-based access control",
    color: "#dc2626"
  },
  { 
    title: "Projects Module", 
    description: "Document management with Clowder integration",
    color: "#0891b2"
  },
]);

const partners = ref([
  { acronym: "UH Honors", name: "The Honors College, University of Houston", color: "#2196F3" },
  { acronym: "HPE DSI", name: "Hewlett Packard Enterprise Data Science Institute", color: "#9C27B0" },
  { acronym: "Data & Society", name: "Data & Society Research Program, UH", color: "#009688" },
  { acronym: "ERC", name: "Education Research Center, UH College of Education", color: "#FF9800" },
]);

const openModal = () => {
  isModalOpen.value = true;
  zoomLevel.value = 1;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  zoomLevel.value = 1;
  document.body.style.overflow = "";
};

const zoomIn = () => {
  if (zoomLevel.value < 3) zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3);
};

const zoomOut = () => {
  if (zoomLevel.value > 0.5) zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5);
};
</script>

<style scoped>
:global(html, body, #app) {
  margin: 0;
  height: 100%;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  background: #f4f5f7;
  color: #1a1a2e;
}

.page {
  height: 100%;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 32px;
}

/* Hero Header */
.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 28px 32px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 8px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 55%;
  height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%);
}

.hero-content {
  display: flex;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.hero-left {
  flex: 1;
  min-width: 0;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #a5b4fc;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.hero h1 {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  letter-spacing: -0.3px;
  line-height: 1.25;
}

.hero-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.hero-authors {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;
  min-width: 420px;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 18px 22px;
}

.author-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.author-role {
  color: #a5b4fc;
  font-size: 13px;
  font-weight: 500;
}

.author-quote {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.45;
  padding: 0;
  border: none;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 8px;
}

.left::-webkit-scrollbar {
  width: 6px;
}

.left::-webkit-scrollbar-track {
  background: transparent;
}

.left::-webkit-scrollbar-thumb {
  background: #d0d0dd;
  border-radius: 3px;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #1a1a2e;
}

.card-header svg {
  color: #6366f1;
  flex-shrink: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

/* Tags Card */
.tags-card {
  padding: 10px 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags span {
  background: #f0f1ff;
  color: #4338ca;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.tags span:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.25);
  background: #e0e1ff;
}

/* Findings Card */
.findings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.finding {
  padding: 12px 8px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.finding:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.finding-critical {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
}
.finding-critical .finding-stat { color: #16a34a; }

.finding-data {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
}
.finding-data .finding-stat { color: #1d4ed8; }

.finding-warning {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border: 1px solid #e9d5ff;
}
.finding-warning .finding-stat { color: #7c3aed; }

.finding-stat {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.finding p {
  font-size: 10px;
  color: #4a5568;
  margin: 0;
  line-height: 1.3;
}

.conclusion-text {
  color: #4a5568;
  line-height: 1.45;
  font-size: 12px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #6366f1;
}

.conclusion-text p {
  margin: 0 0 8px 0;
}

.conclusion-text .attribution {
  font-size: 12px;
  color: #6366f1;
  font-weight: 600;
}

/* Timeline Card */
.timeline-card {
  flex-shrink: 0;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: #fafafa;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.timeline-item:hover {
  background: #f0f0ff;
  transform: translateX(4px);
}

.timeline-marker {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 3px;
}

.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-title {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 2px;
}

.timeline-desc {
  font-size: 11px;
  color: #718096;
  line-height: 1.3;
}

/* Poster Card */
.poster-card {
  padding: 14px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.poster-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.poster-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.poster-card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.expand-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6366f1;
  font-size: 11px;
  font-weight: 500;
}

.expand-icon {
  transition: transform 0.2s ease;
}

.poster-card:hover .expand-icon {
  transform: scale(1.1);
}

.poster-embed-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1336 / 759;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Impact Card */
.impact-card {
  flex-shrink: 0;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.impact-item {
  background: #fafafa;
  border: 1px solid #e8e8ee;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: all 0.2s ease;
}

.impact-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: #c7d2fe;
}

.impact-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.impact-label {
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 2px;
}

.impact-text {
  font-size: 10px;
  color: #4a5568;
  line-height: 1.3;
}

/* Partners Section */
.partners-section {
  flex-shrink: 0;
}

.partners-description {
  color: #718096;
  margin: 0 0 10px 0;
  line-height: 1.4;
  font-size: 11px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.partner-card {
  background: #fafafa;
  border: 1px solid #e8e8ee;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.partner-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
}

.partner-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.partner-card:hover .partner-icon {
  transform: scale(1.1) rotate(5deg);
}

.partner-icon span {
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.partner-info {
  flex: 1;
  min-width: 0;
}

.partner-acronym {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 1px;
  color: #1a1a2e;
}

.partner-name {
  font-size: 9px;
  color: #718096;
  line-height: 1.3;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.modal-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn, .close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  min-width: 28px;
}

.zoom-btn:hover:not(:disabled), .close-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-level {
  min-width: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #555;
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: #2a2a3a;
}

.image-container {
  transition: transform 0.2s ease;
}

.poster-full {
  width: 100%;
  max-width: 100%;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

/* Footer */
.footer-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 10px;
  color: #1e40af;
}

.footer-banner .icon {
  font-size: 14px;
  flex-shrink: 0;
}

.footer-banner p {
  margin: 0;
  line-height: 1.3;
}

/* Responsive */
@media (max-width: 1024px) {
  .page {
    padding: 12px 20px;
  }
  
  .hero-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .hero-authors {
    min-width: 0;
    width: 100%;
    flex-direction: row;
  }
  
  .author-card {
    flex: 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    overflow: auto;
  }
  
  .left {
    overflow: visible;
    padding-right: 0;
  }
  
  .poster-card {
    min-height: 300px;
  }
  
  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page {
    padding: 8px 12px;
  }
  
  .hero {
    padding: 18px 20px;
  }
  
  .hero h1 {
    font-size: 20px;
  }
  
  .hero-authors {
    flex-direction: column;
  }
  
  .findings-grid {
    grid-template-columns: 1fr;
  }
  
  .impact-grid {
    grid-template-columns: 1fr;
  }
  
  .partners-grid {
    grid-template-columns: 1fr;
  }
  
  .poster-card {
    min-height: 250px;
  }
}
</style>