/**
 * src/router/index.js
 *
 * Vue Router configuration defining all application routes with role-based access control.
 * Implements JWT token verification for protected routes and manages navigation guards for
 * authentication. Routes are organized by user roles (Student, Instructor, Admin) with
 * appropriate middleware checks. Handles automatic redirects based on authentication status
 * and user roles.
 */

import { createRouter, createWebHistory } from "vue-router";
import { useLoggedInUserStore } from "../stored/loggedInUser";
import { verifyJWT } from "../auth/jwtVerifier";

// Verify user authentication status
async function isLoggedIn(to, from, next) {
  const token = localStorage.getItem("token");
  if (!token) {
    next("/error");
    return;
  }

  try {
    const payload = await verifyJWT(token);
    if (!payload) {
      next("/error");
      return;
    }

    next();
  } catch (error) {
    next("/error");
  }
}

// Create role-based authentication guard
function requireAuth(allowedRoles) {
  return async (to, from, next) => {
    const token = localStorage.getItem("token");
    if (!token) {
      next("/error");
      return;
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      next("/error");
      return;
    }

    if (!allowedRoles.includes(payload.userRole)) {
      next("/error");
      return;
    }

    next();
  };
}

// Guard for student routes that require registered experiences
async function requireStudentWithExperiences(to, from, next) {
  const token = localStorage.getItem("token");
  if (!token) {
    next("/error");
    return;
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    next("/error");
    return;
  }

  if (payload.userRole !== "Student") {
    next("/error");
    return;
  }

  const userStore = useLoggedInUserStore();

  // Check if user has registered experiences
  if (!userStore.hasRegisteredExperiences) {
    // Redirect to student dashboard with a message
    next("/studentDashboard");
    return;
  }

  next();
}

