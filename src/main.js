/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:04
 * @LastEditTime: 2020-07-13 11:04:07
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\main.js
 */
import 'element-ui/lib/theme-chalk/index.css'
import './swiper.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueBus from 'vue-bus'

Vue.use(VueBus)
Vue.use(VueAwesomeSwiper)
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
