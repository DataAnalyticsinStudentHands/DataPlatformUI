/**
 * src/components/instructorSide/featuredProjects/services/featuredProjectsService.js
 *
 * API service for the Featured Projects configuration.
 * Handles instructor CRUD for featured slots and public data fetching.
 */

import axios from 'axios';
import { validateUpload } from '@/utils/fileValidation';

const apiURL = import.meta.env.VITE_ROOT_API;
const BASE_INSTRUCTOR = `${apiURL}/instructorSideData/featured-projects`;
const BASE_PUBLIC = `${apiURL}/studentSideData/project-view-forms/public`;

// =============================================================================
// PUBLIC (no auth)
// =============================================================================

/**
 * Fetch fully denormalized featured projects data for the public page.
 * Returns { hero: [...], featured: [...] } matching FeaturedShowcase.vue template bindings.
 * @returns {Promise<{ hero: Array, featured: Array }>}
 */
export async function getPublicFeatured() {
  const response = await axios.get(`${BASE_PUBLIC}/featured`);
  return response.data;
}

// =============================================================================
// INSTRUCTOR ENDPOINTS (auth via axios global defaults)
// =============================================================================

/**
 * Get the current featured projects configuration.
 * Returns the config object or an empty shell { slots: [] } if none exists.
 * @returns {Promise<Object>}
 */
export async function getConfig() {
  const response = await axios.get(`${BASE_INSTRUCTOR}/config`);
  return response.data.config;
}

/**
 * Save (upsert) the featured projects configuration.
 * @param {Array} slots - Array of slot objects (max 5)
 * @returns {Promise<Object>} The saved config document
 */
export async function saveConfig(slots) {
  const response = await axios.put(`${BASE_INSTRUCTOR}/config`, { slots });
  return response.data.config;
}

/**
 * Get projects eligible for featuring.
 * Returns projects with consentToFeature === true and a published ProjectViewForm.
 * @returns {Promise<Array>}
 */
export async function getEligibleProjects() {
  const response = await axios.get(`${BASE_INSTRUCTOR}/eligible-projects`);
  return response.data.projects;
}

/**
 * Upload a custom hero background image for a slot.
 * @param {number} slotPosition - 1-5
 * @param {File} imageFile
 * @returns {Promise<string>} The URL of the uploaded hero image
 */
export async function uploadHeroImage(slotPosition, imageFile) {
  // Client-side validation before upload
  const validation = await validateUpload(imageFile, 'heroImage');
  if (!validation.valid) {
    throw new Error(validation.errors[0]);
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('slotPosition', slotPosition);
  const response = await axios.post(
    `${BASE_INSTRUCTOR}/config/hero-image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.heroImageUrl;
}

/**
 * Build a full URL for a hero image file served by the backend.
 * @param {string} relativePath
 * @returns {string}
 */
export function buildHeroImageUrl(relativePath) {
  if (!relativePath) return '';
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  return `${BASE_INSTRUCTOR}/files/${relativePath}`;
}

export default {
  getPublicFeatured,
  getConfig,
  saveConfig,
  getEligibleProjects,
  uploadHeroImage,
  buildHeroImageUrl,
};
