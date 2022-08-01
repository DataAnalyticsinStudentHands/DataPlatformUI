import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../components/dashboard')
    },
    {
        path: '/intakeform',
        name: 'intakeForm',
        props: true,
        component: () => import('../components/intakeForm')
    },
    {
        path: '/findclient',
        name: 'findClient',
        component: () => import('../components/findClient')
    },
    {
        path: '/commondataform/:id',
        name: 'commonDataForm',
        props: true,
        component: () => import('../components/commonDataForm')
    },
    {
        path: '/clientdetails/:id',
        name: 'clientdetails',
        props: true,
        component: () => import('../components/clientDetails')
    },
    {
        path: '/eventform',
        name: 'eventform',
        component: () => import('../components/eventForm')
    },
    {
        path: '/findEvents',
        name: 'findEvents',
        component: () => import('../components/findEvents')
    },
    {
        path: '/eventDetails/:id',
        name: 'eventdetails',
        props: true,
        component: () => import('../components/eventDetails')
    },
    {
        path: '/social-intake',
        name: 'socialIntake',
        props: true,
        component: () => import('../components/socialIntakeForm')
    },
    {
        path: '/bio-psycho-social',
        name: 'bioPsycoSocial',
        props: true,
        component: () => import('../components/bioPsychoSocial')
    },
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router