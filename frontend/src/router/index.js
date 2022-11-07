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
        path: '/social-intake',
        name: 'socialIntake',
        props: true,
        component: () => import('../components/socialIntakeForm.vue')
    },
    {
        path: '/pre-social-intake',
        name: 'presocialIntake',
        props: true,
        component: () => import('../components/selectSocialIntake.vue')
    },
    {
        path: '/BPSintake',
        name: 'BPSintake',
        props: true,
        component: () => import('../components/BPSintake.vue')
    },
    {
        path: '/attorney-closed-case',
        name: 'attorneyClosedCase',
        props: true,
        component: () => import('../components/attorneyClosedCase.vue')
    },
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router