import './AppData'

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
import 'vue-material/dist/theme/default-dark.css'

window.toastr = require('toastr')

document.title = `SixGrid v${packageJSON.version}`

Vue.use(VueMaterial)
Vue.use(VueToastr2)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


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
vueJS.$mount('#app')