import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Homepage',
            component: require('@/components/Home').default
        },
        {
            path: '/search',
            name: 'Search Tool',
            component: require('@/components/Search').default
        },
        {
            path: '/about',
            name: 'About Program',
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
        }
    ]
})
