import {createRouter, createWebHistory} from '@ionic/vue-router';
//@ts-ignore
import { routes,handleHotUpdate } from 'vue-router/auto-routes'
import {useGlobalStore} from "@/stores/globalStore";

console.table(routes)

const publicRoutes = ['/', '/otp', '/verification']

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

if (import.meta.hot) {
    handleHotUpdate(router)
}

router.beforeEach(async (to, from, next) => {

    const usr = localStorage.getItem('user')

    if (publicRoutes.includes(to.path)) {
        if (usr) {
            next(`/dashboard`)
        } else
            next()
    } else {
        const globalStore = useGlobalStore()
        if (usr) {
            globalStore.user = usr
            next()
        } else next('/')
    }
})

export default router
