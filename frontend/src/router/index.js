import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/intakeform',
        name: 'intakeForm',
        component: () => import('../components/intakeForm')
    }, {
        path: '/findclient',
        name: 'findClient',
        component: () => import('../components/findClient')
    },
    {
        path: '/commondataform',
        name: 'commonDataForm',
        component: () => import('../components/commonDataForm')
    }

]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router