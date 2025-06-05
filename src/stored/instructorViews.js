// stores/instructorViews.js
import { defineStore } from 'pinia';

export const useInstructorViewsStore = defineStore('instructorViews', {
    state: () => ({
      activities: {
        viewType: 'active', // 'active' or 'archived'
        sortBy: [],
        searchChips: [],
        selectedSearchChips: []
      },
      experiences: {
        viewType: 'active', // 'active' or 'archived'
        sortBy: [],
        searchChips: [],
        selectedSearchChips: []
      },
      sessions: {
        viewType: 'active', // 'active' or 'archived'
        sortBy: [],
        searchChips: [],
        selectedSearchChips: []
      },
      projects: {
        activeTab: 'active-projects', // 'active-projects' or 'proposals'
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
      studentProgressMonitor: {
        activeTab: 'entryForms', // 'entryForms', 'goalForms', 'exitForms', 'pending'
        entryFormMonitor: {
          itemsPerPage: 10,
          isNavigationDisabled: false,
          currentPage: 1
        },
        goalFormMonitor: {
          selectedExperience: null,
          completed: null, // true for completed, false for uncompleted, null for neither
          itemsPerPage: 10,
          isNavigationDisabled: false,
          currentPage: 1
        },
        exitFormMonitor: {
          selectedExperience: null,
          completed: null, // true for completed, false for uncompleted, null for neither
          itemsPerPage: 10,
          isNavigationDisabled: false,
          currentPage: 1
        }
      }
    }),
    actions: {
      switchViewType(view, type) {
        if (this[view]) {
          this[view].viewType = type;
        }
      },
      updateSorting(view, sortArray) {
        if (this[view]) {
          this[view].sortBy = sortArray;
        }
      },
      addSearchChip(view, chip) {
        if (this[view]) {
          this[view].searchChips.push(chip);
        }
      },
      removeSearchChip(view, index) {
        if (this[view]) {
          this[view].searchChips.splice(index, 1);
        }
      },
      clearSearchChips(view) {
        if (this[view]) {
          this[view].searchChips = [];
        }
      },
      setSelectedSearchChips(view, chips) {
        if (this[view]) {
          this[view].selectedSearchChips = chips;
        }
      },
      // New actions for Student Progress Monitor
      setProgressMonitorTab(tab) {
        this.studentProgressMonitor.activeTab = tab;
      },
      updateEntryFormMonitorSettings(settings) {
        Object.assign(this.studentProgressMonitor.entryFormMonitor, settings);
      },
      updateGoalFormMonitorSettings(settings) {
        Object.assign(this.studentProgressMonitor.goalFormMonitor, settings);
      },
      updateExitFormMonitorSettings(settings) {
        Object.assign(this.studentProgressMonitor.exitFormMonitor, settings);
      },
      // Projects view actions
      updateProjectsSettings(settings) {
        Object.assign(this.projects, settings);
      },
      setProjectsSearchChips(chips) {
        this.projects.searchChips = chips;
      },
      setProjectsSelectedChipIndices(indices) {
        this.projects.selectedChipIndices = indices;
      },
      updateProjectsSorting(tabName, sortArray) {
        if (this.projects.sortBy[tabName] !== undefined) {
          this.projects.sortBy[tabName] = sortArray;
        }
      },
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
      isViewingArchived: (state) => (view) => {
        return state[view] && state[view].viewType === 'archived';
      },
      // New getters for Student Progress Monitor
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