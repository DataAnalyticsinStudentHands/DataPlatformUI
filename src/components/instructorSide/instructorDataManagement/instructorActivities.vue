<template>
  <v-container>
      <!-- Title -->
      <v-row>
          <v-col>
              <p class="d-flex justify-center font-weight-black text-h6">
                  {{ viewArchivedActivities ? "Archived" : "" }} Activities
              </p>
          </v-col>
      </v-row>
      <v-row>
          <v-col>
              <v-card flat>
                  <!-- Top Management Row -->
                  <v-card-title>
                      <v-row class="d-flex justify-start">
                          <v-col cols="6">
                              <!-- Search Field -->
                              <v-text-field
                                  v-model="activitySearch"
                                  density="comfortable"
                                  :label="searchLabel"
                                  flat
                                  hide-details
                                  clearable
                                  variant="solo-filled"
                                  @keyup.enter="addSearchChip"
                              >
                                  <!-- Search Menu Icons -->
                                  <template v-slot:prepend-inner>
                                      <v-menu location="bottom">
                                          <template v-slot:activator="{ props }">
                                              <div
                                                  v-bind="props"
                                                  class="pointer-cursor"
                                                  @click.stop
                                              >
                                                  <v-icon>mdi-magnify</v-icon>
                                                  <v-icon>mdi-chevron-down</v-icon>
                                              </div>
                                          </template>
                                          <v-list>
                                              <v-list-item
                                                  v-for="item in searchMenuItems"
                                                  :key="item"
                                                  @click="updateSearchCriteria(item)"
                                              >
                                                  <v-list-item-title>{{ item }}</v-list-item-title>
                                              </v-list-item>
                                          </v-list>
                                      </v-menu>
                                  </template>
                                  <template v-slot:append-inner>
                                      <div class="pointer-cursor mr-3" @click="addSearchChip">
                                          <v-icon>mdi-chevron-right</v-icon>
                                      </div>
                                  </template>
                              </v-text-field>
                          </v-col>
                          <!-- View Archived Activites Button -->
                          <v-col class="d-flex justify-end align-self-center">
                              <v-btn
                                  v-if="!selectedActivities.length"
                                  @click="toggleArchivedActivities"
                                  elevation="1"
                                  :append-icon="viewArchivedActivities ? '' : 'mdi-archive'"
                              >
                                  {{ viewArchivedActivities ? 'View Activities' : 'View Archive' }}
                              </v-btn>
                              <v-btn
                                  v-else
                                  @click="handleArchiveActivities"
                                  elevation="1"
                                  :append-icon="viewArchivedActivities ? 'mdi-restore' : 'mdi-archive'"
                              >
                                  {{ viewArchivedActivities ? "Restore" : "Archive" }} {{ selectedActivities.length === 1 ? "Activity" : "Activities" }}
                              </v-btn>
                          </v-col>
                          <!-- Add New Activity Button -->
                          <v-col class="d-flex justify-end align-self-center">
                              <v-btn
                                  @click="handleAddNewActivity"
                                  elevation="1"
                                  prepend-icon="mdi-plus"
                                  color="#c8102e"
                              >
                                  Add New Activity
                              </v-btn>
                          </v-col>
                      </v-row>
                      <!-- Chips Row -->
                      <v-row v-if="showChipsRow" dense>
                          <v-col>
                              <!-- Search Chips -->
                              <v-chip-group
                                  v-if="searchCriteria.length"
                                  v-model="selectedSearchChips"
                                  column
                                  multiple
                              >
                                  <v-chip
                                      v-for="(criteria, index) in searchCriteria"
                                      :key="index"
                                      @click="selectSearchChip(index)"
                                      filter
                                      variant="outlined"
                                      class="ma-2"
                                  >
                                      {{ criteria.category + '="' + criteria.term + '"' }}
                                      <v-icon
                                          end
                                          @click.stop="removeSearchChip(index)"
                                      >mdi-close</v-icon>
                                  </v-chip>
                              </v-chip-group>
                          </v-col>
                      </v-row>
                  </v-card-title>
                  <!-- Data Table -->
                  <v-data-table
                      v-if="!loading"
                      :headers="activityHeaders"
                      :items="filteredActivityData"
                      item-key="_id"
                      item-value="_id"
                      v-model="selectedActivities"
                      hover
                      return-object
                      v-model:expanded="expandedActivities"
                      show-expand
                  >
                      <template v-slot:body="{ items }">
                          <template
                              v-for="item in items"
                              :key="item._id"
                          >
                              <tr
                                  @click="editActivity(item)"
                                  class="pointer-cursor"
                              >
                                  <td @click.stop>
                                      <v-checkbox density="compact" class="d-flex" @update:modelValue="toggleSelection(item)"></v-checkbox>
                                  </td>
                                  <td>{{ item.activityName }}</td>
                                  <td @click.stop>
                                      <v-btn icon variant="text" @click="toggleRowExpansion(item)">
                                          <v-icon>
                                              {{ expandedActivities.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                          </v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                              <!-- Expanded row for experiences -->
                              <tr v-if="expandedActivities.includes(item)">
                                  <td></td>
                                  <td :colspan="activityHeaders.length">
                                      <div class="experience-label">
                                          <strong>Experiences:</strong>
                                      </div>
                                      <div v-if="item.experiences && item.experiences.length" class="experiences-grid">
                                          <div v-for="(half, index) in [firstHalfExperiences(item.experiences), secondHalfExperiences(item.experiences)]" :key="index">
                                              <v-list density="compact">
                                                  <v-list-item v-for="experience in half" :key="experience._id">
                                                      <span :class="{
                                                              'highlight-red': isExperienceNameMatched(experience.experienceName) || 
                                                                              isExperienceCategoryMatched(experience.experienceCategory)
                                                          }">
                                                          {{ experience.experienceCategory }} - {{ experience.experienceName }}
                                                      </span>
                                                  </v-list-item>
                                              </v-list>
                                          </div>
                                      </div>
                                      <div v-else class="font-italic pt-2 pl-2">
                                          None
                                      </div>
                                  </td>
                              </tr>
                          </template>
                      </template>
                  </v-data-table>
  
                  <!-- Skeleton Loader -->
                  <v-skeleton-loader v-if="loading" type="table-row@5"></v-skeleton-loader>
              </v-card>
          </v-col>
      </v-row>
  </v-container>
  
  <!-- Dialog for Filtering by Experience Category -->
  <v-dialog
      v-model="dialogExperienceCategory"
      width="500"
      persistent
  >
      <v-card>
          <v-card-title>
              Filter By Experience Category
          </v-card-title>
          <v-card-item>
              <v-row>
                  <v-col>
                      <v-autocomplete
                          :items="uniqueExperienceCategories"
                          v-model="selectedExperienceCategories"
                          label="Experience Category"
                          clearable
                          chips
                          multiple
                          return-object
                      ></v-autocomplete>
                  </v-col>
              </v-row>
          </v-card-item>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="cancelDialogExperienceCategory">Cancel</v-btn>
              <v-btn 
                  color="primary"
                  :disabled="!selectedExperienceCategories.length"
                  @click="submitExperienceCategory"
              >Apply</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
  
  <!-- Dialog for Filtering by Experience Name -->
  <v-dialog
      v-model="dialogExperienceName"
      width="500"
      persistent
  >
      <v-card>
          <v-card-title>
              Filter By Experience Name
          </v-card-title>
          <v-card-item>
              <v-row>
                  <v-col>
                      <v-autocomplete
                          :items="uniqueExperienceNames"
                          v-model="selectedExperienceNames"
                          label="Experience Name"
                          clearable
                          chips
                          multiple
                          return-object
                      ></v-autocomplete>
                  </v-col>
              </v-row>
          </v-card-item>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="cancelDialogExperienceName">Cancel</v-btn>
              <v-btn 
                  color="primary"
                  @click="submitExperienceName"
              >Apply</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
  
  
  <br><br><br><br><br><br><br><br><br>
  activityData:
  <br>
  {{ activityData }}
  <br><br><br>
  experienceData:
  <br>
  {{ experienceData }}
  </template>
  
  <script>
  import { toast } from 'vue3-toastify';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import axios from "axios";
  
  export default {
  name: "ActivitiesManagement",
  data() {
      return {
          activityData: [],
          filteredActivityData: [],
          selectedActivities: [],
          experienceData: [],
          viewArchivedActivities: false,
          activitySearch: "",
          searchLabel: "Search Activity Name",
          searchMenuItems: [
              "Experience Category",
              "Experience Name"
          ],
          activityHeaders: [
              {
                  title: "",
                  sortable: false,
                  align: "center",
                  width: "30px"
              },
              {
                  title: "Activity Name",
                  value: "activityName",
                  align: "start",
                  sortable: true,
                  key: "activityName"
              },
              {
                  title: "",
                  key: "data-table-expand"
              }
          ],
          searchCriteria: [],
          selectedSearchChips: [],
          dialogExperienceCategory: false,
          dialogExperienceName: false,
          selectedExperienceCategories: [],
          selectedExperienceNames: [],
          expandedActivities: [],
      }
  },
  mounted() {
      useLoggedInUserStore().startLoading();
      this.fetchActivityData()
          .then(() => {
              useLoggedInUserStore().stopLoading();
          })
          .catch((error) => {
              this.handleError(error);
              useLoggedInUserStore.stopLoading();
          });
  },
  computed: {
      loading() {
          return useLoggedInUserStore().loading;
      },
  
      showChipsRow() {
          return this.searchCriteria.length > 0;
      },
  
      uniqueExperienceCategories() {
          const categories = new Set();
          this.activityData.forEach(activity => {
              activity.experiences.forEach(experience => {
                  categories.add(experience.experienceCategory);
              });
          });
          return Array.from(categories);
      },
  
      uniqueExperienceNames() {
          const names = new Set();
          this.activityData.forEach(activity => {
              activity.experiences.forEach(experience => {
                  names.add(experience.experienceName);
              });
          });
          return Array.from(names);
      }
  },
  methods: {
      async fetchActivityData() {
          try {
              const user = useLoggedInUserStore();
              const token = user.token;
              let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/activities/";
              const response = await axios.get(apiURL, { headers: { token } });
              this.activityData = response.data;
              this.filteredActivityData = [...this.activityData];
              this.performFilter();
          } catch (error) {
              this.handleError(error);
          }
      },
  
      editActivity(activity) {
          console.log('Edit Activity: ', activity);
          this.$router.push({ name: "instructorSpecificActivity", params: {id: activity._id } });
      },
  
      toggleSelection(activity) {
          const index = this.selectedActivities.findIndex((selectedActivity) => selectedActivity._id === activity._id);
          if (index >= 0) {
              // Already selected, remove it
              this.selectedActivities.splice(index, 1);
          } else {
              // Not selected, add it
              this.selectedActivities.push(activity);
          }
      },
  
      updateSearchCriteria(item) {
          if (item === "Experience Category") {
              this.dialogExperienceCategory = true;
          } else if (item === "Experience Name") {
              this.dialogExperienceName = true;
          }
      },
  
      addSearchChip() {
          if (this.activitySearch) {
              this.searchCriteria.push({
                  category: this.searchLabel.replace("Search ", ""),
                  term: this.activitySearch
              });
              // Select the new chip by default
              this.selectedSearchChips.push(this.searchCriteria.length - 1);
              // Clear the input field after adding the chip
              this.activitySearch = "";
              // Call search
              this.performFilter();
          }
      },
  
      selectSearchChip(index) {
          const selectedIndex = this.selectedSearchChips.indexOf(index);
          if (selectedIndex >= 0) {
              // If the chip is already selected, creae a new array without this chip
              this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
          } else {
              // If the chip is not selected, create a new array with this chip added
              this.selectedSearchChips = [...this.selectedSearchChips, index]
          }
          // Call search
          this.performFilter();
      },
  
      removeSearchChip(index) {
          this.searchCriteria.splice(index, 1);
          // Update selectedSearchChips to reflect the removal
          this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
          // Adjust the indexes of the remaining selected chips
          this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
          // Call search
          this.performFilter();
      },
  
      performFilter() {
          let searchGroups = {};
          this.selectedSearchChips.forEach(index => {
              let criteria = this.searchCriteria[index];
              if (!searchGroups[criteria.category]) {
                  searchGroups[criteria.category] = [];
              }
              searchGroups[criteria.category].push(criteria.term.toLowerCase());
          });
  
          this.filteredActivityData = this.activityData.filter(activity => {
              // Check if the activity should be included based on activityStatus
              if ((this.viewArchivedActivities && !activity.activityStatus) || 
                  (!this.viewArchivedActivities && activity.activityStatus)) {
                  // Filtering based on search criteria
                  return Object.keys(searchGroups).every(category => {
                      if (category === "Activity Name") {
                          return searchGroups[category].some(term =>
                              activity.activityName.toLowerCase().includes(term)
                          );
                      } else if (category === "Experience Category") {
                          return activity.experiences.some(exp =>
                              searchGroups[category].includes(exp.experienceCategory.toLowerCase())
                          );
                      } else if (category === "Experience Name") {
                          return activity.experiences.some(exp =>
                              searchGroups[category].includes(exp.experienceName.toLowerCase())
                          );
                      }
                      return true;
                  });
              }
              return false;
          });
      },
  
  
      toggleArchivedActivities() {
          this.viewArchivedActivities = !this.viewArchivedActivities;
          this.performFilter();
      },
  
      async handleArchiveActivities() {
          try {
              const user = useLoggedInUserStore();
              const token = user.token;
              const updateStatus = { activityStatus: this.viewArchivedActivities };
  
              for (const activity of this.selectedActivities) {
                  const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/activities/${activity._id}`;
                  await axios.put(apiURL, updateStatus, { headers: { token } })
                      .then(() => {
                          toast.success(
                              (this.selectedActivities.length === 1 ? "Activity " : "Activities ") +
                              (this.viewArchivedActivities ? "Restored!" : "Archived!"), {
                                  position: "top-right",
                                  toastClassName: "Toastify__toast--create",
                                  multiple: false
                          });
                      });
              }
          } catch (error) {
              this.handleError(error);
          } finally {
              this.selectedActivities = [];
              await this.fetchActivityData();
          }
      },
  
      cancelDialogExperienceCategory() {
          this.dialogExperienceCategory = false;
          this.selectedExperienceCategories = [];
      },
  
      cancelDialogExperienceName() {
          this.dialogExperienceName = false;
          this.selectedExperienceNames = [];
      },
  
      submitExperienceCategory() {
          this.selectedExperienceCategories.forEach(category => {
              const chip = {
                  category: "Experience Category",
                  term: category
              };
              this.searchCriteria.push(chip);
              // Select the new chip by default
              this.selectedSearchChips.push(this.searchCriteria.length - 1);
          });
  
          // Close the dialog and reset selectedExperienceCategories
          this.dialogExperienceCategory = false;
          this.selectedExperienceCategories = [];
  
          // Call search
          this.performFilter();
      },
  
      submitExperienceName() {
          this.selectedExperienceNames.forEach(name => {
              const chip = {
                  category: "Experience Name",
                  term: name
              };
              this.searchCriteria.push(chip);
              // Select the new chip by default
              this.selectedSearchChips.push(this.searchCriteria.length - 1);
          });
  
          // Close the dialog and reset selectedExperienceNames
          this.dialogExperienceName = false;
          this.selectedExperienceNames = [];
  
          // Call search
          this.performFilter();
      },
  
      toggleRowExpansion(item) {
          const index = this.expandedActivities.indexOf(item);
          if (index > -1) {
              // Remove the item
              this.expandedActivities.splice(index, 1);
          } else {
              // Add the item
              this.expandedActivities.push(item);
          }
      },
  
      firstHalfExperiences(experiences) {
          const midpoint = Math.ceil(experiences.length / 2);
          return experiences.slice(0, midpoint);
      },
  
      secondHalfExperiences(experiences) {
          const midpoint = Math.ceil(experiences.length / 2);
          return experiences.slice(midpoint);
      },
  
      isExperienceNameMatched(experienceName) {
          // Check if any 'Experience Name' criteria are selected
          const selectedExperienceNameCriteria = this.searchCriteria
              .filter((criteria, index) => this.selectedSearchChips.includes(index) && criteria.category === "Experience Name")
              .map(criteria => criteria.term.toLowerCase());
  
          return selectedExperienceNameCriteria.some(term => experienceName.toLowerCase().includes(term));
      },
  
      isExperienceCategoryMatched(experienceCategory) {
          // Check if any 'Experience Category' criteria are selected
          const selectedExperienceCategoryCriteria = this.searchCriteria
              .filter((criteria, index) => this.selectedSearchChips.includes(index) && criteria.category === "Experience Category")
              .map(criteria => criteria.term.toLowerCase());
  
          return selectedExperienceCategoryCriteria.some(term => experienceCategory.toLowerCase().includes(term));
      },
  
      handleAddNewActivity() {
          this.$router.push({ name: "instructorAddActivity" });
      }
  }
  
  }
  </script>
  
  <style scoped>
  .pointer-cursor {
      cursor: pointer;
  }
  
  .experiences-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr); /* Creates two equal columns */
  }
  
  .experience-label {
      margin-top: 10px; 
  }
  
  .highlight-red {
      color: #c8102e;
  }
  </style>