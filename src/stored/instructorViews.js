/**
 * src/stored/instructorViews.js
 * 
 * Pinia store managing view states and preferences for instructor interfaces. This store
 * persists view configurations for activities, experiences, sessions, projects, and student
 * progress monitoring across page navigations. Handles sorting, filtering, pagination, and
 * view type toggles (active/archived) for various instructor dashboards.
 */

import { defineStore } from 'pinia';

export const useInstructorViewsStore = defineStore('instructorViews', {
    state: () => ({
      // Activities view configuration
      activities: {
        viewType: 'active',
        sortBy: [],
        searchChips: [],
        selectedSearchChips: []
      },
      // Experiences view configuration
      experiences: {
        viewType: 'active',
        sortBy: [],
        searchChips: [],
        selectedSearchChips: []
      },
      // Sessions view configuration
      sessions: {
        viewType: 'active',
        sortBy: [],
        searchChips: [],
        selectedSearchChips: []
      },
      // Projects view configuration with separate settings for active projects and proposals
      projects: {
        activeTab: 'active-projects',
        viewingArchivedProjects: false,
        searchChips: [],
        selectedChipIndices: [],
        sortBy: {
          activeProjects: [],
          proposals: []
        },
        itemsPerPage: {
          activeProjects: 10,
          proposals: 10
        },
        currentPage: {
          activeProjects: 1,
          proposals: 1
        }
      },
      // Student progress monitoring configuration for different form types
      studentProgressMonitor: {
        activeTab: 'entryForms',
        entryFormMonitor: {
          itemsPerPage: 10,
          isNavigationDisabled: false,
          currentPage: 1
        },
        goalFormMonitor: {
          selectedExperience: null,
          completed: null,
          itemsPerPage: 10,
          isNavigationDisabled: false,
          currentPage: 1
        },
        exitFormMonitor: {
          selectedExperience: null,
          completed: null,
          itemsPerPage: 10,
          isNavigationDisabled: false,
          currentPage: 1
        }
      }
    }),
    actions: {
      // Toggle between active and archived view types
      switchViewType(view, type) {
        if (this[view]) {
          this[view].viewType = type;
        }
      },
      // Update sorting configuration for a specific view
      updateSorting(view, sortArray) {
        if (this[view]) {
          this[view].sortBy = sortArray;
        }
      },
      // Add a search filter chip to a view
      addSearchChip(view, chip) {
        if (this[view]) {
          this[view].searchChips.push(chip);
        }
      },
      // Remove a search filter chip by index
      removeSearchChip(view, index) {
        if (this[view]) {
          this[view].searchChips.splice(index, 1);
        }
      },
      // Clear all search filter chips for a view
      clearSearchChips(view) {
        if (this[view]) {
          this[view].searchChips = [];
        }
      },
      // Set the selected search chips for filtering
      setSelectedSearchChips(view, chips) {
        if (this[view]) {
          this[view].selectedSearchChips = chips;
        }
      },
      // Update active tab in student progress monitor
      setProgressMonitorTab(tab) {
        this.studentProgressMonitor.activeTab = tab;
      },
      // Update entry form monitor settings
      updateEntryFormMonitorSettings(settings) {
        Object.assign(this.studentProgressMonitor.entryFormMonitor, settings);
      },
      // Update goal form monitor settings
      updateGoalFormMonitorSettings(settings) {
        Object.assign(this.studentProgressMonitor.goalFormMonitor, settings);
      },
      // Update exit form monitor settings
      updateExitFormMonitorSettings(settings) {
        Object.assign(this.studentProgressMonitor.exitFormMonitor, settings);
      },
      // Update general projects view settings
      updateProjectsSettings(settings) {
        Object.assign(this.projects, settings);
      },
      // Set search chips for projects view
      setProjectsSearchChips(chips) {
        this.projects.searchChips = chips;
      },
      // Set selected chip indices for projects filtering
      setProjectsSelectedChipIndices(indices) {
        this.projects.selectedChipIndices = indices;
      },
      // Update sorting for specific project tabs
      updateProjectsSorting(tabName, sortArray) {
        if (this.projects.sortBy[tabName] !== undefined) {
          this.projects.sortBy[tabName] = sortArray;
        }
      },
      // Update pagination settings for project tabs
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
      // Check if a view is showing archived items
      isViewingArchived: (state) => (view) => {
        return state[view] && state[view].viewType === 'archived';
      },
      // Student progress monitor getters
      getProgressMonitorTab: (state) => state.studentProgressMonitor.activeTab,
      getEntryFormMonitorSettings: (state) => state.studentProgressMonitor.entryFormMonitor,
      getGoalFormMonitorSettings: (state) => state.studentProgressMonitor.goalFormMonitor,
      getExitFormMonitorSettings: (state) => state.studentProgressMonitor.exitFormMonitor,
      // Projects view getters
      getProjectsSettings: (state) => state.projects,
      getProjectsActiveTab: (state) => state.projects.activeTab,
      isViewingArchivedProjects: (state) => state.projects.viewingArchivedProjects,
      getProjectsSearchChips: (state) => state.projects.searchChips,
      getProjectsSelectedChipIndices: (state) => state.projects.selectedChipIndices,
      getProjectsSortBy: (state) => (tabName) => state.projects.sortBy[tabName] || [],
      getProjectsItemsPerPage: (state) => (tabName) => state.projects.itemsPerPage[tabName] || 10,
      getProjectsCurrentPage: (state) => (tabName) => state.projects.currentPage[tabName] || 1
    }
});