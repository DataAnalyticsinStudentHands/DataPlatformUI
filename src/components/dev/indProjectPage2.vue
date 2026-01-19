<template>
  <div class="page">
    <!-- Two-column content -->
    <section class="content-grid">
      <div class="left">
        <!-- Hero -->
        <section class="profile card">
          <img
            class="avatar"
            src="@/assets/carlos_headshot.jpg"
            srcset="
              @/assets/carlos_headshot-320w.jpg 320w,
              @/assets/carlos_headshot-640w.jpg 640w
            "
            sizes="100px"
            alt="Student headshot"
          />
          <div class="profile-content">
            <h1>Carlos Mendieta</h1>
            <p class="role">2023 Pharis Fellow</p>
            <p class="testimonial">
              "This project pushed me to think more deeply about how data can
              drive meaningful decisions."
            </p>
          </div>
        </section>

        <article class="card project-card">
          <div class="experience-badge">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
            <span>Pharis Fellowship</span>
          </div>
          <h2>
            Tracing the Roots of Environmental Racism in Houston's Fifth Ward
          </h2>
          <p>
            Investigating how industrial sites have been disproportionately
            placed in less affluent areas, pushing low-income minorities closer
            to environmentally toxic areas and increasing cancer risk exposure.
          </p>
          <div class="research-areas">
            <p class="research-areas-label">Research Areas</p>
            <div class="tags">
              <span>Environmental Justice</span>
              <span>Cancer Cluster</span>
              <span>Housing Equity</span>
            </div>
          </div>
        </article>

        <article class="card conclusions">
          <div class="conclusions-header">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="conclusions-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h3>Conclusions</h3>
          </div>
          <div class="conclusion-text">
            <p>
              The project documents significant environmental disparities in
              Houston's Fifth Ward, including a 350% increase in childhood
              leukemia cases near industrial sites.
            </p>
            <p>
              Years of housing data and on-the-ground context reveal how
              industrial zoning decisions have clustered risk around low-income
              families, elevating cancer exposure and shaping community health.
            </p>
          </div>
        </article>
      </div>

      <div class="right">
        <!-- Poster card (main view) -->
        <article class="card poster-card" @click="openModal">
          <div class="poster-card-header">
            <h3>Project Poster</h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="expand-icon"
            >
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </div>
          <iframe
            :src="posterPdfUrl + '#page=1&zoom=page-fit&toolbar=0&navpanes=0'"
            class="poster-embed"
            frameborder="0"
            @click.stop
          ></iframe>
        </article>

        <!-- Zoom modal -->
        <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Project Poster</h3>
              <div class="modal-controls">
                <button
                  class="zoom-btn"
                  @click="zoomOut"
                  :disabled="zoomLevel <= 0.5"
                >
                  −
                </button>
                <span class="zoom-level"
                  >{{ Math.round(zoomLevel * 100) }}%</span
                >
                <button
                  class="zoom-btn"
                  @click="zoomIn"
                  :disabled="zoomLevel >= 3"
                >
                  +
                </button>
                <button class="close-btn" @click="closeModal">✕</button>
              </div>
            </div>
            <div class="modal-body">
              <div
                class="pdf-container"
                :style="{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                }"
              >
                <iframe
                  :src="posterPdfUrl + '#toolbar=0&navpanes=0'"
                  class="poster-pdf"
                  frameborder="0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <!-- Partners Section - copied from indProjectPage1.vue -->
        <article class="card partners-section">
          <div class="partners-header">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="partners-icon"
            >
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
            <div
              class="partner-card"
              v-for="partner in partners"
              :key="partner.acronym"
            >
              <div
                class="partner-icon"
                :style="{ backgroundColor: partner.color }"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path :d="partner.iconPath" />
                </svg>
              </div>
              <div class="partner-info">
                <div class="partner-acronym">{{ partner.acronym }}</div>
                <div class="partner-name">{{ partner.name }}</div>
              </div>
            </div>
          </div>
        </article>
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

