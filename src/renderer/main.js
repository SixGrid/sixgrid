import './AppData'
import './LocalStorageParameter'

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'

import VueMaterial  from 'vue-material'
import * as packageJSON from '../../package.json'

import 'vue-material/dist/vue-material.min.css'
import { ipcRenderer } from 'electron'

window.toastr = require('toastr')

// import dark mode css when enabled
if (require('electron').remote.nativeTheme.shouldUseDarkColors) {
    require('vue-material/dist/theme/default-dark.css')
} else {
    require('vue-material/dist/theme/default.css')
}
require('./theme.css')

Vue.use(VueMaterial)
Vue.use(VueToastr2)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

var shared = {}
shared.install = () => {
    Object.defineProperty(Vue.prototype, '$appData', {
        get () { return global.AppData }
    })
}
Vue.use(shared)

Vue.component('MdSelect', Vue.options.components.MdSelect.extend({
    methods: {
        isInvalidValue: function isInvalidValue () {
            return this.$el.validity ? this.$el.validity.badInput : this.$el.querySelector('input').validity.badInput
        }
    }
}))
ipcRenderer.send('updateTitle', '')
AppData.tempStoreEventEmitter.on('debugElementOutline', (value) => {
    localStorage.debugElementOutline = value
    if (value) {        
        document.querySelector('html').setAttribute('outline', 'yes')
    } else {
        document.querySelector('html').setAttribute('outline', 'no')
    }
})
AppData.Set('debugElementOutline', localStorage.debugElementOutline == 'true' ? true : false)

document.body.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() == 'a' &&
        event.target.attributes.openExternal != undefined) {
            event.preventDefault()
            require('electron').shell.openExternal(event.target.href)
        }
})

function incrementUncaughtException() {
    if (AppData.Steamworks != undefined) {
        AppData.MetricManager.Increment('uncaughtException')
    }
}
process
.on('unhandledRejection', () => {incrementUncaughtException()})
.on('uncaughtException', () => {incrementUncaughtException()})

global.vueJS = new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
})
vueJS['$mount']('#app')