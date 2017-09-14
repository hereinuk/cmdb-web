// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './http'

import VueBlu from 'vue-blu'
import 'vue-blu/dist/css/vue-blu.min.css'
import './assets/css/pace-theme-flash.css'
import './assets/css/site.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'


Vue.use(VueBlu)
Vue.use(ElementUI)


Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
        App
    }
})
