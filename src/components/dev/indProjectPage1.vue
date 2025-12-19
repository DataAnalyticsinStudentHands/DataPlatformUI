<template>
  <div class="page">
    <section class="profile">
      <img
        class="avatar"
        src="@/assets/carlos_headshot.jpg"
        srcset="
          @/assets/carlos_headshot-320w.jpg 320w,
          @/assets/carlos_headshot-640w.jpg 640w
        "
        sizes="160px"
        alt="Student headshot"
      />
      <div class="profile-content">
        <h1>Carlos Mendieta</h1>
        <p class="role">2023 Pharis Fellow</p>
        <p class="testimonial">
          "This project pushed me to think more deeply about how data can drive
          meaningful decisions."
        </p>
      </div>
    </section>

    <section class="project-card">
      <div class="experience-badge">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span>Pharis Fellowship</span>
      </div>
      <h2>Tracing the Roots of Environmental Racism in Houston's Fifth Ward</h2>
      <p>
        Investigating how industrial sites have been disproportionately placed
        in less affluent areas, pushing low-income minorities closer to
        environmentally toxic areas and increasing cancer risk exposure.
      </p>
      <div class="research-areas">
        <p class="research-areas-label">Research Areas</p>
        <div class="tags">
          <span>Environmental Justice</span>
          <span>Cancer Cluster</span>
          <span>Housing Equity</span>
        </div>
      </div>
    </section>

    <!-- Poster Preview Card -->
    <section class="poster-section">
      <div class="poster-preview" @click="openModal">
        <iframe
          :src="posterPdfUrl + '#page=1&zoom=page-fit&toolbar=0&navpanes=0'"
          class="poster-thumbnail"
          frameborder="0"
        ></iframe>
        <div class="poster-overlay">
          <div class="enlarge-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            <span>Click to Enlarge</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Poster Modal -->
    <div
      v-if="isModalOpen"
      class="modal-overlay"
      @click="closeModal"
      @contextmenu.prevent
      @selectstart.prevent
    >
      <div
        class="modal-content"
        @click.stop
        @contextmenu.prevent
        @selectstart.prevent
      >
        <div class="modal-header">
          <h3>Project Poster</h3>
          <div class="modal-controls">
            <button
              class="zoom-btn"
              @click="zoomOut"
              :disabled="zoomLevel <= 0.5"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </button>
            <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
            <button class="zoom-btn" @click="zoomIn" :disabled="zoomLevel >= 3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </button>
            <button class="close-btn" @click="closeModal">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div
          class="modal-body"
          ref="modalBody"
          @contextmenu.prevent
          @selectstart.prevent
        >
          <div
            class="pdf-container"
            :style="{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
            }"
            @contextmenu.prevent
          >
            <iframe
              :src="posterPdfUrl + '#toolbar=0&navpanes=0'"
              class="poster-pdf"
              frameborder="0"
              ref="pdfIframe"
              @contextmenu.prevent
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Partners Section -->
    <section class="partners-section">
      <div class="partners-header">
        <svg
          width="24"
          height="24"
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
        This research was conducted in collaboration with multiple organizations
        committed to environmental justice and community health.
      </p>
      <div class="partners-grid">
        <div
          class="partner-card"
          v-for="partner in partners"
          :key="partner.acronym"
        >
          <div class="partner-icon" :style="{ backgroundColor: partner.color }">
            <component :is="partner.icon" />
          </div>
          <div class="partner-info">
            <div class="partner-acronym">{{ partner.acronym }}</div>
            <div class="partner-name">{{ partner.name }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Conclusions Section -->
    <section class="conclusions">
      <div class="conclusions-header">
        <svg
          width="24"
          height="24"
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
      <div class="conclusions-content">
        <div class="conclusion-text">
          <p>
            From Carlos Mendieta: the project documents significant
            environmental disparities in Houston's Fifth Ward, including a 350%
            increase in childhood leukemia cases near industrial sites.
          </p>
          <p>
            Years of housing data and on-the-ground context reveal how
            industrial zoning decisions have clustered risk around low-income
            families, elevating cancer exposure and shaping community health.
          </p>
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
import { ref, onMounted, onUnmounted } from "vue";
import posterPdf from "@/assets/carlos_URD_poster.pdf";

// PDF poster path
const posterPdfUrl = ref(posterPdf);

const isModalOpen = ref(false);
const zoomLevel = ref(1);
const modalBody = ref(null);
const pdfIframe = ref(null);

const openModal = () => {
  isModalOpen.value = true;
  zoomLevel.value = 1;
  document.body.style.overflow = "hidden";
  // Prevent common download shortcuts
  document.addEventListener("keydown", preventDownload);
};

const closeModal = () => {
  isModalOpen.value = false;
  zoomLevel.value = 1;
  document.body.style.overflow = "";
  document.removeEventListener("keydown", preventDownload);
};

const preventDownload = (e) => {
  // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+S, F12, etc.
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "s" || e.key === "S" || e.key === "p" || e.key === "P")
  ) {
    e.preventDefault();
    return false;
  }
  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
    e.preventDefault();
    return false;
  }
};

