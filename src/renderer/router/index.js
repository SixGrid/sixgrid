import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'SixGrid',
            component: require('@/components/Home').default
        },
        {
            path: '/search',
            name: 'Search',
            component: require('@/components/Search/index').default
        },
        {
            path: '/about',
            name: 'About',
            component: require('@/components/About').default
        },
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/debug',
            name: 'Debug',
            component: require('@/components/Debug').default
        },
        {
            path: '/settings',
            name: 'Settings',
            component: require('@/components/Settings').default
        },
        {
            path: '/favorites',
            name: 'Favorites',
            component: require('@/components/Favorites').default
        },
        {
            path: '/script/manager',
            name: 'Scripts',
            component: require('@/components/ScriptManager').default
        },
        {
            path: '/debug/SteamStorePage',
            name: 'SteamStorePage',
            component: require('@/components/SteamStorePage').default
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: require('@/components/NotImplemented').default
        }
    ]
})
