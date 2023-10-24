import { createRouter, createWebHistory } from 'vue-router'
import { useLoggedInUserStore } from '../stored/loggedInUser'; 


const routes = [
    {
      path: '/',
      // name: 'Home',
      // props: true,
      // component: () => import('../components/loginPages/login.vue')
      redirect: '/testLogin'
      
  },
    {
      path: '/studentEntryFormUpdate',
      name: 'studentEntryFormUpdate',
      props: true,
      component: () => import('../components/studentSide/studentEntryFormUpdate.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      props: true,
      component: () => import('../components/studentSide/profilePage.vue')
    },
    {
      path: '/test1',
      name: 'test1',
      props: true,
      component: () => import('../components/test1.vue')
    },
    {
      path: '/test2',
      name: 'test2',
      props: true,
      component: () => import('../components/loginPages/test2.vue'),
      children: [
        {
          path: '',
          redirect: '/testLogin'
        },
        {
          path: '/testLogin', // Note: Don't need the leading slash for child paths
          name: 'testLogin',
          props: true,
          component: () => import('../components/loginPages/testLogin.vue')
        },
        {
          path: '/testRegister', // Note: Don't need the leading slash for child paths
          name: 'testRegister',
          props: true,
          component: () => import('../components/loginPages/testRegister.vue')
        },
        {
          path: '/testVerifyExisting',
          name: 'testVerifyExisting',
          props: true,
          component: () => import('../components/loginPages/testVerifyExisting.vue')
        },
        {
          path: '/testResetPass',
          name: 'testResetPass',
          props: true,
          component: () => import('../components/loginPages/testResetPass.vue')
        },
        {
          path: '/testResetPassCode',
          name: 'testResetPassCode',
          props: true,
          component: () => import('../components/loginPages/testResetPassCode.vue')
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
        path: '/registerForm',
        name: 'Register',
        props: true,
        component: () => import('../components/loginPages/registerForm.vue')
    },
    {
      path: '/login',
      name: 'Login',
      props: true,
      component: () => import('../components/loginPages/login.vue')
      
  },
    {
        path: '/verify',
        name: 'Account Confirmation',
        props: true,
        component: () => import('../components/loginPages/accountConfirmed.vue')
        
    },
    {
        path: '/resetPassword',
        name: 'Password Reset',
        props: true,
        component: () => import('../components/loginPages/resetPassword.vue')
        
    },
    {
      path: '/resetPasswordForm',
      name: 'Password Reset Form',
      props: true,
      component: () => import('../components/loginPages/resetPasswordForm.vue')
    },    
    {
        path: '/updatePasswordForm',
        name: 'Password Update Form',
        props: true,
        component: () => import('../components/loginPages/updatePassword.vue'),
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
      component: () => import('../components/instructorSide/instructorSpecificStudent.vue'),
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
      path: '/instructorSemesters',
      name: 'instructorSemesters',
      props: true,
      component: () => import('../components/instructorSide/instructorSemesters.vue'),
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
      path: '/instructorAddSemester',
      name: 'instructorAddSemester',
      component: () => import('../components/instructorSide/instructorAddSemester.vue'),
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
      path: '/instructorSpecificSemester',
      name: 'instructorSpecificSemester',
      component: () => import('../components/instructorSide/instructorSpecificSemester.vue'),
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
      component: () => import('../components/instructorSide/instructorExperiences.vue'),
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
      component: () => import('../components/instructorSide/instructorAddExperience.vue'),
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
      component: () => import('../components/instructorSide/instructorSpecificExperience.vue'),
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
      path: '/instructorActivities',
      name: 'instructorActivities',
      component: () => import('../components/instructorSide/instructorActivities.vue'),
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
      component: () => import('../components/instructorSide/instructorAddActivity.vue'),
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
      component: () => import('../components/instructorSide/instructorSpecificActivity.vue'),
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
      component: () => import('../components/studentSide/studentEntryForm.vue'),
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
      path: '/goalSettingForm',
      name: 'goalSettingForm',
      component: () => import('../components/studentSide/goalSettingForm.vue'),
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
      component: () => import('../components/studentSide/exitForm.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useLoggedInUserStore();
        if (!userStore.isLoggedIn || userStore.role !== 'Student') {
          next('/error');
        } else {
          next();
        }
      }
    },    
    {
      path: '/exitFormsAvailable',
      name: 'exitFormsAvailable',
      component: () => import('../components/studentSide/exitFormsAvailable.vue'),
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
      path: '/studentDashboard',
      name: 'studentDashboard',
      component: () => import('../components/studentSide/studentDashboard.vue'),
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