const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5);
  }
};

// Partners data
const partners = ref([
  {
    acronym: "EPA",
    name: "Environmental Protection Agency",
    color: "#4CAF50",
    icon: "svg",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    acronym: "UH Honors",
    name: "The Honors College, University of Houston",
    color: "#2196F3",
    icon: "svg",
    iconPath:
      "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  },
  {
    acronym: "Humana",
    name: "Humana Institute",
    color: "#E91E63",
    icon: "svg",
    iconPath:
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
  {
    acronym: "CHWI",
    name: "Community Health Workers Initiative",
    color: "#2196F3",
    icon: "svg",
    iconPath:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    acronym: "HPE DSI",
    name: "Hewlett Packard Enterprise Data Science Institute",
    color: "#9C27B0",
    icon: "svg",
    iconPath:
      "M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z",
  },
  {
    acronym: "ERC",
    name: "Education Research Center, UH College of Education",
    color: "#FF9800",
    icon: "svg",
    iconPath:
      "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  },
]);
</script>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  background: #f8f8f8;
  color: #1f1f1f;
}

.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.profile {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 48px;
}

.avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.profile-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
}

.role {
  margin: 0 0 16px 0;
  color: #555;
  font-size: 16px;
}

.testimonial {
  font-style: italic;
  color: #444;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
}

.project-card {
  background: #fff;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
  position: relative;
}

.experience-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
}

.experience-badge svg {
  width: 14px;
  height: 14px;
}

.project-card h2 {
  margin-top: 0;
  font-size: 28px;
}

.research-areas {
  margin-top: 20px;
}

.research-areas-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 10px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tags span {
  background: #f1f1f1;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 14px;
}

/* Poster Preview Section */
.poster-section {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.poster-preview {
  width: 1000px;
  max-width: 100%;
  height: 325px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: #fff;
}

.poster-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.poster-thumbnail {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  pointer-events: none;
}

.poster-preview:hover .poster-overlay {
  background: rgba(0, 0, 0, 0.4);
}

.enlarge-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: white;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.poster-preview:hover .enlarge-icon {
  opacity: 1;
  transform: scale(1);
}

.enlarge-icon svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.enlarge-icon span {
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Conclusions Section */
.conclusions {
  margin-bottom: 48px;
}

.conclusions-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.conclusions-icon {
  color: #1976d2;
  width: 24px;
  height: 24px;
}

.conclusions h3 {
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.conclusions-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.conclusion-text {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #333;
  line-height: 1.6;
}

.conclusion-text p {
  margin: 0 0 12px 0;
}

.conclusion-text p:last-child {
  margin-bottom: 0;
}

/* Partners Section */
.partners-section {
  margin-bottom: 48px;
}

.partners-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.partners-icon {
  color: #1976d2;
  width: 24px;
  height: 24px;
}

.partners-section h3 {
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.partners-description {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.partner-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: box-shadow 0.2s ease;
}

.partner-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.partner-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.partner-icon svg {
  width: 24px;
  height: 24px;
}

.partner-info {
  flex: 1;
}

.partner-acronym {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
  color: #1f1f1f;
}

.partner-name {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 90%;
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
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.modal-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.zoom-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.zoom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
  margin-left: 8px;
}

.close-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.modal-body {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  background: #f8f8f8;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
}

.pdf-container {
  transition: transform 0.2s ease;
  width: 100%;
  display: flex;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
}

.poster-pdf {
  width: 100%;
  min-height: 800px;
  border: none;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.footer-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff6e0;
  border: 1px solid #f3d9a4;
  border-radius: 12px;
  padding: 20px;
  font-size: 15px;
}

.footer-banner .icon {
  font-size: 20px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .poster-preview {
    width: 100%;
    height: 300px;
  }

  .findings-cards {
    grid-template-columns: 1fr;
  }

  .conclusions-content {
    grid-template-columns: 1fr;
  }

  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar {
    width: 160px;
    height: 160px;
  }

  .poster-preview {
    height: 250px;
  }

  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .modal-controls {
    width: 100%;
    justify-content: space-between;
  }

  .partners-grid {
    grid-template-columns: 1fr;
  }
}
</style>
