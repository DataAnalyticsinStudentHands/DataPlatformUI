// stores/studentViews.js
import { defineStore } from 'pinia';

export const useStudentViewsStore = defineStore('studentViews', {
    state: () => ({
      projects: {
        activeTab: 'my-projects', // 'my-projects' or 'proposed-projects'
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
      // Add other views here as needed in the future
    }),
    actions: {
      // Projects view actions
      updateProjectsSettings(settings) {
        Object.assign(this.projects, settings);
      },
      setProjectsSearchChips(chips) {
        this.projects.searchChips = chips;
      },
      setProjectsSelectedSearchChips(chips) {
        this.projects.selectedSearchChips = chips;
      },
      addProjectsSearchChip(chip) {
        this.projects.searchChips.push(chip);
      },
      removeProjectsSearchChip(index) {
        this.projects.searchChips.splice(index, 1);
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
      // Projects view getters
      getProjectsSettings: (state) => state.projects,
      getProjectsActiveTab: (state) => state.projects.activeTab,
      isViewingArchivedProjects: (state) => state.projects.viewingArchivedProjects,
      getProjectsSearchChips: (state) => state.projects.searchChips,
      getProjectsSelectedSearchChips: (state) => state.projects.selectedSearchChips,
      getProjectsSortBy: (state) => (tabName) => state.projects.sortBy[tabName] || [],
      getProjectsItemsPerPage: (state) => (tabName) => state.projects.itemsPerPage[tabName] || 10,
      getProjectsCurrentPage: (state) => (tabName) => state.projects.currentPage[tabName] || 1
    }
});