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
            <span>Pharis Fellowship</span>
          </div>
          <h1>Tracing the Roots of Environmental Racism in Houston's Fifth Ward</h1>
          <p class="hero-description">
            Investigating how industrial sites have been disproportionately placed
            in less affluent areas, pushing low-income minorities closer to
            environmentally toxic areas and increasing cancer risk exposure.
          </p>
        </div>
        <div class="hero-author">
          <img
            class="author-avatar"
            src="@/assets/carlos_headshot.jpg"
            srcset="
              @/assets/carlos_headshot-320w.jpg 320w,
              @/assets/carlos_headshot-640w.jpg 640w
            "
            sizes="100px"
            alt="Student headshot"
          />
          <div class="author-details">
            <div class="author-info">
              <span class="author-name">Carlos Mendieta</span>
              <span class="author-role">2023 Pharis Fellow</span>
            </div>
            <blockquote class="author-quote">
              "This project pushed me to think more deeply about how data can
              drive meaningful decisions."
            </blockquote>
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
            <span>Environmental Justice</span>
            <span>Cancer Cluster</span>
            <span>Housing Equity</span>
          </div>
        </article>

        <!-- Key Findings -->
        <article class="card findings-card">
          <div class="card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Key Findings</h3>
          </div>
          <div class="findings-grid">
            <div class="finding finding-critical">
              <div class="finding-stat">350%</div>
              <p>Higher childhood leukemia cases in Fifth Ward</p>
            </div>
            <div class="finding finding-data">
              <div class="finding-stat">2005–2022</div>
              <p>Years of housing data analyzed</p>
            </div>
            <div class="finding finding-warning">
              <div class="finding-stat">Multiple</div>
              <p>Industrial sites near residential areas</p>
            </div>
          </div>
          <div class="conclusion-text">
            <p>
              The data visualized does provide support to my hypothesis that individuals in Houston that could only afford the cheapest housing accommodations were potentially moved into generally more environmentally toxic areas, posing as cancer and other fatal health risks.
            </p>
            <span class="attribution">— Carlos Mendieta</span>
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
            This research was conducted in collaboration with multiple
            organizations committed to environmental justice and community
            health.
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
        <!-- Poster card (full height) -->
        <article class="card poster-card" @click="openModal">
          <div class="poster-card-header">
            <h3>Research Poster</h3>
            <div class="expand-hint">
              <span>Click to enlarge</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="expand-icon">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </div>
          <div class="poster-embed-wrapper">
            <iframe
              :src="posterPdfUrl + '#page=1&zoom=page-fit&toolbar=0&navpanes=0'"
              class="poster-embed"
              frameborder="0"
              @click.stop
            ></iframe>
          </div>
        </article>

        <!-- Zoom modal -->
        <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Project Poster</h3>
              <div class="modal-controls">
                <button class="zoom-btn" @click="zoomOut" :disabled="zoomLevel <= 0.5">−</button>
                <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
                <button class="zoom-btn" @click="zoomIn" :disabled="zoomLevel >= 3">+</button>
                <button class="close-btn" @click="closeModal">✕</button>
              </div>
            </div>
            <div class="modal-body">
              <div class="pdf-container" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }">
                <iframe :src="posterPdfUrl + '#toolbar=0&navpanes=0'" class="poster-pdf" frameborder="0"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="footer-banner">
      <div class="icon">ℹ️</div>
      <p>
        This project page is publicly viewable via a secure link. The student
        may revoke access at any time.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import posterPdf from "@/assets/carlos_URD_poster.pdf";

const posterPdfUrl = ref(posterPdf);
const isModalOpen = ref(false);
const zoomLevel = ref(1);

