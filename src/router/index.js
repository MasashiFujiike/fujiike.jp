import Vue from 'vue'
import VueRouter from 'vue-router'
import Root from '../views/Root.vue'
import ArticleDetail from '../views/ArticleDetail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Root
  },
  {
    path: '/article/:articleId',
    name: 'ArticleDetail',
    component: ArticleDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
