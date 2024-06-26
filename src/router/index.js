import { createRouter, createWebHistory } from 'vue-router'
import { useLoggedInUserStore } from '../stored/loggedInUser'; 



const routes = [
    {
      path: '/',
      name: 'Home',
      redirect: '/login'
    },
    {
      path: '/studentEntryFormUpdate',
      name: 'studentEntryFormUpdate',
      props: true,
      component: () => import('../components/studentSide/studentEntryForm/studentEntryFormUpdate.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      props: true,
      component: () => import('../components/studentSide/profilePage.vue')
    },
    {
      path: '/mainAuthWrap',
      name: 'mainAuthWrap',
      props: true,
      component: () => import('../components/loginPages/mainAuthWrap.vue'),
      children: [
        {
          path: '',
          redirect: '/login'
        },
        {
          path: '/login', 
          name: 'login',
          props: true,
          component: () => import('../components/loginPages/login.vue')
        },
        {
          path: '/register', 
          name: 'register',
          props: true,
          component: () => import('../components/loginPages/accountRegistration/register.vue')
        },
        {
          path: '/verifyAccWithCode',
          name: 'verifyAccWithCode',
          props: true,
          component: () => import('../components/loginPages/accountRegistration/verifyAccWithCode.vue')
        },
        {
          path: '/passResetRequest',
          name: 'passResetRequest',
          props: true,
          component: () => import('../components/loginPages/passReset/passResetRequest.vue')
        },
        {
          path: '/passResetCode',
          name: 'passResetCode',
          props: true,
          component: () => import('../components/loginPages/passReset/passResetCode.vue')
        },
        {
          path: '/passResetNewEntry',
          name: 'passResetNewEntry',
          props: true,
          component: () => import('../components/loginPages/passReset/passResetNewEntry.vue')
        },
        {
          path: '/verifyAccWithEmailCode',
          name: 'verifyAccWithEmailCode',
          props: true,
          component: () => import('../components/loginPages/accountRegistration/verifyAccWithEmailCode.vue')
        },
      ]
    },    
    {
        path: '/dashboard',
        name: 'dashboard',
        props: true,
        component: () => import('../components/defaultPages/dashboard.vue')
    },
    {
        path: '/intakeform',
        name: 'intakeForm',
        props: true,
        component: () => import('../components/defaultPages/intakeForm.vue')
    },
    {
        path: '/findclient',
        name: 'findClient',
        component: () => import('../components/defaultPages/findClient.vue')
    },
    {
        path: '/updateclient/:id',
        name: 'updateclient',
        props: true,
        component: () => import('../components/defaultPages/updateClient.vue')
    },
    {
        path: '/eventform',
        name: 'eventform',
        component: () => import('../components/defaultPages/eventForm.vue')
    },
    {
        path: '/findEvents',
        name: 'findEvents',
        component: () => import('../components/defaultPages/findEvents.vue')
    },
    {
        path: '/eventDetails/:id',
        name: 'eventdetails',
        props: true,
        component: () => import('../components/defaultPages/eventDetails.vue')
    }, 
    {
        path: '/updatePassword',
        name: 'updatePassword',
        props: true,
        component: () => import('../components/loginPages/passReset/updatePassword.vue'),
        beforeEnter: (to, from, next) => {
          const userStore = useLoggedInUserStore();
          if (!userStore.isLoggedIn) {
            next('/error');
          } else {
            next();
          }
        }
    },
    {
      path: '/updateUserInformation',
      name: 'User Data Update Form',
      props: true,
      component: () => import('../components/loginPages/updateUserData.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn) {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
        path: '/sendNewCode',
        name: 'Send New Code',
        props: true,
        component: () => import('../components/loginPages/sendNewCode.vue')
    },
    {
        path: '/secondaryData/:id',
        name: 'Secondary Data',
        props: true,
        component: () => import('../components/defaultPages/secondaryData.vue')
        
    },
    {
      path: '/instructorDash',
      name: 'instructorDash',
      component: () => import('../components/instructorSide/instructorDash.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/studentGoalFormViewer',
      name: 'StudentGoalFormViewer',
      component: () => import('../components/instructorSide/instructorProgressMonitor/studentGoalFormViewer.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorDataProducts',
      name: 'instructorDataProducts',
      component: () => import('../components/instructorSide/instructorDataProducts.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorStudentsList',
      name: 'instructorStudentsList',
      component: () => import('../components/instructorSide/instructorStudentsList.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorSpecificStudent',
      name: 'instructorSpecificStudent',
      component: () => import('../components/instructorSide/instructorDataSpecifics/instructorSpecificStudent.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
        path: '/instructorDataManagement',
        name: 'instructorDataManagement',
        component: () => import('../components/instructorSide/instructorDataManagement/instructorDataManagementMain.vue'),
        beforeEnter: (to, from, next) => {
          const userStore = useLoggedInUserStore();
          if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
            next('/error');
          } else {
            next();
          }
        },
    },
    {
      path: '/instructorSessions',
      name: 'instructorSessions',
      props: true,
      component: () => import('../components/instructorSide/instructorDataManagement/instructorSessions.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorAddSession',
      name: 'instructorAddSession',
      component: () => import('../components/instructorSide/instructorAddData/instructorAddSession.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorSpecificSession',
      name: 'instructorSpecificSession',
      component: () => import('../components/instructorSide/instructorDataSpecifics/instructorSpecificSession.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorAddExperienceInstance',
      name: 'instructorAddExperienceInstance',
      component: () => import('../components/instructorSide/instructorAddData/instructorAddExperienceInstance.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorSpecificExperienceInstance',
      name: 'instructorSpecificExperienceInstance',
      component: () => import('../components/instructorSide/instructorDataSpecifics/instructorSpecificExperienceInstance.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorExperiences',
      name: 'instructorExperiences',
      component: () => import('../components/instructorSide/instructorDataManagement/instructorExperiences.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorAddExperience',
      name: 'instructorAddExperience',
      component: () => import('../components/instructorSide/instructorAddData/instructorAddExperience.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorSpecificExperience',
      name: 'instructorSpecificExperience',
      component: () => import('../components/instructorSide/instructorDataSpecifics/instructorSpecificExperience.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorAddActivity',
      name: 'instructorAddActivity',
      component: () => import('../components/instructorSide/instructorAddData/instructorAddActivity.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },    
    {
      path: '/instructorSpecificActivity',
      name: 'instructorSpecificActivity',
      component: () => import('../components/instructorSide/instructorDataSpecifics/instructorSpecificActivity.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorProgressMonitorContainer',
      name: 'instructorProgressMonitorContainer',
      component: () => import('../components/instructorSide/instructorProgressMonitor/instructorProgressMonitorContainer.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/instructorMailer',
      name: 'instructorMailer',
      component: () => import('../components/instructorSide/instructorMailer/instructorMailerMain.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/studentsWithoutGoalForms',
      name: 'studentsWithoutGoalForms',
      component: () => import('../components/instructorSide/instructorProgressMonitor/studentsWithoutGoalForms.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/studentsWithoutEntryForms',
      name: 'studentsWithoutEntryForms',
      component: () => import('../components/instructorSide/instructorProgressMonitor/studentsWithoutEntryForms.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/studentsWithoutExitForms',
      name: 'studentsWithoutExitForms',
      component: () => import('../components/instructorSide/instructorProgressMonitor/studentsWithoutExitForms.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Instructor') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/studentEntryForm',
      name: 'studentEntryForm',
      props: true,
      component: () => import('../components/studentSide/studentEntryForm/entryFormMain.vue'),
      beforeEnter: (to, from, next) => {
        // Use the Pinia store
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Student') {
          next('/error');
        } else {
          next();
        }
      },
    },
    {
      path: '/goalSettingForm',
      name: 'goalSettingForm',
      component: () => import('../components/studentSide/goalSettingForm/goalFormMain.vue'),
      beforeEnter: (to, from, next) => {
        // Use the Pinia store
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Student') {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/exitForm',
      name: 'exitForm',
      component: () => import('../components/studentSide/exitForm/exitFormMain.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Student') {
          next('/error');
        } else {
          next();
        }
      }
    },    
    // {
    //   path: '/exitFormsAvailable',
    //   name: 'exitFormsAvailable',
    //   component: () => import('../components/studentSide/exitFormsAvailable.vue'),
    //   beforeEnter: (to, from, next) => {
    //     // Use the Pinia store
    //     const userStore = useLoggedInUserStore();
    //     if (!userStore.isLoggedIn || userStore.role !== 'Student') {
    //       next('/error');
    //     } else {
    //       next();
    //     }
    //   }
    // },
    {
      path: '/studentDashboard',
      name: 'studentDashboard',
      component: () => import('../components/studentSide/studentDash/studentDashboard.vue'),
      beforeEnter: (to, from, next) => {
        // Use the Pinia store
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Student') {
          next('/error');
        } else {
          next();
        }
      }
    },    
    {
      path: '/error',
      name: 'errorView',
      component: () => import('../components/error/errorView.vue')
    },
]
const router = createRouter({
    history: createWebHistory('/platform/'), 
    base: "/platform/", 
    routes
})
export default router