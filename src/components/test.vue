<template>
<v-app>
    <!-- Top App Bar -->
    <v-app-bar app color="primary" dark>
    <v-app-bar-title>Project Portal</v-app-bar-title>
    <v-spacer />
    <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-account</v-icon>
    </v-btn>
    </v-app-bar>

    <!-- Side Navigation Drawer -->
    <v-navigation-drawer app v-model="drawer" clipped>
    <v-list>
        <v-list-item link>
            <v-icon>mdi-view-dashboard</v-icon>
        <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item link>
            <v-icon>mdi-folder</v-icon>
        <v-list-item-title>Projects</v-list-item-title>
        </v-list-item>

        <v-list-item link>
            <v-icon>mdi-account-group</v-icon>
        <v-list-item-title>Team</v-list-item-title>
        </v-list-item>

        <v-list-item link>
            <v-icon>mdi-cog</v-icon>
        <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
    </v-list>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main>
  <v-container fluid class="pa-4">
    <!-- Row for the search field -->
    <v-col cols="12">
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search Projects"
        single-line
        hide-details
    />
    </v-col>


    <!-- Row for the data table -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-data-table
          hide-default-header
          height="400px"
          :headers="headers"
          :items="projects"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template #item.name="{ item }">
            <span>{{ item.name }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</v-main>


    <!-- Footer -->
    <v-footer app padless>
    <v-col class="text-center" cols="12">
        © {{ new Date().getFullYear() }} Project Portal
    </v-col>
    </v-footer>
</v-app>
</template>
  
<script>
export default {
name: "ProjectPortal",
data: () => ({
    drawer: true,
    search: "",
    // Define the header for the data table
    headers: [{ text: "Project Name", value: "name" }],
    // Hardcoded list of projects
    projects: [
    { name: "Community Code Initiative" },
    { name: "Academic App Accelerator" },
    { name: "Tech for Tomorrow" },
    { name: "EduEngage Network" },
    { name: "Digital Campus Connect" },
    { name: "Hack for Humanity" },
    { name: "Community Coding Collective" },
    { name: "Scholars’ Code Collaboration" },
    { name: "Innovative Learning Lab" },
    { name: "Community Code Exchange" },
    { name: "Campus Code Catalyst" },
    { name: "Digital Outreach Hub" },
    { name: "Scholars’ Sprint" },
    { name: "Code & Community Crew" },
    { name: "Smart Campus Solutions" },
    { name: "Bridging Code & Community" },
    { name: "Code for Change Initiative" },
    { name: "EduCode Innovators" },
    { name: "Community Tech Connect" },
    { name: "Digital Learning Dynamics" },
    { name: "Coding Champions for Community" },
    { name: "Academic Digital Lab" },
    { name: "NextGen Code" },
    { name: "Impact Code Collective" },
    { name: "Academic Code Revolution" },
    { name: "Integrate: Code & Community" },
    { name: "Coding Academy for All" },
    { name: "Tech Connect Campus" },
    { name: "Community Code Builders" },
    { name: "Digital Engagement Project" },
    { name: "Learning Through Code" },
    { name: "Innovators’ Hub" },
    { name: "The Tech Bridge Initiative" },
    { name: "Coding Crusaders" },
    { name: "Campus Consortium Code" },
    { name: "Engage & Code" },
    { name: "Community Code Lab" },
    { name: "Academic Code Forum" },
    { name: "Empower through Code" },
    { name: "Tech Outreach Network" },
    { name: "Collaborative Code Initiative" },
    { name: "Academic Empowerment Lab" },
    { name: "Digital Innovators in Community" },
    { name: "Code & Learn Collective" },
    { name: "Project Tech Empowerment" },
    { name: "Synergy: Code & Community" },
    { name: "Academic Outreach Through Tech" },
    { name: "Community Code Connectors" },
    { name: "Innovative Code for Impact" },
    { name: "Campus Community Coders" }
    ]
}),
mounted() {
    console.log("Project Portal visited!");
}
};
</script>
  
<style scoped>

</style>
  