// Partners data - copied from indProjectPage1.vue
const partners = ref([
  {
    acronym: "EPA",
    name: "Environmental Protection Agency",
    color: "#4CAF50",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    acronym: "UH Honors",
    name: "The Honors College, University of Houston",
    color: "#2196F3",
    iconPath:
      "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  },
  {
    acronym: "Humana",
    name: "Humana Institute",
    color: "#E91E63",
    iconPath:
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
  {
    acronym: "CHWI",
    name: "Community Health Workers Initiative",
    color: "#2196F3",
    iconPath:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    acronym: "HPE DSI",
    name: "Hewlett Packard Enterprise Data Science Institute",
    color: "#9C27B0",
    iconPath:
      "M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z",
  },
  {
    acronym: "ERC",
    name: "Education Research Center, UH College of Education",
    color: "#FF9800",
    iconPath:
      "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  },
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
  if (zoomLevel.value < 3)
    zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3);
};
const zoomOut = () => {
  if (zoomLevel.value > 0.5)
    zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5);
};
</script>

<style scoped>
:global(html, body, #app) {
  margin: 0;
  height: 100%;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  background: #f8f8f8;
  color: #1f1f1f;
}

.page {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 8px;
  flex: 1;
  min-height: 0;
  padding: 8px;
  overflow: hidden;
}

.left,
.right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden; /* Keep this */
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.profile {
  flex-direction: row;
  gap: 20px;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
}

.profile-content h1 {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
}

.role {
  margin: 0 0 8px 0;
  color: #555;
  font-size: 14px;
}

.testimonial {
  font-style: italic;
  color: #444;
  margin: 0;
  line-height: 1.4;
  font-size: 14px;
}

.project-card {
  flex: 0 0 auto;
}

.project-card h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  line-height: 1.3;
}

.project-card p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.experience-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.research-areas {
  margin-top: 12px;
}

.research-areas-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin: 0 0 4px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags span {
  background: #f1f1f1;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 13px;
}

.conclusions {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.conclusions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.conclusions-icon {
  color: #1976d2;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.conclusions h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.conclusion-text {
  flex: 1;
  color: #333;
  line-height: 1.5;
  font-size: 14px;
  overflow: hidden;
}

.conclusion-text p {
  margin: 0 0 8px 0;
}

.conclusion-text p:last-child {
  margin-bottom: 0;
}

/* Poster card with expand on click */
.poster-card {
  padding: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.poster-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.poster-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.poster-card-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.expand-icon {
  color: #1976d2;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.poster-card:hover .expand-icon {
  transform: scale(1.1);
}

.poster-embed {
  width: 100%;
  height: 120px;
  border: none;
  border-radius: 5px;
  background: #fafafa;
  pointer-events: none;
}

/* Buttons */
.zoom-btn,
.close-btn {
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

.zoom-btn:hover:not(:disabled),
.close-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
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
  background: #f8f8f8;
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
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.partners-section {
  flex: 1;
  min-height: 0;
}

.partners-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.partners-icon {
  color: #1976d2;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.partners-section h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.partners-description {
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  font-size: 13px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  overflow: hidden; /* Prevent scroll */
}

.partner-card {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.partner-icon {
  width: 32px;
  height: 32px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.partner-icon svg {
  width: 16px;
  height: 16px;
}

.partner-info {
  flex: 1;
  min-width: 0;
}

.partner-acronym {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
  color: #1f1f1f;
}

.partner-name {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}

.footer-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff6e0;
  border: 1px solid #f3d9a4;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  flex-shrink: 0;
  margin: 0 8px 8px 8px;
}

.footer-banner .icon {
  font-size: 16px;
  flex-shrink: 0;
}

.footer-banner p {
  margin: 0;
  line-height: 1.3;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    overflow: hidden;
  }
  .left,
  .right {
    overflow: hidden;
  }
}

@media (max-width: 768px) {
  .profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .partners-grid {
    grid-template-columns: 1fr;
  }
}
</style>
