import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/intakeform',
        name: 'intakeForm',
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
        path: '/userCreation',
        name: 'userCreation',
        props: true,
        component: () => import('../components/userCreation')
    },
    {
        path: '/userLogin',
        name: 'userLogin',
        props: true,
        component: () => import('../components/userLoginNoGoogle')
    }
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router