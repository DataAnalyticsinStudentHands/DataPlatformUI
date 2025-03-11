<template>
  <v-app>
    <v-layout class="rounded">
      <!-- Navigation Drawer, replicating your original style and expand/rail behavior -->
      <v-navigation-drawer
        v-model="drawer"
        color="#c8102e"
        :rail="rail"
        @click="rail = false"
        class="sidebar"
        :permanent="isMdAndUp"
        :temporary="!isMdAndUp"
        width="300"
      >
        <!-- When in rail mode, show just the menu button -->
        <div v-if="rail">
          <v-list-item lines="two">
            <v-btn
              size="large"
              variant="text"
              icon="mdi-menu"
              @click="rail = !rail"
              class="text-white"
            />
          </v-list-item>
        </div>

        <!-- When expanded, show the full list -->
        <div v-else>
          <!-- Example: show a user avatar/title if desired -->
          <v-list-item
            lines="two"
            prepend-avatar="@/assets/DanPersona.svg"
            title="Jane Instructor"
            subtitle="Logged in"
            class="text-white"
          >
            <template #append>
              <!-- Button to collapse back into rail mode -->
              <v-btn
                variant="text"
                size="small"
                icon="mdi-arrow-expand-left"
                @click.stop="sidebarToggle"
              />
            </template>
          </v-list-item>

          <!-- The instructor-side nav items -->
          <v-list density="compact" nav class="text-white">
            <!-- 1) Dashboard -->
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              class="tracking-wider"
            >
              Dashboard
            </v-list-item>

            <!-- 2) Data Products -->
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              class="tracking-wider"
            >
              Data Products
            </v-list-item>

            <!-- 3) Students -->
            <v-list-item
              prepend-icon="mdi-account"
              class="tracking-wider"
            >
              Students
            </v-list-item>

            <!-- 4) Data Management Console -->
            <v-list-item
              prepend-icon="mdi-school"
              class="tracking-wider"
            >
              Data Management Console
            </v-list-item>

            <!-- Projects item with a notification badge -->

            <div @click="$router.push('/proposaldemo3')" style="cursor: pointer;">
              <v-badge color="blue-lighten-3" content="1" dot>
                <v-list-item
                  prepend-icon="mdi-account-group"
                  class="tracking-wider"
                >
                  Projects
                </v-list-item>
              </v-badge>
            </div>


            <!-- Divider -->
            <v-list-item>
              <hr />
            </v-list-item>

            <!-- Update User Information -->
            <v-list-item
              prepend-icon="mdi-cog"
              class="tracking-wider"
            >
              Update User Information
            </v-list-item>

            <!-- Update Password -->
            <v-list-item
              prepend-icon="mdi-cog"
              class="tracking-wider"
            >
              Update Password
            </v-list-item>

            <!-- Logout -->
            <v-list-item
              prepend-icon="mdi-logout"
              class="tracking-wider"
            >
              Logout
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>

      <!-- Main content to the right of the drawer -->
      <v-main id="main" ref="mainContent" class="main-content">
        <div class="pa-4">
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  name: "InstructorNavDrawerOnly",
  data() {
    return {
      // Drawer open/close state
      drawer: true,
      // Rail (collapsed) mode vs expanded mode
      rail: false,
    };
  },
  computed: {
    // For demonstration: always treat screen as “md and up”
    // so the drawer is permanent. Adjust to your real usage if desired.
    isMdAndUp() {
      return true;
    },
  },
  methods: {
    // Toggle between full expansion vs. rail/collapsed
    sidebarToggle() {
      if (this.isMdAndUp) {
        this.rail = !this.rail;
      } else {
        this.drawer = !this.drawer;
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
}
.main-content {
  /* Ensure main content is visible next to the drawer */
  height: 100vh;
  overflow-y: auto;
  /* Match the drawer width so content is properly offset */
  margin-left: 300px;
}
</style>
