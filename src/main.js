// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

//引入 路由机制
import router from './router/router'

//引入 element ui
import './plugins/element.js'

//引入store
import store from './store/userStore'

//引入自定义公共方法
import global from './models/global.js'
Vue.prototype.global = global

//引入自定义Icon
import './assets/icon/iconfont.css'


import VueRouter from 'vue-router'
import Vuex from 'vuex'


Vue.use(VueRouter)
Vue.use(Vuex);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
