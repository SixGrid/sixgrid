<template>
    <div class="page-container">
    <router-view class="router-view" ref="router-view"/>
        <md-app style="width: 70px;">
            <md-app-drawer ref="app-drawer" :md-active.sync="menuVisible" md-persistent="mini">
                <md-toolbar class="md-transparent" md-elevation="0">
                        <span>Sixgrid {{ packageJSON.version }}</span>
                        <div class="md-toolbar-section-end">
                            <md-button class="md-icon-button md-dense" @click="toggleMenu">
                                <md-icon>keyboard_arrow_left</md-icon>
                            </md-button>
                        </div>
                </md-toolbar>

                <md-list>

                    <md-list-item to="/search">
                        <md-icon>search</md-icon>
                        <span class="md-list-item-text">Search</span>
                    </md-list-item>

                    <md-list-item to="/favorite">
                        <md-icon>star</md-icon>
                        <span class="md-list-item-text">Favorites</span>
                    </md-list-item>

                    <md-list-item to="/downloadmanager">
                        <md-icon>cloud_download</md-icon>
                        <span class="md-list-item-text">Download Manager</span>
                    </md-list-item>

                    <md-list-item to="/account/about">
                        <md-icon>person</md-icon>
                        <span class="md-list-item-text">Account</span>
                    </md-list-item>

                    <md-list-item to="/settings">
                        <md-icon>settings</md-icon>
                        <span class="md-list-item-text">Settings</span>
                    </md-list-item>
                    <template v-if="localStorage.Debug != undefined && localStorage.Debug == 'true'">
                        <md-list-item to="/debug">
                            <md-icon>bug_report</md-icon>
                            <span class="md-list-item-text">Debug</span>
                        </md-list-item>
                    </template>
                    <md-list-item to="/about">
                        <md-icon>support</md-icon>
                        <span class="md-list-item-text">About</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>
        </md-app>
    </div>
</template>
<style scoped>
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
.container {
        width: calc(100% - 120px);
        margin: 25px;
}
:root {
    --md-theme-default-primary: #ec407a !important;
    --md-theme-default-accent: #9575cd !important;
}
</style>
<script>
export default {
    name: 'sixgrid',
    data () {
        return {
            menuVisible: false,
            packageJSON: require('./../../package.json'),
            localStorage: localStorage
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
    }
}
</script>
<style>
@import url("//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons");

.md-card-area {
        background: rgba(0, 0, 0, 0.9) !important;
}
</style>
