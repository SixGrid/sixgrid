import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import VueMaterial  from 'vue-material'
import { MdField } from 'vue-material/dist/components'

Vue.use(VueMaterial)
Vue.use(MdField)
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