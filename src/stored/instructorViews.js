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
      studentProgressMonitor: {
        viewType: 'active', // 'active' or 'archived'
        sortBy: [],
        searchChips: [],
        selectedSearchChips: []
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
      }
    },
    getters: {
      isViewingArchived: (state) => (view) => {
        return state[view] && state[view].viewType === 'archived';
      }
    }
});
