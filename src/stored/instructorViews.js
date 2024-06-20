// stores/instructorViews.js
import { defineStore } from 'pinia';

export const useInstructorViewsStore = defineStore('instructorViews', {
    state: () => ({
      activitiesViewType: 'active', // 'active' or 'archived'
      sortBy: []
    }),
    actions: {
      switchActivitiesViewType(type) {
        this.activitiesViewType = type;
      },
      updateSorting(sortArray) {
        this.sortBy = sortArray;
      }
    },
    getters: {
      isViewingArchivedActivities: (state) => {
        return state.activitiesViewType === 'archived';
      }
    }
});