const partners = ref([
  { acronym: "EPA", name: "Environmental Protection Agency", color: "#059669" },
  { acronym: "UH Honors", name: "The Honors College, University of Houston", color: "#c8102e" },
  { acronym: "Humana", name: "Humana Institute", color: "#00b5ad" },
  { acronym: "CHWI", name: "Community Health Workers Initiative", color: "#2563eb" },
  { acronym: "HPE DSI", name: "Hewlett Packard Enterprise Data Science Institute", color: "#7c3aed" },
  { acronym: "ERC", name: "Education Research Center, UH College of Education", color: "#ea580c" },
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
  padding: 28px 32px 24px;
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
  align-items: stretch;
  gap: 32px;
  position: relative;
  z-index: 1;
}

.hero-left {
  flex: 1;
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
  margin-bottom: 12px;
}

.hero h1 {
  color: white;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 10px 0;
  letter-spacing: -0.3px;
  line-height: 1.25;
}

.hero-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.hero-author {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px 24px;
  min-width: 340px;
}

.author-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
}

.author-quote {
  font-size: 13px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
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
  gap: 12px;
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

.left::-webkit-scrollbar-thumb:hover {
  background: #b0b0bb;
}

.right {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1a1a2e;
}

.card-header svg {
  color: #6366f1;
  flex-shrink: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* Tags Card */
.tags-card {
  padding: 12px 16px;
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
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.tags span:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
  background: #e0e1ff;
}

/* Findings Card */
.findings-card {
  flex: 0 0 auto;
}

.findings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.finding {
  padding: 14px 10px;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.finding:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
  filter: brightness(1.05);
}

.finding-critical {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
}

.finding-critical .finding-stat { color: #b91c1c; }

.finding-data {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
}

.finding-data .finding-stat { color: #1d4ed8; }

.finding-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
}

.finding-warning .finding-stat { color: #b45309; }

.finding-stat {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
}

.finding p {
  font-size: 11px;
  color: #4a5568;
  margin: 0;
  line-height: 1.4;
}

/* Conclusion text inside findings */
.conclusion-text {
  color: #4a5568;
  line-height: 1.5;
  font-size: 13px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px;
  border-left: 3px solid #6366f1;
}

.conclusion-text p {
  margin: 0 0 10px 0;
}

.conclusion-text .attribution {
  font-size: 13px;
  color: #6366f1;
  font-weight: 600;
}

/* Poster card - full height */
.poster-card {
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  flex: 1;
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
  margin-bottom: 12px;
  flex-shrink: 0;
}

.poster-card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.expand-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6366f1;
  font-size: 12px;
  font-weight: 500;
}

.expand-icon {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.poster-card:hover .expand-icon {
  transform: scale(1.1);
}

.poster-embed-wrapper {
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  position: relative;
}

.poster-embed {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
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
  max-width: 1200px;
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
  display: flex;
  justify-content: flex-start;
  padding: 16px;
  background: #2a2a3a;
}

.pdf-container {
  width: 100%;
  transition: transform 0.2s ease;
}

.poster-pdf {
  width: 100%;
  min-height: 900px;
  border: none;
  background: white;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

/* Partners Section */
.partners-section {
  flex-shrink: 0;
}

.partners-description {
  color: #718096;
  margin: 0 0 12px 0;
  line-height: 1.4;
  font-size: 12px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
}

.partner-card:hover .partner-icon {
  transform: scale(1.15) rotate(5deg);
}

.partner-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.partner-icon span {
  color: white;
  font-size: 14px;
  font-weight: 700;
}

.partner-info {
  flex: 1;
  min-width: 0;
}

.partner-acronym {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 1px;
  color: #1a1a2e;
}

.partner-name {
  font-size: 10px;
  color: #718096;
  line-height: 1.3;
}

/* Footer */
.footer-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 12px;
  color: #92400e;
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
    gap: 20px;
  }
  
  .hero-author {
    min-width: 0;
    width: 100%;
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
    min-height: 400px;
  }
  
  .findings-grid {
    grid-template-columns: repeat(3, 1fr);
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
    padding: 20px 24px;
  }
  
  .hero h1 {
    font-size: 22px;
  }
  
  .hero-author {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .author-details {
    align-items: center;
  }
  
  .author-info {
    align-items: center;
  }
  
  .findings-grid {
    grid-template-columns: 1fr;
  }
  
  .partners-grid {
    grid-template-columns: 1fr;
  }
  
  .poster-card {
    min-height: 300px;
  }
}
</style>