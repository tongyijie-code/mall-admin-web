import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/global.css'
import './libs/element'
//安装树状表格插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

//请求数据,两种方法
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.interceptors.request.use(config => {
//   config.headers.Authorizathion = window.sessionStorage.getItem('token')
//   return config
// })
Vue.prototype.$http = axios

//导入阿里巴巴图标样式
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
