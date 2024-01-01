import './AppData'
import './LocalStorageParameter'

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import './theme.js'

import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import VueMaterial  from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

import * as packageJSON from '../../package.json'
console.log('pre snippets')
require('./snippets/main')
console.log('post snippets')

window.toastr = require('toastr')

Vue.use(VueMaterial)
Vue.use(VueToastr2)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

let shared = {}
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

global.vueJS = new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
})
vueJS['$mount']('#app')