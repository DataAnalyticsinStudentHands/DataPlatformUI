<template>
  <div class="page-wrapper">
    <div class="page">
      <!-- Hero Section -->
      <header class="hero">
        <div class="hero-content">
          <div class="hero-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>Research Project</span>
          </div>
          <h1>Tracing the Roots of Environmental Racism in Houston's Fifth Ward</h1>
          <p class="hero-description">
            Investigating how industrial sites have been disproportionately placed
            in less affluent areas, pushing low-income minorities closer to
            environmentally toxic areas and increasing cancer risk exposure.
          </p>
          
          <!-- Redesigned Author Section -->
          <div class="hero-author">
            <div class="author-avatar-wrapper">
              <img
                class="author-avatar"
                src="@/assets/carlos_headshot.jpg"
                srcset="
                  @/assets/carlos_headshot-320w.jpg 320w,
                  @/assets/carlos_headshot-640w.jpg 640w
                "
                sizes="96px"
                alt="Carlos Mendieta"
              />
              <div class="avatar-ring"></div>
            </div>
            <div class="author-info">
              <span class="author-name">Carlos Mendieta</span>
              <span class="author-role">2023 Pharis Fellow</span>
              <span class="author-affiliation">University of Houston Honors College</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Grid -->
      <main class="main-content">
        <!-- Testimonial -->
        <section class="testimonial-section">
          <blockquote>
            "This project pushed me to think more deeply about how data can drive meaningful decisions."
          </blockquote>
          <div class="research-tags">
            <span class="tag">Environmental Justice</span>
            <span class="tag">Cancer Cluster</span>
            <span class="tag">Housing Equity</span>
          </div>
        </section>

        <!-- Poster Preview -->
        <section class="poster-card">
          <div class="card-header">
            <h3>Research Poster</h3>
            <span class="card-subtitle">Click to view full size</span>
          </div>
          <div class="poster-preview" @click="openModal">
            <iframe
              :src="posterPdfUrl + '#page=1&zoom=page-fit&toolbar=0&navpanes=0'"
              class="poster-thumbnail"
              frameborder="0"
            ></iframe>
            <div class="poster-overlay">
              <div class="enlarge-prompt">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                <span>Expand</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Key Findings Section -->
        <section class="findings-section">
          <div class="section-header">
            <div class="section-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h3>Key Findings</h3>
            </div>
          </div>
          <div class="findings-grid">
            <div class="finding-card finding-critical">
              <div class="finding-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <div class="finding-stat">350%</div>
              <p>Higher childhood leukemia cases in Fifth Ward</p>
            </div>
            <div class="finding-card finding-data">
              <div class="finding-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div class="finding-stat">2005–2022</div>
              <p>Years of housing data analyzed</p>
            </div>
            <div class="finding-card finding-warning">
              <div class="finding-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 20h20L12 4 2 20z"/><path d="M12 14v-4M12 18h.01"/>
                </svg>
              </div>
              <div class="finding-stat">Multiple</div>
              <p>Industrial sites near residential areas</p>
            </div>
          </div>
          <div class="findings-conclusion">
            <p>
              The data visualized does provide support to my hypothesis that individuals in Houston that could only afford the cheapest housing accommodations were potentially moved into generally more environmentally toxic areas, posing as cancer and other fatal health risks.
            </p>
            <span class="attribution">— Carlos Mendieta</span>
          </div>
        </section>

        <!-- Partners Section -->
        <section class="partners-section">
          <div class="section-header">
            <div class="section-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3>Research Partners</h3>
            </div>
            <p class="section-description">
              This research was conducted in collaboration with organizations committed to environmental justice and community health.
            </p>
          </div>
          <div class="partners-grid">
            <div class="partner-card" v-for="partner in partners" :key="partner.acronym">
              <div class="partner-icon" :style="{ '--partner-color': partner.color }">
                <span>{{ partner.acronym.charAt(0) }}</span>
              </div>
              <div class="partner-info">
                <span class="partner-acronym">{{ partner.acronym }}</span>
                <span class="partner-name">{{ partner.name }}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="page-footer">
        <div class="footer-content">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <p>
            This project page is publicly viewable via a secure link. The student may revoke access at any time.
          </p>
        </div>
      </footer>
    </div>

    <!-- Poster Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal" @contextmenu.prevent>
        <div class="modal" @click.stop @contextmenu.prevent @selectstart.prevent>
          <div class="modal-header">
            <h3>Project Poster</h3>
            <div class="modal-controls">
              <button class="control-btn" @click="zoomOut" :disabled="zoomLevel <= 0.5" title="Zoom out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" /><path d="M8 11h6" />
                </svg>
              </button>
              <span class="zoom-display">{{ Math.round(zoomLevel * 100) }}%</span>
              <button class="control-btn" @click="zoomIn" :disabled="zoomLevel >= 3" title="Zoom in">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" /><path d="M11 8v6M8 11h6" />
                </svg>
              </button>
              <div class="control-divider"></div>
              <button class="control-btn close" @click="closeModal" title="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="modal-body" ref="modalBody">
            <div class="pdf-wrapper" :style="{ transform: `scale(${zoomLevel})` }">
              <iframe
                :src="posterPdfUrl + '#toolbar=0&navpanes=0'"
                class="poster-pdf"
                frameborder="0"
                ref="pdfIframe"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import posterPdf from "@/assets/carlos_URD_poster.pdf";

