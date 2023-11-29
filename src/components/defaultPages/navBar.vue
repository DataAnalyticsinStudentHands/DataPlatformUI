<template>
    <v-navigation-drawer
        v-if="user.isLoggedIn"
        :value="localDrawer"
        color="#c8102e"
        :rail="rail"
        class="sidebar"
        :permanent="isMdAndUp"
        :temporary="!isMdAndUp"
    >

        <!-- Navigation items based on the user's role -->
        <div v-if="userRole === 'Student' || userRole == 'Instructor'">
            <div v-if="rail">
                <v-list-item
                lines="two"
                >
                <v-btn
                    size="large"
                    variant="text"
                    icon="mdi-menu"
                    @click="rail = !rail"
                    class="text-white"
                ></v-btn>
                </v-list-item>
            </div>
            <div v-else>
                <v-list-item
                lines="two"
                prepend-avatar="@/assets/DanPersona.svg"
                :title="fullName"
                subtitle="Logged in"
                class="text-white"
                >
                <template v-slot:append>
                    <v-btn
                    variant="text"
                    size="small"
                    icon="mdi-arrow-expand-left"
                    @click.stop="sidebarToggle"
                    ></v-btn>
                </template>
                </v-list-item>

            <v-list density="compact" nav class="text-white">
                <div v-if="!user.isLoggedIn">
                <v-list-item 
                    :active="activeLink === 'Login'"
                    to="login"
                    prepend-icon="mdi-login"
                    value="Login"
                    class=" tracking-wider "
                >Login
                <template v-slot:append>
                    <v-btn
                    variant="text"
                    size="small"
                    icon="mdi-arrow-expand-left"
                    @click.stop.prevent="sidebarToggle"
                    ></v-btn>
                </template>
                </v-list-item>
                </div>
                <div v-if="user.isLoggedIn && user.getRole === 'Student'">
                <v-list-item 
                    :active="activeLink === 'studentDashboard'"
                    to="studentDashboard"
                    prepend-icon="mdi-view-dashboard"
                    value="studentDashboard"
                    class=" tracking-wider "
                >Student Dashboard</v-list-item>
                <v-list-item 
                    :active="activeLink === 'studentEntryForm'"
                    v-if="!user.hasCompletedEntryForm"
                    to="studentEntryForm"
                    prepend-icon="mdi-file-document"
                    value="studentEntryForm"
                    class=" tracking-wider "
                >Student Entry Form</v-list-item>
                <v-list-item 
                    :active="activeLink === 'goalSettingForm'"
                    v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences && !user.exitFormsReleased"
                    to="goalSettingForm"
                    prepend-icon="mdi-file-document"
                    value="goalSettingForm"
                    class=" tracking-wider "
                >Goal Setting Form</v-list-item>
                <v-list-item 
                    :active="activeLink === 'exitFormsAvailable'"
                    v-if="user.hasCompletedEntryForm && user.hasRegisteredExperiences && user.exitFormsReleased"
                    to="exitFormsAvailable"
                    prepend-icon="mdi-file-document"
                    value="exitFormsAvailable"
                    class=" tracking-wider "
                >Exit Forms</v-list-item>
                </div>
                <div v-if="user.isLoggedIn && user.getRole === 'Instructor'">
                <v-list-item 
                    :active="activeLink === 'instructorDash'"
                    to="instructorDash"
                    prepend-icon="mdi-view-dashboard"
                    value="instructorDash"
                    class=" tracking-wider "
                >Dashboard</v-list-item>
                <v-list-item 
                    :active="activeLink === 'instructorDataProducts'"
                    to="instructorDataProducts"
                    prepend-icon="mdi-view-dashboard"
                    value="instructorDataProducts"
                    class=" tracking-wider"
                >Data Products</v-list-item>
                <v-list-item 
                    :active="activeLink === 'instructorStudentsList'"
                    to="instructorStudentsList"
                    prepend-icon="mdi-account"
                    value="instructorStudentsList"
                    class=" tracking-wider"
                >Students</v-list-item>
                <v-list-item 
                    :active="activeLink === 'instructorSemesters'"
                    to="instructorSemesters"
                    prepend-icon="mdi-school"
                    value="instructorSemesters"
                    class=" tracking-wider"
                >Semesters, Experiences, Activities</v-list-item>
                </div>
                <div v-if="user.isLoggedIn">
                <v-list-item>
                    <hr> <!-- Horizontal line -->
                </v-list-item>
                <v-list-item 
                    :active="activeLink === 'profile'"
                    v-if="user.getRole === 'Student'"
                    to="profile"
                    prepend-icon="mdi-account"
                    value="profile"
                    class=" tracking-wider "
                >Profile</v-list-item>
                <v-list-item
                    :active="activeLink === 'User Data Update Form'"
                    to="updateUserInformation"
                    prepend-icon="mdi-cog"
                    value="User Data Update Form"
                    class=" tracking-wider "
                >Update User Information</v-list-item>
                <v-list-item
                    :active="activeLink === 'Password Reset'"
                    to="updatePassword"
                    prepend-icon="mdi-cog"
                    value="Password Reset"
                    class=" tracking-wider "
                >Update Password</v-list-item>
                <v-list-item
                    :active="activeLink === 'Login'"
                    to="login"
                    prepend-icon="mdi-logout"
                    value="Login"
                    class=" tracking-wider "
                    @click="handleLogout"
                >Logout</v-list-item>
                </div>
            </v-list>

            </div>
        </div>
        <div v-if="userRole === 'Basic'">
        <!-- Instructor specific navigation items -->
        </div>
        <!-- Common navigation items -->
    </v-navigation-drawer>
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
    name: "NavBar",
    props: {
        localDrawer: Boolean,
        rail: Boolean,
        activeLink: String,
        isMdAndUp: Boolean,
        userRole: String,
        // Add any other props you need, such as user data
    },
    setup() {
        const user = useLoggedInUserStore();

        return {
            user
        };
    },
    computed: {
        fullName() {
            return (this.user.firstName.trim() + ' ' + this.user.lastName.trim());
        },
    },
    methods: {
        handleLogout() {
            // Emit an event to App.vue to handle the logout logic
            this.$emit('logout');
        },
        toggleRail() {
            // Emit an event to App.vue to toggle the rail state
            this.$emit('update:rail', !this.rail);
        },
        sidebarToggle() {
            // Handle sidebar toggle logic
            // If this needs to update `localDrawer`, emit an event to App.vue
            this.$emit('update:localDrawer', !this.localDrawer);
        }
    }
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
</style>
