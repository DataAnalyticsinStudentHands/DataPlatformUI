import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/testing',
      name: 'testing',
      props: true,
      component: () => import('../components/studentSide/testing.vue')
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
      path: '/updateUserInformation',
      name: 'User Data Update Form',
      props: true,
      component: () => import('../components/loginPages/updateUserData.vue')
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
      component: () => import('../components/instructorSide/instructorDash.vue')
    },
    {
      path: '/instructorReports',
      name: 'instructorReports',
      component: () => import('../components/instructorSide/instructorReports.vue')
    },
    {
      path: '/instructorStudentsList',
      name: 'instructorStudentsList',
      component: () => import('../components/instructorSide/instructorStudentsList.vue')
    },
    {
      path: '/instructorSpecificStudent/:userID',
      name: 'instructorSpecificStudent',
      component: () => import('../components/instructorSide/instructorSpecificStudent.vue')
    },
    {
      path: '/instructorSemesters',
      name: 'instructorSemesters',
      component: () => import('../components/instructorSide/instructorSemesters.vue')
    },
    {
      path: '/instructorAddSemester',
      name: 'instructorAddSemester',
      component: () => import('../components/instructorSide/instructorAddSemester.vue')
    },
    {
      path: '/instructorSpecificSemester',
      name: 'instructorSpecificSemester',
      component: () => import('../components/instructorSide/instructorSpecificSemester.vue')
    },
    {
      path: '/instructorExperiences',
      name: 'instructornExperiences',
      component: () => import('../components/instructorSide/instructorExperiences.vue')
    },
    {
      path: '/instructorAddExperience',
      name: 'instructorAddExperience',
      component: () => import('../components/instructorSide/instructorAddExperience.vue')
    },
    {
      path: '/instructorSpecificExperience',
      name: 'instructorSpecificExperience',
      component: () => import('../components/instructorSide/instructorSpecificExperience.vue')
    },
    {
      path: '/instructorActivities',
      name: 'instructorActivities',
      component: () => import('../components/instructorSide/instructorActivities.vue')
    },
    {
      path: '/instructorAddActivity',
      name: 'instructorAddActivity',
      component: () => import('../components/instructorSide/instructorAddActivity.vue')
    },
    {
      path: '/instructorSpecificActivity',
      name: 'instructorSpecificActivity',
      component: () => import('../components/instructorSide/instructorSpecificActivity.vue')
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
    },
    {
      path: '/studentDashboard',
      name: 'studentDashboard',
      component: () => import('../components/studentSide/studentDashboard.vue')
    }
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router