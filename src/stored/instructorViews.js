// stores/instructorViews.js
import { defineStore } from 'pinia';

export const useInstructorViewsStore = defineStore('instructorViews', {
    state: () => ({
      activitiesViewType: 'active', // 'active' or 'archived'
      sortBy: [],
      searchChips: [],
      selectedSearchChips: []  // Add this line
    }),
    actions: {
      switchActivitiesViewType(type) {
        this.activitiesViewType = type;
      },
      updateSorting(sortArray) {
        this.sortBy = sortArray;
      },
      addSearchChip(chip) {
        this.searchChips.push(chip);
      },
      removeSearchChip(index) {
        this.searchChips.splice(index, 1);
      },
      clearSearchChips() {
        this.searchChips = [];
      },
      setSelectedSearchChips(chips) {
        this.selectedSearchChips = chips;
      }
    },
    getters: {
      isViewingArchivedActivities: (state) => {
        return state.activitiesViewType === 'archived';
      }
    }
});
