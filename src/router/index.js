import Vue from 'vue'
import VueRouter from 'vue-router'
import Root from '../views/Root.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Root
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
