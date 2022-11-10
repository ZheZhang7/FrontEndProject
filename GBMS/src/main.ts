import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import service from './service.js'
import echarts from 'echarts'

Vue.use(ElementUI)
Vue.prototype.axios = axios // 挂载到原型,可以在全局使用
Vue.prototype.service = service // 挂载到原型,可以在全局使用
Vue.prototype.$echarts = echarts 
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
