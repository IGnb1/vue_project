import Vue from 'vue'
import App from './App.vue'
import '@/styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/router.js'

router.beforeEach((to, from, next) => {
  // to and from are Route Object,next() must be called to resolve the hook}
  let mytoken = localStorage.getItem('vue_project_35_token')
  // console.log(to)
  if (mytoken || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
