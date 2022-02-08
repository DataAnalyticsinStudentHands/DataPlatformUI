import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/intakeform/',
        name: 'intakeForm',
        component: () => import('../components/intakeForm')
    },]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router