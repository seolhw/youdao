import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path:'',
          name:'index',
          component: ()=> import('@/views/index.vue')
        },
        {
          path:'history',
          name:'history',
          component: ()=> import('@/views/history.vue')
        },
        {
          path:'collect',
          name:'collect',
          component: ()=> import('@/views/collect.vue')
        }
      ]
    }
  ]
})
