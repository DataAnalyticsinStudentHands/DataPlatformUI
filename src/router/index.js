import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
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
        component: () => import('../components/loginPages/updatePassword.vue')
        
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
      path: '/adminDash',
      name: 'adminDash',
      component: () => import('../components/adminSide/adminDash.vue')
    },
    {
      path: '/adminReports',
      name: 'adminReports',
      component: () => import('../components/adminSide/adminReports.vue')
    },
    {
      path: '/adminStudentsList',
      name: 'adminStudentsList',
      component: () => import('../components/adminSide/adminStudentsList.vue')
    },
    {
      path: '/adminSpecificStudent/:studentID',
      name: 'adminSpecificStudent',
      component: () => import('../components/adminSide/adminSpecificStudent.vue')
    },
    {
      path: '/adminSemesters',
      name: 'adminSemesters',
      component: () => import('../components/adminSide/adminSemesters.vue')
    },
    {
      path: '/adminAddSemester',
      name: 'adminAddSemester',
      component: () => import('../components/adminSide/adminAddSemester.vue')
    },
    {
      path: '/adminSpecificSemester',
      name: 'adminSpecificSemester',
      component: () => import('../components/adminSide/adminSpecificSemester.vue')
    },
    {
      path: '/adminExperiences',
      name: 'adminExperiences',
      component: () => import('../components/adminSide/adminExperiences.vue')
    },
    {
      path: '/adminAddExperience',
      name: 'adminAddExperience',
      component: () => import('../components/adminSide/adminAddExperience.vue')
    },
    {
      path: '/adminSpecificExperience',
      name: 'adminSpecificExperience',
      component: () => import('../components/adminSide/adminSpecificExperience.vue')
    },
    {
      path: '/adminActivities',
      name: 'adminActivities',
      component: () => import('../components/adminSide/adminActivities.vue')
    },
    {
      path: '/adminAddActivity',
      name: 'adminAddActivity',
      component: () => import('../components/adminSide/adminAddActivity.vue')
    },
    {
      path: '/adminSpecificActivity',
      name: 'adminSpecificActivity',
      component: () => import('../components/adminSide/adminSpecificActivity.vue')
    },
    {
      path: '/adminInactiveStudents',
      name: 'adminInactiveStudents',
      component: () => import('../components/adminSide/adminInactiveStudents.vue')
    },
    {
      path: '/adminInactiveSemestersExperiencesActivities',
      name: 'adminInactiveSemestersExperiencesActivities',
      component: () => import('../components/adminSide/adminInactiveSemestersExperiencesActivities.vue')
    },
    {
      path: '/studentEntryForm',
      name: 'studentEntryForm',
      props: true,
      component: () => import('../components/studentSide/studentEntryForm.vue')
    },
    {
      path: '/goalSettingForm',
      name: 'goalSettingForm',
      component: () => import('../components/studentSide/goalSettingForm.vue')
    },
    {
      path: '/exitForm',
      name: 'exitForm',
      component: () => import('../components/studentSide/exitForm.vue')
    }
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router