// Route definitions
const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/login",
  },
  {
    path: "/studentEntryFormUpdate",
    name: "studentEntryFormUpdate",
    props: true,
    component: () =>
      import(
        "../components/studentSide/studentEntryForm/studentEntryFormUpdate.vue"
      ),
    beforeEnter: requireAuth(["Student"]),
  },
  {
    path: "/profile",
    name: "profile",
    props: true,
    component: () => import("../components/studentSide/profilePage.vue"),
    beforeEnter: requireAuth(["Student"]),
  },
  {
    path: "/projects",
    name: "projects",
    beforeEnter: (to, from, next) => {
      const userStore = useLoggedInUserStore();
      if (userStore.isLoggedIn) {
        if (userStore.getRole === "Student") {
          // Check for registered experiences before redirecting
          if (!userStore.hasRegisteredExperiences) {
            next("/studentDashboard");
          } else {
            next("/studentProjects");
          }
        } else if (
          ["Instructor", "Group Instructor", "Group Admin", "Org Admin"].includes(
            userStore.getRole
          )
        ) {
          next("/instructorProjects");
        } else {
          next("/error");
        }
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/studentProjects",
    name: "studentProjects",
    component: () =>
      import("../components/studentSide/projects/projectsMain.vue"),
    beforeEnter: requireStudentWithExperiences,
  },
  {
    path: "/proposeProject",
    name: "proposeProject",
    component: () =>
      import("../components/studentSide/projects/projectProposal.vue"),
    beforeEnter: requireStudentWithExperiences,
  },
  {
    path: "/editProjectProposal",
    name: "editProjectProposal",
    component: () =>
      import("../components/studentSide/projects/editProjectProposal.vue"),
    beforeEnter: requireStudentWithExperiences,
  },
  {
    path: "/viewProjectProposal",
    name: "viewProjectProposal",
    component: () =>
      import("../components/instructorSide/projects/viewProjectProposal.vue"),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/editProjectStudent",
    name: "editProjectStudent",
    component: () =>
      import("../components/studentSide/projects/editProject.vue"),
    beforeEnter: requireStudentWithExperiences,
  },
  {
    path: "/editProjectInstructor",
    name: "editProjectInstructor",
    component: () =>
      import("../components/instructorSide/projects/editProject.vue"),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorProjects",
    name: "instructorProjects",
    component: () =>
      import("../components/instructorSide/projects/projectsMain.vue"),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/mainAuthWrap",
    props: true,
    component: () => import("../components/loginPages/mainAuthWrap.vue"),
    children: [
      {
        path: "",
        name: "mainAuthWrap",
        redirect: "/login",
      },
      {
        path: "/login",
        name: "login",
        props: true,
        component: () => import("../components/loginPages/login.vue"),
      },
      {
        path: "/register",
        name: "register",
        props: true,
        component: () =>
          import("../components/loginPages/accountRegistration/register.vue"),
      },
      {
        path: "/verifyAccWithCode",
        name: "verifyAccWithCode",
        props: true,
        component: () =>
          import(
            "../components/loginPages/accountRegistration/verifyAccWithCode.vue"
          ),
      },
      {
        path: "/passResetRequest",
        name: "passResetRequest",
        props: true,
        component: () =>
          import("../components/loginPages/passReset/passResetRequest.vue"),
      },
      {
        path: "/passResetCode",
        name: "passResetCode",
        props: true,
        component: () =>
          import("../components/loginPages/passReset/passResetCode.vue"),
      },
      {
        path: "/passResetNewEntry",
        name: "passResetNewEntry",
        props: true,
        component: () =>
          import("../components/loginPages/passReset/passResetNewEntry.vue"),
      },
      {
        path: "/verifyAccWithEmailCode",
        name: "verifyAccWithEmailCode",
        props: true,
        component: () =>
          import(
            "../components/loginPages/accountRegistration/verifyAccWithEmailCode.vue"
          ),
      },
    ],
  },
  {
    path: "/dashboard",
    name: "dashboard",
    props: true,
    component: () => import("../components/defaultPages/dashboard.vue"),
  },
  {
    path: "/intakeform",
    name: "intakeForm",
    props: true,
    component: () => import("../components/defaultPages/intakeForm.vue"),
  },
  {
    path: "/findclient",
    name: "findClient",
    component: () => import("../components/defaultPages/findClient.vue"),
  },
  {
    path: "/updateclient/:id",
    name: "updateclient",
    props: true,
    component: () => import("../components/defaultPages/updateClient.vue"),
  },
  {
    path: "/eventform",
    name: "eventform",
    component: () => import("../components/defaultPages/eventForm.vue"),
  },
  {
    path: "/findEvents",
    name: "findEvents",
    component: () => import("../components/defaultPages/findEvents.vue"),
  },
  {
    path: "/eventDetails/:id",
    name: "eventdetails",
    props: true,
    component: () => import("../components/defaultPages/eventDetails.vue"),
  },
  {
    path: "/updatePassword",
    name: "updatePassword",
    props: true,
    component: () =>
      import("../components/loginPages/passReset/updatePassword.vue"),
    beforeEnter: isLoggedIn,
  },
  {
    path: "/updateUserInformation",
    name: "User Data Update Form",
    props: true,
    component: () => import("../components/loginPages/updateUserData.vue"),
    beforeEnter: isLoggedIn,
  },
  {
    path: "/sendNewCode",
    name: "Send New Code",
    props: true,
    component: () => import("../components/loginPages/sendNewCode.vue"),
  },
  {
    path: "/secondaryData/:id",
    name: "Secondary Data",
    props: true,
    component: () => import("../components/defaultPages/secondaryData.vue"),
  },
  {
    path: "/instructorDash",
    name: "instructorDash",
    component: () =>
      import("../components/instructorSide/instructorDash.vue"),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/studentGoalFormViewer",
    name: "StudentGoalFormViewer",
    component: () =>
      import(
        "../components/instructorSide/instructorProgressMonitor/studentGoalFormViewer.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorDataProducts",
    name: "instructorDataProducts",
    component: () =>
      import("../components/instructorSide/instructorDataProducts.vue"),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorStudentsList",
    name: "instructorStudentsList",
    component: () =>
      import("../components/instructorSide/instructorStudentsList.vue"),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorSpecificStudent",
    name: "instructorSpecificStudent",
    component: () =>
      import(
        "../components/instructorSide/instructorDataSpecifics/instructorSpecificStudent.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorDataManagement",
    name: "instructorDataManagement",
    component: () =>
      import(
        "../components/instructorSide/instructorDataManagement/instructorDataManagementMain.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorSessions",
    name: "instructorSessions",
    props: true,
    component: () =>
      import(
        "../components/instructorSide/instructorDataManagement/instructorSessions.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorAddSession",
    name: "instructorAddSession",
    component: () =>
      import(
        "../components/instructorSide/instructorAddData/instructorAddSession.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorSpecificSession",
    name: "instructorSpecificSession",
    component: () =>
      import(
        "../components/instructorSide/instructorDataSpecifics/instructorSpecificSession.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorAddExperienceInstance",
    name: "instructorAddExperienceInstance",
    component: () =>
      import(
        "../components/instructorSide/instructorAddData/instructorAddExperienceInstance.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorSpecificExperienceInstance",
    name: "instructorSpecificExperienceInstance",
    component: () =>
      import(
        "../components/instructorSide/instructorDataSpecifics/instructorSpecificExperienceInstance.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorExperiences",
    name: "instructorExperiences",
    component: () =>
      import(
        "../components/instructorSide/instructorDataManagement/instructorExperiences.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorAddExperience",
    name: "instructorAddExperience",
    component: () =>
      import(
        "../components/instructorSide/instructorAddData/instructorAddExperience.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorSpecificExperience",
    name: "instructorSpecificExperience",
    component: () =>
      import(
        "../components/instructorSide/instructorDataSpecifics/instructorSpecificExperience.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorAddActivity",
    name: "instructorAddActivity",
    component: () =>
      import(
        "../components/instructorSide/instructorAddData/instructorAddActivity.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorSpecificActivity",
    name: "instructorSpecificActivity",
    component: () =>
      import(
        "../components/instructorSide/instructorDataSpecifics/instructorSpecificActivity.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorProgressMonitorContainer",
    name: "instructorProgressMonitorContainer",
    component: () =>
      import(
        "../components/instructorSide/instructorProgressMonitor/instructorProgressMonitorContainer.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/instructorMailer",
    name: "instructorMailer",
    component: () =>
      import(
        "../components/instructorSide/instructorMailer/instructorMailerMain.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/studentsWithoutGoalForms",
    name: "studentsWithoutGoalForms",
    component: () =>
      import(
        "../components/instructorSide/instructorProgressMonitor/studentsWithoutGoalForms.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/studentsWithoutEntryForms",
    name: "studentsWithoutEntryForms",
    component: () =>
      import(
        "../components/instructorSide/instructorProgressMonitor/studentsWithoutEntryForms.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/studentsWithoutExitForms",
    name: "studentsWithoutExitForms",
    component: () =>
      import(
        "../components/instructorSide/instructorProgressMonitor/studentsWithoutExitForms.vue"
      ),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },
  {
    path: "/studentEntryForm",
    name: "studentEntryForm",
    props: true,
    component: () =>
      import("../components/studentSide/studentEntryForm/entryFormMain.vue"),
    beforeEnter: requireAuth(["Student"]),
  },
  {
    path: "/goalSettingForm",
    name: "goalSettingForm",
    component: () =>
      import("../components/studentSide/goalSettingForm/goalFormMain.vue"),
    beforeEnter: requireAuth(["Student"]),
  },
  {
    path: "/exitForm",
    name: "exitForm",
    component: () =>
      import("../components/studentSide/exitForm/exitFormMain.vue"),
    beforeEnter: requireAuth(["Student"]),
  },
  {
    path: "/studentDashboard",
    name: "studentDashboard",
    component: () =>
      import("../components/studentSide/studentDash/studentDashboard.vue"),
    beforeEnter: requireAuth(["Student"]),
  },
  {
    path: "/error",
    name: "errorView",
    component: () => import("../components/error/errorView.vue"),
  },
  // Public routes from develop_Project_Documents
  {
    path: "/publicProjects",
    name: "publicProjects",
    component: () => import("../components/dev/publicProjects.vue"),
  },
  {
    path: "/publicGallery",
    name: "publicGallery",
    component: () => import("../components/dev/publicGallery.vue"),
  },
  {
    path: "/publicGallery2",
    name: "publicGallery2",
    component: () => import("../components/dev/publicGallery2.vue"),
  },
  {
    path: "/kpis",
    name: "kpis",
    component: () => import("../components/dev/kpis.vue"),
  },
  // Public routes from develop_PublicView
  {
    path: "/public1",
    name: "public1",
    component: () => import("@/components/dev/public1.vue"),
  },
  {
    path: "/public2",
    name: "public2",
    component: () => import("@/components/dev/indProjectPage1.vue"),
  },
  {
    path: "/public3",
    name: "public3",
    component: () => import("@/components/dev/indProjectPage2.vue"),
  },
  {
    path: "/public4",
    name: "public4",
    component: () => import("@/components/dev/indProjectPage1-2.vue"),
  },
  {
    path: "/public5",
    name: "public5",
    component: () => import("@/components/dev/indProjectPage2-2.vue"),
  },
  {
    path: "/public6",
    name: "public6",
    component: () => import("@/components/dev/indProjectPage_engaged_data.vue"),
  },
  // Admin routes
  {
    path: "/admin/backup",
    name: "AdminBackupManager",
    component: () => import("@/components/admin/BackupDashboard.vue"),
    beforeEnter: requireAuth(["Org Admin"]),
  },

  // Dev Instructor Mailer (frontend-only demo)
  {
    path: "/dev/instructorMailer",
    name: "devInstructorMailer",
    component: () =>
      import("@/components/dev/instructorMailer/DevMailerMain.vue"),
    beforeEnter: requireAuth([
      "Instructor",
      "Group Instructor",
      "Group Admin",
      "Org Admin",
    ]),
  },

  // ==========================================================================
  // PROJECT VIEW ROUTES (Phase 6)
  // ==========================================================================

  // Project Editor - Create new project (authenticated, requires experiences)
  {
    path: "/projectEditor",
    name: "projectEditor",
    component: () =>
      import("@/components/dev/projectView/pages/ProjectEditorPage.vue"),
    beforeEnter: requireStudentWithExperiences,
  },

  // Project Editor - Edit existing project (authenticated, requires experiences)
  {
    path: "/projectEditor/:projectId",
    name: "projectEditorEdit",
    component: () =>
      import("@/components/dev/projectView/pages/ProjectEditorPage.vue"),
    beforeEnter: requireStudentWithExperiences,
  },

  // Public Project View - View published project (public, no auth required)
  {
    path: "/project/:projectId",
    name: "publicProjectView",
    component: () =>
      import("@/components/dev/projectView/pages/ProjectViewPage.vue"),
  },

  // Dev Preview - Direct access to editor for testing (public for dev purposes)
  {
    path: "/dev/projectPreview",
    name: "devProjectPreview",
    component: () =>
      import("@/components/dev/projectView/ProjectEditorMain.vue"),
  },
];

// Create router instance with base path
const router = createRouter({
  history: createWebHistory("/platform"),
  routes,
});

// Define public routes accessible without authentication
const publicPaths = [
  "/login",
  "/register",
  "/passResetRequest",
  "/passResetCode",
  "/passResetNewEntry",
  "/verifyAccWithCode",
  "/verifyAccWithEmailCode",
  "/sendNewCode",
  "/projectportal",
  "/createproject",
  "/createprojectstepper",
  "/updateproject",
  "/proposedprojects",
  "/viewproject",
  "/myprojects",
  "/public1",
  "/public2",
  "/public3",
  "/public4",
  // Carlos
  "/public5",
  // Phil Navya
  "/public6",
  // Project View public routes
  "/dev/projectPreview",
  "publicGallery2",
  "publicGallery",
  "publicProjects",
];

// Pattern-based public paths (for dynamic routes like /project/:projectId)
const publicPathPatterns = [
  /^\/project\/[^/]+$/,  // Matches /project/:projectId
];

// Public data routes — accessible to both authenticated and unauthenticated users.
// Unlike auth routes (login, register), these should NOT redirect logged-in users to their dashboard.
const publicDataPatterns = [
  /^\/project\/[^/]+$/,  // /project/:projectId — shared project view links
];

function isPublicDataPath(path) {
  return publicDataPatterns.some(pattern => pattern.test(path));
}

// const publicPaths = [
//   "/login",
//   "/register",
//   "/passResetRequest",
//   "/passResetCode",
//   "/passResetNewEntry",
//   "/verifyAccWithCode",
//   "/verifyAccWithEmailCode",
//   "/sendNewCode",
//   "/projectportal",
//   "/createproject",
//   "/createprojectstepper",
//   "/updateproject",
//   "/proposedprojects",
//   "/viewproject",
//   "/myprojects",
//   // From develop_Project_Documents
//   "/publicGallery",
//   "/publicGallery2",
//   "/publicProjects",
//   "/kpis",
//   // From develop_PublicView
//   "/proposaldemo1",
//   "/proposaldemo2",
//   "/proposaldemo3",
//   "/proposaldemo4",
//   "/public1",
//   "/public2",
//   "/public3",
//   "/public4",
//   "/public5",
//   "/public6",
// ];

/**
 * Check if a path is public (no authentication required)
 * @param {string} path - The route path to check
 * @returns {boolean} - True if the path is public
 */
function isPublicPath(path) {
  // Check exact matches
  if (publicPaths.includes(path)) {
    return true;
  }
  
  // Check pattern matches (for dynamic routes)
  return publicPathPatterns.some(pattern => pattern.test(path));
}

// Global navigation guard for authentication and role-based routing
router.beforeEach(async (to, from, next) => {
  const userStore = useLoggedInUserStore();
  const token = localStorage.getItem("token");
  const currentTime = Math.floor(Date.now() / 1000);

  const isPublicRoute = isPublicPath(to.path);

  if (token) {
    try {
      // Validate token and extract user information
      const payload = await verifyJWT(token);

      if (payload && payload.exp && payload.exp > currentTime) {
        // Update store with valid token data
        userStore.$patch({
          isLoggedIn: true,
          role: payload.userRole,
          userId: payload.userID,
          token: token,
        });

        // Handle temporary role users
        if (payload.userRole === "Temporary") {
          if (isPublicRoute) {
            next();
          } else {
            next("/verifyAccWithCode");
          }
        } else {
          // Redirect authenticated users away from public routes
          if (isPublicRoute) {
            // Public data routes (e.g. shared project links) — allow access for everyone
            if (isPublicDataPath(to.path)) {
              next();
            } else if (
              [
                "Instructor",
                "Group Instructor",
                "Group Admin",
                "Org Admin",
              ].includes(userStore.role)
            ) {
              next("/instructorDash");
            } else if (userStore.role === "Student") {
              next("/studentDashboard");
            } else {
              next("/");
            }
          } else {
            next();
          }
        }
      } else {
        // Handle expired token
        userStore.logout();
        next("/login");
      }
    } catch (error) {
      // Handle token verification errors
      console.error("Token verification failed in router:", error);
      userStore.logout();
      next("/login");
    }
  } else {
    // Handle unauthenticated access
    if (isPublicRoute) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;