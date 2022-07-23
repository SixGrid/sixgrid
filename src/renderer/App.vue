<template>
    <div class="page-container">
    <router-view class="router-view" ref="router-view"/>
        <md-app style="width: 70px;">
            <md-app-drawer class="main-app-draw-vue" ref="app-drawer" :md-active.sync="menuVisible" md-persistent="mini">
                <md-toolbar class="md-transparent" md-elevation="0">
                        <span>Sixgrid {{ packageJSON.version }}</span>
                        <div class="md-toolbar-section-end">
                            <md-button class="md-icon-button md-dense" @click="toggleMenu">
                                <md-icon>keyboard_arrow_left</md-icon>
                            </md-button>
                        </div>
                </md-toolbar>

                    <div class="current-route">{{ currentRoute.name }}</div>
                <md-list>
                    <template v-for="(item, index) in menuItems">
                        <template v-if="item.enable != undefined && typeof item.enable == 'function' ? item.enable() : true">
                            <md-list-item v-bind:key="`sidebar-list-location-${index}`" :to="item.location" :class="item.class != undefined ? item.class : ''">
                                <md-icon>{{ item.icon }}</md-icon>
                                <span class="md-list-item-text">{{ item.label }}</span>
                            </md-list-item>
                        </template>
                    </template>
                </md-list>
            </md-app-drawer>
        </md-app>
    </div>
</template>
<style scoped>
.current-route {
    margin-top: 8px;
    width: 70px;
    height: 12px;
    line-height: 10px;
    font-size: 12px;
    line-gap-override: 0px;
    vertical-align: middle;
    text-align: center;
    overflow-wrap:normal;
    white-space: initial !important;
}
.selected {
    background-color: var(--md-theme-default-primary);
}
.page-container {
    position: fixed;
    top: 0;
    left: 0;
    overflow-x: hidden;
    width: 100vw;
}
.md-app {
    overflow-x: hidden;
    z-index: 10;
    background: none !important;
}
.page-container .md-app {
    height: 100vh;
}
.router-view {
    position: absolute;
    top: 0;
    left: 70px;
    max-width: calc(100vw - 70px);
}
.md-drawer {
    height: 100vh;
    position: fixed;
    top: -72px;
    left: 0;
}
</style>
<style>
.main-app-draw-vue {
    height: 100vh;
    margin-top: 0.5rem;
}
.container {
        width: calc(100% - 120px);
        margin: 25px;
}
/*:root {
    --md-theme-default-primary: #ec407a !important;
    --md-theme-default-accent: #9575cd !important;
}*/
pre.code {
    padding: 0.5rem;
    background: black;
    border-radius: 0.5rem;
}
</style>
<script>
export default {
    name: 'sixgrid',
    data () {
        return {
            menuVisible: false,
            packageJSON: require('./../../package.json'),
            localStorage: localStorage,
            currentRoute: vueJS.$route,
            menuItems: [
                {
                    icon: 'apps',
                    label: 'SixGrid',
                    location: '/',
                    class: 'selected'
                },
                {
                    icon: 'search',
                    label: 'Search',
                    location: '/search'
                },
                {
                    icon: 'star',
                    label: 'Favorites',
                    location: '/favorites'
                },
                // {
                //     icon: 'cloud_download',
                //     label: 'Download Manager',
                //     location: '/downloadmanager'
                // },
                // {
                //     icon: 'person',
                //     label: 'Account',
                //     location: '/account/about'
                // },
                {
                    icon: 'settings',
                    label: 'Settings',
                    location: '/settings'
                },
                {
                    icon: 'bug_report',
                    label: 'Debug',
                    location: '/debug',
                    enable () {
                        return (localStorage.Debug != undefined && localStorage.Debug) || require('electron').remote.app.commandLine.hasSwitch('developer')
                    }
                },
                {
                    icon: 'support',
                    label: 'About',
                    location: '/about'
                }
            ]
        }
    },
    mounted () {
        var $ = require('jquery')
        $(this.$refs['app-drawer']).width(parseInt(this.$refs['app-drawer'].getDrawerWidth().replace("px", "")))
        $(document).on('click', () => {
            setTimeout(() => {
            }, 1000)
        })
    },
    created () {
        document.styleSheets[0].insertRule(`:root{ --screen-width: ${window.innerWidth}px; --screen-height: ${window.innerHeight}px;`)
    },
    methods: {
        toggleMenu () {
            this.menuVisible = !this.menuVisible
        },
        updateContentWidth () {
                console.log(this)
                let drawer = $(this.$refs['app-drawer'])
                let getDrawerWidth = parseInt(this.$refs['app-drawer'].getDrawerWidth().replace("px", ""))
                getDrawerWidth = getDrawerWidth + 35
                $(this.$refs['app-content'].$el).width(window.innerWidth - getDrawerWidth)
        }
    },
    watch: {
        $route (to, from) {
            console.log(`[$route -> from]${from.path}\n[$route -> to  ]${to.path}`)
            this.$data.currentRoute = from
            console.log(from)
            this.$set(this.$data, 'currentRoute', to)
        }
    }
}
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons");

.md-card-area {
        background: rgba(0, 0, 0, 0.9) !important;
}
</style>
