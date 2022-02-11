import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
    },
    {
        path: '/intakeform',
        name: 'intakeForm',
        component: () => import('../components/intakeForm')
    }, {
        path: '/findclient',
        name: 'findClient',
        component: () => import('../components/findClient')
    }]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router