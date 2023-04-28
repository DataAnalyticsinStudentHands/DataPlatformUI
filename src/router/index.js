import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        props: true,
        component: () => import('../components/dashboard.vue')
    },
    {
        path: '/intakeform',
        name: 'intakeForm',
        props: true,
        component: () => import('../components/intakeForm.vue')
    },
    {
        path: '/findclient',
        name: 'findClient',
        component: () => import('../components/findClient.vue')
    },
    {
        path: '/updateclient/:id',
        name: 'updateclient',
        props: true,
        component: () => import('../components/updateClient.vue')
    },
    {
        path: '/eventform',
        name: 'eventform',
        component: () => import('../components/eventForm.vue')
    },
    {
        path: '/findEvents',
        name: 'findEvents',
        component: () => import('../components/findEvents.vue')
    },
    {
        path: '/eventDetails/:id',
        name: 'eventdetails',
        props: true,
        component: () => import('../components/eventDetails.vue')
    },
    {
        path: '/registerForm',
        name: 'Register',
        props: true,
        component: () => import('../components/registerForm.vue')
    },
    {
        path: '/login',
        name: 'Login',
        props: true,
        component: () => import('../components/login.vue')
        
    },
    {
        path: '/verify',
        name: 'Account Confirmation',
        props: true,
        component: () => import('../components/accountConfirmed.vue')
        
    },
    {
        path: '/resetPassword',
        name: 'Password Reset',
        props: true,
        component: () => import('../components/resetPassword.vue')
        
    },
    {
        path: '/resetPasswordForm',
        name: 'Password Reset Form',
        props: true,
        component: () => import('../components/resetPasswordForm.vue')
        
    },
    {
        path: '/updatePasswordForm',
        name: 'Password Update Form',
        props: true,
        component: () => import('../components/updatePassword.vue')
        
    },
    {
        path: '/sendNewCode',
        name: 'Send New Code',
        props: true,
        component: () => import('../components/sendNewCode.vue')
        
    },
    {
        path: '/secondaryData/:id',
        name: 'Secondary Data',
        props: true,
        component: () => import('../components/secondaryData.vue')
        
    },
    {
      path: '/adminDash',
      name: 'adminDash',
      component: () => import('../components/adminDash.vue')
    },
    {
      path: '/adminReports',
      name: 'adminReports',
      component: () => import('../components/adminReports.vue')
    },
    {
      path: '/adminStudentsList',
      name: 'adminStudentsList',
      component: () => import('../components/adminStudentsList.vue')
    },
    {
      path: '/adminSpecificStudent/:studentID',
      name: 'adminSpecificStudent',
      component: () => import('../components/adminSpecificStudent.vue')
    },
    {
      path: '/adminSemesters',
      name: 'adminSemesters',
      component: () => import('../components/adminSemesters.vue')
    },
    {
      path: '/adminAddSemester',
      name: 'adminAddSemester',
      component: () => import('../components/adminAddSemester.vue')
    },
    {
      path: '/adminSpecificSemester',
      name: 'adminSpecificSemester',
      component: () => import('../components/adminSpecificSemester.vue')
    },
    {
      path: '/adminExperiencesActivities',
      name: 'adminExperiencesActivities',
      component: () => import('../components/adminExperiencesActivities.vue')
    },
    {
      path: '/adminAddExperience',
      name: 'adminAddExperience',
      component: () => import('../components/adminAddExperience.vue')
    },
    {
      path: '/adminSpecificExperience',
      name: 'adminSpecificExperience',
      component: () => import('../components/adminSpecificExperience.vue')
    },
    {
      path: '/adminActivities',
      name: 'adminActivities',
      component: () => import('../components/adminActivities.vue')
    },
    {
      path: '/adminAddActivity',
      name: 'adminAddActivity',
      component: () => import('../components/adminAddActivity.vue')
    },
    {
      path: '/adminSpecificActivity',
      name: 'adminSpecificActivity',
      component: () => import('../components/adminSpecificActivity.vue')
    },
    {
      path: '/adminInactiveStudents',
      name: 'adminInactiveStudents',
      component: () => import('../components/adminInactiveStudents.vue')
    },
    {
      path: '/adminInactiveExperiencesActivities',
      name: 'adminInactiveExperiencesActivities',
      component: () => import('../components/adminInactiveExperiencesActivities.vue')
    }
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router