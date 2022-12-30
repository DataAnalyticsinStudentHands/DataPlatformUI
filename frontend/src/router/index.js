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
    
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router