const posterPdfUrl = ref(posterPdf);
const isModalOpen = ref(false);
const zoomLevel = ref(1);
const modalBody = ref(null);
const pdfIframe = ref(null);

const openModal = () => {
  isModalOpen.value = true;
  zoomLevel.value = 1;
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleKeydown);
};

const closeModal = () => {
  isModalOpen.value = false;
  zoomLevel.value = 1;
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleKeydown);
};

const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && ["s", "S", "p", "P"].includes(e.key)) {
    e.preventDefault();
    return false;
  }
  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
    e.preventDefault();
    return false;
  }
  if (e.key === "Escape") closeModal();
};

const zoomIn = () => { if (zoomLevel.value < 3) zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3); };
const zoomOut = () => { if (zoomLevel.value > 0.5) zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5); };

const partners = ref([
  { acronym: "EPA", name: "Environmental Protection Agency", color: "#059669" },
  { acronym: "UH Honors", name: "The Honors College, University of Houston", color: "#c8102e" },
  { acronym: "Humana", name: "Humana Institute", color: "#00b5ad" },
  { acronym: "CHWI", name: "Community Health Workers Initiative", color: "#2563eb" },
  { acronym: "HPE DSI", name: "Hewlett Packard Enterprise Data Science Institute", color: "#7c3aed" },
  { acronym: "ERC", name: "Education Research Center, UH College of Education", color: "#ea580c" },
]);

onUnmounted(() => { document.removeEventListener("keydown", handleKeydown); });
</script>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f4f5f7;
  color: #1a1a2e;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.page-wrapper {
  min-height: 100vh;
}

.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px;
  padding: 56px 48px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, rgba(200, 16, 46, 0.08) 0%, rgba(200, 16, 46, 0.04) 100%);
  border-radius: 0 24px 24px 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f87171;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.hero h1 {
  color: white;
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 20px 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
  max-width: 800px;
}

.hero-description {
  color: rgba(255, 255, 255, 0.75);
  font-size: 18px;
  line-height: 1.7;
  margin: 0 0 36px 0;
  max-width: 700px;
}

/* Redesigned Author Section */
.hero-author {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.author-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.author-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(200, 16, 46, 0.3);
  position: relative;
  z-index: 2;
}

.avatar-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(200, 16, 46, 0.4);
  animation: pulse-ring 3s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.4; 
  }
  50% { 
    transform: scale(1.05); 
    opacity: 0.2; 
  }
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  color: white;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.author-role {
  color: #f87171;
  font-size: 16px;
  font-weight: 500;
}

.author-affiliation {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin-top: 2px;
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Testimonial Section */
.testimonial-section {
  background: white;
  border-radius: 20px;
  padding: 32px 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
}

.testimonial-section blockquote {
  font-size: 18px;
  font-style: italic;
  color: #4a5568;
  margin: 0 0 20px 0;
  padding-left: 20px;
  border-left: 3px solid #c8102e;
  line-height: 1.7;
}

.research-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #fef2f2;
  color: #b91c1c;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* Cards */
.poster-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
}

