import {createRouter, createWebHistory} from '@ionic/vue-router';
import {useGlobal} from "@/composables/useGlobal";
import type { RouteRecordRaw } from 'vue-router';

const publicRoutes = ['/', '/otp', '/verification', '/dashboard_new', '/welcome1', '/welcome2', '/welcome3',]

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/pages/welcome/welcome1.vue')
    },
    {
        path: '/otp',
        component: () => import('@/pages/otp.vue')
    },
    {
        path: '/verification',
        component: () => import('@/pages/verification.vue')
    },
    {
        path: '/dashboard',
        component: () => import('@/pages/dashboard.vue'),
    },
    {
        path: '/survey',
        component: () => import('@/pages/survey.vue')
    },
    {
        path: '/questions',
        component: () => import('@/pages/questions.vue')
    },
    {
        path: '/statistics',
        component: () => import('@/pages/statistics.vue')
    },
    {
        path: '/interests',
        component: () => import('@/pages/interests.vue')
    },
    {
        path: '/bio',
        component: () => import('@/pages/bio.vue')
    },
    {
        path: '/instructions',
        component: () => import('@/pages/instructions.vue')
    },
    {
        path: '/picture',
        component: () => import('@/pages/picture.vue')
    },
    {
        path: '/match_filters',
        component: () => import('@/pages/match_filters.vue')
    },
    {
        path: '/match_filters_new',
        component: () => import('@/pages/matchi_filters_new.vue')
    },
    {
        path: '/searching',
        component: () => import('@/pages/searching.vue')
    },
    {
        path: '/settings',
        component: () => import('@/pages/settings.vue')
    },
    {
        path: '/chat',
        component: () => import('@/pages/chat.vue')
    },
    {
        path: '/profile_visit',
        component: () => import('@/pages/profile_visit.vue')
    },
    {
        path: '/notification',
        component: () => import('@/pages/notification.vue')
    },
    {
        path: '/welcome1',
        component: () => import('@/pages/welcome/welcome1.vue')
    },
    {
        path: '/welcome2',
        component: () => import('@/pages/welcome/welcome2.vue')
    },
    {
        path: '/welcome3',
        component: () => import('@/pages/welcome/welcome3.vue')
    },
    {
        path: '/feedback',
        component: () => import('@/pages/feedback.vue')
    },

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {

    const usr = localStorage.getItem('user')
    const globalStore = useGlobal()

    if (publicRoutes.includes(to.path)) {
        if (usr) {
            next(`/dashboard`)
        } else
            next()
    } else {
        if (usr) {
            globalStore.user.value = JSON.parse(usr)
            next()
        } else next('/welcome1')
    }
})

export default router
