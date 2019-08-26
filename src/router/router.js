import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import welcome from '@/views/welcome.vue'
import users from '@/views/users.vue'
import rights from '@/views/rights/rights.vue'
import roles from '@/views/rights/roles.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: welcome
        },
        {
          name: 'users',
          path: 'users',
          component: users
        },
        {
          name: 'rights',
          path: 'rights',
          component: rights
        },
        {
          name: 'roles',
          path: 'roles',
          component: roles
        }
      ]
    }
  ]
})
