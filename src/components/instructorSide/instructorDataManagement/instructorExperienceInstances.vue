<template>
  <v-container>
      <v-row>
          <v-col>
              <!-- Title -->
              <p class="d-flex justify-center font-weight-black text-h6">
                  {{ viewArchivedInstances ? "Archived" : "" }} Experience Instances
              </p>
          </v-col>
      </v-row>
      <v-row>
          <v-col>
              <v-card flat>
                  <!-- Top Management Row -->
                  <v-card-title>
                      <v-row>
                          <!-- Search Fields for sm Screens and Up-->
                          <v-col lg="6" md="6" sm="6" class="d-none d-sm-flex justify-start">
                              <!-- Search Fields -->
                              <v-text-field
                                  v-model="instanceSearch"
                                  density="comfortable"
                                  :label="searchLabel"
                                  flat
                                  hide-details
                                  clearable
                                  variante="solo-filled"
                                  @keyup.enter="addSearchChip"
                              >
                                  <!-- Search Menu Icons for sm Screens and Up -->
                                  <template v-slot:prepend-inner>
                                      <v-menu
                                          location="bottom"
                                      >
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
                          <v-spacer class="d-none d-sm-flex"></v-spacer>
                          <!-- View Archived Button for sm Screens and Up -->
                          <v-col lg="auto" md="4" sm="auto" class="d-none d-sm-flex justify-end align-self-center">
                              <v-btn
                                  v-if="!selectedInstances.length"
                                  @click="toggleArchivedInstances"
                                  elevation="1"
                                  :append-icon="viewArchivedInstances ? '' : 'mdi-archive'"
                              >
                                  {{ viewArchivedInstances ? "View Instances" : "View Archive" }}
                              </v-btn>
                              <v-btn
                                  v-else
                                  @click="handleArchiveInstances"
                                  elevation="1"
                                  :append-icon="viewArchivedInstances ? 'mdi-restore' : 'mdi-archive'"
                              >
                                  <span class="d-none d-md-flex">
                                      {{ viewArchivedInstances ? "Restore" : "Archive" }} {{ selectedInstances === 1 ? "Instance" : "Instances" }}
                                  </span>
                                  <span class="d-none d-sm-flex d-md-none">
                                      {{ viewArchivedInstances ? "Restore" : "Archive" }}
                                  </span>
                              </v-btn>
                          </v-col>
                          <!-- Add New Instance Button for sm Screens and Up -->
                          <v-col lg="auto" md="2" sm="2" class="d-none d-sm-flex justify-end align-self-center">
                              <v-btn
                                  @click="handleAddNewInstance"
                                  elevation="1"
                                  prepend-icon="mdi-plus"
                                  color="#c8102e"
                              >
                                  <span class="d-none d-lg-flex">Add New Instance</span>
                                  <span class="d-none d-sm-flex d-lg-none">New</span>
                              </v-btn>
                          </v-col>
                      </v-row>
                      <!-- Search Chips Row -->
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
                                      <template v-if="criteria.category !== 'Exit Form Release Date'">
                                          {{ criteria.category + `="` + criteria.term + `"` }}
                                      </template>
                                      <template v-else>
                                          {{ criteria.category + ' ' + criteria.term }}
                                      </template>
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
                      :headers="instanceHeaders"
                      :items="filteredInstancesData"
                      :group-by="groupBySession"
                      item-value="experience.id"
                      v-model="selectedInstances"
                      hover
                      return-object
                      items-per-page="25"
                      :items-per-page-options="dataTableItemsPerPageOptions"
                  >
                  <template v-slot:item="{ item }">
                      <tr class="pointer-cursor" @click="editInstance(item)">
                          <td @click.stop>
                              <v-checkbox
                              v-model="selectedInstances"
                              :value="item"
                              density="compact"
                              class="d-flex"
                              ></v-checkbox>
                          </td>
                          <td></td>
                          <td>{{ item.experience.category }}</td>
                          <td>{{ item.experience.name }}</td>
                          <td>{{ formatDate(item.exitFormReleaseDate) }}</td>
                          <td>{{ getActivityCount(item.activities) }}</td>
                      </tr>
                  </template>
                  <template v-slot:group-header="{ item, columns, count, toggleGroup, isGroupOpen }">
                      <tr>
                          <td :colspan="columns.length">
                              <v-btn
                                  size="small"
                                  variant="text"
                                  :icon="isGroupOpen(item) ? '$expand' : '$next'"
                                  @click=toggleGroup(item)
                              ></v-btn>
                              {{ item.value }}
                          </td>
                      </tr>
                  </template>
                  </v-data-table>
  
                  <!-- Skeleton Loader -->
                  <v-skeleton-loader v-if="loading" type="table-row@5"></v-skeleton-loader>
              </v-card>
          </v-col>
      </v-row>
  </v-container>
  <!-- Date Picker for Exit Form Release Date -->
  <v-dialog
      v-model="dialogExitFormReleaseDate"
      width="auto"
      persistent
  >
      <v-card>
          <v-card-title>
              <v-row>
                  <v-col>
                      <v-select
                          v-model="exitFormReleaseDateFilterType"
                          :items="['On', 'Before', 'After', 'Between']"
                          label="Filter Type"
                          outlined
                          density="comfortable"
                          hide-details
                      ></v-select>
                  </v-col>
              </v-row>
          </v-card-title>
          <v-card-item>
              <v-row>
                  <v-col cols="6">
                      <v-date-picker
                          v-model="selectedExitFormReleaseDate"
                          elevation="24"
                          :title="instanceExitFormReleaseDateTitle"
                          show-adjacent-months
                          color="red-darken-2"
                          @update:modelValue="handleExitFormReleaseDateSelection"
                      >
                          <template v-slot:header>
                              <div class="v-date-picker-header">
                                  <v-fade-transition>
                                      <div :key="formattedSelectedExitFormReleaseDate" class="v-date-picker-header__content">
                                          {{ formattedSelectedExitFormReleaseDate }}
                                      </div>
                                  </v-fade-transition>
                              </div>
                          </template>
                      </v-date-picker>
                  </v-col>
              </v-row>
          </v-card-item>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="cancelSelectExitFormReleaseDate">Cancel</v-btn>
              <v-btn
                  color="#c8102e"
                  :disabled="!canApplyExitFormReleaseDates"
                  @click="submitExitFormReleaseDate"
              >Apply</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
  
  <br><br><br><br><br><br><br><br>
  selectedInstances:
  <br>
  {{ selectedInstances }}
  instancesData:
  <br>
  {{ instancesData }}
  </template>
  
  <script>
  import { toast } from 'vue3-toastify';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import axios from "axios";
  import { DateTime } from "luxon";
  
  export default {
  name: "ExperienceInstancesManagement",
  data() {
      return {
          instancesData: [],
          searchLabel: "Search All Fields",
          searchMenuItems: [
              "All Fields",
              "Session",
              "Experience Name",
              "Experience Category",
              "Exit Form Release Date"
          ],
          viewArchivedInstances: false,
          instanceSearch: "",
          selectedInstances: [],
          groupBySession: [
              {
                  key: "session.name",
                  order: "asc",
              }
          ],
          instanceHeaders: [
              {
                  title: "",
                  align: "center",
                  sortable: false,
                  width: "30px"
              },
              {
                  title: "Experience Category",
                  value: "experience.category",
                  align: "start",
                  sortable: true,
                  key: "experience.category"
              },
              {
                  title: "Experience Name",
                  value: "experience.name",
                  align: "start",
                  sortable: true,
                  key: 'experience.name',
              },
              {
                  title: "Exit Form Release Date",
                  value: "exitFormReleaseDate",
                  align: "start",
                  sortable: true,
                  key: "exitFormReleaseDate"
              },
              {
                  title: 'Activities',
                  value: 'activityCount',
                  align: 'start',
                  sortable: true,
              },
          ],
          dataTableItemsPerPageOptions: [
              {value: 25, title: "25"},
              {value: 50, title: "50"},
              {value: 75, title: "75"},
              {value: 100, title: "100"},
              {value: -1, title: "$vuetify.dataFooter.itemsPerPageAll"},
          ],
          dialogExitFormReleaseDate: false,
          searchCriteria: [],
          selectedSearchChips: [],
          exitFormReleaseDateFilterType: "On",
          selectedExitFormReleaseDate: new Date(),
          beginningDateRange: null,
          endDateRange: null,
  
  
  
  
  
  
      }
  },
  created() {
      this.fetchInstances();
  },
  computed: {
      loading() {
          return useLoggedInUserStore().loading;
      },
  
      showChipsRow() {
          return this.searchCriteria.length > 0;
      },
  
      filteredInstancesData() {
          // If there are no search criteria or chips, filter only based on the viewArchivedInstances status
          if (!this.searchCriteria.length || !this.selectedSearchChips.length) {
              return this.instancesData.filter(item =>
                  this.viewArchivedInstances ? item.expInstanceStatus === false : item.expInstanceStatus === true
              );
          }
  
          const activeCriteria = this.selectedSearchChips.map(index => this.searchCriteria[index]);
  
          return this.instancesData.filter(item => {
              // First, filter based on archived status
              if (this.viewArchivedInstances && item.expInstanceStatus !== false) {
                  return false;
              } else if (!this.viewArchivedInstances && item.expInstanceStatus !== true) {
                  return false;
              }
  
              return activeCriteria.every(criteria => {
                  const term = criteria.term.toLowerCase();
                  const releaseDate = new Date(item.exitFormReleaseDate);
  
                  switch (criteria.category) {
                  case "All Fields":
                      return (
                          item.session.name.toLowerCase().includes(term) ||
                          item.experience.name.toLowerCase().includes(term) ||
                          item.experience.category.toLowerCase().includes(term) ||
                          this.formatDate(item.exitFormReleaseDate).includes(term)
                      );
                  case "Session":
                      return item.session.name.toLowerCase().includes(term);
                  case "Experience Name":
                      return item.experience.name.toLowerCase().includes(term);
                  case "Experience Category":
                      return item.experience.category.toLowerCase().includes(term);
                  case "Exit Form Release Date":
                      if (term.startsWith('<')) {
                          const comparisonDate = new Date(term.slice(2).trim());
                          return releaseDate < comparisonDate;
                      } else if (term.startsWith('>')) {
                          const comparisonDate = new Date(term.slice(2).trim());
                          return releaseDate > comparisonDate;
                      } else if (term.startsWith('=')) {
                          const formattedReleaseDate = this.formatDateForDatePicker(releaseDate);
                          const comparisonDate = term.slice(2).trim();
                          return formattedReleaseDate === comparisonDate;
                      } else if (term.startsWith('between')) {
                          let [startDateStr, endDateStr] = term.slice(8).split(' and ');
                          let startDate = DateTime.fromFormat(startDateStr.trim(), 'MM-dd-yyyy').toJSDate();
                          let endDate = DateTime.fromFormat(endDateStr.trim(), 'MM-dd-yyyy').toJSDate();
                          return releaseDate >= startDate && releaseDate <= endDate;
                      }
                      return true;
                  default:
                      return true;
                  }
              });
          });
      },
  
    instanceExitFormReleaseDateTitle() {
      switch (this.exitFormReleaseDateFilterType) {
          case "On":
              return "Release Date On";
          case "After":
              return "Release Date After";
          case "Before":
              return "Release Date Before";
          case "Between":
              return "Release Date Between";
          default:
              return "Release Date On";
      }
    },
  
    formattedSelectedExitFormReleaseDate() {
      if (this.exitFormReleaseDateFilterType === "Between") {
              let text = "";
              if (this.beginningDateRange) {
                  text += DateTime.fromJSDate(this.beginningDateRange).toFormat('MM-dd-yyyy');
              }
  
              if (this.beginningDateRange && this.endDateRange) {
                  text += " to ";
                  text += DateTime.fromJSDate(this.endDateRange).toFormat('MM-dd-yyyy');
              }
  
              return text;
          }
  
          return this.selectedExitFormReleaseDate
              ? DateTime.fromJSDate(this.selectedExitFormReleaseDate).toFormat('MM-dd-yyyy')
              : "";
    },
  
    canApplyExitFormReleaseDates() {
      if (this.exitFormReleaseDateFilterType === "Between") {
              // Allow submission only if both beginning and end date ranes are selected
              return this.beginningDateRange && this.endDateRange;
          }
          // In other cases, allow submission
          return true;
    }
  },
  methods: {
      async fetchInstances() {
          useLoggedInUserStore().startLoading();
          const user = useLoggedInUserStore();
          const token = user.token;
          let apiURL = import.meta.env.VITE_ROOT_API + "/instructorSideData/experience-instances";
          try {
              const response = await axios.get(apiURL, { headers: { token } });
              this.instancesData = response.data;
          } catch (error) {
              this.handleError(error);
          } finally {
              useLoggedInUserStore().stopLoading()
          }
      },
  
      formatDate(datetimeDB) {
          const formattedDate = DateTime.fromISO(datetimeDB).toFormat('MM-dd-yyyy');
          return formattedDate;
      },
  
      formatDateForDatePicker(date) {
          return DateTime.fromJSDate(date).toFormat('MM-dd-yyyy');
      },
  
      getActivityCount(activities) {
          return activities.length;
      },
  
      updateSearchCriteria(item) {
          if (item === "Exit Form Release Date") {
              this.dialogExitFormReleaseDate = true;
          } else {
              this.searchLabel = "Search " + item;
          }
      },
  
      addSearchChip() {
          if (this.instanceSearch) {
              this.searchCriteria.push({
                  category: this.searchLabel.replace("Search ", ""),
                  term: this.instanceSearch
              });
              // Select the chip by default
              this.selectedSearchChips.push(this.searchCriteria.length - 1);
              // Clear the input field after adding the chip
              this.instanceSearch = "";
          }
      },
  
      selectSearchChip(index) {
          const selectedIndex = this.selectedSearchChips.indexOf(index);
          if (selectedIndex >= 0) {
          // Remove the index and create a new array to trigger reactivity
          this.selectedSearchChips = [
              ...this.selectedSearchChips.slice(0, selectedIndex),
              ...this.selectedSearchChips.slice(selectedIndex + 1)
          ];
          } else {
          // Add the index and create a new array to trigger reactivity
          this.selectedSearchChips = [...this.selectedSearchChips, index];
          }
      },
  
      removeSearchChip(index) {
          this.searchCriteria.splice(index, 1);
          // Update selectedSearchChips to reflect the removal
          this.selectedSearchChips = this.selectedSearchChips.filter(i => i !== index);
          // Adjust the indexes of the remaining selected chips
          this.selectedSearchChips = this.selectedSearchChips.map(i => i > index ? i - 1 : i);
      },
  
      handleExitFormReleaseDateSelection(date) {
          if (this.exitFormReleaseDateFilterType === 'Between') {
              if (!this.beginningDateRange || this.endDateRange) {
                  // If beginningDateRange is not set or endDateRange is already set,
                  // set the new date as the beginningDateRange and reset endDateRange
                  this.beginningDateRange = date;
                  this.endDateRange = null;
              } else {
                  // Set the new date as the endDateRange
                  this.endDateRange = date;
              }
          } else {
              this.selectedExitFormReleaseDate = date;
          }
      },
  
      cancelSelectExitFormReleaseDate() {
          this.dialogExitFormReleaseDate = false;
          this.exitFormReleaseDateFilterType = "On";
          this.selectedExitFormReleaseDate = new Date();
      },
  
      submitExitFormReleaseDate() {
          // Handle different date filter types
          if (this.exitFormReleaseDateFilterType === 'On' && this.selectedExitFormReleaseDate) {
              this.createExitFormReleaseDateChip('=', this.selectedExitFormReleaseDate);
          } else if (this.exitFormReleaseDateFilterType === 'Before' && this.selectedExitFormReleaseDate) {
              this.createExitFormReleaseDateChip('<', this.selectedExitFormReleaseDate);
          } else if (this.exitFormReleaseDateFilterType === 'After' && this.selectedExitFormReleaseDate) {
              this.createExitFormReleaseDateChip('>', this.selectedExitFormReleaseDate);
          } else if (this.exitFormReleaseDateFilterType === 'Between' && this.beginningDateRange && this.endDateRange) {
              // Format the dates
              const formattedBeginningDate = this.formatDateForDatePicker(this.beginningDateRange);
              const formattedEndDate = this.formatDateForDatePicker(this.endDateRange);
              // Create a chip for the date range
              this.createExitFormReleaseDateChip('between', `${formattedBeginningDate} and ${formattedEndDate}`);
          }
  
          this.dialogExitFormReleaseDate = false;
          this.selectedExitFormReleaseDate = new Date();
          this.exitFormReleaseDateFilterType = "On";
      },
  
      createExitFormReleaseDateChip(operator, date) {
          let term = '';
          if (operator === '=') {
              term = `= ${this.formatDateForDatePicker(date)}`;  // Equals operator
          } else if (operator === '<') {
              term = `< ${this.formatDateForDatePicker(date)}`;  // Less than operator
          } else if (operator === '>') {
              term = `> ${this.formatDateForDatePicker(date)}`;  // More than operator
          } else if (operator === 'between') {
              term = `between ${date}`;  // Between operator
          }
  
          // Create the chip
          const exitFormReleaseDateChip = {
              category: 'Exit Form Release Date',
              term: term
          };
  
          // Add the chip to the search criteria
          this.searchCriteria.push(exitFormReleaseDateChip);
          // Select the new chip by default
          this.selectedSearchChips.push(this.searchCriteria.length - 1);
      },
  
      toggleArchivedInstances() {
          this.viewArchivedInstances = !this.viewArchivedInstances;
      },
  
      async handleArchiveInstances() {
          try {
              const user = useLoggedInUserStore();
              const token = user.token;
              const instanceIDs = this.selectedInstances.map(instance => instance._id);
              const updateStatus = { 
                  instanceIDs: instanceIDs,
                  status: this.viewArchivedInstances
              };
  
              const apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/experience-instances/update-status`;
              await axios.put(apiURL, updateStatus, { headers: { token }})
                  .then(() => {
                      toast.success(
                          (this.selectedInstances.length === 1 ? "Instance " : "Instances ") +
                          (this.viewArchivedInstances ? "Restored!" : "Archived!"), {
                              position: "top-right",
                              toastClassName: "Toastify__toast--create",
                              multiple: false
                      });
                  });
              // Refresh the data
              this.fetchInstances();
  
          } catch (error) {
              this.handleError(error);
          } finally {
              this.selectedInstances = [];
          }
      },
  
      editInstance(instance) {
          this.$router.push({ name: "instructorSpecificExperienceInstance", params: { id: instance._id } });
      },
  
      handleAddNewInstance() {
          this.$router.push({ name: "instructorAddExperienceInstance" });
      }
  
  },
  }
  </script>
  
  <style scoped>
  
  .pointer-cursor {
    cursor: pointer;
  }
  
  </style>