.card-header {
  padding: 24px 28px 20px;
  border-bottom: 1px solid #f0f0f5;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1a1a2e;
}

.card-subtitle {
  font-size: 13px;
  color: #718096;
  margin-top: 4px;
  display: block;
}

/* Poster Preview */
.poster-preview {
  position: relative;
  height: 320px;
  cursor: pointer;
  overflow: hidden;
}

.poster-thumbnail {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
  background: #fafafa;
}

.poster-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 46, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.poster-preview:hover .poster-overlay {
  background: rgba(26, 26, 46, 0.7);
}

.enlarge-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: white;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
}

.poster-preview:hover .enlarge-prompt {
  opacity: 1;
  transform: translateY(0);
}

.enlarge-prompt span {
  font-size: 14px;
  font-weight: 500;
}

/* Key Findings Section */
.findings-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  margin-bottom: 28px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  color: #c8102e;
}

.section-title h3 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #1a1a2e;
}

.section-description {
  color: #718096;
  font-size: 15px;
  margin: 0;
}

.findings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.finding-card {
  padding: 28px 24px;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.finding-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.finding-card .finding-icon { 
  margin-bottom: 12px;
}

.finding-card .finding-stat { 
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 10px;
}

.finding-card p {
  font-size: 14px;
  color: #4a5568;
  margin: 0;
  line-height: 1.5;
}

/* Card variants */
.finding-card.finding-critical {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
}
.finding-card.finding-critical .finding-icon { color: #dc2626; }
.finding-card.finding-critical .finding-stat { color: #b91c1c; }

.finding-card.finding-data {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
}
.finding-card.finding-data .finding-icon { color: #16a34a; }
.finding-card.finding-data .finding-stat { color: #15803d; }

.finding-card.finding-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
}
.finding-card.finding-warning .finding-icon { color: #d97706; }
.finding-card.finding-warning .finding-stat { color: #b45309; }

.findings-conclusion {
  background: #fef2f2;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #c8102e;
}

.findings-conclusion p {
  font-size: 15px;
  color: #4a5568;
  margin: 0 0 12px 0;
  line-height: 1.7;
}

.findings-conclusion .attribution {
  font-size: 14px;
  color: #c8102e;
  font-weight: 600;
}

/* Partners Section */
.partners-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.partner-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e8e8ee;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.partner-card:hover {
  border-color: #d0d0dd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.partner-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--partner-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.partner-icon span {
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.partner-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.partner-acronym {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a2e;
}

.partner-name {
  font-size: 12px;
  color: #718096;
  line-height: 1.4;
}

/* Footer */
.page-footer {
  margin-top: 32px;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 18px 24px;
  color: #991b1b;
  font-size: 14px;
}

.footer-content svg {
  flex-shrink: 0;
}

.footer-content p {
  margin: 0;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  width: 92%;
  max-width: 1200px;
  max-height: 92vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8ee;
  background: #fafafa;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.15s ease;
}

.control-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #ccc;
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-btn.close:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

.zoom-display {
  min-width: 48px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
}

.control-divider {
  width: 1px;
  height: 24px;
  background: #e0e0e0;
  margin: 0 4px;
}

.modal-body {
  flex: 1;
  overflow: auto;
  background: #2a2a3a;
  display: flex;
  justify-content: center;
  padding: 32px;
}

.pdf-wrapper {
  transition: transform 0.2s ease;
  transform-origin: top center;
}

.poster-pdf {
  width: 1000px;
  min-height: 700px;
  border: none;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Responsive */
@media (max-width: 900px) {
  .findings-grid {
    grid-template-columns: 1fr;
  }
  
  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page { padding: 20px 16px 40px; }
  
  .hero { padding: 32px 24px; }
  
  .hero h1 { font-size: 28px; }
  
  .hero-description { font-size: 16px; }
  
  .hero-author {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .author-avatar {
    width: 80px;
    height: 80px;
  }
  
  .author-info {
    align-items: center;
  }
  
  .testimonial-section { padding: 24px 20px; }
  
  .findings-section { padding: 28px 20px; }
  
  .partners-section { padding: 28px 20px; }
  
  .partners-grid { grid-template-columns: 1fr; }
  
  .modal { width: 100%; max-height: 100vh; border-radius: 0; }
}
</style>