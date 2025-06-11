/**
 * src/stored/studentViews.js
 * 
 * Pinia store managing view states and preferences for student interfaces. Currently handles
 * the projects view with support for tab switching between personal and proposed projects,
 * archived project viewing, search filtering, sorting, and pagination. Designed to be extended
 * with additional student view configurations as needed.
 */

import { defineStore } from 'pinia';

export const useStudentViewsStore = defineStore('studentViews', {
    state: () => ({
      // Projects view configuration
      projects: {
        activeTab: 'my-projects',
        viewingArchivedProjects: false,
        searchChips: [],
        selectedSearchChips: [],
        sortBy: {
          myProjects: [],
          proposedProjects: []
        },
        itemsPerPage: {
          myProjects: 10,
          proposedProjects: 10
        },
        currentPage: {
          myProjects: 1,
          proposedProjects: 1
        }
      }
    }),
    actions: {
      // Update multiple project settings at once
      updateProjectsSettings(settings) {
        Object.assign(this.projects, settings);
      },
      // Replace all search chips
      setProjectsSearchChips(chips) {
        this.projects.searchChips = chips;
      },
      // Set which search chips are selected
      setProjectsSelectedSearchChips(chips) {
        this.projects.selectedSearchChips = chips;
      },
      // Add a new search chip
      addProjectsSearchChip(chip) {
        this.projects.searchChips.push(chip);
      },
      // Remove a search chip by index
      removeProjectsSearchChip(index) {
        this.projects.searchChips.splice(index, 1);
      },
      // Update sort configuration for a specific tab
      updateProjectsSorting(tabName, sortArray) {
        if (this.projects.sortBy[tabName] !== undefined) {
          this.projects.sortBy[tabName] = sortArray;
        }
      },
      // Update pagination settings for a specific tab
      updateProjectsPagination(tabName, settings) {
        if (settings.itemsPerPage !== undefined && this.projects.itemsPerPage[tabName] !== undefined) {
          this.projects.itemsPerPage[tabName] = settings.itemsPerPage;
        }
        if (settings.currentPage !== undefined && this.projects.currentPage[tabName] !== undefined) {
          this.projects.currentPage[tabName] = settings.currentPage;
        }
      }
    },
    getters: {
      // Get all project settings
      getProjectsSettings: (state) => state.projects,
      // Get current active tab
      getProjectsActiveTab: (state) => state.projects.activeTab,
      // Check if viewing archived projects
      isViewingArchivedProjects: (state) => state.projects.viewingArchivedProjects,
      // Get all search chips
      getProjectsSearchChips: (state) => state.projects.searchChips,
      // Get selected search chips
      getProjectsSelectedSearchChips: (state) => state.projects.selectedSearchChips,
      // Get sort configuration for a specific tab
      getProjectsSortBy: (state) => (tabName) => state.projects.sortBy[tabName] || [],
      // Get items per page for a specific tab
      getProjectsItemsPerPage: (state) => (tabName) => state.projects.itemsPerPage[tabName] || 10,
      // Get current page for a specific tab
      getProjectsCurrentPage: (state) => (tabName) => state.projects.currentPage[tabName] || 1
    }
});