import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import VueMaterial  from 'vue-material'

Vue.use(VueMaterial)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

global.vueJS = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
})
vueJS.$mount('#app')